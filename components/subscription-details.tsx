"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Crown, Clock, Mic, CheckCircle2, XCircle } from "lucide-react"
import { type SubscriptionData } from "@/lib/api"
import { cn } from "@/lib/utils"

interface SubscriptionDetailsProps {
  subscription: SubscriptionData | null
  isLoading?: boolean
  className?: string
}

export function SubscriptionDetails({ subscription, isLoading = false, className }: SubscriptionDetailsProps) {
  if (isLoading) {
    return (
      <Card className={cn("border-dashed", className)}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-muted animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
              <div className="h-3 w-32 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!subscription) {
    return (
      <Card className={cn("border-dashed border-muted-foreground/30", className)}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
              <Crown className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">No Active Subscription</p>
              <p className="text-xs text-muted-foreground mt-0.5">Subscribe to get started</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const minutesProgress = subscription.total_minutes > 0 
    ? (subscription.used_minutes / subscription.total_minutes) * 100 
    : 0
  
  const voiceClonesProgress = subscription.voice_clones > 0
    ? ((subscription.voice_clones - subscription.remaining_voice_clones) / subscription.voice_clones) * 100
    : 0

  const minutesPercentage = Math.round(minutesProgress)
  const isMinutesLow = minutesPercentage >= 80
  const isMinutesCritical = minutesPercentage >= 95

  return (
    <Card className={cn("border", className)}>
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "h-10 w-10 rounded-lg flex items-center justify-center",
              subscription.is_active 
                ? "bg-primary/10 text-primary" 
                : "bg-muted text-muted-foreground"
            )}>
              <Crown className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Subscription</p>
              <div className="flex items-center gap-2 mt-0.5">
                {subscription.is_active ? (
                  <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400 text-xs px-1.5 py-0">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-red-500/10 text-red-700 dark:text-red-400 text-xs px-1.5 py-0">
                    <XCircle className="h-3 w-3 mr-1" />
                    Inactive
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Minutes Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>Minutes</span>
            </div>
            <span className={cn(
              "font-medium",
              isMinutesCritical ? "text-red-600 dark:text-red-400" :
              isMinutesLow ? "text-orange-600 dark:text-orange-400" :
              "text-foreground"
            )}>
              {subscription.used_minutes.toLocaleString()} / {subscription.total_minutes.toLocaleString()}
            </span>
          </div>
          <Progress 
            value={minutesProgress} 
            className={cn(
              "h-2",
              isMinutesCritical ? "[&>div]:bg-red-500" :
              isMinutesLow ? "[&>div]:bg-orange-500" :
              ""
            )}
          />
          <p className="text-xs text-muted-foreground">
            {subscription.remaining_minutes.toLocaleString()} minutes remaining
          </p>
        </div>

        {/* Voice Clones */}
        {subscription.voice_clones > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Mic className="h-3.5 w-3.5" />
                <span>Voice Clones</span>
              </div>
              <span className="font-medium">
                {subscription.voice_clones - subscription.remaining_voice_clones} / {subscription.voice_clones}
              </span>
            </div>
            <Progress value={voiceClonesProgress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {subscription.remaining_voice_clones} voice clones available
            </p>
          </div>
        )}

        {/* Footer Info */}
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            Updated {new Date(subscription.updated_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric"
            })}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

