// lib/actions/jobs.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function scheduleJobFromEstimate(formData: FormData) {
  const supabase = await createClient()

  const estimateId = formData.get('estimate_id') as string
  const scheduledAt = formData.get('scheduled_at') as string // from datetime-local input
  const notes = formData.get('notes') as string

  // 1. Fetch the estimate to get the customer_id and company_id
  const { data: estimate, error: estimateError } = await supabase
    .from('estimates')
    .select('company_id, customer_id, description')
    .eq('id', estimateId)
    .single()

  if (estimateError || !estimate) throw new Error("Estimate not found")

  // 2. Create the Job record
  const { error: jobError } = await supabase
    .from('jobs')
    .insert([{
      company_id: estimate.company_id,
      customer_id: estimate.customer_id,
      estimate_id: estimateId,
      scheduled_at: new Date(scheduledAt).toISOString(),
      service_type: estimate.description,
      status: 'scheduled',
      notes: notes
    }])

  if (jobError) throw new Error(jobError.message)

  // 3. Bust the cache and redirect to the calendar
  revalidatePath('/jobs')
  revalidatePath('/')
  redirect('/jobs')
}