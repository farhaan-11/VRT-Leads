"use client";

const CHOICES = [
  { id: "none", label: "Normal" },
  { id: "busy", label: "Loading" },
  { id: "error", label: "Error" },
  { id: "empty", label: "No data" },
];

// Preview only. The real dashboard has no such strip - it is here so the
// owner can see the loading, error and empty screens without having to break
// the database on purpose.
export default function DemoStrip({ force, onPick }) {
  return (
    <div className="flex h-8 shrink-0 items-center gap-2 border-b border-dashed border-[#EAAA08] bg-[#FFFAEB] px-4">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-[#B54708]">
        Preview only
      </span>
      <span className="text-[11px] text-[#B54708]">see each screen state:</span>

      {CHOICES.map((choice) => (
        <button
          key={choice.id}
          type="button"
          onClick={() => onPick(choice.id)}
          className={`rounded px-2 py-0.5 text-[11px] font-medium ${
            force === choice.id
              ? "bg-[#B54708] text-white"
              : "text-[#B54708] hover:bg-[#FEF0C7]"
          }`}
        >
          {choice.label}
        </button>
      ))}
    </div>
  );
}
