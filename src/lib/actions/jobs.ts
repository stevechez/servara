// lib/actions/jobs.ts
'use server';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { sendSMS } from '@/lib/twilio';

export async function completeJobAction(jobId: string) {
	const supabase = await createClient();

	// 1. Update Job Status
	const { data: job, error } = await supabase
		.from('jobs')
		.update({
			status: 'completed',
			completed_at: new Date().toISOString(),
		})
		.eq('id', jobId)
		.select('*, customers(phone, name)')
		.single();

	if (error) throw new Error(error.message);

	// 2. Trigger Automation (SMS)
	if (job.customers?.phone) {
		await sendSMS(
			job.customers.phone,
			`Hi ${job.customers.name}, your service is complete! We'll send the invoice shortly. Thank you!`,
		);
	}

	revalidatePath('/jobs');
	return { success: true };
}
