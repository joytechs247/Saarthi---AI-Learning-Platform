// app/dashboard/games/sentence-builder/page.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RotateCcw, Trophy, Check, X } from 'lucide-react';
import { useAuth } from '../../../../hooks/useAuth';
import { RouteGuard } from '../../../../components/RouteGuard';

export default function SentenceBuilderGame() {
  const router = useRouter();
  const { user, updateUserStats } = useAuth();
  const [levels, setLevels] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [selectedWords, setSelectedWords] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameStatus, setGameStatus] = useState('loading');
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load new sentence levels
  const loadSentences = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/games/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameType: 'sentence-builder',
          difficulty: 'intermediate',
          count: 5
        })
      });

      const data = await response.json();
      
      if (data.content) {
        setLevels(data.content);
        setGameStatus('playing');
      } else {
        setLevels(getFallbackSentences());
        setGameStatus('playing');
      }
    } catch (error) {
      console.error('Failed to load sentences:', error);
      setLevels(getFallbackSentences());
      setGameStatus('playing');
    } finally {
      setLoading(false);
    }
  };

  const getFallbackSentences = () => [
    {
      words: ["I", "to", "school", "go", "every", "day"],
      correct: ["I", "go", "to", "school", "every", "day"],
      hint: "Talk about daily routine"
    },
    {
      words: ["She", "is", "reading", "an", "book", "interesting"],
      correct: ["She", "is", "reading", "an", "interesting", "book"],
      hint: "Use 'an' before vowel sounds"
    }
  ];

  useEffect(() => {
    loadSentences();
  }, []);

  const handleWordSelect = (word) => {
    if (showResult || gameStatus !== 'playing') return;
    
    setSelectedWords([...selectedWords, word]);
  };

  const handleWordRemove = (index) => {
    if (showResult || gameStatus !== 'playing') return;
    
    const newSelected = [...selectedWords];
    newSelected.splice(index, 1);
    setSelectedWords(newSelected);
  };

  const checkSentence = () => {
    if (showResult || gameStatus !== 'playing') return;
    
    const isCorrect = JSON.stringify(selectedWords) === JSON.stringify(levels[currentLevel].correct);
    setShowResult(true);

    if (isCorrect) {
      setScore(score + 200);
    } else {
      setLives(lives - 1);
    }

    setTimeout(() => {
      if (isCorrect) {
        if (currentLevel === levels.length - 1) {
          endGame(true);
        } else {
          setCurrentLevel(currentLevel + 1);
          setSelectedWords([]);
          setShowResult(false);
        }
      } else {
        if (lives - 1 === 0) {
          endGame(false);
        } else {
          setSelectedWords([]);
          setShowResult(false);
        }
      }
    }, 2000);
  };

  const endGame = async (won) => {
    setGameStatus(won ? 'won' : 'lost');
    
    if (user) {
      await updateUserStats({
        stats: {
          gamesPlayed: (user.stats?.gamesPlayed || 0) + 1,
          gamePoints: (user.stats?.gamePoints || 0) + score,
          correctAnswers: (user.stats?.correctAnswers || 0) + (won ? levels.length : currentLevel)
        }
      });
    }
  };

  const restartGame = async () => {
    setCurrentLevel(0);
    setSelectedWords([]);
    setScore(0);
    setLives(3);
    setShowResult(false);
    await loadSentences();
  };

  if (loading || gameStatus === 'loading') {
    return (
      <RouteGuard>
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Generating new sentences...</p>
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
              {gameStatus === 'won' ? 'Grammar Master! 🎉' : 'Keep Practicing!'}
            </h2>
            
            <p className="text-gray-600 mb-2">
              {gameStatus === 'won' 
                ? `You completed all ${levels.length} levels perfectly!` 
                : `You completed ${currentLevel} levels correctly!`
              }
            </p>
            
            <div className="bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-xl p-4 mb-6">
              <p className="text-2xl font-bold">{score} Points</p>
              <p className="text-purple-100">Total Score</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={restartGame}
                className="flex-1 bg-gradient-to-r from-purple-400 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                New Sentences
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
              title="Get new sentences"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
              Level {currentLevel + 1} of {levels.length}
            </div>
            <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
              {score} Points
            </div>
            <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
              ❤️ {lives} Lives
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center space-y-8">
          {/* Hint */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <p className="text-blue-800 font-semibold">💡 Hint: {levels[currentLevel].hint}</p>
          </div>

          {/* Selected Sentence */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 min-h-24 w-full max-w-2xl">
            <div className="flex flex-wrap gap-2 min-h-16 items-center justify-center">
              {selectedWords.length === 0 ? (
                <p className="text-gray-400 text-center">Select words to build your sentence...</p>
              ) : (
                selectedWords.map((word, index) => (
                  <button
                    key={index}
                    onClick={() => handleWordRemove(index)}
                    className="bg-gradient-to-r from-purple-400 to-pink-500 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition transform hover:scale-105"
                  >
                    {word}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Available Words */}
          <div className="bg-gray-50 rounded-2xl p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Available Words</h3>
            <div className="flex flex-wrap gap-3 justify-center">
              {levels[currentLevel].words
                .filter(word => !selectedWords.includes(word))
                .map((word, index) => (
                  <button
                    key={index}
                    onClick={() => handleWordSelect(word)}
                    className="bg-white border-2 border-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:border-purple-400 hover:text-purple-600 transition shadow-sm"
                  >
                    {word}
                  </button>
                ))}
            </div>
          </div>

          {/* Check Button */}
          <button
            onClick={checkSentence}
            disabled={selectedWords.length === 0 || showResult}
            className="bg-gradient-to-r from-purple-400 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {showResult ? (
              <div className="flex items-center gap-2">
                {JSON.stringify(selectedWords) === JSON.stringify(levels[currentLevel].correct) ? (
                  <>
                    <Check className="w-5 h-5" />
                    Correct!
                  </>
                ) : (
                  <>
                    <X className="w-5 h-5" />
                    Incorrect
                  </>
                )}
              </div>
            ) : (
              'Check Sentence'
            )}
          </button>

          {/* Correct Answer (shown when wrong) */}
          {showResult && JSON.stringify(selectedWords) !== JSON.stringify(levels[currentLevel].correct) && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <p className="text-green-800 font-semibold">
                Correct sentence:{" "}
                <span className="text-green-600">{levels[currentLevel].correct.join(' ')}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </RouteGuard>
  );
}