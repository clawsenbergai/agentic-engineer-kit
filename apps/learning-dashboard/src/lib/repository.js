import crypto from "node:crypto";

import { DEMO_ARTIFACTS, MILESTONES, TRACKS, createInitialStore } from "./seed-data.js";
import { computeDashboardState } from "./core.js";
import { getSupabaseServerClient, isSupabaseConfigured } from "./supabase.js";

function nowIso() {
  return new Date().toISOString();
}

function getMemoryStore() {
  if (!globalThis.__LEARNING_DASHBOARD_STORE__) {
    globalThis.__LEARNING_DASHBOARD_STORE__ = createInitialStore();
  }
  return globalThis.__LEARNING_DASHBOARD_STORE__;
}

export function __resetMemoryStore(options = {}) {
  globalThis.__LEARNING_DASHBOARD_STORE__ = createInitialStore(options);
  return globalThis.__LEARNING_DASHBOARD_STORE__;
}

export function __getMemoryStoreUnsafe() {
  return getMemoryStore();
}

function toTrackRow(track) {
  return {
    id: track.id,
    name: track.name,
    description: track.description,
    category: track.category,
    order_index: track.orderIndex,
    created_at: track.createdAt || nowIso(),
    updated_at: track.updatedAt || nowIso(),
  };
}

