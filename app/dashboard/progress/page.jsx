'use client';
import { useState } from 'react';
import { TrendingUp, Target, Award, Clock, Calendar, BarChart3, Download } from 'lucide-react';

export default function ProgressPage() {
  const [timeRange, setTimeRange] = useState('week');

  const stats = [
    { label: 'Total Practice Time', value: '12h 45m', icon: <Clock className="w-6 h-6" />, change: '+15%' },
    { label: 'Words Learned', value: '156', icon: <Target className="w-6 h-6" />, change: '+8%' },
    { label: 'Grammar Fixed', value: '89', icon: <Award className="w-6 h-6" />, change: '+12%' },
    { label: 'Current Streak', value: '7 days', icon: <TrendingUp className="w-6 h-6" />, change: '+2 days' },
  ];

  const activities = [
    { type: 'chat', title: 'AI Conversation', duration: '15m', date: 'Today', score: '85%' },
    { type: 'audio', title: 'Pronunciation Practice', duration: '8m', date: 'Today', score: '78%' },
    { type: 'game', title: 'Vocabulary Flashcards', duration: '12m', date: 'Yesterday', score: '92%' },
    { type: 'video', title: 'Video Call Session', duration: '20m', date: '2 days ago', score: '81%' },
  ];

  const goals = [
    { title: 'Daily Practice', target: '30 minutes', current: '25 minutes', progress: 83 },
    { title: 'New Words', target: '10 words', current: '8 words', progress: 80 },
    { title: 'Conversations', target: '5 sessions', current: '3 sessions', progress: 60 },
  ];

  const getActivityIcon = (type) => {
    const icons = {
      chat: '💬',
      audio: '🎤',
      game: '🎮',
      video: '📹'
    };
    return icons[type] || '📝';
  };

  return (
    <div className="h-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Progress</h1>
          <p className="text-gray-600">Track your English learning journey</p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition text-gray-700">
            <Download className="w-4 h-4" />
            Export Data
          </button>
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-md">
                {stat.icon}
              </div>
              <span className="text-green-600 font-semibold text-sm bg-green-50 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</p>
            <p className="text-gray-600 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Goals Progress */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Learning Goals
          </h2>
          <div className="space-y-6">
            {goals.map((goal, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-800">{goal.title}</span>
                  <span className="text-sm text-gray-600">
                    {goal.current} / {goal.target}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-700 w-12">
                    {goal.progress}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Recent Activities
          </h2>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{activity.title}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{activity.duration}</span>
                    <span>•</span>
                    <span>{activity.date}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">{activity.score}</p>
                  <p className="text-xs text-gray-500">score</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Time Spent Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Time Spent Learning
          </h2>
          <div className="space-y-4">
            {[
              { label: 'AI Chat', hours: 5.2, color: 'bg-blue-500' },
              { label: 'Audio Calls', hours: 3.8, color: 'bg-green-500' },
              { label: 'Video Calls', hours: 2.1, color: 'bg-purple-500' },
              { label: 'Games', hours: 1.4, color: 'bg-orange-500' },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-24 text-sm text-gray-600">{item.label}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-4">
                  <div 
                    className={`${item.color} h-4 rounded-full transition-all duration-500`}
                    style={{ width: `${(item.hours / 12.5) * 100}%` }}
                  ></div>
                </div>
                <div className="w-16 text-right text-sm font-semibold text-gray-800">
                  {item.hours}h
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Improvement */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Skill Improvement</h2>
          <div className="space-y-4">
            {[
              { skill: 'Vocabulary', improvement: 35, level: 'Intermediate' },
              { skill: 'Grammar', improvement: 28, level: 'Intermediate' },
              { skill: 'Pronunciation', improvement: 42, level: 'Advanced' },
              { skill: 'Fluency', improvement: 31, level: 'Intermediate' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-semibold text-gray-800">{item.skill}</p>
                  <p className="text-sm text-gray-600">{item.level}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">+{item.improvement}%</p>
                  <p className="text-xs text-gray-500">improvement</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Achievements</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Chat Champion', desc: 'Complete 50 conversations', icon: '💬', unlocked: true },
            { name: 'Word Master', desc: 'Learn 100 words', icon: '📚', unlocked: true },
            { name: 'Grammar Guru', desc: 'Fix 50 grammar mistakes', icon: '✍️', unlocked: false },
            { name: 'Streak Star', desc: '7-day practice streak', icon: '🔥', unlocked: true },
          ].map((achievement, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl text-center border-2 ${
                achievement.unlocked
                  ? 'bg-green-50 border-green-200'
                  : 'bg-gray-100 border-gray-200 opacity-60'
              }`}
            >
              <div className="text-3xl mb-2">{achievement.icon}</div>
              <h3 className="font-semibold text-gray-800 mb-1">{achievement.name}</h3>
              <p className="text-sm text-gray-600">{achievement.desc}</p>
              {achievement.unlocked && (
                <div className="mt-2 text-xs text-green-600 font-semibold">Unlocked!</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}