'use server';

import twilio from 'twilio';

export async function sendQuoteSms(phone: string, serviceName: string, price: number) {
  try {
    const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    const messageBody = `Hi! Here is your quick quote from Zidro. \n\nService: ${serviceName}\nEstimate: $${price}\n\nReply YES to book this job, or let us know if you have any questions!`;

    await twilioClient.messages.create({
      body: messageBody,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    return { success: true };
  } catch (error: any) {
    console.error('Twilio SMS Error:', error.message);
    return { success: false, error: error.message };
  }
}
