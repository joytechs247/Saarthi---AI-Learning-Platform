// app/dashboard/games/word-match/page.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RotateCcw, Trophy, Timer } from 'lucide-react';
import { useAuth } from '../../../../hooks/useAuth';
import { RouteGuard } from '../../../../components/RouteGuard';

export default function WordMatchGame() {
  const router = useRouter();
  const { user, updateUserStats } = useAuth();
  const [wordPairs, setWordPairs] = useState([]);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [time, setTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load new word pairs
  const loadWordPairs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/games/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameType: 'word-match',
          difficulty: 'intermediate',
          count: 6
        })
      });

      const data = await response.json();
      
      if (data.content) {
        setWordPairs(data.content);
        initializeGame(data.content);
      } else {
        // Fallback data
        setWordPairs(getFallbackWordPairs());
        initializeGame(getFallbackWordPairs());
      }
    } catch (error) {
      console.error('Failed to load word pairs:', error);
      setWordPairs(getFallbackWordPairs());
      initializeGame(getFallbackWordPairs());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackWordPairs = () => [
    { word: "Benevolent", meaning: "Well-meaning and kindly" },
    { word: "Pragmatic", meaning: "Dealing with things sensibly and realistically" },
    { word: "Eloquent", meaning: "Fluent or persuasive in speaking or writing" }
  ];

  const initializeGame = (pairs) => {
    const gameCards = [];
    
    // Create word cards
    pairs.forEach((pair, index) => {
      gameCards.push({
        id: `word-${index}`,
        type: 'word',
        content: pair.word,
        pairId: index
      });
    });
    
    // Create meaning cards
    pairs.forEach((pair, index) => {
      gameCards.push({
        id: `meaning-${index}`,
        type: 'meaning',
        content: pair.meaning,
        pairId: index
      });
    });

    // Shuffle cards
    const shuffledCards = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameWon(false);
    setTime(0);
    setGameStarted(false);
  };

  useEffect(() => {
    loadWordPairs();
  }, []);

  // Timer
  useEffect(() => {
    let interval;
    if (gameStarted && !gameWon) {
      interval = setInterval(() => {
        setTime(time => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameWon]);

  const handleCardClick = (index) => {
    if (!gameStarted) setGameStarted(true);
    
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(cards[index].id)) {
      return;
    }

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      
      const [firstIndex, secondIndex] = newFlipped;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.pairId === secondCard.pairId && firstCard.type !== secondCard.type) {
        // Match found
        setMatched([...matched, firstCard.id, secondCard.id]);
        setFlipped([]);
        
        // Check if game is won
        if (matched.length + 2 === cards.length) {
          setGameWon(true);
          endGame();
        }
      } else {
        // No match
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  const endGame = async () => {
    const score = calculateScore();
    
    if (user) {
      await updateUserStats({
        stats: {
          gamesPlayed: (user.stats?.gamesPlayed || 0) + 1,
          gamePoints: (user.stats?.gamePoints || 0) + score,
          correctAnswers: (user.stats?.correctAnswers || 0) + wordPairs.length
        }
      });
    }
  };

  const calculateScore = () => {
    const baseScore = 500;
    const timeBonus = Math.max(0, 300 - time) * 2;
    const movesBonus = Math.max(0, 20 - moves) * 10;
    return baseScore + timeBonus + movesBonus;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const restartGame = async () => {
    await loadWordPairs();
  };

  if (loading) {
    return (
      <RouteGuard>
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Generating new word pairs...</p>
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
              title="Get new words"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
              <Timer className="w-4 h-4" />
              {formatTime(time)}
            </div>
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
              Moves: {moves}
            </div>
          </div>
        </div>

        {/* Game Board */}
        <div className="flex-1 flex items-center justify-center">
          {gameWon ? (
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center max-w-md w-full">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-10 h-10 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Perfect Match! 🎉</h2>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{moves}</p>
                  <p className="text-sm text-gray-600">Moves</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{formatTime(time)}</p>
                  <p className="text-sm text-gray-600">Time</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{calculateScore()}</p>
                  <p className="text-sm text-gray-600">Points</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={restartGame}
                  className="flex-1 bg-gradient-to-r from-green-400 to-blue-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  New Game
                </button>
                <button
                  onClick={() => router.push('/dashboard/games')}
                  className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-semibold hover:bg-gray-600 transition"
                >
                  More Games
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4 max-w-4xl w-full">
              {cards.map((card, index) => {
                const isFlipped = flipped.includes(index);
                const isMatched = matched.includes(card.id);
                
                return (
                  <div
                    key={card.id}
                    onClick={() => handleCardClick(index)}
                    className={`aspect-square rounded-2xl cursor-pointer transition-all duration-300 transform ${
                      isFlipped || isMatched
                        ? 'bg-white shadow-lg border-2 border-blue-200 rotate-0'
                        : 'bg-gradient-to-br from-green-400 to-blue-500 shadow-md hover:shadow-lg hover:scale-105'
                    } ${isMatched ? 'border-green-500' : ''}`}
                  >
                    <div className="w-full h-full flex items-center justify-center p-4">
                      {(isFlipped || isMatched) ? (
                        <div className="text-center">
                          <p className={`font-semibold ${
                            card.type === 'word' ? 'text-blue-600 text-lg' : 'text-gray-700 text-sm'
                          }`}>
                            {card.content}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {card.type === 'word' ? 'Word' : 'Meaning'}
                          </p>
                        </div>
                      ) : (
                        <div className="text-white text-center">
                          <p className="text-lg">❓</p>
                          <p className="text-xs mt-1">Click to reveal</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Instructions */}
        {!gameWon && (
          <div className="text-center mt-6">
            <p className="text-gray-600 text-sm">
              Match each word with its correct meaning. Find all {wordPairs.length} pairs!
            </p>
          </div>
        )}
      </div>
    </RouteGuard>
  );
}