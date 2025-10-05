// 'use client';
// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { MessageCircle, Phone, Video, GamepadIcon, BarChart3, Award, TrendingUp, Clock, Users } from 'lucide-react';
// import { useAuth } from '../../hooks/useAuth';

// export default function Dashboard() {
//   const { user } = useAuth();
//   const [userStats, setUserStats] = useState(null);
//   const [recentActivities, setRecentActivities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [firestoreError, setFirestoreError] = useState(false);

//   useEffect(() => {
//     if (!user) return;

//     // Use fallback data if Firestore fails
//     const fallbackStats = {
//       grammarMistakesFixed: 0,
//       wordsLearned: 0,
//       callsCompleted: 0,
//       totalPracticeTime: 0,
//       currentStreak: 0,
//       conversationsCompleted: 0
//     };

//     setUserStats(user.stats || fallbackStats);
//     setRecentActivities([]);
//     setLoading(false);
    
//     // Note: We're not using real-time listeners to avoid the 400 errors
//     // Once Firestore is configured properly, you can re-enable them

//   }, [user]);

//   const stats = [
//     { 
//       label: 'Grammar Fixed', 
//       value: userStats?.grammarMistakesFixed || 0, 
//       color: 'from-green-400 to-blue-500', 
//       icon: <TrendingUp className="w-6 h-6" />,
//       change: '+12%'
//     },
//     { 
//       label: 'Words Learned', 
//       value: userStats?.wordsLearned || 0, 
//       color: 'from-purple-400 to-pink-500', 
//       icon: <Award className="w-6 h-6" />,
//       change: '+8%'
//     },
//     { 
//       label: 'Calls Completed', 
//       value: userStats?.callsCompleted || 0, 
//       color: 'from-orange-400 to-red-500', 
//       icon: <Phone className="w-6 h-6" />,
//       change: '+15%'
//     },
//     { 
//       label: 'Current Streak', 
//       value: `${userStats?.currentStreak || 0} days`, 
//       color: 'from-blue-400 to-indigo-500', 
//       icon: <Clock className="w-6 h-6" />,
//       change: '+2 days'
//     },
//   ];

//   const quickActions = [
//     { 
//       icon: <MessageCircle className="w-6 h-6" />, 
//       label: 'Start Chat', 
//       description: 'Practice with AI',
//       color: 'from-blue-500 to-blue-600',
//       href: '/dashboard/chat'
//     },
//     { 
//       icon: <Phone className="w-6 h-6" />, 
//       label: 'Audio Call', 
//       description: 'Speak & listen',
//       color: 'from-green-500 to-green-600',
//       href: '/dashboard/audio-call'
//     },
//     { 
//       icon: <Video className="w-6 h-6" />, 
//       label: 'Video Call', 
//       description: 'Face-to-face practice',
//       color: 'from-purple-500 to-purple-600',
//       href: '/dashboard/video-call'
//     },
//     { 
//       icon: <GamepadIcon className="w-6 h-6" />, 
//       label: 'Play Games', 
//       description: 'Learn with fun',
//       color: 'from-orange-500 to-orange-600',
//       href: '/dashboard/games'
//     },
//   ];

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading your dashboard...</p>
//         </div>
//       </div>
//     );
//   }


//   // In your dashboard layout, make sure menu items use router.push
// const menuItems = [
//   { icon: <Home className="w-5 h-5" />, label: 'Dashboard', href: '/dashboard' },
//   { icon: <MessageCircle className="w-5 h-5" />, label: 'AI Chat', href: '/dashboard/chat' },
//   { icon: <Phone className="w-5 h-5" />, label: 'Audio Call', href: '/dashboard/audio-call' },
//   { icon: <Video className="w-5 h-5" />, label: 'Video Call', href: '/dashboard/video-call' },
//   { icon: <GamepadIcon className="w-5 h-5" />, label: 'Games', href: '/dashboard/games' },
//   { icon: <BarChart3 className="w-5 h-5" />, label: 'Progress', href: '/dashboard/progress' },
// ];





//   return (
//     <div className="space-y-6">
//       {firestoreError && (
//         <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-xl mb-6">
//           <p>Firestore connection issues detected. Using local data.</p>
//         </div>
//       )}

//       {/* Welcome Section */}
//       <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//           <div>
//             <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || user?.email?.split('@')[0] || 'Learner'}! 👋</h1>
//             <p className="text-blue-100 text-lg">
//               {user?.learningGoals || 'Ready to continue your English learning journey?'}
//             </p>
//           </div>
//           <div className="mt-4 md:mt-0">
//             <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
//               <p className="text-sm">Daily Goal</p>
//               <div className="flex items-center gap-2 mt-1">
//                 <div className="flex-1 bg-white/30 rounded-full h-2">
//                   <div className="bg-white h-2 rounded-full w-3/4"></div>
//                 </div>
//                 <span className="text-sm font-semibold">75%</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {stats.map((stat, index) => (
//           <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition duration-300">
//             <div className="flex items-center justify-between mb-4">
//               <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-white shadow-md`}>
//                 {stat.icon}
//               </div>
//               <span className="text-green-600 font-semibold text-sm bg-green-50 px-2 py-1 rounded-full">
//                 {stat.change}
//               </span>
//             </div>
//             <p className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</p>
//             <p className="text-gray-600 font-medium">{stat.label}</p>
//           </div>
//         ))}
//       </div>

