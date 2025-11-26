"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bot, Play, Pause } from "lucide-react"

export function CallingAgentStatus() {
  const [isActive, setIsActive] = useState(false)
  const [nextCallIn, setNextCallIn] = useState(120) // 2 minutes in seconds

  useEffect(() => {
    if (isActive && nextCallIn > 0) {
      const timer = setInterval(() => {
        setNextCallIn((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isActive, nextCallIn])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const toggleAgent = () => {
    setIsActive(!isActive)
    if (!isActive) {
      setNextCallIn(120) // Reset timer when activating
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Calling Agent
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium">Status:</span>
            <Badge variant={isActive ? "default" : "secondary"} className={isActive ? "bg-green-600" : ""}>
              {isActive ? "Active" : "Idle"}
            </Badge>
          </div>
          <Button onClick={toggleAgent} variant={isActive ? "outline" : "default"} size="sm" className="gap-2">
            {isActive ? (
              <>
                <Pause className="h-4 w-4" />
                Pause Calls
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Resume Calls
              </>
            )}
          </Button>
        </div>

        {isActive && (
          <div className="text-sm text-muted-foreground">
            Next call in: <span className="font-mono font-medium">{formatTime(nextCallIn)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
