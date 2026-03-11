'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function convertLead(leadId: string, formData: FormData) {
  const supabase = await createClient();

  // 1. Fetch the Lead's current data
  const { data: lead, error: fetchError } = await supabase
    .from('leads')
    .select('*')
    .eq('id', leadId)
    .single();

  if (fetchError || !lead) return { success: false, error: 'Could not find lead' };

  // 2. Clean up the name
  const fullName = `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || 'New Customer';

  // 3. Prevent Duplicates (Check if a customer with this email already exists)
  let customerId = null;
  if (lead.email) {
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id')
      .eq('email', lead.email)
      .single();
    
    if (existingCustomer) {
      customerId = existingCustomer.id;
    }
  }

  // 4. Create the new Customer Profile if they don't exist
  if (!customerId) {
    const { error: insertError } = await supabase
      .from('customers')
      .insert([{
        name: fullName,
        email: lead.email || null,
        phone: lead.phone || null,
        address: null // We'll leave this blank for you to fill in later during scheduling
      }]);

    if (insertError) return { success: false, error: `Failed to create customer: ${insertError.message}` };
  }

  // 5. Mark the Lead as "Converted"
  const { error: updateError } = await supabase
    .from('leads')
    .update({ status: 'converted' })
    .eq('id', leadId);

  if (updateError) return { success: false, error: updateError.message };

  // 6. Refresh BOTH pages so the UI updates instantly everywhere
  revalidatePath('/dashboard/leads');
  revalidatePath('/dashboard/customers'); 
  
  return { success: true };
}