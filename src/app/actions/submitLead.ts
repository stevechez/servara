'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function submitLead(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const message = formData.get('message') as string;

  // Note: For a public lead form, we don't have a user_id yet
  // unless we assign it to a default "Demo Account" or Joy's ID.
  // For now, we'll just insert it.
  const { error } = await supabase.from('leads').insert([
    {
      name,
      email,
      phone,
      service_type: 'Web Inquiry',
      status: 'new',
      // Optional: replace with your actual user UUID to see it in your dashboard
      // user_id: 'your-uuid-here'
    },
  ]);

  if (error) return { success: false, error: error.message };

  revalidatePath('/dashboard/leads');
  return { success: true };
}
