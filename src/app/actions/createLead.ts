// src/app/actions/createLead.ts
'use server';
import { createClient } from '@/lib/supabase/server';

export async function createLead(formData: FormData) {
  const supabase = await createClient();

  const rawFormData = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    service: formData.get('service'),
    status: 'new', // This ensures it shows up as "New Lead" in your feed
  };

  const { data, error } = await supabase.from('leads').insert([rawFormData]);

  if (error) return { success: false };
  return { success: true };
}
