import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";

import {
  QUESTION_TYPES,
  QUIZ_PROVIDER_FALLBACK,
  QUIZ_PROVIDER_PRIMARY,
} from "./constants.js";
import { logProviderRun } from "./repository.js";

function pickQuestionType(preferredType) {
  if (preferredType && QUESTION_TYPES.includes(preferredType)) return preferredType;
  const index = Math.floor(Math.random() * QUESTION_TYPES.length);
  return QUESTION_TYPES[index];
}

function parseJsonFromModel(text) {
  if (!text) return null;
  const stripped = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  try {
    return JSON.parse(stripped);
  } catch {
    const firstBrace = stripped.indexOf("{");
    const lastBrace = stripped.lastIndexOf("}");
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      try {
        return JSON.parse(stripped.slice(firstBrace, lastBrace + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}

function buildQuestionPrompt({ track, milestone, evidence, difficulty, preferredType }) {
  return [
    "You are generating one validation question for an agentic engineering learning dashboard.",
    "Return strict JSON only.",
    "Schema:",
    "{",
    '  "questionType": "explain_back|scenario|code_challenge",',
    '  "questionText": "string",',
    '  "rubric": {"correctness": number, "depth": number, "reasoning": number, "applicability": number}',
    "}",
    "Rules:",
    "- weights in rubric must sum to 100",
    "- question should verify practical understanding, not memorization",
    "- include one concrete failure mode tied to the milestone",
    `Track: ${track.name}`,
    `Track description: ${track.description}`,
    `Milestone: ${milestone.title}`,
    `Theory: ${milestone.theoryMarkdown}`,
    `Build exercise: ${milestone.buildExerciseMarkdown}`,
    `Evidence summary: ${evidence.map((item) => `${item.title} (${item.status})`).join(", ") || "none"}`,
    `Difficulty: ${difficulty}`,
    `Preferred question type: ${preferredType || "auto"}`,
  ].join("\n");
}

function buildScoringPrompt({ questionType, questionText, userAnswer, rubric, milestoneContext }) {
  return [
    "Score the learner answer for an enterprise agent systems curriculum.",
    "Return strict JSON only.",
    "Schema:",
    "{",
    '  "score": number,',
    '  "feedback": "string",',
    '  "rubricBreakdown": {"correctness": number, "depth": number, "reasoning": number, "applicability": number}',
    '  "improvementStep": "string"',
    "}",
    "Rules:",
    "- score from 0-100",
    "- rubricBreakdown values are 0-100",
    "- feedback max 80 words, concrete and direct",
    "- no markdown",
    `Question type: ${questionType}`,
    `Question: ${questionText}`,
    `User answer: ${userAnswer}`,
    `Rubric weights: ${JSON.stringify(rubric)}`,
    `Milestone context: ${milestoneContext}`,
  ].join("\n");
}

function normalizeQuestionPayload(payload, fallbackType) {
  const questionType = QUESTION_TYPES.includes(payload?.questionType)
    ? payload.questionType
    : fallbackType;
  const rubric = payload?.rubric || {
    correctness: 30,
    depth: 25,
    reasoning: 25,
    applicability: 20,
  };

  return {
    questionType,
    questionText: payload?.questionText || "Explain how you would make this milestone reliable in production and why.",
    rubric,
  };
}

function normalizeScorePayload(payload) {
  const rubricBreakdown = payload?.rubricBreakdown || {
    correctness: 50,
    depth: 50,
    reasoning: 50,
    applicability: 50,
  };

  const score = Number.isFinite(Number(payload?.score)) ? Number(payload.score) : 0;
  const feedback = payload?.feedback || "Answer needs stronger technical depth and clearer decision logic.";

  return {
    score: Math.max(0, Math.min(100, score)),
    feedback,
    rubricBreakdown,
    improvementStep: payload?.improvementStep || "Retry with concrete architecture and failure handling details.",
  };
}

function mockQuestion({ milestone, preferredType }) {
  const questionType = pickQuestionType(preferredType);
  const prompts = {
    explain_back: `Explain in your own words why ${milestone.title} matters in enterprise agent systems.`,
    scenario: `Your workflow for ${milestone.title} fails under a timeout spike and stale context. What is your recovery plan?`,
    code_challenge: `Write or describe a function that validates ${milestone.title} outputs and rejects unsafe tool escalation.`,
  };

  return {
    questionType,
    questionText: prompts[questionType],
    rubric: {
      correctness: 30,
      depth: 25,
      reasoning: 25,
      applicability: 20,
    },
    providerUsed: "mock",
    modelName: "local-heuristic",
  };
}

function mockScore({ questionText, userAnswer }) {
  const answerLengthScore = Math.min(45, Math.floor(userAnswer.trim().length / 8));
  const questionTerms = questionText
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((term) => term.length > 4)
    .slice(0, 8);

  let keywordHits = 0;
  const lowerAnswer = userAnswer.toLowerCase();
  for (const term of questionTerms) {
    if (lowerAnswer.includes(term)) keywordHits += 1;
  }

  const keywordScore = Math.min(35, keywordHits * 6);
  const structureBonus = /because|therefore|trade-?off|fallback|retry|policy|evidence/.test(lowerAnswer)
    ? 20
    : 8;

  const score = Math.max(0, Math.min(100, answerLengthScore + keywordScore + structureBonus));

  return {
    score,
    feedback:
      score >= 80
        ? "Strong answer. Good technical depth and practical framing. Add one concrete metric to make it audit-ready."
        : "Reasonable base, but add clearer failure handling and explicit trade-offs tied to the milestone.",
    rubricBreakdown: {
      correctness: Math.max(35, Math.min(100, score + 5)),
      depth: Math.max(30, Math.min(100, score)),
      reasoning: Math.max(25, Math.min(100, score - 5)),
      applicability: Math.max(30, Math.min(100, score - 2)),
    },
    improvementStep: "Add one concrete failure scenario and describe exact retry/policy behavior.",
    providerUsed: "mock",
    modelName: "local-heuristic",
  };
}

async function callClaude(prompt, runKind) {
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) throw new Error("Claude API key is missing");

  const client = new Anthropic({ apiKey });
  const started = Date.now();
  const model = process.env.CLAUDE_MODEL || "claude-3-5-sonnet-latest";

  try {
    const response = await client.messages.create({
      model,
      max_tokens: 800,
      temperature: 0.2,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content
      .filter((contentItem) => contentItem.type === "text")
      .map((contentItem) => contentItem.text)
      .join("\n")
      .trim();

    await logProviderRun({
      runKind,
      provider: "claude",
      modelName: model,
      success: true,
      fallbackUsed: false,
      latencyMs: Date.now() - started,
    });

    return text;
  } catch (error) {
    await logProviderRun({
      runKind,
      provider: "claude",
      modelName: model,
      success: false,
      fallbackUsed: false,
      latencyMs: Date.now() - started,
      errorMessage: error.message,
    });
    throw error;
  }
}

async function callOpenAI(prompt, runKind, fallbackUsed = false) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OpenAI API key is missing");

  const client = new OpenAI({ apiKey });
  const started = Date.now();
  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

  try {
    const response = await client.responses.create({
      model,
      input: prompt,
      temperature: 0.2,
    });

    const text = response.output_text?.trim() || "";

    await logProviderRun({
      runKind,
      provider: "openai",
      modelName: model,
      success: true,
      fallbackUsed,
      latencyMs: Date.now() - started,
    });

    return text;
  } catch (error) {
    await logProviderRun({
      runKind,
      provider: "openai",
      modelName: model,
      success: false,
      fallbackUsed,
      latencyMs: Date.now() - started,
      errorMessage: error.message,
    });
    throw error;
  }
}

async function callPrimaryWithFallback({ prompt, runKind }) {
  const primary = QUIZ_PROVIDER_PRIMARY;
  const fallback = QUIZ_PROVIDER_FALLBACK;

  if (primary === "claude") {
    try {
      return { text: await callClaude(prompt, runKind), providerUsed: "claude" };
    } catch (error) {
      if (fallback === "openai") {
        const text = await callOpenAI(prompt, runKind, true);
        return { text, providerUsed: "openai", fallbackReason: error.message };
      }
      throw error;
    }
  }

  if (primary === "openai") {
    try {
      return { text: await callOpenAI(prompt, runKind), providerUsed: "openai" };
    } catch (error) {
      if (fallback === "claude") {
        const text = await callClaude(prompt, runKind);
        return { text, providerUsed: "claude", fallbackReason: error.message };
      }
      throw error;
    }
  }

  throw new Error(`Unsupported primary provider: ${primary}`);
}

export async function generateQuizQuestion({ track, milestone, evidence, difficulty, preferredType }) {
  const safePreferredType = pickQuestionType(preferredType);
  const prompt = buildQuestionPrompt({
    track,
    milestone,
    evidence,
    difficulty,
    preferredType: safePreferredType,
  });

  try {
    const { text, providerUsed } = await callPrimaryWithFallback({
      prompt,
      runKind: "quiz_generate",
    });

    const parsed = parseJsonFromModel(text);
    const normalized = normalizeQuestionPayload(parsed, safePreferredType);

    return {
      ...normalized,
      providerUsed,
      modelName:
        providerUsed === "claude"
          ? process.env.CLAUDE_MODEL || "claude-3-5-sonnet-latest"
          : process.env.OPENAI_MODEL || "gpt-4.1-mini",
    };
  } catch {
    return mockQuestion({
      milestone,
      preferredType: safePreferredType,
    });
  }
}

export async function scoreQuizAnswer({
  questionType,
  questionText,
  userAnswer,
  rubric,
  milestoneContext,
}) {
  const prompt = buildScoringPrompt({
    questionType,
    questionText,
    userAnswer,
    rubric,
    milestoneContext,
  });

  try {
    const { text, providerUsed } = await callPrimaryWithFallback({
      prompt,
      runKind: "quiz_score",
    });

    const parsed = parseJsonFromModel(text);
    const normalized = normalizeScorePayload(parsed);

    return {
      score: normalized.score,
      feedback: `${normalized.feedback} Next step: ${normalized.improvementStep}`,
      rubricBreakdown: normalized.rubricBreakdown,
      providerUsed,
      modelName:
        providerUsed === "claude"
          ? process.env.CLAUDE_MODEL || "claude-3-5-sonnet-latest"
          : process.env.OPENAI_MODEL || "gpt-4.1-mini",
    };
  } catch {
    const fallback = mockScore({ questionText, userAnswer });
    return {
      score: fallback.score,
      feedback: `${fallback.feedback} Next step: ${fallback.improvementStep}`,
      rubricBreakdown: fallback.rubricBreakdown,
      providerUsed: fallback.providerUsed,
      modelName: fallback.modelName,
    };
  }
}

export const __internal = {
  parseJsonFromModel,
  mockQuestion,
  mockScore,
};
