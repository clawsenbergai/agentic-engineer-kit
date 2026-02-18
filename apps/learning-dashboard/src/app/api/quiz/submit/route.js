import { quizSubmitSchema } from "@/lib/validation";
import { badRequest, created, serverError } from "@/lib/http";
import { requireOwner } from "@/lib/route-guard";
import { getTrackById, saveQuizResponse } from "@/lib/repository";
import { scoreQuizAnswer } from "@/lib/quiz-service";

export async function POST(request) {
  const guard = requireOwner(request);
  if (guard) return guard;

  try {
    const body = await request.json();
    const parsed = quizSubmitSchema.safeParse(body);
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

    const scored = await scoreQuizAnswer({
      questionType: parsed.data.questionType,
      questionText: parsed.data.questionText,
      userAnswer: parsed.data.userAnswer,
      rubric: parsed.data.rubric || {
        correctness: 30,
        depth: 25,
        reasoning: 25,
        applicability: 20,
      },
      milestoneContext: `${milestone.title}: ${milestone.theoryMarkdown}`,
    });

    const response = await saveQuizResponse({
      trackId: parsed.data.trackId,
      milestoneId: parsed.data.milestoneId,
      questionType: parsed.data.questionType,
      questionText: parsed.data.questionText,
      userAnswer: parsed.data.userAnswer,
      aiScore: scored.score,
      aiFeedback: scored.feedback,
      rubricBreakdown: scored.rubricBreakdown,
      modelProvider: scored.providerUsed,
      modelName: scored.modelName,
    });

    return created({
      ok: true,
      result: {
        score: response.aiScore,
        feedback: response.aiFeedback,
        rubricBreakdown: response.rubricBreakdown,
        providerUsed: response.modelProvider,
      },
      response,
    });
  } catch (error) {
    return serverError("Failed to score quiz", error.message);
  }
}
