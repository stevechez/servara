import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import twilio from 'twilio';

export async function POST(req: Request) {
  const formData = await req.formData();
  const body = formData.get('Body')?.toString().toLowerCase();
  const from = formData.get('From')?.toString();

  const supabase = await createClient();

  // 1. Check if this is a new lead or existing customer
  const { data: lead } = await supabase.from('leads').select('*').eq('phone', from).single();

  let message = '';

  if (!lead) {
    // NEW LEAD LOGIC
    await supabase.from('leads').insert([
      {
        phone: from,
        status: 'new',
        notes: `Initial SMS: ${body}`,
      },
    ]);

    message =
      "Hi! We're on a job right now and missed your call. What service can we help you with today? (e.g., House Wash, Gutter Cleaning)";
  } else {
    // EXISTING LEAD - Could route to AI for pricing here
    message =
      "Thanks for the message! We've updated your request. Would you like us to send over an instant quote?";
  }

  // 2. Respond via Twilio TwiML
  const twiml = new twilio.twiml.MessagingResponse();
  twiml.message(message);

  return new Response(twiml.toString(), {
    headers: { 'Content-Type': 'text/xml' },
  });
}
