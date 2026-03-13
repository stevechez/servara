import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Job } from '@/types';

export function useInvoice(jobId: string) {
  const [invoice, setInvoice] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInvoice() {
      if (!jobId) return;

      const supabase = createClient();

      // 1. Fetch the data using .limit(1) to avoid the "coerce" error
      const { data, error: supabaseError } = await supabase
        .from('jobs')
        .select(
          `
          *,
          line_items (*)
        `
        )
        .eq('id', jobId)
        .limit(1);

      // 2. Handle Database Errors
      if (supabaseError) {
        console.error('Supabase Error:', supabaseError.message, supabaseError.hint);
        setError(`Database Error: ${supabaseError.message}`);
        setLoading(false);
        return;
      }

      // 3. Handle "Not Found" (The RLS or Wrong ID case)
      if (!data || data.length === 0) {
        console.error('No rows returned. Check RLS policies or Job ID.');
        setError('Invoice not found. Please verify the link or contact the contractor.');
        setLoading(false);
        return;
      }

      // 4. Success: Set the first (and only) item as the invoice
      setInvoice(data[0] as Job);
      setLoading(false);
    }

    fetchInvoice();
  }, [jobId]);

  return { invoice, loading, error };
}
