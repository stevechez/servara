'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createCustomer(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const address = formData.get('address') as string;

  const { error } = await supabase
    .from('customers')
    .insert([{ name, email, phone, address }]);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/customers');
  return { success: true };
}