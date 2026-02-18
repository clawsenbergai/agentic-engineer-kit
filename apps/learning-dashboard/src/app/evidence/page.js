import Link from "next/link";

import { StatusBadge } from "@/components/status-badge";
import { formatDate } from "@/lib/format";
import { getAllEvidence } from "@/lib/repository";

export default async function EvidencePage() {
  const evidence = await getAllEvidence();

  return (
    <div className="page-stack">
      <header className="section-head">
        <h1>Evidence explorer</h1>
        <p className="muted-text">Only trusted evidence should influence your score and next action.</p>
      </header>

      <div className="evidence-list">
        {evidence.map((item) => (
          <article className="evidence-row" key={item.id}>
            <div>
              <h3>{item.title}</h3>
              <p className="muted-text">{item.description}</p>
              <p className="muted-text">
                {item.trackName} • {item.milestoneTitle || "Unmapped milestone"} • {formatDate(item.updatedAt)}
              </p>
            </div>
            <div className="evidence-row-meta">
              <StatusBadge status={item.status} />
              <span className="project-badge">{item.projectSource}</span>
              <Link href={`/tracks/${item.trackId}`} className="ghost-button">
                open track
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
