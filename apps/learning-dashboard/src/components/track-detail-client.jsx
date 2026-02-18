"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { MarkdownContent } from "@/components/markdown-content";
import { StatusBadge } from "@/components/status-badge";
import { useQuizPanel } from "@/components/quiz-panel-context";

const PROJECT_SOURCES = [
  "kit_internal",
  "polymarket_bot",
  "agent_ready_tool",
  "green_prairie",
  "other_real_project",
];

function ownerHeaders() {
  if (typeof window === "undefined") return {};
  const token = window.localStorage.getItem("learning_dashboard_owner_token");
  if (!token) return {};
  return { "x-owner-token": token };
}

export function TrackDetailClient({ track, milestones, gaps }) {
  const router = useRouter();
  const { openQuiz } = useQuizPanel();
  const [expandedId, setExpandedId] = useState(milestones[0]?.id || null);
  const [loadingMilestone, setLoadingMilestone] = useState("");
  const [errorText, setErrorText] = useState("");
  const [formState, setFormState] = useState({
    title: "",
    evidenceUrl: "",
    projectSource: "other_real_project",
  });

  const gapMap = useMemo(() => {
    const map = new Map();
    for (const gap of gaps) {
      const existing = map.get(gap.milestoneId) || [];
      existing.push(gap);
      map.set(gap.milestoneId, existing);
    }
    return map;
  }, [gaps]);

  async function linkProject(milestoneId) {
    setErrorText("");
    setLoadingMilestone(milestoneId);

    try {
      const response = await fetch("/api/evidence/link-project", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...ownerHeaders(),
        },
        body: JSON.stringify({
          trackId: track.id,
          milestoneId,
          title: formState.title || "Real project evidence",
          evidenceUrl: formState.evidenceUrl,
          projectSource: formState.projectSource,
          sourceType: "real_project",
          status: "valid",
          confidenceScore: 0.85,
          freshnessScore: 0.8,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Could not link evidence");
      }

      setFormState({
        title: "",
        evidenceUrl: "",
        projectSource: formState.projectSource,
      });
      router.refresh();
    } catch (error) {
      setErrorText(error.message || "Could not link evidence");
    } finally {
      setLoadingMilestone("");
    }
  }

  return (
    <section>
      <header className="track-header">
        <div>
          <h1>{track.name}</h1>
          <p className="muted-text">{track.description}</p>
        </div>
        <StatusBadge status={track.status} />
      </header>

      <div className="timeline">
        {milestones.map((milestone) => {
          const expanded = expandedId === milestone.id;
          const milestoneGaps = gapMap.get(milestone.id) || [];

          return (
            <article key={milestone.id} className="timeline-item">
              <div className="timeline-marker-wrap">
                <span className={`timeline-marker timeline-${milestone.status}`} />
                <span className="timeline-line" />
              </div>

              <div className="timeline-card">
                <button
                  type="button"
                  onClick={() => setExpandedId(expanded ? null : milestone.id)}
                  className="timeline-toggle"
                >
                  <div>
                    <h2>{milestone.title}</h2>
                    <p className="muted-text">
                      Evidence {Math.round(milestone.evidenceScore)} / Quiz {Math.round(milestone.quizScore)} / Capability{" "}
                      {Math.round(milestone.capabilityScore)}
                    </p>
                  </div>
                  <StatusBadge status={milestone.status} />
                </button>

                {expanded ? (
                  <div className="timeline-expanded">
                    <section className="milestone-section">
                      <h3>Theory</h3>
                      <MarkdownContent>{milestone.theoryMarkdown}</MarkdownContent>
                    </section>

                    <section className="milestone-section">
                      <h3>Build exercise</h3>
                      <MarkdownContent>{milestone.buildExerciseMarkdown}</MarkdownContent>
                    </section>

                    <section className="milestone-section">
                      <div className="section-row">
                        <h3>Evidence</h3>
                        <button
                          className="ghost-button"
                          type="button"
                          onClick={() =>
                            openQuiz({
                              trackId: track.id,
                              milestoneId: milestone.id,
                              milestoneTitle: milestone.title,
                            })
                          }
                        >
                          Open quiz
                        </button>
                      </div>

                      <div className="evidence-grid">
                        {milestone.evidence.length ? (
                          milestone.evidence.map((item) => (
                            <article key={item.id} className="evidence-card">
                              <div className="section-row">
                                <strong>{item.title}</strong>
                                <StatusBadge status={item.status} />
                              </div>
                              <p className="muted-text">{item.description}</p>
                              <div className="evidence-meta">
                                <span className="project-badge">{item.projectSource}</span>
                                {item.evidenceUrl ? (
                                  <a href={item.evidenceUrl} target="_blank" rel="noreferrer">
                                    open
                                  </a>
                                ) : null}
                              </div>
                            </article>
                          ))
                        ) : (
                          <p className="muted-text">No evidence linked yet.</p>
                        )}
                      </div>

                      <div className="project-link-form">
                        <input
                          className="input"
                          value={formState.title}
                          onChange={(event) => setFormState((prev) => ({ ...prev, title: event.target.value }))}
                          placeholder="Evidence title"
                        />
                        <input
                          className="input"
                          value={formState.evidenceUrl}
                          onChange={(event) => setFormState((prev) => ({ ...prev, evidenceUrl: event.target.value }))}
                          placeholder="https://..."
                        />
                        <div className="section-row">
                          <select
                            className="input"
                            value={formState.projectSource}
                            onChange={(event) =>
                              setFormState((prev) => ({ ...prev, projectSource: event.target.value }))
                            }
                          >
                            {PROJECT_SOURCES.map((source) => (
                              <option key={source} value={source}>
                                {source}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            className="primary-button"
                            disabled={loadingMilestone === milestone.id}
                            onClick={() => linkProject(milestone.id)}
                          >
                            {loadingMilestone === milestone.id ? "Linking..." : "Link project evidence"}
                          </button>
                        </div>
                      </div>

                      {milestoneGaps.length ? (
                        <div className="milestone-gaps">
                          {milestoneGaps.map((gap) => (
                            <article className="gap-chip" key={gap.id}>
                              <StatusBadge status={gap.status} />
                              <p>
                                {gap.title}: {gap.detail}
                              </p>
                            </article>
                          ))}
                        </div>
                      ) : null}
                    </section>
                  </div>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>

      {errorText ? <p className="error-text">{errorText}</p> : null}
    </section>
  );
}
