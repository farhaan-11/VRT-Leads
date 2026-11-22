"use client";

import { percent } from "@/app/preview/format";

const RADIUS = 60;
const AROUND = 2 * Math.PI * RADIUS;

// Each slice is one circle with a long gap in its dashed line, pushed round
// the ring by the slices before it. Plain SVG, so no chart library is needed
// for a picture this simple.
function slicesFrom(parts, total) {
  let used = 0;

  return parts.map((part) => {
    const length = total === 0 ? 0 : (part.value / total) * AROUND;
    const slice = { ...part, length, offset: -used };

    used += length;
    return slice;
  });
}

function Ring({ slices }) {
  return (
    <svg viewBox="0 0 160 160" className="h-40 w-40 -rotate-90">
      <circle cx="80" cy="80" r={RADIUS} fill="none" stroke="#F2F4F7" strokeWidth="18" />
      {slices.map((slice) => (
        <circle
          key={slice.label}
          cx="80"
          cy="80"
          r={RADIUS}
          fill="none"
          stroke={slice.colour}
          strokeWidth="18"
          strokeDasharray={`${slice.length} ${AROUND - slice.length}`}
          strokeDashoffset={slice.offset}
        />
      ))}
    </svg>
  );
}

function Middle({ total }) {
  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
      <span className="text-[26px] font-semibold leading-none text-[#0C111D]">{total}</span>
      <span className="text-[11px] text-[#667085]">enquiries</span>
    </div>
  );
}

function Legend({ parts, total }) {
  return (
    <ul className="space-y-2">
      {parts.map((part) => (
        <li key={part.label} className="flex items-center gap-2 text-[13px]">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: part.colour }} />
          <span className="flex-1 text-[#475467]">{part.label}</span>
          <span className="font-medium tabular-nums text-[#0C111D]">{part.value}</span>
          <span className="w-9 text-right tabular-nums text-[#98A2B3]">
            {percent(part.value, total)}%
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function Donut({ parts }) {
  const total = parts.reduce((sum, part) => sum + part.value, 0);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Ring slices={slicesFrom(parts, total)} />
        <Middle total={total} />
      </div>
      <div className="w-full">
        <Legend parts={parts} total={total} />
      </div>
    </div>
  );
}
