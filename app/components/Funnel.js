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

// The drop sits inside the bar, in pale red, right where it happened. Written
// only as "8 lost" off to the side it has to be read; drawn here it is seen.
//
// Dark plus pale together reach the step above, so each bar also shows the
// line it failed to hold.
function Bar({ kept, lost }) {
  return (
    <span className="flex h-3 flex-1 overflow-hidden rounded-full bg-[#F2F4F7]">
      <span className="h-3 bg-[#3538CD]" style={{ width: `${kept}%` }} />
      <span className="h-3 bg-[#FECDCA]" style={{ width: `${lost}%` }} />
    </span>
  );
}

function Row({ step, top, lost }) {
  return (
    <li className="flex items-center gap-3">
      <span className="w-40 shrink-0 text-[13px] text-[#475467]">{step.label}</span>
      <span className="w-8 shrink-0 text-right text-[15px] font-semibold tabular-nums text-[#0C111D]">
        {step.value}
      </span>

      <Bar kept={percent(step.value, top)} lost={percent(lost, top)} />

      <span className="w-10 shrink-0 text-right text-[13px] tabular-nums text-[#667085]">
        {percent(step.value, top)}%
      </span>
      <span className="w-14 shrink-0 text-right text-[12px] font-medium text-[#D92D20]">
        {lost > 0 ? `-${lost}` : ""}
      </span>
    </li>
  );
}

export default function Funnel({ user, counts }) {
  const steps = user.role === "admin" ? adminSteps(counts) : salesSteps(counts);
  const top = steps[0].value;

  return (
    <ul className="space-y-4">
      {steps.map((step, index) => (
        <Row key={step.label} step={step} top={top} lost={lostAt(steps, index)} />
      ))}
    </ul>
  );
}
