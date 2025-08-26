import React, { useState, useRef } from 'react'
import { Mic, Square, Play, Pause, Upload } from 'lucide-react'
import { cn } from '../lib/utils'

const VoiceRecorder = ({ onRecordingComplete, className }) => {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioBlob, setAudioBlob] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)
  const [duration, setDuration] = useState(0)
  
  const mediaRecorderRef = useRef(null)
  const audioRef = useRef(null)
  const intervalRef = useRef(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      const chunks = []

      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' })
        const url = URL.createObjectURL(blob)
        setAudioBlob(blob)
        setAudioUrl(url)
        
        // Stop all tracks to release the microphone
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsRecording(true)
      setDuration(0)

      // Start duration counter
      intervalRef.current = setInterval(() => {
        setDuration(prev => prev + 1)
      }, 1000)

    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Could not access microphone. Please check your permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      clearInterval(intervalRef.current)
    }
  }

  const playRecording = () => {
    if (audioRef.current) {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const pauseRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const handleAudioEnded = () => {
    setIsPlaying(false)
  }

  const handleUpload = () => {
    if (audioBlob && onRecordingComplete) {
      onRecordingComplete(audioBlob)
    }
  }

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className={cn("card", className)}>
      <div className="text-center space-y-4">
        <h3 className="text-lg font-semibold">Voice Recorder</h3>
        
        {!isRecording && !audioBlob && (
          <button
            onClick={startRecording}
            className="btn-primary flex items-center space-x-2 mx-auto"
          >
            <Mic className="h-5 w-5" />
            <span>Start Recording</span>
          </button>
        )}

        {isRecording && (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-lg font-mono">{formatDuration(duration)}</span>
            </div>
            <button
              onClick={stopRecording}
              className="btn-secondary flex items-center space-x-2 mx-auto"
            >
              <Square className="h-5 w-5" />
              <span>Stop Recording</span>
            </button>
          </div>
        )}

        {audioBlob && (
          <div className="space-y-4">
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={handleAudioEnded}
              className="hidden"
            />
            
            <div className="flex justify-center items-center space-x-4">
              <button
                onClick={isPlaying ? pauseRecording : playRecording}
                className="btn-secondary flex items-center space-x-2"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>
              
              <span className="text-sm text-gray-600">
                Duration: {formatDuration(duration)}
              </span>
            </div>

            <button
              onClick={handleUpload}
              className="btn-primary flex items-center space-x-2 mx-auto"
            >
              <Upload className="h-5 w-5" />
              <span>Process Recording</span>
            </button>

            <button
              onClick={() => {
                setAudioBlob(null)
                setAudioUrl(null)
                setDuration(0)
                setIsPlaying(false)
              }}
              className="btn-secondary mx-auto block"
            >
              Record Again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default VoiceRecorder