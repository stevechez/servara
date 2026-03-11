'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

// 1. THE AI BRAIN (Forced Mock version for testing)
export async function generateQuoteFromPhoto(formData: FormData) {
  try {
    const file = formData.get('image') as File;
    
    if (!file) {
      console.error("SERVER: No file found in formData");
      throw new Error('No image provided');
    }

    console.log(`SERVER: Successfully received file: ${file.name} (${file.size} bytes)`);

    console.log("SERVER: Simulating AI processing...");
    await new Promise(resolve => setTimeout(resolve, 2500)); // 2.5s dramatic pause
    
    return {
      estimated_square_feet: 850,
      surface_condition: "Heavy mildew and dirt buildup",
      price_range: "$199 - $249",
      confidence_score: 92,
      reasoning: "Detected a standard 2-car concrete driveway with significant organic growth. Based on standard market rates of $0.25/sqft for heavy cleaning."
    };

  } catch (error) {
    console.error("SERVER CRASH:", error);
    throw new Error("Failed to analyze image.");
  }
}

// 2. THE JOB CONVERTER (Single Master Version)
export async function createJobFromQuote(quoteData: {
  price: string;
  sqft: number;
  condition: string;
  reasoning: string;
}) {
  const supabase = await createClient();

  // Grab the first customer to attach the quote to
  const { data: customer } = await supabase
    .from('customers')
    .select('id')
    .limit(1)
    .single();

  if (!customer) throw new Error("No customers found.");

  // 1. Create the Job with AI Notes and 'pending' status
  const { data: newJob, error: jobError } = await supabase
    .from('jobs')
    .insert({
      customer_id: customer.id,
      service_type: `Driveway Wash (${quoteData.sqft} sqft)`,
      status: 'pending', 
      scheduled_at: new Date().toISOString(),
      notes: `AI ANALYSIS REPORT:\n- Condition: ${quoteData.condition}\n- Est. Size: ${quoteData.sqft} sqft\n- Rationale: ${quoteData.reasoning}`
    })
    .select()
    .single();

  if (jobError || !newJob) {
    console.error("Job Error:", jobError);
    throw new Error("Failed to convert quote to job.");
  }

  // 2. Extract the numeric price (e.g., "$199" -> 199)
  const numericPrice = parseInt(quoteData.price.replace(/[^0-9]/g, '')) || 199;

  // 3. Automatically create the Pending Invoice
  const { error: invoiceError } = await supabase
    .from('invoices')
    .insert({
      job_id: newJob.id,
      customer_id: customer.id,
      amount: numericPrice,
      status: 'pending'
    });

  if (invoiceError) {
    console.error("Invoice Error:", invoiceError);
  }

  // 4. Return the ID for the UI to handle the teleport
  return newJob.id; 
}