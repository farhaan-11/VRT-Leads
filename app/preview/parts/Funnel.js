"use client";

import { percent } from "@/app/preview/format";

const BAR_COLOURS = ["#3538CD", "#5558D9", "#8098F9", "#A4BCFD"];

// The gap to the step above is the whole point of this picture, so it is
// printed rather than left for the reader to work out.
//
// The last step carries no note. Its gap is not loss: those people either
// said no or are still being worked on, and both are honest endings.
function lostAt(steps, index) {
  if (index === 0 || index === steps.length - 1) {
    return 0;
  }
  return steps[index - 1].value - steps[index].value;
}

function Row({ step, index, top, lost }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-40 shrink-0 text-[13px] text-[#475467]">{step.label}</span>
      <span className="w-8 shrink-0 text-right text-[14px] font-semibold tabular-nums text-[#0C111D]">
        {step.value}
      </span>

      <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#F2F4F7]">
        <span
          className="block h-2.5 rounded-full"
          style={{ width: `${percent(step.value, top)}%`, background: BAR_COLOURS[index] }}
        />
      </span>

      <span className="w-10 shrink-0 text-right text-[13px] tabular-nums text-[#667085]">
        {percent(step.value, top)}%
      </span>
      <span className="w-20 shrink-0 text-right text-[12px] text-[#D92D20]">
        {lost > 0 ? `${lost} lost` : ""}
      </span>
    </div>
  );
}

export default function Funnel({ steps }) {
  const top = steps[0].value;

  return (
    <div className="space-y-3">
      {steps.map((step, index) => (
        <Row key={step.label} step={step} index={index} top={top} lost={lostAt(steps, index)} />
      ))}
    </div>
  );
}
