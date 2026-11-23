"use client";

import { useEffect } from "react";
import { Avatar, StageBadge } from "@/app/components/ui";

// Escape, the cross and a click outside all close it. Three ways out,
// because a box with one small cross traps a reader who missed it.
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

// The avatar, the name, the stage and one line saying what this box is for.
// Everything else about the lead is in the row behind it, and saying it twice
// only makes the box longer.
function Head({ lead, title, onClose }) {
  const fullName = `${lead.first_name} ${lead.last_name}`;

  return (
    <div className="flex items-start justify-between gap-4 border-b border-[#F2F4F7] px-6 py-5">
      <div className="flex items-start gap-3">
        <Avatar name={fullName} />
        <div>
          <div className="flex items-center gap-2">
            <p className="text-[18px] font-semibold text-[#0C111D]">{fullName}</p>
            <StageBadge stage={lead.stage} />
          </div>
          <p className="mt-0.5 text-[13px] text-[#667085]">
            {lead.company || lead.email} - {title}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="rounded-lg px-2 text-xl leading-none text-[#98A2B3] hover:bg-[#F2F4F7]"
      >
        &times;
      </button>
    </div>
  );
}

export default function LeadModal({ lead, title, onClose, children }) {
  useEscapeKey(onClose);

  // text-left is said out loud here. The button that opens this box sits in
  // a right-aligned cell, and the box is still inside that cell in the page,
  // so without this every line inside it would line up on the right.
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 text-left">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-[#0C111D]/60 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white text-[#0C111D] shadow-2xl">
        <Head lead={lead} title={title} onClose={onClose} />
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
