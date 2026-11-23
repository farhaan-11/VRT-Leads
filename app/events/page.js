import EnquiryForm from "@/app/components/EnquiryForm";
import { EVENTS } from "@/lib/events";
import { Tag, DateBadge } from "@/app/components/ui";

// The layout above reads a cookie, so nothing here is built at deploy time.
// Saying this out loud stops the whole build from failing on a dynamic read.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Events - VRT Management Group",
  description:
    "VEGA by VRT: invite-reviewed sessions for US business owners doing $2M to $50M in revenue",
};

const FAQS = [
  {
    question: "Is there a cost?",
    answer: "Public events are free. The VEGA cohort is paid, and pricing is shared on the intro call.",
  },
  { question: "Who can attend?", answer: "Established owners only. We review every registration." },
  { question: "Can I bring my co-founder or COO?", answer: "Yes — one co-founder per owner, free." },
];

function EventCard({ event }) {
  return (
    <article className="flex gap-4 rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <DateBadge month={event.month} day={event.day} />
      <div className="flex-1 space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {event.tags.map((tag) => <Tag key={tag.label} label={tag.label} tone={tag.tone} />)}
        </div>
        <h3 className="text-lg font-semibold text-slate-900">{event.title}</h3>
        <p className="text-sm leading-relaxed text-slate-600">{event.description}</p>
        <p className="text-xs text-slate-500">{event.host}</p>
        <div className="border-t border-slate-100 pt-3">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#667085]">
            You&apos;ll leave with
          </p>
          <ul className="space-y-1 text-sm text-slate-700">
            {event.takeaways.map((item) => <li key={item}>• {item}</li>)}
          </ul>
        </div>
        <p className="text-xs text-slate-500">{event.duration}</p>
      </div>
    </article>
  );
}

function Hero() {
  return (
    <section className="space-y-5 pt-6 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3538CD]">Events &amp; Programs</p>
      <div className="flex justify-center gap-2">
        <Tag label="Owners only" tone="slate" />
        <Tag label="Invite-reviewed" tone="slate" />
        <Tag label="No sell" tone="slate" />
      </div>
      <h1 className="text-5xl font-semibold tracking-tight text-slate-950 md:text-6xl">
        Where owners who are scaling meet.
      </h1>
      <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-600">
        VEGA by VRT Management Group runs invite-reviewed sessions for US business owners doing $2M to $50M in revenue. Peer-led, confidential, no sales pitch.
      </p>
      <p className="text-sm text-slate-500">A decade of VEGA cohorts · Hartford, Connecticut · Hundreds of owner alumni</p>
    </section>
  );
}

// A small blue bar above a heading. Cheap visual anchor — tells the eye where
// a new section starts without a loud border or a divider line.
function SectionTitle({ text }) {
  return (
    <div className="mb-6">
      <div className="mb-3 h-1 w-10 rounded-full bg-[#3538CD]" />
      <h2 className="text-3xl font-semibold tracking-tight text-slate-900">{text}</h2>
    </div>
  );
}

function Card({ children, className = "" }) {
  return <div className={`rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm ${className}`}>{children}</div>;
}

function WhoColumn({ title, body }) {
  return (
    <Card>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#667085]">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-700">{body}</p>
    </Card>
  );
}

function WhoItsFor() {
  return (
    <section>
      <SectionTitle text="Who these are for" />
      <div className="grid gap-5 md:grid-cols-3">
        <WhoColumn title="Revenue stage" body="$2M to $50M" />
        <WhoColumn title="Role" body="Owner, CEO, or Founder — not operators" />
        <WhoColumn title="Industry" body="Any — strongest in services, manufacturing, trades" />
      </div>
    </section>
  );
}

function DiffRow({ lead, body }) {
  return (
    <p className="text-slate-600">
      <span className="font-semibold text-slate-900">{lead}</span> {body}
    </p>
  );
}

function WhatMakesDifferent() {
  return (
    <section>
      <SectionTitle text="What makes these different" />
      <div className="space-y-3">
        <DiffRow lead="Peer-led." body="Most of the room is other owners, not consultants." />
        <DiffRow lead="Confidential." body="Chatham House rules on every call — nothing leaves." />
        <DiffRow lead="No sell." body="No pitch at the end. Ever." />
      </div>
    </section>
  );
}

function FaqItem({ question, answer }) {
  return (
    <Card>
      <p className="font-semibold text-slate-900">{question}</p>
      <p className="mt-1 text-sm leading-relaxed text-slate-600">{answer}</p>
    </Card>
  );
}

function Faq() {
  return (
    <section>
      <SectionTitle text="Frequently asked" />
      <div className="space-y-3">
        {FAQS.map((item) => <FaqItem key={item.question} {...item} />)}
      </div>
    </section>
  );
}

function FormBlock() {
  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white p-8 shadow-sm md:p-10">
      <div className="mb-3 h-1 w-10 rounded-full bg-[#3538CD]" />
      <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Not sure which one fits?</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        Tell us a bit about yourself and we&apos;ll point you to the right session.
      </p>
      <div className="mt-8"><EnquiryForm /></div>
    </section>
  );
}

// flex-1 overflow-y-auto makes THIS page scroll. app/layout.js locks the body
// with overflow-hidden on purpose, because the dashboard must fit a laptop
// window — but a visitor-facing page is taller than the screen by design.
export default function EventsPage() {
  return (
    <main className="flex-1 overflow-y-auto bg-gradient-to-b from-white via-white to-slate-50">
      <div className="mx-auto max-w-6xl space-y-16 px-6 py-12 lg:px-10">
        <Hero />
        <section>
          <SectionTitle text="Upcoming events" />
          <div className="grid gap-5 md:grid-cols-2">
            {EVENTS.map((event) => <EventCard key={event.title} event={event} />)}
          </div>
        </section>
        <WhoItsFor />
        <WhatMakesDifferent />
        <Faq />
        <FormBlock />
        <footer className="pt-6 text-center text-xs text-slate-500">
          VRT Management Group · Hartford, Connecticut · Running VEGA since 2015
        </footer>
      </div>
    </main>
  );
}
