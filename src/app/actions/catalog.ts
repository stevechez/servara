'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createService(formData: FormData) {
  const supabase = await createClient();

  // 1. Extract the data from the form
  const user_id = formData.get('user_id') as string;
  const name = formData.get('name') as string;
  const category = formData.get('category') as string;
  const price = parseFloat(formData.get('price') as string);
  const estimated_duration = formData.get('estimated_duration') as string;
  const description = formData.get('description') as string;

  // Optional fields (fallback to null or 0 if empty)
  const materials_cost = parseFloat(formData.get('materials_cost') as string) || 0;
  const service_code = formData.get('service_code') as string;
  const taxable = formData.get('taxable') === 'true';

  // 2. Insert into Supabase
  const { error } = await supabase.from('services').insert({
    user_id,
    name,
    category,
    price,
    estimated_duration,
    description,
    materials_cost,
    service_code,
    taxable,
  });

  if (error) {
    console.error('Error creating service:', error);
    throw new Error(error.message);
  }

  // 3. Tell Next.js to refresh the Catalog page so the new item appears instantly
  revalidatePath('/dashboard/catalog');
}
