import { ProgressRing } from "@/components/progress-ring";

export function ScoreHero({ score }) {
  return (
    <section className="score-hero">
      <div>
        <p className="muted-text">Overall capability score</p>
        <h1>{Math.round(score)}/100</h1>
      </div>
      <ProgressRing value={score} size={92} stroke={5} />
    </section>
  );
}
