import { percent } from "@/app/components/format";

function adminSteps(counts) {
  return [
    { label: "Enquiries received", value: counts.received },
    { label: "Assigned to someone", value: counts.assigned },
    { label: "Contacted", value: counts.contacted },
    { label: "Enrolled", value: counts.enrolled },
  ];
}

// A sales person's funnel starts at their own leads. Rows nobody handed them
// are not theirs to count, so a "received" step would be a borrowed number.
function salesSteps(counts) {
  return [
    { label: "Assigned to me", value: counts.assigned },
    { label: "Contacted", value: counts.contacted },
    { label: "Enrolled", value: counts.enrolled },
  ];
}

// The last step carries no loss. Its gap is not people slipping away: they
// either said no or are still being worked on, and both are honest endings.
function lostAt(steps, index) {
  if (index === 0 || index === steps.length - 1) {
    return 0;
  }
  return steps[index - 1].value - steps[index].value;
}

// A thick block, not a hairline. At this width a 12px bar reads as a stray
// rule across the panel; at 32px it reads as a quantity.
//
// The count sits inside the filled part, so the eye lands on the bar and the
// number in one stop instead of travelling to the edge of the panel.
function Bar({ value, kept, lost }) {
  return (
    <span className="flex h-8 flex-1 overflow-hidden rounded-lg bg-[#F2F4F7]">
      <span
        className="flex h-8 items-center justify-end bg-gradient-to-r from-[#3538CD] to-[#6172F3] pr-2.5 text-[13px] font-semibold text-white"
        style={{ width: `${kept}%` }}
      >
        {value}
      </span>
      <span className="h-8 bg-[#FECDCA]" style={{ width: `${lost}%` }} />
    </span>
  );
}

function Row({ step, top, lost }) {
  return (
    <li className="flex items-center gap-3">
      <span className="w-40 shrink-0 text-[13px] text-[#475467]">{step.label}</span>

      <Bar value={step.value} kept={percent(step.value, top)} lost={percent(lost, top)} />

      <span className="w-10 shrink-0 text-right text-[13px] font-medium tabular-nums text-[#475467]">
        {percent(step.value, top)}%
      </span>
      <span className="w-14 shrink-0 text-right text-[12px] font-semibold text-[#D92D20]">
        {lost > 0 ? `-${lost}` : ""}
      </span>
    </li>
  );
}

export default function Funnel({ user, counts }) {
  const steps = user.role === "admin" ? adminSteps(counts) : salesSteps(counts);
  const top = steps[0].value;

  return (
    <ul className="space-y-3">
      {steps.map((step, index) => (
        <Row key={step.label} step={step} top={top} lost={lostAt(steps, index)} />
      ))}
    </ul>
  );
}
