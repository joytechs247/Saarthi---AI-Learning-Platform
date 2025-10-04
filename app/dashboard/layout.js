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

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { icon: <Home className="w-5 h-5" />, label: 'Dashboard', href: '/dashboard' },
    { icon: <MessageCircle className="w-5 h-5" />, label: 'AI Chat', href: '/dashboard/chat' },
    { icon: <Phone className="w-5 h-5" />, label: 'Audio Call', href: '/dashboard/audio-call' },
    { icon: <Video className="w-5 h-5" />, label: 'Video Call', href: '/dashboard/video-call' },
    { icon: <GamepadIcon className="w-5 h-5" />, label: 'Games', href: '/dashboard/games' },
    { icon: <BarChart3 className="w-5 h-5" />, label: 'Progress', href: '/dashboard/progress' },
  ];

  const isActive = (href) => pathname === href;

  return (
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

          <div className="p-4 border-t border-white/20 space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition text-red-200 hover:text-red-100">
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
                <p className="font-semibold text-gray-800">John Doe</p>
                <p className="text-sm text-gray-500">Premium User</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                JD
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
  );
}