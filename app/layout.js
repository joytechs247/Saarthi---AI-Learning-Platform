// app/layout.js
import { AuthProvider } from '../hooks/useAuth';
import './globals.css'

export const metadata = {
  title: 'Saarthi - Learn English the Fun Way',
  description: 'Chat, Call, Play & Speak confidently with AI',
    icons: {
    icon: '/favicon.ico', // Main favicon
    
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}