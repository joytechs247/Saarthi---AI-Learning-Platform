'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Mic, User, Bot, CheckCircle, Volume2, Star, X, BarChart3, MessageCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { collection, addDoc, query, where, orderBy, getDocs, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { correctGrammar, generateAIResponse, analyzeMessageGrammar } from '../../../lib/gemini';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [isChatActive, setIsChatActive] = useState(false);
  const messagesEndRef = useRef(null);

  const { user } = useAuth();
  const router = useRouter();

  const topics = [
    { 
      value: 'friends', 
      label: 'Casual Friends', 
      description: 'Everyday conversations with friends',
      role: "a friendly English-speaking friend. Keep the conversation casual, use slang appropriately, and help me sound more natural in everyday situations."
    },
    { 
      value: 'travel', 
      label: 'Travel', 
      description: 'Hotels, directions, tourism conversations',
      role: "a travel guide who speaks English. Help me practice travel-related vocabulary, asking for directions, booking hotels, and interacting with locals."
    },
    { 
      value: 'job-interview', 
      label: 'Job Interview', 
      description: 'Professional interview scenarios',
      role: "a professional job interviewer. Ask me interview questions, evaluate my responses, and help me improve my professional communication skills."
    },
    { 
      value: 'student-teacher', 
      label: 'Student-Teacher', 
      description: 'Academic discussions and learning',
      role: "an English teacher. Correct my grammar, expand my vocabulary, and explain language concepts in a patient, educational manner."
    },
    { 
      value: 'business', 
      label: 'Business Meetings', 
      description: 'Professional business conversations',
      role: "a business colleague. Help me practice professional communication, meetings, presentations, and corporate vocabulary."
    }
  ];

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Start a new conversation
  const startNewConversation = async () => {
    if (!selectedTopic) {
      alert('Please select a conversation topic first!');
      return;
    }

    try {
      const selectedTopicData = topics.find(t => t.value === selectedTopic);
      const conversationRef = await addDoc(collection(db, 'conversations'), {
        userId: user.uid,
        topic: selectedTopic,
        topicLabel: selectedTopicData.label,
        createdAt: new Date(),
        messages: [],
        status: 'active'
      });
      
      setCurrentConversationId(conversationRef.id);
      setIsChatActive(true);
      
      // AI starts the conversation with topic-specific greeting
      const aiWelcomeMessage = await generateWelcomeMessage(selectedTopicData);
      const welcomeMessage = {
        text: aiWelcomeMessage,
        sender: 'ai',
        timestamp: new Date(),
        isWelcome: true
      };

      setMessages([welcomeMessage]);
      
      // Save welcome message to Firestore
      await addDoc(collection(db, 'conversations', conversationRef.id, 'messages'), welcomeMessage);

    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  // Generate AI welcome message based on topic
  const generateWelcomeMessage = async (topicData) => {
    const welcomeMessages = {
      friends: `Hey there! 👋 I'm here to chat with you like a friend. Let's have a natural conversation in English! What's on your mind today?`,
      travel: `Hello! ✈️ I'll be your travel companion for this English practice. Where shall we "travel" to today? Maybe we can practice booking hotels or asking for directions?`,
      'job-interview': `Good day! 💼 I'll be your interviewer for this practice session. Let's begin with: "Could you tell me about yourself and your professional background?"`,
      'student-teacher': `Welcome to our English lesson! 📚 I'm here to help you improve your grammar, vocabulary, and fluency. What would you like to practice today?`,
      business: `Hello! 👔 Let's practice some business English. I'll be your colleague in this meeting scenario. What business topic would you like to discuss?`
    };

    return welcomeMessages[topicData.value] || `Hello! I'm here to help you practice English. Let's start our ${topicData.label.toLowerCase()} conversation!`;
  };

  // Handle sending user message
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !isChatActive) return;

    const userMessage = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      // Step 1: Analyze and correct the user's message with detailed grammar analysis
      const { correctedText, grammarAnalysis, suggestions } = await analyzeMessageGrammar(userMessage);
      const hasCorrections = grammarAnalysis.length > 0 || suggestions.length > 0;

      // Create user message data with detailed corrections
      const userMessageData = {
        text: userMessage,
        correctedText: correctedText,
        sender: 'user',
        timestamp: new Date(),
        grammarCorrections: grammarAnalysis,
        suggestions: suggestions,
        originalText: userMessage,
        hasImprovements: hasCorrections
      };

      // Add user message to local state
      setMessages(prev => [...prev, { ...userMessageData, id: Date.now() }]);

      // Save user message to Firestore
      await addDoc(collection(db, 'conversations', currentConversationId, 'messages'), userMessageData);

      // Update user stats if there were corrections
      if (hasCorrections) {
        await updateDoc(doc(db, 'users', user.uid), {
          'stats.grammarMistakesFixed': increment(grammarAnalysis.length + suggestions.length)
        });
      }

      // Step 2: Generate AI response with full conversation context
      const aiResponse = await generateAIResponseWithContext(userMessage, correctedText);
      
      const aiMessageData = {
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };

      // Add AI response to local state
      setMessages(prev => [...prev, { ...aiMessageData, id: Date.now() + 1 }]);

      // Save AI response to Firestore
      await addDoc(collection(db, 'conversations', currentConversationId, 'messages'), aiMessageData);

    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate AI response with comprehensive conversation context
  const generateAIResponseWithContext = async (userMessage, correctedMessage) => {
    const selectedTopicData = topics.find(t => t.value === selectedTopic);
    
    // Get the full conversation history for context
    const conversationHistory = messages.slice(-10); // Last 10 messages
    
    // Build comprehensive conversation context
    let contextBuilder = `
      CONVERSATION ROLE AND TOPIC:
      You are: ${selectedTopicData.role}
      Current topic: ${selectedTopicData.label}
      
      CONVERSATION HISTORY (most recent first):
    `;
    
    if (conversationHistory.length > 0) {
      // Include both user and AI messages for full context
      conversationHistory.forEach((msg, index) => {
        const speaker = msg.sender === 'user' ? 'STUDENT' : 'YOU';
        const content = msg.correctedText || msg.text;
        const position = conversationHistory.length - index;
        
        if (msg.sender === 'user' && msg.hasImprovements) {
          contextBuilder += `\n${position}. STUDENT (original: "${msg.originalText}" → corrected: "${msg.correctedText}"): ${content}`;
        } else {
          contextBuilder += `\n${position}. ${speaker}: ${content}`;
        }
      });
    }

    contextBuilder += `
    
      STUDENT'S LATEST MESSAGE: "${userMessage}"
      ${correctedMessage !== userMessage ? `GRAMMAR NOTE: Their message was corrected from "${userMessage}" to "${correctedMessage}"` : 'GRAMMAR NOTE: Their message was grammatically correct'}
      
      YOUR RESPONSE STRATEGY:
      1. Respond specifically to their latest message: "${userMessage}"
      2. Reference previous parts of our conversation when relevant
      3. Ask natural follow-up questions that relate to both the topic and their specific message
      4. Keep the conversation flowing naturally
      5. Stay completely in character as ${selectedTopicData.role.toLowerCase()}
      6. If they made grammar mistakes, subtly model correct English in your response
      7. Show genuine interest in what they're saying
      8. Keep your response to 2-3 sentences maximum
      9. Make the conversation feel like a real, engaging discussion
      
      Now respond naturally as ${selectedTopicData.role.toLowerCase()}:
    `;

    return await generateAIResponse(contextBuilder, userMessage);
  };

  // End conversation and generate analysis
  const endConversation = async () => {
    if (!currentConversationId || messages.length === 0) return;

    try {
      setIsLoading(true);
      
      // Generate conversation analysis
      const conversationAnalysis = await generateConversationAnalysis();
      setAnalysis(conversationAnalysis);
      setShowAnalysis(true);

      // Update conversation status
      await updateDoc(doc(db, 'conversations', currentConversationId), {
        status: 'completed',
        endedAt: new Date(),
        messageCount: messages.length,
        analysis: conversationAnalysis
      });

      // Update user stats
      await updateDoc(doc(db, 'users', user.uid), {
        'stats.conversationsCompleted': increment(1),
        'stats.totalPracticeTime': increment(5)
      });

      // Record activity
      await addDoc(collection(db, 'activities'), {
        userId: user.uid,
        type: 'chat',
        title: `${topics.find(t => t.value === selectedTopic)?.label} Conversation`,
        duration: '5m',
        score: conversationAnalysis.overallScore,
        timestamp: new Date()
      });

      setIsChatActive(false);
      
    } catch (error) {
      console.error('Error ending conversation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate comprehensive conversation analysis
  const generateConversationAnalysis = async () => {
    const userMessages = messages.filter(msg => msg.sender === 'user');
    const totalCorrections = messages.reduce((count, msg) => 
      count + (msg.grammarCorrections ? msg.grammarCorrections.length : 0) + (msg.suggestions ? msg.suggestions.length : 0), 0
    );

    const analysis = {
      conversationLength: messages.length,
      userMessages: userMessages.length,
      aiMessages: messages.length - userMessages.length,
      totalImprovements: totalCorrections,
      topic: topics.find(t => t.value === selectedTopic)?.label,
      duration: `${Math.max(3, Math.floor(messages.length / 2))} minutes`,
      overallScore: Math.max(70, 100 - (totalCorrections * 2)),
      strengths: [
        'Active participation and engagement',
        'Willingness to practice and improve',
        'Good conversational flow'
      ],
      areasToImprove: totalCorrections > 0 ? [
        'Grammar accuracy and sentence structure',
        'Vocabulary usage and word choice',
        'Natural expression in English'
      ] : [
        'Continue building vocabulary',
        'Practice more complex sentence structures',
        'Work on fluency and natural flow'
      ],
      recommendations: [
        'Practice daily conversations on different topics',
        'Read English articles or books related to your interests',
        'Watch English videos with subtitles',
        'Try to think in English during daily activities'
      ]
    };

    return analysis;
  };

  // Start a new chat after analysis
  const startNewChat = () => {
    setMessages([]);
    setShowAnalysis(false);
    setAnalysis(null);
    setCurrentConversationId(null);
    setIsChatActive(false);
    setSelectedTopic('');
  };

  const hasImprovements = (message) => {
    return message.hasImprovements;
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      {showAnalysis ? (
        // Analysis View
        <div className="flex-1 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Conversation Analysis</h1>
            <p className="text-gray-600">Great job completing your {analysis?.topic} practice!</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white text-center">
              <div className="text-4xl font-bold mb-2">{analysis?.overallScore}%</div>
              <div className="text-blue-100">Overall Score</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-gray-800 mb-1">{analysis?.userMessages}</div>
                <div className="text-gray-600 text-sm">Your Messages</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-gray-800 mb-1">{analysis?.totalImprovements}</div>
                <div className="text-gray-600 text-sm">Improvements</div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">✅ Your Strengths</h3>
              <div className="space-y-2">
                {analysis?.strengths.map((strength, index) => (
                  <div key={index} className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    <span>{strength}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">💡 Areas to Improve</h3>
              <div className="space-y-2">
                {analysis?.areasToImprove.map((area, index) => (
                  <div key={index} className="flex items-center gap-2 text-orange-600">
                    <Star className="w-4 h-4" />
                    <span>{area}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">📚 Recommendations</h3>
            <div className="space-y-2">
              {analysis?.recommendations.map((rec, index) => (
                <div key={index} className="flex items-center gap-2 text-blue-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={startNewChat}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition"
            >
              Start New Conversation
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-semibold hover:bg-gray-600 transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      ) : (
        // Chat Interface
        <>
          {/* Topic Selection */}
          {!isChatActive && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Choose Conversation Topic</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {topics.map(topic => (
                  <button
                    key={topic.value}
                    onClick={() => setSelectedTopic(topic.value)}
                    className={`p-4 rounded-xl text-left transition-all border-2 ${
                      selectedTopic === topic.value
                        ? 'bg-blue-50 border-blue-500 shadow-md'
                        : 'bg-gray-50 border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-800 mb-1">{topic.label}</div>
                    <div className="text-sm text-gray-600 mb-3">{topic.description}</div>
                    <div className="text-xs text-blue-600 font-medium">
                      {selectedTopic === topic.value ? 'Selected ✓' : 'Click to select'}
                    </div>
                  </button>
                ))}
              </div>
              
              {selectedTopic && (
                <div className="mt-6 text-center">
                  <button
                    onClick={startNewConversation}
                    className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-lg transition shadow-md flex items-center gap-2 mx-auto"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Start Conversation with AI Tutor
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Active Chat */}
          {isChatActive && (
            <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">
                        {topics.find(t => t.value === selectedTopic)?.label} Practice
                      </h2>
                      <p className="text-blue-100 text-sm">AI English Tutor - Real-time grammar correction</p>
                    </div>
                  </div>
                  <button
                    onClick={endConversation}
                    disabled={isLoading}
                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl font-semibold transition backdrop-blur-sm disabled:opacity-50 flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    End Chat
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 h-full flex items-center justify-center">
                    <div className="max-w-md">
                      <Bot className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">Starting Conversation...</h3>
                      <p className="text-gray-500">Your AI tutor will start the conversation shortly</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md ${message.sender === 'user' ? 'ml-auto' : ''}`}>
                          <div className="flex items-center gap-2 mb-1">
                            {message.sender === 'user' ? (
                              <>
                                <User className="w-4 h-4 text-blue-500" />
                                <span className="text-xs text-gray-500 font-medium">You</span>
                              </>
                            ) : (
                              <>
                                <Bot className="w-4 h-4 text-purple-500" />
                                <span className="text-xs text-gray-500 font-medium">AI Tutor</span>
                              </>
                            )}
                          </div>
                          <div
                            className={`px-4 py-3 rounded-2xl ${
                              message.sender === 'user'
                                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
                                : 'bg-white text-gray-800 shadow-sm border border-gray-200'
                            }`}
                          >
                            <p className="leading-relaxed whitespace-pre-wrap">
                              {message.correctedText || message.text}
                            </p>
                          </div>
                          
                          {/* Grammar Corrections and Suggestions */}
                          {message.sender === 'user' && hasImprovements(message) && (
                            <div className="mt-2 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                              <div className="flex items-center gap-2 text-yellow-700 mb-2">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-sm font-medium">Grammar & Suggestions</span>
                              </div>
                              
                              {/* Grammar Corrections */}
                              {message.grammarCorrections && message.grammarCorrections.length > 0 && (
                                <div className="mb-2">
                                  <div className="text-xs font-medium text-yellow-700 mb-1">Corrections:</div>
                                  {message.grammarCorrections.map((correction, idx) => (
                                    <div key={idx} className="text-xs text-yellow-700 mb-1">
                                      <span className="line-through text-red-500">{correction.original}</span>
                                      <span className="mx-1">→</span>
                                      <span className="text-green-600 font-medium">{correction.corrected}</span>
                                      {correction.explanation && (
                                        <div className="text-yellow-600 mt-1">{correction.explanation}</div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              {/* Suggestions */}
                              {message.suggestions && message.suggestions.length > 0 && (
                                <div>
                                  <div className="text-xs font-medium text-yellow-700 mb-1">Suggestions:</div>
                                  {message.suggestions.map((suggestion, idx) => (
                                    <div key={idx} className="text-xs text-yellow-700 mb-1">
                                      💡 {suggestion.message}
                                      {suggestion.betterWay && (
                                        <div className="text-green-600 mt-1 font-medium">Better: {suggestion.betterWay}</div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {/* AI Loading Indicator */}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="max-w-xs lg:max-w-md">
                          <div className="flex items-center gap-2 mb-1">
                            <Bot className="w-4 h-4 text-purple-500" />
                            <span className="text-xs text-gray-500 font-medium">AI Tutor is typing...</span>
                          </div>
                          <div className="bg-white text-gray-800 px-4 py-3 rounded-2xl shadow-sm border border-gray-200">
                            <div className="flex space-x-2">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200 p-4 bg-white">
                <div className="flex gap-2">
                  {/* <button className="p-3 bg-gray-100 border border-gray-300 rounded-xl hover:bg-gray-200 transition shadow-sm">
                    <Mic className="w-5 h-5 text-gray-600" />
                  </button> */}
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message in English..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    <span>Send</span>
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  💡 The AI will correct your grammar and suggest better ways to express yourself in real-time
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}