'use server';

import { createClient } from '@/lib/supabase/server';
import { sendCustomerNotification } from './notification-actions';
import { revalidatePath } from 'next/cache';

export async function dispatchTechnician(jobId: string) {
  const supabase = await createClient();

  // 1. Fetch job, tech, and customer details
  const { data: job, error: fetchError } = await supabase
    .from('jobs')
    .select('*, customers(*), technicians(*)')
    .eq('id', jobId)
    .single();

  if (fetchError || !job) return { success: false, error: 'Job not found' };

  // 2. Update Status
  const { error: updateError } = await supabase
    .from('jobs')
    .update({ status: 'en_route' })
    .eq('id', jobId);

  if (updateError) return { success: false, error: updateError.message };

  // 3. Trigger Automated SMS
  await sendCustomerNotification(job.customers.phone, job.customers.name, 'EN_ROUTE', {
    techName: job.technicians.name,
  });

  revalidatePath(`/dashboard/jobs/${jobId}`);
  return { success: true };
}
