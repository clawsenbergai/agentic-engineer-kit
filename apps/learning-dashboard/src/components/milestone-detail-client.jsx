"use client";

import { useState, useCallback, useEffect } from "react";
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
  CheckCircle,
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
  read: "📖",
  watch: "🎥",
  article: "📝",
  setup: "🔧",
  build: "🏗️",
  quiz: "🧪",
  evidence: "✅",
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
    <div className="max-w-[640px] w-full">
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

function StepSidebarItem({ step, index, isSelected, onClick, onToggle }) {
  const Icon = STEP_ICONS[step.type] || FileText;
  
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all",
        "hover:bg-muted/50",
        isSelected && "bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800",
        step.completed && "opacity-75"
      )}
      onClick={() => onClick(step)}
    >
      {/* Step number */}
      <div className={cn(
        "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
        step.completed 
          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100"
          : isSelected
          ? "bg-emerald-500 text-white" 
          : "bg-muted text-muted-foreground"
      )}>
        {step.completed ? <Check className="h-3 w-3" /> : index + 1}
      </div>
      
      {/* Step info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-sm">{STEP_EMOJI[step.type]}</span>
          <Badge variant="outline" className="text-xs capitalize px-1.5 py-0.5 text-[10px]">
            {step.type}
          </Badge>
        </div>
        <h4 className={cn(
          "text-sm font-medium truncate",
          step.completed ? "line-through text-muted-foreground" : "text-foreground"
        )}>
          {step.title}
        </h4>
      </div>
      
      {/* Completion checkbox */}
      {step.type !== "quiz" && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle(step.id);
          }}
          className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
        >
          {step.completed ? (
            <CheckCircle className="h-4 w-4 text-emerald-600" />
          ) : (
            <Square className="h-4 w-4" />
          )}
        </button>
      )}
    </div>
  );
}

