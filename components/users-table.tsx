"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockUsers } from "@/lib/mock-data"
import { Search, ExternalLink, Users } from "lucide-react"

export function UsersTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [planFilter, setPlanFilter] = useState("all")

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPlan = planFilter === "all" || user.plan === planFilter
    return matchesSearch && matchesPlan
  })

  const getSheetStatusBadge = (sheetCreated: boolean) => {
    return sheetCreated ? (
      <Badge variant="secondary" className="bg-green-100 text-green-800">
        Created
      </Badge>
    ) : (
      <Badge variant="outline">Not Created</Badge>
    )
  }

  const getPlanBadge = (plan: string) => {
    const colors = {
      Free: "bg-gray-100 text-gray-800",
      "Pro Plan": "bg-blue-100 text-blue-800",
      Enterprise: "bg-purple-100 text-purple-800",
    }
    return (
      <Badge variant="secondary" className={colors[plan as keyof typeof colors] || "bg-gray-100 text-gray-800"}>
        {plan}
      </Badge>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Users Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={planFilter} onValueChange={setPlanFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="Free">Free</SelectItem>
              <SelectItem value="Pro Plan">Pro Plan</SelectItem>
              <SelectItem value="Enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Sheet Status</TableHead>
                <TableHead>Calls Made</TableHead>
                <TableHead>Minutes Used</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.photo || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getSheetStatusBadge(user.sheetCreated)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {user.callsMade} / {user.totalCalls}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {user.minutesUsed} / {user.totalMinutes}
                    </div>
                  </TableCell>
                  <TableCell>{getPlanBadge(user.plan)}</TableCell>
                  <TableCell className="text-sm">{new Date(user.expiry).toLocaleDateString()}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(user.lastActive).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <ExternalLink className="h-3 w-3" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">No users found matching your criteria.</div>
        )}
      </CardContent>
    </Card>
  )
}
