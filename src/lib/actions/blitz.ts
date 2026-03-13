// src/lib/actions/blitz.ts
'use server';

import { createClient } from '@/lib/supabase/server';

export async function sendNeighborhoodBlitz(leads: any[], body: string) {
  // Fake delay to make the button look like it's working
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log(`Simulated sending to ${leads.length} leads. Message: "${body}"`);

  return { success: true, message: 'Blitz campaign launched! (Demo)' };
}

// ENSURE THIS NAME MATCHES YOUR IMPORT
export async function launchNeighborhoodBlitz(jobId: string) {
  const supabase = await createClient();

  try {
    // 1. Get the current job's address to find the target area
    const { data: currentJob } = await supabase
      .from('jobs')
      .select('*, customers(address)')
      .eq('id', jobId)
      .single();

    if (!currentJob) throw new Error('Job not found');

    // 2. Simulated Proximity Logic (Finding neighbors by ZIP/Street)
    // In a full production build, we'd use PostGIS coordinates here
    const zipCode = currentJob.customers?.address?.split(' ').pop() || '';

    const { data: neighbors, count } = await supabase
      .from('customers')
      .select('name', { count: 'exact' })
      .ilike('address', `%${zipCode}%`)
      .limit(10);

    // 3. Update the job record so the UI knows the Blitz is active
    await supabase.from('jobs').update({ blitz_status: 'launched' }).eq('id', jobId);

    return { success: true, count: count || 0 };
  } catch (error) {
    console.error('Blitz Action Error:', error);
    return { success: false, count: 0 };
  }
}
