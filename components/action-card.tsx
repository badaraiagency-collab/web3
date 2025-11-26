"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileSpreadsheet, ExternalLink } from "lucide-react"
import type { User } from "@/lib/mock-data"

interface ActionCardProps {
  user: User
  onSetupSheet: () => void
}

export function ActionCard({ user, onSetupSheet }: ActionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          Google Sheet Management
        </CardTitle>
        <CardDescription>Set up your contact sheet for automated calling.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Sheet Status:</p>
            <div className="flex items-center gap-2 mt-1">
              {user.sheetCreated ? (
                <>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Ready
                  </Badge>
                  <Button variant="link" size="sm" className="h-auto p-0" asChild>
                    <a href={user.sheetLink} target="_blank" rel="noopener noreferrer">
                      View Sheet <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </Button>
                </>
              ) : (
                <Badge variant="outline">Not Set Up</Badge>
              )}
            </div>
          </div>
          {!user.sheetCreated && (
            <Button onClick={onSetupSheet} className="gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Set Up Google Sheet
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
