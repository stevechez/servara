// lib/twilio.ts
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

// Only initialize the client if we have the keys
const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

export async function sendSMS(to: string, body: string) {
	if (!client || !twilioPhone) {
		console.warn('Twilio is not configured. Mocking SMS send:');
		console.warn(`To: ${to} | Message: ${body}`);
		return { success: false, error: 'Twilio config missing. Check .env' };
	}

	try {
		const message = await client.messages.create({
			body,
			from: twilioPhone,
			to,
		});
		console.log(`SMS sent successfully: ${message.sid}`);
		return { success: true, sid: message.sid };
	} catch (error) {
		console.error('Twilio Error:', error);
		return { success: false, error };
	}
}
