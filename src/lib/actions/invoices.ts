// src/lib/actions/invoices.ts
'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function generateInvoiceFromJob(formData: FormData) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const jobId = formData.get('jobId') as string
  if (!jobId) throw new Error("Critical Error: Missing job ID")

  // 1. Fetch the Job details
  const { data: job, error: jobError } = await supabaseAdmin
    .from('jobs')
    .select('*')
    .eq('id', jobId)
    .single()

  if (jobError || !job) throw new Error("Job not found in database")

  // 2. Calculate a Due Date (Let's default to Net 14 days)
  const dueDate = new Date()
  dueDate.setDate(dueDate.getDate() + 14)

  // 3. Create the Invoice
  const { data: invoice, error: invError } = await supabaseAdmin
    .from('invoices')
    .insert([{
      job_id: job.id,
      customer_id: job.customer_id,
      company_id: job.company_id,
      amount: job.amount,
      status: 'unpaid',
      due_date: dueDate.toISOString().split('T')[0] // Format as YYYY-MM-DD
    }])
    .select()
    .single()

  if (invError) {
    console.error("SUPABASE INVOICE ERROR:", invError.message)
    throw new Error(`Invoice creation failed: ${invError.message}`)
  }

  // 4. Update the Job status to 'invoiced'
  await supabaseAdmin.from('jobs').update({ status: 'invoiced' }).eq('id', jobId)

  // 5. Cleanup and Redirect
  revalidatePath('/jobs')
  revalidatePath('/invoices')
  
  // Send them to the brand new invoice page!
  redirect(`/invoices/${invoice.id}`)
}