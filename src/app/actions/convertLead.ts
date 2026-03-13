'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function convertLeadToJob(leadId: string) {
  const supabase = await createClient();

  // 1. Fetch the Lead
  const { data: lead, error: leadError } = await supabase
    .from('leads')
    .select('*')
    .eq('id', leadId)
    .single();

  if (leadError || !lead) return { success: false, error: 'Lead not found' };

  // 2. Create the Customer (Standard Apple-level CRM move)
  const { data: customer, error: custError } = await supabase
    .from('customers')
    .insert([
      {
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
      },
    ])
    .select()
    .single();

  if (custError) return { success: false, error: 'Customer creation failed' };

  // 3. Create the Job (Value: $1,250)
  const { error: jobError } = await supabase.from('jobs').insert([
    {
      customer_id: customer.id,
      service_type: lead.service_type || 'New Service',
      amount: 1250,
      status: 'scheduled',
      scheduled_at: new Date().toISOString(),
    },
  ]);

  if (jobError) return { success: false, error: 'Job creation failed' };

  // 4. Close the loop: Mark lead as converted
  await supabase.from('leads').update({ status: 'converted' }).eq('id', leadId);

  revalidatePath('/dashboard');
  return { success: true };
}
