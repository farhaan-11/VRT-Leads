import { money, percent } from "@/app/components/format";
import { Avatar } from "@/app/components/ui";

// Each number gets its own tinted block. Four bare figures in a row read as
// one long number; four blocks read as four answers.
//
// Overdue only turns red when there is something to be red about, so a clean
// column stays quiet instead of crying wolf.
function toneFor(kind, value) {
  if (kind === "overdue") {
    return value > 0 ? "bg-[#FEF3F2] text-[#B42318]" : "bg-[#F9FAFB] text-[#98A2B3]";
  }
  if (kind === "enrolled") {
    return "bg-[#ECFDF3] text-[#067647]";
  }
  if (kind === "converts") {
    return "bg-[#F5F6FF] text-[#3538CD]";
  }
  return "bg-[#F9FAFB] text-[#344054]";
}

function Count({ value, label, kind }) {
  return (
    <span className={`w-[76px] shrink-0 rounded-lg px-2 py-1.5 text-center ${toneFor(kind, value)}`}>
      <span className="block text-[15px] font-semibold leading-tight tabular-nums">{value}</span>
      <span className="block text-[10px] uppercase tracking-wide opacity-75">{label}</span>
    </span>
  );
}

function Row({ person }) {
  return (
    <li className="flex items-center gap-2.5 border-t border-[#F2F4F7] py-2.5 first:border-t-0 first:pt-0">
      <Avatar name={person.name} />
      <span className="flex-1 truncate text-[14px] font-medium text-[#0C111D]">
        {person.name}
      </span>

      <Count value={person.open} label="open" kind="open" />
      <Count value={person.overdue} label="overdue" kind="overdue" />
      <Count value={person.enrolled} label="enrolled" kind="enrolled" />
      <Count value={`${percent(person.enrolled, person.total)}%`} label="converts" kind="converts" />

      <span className="w-20 shrink-0 text-right text-[14px] font-semibold tabular-nums text-[#0C111D]">
        {money(person.revenue)}
      </span>
    </li>
  );
}

export default function TeamRows({ team }) {
  return (
    <ul>
      {team.map((person) => (
        <Row key={person.id} person={person} />
      ))}
    </ul>
  );
}
