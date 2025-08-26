import React, { useState, useRef, useEffect } from 'react'
import { Mic, Square, Play, Pause, Upload, Trash2, RotateCcw } from 'lucide-react'
import { cn } from '../lib/utils'
import LoadingSpinner from './LoadingSpinner'
import { useToast } from '../contexts/ToastContext'

const VoiceRecorder = ({ onRecordingComplete, className, disabled = false }) => {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioBlob, setAudioBlob] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [permissionDenied, setPermissionDenied] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  
  const mediaRecorderRef = useRef(null)
  const audioRef = useRef(null)
  const intervalRef = useRef(null)
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const dataArrayRef = useRef(null)
  const animationFrameRef = useRef(null)
  const streamRef = useRef(null)
  
  const { addToast } = useToast()

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  // Update audio time during playback
  useEffect(() => {
    if (audioRef.current) {
      const updateTime = () => {
        setCurrentTime(Math.floor(audioRef.current.currentTime))
      }
      
      audioRef.current.addEventListener('timeupdate', updateTime)
      
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('timeupdate', updateTime)
        }
      }
    }
  }, [audioRef.current])

  const analyzeAudio = () => {
    if (!analyserRef.current) return
    
    const updateAnalysis = () => {
      analyserRef.current.getByteFrequencyData(dataArrayRef.current)
      
      // Calculate average level
      const average = dataArrayRef.current.reduce((acc, val) => acc + val, 0) / dataArrayRef.current.length
      const normalizedLevel = Math.min(average / 128, 1) // Normalize to 0-1
      
      setAudioLevel(normalizedLevel)
      animationFrameRef.current = requestAnimationFrame(updateAnalysis)
    }
    
    updateAnalysis()
  }

  const startRecording = async () => {
    try {
      // Reset state
      setPermissionDenied(false)
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      
      // Set up audio analysis
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
      analyserRef.current = audioContextRef.current.createAnalyser()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)
      
      analyserRef.current.fftSize = 256
      const bufferLength = analyserRef.current.frequencyBinCount
      dataArrayRef.current = new Uint8Array(bufferLength)
      
      // Start audio analysis
      analyzeAudio()
      
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
        
        // Stop audio analysis
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
        
        // Don't stop the stream yet, as we might want to record again
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsRecording(true)
      setDuration(0)

      // Start duration counter
      intervalRef.current = setInterval(() => {
        setDuration(prev => prev + 1)
      }, 1000)

      addToast('Recording started', 'info')

    } catch (error) {
      console.error('Error accessing microphone:', error)
      setPermissionDenied(true)
      addToast('Could not access microphone. Please check your permissions.', 'error')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      clearInterval(intervalRef.current)
      addToast('Recording stopped', 'info')
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
    setCurrentTime(0)
  }

  const handleUpload = async () => {
    if (audioBlob && onRecordingComplete) {
      setIsProcessing(true)
      try {
        await onRecordingComplete(audioBlob)
        addToast('Voice note processed successfully', 'success')
      } catch (error) {
        addToast('Failed to process voice note. Please try again.', 'error')
      } finally {
        setIsProcessing(false)
      }
    }
  }

  const resetRecording = () => {
    setAudioBlob(null)
    setAudioUrl(null)
    setDuration(0)
    setCurrentTime(0)
    setIsPlaying(false)
    
    // Release the previous stream if it exists
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Generate audio visualization bars
  const generateBars = () => {
    const bars = []
    const numBars = 20
    
    for (let i = 0; i < numBars; i++) {
      // Create a random height for visual effect during recording
      const randomHeight = isRecording 
        ? Math.max(0.3, Math.min(1, audioLevel * (0.6 + Math.random() * 0.7)))
        : 0.15 + Math.random() * 0.2
      
      bars.push(
        <div 
          key={i}
          className={cn(
            "bg-primary-500 rounded-full w-1 transition-all duration-75",
            isRecording ? "animate-pulse-slow" : ""
          )}
          style={{ 
            height: `${randomHeight * 40}px`,
            animationDelay: `${i * 100}ms`
          }}
        />
      )
    }
    
    return bars
  }

  return (
    <div className={cn("card", className, {
      "opacity-50 pointer-events-none": disabled
    })}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center">
            <Mic className="h-5 w-5 text-primary-500 mr-2" />
            Voice Recorder
          </h3>
          
          {audioBlob && (
            <div className="text-sm text-text-secondary">
              Duration: {formatDuration(duration)}
            </div>
          )}
        </div>
        
        {/* Audio Visualization */}
        <div className="h-16 bg-gray-50 rounded-lg flex items-center justify-center p-4">
          {permissionDenied ? (
            <div className="text-error-500 text-sm">
              Microphone access denied. Please check your browser permissions.
            </div>
          ) : isProcessing ? (
            <div className="flex items-center justify-center space-x-3">
              <LoadingSpinner size="sm" />
              <span className="text-text-secondary">Processing voice note...</span>
            </div>
          ) : (
            <div className="flex items-end justify-center space-x-1 h-full w-full">
              {generateBars()}
            </div>
          )}
        </div>
        
        {/* Controls */}
        <div className="space-y-4">
          {!isRecording && !audioBlob && (
            <div className="flex justify-center">
              <button
                onClick={startRecording}
                disabled={permissionDenied || isProcessing}
                className="btn-primary"
                aria-label="Start recording"
              >
                <Mic className="h-5 w-5 mr-2" />
                Start Recording
              </button>
            </div>
          )}

          {isRecording && (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-3 h-3 bg-error-500 rounded-full animate-pulse"></div>
                <span className="text-lg font-mono">{formatDuration(duration)}</span>
              </div>
              
              <div className="flex justify-center">
                <button
                  onClick={stopRecording}
                  className="btn-error"
                  aria-label="Stop recording"
                >
                  <Square className="h-5 w-5 mr-2" />
                  Stop Recording
                </button>
              </div>
            </div>
          )}

          {audioBlob && !isProcessing && (
            <div className="space-y-4">
              <audio
                ref={audioRef}
                src={audioUrl}
                onEnded={handleAudioEnded}
                className="hidden"
              />
              
              {/* Playback progress */}
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-primary-500 h-1.5 rounded-full"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-text-secondary">
                  {formatDuration(currentTime)}
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={isPlaying ? pauseRecording : playRecording}
                    className="btn-icon btn-secondary"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </button>
                  
                  <button
                    onClick={resetRecording}
                    className="btn-icon btn-secondary"
                    aria-label="Record again"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex justify-center pt-2">
                <button
                  onClick={handleUpload}
                  className="btn-primary"
                  aria-label="Process recording"
                >
                  <Upload className="h-5 w-5 mr-2" />
                  Process Recording
                </button>
              </div>
            </div>
          )}
        </div>
        
        {permissionDenied && (
          <div className="text-center">
            <button
              onClick={() => setPermissionDenied(false)}
              className="text-primary-500 hover:text-primary-600 text-sm"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default VoiceRecorder
