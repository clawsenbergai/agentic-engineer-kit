import Link from "next/link";
import { getDashboardSummary } from "@/lib/repository";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";

export default async function DashboardPage() {
  const summary = await getDashboardSummary();
  const { tracks, continueFrom, totalSteps, completedSteps } = summary;
  const progressPct = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      {/* Progress + Continue */}
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <h1 className="text-3xl font-bold tracking-tight">{progressPct}%</h1>
            <span className="text-sm text-muted-foreground">{completedSteps}/{totalSteps} steps</span>
          </div>
          <Progress value={progressPct} className="h-2" />
        </div>

        {continueFrom && (
          <Card className="border-emerald-800/50 bg-emerald-950/20">
            <CardContent className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-sm font-medium">{continueFrom.track.name}</p>
                  <p className="text-xs text-muted-foreground">{continueFrom.milestone.title} → {continueFrom.step.title}</p>
                </div>
              </div>
              <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700 gap-1">
                <Link href={`/tracks/${continueFrom.track.id}/milestones/${continueFrom.milestone.id}`}>
                  Continue <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tracks */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Tracks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {tracks.map((track) => {
            const pct = track.stepProgressPct ? Math.round(track.stepProgressPct) : 0;
            const done = pct === 100;
            return (
              <Link key={track.id} href={`/tracks/${track.id}`}>
                <Card className="h-full border-border/40 hover:border-border transition-colors cursor-pointer">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 min-w-0">
                        <p className="text-sm font-medium leading-tight">{track.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{track.description}</p>
                      </div>
                      {done && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />}
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={pct} className="h-1 flex-1" />
                      <span className="text-[11px] text-muted-foreground tabular-nums whitespace-nowrap">
                        {track.completedStepCount || 0}/{track.totalStepCount || 0}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
