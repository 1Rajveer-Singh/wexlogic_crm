import Image from "next/image";
import Link from "next/link";

interface WexLogicLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  href?: string;
  showSubtitle?: boolean;
}

export function WexLogicLogo({
  className = "",
  size = "md",
  href,
  showSubtitle = true,
}: WexLogicLogoProps) {
  const sizeMap = {
    sm: { imgSize: 32, imgClass: "h-8 w-8", text: "text-xl", sub: "text-[9px]" },
    md: { imgSize: 42, imgClass: "h-10 w-10", text: "text-2xl", sub: "text-[10px]" },
    lg: { imgSize: 52, imgClass: "h-12 w-12", text: "text-3xl", sub: "text-xs" },
    xl: { imgSize: 64, imgClass: "h-16 w-16", text: "text-4xl", sub: "text-sm" },
  };

  const { imgSize, imgClass, text, sub } = sizeMap[size];

  const content = (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Official Golden Image Logo from /image.png */}
      <div className={`relative shrink-0 ${imgClass} flex items-center justify-center`}>
        <Image
          src="/image.png"
          alt="WexLogic Logo"
          width={imgSize}
          height={imgSize}
          className="object-contain w-full h-full drop-shadow-[0_2px_4px_rgba(217,119,6,0.3)]"
          priority
        />
      </div>

      {/* Company Name in Golden Color & Subtitle */}
      <div className="flex flex-col leading-tight justify-center">
        <span
          className={`${text} font-black tracking-tight font-display bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#B45309] bg-clip-text text-transparent`}
        >
          WEXLOGIC
        </span>
        {showSubtitle && (
          <span
            className={`${sub} font-black uppercase tracking-widest text-[#B45309]/90`}
          >
            Business Systems
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block transition-transform hover:scale-[1.02] active:scale-[0.98]">
        {content}
      </Link>
    );
  }

  return content;
}
