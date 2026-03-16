import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function approveEstimateAndCreateJob(estimateId: string, formData?: FormData) {
  const supabase = await createClient();

  // 1. Fetch the original estimate to get the data
  const { data: estimate, error: fetchError } = await supabase
    .from('estimates')
    .select('*')
    .eq('id', estimateId)
    .single();

  if (fetchError || !estimate) throw new Error('Estimate not found');

  // 2. CREATE THE JOB (INSERT, not Update)
  const { error: jobError } = await supabase.from('jobs').insert({
    customer_name: estimate.customer_name,
    title: estimate.title,
    status: 'SCHEDULED', // Matches your board's expected case
    amount: estimate.amount,
    user_id: estimate.user_id,
    // We removed service_requested and others that caused errors earlier
  });

  if (jobError) throw new Error(`Job creation failed: ${jobError.message}`);

  // 3. Update the Estimate status
  await supabase.from('estimates').update({ status: 'approved' }).eq('id', estimateId);

  // 4. Cleanup and Redirect
  revalidatePath('/dashboard/jobs');
  revalidatePath('/dashboard');
  redirect('/dashboard/jobs');
}

export async function completeJobAction(jobId: string) {
  const supabase = await createClient();

  // THE FIX: Removed 'completed_at' to prevent the Schema Cache error
  const { error } = await supabase
    .from('jobs')
    .update({
      status: 'completed',
    })
    .eq('id', jobId);

  if (error) {
    console.error('Completion Error:', error.message);
    throw new Error(error.message);
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/jobs');
}
