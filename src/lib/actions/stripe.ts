// src/lib/actions/stripe.ts
'use server';

import { redirect } from 'next/navigation';

// THE FIX: Accept the string 'invoiceId' as the first parameter
export async function createCheckoutSession(invoiceId: string, formData?: FormData) {
  // Simulate Stripe connection for the video
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Redirect to success state
  redirect(`/dashboard/invoices/${invoiceId}?success=true`);
}

export async function payInvoice(
  invoiceId: string,
  amount: string | number,
  customerName: string,
  formData?: FormData
) {
  // 1. Simulate the Stripe processing delay for your video
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // 2. Redirect to the invoice list with a success state.
  // Because 'redirect' interrupts the function, we aren't "returning"
  // any data to the form, which fixes the Promise<void> error!
  redirect('/dashboard/invoices?status=paid');
}
