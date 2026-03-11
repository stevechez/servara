'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateJobStatus(jobId: string, newStatus: string, formData?: FormData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('jobs')
    .update({ status: newStatus })
    .eq('id', jobId);

  if (error) {
    console.error("Failed to update job status:", error);
    return;
  }

  // Refresh the dispatch board and the main dashboard
  revalidatePath('/jobs');
  revalidatePath('/'); 
}