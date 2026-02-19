"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { ExternalLink, Loader2, CheckCircle2, PenLine } from "lucide-react";

function YouTubeEmbed({ url }) {
  const videoId = url?.match(/(?:v=|youtu\.be\/)([^&\s]+)/)?.[1];
  if (!videoId) return null;
  return (
    <div className="w-full max-w-[640px]">
      <div className="aspect-video rounded-lg overflow-hidden border border-border/20">
        <iframe src={`https://www.youtube.com/embed/${videoId}`}
          className="h-full w-full" allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
      </div>
    </div>
  );
}

function StepNotes({ stepId, initialNotes }) {
  const [notes, setNotes] = useState(initialNotes || "");
  const [saving, setSaving] = useState(false);
  const timeoutRef = useRef(null);

  const save = useCallback(async (text) => {
    setSaving(true);
    try {
      await fetch(`/api/steps/${stepId}/notes`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: text }),
      });
    } catch {} finally { setSaving(false); }
  }, [stepId]);

  const handleChange = (e) => {
    setNotes(e.target.value);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => save(e.target.value), 1000);
  };

  return (
    <div className="space-y-2 pt-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <PenLine className="h-3 w-3" />
          <span>Notes</span>
        </div>
        {saving && <span className="text-[10px] text-muted-foreground animate-pulse">Saving...</span>}
      </div>
      <Textarea value={notes} onChange={handleChange}
        placeholder="What did you learn? What's still unclear?"
        className="min-h-[100px] resize-y text-sm border border-zinc-500 bg-zinc-900/50 focus:bg-zinc-900 focus:border-emerald-500 transition-colors rounded-lg placeholder:text-zinc-500" />
    </div>
  );
}

function StepContent({ step, onQuizSubmit, isSubmitting }) {
  const [answer, setAnswer] = useState("");
  const [quizResult, setQuizResult] = useState(null);

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Title */}
      <div>
        <span className="text-xs text-muted-foreground capitalize">{step.type}</span>
        <h2 className="text-lg font-semibold mt-0.5">{step.title}</h2>
      </div>

      {/* Video */}
      {step.type === "watch" && step.url && <YouTubeEmbed url={step.url} />}

      {/* External link */}
      {step.url && step.type !== "watch" && (
        <a href={step.url} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
          <ExternalLink className="h-3.5 w-3.5" /> Open resource
        </a>
      )}

      {/* Markdown content */}
      {step.contentMarkdown && (
        <div className="prose prose-invert prose-sm max-w-none
          [&_p]:text-muted-foreground [&_p]:my-2
          [&_strong]:text-foreground
          [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:mt-5 [&_h2]:mb-1
          [&_h3]:text-sm [&_h3]:font-medium [&_h3]:mt-3 [&_h3]:mb-1
          [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0 [&_li]:text-muted-foreground
          [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs
          [&_pre]:bg-muted [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:text-xs [&_pre]:my-3">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{step.contentMarkdown}</ReactMarkdown>
        </div>
      )}

      {/* Validation command */}
      {step.validationCommand && (
        <code className="block bg-muted px-3 py-2 rounded-lg text-xs font-mono">{step.validationCommand}</code>
      )}

      {/* Quiz */}
      {step.type === "quiz" && (
        <div className="space-y-3">
          {quizResult ? (
            <div className="space-y-2 p-3 rounded-lg border border-border/30">
              <Badge variant={quizResult.score >= 70 ? "default" : "destructive"}>
                {quizResult.score}/100
              </Badge>
              <p className="text-sm text-muted-foreground">{quizResult.feedback}</p>
            </div>
          ) : (
            <>
              <Textarea placeholder="Write your answer (min 20 chars)..." value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="min-h-[100px] text-sm" />
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">{answer.length} chars</span>
                <Button size="sm" disabled={isSubmitting || answer.length < 20}
                  onClick={async () => {
                    const result = await onQuizSubmit(step, answer);
                    if (result) setQuizResult(result);
                  }}>
                  {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Submit"}
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Notes */}
      <StepNotes stepId={step.id} initialNotes={step.notes} key={step.id} />
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
    setSteps(prev => prev.map(s => s.id === stepId ? { ...s, completed: !s.completed } : s));
    setSelectedStep(prev => prev?.id === stepId ? { ...prev, completed: !prev.completed } : prev);
    try {
      const res = await fetch(`/api/steps/${stepId}/toggle`, { method: "POST" });
      if (!res.ok) throw new Error();
    } catch {
      setSteps(prev => prev.map(s => s.id === stepId ? { ...s, completed: !s.completed } : s));
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
      setSteps(prev => prev.map(s => s.id === step.id ? { ...s, completed: true } : s));
      return result;
    } catch { toast.error("Failed to submit"); return null; }
    finally { setIsSubmitting(false); }
  }, [milestone]);

  if (!steps.length) {
    return <p className="text-muted-foreground py-12 text-center">No steps yet.</p>;
  }

  return (
    <div className="flex min-h-[calc(100vh-120px)]">
      {/* Content */}
      <div className="flex-1 min-w-0 pr-8">
        <h1 className="text-xl font-bold tracking-tight">{milestone.title}</h1>
        <p className="text-sm text-muted-foreground mt-1 mb-8">{milestone.theoryMarkdown}</p>

        {selectedStep && (
          <StepContent step={selectedStep}
            onQuizSubmit={handleQuizSubmit} isSubmitting={isSubmitting} />
        )}
      </div>

      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-l border-border/20">
        <div className="sticky top-0 h-screen overflow-y-auto py-4 pl-4 pr-2">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium tabular-nums">{completedCount}/{steps.length}</span>
          </div>
          <Progress value={progressPct} className="h-1 mb-4" />

          <div className="space-y-px">
            {steps.map((step, i) => {
              const active = selectedStep?.id === step.id;
              return (
                <button key={step.id} onClick={() => setSelectedStep(step)}
                  className={cn(
                    "w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-colors",
                    active ? "bg-emerald-950/40 border-l-2 border-emerald-500 pl-1.5" : "hover:bg-muted/40",
                  )}>
                  <span onClick={(e) => { e.stopPropagation(); handleToggle(step.id); }}
                    className="shrink-0 cursor-pointer hover:scale-110 transition-transform">
                    {step.completed
                      ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      : <span className={cn(
                          "w-3.5 h-3.5 rounded-full border text-[9px] flex items-center justify-center",
                          active ? "border-emerald-500 text-emerald-500" : "border-muted-foreground/30"
                        )}>{i + 1}</span>
                    }
                  </span>
                  <div className="min-w-0">
                    <p className={cn(
                      "text-[11px] font-medium truncate leading-tight",
                      step.completed && "line-through opacity-50"
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
