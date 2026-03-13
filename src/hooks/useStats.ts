import { useMemo } from 'react';
import { Job } from '@/types';

export function useStats(jobs: Job[]) {
  return useMemo(() => {
    // 1. Calculate Total Revenue (Only from 'paid' jobs)
    const totalRevenue = jobs
      .filter((job) => job.status === 'paid')
      .reduce((acc, job) => acc + job.amount, 0);

    // 2. Calculate Pending Revenue
    const pendingRevenue = jobs
      .filter((job) => job.status !== 'paid')
      .reduce((acc, job) => acc + job.amount, 0);

    // 3. Jobs this month
    const activeJobs = jobs.length;

    return {
      totalRevenue,
      pendingRevenue,
      activeJobs,
      averageTicket: activeJobs > 0 ? totalRevenue / activeJobs : 0,
    };
  }, [jobs]); // Only re-calculates when the jobs list changes
}
