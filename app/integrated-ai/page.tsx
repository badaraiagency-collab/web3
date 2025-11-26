"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Mic, MicOff, Volume2, Play, Square, Download, RefreshCw, Upload, FileAudio } from "lucide-react"
import { Navbar } from "@/components/navbar"

interface WebSocketMessage {
  type: string
  message?: string
  text?: string
  audio?: string
  step?: string
}

export default function IntegratedAIPage() {
  const { isAuthenticated, userProfile } = useAuth()
  const { toast } = useToast()
  
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [transcription, setTranscription] = useState("")
  const [llmResponse, setLlmResponse] = useState("")
  const [audioChunks, setAudioChunks] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isFileUploading, setIsFileUploading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isCallActive, setIsCallActive] = useState(false)
  const [callSid, setCallSid] = useState("")
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const websocketRef = useRef<WebSocket | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioContextRef = useRef<AudioContext | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioQueueRef = useRef<AudioBuffer[]>([])
  const isPlayingRef = useRef(false)
  
  // Initialize WebSocket connection
  const connectWebSocket = useCallback(() => {
    if (!isAuthenticated) return
    
    const token = localStorage.getItem('accessToken')
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please log in to use the integrated AI service",
        variant: "destructive",
      })
      return
    }
    
    const wsUrl = `wss://call-automation-be-368713156644.europe-west1.run.app/api/minimax/integrated/websocket?token=${token}`
    const ws = new WebSocket(wsUrl)
    
    ws.onopen = () => {
      console.log("WebSocket connected")
      setIsConnected(true)
      setError("")
      toast({
        title: "Connected",
        description: "WebSocket connection established",
      })
    }
    
    ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data)
        handleWebSocketMessage(message)
      } catch (error) {
        console.error("Error parsing WebSocket message:", error)
      }
    }
    
    ws.onclose = () => {
      console.log("WebSocket disconnected")
      setIsConnected(false)
      setIsProcessing(false)
      setIsFileUploading(false)
    }
    
    ws.onerror = (error) => {
      console.error("WebSocket error:", error)
      setError("WebSocket connection failed")
      setIsConnected(false)
      setIsProcessing(false)
      setIsFileUploading(false)
    }
    
    websocketRef.current = ws
  }, [isAuthenticated, toast])
  
  // Handle WebSocket messages
  const handleWebSocketMessage = useCallback((message: WebSocketMessage) => {
    switch (message.type) {
      case "connected":
        toast({
          title: "Connected",
          description: message.message || "WebSocket connected successfully",
        })
        break
        
      case "status":
        setCurrentStep(message.step || "")
        toast({
          title: "Status",
          description: message.message || "Processing...",
        })
        break
        
             case "stt_complete":
         setTranscription(message.text || "")
         setCurrentStep("llm")
         toast({
           title: "Transcription Complete",
           description: "Audio has been transcribed successfully",
         })
         break
         
       case "partial_stt":
         setTranscription(prev => prev + (message.text || ""))
         setCurrentStep("partial_llm")
         toast({
           title: "Partial Transcription",
           description: "Partial audio transcribed, processing...",
         })
         break
         
       case "llm_complete":
         setLlmResponse(message.text || "")
         setCurrentStep("tts")
         toast({
           title: "AI Response Generated",
           description: "AI has generated a response",
         })
         break
         
       case "partial_llm":
         setLlmResponse(prev => prev + (message.text || ""))
         setCurrentStep("partial_tts")
         toast({
           title: "Partial AI Response",
           description: "Partial AI response generated, continuing...",
         })
         break
        
      case "audio_chunk":
        if (message.audio) {
          setAudioChunks(prev => [...prev, message.audio!])
          // Play audio chunk immediately as it's received
          playAudioChunkImmediately(message.audio)
        }
        break
        
      case "complete":
        setIsProcessing(false)
        setIsFileUploading(false)
        setCurrentStep("")
        
        // Check if we have audio chunks
        if (audioChunks.length === 0) {
          toast({
            title: "Pipeline Complete",
            description: "AI pipeline completed but no audio was generated. You can still see the text response.",
            variant: "default",
          })
        } else {
          toast({
            title: "Complete",
            description: message.message || "AI pipeline completed successfully",
          })
        }
        break
        
      case "error":
        setError(message.message || "An error occurred")
        setIsProcessing(false)
        setIsRecording(false)
        setIsFileUploading(false)
        toast({
          title: "Error",
          description: message.message || "An error occurred",
          variant: "destructive",
        })
        break
        
      default:
        console.log("Unknown message type:", message.type)
    }
  }, [toast])
  
  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        await sendAudioToWebSocket(audioBlob)
      }
      
      mediaRecorder.start()
      setIsRecording(true)
      setError("")
      
      toast({
        title: "Recording Started",
        description: "Recording audio... Click stop when finished",
      })
    } catch (error) {
      console.error("Error starting recording:", error)
      setError("Failed to start recording")
      toast({
        title: "Recording Error",
        description: "Failed to start recording. Please check microphone permissions.",
        variant: "destructive",
      })
    }
  }
  
  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      setIsRecording(false)
      setIsProcessing(true)
      
      toast({
        title: "Recording Stopped",
        description: "Processing audio through AI pipeline...",
      })
    }
  }
  
  // Send audio to WebSocket
  const sendAudioToWebSocket = async (audioBlob: Blob) => {
    if (!websocketRef.current || websocketRef.current.readyState !== WebSocket.OPEN) {
      setError("WebSocket not connected")
      setIsProcessing(false)
      setIsFileUploading(false)
      return
    }
    
    try {
      // Convert blob to array buffer and send
      const arrayBuffer = await audioBlob.arrayBuffer()
      websocketRef.current.send(arrayBuffer)
    } catch (error) {
      console.error("Error sending audio:", error)
      setError("Failed to send audio")
      setIsProcessing(false)
      setIsFileUploading(false)
    }
  }
  
  // Initialize audio context
  const initializeAudioContext = useCallback(async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext()
      console.log("Audio context initialized")
    }
    
    // Resume context if suspended (browser requirement)
    if (audioContextRef.current.state === 'suspended') {
      try {
        await audioContextRef.current.resume()
        console.log("Audio context resumed")
      } catch (error) {
        console.error("Failed to resume audio context:", error)
        // Try to create a new context
        audioContextRef.current = new AudioContext()
      }
    }
    
    return audioContextRef.current
  }, [])

  // Enable audio context on user interaction
  const enableAudioContext = useCallback(async () => {
    try {
      const audioContext = await initializeAudioContext()
      if (audioContext.state === 'suspended') {
        await audioContext.resume()
        console.log("Audio context enabled by user interaction")
        toast({
          title: "Audio Enabled",
          description: "Audio context is now ready for playback",
        })
      }
    } catch (error) {
      console.error("Failed to enable audio context:", error)
      toast({
        title: "Audio Error",
        description: "Failed to enable audio playback",
        variant: "destructive",
      })
    }
  }, [initializeAudioContext, toast])

  // Test audio playback with a simple tone
  const testAudioPlayback = useCallback(async () => {
    try {
      const audioContext = await initializeAudioContext()
      
      // Create a simple test tone
      const sampleRate = audioContext.sampleRate
      const duration = 0.5 // 500ms
      const numSamples = Math.floor(sampleRate * duration)
      
      const audioBuffer = audioContext.createBuffer(1, numSamples, sampleRate)
      const channelData = audioBuffer.getChannelData(0)
      
      // Generate a 440Hz sine wave (A note)
      for (let i = 0; i < numSamples; i++) {
        channelData[i] = Math.sin(2 * Math.PI * 440 * i / sampleRate) * 0.3
      }
      
      const source = audioContext.createBufferSource()
      source.buffer = audioBuffer
      source.connect(audioContext.destination)
      source.start(0)
      
      console.log("Test tone played successfully")
      toast({
        title: "Audio Test",
        description: "Test tone played - check your speakers!",
      })
      
    } catch (error) {
      console.error("Failed to play test tone:", error)
      toast({
        title: "Audio Test Failed",
        description: "Could not play test tone - check audio setup",
        variant: "destructive",
      })
    }
  }, [initializeAudioContext, toast])

  // Play audio chunk immediately as it's received
  const playAudioChunkImmediately = useCallback(async (audioChunkBase64: string) => {
    try {
      const audioContext = await initializeAudioContext()
      
      // Ensure audio context is running
      if (audioContext.state === 'suspended') {
        await audioContext.resume()
      }
      
      // Decode base64 to binary
      const audioBytes = atob(audioChunkBase64)
      const audioArray = new Uint8Array(audioBytes.length)
      for (let i = 0; i < audioBytes.length; i++) {
        audioArray[i] = audioBytes.charCodeAt(i)
      }
      
      // Decode audio data
      const audioBuffer = await audioContext.decodeAudioData(audioArray.buffer)
      
      // Add to queue and play if not currently playing
      audioQueueRef.current.push(audioBuffer)
      
      if (!isPlayingRef.current) {
        playNextInQueue()
      }
      
      console.log(`Audio chunk queued, total chunks: ${audioChunks.length + 1}, queue length: ${audioQueueRef.current.length}`)
      
    } catch (error) {
      console.error("Error playing audio chunk:", error)
      // Try to create a new audio context if the current one fails
      try {
        audioContextRef.current = new AudioContext()
        console.log("Created new audio context after error")
      } catch (contextError) {
        console.error("Failed to create new audio context:", contextError)
      }
    }
  }, [initializeAudioContext, audioChunks.length])

  // Play next audio buffer in queue
  const playNextInQueue = useCallback(async () => {
    if (audioQueueRef.current.length === 0 || isPlayingRef.current) {
      return
    }
    
    try {
      isPlayingRef.current = true
      setIsPlaying(true)
      
      const audioBuffer = audioQueueRef.current.shift()!
      const audioContext = audioContextRef.current!
      
      // Ensure audio context is running
      if (audioContext.state === 'suspended') {
        await audioContext.resume()
      }
      
      const source = audioContext.createBufferSource()
      source.buffer = audioBuffer
      source.connect(audioContext.destination)
      
      // Note: AudioBufferSourceNode doesn't have onerror, we handle errors in try-catch
      
      source.onended = () => {
        isPlayingRef.current = false
        setIsPlaying(false)
        console.log("Audio chunk finished, queue length:", audioQueueRef.current.length)
        // Play next chunk if available
        if (audioQueueRef.current.length > 0) {
          // Small delay to prevent audio overlap
          setTimeout(() => playNextInQueue(), 50)
        }
      }
      
      source.start(0)
      console.log("Playing audio chunk, queue length:", audioQueueRef.current.length)
      
    } catch (error) {
      console.error("Error playing next audio chunk:", error)
      isPlayingRef.current = false
      setIsPlaying(false)
      // Try to play next chunk with delay
      if (audioQueueRef.current.length > 0) {
        setTimeout(() => playNextInQueue(), 100)
      }
    }
  }, [])

  // Stop all audio playback
  const stopAudioPlayback = useCallback(() => {
    // Clear the queue
    audioQueueRef.current = []
    isPlayingRef.current = false
    setIsPlaying(false)
    
    // Stop any currently playing audio
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
    
    console.log("Audio playback stopped")
  }, [])

  // Play audio response (for manual playback of all chunks)
  const playAudioResponse = useCallback(async () => {
    if (audioChunks.length === 0) return
    
    try {
      // Combine all audio chunks
      const combinedAudio = audioChunks.join('')
      const audioBytes = atob(combinedAudio)
      const audioArray = new Uint8Array(audioBytes.length)
      for (let i = 0; i < audioBytes.length; i++) {
        audioArray[i] = audioBytes.charCodeAt(i)
      }
      
      // Create audio context and play
      const audioContext = await initializeAudioContext()
      
      const audioBuffer = await audioContext.decodeAudioData(audioArray.buffer)
      const source = audioContext.createBufferSource()
      source.buffer = audioBuffer
      source.connect(audioContext.destination)
      source.start(0)
      
      toast({
        title: "Playing Audio",
        description: "Playing complete AI-generated response",
      })
    } catch (error) {
      console.error("Error playing audio:", error)
      toast({
        title: "Audio Playback Error",
        description: "Failed to play audio response",
        variant: "destructive",
      })
    }
  }, [audioChunks, toast, initializeAudioContext])
  
  // Download audio response
  const downloadAudioResponse = useCallback(async () => {
    if (audioChunks.length === 0) return
    
    try {
      // Combine all audio chunks
      const combinedAudio = audioChunks.join('')
      const audioBytes = atob(combinedAudio)
      const audioArray = new Uint8Array(audioBytes.length)
      for (let i = 0; i < audioBytes.length; i++) {
        audioArray[i] = audioBytes.charCodeAt(i)
      }
      
      // Create blob and download
      const blob = new Blob([audioArray], { type: 'audio/mpeg' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'ai-response.mp3'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast({
        title: "Download Started",
        description: "Audio response download started",
      })
    } catch (error) {
      console.error("Error downloading audio:", error)
      toast({
        title: "Download Error",
        description: "Failed to download audio response",
        variant: "destructive",
      })
    }
  }, [audioChunks, toast])
  
  // Reset state
  const resetState = () => {
    setTranscription("")
    setLlmResponse("")
    setAudioChunks([])
    setCurrentStep("")
    setError("")
    setIsProcessing(false)
    setIsRecording(false)
    setSelectedFile(null)
    setIsFileUploading(false)
    setPhoneNumber("")
    setIsCallActive(false)
    setCallSid("")
    
    // Stop all audio playback
    stopAudioPlayback()
  }
  
  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('audio/')) {
        toast({
          title: "Invalid File Type",
          description: "Please select an audio file",
          variant: "destructive",
        })
        return
      }
      
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast({
          title: "File Too Large",
          description: "Please select a file smaller than 50MB",
          variant: "destructive",
        })
        return
      }
      
      setSelectedFile(file)
      toast({
        title: "File Selected",
        description: `${file.name} selected for processing`,
      })
    }
  }
  
  // Process uploaded file
  const processUploadedFile = async () => {
    if (!selectedFile || !isConnected) return
    
    setIsFileUploading(true)
    setIsProcessing(true)
    setError("")
    
    try {
      // Convert file to array buffer and send via WebSocket
      const arrayBuffer = await selectedFile.arrayBuffer()
      if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
        websocketRef.current.send(arrayBuffer)
        
        toast({
          title: "File Uploaded",
          description: "Processing uploaded audio file...",
        })
      } else {
        throw new Error("WebSocket not connected")
      }
    } catch (error) {
      console.error("Error processing uploaded file:", error)
      setError("Failed to process uploaded file")
      setIsProcessing(false)
      setIsFileUploading(false)
      
      toast({
        title: "Upload Error",
        description: "Failed to process uploaded file",
        variant: "destructive",
      })
    }
  }
  
  // Clear selected file
  const clearSelectedFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Start Twilio call
  const startTwilioCall = async () => {
    if (!phoneNumber || !isConnected) return
    
    try {
      setIsProcessing(true)
      setError("")
      
      const response = await fetch('https://badarai.site/api/twilio/start-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          phone_number: phoneNumber
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setCallSid(data.call_sid)
        setIsCallActive(true)
        toast({
          title: "Call Started",
          description: `Calling ${phoneNumber}...`,
        })
      } else {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to start call')
      }
    } catch (error) {
      console.error("Error starting Twilio call:", error)
      setError("Failed to start call")
      toast({
        title: "Call Error",
        description: "Failed to start Twilio call",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // End Twilio call
  const endTwilioCall = async () => {
    if (!callSid) return
    
    try {
      const response = await fetch('https://badarai.site/api/twilio/end-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          call_sid: callSid
        })
      })
      
      if (response.ok) {
        setIsCallActive(false)
        setCallSid("")
        toast({
          title: "Call Ended",
          description: "Twilio call has been ended",
        })
      } else {
        throw new Error('Failed to end call')
      }
    } catch (error) {
      console.error("Error ending Twilio call:", error)
      toast({
        title: "Call Error",
        description: "Failed to end call",
        variant: "destructive",
      })
    }
  }
  
  // Connect WebSocket on mount
  useEffect(() => {
    if (isAuthenticated) {
      connectWebSocket()
    }
    
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close()
      }
    }
  }, [isAuthenticated, connectWebSocket])
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close()
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])
  
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please log in to access the integrated AI service.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar onAuthClick={() => {}} />
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-[calc(100vh-64px)]">
      
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Integrated AI Assistant</h1>
          <p className="text-muted-foreground">
            Speak to your AI assistant and get real-time responses with speech synthesis.
          </p>
        </div>
      
             {/* Connection Status */}
       <Card className="mb-6">
         <CardHeader>
           <CardTitle className="flex items-center gap-2">
             <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
             Connection Status
           </CardTitle>
         </CardHeader>
         <CardContent>
           <div className="space-y-4">
             <p className={isConnected ? 'text-green-600' : 'text-red-600'}>
               {isConnected ? 'Connected to AI Service' : 'Disconnected from AI Service'}
             </p>
             
             <div className="flex gap-2">
               {!isConnected && (
                 <Button onClick={connectWebSocket}>
                   <RefreshCw className="mr-2 h-4 w-4" />
                   Reconnect
                 </Button>
               )}
               
                               <Button onClick={enableAudioContext} variant="outline">
                  <Volume2 className="mr-2 h-4 w-4" />
                  Enable Audio
                </Button>
                
                <Button onClick={testAudioPlayback} variant="outline">
                  <Play className="mr-2 h-4 w-4" />
                  Test Audio
                </Button>
             </div>
           </div>
         </CardContent>
       </Card>
      
      {/* Recording Controls */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Audio Recording</CardTitle>
          <CardDescription>
            Record your voice to start a conversation with the AI assistant.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {!isRecording ? (
              <Button 
                onClick={startRecording} 
                disabled={!isConnected || isProcessing}
                className="bg-red-600 hover:bg-red-700"
              >
                <Mic className="mr-2 h-4 w-4" />
                Start Recording
              </Button>
            ) : (
              <Button 
                onClick={stopRecording}
                className="bg-gray-600 hover:bg-gray-700"
              >
                <MicOff className="mr-2 h-4 w-4" />
                Stop Recording
              </Button>
            )}
            
            <Button 
              onClick={resetState} 
              variant="outline"
              disabled={isRecording || isProcessing}
            >
              Reset
            </Button>
          </div>
          
          {isRecording && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-600">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                Recording... Click stop when finished
              </div>
            </div>
          )}
          
                     {isProcessing && (
             <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
               <div className="flex items-center gap-2 text-blue-600">
                 <LoadingSpinner className="w-4 h-4" />
                 Processing through AI pipeline... {currentStep && `(${currentStep.toUpperCase()})`}
               </div>
             </div>
           )}
           
                       {/* Audio Streaming Status */}
            {audioChunks.length > 0 && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-600">
                  <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-600 animate-pulse' : 'bg-green-400'}`} />
                  {isPlaying ? 'Playing audio chunks in real-time...' : 'Audio chunks received and ready to play'}
                </div>
                <p className="text-sm text-green-600 mt-1">
                  Received {audioChunks.length} chunks • Queue: {audioQueueRef.current.length} • Status: {isPlaying ? 'Playing' : 'Ready'}
                </p>
                <div className="text-xs text-green-500 mt-2">
                  <p>Audio Context: {audioContextRef.current?.state || 'Not initialized'}</p>
                  <p>Sample Rate: {audioContextRef.current?.sampleRate || 'N/A'} Hz</p>
                  <p>Last Chunk Size: {audioChunks[audioChunks.length - 1] ? Math.round(audioChunks[audioChunks.length - 1].length * 0.75) : 0} bytes</p>
                </div>
              </div>
            )}
        </CardContent>
      </Card>
      
             {/* File Upload */}
       <Card className="mb-6">
         <CardHeader>
           <CardTitle>Audio File Upload</CardTitle>
           <CardDescription>
             Upload an audio file to process through the AI pipeline.
           </CardDescription>
         </CardHeader>
         <CardContent>
           <div className="space-y-4">
             {/* File Input */}
             <div className="flex items-center gap-4">
               <input
                 ref={fileInputRef}
                 type="file"
                 accept="audio/*"
                 onChange={handleFileSelect}
                 className="hidden"
               />
               <Button
                 onClick={() => fileInputRef.current?.click()}
                 variant="outline"
                 disabled={isProcessing}
                 className="flex items-center gap-2"
               >
                 <Upload className="h-4 w-4" />
                 Choose Audio File
               </Button>
               
               {selectedFile && (
                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
                   <FileAudio className="h-4 w-4" />
                   {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                 </div>
               )}
             </div>
             
             {/* File Actions */}
             {selectedFile && (
               <div className="flex gap-4">
                 <Button
                   onClick={processUploadedFile}
                   disabled={!isConnected || isProcessing}
                   className="bg-blue-600 hover:bg-blue-700"
                 >
                   <Play className="mr-2 h-4 w-4" />
                   Process File
                 </Button>
                 
                 <Button
                   onClick={clearSelectedFile}
                   variant="outline"
                   disabled={isProcessing}
                 >
                   Clear File
                 </Button>
               </div>
             )}
             
             {/* Upload Status */}
             {isFileUploading && (
               <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                 <div className="flex items-center gap-2 text-blue-600">
                   <LoadingSpinner className="w-4 h-4" />
                   Uploading and processing audio file...
                 </div>
               </div>
             )}
           </div>
         </CardContent>
       </Card>
       
       {/* Twilio Calling Section */}
       <Card className="mb-6">
         <CardHeader>
           <CardTitle>Twilio Phone Call</CardTitle>
           <CardDescription>
             Make a phone call and have real-time conversation with the AI assistant.
           </CardDescription>
         </CardHeader>
         <CardContent>
           <div className="space-y-4">
             {/* Phone Number Input */}
             <div className="space-y-2">
               <label htmlFor="phoneNumber" className="text-sm font-medium">
                 Phone Number to Call
               </label>
               <input
                 id="phoneNumber"
                 type="tel"
                 placeholder="+1234567890"
                 value={phoneNumber}
                 onChange={(e) => setPhoneNumber(e.target.value)}
                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                 disabled={isProcessing}
               />
               <p className="text-xs text-muted-foreground">
                 Enter the phone number in international format (e.g., +1234567890)
               </p>
             </div>
             
             {/* Call Controls */}
             <div className="flex gap-4">
               <Button
                 onClick={startTwilioCall}
                 disabled={!isConnected || isProcessing || !phoneNumber}
                 className="bg-green-600 hover:bg-green-700"
               >
                 <Play className="mr-2 h-4 w-4" />
                 Start Call
               </Button>
               
               <Button
                 onClick={endTwilioCall}
                 variant="outline"
                 disabled={!isCallActive}
                 className="bg-red-600 hover:bg-red-700 text-white"
               >
                 <Square className="mr-2 h-4 w-4" />
                 End Call
               </Button>
             </div>
             
             {/* Call Status */}
             <div className={`p-4 border rounded-lg ${
               isCallActive 
                 ? 'bg-green-50 border-green-200' 
                 : 'bg-blue-50 border-blue-200'
             }`}>
               <div className="flex items-center gap-2 text-blue-600">
                 <div className={`w-2 h-2 rounded-full ${
                   isCallActive ? 'bg-green-600 animate-pulse' : 'bg-blue-600'
                 }`} />
                 <span className="text-sm font-medium">
                   Call Status: {isCallActive ? 'Active' : 'Ready'}
                 </span>
               </div>
               <p className="text-xs text-blue-600 mt-1">
                 {isCallActive 
                   ? `Connected to ${phoneNumber} - AI assistant is listening and responding`
                   : 'Enter a phone number to start a real-time conversation with the AI'
                 }
               </p>
               {isCallActive && callSid && (
                 <p className="text-xs text-green-600 mt-1">
                   Call SID: {callSid}
                 </p>
               )}
             </div>
           </div>
         </CardContent>
       </Card>
      
      {/* Results */}
      {(transcription || llmResponse || audioChunks.length > 0) && (
        <div className="space-y-6">
          {/* Transcription */}
          {transcription && (
            <Card>
              <CardHeader>
                <CardTitle>Your Message</CardTitle>
                <CardDescription>What you said (STT Result)</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg">{transcription}</p>
              </CardContent>
            </Card>
          )}
          
          {/* AI Response */}
          {llmResponse && (
            <Card>
              <CardHeader>
                <CardTitle>AI Response</CardTitle>
                <CardDescription>Generated by GPT-4o-mini</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg">{llmResponse}</p>
              </CardContent>
            </Card>
          )}
          
                     {/* Audio Controls */}
           {audioChunks.length > 0 ? (
             <Card>
               <CardHeader>
                 <CardTitle>Audio Response</CardTitle>
                 <CardDescription>Generated by Minimax AI TTS - Playing in real-time as received</CardDescription>
               </CardHeader>
               <CardContent>
                 <div className="space-y-4">
                   {/* Real-time Playback Status */}
                   <div className="flex items-center gap-2">
                     <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                     <span className="text-sm font-medium">
                       {isPlaying ? 'Playing audio chunks...' : 'Audio chunks received'}
                     </span>
                   </div>
                   
                   {/* Playback Controls */}
                   <div className="flex gap-4">
                     <Button 
                       onClick={playAudioResponse} 
                       disabled={isPlaying}
                       className="bg-green-600 hover:bg-green-700"
                     >
                       <Play className="mr-2 h-4 w-4" />
                       Play All Again
                     </Button>
                     
                     <Button 
                       onClick={stopAudioPlayback} 
                       variant="outline"
                       className="bg-red-600 hover:bg-red-700 text-white"
                     >
                       <Square className="mr-2 h-4 w-4" />
                       Stop Audio
                     </Button>
                     
                     <Button 
                       onClick={downloadAudioResponse} 
                       variant="outline"
                       disabled={isPlaying}
                     >
                       <Download className="mr-2 h-4 w-4" />
                       Download MP3
                     </Button>
                   </div>
                   
                   {/* Audio Queue Status */}
                   <div className="text-sm text-muted-foreground">
                     <p>Audio chunks received: {audioChunks.length}</p>
                     <p>Queue length: {audioQueueRef.current.length}</p>
                     <p>Status: {isPlaying ? 'Currently playing' : 'Ready'}</p>
                   </div>
                 </div>
               </CardContent>
             </Card>
           ) : (
            // Show message when no audio was generated but pipeline completed
            transcription && llmResponse && (
              <Card className="border-amber-200 bg-amber-50">
                <CardHeader>
                  <CardTitle className="text-amber-600">Audio Generation Note</CardTitle>
                  <CardDescription>Text processing completed successfully</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-amber-600">
                    The AI pipeline processed your request successfully, but audio generation failed. 
                    You can still see the transcription and AI response above.
                  </p>
                </CardContent>
              </Card>
            )
          )}
        </div>
      )}
      
      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}
        </div>
      </div>
      </div>
    )
  }
