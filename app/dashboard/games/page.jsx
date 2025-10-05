'use client';
import { useState } from 'react';
import { GamepadIcon, Trophy, Star, Zap, Clock, Users } from 'lucide-react';

export default function GamesPage() {
  const [activeGame, setActiveGame] = useState(null);

  const games = [
    {
      id: 'flashcards',
      title: 'Vocabulary Flashcards',
      description: 'Learn new words with interactive flashcards',
      icon: <Zap className="w-8 h-8" />,
      color: 'from-yellow-400 to-orange-500',
      difficulty: 'Beginner',
      time: '5 min'
    },
    {
      id: 'word-guess',
      title: 'Word Guessing Game',
      description: 'Guess words from emoji hints and descriptions',
      icon: <GamepadIcon className="w-8 h-8" />,
      color: 'from-green-400 to-blue-500',
      difficulty: 'Intermediate',
      time: '10 min'
    },
    {
      id: 'sentence-builder',
      title: 'Sentence Builder',
      description: 'Rearrange words to form correct sentences',
      icon: <Star className="w-8 h-8" />,
      color: 'from-purple-400 to-pink-500',
      difficulty: 'Advanced',
      time: '15 min'
    }
  ];

  const startGame = (gameId) => {
    setActiveGame(gameId);
    // In a real app, this would navigate to the actual game
    alert(`Starting ${games.find(g => g.id === gameId)?.title}. This feature is coming soon!`);
  };

  return (
    <div className="h-full space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Playful Learning</h1>
        <p className="text-gray-600">Learn English through fun games and challenges</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <div
            key={game.id}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition duration-300 hover:scale-105"
          >
            <div className={`w-16 h-16 bg-gradient-to-r ${game.color} rounded-2xl flex items-center justify-center text-white mb-4 shadow-md`}>
              {game.icon}
            </div>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{game.title}</h3>
            <p className="text-gray-600 mb-4 text-sm">{game.description}</p>
            
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span className="flex items-center gap-1">
                <Zap className="w-4 h-4" />
                {game.difficulty}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {game.time}
              </span>
            </div>
            
            <button
              onClick={() => startGame(game.id)}
              className={`w-full bg-gradient-to-r ${game.color} text-white py-3 rounded-xl font-semibold hover:shadow-lg transition shadow-md`}
            >
              Play Now
            </button>
          </div>
        ))}
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Weekly Leaderboard
        </h2>
        <div className="space-y-3">
          {[
            { rank: 1, name: 'Sarah M.', score: 2850 },
            { rank: 2, name: 'Alex K.', score: 2740 },
            { rank: 3, name: 'You', score: 2630 },
            { rank: 4, name: 'Maria L.', score: 2510 },
            { rank: 5, name: 'John D.', score: 2480 }
          ].map((player) => (
            <div
              key={player.rank}
              className={`flex items-center gap-4 p-3 rounded-xl ${
                player.name === 'You' 
                  ? 'bg-blue-50 border border-blue-200' 
                  : 'bg-gray-50'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                player.rank === 1 ? 'bg-yellow-500' :
                player.rank === 2 ? 'bg-gray-400' :
                player.rank === 3 ? 'bg-orange-500' :
                'bg-gray-300'
              }`}>
                {player.rank}
              </div>
              <div className="flex-1">
                <p className={`font-semibold ${
                  player.name === 'You' ? 'text-blue-700' : 'text-gray-800'
                }`}>
                  {player.name}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-800">{player.score}</p>
                <p className="text-xs text-gray-500">points</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}