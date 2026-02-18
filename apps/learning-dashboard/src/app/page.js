import { NextActionCard } from "@/components/next-action-card";
import { ScoreHero } from "@/components/score-hero";
import { TrackCard } from "@/components/track-card";
import { getDashboardSummary } from "@/lib/repository";

export default async function HomePage() {
  const summary = await getDashboardSummary();

  return (
    <div className="page-stack">
      <ScoreHero score={summary.overallScore} />

      <section>
        <header className="section-head">
          <h2>Tracks</h2>
          <p className="muted-text">What should you do next? Fix the highest gap first.</p>
        </header>
        <div className="track-grid">
          {summary.tracks.map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>
      </section>

      <NextActionCard nextAction={summary.nextAction} />
    </div>
  );
}
