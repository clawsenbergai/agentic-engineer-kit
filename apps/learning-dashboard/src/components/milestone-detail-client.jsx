"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
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
} from "lucide-react";

const STEP_ICONS = {
  read: BookOpen,
  watch: Video,
  article: FileText,
  setup: Wrench,
  build: Hammer,
  quiz: HelpCircle,
  evidence: CheckSquare,
};

const STEP_EMOJI = {
  read: "\uD83D\uDCD6",
  watch: "\uD83C\uDFA5",
  article: "\uD83D\uDCDD",
  setup: "\uD83D\uDD27",
  build: "\uD83C\uDFD7\uFE0F",
  quiz: "\uD83E\uDDEA",
  evidence: "\u2705",
};

function YouTubeEmbed({ url }) {
  const videoId = url.match(/(?:v=|youtu\.be\/)([^&\s]+)/)?.[1];
  if (!videoId) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
      >
        <ExternalLink className="h-3.5 w-3.5" />
        Watch video
      </a>
    );
  }
  
  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg border border-border/50">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Video content"
      />
    </div>
  );
}

function StepCard({ step, onToggle, onQuizSubmit, isSubmitting, isCurrentStep }) {
  const [answer, setAnswer] = useState("");
  const [quizResult, setQuizResult] = useState(null);
  const Icon = STEP_ICONS[step.type] || FileText;

  const handleQuizSubmit = async () => {
    if (answer.trim().length < 20) {
      toast.error("Answer must be at least 20 characters");
      return;
    }
    const result = await onQuizSubmit(step, answer);
    if (result) {
      setQuizResult(result);
    }
  };

  return (
    <Card className={cn(
      "border-border/50 transition-all relative",
      step.completed && "border-primary/20 bg-primary/5",
      isCurrentStep && "border-l-4 border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Completion checkbox */}
          {step.type !== "quiz" && (
            <button
              onClick={() => onToggle(step.id)}
              className="mt-0.5 text-muted-foreground transition-colors hover:text-primary"
            >
              {step.completed ? (
                <Check className="h-5 w-5 text-primary" />
              ) : (
                <Square className="h-5 w-5" />
              )}
            </button>
          )}

          <div className="flex-1 space-y-3">
            {/* Header */}
            <div className="flex items-center gap-2">
              <span className="text-sm">{STEP_EMOJI[step.type]}</span>
              <Badge variant="outline" className="text-xs capitalize">
                {step.type}
              </Badge>
              {isCurrentStep && (
                <Badge className="text-xs bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900 dark:text-emerald-100 dark:border-emerald-700">
                  ← You are here
                </Badge>
              )}
              <h3 className={cn(
                "text-sm font-medium",
                step.completed && "line-through text-muted-foreground"
              )}>
                {step.title}
              </h3>
            </div>

            {/* URL link for read/watch */}
            {step.url && step.type === "watch" && (
              <YouTubeEmbed url={step.url} />
            )}
            {step.url && step.type !== "watch" && (
              <a
                href={step.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Open resource
              </a>
            )}

            {/* Markdown content */}
            {step.contentMarkdown && (
              <div className="prose prose-invert prose-sm max-w-none text-sm leading-relaxed text-muted-foreground [&_h2]:text-foreground [&_h3]:text-foreground [&_strong]:text-foreground [&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-xs [&_pre]:rounded-lg [&_pre]:bg-muted [&_pre]:p-3">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {step.contentMarkdown}
                </ReactMarkdown>
              </div>
            )}

            {/* Setup: validation command */}
            {step.type === "setup" && step.validationCommand && (
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground">Verification command:</p>
                <code className="block rounded-md bg-muted px-3 py-2 text-xs font-mono">
                  {step.validationCommand}
                </code>
              </div>
            )}

            {/* Quiz: answer textarea + submit */}
            {step.type === "quiz" && (
              <div className="space-y-3">
                {quizResult ? (
                  <div className="space-y-2 rounded-lg border border-border bg-card p-4">
                    <div className="flex items-center gap-2">
                      <Badge variant={quizResult.score >= 70 ? "default" : quizResult.score >= 50 ? "outline" : "destructive"}>
                        Score: {quizResult.score}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{quizResult.feedback}</p>
                  </div>
                ) : (
                  <>
                    <Textarea
                      placeholder="Write your answer here (minimum 20 characters)..."
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      className="min-h-[120px] resize-y"
                    />
                    <Button
                      onClick={handleQuizSubmit}
                      disabled={isSubmitting || answer.trim().length < 20}
                      size="sm"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Scoring...
                        </>
                      ) : (
                        "Submit Answer"
                      )}
                    </Button>
                  </>
                )}
              </div>
            )}

            {/* Evidence: link prompt */}
            {step.type === "evidence" && !step.completed && (
              <p className="text-xs text-muted-foreground italic">
                Link an artifact as proof of completion to check this off.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function MilestoneDetailClient({ milestone, track, initialSteps, evidence, gaps, trackId }) {
  const [steps, setSteps] = useState(initialSteps);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const completedCount = steps.filter((s) => s.completed).length;
  const progressPct = steps.length > 0 ? (completedCount / steps.length) * 100 : 0;
  
  // Find the first incomplete step to highlight as current
  const currentStep = steps.find(step => !step.completed);

  const handleToggle = useCallback(async (stepId) => {
    // Optimistic update
    setSteps((prev) =>
      prev.map((s) =>
        s.id === stepId
          ? { ...s, completed: !s.completed, completedAt: !s.completed ? new Date().toISOString() : null }
          : s
      )
    );

    try {
      const res = await fetch(`/api/steps/${stepId}/toggle`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to toggle step");
      const newCount = steps.filter((s) => s.id === stepId ? !s.completed : s.completed).length;
      if (newCount === steps.length) {
        toast.success("Milestone complete! All steps finished.");
      } else {
        toast.success("Step updated");
      }
    } catch {
      // Revert
      setSteps((prev) =>
        prev.map((s) =>
          s.id === stepId
            ? { ...s, completed: !s.completed, completedAt: s.completed ? null : new Date().toISOString() }
            : s
        )
      );
      toast.error("Failed to update step");
    }
  }, [steps]);

  const handleQuizSubmit = useCallback(async (step, answer) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trackId: milestone.trackId,
          milestoneId: milestone.id,
          questionType: "explain_back",
          questionText: step.contentMarkdown || step.title,
          userAnswer: answer,
        }),
      });

      if (!res.ok) throw new Error("Quiz submission failed");
      const result = await res.json();
      toast.success(`Quiz scored: ${result.score}/100`);

      // Mark quiz step as completed
      setSteps((prev) =>
        prev.map((s) =>
          s.id === step.id ? { ...s, completed: true, completedAt: new Date().toISOString() } : s
        )
      );

      return result;
    } catch {
      toast.error("Failed to submit quiz");
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [milestone]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-2xl font-bold tracking-tight">{milestone.title}</h1>
        <p className="text-sm text-muted-foreground">{milestone.theoryMarkdown}</p>
        <div className="flex items-center gap-4">
          <Progress value={progressPct} className="h-2 flex-1" />
          <span className="text-sm font-medium tabular-nums text-muted-foreground">
            {completedCount}/{steps.length}
          </span>
        </div>
      </div>

      <Separator />

      {/* Steps */}
      <div className="flex flex-col gap-3">
        {steps.map((step) => (
          <StepCard
            key={step.id}
            step={step}
            onToggle={handleToggle}
            onQuizSubmit={handleQuizSubmit}
            isSubmitting={isSubmitting}
            isCurrentStep={currentStep && currentStep.id === step.id}
          />
        ))}
        {steps.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex items-center justify-center p-8">
              <p className="text-sm text-muted-foreground">
                No steps defined for this milestone yet.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
