import { SCORE_THRESHOLDS, STATUS, WEIGHTS } from "./constants.js";

const evidenceStatusMultiplier = {
  valid: 1,
  stale: 0.6,
  missing: 0.2,
};

function round2(value) {
  return Math.round(value * 100) / 100;
}

export function clamp0to100(value) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

export function computeArtifactScore(artifact) {
  const confidence = Number(artifact.confidenceScore ?? 0);
  const freshness = Number(artifact.freshnessScore ?? 0);
  const status = artifact.status || STATUS.EVIDENCE.MISSING;
  const multiplier = evidenceStatusMultiplier[status] ?? evidenceStatusMultiplier.missing;
  const normalized = ((confidence + freshness) / 2) * 100;
  return round2(clamp0to100(normalized * multiplier));
}

export function computeEvidenceScore(artifacts) {
  if (!artifacts || artifacts.length === 0) return 0;
  const scored = artifacts.map(computeArtifactScore);
  return round2(scored.reduce((sum, current) => sum + current, 0) / scored.length);
}

export function getLatestQuizScore(responses) {
  if (!responses || responses.length === 0) return 0;
  const sorted = [...responses].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  return round2(clamp0to100(Number(sorted[0].aiScore ?? 0)));
}

export function computeMilestoneCapability(evidenceScore, quizScore, weights = WEIGHTS) {
  const evidenceWeight = Number(weights.evidenceWeight ?? WEIGHTS.EVIDENCE);
  const quizWeight = Number(weights.quizWeight ?? WEIGHTS.QUIZ);
  const score = evidenceScore * evidenceWeight + quizScore * quizWeight;
  return round2(clamp0to100(score));
}

export function computeMilestoneView(milestone, artifacts, responses, weights = WEIGHTS) {
  const evidenceScore = computeEvidenceScore(artifacts);
  const quizScore = getLatestQuizScore(responses);
  const capabilityScore = computeMilestoneCapability(evidenceScore, quizScore, weights);

  let status = milestone.status;

  const hasQuiz = responses.length > 0;
  const evidenceReady = evidenceScore >= SCORE_THRESHOLDS.COMPLETE_EVIDENCE_MIN;
  const quizReady = quizScore >= SCORE_THRESHOLDS.COMPLETE_QUIZ_MIN;

  if (status === STATUS.MILESTONE.NOT_STARTED && artifacts.length > 0) {
    status = STATUS.MILESTONE.IN_PROGRESS;
  }

  if (status === STATUS.MILESTONE.IN_PROGRESS && evidenceReady) {
    status = STATUS.MILESTONE.COMPLETED_CANDIDATE;
  }

  if (status === STATUS.MILESTONE.COMPLETED_CANDIDATE && hasQuiz && evidenceReady && quizReady) {
    status = STATUS.MILESTONE.COMPLETED;
  }

  if (status === STATUS.MILESTONE.COMPLETED && (!hasQuiz || !evidenceReady)) {
    status = STATUS.MILESTONE.COMPLETED_CANDIDATE;
  }

  return {
    ...milestone,
    status,
    evidenceScore,
    quizScore,
    capabilityScore,
  };
}

export function computeTrackScore(milestones) {
  if (!milestones.length) return 0;
  const average = milestones.reduce((sum, milestone) => sum + milestone.capabilityScore, 0) / milestones.length;
  return round2(clamp0to100(average));
}

export function deriveTrackStatus(trackScore, milestones, openGapsCount = 0) {
  const allNotStarted = milestones.every((m) => m.status === STATUS.MILESTONE.NOT_STARTED);
  if (allNotStarted) return STATUS.TRACK.NOT_STARTED;
  if (openGapsCount > 0 || trackScore < SCORE_THRESHOLDS.GAP_TRACK_SCORE) return STATUS.TRACK.GAP;
  return STATUS.TRACK.ON_TRACK;
}

export function buildGapsFromState(tracks, milestones, artifacts, quizResponses) {
  const now = new Date().toISOString();
  const output = [];

  for (const milestone of milestones) {
    const milestoneArtifacts = artifacts.filter((a) => a.milestoneId === milestone.id);
    const milestoneQuizResponses = quizResponses.filter((r) => r.milestoneId === milestone.id);
    const evidenceScore = computeEvidenceScore(milestoneArtifacts);
    const quizScore = getLatestQuizScore(milestoneQuizResponses);

    if (milestoneArtifacts.length === 0) {
      output.push({
        id: `gap-${milestone.id}-missing-evidence`,
        trackId: milestone.trackId,
        milestoneId: milestone.id,
        title: "Missing evidence",
        detail: "No artifact linked yet. Add runnable evidence or real-project proof.",
        severity: "high",
        status: "open",
        createdAt: now,
      });
      continue;
    }

    if (milestoneArtifacts.some((a) => a.status === STATUS.EVIDENCE.STALE)) {
      output.push({
        id: `gap-${milestone.id}-stale-evidence`,
        trackId: milestone.trackId,
        milestoneId: milestone.id,
        title: "Stale evidence",
        detail: "Evidence is outdated. Refresh with a current run and attach results.",
        severity: "medium",
        status: "open",
        createdAt: now,
      });
    }

    if (evidenceScore < SCORE_THRESHOLDS.COMPLETE_EVIDENCE_MIN) {
      output.push({
        id: `gap-${milestone.id}-weak-evidence`,
        trackId: milestone.trackId,
        milestoneId: milestone.id,
        title: "Weak evidence quality",
        detail: "Improve confidence/freshness and attach stronger validation output.",
        severity: "medium",
        status: "open",
        createdAt: now,
      });
    }

    if (milestone.status === STATUS.MILESTONE.COMPLETED_CANDIDATE && milestoneQuizResponses.length === 0) {
      output.push({
        id: `gap-${milestone.id}-quiz-required`,
        trackId: milestone.trackId,
        milestoneId: milestone.id,
        title: "Quiz required",
        detail: "Milestone is candidate-complete. Submit a quiz response to finalize.",
        severity: "high",
        status: "open",
        createdAt: now,
      });
    }

    if (milestoneQuizResponses.length > 0 && quizScore < SCORE_THRESHOLDS.COMPLETE_QUIZ_MIN) {
      output.push({
        id: `gap-${milestone.id}-quiz-low`,
        trackId: milestone.trackId,
        milestoneId: milestone.id,
        title: "Quiz score below threshold",
        detail: "Re-run the milestone and retake the quiz with deeper reasoning.",
        severity: "high",
        status: "open",
        createdAt: now,
      });
    }
  }

  for (const track of tracks) {
    const trackMilestones = milestones.filter((m) => m.trackId === track.id);
    if (trackMilestones.length === 0) {
      output.push({
        id: `gap-${track.id}-missing-milestones`,
        trackId: track.id,
        title: "Track has no milestones",
        detail: "Seed milestones so the track can be measured and acted on.",
        severity: "high",
        status: "open",
        createdAt: now,
      });
    }
  }

  return output;
}

