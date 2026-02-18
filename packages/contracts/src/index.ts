export type AgentStatus =
  | "queued"
  | "running"
  | "waiting_approval"
  | "succeeded"
  | "failed"
  | "cancelled";

export type RiskLevel = "low" | "medium" | "high";

export interface AgentTask {
  taskId: string;
  tenantId: string;
  goal: string;
  priority: number;
  deadlineAt?: string;
  budgetUsdCap: number;
  requiredTools: string[];
  successCriteria: string[];
}

export interface AgentRun {
  runId: string;
  taskId: string;
  model: string;
  status: AgentStatus;
  startedAt: string;
  endedAt?: string;
  tokenIn: number;
  tokenOut: number;
  costUsd: number;
  errorCode?: string;
}

export interface PolicyDecision {
  action: "allow" | "require_approval" | "deny" | "route_human";
  reasons: string[];
}

export type LearningTrackCategory = "core" | "elective" | "later_phase";
export type LearningTrackStatus = "on_track" | "gap" | "not_started";
export type MilestoneStatus =
  | "not_started"
  | "in_progress"
  | "completed_candidate"
  | "completed"
  | "blocked";
export type EvidenceStatus = "valid" | "stale" | "missing";
export type QuizQuestionType = "explain_back" | "scenario" | "code_challenge";

export interface LearningTrack {
  id: string;
  name: string;
  description: string;
  category: LearningTrackCategory;
  score: number;
  status: LearningTrackStatus;
  lastActivityAt?: string;
}

export interface LearningMilestone {
  id: string;
  trackId: string;
  title: string;
  theoryMarkdown: string;
  buildExerciseMarkdown: string;
  status: MilestoneStatus;
  orderIndex: number;
  evidenceScore: number;
  quizScore: number;
  capabilityScore: number;
}

export interface LearningArtifact {
  id: string;
  trackId: string;
  milestoneId?: string;
  title: string;
  description?: string;
  status: EvidenceStatus;
  sourceType: string;
  projectSource:
    | "kit_internal"
    | "polymarket_bot"
    | "agent_ready_tool"
    | "green_prairie"
    | "other_real_project";
  evidenceUrl?: string;
  confidenceScore: number;
  freshnessScore: number;
  createdAt: string;
}

export interface LearningQuizQuestion {
  id: string;
  trackId: string;
  milestoneId: string;
  questionType: QuizQuestionType;
  questionText: string;
  rubric: Record<string, number>;
  difficulty: "easy" | "medium" | "hard";
}

export interface LearningQuizResponse {
  id: string;
  trackId: string;
  milestoneId: string;
  questionType: QuizQuestionType;
  questionText: string;
  userAnswer: string;
  aiScore: number;
  aiFeedback: string;
  rubricBreakdown: Record<string, number>;
  modelProvider: "claude" | "openai" | "mock";
  modelName: string;
  createdAt: string;
}

export interface LearningProgressSnapshot {
  id: string;
  overallScore: number;
  evidenceWeight: number;
  quizWeight: number;
  trackScores: Record<string, number>;
  createdAt: string;
}

export interface LearningGap {
  id: string;
  trackId: string;
  milestoneId?: string;
  title: string;
  detail: string;
  severity: "low" | "medium" | "high";
  status: "open" | "resolved";
  createdAt: string;
}

export interface LearningRecommendation {
  id: string;
  trackId: string;
  milestoneId?: string;
  actionText: string;
  ctaPath: string;
  priority: number;
  createdAt: string;
}

export interface LearningTrackWeight {
  evidenceWeight: number;
  quizWeight: number;
}
