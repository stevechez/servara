// lib/stripe.ts
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
	console.warn(
		'STRIPE_SECRET_KEY is missing. Please set it in your .env.local file.',
	);
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
	// Use the latest API version or the one pinned in your Stripe dashboard
	apiVersion: '2026-02-25.clover',
	appInfo: {
		name: 'Local Service CRM',
		version: '0.1.0',
	},
});
