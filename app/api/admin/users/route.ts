import { NextResponse } from "next/server";
import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { isValidRole, getCurrentUserRole, getUserDisplayName, type CrmRole } from "@/utils/auth";
import { logAuditAction } from "@/lib/crm-db";

// GET /api/admin/users - List CRM users (Admin & Manager)
export async function GET() {
  const caller = await currentUser();
  if (!caller) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const callerRole = await getCurrentUserRole();
  if (callerRole !== "admin" && callerRole !== "manager") {
    return NextResponse.json(
      { error: "Forbidden: Elevated privileges required" },
      { status: 403 }
    );
  }

  try {
    const client = await clerkClient();
    const { data: users } = await client.users.getUserList({
      limit: 100,
      orderBy: "-created_at",
    });

    const sanitized = users.map((u) => ({
      id: u.id,
      firstName: u.firstName ?? "",
      lastName: u.lastName ?? "",
      fullName:
        `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() ||
        u.emailAddresses[0]?.emailAddress ||
        "Unnamed",
      email: u.emailAddresses[0]?.emailAddress ?? "",
      role: (u.publicMetadata?.role as CrmRole) || "employee",
      createdAt: u.createdAt,
      lastSignInAt: u.lastSignInAt,
    }));

    return NextResponse.json({ users: sanitized });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST /api/admin/users - Create a new CRM user (Admin & Manager)
export async function POST(request: Request) {
  const caller = await currentUser();
  if (!caller) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const callerRole = await getCurrentUserRole();
  if (callerRole !== "admin" && callerRole !== "manager") {
    return NextResponse.json(
      { error: "Forbidden: Elevated privileges required" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { firstName, lastName, email, role, password } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required" },
        { status: 400 }
      );
    }

    if (!isValidRole(role)) {
      return NextResponse.json(
        {
          error:
            "Invalid role. Allowed roles: admin, manager, sales, employee, viewer",
        },
        { status: 400 }
      );
    }

    // Managers cannot create Admin or Manager accounts
    if (callerRole === "manager" && (role === "admin" || role === "manager")) {
      return NextResponse.json(
        { error: "Forbidden: Managers can only onboard Employee or Sales staff" },
        { status: 403 }
      );
    }

    if (password && (typeof password !== "string" || password.length < 8)) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    const client = await clerkClient();
    const createdUser = await client.users.createUser({
      emailAddress: [email],
      firstName: firstName ? String(firstName).trim() : undefined,
      lastName: lastName ? String(lastName).trim() : undefined,
      password: password || undefined,
      publicMetadata: {
        role,
      },
    });

    // Record audit trail of user creation
    await logAuditAction(
      "create",
      "user",
      createdUser.id,
      null,
      {
        email,
        role,
        fullName: `${firstName ?? ""} ${lastName ?? ""}`.trim() || email,
      },
      {
        id: caller.id,
        email: caller.emailAddresses[0]?.emailAddress,
        name: getUserDisplayName(caller),
      }
    );

    return NextResponse.json(
      {
        success: true,
        user: {
          id: createdUser.id,
          email,
          role,
          firstName: createdUser.firstName,
          lastName: createdUser.lastName,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error creating user:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create user";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

// PATCH /api/admin/users - Update a user's role (Admin only)
export async function PATCH(request: Request) {
  const caller = await currentUser();
  if (!caller) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const callerRole = await getCurrentUserRole();
  if (callerRole !== "admin") {
    return NextResponse.json(
      { error: "Forbidden: Only admins can update user roles" },
      { status: 403 }
    );
  }

  try {
    const { userId, role } = await request.json();

    if (!userId || typeof userId !== "string") {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    if (!isValidRole(role)) {
      return NextResponse.json(
        { error: "Invalid role. Allowed: admin, manager, sales, employee, viewer" },
        { status: 400 }
      );
    }

    const client = await clerkClient();
    const targetUser = await client.users.getUser(userId);
    const prevRole = (targetUser.publicMetadata?.role as string) || "employee";

    await client.users.updateUserMetadata(userId, {
      publicMetadata: { role },
    });

    // Log the role change to the audit trail
    await logAuditAction(
      "update",
      "user_role",
      userId,
      {
        role: prevRole,
        email: targetUser.emailAddresses[0]?.emailAddress,
      },
      {
        role,
        email: targetUser.emailAddresses[0]?.emailAddress,
      },
      {
        id: caller.id,
        email: caller.emailAddresses[0]?.emailAddress,
        name: getUserDisplayName(caller),
      }
    );

    return NextResponse.json({ success: true, role });
  } catch (error: unknown) {
    console.error("Error updating user role:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update user role";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE /api/admin/users - Revoke/delete a CRM user (Admin only)
export async function DELETE(request: Request) {
  const caller = await currentUser();
  if (!caller) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const callerRole = await getCurrentUserRole();
  if (callerRole !== "admin") {
    return NextResponse.json(
      { error: "Forbidden: Only admins can delete CRM users" },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Protect against self-deletion
    if (userId === caller.id) {
      return NextResponse.json(
        { error: "You cannot delete your own admin account" },
        { status: 400 }
      );
    }

    const client = await clerkClient();
    const targetUser = await client.users.getUser(userId);
    const userEmail = targetUser.emailAddresses[0]?.emailAddress || "Unknown";

    await client.users.deleteUser(userId);

    // Record revocation in audit log
    await logAuditAction(
      "delete",
      "user",
      userId,
      { id: userId, email: userEmail, role: targetUser.publicMetadata?.role },
      null,
      {
        id: caller.id,
        email: caller.emailAddresses[0]?.emailAddress,
        name: getUserDisplayName(caller),
      }
    );

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error deleting user:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete user";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
