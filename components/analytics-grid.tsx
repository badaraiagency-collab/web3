import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Phone, PhoneCall, Clock, Timer } from "lucide-react"
import type { User } from "@/lib/mock-data"

interface AnalyticsGridProps {
  user: User
}

export function AnalyticsGrid({ user }: AnalyticsGridProps) {
  const callsProgress = (user.callsMade / user.totalCalls) * 100
  const minutesProgress = (user.minutesUsed / user.totalMinutes) * 100

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Calls Made</CardTitle>
          <PhoneCall className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{user.callsMade}</div>
          <p className="text-xs text-muted-foreground">of {user.totalCalls} total</p>
          <Progress value={callsProgress} className="mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Calls Remaining</CardTitle>
          <Phone className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{user.totalCalls - user.callsMade}</div>
          <p className="text-xs text-muted-foreground">calls left this month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Minutes Used</CardTitle>
          <Timer className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{user.minutesUsed}</div>
          <p className="text-xs text-muted-foreground">of {user.totalMinutes} total</p>
          <Progress value={minutesProgress} className="mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Minutes Remaining</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{user.totalMinutes - user.minutesUsed}</div>
          <p className="text-xs text-muted-foreground">minutes left this month</p>
        </CardContent>
      </Card>
    </div>
  )
}
