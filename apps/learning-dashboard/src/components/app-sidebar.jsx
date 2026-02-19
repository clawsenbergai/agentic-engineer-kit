"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  AlertTriangle,
  Settings,
  GraduationCap,
} from "lucide-react";

function statusColor(status) {
  if (status === "on_track") return "bg-primary";
  if (status === "gap") return "bg-destructive";
  return "bg-muted-foreground/30";
}

export function AppSidebar({ tracks, overallScore }) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-[280px] flex-col border-r border-border bg-sidebar">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-2">
        <GraduationCap className="h-5 w-5 text-primary" />
        <Link href="/" className="text-sm font-semibold tracking-tight text-sidebar-foreground">
          Agentic Engineer
        </Link>
      </div>

      {/* Overall score */}
      <div className="px-5 pb-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Overall</span>
          <span className="font-medium text-foreground">{Math.round(overallScore)}%</span>
        </div>
        <Progress value={overallScore} className="mt-1.5 h-1.5" />
      </div>

      <Separator />

      {/* Track list */}
      <ScrollArea className="flex-1 px-3 py-3">
        <nav className="flex flex-col gap-0.5">
          {tracks.map((track) => {
            const isActive =
              pathname === `/tracks/${track.id}` ||
              pathname.startsWith(`/tracks/${track.id}/`);

            return (
              <Link
                key={track.id}
                href={`/tracks/${track.id}`}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
              >
                <div className={cn("h-2 w-2 rounded-full shrink-0", statusColor(track.status))} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium leading-tight">{track.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {track.stepProgressPct !== undefined 
                        ? `${Math.round(track.stepProgressPct)}%`
                        : `${Math.round(track.score)}%`}
                    </span>
                    {track.stepProgressPct !== undefined && (
                      <Progress 
                        value={track.stepProgressPct} 
                        className="h-1 w-8" 
                      />
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <Separator />

      {/* Footer links */}
      <div className="grid grid-cols-3 gap-1 p-3">
        {[
          { href: "/evidence", label: "Evidence", icon: BookOpen },
          { href: "/gaps", label: "Gaps", icon: AlertTriangle },
          { href: "/settings", label: "Settings", icon: Settings },
        ].map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center gap-1 rounded-md px-2 py-2 text-xs transition-colors",
              pathname === href
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
