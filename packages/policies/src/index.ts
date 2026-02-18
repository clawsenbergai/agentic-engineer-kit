export interface TenantPolicy {
  tenantId: string;
  maxCostUsd: number;
  minExpectedValueUsd: number;
  blockedTools: string[];
  allowedModels: string[];
  requireApprovalForHighRisk: boolean;
}

export const defaultPolicy: TenantPolicy = {
  tenantId: "default",
  maxCostUsd: 10,
  minExpectedValueUsd: 1,
  blockedTools: ["shell_exec", "db_drop"],
  allowedModels: ["gpt-5", "gpt-4.1", "gpt-4o-mini"],
  requireApprovalForHighRisk: true
};
