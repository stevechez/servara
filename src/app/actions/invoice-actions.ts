'use server';

import { createClient } from '@/lib/supabase/server';

export async function getInvoiceData(jobId: string) {
  const supabase = await createClient();

  const { data: job, error } = await supabase
    .from('jobs')
    .select(
      `
      id,
      completed_at,
      customers (name, address, email),
      services (name, base_price),
      job_parts (
        quantity,
        total_price,
        parts (name)
      )
    `
    )
    .eq('id', jobId)
    .single();

  if (error || !job) return null;

  // FIX: Cast job to any or access [0] to bypass the TS error
  const jobData = job as any;

  // Extract base price from the first (and only) service in the array
  const basePrice = jobData.services?.[0]?.base_price || 0;

  const partsTotal =
    jobData.job_parts?.reduce((acc: number, p: any) => {
      return acc + Number(p.total_price);
    }, 0) || 0;

  const grandTotal = Number(basePrice) + partsTotal;

  return {
    ...jobData,
    serviceDetails: jobData.services?.[0], // Flatten for the UI
    partsTotal,
    grandTotal,
  };
}
