import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Mic, LogOut, Settings, Home, Menu, X, User } from 'lucide-react'
import { cn } from '../lib/utils'

const Navbar = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/voice-notes', label: 'Voice Notes', icon: Mic },
    { path: '/setup', label: 'Setup', icon: Settings },
  ]

  return (
    <nav className="bg-surface shadow-card border-b sticky top-0 z-10">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary-500 text-white p-2 rounded-md">
              <Mic className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-text-primary">VoiceFlow CRM</span>
          </Link>

          {/* Desktop Navigation */}
          {user && (
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center space-x-1 py-1 border-b-2 font-medium transition-colors",
                      isActive(item.path)
                        ? "border-primary-500 text-primary-600"
                        : "border-transparent text-text-secondary hover:text-primary-500 hover:border-primary-300"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}

              <button
                onClick={handleSignOut}
                className="flex items-center space-x-1 text-text-secondary hover:text-primary-500 transition-colors ml-2"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          {user && (
            <button
              className="md:hidden p-2 rounded-md text-text-secondary hover:bg-gray-100"
              onClick={toggleMobileMenu}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {user && (
        <div
          className={cn(
            "fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden transition-opacity duration-300",
            mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={closeMobileMenu}
        >
          <div
            className={cn(
              "fixed right-0 top-0 bottom-0 w-64 bg-surface shadow-modal transition-transform duration-300 transform p-4",
              mobileMenuOpen ? "translate-x-0" : "translate-x-full"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              {/* User Info */}
              <div className="border-b border-gray-200 pb-4 mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary-100 text-primary-500 p-2 rounded-full">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">
                      {user?.user_metadata?.name || 'User'}
                    </p>
                    <p className="text-sm text-text-tertiary">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "flex items-center space-x-3 px-3 py-3 rounded-md transition-colors",
                        isActive(item.path)
                          ? "bg-primary-50 text-primary-600"
                          : "text-text-primary hover:bg-gray-50"
                      )}
                      onClick={closeMobileMenu}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </div>

              {/* Sign Out Button */}
              <button
                onClick={() => {
                  closeMobileMenu()
                  handleSignOut()
                }}
                className="flex items-center space-x-3 px-3 py-3 text-error-600 hover:bg-error-50 rounded-md transition-colors mt-auto"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
