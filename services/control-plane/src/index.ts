export type ControlDecision = "allow" | "require_approval" | "deny" | "route_human";

export interface ControlInput {
  tenantId: string;
  projectedCostUsd: number;
  expectedValueUsd: number;
  riskLevel: "low" | "medium" | "high";
}

export function evaluate(input: ControlInput): ControlDecision {
  if (input.projectedCostUsd > 10) return "deny";
  if (input.expectedValueUsd < 1) return "route_human";
  if (input.riskLevel === "high") return "require_approval";
  return "allow";
}