//       {/* Quick Actions */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         {quickActions.map((action, index) => (
//           <Link
//             key={index}
//             href={action.href}
//             className={`bg-gradient-to-r ${action.color} text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105 block`}
//           >
//             <div className="flex flex-col items-center text-center gap-3">
//               <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
//                 {action.icon}
//               </div>
//               <div>
//                 <span className="font-semibold text-lg block">{action.label}</span>
//                 <span className="text-white/80 text-sm">{action.description}</span>
//               </div>
//             </div>
//           </Link>
//         ))}
//       </div>

//       <div className="grid lg:grid-cols-2 gap-6">
//         {/* Recent Activity */}
//         <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
//           <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
//             <Clock className="w-5 h-5" />
//             Recent Activity
//           </h2>
//           <div className="space-y-4">
//             {recentActivities.length === 0 ? (
//               <div className="text-center text-gray-500 py-8">
//                 <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
//                 <p>No activities yet</p>
//                 <p className="text-sm">Start learning to see your activities here</p>
//               </div>
//             ) : (
//               recentActivities.map((activity) => (
//                 <div key={activity.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
//                   <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
//                     <MessageCircle className="w-5 h-5 text-blue-500" />
//                   </div>
//                   <div className="flex-1">
//                     <p className="font-semibold text-gray-800">{activity.title}</p>
//                     <p className="text-sm text-gray-600">
//                       {new Date().toLocaleDateString()}
//                     </p>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-sm font-medium text-gray-700">
//                       Completed
//                     </p>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>

//         {/* Daily Challenge */}
//         <div className="bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
//           <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
//             <Award className="w-5 h-5" />
//             Daily Challenge
//           </h2>
//           <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
//             <p className="font-semibold mb-2">Complete 3 conversations today</p>
//             <div className="flex items-center gap-2 mb-4">
//               <div className="flex-1 bg-white/30 rounded-full h-2">
//                 <div className="bg-white h-2 rounded-full w-1/3"></div>
//               </div>
//               <span className="text-sm font-semibold">{userStats?.conversationsCompleted || 0}/3</span>
//             </div>
//             <div className="grid grid-cols-3 gap-2 text-center text-sm">
//               <div className={`p-2 rounded-lg ${(userStats?.conversationsCompleted || 0) >= 1 ? 'bg-white/30' : 'bg-white/10'}`}>
//                 Chat
//               </div>
//               <div className={`p-2 rounded-lg ${(userStats?.conversationsCompleted || 0) >= 2 ? 'bg-white/30' : 'bg-white/10'}`}>
//                 Audio
//               </div>
//               <div className={`p-2 rounded-lg ${(userStats?.conversationsCompleted || 0) >= 3 ? 'bg-white/30' : 'bg-white/10'}`}>
//                 Video
//               </div>
//             </div>
//             <Link 
//               href="/dashboard/chat"
//               className="w-full bg-white text-orange-600 py-3 rounded-xl font-semibold hover:bg-gray-100 transition mt-4 block text-center"
//             >
//               Start Challenge
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


'use client';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  MessageCircle, 
  Phone, 
  Video, 
  GamepadIcon, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  Home
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const menuItems = [
    { icon: <Home className="w-5 h-5" />, label: 'Dashboard', href: '/dashboard' },
    { icon: <MessageCircle className="w-5 h-5" />, label: 'AI Chat', href: '/dashboard/chat' },
    { icon: <Phone className="w-5 h-5" />, label: 'Audio Call', href: '/dashboard/audio-call' },
    { icon: <Video className="w-5 h-5" />, label: 'Video Call', href: '/dashboard/video-call' },
    { icon: <GamepadIcon className="w-5 h-5" />, label: 'Games', href: '/dashboard/games' },
    { icon: <BarChart3 className="w-5 h-5" />, label: 'Progress', href: '/dashboard/progress' },
  ];

  const isActive = (href) => pathname === href;

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-indigo-500 to-purple-600 text-white transition-transform duration-300 md:translate-x-0 md:static md:inset-0`}>
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <h1 className="text-xl font-bold">StorySpire</h1>
              </div>
            </div>
            
            {/* ⬇️ PASTE THE MENU ITEMS CODE HERE ⬇️ */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    router.push(item.href);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-white/20 shadow-lg'
                      : 'hover:bg-white/10'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
            {/* ⬆️ END OF MENU ITEMS CODE ⬆️ */}

            <div className="p-4 border-t border-white/20 space-y-2">
              <button 
                onClick={() => router.push('/dashboard/settings')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition"
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </button>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition text-red-200 hover:text-red-100"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col md:ml-0 min-w-0">
          {/* Top Bar */}
          <header className="bg-white shadow-sm border-b z-40">
            <div className="flex items-center justify-between p-4">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="font-semibold text-gray-800">{user?.name || user?.email}</p>
                  <p className="text-sm text-gray-500 capitalize">{user?.subscriptionType || 'free'} user</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                  {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}