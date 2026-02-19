import { getSettingsHealth } from "@/lib/repository";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function SettingsPage() {
  let health = null;
  try { health = await getSettingsHealth(); } catch { health = null; }

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Dashboard configuration and system health.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">System Health</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {health ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Storage mode</span>
                <Badge variant={health.mode === "supabase" ? "default" : "secondary"}>{health.mode}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">OpenAI</span>
                <Badge variant={health.providerStatus?.openai === "configured" ? "default" : "destructive"}>{health.providerStatus?.openai || "unknown"}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Claude</span>
                <Badge variant={health.providerStatus?.claude === "configured" ? "default" : "secondary"}>{health.providerStatus?.claude || "unknown"}</Badge>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Unable to load health status.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
