'use server';

import twilio from 'twilio';
import { createClient } from '@/lib/supabase/server';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

type NotificationType = 'SCHEDULED' | 'EN_ROUTE' | 'COMPLETED';

export async function sendCustomerNotification(
  phone: string,
  customerName: string,
  type: NotificationType,
  details?: { techName?: string; arrivalTime?: string; invoiceLink?: string }
) {
  let message = '';

  switch (type) {
    case 'SCHEDULED':
      message = `Hello ${customerName}, your service is confirmed for ${details?.arrivalTime}. See you soon!`;
      break;
    case 'EN_ROUTE':
      message = `Great news ${customerName}! ${details?.techName} is on the way and should arrive in roughly 15 minutes.`;
      break;
    case 'COMPLETED':
      message = `Job complete! Thank you for choosing us, ${customerName}. View your receipt here: ${details?.invoiceLink}`;
      break;
  }

  try {
    await client.messages.create({
      body: `🚨 ${message}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });
    return { success: true };
  } catch (error) {
    console.error('SMS Error:', error);
    return { success: false };
  }
}

export async function submitReview(jobId: string, rating: number, comment: string) {
  const supabase = await createClient();

  // Get the tech ID from the job first
  const { data: job } = await supabase
    .from('jobs')
    .select('technician_id')
    .eq('id', jobId)
    .single();

  const { error } = await supabase.from('job_reviews').insert({
    job_id: jobId,
    rating,
    comment,
    technician_id: job?.technician_id,
  });

  return { success: !error };
}
