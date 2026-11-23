// A small shape library for icons. Each shape is only the path contents of an
// SVG, so the wrapping Icon owns the box, the stroke and the colour, and a
// caller cannot drift away from the shared look.

function InboxShape() {
  return (
    <>
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </>
  );
}

function UserXShape() {
  return (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <line x1="17" y1="8" x2="23" y2="14" />
      <line x1="23" y1="8" x2="17" y2="14" />
    </>
  );
}

function ClockShape() {
  return (
    <>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </>
  );
}

function BriefcaseShape() {
  return (
    <>
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </>
  );
}

function CheckCircleShape() {
  return (
    <>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </>
  );
}

function DollarShape() {
  return (
    <>
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </>
  );
}

const SHAPES = {
  inbox: InboxShape,
  userX: UserXShape,
  clock: ClockShape,
  briefcase: BriefcaseShape,
  check: CheckCircleShape,
  dollar: DollarShape,
};

export function Icon({ name, className = "h-4 w-4" }) {
  const Shape = SHAPES[name];

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <Shape />
    </svg>
  );
}
