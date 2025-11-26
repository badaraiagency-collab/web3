"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { subscriptionPlans } from "@/lib/mock-data"
import { Crown, Calendar, Check, Zap } from "lucide-react"

export default function SubscriptionPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user) {
    return null
  }

  const currentPlan = subscriptionPlans.find((plan) => plan.name === user.plan)
  const callsProgress = (user.callsMade / user.totalCalls) * 100
  const minutesProgress = (user.minutesUsed / user.totalMinutes) * 100

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Subscription</h1>
            <p className="text-muted-foreground">Manage your plan and billing</p>
          </div>
        </div>

        {/* Current Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              Current Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">{user.plan}</h3>
                <p className="text-muted-foreground">{currentPlan?.price}</p>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Active
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Calls Used</span>
                  <span>
                    {user.callsMade} / {user.totalCalls}
                  </span>
                </div>
                <Progress value={callsProgress} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Minutes Used</span>
                  <span>
                    {user.minutesUsed} / {user.totalMinutes}
                  </span>
                </div>
                <Progress value={minutesProgress} className="h-2" />
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Renews on{" "}
                {new Date(user.expiry).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Available Plans */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Available Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subscriptionPlans.map((plan) => (
              <Card key={plan.id} className={plan.name === user.plan ? "border-primary" : ""}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {plan.name}
                    {plan.name === user.plan && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        Current
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="text-2xl font-bold">{plan.price}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Calls per month</span>
                      <span className="font-medium">{plan.calls.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Minutes per month</span>
                      <span className="font-medium">{plan.minutes.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    className="w-full"
                    variant={plan.name === user.plan ? "outline" : "default"}
                    disabled={plan.name === user.plan}
                  >
                    {plan.name === user.plan ? "Current Plan" : plan.name === "Free" ? "Downgrade" : "Upgrade"}
                    {plan.name !== user.plan && plan.name !== "Free" && <Zap className="ml-2 h-4 w-4" />}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Billing History */}
        <Card>
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
            <CardDescription>Your recent billing and payment history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <p>No billing history available.</p>
              <p className="text-sm">Billing information will appear here once you have active subscriptions.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
