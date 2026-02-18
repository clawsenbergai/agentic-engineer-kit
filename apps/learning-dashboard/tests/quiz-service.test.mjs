import test from "node:test";
import assert from "node:assert/strict";

import { __internal, generateQuizQuestion, scoreQuizAnswer } from "../src/lib/quiz-service.js";

test("quiz parser extracts JSON from fenced blocks", () => {
  const parsed = __internal.parseJsonFromModel(
    "```json\n{\"score\":88,\"feedback\":\"ok\",\"rubricBreakdown\":{\"correctness\":90}}\n```"
  );
  assert.equal(parsed.score, 88);
  assert.equal(parsed.feedback, "ok");
});

test("quiz generation falls back to mock without provider keys", async () => {
  const previousClaude = process.env.CLAUDE_API_KEY;
  const previousOpenAI = process.env.OPENAI_API_KEY;
  delete process.env.CLAUDE_API_KEY;
  delete process.env.OPENAI_API_KEY;

  const question = await generateQuizQuestion({
    track: { name: "Reliability", description: "Retries" },
    milestone: {
      id: "m1",
      title: "Retry policy",
      theoryMarkdown: "Learn transient failures",
      buildExerciseMarkdown: "Implement retries",
    },
    evidence: [],
    difficulty: "medium",
    preferredType: "scenario",
  });

  assert.equal(question.providerUsed, "mock");
  assert.equal(question.questionType, "scenario");

  if (previousClaude) process.env.CLAUDE_API_KEY = previousClaude;
  if (previousOpenAI) process.env.OPENAI_API_KEY = previousOpenAI;
});

test("quiz scoring returns bounded score and rubric", async () => {
  const previousClaude = process.env.CLAUDE_API_KEY;
  const previousOpenAI = process.env.OPENAI_API_KEY;
  delete process.env.CLAUDE_API_KEY;
  delete process.env.OPENAI_API_KEY;

  const result = await scoreQuizAnswer({
    questionType: "explain_back",
    questionText: "Explain why idempotency matters",
    userAnswer:
      "Idempotency prevents duplicate side effects when retries happen. We attach deterministic keys and log attempts so repeated calls are safe.",
    rubric: { correctness: 30, depth: 25, reasoning: 25, applicability: 20 },
    milestoneContext: "Reliability",
  });

  assert.ok(result.score >= 0 && result.score <= 100);
  assert.ok(result.feedback.length > 5);
  assert.equal(typeof result.rubricBreakdown, "object");

  if (previousClaude) process.env.CLAUDE_API_KEY = previousClaude;
  if (previousOpenAI) process.env.OPENAI_API_KEY = previousOpenAI;
});
