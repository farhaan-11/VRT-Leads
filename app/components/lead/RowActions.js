"use client";

import { useCallback, useState } from "react";
import { Button } from "@/app/components/ui";
import LeadModal from "@/app/components/lead/LeadModal";
import LeadActionModal from "@/app/components/lead/LeadActionModal";
import LeadHistoryModal from "@/app/components/lead/LeadHistoryModal";
import AssignModal from "@/app/components/lead/AssignModal";

const TITLES = {
  assign: "give this lead an owner",
  update: "what happened on the call",
  history: "everything so far",
};

// A lead still being worked on. Which words the button carries depends on
// how late it is, because "Log call" and "Follow up now" ask for the same
// thing but only one of them says it is already overdue.
function openAction(lead, late) {
  if (lead.stage === "new") {
    return { label: "Log first call", look: "primary", kind: "update" };
  }
  if (late) {
    return { label: "Follow up now", look: "danger", kind: "update" };
  }
  return { label: "Log call", look: "quiet", kind: "update" };
}

// One button per row. A row offering three choices makes the reader stop and
// pick; a row with one obvious next move gets done.
//
// An unowned lead comes first whatever its stage, because nobody can make a
// call on a lead that has no owner yet.
function actionFor(lead, isAdmin, late) {
  if (!lead.owner_name && isAdmin) {
    return { label: "Assign", look: "primary", kind: "assign" };
  }
  if (!lead.owner_name) {
    return { label: "Waiting", look: "ghost", kind: "" };
  }
  if (lead.stage === "new" || lead.stage === "follow_up") {
    return openAction(lead, late);
  }
  return { label: "View", look: "quiet", kind: "history" };
}

// One box, three insides. Which one opens is decided by the button that was
// clicked, so the reader always lands on the thing they asked for.
function Body({ kind, lead, notes, owners, today, onClose }) {
  if (kind === "assign") {
    return <AssignModal lead={lead} owners={owners} onClose={onClose} />;
  }
  if (kind === "update") {
    return <LeadActionModal lead={lead} today={today} onClose={onClose} />;
  }
  return <LeadHistoryModal lead={lead} notes={notes} />;
}

export function RowAction({ lead, notes, owners, isAdmin, today, late }) {
  const [kind, setKind] = useState("");
  const close = useCallback(() => setKind(""), []);
  const action = actionFor(lead, isAdmin, late);

  if (!action.kind) {
    return <span className="text-[13px] text-[#98A2B3]">{action.label}</span>;
  }

  return (
    <>
      <Button look={action.look} onClick={() => setKind(action.kind)}>
        {action.label}
      </Button>

      {kind ? (
        <LeadModal lead={lead} title={TITLES[kind]} onClose={close}>
          <Body
            kind={kind}
            lead={lead}
            notes={notes}
            owners={owners}
            today={today}
            onClose={close}
          />
        </LeadModal>
      ) : null}
    </>
  );
}

// The name opens the history, but only once there is one. A lead nobody has
// spoken to yet has nothing to show, so its name stays plain text instead of
// a button that opens an empty box.
export function LeadName({ lead, notes }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const fullName = `${lead.first_name} ${lead.last_name}`;
  const look = "block max-w-full truncate text-[14px] font-medium text-[#0C111D]";

  if (notes.length === 0) {
    return <span className={look}>{fullName}</span>;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`${look} text-left hover:text-[#3538CD]`}
      >
        {fullName}
      </button>

      {open ? (
        <LeadModal lead={lead} title={TITLES.history} onClose={close}>
          <LeadHistoryModal lead={lead} notes={notes} />
        </LeadModal>
      ) : null}
    </>
  );
}
