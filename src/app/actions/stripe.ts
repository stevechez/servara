'use server';

import { redirect } from 'next/navigation';
import Stripe from 'stripe';

// This grabs your secret key from your .env.local file
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2026-02-25.clover', // Use the stable API version
});

export async function payInvoice(jobId: string, amount: number, customerName: string) {
  // 1. Tell Stripe to create a secure checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Invoice for ${customerName}`,
          },
          unit_amount: Math.round(amount * 100), // Stripe calculates in cents! ($500.00 = 50000)
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    // 2. Where to send the user after they pay (or cancel)
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/invoice/${jobId}?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/invoice/${jobId}?canceled=true`,
    // 3. The metadata is CRITICAL. This tells your webhook which job to mark as "paid"
    metadata: {
      jobId: jobId,
    },
  });

  // 4. Send the user to the secure Stripe URL
  if (session.url) {
    redirect(session.url);
  } else {
    throw new Error('Failed to create Stripe session');
  }
}
