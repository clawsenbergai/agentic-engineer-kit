import { getMilestoneEvidence } from "@/lib/repository";
import { ok, serverError } from "@/lib/http";
import { requireOwner } from "@/lib/route-guard";

export async function GET(request, { params }) {
  const guard = requireOwner(request);
  if (guard) return guard;

  try {
    const { id } = await params;
    const evidence = await getMilestoneEvidence(id);
    return ok({ ok: true, evidence });
  } catch (error) {
    return serverError("Failed to load milestone evidence", error.message);
  }
}
