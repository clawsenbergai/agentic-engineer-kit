-- Indexes and immutability guards.

CREATE INDEX IF NOT EXISTS idx_agent_tasks_tenant_created
  ON agentic.agent_tasks (tenant_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_agent_runs_task_started
  ON agentic.agent_runs (task_id, started_at DESC);

CREATE INDEX IF NOT EXISTS idx_agent_runs_status_started
  ON agentic.agent_runs (status, started_at DESC);

CREATE INDEX IF NOT EXISTS idx_tool_invocations_run_step
  ON agentic.tool_invocations (run_id, step);

CREATE INDEX IF NOT EXISTS idx_approval_requests_run_requested
  ON agentic.approval_requests (run_id, requested_at DESC);

CREATE INDEX IF NOT EXISTS idx_memories_tenant_kind_created
  ON agentic.memories (tenant_id, kind, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_evaluation_results_case_eval
  ON agentic.evaluation_results (case_id, evaluated_at DESC);

CREATE INDEX IF NOT EXISTS idx_run_events_run_created
  ON agentic.run_events (run_id, created_at DESC);

CREATE OR REPLACE FUNCTION agentic.prevent_mutation_run_events()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'run_events is append-only';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS no_update_run_events ON agentic.run_events;
CREATE TRIGGER no_update_run_events
BEFORE UPDATE ON agentic.run_events
FOR EACH ROW EXECUTE FUNCTION agentic.prevent_mutation_run_events();

DROP TRIGGER IF EXISTS no_delete_run_events ON agentic.run_events;
CREATE TRIGGER no_delete_run_events
BEFORE DELETE ON agentic.run_events
FOR EACH ROW EXECUTE FUNCTION agentic.prevent_mutation_run_events();
