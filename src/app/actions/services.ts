'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function saveService(formData: any) {
  const supabase = await createClient();

  const { error } = await supabase.from('services').insert([
    {
      name: formData.name,
      category: formData.category,
      base_price: parseFloat(formData.base_price),
      estimated_duration_minutes: parseInt(formData.estimated_duration_minutes),
      description: formData.description,
    },
  ]);

  if (error) throw new Error(error.message);

  revalidatePath('/dashboard/pricebook');
  return { success: true };
}
