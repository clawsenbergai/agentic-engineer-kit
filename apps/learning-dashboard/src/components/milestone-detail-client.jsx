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
        className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
      >
        <ExternalLink className="h-3.5 w-3.5" />
        Watch video
      </a>
    );
  }
  
  return (
    <div className="max-w-[560px] w-full">
      <div className="aspect-video overflow-hidden rounded-lg border border-border/50 shadow-sm">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Video content"
        />
      </div>
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
      "border-border/50 transition-all relative hover:shadow-sm",
      step.completed && "border-primary/20 bg-primary/5",
      isCurrentStep && "border-l-4 border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-sm"
    )}>
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          {/* Completion checkbox */}
          {step.type !== "quiz" && (
            <button
              onClick={() => onToggle(step.id)}
              className="mt-1 text-muted-foreground transition-colors hover:text-primary flex-shrink-0"
            >
              {step.completed ? (
                <Check className="h-4 w-4 text-primary" />
              ) : (
                <Square className="h-4 w-4" />
              )}
            </button>
          )}

          <div className="flex-1 space-y-2">
            {/* Header */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm">{STEP_EMOJI[step.type]}</span>
              <Badge variant="outline" className="text-xs capitalize px-1.5 py-0.5">
                {step.type}
              </Badge>
              {isCurrentStep && (
                <Badge className="text-xs bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900 dark:text-emerald-100 dark:border-emerald-700 px-2 py-0.5">
                  ← You are here
                </Badge>
              )}
              <h3 className={cn(
                "text-sm font-medium text-foreground",
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
              <div className="prose prose-invert prose-sm max-w-none text-sm leading-relaxed text-muted-foreground 
                [&_h1]:text-lg [&_h1]:font-semibold [&_h1]:text-foreground [&_h1]:mt-4 [&_h1]:mb-2
                [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-3 [&_h2]:mb-1.5
                [&_h3]:text-sm [&_h3]:font-medium [&_h3]:text-foreground [&_h3]:mt-2 [&_h3]:mb-1
                [&_p]:my-2 [&_ul]:my-2 [&_ol]:my-2 [&_li]:my-0.5
                [&_strong]:text-foreground [&_strong]:font-medium
                [&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-xs [&_code]:font-mono
                [&_pre]:rounded-lg [&_pre]:bg-muted [&_pre]:p-3 [&_pre]:my-3 [&_pre]:text-xs
                [&_blockquote]:border-l-2 [&_blockquote]:border-primary/30 [&_blockquote]:pl-3 [&_blockquote]:italic">
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
              <div className="space-y-3 mt-1">
                {quizResult ? (
                  <div className="space-y-3 rounded-lg border border-border bg-card p-4 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant={quizResult.score >= 70 ? "default" : quizResult.score >= 50 ? "outline" : "destructive"}>
                        Score: {quizResult.score}/100
                      </Badge>
                      {quizResult.score >= 70 && <span className="text-sm text-emerald-600 dark:text-emerald-400">✓ Passed</span>}
                    </div>
                    <div className="text-sm text-muted-foreground leading-relaxed">
                      <strong className="text-foreground">Feedback:</strong><br />
                      {quizResult.feedback}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-foreground">Your Answer:</label>
                      <Textarea
                        placeholder="Write your answer here (minimum 20 characters)..."
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        className="min-h-[120px] resize-y text-sm leading-relaxed"
                      />
                      <p className="text-xs text-muted-foreground">
                        {answer.length}/20 characters minimum
                      </p>
                    </div>
                    <Button
                      onClick={handleQuizSubmit}
                      disabled={isSubmitting || answer.trim().length < 20}
                      size="sm"
                      className="gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Scoring...
                        </>
                      ) : (
                        <>
                          <HelpCircle className="h-4 w-4" />
                          Submit Answer
                        </>
                      )}
                    </Button>
                  </div>
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
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col gap-8">
        {/* Header - Course lesson style */}
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">{milestone.title}</h1>
            {milestone.theoryMarkdown && (
              <div className="prose prose-invert prose-base max-w-none text-muted-foreground leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {milestone.theoryMarkdown}
                </ReactMarkdown>
              </div>
            )}
          </div>
          
          {/* Progress section */}
          <div className="bg-card/50 border border-border/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Lesson Progress</span>
              <span className="text-sm font-medium tabular-nums text-primary">
                {completedCount}/{steps.length} completed
              </span>
            </div>
            <Progress value={progressPct} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Complete all steps to finish this milestone
            </p>
          </div>
        </div>

        {/* Steps - Lesson content */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Lesson Steps</h2>
          <div className="flex flex-col gap-2">
            {steps.map((step, index) => (
              <div key={step.id} className="relative">
                {/* Step number indicator */}
                <div className="absolute -left-8 top-3 w-6 h-6 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">{index + 1}</span>
                </div>
                <StepCard
                  step={step}
                  onToggle={handleToggle}
                  onQuizSubmit={handleQuizSubmit}
                  isSubmitting={isSubmitting}
                  isCurrentStep={currentStep && currentStep.id === step.id}
                />
              </div>
            ))}
            {steps.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="flex items-center justify-center p-8">
                  <div className="text-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                      No steps defined for this milestone yet.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
