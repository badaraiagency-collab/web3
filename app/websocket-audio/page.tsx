"use client"

import { WebSocketAudio } from "@/components/websocket-audio"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, Volume2, Wifi, Settings } from "lucide-react"

export default function WebSocketAudioPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar onAuthClick={() => {}} />
      
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">WebSocket Audio Communication</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real-time audio streaming with your backend WebSocket server. 
            Use your microphone to send audio and hear responses through your speakers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* WebSocket Audio Component */}
          <div>
            <WebSocketAudio wsUrl="ws://localhost:8000/ws" />
          </div>

          {/* Instructions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  How to Use
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-primary">1</span>
                    </div>
                    <div>
                      <p className="font-medium">Connect to WebSocket</p>
                      <p className="text-sm text-muted-foreground">
                        Click "Connect" to establish connection with your backend server at ws://localhost:8000/ws
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-primary">2</span>
                    </div>
                    <div>
                      <p className="font-medium">Grant Microphone Permission</p>
                      <p className="text-sm text-muted-foreground">
                        Allow browser access to your microphone when prompted
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-primary">3</span>
                    </div>
                    <div>
                      <p className="font-medium">Start Recording</p>
                      <p className="text-sm text-muted-foreground">
                        Click "Start Recording" to begin sending audio from your microphone to the server
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-primary">4</span>
                    </div>
                    <div>
                      <p className="font-medium">Listen to Responses</p>
                      <p className="text-sm text-muted-foreground">
                        Audio responses from the server will automatically play through your speakers
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Technical Details */}
            <Card>
              <CardHeader>
                <CardTitle>Technical Details</CardTitle>
                <CardDescription>
                  Audio streaming specifications and protocols
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Audio Format</p>
                    <p className="text-sm text-muted-foreground">WebM Opus</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Sample Rate</p>
                    <p className="text-sm text-muted-foreground">16kHz</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Channels</p>
                    <p className="text-sm text-muted-foreground">Mono</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Chunk Size</p>
                    <p className="text-sm text-muted-foreground">100ms</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Features</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Echo Cancellation</Badge>
                    <Badge variant="secondary">Noise Suppression</Badge>
                    <Badge variant="secondary">Auto Gain Control</Badge>
                    <Badge variant="secondary">Real-time Streaming</Badge>
                    <Badge variant="secondary">Audio Queue</Badge>
                    <Badge variant="secondary">Auto Reconnect</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Troubleshooting */}
            <Card>
              <CardHeader>
                <CardTitle>Troubleshooting</CardTitle>
                <CardDescription>
                  Common issues and solutions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Can't connect to WebSocket?</p>
                  <p className="text-sm text-muted-foreground">
                    Make sure your backend server is running on localhost:8000 and the WebSocket endpoint is active
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Microphone not working?</p>
                  <p className="text-sm text-muted-foreground">
                    Check browser permissions and ensure your microphone is not being used by other applications
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">No audio playback?</p>
                  <p className="text-sm text-muted-foreground">
                    Check your system volume and ensure your speakers/headphones are properly connected
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
