import { getAllEvidence } from "@/lib/repository";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function EvidencePage() {
  const evidence = await getAllEvidence();

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Evidence</h1>
        <p className="text-sm text-muted-foreground">Artifacts and proof of completed work.</p>
      </div>

      {evidence.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex items-center justify-center p-12">
            <p className="text-sm text-muted-foreground">No evidence linked yet. Complete milestones and link artifacts to build your evidence.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {evidence.map((item) => (
            <Card key={item.id} className="border-border/50">
              <CardContent className="flex items-center justify-between p-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                  <p className="text-xs text-muted-foreground">{item.trackName} → {item.milestoneTitle || "Unmapped"}</p>
                </div>
                <Badge variant={item.status === "valid" ? "default" : "secondary"}>{item.status}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
