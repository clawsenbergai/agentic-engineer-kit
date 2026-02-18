import clsx from "clsx";

const toneByStatus = {
  on_track: "good",
  gap: "bad",
  not_started: "muted",
  valid: "good",
  stale: "warn",
  missing: "bad",
  completed: "good",
  completed_candidate: "warn",
  in_progress: "muted",
  not_started: "muted",
  blocked: "bad",
  open: "bad",
  resolved: "good",
};

function pretty(value) {
  return value.replaceAll("_", " ");
}

export function StatusBadge({ status }) {
  const tone = toneByStatus[status] || "muted";
  return <span className={clsx("status-badge", `status-${tone}`)}>{pretty(status)}</span>;
}
