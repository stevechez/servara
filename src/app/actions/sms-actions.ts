'use server';

import { createClient } from '@/lib/supabase/server';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

/**
 * Internal helper to log SMS events to the database
 */
async function logCommunication(jobId: string, type: string, phone: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('communication_logs').insert({
    job_id: jobId,
    type: type,
    recipient_phone: phone,
    status: 'sent',
  });

  if (error) console.error('Logging Error:', error.message);
}

/**
 * Sends a "Heads Up" text when tech is almost done with previous job
 */
export async function sendArrivalAlert(
  jobId: string,
  customerPhone: string,
  customerName: string,
  techName: string
) {
  try {
    const message = await client.messages.create({
      body: `Hi ${customerName}, this is a courtesy alert from the team. ${techName} is wrapping up their current job and will be heading your way in approximately 10-15 minutes!`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: customerPhone,
    });

    // Log the success to our communication table
    await logCommunication(jobId, 'arrival_alert', customerPhone);

    return { success: true, sid: message.sid };
  } catch (error) {
    console.error('SMS Arrival Trigger Error:', error);
    return { success: false };
  }
}

/**
 * Sends a review request after job completion
 */
export async function sendReviewRequest(
  jobId: string,
  customerPhone: string,
  customerName: string
) {
  try {
    const reviewLink = 'https://g.page/r/your-business-link/review';

    const message = await client.messages.create({
      body: `Hi ${customerName}, thanks for choosing us today! If you're happy with the service, could you leave us a quick review? It helps us out a ton: ${reviewLink}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: customerPhone,
    });

    // Log the review request
    await logCommunication(jobId, 'review_request', customerPhone);

    return { success: true, sid: message.sid };
  } catch (error) {
    console.error('Review SMS Error:', error);
    return { success: false };
  }
}
