'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createJob(formData: FormData) {
  const supabase = await createClient();

  const customer_id = formData.get('customer_id') as string;
  const service_type = formData.get('service_type') as string;
  const scheduled_at = formData.get('scheduled_at') as string;

  // Safety: If amount is empty, default to 0 so parseFloat doesn't return NaN
  const rawAmount = formData.get('amount') as string;
  const amount = rawAmount ? parseFloat(rawAmount) : 0;

  const status = 'scheduled';

  const { error } = await supabase.from('jobs').insert([
    {
      customer_id,
      service_type,
      amount,
      scheduled_at,
      status,
    },
  ]);

  if (error) {
    console.error('Job Creation Error:', error.message);
    return { success: false, error: error.message };
  }

  // Ensure every relevant screen updates immediately
  revalidatePath('/dashboard');
  revalidatePath('/jobs');
  revalidatePath(`/customers/${customer_id}`);

  return { success: true };
}
