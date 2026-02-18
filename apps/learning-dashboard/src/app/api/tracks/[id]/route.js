import { getTrackById } from "@/lib/repository";
import { badRequest, ok, serverError } from "@/lib/http";
import { requireOwner } from "@/lib/route-guard";

export async function GET(request, { params }) {
  const guard = requireOwner(request);
  if (guard) return guard;

  try {
    const { id } = await params;
    const track = await getTrackById(id);
    if (!track) {
      return badRequest("Unknown track", { trackId: id });
    }
    return ok({ ok: true, ...track });
  } catch (error) {
    return serverError("Failed to load track", error.message);
  }
}
