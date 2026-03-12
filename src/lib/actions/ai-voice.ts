'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// 1. THE AI ANALYZER
export async function analyzeVoicemail(transcript: string) {
  // Simulating the 2-second Gemini processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // In production, you pass the audio/transcript to Gemini with a JSON schema prompt.
  // For the prototype, we return exactly what the AI would extract from our mock audio.
  return {
    name: "Sarah Jenkins",
    phone: "(555) 019-8372",
    address: "142 Oakwood Drive",
    service_requested: "Roof Soft Wash",
    urgency: "High (HOA Notice)",
    sentiment: "Stressed/Urgent",
    summary: "Customer received an HOA violation notice for roof algae. Needs it cleaned before next Tuesday to avoid a fine."
  };
}

// 2. THE LEAD CONVERTER
export async function convertCallToLead(aiData: any) {
  const supabase = await createClient();
  
  const { data: newLead, error } = await supabase.from('leads').insert({
    // Make sure these match your actual 'leads' table column names!
    name: aiData.name,
    phone: aiData.phone,
    address: aiData.address,
    status: 'new',
    notes: `AI SUMMARY: ${aiData.summary}\n\nURGENCY: ${aiData.urgency}\nREQUESTED: ${aiData.service_requested}`
  }).select().single();

  if (error) {
    console.error("Lead insertion failed:", error);
    throw new Error("Failed to create lead.");
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/leads');
  return newLead.id;
}