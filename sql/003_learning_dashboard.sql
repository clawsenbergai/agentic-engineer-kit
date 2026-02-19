-- Learning dashboard schema for single-user setup on Supabase.

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE SCHEMA IF NOT EXISTS learning;

CREATE OR REPLACE FUNCTION learning.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS learning.tracks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('core', 'elective', 'later_phase')),
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS learning.milestones (
  id TEXT PRIMARY KEY,
  track_id TEXT NOT NULL REFERENCES learning.tracks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  theory_markdown TEXT NOT NULL,
  build_exercise_markdown TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (
    status IN ('not_started', 'in_progress', 'completed_candidate', 'completed', 'blocked')
  ),
  order_index INTEGER NOT NULL,
  required_quiz BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS learning.artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id TEXT NOT NULL REFERENCES learning.tracks(id) ON DELETE CASCADE,
  milestone_id TEXT REFERENCES learning.milestones(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'missing' CHECK (status IN ('valid', 'stale', 'missing')),
  source_type TEXT NOT NULL DEFAULT 'test',
  project_source TEXT NOT NULL DEFAULT 'kit_internal' CHECK (
    project_source IN ('kit_internal', 'polymarket_bot', 'agent_ready_tool', 'green_prairie', 'other_real_project')
  ),
  evidence_url TEXT,
  confidence_score NUMERIC(4,3) NOT NULL DEFAULT 0 CHECK (confidence_score BETWEEN 0 AND 1),
  freshness_score NUMERIC(4,3) NOT NULL DEFAULT 0 CHECK (freshness_score BETWEEN 0 AND 1),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS learning.evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id TEXT NOT NULL REFERENCES learning.tracks(id) ON DELETE CASCADE,
  milestone_id TEXT REFERENCES learning.milestones(id) ON DELETE SET NULL,
  evidence_score NUMERIC(5,2) NOT NULL CHECK (evidence_score BETWEEN 0 AND 100),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS learning.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id TEXT NOT NULL REFERENCES learning.tracks(id) ON DELETE CASCADE,
  milestone_id TEXT NOT NULL REFERENCES learning.milestones(id) ON DELETE CASCADE,
  question_type TEXT NOT NULL CHECK (question_type IN ('explain_back', 'scenario', 'code_challenge')),
  question_text TEXT NOT NULL,
  rubric JSONB NOT NULL DEFAULT '{}'::jsonb,
  difficulty TEXT NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS learning.quiz_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id TEXT NOT NULL REFERENCES learning.tracks(id) ON DELETE CASCADE,
  milestone_id TEXT NOT NULL REFERENCES learning.milestones(id) ON DELETE CASCADE,
  question_type TEXT NOT NULL CHECK (question_type IN ('explain_back', 'scenario', 'code_challenge')),
  question_text TEXT NOT NULL,
  user_answer TEXT NOT NULL,
  ai_score NUMERIC(5,2) NOT NULL CHECK (ai_score BETWEEN 0 AND 100),
  ai_feedback TEXT NOT NULL,
  rubric_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
  model_provider TEXT NOT NULL,
  model_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS learning.progress_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  overall_score NUMERIC(5,2) NOT NULL CHECK (overall_score BETWEEN 0 AND 100),
  evidence_weight NUMERIC(4,3) NOT NULL DEFAULT 0.7,
  quiz_weight NUMERIC(4,3) NOT NULL DEFAULT 0.3,
  track_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS learning.gaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id TEXT NOT NULL REFERENCES learning.tracks(id) ON DELETE CASCADE,
  milestone_id TEXT REFERENCES learning.milestones(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  detail TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS learning.recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id TEXT NOT NULL REFERENCES learning.tracks(id) ON DELETE CASCADE,
  milestone_id TEXT REFERENCES learning.milestones(id) ON DELETE SET NULL,
  action_text TEXT NOT NULL,
  cta_path TEXT NOT NULL,
  priority INTEGER NOT NULL DEFAULT 50,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS learning.reflections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  track_id TEXT REFERENCES learning.tracks(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS learning.track_weights (
  id TEXT PRIMARY KEY DEFAULT 'default',
  evidence_weight NUMERIC(4,3) NOT NULL DEFAULT 0.7,
  quiz_weight NUMERIC(4,3) NOT NULL DEFAULT 0.3,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS learning.provider_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_kind TEXT NOT NULL CHECK (run_kind IN ('quiz_generate', 'quiz_score')),
  provider TEXT NOT NULL,
  model_name TEXT NOT NULL,
  success BOOLEAN NOT NULL,
  fallback_used BOOLEAN NOT NULL DEFAULT FALSE,
  latency_ms INTEGER CHECK (latency_ms IS NULL OR latency_ms >= 0),
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS learning.steps (
  id TEXT PRIMARY KEY,
  milestone_id TEXT NOT NULL REFERENCES learning.milestones(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('read', 'watch', 'article', 'setup', 'build', 'quiz', 'evidence')),
  title TEXT NOT NULL,
  content_markdown TEXT,
  url TEXT,
  validation_command TEXT,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS learning.owner_profile (
  singleton BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (singleton),
  owner_user_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION learning.is_owner_user()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM learning.owner_profile profile
    WHERE profile.singleton = TRUE
      AND profile.owner_user_id = auth.uid()
  );
$$;

DROP TRIGGER IF EXISTS set_updated_at_tracks ON learning.tracks;
CREATE TRIGGER set_updated_at_tracks BEFORE UPDATE ON learning.tracks
FOR EACH ROW EXECUTE FUNCTION learning.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_milestones ON learning.milestones;
CREATE TRIGGER set_updated_at_milestones BEFORE UPDATE ON learning.milestones
FOR EACH ROW EXECUTE FUNCTION learning.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_artifacts ON learning.artifacts;
CREATE TRIGGER set_updated_at_artifacts BEFORE UPDATE ON learning.artifacts
FOR EACH ROW EXECUTE FUNCTION learning.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_gaps ON learning.gaps;
CREATE TRIGGER set_updated_at_gaps BEFORE UPDATE ON learning.gaps
FOR EACH ROW EXECUTE FUNCTION learning.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_recommendations ON learning.recommendations;
CREATE TRIGGER set_updated_at_recommendations BEFORE UPDATE ON learning.recommendations
FOR EACH ROW EXECUTE FUNCTION learning.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_reflections ON learning.reflections;
CREATE TRIGGER set_updated_at_reflections BEFORE UPDATE ON learning.reflections
FOR EACH ROW EXECUTE FUNCTION learning.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_steps ON learning.steps;
CREATE TRIGGER set_updated_at_steps BEFORE UPDATE ON learning.steps
FOR EACH ROW EXECUTE FUNCTION learning.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_learning_milestones_track ON learning.milestones(track_id, order_index);
CREATE INDEX IF NOT EXISTS idx_learning_steps_milestone ON learning.steps(milestone_id, order_index);
CREATE INDEX IF NOT EXISTS idx_learning_artifacts_track ON learning.artifacts(track_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_learning_artifacts_milestone ON learning.artifacts(milestone_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_learning_quiz_responses_milestone ON learning.quiz_responses(milestone_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_learning_gaps_status ON learning.gaps(status, severity, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_learning_recommendations_priority ON learning.recommendations(priority DESC, created_at DESC);

-- Single-user baseline RLS (service role bypasses this for backend jobs).
ALTER TABLE learning.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning.steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning.artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning.evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning.quiz_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning.progress_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning.gaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning.reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning.track_weights ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning.provider_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning.owner_profile ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='learning' AND tablename='tracks' AND policyname='single_user_access_tracks'
  ) THEN
    CREATE POLICY single_user_access_tracks ON learning.tracks FOR ALL TO authenticated
    USING (learning.is_owner_user()) WITH CHECK (learning.is_owner_user());
  END IF;
END$$;

-- Apply the same broad authenticated policy for single-user mode.
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'milestones','steps','artifacts','evaluations','quiz_questions','quiz_responses','progress_snapshots',
    'gaps','recommendations','reflections','track_weights','provider_runs'
  ]
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies WHERE schemaname='learning' AND tablename=tbl AND policyname='single_user_access_' || tbl
    ) THEN
      EXECUTE format(
        'CREATE POLICY %I ON learning.%I FOR ALL TO authenticated USING (learning.is_owner_user()) WITH CHECK (learning.is_owner_user());',
        'single_user_access_' || tbl,
        tbl
      );
    END IF;
  END LOOP;
END$$;

INSERT INTO learning.track_weights(id, evidence_weight, quiz_weight)
VALUES ('default', 0.7, 0.3)
ON CONFLICT (id) DO UPDATE SET evidence_weight = EXCLUDED.evidence_weight, quiz_weight = EXCLUDED.quiz_weight;

INSERT INTO learning.tracks (id, name, description, category, order_index) VALUES
  ('llm_fundamentals', 'LLM Fundamentals', 'Tokenization, context windows, structured output and tool-calling basics.', 'core', 10),
  ('reliability', 'Reliability Engineering', 'State machines, retries, timeouts, idempotency and failure recovery.', 'core', 20),
  ('rag_memory', 'RAG and Memory Systems', 'Retrieval quality, memory tiers and reranking.', 'core', 30),
  ('orchestration', 'Durable Orchestration', 'Queue + workflow architecture with approvals.', 'core', 40),
  ('governance_security', 'Governance and Security', 'Policy gates, audit trails and prompt-injection defense.', 'core', 50),
  ('economics', 'Multi-Agent Economics', 'Expected value, budget allocation and ROI gating.', 'core', 60),
  ('a2a', 'A2A Protocol', 'Google Agent-to-Agent protocol patterns and interoperability.', 'core', 70),
  ('webmcp', 'WebMCP', 'Browser-facing model context protocol and agent-ready web systems.', 'core', 80),
  ('lang_orchestration', 'LangChain / LangGraph / LangSmith', 'Orchestration primitives with observability and eval loops.', 'core', 90),
  ('agent_payments', 'x402 / Agent Payments', 'Agent payment rails: crypto x402 and fiat AP2/UCP models.', 'elective', 100),
  ('agent_identity', 'ERC-8004 Identity', 'On-chain agent identity, delegation and trust boundaries.', 'elective', 110),
  ('voice_agents', 'Voice Agents', 'Real-time voice agent stacks and operations.', 'later_phase', 120),
  ('harness_engineering', 'Harness Engineering', 'System prompts, tools, middleware, self-verification loops, trace-driven improvement.', 'core', 125)
ON CONFLICT (id) DO NOTHING;

INSERT INTO learning.milestones (
  id, track_id, title, theory_markdown, build_exercise_markdown, status, order_index, required_quiz
) VALUES
  ('llm_fundamentals_m1', 'llm_fundamentals', 'Schema-constrained outputs', 'Study why strict schemas reduce hallucination surface.', 'Run `npm run agentic:demo`, then tighten contracts and inspect behavior.', 'not_started', 10, true),
  ('llm_fundamentals_m2', 'llm_fundamentals', 'Prompt repair path', 'Learn how recovery prompts handle malformed outputs.', 'Inject malformed response in quiz flow and verify fallback scoring path.', 'not_started', 20, true),
  ('reliability_m1', 'reliability', 'Retry classification', 'Understand transient vs permanent failure taxonomy.', 'Run tests and verify retry behavior on 429 vs 400.', 'not_started', 10, true),
  ('reliability_m2', 'reliability', 'Idempotency safety', 'Learn where duplicate side effects occur.', 'Generate deterministic idempotency keys for a fake tool sequence.', 'not_started', 20, true),
  ('rag_memory_m1', 'rag_memory', 'Memory tier ranking', 'Understand working vs episodic vs semantic recall priority.', 'Run memory ranking and compare old vs fresh record outcomes.', 'not_started', 10, true),
  ('rag_memory_m2', 'rag_memory', 'Hybrid retrieval quality', 'Understand lexical + vector + rerank tradeoffs.', 'Build a benchmark and compare rerank on/off precision.', 'not_started', 20, true),
  ('orchestration_m1', 'orchestration', 'State transition legality', 'Study workflow states and replay-safe boundaries.', 'Force illegal transitions and verify deterministic rejection.', 'not_started', 10, true),
  ('orchestration_m2', 'orchestration', 'Human approval checkpoint', 'Understand pause/resume around high-risk actions.', 'Simulate approval request and resume path with audit event.', 'not_started', 20, true),
  ('governance_security_m1', 'governance_security', 'Prompt injection resistance', 'Recognize tool-exfiltration prompts and denial patterns.', 'Run injection checks and verify blocked tools stay blocked.', 'not_started', 10, true),
  ('governance_security_m2', 'governance_security', 'Immutable audit trail', 'Understand why append-only logs are required.', 'Review run events and validate no-update/no-delete constraints.', 'not_started', 20, true),
  ('economics_m1', 'economics', 'Expected value gating', 'Study value thresholds for autonomous execution.', 'Simulate low EV task and verify route-to-human policy outcome.', 'not_started', 10, true),
  ('economics_m2', 'economics', 'Cost-per-success tracking', 'Track where automation creates or destroys value.', 'Compute ROI with different model tiers and compare.', 'not_started', 20, true),
  ('a2a_m1', 'a2a', 'Handoff contract validation', 'Understand required fields in A2A payloads.', 'Run `node scripts/dashboard/mock-a2a-handoff.mjs` and validate accepted/rejected payloads.', 'not_started', 10, true),
  ('a2a_m2', 'a2a', 'Timeout + retry semantics', 'Model acknowledgement and retry strategy for handoff failures.', 'Inject delayed response and verify retry policy.', 'not_started', 20, true),
  ('webmcp_m1', 'webmcp', 'Capability detection', 'Understand WebMCP compatibility checks and risk labels.', 'Run `node scripts/dashboard/mock-webmcp-check.mjs` with compatibility toggles.', 'not_started', 10, true),
  ('webmcp_m2', 'webmcp', 'Fallback architecture', 'Design robust fallback to HTTP tools when WebMCP is unavailable.', 'Implement and verify fallback in mock route.', 'not_started', 20, true),
  ('lang_orchestration_m1', 'lang_orchestration', 'Graph orchestration patterns', 'Understand node boundaries and persisted state.', 'Model a planner-executor-critic graph with deterministic transitions.', 'not_started', 10, true),
  ('lang_orchestration_m2', 'lang_orchestration', 'Trace-driven eval loop', 'Use traces to drive prompt/policy improvements.', 'Run `node scripts/dashboard/mock-lang-eval-loop.mjs` and interpret promotion decision.', 'not_started', 20, true),
  ('agent_payments_m1', 'agent_payments', 'x402 Buyer Pattern', 'Set up a wallet and make x402 payments to agent services.', 'Run `node scripts/dashboard/mock-payment-gating.mjs` and make a real x402 payment.', 'not_started', 10, true),
  ('agent_payments_m2', 'agent_payments', 'x402 Seller Pattern', 'Build an API with x402 payment middleware.', 'Create a simple API that requires x402 payments and test it.', 'not_started', 20, true),
  ('agent_payments_m3', 'agent_payments', 'Budget Controls & Monitoring', 'Implement spend controls and payment monitoring.', 'Build budget enforcement and alerting for agent payment flows.', 'not_started', 30, true),
  ('agent_identity_m1', 'agent_identity', 'ERC-8004 Identity Standard', 'Learn the agent identity specification and registry pattern.', 'Read the EIP-8004 specification thoroughly.', 'not_started', 10, true),
  ('agent_identity_m2', 'agent_identity', 'Agent Registration File', 'Create and deploy an agent identity file.', 'Build and deploy a `.well-known/agent.json` file for identity verification.', 'not_started', 20, true),
  ('agent_identity_m3', 'agent_identity', 'Trust Boundaries & Delegation', 'Implement delegation and revocation controls.', 'Build a trust boundary system with delegation capabilities.', 'not_started', 30, true),
  ('voice_agents_m1', 'voice_agents', 'Real-time Voice Architecture', 'Understand voice agent latency budgets and streaming.', 'Run `node scripts/dashboard/mock-voice-latency.mjs` and analyze latency patterns.', 'not_started', 10, true),
  ('voice_agents_m2', 'voice_agents', 'Voice Quality & Compliance', 'Learn voice quality metrics and compliance requirements.', 'Implement voice quality monitoring and compliance checks.', 'not_started', 20, true),
  ('voice_agents_m3', 'voice_agents', 'Voice Agent Operations', 'Understand production voice agent deployment and monitoring.', 'Build a production-ready voice agent with monitoring and alerting.', 'not_started', 30, true),
  ('harness_engineering_m1', 'harness_engineering', 'Harness Engineering Fundamentals', 'System prompts, tools, middleware - the knobs you turn for agent behavior.', 'Build a basic harness with progressive disclosure pattern.', 'not_started', 10, true),
  ('harness_engineering_m2', 'harness_engineering', 'Self-Verification & Trace Analysis', 'Build-verify-fix loops and trace-driven improvement.', 'Set up LangSmith tracing and build a self-verification workflow.', 'not_started', 20, true),
  ('harness_engineering_m3', 'harness_engineering', 'Repository as System of Record', 'Agent-first repository design with AGENTS.md and entropy management.', 'Design and implement an agent-first repository structure.', 'not_started', 30, true)
ON CONFLICT (id) DO NOTHING;
