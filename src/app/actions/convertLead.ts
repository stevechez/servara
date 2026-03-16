// src/app/actions/convertLead.ts
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

// 1. Keep the simple wrapper so we don't break LeadsListClient
export async function convertLead(idOrFormData: string | FormData, formData?: FormData) {
  return convertLeadToJob(idOrFormData, formData);
}

// 2. The main workhorse function
export async function convertLeadToJob(idOrFormData: string | FormData, formData?: FormData) {
  const supabase = await createClient();

  // Step A: Safely extract the ID
  const leadId =
    typeof idOrFormData === 'string'
      ? idOrFormData
      : (idOrFormData.get('leadId') as string) || (idOrFormData.get('id') as string);

  if (!leadId) {
    return { success: false, error: 'No Lead ID provided' };
  }

  // Step B: FETCH the lead so we have the data to copy
  const { data: lead, error: fetchError } = await supabase
    .from('leads')
    .select('*')
    .eq('id', leadId)
    .single();

  if (fetchError || !lead) {
    console.error('Failed to fetch lead:', fetchError);
    return { success: false, error: 'Lead not found in database' };
  }

  // Step C: Mark the original lead as converted
  const { error: updateError } = await supabase
    .from('leads')
    .update({ status: 'converted' })
    .eq('id', leadId);

  if (updateError) {
    console.error('Failed to update lead status:', updateError);
    return { success: false, error: 'Failed to update lead status' };
  }

  // Step D: THE MAGIC - Create the new Job record using the fetched data!
  const { error: insertError } = await supabase.from('jobs').insert({
    customer_name: lead.name,
    // phone: lead.phone,
    // email: lead.email,
    // service_requested: lead.service_requested, // Ensure this matches your DB column!
    status: 'new',
  });

  if (insertError) {
    console.error('Failed to create job:', insertError);
    return { success: false, error: 'Failed to create job record' };
  }

  // Step E: Refresh the pages so the new data shows up instantly
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/leads');
  revalidatePath('/dashboard/jobs'); // Added this so the Jobs page refreshes too!

  return { success: true };
}
