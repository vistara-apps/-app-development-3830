import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { CRMProvider } from './contexts/CRMContext'
import { ToastProvider } from './contexts/ToastContext'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Setup from './pages/Setup'
import VoiceNotes from './pages/VoiceNotes'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <CRMProvider>
        <ToastProvider>
          <div className="min-h-screen bg-bg">
            <Navbar />
            <main className="container max-w-6xl mx-auto px-4 py-8">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/setup" element={
                  <ProtectedRoute>
                    <Setup />
                  </ProtectedRoute>
                } />
                <Route path="/voice-notes" element={
                  <ProtectedRoute>
                    <VoiceNotes />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
          </div>
        </ToastProvider>
      </CRMProvider>
    </AuthProvider>
  )
}

export default App
