import { getTracks } from "@/lib/repository";
import { ok, serverError } from "@/lib/http";
import { requireOwner } from "@/lib/route-guard";

export async function GET(request) {
  const guard = requireOwner(request);
  if (guard) return guard;

  try {
    const tracks = await getTracks();
    return ok({ ok: true, tracks });
  } catch (error) {
    return serverError("Failed to load tracks", error.message);
  }
}
