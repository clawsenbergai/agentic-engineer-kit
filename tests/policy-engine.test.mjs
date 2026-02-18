import test from "node:test";
import assert from "node:assert/strict";

import { evaluatePolicy } from "../scripts/lib/policyEngine.mjs";

test("denies budget breach", () => {
  const decision = evaluatePolicy({
    projectedCostUsd: 999,
    expectedValueUsd: 200,
    riskLevel: "low",
    requestedTool: "search_web",
    selectedModel: "gpt-4.1"
  });

  assert.equal(decision.action, "deny");
});

test("requires approval for high risk", () => {
  const decision = evaluatePolicy({
    projectedCostUsd: 2,
    expectedValueUsd: 20,
    riskLevel: "high",
    requestedTool: "search_web",
    selectedModel: "gpt-4.1"
  });

  assert.equal(decision.action, "require_approval");
});

test("routes to human when expected value is too low", () => {
  const decision = evaluatePolicy({
    projectedCostUsd: 1,
    expectedValueUsd: 0,
    riskLevel: "low",
    requestedTool: "search_web",
    selectedModel: "gpt-4.1"
  });

  assert.equal(decision.action, "route_human");
});
