'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateSettings(formData: FormData) {
  const supabase = await createClient();

  const settings = {
    business_name: formData.get('business_name'),
    business_address: formData.get('business_address'),
    business_email: formData.get('business_email'),
    business_phone: formData.get('business_phone'),
  };

  // Upsert (Update if exists, Insert if not)
  const { error } = await supabase
    .from('settings')
    .upsert({ id: '00000000-0000-0000-0000-000000000001', ...settings });

  if (error) console.error(error);

  revalidatePath('/settings');
  revalidatePath('/invoices'); // To update the PDF branding
}