"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Volume2, VolumeX, Phone, PhoneOff, Wifi, WifiOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface WebSocketAudioProps {
  wsUrl?: string
}

export function WebSocketAudio({ wsUrl = "ws://localhost:8000/ws" }: WebSocketAudioProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected')
  const [audioInitialized, setAudioInitialized] = useState(false)
  
  const wsRef = useRef<WebSocket | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const audioQueueRef = useRef<AudioBuffer[]>([])
  const isPlayingRef = useRef(false)
  const streamRef = useRef<MediaStream | null>(null)
  
  const { toast } = useToast()

  // Initialize WebSocket connection
  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return
    }

    setConnectionStatus('connecting')
    
    try {
      wsRef.current = new WebSocket(wsUrl)
      
      wsRef.current.onopen = () => {
        console.log('✅ WebSocket connected')
        setIsConnected(true)
        setConnectionStatus('connected')
        toast({
          title: "Connected",
          description: "WebSocket connection established successfully.",
        })
      }
      
      wsRef.current.onmessage = (event) => {
        handleWebSocketMessage(event.data)
      }
      
      wsRef.current.onclose = (event) => {
        console.log('❌ WebSocket disconnected:', event.code, event.reason)
        setIsConnected(false)
        setConnectionStatus('disconnected')
        stopRecording()
        stopPlaying()
        
        if (event.code !== 1000) { // Not a normal closure
          toast({
            title: "Connection Lost",
            description: "WebSocket connection was lost.",
            variant: "destructive",
          })
        }
      }
      
      wsRef.current.onerror = (error) => {
        console.error('❌ WebSocket error:', error)
        setConnectionStatus('error')
        toast({
          title: "Connection Error",
          description: "Failed to connect to WebSocket server.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('❌ Failed to create WebSocket:', error)
      setConnectionStatus('error')
      toast({
        title: "Connection Failed",
        description: "Could not establish WebSocket connection.",
        variant: "destructive",
      })
    }
  }, [wsUrl, toast])

  // Handle incoming WebSocket messages
  const handleWebSocketMessage = useCallback(async (data: any) => {
    try {
      const message = JSON.parse(data)
      
      if (message.event === 'audio') {
        // Handle incoming audio data
        await playAudioResponse(message.audio)
      } else if (message.event === 'status') {
        console.log('📊 Status update:', message.status)
      } else if (message.event === 'error') {
        console.error('❌ Server error:', message.error)
        toast({
          title: "Server Error",
          description: message.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('❌ Failed to parse WebSocket message:', error)
    }
  }, [toast])

  // Initialize audio context and microphone
  const initializeAudio = useCallback(async () => {
    try {
      console.log('🎤 Initializing microphone...')
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia is not supported in this browser')
      }
      
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000,
          channelCount: 1
        } 
      })
      
      console.log('✅ Microphone access granted')
      streamRef.current = stream
      
      // Create audio context for playback
      audioContextRef.current = new AudioContext()
      
      // Check available MIME types
      const mimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4;codecs=mp4a.40.2',
        'audio/mp4',
        'audio/wav',
        'audio/ogg;codecs=opus',
        'audio/ogg'
      ]
      
      let selectedMimeType = null
      console.log('🔍 Checking MIME type support...')
      
      for (const mimeType of mimeTypes) {
        console.log(`🔍 Testing: ${mimeType}`)
        if (MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType
          console.log(`✅ Supported: ${mimeType}`)
          break
        } else {
          console.log(`❌ Not supported: ${mimeType}`)
        }
      }
      
      if (!selectedMimeType) {
        console.log('⚠️ No MIME types supported, trying without MIME type...')
        // Try creating MediaRecorder without specifying MIME type
        mediaRecorderRef.current = new MediaRecorder(stream)
        console.log('✅ MediaRecorder created without MIME type')
      } else {
        console.log(`✅ Using MIME type: ${selectedMimeType}`)
        mediaRecorderRef.current = new MediaRecorder(stream, {
          mimeType: selectedMimeType
        })
      }
      
      console.log('✅ MediaRecorder created successfully')
      
      // Handle recorded audio chunks
      mediaRecorderRef.current.ondataavailable = (event) => {
        console.log('📦 Audio chunk received:', event.data.size, 'bytes')
        if (event.data.size > 0 && wsRef.current?.readyState === WebSocket.OPEN) {
          // Convert blob to base64 and send in Twilio format
          const reader = new FileReader()
          reader.onload = () => {
            const base64Audio = reader.result as string
            const audioData = base64Audio.split(',')[1] // Remove data URL prefix
            
            console.log('📤 Sending audio chunk to WebSocket...')
            
            // Send audio data in Twilio format
            wsRef.current?.send(JSON.stringify({
              event: 'media',
              media: {
                track: 'inbound',
                chunk: Date.now(),
                timestamp: Date.now(),
                payload: audioData
              }
            }))
          }
          reader.readAsDataURL(event.data)
        }
      }
      
      mediaRecorderRef.current.onstart = () => {
        console.log('🎤 MediaRecorder started')
      }
      
      mediaRecorderRef.current.onstop = () => {
        console.log('🎤 MediaRecorder stopped')
      }
      
      mediaRecorderRef.current.onerror = (event) => {
        console.error('❌ MediaRecorder error:', event)
      }
      
      setAudioInitialized(true)
      console.log('✅ Audio initialized successfully')
      return true
    } catch (error) {
      console.error('❌ Failed to initialize audio:', error)
      setAudioInitialized(false)
      
      let errorMessage = "Failed to access microphone. Please check permissions."
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage = "Microphone permission denied. Please allow microphone access and try again."
        } else if (error.name === 'NotFoundError') {
          errorMessage = "No microphone found. Please connect a microphone and try again."
        } else if (error.name === 'NotSupportedError') {
          errorMessage = "Microphone not supported in this browser. Please try a different browser."
        } else if (error.message.includes('No supported audio format')) {
          errorMessage = "Audio format not supported. Please try a different browser."
        } else {
          errorMessage = `Microphone error: ${error.message}`
        }
      }
      
      toast({
        title: "Audio Error",
        description: errorMessage,
        variant: "destructive",
      })
      return false
    }
  }, [toast])

  // Manual microphone permission request
  const requestMicrophonePermission = useCallback(async () => {
    try {
      console.log('🎤 Manually requesting microphone permission...')
      toast({
        title: "Requesting Permission",
        description: "Please allow microphone access when prompted.",
      })
      
      // First, try to directly request permission without any constraints
      console.log('🎤 Attempting direct microphone access...')
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      console.log('✅ Direct microphone access granted')
      
      // Stop the test stream immediately
      stream.getTracks().forEach(track => track.stop())
      
      // Now initialize properly
      const success = await initializeAudio()
      if (success) {
        toast({
          title: "Permission Granted",
          description: "Microphone is now ready to use.",
        })
      }
    } catch (error) {
      console.error('❌ Manual permission request failed:', error)
      
      let errorMessage = "Failed to get microphone permission."
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage = "Permission denied. Please click 'Allow' when the browser asks for microphone access."
        } else if (error.name === 'NotFoundError') {
          errorMessage = "No microphone detected. Please connect a microphone and try again."
        } else if (error.name === 'NotSupportedError') {
          errorMessage = "Microphone not supported in this browser. Please try Chrome, Firefox, or Edge."
        } else {
          errorMessage = `Error: ${error.message}`
        }
      }
      
      toast({
        title: "Permission Error",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }, [initializeAudio, toast])

  // Start recording from microphone
  const startRecording = useCallback(async () => {
    console.log('🎤 Attempting to start recording...')
    
    if (!isConnected) {
      toast({
        title: "Not Connected",
        description: "Please connect to WebSocket first.",
        variant: "destructive",
      })
      return
    }
    
    // Initialize audio if not already done
    if (!audioInitialized) {
      console.log('🎤 Audio not initialized, initializing now...')
      const success = await initializeAudio()
      if (!success) {
        return
      }
    }
    
    if (!mediaRecorderRef.current) {
      console.error('❌ MediaRecorder not available')
      toast({
        title: "Recording Error",
        description: "Microphone not available. Please refresh and try again.",
        variant: "destructive",
      })
      return
    }
    
    try {
      console.log('🎤 Current MediaRecorder state:', mediaRecorderRef.current.state)
      
      // If already recording, stop first and wait for state change
      if (mediaRecorderRef.current.state === 'recording') {
        console.log('🎤 MediaRecorder already recording, stopping first...')
        mediaRecorderRef.current.stop()
        
        // Wait for the state to change to 'inactive'
        await new Promise<void>((resolve) => {
          const checkState = () => {
            if (mediaRecorderRef.current?.state === 'inactive') {
              console.log('✅ MediaRecorder stopped successfully')
              resolve()
            } else {
              console.log('⏳ Waiting for MediaRecorder to stop...')
              setTimeout(checkState, 50)
            }
          }
          checkState()
        })
      }
      
      // Double-check state before starting
      if (mediaRecorderRef.current.state !== 'inactive') {
        throw new Error(`MediaRecorder is in invalid state: ${mediaRecorderRef.current.state}`)
      }
      
      console.log('🎤 Starting MediaRecorder...')
      console.log('🎤 MediaRecorder MIME type:', mediaRecorderRef.current.mimeType)
      
      // Try different timeslice values if the default fails
      const timesliceOptions = [100, 250, 500, 1000]
      let started = false
      
      for (const timeslice of timesliceOptions) {
        try {
          console.log(`🎤 Trying to start with timeslice: ${timeslice}ms`)
          mediaRecorderRef.current.start(timeslice)
          started = true
          console.log(`✅ Started recording with timeslice: ${timeslice}ms`)
          break
        } catch (error) {
          console.log(`❌ Failed with timeslice ${timeslice}ms:`, error)
          if (timeslice === timesliceOptions[timesliceOptions.length - 1]) {
            throw error // Re-throw if all options failed
          }
        }
      }
      
      if (started) {
        setIsRecording(true)
        console.log('🎤 Started recording')
        
        toast({
          title: "Recording Started",
          description: "Microphone is now active.",
        })
      }
    } catch (error) {
      console.error('❌ Failed to start recording:', error)
      
      let errorMessage = "Failed to start microphone recording."
      
      if (error instanceof Error) {
        if (error.name === 'NotSupportedError') {
          errorMessage = "Recording format not supported in this browser. Please try Chrome, Firefox, or Edge."
        } else if (error.name === 'InvalidStateError') {
          errorMessage = "Recording state error. Please try again."
        } else {
          errorMessage = `Recording error: ${error.message}`
        }
      }
      
      toast({
        title: "Recording Error",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }, [isConnected, audioInitialized, initializeAudio, toast])

  // Stop recording from microphone
  const stopRecording = useCallback(() => {
    console.log('🎤 Stopping recording...')
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stop()
        setIsRecording(false)
        console.log('🎤 Recording stopped')
        
        toast({
          title: "Recording Stopped",
          description: "Microphone is now inactive.",
        })
      } catch (error) {
        console.error('❌ Error stopping recording:', error)
      }
    } else {
      setIsRecording(false)
      console.log('🎤 Recording already stopped')
    }
  }, [toast])

  // Play audio response through speaker
  const playAudioResponse = useCallback(async (audioData: string) => {
    if (!audioContextRef.current) {
      return
    }
    
    try {
      // Convert base64 to array buffer
      const binaryString = atob(audioData)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      
      // Decode audio data
      const audioBuffer = await audioContextRef.current.decodeAudioData(bytes.buffer)
      
      // Add to queue
      audioQueueRef.current.push(audioBuffer)
      
      // Start playing if not already playing
      if (!isPlayingRef.current) {
        playNextAudio()
      }
    } catch (error) {
      console.error('❌ Failed to play audio:', error)
    }
  }, [])

  // Play next audio in queue
  const playNextAudio = useCallback(async () => {
    if (audioQueueRef.current.length === 0 || isPlayingRef.current) {
      return
    }
    
    isPlayingRef.current = true
    setIsPlaying(true)
    
    const audioBuffer = audioQueueRef.current.shift()
    if (!audioBuffer || !audioContextRef.current) {
      isPlayingRef.current = false
      setIsPlaying(false)
      return
    }
    
    try {
      const source = audioContextRef.current.createBufferSource()
      source.buffer = audioBuffer
      source.connect(audioContextRef.current.destination)
      
      source.onended = () => {
        isPlayingRef.current = false
        setIsPlaying(false)
        // Play next audio if available
        if (audioQueueRef.current.length > 0) {
          playNextAudio()
        }
      }
      
      source.start(0)
      console.log('🔊 Playing audio response')
    } catch (error) {
      console.error('❌ Failed to play audio:', error)
      isPlayingRef.current = false
      setIsPlaying(false)
    }
  }, [])

  // Stop playing audio
  const stopPlaying = useCallback(() => {
    audioQueueRef.current = []
    isPlayingRef.current = false
    setIsPlaying(false)
    console.log('🔊 Stopped playing audio')
  }, [])

  // Toggle recording
  const toggleRecording = useCallback(async () => {
    if (isRecording) {
      stopRecording()
    } else {
      await startRecording()
    }
  }, [isRecording, startRecording, stopRecording])

  // Disconnect WebSocket
  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close(1000, 'User disconnected')
    }
    stopRecording()
    stopPlaying()
    setIsConnected(false)
    setConnectionStatus('disconnected')
  }, [stopRecording, stopPlaying])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('🧹 Cleaning up WebSocket Audio component...')
      
      // Stop recording if active
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        try {
          mediaRecorderRef.current.stop()
        } catch (error) {
          console.error('❌ Error stopping MediaRecorder during cleanup:', error)
        }
      }
      
      // Stop all media tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          try {
            track.stop()
          } catch (error) {
            console.error('❌ Error stopping media track during cleanup:', error)
          }
        })
      }
      
      // Close AudioContext if it exists and is not already closed
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        try {
          audioContextRef.current.close()
        } catch (error) {
          console.error('❌ Error closing AudioContext during cleanup:', error)
        }
      }
      
      // Close WebSocket if connected
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        try {
          wsRef.current.close()
        } catch (error) {
          console.error('❌ Error closing WebSocket during cleanup:', error)
        }
      }
      
      console.log('✅ Cleanup completed')
    }
  }, [])

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-green-500'
      case 'connecting': return 'bg-yellow-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Connected'
      case 'connecting': return 'Connecting...'
      case 'error': return 'Error'
      default: return 'Disconnected'
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5" />
          WebSocket Audio
        </CardTitle>
        <CardDescription>
          Real-time audio communication with backend WebSocket
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Connection Status:</span>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
            <span className="text-sm">{getStatusText()}</span>
          </div>
        </div>
        
        {/* WebSocket URL */}
        <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
          <strong>WebSocket URL:</strong> {wsUrl}
        </div>
        
        {/* Control Buttons */}
        <div className="flex flex-col gap-2">
          {/* Connection Button */}
          <Button
            onClick={isConnected ? disconnect : connectWebSocket}
            variant={isConnected ? "destructive" : "default"}
            className="w-full"
            disabled={connectionStatus === 'connecting'}
          >
            {isConnected ? (
              <>
                <WifiOff className="mr-2 h-4 w-4" />
                Disconnect
              </>
            ) : (
              <>
                <Wifi className="mr-2 h-4 w-4" />
                Connect
              </>
            )}
          </Button>
          
          {/* Microphone Permission Button */}
          {!audioInitialized && (
            <Button
              onClick={requestMicrophonePermission}
              variant="outline"
              className="w-full"
            >
              <Mic className="mr-2 h-4 w-4" />
              Grant Microphone Permission
            </Button>
          )}
          
          {/* Recording Button */}
          <Button
            onClick={toggleRecording}
            variant={isRecording ? "destructive" : "outline"}
            className="w-full"
            disabled={!isConnected || !audioInitialized}
          >
            {isRecording ? (
              <>
                <MicOff className="mr-2 h-4 w-4" />
                Stop Recording
              </>
            ) : (
              <>
                <Mic className="mr-2 h-4 w-4" />
                Start Recording
              </>
            )}
          </Button>
          
          {/* Audio Playback Status */}
          {isPlaying && (
            <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
              <Volume2 className="h-4 w-4 text-blue-600 animate-pulse" />
              <span className="text-sm text-blue-600">Playing audio response...</span>
            </div>
          )}
        </div>
        
        {/* Status Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge variant={isConnected ? "default" : "secondary"}>
            {isConnected ? "WebSocket Active" : "WebSocket Inactive"}
          </Badge>
          <Badge variant={audioInitialized ? "default" : "secondary"}>
            {audioInitialized ? "Microphone Ready" : "Microphone Not Ready"}
          </Badge>
          <Badge variant={isRecording ? "destructive" : "secondary"}>
            {isRecording ? "Recording" : "Not Recording"}
          </Badge>
          <Badge variant={isPlaying ? "default" : "secondary"}>
            {isPlaying ? "Playing Audio" : "Audio Stopped"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
