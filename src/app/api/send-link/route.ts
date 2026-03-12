import { NextResponse } from 'next/server';
import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function POST(req: Request) {
  try {
    const { phone, customerName, stripeLink } = await req.json();

    if (!phone || !stripeLink) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    await client.messages.create({
      body: `Hi ${customerName}, your service is complete! You can view your invoice and pay securely here: ${stripeLink}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
