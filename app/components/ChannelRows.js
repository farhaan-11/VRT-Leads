import { money, percent, sourceLabel } from "@/app/components/format";

// The bar is the conversion rate, not the number of enquiries. A channel
// that brings a hundred people and signs none of them should not be the
// longest bar on the screen.
//
// The colour comes from the rate too, so a weak channel looks weak before
// anybody reads a single digit.
function rateLook(rate) {
  if (rate >= 40) {
    return { bar: "bg-[#17B26A]", text: "text-[#067647]" };
  }
  if (rate >= 20) {
    return { bar: "bg-[#F79009]", text: "text-[#B54708]" };
  }
  return { bar: "bg-[#98A2B3]", text: "text-[#667085]" };
}

function Row({ channel }) {
  const rate = percent(channel.enrolled, channel.total);
  const look = rateLook(rate);

  return (
    <li className="flex items-center gap-3">
      <span className="w-20 shrink-0 text-[13px] font-medium text-[#344054]">
        {sourceLabel(channel.source)}
      </span>
      <span className="w-20 shrink-0 text-[12px] tabular-nums text-[#98A2B3]">
        {channel.total} in, {channel.enrolled} won
      </span>

      <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#F2F4F7]">
        <span className={`block h-2.5 rounded-full ${look.bar}`} style={{ width: `${rate}%` }} />
      </span>

      <span className={`w-10 shrink-0 text-right text-[14px] font-semibold tabular-nums ${look.text}`}>
        {rate}%
      </span>
      <span className="w-20 shrink-0 text-right text-[13px] tabular-nums text-[#344054]">
        {money(channel.revenue)}
      </span>
    </li>
  );
}

export default function ChannelRows({ channels }) {
  if (channels.length === 0) {
    return <p className="text-[13px] text-[#667085]">No enquiries yet.</p>;
  }

  return (
    <ul className="space-y-4">
      {channels.map((channel) => (
        <Row key={channel.source} channel={channel} />
      ))}
    </ul>
  );
}
