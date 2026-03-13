'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function sendReviewRequest(jobId: string) {
  const supabase = await createClient();

  // 1. Fetch Job and Customer Data
  const { data: job } = await supabase
    .from('jobs')
    .select('*, customers(name, phone)')
    .eq('id', jobId)
    .single();

  if (!job || !job.customers?.phone) {
    throw new Error('Customer phone number not found.');
  }

  // 2. Prepare the Link
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const reviewUrl = `${baseUrl}/review/${jobId}`;
  const message = `Hey ${job.customers.name.split(' ')[0]}! This is Zidro Pro. Thanks for your business! Could you take 10 seconds to rate our service here? ${reviewUrl}`;

  // 3. Trigger Twilio (Direct REST API Call)
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  const authString = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${authString}`,
      },
      body: new URLSearchParams({
        Body: message,
        From: fromNumber!,
        To: job.customers.phone, // Ensure phone is in E.164 format (+1234567890)
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Twilio Error:', errorData);
    throw new Error('Twilio failed to send SMS');
  }

  // 4. Update Database
  await supabase.from('jobs').update({ review_request_sent: true }).eq('id', jobId);

  revalidatePath(`/dashboard/jobs/${jobId}`);
  return { success: true };
}
