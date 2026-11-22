"use client";

import { useActionState, useEffect, useState } from "react";
import { saveLeadStep } from "@/app/actions/leadActions";
import StepFields from "@/app/components/lead/StepFields";

const EMPTY_STATE = { done: false, error: "", typed: {} };

// Follow-up first, because it is what happens after most calls. The other
// two end the lead, and ending something should take one deliberate click.
const STEPS = [
  { value: "follow_up", label: "Follow-up" },
  { value: "enrolled", label: "Enrolled" },
  { value: "rejected", label: "Rejected" },
];

function pillStyle(active) {
  const look = active
    ? "border-slate-900 bg-slate-900 text-white"
    : "border-slate-300 bg-white text-slate-600 hover:border-slate-400";

  return `cursor-pointer rounded-full border px-4 py-1.5 text-sm transition-colors ${look}`;
}

// The radio itself is hidden and the label is the button. The form still
// posts "step", and the keyboard still moves between the three.
function StepPills({ step, onPick }) {
  return (
    <div className="flex flex-wrap gap-2">
      {STEPS.map((one) => (
        <label key={one.value} className={pillStyle(step === one.value)}>
          <input
            type="radio"
            name="step"
            value={one.value}
            checked={step === one.value}
            onChange={() => onPick(one.value)}
            className="sr-only"
          />
          {one.label}
        </label>
      ))}
    </div>
  );
}

function Problem({ error }) {
  if (!error) {
    return null;
  }

  return (
    <p className="rounded border border-red-300 bg-red-50 p-2 text-sm text-red-700">
      {error}
    </p>
  );
}

function Buttons({ saving, onClose }) {
  return (
    <div className="flex justify-end gap-2 pt-1">
      <button
        type="button"
        onClick={onClose}
        className="rounded border border-slate-300 px-4 py-2 text-sm hover:border-slate-500"
      >
        Cancel
      </button>

      <button
        type="submit"
        disabled={saving}
        className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}

// The modal closes itself once the write lands. Until then the Save button
// is disabled and says so, which is the only wait in this screen.
export default function LeadActionModal({ lead, today, onClose }) {
  const [step, setStep] = useState("follow_up");
  const [state, submit, saving] = useActionState(saveLeadStep, EMPTY_STATE);

  useEffect(() => {
    if (state.done) {
      onClose();
    }
  }, [state.done, onClose]);

  return (
    <form action={submit} className="space-y-4">
      <input type="hidden" name="enquiryId" value={lead.id} />

      <StepPills step={step} onPick={setStep} />
      <Problem error={state.error} />
      <StepFields step={step} typed={state.typed} today={today} />
      <Buttons saving={saving} onClose={onClose} />
    </form>
  );
}
