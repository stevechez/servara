// NextResponse comes from /server
import { NextResponse } from 'next/server';

// headers comes from /headers
import { headers } from 'next/headers';

import Stripe from 'stripe';

import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
});

// Initialize Supabase Service Role (Bypasses RLS to update status)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // You need this in your .env
);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('Stripe-Signature') as string;

  let event: Stripe.Event;

  try {
    // 1. Verify the event came from Stripe
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error(`Webhook Signature Error: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // 2. Handle the specific event: checkout.session.completed
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const jobId = session.metadata?.jobId;

    if (jobId) {
      console.log(`🔔 Payment received for Job: ${jobId}`);

      // 3. Update Supabase status to 'paid'
      const { error } = await supabaseAdmin.from('jobs').update({ status: 'paid' }).eq('id', jobId);

      if (error) {
        console.error('Supabase Update Error:', error);
        return new Response('Database update failed', { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
