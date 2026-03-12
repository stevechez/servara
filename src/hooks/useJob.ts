import { useState, useEffect } from 'react';
import { Job } from '@/types';
import { MOCK_JOBS } from '@/lib/sample-data';
import { createClient } from '@/utils/supabase/client'; // Your Supabase helper

export function useJobs(isDemoMode: boolean = false) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);

      if (isDemoMode) {
        // Simulating network delay for the "Real" feel
        await new Promise((resolve) => setTimeout(resolve, 800));
        setJobs(MOCK_JOBS);
        setLoading(false);
        return;
      }

      // REAL DATA LOGIC
      const supabase = createClient();
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setJobs(data as Job[]);
      }
      setLoading(false);
    }

    fetchJobs();
  }, [isDemoMode]);

  return { jobs, loading, error };
}
