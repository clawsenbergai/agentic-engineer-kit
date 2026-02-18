export const DESIGN_TOKENS = {
  bg: "#000000",
  panel: "#111111",
  panelAlt: "#1a1a1a",
  text: "#ffffff",
  muted: "#888888",
  accent: "#00FF88",
  danger: "#FF4444",
  warn: "#FFC857",
};

export const QUIZ_PROVIDER_PRIMARY = (process.env.QUIZ_PROVIDER_PRIMARY || "claude").toLowerCase();
export const QUIZ_PROVIDER_FALLBACK = (process.env.QUIZ_PROVIDER_FALLBACK || "openai").toLowerCase();

export const STATUS = {
  TRACK: {
    ON_TRACK: "on_track",
    GAP: "gap",
    NOT_STARTED: "not_started",
  },
  MILESTONE: {
    NOT_STARTED: "not_started",
    IN_PROGRESS: "in_progress",
    COMPLETED_CANDIDATE: "completed_candidate",
    COMPLETED: "completed",
    BLOCKED: "blocked",
  },
  EVIDENCE: {
    VALID: "valid",
    STALE: "stale",
    MISSING: "missing",
  },
};

export const WEIGHTS = {
  EVIDENCE: 0.7,
  QUIZ: 0.3,
};

export const SCORE_THRESHOLDS = {
  COMPLETE_EVIDENCE_MIN: 60,
  COMPLETE_QUIZ_MIN: 50,
  GAP_TRACK_SCORE: 50,
};

export const QUESTION_TYPES = ["explain_back", "scenario", "code_challenge"];

export const PROJECT_SOURCES = [
  "kit_internal",
  "polymarket_bot",
  "agent_ready_tool",
  "green_prairie",
  "other_real_project",
];
