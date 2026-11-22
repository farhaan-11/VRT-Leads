// The reviewers are in Connecticut, the database runs in UTC, and the
// developer is in India. "Today" has to mean today in Connecticut, or a
// follow-up due this evening would already be counted as late.
const EASTERN = "America/New_York";

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

// en-CA prints a date as 2026-11-22, which is the shape a DATE column wants.
export function dayInNewYork(value) {
  const formatter = new Intl.DateTimeFormat("en-CA", { timeZone: EASTERN });
  return formatter.format(new Date(value));
}

export function todayInNewYork() {
  return dayInNewYork(new Date());
}

// I read both days at midday so a daylight saving change, which makes one
// day 23 or 25 hours long, cannot round the answer to the wrong number.
function daysBetween(fromDay, toDay) {
  const start = Date.parse(`${fromDay}T12:00:00Z`);
  const end = Date.parse(`${toDay}T12:00:00Z`);

  return Math.round((end - start) / ONE_DAY_IN_MS);
}

// Days since the enquiry arrived, counted in Connecticut days. created_at is
// a UTC timestamp, so an evening enquiry would otherwise read a day older.
export function daysSince(createdAt) {
  return daysBetween(dayInNewYork(createdAt), todayInNewYork());
}

// "2026-11-18" becomes "Nov 18, 2026". 18/11/2026 reads as a different day
// in the US than it does in India, and this shape cannot be misread.
//
// Midday again: the text carries no time, and reading it at midnight would
// let it slide into the day before.
export function formatDay(isoDay) {
  if (!isoDay) {
    return "";
  }

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return formatter.format(new Date(`${isoDay}T12:00:00Z`));
}

// A date the browser could never produce, but a typed URL or the API could.
// 2026-02-31 passes a shape test and would reach a DATE column, where MySQL
// in strict mode throws and the reader gets a blank error page.
export function isRealDay(isoDay) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDay)) {
    return false;
  }
  return !Number.isNaN(Date.parse(`${isoDay}T12:00:00Z`));
}
