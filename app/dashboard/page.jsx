// app/dashboard/page.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MessageCircle, Phone, Video, GamepadIcon, BarChart3, Award, 
  TrendingUp, Clock, Users, LogOut, Settings, User 
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { RouteGuard } from '../../components/RouteGuard';
import Link from 'next/link';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [userStats, setUserStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    // Use fallback data if Firestore fails
    const fallbackStats = {
      grammarMistakesFixed: 0,
      wordsLearned: 0,
      callsCompleted: 0,
      totalPracticeTime: 0,
      currentStreak: 0,
      conversationsCompleted: 0
    };

    setUserStats(user.stats || fallbackStats);
    setRecentActivities([]);
    setLoading(false);
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const stats = [
    { 
      label: 'Grammar Fixed', 
      value: userStats?.grammarMistakesFixed || 0, 
      color: 'from-green-400 to-blue-500', 
      icon: <TrendingUp className="w-6 h-6" />,
      change: '+12%'
    },
    { 
      label: 'Words Learned', 
      value: userStats?.wordsLearned || 0, 
      color: 'from-purple-400 to-pink-500', 
      icon: <Award className="w-6 h-6" />,
      change: '+8%'
    },
    { 
      label: 'Calls Completed', 
      value: userStats?.callsCompleted || 0, 
      color: 'from-orange-400 to-red-500', 
      icon: <Phone className="w-6 h-6" />,
      change: '+15%'
    },
    { 
      label: 'Current Streak', 
      value: `${userStats?.currentStreak || 0} days`, 
      color: 'from-blue-400 to-indigo-500', 
      icon: <Clock className="w-6 h-6" />,
      change: '+2 days'
    },
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

  const handleNavigation = (href) => {
    router.push(href);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <RouteGuard>
      <div className="space-y-6 p-6">
        {/* Header with User Menu */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600">Welcome to your learning hub</p>
          </div>
          
          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-800">{user?.name || 'User'}</p>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                <button 
                  onClick={() => handleNavigation('/profile')}
                  className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-50 transition"
                >
                  <User className="w-4 h-4" />
                  Profile
                </button>
                <button 
                  onClick={() => handleNavigation('/settings')}
                  className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-50 transition"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <div className="border-t border-gray-100 my-1"></div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || user?.email?.split('@')[0] || 'Learner'}! 👋</h1>
              <p className="text-blue-100 text-lg">
                {user?.learningGoals || 'Ready to continue your English learning journey?'}
              </p>
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
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-white shadow-md`}>
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className={`bg-gradient-to-r ${action.color} text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105 block w-full text-left`}
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
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivities.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>No activities yet</p>
                  <p className="text-sm">Start learning to see your activities here</p>
                </div>
              ) : (
                recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <MessageCircle className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">AI Conversation Practice</p>
                      <p className="text-sm text-gray-600">
                        {new Date().toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-700">
                        Completed
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Daily Challenge */}
          <div className="bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Daily Challenge
            </h2>
            <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
              <p className="font-semibold mb-2">Complete 3 conversations today</p>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex-1 bg-white/30 rounded-full h-2">
                  <div className="bg-white h-2 rounded-full w-1/3"></div>
                </div>
                <span className="text-sm font-semibold">{userStats?.conversationsCompleted || 0}/3</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div className={`p-2 rounded-lg ${(userStats?.conversationsCompleted || 0) >= 1 ? 'bg-white/30' : 'bg-white/10'}`}>
                  Chat
                </div>
                <div className={`p-2 rounded-lg ${(userStats?.conversationsCompleted || 0) >= 2 ? 'bg-white/30' : 'bg-white/10'}`}>
                  Audio
                </div>
                <div className={`p-2 rounded-lg ${(userStats?.conversationsCompleted || 0) >= 3 ? 'bg-white/30' : 'bg-white/10'}`}>
                  Video
                </div>
              </div>
              <Link 
                href="/dashboard/chat"
                className="w-full bg-white text-orange-600 py-3 rounded-xl font-semibold hover:bg-gray-100 transition mt-4 block text-center"
              >
                Start Challenge
              </Link>
            </div>
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}