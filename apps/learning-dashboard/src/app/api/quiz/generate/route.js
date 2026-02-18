import { quizGenerateSchema } from "@/lib/validation";
import { badRequest, created, serverError } from "@/lib/http";
import { requireOwner } from "@/lib/route-guard";
import { generateQuizQuestion } from "@/lib/quiz-service";
import { getTrackById, saveQuizQuestion } from "@/lib/repository";

export async function POST(request) {
  const guard = requireOwner(request);
  if (guard) return guard;

  try {
    const body = await request.json();
    const parsed = quizGenerateSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest("Invalid payload", parsed.error.flatten());
    }

    const trackData = await getTrackById(parsed.data.trackId);
    if (!trackData) {
      return badRequest("Track not found", { trackId: parsed.data.trackId });
    }

    const milestone = trackData.milestones.find((entry) => entry.id === parsed.data.milestoneId);
    if (!milestone) {
      return badRequest("Milestone not found", { milestoneId: parsed.data.milestoneId });
    }

    const generated = await generateQuizQuestion({
      track: trackData.track,
      milestone,
      evidence: milestone.evidence,
      difficulty: parsed.data.difficulty,
      preferredType: parsed.data.preferredType,
    });

    const saved = await saveQuizQuestion({
      trackId: parsed.data.trackId,
      milestoneId: parsed.data.milestoneId,
      questionType: generated.questionType,
      questionText: generated.questionText,
      rubric: generated.rubric,
      difficulty: parsed.data.difficulty,
    });

    return created({
      ok: true,
      question: saved,
      providerUsed: generated.providerUsed,
      modelName: generated.modelName,
    });
  } catch (error) {
    return serverError("Failed to generate quiz", error.message);
  }
}
