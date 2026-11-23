// The four events shown on the public Events page. Hardcoded on purpose:
// this page is read-only and should never depend on the database being up.

export const EVENTS = [
  {
    month: "DEC",
    day: 10,
    title: "VEGA Info Session",
    description:
      "A 45-minute look at who VEGA is for, what a cohort covers, and the kind of owners in the room.",
    host: "Hosted by David Ramirez, VEGA facilitator",
    duration: "45 min · 2:00 PM ET",
    tags: [
      { label: "Webinar", tone: "slate" },
      { label: "Free", tone: "green" },
      { label: "Open", tone: "green" },
    ],
    takeaways: [
      "Whether VEGA fits your stage and industry",
      "What the 12-week program actually covers",
      "How the application review works",
    ],
  },
  {
    month: "JAN",
    day: 15,
    title: "CEO Roundtable: Scaling past $10M",
    description:
      "A closed-door morning with ten owners past $10M, trading the moves and mistakes that got them there.",
    host: "Hosted by Priya Natarajan, VRT managing partner",
    duration: "Half day · 9:00 AM ET · Hartford, CT",
    tags: [
      { label: "In-person", tone: "slate" },
      { label: "Invite-only", tone: "amber" },
      { label: "12 seats", tone: "amber" },
    ],
    takeaways: [
      "The two hires that most changed each owner's week",
      "What broke first when revenue doubled",
      "One small group of owners you can keep talking to",
    ],
  },
  {
    month: "FEB",
    day: 5,
    title: "Owner-to-Owner: Lessons from a Successful Exit",
    description:
      "One owner, one hour, no slides — the real story of selling a $20M services business and what he would do again.",
    host: "With Marcus Hale, VRT alumnus, class of 2022",
    duration: "60 min · 1:00 PM ET",
    tags: [
      { label: "Webinar", tone: "slate" },
      { label: "Free", tone: "green" },
      { label: "Filling fast", tone: "amber" },
    ],
    takeaways: [
      "What the buyer actually paid for, in his words",
      "The two years of cleanup he wishes he had started earlier",
      "What life looks like six months after an exit",
    ],
  },
  {
    month: "MAR",
    day: 2,
    title: "VEGA Spring 2027 Cohort",
    description:
      "The twelve-week program. One small group of owners, meeting weekly, working on each other's hardest problem.",
    host: "Led by the VRT facilitation team",
    duration: "12 weeks · Weekly · Hybrid",
    tags: [
      { label: "Cohort", tone: "slate" },
      { label: "Members only", tone: "amber" },
      { label: "Enrollment open", tone: "green" },
    ],
    takeaways: [
      "A written 12-month plan for your own business",
      "A cohort of owners you can call after the program ends",
      "Direct hours with VRT partners outside the sessions",
    ],
  },
];
