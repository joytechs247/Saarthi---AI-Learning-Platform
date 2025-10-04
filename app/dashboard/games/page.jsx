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
      time: '5 min',
      players: '1 player'
    },
    {
      id: 'word-guess',
      title: 'Word Guessing Game',
      description: 'Guess words from emoji hints and descriptions',
      icon: <GamepadIcon className="w-8 h-8" />,
      color: 'from-green-400 to-blue-500',
      difficulty: 'Intermediate',
      time: '10 min',
      players: '1-2 players'
    },
    {
      id: 'sentence-builder',
      title: 'Sentence Builder',
      description: 'Rearrange words to form correct sentences',
      icon: <Star className="w-8 h-8" />,
      color: 'from-purple-400 to-pink-500',
      difficulty: 'Advanced',
      time: '15 min',
      players: '1 player'
    },
    {
      id: 'pronunciation',
      title: 'Pronunciation Challenge',
      description: 'Practice speaking with voice recognition',
      icon: <Trophy className="w-8 h-8" />,
      color: 'from-red-400 to-pink-500',
      difficulty: 'All Levels',
      time: '8 min',
      players: '1 player'
    }
  ];

  const leaderboard = [
    { rank: 1, name: 'Sarah M.', score: 2850, avatar: 'SM' },
    { rank: 2, name: 'Alex K.', score: 2740, avatar: 'AK' },
    { rank: 3, name: 'You', score: 2630, avatar: 'YO' },
    { rank: 4, name: 'Maria L.', score: 2510, avatar: 'ML' },
    { rank: 5, name: 'John D.', score: 2480, avatar: 'JD' }
  ];

  const startGame = (gameId) => {
    setActiveGame(gameId);
    // In a real app, this would navigate to the actual game
    console.log('Starting game:', gameId);
  };

  if (activeGame) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <GamepadIcon className="w-16 h-16 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Starting {games.find(g => g.id === activeGame)?.title}...
          </h2>
          <p className="text-gray-600 mb-8">Game interface loading...</p>
          <button
            onClick={() => setActiveGame(null)}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl transition"
          >
            Back to Games
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Playful Learning</h1>
        <p className="text-gray-600">Learn English through fun games and challenges</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Games Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <GamepadIcon className="w-6 h-6" />
            Available Games
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
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
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Zap className="w-4 h-4" />
                      {game.difficulty}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {game.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {game.players}
                    </span>
                  </div>
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
        </div>

        {/* Leaderboard and Daily Challenge */}
        <div className="space-y-6">
          {/* Daily Challenge */}
          <div className="bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Daily Challenge
            </h2>
            <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold">Complete 3 Games Today</span>
                <span className="bg-white/30 px-2 py-1 rounded-full text-sm font-semibold">
                  1/3 Completed
                </span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex-1 bg-white/30 rounded-full h-2">
                  <div className="bg-white h-2 rounded-full w-1/3"></div>
                </div>
                <span className="text-sm font-semibold">33%</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div className={`p-2 rounded-lg ${1 >= 1 ? 'bg-white/30' : 'bg-white/10'}`}>
                  Flashcards
                </div>
                <div className={`p-2 rounded-lg ${1 >= 2 ? 'bg-white/30' : 'bg-white/10'}`}>
                  Word Guess
                </div>
                <div className={`p-2 rounded-lg ${1 >= 3 ? 'bg-white/30' : 'bg-white/10'}`}>
                  Sentence Builder
                </div>
              </div>
              <button className="w-full bg-white text-orange-600 py-3 rounded-xl font-semibold hover:bg-gray-100 transition mt-4">
                Start Challenge
              </button>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Weekly Leaderboard
            </h2>
            <div className="space-y-3">
              {leaderboard.map((player, index) => (
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
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {player.avatar}
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
            <button className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition">
              View Full Leaderboard
            </button>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Your Achievements</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2 text-white">
                  <Trophy className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-yellow-800">Vocabulary Master</p>
                <p className="text-xs text-yellow-600">50 words</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2 text-white">
                  <Star className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-blue-800">Grammar Guru</p>
                <p className="text-xs text-blue-600">25 corrections</p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl border border-green-200">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2 text-white">
                  <Zap className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-green-800">Fast Learner</p>
                <p className="text-xs text-green-600">7 day streak</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}