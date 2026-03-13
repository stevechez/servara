'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createLead(formData: FormData) {
  const supabase = await createClient();

  const rawFormData = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    service: formData.get('service') as string,
  };

  // Basic validation - Apple level quality starts with not letting junk in
  if (!rawFormData.email || !rawFormData.name) {
    return { success: false, error: 'Name and Email are required.' };
  }

  const { data, error } = await supabase.from('leads').insert([
    {
      name: rawFormData.name,
      email: rawFormData.email,
      phone: rawFormData.phone,
      service_type: rawFormData.service,
      status: 'new',
    },
  ]);

  if (error) {
    console.error('Supabase Error:', error);
    return { success: false, error: 'Database connection failed.' };
  }

  revalidatePath('/dashboard'); // Updates the dashboard feed instantly
  return { success: true };
}
