"use client";

import { useEffect } from "react";
import { StageBadge } from "@/app/preview/ui";

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

function Head({ lead, title, onClose }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[#F2F4F7] px-5 py-4">
      <div>
        <div className="flex items-center gap-2">
          <p className="text-[16px] font-semibold text-[#0C111D]">{lead.name}</p>
          <StageBadge stage={lead.stage} />
        </div>
        <p className="mt-0.5 text-[13px] text-[#667085]">
          {lead.company} - {title}
        </p>
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

export default function ModalShell({ lead, title, onClose, children }) {
  useEscapeKey(onClose);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-[#0C111D]/50"
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <Head lead={lead} title={title} onClose={onClose} />
        {children}
      </div>
    </div>
  );
}
