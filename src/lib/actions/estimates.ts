// src/lib/actions/estimates.ts
'use server'

import { createClient } from '@supabase/supabase-js' 
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createEstimateFromLead(formData: FormData) {
  // 🚨 THE SLEDGEHAMMER: Use the Service Role Key to bypass ALL security
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const leadId = (formData.get('lead_id') || formData.get('leadId')) as string
  console.log("DEBUG: Processing conversion for Lead ID:", leadId)

  if (!leadId) {
    throw new Error("Critical Error: lead_id was not sent by the browser.")
  }
  
  // 1. FETCH THE LEAD (Enhanced Diagnostic Version)
  const { data: lead, error: leadError } = await supabaseAdmin
    .from('leads')
    .select('*')
    .eq('id', leadId)
    .single()

  if (leadError || !lead) {
    console.error("SUPABASE LEAD FETCH ERROR:", leadError);
    throw new Error(`Lead missing from Database. ID searched: [${leadId}]. Supabase says: ${leadError?.message || 'No data returned'}`)
  }

  // 2. GET GUARANTEED COMPANY ID
  const { data: existingCompany } = await supabaseAdmin
    .from('companies')
    .select('id')
    .limit(1)
    .single()

  if (!existingCompany) {
    throw new Error("No company found. Please go to Settings and create your company profile first.")
  }
  const companyId = existingCompany.id

  // 3. CREATE THE CUSTOMER (Using supabaseAdmin)
  const { data: customer, error: custError } = await supabaseAdmin
    .from('customers')
    .insert([{
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company_id: companyId,
      address: formData.get('address') as string || lead.address || 'Pending'
    }])
    .select()
    .single()

  if (custError) {
    console.error("SUPABASE CUSTOMER ERROR:", custError.message)
    throw new Error(`Customer creation failed: ${custError.message}`)
  }

  // 4. CREATE THE ESTIMATE (Using supabaseAdmin)
  const { data: estimate, error: estError } = await supabaseAdmin
    .from('estimates')
    .insert([{
      customer_id: customer.id,
      company_id: companyId,
      amount: formData.get('amount'),
      status: 'sent',
      service_type: lead.service_requested
    }])
    .select()
    .single()

  if (estError) {
    console.error("SUPABASE ESTIMATE ERROR:", estError.message)
    throw new Error(`Estimate creation failed: ${estError.message}`)
  }

  // 5. UPDATE LEAD STATUS & CLEANUP
  await supabaseAdmin.from('leads').update({ status: 'converted' }).eq('id', leadId)
  
  revalidatePath('/dashboard/leads')
  revalidatePath('/dashboard/estimates')
  
  // 6. SUCCESS REDIRECT
  redirect(`/dashboard/estimates/${estimate.id}`)
}