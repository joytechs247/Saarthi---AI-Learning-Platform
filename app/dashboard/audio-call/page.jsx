// app/dashboard/audio-call/page.js
'use client';
import { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Play, 
  Square, 
  Settings,
  Award,
  BarChart3,
  Download,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { RouteGuard } from '../../../components/RouteGuard';

export default function AudioCallPage() {
  const { user, updateUserStats } = useAuth();
  const [conversationState, setConversationState] = useState('setup'); // 'setup', 'active', 'ended'
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [points, setPoints] = useState(0);
  const [analytics, setAnalytics] = useState(null);
  
  const conversationEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const speechSynthesisRef = useRef(null);

  const topics = [
    { id: 'daily-life', name: 'Daily Life & Routine', description: 'Talk about your everyday activities' },
    { id: 'travel', name: 'Travel & Vacation', description: 'Discuss travel experiences and plans' },
    { id: 'food', name: 'Food & Cooking', description: 'Share about food preferences and recipes' },
    { id: 'hobbies', name: 'Hobbies & Interests', description: 'Talk about your favorite activities' },
    { id: 'work', name: 'Work & Career', description: 'Discuss professional life and goals' },
    { id: 'culture', name: 'Culture & Traditions', description: 'Share cultural experiences' }
  ];

  const languages = [
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語' },
    { code: 'zh', name: 'Chinese', nativeName: '中文' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português' }
  ];

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = selectedLanguage || 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        await handleUserSpeech(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        setIsRecording(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, [selectedLanguage]);

  // Scroll to bottom when conversation updates
  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const startConversation = async () => {
    if (!selectedTopic || !selectedLanguage) {
      alert('Please select both topic and language');
      return;
    }

    setConversationState('active');
    
    // AI starts the conversation
    await aiSpeakFirst();
  };

  const aiSpeakFirst = async () => {
    const aiFirstMessage = await generateAIResponse('', 'start', selectedTopic, selectedLanguage);
    
    const aiMessage = {
      speaker: 'ai',
      nativeText: aiFirstMessage.nativeText,
      englishText: aiFirstMessage.englishText,
      timestamp: new Date()
    };

    setConversation([aiMessage]);

    // Play AI's first message
    await playTextToSpeech(aiFirstMessage.nativeText, selectedLanguage);
    
    // After AI speaks, enable user to respond
    setTimeout(() => {
      setIsRecording(false);
    }, 1000);
  };

  const handleUserSpeech = async (userSpeech) => {
    if (!userSpeech.trim()) return;

    // Translate user's speech to English
    const userEnglishText = await translateText(userSpeech, selectedLanguage, 'en');

    const userMessage = {
      speaker: 'user',
      nativeText: userSpeech,
      englishText: userEnglishText,
      timestamp: new Date()
    };

    setConversation(prev => [...prev, userMessage]);

    // Award points for user participation
    const newPoints = points + 10;
    setPoints(newPoints);

    // AI responds to user's speech
    setTimeout(async () => {
      await aiRespond(userSpeech);
    }, 1000);
  };

  const aiRespond = async (userSpeech) => {
    try {
      const aiResponse = await generateAIResponse(userSpeech, 'respond', selectedTopic, selectedLanguage);
      
      const aiMessage = {
        speaker: 'ai',
        nativeText: aiResponse.nativeText,
        englishText: aiResponse.englishText,
        timestamp: new Date()
      };

      setConversation(prev => [...prev, aiMessage]);
      
      // Play AI's response
      await playTextToSpeech(aiResponse.nativeText, selectedLanguage);
      
      // After AI speaks, enable user to respond again
      setTimeout(() => {
        setIsRecording(true);
      }, 1000);
      
    } catch (error) {
      console.error('AI response failed:', error);
      // Fallback response
      const fallbackMessage = {
        speaker: 'ai',
        nativeText: 'कृपया जारी रखें, मैं सुन रहा हूँ।',
        englishText: 'Please continue, I am listening.',
        timestamp: new Date()
      };
      setConversation(prev => [...prev, fallbackMessage]);
      setIsRecording(true);
    }
  };

  const generateAIResponse = async (userMessage, context, topic, language) => {
    try {
      const prompt = `
        You are having a natural conversation in ${language} about ${topic}. 
        ${context === 'start' ? 'Start the conversation naturally. Ask an engaging question.' : `Respond to this user message: "${userMessage}"`}
        
        Previous conversation context: ${JSON.stringify(conversation.slice(-3))}
        
        Provide response in this EXACT JSON format ONLY, no other text:
        {
          "nativeText": "Your response in ${language}",
          "englishText": "English translation of your response"
        }
        
        Keep it conversational, engaging, and culturally appropriate. Ask follow-up questions to keep the conversation going.
        Make it sound like a real person talking, not a language lesson.
        Return ONLY the JSON, no markdown formatting, no code blocks.
      `;

      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          context: 'audio-call-conversation'
        })
      });

      const data = await response.json();
      
      // Clean the response - remove markdown code blocks
      let cleanResponse = data.response;
      if (cleanResponse.includes('```json')) {
        cleanResponse = cleanResponse.replace(/```json\n?/g, '').replace(/\n?```/g, '');
      }
      if (cleanResponse.includes('```')) {
        cleanResponse = cleanResponse.replace(/```\n?/g, '');
      }
      
      // Parse the cleaned JSON
      const parsedResponse = JSON.parse(cleanResponse.trim());
      return parsedResponse;
      
    } catch (error) {
      console.error('AI response error:', error);
      
      // Fallback responses based on language
      const fallbackResponses = {
        hi: {
          nativeText: 'मैं आपकी बात समझ रहा हूँ। कृपया जारी रखें।',
          englishText: 'I understand what you\'re saying. Please continue.'
        },
        es: {
          nativeText: 'Entiendo lo que estás diciendo. Por favor continúa.',
          englishText: 'I understand what you\'re saying. Please continue.'
        },
        fr: {
          nativeText: 'Je comprends ce que vous dites. Veuillez continuer.',
          englishText: 'I understand what you\'re saying. Please continue.'
        },
        de: {
          nativeText: 'Ich verstehe, was Sie sagen. Bitte fahren Sie fort.',
          englishText: 'I understand what you\'re saying. Please continue.'
        },
        ja: {
          nativeText: 'あなたの言っていることを理解しています。続けてください。',
          englishText: 'I understand what you\'re saying. Please continue.'
        }
      };
      
      return fallbackResponses[language] || fallbackResponses.hi;
    }
  };

  const playTextToSpeech = async (text, language) => {
    return new Promise((resolve) => {
      setIsPlaying(true);
      try {
        // Using Web Speech API for TTS
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = getLanguageCode(language);
        speech.rate = 0.8;
        speech.pitch = 1;
        
        speech.onend = () => {
          setIsPlaying(false);
          resolve();
        };
        
        speech.onerror = () => {
          setIsPlaying(false);
          resolve();
        };
        
        window.speechSynthesis.speak(speech);
        speechSynthesisRef.current = speech;
      } catch (error) {
        console.error('TTS error:', error);
        setIsPlaying(false);
        resolve();
      }
    });
  };

  const getLanguageCode = (language) => {
    const languageMap = {
      'hi': 'hi-IN',
      'es': 'es-ES',
      'fr': 'fr-FR',
      'de': 'de-DE',
      'ja': 'ja-JP',
      'zh': 'zh-CN',
      'ar': 'ar-SA',
      'pt': 'pt-BR'
    };
    return languageMap[language] || 'en-US';
  };

  const startRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = getLanguageCode(selectedLanguage);
      recognitionRef.current.start();
      setIsRecording(true);
    } else {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
    setIsListening(false);
  };

  const translateText = async (text, fromLang, toLang) => {
    try {
      const response = await fetch('/api/gemini/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          fromLang: fromLang,
          toLang: toLang
        })
      });

      const data = await response.json();
      return data.translation || 'Translation not available';
    } catch (error) {
      console.error('Translation error:', error);
      return 'Translation not available';
    }
  };

  const endConversation = () => {
    stopRecording();
    if (speechSynthesisRef.current) {
      window.speechSynthesis.cancel();
    }
    
    setConversationState('ended');
    
    // Calculate analytics
    const totalMessages = conversation.length;
    const userMessages = conversation.filter(msg => msg.speaker === 'user').length;
    const duration = conversation.length > 0 ? 
      (new Date() - conversation[0].timestamp) / 1000 : 0;

    const conversationAnalytics = {
      totalMessages,
      userMessages,
      duration: Math.round(duration),
      pointsEarned: points,
      vocabularyUsed: conversation.reduce((acc, msg) => {
        return acc + msg.englishText.split(' ').length;
      }, 0),
      conversationQuality: Math.min(100, points * 2)
    };

    setAnalytics(conversationAnalytics);

    // Update user stats
    if (user) {
      updateUserStats({
        stats: {
          callsCompleted: (user?.stats?.callsCompleted || 0) + 1,
          totalPracticeTime: (user?.stats?.totalPracticeTime || 0) + Math.round(duration),
          wordsLearned: (user?.stats?.wordsLearned || 0) + conversationAnalytics.vocabularyUsed
        }
      });
    }
  };

  const downloadTranscript = () => {
    const transcript = conversation.map(msg => 
      `${msg.speaker.toUpperCase()}: ${msg.nativeText}\nTranslation: ${msg.englishText}\n`
    ).join('\n');
    
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <RouteGuard>
      <div className="h-full flex flex-col space-y-6 p-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Audio Call Practice</h1>
          <p className="text-gray-600">Real conversations with real-time translations</p>
        </div>

        {conversationState === 'setup' && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Topic Selection */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Choose a Topic</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {topics.map(topic => (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic.id)}
                    className={`p-4 rounded-xl border-2 text-left transition ${
                      selectedTopic === topic.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <h3 className="font-semibold text-gray-800">{topic.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{topic.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Language Selection */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Your Language</h2>
              <div className="space-y-3">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => setSelectedLanguage(lang.code)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition ${
                      selectedLanguage === lang.code
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-gray-800">{lang.name}</h3>
                        <p className="text-sm text-gray-600">{lang.nativeName}</p>
                      </div>
                      {selectedLanguage === lang.code && (
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={startConversation}
                disabled={!selectedTopic || !selectedLanguage}
                className="w-full mt-6 bg-gradient-to-r from-green-500 to-blue-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start Conversation
              </button>
            </div>
          </div>
        )}

        {conversationState === 'active' && (
          <div className="grid lg:grid-cols-3 gap-6 flex-1">
            {/* Conversation Panel */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex flex-col">
              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {conversation.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl ${
                      msg.speaker === 'ai'
                        ? 'bg-blue-50 border border-blue-200'
                        : 'bg-green-50 border border-green-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        msg.speaker === 'ai' ? 'bg-blue-500' : 'bg-green-500'
                      }`}>
                        {msg.speaker === 'ai' ? (
                          <MessageCircle className="w-4 h-4 text-white" />
                        ) : (
                          <Mic className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 mb-2">
                          {msg.nativeText}
                        </p>
                        <div className="bg-white/80 rounded-lg p-3 border">
                          <p className="text-sm text-gray-600">
                            <strong>English:</strong> {msg.englishText}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          {msg.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={conversationEndRef} />
              </div>

              {/* Controls */}
              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isPlaying || isListening}
                  className={`flex-1 py-4 rounded-xl font-semibold text-white shadow-lg transition ${
                    isRecording || isListening
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-green-500 hover:bg-green-600'
                  } disabled:opacity-50`}
                >
                  {isRecording || isListening ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      {isListening ? 'Listening...' : 'Stop Speaking'}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Mic className="w-5 h-5" />
                      Speak Now
                    </div>
                  )}
                </button>

                <button
                  onClick={endConversation}
                  className="px-6 py-4 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition"
                >
                  End Call
                </button>
              </div>

              {/* Points Display */}
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-600" />
                    <span className="font-semibold text-yellow-800">Points Earned</span>
                  </div>
                  <span className="text-2xl font-bold text-yellow-600">{points}</span>
                </div>
              </div>
            </div>

            {/* Info Panel */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Conversation Info</h2>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <h3 className="font-semibold text-blue-800 mb-1">Current Topic</h3>
                  <p className="text-blue-700">{topics.find(t => t.id === selectedTopic)?.name}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl">
                  <h3 className="font-semibold text-green-800 mb-1">Your Language</h3>
                  <p className="text-green-700">{languages.find(l => l.code === selectedLanguage)?.name}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl">
                  <h3 className="font-semibold text-purple-800 mb-1">Tips</h3>
                  <ul className="text-purple-700 text-sm space-y-1">
                    <li>• Wait for AI to finish speaking</li>
                    <li>• Speak clearly into your microphone</li>
                    <li>• Use complete sentences</li>
                    <li>• Pay attention to translations</li>
                  </ul>
                </div>
                <div className="p-4 bg-orange-50 rounded-xl">
                  <h3 className="font-semibold text-orange-800 mb-1">Status</h3>
                  <p className="text-orange-700">
                    {isPlaying ? 'AI is speaking...' : 
                     isListening ? 'Listening to you...' : 
                     isRecording ? 'Ready for your response' : 
                     'Waiting...'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {conversationState === 'ended' && analytics && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Conversation Completed!</h2>
              <p className="text-gray-600">Great job! Here's your performance summary</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-xl text-center">
                <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">{analytics.totalMessages}</p>
                <p className="text-blue-700 text-sm">Total Messages</p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl text-center">
                <Mic className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">{analytics.userMessages}</p>
                <p className="text-green-700 text-sm">Your Messages</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl text-center">
                <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">{analytics.pointsEarned}</p>
                <p className="text-purple-700 text-sm">Points Earned</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-xl text-center">
                <Volume2 className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-orange-600">{analytics.vocabularyUsed}</p>
                <p className="text-orange-700 text-sm">Words Used</p>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setConversationState('setup');
                  setConversation([]);
                  setPoints(0);
                  setAnalytics(null);
                }}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition"
              >
                Practice Again
              </button>
              <button
                onClick={downloadTranscript}
                className="px-6 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Transcript
              </button>
            </div>
          </div>
        )}
      </div>
    </RouteGuard>
  );
}