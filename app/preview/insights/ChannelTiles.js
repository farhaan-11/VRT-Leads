import { money, percent, sourceLabel } from "@/app/components/format";

// One in how many signed up. "1 in 2" is a thing a person can picture;
// "54%" is a thing they have to translate first.
function oneInEvery(channel) {
  if (channel.enrolled === 0) {
    return "none yet";
  }
  return `1 in ${Math.round(channel.total / channel.enrolled)}`;
}

// The whole bar is how many that channel brought, measured against the
// biggest channel. The filled part is how many of them signed.
//
// So one shape carries both halves of the question: a long bar with a short
// green tip is a channel that brings crowds and sells nothing.
function Bar({ channel, biggest }) {
  const width = percent(channel.total, biggest);
  const won = percent(channel.enrolled, channel.total);

  return (
    <span className="mt-1.5 block h-5 w-full">
      <span className="flex h-5 overflow-hidden rounded-md bg-[#D0D5DD]" style={{ width: `${width}%` }}>
        <span
          className="h-5 bg-gradient-to-r from-[#099250] to-[#17B26A]"
          style={{ width: `${won}%` }}
        />
      </span>
    </span>
  );
}

function Best() {
  return (
    <span className="rounded-full bg-[#ECFDF3] px-1.5 text-[10px] font-semibold uppercase tracking-wide text-[#067647]">
      best
    </span>
  );
}

function Tile({ channel, biggest, isBest }) {
  return (
    <li>
      <div className="flex items-baseline gap-2">
        <span className="text-[13px] font-semibold text-[#0C111D]">
          {sourceLabel(channel.source)}
        </span>
        {isBest ? <Best /> : null}
        <span className="text-[12px] text-[#98A2B3]">
          {channel.total} in, {channel.enrolled} signed - {oneInEvery(channel)}
        </span>
        <span className="ml-auto text-[13px] font-semibold tabular-nums text-[#0C111D]">
          {money(channel.revenue)}
        </span>
      </div>

      <Bar channel={channel} biggest={biggest} />
    </li>
  );
}

// The sentence most people will actually read. The best and the worst
// channel, in the words someone would use out loud.
export function ChannelHeadline({ channels }) {
  const sorted = [...channels].sort((a, b) => b.enrolled / b.total - a.enrolled / a.total);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];

  return (
    <span>
      <span className="font-semibold text-[#067647]">{sourceLabel(best.source)}</span> signs{" "}
      {oneInEvery(best)}.{" "}
      <span className="font-semibold text-[#344054]">{sourceLabel(worst.source)}</span> signs{" "}
      {oneInEvery(worst)}.
    </span>
  );
}

export default function ChannelTiles({ channels }) {
  const biggest = Math.max(...channels.map((one) => one.total));
  const bestRate = Math.max(...channels.map((one) => one.enrolled / one.total));

  return (
    <ul className="space-y-2.5">
      {channels.map((channel) => (
        <Tile
          key={channel.source}
          channel={channel}
          biggest={biggest}
          isBest={channel.enrolled / channel.total === bestRate}
        />
      ))}
    </ul>
  );
}
