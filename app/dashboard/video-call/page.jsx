// app/dashboard/video-call/page.js
'use client';
import { useState, useEffect, useRef } from 'react';
import { Video, VideoOff, Mic, MicOff, MessageCircle, Download, Square, Phone, User } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { RouteGuard } from '../../../components/RouteGuard';

export default function VideoCallPage() {
  const { user, updateUserStats } = useAuth();
  const [isCallActive, setIsCallActive] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [points, setPoints] = useState(0);
  const [analytics, setAnalytics] = useState(null);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [femaleVoice, setFemaleVoice] = useState(null);

  const conversationEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const userVideoRef = useRef(null);
  const streamRef = useRef(null);
  const speechSynthesisRef = useRef(null);

  // Lady video reference and state
  const ladyVideoRef = useRef(null);
  const [ladyVideoLoaded, setLadyVideoLoaded] = useState(false);

  const topics = [
    {
      id: 'daily-life',
      name: 'Daily Life & Routine',
      description: 'Talk about your everyday activities',
      starter: "So, tell me about your typical day. What time do you usually wake up?"
    },
    {
      id: 'travel',
      name: 'Travel & Vacation',
      description: 'Discuss travel experiences and plans',
      starter: "I love talking about travel! Have you been on any interesting trips recently?"
    },
    {
      id: 'food',
      name: 'Food & Cooking',
      description: 'Share about food preferences and recipes',
      starter: "Indian food is so diverse! What's your favorite dish to cook or eat?"
    },
    {
      id: 'hobbies',
      name: 'Hobbies & Interests',
      description: 'Talk about your favorite activities',
      starter: "Everyone needs hobbies to relax. What do you enjoy doing in your free time?"
    },
    {
      id: 'work',
      name: 'Work & Career',
      description: 'Discuss professional life and goals',
      starter: "Work takes up so much of our time. What do you do for a living?"
    },
    {
      id: 'culture',
      name: 'Culture & Traditions',
      description: 'Share cultural experiences',
      starter: "Indian culture is so rich and varied. What traditions are important in your family?"
    },
    {
      id: 'current-events',
      name: 'Current Events',
      description: 'Discuss news and recent happenings',
      starter: "There's always something interesting happening. Have you followed any news lately?"
    },
    {
      id: 'movies-music',
      name: 'Movies & Music',
      description: 'Talk about entertainment preferences',
      starter: "Bollywood or Hollywood? I'm curious about your taste in movies and music!"
    }
  ];

  // Only speaking video and idle image
  const ladyVideo = '/videos/ai-lady-speaking.mp4';
  const ladyIdleImage = '/images/ai-lady-poster.jpg';

  // Initialize voices - FIXED
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
      
      // Find female voice - FIXED LOGIC
      const foundFemaleVoice = voices.find(voice => 
        voice.name.toLowerCase().includes('female') ||
        voice.name.toLowerCase().includes('woman') ||
        voice.name.toLowerCase().includes('samantha') ||
        voice.name.toLowerCase().includes('karen') ||
        voice.name.toLowerCase().includes('veena') ||
        voice.name.toLowerCase().includes('tessa') ||
        voice.name.toLowerCase().includes('zira') ||
        voice.name.toLowerCase().includes('victoria') ||
        voice.name.toLowerCase().includes('google uk english female') ||
        voice.name.toLowerCase().includes('microsoft zira') ||
        voice.name.toLowerCase().includes('ms zira') ||
        (voice.lang.includes('IN') && !voice.name.toLowerCase().includes('male'))
      );

      if (foundFemaleVoice) {
        console.log('Found female voice:', foundFemaleVoice.name);
        setFemaleVoice(foundFemaleVoice);
      } else {
        console.log('No female voice found. Available voices:', voices.map(v => v.name));
        // Try to use any non-male voice
        const nonMaleVoice = voices.find(voice => 
          !voice.name.toLowerCase().includes('male') && 
          !voice.name.toLowerCase().includes('david') &&
          !voice.name.toLowerCase().includes('alex')
        );
        if (nonMaleVoice) {
          console.log('Using non-male voice:', nonMaleVoice.name);
          setFemaleVoice(nonMaleVoice);
        }
      }
    };

    // Load voices immediately and when they change
    loadVoices();
    
    // Some browsers need this event listener
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (window.speechSynthesis.onvoiceschanged) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Initialize speech recognition, camera, and lady video
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Speech Recognition
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();

        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-IN';

        recognitionRef.current.onstart = () => {
          setIsListening(true);
          // Show idle image when user starts speaking
          resetLadyVideoToIdle();
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

      // Camera Access
      if (isCallActive && isVideoOn) {
        initializeCamera();
      }

      // Initialize lady video when call starts
      if (isCallActive && ladyVideoRef.current) {
        initializeLadyVideo();
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
      }
      if (ladyVideoRef.current) {
        ladyVideoRef.current.pause();
      }
    };
  }, [isCallActive, isVideoOn]);

  // Scroll to bottom when conversation updates
  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const initializeLadyVideo = () => {
    if (ladyVideoRef.current) {
      // Start with the idle image as poster - don't load video initially
      ladyVideoRef.current.poster = ladyIdleImage;
      ladyVideoRef.current.muted = true;
      ladyVideoRef.current.playsInline = true;
      
      // Clear any video source initially to show only the image
      ladyVideoRef.current.src = '';
      ladyVideoRef.current.load();
      
      setLadyVideoLoaded(true);
    }
  };

  const playLadySpeakingVideo = () => {
    if (ladyVideoRef.current) {
      console.log('Playing lady speaking video');
      ladyVideoRef.current.src = ladyVideo;
      ladyVideoRef.current.loop = true;
      ladyVideoRef.current.currentTime = 0;
      ladyVideoRef.current.play().catch(error => {
        console.error('Error playing speaking video:', error);
      });
    }
  };

  const resetLadyVideoToIdle = () => {
    if (ladyVideoRef.current) {
      console.log('Resetting to idle image');
      ladyVideoRef.current.pause();
      ladyVideoRef.current.src = ''; // Clear the video source
      ladyVideoRef.current.poster = ladyIdleImage; // Show the idle image
      ladyVideoRef.current.load(); // Reset the video element
    }
  };

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      streamRef.current = stream;
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Camera access error:', error);
    }
  };

  const startCall = async () => {
    if (!selectedTopic) {
      alert('Please select a topic to start the conversation');
      return;
    }

    setIsCallActive(true);
    await initializeCamera();

    // AI starts the conversation
    await aiSpeakFirst();
  };

  const aiSpeakFirst = async () => {
    const selectedTopicData = topics.find(t => t.id === selectedTopic);
    const aiFirstMessage = selectedTopicData.starter;

    const aiMessage = {
      speaker: 'ai',
      text: aiFirstMessage,
      timestamp: new Date()
    };

    setConversation([aiMessage]);

    // AI speaks the message with lady video
    await speakAIMessage(aiFirstMessage);
  };

  const speakAIMessage = async (message) => {
    return new Promise((resolve) => {
      setIsAISpeaking(true);

      // Start lady speaking video
      playLadySpeakingVideo();

      try {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const speech = new SpeechSynthesisUtterance(message);
        speech.lang = 'en-IN';

        // Use the pre-loaded female voice - FIXED
        if (femaleVoice) {
          speech.voice = femaleVoice;
          console.log('Using female voice:', femaleVoice.name);
        } else {
          console.log('No female voice available, using default');
        }

        speech.rate = 0.9;
        speech.pitch = 1.3; // Higher pitch for more feminine voice
        speech.volume = 1;

        speech.onend = () => {
          console.log('AI speech ended');
          setIsAISpeaking(false);
          resetLadyVideoToIdle();
          resolve();
        };

        speech.onerror = (error) => {
          console.error('AI speech error:', error);
          setIsAISpeaking(false);
          resetLadyVideoToIdle();
          resolve();
        };

        // Add a small delay to ensure video starts
        setTimeout(() => {
          window.speechSynthesis.speak(speech);
          speechSynthesisRef.current = speech;
        }, 300);

      } catch (error) {
        console.error('TTS error:', error);
        setIsAISpeaking(false);
        resetLadyVideoToIdle();
        resolve();
      }
    });
  };

  const handleUserSpeech = async (userSpeech) => {
    if (!userSpeech.trim()) return;

    const userMessage = {
      speaker: 'user',
      text: userSpeech,
      timestamp: new Date()
    };

    setConversation(prev => [...prev, userMessage]);

    // Award points for user participation
    const newPoints = points + 15;
    setPoints(newPoints);

    // Ensure idle image is shown while processing user speech
    resetLadyVideoToIdle();

    // AI responds to user's speech
    setTimeout(async () => {
      await aiRespond(userSpeech);
    }, 1000);
  };

  const aiRespond = async (userSpeech) => {
    try {
      const aiResponse = await generateAIResponse(userSpeech, selectedTopic);

      const aiMessage = {
        speaker: 'ai',
        text: aiResponse,
        timestamp: new Date()
      };

      setConversation(prev => [...prev, aiMessage]);

      // AI speaks the response with lady video
      await speakAIMessage(aiResponse);

      // After AI speaks, enable user to respond again
      setTimeout(() => {
        setIsRecording(false);
      }, 1000);

    } catch (error) {
      console.error('AI response failed:', error);
      // Fallback response
      const fallbackMessage = {
        speaker: 'ai',
        text: "That's quite interesting! Please tell me more about that.",
        timestamp: new Date()
      };
      setConversation(prev => [...prev, fallbackMessage]);

      // Speak fallback message
      await speakAIMessage(fallbackMessage.text);

      setIsRecording(true);
    }
  };

  const generateAIResponse = async (userMessage, topic) => {
    try {
      const prompt = `
        You are a friendly female AI English tutor having a video call conversation. 
        Speak in simple, clear English with a warm and encouraging tone.
        
        Current topic: ${topic}
        User just said: "${userMessage}"
        
        Previous conversation: ${JSON.stringify(conversation.slice(-3))}
        
        Respond naturally:
        - Be warm, friendly and encouraging
        - Ask follow-up questions
        - Keep responses short (2-3 sentences)
        - Use phrases like "That's wonderful!", "Tell me more"
        - Add encouragement like "You're doing great!"
        - Be casual and relatable
        
        Return only your response text.
      `;

      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          context: 'video-call-conversation'
        })
      });

      const data = await response.json();
      return data.response.trim();

    } catch (error) {
      console.error('AI response error:', error);
      return "That's really interesting! Could you please tell me more about that?";
    }
  };

  const startRecording = () => {
    if (recognitionRef.current && !isAISpeaking) {
      // Show idle image when starting to record
      resetLadyVideoToIdle();
      
      recognitionRef.current.lang = 'en-IN';
      recognitionRef.current.start();
      setIsRecording(true);
    } else if (isAISpeaking) {
      alert('Please wait for AI to finish speaking.');
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

  const endCall = () => {
    stopRecording();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (speechSynthesisRef.current) {
      window.speechSynthesis.cancel();
    }
    if (ladyVideoRef.current) {
      ladyVideoRef.current.pause();
    }

    setIsCallActive(false);

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
      conversationQuality: Math.min(100, points * 2),
      topic: selectedTopic
    };

    setAnalytics(conversationAnalytics);

    // Update user stats
    if (user) {
      updateUserStats({
        stats: {
          callsCompleted: (user?.stats?.callsCompleted || 0) + 1,
          totalPracticeTime: (user?.stats?.totalPracticeTime || 0) + Math.round(duration),
          conversationsCompleted: (user?.stats?.conversationsCompleted || 0) + 1
        }
      });
    }
  };

  const downloadTranscript = () => {
    const transcript = conversation.map(msg =>
      `${msg.speaker.toUpperCase()}: ${msg.text}\n[${msg.timestamp.toLocaleTimeString()}]\n`
    ).join('\n');

    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `video-call-${selectedTopic}-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoOn;
      }
    }
    setIsVideoOn(!isVideoOn);
  };

  const toggleAudio = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioOn;
      }
    }
    setIsAudioOn(!isAudioOn);
  };

  return (
    <RouteGuard>
      <div className="min-h-screen flex flex-col space-y-6 p-6 bg-gray-50">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Video Call Practice</h1>
          <p className="text-gray-600">Face-to-face practice with AI tutor</p>
        </div>

        {!isCallActive && !analytics && (
          <div className="grid lg:grid-cols-2 gap-6 flex-1">
            {/* Topic Selection */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Choose a Conversation Topic</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {topics.map(topic => (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic.id)}
                    className={`p-4 rounded-xl border-2 text-left transition ${selectedTopic === topic.id
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

            {/* Instructions */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">How It Works</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm mt-1">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-800 mb-1">Select Topic</h3>
                    <p className="text-green-700 text-sm">Choose what you want to talk about</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mt-1">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-1">Start Video Call</h3>
                    <p className="text-blue-700 text-sm">AI tutor will start speaking first</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-xl">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm mt-1">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-800 mb-1">Speak Naturally</h3>
                    <p className="text-purple-700 text-sm">Respond to AI in natural English</p>
                  </div>
                </div>

                <button
                  onClick={startCall}
                  disabled={!selectedTopic}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  <Phone className="w-6 h-6" />
                  Start Video Call
                </button>
              </div>
            </div>
          </div>
        )}

        {isCallActive && (
          <div className="flex-1 flex flex-col">
            {/* Video Call Interface */}
            <div className="flex-1 bg-gray-900 rounded-2xl overflow-hidden relative min-h-[600px]">
              <div className="grid grid-cols-1 lg:grid-cols-2 h-full gap-4 p-4">
                {/* User Video */}
                <div className="bg-black rounded-2xl overflow-hidden relative">
                  {isVideoOn ? (
                    <video
                      ref={userVideoRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <User className="w-16 h-16 text-white/60" />
                        </div>
                        <p className="text-xl font-semibold">Camera Off</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    You {isRecording && "🎤"}
                  </div>
                </div>

                {/* AI Avatar with Lady Video/Image */}
                <div className="bg-black rounded-2xl overflow-hidden relative">
                  {/* Use img tag for idle state, video tag only when speaking */}
                  {!isAISpeaking ? (
                    <img
                      src={ladyIdleImage}
                      alt="AI Tutor"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      ref={ladyVideoRef}
                      autoPlay
                      muted
                      playsInline
                      loop
                      className="w-full h-full object-cover"
                    >
                      <source src={ladyVideo} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}

                  <div className="absolute top-4 left-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    👩‍🏫 AI Tutor {isAISpeaking && "🗣️"}
                  </div>

                  {/* Status overlay */}
                  <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white px-4 py-2 rounded-full text-sm font-medium ${isAISpeaking ? 'bg-green-500' : 'bg-blue-500'
                    }`}>
                    {isAISpeaking ? "Speaking..." : 
                     isListening ? "Listening to you..." : "Ready to listen"}
                  </div>
                </div>
              </div>

              {/* Points Display */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-4 py-2 rounded-full flex items-center gap-2">
                <span className="font-semibold">Points: {points}</span>
              </div>

              {/* Call Controls */}
              <div className="absolute  left-1/2 transform -translate-x-1/2 flex gap-4">
                <button
                  onClick={toggleVideo}
                  className={`p-4 rounded-2xl transition ${isVideoOn
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                    }`}
                >
                  {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                </button>

                <button
                  onClick={toggleAudio}
                  className={`p-4 rounded-2xl transition ${isAudioOn
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                    }`}
                >
                  {isAudioOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                </button>

                {isRecording ? (
                  <button
                    onClick={stopRecording}
                    className="p-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl transition flex items-center gap-2"
                  >
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    Stop Speaking
                  </button>
                ) : (
                  <button
                    onClick={startRecording}
                    disabled={isAISpeaking || isListening}
                    className="p-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl transition disabled:opacity-50 flex items-center gap-2"
                  >
                    <Mic className="w-6 h-6" />
                    Speak Now
                  </button>
                )}

                <button
                  onClick={endCall}
                  className="p-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl transition"
                >
                  <Square className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        )}

        {analytics && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Video Call Completed!</h2>
              <p className="text-gray-600">Excellent conversation practice!</p>
            </div>

            {/* Conversation Transcript */}
            <div className="mb-6 bg-gray-50 rounded-xl p-4 max-h-64 overflow-y-auto">
              <h3 className="font-semibold text-gray-800 mb-3">Conversation Transcript</h3>
              <div className="space-y-3">
                {conversation.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${msg.speaker === 'ai' ? 'bg-blue-100 border border-blue-200' : 'bg-green-100 border border-green-200'
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${msg.speaker === 'ai' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
                        }`}>
                        {msg.speaker === 'ai' ? 'AI' : 'You'}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800">{msg.text}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {msg.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-xl text-center">
                <MessageCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">{analytics.totalMessages}</p>
                <p className="text-blue-700 text-sm">Total Messages</p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl text-center">
                <User className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">{analytics.userMessages}</p>
                <p className="text-green-700 text-sm">Your Messages</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl text-center">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold text-sm">₹</span>
                </div>
                <p className="text-2xl font-bold text-purple-600">{analytics.pointsEarned}</p>
                <p className="text-purple-700 text-sm">Points Earned</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-xl text-center">
                <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold text-sm">⏱</span>
                </div>
                <p className="text-2xl font-bold text-orange-600">{analytics.duration}s</p>
                <p className="text-orange-700 text-sm">Duration</p>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setIsCallActive(false);
                  setAnalytics(null);
                  setConversation([]);
                  setPoints(0);
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