// app/dashboard/games/page.js
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GamepadIcon, Trophy, Star, Zap, Clock, Users, Award, TrendingUp } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { RouteGuard } from '../../../components/RouteGuard';

export default function GamesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [userStats, setUserStats] = useState(user?.stats || {});

  const games = [
    {
      id: 'flashcards',
      title: 'Vocabulary Flashcards',
      description: 'Learn new words with interactive flashcards and spaced repetition',
      icon: <Zap className="w-8 h-8" />,
      color: 'from-yellow-400 to-orange-500',
      difficulty: 'Beginner',
      time: '5 min',
      features: ['500+ words', 'Spaced repetition', 'Audio pronunciation'],
      route: '/dashboard/games/flashcards'
    },
    {
      id: 'word-match',
      title: 'Word Match Challenge',
      description: 'Match words with their meanings in this memory game',
      icon: <GamepadIcon className="w-8 h-8" />,
      color: 'from-green-400 to-blue-500',
      difficulty: 'Intermediate',
      time: '10 min',
      features: ['Memory training', 'Context learning', 'Timed challenges'],
      route: '/dashboard/games/word-match'
    },
    {
      id: 'sentence-builder',
      title: 'Sentence Builder',
      description: 'Rearrange words to form grammatically correct sentences',
      icon: <Star className="w-8 h-8" />,
      color: 'from-purple-400 to-pink-500',
      difficulty: 'Advanced',
      time: '15 min',
      features: ['Grammar practice', 'Real-life scenarios', 'Progress tracking'],
      route: '/dashboard/games/sentence-builder'
    }
  ];

  const startGame = (gameRoute) => {
    router.push(gameRoute);
  };

  return (
    <RouteGuard>
      <div className="h-full space-y-6 p-6">
        {/* Header with User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-4 text-white">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8" />
              <div>
                <p className="text-2xl font-bold">{userStats?.gamePoints || 0}</p>
                <p className="text-blue-100 text-sm">Total Points</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-4 text-white">
            <div className="flex items-center gap-3">
              <GamepadIcon className="w-8 h-8" />
              <div>
                <p className="text-2xl font-bold">{userStats?.gamesPlayed || 0}</p>
                <p className="text-green-100 text-sm">Games Played</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-4 text-white">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8" />
              <div>
                <p className="text-2xl font-bold">{userStats?.currentStreak || 0}</p>
                <p className="text-orange-100 text-sm">Day Streak</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-4 text-white">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8" />
              <div>
                <p className="text-2xl font-bold">{userStats?.correctAnswers || 0}</p>
                <p className="text-purple-100 text-sm">Correct Answers</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Playful Learning</h1>
          <p className="text-gray-600">Learn English through fun games and challenges</p>
        </div>

        {/* Games Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <div
              key={game.id}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition duration-300 hover:scale-105 flex flex-col"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${game.color} rounded-2xl flex items-center justify-center text-white mb-4 shadow-md`}>
                {game.icon}
              </div>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{game.title}</h3>
              <p className="text-gray-600 mb-4 text-sm flex-1">{game.description}</p>
              
              {/* Features */}
              <div className="mb-4 space-y-1">
                {game.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    {feature}
                  </div>
                ))}
              </div>
              
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
                onClick={() => startGame(game.route)}
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
              { rank: 1, name: 'Sarah M.', score: 2850, games: 24 },
              { rank: 2, name: 'Alex K.', score: 2740, games: 22 },
              { rank: 3, name: user?.name || 'You', score: 2630, games: 20 },
              { rank: 4, name: 'Maria L.', score: 2510, games: 18 },
              { rank: 5, name: 'John D.', score: 2480, games: 17 }
            ].map((player) => (
              <div
                key={player.rank}
                className={`flex items-center gap-4 p-3 rounded-xl ${
                  player.name === user?.name 
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
                    player.name === user?.name ? 'text-blue-700' : 'text-gray-800'
                  }`}>
                    {player.name} {player.name === user?.name && '(You)'}
                  </p>
                  <p className="text-xs text-gray-500">{player.games} games played</p>
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
    </RouteGuard>
  );
}