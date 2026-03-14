import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function approveEstimateAndCreateJob(estimateId: string, formData?: FormData) {
  const supabase = await createClient();

  // 1. Grab the form data
  const scheduledAt = formData?.get('scheduled_at') as string;
  const notes = formData?.get('notes') as string;

  // 2. Fetch the original estimate to get customer info and amount
  const { data: estimate, error: fetchError } = await supabase
    .from('estimates')
    .select('*')
    .eq('id', estimateId)
    .single();

  if (fetchError || !estimate) throw new Error('Estimate not found');

  // 3. Create the Job
  const { error: jobError } = await supabase.from('jobs').insert([
    {
      customer_id: estimate.customer_id,
      service_type: estimate.service_type,
      amount: estimate.amount,
      status: 'scheduled',
      scheduled_at: scheduledAt || null,
      notes: notes || '',
    },
  ]);

  if (jobError) throw new Error(`Job creation failed: ${jobError.message}`);

  // 4. Update the Estimate status
  await supabase.from('estimates').update({ status: 'approved' }).eq('id', estimateId);

  // 5. Cleanup and Redirect
  revalidatePath('/dashboard/jobs');
  revalidatePath('/dashboard');
  redirect('/dashboard/jobs');
}

export async function completeJobAction(jobId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('jobs')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
    })
    .eq('id', jobId);

  if (error) throw new Error(error.message);

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/jobs');
}
