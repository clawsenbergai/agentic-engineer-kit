"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  Video,
  FileText,
  Wrench,
  Hammer,
  HelpCircle,
  CheckSquare,
  Check,
  Square,
  ExternalLink,
  Loader2,
  CheckCircle2,
  Circle,
} from "lucide-react";

const STEP_EMOJI = {
  read: "📖", watch: "🎥", article: "📝", setup: "🔧",
  build: "🏗️", quiz: "🧪", evidence: "✅",
};

function YouTubeEmbed({ url }) {
  const videoId = url.match(/(?:v=|youtu\.be\/)([^&\s]+)/)?.[1];
  if (!videoId) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-primary hover:underline">
        <ExternalLink className="h-4 w-4" /> Watch video
      </a>
    );
  }
  return (
    <div className="w-full max-w-[640px]">
      <div className="aspect-video rounded-lg overflow-hidden border border-border/30">
        <iframe src={`https://www.youtube.com/embed/${videoId}`}
          className="h-full w-full" allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
      </div>
    </div>
  );
}

function StepContent({ step, onToggle, onQuizSubmit, isSubmitting }) {
  const [answer, setAnswer] = useState("");
  const [quizResult, setQuizResult] = useState(null);

  const handleQuizSubmit = async () => {
    if (answer.trim().length < 20) { toast.error("Answer must be at least 20 characters"); return; }
    const result = await onQuizSubmit(step, answer);
    if (result) setQuizResult(result);
  };

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Step title */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{STEP_EMOJI[step.type]}</span>
          <span className="capitalize">{step.type}</span>
        </div>
        <h2 className="text-xl font-semibold">{step.title}</h2>
      </div>

      {/* Video */}
      {step.url && step.type === "watch" && <YouTubeEmbed url={step.url} />}

      {/* External link */}
      {step.url && step.type !== "watch" && (
        <a href={step.url} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-medium">
          <ExternalLink className="h-4 w-4" /> Open resource ↗
        </a>
      )}

      {/* Article / markdown content */}
      {step.contentMarkdown && (
        <div className="prose prose-invert prose-sm max-w-none leading-relaxed
          [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-6 [&_h2]:mb-2
          [&_h3]:text-sm [&_h3]:font-medium [&_h3]:text-foreground [&_h3]:mt-4 [&_h3]:mb-1
          [&_p]:my-2 [&_p]:text-muted-foreground [&_ul]:my-2 [&_ol]:my-2 [&_li]:my-0.5 [&_li]:text-muted-foreground
          [&_strong]:text-foreground
          [&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-xs
          [&_pre]:rounded-lg [&_pre]:bg-muted [&_pre]:p-3 [&_pre]:my-3 [&_pre]:text-xs">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{step.contentMarkdown}</ReactMarkdown>
        </div>
      )}

      {/* Setup validation */}
      {step.type === "setup" && step.validationCommand && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">Verify with:</p>
          <code className="block rounded-lg bg-muted px-3 py-2 text-xs font-mono">{step.validationCommand}</code>
        </div>
      )}

      {/* Quiz */}
      {step.type === "quiz" && (
        <div className="space-y-4">
          {quizResult ? (
            <div className="rounded-lg border border-border p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant={quizResult.score >= 70 ? "default" : "destructive"}>
                  Score: {quizResult.score}/100
                </Badge>
                {quizResult.score >= 70 && <span className="text-xs text-emerald-400">Passed ✓</span>}
              </div>
              <p className="text-sm text-muted-foreground">{quizResult.feedback}</p>
            </div>
          ) : (
            <>
              <Textarea placeholder="Write your answer here..." value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="min-h-[120px] resize-y text-sm" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{answer.length}/20 min</span>
                <Button onClick={handleQuizSubmit} size="sm"
                  disabled={isSubmitting || answer.trim().length < 20}>
                  {isSubmitting ? <><Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> Scoring...</> : "Submit"}
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Evidence */}
      {step.type === "evidence" && !step.completed && (
        <p className="text-sm text-muted-foreground italic">
          Link an artifact as proof of completion to check this off.
        </p>
      )}

      {/* Evidence */}
    </div>
  );
}

export function MilestoneDetailClient({ milestone, track, initialSteps, evidence, gaps, trackId }) {
  const [steps, setSteps] = useState(initialSteps);
  const [selectedStep, setSelectedStep] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const completedCount = steps.filter((s) => s.completed).length;
  const progressPct = steps.length > 0 ? (completedCount / steps.length) * 100 : 0;

  useEffect(() => {
    if (steps.length > 0 && !selectedStep) {
      setSelectedStep(steps.find(s => !s.completed) || steps[0]);
    }
  }, [steps, selectedStep]);

  const handleToggle = useCallback(async (stepId) => {
    setSteps((prev) => prev.map((s) =>
      s.id === stepId ? { ...s, completed: !s.completed, completedAt: !s.completed ? new Date().toISOString() : null } : s
    ));
    // Also update selectedStep if it's the one being toggled
    setSelectedStep(prev => prev?.id === stepId
      ? { ...prev, completed: !prev.completed, completedAt: !prev.completed ? new Date().toISOString() : null }
      : prev
    );
    try {
      const res = await fetch(`/api/steps/${stepId}/toggle`, { method: "POST" });
      if (!res.ok) throw new Error();
      toast.success("Step updated");
    } catch {
      setSteps((prev) => prev.map((s) =>
        s.id === stepId ? { ...s, completed: !s.completed, completedAt: s.completed ? null : new Date().toISOString() } : s
      ));
      toast.error("Failed to update");
    }
  }, []);

  const handleQuizSubmit = useCallback(async (step, answer) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/quiz/submit", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trackId: milestone.trackId, milestoneId: milestone.id,
          questionType: "explain_back", questionText: step.contentMarkdown || step.title, userAnswer: answer,
        }),
      });
      if (!res.ok) throw new Error();
      const result = await res.json();
      toast.success(`Score: ${result.score}/100`);
      setSteps(prev => prev.map(s => s.id === step.id ? { ...s, completed: true, completedAt: new Date().toISOString() } : s));
      return result;
    } catch { toast.error("Failed to submit"); return null; }
    finally { setIsSubmitting(false); }
  }, [milestone]);

  if (steps.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No steps defined for this milestone yet.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-100px)]">
      {/* Main content */}
      <div className="flex-1 min-w-0 pr-8">
        <h1 className="text-xl font-bold tracking-tight mb-1">{milestone.title}</h1>
        <p className="text-sm text-muted-foreground mb-6">{milestone.theoryMarkdown}</p>

        {selectedStep && (
          <StepContent step={selectedStep} onToggle={handleToggle}
            onQuizSubmit={handleQuizSubmit} isSubmitting={isSubmitting} />
        )}
      </div>

      {/* Right sidebar - full height sticky like left nav */}
      <aside className="w-60 shrink-0 border-l border-border/30">
        <div className="sticky top-0 h-screen overflow-y-auto py-4 pl-4 pr-2">
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium tabular-nums">{completedCount}/{steps.length}</span>
            </div>
            <Progress value={progressPct} className="h-1.5" />
          </div>

          <div className="space-y-0.5">
            {steps.map((step, i) => {
              const isSelected = selectedStep?.id === step.id;
              return (
                <button key={step.id} onClick={() => setSelectedStep(step)}
                  className={cn(
                    "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors",
                    isSelected ? "bg-emerald-950/30 text-foreground" : "hover:bg-muted/50 text-muted-foreground",
                  )}>
                  <span onClick={(e) => { e.stopPropagation(); handleToggle(step.id); }}
                    className="shrink-0 hover:scale-110 transition-transform cursor-pointer">
                    {step.completed
                      ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      : <span className={cn(
                          "w-3.5 h-3.5 rounded-full border text-[9px] flex items-center justify-center",
                          isSelected ? "border-emerald-500 text-emerald-500" : "border-muted-foreground/40"
                        )}>{i + 1}</span>
                    }
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={cn(
                      "text-[11px] font-medium truncate leading-tight",
                      step.completed && "line-through opacity-60"
                    )}>{step.title}</p>
                    <p className="text-[9px] text-muted-foreground capitalize">{step.type}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </aside>
    </div>
  );
}
