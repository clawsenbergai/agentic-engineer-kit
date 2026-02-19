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
import { Card } from "@/components/ui/card";
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
  CheckCircle2,
  Circle,
  NotebookPen,
  PlayCircle,
  Upload,
  Copy,
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

function StepNotes({ stepId, initialNotes }) {
  const [notes, setNotes] = useState(initialNotes || "");
  const [saving, setSaving] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
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
    const text = e.target.value;
    setNotes(text);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => save(text), 1000);
  };

  return (
    <div className="pt-8">
      <Card className="p-4 bg-card/50 border-border/50 transition-all duration-200 hover:border-border/80">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <NotebookPen className="h-4 w-4 text-emerald-500" />
            <label className="text-sm font-medium text-foreground">My Notes</label>
            {saving && <span className="text-xs text-muted-foreground ml-auto">Saving...</span>}
          </div>
          <Textarea 
            value={notes} 
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={!notes && !isFocused ? "💭 Capture your insights, questions, and key takeaways here..." : "Write your learning notes here..."}
            className={cn(
              "min-h-[100px] resize-y text-sm transition-all duration-200",
              "bg-background/80 border-border/40 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20",
              !notes && !isFocused && "text-muted-foreground/60"
            )}
          />
          {!notes && !isFocused && (
            <p className="text-xs text-muted-foreground/70 italic">
              ✨ Pro tip: Take notes while you learn to improve retention
            </p>
          )}
        </div>
      </Card>
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

  const getStepIcon = () => {
    switch (step.type) {
      case 'watch': return <PlayCircle className="h-5 w-5 text-emerald-500" />;
      case 'read': return <BookOpen className="h-5 w-5 text-blue-500" />;
      case 'article': return <FileText className="h-5 w-5 text-purple-500" />;
      case 'setup': return <Wrench className="h-5 w-5 text-orange-500" />;
      case 'build': return <Hammer className="h-5 w-5 text-amber-500" />;
      case 'quiz': return <HelpCircle className="h-5 w-5 text-red-500" />;
      case 'evidence': return <Upload className="h-5 w-5 text-green-500" />;
      default: return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getInstructionText = () => {
    switch (step.type) {
      case 'watch': return "📺 Watch this video carefully and take notes on the key concepts";
      case 'read': return "📖 Read this resource thoroughly and capture important insights below";
      case 'article': return "📝 Study the content below and note down your key learnings";
      case 'setup': return "🔧 Follow the setup instructions and run the validation command";
      case 'build': return "🛠️ Complete this hands-on exercise step by step";
      case 'quiz': return "🧪 Test your knowledge by answering the question below";
      case 'evidence': return "✅ Upload or link your completed work as evidence";
      default: return "";
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Step Header Card */}
      <Card className="p-6 bg-card/30 border-border/50">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {getStepIcon()}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline" className="capitalize text-xs">
                {step.type}
              </Badge>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-foreground leading-tight">{step.title}</h2>
          {getInstructionText() && (
            <p className="text-sm text-muted-foreground bg-muted/30 rounded-lg p-3 border-l-4 border-emerald-500/50">
              {getInstructionText()}
            </p>
          )}
        </div>
      </Card>

      {/* Video Content */}
      {step.url && step.type === "watch" && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <PlayCircle className="h-4 w-4 text-emerald-500" />
            Video Lesson
          </div>
          <YouTubeEmbed url={step.url} />
        </Card>
      )}

      {/* External Resource */}
      {step.url && step.type !== "watch" && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <ExternalLink className="h-4 w-4 text-blue-500" />
            External Resource
          </div>
          <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
            <a href={step.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Resource
            </a>
          </Button>
        </Card>
      )}

      {/* Article Content */}
      {step.contentMarkdown && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <FileText className="h-4 w-4 text-purple-500" />
            Article Content
          </div>
          <div className="pl-4 border-l-2 border-border/30">
            <div className="prose prose-invert prose-sm max-w-none leading-relaxed
              [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-6 [&_h2]:mb-2
              [&_h3]:text-sm [&_h3]:font-medium [&_h3]:text-foreground [&_h3]:mt-4 [&_h3]:mb-1
              [&_p]:my-2 [&_p]:text-muted-foreground [&_ul]:my-2 [&_ol]:my-2 [&_li]:my-0.5 [&_li]:text-muted-foreground
              [&_strong]:text-foreground
              [&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-xs
              [&_pre]:rounded-lg [&_pre]:bg-muted [&_pre]:p-3 [&_pre]:my-3 [&_pre]:text-xs">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{step.contentMarkdown}</ReactMarkdown>
            </div>
          </div>
        </Card>
      )}

      {/* Setup Validation */}
      {step.type === "setup" && step.validationCommand && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Wrench className="h-4 w-4 text-orange-500" />
            Validation Required
          </div>
          <p className="text-sm text-muted-foreground">Run this command to verify your setup:</p>
          <div className="relative">
            <code className="block rounded-lg bg-muted/50 border border-border/50 px-4 py-3 text-sm font-mono pr-10">
              {step.validationCommand}
            </code>
            <Button 
              size="sm" 
              variant="ghost"
              className="absolute right-2 top-2 h-6 w-6 p-0"
              onClick={() => navigator.clipboard.writeText(step.validationCommand)}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </Card>
      )}

      {/* Quiz */}
      {step.type === "quiz" && (
        <Card className="p-6 space-y-6 border-2 border-border/50">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-red-500" />
            <span className="text-lg font-semibold">Knowledge Check</span>
          </div>
          
          {quizResult ? (
            <div className="space-y-4">
              <div className="rounded-lg border border-border/50 p-4 space-y-3 bg-muted/20">
                <div className="flex items-center gap-3">
                  <Badge variant={quizResult.score >= 70 ? "default" : "destructive"} className="text-sm">
                    Score: {quizResult.score}/100
                  </Badge>
                  {quizResult.score >= 70 && (
                    <span className="text-sm text-emerald-400 font-medium">✅ Passed</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{quizResult.feedback}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Your Answer:</label>
                <Textarea 
                  placeholder="Write a detailed answer demonstrating your understanding..." 
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="min-h-[120px] resize-y text-sm border-border/50 focus:border-emerald-500/50" 
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {answer.length}/20 characters minimum
                </span>
                <Button 
                  onClick={handleQuizSubmit} 
                  size="sm"
                  disabled={isSubmitting || answer.trim().length < 20}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" />
                      Scoring...
                    </>
                  ) : (
                    "Submit Answer"
                  )}
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Build Exercise */}
      {step.type === "build" && (
        <Card className="p-6 space-y-4 border-l-4 border-amber-500/50">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Hammer className="h-4 w-4 text-amber-500" />
            Hands-On Exercise
          </div>
          <p className="text-sm text-muted-foreground">
            Complete the exercise requirements and document your progress in the notes below.
          </p>
        </Card>
      )}

      {/* Evidence Submission */}
      {step.type === "evidence" && !step.completed && (
        <Card className="p-6 space-y-4 border-2 border-dashed border-border/50">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Upload className="h-4 w-4 text-green-500" />
            Submit Evidence
          </div>
          <div className="text-center py-8 space-y-2">
            <Upload className="h-12 w-12 text-muted-foreground/50 mx-auto" />
            <p className="text-sm text-muted-foreground">
              Upload files or provide links to demonstrate completion of this milestone
            </p>
            <p className="text-xs text-muted-foreground/70">
              Supported formats: images, documents, code repositories, live demos
            </p>
          </div>
        </Card>
      )}

      {/* Notes Section */}
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
    <div className="flex min-h-[calc(100vh-100px)] gap-8">
      {/* Main content */}
      <div className="flex-1 min-w-0 space-y-8">
        {/* Milestone Header */}
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="px-2 py-1 bg-muted/50 rounded-md text-xs font-medium">
                {track?.title || "Course"}
              </span>
              <span>•</span>
              <span>Milestone</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {milestone.title}
            </h1>
          </div>
          {milestone.theoryMarkdown && (
            <p className="text-base text-muted-foreground leading-relaxed max-w-3xl">
              {milestone.theoryMarkdown}
            </p>
          )}
        </div>

        {selectedStep && (
          <div className="transition-all duration-300 ease-in-out">
            <StepContent step={selectedStep} onToggle={handleToggle}
              onQuizSubmit={handleQuizSubmit} isSubmitting={isSubmitting} />
          </div>
        )}
      </div>

      {/* Right sidebar - full height sticky like left nav */}
      <aside className="w-72 shrink-0">
        <div className="sticky top-0 h-screen overflow-y-auto">
          <div className="border-l border-border/30 pl-6 pr-2 py-6 space-y-6">
            {/* Progress Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Lesson Progress</span>
                <span className="text-sm font-medium tabular-nums text-muted-foreground">
                  {completedCount}/{steps.length}
                </span>
              </div>
              <Progress value={progressPct} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {completedCount === steps.length 
                  ? "🎉 All steps completed!" 
                  : `${steps.length - completedCount} steps remaining`
                }
              </p>
            </div>

            <Separator className="opacity-50" />

            {/* Steps List */}
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-foreground mb-3">Steps</h3>
              {steps.map((step, i) => {
                const isSelected = selectedStep?.id === step.id;
                return (
                  <div key={step.id}>
                    <button 
                      onClick={() => setSelectedStep(step)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all duration-200",
                        "hover:bg-muted/50",
                        isSelected && "bg-emerald-950/40 border border-emerald-500/30 shadow-sm",
                        isSelected && "border-l-2 border-l-emerald-500",
                      )}
                    >
                      <span 
                        onClick={(e) => { e.stopPropagation(); handleToggle(step.id); }}
                        className={cn(
                          "shrink-0 transition-all duration-200 cursor-pointer",
                          "hover:scale-110 active:scale-95"
                        )}
                      >
                        {step.completed ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <span className={cn(
                            "w-4 h-4 rounded-full border flex items-center justify-center text-[10px] font-medium transition-colors",
                            isSelected 
                              ? "border-emerald-500 text-emerald-400 bg-emerald-500/10" 
                              : "border-muted-foreground/40 text-muted-foreground hover:border-muted-foreground"
                          )}>
                            {i + 1}
                          </span>
                        )}
                      </span>
                      <div className="min-w-0 flex-1 space-y-1">
                        <p className={cn(
                          "text-sm font-medium leading-tight",
                          step.completed 
                            ? "line-through opacity-60 text-muted-foreground" 
                            : isSelected 
                              ? "text-foreground" 
                              : "text-muted-foreground group-hover:text-foreground",
                        )}>
                          {step.title}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 capitalize">
                            {step.type}
                          </Badge>
                          {step.completed && (
                            <span className="text-[10px] text-emerald-500">✓</span>
                          )}
                        </div>
                      </div>
                    </button>
                    {i < steps.length - 1 && (
                      <Separator className="my-1 opacity-20" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
