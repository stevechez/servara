import { createClient } from 'supabase';

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Headers':
		'authorization, x-client-info, apikey, content-type',
};

// Edge-friendly Twilio fetch
async function sendSMS(to: string, body: string) {
	const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
	const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
	const fromPhone = Deno.env.get('TWILIO_PHONE_NUMBER');

	if (!accountSid || !authToken || !fromPhone) return { success: false };

	const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
	const formData = new URLSearchParams();
	formData.append('To', to);
	formData.append('From', fromPhone);
	formData.append('Body', body);

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				Authorization: 'Basic ' + btoa(`${accountSid}:${authToken}`),
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: formData.toString(),
		});
		return { success: response.ok };
	} catch {
		return { success: false };
	}
}

Deno.serve(async req => {
	if (req.method === 'OPTIONS')
		return new Response('ok', { headers: corsHeaders });

	try {
		const supabaseUrl = Deno.env.get('SUPABASE_URL');
		const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

		if (!supabaseUrl || !supabaseKey)
			throw new Error('Missing Supabase configuration');

		const supabase = createClient(supabaseUrl, supabaseKey);

		// Fetch jobs for tomorrow
		const { data: reminders, error } = await supabase
			.from('tomorrow_reminders')
			.select('*');

		if (error) throw error;
		if (!reminders || reminders.length === 0) {
			return new Response(JSON.stringify({ message: 'No reminders today.' }), {
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				status: 200,
			});
		}

		// Send SMS for each job
		const results = await Promise.all(
			reminders.map(async r => {
				if (!r.scheduled_at) return { success: false };
				const time = new Date(r.scheduled_at).toLocaleTimeString([], {
					hour: '2-digit',
					minute: '2-digit',
				});
				const msg = `Hi ${r.customer_name}, just a reminder of your service tomorrow at ${time}.`;
				return await sendSMS(r.customer_phone, msg);
			}),
		);

		return new Response(
			JSON.stringify({ sent: results.filter(r => r.success).length }),
			{
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				status: 200,
			},
		);
	} catch (error: any) {
		return new Response(JSON.stringify({ error: error.message }), {
			headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			status: 400,
		});
	}
});
