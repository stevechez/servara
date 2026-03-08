// src/lib/actions/stripe.ts
'use server'

import Stripe from 'stripe'
import { redirect } from 'next/navigation'

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover', // Use the latest API version
})

export async function createCheckoutSession(formData: FormData) {
  const invoiceId = formData.get('invoiceId') as string
  const amountStr = formData.get('amount') as string
  const jobTitle = formData.get('jobTitle') as string || 'Service Rendering'
  
  // Stripe expects amounts in CENTS (e.g., $100.00 = 10000)
  const amountInCents = Math.round(parseFloat(amountStr) * 100)

  // Get the base URL of your app so Stripe knows where to send them back
  const appUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  try {
    // Create the secure Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Invoice ${invoiceId.split('-')[0].toUpperCase()}`,
              description: jobTitle,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // Send them back to the invoice page when done
      success_url: `${appUrl}/invoices/${invoiceId}?payment=success`,
      cancel_url: `${appUrl}/invoices/${invoiceId}`,
    })

    // If Stripe created the URL successfully, redirect the user there
    if (session.url) {
      redirect(session.url)
    } else {
      throw new Error("Stripe did not return a checkout URL")
    }
  } catch (error: any) {
    console.error("STRIPE ERROR:", error)
    throw new Error(`Payment setup failed: ${error.message}`)
  }
}