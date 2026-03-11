'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function enrollCustomer(customerId: string, planName: string, price: number) {
  const supabase = await createClient();

  // Insert the new membership
  const { error } = await supabase
    .from('memberships')
    .insert({
      customer_id: customerId,
      plan_name: planName,
      price: price,
      status: 'active'
    });

  if (error) {
    console.error("Membership Error:", error.message);
    return { success: false, error: error.message };
  }

  // Refresh the customer page so the UI updates instantly
  revalidatePath(`/dashboard/customers/${customerId}`);
  return { success: true };
}