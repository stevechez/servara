// lib/actions/invoices.ts
'use server';
import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe';
import { revalidatePath } from 'next/cache';

export async function createInvoiceFromJob(jobId: string) {
	const supabase = await createClient();

	// 1. Fetch Job and associated Estimate details
	const { data: job, error: jobError } = await supabase
		.from('jobs')
		.select(
			`
      *,
      customers (id, name, email),
      estimates (amount, description)
    `,
		)
		.eq('id', jobId)
		.single();

	if (jobError || !job.estimates)
		throw new Error('Could not find linked estimate for this job.');

	// 2. Create the Invoice record in Postgres
	const { data: invoice, error: invError } = await supabase
		.from('invoices')
		.insert([
			{
				company_id: job.company_id,
				job_id: job.id,
				customer_id: job.customer_id,
				amount: job.estimates.amount,
				status: 'unpaid',
			},
		])
		.select()
		.single();

	if (invError) throw new Error(invError.message);

	// 3. Create Stripe Checkout Session
	const session = await stripe.checkout.sessions.create({
		payment_method_types: ['card'],
		line_items: [
			{
				price_data: {
					currency: 'usd',
					product_data: {
						name: `${job.estimates.description}`,
						description: `Service for ${job.customers.name} at ${job.address}`,
					},
					unit_amount: Math.round(job.estimates.amount * 100), // Stripe uses cents
				},
				quantity: 1,
			},
		],
		mode: 'payment',
		success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: `${process.env.NEXT_PUBLIC_URL}/jobs/${jobId}`,
		metadata: {
			invoice_id: invoice.id,
			company_id: job.company_id,
		},
	});

	// 4. Update Invoice with Stripe ID
	await supabase
		.from('invoices')
		.update({ stripe_payment_intent_id: session.id })
		.eq('id', invoice.id);

	revalidatePath('/invoices');
	return { checkoutUrl: session.url };
}
