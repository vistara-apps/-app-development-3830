import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCRM } from '../contexts/CRMContext'
import { useToast } from '../contexts/ToastContext'
import { getVoiceNotes } from '../services/voiceNoteService'
import { Mic, Settings, FileText, TrendingUp, Users, Building, ChevronRight, BarChart3, Clock } from 'lucide-react'
import { formatDate, cn } from '../lib/utils'
import StatusIndicator from '../components/StatusIndicator'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import TranscriptionDisplay from '../components/TranscriptionDisplay'

const Dashboard = () => {
  const { user } = useAuth()
  const { crmIntegrations } = useCRM()
  const { addToast } = useToast()
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
      addToast('Failed to load dashboard data. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const recentNotes = voiceNotes.slice(0, 3)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" label="Loading dashboard..." />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg p-6 border border-primary-100">
        <h1 className="text-3xl font-bold text-text-primary">
          Welcome back, {user?.user_metadata?.name || 'there'}!
        </h1>
        <p className="text-text-secondary mt-2 max-w-2xl">
          Here's what's happening with your voice notes and CRM data. Record new voice notes, view insights, and manage your CRM integrations.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/voice-notes"
          className="card card-hover group"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-primary-50 p-3 rounded-lg group-hover:bg-primary-100 transition-colors">
              <Mic className="h-6 w-6 text-primary-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Record Voice Note</h3>
              <p className="text-sm text-text-secondary">Capture your sales conversations</p>
            </div>
            <ChevronRight className="h-5 w-5 text-text-tertiary group-hover:text-primary-500 transition-colors" />
          </div>
        </Link>

        <Link
          to="/setup"
          className="card card-hover group"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-accent-50 p-3 rounded-lg group-hover:bg-accent-100 transition-colors">
              <Settings className="h-6 w-6 text-accent-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">CRM Setup</h3>
              <p className="text-sm text-text-secondary">Connect and configure your CRMs</p>
            </div>
            <ChevronRight className="h-5 w-5 text-text-tertiary group-hover:text-accent-500 transition-colors" />
          </div>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card hover:shadow-card-hover transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="bg-primary-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{stats.totalNotes}</p>
              <p className="text-sm text-text-secondary">Total Voice Notes</p>
            </div>
          </div>
        </div>

        <div className="card hover:shadow-card-hover transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="bg-success-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-success-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{stats.syncedNotes}</p>
              <p className="text-sm text-text-secondary">Synced to CRM</p>
            </div>
          </div>
        </div>

        <div className="card hover:shadow-card-hover transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="bg-accent-100 p-3 rounded-lg">
              <Building className="h-6 w-6 text-accent-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{stats.connectedCRMs}</p>
              <p className="text-sm text-text-secondary">Connected CRMs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Voice Notes */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold flex items-center">
            <BarChart3 className="h-5 w-5 text-primary-500 mr-2" />
            Recent Voice Notes
          </h2>
          <Link 
            to="/voice-notes" 
            className="text-primary-500 hover:text-primary-600 flex items-center"
          >
            View all <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        {recentNotes.length === 0 ? (
          <EmptyState
            variant="card"
            icon={Mic}
            title="No voice notes yet"
            description="Start by recording your first sales conversation or call notes."
            action={
              <Link to="/voice-notes" className="btn-primary">
                Record First Note
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            {recentNotes.map((note) => (
              <div key={note.id} className="card hover:shadow-card-hover transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-text-tertiary flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatDate(note.created_at)}
                    </p>
                    {note.extracted_entities?.contact && (
                      <div className="flex items-center mt-1">
                        <Users className="h-4 w-4 text-primary-400 mr-1" />
                        <span className="text-sm font-medium text-primary-600">
                          {note.extracted_entities.contact}
                        </span>
                      </div>
                    )}
                  </div>
                  <StatusIndicator 
                    status={note.crm_sync_status} 
                    variant="badge"
                  />
                </div>
                
                <p className="text-text-primary text-sm line-clamp-3 mb-3">
                  {note.transcription_text}
                </p>
                
                {note.extracted_entities && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {note.extracted_entities.company && (
                      <span className="badge badge-accent">
                        <Building className="h-3 w-3 mr-1" />
                        {note.extracted_entities.company}
                      </span>
                    )}
                    {note.extracted_entities.dealStage && (
                      <span className="badge badge-success">
                        <BarChart3 className="h-3 w-3 mr-1" />
                        {note.extracted_entities.dealStage}
                      </span>
                    )}
                  </div>
                )}
                
                <div className="mt-4 pt-3 border-t border-gray-100 text-right">
                  <Link 
                    to={`/voice-notes?id=${note.id}`}
                    className="text-sm text-primary-500 hover:text-primary-600 font-medium"
                  >
                    View details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CRM Status */}
      {crmIntegrations.length === 0 && (
        <div className="card bg-warning-50 border border-warning-200">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="bg-warning-100 p-3 rounded-full">
              <Building className="h-6 w-6 text-warning-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-warning-800">Connect Your CRM</h3>
              <p className="text-sm text-warning-700 mt-1">
                Connect your CRM to automatically sync voice note data and streamline your sales process.
              </p>
            </div>
            <Link to="/setup" className="btn-primary whitespace-nowrap">
              Setup CRM
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
