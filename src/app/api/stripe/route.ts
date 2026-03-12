import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
});

export async function POST(req: Request) {
  try {
    // 1. EXTRACT jobId and amount from the request
    const { jobId, amount, customerEmail } = await req.json();

    // ERROR CHECK: If jobId is missing here, the Stripe call will fail
    if (!jobId) {
      return NextResponse.json({ error: 'Missing Job ID' }, { status: 400 });
    }

    const supabase = await createClient();

    // 2. CREATE THE STRIPE SESSION
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Service Job #${jobId.slice(0, 8).toUpperCase()}`,
              description: 'Thank you for your business!',
            },
            unit_amount: Math.round(amount * 100), // Convert dollars to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: customerEmail,
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/dashboard`,

      // THIS IS THE KEY: We stash the ID here so the Webhook can find it later
      metadata: {
        jobId: jobId,
      },
    });

    // 3. OPTIONAL: Update the job record immediately with the pending link
    await supabase.from('jobs').update({ stripe_link: session.url }).eq('id', jobId);

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe Session Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
