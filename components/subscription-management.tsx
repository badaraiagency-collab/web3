import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { subscriptionPlans } from "@/lib/mock-data"
import { CreditCard, Edit } from "lucide-react"

export function SubscriptionManagement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Subscription Plans
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Calls Limit</TableHead>
                <TableHead>Minutes Limit</TableHead>
                <TableHead>Features</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptionPlans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell>
                    <div className="font-medium">{plan.name}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {plan.price}
                    </Badge>
                  </TableCell>
                  <TableCell>{plan.calls.toLocaleString()}</TableCell>
                  <TableCell>{plan.minutes.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {plan.features.slice(0, 2).join(", ")}
                      {plan.features.length > 2 && ` +${plan.features.length - 2} more`}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Edit className="h-3 w-3" />
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
