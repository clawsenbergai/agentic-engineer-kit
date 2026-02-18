-- Core schema for agentic operations and governance.
-- Postgres-first design with jsonb for flexible metadata.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE SCHEMA IF NOT EXISTS agentic;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'agent_status') THEN
    CREATE TYPE agentic.agent_status AS ENUM (
      'queued',
      'running',
      'waiting_approval',
      'succeeded',
      'failed',
      'cancelled'
    );
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'risk_level') THEN
    CREATE TYPE agentic.risk_level AS ENUM ('low', 'medium', 'high');
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS agentic.agent_tasks (
  task_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL,
  goal TEXT NOT NULL,
  priority INTEGER NOT NULL CHECK (priority BETWEEN 1 AND 100),
  deadline_at TIMESTAMPTZ,
  budget_usd_cap NUMERIC(12,4) NOT NULL CHECK (budget_usd_cap >= 0),
  required_tools JSONB NOT NULL DEFAULT '[]'::jsonb,
  success_criteria JSONB NOT NULL DEFAULT '[]'::jsonb,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS agentic.agent_runs (
  run_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES agentic.agent_tasks(task_id) ON DELETE CASCADE,
  model TEXT NOT NULL,
  status agentic.agent_status NOT NULL DEFAULT 'queued',
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  token_in BIGINT NOT NULL DEFAULT 0 CHECK (token_in >= 0),
  token_out BIGINT NOT NULL DEFAULT 0 CHECK (token_out >= 0),
  cost_usd NUMERIC(12,6) NOT NULL DEFAULT 0 CHECK (cost_usd >= 0),
  error_code TEXT,
  error_detail JSONB,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS agentic.tool_invocations (
  invocation_id BIGSERIAL PRIMARY KEY,
  run_id UUID NOT NULL REFERENCES agentic.agent_runs(run_id) ON DELETE CASCADE,
  step INTEGER NOT NULL CHECK (step >= 0),
  tool_name TEXT NOT NULL,
  input_json JSONB NOT NULL,
  output_json JSONB,
  latency_ms INTEGER CHECK (latency_ms IS NULL OR latency_ms >= 0),
  succeeded BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS agentic.approval_requests (
  approval_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL REFERENCES agentic.agent_runs(run_id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  risk_level agentic.risk_level NOT NULL,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  decided_at TIMESTAMPTZ,
  decision TEXT CHECK (decision IN ('approved', 'rejected')),
  decided_by TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS agentic.memories (
  memory_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('working', 'episodic', 'semantic')),
  content TEXT NOT NULL,
  embedding_ref TEXT,
  score NUMERIC(6,5),
  source TEXT,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS agentic.evaluation_cases (
  case_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  suite_name TEXT NOT NULL,
  scenario TEXT NOT NULL,
  input_json JSONB NOT NULL,
  expected_json JSONB NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS agentic.evaluation_results (
  result_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES agentic.evaluation_cases(case_id) ON DELETE CASCADE,
  run_id UUID REFERENCES agentic.agent_runs(run_id) ON DELETE SET NULL,
  passed BOOLEAN NOT NULL,
  score NUMERIC(6,4),
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  evaluated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS agentic.budget_policies (
  policy_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL,
  task_type TEXT NOT NULL,
  max_cost_usd NUMERIC(12,4) NOT NULL CHECK (max_cost_usd >= 0),
  min_expected_value_usd NUMERIC(12,4) NOT NULL,
  require_approval_above_risk agentic.risk_level NOT NULL DEFAULT 'high',
  allowed_models JSONB NOT NULL DEFAULT '[]'::jsonb,
  blocked_tools JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, task_type)
);

CREATE TABLE IF NOT EXISTS agentic.run_events (
  event_id BIGSERIAL PRIMARY KEY,
  run_id UUID NOT NULL REFERENCES agentic.agent_runs(run_id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION agentic.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at_tasks ON agentic.agent_tasks;
CREATE TRIGGER set_updated_at_tasks
BEFORE UPDATE ON agentic.agent_tasks
FOR EACH ROW EXECUTE FUNCTION agentic.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_budget_policies ON agentic.budget_policies;
CREATE TRIGGER set_updated_at_budget_policies
BEFORE UPDATE ON agentic.budget_policies
FOR EACH ROW EXECUTE FUNCTION agentic.set_updated_at();
