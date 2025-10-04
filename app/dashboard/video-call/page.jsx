'use client';
import { useState, useRef } from 'react';
import { Video, VideoOff, Mic, MicOff, Captions, Download, Square, Phone } from 'lucide-react';

export default function VideoCallPage() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [subtitles, setSubtitles] = useState('');

  const startCall = () => {
    setIsCallActive(true);
    // Simulate AI responses and subtitles
    const responses = [
      "Hello! How are you doing today?",
      "That's great to hear! What would you like to practice?",
      "I understand. Let's work on your pronunciation.",
      "Your English is improving very well!",
      "Remember to speak slowly and clearly."
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < responses.length) {
        setSubtitles(responses[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 3000);
  };

  const endCall = () => {
    setIsCallActive(false);
    setSubtitles('');
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Video Call Practice</h1>
        <p className="text-gray-600">Face-to-face practice with AI avatar and live subtitles</p>
      </div>

      <div className="flex-1 flex flex-col">
        {/* Video Call Interface */}
        <div className="flex-1 bg-gray-900 rounded-2xl overflow-hidden relative">
          {isCallActive ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 h-full gap-4 p-4">
              {/* User Video */}
              <div className="bg-black rounded-2xl overflow-hidden relative">
                <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Video className="w-16 h-16 text-white/60" />
                    </div>
                    <p className="text-xl font-semibold">Your Camera</p>
                    <p className="text-white/60 mt-2">
                      {isVideoOn ? 'Camera is on' : 'Camera is off'}
                    </p>
                  </div>
                </div>
                <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  You
                </div>
              </div>

              {/* AI Avatar */}
              <div className="bg-black rounded-2xl overflow-hidden relative">
                <div className="w-full h-full bg-gradient-to-br from-green-900 to-blue-900 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="w-24 h-24 bg-white/30 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold">AI</span>
                      </div>
                    </div>
                    <p className="text-xl font-semibold">AI Tutor</p>
                    <p className="text-white/60 mt-2">Speaking English</p>
                  </div>
                </div>
                <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                  AI Tutor
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Video className="w-16 h-16 text-white/60" />
                </div>
                <h2 className="text-2xl font-semibold mb-4">Ready for Video Practice?</h2>
                <p className="text-white/70 max-w-md mx-auto mb-8">
                  Start a video call with our AI tutor to practice face-to-face conversations 
                  with real-time subtitles and feedback.
                </p>
                <button
                  onClick={startCall}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition flex items-center gap-3 mx-auto"
                >
                  <Phone className="w-6 h-6" />
                  Start Video Call
                </button>
              </div>
            </div>
          )}

          {/* Subtitles */}
          {showSubtitles && subtitles && (
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-6 py-3 rounded-2xl backdrop-blur-sm max-w-2xl w-full mx-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-green-400 font-semibold">Live Subtitles</span>
                <Captions className="w-4 h-4 text-green-400" />
              </div>
              <p className="text-center text-lg">{subtitles}</p>
            </div>
          )}

          {/* Call Controls */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4">
            {isCallActive ? (
              <>
                <button
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  className={`p-4 rounded-2xl transition ${
                    isVideoOn 
                      ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                >
                  {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                </button>
                
                <button
                  onClick={() => setIsAudioOn(!isAudioOn)}
                  className={`p-4 rounded-2xl transition ${
                    isAudioOn 
                      ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                >
                  {isAudioOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                </button>

                <button
                  onClick={() => setShowSubtitles(!showSubtitles)}
                  className={`p-4 rounded-2xl transition ${
                    showSubtitles 
                      ? 'bg-green-500 hover:bg-green-600 text-white' 
                      : 'bg-gray-500 hover:bg-gray-600 text-white'
                  }`}
                >
                  <Captions className="w-6 h-6" />
                </button>

                <button
                  onClick={endCall}
                  className="p-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl transition"
                >
                  <Square className="w-6 h-6" />
                </button>
              </>
            ) : null}
          </div>
        </div>

        {/* Conversation Tips */}
        <div className="bg-white rounded-2xl p-6 mt-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Conversation Tips</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm mb-2">
                1
              </div>
              <p className="font-medium text-blue-800 mb-1">Speak Clearly</p>
              <p className="text-blue-700 text-sm">Enunciate your words for better understanding</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-xl border border-green-200">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-sm mb-2">
                2
              </div>
              <p className="font-medium text-green-800 mb-1">Use Complete Sentences</p>
              <p className="text-green-700 text-sm">Practice forming proper English sentences</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm mb-2">
                3
              </div>
              <p className="font-medium text-purple-800 mb-1">Read Subtitles</p>
              <p className="text-purple-700 text-sm">Follow along with the live subtitles</p>
            </div>
          </div>

          {/* Download Options */}
          {isCallActive && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-800">Call Recording</h4>
                  <p className="text-gray-600 text-sm">Download your practice session</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition">
                  <Download className="w-4 h-4" />
                  Download Transcript
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}