function gapSeverityWeight(severity) {
  if (severity === "high") return 100;
  if (severity === "medium") return 60;
  return 30;
}

export function rankNextActions(gaps, milestones, tracks) {
  const openGaps = gaps.filter((gap) => gap.status === "open");
  if (!openGaps.length) {
    const firstTrack = tracks[0];
    const fallbackMilestone = milestones.find((m) => m.trackId === firstTrack?.id);
    if (!firstTrack || !fallbackMilestone) {
      return {
        actionText: "Seed milestones and evidence to start scoring.",
        ctaPath: "/tracks",
        priority: 50,
      };
    }
    return {
      actionText: `Start ${firstTrack.name}: ${fallbackMilestone.title}`,
      ctaPath: `/tracks/${firstTrack.id}`,
      priority: 40,
    };
  }

  const enriched = openGaps.map((gap) => {
    const relatedMilestone = milestones.find((m) => m.id === gap.milestoneId);
    const relatedTrack = tracks.find((t) => t.id === gap.trackId);
    let priority = gapSeverityWeight(gap.severity);

    if (relatedMilestone?.status === STATUS.MILESTONE.COMPLETED_CANDIDATE) priority += 15;
    if (gap.title.toLowerCase().includes("quiz")) priority += 10;

    return {
      ...gap,
      priority,
      ctaPath: relatedTrack ? `/tracks/${relatedTrack.id}` : "/tracks",
      actionText: relatedMilestone
        ? `${relatedTrack?.name ?? "Track"}: ${relatedMilestone.title} -> ${gap.title}`
        : `${relatedTrack?.name ?? "Track"}: ${gap.title}`,
    };
  });

  const [best] = enriched.sort((a, b) => b.priority - a.priority);
  return {
    actionText: best.actionText,
    ctaPath: best.ctaPath,
    priority: best.priority,
  };
}

export function computeDashboardState({ tracks, milestones, artifacts, quizResponses, trackWeights }) {
  const weights = {
    evidenceWeight: Number(trackWeights?.evidenceWeight ?? WEIGHTS.EVIDENCE),
    quizWeight: Number(trackWeights?.quizWeight ?? WEIGHTS.QUIZ),
  };

  const milestonesWithScores = milestones.map((milestone) =>
    computeMilestoneView(
      milestone,
      artifacts.filter((artifact) => artifact.milestoneId === milestone.id),
      quizResponses.filter((response) => response.milestoneId === milestone.id),
      weights
    )
  );

  const provisionalGaps = buildGapsFromState(tracks, milestonesWithScores, artifacts, quizResponses);

  const tracksWithScores = tracks
    .map((track) => {
      const scopedMilestones = milestonesWithScores.filter((milestone) => milestone.trackId === track.id);
      const openGapsCount = provisionalGaps.filter((gap) => gap.trackId === track.id && gap.status === "open").length;
      const score = computeTrackScore(scopedMilestones);
      const status = deriveTrackStatus(score, scopedMilestones, openGapsCount);

      const latestEvents = [
        ...artifacts.filter((artifact) => artifact.trackId === track.id).map((artifact) => artifact.updatedAt || artifact.createdAt),
        ...quizResponses.filter((response) => response.trackId === track.id).map((response) => response.createdAt),
      ].filter(Boolean);

      const lastActivityAt = latestEvents.length
        ? latestEvents.sort((a, b) => Date.parse(b) - Date.parse(a))[0]
        : undefined;

      return {
        ...track,
        score,
        status,
        lastActivityAt,
      };
    })
    .sort((a, b) => a.orderIndex - b.orderIndex);

  const overallScore = tracksWithScores.length
    ? round2(tracksWithScores.reduce((sum, track) => sum + track.score, 0) / tracksWithScores.length)
    : 0;

  const nextAction = rankNextActions(provisionalGaps, milestonesWithScores, tracksWithScores);

  return {
    weights,
    overallScore,
    tracks: tracksWithScores,
    milestones: milestonesWithScores,
    gaps: provisionalGaps,
    nextAction,
  };
}
