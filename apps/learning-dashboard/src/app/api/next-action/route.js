import { getNextAction } from "@/lib/repository";
import { ok, serverError } from "@/lib/http";
import { requireOwner } from "@/lib/route-guard";

export async function GET(request) {
  const guard = requireOwner(request);
  if (guard) return guard;

  try {
    const nextAction = await getNextAction();
    return ok({ ok: true, nextAction });
  } catch (error) {
    return serverError("Failed to load next action", error.message);
  }
}
