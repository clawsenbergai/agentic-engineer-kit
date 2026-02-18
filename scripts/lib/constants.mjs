export const AGENT_STATUSES = Object.freeze([
  "queued",
  "running",
  "waiting_approval",
  "succeeded",
  "failed",
  "cancelled"
]);

export const TRANSITIONS = Object.freeze({
  queued: ["running", "cancelled"],
  running: ["waiting_approval", "succeeded", "failed", "cancelled"],
  waiting_approval: ["running", "cancelled"],
  failed: ["queued", "cancelled"],
  succeeded: [],
  cancelled: []
});

export const DEFAULT_POLICY = Object.freeze({
  maxCostUsd: 10,
  minExpectedValueUsd: 1,
  highRiskRequiresApproval: true,
  blockedTools: ["shell_exec", "db_drop"],
  allowedModels: ["gpt-5", "gpt-4.1", "gpt-4o-mini"]
});
