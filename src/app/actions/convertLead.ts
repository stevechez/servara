// src/app/actions/convertLead.ts
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

// THE FIX: Add ", formData?: FormData" to catch the second argument from LeadsListClient
export async function convertLead(idOrFormData: string | FormData, formData?: FormData) {
  return convertLeadToJob(idOrFormData, formData);
}

export async function convertLeadToJob(idOrFormData: string | FormData, formData?: FormData) {
  const supabase = await createClient();

  const leadId =
    typeof idOrFormData === 'string'
      ? idOrFormData
      : (idOrFormData.get('leadId') as string) || (idOrFormData.get('id') as string);

  if (!leadId) {
    return { success: false, error: 'No Lead ID provided' };
  }

  const { error } = await supabase.from('leads').update({ status: 'converted' }).eq('id', leadId);

  if (error) {
    console.error('Failed to convert lead:', error);
    return { success: false, error: 'Failed to update database' };
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/leads');

  return { success: true };
}
