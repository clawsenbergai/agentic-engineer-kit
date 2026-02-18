import { getDashboardSummary } from "@/lib/repository";
import { ok, serverError } from "@/lib/http";
import { requireOwner } from "@/lib/route-guard";

export async function GET(request) {
  const guard = requireOwner(request);
  if (guard) return guard;

  try {
    const summary = await getDashboardSummary();
    return ok({ ok: true, summary });
  } catch (error) {
    return serverError("Failed to load dashboard summary", error.message);
  }
}
