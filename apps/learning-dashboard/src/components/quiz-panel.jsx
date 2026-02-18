"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";

import { useQuizPanel } from "@/components/quiz-panel-context";

function ownerHeaders() {
  if (typeof window === "undefined") return {};
  const token = window.localStorage.getItem("learning_dashboard_owner_token");
  if (!token) return {};
  return { "x-owner-token": token };
}

function pillTone(score) {
  if (score >= 80) return "good";
  if (score >= 50) return "warn";
  return "bad";
}

export function QuizPanel() {
  const router = useRouter();
  const { panelState, closeQuiz } = useQuizPanel();

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    setQuestion(null);
    setAnswer("");
    setResult(null);
    setErrorText("");
  }, [panelState.trackId, panelState.milestoneId]);

  const canSubmit = answer.trim().split(/\s+/).length >= 12;

  const header = useMemo(() => {
    if (!panelState.milestoneTitle) return "Milestone Quiz";
    return `Quiz: ${panelState.milestoneTitle}`;
  }, [panelState.milestoneTitle]);

  async function generateQuestion() {
    setErrorText("");
    setIsGenerating(true);

    try {
      const response = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...ownerHeaders(),
        },
        body: JSON.stringify({
          trackId: panelState.trackId,
          milestoneId: panelState.milestoneId,
          difficulty: "medium",
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Quiz generation failed");
      }

      setQuestion(data.question);
    } catch (error) {
      setErrorText(error.message || "Could not generate question");
    } finally {
      setIsGenerating(false);
    }
  }

  async function submitAnswer() {
    if (!question) return;
    setErrorText("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...ownerHeaders(),
        },
        body: JSON.stringify({
          trackId: panelState.trackId,
          milestoneId: panelState.milestoneId,
          questionType: question.questionType,
          questionText: question.questionText,
          userAnswer: answer,
          rubric: question.rubric,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Quiz scoring failed");
      }

      setResult(data.result);
      router.refresh();
    } catch (error) {
      setErrorText(error.message || "Could not submit answer");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <aside className={clsx("quiz-panel", panelState.open ? "quiz-panel-open" : "quiz-panel-closed")}>
      <div className="quiz-header">
        <button className="ghost-button" type="button" onClick={panelState.open ? closeQuiz : undefined}>
          {panelState.open ? "Close" : "Quiz"}
        </button>
      </div>

      {panelState.open ? (
        <div className="quiz-content">
          <h2>{header}</h2>
          <p className="muted-text">Validation required before milestone completion is finalized.</p>

          {!question ? (
            <button className="primary-button" disabled={isGenerating} onClick={generateQuestion} type="button">
              {isGenerating ? "Generating..." : "Generate question"}
            </button>
          ) : (
            <div className="quiz-form">
              <p className="quiz-question">{question.questionText}</p>

              <textarea
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                className="quiz-answer"
                rows={5}
                placeholder="Write your answer with decisions, trade-offs, and failure handling..."
              />

              <button
                className="primary-button"
                type="button"
                disabled={!canSubmit || isSubmitting}
                onClick={submitAnswer}
              >
                {isSubmitting ? "Scoring..." : "Submit answer"}
              </button>
            </div>
          )}

          {result ? (
            <div className="quiz-result">
              <div className={clsx("score-pill", `score-${pillTone(result.score)}`)}>
                {Math.round(result.score)}/100
              </div>
              <p>{result.feedback}</p>
              <p className="muted-text">Provider: {result.providerUsed}</p>
            </div>
          ) : null}

          {errorText ? <p className="error-text">{errorText}</p> : null}
        </div>
      ) : null}
    </aside>
  );
}
