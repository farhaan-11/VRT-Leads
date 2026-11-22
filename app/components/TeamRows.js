import { money, percent } from "@/app/components/format";
import { Avatar } from "@/app/components/ui";

// Three numbers and what they mean, in one line each. Overdue turns red only
// when there is something to be red about, so a clean column stays quiet.
function Count({ value, label, red }) {
  const colour = red && value > 0 ? "text-[#D92D20]" : "text-[#0C111D]";

  return (
    <span className="w-16 shrink-0 text-right">
      <span className={`block text-[14px] font-semibold tabular-nums ${colour}`}>{value}</span>
      <span className="block text-[11px] text-[#98A2B3]">{label}</span>
    </span>
  );
}

function Row({ person }) {
  return (
    <li className="flex items-center gap-3 border-t border-[#F2F4F7] py-2.5 first:border-t-0 first:pt-0">
      <Avatar name={person.name} />
      <span className="flex-1 truncate text-[13px] font-medium text-[#344054]">
        {person.name}
      </span>

      <Count value={person.open} label="open" />
      <Count value={person.overdue} label="overdue" red />
      <Count value={person.enrolled} label="enrolled" />
      <Count value={`${percent(person.enrolled, person.total)}%`} label="converts" />

      <span className="w-20 shrink-0 text-right text-[13px] tabular-nums text-[#344054]">
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
