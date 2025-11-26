import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { mockCallRecords } from "@/lib/mock-data"
import { Activity } from "lucide-react"

export function RecentActivity() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Called":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Called</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockCallRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">{record.name}</TableCell>
                <TableCell>{record.phone}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getStatusColor(record.status)}>
                    {record.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{record.lastCalled}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
