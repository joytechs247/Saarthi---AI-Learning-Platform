// app/api/gemini/chat/route.js
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { prompt, context } = await request.json();
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.8,
        topP: 0.9,
        topK: 40,
      }
    });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return Response.json({ response: text });
  } catch (error) {
    console.error('Gemini API error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}