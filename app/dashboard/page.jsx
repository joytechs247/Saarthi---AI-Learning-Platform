import Link from 'next/link';
import { MessageCircle, Phone, Video, GamepadIcon, BarChart3, Award, TrendingUp, Clock, Users } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { label: 'Grammar Fixed', value: '127', color: 'from-green-400 to-blue-500', icon: <TrendingUp className="w-6 h-6" /> },
    { label: 'Words Learned', value: '56', color: 'from-purple-400 to-pink-500', icon: <Award className="w-6 h-6" /> },
    { label: 'Calls Completed', value: '12', color: 'from-orange-400 to-red-500', icon: <Phone className="w-6 h-6" /> },
    { label: 'Current Streak', value: '7 days', color: 'from-blue-400 to-indigo-500', icon: <Clock className="w-6 h-6" /> },
  ];

  const quickActions = [
    { 
      icon: <MessageCircle className="w-6 h-6" />, 
      label: 'Start Chat', 
      description: 'Practice with AI',
      color: 'from-blue-500 to-blue-600',
      href: '/dashboard/chat'
    },
    { 
      icon: <Phone className="w-6 h-6" />, 
      label: 'Audio Call', 
      description: 'Speak & listen',
      color: 'from-green-500 to-green-600',
      href: '/dashboard/audio-call'
    },
    { 
      icon: <Video className="w-6 h-6" />, 
      label: 'Video Call', 
      description: 'Face-to-face practice',
      color: 'from-purple-500 to-purple-600',
      href: '/dashboard/video-call'
    },
    { 
      icon: <GamepadIcon className="w-6 h-6" />, 
      label: 'Play Games', 
      description: 'Learn with fun',
      color: 'from-orange-500 to-orange-600',
      href: '/dashboard/games'
    },
  ];

  const recentActivities = [
    { type: 'chat', title: 'Travel Conversation', time: '15 min ago', duration: '12 minutes' },
    { type: 'audio', title: 'Job Interview Practice', time: '2 hours ago', duration: '8 minutes' },
    { type: 'game', title: 'Word Guessing Game', time: '1 day ago', score: '85%' },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'chat': return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'audio': return <Phone className="w-5 h-5 text-green-500" />;
      case 'game': return <GamepadIcon className="w-5 h-5 text-orange-500" />;
      default: return <MessageCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, John! 👋</h1>
            <p className="text-blue-100 text-lg">Ready to continue your English learning journey?</p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-sm">Daily Goal</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 bg-white/30 rounded-full h-2">
                  <div className="bg-white h-2 rounded-full w-3/4"></div>
                </div>
                <span className="text-sm font-semibold">75%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition duration-300">
            <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-4 text-white shadow-md`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</p>
            <p className="text-gray-600 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className={`bg-gradient-to-r ${action.color} text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105 block`}
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                {action.icon}
              </div>
              <div>
                <span className="font-semibold text-lg block">{action.label}</span>
                <span className="text-white/80 text-sm">{action.description}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{activity.title}</p>
                  <p className="text-sm text-gray-600">{activity.time}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">
                    {activity.duration || activity.score}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Challenge */}
        <div className="bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5" />
            Daily Challenge
          </h2>
          <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
            <p className="font-semibold mb-2">Complete 5 conversations today</p>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 bg-white/30 rounded-full h-2">
                <div className="bg-white h-2 rounded-full w-2/5"></div>
              </div>
              <span className="text-sm font-semibold">2/5</span>
            </div>
            <button className="w-full bg-white text-orange-600 py-3 rounded-xl font-semibold hover:bg-gray-100 transition">
              Start Challenge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}