'use client';
import { useState, useRef } from 'react';
import { Mic, MicOff, Volume2, Download, Play, Square } from 'lucide-react';

export default function AudioCallPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [translation, setTranslation] = useState('');
  const [conversation, setConversation] = useState([]);

  const startRecording = () => {
    setIsRecording(true);
    setTranslation('Listening...');
    // Simulate translation after recording
    setTimeout(() => {
      setTranslation('Hello, how are you doing today?');
      setConversation(prev => [...prev, 
        { speaker: 'You', text: 'नमस्ते, आप कैसे हैं?', translation: 'Hello, how are you?' },
        { speaker: 'AI', text: 'Hello! I am doing great, thank you for asking.', translation: '' }
      ]);
    }, 2000);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const playAudio = () => {
    setIsPlaying(true);
    // Simulate audio playback
    setTimeout(() => setIsPlaying(false), 3000);
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Audio Call Practice</h1>
        <p className="text-gray-600">Speak in your native language, get English responses with audio</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 flex-1">
        {/* Left Panel - Recording Interface */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-32 h-32 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              {isRecording ? (
                <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                  <MicOff className="w-10 h-10 text-white" />
                </div>
              ) : (
                <Mic className="w-16 h-16 text-white" />
              )}
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {isRecording ? 'Speaking...' : 'Ready to Speak'}
            </h2>
            <p className="text-gray-600">
              {isRecording ? 'AI is listening and translating...' : 'Click the microphone to start speaking in Hindi'}
            </p>
          </div>

          {/* Waveform Animation */}
          <div className="mb-8">
            <div className="bg-gray-100 rounded-xl p-4">
              <div className="flex items-center justify-center h-16 gap-1">
                {isRecording ? (
                  Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-green-500 rounded-full animate-pulse"
                      style={{
                        height: `${Math.random() * 40 + 10}px`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))
                ) : (
                  <div className="text-gray-400 text-center">
                    <Volume2 className="w-8 h-8 mx-auto mb-2" />
                    <p>Waveform will appear here when speaking</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Translation Display */}
          {translation && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                English Translation
              </h3>
              <p className="text-blue-700">{translation}</p>
            </div>
          )}

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`px-8 py-4 rounded-2xl font-semibold text-white shadow-lg transition ${
                isRecording
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {isRecording ? (
                <div className="flex items-center gap-2">
                  <Square className="w-5 h-5" />
                  Stop Recording
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Mic className="w-5 h-5" />
                  Start Speaking
                </div>
              )}
            </button>

            <button
              onClick={playAudio}
              disabled={!translation || isPlaying}
              className="px-6 py-4 bg-blue-500 text-white rounded-2xl font-semibold hover:bg-blue-600 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              Play Audio
            </button>
          </div>
        </div>

        {/* Right Panel - Conversation History */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Conversation History</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition text-gray-700">
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {conversation.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Volume2 className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No conversations yet</p>
                <p className="text-sm">Start speaking to see the conversation history</p>
              </div>
            ) : (
              conversation.map((item, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border ${
                    item.speaker === 'You'
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-green-50 border-green-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`font-semibold ${
                      item.speaker === 'You' ? 'text-blue-700' : 'text-green-700'
                    }`}>
                      {item.speaker}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                  {item.translation && (
                    <div className="mb-2">
                      <p className="text-sm text-gray-600 mb-1">You said (Hindi):</p>
                      <p className="text-gray-800 bg-white/50 rounded-lg px-3 py-2 text-sm">
                        {item.text}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {item.speaker === 'You' ? 'Translation:' : 'AI Response:'}
                    </p>
                    <p className="text-gray-800 bg-white/50 rounded-lg px-3 py-2">
                      {item.speaker === 'You' ? item.translation : item.text}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick Phrases */}
          <div className="mt-6">
            <h3 className="font-semibold text-gray-800 mb-3">Try These Phrases:</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                'How are you?',
                'What is your name?',
                'Where are you from?',
                'Thank you very much'
              ].map((phrase, index) => (
                <button
                  key={index}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition text-center"
                  onClick={() => setTranslation(phrase)}
                >
                  {phrase}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}