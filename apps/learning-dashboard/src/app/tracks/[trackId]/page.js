import { notFound } from "next/navigation";

import { TrackDetailClient } from "@/components/track-detail-client";
import { getTrackById } from "@/lib/repository";

export default async function TrackDetailPage({ params }) {
  const { trackId } = await params;
  const payload = await getTrackById(trackId);

  if (!payload) {
    notFound();
  }

  return <TrackDetailClient track={payload.track} milestones={payload.milestones} gaps={payload.gaps} />;
}
