import { getGaps } from "@/lib/repository";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function GapsPage() {
  let gaps = [];
  try { gaps = await getGaps(); } catch { gaps = []; }

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Gaps</h1>
        <p className="text-sm text-muted-foreground">Knowledge gaps identified across your learning tracks.</p>
      </div>

      {gaps.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex items-center justify-center p-12">
            <p className="text-sm text-muted-foreground">No gaps identified yet. Complete quizzes and milestones to discover gaps.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {gaps.map((gap) => (
            <Card key={gap.id} className="border-border/50">
              <CardContent className="flex items-center justify-between p-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{gap.title}</p>
                  <p className="text-xs text-muted-foreground">{gap.detail}</p>
                </div>
                <Badge variant={gap.severity === "high" ? "destructive" : gap.severity === "medium" ? "outline" : "secondary"}>{gap.severity}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
