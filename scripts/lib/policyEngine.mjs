import { DEFAULT_POLICY } from "./constants.mjs";

export function evaluatePolicy(input, policy = DEFAULT_POLICY) {
  const reasons = [];

  const {
    projectedCostUsd,
    expectedValueUsd,
    riskLevel,
    requestedTool,
    selectedModel,
    forceHumanReview = false
  } = input;

  if (forceHumanReview) {
    reasons.push("Manual review forced by upstream rule");
    return { action: "route_human", reasons };
  }

  if (projectedCostUsd > policy.maxCostUsd) {
    reasons.push(`Projected cost ${projectedCostUsd} exceeds cap ${policy.maxCostUsd}`);
    return { action: "deny", reasons };
  }

  if (expectedValueUsd < policy.minExpectedValueUsd) {
    reasons.push(
      `Expected value ${expectedValueUsd} below minimum ${policy.minExpectedValueUsd}`
    );
    return { action: "route_human", reasons };
  }

  if (policy.blockedTools.includes(requestedTool)) {
    reasons.push(`Tool ${requestedTool} is blocked`);
    return { action: "deny", reasons };
  }

  if (!policy.allowedModels.includes(selectedModel)) {
    reasons.push(`Model ${selectedModel} not in allowlist`);
    return { action: "route_human", reasons };
  }

  if (riskLevel === "high" && policy.highRiskRequiresApproval) {
    reasons.push("High-risk action requires approval");
    return { action: "require_approval", reasons };
  }

  reasons.push("Policy checks passed");
  return { action: "allow", reasons };
}
