'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function completeJob(jobId: string) {
  const supabase = await createClient();

  // 1. Update the Job Status
  const { data: job, error: jobError } = await supabase
    .from('jobs')
    .update({ 
      status: 'completed',
      completed_at: new Date().toISOString() 
    })
    .eq('id', jobId)
    .select('*, customers(*)')
    .single();

  if (jobError || !job) return { success: false, error: jobError?.message };

  // --- START V4 AUTONOMOUS SEQUENCE ---

  // Module 9: Review Automation (Simulated for now)
  console.log(`[V4 Review] Sending SMS to ${job.customers.phone}: "Thanks for the great work! Would you mind leaving a review?"`);
  
  // Module 3: Schedule 30-Day Follow-up
  const thirtyDaysOut = new Date();
  thirtyDaysOut.setDate(thirtyDaysOut.getDate() + 30);
  
  await supabase.from('followup_events').insert({
    customer_id: job.customer_id,
    scheduled_for: thirtyDaysOut.toISOString(),
    type: '30_day_checkin',
    status: 'pending'
  });

  // Module 8: Report Generator (Flag for generation)
  console.log(`[V4 Report] Generating Before/After PDF for Job #${jobId}...`);

  // --- END V4 AUTONOMOUS SEQUENCE ---

  revalidatePath('/dashboard');
  revalidatePath(`/dashboard/customers/${job.customer_id}`);
  
  return { success: true };
}