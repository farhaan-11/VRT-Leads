// Every colour, shape and small piece the preview shares. Written once here,
// so a button in a row and a button in a modal can never drift apart.

export const SURFACE = "rounded-xl border border-[#E6E8EC] bg-white";

export const LABEL =
  "text-[11px] font-semibold uppercase tracking-[0.07em] text-[#667085]";

const STAGE_LOOKS = {
  new: { label: "New", pill: "bg-[#F2F4F7] text-[#344054]", dot: "bg-[#98A2B3]" },
  follow_up: { label: "Follow-up", pill: "bg-[#FFFAEB] text-[#B54708]", dot: "bg-[#F79009]" },
  enrolled: { label: "Enrolled", pill: "bg-[#ECFDF3] text-[#067647]", dot: "bg-[#17B26A]" },
  rejected: { label: "Not interested", pill: "bg-[#FEF3F2] text-[#B42318]", dot: "bg-[#F04438]" },
};

export function stageLabel(stage) {
  return STAGE_LOOKS[stage].label;
}

// A dot and a word together. Colour on its own would leave a colour-blind
// reader guessing which pill means what.
export function StageBadge({ stage }) {
  const look = STAGE_LOOKS[stage];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${look.pill}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${look.dot}`} />
      {look.label}
    </span>
  );
}

const BUTTON_BASE =
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-[13px] font-medium transition disabled:cursor-not-allowed disabled:opacity-40";

const BUTTON_LOOKS = {
  primary: "bg-[#3538CD] text-white hover:bg-[#2D31A6]",
  danger: "bg-[#D92D20] text-white hover:bg-[#B42318]",
  quiet: "border border-[#D0D5DD] bg-white text-[#344054] hover:bg-[#F9FAFB]",
  ghost: "text-[#667085] hover:bg-[#F2F4F7]",
};

export function Button({ look = "quiet", className = "", ...rest }) {
  return (
    <button
      type="button"
      className={`${BUTTON_BASE} ${BUTTON_LOOKS[look]} ${className}`}
      {...rest}
    />
  );
}

const AVATAR_LOOKS = [
  "bg-[#E0E7FF] text-[#3538CD]",
  "bg-[#FCE7F3] text-[#9D174D]",
  "bg-[#D1FAE5] text-[#047857]",
  "bg-[#FEF0C7] text-[#B54708]",
];

// The same person keeps the same colour everywhere, because the colour comes
// from their name and not from where their row happens to sit.
function avatarLook(name) {
  let total = 0;

  for (const letter of name) {
    total += letter.charCodeAt(0);
  }
  return AVATAR_LOOKS[total % AVATAR_LOOKS.length];
}

function initialsOf(name) {
  const parts = name.split(" ");
  const second = parts[1] ? parts[1][0] : "";

  return (parts[0][0] + second).toUpperCase();
}

export function Avatar({ name }) {
  return (
    <span
      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${avatarLook(name)}`}
    >
      {initialsOf(name)}
    </span>
  );
}
