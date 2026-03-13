'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  // UPSERT: Update if exists, Insert if missing
  const { error } = await supabase.from('profiles').upsert({
    id: user.id,
    full_name: formData.get('fullName'),
    business_name: formData.get('businessName'),
    updated_at: new Date().toISOString(),
  });

  if (error) throw new Error(error.message);

  // Instantly update the Header with the new data
  revalidatePath('/', 'layout');

  return { success: true };
}
