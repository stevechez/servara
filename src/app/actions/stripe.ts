// src/lib/actions/stripe.ts
'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function createCheckoutSession(invoiceId: string) {
  // For the demo, we simulate a 1.5-second delay to show the button's "loading" state
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // In the real world, this is where you'd call stripe.checkout.sessions.create()

  // Refresh the path to show updated status
  revalidatePath(`/dashboard/invoices/${invoiceId}`);

  // Redirect to the invoices list with a fake 'paid' status for the video
  redirect('/dashboard/invoices?status=paid');
}
