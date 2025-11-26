"use client"

import { useState, useEffect, useRef } from "react"
import { Mic, Trash2, Loader2, Plus, Globe, User, Clock, Play, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { apiService, type ClonedVoice } from "@/lib/api"
import { Badge } from "@/components/ui/badge"

interface ClonedVoicesListProps {
  showCreateButton?: boolean
  onCreateClick?: () => void
  limit?: number
}

export function ClonedVoicesList({ showCreateButton = true, onCreateClick, limit }: ClonedVoicesListProps) {
  const [voices, setVoices] = useState<ClonedVoice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null)
  const [generatingVoiceId, setGeneratingVoiceId] = useState<string | null>(null)
  const demoAudioRef = useRef<HTMLAudioElement | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadVoices()
  }, [])

  const loadVoices = async () => {
    setIsLoading(true)
    try {
      const result = await apiService.getClonedVoices({
        showToast: false,
        forceRefresh: true
      })

      if (result.success && result.data) {
        const voicesData = Array.isArray(result.data) ? result.data : [result.data]
        setVoices(voicesData)
      }
    } catch (error) {
      console.error("Error loading cloned voices:", error)
      toast({
        title: "Error",
        description: "Failed to load cloned voices",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (voiceId: number, voiceName: string) => {
    setDeletingId(voiceId)
    try {
      const result = await apiService.deleteClonedVoice(voiceId)

      if (result.success) {
        toast({
          title: "Success!",
          description: `Voice "${voiceName}" deleted successfully`,
          variant: "default",
        })
        // Reload voices after deletion
        await loadVoices()
      } else {
        throw new Error(result.message || "Failed to delete voice")
      }
    } catch (error: any) {
      console.error("Error deleting voice:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete cloned voice",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  const playDemoVoice = async (voiceId: string, voiceName: string) => {
    // If already playing this voice, stop it
    if (playingVoiceId === voiceId && demoAudioRef.current) {
      demoAudioRef.current.pause()
      setPlayingVoiceId(null)
      demoAudioRef.current = null
      return
    }

    // Stop any currently playing audio
    if (demoAudioRef.current) {
      demoAudioRef.current.pause()
      demoAudioRef.current = null
    }

    setGeneratingVoiceId(voiceId)
    setPlayingVoiceId(null)

    try {
      const demoText = "Hello! This is a demo of your cloned voice. The quality is amazing!"
      
      console.log("Playing demo for voice:", voiceId)
      
      const audioBlob = await apiService.textToSpeech(voiceId, demoText)
      
      const url = URL.createObjectURL(audioBlob)
      const audio = new Audio(url)
      demoAudioRef.current = audio

      audio.onended = () => {
        setPlayingVoiceId(null)
        URL.revokeObjectURL(url)
        demoAudioRef.current = null
      }

      audio.onerror = (e) => {
        console.error("Audio playback error:", e)
        toast({
          title: "Playback Error",
          description: "Failed to play demo audio",
          variant: "destructive",
        })
        setPlayingVoiceId(null)
        URL.revokeObjectURL(url)
        demoAudioRef.current = null
      }

      await audio.play()
      setPlayingVoiceId(voiceId)

      toast({
        title: "Playing Demo",
        description: `Listening to "${voiceName}"...`,
        duration: 3000,
      })
    } catch (error: any) {
      console.error("Demo voice error:", error)
      toast({
        title: "Demo Failed",
        description: error.message || "Failed to generate demo audio",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setGeneratingVoiceId(null)
    }
  }

  const displayedVoices = limit ? voices.slice(0, limit) : voices

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-purple-600 mr-2" />
            <span className="text-gray-600">Loading cloned voices...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (voices.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <Mic className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Cloned Voices Yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Create your first AI voice clone to get started with personalized text-to-speech.
            </p>
            {showCreateButton && onCreateClick && (
              <Button
                onClick={onCreateClick}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Voice
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {displayedVoices.map((voice) => (
        <Card key={voice.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 md:p-6">
            {/* Mobile Layout - Stack vertically */}
            <div className="md:hidden space-y-4">
              {/* Voice Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                    <Mic className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 truncate">
                      {voice.voice_name}
                    </h3>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {voice.gender}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Voice Details */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Globe className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{voice.language} ({voice.accent})</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="h-4 w-4 flex-shrink-0" />
                  <span>Age: {voice.age}</span>
                </div>
                {voice.use_case && (
                  <div className="text-gray-600">
                    <span className="font-medium">Use Case:</span> {voice.use_case}
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="h-3 w-3 flex-shrink-0" />
                  <span>Created: {new Date(voice.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Voice ID */}
              <div className="p-2 bg-gray-50 rounded text-xs font-mono text-gray-600 truncate">
                Voice ID: {voice.voice_id}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 justify-end border-t pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => playDemoVoice(voice.voice_id, voice.voice_name)}
                  disabled={generatingVoiceId === voice.voice_id}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 flex-1"
                >
                  {generatingVoiceId === voice.voice_id ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      <span>Loading...</span>
                    </>
                  ) : playingVoiceId === voice.voice_id ? (
                    <>
                      <Square className="h-4 w-4 mr-2" />
                      <span>Stop</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      <span>Play</span>
                    </>
                  )}
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={deletingId === voice.id}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      {deletingId === voice.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Cloned Voice</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{voice.voice_name}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(voice.id, voice.voice_name)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete Voice
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            {/* Desktop Layout - Original horizontal layout */}
            <div className="hidden md:flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                {/* Voice Icon */}
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Mic className="h-6 w-6 text-purple-600" />
                </div>

                {/* Voice Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {voice.voice_name}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {voice.gender}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Globe className="h-4 w-4" />
                      <span>{voice.language} ({voice.accent})</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <User className="h-4 w-4" />
                      <span>Age: {voice.age}</span>
                    </div>
                    {voice.use_case && (
                      <div className="col-span-2 text-gray-600">
                        <span className="font-medium">Use Case:</span> {voice.use_case}
                      </div>
                    )}
                    <div className="col-span-2 flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>Created: {new Date(voice.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Voice ID (for reference) */}
                  <div className="mt-3 p-2 bg-gray-50 rounded text-xs font-mono text-gray-600 truncate">
                    Voice ID: {voice.voice_id}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 ml-4">
                {/* Play Demo Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => playDemoVoice(voice.voice_id, voice.voice_name)}
                  disabled={generatingVoiceId === voice.voice_id}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                >
                  {generatingVoiceId === voice.voice_id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : playingVoiceId === voice.voice_id ? (
                    <Square className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>

                {/* Delete Button */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={deletingId === voice.id}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      {deletingId === voice.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Cloned Voice</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{voice.voice_name}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(voice.id, voice.voice_name)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete Voice
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {limit && voices.length > limit && (
        <Alert>
          <AlertDescription className="text-center">
            Showing {limit} of {voices.length} voices. {onCreateClick && "Visit Voice Clone page to see all."}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

