import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Crown, Calendar } from "lucide-react"
import type { User } from "@/lib/mock-data"

interface SubscriptionInfoProps {
  user: User
}

export function SubscriptionInfo({ user }: SubscriptionInfoProps) {
  const minutesProgress = (user.minutesUsed / user.totalMinutes) * 100
  const expiryDate = new Date(user.expiry).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-primary" />
          Subscription
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">Current Plan:</span>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {user.plan}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Minutes Usage</span>
            <span>
              {user.minutesUsed} / {user.totalMinutes}
            </span>
          </div>
          <Progress value={minutesProgress} className="h-2" />
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Expires on {expiryDate}</span>
        </div>

        <Button variant="outline" className="w-full bg-transparent">
          Upgrade Plan
        </Button>
      </CardContent>
    </Card>
  )
}
