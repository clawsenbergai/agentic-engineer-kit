import { notFound } from "next/navigation";
import Link from "next/link";
import { getTrackById } from "@/lib/repository";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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

      {/* Milestone timeline */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Milestones
        </h2>
        <div className="relative flex flex-col gap-0">
          {milestones.map((milestone, index) => {
            const isLast = index === milestones.length - 1;
            const stepCount = milestone.stepCount || 0;

            return (
              <div key={milestone.id} className="relative flex gap-4">
                {/* Timeline line + icon */}
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 items-center justify-center">
                    {milestoneStatusIcon(milestone.status)}
                  </div>
                  {!isLast && (
                    <div className="w-px flex-1 bg-border" />
                  )}
                </div>

                {/* Milestone card */}
                <div className="flex-1 pb-6">
                  <Link href={`/tracks/${trackId}/milestones/${milestone.id}`}>
                    <Card className="group border-border/50 transition-all hover:border-border hover:-translate-y-0.5 hover:shadow-md">
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold">{milestone.title}</h3>
                            {milestoneStatusBadge(milestone.status)}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {Math.round(milestone.capabilityScore)}% capability
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
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
