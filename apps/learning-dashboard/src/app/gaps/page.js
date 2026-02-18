import Link from "next/link";

import { StatusBadge } from "@/components/status-badge";
import { getGaps, getNextAction } from "@/lib/repository";

export default async function GapsPage() {
  const [gaps, nextAction] = await Promise.all([getGaps(), getNextAction()]);

  return (
    <div className="page-stack">
      <header className="section-head">
        <h1>Gap queue</h1>
        <p className="muted-text">Resolve open high-severity gaps before opening new tracks.</p>
      </header>

      <section className="next-action-card">
        <p className="next-action-label">Top recommendation</p>
        <h3>{nextAction.actionText}</h3>
        <Link href={nextAction.ctaPath} className="primary-button">
          Open action
        </Link>
      </section>

      <div className="gap-list">
        {gaps.length ? (
          gaps.map((gap) => (
            <article key={gap.id} className="gap-row">
              <div>
                <p>{gap.title}</p>
                <p className="muted-text">{gap.detail}</p>
              </div>
              <div className="gap-row-meta">
                <StatusBadge status={gap.status} />
                <span className={`severity severity-${gap.severity}`}>{gap.severity}</span>
                <Link className="ghost-button" href={`/tracks/${gap.trackId}`}>
                  fix
                </Link>
              </div>
            </article>
          ))
        ) : (
          <p className="muted-text">No open gaps. Keep validating with fresh evidence.</p>
        )}
      </div>
    </div>
  );
}
