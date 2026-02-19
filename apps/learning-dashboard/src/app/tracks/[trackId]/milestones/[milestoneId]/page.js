import { notFound } from "next/navigation";
import { getMilestoneById } from "@/lib/repository";
import { MilestoneDetailClient } from "@/components/milestone-detail-client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default async function MilestoneDetailPage({ params }) {
  const { trackId, milestoneId } = await params;
  const data = await getMilestoneById(milestoneId);

  if (!data) notFound();

  const { milestone, track, steps, evidence, gaps } = data;

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/tracks/${trackId}`}>{track?.name || trackId}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{milestone.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

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
