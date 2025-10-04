import Link from 'next/link';
import { MessageCircle, Phone, Video, GamepadIcon, Star, Users, Award, Clock } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "AI Chat",
      description: "Practice conversations with AI and get instant grammar corrections"
    },
    {
      icon: <Phone className="w-8 h-8" />,
      title: "Audio Calls",
      description: "Speak in your native language, get English responses with audio"
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: "Video Calls",
      description: "Face-to-face practice with AI avatar and live subtitles"
    },
    {
      icon: <GamepadIcon className="w-8 h-8" />,
      title: "Playful Learning",
      description: "Games and challenges to make learning fun"
    }
  ];

  const testimonials = [
    { 
      name: "Sarah M.", 
      text: "Improved my English in just 2 months! The AI conversations feel so natural.",
      rating: 5
    },
    { 
      name: "Raj K.", 
      text: "From hesitant speaker to confident communicator. Best investment ever!",
      rating: 5
    },
    { 
      name: "Maria L.", 
      text: "The games make learning addictive. I actually look forward to practicing!",
      rating: 5
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Learners" },
    { number: "50K+", label: "Conversations Daily" },
    { number: "95%", label: "Success Rate" },
    { number: "24/7", label: "AI Available" }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                StorySpire
              </span>
            </div>
            <div className="hidden md:flex gap-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition">Features</a>
              <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition">Testimonials</a>
              <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition">Pricing</a>
            </div>
            <div className="flex gap-4">
              <Link href="/auth/login" className="text-gray-700 hover:text-blue-600 transition">
                Login
              </Link>
              <Link href="/auth/signup" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-500 to-purple-600 text-white pt-32 pb-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Learn English the Fun Way with <span className="text-yellow-300">StorySpire</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            Chat, Call, Play & Speak confidently with AI
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link href="/auth/signup" className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition shadow-lg text-lg">
              Start Learning Free
            </Link>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition text-lg">
              Watch Demo
            </button>
          </div>
          <div className="max-w-4xl mx-auto bg-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-sm">
            <div className="bg-white/20 h-64 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-10 h-10 text-white" />
                </div>
                <p className="text-white/80">AI-Powered English Learning Platform</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="p-6">
                <p className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{stat.number}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">Amazing Features</h2>
          <p className="text-xl text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Everything you need to become confident in English
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100">
                <div className="text-blue-600 mb-4 bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">What Our Users Say</h2>
          <p className="text-xl text-center text-gray-600 mb-12">Join thousands of successful English learners</p>
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl shadow-lg border border-gray-200">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                  <p className="font-semibold text-gray-800">{testimonial.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">Choose Your Plan</h2>
          <p className="text-xl text-center text-gray-600 mb-12">Start free, upgrade when you're ready</p>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-gray-200 hover:border-blue-300 transition">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Free</h3>
              <p className="text-4xl font-bold mb-6 text-blue-600">$0<span className="text-lg text-gray-600">/month</span></p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-600">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  Basic AI Chat (10/day)
                </li>
                <li className="flex items-center text-gray-600">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  5 Audio calls/month
                </li>
                <li className="flex items-center text-gray-600">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  Basic Games
                </li>
                <li className="flex items-center text-gray-400">
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-gray-400 text-sm">✗</span>
                  </div>
                  Video Calls
                </li>
                <li className="flex items-center text-gray-400">
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-gray-400 text-sm">✗</span>
                  </div>
                  Advanced Analytics
                </li>
              </ul>
              <Link href="/auth/signup" className="w-full bg-gray-600 text-white py-4 rounded-xl font-semibold hover:bg-gray-700 transition block text-center">
                Get Started Free
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 rounded-2xl shadow-2xl text-white relative transform hover:scale-105 transition duration-300">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-yellow-500 text-gray-800 px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  MOST POPULAR
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Premium</h3>
              <p className="text-4xl font-bold mb-6">$9.99<span className="text-lg opacity-90">/month</span></p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  Unlimited AI Chat
                </li>
                <li className="flex items-center">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  Unlimited Audio/Video Calls
                </li>
                <li className="flex items-center">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  All Games & Challenges
                </li>
                <li className="flex items-center">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  Progress Analytics
                </li>
                <li className="flex items-center">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  Priority Support
                </li>
              </ul>
              <Link href="/auth/signup" className="w-full bg-white text-blue-600 py-4 rounded-xl font-semibold hover:bg-gray-100 transition block text-center">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>
                <span className="text-xl font-bold">StorySpire</span>
              </div>
              <p className="text-gray-400">Learn English the Fun Way with AI-powered conversations and games.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-2 text-gray-400">
                <a href="#" className="block hover:text-white transition">Features</a>
                <a href="#" className="block hover:text-white transition">Pricing</a>
                <a href="#" className="block hover:text-white transition">Testimonials</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-gray-400">
                <a href="#" className="block hover:text-white transition">About</a>
                <a href="#" className="block hover:text-white transition">Contact</a>
                <a href="#" className="block hover:text-white transition">Privacy</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition cursor-pointer">
                  <span className="text-sm">FB</span>
                </div>
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition cursor-pointer">
                  <span className="text-sm">TW</span>
                </div>
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition cursor-pointer">
                  <span className="text-sm">IG</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 StorySpire. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}