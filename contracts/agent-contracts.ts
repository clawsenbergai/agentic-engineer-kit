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

export interface ToolInvocation {
  runId: string;
  step: number;
  toolName: string;
  inputJson: unknown;
  outputJson?: unknown;
  latencyMs?: number;
  succeeded: boolean;
}

export interface ApprovalRequest {
  approvalId: string;
  runId: string;
  reason: string;
  riskLevel: RiskLevel;
  requestedAt: string;
  decidedAt?: string;
  decision?: "approved" | "rejected";
}

export interface MemoryRecord {
  memoryId: string;
  tenantId: string;
  kind: "working" | "episodic" | "semantic";
  content: string;
  embeddingRef?: string;
  score?: number;
  createdAt: string;
}

export interface PolicyDecision {
  action: "allow" | "require_approval" | "deny" | "route_human";
  reasons: string[];
}
