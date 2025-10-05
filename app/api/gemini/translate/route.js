// app/api/gemini/translate/route.js
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { text, fromLang, toLang } = await request.json();
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const prompt = `Translate this ${fromLang} text to ${toLang}: "${text}"\n\nReturn only the translation, no explanations.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const translation = response.text().trim();
    
    return Response.json({ translation });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}