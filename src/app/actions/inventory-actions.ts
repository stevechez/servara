'use server';

import { createClient } from '@/lib/supabase/server';

export async function addPartToJob(jobId: string, partId: string, quantity: number) {
  const supabase = await createClient();

  // 1. Get Part details (Price and current stock)
  const { data: part } = await supabase
    .from('parts')
    .select('price, stock_quantity')
    .eq('id', partId)
    .single();

  if (!part || part.stock_quantity < quantity) {
    return { success: false, error: 'Insufficient stock' };
  }

  // 2. Record the usage
  await supabase.from('job_parts').insert({
    job_id: jobId,
    part_id: partId,
    quantity: quantity,
    total_price: part.price * quantity,
  });

  // 3. Decrement Inventory
  await supabase
    .from('parts')
    .update({ stock_quantity: part.stock_quantity - quantity })
    .eq('id', partId);

  return { success: true };
}
