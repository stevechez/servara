// src/lib/actions/jobs.ts
'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function approveEstimateAndCreateJob(formData: FormData) {
  const supabaseAdmin = createClient(
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
      company_id: est.company_id,
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

// Add this to the bottom of src/lib/actions/jobs.ts

export async function updateJobStatus(formData: FormData) {
  const supabaseAdmin = createClient(
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