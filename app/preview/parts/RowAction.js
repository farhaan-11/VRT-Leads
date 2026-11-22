"use client";

import { isOverdue } from "@/app/preview/demoData";
import { Button } from "@/app/preview/ui";

// One button per row, and which one depends on where that lead actually is.
// A row offering three choices makes the reader stop and pick; a row with
// one obvious next move gets done.
//
// An unowned lead comes first whatever its stage, because nobody can make a
// call on a lead that has no owner.
function actionFor(lead, isAdmin) {
  if (!lead.owner && isAdmin) {
    return { label: "Assign", look: "primary", kind: "assign" };
  }
  if (!lead.owner) {
    return { label: "Waiting", look: "ghost", kind: "" };
  }
  if (lead.stage === "new") {
    return { label: "Log first call", look: "primary", kind: "update" };
  }
  if (isOverdue(lead)) {
    return { label: "Follow up now", look: "danger", kind: "update" };
  }
  if (lead.stage === "follow_up") {
    return { label: "Log call", look: "quiet", kind: "update" };
  }
  return { label: "View", look: "ghost", kind: "history" };
}

export default function RowAction({ lead, isAdmin, onOpen }) {
  const action = actionFor(lead, isAdmin);

  if (!action.kind) {
    return <span className="text-[13px] text-[#98A2B3]">{action.label}</span>;
  }

  return (
    <Button look={action.look} onClick={() => onOpen(lead, action.kind)}>
      {action.label}
    </Button>
  );
}
