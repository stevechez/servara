'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// 1. Update existing lead status (for the Kanban board)
export async function updateLeadStatus(leadId: string, newStatus: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('leads')
    .update({ status: newStatus })
    .eq('id', leadId)

  if (error) throw new Error(error.message)

  revalidatePath('/leads')
  revalidatePath('/') 
}

// 2. Create a brand new lead
// src/lib/actions/leads.ts

// src/lib/actions/leads.ts

// src/lib/actions/leads.ts

export async function createLead(formData: FormData) {
  const supabase = await createClient()

  // 1. Try to find ANY company first
  let { data: company } = await supabase
    .from('companies')
    .select('id')
    .limit(1)
    .single()

  let companyId = company?.id

  // 2. SELF-HEAL: If no company exists, create one right now from the code
  if (!companyId) {
    const { data: newCompany, error: createError } = await supabase
      .from('companies')
      .insert([{ name: 'Servara Main Office' }])
      .select()
      .single()

    if (createError) throw new Error(`Could not create company: ${createError.message}`)
    companyId = newCompany.id
  }

  // 3. Now insert the Lead using the guaranteed ID
  const { error: insertError } = await supabase
    .from('leads')
    .insert([{
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      service_requested: formData.get('service_requested') as string,
      status: 'new',
      company_id: companyId
    }])

  if (insertError) {
    console.error("Insert Error:", insertError)
    throw new Error(`Lead Insert Failed: ${insertError.message}`)
  }

  // 4. Success!
  revalidatePath('/leads')
  redirect('/leads')
}