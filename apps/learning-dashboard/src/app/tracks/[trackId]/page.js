import { notFound } from "next/navigation";
import Link from "next/link";
import { getTrackById, getStepsForMilestone } from "@/lib/repository";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  CheckCircle2,
  Circle,
  AlertCircle,
  Clock,
  ChevronRight,
  PlayCircle,
  BookOpen,
} from "lucide-react";

function milestoneStatusIcon(status) {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-5 w-5 text-primary" />;
    case "completed_candidate":
      return <Clock className="h-5 w-5 text-yellow-500" />;
    case "in_progress":
      return <Circle className="h-5 w-5 text-blue-400" />;
    case "blocked":
      return <AlertCircle className="h-5 w-5 text-destructive" />;
    default:
      return <Circle className="h-5 w-5 text-muted-foreground/40" />;
  }
}

function milestoneStatusBadge(status) {
  const map = {
    completed: { label: "Complete", variant: "default" },
    completed_candidate: { label: "Candidate", variant: "outline" },
    in_progress: { label: "In progress", variant: "secondary" },
    blocked: { label: "Blocked", variant: "destructive" },
    not_started: { label: "Not started", variant: "secondary" },
  };
  const { label, variant } = map[status] || map.not_started;
  return <Badge variant={variant} className="text-xs">{label}</Badge>;
}

export default async function TrackDetailPage({ params }) {
  const { trackId } = await params;
  const data = await getTrackById(trackId);

  if (!data) notFound();

  const { track, milestones } = data;

  // Get step counts for each milestone
  const milestonesWithSteps = await Promise.all(
    milestones.map(async (milestone) => {
      const steps = await getStepsForMilestone(milestone.id);
      const completedSteps = steps.filter(s => s.completed).length;
      return {
        ...milestone,
        stepCount: steps.length,
        completedSteps,
        stepProgressPct: steps.length > 0 ? (completedSteps / steps.length) * 100 : 0,
      };
    })
  );

  // Find the next milestone to work on
  const nextMilestone = milestonesWithSteps.find(m => m.status !== "completed");

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
            <BreadcrumbPage>{track.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Track header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">{track.name}</h1>
          <span className="text-2xl font-bold tabular-nums text-primary">{Math.round(track.score)}%</span>
        </div>
        <p className="text-sm text-muted-foreground">{track.description}</p>
        <Progress value={track.score} className="h-2" />
      </div>

      {/* Learning Path */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Learning Path
          </h2>
          {nextMilestone && (
            <Button asChild size="sm" className="gap-2">
              <Link href={`/tracks/${trackId}/milestones/${nextMilestone.id}`}>
                <PlayCircle className="h-4 w-4" />
                Continue Learning
              </Link>
            </Button>
          )}
        </div>
        
        <div className="relative flex flex-col gap-1">
          {milestonesWithSteps.map((milestone, index) => {
            const isLast = index === milestonesWithSteps.length - 1;
            const isNext = nextMilestone && milestone.id === nextMilestone.id;
            const milestoneNumber = index + 1;

            return (
              <div key={milestone.id} className="relative flex gap-4">
                {/* Timeline line + number */}
                <div className="flex flex-col items-center">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-bold text-sm transition-colors ${
                    milestone.status === "completed" 
                      ? "bg-primary text-primary-foreground border-primary"
                      : isNext
                      ? "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-700"
                      : milestone.status === "in_progress" || milestone.status === "completed_candidate"
                      ? "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-700"
                      : "bg-muted text-muted-foreground border-border"
                  }`}>
                    {milestone.status === "completed" ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      milestoneNumber
                    )}
                  </div>
                  {!isLast && (
                    <div className={`w-0.5 flex-1 mt-2 mb-2 ${
                      milestone.status === "completed" ? "bg-primary/30" : "bg-border"
                    }`} style={{ minHeight: "20px" }} />
                  )}
                </div>

                {/* Milestone card */}
                <div className="flex-1 pb-4">
                  <Link href={`/tracks/${trackId}/milestones/${milestone.id}`}>
                    <Card className={`group border-border/50 transition-all duration-200 hover:border-primary/30 hover:-translate-y-0.5 hover:shadow-lg ${
                      isNext ? "border-emerald-200 bg-emerald-50/30 dark:border-emerald-800 dark:bg-emerald-950/20" : ""
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className={`font-semibold text-sm ${
                                isNext ? "text-emerald-900 dark:text-emerald-100" : "text-foreground"
                              }`}>
                                {milestone.title}
                              </h3>
                              {milestoneStatusBadge(milestone.status)}
                              {isNext && (
                                <Badge variant="outline" className="text-xs bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900 dark:text-emerald-100">
                                  Next
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <BookOpen className="h-3 w-3" />
                                {milestone.stepCount || 0} steps
                              </span>
                              {milestone.stepCount > 0 && (
                                <span>
                                  {milestone.completedSteps}/{milestone.stepCount} completed
                                </span>
                              )}
                              <span className="font-medium tabular-nums text-primary">
                                {Math.round(milestone.capabilityScore || 0)}% capability
                              </span>
                            </div>
                            
                            {milestone.stepCount > 0 && (
                              <Progress value={milestone.stepProgressPct} className="h-1.5 w-full max-w-xs" />
                            )}
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 flex-shrink-0 ml-3" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
