// src/lib/actions/settings.ts
'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

export async function updateCompanySettings(formData: FormData) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const address = formData.get('address') as string

  if (!id) throw new Error("Missing company ID")

  // Update the master company record
  const { error } = await supabaseAdmin
    .from('companies')
    .update({ 
      name, 
      email, 
      phone, 
      address, 
      updated_at: new Date().toISOString() 
    })
    .eq('id', id)

  if (error) {
    console.error("SETTINGS UPDATE ERROR:", error.message)
    throw new Error(`Failed to update settings: ${error.message}`)
  }

  // Refresh the page to show the new saved data
  revalidatePath('/settings')
}