'use server';

import { createClient } from '@/lib/supabase/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from 'next/cache';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateEstimate(customerId: string, shorthand: string) {
  const supabase = await createClient();

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are a professional service estimator. 
      Convert this shorthand note into a formal service estimate: "${shorthand}"
      
      Requirements:
      1. Provide a clear Service Name.
      2. List 3-4 specific line items included in this service.
      3. Suggest a competitive total price based on professional standards.
      4. Draft a friendly, short text message to send to the client.

      IMPORTANT: Return ONLY a raw JSON object with this exact structure:
      {
        "service_name": "string",
        "items": ["string", "string"],
        "suggested_total": number,
        "client_message": "string"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the string (sometimes AI adds markdown blocks)
    const cleanJson = text.replace(/```json|```/g, "").trim();
    const aiData = JSON.parse(cleanJson);

    // Save the interaction to Supabase for history
    await supabase.from('estimates').insert([{
      customer_id: customerId,
      raw_input: shorthand,
      description: JSON.stringify(aiData),
      suggested_total: aiData.suggested_total
    }]);

    revalidatePath(`/customers/${customerId}`);
    return { success: true, data: aiData };

  } catch (error) {
    console.error("Gemini Error:", error);
    return { success: false, error: "AI failed to respond." };
  }
}