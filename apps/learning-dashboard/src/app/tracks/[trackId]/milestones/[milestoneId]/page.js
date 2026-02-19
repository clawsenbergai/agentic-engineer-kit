import { notFound } from "next/navigation";
import Link from "next/link";
import { getMilestoneById } from "@/lib/repository";
import { MilestoneDetailClient } from "@/components/milestone-detail-client";

export default async function MilestoneDetailPage({ params }) {
  const { trackId, milestoneId } = await params;
  const data = await getMilestoneById(milestoneId);
  if (!data) notFound();
  const { milestone, track, steps, evidence, gaps } = data;

  return (
    <div className="flex flex-col gap-4">
      {/* Breadcrumb */}
      <nav className="text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Dashboard</Link>
        {" → "}
        <Link href={`/tracks/${trackId}`} className="hover:text-foreground">{track?.name || trackId}</Link>
        {" → "}
        <span className="text-foreground">{milestone.title}</span>
      </nav>

      <MilestoneDetailClient
        milestone={milestone}
        track={track}
        initialSteps={steps}
        evidence={evidence}
        gaps={gaps}
        trackId={trackId}
      />
    </div>
  );
}
