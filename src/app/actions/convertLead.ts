'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function convertMissedCall(leadId: string, callerPhone: string) {
  try {
    // 1. Initialize the secure SERVER Supabase client
    const supabase = await createClient();

    // 2. Format phone for a nice name
    const formatPhone = (phone: string) => {
      const cleaned = ('' + phone).replace(/\D/g, '');
      const match = cleaned.match(/^1?(\d{3})(\d{3})(\d{4})$/);
      if (match) return `(${match[1]}) ${match[2]}-${match[3]}`;
      return phone;
    };
    const prettyPhone = formatPhone(callerPhone);
    const callerName = `New Caller ${prettyPhone}`;

    // 3. Create a new Customer record
    const { data: newCustomer, error: customerError } = await supabase
      .from('customers')
      .insert({
        name: callerName,
        phone: callerPhone,
      })
      .select()
      .single();

    if (customerError) throw customerError;

    // 4. Create a new Lead attached to that Customer
    const { error: leadError } = await supabase
      .from('leads')
      .insert({
        name: `Missed Call Inquiry: ${prettyPhone}`, // 🟢 THE FIX IS RIGHT HERE!
        customer_id: newCustomer.id,
        status: 'new'
      });

    if (leadError) throw leadError;

    // 5. Mark the missed call as 'converted'
    const { error: updateError } = await supabase
      .from('call_leads')
      .update({ sms_thread_status: 'converted' })
      .eq('id', leadId);

    if (updateError) throw updateError;

    // 6. Tell Next.js to instantly refresh the dashboard data!
    revalidatePath('/');

    return { success: true };
  } catch (error: any) {
    console.error("Server Action Error:", error.message);
    return { success: false, error: error.message };
  }
}