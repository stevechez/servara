'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// 1. We added 'formData: FormData' to perfectly match React's expectations
export async function completeJob(jobId: string, customerId: string, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('jobs')
    .update({ status: 'completed' })
    .eq('id', jobId);

  if (error) {
    console.error("Failed to complete job:", error);
    return; // 2. Return nothing instead of an error object
  }

  // Refresh the pages
  revalidatePath(`/customers/${customerId}`);
  revalidatePath('/'); 
  
  // Notice we removed `return { success: true }`. 
  // This satisfies TypeScript's requirement for a Promise<void> return type.
}