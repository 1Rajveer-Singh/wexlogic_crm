"use client";

import { useState } from "react";

type PieSlice = {
  name: string;
  value: number;
  color: string;
};

type PieChartProps = {
  data: PieSlice[];
};

const formatINR = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number
) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
}

export function PieChart({ data }: PieChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-zinc-500 text-sm">
        No data to display
      </div>
    );
  }

  const cx = 110;
  const cy = 110;
  const outerR = 90;
  const innerR = 50; // donut hole

  let startAngle = 0;
  const slices = data.map((slice, i) => {
    const angle = (slice.value / total) * 360;
    const path = describeArc(cx, cy, outerR, startAngle, startAngle + angle);
    // for inner donut: carve out center
    const innerStart = polarToCartesian(cx, cy, innerR, startAngle + angle);
    const innerEnd = polarToCartesian(cx, cy, innerR, startAngle);
    const largeArc = angle <= 180 ? "0" : "1";
    const donutPath = [
      `M ${polarToCartesian(cx, cy, outerR, startAngle).x} ${polarToCartesian(cx, cy, outerR, startAngle).y}`,
      `A ${outerR} ${outerR} 0 ${largeArc} 1 ${polarToCartesian(cx, cy, outerR, startAngle + angle).x} ${polarToCartesian(cx, cy, outerR, startAngle + angle).y}`,
      `L ${innerStart.x} ${innerStart.y}`,
      `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerEnd.x} ${innerEnd.y}`,
      "Z",
    ].join(" ");

    const midAngle = startAngle + angle / 2;
    const labelPos = polarToCartesian(cx, cy, (outerR + innerR) / 2, midAngle);
    const pct = ((slice.value / total) * 100).toFixed(1);

    const result = {
      ...slice,
      path: donutPath,
      midAngle,
      labelPos,
      pct,
      startAngle,
      endAngle: startAngle + angle,
      index: i,
    };
    startAngle += angle;
    return result;
  });

  const fmt = formatINR;
  const hovered = hoveredIndex !== null ? slices[hoveredIndex] : null;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <svg
          width={cx * 2}
          height={cy * 2}
          viewBox={`0 0 ${cx * 2} ${cy * 2}`}
          className="overflow-visible"
        >
          {slices.map((slice) => {
            const isHovered = hoveredIndex === slice.index;
            return (
              <path
                key={slice.index}
                d={slice.path}
                fill={slice.color}
                opacity={hoveredIndex === null || isHovered ? 1 : 0.55}
                stroke="#09090b"
                strokeWidth={2}
                className="cursor-pointer transition-all duration-200"
                style={{
                  transform: isHovered
                    ? `translate(${
                        Math.cos(((slice.midAngle - 90) * Math.PI) / 180) * 6
                      }px, ${
                        Math.sin(((slice.midAngle - 90) * Math.PI) / 180) * 6
                      }px)`
                    : "translate(0,0)",
                  filter: isHovered ? `drop-shadow(0 0 8px ${slice.color}80)` : "none",
                }}
                onMouseEnter={() => setHoveredIndex(slice.index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}

          {/* Center text */}
          <text
            x={cx}
            y={cy - 8}
            textAnchor="middle"
            fill="#f8fafc"
            fontSize="13"
            fontWeight="600"
            fontFamily="inherit"
          >
            {hovered ? hovered.name : "Total"}
          </text>
          <text
            x={cx}
            y={cy + 10}
            textAnchor="middle"
            fill="#a1a1aa"
            fontSize="11"
            fontFamily="inherit"
          >
            {hovered ? hovered.pct + "%" : fmt(total)}
          </text>
          {hovered && (
            <text
              x={cx}
              y={cy + 26}
              textAnchor="middle"
              fill="#71717a"
              fontSize="10"
              fontFamily="inherit"
            >
              {fmt(hovered.value)}
            </text>
          )}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
        {slices.map((slice) => (
          <div
            key={slice.index}
            className="flex items-center gap-2 cursor-pointer"
            onMouseEnter={() => setHoveredIndex(slice.index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <span
              className="h-3 w-3 rounded-full shrink-0"
              style={{ backgroundColor: slice.color }}
            />
            <span className="text-xs text-zinc-400 font-medium">
              {slice.name}
            </span>
            <span className="text-xs text-zinc-500">({slice.pct}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}
