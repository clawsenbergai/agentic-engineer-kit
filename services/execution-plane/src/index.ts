export interface ExecutionEnvelope {
  runId: string;
  taskId: string;
  model: string;
  tools: string[];
}

export function buildExecutionEnvelope(input: ExecutionEnvelope): ExecutionEnvelope {
  return { ...input };
}
