// app/api/games/generate-content/route.js
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { gameType, difficulty = 'intermediate', count = 5 } = await request.json();
    
    console.log('🚀 Generating content for:', { gameType, difficulty, count });

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.9,
        topP: 0.95,
        maxOutputTokens: 2000,
      }
    });

    let prompt = '';

    switch (gameType) {
      case 'flashcards':
        prompt = `Create ${count} English vocabulary items for ${difficulty} level. Each item must have: word, definition, 4 options (option 0 is correct), example. Return ONLY this JSON format, no other text:

[
  {
    "word": "Resilient",
    "definition": "Able to recover quickly from difficulties",
    "options": [
      "Able to recover quickly from difficulties",
      "Very weak and fragile",
      "Always happy and cheerful", 
      "Extremely intelligent"
    ],
    "correct": 0,
    "example": "She showed resilient spirit after the setback."
  }
]`;
        break;

      case 'word-match':
        prompt = `Create ${count} word-meaning pairs for ${difficulty} level. Return ONLY this JSON format, no other text:

[
  {
    "word": "Innovative",
    "meaning": "Featuring new methods or ideas"
  }
]`;
        break;

      case 'sentence-builder':
        prompt = `Create ${count} sentence challenges for ${difficulty} level. Return ONLY this JSON format, no other text:

[
  {
    "words": ["They", "are", "planning", "a", "trip", "to", "Japan"],
    "correct": ["They", "are", "planning", "a", "trip", "to", "Japan"],
    "hint": "Basic sentence structure"
  }
]`;
        break;

      default:
        return Response.json({ error: 'Invalid game type' }, { status: 400 });
    }

    console.log('📤 Sending prompt to Gemini...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    console.log('📥 Raw AI response:', text);

    // More aggressive cleaning
    let cleanedText = text.trim();
    
    // Remove markdown code blocks
    cleanedText = cleanedText.replace(/```json/g, '').replace(/```/g, '');
    
    // Remove any text before the first [ and after the last ]
    const firstBracket = cleanedText.indexOf('[');
    const lastBracket = cleanedText.lastIndexOf(']');
    
    if (firstBracket !== -1 && lastBracket !== -1) {
      cleanedText = cleanedText.substring(firstBracket, lastBracket + 1);
    }
    
    // Remove any trailing commas before closing bracket
    cleanedText = cleanedText.replace(/,\s*\]/g, ']');
    
    console.log('🧹 Cleaned text:', cleanedText);

    try {
      const content = JSON.parse(cleanedText);
      console.log('✅ Successfully parsed JSON:', content);
      
      // Validate the content structure
      if (!Array.isArray(content) || content.length === 0) {
        throw new Error('Content is not a valid array');
      }

      return Response.json({ 
        success: true,
        content 
      });

    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError.message);
      console.error('📝 Text that failed:', cleanedText);
      
      // Try to extract JSON using regex as last resort
      const jsonMatch = cleanedText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          const recoveredContent = JSON.parse(jsonMatch[0]);
          console.log('🔄 Recovered content from regex:', recoveredContent);
          return Response.json({ 
            success: true,
            content: recoveredContent 
          });
        } catch (recoveryError) {
          console.error('❌ Recovery also failed:', recoveryError);
        }
      }
      
      return Response.json({ 
        success: false,
        error: parseError.message,
        fallback: getFallbackContent(gameType, count),
        debug: {
          raw: text,
          cleaned: cleanedText
        }
      });
    }

  } catch (error) {
    console.error('💥 API error:', error);
    return Response.json({ 
      success: false,
      error: error.message,
      fallback: getFallbackContent(gameType, count)
    }, { status: 500 });
  }
}

// Fallback content
function getFallbackContent(gameType, count) {
  const fallbacks = {
    flashcards: [
      {
        word: "Adaptable",
        definition: "Able to adjust to new conditions",
        options: ["Able to adjust to new conditions", "Very stubborn", "Always late", "Extremely rich"],
        correct: 0,
        example: "She's adaptable and can work in any environment."
      },
      {
        word: "Diligent",
        definition: "Showing care and effort in one's work",
        options: ["Showing care and effort in one's work", "Very lazy", "Extremely fast", "Always joking"],
        correct: 0,
        example: "He was diligent in completing all his assignments."
      },
      {
        word: "Versatile",
        definition: "Able to adapt to many different functions",
        options: ["Able to adapt to many different functions", "Very limited", "Extremely expensive", "Always broken"],
        correct: 0,
        example: "This tool is versatile and can be used for many tasks."
      }
    ],
    'word-match': [
      { word: "Ambitious", meaning: "Having a strong desire to succeed" },
      { word: "Creative", meaning: "Having the ability to create new ideas" },
      { word: "Efficient", meaning: "Achieving maximum productivity with minimum waste" }
    ],
    'sentence-builder': [
      {
        words: ["We", "should", "practice", "English", "every", "day"],
        correct: ["We", "should", "practice", "English", "every", "day"],
        hint: "Daily routine suggestion"
      },
      {
        words: ["Learning", "new", "words", "improves", "vocabulary"],
        correct: ["Learning", "new", "words", "improves", "vocabulary"],
        hint: "Cause and effect"
      }
    ]
  };

  return fallbacks[gameType]?.slice(0, count) || [];
}