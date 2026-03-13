// src/hooks/useEstimates.ts
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export function useEstimates() {
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createClient();

  const createEstimate = async (lineItems: any[], subtotal: number) => {
    setIsSaving(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Authentication required');

      // STEP 1: Create the parent "Job" record
      const { data: job, error: jobError } = await supabase
        .from('jobs')
        .insert([
          {
            user_id: user.id,
            customer_name: 'New Client (Draft)',
            service_type: lineItems[0]?.description || 'Custom Service',
            status: 'pending',
            amount: subtotal,
            location: 'TBD',
          },
        ])
        .select()
        .single();

      if (jobError) throw jobError;

      // STEP 2: Create the child "Line Items"
      const formattedLineItems = lineItems.map((item) => ({
        job_id: job.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        type: 'labor',
      }));

      const { error: lineItemError } = await supabase.from('line_items').insert(formattedLineItems);

      if (lineItemError) throw lineItemError;

      return { success: true, jobId: job.id };
    } catch (error: any) {
      console.error('Error saving estimate:', error);
      return { error: error.message };
    } finally {
      setIsSaving(false);
    }
  };

  return { createEstimate, isSaving };
}
