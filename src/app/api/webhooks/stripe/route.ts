import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
});

// This is a special secret Stripe gives you for the webhook specifically
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    // 1. Verify the event came from Stripe
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // 2. Handle the successful payment event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const jobId = session.metadata?.jobId;

    if (jobId) {
      const supabase = await createClient();
      
      // 3. Update the Job status automatically
      const { error } = await supabase
        .from('jobs')
        .update({ is_paid: true })
        .eq('id', jobId);

      if (error) {
        console.error('Supabase update failed during webhook:', error);
        return new NextResponse('Database update failed', { status: 500 });
      }
      
      console.log(`Job ${jobId} successfully marked as paid via Stripe.`);
    }
  }

  return new NextResponse('Success', { status: 200 });
}