import './globals.css'

export const metadata = {
  title: 'StorySpire - Learn English the Fun Way',
  description: 'Chat, Call, Play & Speak confidently with AI',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
        {children}
      </body>
    </html>
  )
}