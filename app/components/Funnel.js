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

function stepsFor(user, counts) {
  if (user.role === "admin") {
    return adminSteps(counts);
  }
  return salesSteps(counts);
}

// Every bar is read against the first step, so the top bar is always full.
function toPercent(value, top) {
  if (top === 0) {
    return 0;
  }
  return Math.round((value / top) * 100);
}

// The gap to the step above is the whole point of this picture, so it is
// printed rather than left for the reader to work out.
//
// The last step carries no note. Its gap is not loss: those people either
// said no or are still being worked on, and both are honest endings.
function lostNote(steps, index) {
  const isLastStep = index === steps.length - 1;

  if (index === 0 || isLastStep) {
    return "";
  }

  const lost = steps[index - 1].value - steps[index].value;
  if (lost <= 0) {
    return "";
  }
  return `${lost} lost here`;
}

// Plain CSS. Only the width changes from row to row, which is not enough
// work to bring a chart library into the build.
function Bar({ percent }) {
  return (
    <span className="h-3 flex-1 rounded bg-slate-100">
      <span
        className="block h-3 rounded bg-slate-800"
        style={{ width: `${percent}%` }}
      />
    </span>
  );
}

function FunnelRow({ label, value, percent, lost }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-44 shrink-0 text-slate-600">{label}</span>
      <span className="w-10 shrink-0 text-right font-semibold">{value}</span>
      <Bar percent={percent} />
      <span className="w-12 shrink-0 text-right text-slate-500">
        {percent}%
      </span>
      <span className="w-28 shrink-0 text-xs text-red-600">{lost}</span>
    </div>
  );
}

function FunnelRows({ steps }) {
  const top = steps[0].value;

  return steps.map((step, index) => (
    <FunnelRow
      key={step.label}
      label={step.label}
      value={step.value}
      percent={toPercent(step.value, top)}
      lost={lostNote(steps, index)}
    />
  ));
}

export default function Funnel({ user, counts }) {
  const steps = stepsFor(user, counts);

  return (
    <section className="space-y-2 rounded border border-slate-200 p-4">
      <h2 className="text-sm font-semibold">Where people drop out</h2>
      <FunnelRows steps={steps} />
    </section>
  );
}
