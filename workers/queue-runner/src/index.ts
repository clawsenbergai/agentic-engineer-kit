export interface WorkerJob {
  jobId: string;
  runId: string;
  step: number;
}

export function normalizeJob(job: WorkerJob): WorkerJob {
  return { ...job };
}
