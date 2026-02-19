import { saveStepNotes } from "@/lib/repository";

export async function POST(request, { params }) {
  const { stepId } = await params;
  const { notes } = await request.json();
  try {
    await saveStepNotes(stepId, notes);
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
