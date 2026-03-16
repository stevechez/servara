'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Updates a job's technician and/or scheduled time
 * This is triggered by the Drag & Drop interface
 */
export async function updateJobDetails(jobId: string, updates: any) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('jobs')
    .update({
      notes: updates.notes,
      status: updates.status,
      // Add any other fields your modal allows editing
    })
    .eq('id', jobId)
    .select()
    .single();

  if (error) {
    console.error('Update Job Details Error:', error);
    return { success: false, error: error.message };
  }

  // Refresh the UI
  revalidatePath('/dashboard/dispatch');

  return { success: true, job: data };
}

export async function updateJobAssignment(jobId: string, techId: string, scheduledTime?: string) {
  const supabase = await createClient();

  const updateData: any = {
    technician_id: techId,
  };

  if (scheduledTime) {
    updateData.scheduled_time = scheduledTime;
  }

  const { data, error } = await supabase
    .from('jobs')
    .update(updateData)
    .eq('id', jobId)
    .select()
    .single();

  if (error) {
    console.error('Update Assignment Error:', error);
    return { success: false, error: error.message };
  }

  // Refresh the dispatch board data
  revalidatePath('/dashboard/dispatch');

  return { success: true, job: data };
}
export async function updateJobStatus(jobId: string, status: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('jobs')
    .update({
      status,
      // If completing, set the timestamp
      ...(status === 'completed' ? { completed_at: new Date().toISOString() } : {}),
      // If starting, set the actual start time
      ...(status === 'in_progress' ? { actual_start_time: new Date().toISOString() } : {}),
    })
    .eq('id', jobId)
    .select()
    .single();

  if (error) {
    console.error('Update Status Error:', error);
    return { success: false, error: error.message };
  }

  // Refresh the data on the dispatch board and job view
  revalidatePath('/dashboard/dispatch');
  revalidatePath(`/dashboard/jobs/${jobId}`);

  return { success: true, job: data };
}
