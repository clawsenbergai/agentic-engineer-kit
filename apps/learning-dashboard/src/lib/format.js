export function formatDate(value) {
  if (!value) return "no activity";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "no activity";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function scoreToLabel(score) {
  if (score >= 80) return "on track";
  if (score >= 50) return "gap";
  return "not started";
}

export function scorePillTone(score) {
  if (score >= 80) return "good";
  if (score >= 50) return "warn";
  return "bad";
}
