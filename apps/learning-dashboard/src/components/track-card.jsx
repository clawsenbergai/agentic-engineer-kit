import Link from "next/link";

import { ProgressRing } from "@/components/progress-ring";
import { StatusBadge } from "@/components/status-badge";
import { formatDate } from "@/lib/format";

export function TrackCard({ track }) {
  return (
    <Link href={`/tracks/${track.id}`} className="track-card">
      <div className="track-card-head">
        <h3>{track.name}</h3>
        <ProgressRing value={track.score} size={44} stroke={3} />
      </div>
      <div className="track-card-foot">
        <StatusBadge status={track.status} />
        <span>{formatDate(track.lastActivityAt)}</span>
      </div>
    </Link>
  );
}
