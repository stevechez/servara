'use server'

// 1. Rename the raw Supabase client so it doesn't conflict
import { createClient as createAdminClient } from '@supabase/supabase-js'

// 2. Import your Next.js Server Client
import { createClient } from '@/lib/supabase/server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// --- NORMAL USER ACTIONS ---
export async function scheduleJobFromEstimate(formData: FormData) {
  // Uses the Next.js auth-aware client
  const supabase = await createClient();
  
  const customerId = formData.get('customer_id') as string;
  const serviceType = formData.get('service_type') as string;
  const date = formData.get('scheduled_at') as string;

  if (!customerId || !serviceType) {
    throw new Error('Missing required fields');
  }

  const { data: newJob, error } = await supabase
    .from('jobs')
    .insert({
      customer_id: customerId,
      service_type: serviceType,
      status: 'scheduled',
      scheduled_at: date || new Date().toISOString(),
    })
    .select()
    .single();

  if (error || !newJob) {
    console.error("Failed to schedule job:", error);
    throw new Error("Could not schedule job from estimate.");
  }

  revalidatePath('/dashboard/jobs');
  redirect(`/dashboard/jobs/${newJob.id}`);
}


// --- ADMIN OVERRIDE ACTIONS ---
export async function approveEstimateAndCreateJob(formData: FormData) {
  // Uses the raw client with the Service Role Key to bypass rules
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const estimateId = formData.get('estimateId') as string
  if (!estimateId) throw new Error("Critical Error: Missing estimate ID")

  // 1. Fetch the Estimate details
  const { data: est, error: estError } = await supabaseAdmin
    .from('estimates')
    .select('*')
    .eq('id', estimateId)
    .single()

  if (estError || !est) throw new Error("Estimate not found in database")

  // 2. Update the Estimate status to 'approved'
  await supabaseAdmin.from('estimates').update({ status: 'approved' }).eq('id', estimateId)

  // 3. Create the actual Job record
  const { data: job, error: jobError } = await supabaseAdmin
    .from('jobs')
    .insert([{
      company_id: est.company_id, // Make sure 'company_id' exists in your jobs table, otherwise remove this line!
      customer_id: est.customer_id,
      estimate_id: est.id,
      title: `${est.service_type || 'General'} Service Job`,
      amount: est.amount,
      status: 'scheduled'
    }])
    .select()
    .single()

  if (jobError) {
    console.error("SUPABASE JOB ERROR:", jobError.message)
    throw new Error(`Job creation failed: ${jobError.message}`)
  }

  // 4. Cleanup and Redirect
  revalidatePath('/estimates')
  revalidatePath('/jobs')
  
  // Send them to the brand new job page!
  redirect(`/jobs/${job.id}`)
}

export async function updateJobStatus(formData: FormData) {
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const jobId = formData.get('jobId') as string
  const status = formData.get('status') as string

  if (!jobId || !status) {
    throw new Error("Missing job ID or status")
  }

  // 1. Update the status in the database
  const { error } = await supabaseAdmin
    .from('jobs')
    .update({ status: status })
    .eq('id', jobId)

  if (error) {
    console.error("STATUS UPDATE ERROR:", error.message)
    throw new Error(`Failed to update status: ${error.message}`)
  }

  // 2. Refresh both the list page and this specific job page
  revalidatePath('/jobs')
  revalidatePath(`/jobs/${jobId}`)
}

// Add this to the very bottom of src/lib/actions/jobs.ts

export async function completeJobAction(payload: string | FormData) {
  const supabase = await createClient();
  
  // Safely extract the ID whether it came from a <form> or an onClick={() => ...}
  const jobId = typeof payload === 'string' ? payload : payload.get('jobId') as string;

  if (!jobId) {
    throw new Error("Missing job ID");
  }

  // Update the status to 'completed'
  const { error } = await supabase
    .from('jobs')
    .update({ status: 'completed' })
    .eq('id', jobId);

  if (error) {
    console.error("COMPLETION ERROR:", error.message);
    throw new Error(`Failed to complete job: ${error.message}`);
  }

  // Refresh the UI so the dashboard updates instantly
  revalidatePath('/dashboard/jobs');
  revalidatePath('/dashboard/analytics'); 
}