'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the AI with your secure server-side key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateBusinessServices(businessDescription: string) {
  try {
    // We use gemini-1.5-flash because it is insanely fast and cheap
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    // The prompt that forces the AI to act like a business consultant and return strict JSON
    const prompt = `
      You are an expert business consultant. A user is starting a business based on this description: "${businessDescription}".
      Generate a list of 4 standard services they should offer.
      
      You must respond ONLY with a raw JSON array of objects. Do not include markdown formatting, backticks, or any other text.
      Each object must have exactly these keys:
      - "name" (string, short and catchy)
      - "description" (string, professional, 1 sentence)
      - "price" (number, realistic starting price in USD)
      
      Example format:
      [{"name": "Basic Wash", "description": "Exterior wash and dry.", "price": 50}]
    `;

    // Fire the request to Gemini
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Clean up any accidental markdown the AI might have added
    const cleanJson = responseText.replace(/```json/gi, '').replace(/```/gi, '').trim();
    
    // Parse the JSON string into real JavaScript objects
    const services = JSON.parse(cleanJson);

    return { success: true, services };
  } catch (error: any) {
    console.error("AI Generation Failed:", error);
    return { success: false, error: error.message };
  }
}