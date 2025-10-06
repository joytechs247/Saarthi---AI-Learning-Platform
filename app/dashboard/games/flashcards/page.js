// app/dashboard/games/flashcards/page.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Volume2, Check, X, Zap, Star, Trophy, RotateCcw, Bug } from 'lucide-react';
import { useAuth } from '../../../../hooks/useAuth';
import { RouteGuard } from '../../../../components/RouteGuard';

export default function FlashcardsGame() {
  const router = useRouter();
  const { user, updateUserStats } = useAuth();
  const [flashcardDeck, setFlashcardDeck] = useState([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameStatus, setGameStatus] = useState('loading');
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState('');
  const [debugInfo, setDebugInfo] = useState('');

  // Test API directly
  const testAPI = async () => {
    try {
      setApiStatus('Testing API connection...');
      const response = await fetch('/api/games/test');
      const data = await response.json();
      console.log('Test API response:', data);
      setDebugInfo(JSON.stringify(data, null, 2));
      setApiStatus('Test completed - check console');
    } catch (error) {
      console.error('Test failed:', error);
      setApiStatus('Test failed: ' + error.message);
    }
  };

  // Load new flashcard deck
  const loadFlashcards = async () => {
    try {
      setLoading(true);
      setApiStatus('🔄 Requesting AI-generated content...');
      
      const response = await fetch('/api/games/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameType: 'flashcards',
          difficulty: 'intermediate',
          count: 4
        })
      });

      setApiStatus('📥 Processing AI response...');
      const data = await response.json();
      
      console.log('🎯 Full API response:', data);

      if (data.success && data.content && data.content.length > 0) {
        setFlashcardDeck(data.content);
        setGameStatus('playing');
        setApiStatus('✅ AI content loaded successfully!');
        console.log('🎮 AI Content:', data.content);
      } else if (data.fallback) {
        setFlashcardDeck(data.fallback);
        setGameStatus('playing');
        setApiStatus('⚠️ Using fallback content - AI response issue');
        console.log('🔄 Fallback content:', data.fallback);
      } else {
        setFlashcardDeck(getHardcodedFlashcards());
        setGameStatus('playing');
        setApiStatus('❌ Using hardcoded content - API failed');
        console.log('💾 Hardcoded content loaded');
      }

      if (data.error) {
        console.error('API Error:', data.error);
        setApiStatus(`❌ API Error: ${data.error}`);
      }

      if (data.debug) {
        console.log('🐛 Debug info:', data.debug);
      }

    } catch (error) {
      console.error('💥 Network error:', error);
      setFlashcardDeck(getHardcodedFlashcards());
      setGameStatus('playing');
      setApiStatus('💥 Network error - using hardcoded content');
    } finally {
      setLoading(false);
    }
  };

  const getHardcodedFlashcards = () => [
    {
      word: "Eloquent",
      definition: "Fluent or persuasive in speaking or writing",
      options: ["Speaking unclearly", "Fluent in speech", "Writing slowly", "Reading quietly"],
      correct: 1,
      example: "She was an eloquent speaker who captivated the audience."
    },
    {
      word: "Resilient", 
      definition: "Able to withstand or recover quickly from difficult conditions",
      options: ["Very weak", "Able to recover quickly", "Always tired", "Very old"],
      correct: 1,
      example: "Despite many setbacks, she remained resilient and never gave up."
    }
  ];

  useEffect(() => {
    loadFlashcards();
  }, []);

  const handleAnswer = (answerIndex) => {
    if (showResult || gameStatus !== 'playing') return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);

    const isCorrect = answerIndex === flashcardDeck[currentCard].correct;
    
    if (isCorrect) {
      setScore(score + 100);
    } else {
      setLives(lives - 1);
    }

    setTimeout(() => {
      if (isCorrect) {
        if (currentCard === flashcardDeck.length - 1) {
          endGame(true);
        } else {
          setCurrentCard(currentCard + 1);
          setSelectedAnswer(null);
          setShowResult(false);
        }
      } else {
        if (lives - 1 === 0) {
          endGame(false);
        } else {
          setSelectedAnswer(null);
          setShowResult(false);
        }
      }
    }, 1500);
  };

  const endGame = async (won) => {
    setGameStatus(won ? 'won' : 'lost');
    
    if (user) {
      await updateUserStats({
        stats: {
          gamesPlayed: (user.stats?.gamesPlayed || 0) + 1,
          gamePoints: (user.stats?.gamePoints || 0) + score,
          correctAnswers: (user.stats?.correctAnswers || 0) + (won ? flashcardDeck.length : currentCard),
          vocabularyWords: (user.stats?.vocabularyWords || 0) + flashcardDeck.length
        }
      });
    }
  };

  const speakWord = (word) => {
    const speech = new SpeechSynthesisUtterance(word);
    speech.lang = 'en-US';
    speech.rate = 0.8;
    window.speechSynthesis.speak(speech);
  };

  const restartGame = async () => {
    setCurrentCard(0);
    setScore(0);
    setLives(3);
    setSelectedAnswer(null);
    setShowResult(false);
    await loadFlashcards();
  };

  if (loading || gameStatus === 'loading') {
    return (
      <RouteGuard>
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">{apiStatus || 'Generating new vocabulary words...'}</p>
            <p className="text-sm text-gray-400 mt-2">Powered by AI</p>
          </div>
        </div>
      </RouteGuard>
    );
  }

  if (gameStatus !== 'playing') {
    
    return (
      <RouteGuard>
        <div className="h-full flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center max-w-md w-full">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
              gameStatus === 'won' ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {gameStatus === 'won' ? (
                <Trophy className="w-10 h-10 text-green-600" />
              ) : (
                <X className="w-10 h-10 text-red-600" />
              )}
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {gameStatus === 'won' ? 'Vocabulary Master! 🎉' : 'Game Over'}
            </h2>
            
            <p className="text-gray-600 mb-2">
              {gameStatus === 'won' 
                ? `You mastered ${flashcardDeck.length} new words!` 
                : `You learned ${currentCard} new words!`
              }
            </p>

            {/* Show if AI content was used */}
            {apiStatus && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-blue-700 text-sm">{apiStatus}</p>
              </div>
            )}
            
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl p-4 mb-6">
              <p className="text-2xl font-bold">{score} Points</p>
              <p className="text-yellow-100">Total Score</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={restartGame}
                className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                New Words
              </button>
              <button
                onClick={() => router.push('/dashboard/games')}
                className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-semibold hover:bg-gray-600 transition"
              >
                More Games
              </button>
            </div>
          </div>
        </div>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard>
      <div className="h-full flex flex-col p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push('/dashboard/games')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Games
          </button>
          
          <div className="flex items-center gap-4">
            <button
              onClick={restartGame}
              className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition"
              title="Get new AI-generated words"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
              <Star className="w-4 h-4 inline mr-1" />
              {score} Points
            </div>
            <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
              ❤️ {lives} Lives
            </div>
          </div>
        </div>

        {/* API Status */}
        {/* {apiStatus && (
          <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-blue-700 text-sm flex items-center gap-2">
              <Zap className="w-4 h-4" />
              {apiStatus}
            </p>
          </div>
        )} */}

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Word {currentCard + 1} of {flashcardDeck.length}</span>
            <span>{Math.round(((currentCard + 1) / flashcardDeck.length) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentCard + 1) / flashcardDeck.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Flashcard */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 max-w-md w-full">
            {/* Word */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <h2 className="text-3xl font-bold text-gray-800">
                  {flashcardDeck[currentCard].word}
                </h2>
                <button
                  onClick={() => speakWord(flashcardDeck[currentCard].word)}
                  className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
              
              <p className="text-gray-600 text-lg mb-4">
                {flashcardDeck[currentCard].definition}
              </p>
              
              <p className="text-sm text-gray-500 italic">
                "{flashcardDeck[currentCard].example}"
              </p>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {flashcardDeck[currentCard].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-xl text-left transition ${
                    showResult
                      ? index === flashcardDeck[currentCard].correct
                        ? 'bg-green-100 border-2 border-green-500 text-green-800'
                        : selectedAnswer === index
                        ? 'bg-red-100 border-2 border-red-500 text-red-800'
                        : 'bg-gray-100 text-gray-600'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showResult && index === flashcardDeck[currentCard].correct && (
                      <Check className="w-5 h-5 text-green-600" />
                    )}
                    {showResult && selectedAnswer === index && index !== flashcardDeck[currentCard].correct && (
                      <X className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}