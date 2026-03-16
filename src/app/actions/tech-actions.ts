'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function startJob(jobId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('jobs')
    .update({
      status: 'in_progress',
      actual_start_time: new Date().toISOString(),
    })
    .eq('id', jobId);

  if (error) throw new Error(error.message);

  revalidatePath(`/dashboard/jobs/${jobId}`);
  return { success: true };
}

export async function updateWorkNotes(jobId: string, notes: string) {
  const supabase = await createClient();

  const { error } = await supabase.from('jobs').update({ work_notes: notes }).eq('id', jobId);

  if (error) throw new Error(error.message);

  // No revalidatePath needed here to prevent layout shifts while typing
  return { success: true };
}

export async function completeJob(jobId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('jobs')
    .update({
      status: 'completed',
      actual_end_time: new Date().toISOString(),
    })
    .eq('id', jobId);

  if (error) throw new Error(error.message);

  revalidatePath(`/dashboard/jobs/${jobId}`);
  return { success: true };
}

export async function updateSignature(jobId: string, signatureData: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('jobs')
    .update({ customer_signature: signatureData })
    .eq('id', jobId);

  if (error) throw new Error(error.message);
  revalidatePath(`/dashboard/jobs/${jobId}`);
  return { success: true };
}
