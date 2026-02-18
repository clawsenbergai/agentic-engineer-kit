import { getGaps } from "@/lib/repository";
import { ok, serverError } from "@/lib/http";
import { requireOwner } from "@/lib/route-guard";

export async function GET(request) {
  const guard = requireOwner(request);
  if (guard) return guard;

  try {
    const gaps = await getGaps();
    return ok({ ok: true, gaps });
  } catch (error) {
    return serverError("Failed to load gaps", error.message);
  }
}
