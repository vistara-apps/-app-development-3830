import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useCRM } from '../contexts/CRMContext'
import { getVoiceNotes, processVoiceNote, deleteVoiceNote } from '../services/voiceNoteService'
import VoiceRecorder from '../components/VoiceRecorder'
import TranscriptionDisplay from '../components/TranscriptionDisplay'
import StatusIndicator from '../components/StatusIndicator'
import { Trash2, Search, Filter } from 'lucide-react'
import { formatDate } from '../lib/utils'

const VoiceNotes = () => {
  const { user } = useAuth()
  const { crmIntegrations } = useCRM()
  const [voiceNotes, setVoiceNotes] = useState([])
  const [loading, setLoading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    if (user) {
      fetchVoiceNotes()
    }
  }, [user])

  const fetchVoiceNotes = async () => {
    setLoading(true)
    try {
      const notes = await getVoiceNotes(user.id)
      setVoiceNotes(notes)
    } catch (error) {
      console.error('Error fetching voice notes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRecordingComplete = async (audioBlob) => {
    setProcessing(true)
    try {
      const activeCRMs = crmIntegrations.filter(crm => crm.is_active)
      const result = await processVoiceNote(audioBlob, user.id, activeCRMs)
      
      // Add the new voice note to the list
      setVoiceNotes(prev => [result.voiceNote, ...prev])
    } catch (error) {
      console.error('Error processing voice note:', error)
      alert('Failed to process voice note. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  const handleDelete = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this voice note?')) {
      try {
        await deleteVoiceNote(noteId)
        setVoiceNotes(prev => prev.filter(note => note.id !== noteId))
      } catch (error) {
        console.error('Error deleting voice note:', error)
        alert('Failed to delete voice note. Please try again.')
      }
    }
  }

  const filteredNotes = voiceNotes.filter(note => {
    const matchesSearch = !searchTerm || 
      note.transcription_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.extracted_entities?.contact?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.extracted_entities?.company?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || note.crm_sync_status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text">Voice Notes</h1>
        <p className="text-gray-600 mt-2">
          Record, transcribe, and sync your sales conversations to your CRM.
        </p>
      </div>

      {/* Voice Recorder */}
      <VoiceRecorder 
        onRecordingComplete={handleRecordingComplete}
        className={processing ? 'opacity-50 pointer-events-none' : ''}
      />

      {/* Processing Status */}
      {processing && (
        <StatusIndicator 
          status="syncing" 
          message="Processing voice note and syncing to CRM..."
        />
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search voice notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
        
        <div className="relative">
          <Filter className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input pl-10 pr-8"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="syncing">Syncing</option>
            <option value="synced">Synced</option>
            <option value="error">Error</option>
          </select>
        </div>
      </div>

      {/* Voice Notes List */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' 
                ? 'No voice notes match your filters.' 
                : 'No voice notes yet. Record your first one above!'
              }
            </p>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <div key={note.id} className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">{formatDate(note.created_at)}</p>
                  <StatusIndicator 
                    status={note.crm_sync_status} 
                    variant="compact"
                  />
                </div>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="p-2 text-red-400 hover:text-red-600 rounded-md hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              
              <TranscriptionDisplay voiceNote={note} />
              
              {note.sync_results && note.sync_results.length > 0 && (
                <div className="card bg-gray-50">
                  <h4 className="font-medium mb-2">Sync Results</h4>
                  <div className="space-y-2">
                    {note.sync_results.map((result, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="font-medium capitalize">{result.crmType}</span>
                        <StatusIndicator 
                          status={result.success ? 'synced' : 'error'}
                          variant="compact"
                          message={result.success ? 'Synced' : result.error}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default VoiceNotes