'use server';

import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2026-02-25.clover', // Use the standard API version
});

export async function createPaymentLink(amount: number, jobName: string) {
  try {
    // Stripe expects amounts in cents! (e.g., $150.00 = 15000 cents)
    const amountInCents = Math.round(amount * 100);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'link'], // 'link' allows Apple Pay/Google Pay
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Invoice for: ${jobName}`,
              description: 'Thank you for your business!',
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // Redirect back to the app after payment
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard/dispatch?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard/dispatch?payment=canceled`,
    });

    return session.url;
  } catch (error) {
    console.error('Stripe Error:', error);
    throw new Error('Failed to generate Stripe link');
  }
}
