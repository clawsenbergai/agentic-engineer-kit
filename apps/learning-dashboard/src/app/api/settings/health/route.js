import { getSettingsHealth } from "@/lib/repository";
import { ok, serverError } from "@/lib/http";
import { requireOwner } from "@/lib/route-guard";

export async function GET(request) {
  const guard = requireOwner(request);
  if (guard) return guard;

  try {
    const health = await getSettingsHealth();
    return ok({ ok: true, health });
  } catch (error) {
    return serverError("Failed to load health", error.message);
  }
}
