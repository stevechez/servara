'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function saveServicesToDb(services: any[]) {
  try {
    const supabase = await createClient();

    // Insert the entire array of services at once!
    const { error } = await supabase.from('services').insert(services);

    if (error) throw error;

    // Refresh the dashboard so it grabs the new data
    revalidatePath('/');

    return { success: true };
  } catch (error: any) {
    console.error("Database Save Error:", error.message);
    return { success: false, error: error.message };
  }
}