function fromTrackRow(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    category: row.category,
    orderIndex: row.order_index,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function fromStepRow(row) {
  return {
    id: row.id,
    milestoneId: row.milestone_id,
    orderIndex: row.order_index,
    type: row.type,
    title: row.title,
    contentMarkdown: row.content_markdown,
    url: row.url,
    validationCommand: row.validation_command,
    completed: row.completed,
    completedAt: row.completed_at,
    notes: row.notes || "",
  };
}

function toMilestoneRow(milestone) {
  return {
    id: milestone.id,
    track_id: milestone.trackId,
    title: milestone.title,
    theory_markdown: milestone.theoryMarkdown,
    build_exercise_markdown: milestone.buildExerciseMarkdown,
    status: milestone.status,
    order_index: milestone.orderIndex,
    required_quiz: milestone.requiredQuiz ?? true,
    created_at: milestone.createdAt || nowIso(),
    updated_at: milestone.updatedAt || nowIso(),
  };
}

function fromMilestoneRow(row) {
  return {
    id: row.id,
    trackId: row.track_id,
    title: row.title,
    theoryMarkdown: row.theory_markdown,
    buildExerciseMarkdown: row.build_exercise_markdown,
    status: row.status,
    orderIndex: row.order_index,
    requiredQuiz: row.required_quiz,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toArtifactRow(artifact) {
  return {
    id: artifact.id,
    track_id: artifact.trackId,
    milestone_id: artifact.milestoneId || null,
    title: artifact.title,
    description: artifact.description || "",
    status: artifact.status,
    source_type: artifact.sourceType,
    project_source: artifact.projectSource,
    evidence_url: artifact.evidenceUrl || null,
    confidence_score: Number(artifact.confidenceScore ?? 0),
    freshness_score: Number(artifact.freshnessScore ?? 0),
    metadata: artifact.metadata || {},
    created_at: artifact.createdAt || nowIso(),
    updated_at: artifact.updatedAt || nowIso(),
  };
}

function fromArtifactRow(row) {
  return {
    id: row.id,
    trackId: row.track_id,
    milestoneId: row.milestone_id,
    title: row.title,
    description: row.description,
    status: row.status,
    sourceType: row.source_type,
    projectSource: row.project_source,
    evidenceUrl: row.evidence_url,
    confidenceScore: Number(row.confidence_score),
    freshnessScore: Number(row.freshness_score),
    metadata: row.metadata || {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toQuizResponseRow(response) {
  return {
    id: response.id,
    track_id: response.trackId,
    milestone_id: response.milestoneId,
    question_type: response.questionType,
    question_text: response.questionText,
    user_answer: response.userAnswer,
    ai_score: Number(response.aiScore),
    ai_feedback: response.aiFeedback,
    rubric_breakdown: response.rubricBreakdown || {},
    model_provider: response.modelProvider,
    model_name: response.modelName,
    created_at: response.createdAt || nowIso(),
  };
}

function fromQuizResponseRow(row) {
  return {
    id: row.id,
    trackId: row.track_id,
    milestoneId: row.milestone_id,
    questionType: row.question_type,
    questionText: row.question_text,
    userAnswer: row.user_answer,
    aiScore: Number(row.ai_score),
    aiFeedback: row.ai_feedback,
    rubricBreakdown: row.rubric_breakdown || {},
    modelProvider: row.model_provider,
    modelName: row.model_name,
    createdAt: row.created_at,
  };
}

function toQuizQuestionRow(question) {
  return {
    id: question.id,
    track_id: question.trackId,
    milestone_id: question.milestoneId,
    question_type: question.questionType,
    question_text: question.questionText,
    rubric: question.rubric,
    difficulty: question.difficulty,
    created_at: question.createdAt || nowIso(),
  };
}

function fromQuizQuestionRow(row) {
  return {
    id: row.id,
    trackId: row.track_id,
    milestoneId: row.milestone_id,
    questionType: row.question_type,
    questionText: row.question_text,
    rubric: row.rubric || {},
    difficulty: row.difficulty,
    createdAt: row.created_at,
  };
}

async function ensureSupabaseSeed(client) {
  const { data: existingMilestones, error: existingMilestonesError } = await client
    .from("milestones")
    .select("id")
    .limit(1);

  if (existingMilestonesError) {
    throw new Error(`Cannot check milestones seed state: ${existingMilestonesError.message}`);
  }

  if (existingMilestones.length > 0) return;

  const { error: trackInsertError } = await client.from("tracks").upsert(TRACKS.map(toTrackRow), {
    onConflict: "id",
  });

  if (trackInsertError) {
    throw new Error(`Cannot seed tracks: ${trackInsertError.message}`);
  }

  const { error: milestoneInsertError } = await client.from("milestones").upsert(MILESTONES.map(toMilestoneRow), {
    onConflict: "id",
  });

  if (milestoneInsertError) {
    throw new Error(`Cannot seed milestones: ${milestoneInsertError.message}`);
  }

  if (process.env.LEARNING_DEMO_SEED === "1") {
    const { error: artifactInsertError } = await client
      .from("artifacts")
      .insert(DEMO_ARTIFACTS.map(toArtifactRow));
    if (artifactInsertError) {
      throw new Error(`Cannot seed artifacts: ${artifactInsertError.message}`);
    }
  }

  const { error: weightError } = await client.from("track_weights").upsert(
    {
      id: "default",
      evidence_weight: 0.7,
      quiz_weight: 0.3,
      updated_at: nowIso(),
    },
    {
      onConflict: "id",
    }
  );

  if (weightError) {
    throw new Error(`Cannot seed track weights: ${weightError.message}`);
  }
}

async function loadSupabaseStore() {
  const client = getSupabaseServerClient();
  if (!client) {
    throw new Error("Supabase not configured");
  }

  await ensureSupabaseSeed(client);

  const [tracksRes, milestonesRes, stepsRes, artifactsRes, quizQuestionsRes, quizResponsesRes, weightRes] = await Promise.all([
    client.from("tracks").select("*").order("order_index", { ascending: true }),
    client.from("milestones").select("*").order("order_index", { ascending: true }),
    client.from("steps").select("*").order("order_index", { ascending: true }),
    client.from("artifacts").select("*").order("created_at", { ascending: false }),
    client.from("quiz_questions").select("*").order("created_at", { ascending: false }),
    client.from("quiz_responses").select("*").order("created_at", { ascending: false }),
    client.from("track_weights").select("*").eq("id", "default").single(),
  ]);

  for (const result of [tracksRes, milestonesRes, stepsRes, artifactsRes, quizQuestionsRes, quizResponsesRes]) {
    if (result.error) {
      throw new Error(result.error.message);
    }
  }

  const trackWeightRow = weightRes.error ? null : weightRes.data;

  return {
    client,
    store: {
      tracks: (tracksRes.data || []).map(fromTrackRow),
      milestones: (milestonesRes.data || []).map(fromMilestoneRow),
      steps: (stepsRes.data || []).map(fromStepRow),
      artifacts: (artifactsRes.data || []).map(fromArtifactRow),
      quizQuestions: (quizQuestionsRes.data || []).map(fromQuizQuestionRow),
      quizResponses: (quizResponsesRes.data || []).map(fromQuizResponseRow),
      evaluations: [],
      progressSnapshots: [],
      gaps: [],
      recommendations: [],
      reflections: [],
      providerRuns: [],
      trackWeights: trackWeightRow
        ? {
            evidenceWeight: Number(trackWeightRow.evidence_weight),
            quizWeight: Number(trackWeightRow.quiz_weight),
          }
        : {
            evidenceWeight: 0.7,
            quizWeight: 0.3,
          },
    },
  };
}

async function loadStore() {
  if (isSupabaseConfigured()) {
    return loadSupabaseStore();
  }
  return {
    client: null,
    store: getMemoryStore(),
  };
}

async function persistDerivedState(client, derived) {
  if (!client) {
    const memory = getMemoryStore();
    memory.gaps = derived.gaps;
    memory.recommendations = [
      {
        id: crypto.randomUUID(),
        trackId: null,
        milestoneId: null,
        actionText: derived.nextAction.actionText,
        ctaPath: derived.nextAction.ctaPath,
        priority: derived.nextAction.priority,
        createdAt: nowIso(),
      },
    ];
    memory.progressSnapshots.push({
      id: crypto.randomUUID(),
      overallScore: derived.overallScore,
      evidenceWeight: derived.weights.evidenceWeight,
      quizWeight: derived.weights.quizWeight,
      trackScores: Object.fromEntries(derived.tracks.map((track) => [track.id, track.score])),
      createdAt: nowIso(),
    });
    return;
  }

  await client.from("progress_snapshots").insert({
    id: crypto.randomUUID(),
    overall_score: derived.overallScore,
    evidence_weight: derived.weights.evidenceWeight,
    quiz_weight: derived.weights.quizWeight,
    track_scores: Object.fromEntries(derived.tracks.map((track) => [track.id, track.score])),
    created_at: nowIso(),
  });

  await client.from("gaps").delete().eq("status", "open");
  if (derived.gaps.length) {
    await client.from("gaps").insert(
      derived.gaps.map((gap) => ({
        id: gap.id,
        track_id: gap.trackId,
        milestone_id: gap.milestoneId || null,
        title: gap.title,
        detail: gap.detail,
        severity: gap.severity,
        status: gap.status,
        created_at: gap.createdAt,
        updated_at: nowIso(),
      }))
    );
  }

  await client.from("recommendations").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await client.from("recommendations").insert({
    id: crypto.randomUUID(),
    track_id: derived.gaps[0]?.trackId ?? derived.tracks[0]?.id,
    milestone_id: derived.gaps[0]?.milestoneId ?? null,
    action_text: derived.nextAction.actionText,
    cta_path: derived.nextAction.ctaPath,
    priority: derived.nextAction.priority,
    created_at: nowIso(),
    updated_at: nowIso(),
  });
}

function findFirstIncompleteStep(tracks, milestones, steps) {
  // Sort tracks by order
  const sortedTracks = [...tracks].sort((a, b) => a.orderIndex - b.orderIndex);
  
  for (const track of sortedTracks) {
    // Get milestones for this track, sorted by order
    const trackMilestones = milestones
      .filter(m => m.trackId === track.id)
      .sort((a, b) => a.orderIndex - b.orderIndex);
    
    for (const milestone of trackMilestones) {
      // Get steps for this milestone, sorted by order
      const milestoneSteps = steps
        .filter(s => s.milestoneId === milestone.id)
        .sort((a, b) => a.orderIndex - b.orderIndex);
      
      // Find first incomplete step
      const incompleteStep = milestoneSteps.find(step => !step.completed);
      if (incompleteStep) {
        return {
          step: incompleteStep,
          milestone,
          track
        };
      }
    }
  }
  
  return null; // All steps completed
}

export async function getDashboardSummary() {
  const { store, client } = await loadStore();
  const derived = computeDashboardState({
    tracks: store.tracks,
    milestones: store.milestones,
    artifacts: store.artifacts,
    quizResponses: store.quizResponses,
    trackWeights: store.trackWeights,
  });

  await persistDerivedState(client, derived);

  const enrichedTracks = derived.tracks.map((track) => {
    const trackMilestones = derived.milestones.filter((m) => m.trackId === track.id);
    const trackSteps = (store.steps || []).filter(s => 
      trackMilestones.some(m => m.id === s.milestoneId)
    );
    const completedSteps = trackSteps.filter(s => s.completed).length;
    
    return {
      ...track,
      milestoneCount: trackMilestones.length,
      completedMilestoneCount: trackMilestones.filter((m) => m.status === "completed").length,
      stepCount: trackSteps.length,
      completedStepCount: completedSteps,
      stepProgressPct: trackSteps.length > 0 ? (completedSteps / trackSteps.length) * 100 : 0,
    };
  });

  // Find first incomplete step
  const continueFrom = findFirstIncompleteStep(derived.tracks, derived.milestones, store.steps || []);
  
  // Calculate total step progress
  const totalSteps = (store.steps || []).length;
  const completedSteps = (store.steps || []).filter(s => s.completed).length;

  return {
    overallScore: derived.overallScore,
    weights: derived.weights,
    tracks: enrichedTracks,
    gapCount: derived.gaps.length,
    nextAction: derived.nextAction,
    continueFrom,
    totalSteps,
    completedSteps,
    stepProgressPct: totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0,
  };
}

export async function getTracks() {
  const { store } = await loadStore();
  const derived = computeDashboardState({
    tracks: store.tracks,
    milestones: store.milestones,
    artifacts: store.artifacts,
    quizResponses: store.quizResponses,
    trackWeights: store.trackWeights,
  });

  return derived.tracks.map((track) => {
    const trackMilestones = derived.milestones.filter((m) => m.trackId === track.id);
    return {
      ...track,
      milestoneCount: trackMilestones.length,
      completedMilestoneCount: trackMilestones.filter((m) => m.status === "completed").length,
    };
  });
}

export async function getTrackById(trackId) {
  const { store } = await loadStore();
  const derived = computeDashboardState({
    tracks: store.tracks,
    milestones: store.milestones,
    artifacts: store.artifacts,
    quizResponses: store.quizResponses,
    trackWeights: store.trackWeights,
  });

  const track = derived.tracks.find((entry) => entry.id === trackId);
  if (!track) return null;

  const milestones = derived.milestones
    .filter((milestone) => milestone.trackId === trackId)
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .map((milestone) => ({
      ...milestone,
      evidence: store.artifacts.filter((artifact) => artifact.milestoneId === milestone.id),
      latestQuiz: store.quizResponses
        .filter((response) => response.milestoneId === milestone.id)
        .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))[0],
    }));

  const trackGaps = derived.gaps.filter((gap) => gap.trackId === trackId);

  return {
    track,
    milestones,
    gaps: trackGaps,
  };
}

export async function getMilestoneEvidence(milestoneId) {
  const { store } = await loadStore();
  return store.artifacts.filter((artifact) => artifact.milestoneId === milestoneId);
}

export async function getGaps() {
  const { store } = await loadStore();
  const derived = computeDashboardState({
    tracks: store.tracks,
    milestones: store.milestones,
    artifacts: store.artifacts,
    quizResponses: store.quizResponses,
    trackWeights: store.trackWeights,
  });
  return derived.gaps;
}

export async function getNextAction() {
  const { store } = await loadStore();
  const derived = computeDashboardState({
    tracks: store.tracks,
    milestones: store.milestones,
    artifacts: store.artifacts,
    quizResponses: store.quizResponses,
    trackWeights: store.trackWeights,
  });
  return derived.nextAction;
}

export async function linkProjectEvidence(input) {
  const { store, client } = await loadStore();

  const artifact = {
    id: crypto.randomUUID(),
    trackId: input.trackId,
    milestoneId: input.milestoneId || null,
    title: input.title,
    description: input.description || "",
    status: input.status,
    sourceType: input.sourceType,
    projectSource: input.projectSource,
    evidenceUrl: input.evidenceUrl,
    confidenceScore: input.confidenceScore,
    freshnessScore: input.freshnessScore,
    metadata: input.metadata || {},
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };

  if (client) {
    const { error } = await client.from("artifacts").insert(toArtifactRow(artifact));
    if (error) throw new Error(`Cannot create artifact: ${error.message}`);

    if (artifact.milestoneId) {
      const { data: milestone, error: milestoneError } = await client
        .from("milestones")
        .select("id,status")
        .eq("id", artifact.milestoneId)
        .single();

      if (!milestoneError && milestone && milestone.status === "not_started") {
        await client
          .from("milestones")
          .update({ status: "in_progress", updated_at: nowIso() })
          .eq("id", artifact.milestoneId);
      }
    }
  } else {
    store.artifacts.unshift(artifact);
    if (artifact.milestoneId) {
      const milestone = store.milestones.find((entry) => entry.id === artifact.milestoneId);
      if (milestone && milestone.status === "not_started") {
        milestone.status = "in_progress";
        milestone.updatedAt = nowIso();
      }
    }
  }

  return artifact;
}

export async function saveQuizQuestion(question) {
  const { store, client } = await loadStore();
  const payload = {
    id: question.id || crypto.randomUUID(),
    trackId: question.trackId,
    milestoneId: question.milestoneId,
    questionType: question.questionType,
    questionText: question.questionText,
    rubric: question.rubric,
    difficulty: question.difficulty,
    createdAt: nowIso(),
  };

  if (client) {
    const { error } = await client.from("quiz_questions").insert(toQuizQuestionRow(payload));
    if (error) throw new Error(`Cannot store quiz question: ${error.message}`);
  } else {
    store.quizQuestions.unshift(payload);
  }

  return payload;
}

export async function saveQuizResponse(response) {
  const { store, client } = await loadStore();
  const payload = {
    id: response.id || crypto.randomUUID(),
    trackId: response.trackId,
    milestoneId: response.milestoneId,
    questionType: response.questionType,
    questionText: response.questionText,
    userAnswer: response.userAnswer,
    aiScore: response.aiScore,
    aiFeedback: response.aiFeedback,
    rubricBreakdown: response.rubricBreakdown,
    modelProvider: response.modelProvider,
    modelName: response.modelName,
    createdAt: nowIso(),
  };

  if (client) {
    const { error } = await client.from("quiz_responses").insert(toQuizResponseRow(payload));
    if (error) throw new Error(`Cannot store quiz response: ${error.message}`);

    await client
      .from("milestones")
      .update({ status: "completed_candidate", updated_at: nowIso() })
      .eq("id", payload.milestoneId)
      .neq("status", "completed");
  } else {
    store.quizResponses.unshift(payload);
    const milestone = store.milestones.find((entry) => entry.id === payload.milestoneId);
    if (milestone && milestone.status !== "completed") {
      milestone.status = "completed_candidate";
      milestone.updatedAt = nowIso();
    }
  }

  return payload;
}

export async function logProviderRun(run) {
  const { store, client } = await loadStore();
  const payload = {
    id: crypto.randomUUID(),
    runKind: run.runKind,
    provider: run.provider,
    modelName: run.modelName,
    success: Boolean(run.success),
    fallbackUsed: Boolean(run.fallbackUsed),
    latencyMs: run.latencyMs ?? null,
    errorMessage: run.errorMessage || null,
    createdAt: nowIso(),
  };

  if (client) {
    await client.from("provider_runs").insert({
      id: payload.id,
      run_kind: payload.runKind,
      provider: payload.provider,
      model_name: payload.modelName,
      success: payload.success,
      fallback_used: payload.fallbackUsed,
      latency_ms: payload.latencyMs,
      error_message: payload.errorMessage,
      created_at: payload.createdAt,
    });
  } else {
    store.providerRuns.unshift(payload);
  }
}

export async function getSettingsHealth() {
  const supabaseEnabled = isSupabaseConfigured();
  const hasClaude = Boolean(process.env.CLAUDE_API_KEY);
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);

  return {
    mode: supabaseEnabled ? "supabase" : "in_memory",
    providerStatus: {
      claude: hasClaude ? "configured" : "missing",
      openai: hasOpenAI ? "configured" : "missing",
    },
    auth: {
      ownerTokenRequired: Boolean(process.env.DASHBOARD_OWNER_TOKEN),
    },
  };
}

export async function getAllEvidence() {
  const { store } = await loadStore();
  return store.artifacts
    .map((artifact) => ({
      ...artifact,
      trackName: store.tracks.find((track) => track.id === artifact.trackId)?.name || artifact.trackId,
      milestoneTitle:
        store.milestones.find((milestone) => milestone.id === artifact.milestoneId)?.title || artifact.milestoneId,
    }))
    .sort((a, b) => Date.parse(b.updatedAt || b.createdAt) - Date.parse(a.updatedAt || a.createdAt));
}

export async function getStepsForMilestone(milestoneId) {
  const { store } = await loadStore();
  return (store.steps || [])
    .filter((step) => step.milestoneId === milestoneId)
    .sort((a, b) => a.orderIndex - b.orderIndex);
}

export async function saveStepNotes(stepId, notes) {
  const { client, mode } = await loadStore();
  if (mode === "supabase" && client) {
    const { error } = await client.from("steps").update({ notes }).eq("id", stepId);
    if (error) throw new Error(error.message);
  }
  const { store } = await loadStore();
  const step = (store.steps || []).find((s) => s.id === stepId);
  if (step) step.notes = notes;
  return { ok: true };
}

export async function toggleStepComplete(stepId) {
  const { store } = await loadStore();
  const step = (store.steps || []).find((s) => s.id === stepId);
  if (!step) return null;
  step.completed = !step.completed;
  step.completedAt = step.completed ? nowIso() : null;
  return step;
}

export async function getMilestoneById(milestoneId) {
  const { store } = await loadStore();
  const derived = computeDashboardState({
    tracks: store.tracks,
    milestones: store.milestones,
    artifacts: store.artifacts,
    quizResponses: store.quizResponses,
    trackWeights: store.trackWeights,
  });

  const milestone = derived.milestones.find((m) => m.id === milestoneId);
  if (!milestone) return null;

  const track = derived.tracks.find((t) => t.id === milestone.trackId);
  const steps = (store.steps || [])
    .filter((s) => s.milestoneId === milestoneId)
    .sort((a, b) => a.orderIndex - b.orderIndex);
  const evidence = store.artifacts.filter((a) => a.milestoneId === milestoneId);
  const gaps = derived.gaps.filter((g) => g.milestoneId === milestoneId);

  return { milestone, track, steps, evidence, gaps };
}
