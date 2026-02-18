"use client";

import { QuizPanelProvider } from "@/components/quiz-panel-context";
import { QuizPanel } from "@/components/quiz-panel";
import { Sidebar } from "@/components/sidebar";

export function DashboardShell({ tracks, overallScore, children }) {
  return (
    <QuizPanelProvider>
      <div className="app-shell">
        <Sidebar tracks={tracks} overallScore={overallScore} />
        <main className="app-main">{children}</main>
        <QuizPanel />
      </div>
    </QuizPanelProvider>
  );
}
