"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/app/components/ui";
import LeadActionModal from "@/app/components/lead/LeadActionModal";
import LeadHistoryModal from "@/app/components/lead/LeadHistoryModal";

const STAGE_LABELS = {
  new: "New",
  follow_up: "Follow-up",
  enrolled: "Enrolled",
  rejected: "Rejected",
};

const BADGE_STYLES = {
  new: "bg-slate-100 text-slate-700",
  follow_up: "bg-amber-100 text-amber-800",
  enrolled: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

// The table shows this in its stage column too, so the word and the colour
// are written once and cannot drift apart.
export function StageBadge({ stage }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${BADGE_STYLES[stage]}`}
    >
      {STAGE_LABELS[stage]}
    </span>
  );
}

function useEscapeKey(onClose) {
  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);
}

// The name, the stage and the email. Everything else about this lead is in
// the row behind the modal, and saying it twice only makes the box longer.
function ModalHeader({ lead, onClose }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold">
            {lead.first_name} {lead.last_name}
          </p>
          <StageBadge stage={lead.stage} />
        </div>
        <p className="mt-1 text-xs text-slate-500">{lead.email}</p>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="px-2 text-xl leading-none text-slate-400 hover:text-slate-700"
      >
        ×
      </button>
    </div>
  );
}

// Escape, the × and a click anywhere outside all close it. One piece of
// state holds it open, so opening costs no trip to the server and a second
// click has nothing left to do.
function ModalShell({ lead, onClose, children }) {
  useEscapeKey(onClose);

  return (
    <div className="fixed inset-0 z-30 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 sm:items-center">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="fixed inset-0 cursor-default"
      />

      <div className="relative w-full max-w-lg rounded-lg bg-white p-5 text-slate-900 shadow-xl">
        <ModalHeader lead={lead} onClose={onClose} />
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

// The name opens the history, but only once there is one. A lead nobody has
// spoken to yet has nothing to show, so its name stays plain text instead of
// a button that opens an empty box.
export function LeadName({ lead, notes }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const fullName = `${lead.first_name} ${lead.last_name}`;

  if (notes.length === 0) {
    return (
      <span className="block truncate text-[14px] font-medium text-[#0C111D]">{fullName}</span>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block max-w-full truncate text-left text-[14px] font-medium text-[#0C111D] hover:text-[#3538CD]"
      >
        {fullName}
      </button>

      {open ? (
        <ModalShell lead={lead} onClose={close}>
          <LeadHistoryModal lead={lead} notes={notes} />
        </ModalShell>
      ) : null}
    </>
  );
}

// A closed lead takes no more updates, so it gets no button at all.
export function LeadUpdateButton({ lead, today }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  if (lead.stage !== "new" && lead.stage !== "follow_up") {
    return null;
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>Update</Button>

      {open ? (
        <ModalShell lead={lead} onClose={close}>
          <LeadActionModal lead={lead} today={today} onClose={close} />
        </ModalShell>
      ) : null}
    </>
  );
}
