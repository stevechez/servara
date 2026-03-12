import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { lat, lng, radius = 2 } = await req.json(); // radius in miles

    // 1. DATABASE LOOKUP: Find leads within the radius
    // For the demo, we'll grab leads that haven't been "blitzed" yet
    const { data: leads, error } = await supabase
      .from('leads')
      .select('id, name, phone')
      .eq('status', 'new')
      .not('phone', 'is', null)
      .limit(5); // Safety limit for dev

    if (error) throw error;
    if (!leads || leads.length === 0) {
      return NextResponse.json({ message: 'No nearby leads found.' }, { status: 404 });
    }

    // 2. TWILIO BROADCAST
    const messagePromises = leads.map((lead) => {
      return client.messages.create({
        body: `Hi ${lead.name}! We're doing a job in your neighborhood today. Since we're already nearby, we're offering 15% off any service scheduled for this afternoon. Interested?`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: lead.phone,
      });
    });

    await Promise.all(messagePromises);

    // 3. UPDATE STATUS: Mark leads as "contacted"
    await supabase
      .from('leads')
      .update({ status: 'contacted' })
      .in(
        'id',
        leads.map((l) => l.id)
      );

    return NextResponse.json({
      success: true,
      count: leads.length,
    });
  } catch (error: any) {
    console.error('Blitz Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
