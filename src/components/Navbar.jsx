import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Mic, LogOut, Settings, Home } from 'lucide-react'

const Navbar = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <nav className="bg-surface shadow-card border-b">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Mic className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-text">VoiceFlow CRM</span>
          </Link>

          {user && (
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="flex items-center space-x-1 text-text hover:text-primary transition-colors"
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              
              <Link
                to="/voice-notes"
                className="flex items-center space-x-1 text-text hover:text-primary transition-colors"
              >
                <Mic className="h-4 w-4" />
                <span>Voice Notes</span>
              </Link>

              <Link
                to="/setup"
                className="flex items-center space-x-1 text-text hover:text-primary transition-colors"
              >
                <Settings className="h-4 w-4" />
                <span>Setup</span>
              </Link>

              <button
                onClick={handleSignOut}
                className="flex items-center space-x-1 text-text hover:text-primary transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar