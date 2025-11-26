import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import type { User } from "@/lib/mock-data"

interface WelcomeBannerProps {
  user: User
}

export function WelcomeBanner({ user }: WelcomeBannerProps) {
  return (
    <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border-primary/20">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary/20">
            <AvatarImage src={user.photo || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback className="text-lg font-semibold">{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Welcome back, {user.name}!</h1>
            <p className="text-muted-foreground">Ready to automate your calls today?</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
