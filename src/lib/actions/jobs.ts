'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addLineItem(jobId: string, formData: FormData) {
  const supabase = await createClient();

  const description = formData.get('description') as string;
  const quantity = parseFloat(formData.get('quantity') as string);
  const unit_price = parseFloat(formData.get('unit_price') as string);

  // 1. Insert the new line item
  const { error: insertError } = await supabase.from('line_items').insert([
    {
      job_id: jobId,
      description,
      quantity,
      unit_price,
    },
  ]);

  if (insertError) {
    throw new Error(`Failed to add item: ${insertError.message}`);
  }

  // 2. Recalculate the Job's total amount
  const { data: items } = await supabase
    .from('line_items')
    .select('quantity, unit_price')
    .eq('job_id', jobId);

  const newTotal = items?.reduce((sum, item) => sum + item.quantity * item.unit_price, 0) || 0;

  // 3. Update the Job with the new total
  const { error: updateError } = await supabase
    .from('jobs')
    .update({ amount: newTotal })
    .eq('id', jobId);

  // WE ADDED THIS: Now it will yell at us if it fails!
  if (updateError) {
    throw new Error(`Failed to update job total: ${updateError.message}`);
  }

  // 4. Refresh the page to show the new data instantly
  revalidatePath(`/dashboard/jobs/${jobId}`);
}
