import test from "node:test";
import assert from "node:assert/strict";

import {
  __getMemoryStoreUnsafe,
  __resetMemoryStore,
  getDashboardSummary,
  getGaps,
  linkProjectEvidence,
  saveQuizResponse,
} from "../src/lib/repository.js";

test("linking project evidence persists projectSource", async () => {
  __resetMemoryStore();

  const artifact = await linkProjectEvidence({
    trackId: "a2a",
    milestoneId: "a2a_m1",
    title: "A2A handoff log",
    description: "Real project evidence",
    status: "valid",
    sourceType: "real_project",
    projectSource: "polymarket_bot",
    evidenceUrl: "https://example.com/a2a",
    confidenceScore: 0.82,
    freshnessScore: 0.77,
  });

  assert.equal(artifact.projectSource, "polymarket_bot");

  const store = __getMemoryStoreUnsafe();
  const saved = store.artifacts.find((entry) => entry.id === artifact.id);
  assert.equal(saved.projectSource, "polymarket_bot");
});

test("quiz submission persists in quiz_responses and affects summary", async () => {
  __resetMemoryStore();

  await saveQuizResponse({
    trackId: "reliability",
    milestoneId: "reliability_m1",
    questionType: "scenario",
    questionText: "What do you do on timeout storm?",
    userAnswer: "Use retry budget, idempotency keys, and dead-letter queue with policy escalation.",
    aiScore: 86,
    aiFeedback: "Good",
    rubricBreakdown: { correctness: 90, depth: 80, reasoning: 85, applicability: 88 },
    modelProvider: "mock",
    modelName: "local",
  });

  const store = __getMemoryStoreUnsafe();
  assert.equal(store.quizResponses.length > 0, true);

  const summary = await getDashboardSummary();
  assert.equal(typeof summary.overallScore, "number");
  assert.equal(summary.tracks.length > 0, true);
});

test("gap generation includes stale and missing evidence cases", async () => {
  __resetMemoryStore({ includeDemoArtifacts: true });

  const gaps = await getGaps();
  assert.equal(gaps.length > 0, true);

  const hasMissing = gaps.some((gap) => /Missing evidence/i.test(gap.title));
  const hasStale = gaps.some((gap) => /Stale evidence/i.test(gap.title));

  assert.equal(hasMissing, true);
  assert.equal(hasStale, true);
});
