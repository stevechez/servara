// app/api/notifications/estimate-approved/route.ts
import { NextResponse } from 'next/server';
import { sendSMS } from '@/lib/twilio';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  // 1. Parse the body from the Supabase Webhook
  const body = await req.json();
  const { record } = body; 

  // 2. Guard Clause: Only proceed if the status is 'approved'
  if (!record || record.status !== 'approved') {
    return NextResponse.json({ message: 'Not an approval event' });
  }

  const supabase = createAdminClient();

  // 3. Fetch the detailed data (joining Customer and Profile)
  const { data: estimate, error } = await supabase
    .from('estimates')
    .select(`
      amount,
      customers (name),
      profiles!inner (full_name) 
    `)
    .eq('id', record.id)
    .single();

  if (error || !estimate) {
    console.error('Error fetching estimate details:', error);
    return NextResponse.json({ error: 'Estimate not found' }, { status: 404 });
  }

  // 4. Fix the TypeScript Array issue
  // Supabase joins can return an object or an array of objects
  const customerData: any = Array.isArray(estimate.customers) 
    ? estimate.customers[0] 
    : estimate.customers;

  const customerName = customerData?.name || 'A customer';
  const amount = estimate.amount;
  
  // 5. Fire off the SMS
  // Ensure CONTRACTOR_PHONE_NUMBER is in your .env.local
  const smsResult = await sendSMS(
    process.env.CONTRACTOR_PHONE_NUMBER!, 
    `🎉 Servara Alert: ${customerName} just approved their $${amount} quote! Schedule it here: ${process.env.NEXT_PUBLIC_SITE_URL}/jobs/new?estimate_id=${record.id}`
  );

  return NextResponse.json({ 
    success: true, 
    sms_sent: smsResult.success 
  });
}