import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export const correctGrammar = async (text) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Correct the grammar and spelling of this English text and return ONLY the corrected version: "${text}"`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Grammar correction error:', error);
    return text;
  }
};

export const generateAIResponse = async (context, userMessage) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `
      You are an English teaching AI assistant. 
      Context: ${context}
      User message: "${userMessage}"
      
      Respond naturally in English to help them practice. 
      Keep your response conversational and educational.
      If you notice grammar mistakes, gently correct them in your response.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('AI response error:', error);
    return "I'm here to help you practice English! Could you try rephrasing that?";
  }
};

export const translateText = async (text, targetLanguage = 'english') => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Translate this text to ${targetLanguage}: "${text}"`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
};

export const analyzePronunciation = async (audioText) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `
      Analyze this spoken English text for pronunciation and fluency: "${audioText}"
      Provide feedback on:
      1. Word pronunciation
      2. Sentence flow
      3. Common mistakes
      4. Suggestions for improvement
      
      Keep the response concise and helpful.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Pronunciation analysis error:', error);
    return "Unable to analyze pronunciation at the moment.";
  }
};