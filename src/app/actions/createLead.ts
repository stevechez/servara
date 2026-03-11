'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createLead(formData: FormData) {
  const supabase = await createClient();

  const first_name = formData.get('first_name') as string;
  const last_name = formData.get('last_name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;

  const { error } = await supabase
    .from('leads')
    .insert([{ 
      first_name, 
      last_name, 
      email, 
      phone,
      source: 'manual', // Tags them as a manually entered lead
      status: 'new'
    }]);

  if (error) {
    return { success: false, error: error.message };
  }

  // Instantly refresh the Leads page to show the new entry
  revalidatePath('/dashboard/leads');
  return { success: true };
}