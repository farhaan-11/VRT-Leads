"use client";

import ModalShell from "@/app/preview/parts/ModalShell";
import AssignBody from "@/app/preview/parts/AssignBody";
import UpdateBody from "@/app/preview/parts/UpdateBody";
import HistoryBody from "@/app/preview/parts/HistoryBody";

const TITLES = {
  assign: "give this lead an owner",
  update: "what happened on the call",
  history: "everything so far",
};

// One box, three insides. Which one opens is decided by the row's button,
// so the reader always lands on the thing they clicked.
export default function ActionModal({ lead, kind, leads, onSave, onClose }) {
  return (
    <ModalShell lead={lead} title={TITLES[kind]} onClose={onClose}>
      {kind === "assign" ? <AssignBody leads={leads} onSave={onSave} onClose={onClose} /> : null}
      {kind === "update" ? <UpdateBody onSave={onSave} onClose={onClose} /> : null}
      {kind === "history" ? <HistoryBody lead={lead} onClose={onClose} /> : null}
    </ModalShell>
  );
}
