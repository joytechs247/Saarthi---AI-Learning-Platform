// app/test-gemini/page.js
'use client';
import { useState } from 'react';

async function testGeminiDirect() {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "AIzaSyC9aX1TEHg6IhnV5ulTL_F5q0a-lrHhgC0";
  
  // Use the available models from your list
  const availableModels = [
    "gemini-2.0-flash",           // Fast model
    "gemini-2.0-flash-001",       // Specific version
    "gemini-2.5-flash",           // Newer version
    "models/gemini-2.0-flash",    // Full path
  ];

  let lastError = null;
  
  for (const modelName of availableModels) {
    try {
      console.log(`Trying model: ${modelName}`);
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: "Say just 'API TEST SUCCESS' and nothing else"
              }]
            }]
          })
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || `HTTP ${response.status}`);
      }

      const text = data.candidates[0].content.parts[0].text;
      return { success: true, response: text, model: modelName };
      
    } catch (error) {
      lastError = error;
      console.log(`Failed with model ${modelName}:`, error.message);
      continue;
    }
  }
  
  return { success: false, error: `All models failed. Last error: ${lastError?.message}` };
}

export default function TestGemini() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    setResult('Testing with available models...');
    
    try {
      const testResult = await testGeminiDirect();
      
      if (testResult.success) {
        setResult(`✅ SUCCESS with ${testResult.model}: ${testResult.response}`);
      } else {
        setResult(`❌ ERROR: ${testResult.error}`);
      }
    } catch (error) {
      setResult(`❌ UNEXPECTED ERROR: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Gemini API Test</h1>
      <button onClick={testAPI} disabled={loading}>
        {loading ? 'Testing...' : 'Test Gemini API'}
      </button>
      <div style={{ marginTop: '20px', whiteSpace: 'pre-wrap' }}>
        <strong>Result:</strong> {result}
      </div>
    </div>
  );
}