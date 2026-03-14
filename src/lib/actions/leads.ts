'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// 1. Update existing lead status (for the Kanban board)
export async function updateLeadStatus(leadId: string, newStatus: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('leads').update({ status: newStatus }).eq('id', leadId);
  if (error) throw new Error(error.message);

  revalidatePath('/dashboard/leads');
  revalidatePath('/dashboard');
}

// 2. Create a brand new lead
export async function createLead(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) throw new Error('You must be logged in to create a lead.');

  let { data: company } = await supabase.from('companies').select('id').limit(1).single();
  let companyId = company?.id;

  if (!companyId) {
    const { data: newCompany, error: createError } = await supabase
      .from('companies')
      .insert([{ name: 'Zidro Main Office' }])
      .select()
      .single();
    if (createError) throw new Error(`Could not create company: ${createError.message}`);
    companyId = newCompany.id;
  }

  // FIXED: This now properly includes service_requested from your form
  const { error: insertError } = await supabase.from('leads').insert([
    {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      service_requested: formData.get('service_requested') as string,
      status: 'new',
      user_id: user.id,
    },
  ]);

  if (insertError) throw new Error(`Lead Insert Failed: ${insertError.message}`);

  revalidatePath('/dashboard/leads');
  redirect('/dashboard/leads');
}

// 3. Convert Lead to Job
export async function convertToJob(leadId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { data: lead, error: fetchError } = await supabase
    .from('leads')
    .select('*')
    .eq('id', leadId)
    .single();

  if (fetchError || !lead) throw new Error('Lead not found');

  // Create the Job
  const { error: jobError } = await supabase.from('jobs').insert([
    {
      customer_name: lead.name,
      user_id: user.id,
      service_type: lead.service_requested, // Passes the info to the job!
      amount: 0,
      status: 'draft',
    },
  ]);

  if (jobError) throw new Error(`Failed to create job: ${jobError.message}`);

  // Update lead status
  await supabase.from('leads').update({ status: 'converted' }).eq('id', leadId);

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/leads');
  redirect('/dashboard');
}
