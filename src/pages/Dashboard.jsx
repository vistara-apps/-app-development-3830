import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCRM } from '../contexts/CRMContext'
import { getVoiceNotes } from '../services/voiceNoteService'
import { Mic, Settings, FileText, TrendingUp, Users, Building } from 'lucide-react'
import { formatDate } from '../lib/utils'
import StatusIndicator from '../components/StatusIndicator'

const Dashboard = () => {
  const { user } = useAuth()
  const { crmIntegrations } = useCRM()
  const [voiceNotes, setVoiceNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalNotes: 0,
    syncedNotes: 0,
    connectedCRMs: 0
  })

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      const notes = await getVoiceNotes(user.id)
      setVoiceNotes(notes)
      
      setStats({
        totalNotes: notes.length,
        syncedNotes: notes.filter(note => note.crm_sync_status === 'synced').length,
        connectedCRMs: crmIntegrations.filter(crm => crm.is_active).length
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const recentNotes = voiceNotes.slice(0, 3)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text">
          Welcome back, {user?.user_metadata?.name || 'there'}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your voice notes and CRM data.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/voice-notes"
          className="card hover:shadow-lg transition-shadow cursor-pointer group"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-primary/20 transition-colors">
              <Mic className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Record Voice Note</h3>
              <p className="text-sm text-gray-600">Capture your sales conversations</p>
            </div>
          </div>
        </Link>

        <Link
          to="/setup"
          className="card hover:shadow-lg transition-shadow cursor-pointer group"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-accent/10 p-3 rounded-lg group-hover:bg-accent/20 transition-colors">
              <Settings className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold">CRM Setup</h3>
              <p className="text-sm text-gray-600">Connect and configure your CRMs</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalNotes}</p>
              <p className="text-sm text-gray-600">Total Voice Notes</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.syncedNotes}</p>
              <p className="text-sm text-gray-600">Synced to CRM</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Building className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.connectedCRMs}</p>
              <p className="text-sm text-gray-600">Connected CRMs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Voice Notes */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Recent Voice Notes</h2>
          <Link to="/voice-notes" className="text-primary hover:text-primary/80">
            View all →
          </Link>
        </div>

        {recentNotes.length === 0 ? (
          <div className="card text-center py-12">
            <Mic className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No voice notes yet</h3>
            <p className="text-gray-600 mb-4">
              Start by recording your first sales conversation or call notes.
            </p>
            <Link to="/voice-notes" className="btn-primary">
              Record First Note
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentNotes.map((note) => (
              <div key={note.id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-500">{formatDate(note.created_at)}</p>
                    {note.extracted_entities?.contact && (
                      <div className="flex items-center space-x-2 mt-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium">{note.extracted_entities.contact}</span>
                      </div>
                    )}
                  </div>
                  <StatusIndicator 
                    status={note.crm_sync_status} 
                    variant="compact"
                  />
                </div>
                
                <p className="text-gray-700 text-sm line-clamp-3">
                  {note.transcription_text}
                </p>
                
                {note.extracted_entities && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {note.extracted_entities.company && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {note.extracted_entities.company}
                      </span>
                    )}
                    {note.extracted_entities.dealStage && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        {note.extracted_entities.dealStage}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CRM Status */}
      {crmIntegrations.length === 0 && (
        <div className="card bg-yellow-50 border-yellow-200">
          <div className="flex items-center space-x-4">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Building className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">Connect Your CRM</h3>
              <p className="text-sm text-gray-600">
                Connect your CRM to automatically sync voice note data and streamline your sales process.
              </p>
            </div>
            <Link to="/setup" className="btn-primary">
              Setup CRM
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard