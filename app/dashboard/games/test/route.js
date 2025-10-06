// app/api/games/test/route.js
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export async function GET() {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.9,
        topP: 0.95,
        maxOutputTokens: 1000,
      }
    });

    const prompt = `
      Generate 3 English vocabulary words for intermediate level learners.
      For each word, provide:
      - The word
      - A clear definition
      - 4 multiple choice options where the first option is always the correct definition
      - An example sentence
      
      Format as valid JSON array:
      [
        {
          "word": "Eloquent",
          "definition": "Fluent or persuasive in speaking or writing",
          "options": [
            "Fluent or persuasive in speaking or writing",
            "Speaking very quietly",
            "Writing very quickly", 
            "Reading complex texts"
          ],
          "correct": 0,
          "example": "She was an eloquent speaker who captivated the audience."
        }
      ]
      
      Return ONLY the JSON array, no other text.
    `;

    console.log('Sending test prompt to Gemini...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('Raw test response:', text);

    return Response.json({ 
      rawResponse: text,
      success: true 
    });

  } catch (error) {
    console.error('Test API error:', error);
    return Response.json({ 
      error: error.message,
      success: false 
    }, { status: 500 });
  }
}