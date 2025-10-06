// app/dashboard/progress/page.js
'use client';
import { useState, useEffect } from 'react';
import { TrendingUp, Target, Award, Clock, Calendar, BarChart3, Download } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { RouteGuard } from '../../../components/RouteGuard';
import { collection, query, where, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

export default function ProgressPage() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('week');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]); // Initialize as empty array
  const [activities, setActivities] = useState([]);
  const [goals, setGoals] = useState([]);
  const [achievements, setAchievements] = useState([]);

  // Fetch user progress data
  useEffect(() => {
    if (user) {
      fetchProgressData();
    }
  }, [user, timeRange]);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      
      // Fetch user stats
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();
      
      // Fetch recent activities (with error handling for missing collection)
      let activitiesData = [];
      try {
        const activitiesQuery = query(
          collection(db, 'activities'),
          where('userId', '==', user.uid),
          orderBy('timestamp', 'desc')
        );
        
        const activitiesSnapshot = await getDocs(activitiesQuery);
        activitiesData = activitiesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate() // Convert Firestore timestamp to Date
        }));

        // Filter by time range
        const timeRangeStart = getTimeRangeStart(timeRange);
        activitiesData = activitiesData.filter(activity => 
          activity.timestamp >= timeRangeStart
        );
      } catch (error) {
        console.log('Activities collection not available yet:', error.message);
        activitiesData = [];
      }

      // Process the data
      processUserData(userData, activitiesData);
      
    } catch (error) {
      console.error('Error fetching progress data:', error);
      // Set default data on error
      setStats(getDefaultStats());
      setActivities([]);
      setGoals(getDefaultGoals());
      setAchievements(getDefaultAchievements());
    } finally {
      setLoading(false);
    }
  };

  const getTimeRangeStart = (range) => {
    const now = new Date();
    switch (range) {
      case 'week':
        return new Date(now.setDate(now.getDate() - 7));
      case 'month':
        return new Date(now.setMonth(now.getMonth() - 1));
      case 'quarter':
        return new Date(now.setMonth(now.getMonth() - 3));
      case 'year':
        return new Date(now.setFullYear(now.getFullYear() - 1));
      default:
        return new Date(now.setDate(now.getDate() - 7));
    }
  };

  const processUserData = (userData, activitiesData) => {
    const userStats = userData?.stats || {};
    
    // Calculate stats - ensure we return an array
    const calculatedStats = [
      { 
        label: 'Total Practice Time', 
        value: formatTime(userStats.totalPracticeTime || 0), 
        icon: <Clock className="w-6 h-6" />, 
        change: calculateChange(userStats.totalPracticeTime, userStats.previousPracticeTime) 
      },
      { 
        label: 'Words Learned', 
        value: userStats.wordsLearned || 0, 
        icon: <Target className="w-6 h-6" />, 
        change: calculateChange(userStats.wordsLearned, userStats.previousWordsLearned) 
      },
      { 
        label: 'Grammar Fixed', 
        value: userStats.grammarMistakesFixed || 0, 
        icon: <Award className="w-6 h-6" />, 
        change: calculateChange(userStats.grammarMistakesFixed, userStats.previousGrammarFixed) 
      },
      { 
        label: 'Current Streak', 
        value: `${userStats.currentStreak || 0} days`, 
        icon: <TrendingUp className="w-6 h-6" />, 
        change: calculateStreakChange(userStats.currentStreak, userStats.previousStreak) 
      },
    ];

    // Process activities
    const processedActivities = activitiesData.map(activity => ({
      id: activity.id,
      type: activity.type || 'general',
      title: getActivityTitle(activity.type),
      duration: formatTime(activity.duration || 0),
      date: formatDate(activity.timestamp),
      score: activity.score ? `${Math.round(activity.score)}%` : 'N/A'
    }));

    // Calculate goals progress
    const calculatedGoals = calculateGoals(userStats, activitiesData);

    // Calculate achievements
    const calculatedAchievements = calculateAchievements(userStats);

    setStats(calculatedStats);
    setActivities(processedActivities);
    setGoals(calculatedGoals);
    setAchievements(calculatedAchievements);
  };

  // Default data functions
  const getDefaultStats = () => [
    { 
      label: 'Total Practice Time', 
      value: '0m', 
      icon: <Clock className="w-6 h-6" />, 
      change: '+0%' 
    },
    { 
      label: 'Words Learned', 
      value: '0', 
      icon: <Target className="w-6 h-6" />, 
      change: '+0%' 
    },
    { 
      label: 'Grammar Fixed', 
      value: '0', 
      icon: <Award className="w-6 h-6" />, 
      change: '+0%' 
    },
    { 
      label: 'Current Streak', 
      value: '0 days', 
      icon: <TrendingUp className="w-6 h-6" />, 
      change: '+0 days' 
    },
  ];

  const getDefaultGoals = () => [
    { 
      title: 'Daily Practice', 
      target: '30 minutes', 
      current: '0 minutes', 
      progress: 0 
    },
    { 
      title: 'New Words', 
      target: '10 words', 
      current: '0 words', 
      progress: 0 
    },
    { 
      title: 'Conversations', 
      target: '5 sessions', 
      current: '0 sessions', 
      progress: 0 
    },
  ];

  const getDefaultAchievements = () => [
    { 
      name: 'Chat Champion', 
      desc: 'Complete 50 conversations', 
      icon: '💬', 
      unlocked: false 
    },
    { 
      name: 'Word Master', 
      desc: 'Learn 100 words', 
      icon: '📚', 
      unlocked: false 
    },
    { 
      name: 'Grammar Guru', 
      desc: 'Fix 50 grammar mistakes', 
      icon: '✍️', 
      unlocked: false 
    },
    { 
      name: 'Streak Star', 
      desc: '7-day practice streak', 
      icon: '🔥', 
      unlocked: false 
    },
  ];

  const formatTime = (seconds) => {
    if (!seconds) return '0m';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDate = (date) => {
    if (!date) return 'Unknown';
    
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    if (diffDays <= 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const calculateChange = (current, previous) => {
    if (!current || !previous || previous === 0) return '+0%';
    const change = ((current - previous) / previous) * 100;
    return `${change >= 0 ? '+' : ''}${Math.round(change)}%`;
  };

  const calculateStreakChange = (current, previous) => {
    if (!current) return '+0 days';
    const change = current - (previous || 0);
    return `${change >= 0 ? '+' : ''}${change} days`;
  };

  const getActivityTitle = (type) => {
    const titles = {
      'chat': 'AI Conversation',
      'audio': 'Pronunciation Practice',
      'video': 'Video Call Session',
      'game-flashcards': 'Vocabulary Flashcards',
      'game-word-match': 'Word Match Game',
      'game-sentence-builder': 'Sentence Builder',
      'grammar': 'Grammar Practice',
      'general': 'Learning Activity'
    };
    return titles[type] || 'Learning Activity';
  };

  const calculateGoals = (userStats, activities) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dailyPractice = activities
      .filter(act => act.timestamp && new Date(act.timestamp) >= today)
      .reduce((total, act) => total + (act.duration || 0), 0);

    // For demo purposes - in real app, you'd track words per day
    const wordsToday = userStats.wordsLearnedToday || 0;
    
    const sessionsToday = activities.filter(act => {
      if (!act.timestamp) return false;
      const activityDate = new Date(act.timestamp);
      return activityDate >= today && ['chat', 'audio', 'video'].includes(act.type);
    }).length;

    return [
      { 
        title: 'Daily Practice', 
        target: '30 minutes', 
        current: `${Math.floor(dailyPractice / 60)} minutes`, 
        progress: Math.min(100, Math.round((dailyPractice / 1800) * 100)) 
      },
      { 
        title: 'New Words', 
        target: '10 words', 
        current: `${wordsToday} words`, 
        progress: Math.min(100, Math.round((wordsToday / 10) * 100)) 
      },
      { 
        title: 'Conversations', 
        target: '5 sessions', 
        current: `${sessionsToday} sessions`, 
        progress: Math.min(100, Math.round((sessionsToday / 5) * 100)) 
      },
    ];
  };

  const calculateAchievements = (userStats) => {
    return [
      { 
        name: 'Chat Champion', 
        desc: 'Complete 50 conversations', 
        icon: '💬', 
        unlocked: (userStats.conversationsCompleted || 0) >= 50 
      },
      { 
        name: 'Word Master', 
        desc: 'Learn 100 words', 
        icon: '📚', 
        unlocked: (userStats.wordsLearned || 0) >= 100 
      },
      { 
        name: 'Grammar Guru', 
        desc: 'Fix 50 grammar mistakes', 
        icon: '✍️', 
        unlocked: (userStats.grammarMistakesFixed || 0) >= 50 
      },
      { 
        name: 'Streak Star', 
        desc: '7-day practice streak', 
        icon: '🔥', 
        unlocked: (userStats.currentStreak || 0) >= 7 
      },
    ];
  };

  const getActivityDistribution = (activities) => {
    const distribution = {
      'chat': 0,
      'audio': 0,
      'video': 0,
      'game': 0
    };

    activities.forEach(activity => {
      if (activity.type.includes('game')) {
        distribution.game += activity.duration || 0;
      } else if (distribution[activity.type] !== undefined) {
        distribution[activity.type] += activity.duration || 0;
      }
    });

    const total = Object.values(distribution).reduce((sum, duration) => sum + duration, 0);
    
    return Object.entries(distribution)
      .map(([type, duration]) => ({
        label: getActivityTitle(type),
        hours: Math.round(duration / 3600 * 10) / 10,
        color: getActivityColor(type),
        percentage: total > 0 ? Math.round((duration / total) * 100) : 0
      }))
      .filter(item => item.hours > 0);
  };

  const getActivityColor = (type) => {
    const colors = {
      'chat': 'bg-blue-500',
      'audio': 'bg-green-500',
      'video': 'bg-purple-500',
      'game': 'bg-orange-500'
    };
    return colors[type] || 'bg-gray-500';
  };

  const getSkillImprovement = (userStats) => {
    return [
      { 
        skill: 'Vocabulary', 
        improvement: Math.min(100, Math.round(((userStats.wordsLearned || 0) / 200) * 100)), 
        level: getSkillLevel(userStats.wordsLearned || 0) 
      },
      { 
        skill: 'Grammar', 
        improvement: Math.min(100, Math.round(((userStats.grammarMistakesFixed || 0) / 100) * 100)), 
        level: getSkillLevel(userStats.grammarMistakesFixed || 0) 
      },
      { 
        skill: 'Pronunciation', 
        improvement: Math.min(100, Math.round(((userStats.audioPracticeTime || 0) / 36000) * 100)),
        level: getSkillLevel(userStats.audioPracticeTime || 0, 36000) 
      },
      { 
        skill: 'Fluency', 
        improvement: Math.min(100, Math.round(((userStats.conversationsCompleted || 0) / 50) * 100)), 
        level: getSkillLevel(userStats.conversationsCompleted || 0) 
      },
    ];
  };

  const getSkillLevel = (value, max = 100) => {
    const percentage = (value / max) * 100;
    if (percentage >= 75) return 'Advanced';
    if (percentage >= 50) return 'Intermediate';
    if (percentage >= 25) return 'Beginner';
    return 'Newbie';
  };

  const exportData = () => {
    const data = {
      stats,
      activities,
      goals,
      achievements,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `english-progress-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <RouteGuard>
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your progress data...</p>
          </div>
        </div>
      </RouteGuard>
    );
  }

  const activityDistribution = getActivityDistribution(activities);
  const skillImprovement = getSkillImprovement(user?.stats || {});

  return (
    <RouteGuard>
      <div className="h-full space-y-6 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Progress</h1>
            <p className="text-gray-600">Track your English learning journey</p>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            <button 
              onClick={exportData}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition text-gray-700"
            >
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
              {activities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
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
              {activities.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No activities recorded yet</p>
                  <p className="text-sm">Start practicing to see your progress!</p>
                </div>
              )}
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
              {activityDistribution.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-24 text-sm text-gray-600">{item.label}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-4">
                    <div 
                      className={`${item.color} h-4 rounded-full transition-all duration-500`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <div className="w-16 text-right text-sm font-semibold text-gray-800">
                    {item.hours}h
                  </div>
                </div>
              ))}
              {activityDistribution.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  No activity data available
                </div>
              )}
            </div>
          </div>

          {/* Skill Improvement */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Skill Improvement</h2>
            <div className="space-y-4">
              {skillImprovement.map((item, index) => (
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
          <h2 className="text-xl font-bold text-gray-800 mb-6">Your Achievements</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((achievement, index) => (
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
    </RouteGuard>
  );
}

// Helper function to get activity icons
const getActivityIcon = (type) => {
  const icons = {
    'chat': '💬',
    'audio': '🎤',
    'video': '📹',
    'game-flashcards': '🎮',
    'game-word-match': '🎯',
    'game-sentence-builder': '📝',
    'grammar': '✍️',
    'general': '📝'
  };
  return icons[type] || '📝';
};