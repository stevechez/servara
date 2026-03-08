import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import twilio from 'twilio';

export async function POST(req: Request) {
  console.log("🟢 1. WEBHOOK HIT: /api/missed-call");
  
  try {
    const body = await req.text();
    console.log("📦 2. Raw Body Received:", body);
    
    const params = new URLSearchParams(body);
    const callerPhone = params.get('From'); 
    
    console.log("📞 3. Caller Phone parsed:", callerPhone);

    if (!callerPhone) {
      console.log("❌ ERROR: No caller phone found in the request.");
      return new NextResponse("Missing caller phone", { status: 400 });
    }

    console.log("🔧 4. Initializing Supabase...");
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    console.log("🔍 5. Fetching user from database...");
    const { data: authUsers, error: userError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (userError) throw new Error("Supabase Auth Error: " + userError.message);
    if (!authUsers || authUsers.users.length === 0) throw new Error("No users found in database!");
    
    const primaryUser = authUsers.users[0];
    console.log("👤 6. Found User ID:", primaryUser.id);

    console.log("✉️ 7. Attempting to send Twilio SMS...");
    const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    await twilioClient.messages.create({
      body: "Hi! This is Servara. We missed your call—how can we help you today?",
      from: process.env.TWILIO_PHONE_NUMBER,
      to: callerPhone
    });
    console.log("✅ 8. SMS Sent Successfully!");

    console.log("💾 9. Saving lead to database...");
    const { error: dbError } = await supabaseAdmin.from('call_leads').insert({
      user_id: primaryUser.id,
      caller_phone: callerPhone,
      sms_thread_status: 'pending'
    });
    
    if (dbError) throw new Error("Database Insert Error: " + dbError.message);
    console.log("✅ 10. Database Saved!");

    // Send the voice response back to Twilio
    const twiml = `
      <Response>
        <Say>Thanks for calling. We just sent you a text message.</Say>
        <Hangup />
      </Response>
    `;
    return new NextResponse(twiml, { headers: { 'Content-Type': 'text/xml' } });

  } catch (error: any) {
    console.error('🚨 FATAL ERROR:', error.message);
    return new NextResponse('<Response><Say>Application error</Say></Response>', { 
      status: 500, 
      headers: { 'Content-Type': 'text/xml' } 
    });
  }
}