function StepContent({ step, onToggle, onQuizSubmit, isSubmitting }) {
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
    <div className="space-y-6">
      {/* Step header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{STEP_EMOJI[step.type]}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-sm capitalize px-2 py-1">
                {step.type}
              </Badge>
              {step.completed && (
                <Badge className="text-sm bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100">
                  ✓ Completed
                </Badge>
              )}
            </div>
            <h2 className="text-2xl font-bold text-foreground">{step.title}</h2>
          </div>
        </div>
        
        {/* Completion toggle for non-quiz steps */}
        {step.type !== "quiz" && (
          <Button
            variant={step.completed ? "secondary" : "default"}
            onClick={() => onToggle(step.id)}
            className="gap-2"
          >
            {step.completed ? (
              <>
                <CheckCircle className="h-4 w-4" />
                Mark as incomplete
              </>
            ) : (
              <>
                <Square className="h-4 w-4" />
                Mark as complete
              </>
            )}
          </Button>
        )}
      </div>

      <Separator />

      {/* Content */}
      <div className="space-y-6">
        {/* URL link for watch (YouTube embed) */}
        {step.url && step.type === "watch" && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Video Content</h3>
            <YouTubeEmbed url={step.url} />
          </div>
        )}
        
        {/* URL link for other types */}
        {step.url && step.type !== "watch" && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">External Resource</h3>
            <a
              href={step.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
            >
              <ExternalLink className="h-4 w-4" />
              Open resource
            </a>
          </div>
        )}

        {/* Markdown content */}
        {step.contentMarkdown && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Instructions</h3>
            <div className="prose prose-invert max-w-none text-base leading-relaxed
              [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-foreground [&_h1]:mt-6 [&_h1]:mb-3
              [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-4 [&_h2]:mb-2
              [&_h3]:text-base [&_h3]:font-medium [&_h3]:text-foreground [&_h3]:mt-3 [&_h3]:mb-2
              [&_p]:my-3 [&_ul]:my-3 [&_ol]:my-3 [&_li]:my-1
              [&_strong]:text-foreground [&_strong]:font-semibold
              [&_code]:rounded [&_code]:bg-muted [&_code]:px-2 [&_code]:py-1 [&_code]:text-sm [&_code]:font-mono
              [&_pre]:rounded-lg [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:my-4 [&_pre]:text-sm
              [&_blockquote]:border-l-4 [&_blockquote]:border-primary/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {step.contentMarkdown}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* Setup: validation command */}
        {step.type === "setup" && step.validationCommand && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Verification</h3>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Run this command to verify setup:</p>
              <code className="block rounded-lg bg-muted px-4 py-3 text-sm font-mono">
                {step.validationCommand}
              </code>
            </div>
          </div>
        )}

        {/* Quiz: answer textarea + submit */}
        {step.type === "quiz" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Quiz</h3>
            {quizResult ? (
              <Card className="border-border bg-card shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <Badge variant={quizResult.score >= 70 ? "default" : quizResult.score >= 50 ? "outline" : "destructive"} className="text-sm">
                      Score: {quizResult.score}/100
                    </Badge>
                    {quizResult.score >= 70 && (
                      <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">✓ Passed</span>
                    )}
                  </div>
                  <div className="text-base text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Feedback:</strong><br />
                    {quizResult.feedback}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Your Answer:</label>
                  <Textarea
                    placeholder="Write your answer here (minimum 20 characters)..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="min-h-[150px] resize-y text-base leading-relaxed"
                  />
                  <p className="text-sm text-muted-foreground">
                    {answer.length}/20 characters minimum
                  </p>
                </div>
                <Button
                  onClick={handleQuizSubmit}
                  disabled={isSubmitting || answer.trim().length < 20}
                  size="lg"
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
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Evidence Required</h3>
            <p className="text-base text-muted-foreground italic">
              Link an artifact as proof of completion to check this step off.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function MilestoneDetailClient({ milestone, track, initialSteps, evidence, gaps, trackId }) {
  const [steps, setSteps] = useState(initialSteps);
  const [selectedStep, setSelectedStep] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const completedCount = steps.filter((s) => s.completed).length;
  const progressPct = steps.length > 0 ? (completedCount / steps.length) * 100 : 0;
  
  // Auto-select first incomplete step on load, or first step if all complete
  useEffect(() => {
    if (steps.length > 0 && !selectedStep) {
      const firstIncomplete = steps.find(step => !step.completed);
      setSelectedStep(firstIncomplete || steps[0]);
    }
  }, [steps, selectedStep]);

  const handleStepClick = useCallback((step) => {
    setSelectedStep(step);
  }, []);

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

  if (steps.length === 0) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="space-y-6">
          {/* Header */}
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
          
          <Card className="border-dashed">
            <CardContent className="flex items-center justify-center p-12">
              <div className="text-center">
                <BookOpen className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-lg text-muted-foreground">
                  No steps defined for this milestone yet.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="space-y-6">
        {/* Header */}
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

        {/* Two-column layout */}
        <div className="grid grid-cols-12 gap-8">
          {/* Main content area - 70% */}
          <div className="col-span-8">
            {selectedStep ? (
              <StepContent
                step={selectedStep}
                onToggle={handleToggle}
                onQuizSubmit={handleQuizSubmit}
                isSubmitting={isSubmitting}
              />
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-lg text-muted-foreground">Select a step to begin</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - 30% */}
          <div className="col-span-4">
            <div className="sticky top-6 space-y-6">
              {/* Progress */}
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Progress</span>
                    <span className="text-sm font-medium tabular-nums text-primary">
                      {completedCount}/{steps.length} steps completed
                    </span>
                  </div>
                  <Progress value={progressPct} className="h-2" />
                </CardContent>
              </Card>

              {/* Steps navigation */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Course Steps</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-2">
                  {steps.map((step, index) => (
                    <StepSidebarItem
                      key={step.id}
                      step={step}
                      index={index}
                      isSelected={selectedStep && selectedStep.id === step.id}
                      onClick={handleStepClick}
                      onToggle={handleToggle}
                    />
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
