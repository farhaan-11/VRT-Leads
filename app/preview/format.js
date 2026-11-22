// How a value is written on screen. The database keeps short machine words
// like "follow_up" and "webinar"; a reader who is not a developer should
// never meet those.

const SOURCE_LABELS = {
  event: "Event",
  referral: "Referral",
  website: "Website",
  webinar: "Webinar",
};

export function sourceLabel(source) {
  return SOURCE_LABELS[source] || source;
}

// US dollars with no cents. Every amount here is a whole number, and cents
// across a row of cards only make the line harder to read.
export function money(amount) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
  return formatter.format(amount);
}

// "2026-11-18" becomes "Nov 18". The year is dropped on a row because every
// row carries the same one, and the column is narrow.
export function shortDay(isoDay) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
  });
  return formatter.format(new Date(`${isoDay}T12:00:00Z`));
}

export function percent(part, whole) {
  if (whole === 0) {
    return 0;
  }
  return Math.round((part / whole) * 100);
}
