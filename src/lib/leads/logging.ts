type SafeLogInput = {
  event: string;
  provider?: string;
  jobType?: string;
  leadId?: string;
  result?: string;
  durationMs?: number;
  retryCount?: number;
  statusCodeCategory?: string;
};

export function logOperationalEvent(input: SafeLogInput) {
  console.info(JSON.stringify({ ...input, timestamp: new Date().toISOString() }));
}
