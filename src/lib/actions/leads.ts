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

  // 0. THE FIX: Ask Supabase who is currently logged in!
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('You must be logged in to create a lead.');
  }

  // 1. Try to find ANY company first
  let { data: company } = await supabase.from('companies').select('id').limit(1).single();
  let companyId = company?.id;

  // 2. SELF-HEAL: If no company exists, create one right now from the code
  if (!companyId) {
    const { data: newCompany, error: createError } = await supabase
      .from('companies')
      .insert([{ name: 'Zidro Main Office' }])
      .select()
      .single();

    if (createError) throw new Error(`Could not create company: ${createError.message}`);
    companyId = newCompany.id;
  }

  // 3. Now insert the Lead using the guaranteed IDs
  // 3. Now insert the Lead using ONLY the guaranteed columns
  const { error: insertError } = await supabase.from('leads').insert([
    {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      service_requested: formData.get('service_requested') as string,
      status: 'new',
      user_id: user.id, // Only sending user_id!
    },
  ]);

  if (insertError) {
    console.error('Insert Error:', insertError);
    throw new Error(`Lead Insert Failed: ${insertError.message}`);
  }

  // 4. Success!
  revalidatePath('/dashboard/leads');
  redirect('/dashboard/leads');
}

// src/lib/actions/leads.ts

// ... your existing code ...

export async function convertToJob(leadId: string) {
  const supabase = await createClient();

  // 1. Authenticate
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  // 2. Fetch the Lead's data
  const { data: lead, error: fetchError } = await supabase
    .from('leads')
    .select('*')
    .eq('id', leadId)
    .single();

  if (fetchError || !lead) throw new Error('Lead not found');

  // 3. Create the Job using the Lead's info
  const { error: jobError } = await supabase.from('jobs').insert([
    {
      customer_name: lead.name,
      user_id: user.id,
      amount: 0, // Default to $0 until you add line items
      status: 'draft',
    },
  ]);

  if (jobError) {
    console.error('Job Creation Error:', jobError);
    throw new Error(`Failed to create job: ${jobError.message}`);
  }

  // 4. Update the Lead status so it drops off the active pipeline
  await supabase.from('leads').update({ status: 'converted' }).eq('id', leadId);

  // 5. Success! Send them to the main dashboard to see their new job
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/leads');
  redirect('/dashboard');
}
