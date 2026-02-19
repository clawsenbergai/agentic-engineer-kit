import { notFound } from "next/navigation";
import Link from "next/link";
import { getTrackById, getStepsForMilestone } from "@/lib/repository";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ChevronRight, BookOpen } from "lucide-react";

export default async function TrackDetailPage({ params }) {
  const { trackId } = await params;
  const data = await getTrackById(trackId);
  if (!data) notFound();

  const { track, milestones } = data;

  const milestonesWithSteps = await Promise.all(
    milestones.map(async (m) => {
      const steps = await getStepsForMilestone(m.id);
      const completed = steps.filter(s => s.completed).length;
      return { ...m, stepCount: steps.length, completed, pct: steps.length > 0 ? Math.round((completed / steps.length) * 100) : 0 };
    })
  );

  const totalSteps = milestonesWithSteps.reduce((s, m) => s + m.stepCount, 0);
  const totalCompleted = milestonesWithSteps.reduce((s, m) => s + m.completed, 0);
  const trackPct = totalSteps > 0 ? Math.round((totalCompleted / totalSteps) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Dashboard</Link> → {track.name}
        </p>
        <div className="flex items-baseline justify-between">
          <h1 className="text-2xl font-bold tracking-tight">{track.name}</h1>
          <span className="text-sm text-muted-foreground">{totalCompleted}/{totalSteps} steps</span>
        </div>
        <p className="text-sm text-muted-foreground">{track.description}</p>
        <Progress value={trackPct} className="h-1.5" />
      </div>

      {/* Milestones */}
      <div className="space-y-2">
        {milestonesWithSteps.map((m, i) => {
          const done = m.pct === 100;
          const isNext = !done && (i === 0 || milestonesWithSteps[i - 1].pct === 100);
          return (
            <Link key={m.id} href={`/tracks/${trackId}/milestones/${m.id}`}>
              <div className="group flex items-center gap-4 p-4 rounded-lg border border-border/30 hover:border-border transition-colors">
                {/* Number */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0 ${
                  done ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"
                }`}>
                  {done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{m.title}</p>
                    {isNext && <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-emerald-700 text-emerald-400">Next</Badge>}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <BookOpen className="h-3 w-3" />
                      {m.stepCount} steps
                    </div>
                    {m.stepCount > 0 && (
                      <>
                        <Progress value={m.pct} className="h-1 w-24" />
                        <span className="text-xs text-muted-foreground tabular-nums">{m.completed}/{m.stepCount}</span>
                      </>
                    )}
                  </div>
                </div>

                <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors shrink-0" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
