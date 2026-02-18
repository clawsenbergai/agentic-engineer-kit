import { z } from "zod";
import { PROJECT_SOURCES, QUESTION_TYPES } from "./constants.js";

export const linkProjectSchema = z.object({
  trackId: z.string().min(1),
  milestoneId: z.string().min(1).optional(),
  title: z.string().min(3),
  description: z.string().max(1000).optional().default(""),
  evidenceUrl: z.string().url().optional(),
  projectSource: z.enum(PROJECT_SOURCES),
  sourceType: z.string().default("real_project"),
  status: z.enum(["valid", "stale", "missing"]).default("valid"),
  confidenceScore: z.number().min(0).max(1).default(0.8),
  freshnessScore: z.number().min(0).max(1).default(0.8),
});

export const quizGenerateSchema = z.object({
  trackId: z.string().min(1),
  milestoneId: z.string().min(1),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
  preferredType: z.enum(QUESTION_TYPES).optional(),
});

export const quizSubmitSchema = z.object({
  trackId: z.string().min(1),
  milestoneId: z.string().min(1),
  questionType: z.enum(QUESTION_TYPES),
  questionText: z.string().min(10),
  userAnswer: z.string().min(20),
  rubric: z.record(z.string(), z.number()).optional(),
});

export const updateMilestoneStatusSchema = z.object({
  milestoneId: z.string().min(1),
  status: z.enum(["not_started", "in_progress", "completed_candidate", "completed", "blocked"]),
});
