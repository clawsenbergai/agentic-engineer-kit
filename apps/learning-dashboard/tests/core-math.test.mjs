import test from "node:test";
import assert from "node:assert/strict";

import {
  computeMilestoneCapability,
  computeMilestoneView,
  computeDashboardState,
  rankNextActions,
} from "../src/lib/core.js";

test("milestone capability uses 70/30 weighting", () => {
  const capability = computeMilestoneCapability(80, 50, {
    evidenceWeight: 0.7,
    quizWeight: 0.3,
  });

  assert.equal(capability, 71);
});

test("milestone status transitions follow candidate/complete gates", () => {
  const baseMilestone = {
    id: "m1",
    trackId: "t1",
    title: "Milestone",
    theoryMarkdown: "x",
    buildExerciseMarkdown: "y",
    status: "not_started",
    orderIndex: 10,
  };

  const validArtifact = {
    id: "a1",
    milestoneId: "m1",
    status: "valid",
    confidenceScore: 0.9,
    freshnessScore: 0.9,
  };

  const inProgress = computeMilestoneView(baseMilestone, [validArtifact], [], {
    evidenceWeight: 0.7,
    quizWeight: 0.3,
  });
  assert.equal(inProgress.status, "completed_candidate");

  const completed = computeMilestoneView(
    { ...inProgress, status: "completed_candidate" },
    [validArtifact],
    [
      {
        milestoneId: "m1",
        aiScore: 88,
        createdAt: new Date().toISOString(),
      },
    ],
    {
      evidenceWeight: 0.7,
      quizWeight: 0.3,
    }
  );

  assert.equal(completed.status, "completed");
});

test("next-action ranking prioritizes high severity and quiz gaps", () => {
  const gaps = [
    {
      id: "g1",
      trackId: "t1",
      milestoneId: "m1",
      title: "Stale evidence",
      detail: "update",
      severity: "medium",
      status: "open",
    },
    {
      id: "g2",
      trackId: "t1",
      milestoneId: "m2",
      title: "Quiz required",
      detail: "submit",
      severity: "high",
      status: "open",
    },
  ];

  const milestones = [
    { id: "m1", trackId: "t1", title: "one", status: "in_progress" },
    { id: "m2", trackId: "t1", title: "two", status: "completed_candidate" },
  ];

  const tracks = [{ id: "t1", name: "Track A" }];

  const action = rankNextActions(gaps, milestones, tracks);
  assert.equal(action.ctaPath, "/tracks/t1");
  assert.match(action.actionText, /Quiz required/i);
});

test("dashboard state returns weighted overall score and generated gaps", () => {
  const state = computeDashboardState({
    tracks: [{ id: "t1", name: "T", description: "d", category: "core", orderIndex: 10 }],
    milestones: [
      {
        id: "m1",
        trackId: "t1",
        title: "M",
        theoryMarkdown: "",
        buildExerciseMarkdown: "",
        status: "in_progress",
        orderIndex: 10,
      },
    ],
    artifacts: [
      {
        id: "a1",
        trackId: "t1",
        milestoneId: "m1",
        status: "valid",
        confidenceScore: 1,
        freshnessScore: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    quizResponses: [
      {
        id: "q1",
        trackId: "t1",
        milestoneId: "m1",
        aiScore: 100,
        createdAt: new Date().toISOString(),
      },
    ],
    trackWeights: { evidenceWeight: 0.7, quizWeight: 0.3 },
  });

  assert.equal(state.overallScore, 100);
  assert.equal(state.gaps.length, 0);
});
