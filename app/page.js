// app/page.js - Fully Responsive Landing Page
'use client';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  MessageCircle,
  Video,
  Phone,
  Award,
  Users,
  Star,
  CheckCircle,
  Play,
  ArrowRight,
  Globe,
  Clock,
  TrendingUp,
  Menu,
  X
} from 'lucide-react';

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const features = [
    {
      icon: <Video className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "AI Video Calls",
      description: "Face-to-face practice with realistic AI tutors in various scenarios",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Real-time Chat",
      description: "Instant conversations with AI that adapts to your skill level",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Phone className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Audio Practice",
      description: "Improve pronunciation and listening skills with voice exercises",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Award className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Progress Tracking",
      description: "Detailed analytics and milestones to track your improvement",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <Users className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Cultural Context",
      description: "Learn English with cultural insights and real-world contexts",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Personalized Learning",
      description: "AI-powered curriculum that adapts to your goals and pace",
      color: "from-teal-500 to-blue-500"
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Learners" },
    { number: "50K+", label: "Conversations Daily" },
    { number: "95%", label: "Success Rate" },
    { number: "24/7", label: "AI Tutor Available" }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Software Engineer",
      content: "Saarthi helped me gain confidence for international client meetings. The video call feature is amazing!",
      avatar: "PS",
      rating: 5
    },
    {
      name: "Rahul Kumar",
      role: "Student",
      content: "From hesitant speaker to fluent conversationalist in just 3 months. Best investment in my career!",
      avatar: "RK",
      rating: 5
    },
    {
      name: "Anita Patel",
      role: "Business Owner",
      content: "The cultural context lessons made all the difference. I finally understand business English nuances.",
      avatar: "AP",
      rating: 5
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-200 text-sm sm:text-base">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="bg-white/5 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm sm:text-lg">S</span>
              </div>
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Saarthi
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-4">
              <Link href="/auth/login" className="text-blue-200 hover:text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-white/10">
                Login
              </Link>
              <Link href="/auth/signup" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 sm:px-6 py-2 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-blue-500/25">
                Start Free
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-blue-200 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-b border-white/10 py-4">
              <div className="flex flex-col space-y-4 px-4">
                <Link
                  href="/auth/login"
                  className="text-blue-200 hover:text-white py-2 text-center rounded-lg transition-all hover:bg-white/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 text-center rounded-lg font-medium transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Start Free
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 lg:pt-20 pb-16 sm:pb-24 lg:pb-32 text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Speak English
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mt-2">
                Confidently
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-blue-200 mb-6 sm:mb-8 max-w-3xl mx-auto px-4 leading-relaxed">
              Master real-world English conversations with AI-powered tutors.
              Practice anytime, get instant feedback, and build unshakeable confidence.
            </p>
            <Link
              href="/auth/signup"
              className="w-fit group bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl text-base font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2 mx-auto relative z-10 pointer-events-auto mb-8"
            >
              Start Your Journey Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-4 max-w-2xl sm:max-w-4xl mx-auto px-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-3 sm:p-4 bg-white/5 rounded-lg sm:rounded-xl backdrop-blur-sm">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">{stat.number}</div>
                <div className="text-blue-300 text-xs sm:text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
              Why Choose <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Saarthi</span>?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-blue-200 max-w-2xl mx-auto px-4">
              Experience the future of language learning with cutting-edge AI technology
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:from-white/15 hover:to-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${feature.color} rounded-lg sm:rounded-xl flex items-center justify-center text-white mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-blue-200 text-sm sm:text-base leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
              Start Speaking in <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">3 Steps</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {[
              { step: "01", title: "Sign Up & Set Goals", desc: "Create your profile and define your learning objectives" },
              { step: "02", title: "Choose Practice Mode", desc: "Select from video calls, audio practice, or text chat" },
              { step: "03", title: "Practice & Improve", desc: "Get real-time feedback and track your progress" }
            ].map((item, index) => (
              <div key={index} className="text-center group p-4 sm:p-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold mb-4 sm:mb-6 mx-auto group-hover:scale-110 transition-transform shadow-2xl">
                  {item.step}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">{item.title}</h3>
                <p className="text-blue-200 text-sm sm:text-base">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
              Loved by <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Thousands</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-blue-200 px-4">Join our community of successful English speakers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm sm:text-base">{testimonial.name}</h4>
                    <p className="text-blue-300 text-xs sm:text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-blue-200 text-sm sm:text-base mb-3 sm:mb-4 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-lg border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Ready to Transform Your <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">English</span>?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-blue-200 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Join thousands of learners who've achieved fluency with Saarthi. Start your 7-day free trial today!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Link
                href="/auth/signup"
                className="w-full sm:w-auto group bg-gradient-to-r from-green-500 to-cyan-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-base sm:text-lg font-semibold hover:from-green-600 hover:to-cyan-600 transition-all duration-300 shadow-2xl hover:shadow-green-500/25 flex items-center justify-center gap-2"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/auth/login"
                className="w-full sm:w-auto border border-green-400 text-green-300 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-base sm:text-lg font-semibold hover:bg-green-400/10 transition-all"
              >
                I have an account
              </Link>
            </div>
            <p className="text-blue-300 text-xs sm:text-sm mt-3 sm:mt-4">No credit card required • Cancel anytime</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4 md:mb-0">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs sm:text-sm">S</span>
              </div>
              <span className="text-base sm:text-lg font-bold text-white">Saarthi</span>
            </div>
            <div className="text-blue-300 text-xs sm:text-sm text-center md:text-right">
              © 2024 Saarthi. Empowering global communication.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}