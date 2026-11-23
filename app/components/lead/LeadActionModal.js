"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { saveLeadStep } from "@/app/actions/leadActions";
import StepFields from "@/app/components/lead/StepFields";
import { Button } from "@/app/components/ui";

const EMPTY_STATE = { done: false, error: "", typed: {} };

// Follow-up first, because it is what happens after most calls. The other
// two end the lead, and ending something should take one deliberate click.
const STEPS = [
  { value: "follow_up", label: "Book a follow-up" },
  { value: "enrolled", label: "They enrolled" },
  { value: "rejected", label: "Not interested" },
];

function pillStyle(active) {
  const look = active
    ? "border-[#3538CD] bg-[#F5F6FF] text-[#3538CD]"
    : "border-[#E6E8EC] bg-white text-[#475467] hover:bg-[#F9FAFB]";

  return `cursor-pointer rounded-lg border px-3 py-1.5 text-[13px] font-medium transition ${look}`;
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
    <p className="rounded-lg border border-[#FDA29B] bg-[#FEF3F2] p-2.5 text-[13px] text-[#B42318]">
      {error}
    </p>
  );
}

function Buttons({ saving, onClose }) {
  return (
    <div className="flex justify-end gap-2 pt-1">
      <Button onClick={onClose}>Cancel</Button>

      <Button type="submit" look="primary" disabled={saving}>
        {saving ? "Saving..." : "Save update"}
      </Button>
    </div>
  );
}

// The modal closes itself once the write lands. Until then the Save button
// is disabled and says so, which is the only wait in this screen.
//
// router.refresh is the one that actually pulls the new rows in. The server
// action already calls revalidatePath, which drops the server cache, but the
// client router keeps its own copy until it is told to let go. Without this
// line the row under the modal reads as it did a second ago.
export default function LeadActionModal({ lead, today, onClose }) {
  const router = useRouter();
  const [step, setStep] = useState("follow_up");
  const [state, submit, saving] = useActionState(saveLeadStep, EMPTY_STATE);

  useEffect(() => {
    if (state.done) {
      router.refresh();
      onClose();
    }
  }, [state.done, onClose, router]);

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
