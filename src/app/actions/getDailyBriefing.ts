'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function getDailyBriefing(jobs: any[]) {
  console.log("🚀 SERVER ACTION TRIGGERED with", jobs.length, "jobs");

  try {
    // Using the most widely available stable model name
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `Give me a 1-sentence greeting for a business owner who has ${jobs.length} jobs today.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    console.log("✅ GEMINI RESPONDED:", text);
    return { success: true, text };
  } catch (error: any) {
    console.error("❌ GEMINI ERROR:", error.message);
    return { success: false, error: error.message };
  }
}