'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function submitJobReview(jobId: string, rating: number, feedback: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('jobs')
    .update({
      customer_rating: rating,
      customer_feedback: feedback,
      status: 'completed', // Ensure it's marked as done
    })
    .eq('id', jobId);

  if (error) throw new Error(error.message);

  revalidatePath(`/dashboard/jobs/${jobId}`);
  return { success: true };
}
