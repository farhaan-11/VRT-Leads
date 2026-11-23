// Fixed numbers for the preview, taken from the real seed so the shapes on
// screen are the ones the owner already knows.

export const VIEWER = { role: "admin" };

export const COUNTS = { received: 52, assigned: 46, contacted: 38, enrolled: 12 };

// Only open leads wait. A closed one is finished, late or not.
export const WAITING = [
  { label: "0 to 7 days", value: 5, colour: "#17B26A" },
  { label: "8 to 30 days", value: 9, colour: "#F79009" },
  { label: "31 to 90 days", value: 12, colour: "#F38744" },
  { label: "Over 90 days", value: 5, colour: "#F04438" },
];

export const MONEY = [
  { label: "Revenue", value: "$141,400", strong: true },
  { label: "Average enrolment", value: "$11,783" },
  { label: "Average time to enrol", value: "47 days" },
];

export const TEAM = [
  { id: 1, name: "Marcus Hale", open: 9, overdue: 3, enrolled: 4, total: 16, revenue: 46300 },
  { id: 2, name: "Priya Nair", open: 8, overdue: 1, enrolled: 3, total: 14, revenue: 36150 },
  { id: 3, name: "Sneha Kulkarni", open: 8, overdue: 1, enrolled: 5, total: 16, revenue: 58950 },
];

export const CHANNELS = [
  { source: "website", total: 20, enrolled: 2, revenue: 20300 },
  { source: "referral", total: 13, enrolled: 7, revenue: 85850 },
  { source: "linkedin", total: 11, enrolled: 2, revenue: 26350 },
  { source: "event", total: 8, enrolled: 1, revenue: 8900 },
];
