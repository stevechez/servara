'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function generateInvoice(jobId: string, customerId: string, amount: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('invoices')
    .insert([
      {
        job_id: jobId,
        customer_id: customerId,
        amount: amount,
        status: 'draft',
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Failed to create invoice:', error);
    throw new Error('Could not generate invoice');
  }

  // Refresh the job page so the new invoice shows up immediately
  revalidatePath(`/dashboard/jobs/${jobId}`);

  return data;
}
