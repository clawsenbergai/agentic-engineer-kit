import { TRANSITIONS } from "./constants.mjs";

export function canTransition(from, to) {
  const allowed = TRANSITIONS[from] || [];
  return allowed.includes(to);
}

export function transitionRun(run, to, now = new Date().toISOString()) {
  if (!run || typeof run !== "object") {
    throw new Error("Run object is required");
  }

  if (!canTransition(run.status, to)) {
    throw new Error(`Illegal transition: ${run.status} -> ${to}`);
  }

  const next = { ...run, status: to };

  if (to === "running" && !next.startedAt) {
    next.startedAt = now;
  }

  if (["succeeded", "failed", "cancelled"].includes(to)) {
    next.endedAt = now;
  }

  return next;
}
