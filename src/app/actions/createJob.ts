'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createJob(formData: FormData) {
  const supabase = await createClient();
  const customer_id = formData.get('customer_id') as string;
  const service_type = formData.get('service_type') as string;
  const amount = parseFloat(formData.get('amount') as string);
  const scheduled_at = formData.get('scheduled_at') as string;
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

  if (error) return { success: false, error: error.message };

  revalidatePath('/jobs');
  revalidatePath(`/customers/${customer_id}`);
  return { success: true };
}
