import { toggleStepComplete } from "@/lib/repository";
import { ok, badRequest } from "@/lib/http";

export async function POST(request, { params }) {
  const { stepId } = await params;
  const step = await toggleStepComplete(stepId);

  if (!step) {
    return badRequest("Step not found");
  }

  return ok(step);
}
