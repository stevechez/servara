export function calculateJobPrediction(job: any) {
  if (job.status !== 'in_progress' || !job.actual_start_time) return null;

  const startTime = new Date(job.actual_start_time).getTime();
  const now = new Date().getTime();
  const elapsedMinutes = Math.floor((now - startTime) / 60000);

  // Use the service's estimated duration from your pricebook
  const estimatedTotal = job.services?.estimated_duration_minutes || 60;

  const remaining = estimatedTotal - elapsedMinutes;
  const progressPercent = Math.min(Math.round((elapsedMinutes / estimatedTotal) * 100), 99);

  return {
    remaining: remaining > 0 ? remaining : 0,
    isOvertime: remaining <= 0,
    progressPercent,
    etc: new Date(now + (remaining > 0 ? remaining : 5) * 60000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
  };
}
