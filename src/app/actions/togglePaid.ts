'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function togglePaid(jobId: string, currentState: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('jobs')
    .update({ is_paid: !currentState })
    .eq('id', jobId);

  if (error) {
    console.error("Payment update failed:", error);
    return;
  }

  revalidatePath('/invoices');
  revalidatePath('/'); // Update dashboard stats
}