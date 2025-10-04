'use client';
import { useState, useRef, useEffect } from 'react';
import { Send, Mic, User, Bot, CheckCircle, Volume2 } from 'lucide-react';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('friends');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const topics = [
    { value: 'friends', label: 'Casual Friends', description: 'Everyday conversations' },
    { value: 'travel', label: 'Travel', description: 'Hotels, directions, tourism' },
    { value: 'job-interview', label: 'Job Interview', description: 'Professional scenarios' },
    { value: 'student-teacher', label: 'Student-Teacher', description: 'Academic discussions' },
    { value: 'shopping', label: 'Shopping', description: 'Stores, prices, products' },
    { value: 'restaurant', label: 'Restaurant', description: 'Ordering food, reviews' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      corrections: [
        { original: 'helo', corrected: 'hello' },
        { original: 'how r u', corrected: 'how are you' }
      ]
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        text: getAIResponse(selectedTopic, inputMessage),
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const getAIResponse = (topic, message) => {
    const responses = {
      friends: [
        "That's interesting! Tell me more about that.",
        "I see what you mean. How did that make you feel?",
        "That sounds like a great experience! What happened next?",
        "I understand. Would you like to practice similar conversations?"
      ],
      travel: [
        "Traveling is wonderful! Which places would you like to visit?",
        "That's a great destination. What activities do you enjoy while traveling?",
        "I love discussing travel! Have you faced any challenges while traveling?",
        "Interesting choice! What makes you want to visit there?"
      ],
      'job-interview': [
        "That's a common interview question. How would you typically answer?",
        "Good point! Let's practice some more interview scenarios.",
        "Remember to highlight your strengths in interviews. What are yours?",
        "Interview preparation is key. What position are you applying for?"
      ]
    };

    const topicResponses = responses[topic] || responses.friends;
    return topicResponses[Math.floor(Math.random() * topicResponses.length)];
  };

  const hasCorrections = (message) => {
    return message.corrections && message.corrections.length > 0;
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Topic Selector */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Choose Conversation Topic</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {topics.map(topic => (
            <button
              key={topic.value}
              onClick={() => setSelectedTopic(topic.value)}
              className={`p-3 rounded-xl text-left transition-all ${
                selectedTopic === topic.value
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="font-medium text-sm mb-1">{topic.label}</div>
              <div className={`text-xs ${
                selectedTopic === topic.value ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {topic.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 h-full flex items-center justify-center">
              <div className="max-w-md">
                <Bot className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Start a Conversation</h3>
                <p className="text-gray-500">Choose a topic above and start practicing your English!</p>
                <p className="text-sm text-gray-400 mt-2">I'll help correct your grammar and make suggestions.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="max-w-xs lg:max-w-md">
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
                          : 'bg-gray-100 text-gray-800 shadow-sm'
                      }`}
                    >
                      <p className="leading-relaxed">{message.text}</p>
                    </div>
                    
                    {/* Grammar Correction */}
                    {message.sender === 'user' && hasCorrections(message) && (
                      <div className="mt-2 p-3 bg-green-50 rounded-xl border border-green-200">
                        <div className="flex items-center gap-2 text-green-700 mb-2">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Grammar Improved</span>
                        </div>
                        <div className="space-y-1">
                          {message.corrections.map((correction, idx) => (
                            <div key={idx} className="text-sm">
                              <span className="text-red-500 line-through">{correction.original}</span>
                              <span className="text-green-600"> → {correction.corrected}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* AI Response Actions */}
                    {message.sender === 'ai' && (
                      <div className="flex gap-2 mt-2">
                        <button className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1">
                          <Volume2 className="w-3 h-3" />
                          Listen
                        </button>
                        <button className="text-xs text-gray-500 hover:text-gray-700">
                          Slow
                        </button>
                        <button className="text-xs text-gray-500 hover:text-gray-700">
                          Explain
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-xs lg:max-w-md">
                    <div className="flex items-center gap-2 mb-1">
                      <Bot className="w-4 h-4 text-purple-500" />
                      <span className="text-xs text-gray-500 font-medium">AI Tutor</span>
                    </div>
                    <div className="bg-gray-100 text-gray-800 px-4 py-3 rounded-2xl shadow-sm">
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
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex gap-2">
            <button className="p-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition shadow-sm">
              <Mic className="w-5 h-5 text-gray-600" />
            </button>
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
              <span className="hidden sm:block">Send</span>
            </button>
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-500">
              Selected topic: <span className="font-medium">{topics.find(t => t.value === selectedTopic)?.label}</span>
            </p>
            <p className="text-xs text-gray-500">
              {messages.filter(m => m.sender === 'user').length} messages today
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}