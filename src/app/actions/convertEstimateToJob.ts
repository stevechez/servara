'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function convertEstimateToJob(customerId: string, aiData: any) {
  const supabase = await createClient();

  // We set the date to "Today" by default, but it can be changed in the Calendar later
  const today = new Date().toISOString().split('T')[0];

  const { error } = await supabase
    .from('jobs')
    .insert([{
      customer_id: customerId,
      service_type: aiData.service_name,
      amount: aiData.suggested_total,
      notes: aiData.items.join(', '), // Store AI items in the notes
      scheduled_at: today,
      status: 'scheduled'
    }]);

  if (error) {
    console.error("Conversion failed:", error);
    return { success: false };
  }

  revalidatePath(`/dashboard/customers/${customerId}`);
  revalidatePath('/dashboard/calendar');
  revalidatePath('/dashboard'); // Update Dashboard stats
  
  return { success: true };
}