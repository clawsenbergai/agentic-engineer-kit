import Link from "next/link";
import { getDashboardSummary } from "@/lib/repository";
import { ProgressRing } from "@/components/progress-ring";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Zap } from "lucide-react";

function statusBadge(status) {
  const map = {
    on_track: { label: "On track", variant: "default" },
    gap: { label: "Gap", variant: "destructive" },
    not_started: { label: "Not started", variant: "secondary" },
  };
  const { label, variant } = map[status] || map.not_started;
  return <Badge variant={variant}>{label}</Badge>;
}

export default async function DashboardPage() {
  const summary = await getDashboardSummary();
  const { overallScore, tracks, nextAction, gapCount, continueFrom, totalSteps, completedSteps } = summary;

  const totalMilestones = tracks.reduce((sum, t) => {
    return sum + (t.milestoneCount || 0);
  }, 0);

  const completedMilestones = tracks.reduce((sum, t) => {
    return sum + (t.completedMilestoneCount || 0);
  }, 0);

  return (
    <div className="flex flex-col gap-8">
      {/* Hero */}
      <Card className="border-border/50 bg-gradient-to-br from-card to-background">
        <CardContent className="flex items-center justify-between p-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight tabular-nums">
              {Math.round(overallScore)}%
            </h1>
            <p className="text-muted-foreground">
              Overall capability score
            </p>
            {totalSteps > 0 && (
              <p className="text-sm text-muted-foreground">
                {completedSteps}/{totalSteps} steps completed
              </p>
            )}
            {gapCount > 0 && (
              <p className="text-sm text-muted-foreground">
                {gapCount} open {gapCount === 1 ? "gap" : "gaps"} to resolve
              </p>
            )}
          </div>
          <ProgressRing score={overallScore} size={140} strokeWidth={10} />
        </CardContent>
      </Card>

      {/* Continue where you left off */}
      {continueFrom ? (
        <Card className="border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30">
          <CardContent className="flex items-center justify-between p-6">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Continue where you left off
              </p>
              <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                {continueFrom.track.name} → {continueFrom.milestone.title}
              </p>
              <p className="text-sm text-emerald-700 dark:text-emerald-300">
                {continueFrom.step.title}
              </p>
            </div>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1">
              <Link href={`/tracks/${continueFrom.track.id}/milestones/${continueFrom.milestone.id}`}>
                Continue <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
                🎉 All tracks completed!
              </h3>
              <p className="text-sm text-emerald-700 dark:text-emerald-300">
                You've finished all available steps. Great work!
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next best action */}
      {nextAction && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex items-center justify-between p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-primary">
                  Next action
                </p>
                <p className="text-sm font-medium">{nextAction.actionText}</p>
              </div>
            </div>
            <Button asChild size="sm" className="gap-1">
              <Link href={nextAction.ctaPath}>
                Go <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Track grid */}
      <div>
        <h2 className="mb-4 text-lg font-semibold tracking-tight">Tracks</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tracks.map((track) => {
            const steps = track.stepCount || 0;
            const completedSteps = track.completedStepCount || 0;
            const progressPct = track.stepProgressPct !== undefined ? track.stepProgressPct : track.score;
            
            return (
              <Link key={track.id} href={`/tracks/${track.id}`}>
                <Card className="group h-full border-border/50 transition-all hover:border-border hover:-translate-y-0.5 hover:shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold">{track.name}</CardTitle>
                      {statusBadge(track.status)}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {track.description}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Progress value={progressPct} className="h-1.5" />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-medium tabular-nums">{Math.round(progressPct)}%</span>
                      {steps > 0 && (
                        <span>{completedSteps}/{steps} steps</span>
                      )}
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
