// import { GoogleGenerativeAI } from '@google/generative-ai';

// // Initialize Gemini
// let genAI;
// try {
//   genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
//   console.log('Gemini AI initialized successfully');
// } catch (error) {
//   console.error('Gemini AI initialization failed:', error);
// }

// export const correctGrammar = async (text) => {
//   if (!genAI || !process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
//     return text; // Fallback to original text
//   }

//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-pro" });
//     const prompt = `Correct ONLY the grammar and spelling of this English text. Return JUST the corrected version, no explanations: "${text}"`;
    
//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const corrected = response.text().trim();
    
//     return corrected.replace(/^"(.*)"$/, '$1');
//   } catch (error) {
//     console.error('Grammar correction error:', error);
//     return text;
//   }
// };

// export const analyzeMessageGrammar = async (text) => {
//   if (!genAI || !process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
//     return {
//       correctedText: text,
//       grammarAnalysis: [],
//       suggestions: []
//     };
//   }

//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
//     const prompt = `
//       Analyze this English message for grammar, spelling, and natural expression: "${text}"
      
//       Provide a JSON response with this exact structure:
//       {
//         "correctedText": "the fully corrected version of the message",
//         "grammarAnalysis": [
//           {
//             "original": "the original incorrect part",
//             "corrected": "the corrected version", 
//             "explanation": "brief explanation of the grammar rule"
//           }
//         ],
//         "suggestions": [
//           {
//             "message": "suggestion for better expression",
//             "betterWay": "better way to phrase it"
//           }
//         ]
//       }
      
//       Only include corrections and suggestions that significantly improve the message.
//       Be specific and helpful for an English learner.
//     `;
    
//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const analysisText = response.text();
    
//     try {
//       // Try to parse JSON response
//       const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
//       if (jsonMatch) {
//         const analysis = JSON.parse(jsonMatch[0]);
//         return analysis;
//       }
//     } catch (parseError) {
//       console.error('JSON parse error:', parseError);
//     }
    
//     // Fallback: just correct the grammar without detailed analysis
//     const correctedText = await correctGrammar(text);
//     return {
//       correctedText: correctedText,
//       grammarAnalysis: [],
//       suggestions: []
//     };
    
//   } catch (error) {
//     console.error('Grammar analysis error:', error);
//     const correctedText = await correctGrammar(text);
//     return {
//       correctedText: correctedText,
//       grammarAnalysis: [],
//       suggestions: []
//     };
//   }
// };

// export const generateAIResponse = async (context, userMessage) => {
//   if (!genAI || !process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
//     return "I understand what you're saying. Could you tell me more about that?";
//   }

//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
//     const prompt = `
//       ${context}
      
//       IMPORTANT: Your response must be:
//       - Directly relevant to the student's specific message
//       - Connected to our conversation history
//       - Appropriate for the topic and role
//       - Natural and conversational (2-3 sentences)
//       - Engaging and supportive
//       - In character throughout
      
//       Respond naturally:
//     `;
    
//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     let text = response.text().trim();
    
//     console.log('AI Response Generated:', text.substring(0, 100) + '...');
//     return text;
    
//   } catch (error) {
//     console.error('AI response error:', error);
//     return "That's interesting! Could you tell me more about what you mean?";
//   }
// };



// lib/gemini.js
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
let genAI;
let apiStatus = 'unknown';

try {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ Gemini API Key is missing');
    apiStatus = 'missing_key';
  } else {
    genAI = new GoogleGenerativeAI(apiKey);
    console.log('✅ Gemini AI initialized successfully');
    apiStatus = 'initialized';
  }
} catch (error) {
  console.error('❌ Gemini AI initialization failed:', error);
  apiStatus = 'init_failed';
}

export const correctGrammar = async (text) => {
  if (!genAI || apiStatus !== 'initialized') {
    console.log('Falling back to original text');
    return text;
  }

  try {
    // Use the new model name
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",  // Updated to available model
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      },
    });
    
    const prompt = `Correct the grammar and spelling of this English text. Return ONLY the corrected version, no explanations: "${text}"`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const corrected = response.text().trim();
    
    console.log('Grammar correction successful:', corrected);
    return corrected.replace(/^"(.*)"$/, '$1');
    
  } catch (error) {
    console.error('Grammar correction error:', error);
    return text;
  }
};

export const analyzeMessageGrammar = async (text) => {
  if (!genAI || apiStatus !== 'initialized') {
    return {
      correctedText: text,
      grammarAnalysis: [],
      suggestions: []
    };
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",  // Updated to available model
      generationConfig: {
        temperature: 0.3,
      },
    });
    
    const prompt = `
      Analyze this English message for grammar, spelling, and natural expression: "${text}"
      
      Provide a JSON response with this structure:
      {
        "correctedText": "the fully corrected version",
        "grammarAnalysis": [
          {
            "original": "original incorrect part",
            "corrected": "corrected version", 
            "explanation": "brief explanation"
          }
        ],
        "suggestions": [
          {
            "message": "suggestion for better expression",
            "betterWay": "better phrasing"
          }
        ]
      }
      
      Only include significant corrections. Be helpful for an English learner.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysisText = response.text();
    
    try {
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
    }
    
    // Fallback
    const correctedText = await correctGrammar(text);
    return {
      correctedText: correctedText,
      grammarAnalysis: [],
      suggestions: []
    };
    
  } catch (error) {
    console.error('Grammar analysis error:', error);
    const correctedText = await correctGrammar(text);
    return {
      correctedText: correctedText,
      grammarAnalysis: [],
      suggestions: []
    };
  }
};

export const generateAIResponse = async (context, userMessage) => {
  if (!genAI || apiStatus !== 'initialized') {
    return "I understand what you're saying. Could you tell me more about that?";
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",  // Updated to available model
      generationConfig: {
        temperature: 0.8,
      },
    });
    
    const prompt = `
      ${context}
      
      Student's message: "${userMessage}"
      
      Respond as a friendly English tutor (2-3 sentences):
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    console.log('AI Response Generated:', text);
    return text;
    
  } catch (error) {
    console.error('AI response error:', error);
    return "That's interesting! Could you tell me more about what you mean?";
  }
};

export const testGeminiConnection = async () => {
  if (apiStatus !== 'initialized') {
    return { success: false, error: `API not initialized: ${apiStatus}` };
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent("Say just 'CONNECTION TEST SUCCESS'");
    const response = await result.response;
    const text = response.text().trim();
    
    return { success: true, response: text };
  } catch (error) {
    console.error('Gemini API test failed:', error);
    return { success: false, error: error.message };
  }
};