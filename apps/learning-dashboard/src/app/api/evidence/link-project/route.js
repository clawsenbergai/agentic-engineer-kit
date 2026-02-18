import { linkProjectSchema } from "@/lib/validation";
import { linkProjectEvidence } from "@/lib/repository";
import { badRequest, created, serverError } from "@/lib/http";
import { requireOwner } from "@/lib/route-guard";

export async function POST(request) {
  const guard = requireOwner(request);
  if (guard) return guard;

  try {
    const body = await request.json();
    const parsed = linkProjectSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest("Invalid payload", parsed.error.flatten());
    }

    const artifact = await linkProjectEvidence(parsed.data);
    return created({ ok: true, artifact });
  } catch (error) {
    return serverError("Failed to link project evidence", error.message);
  }
}
