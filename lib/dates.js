// The reviewers are in Connecticut, the database runs in UTC, and the
// developer is in India. "Today" has to mean today in Connecticut, or a
// follow-up due this evening would already be counted as late.
const EASTERN = "America/New_York";

// en-CA prints a date as 2026-11-22, which is the shape a DATE column wants.
export function todayInNewYork() {
  const formatter = new Intl.DateTimeFormat("en-CA", { timeZone: EASTERN });
  return formatter.format(new Date());
}
