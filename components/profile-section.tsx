"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { User, Save } from "lucide-react"
import type { User as UserType } from "@/lib/mock-data"

interface ProfileSectionProps {
  user: UserType
}

export function ProfileSection({ user }: ProfileSectionProps) {
  const { updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: "",
  })

  const handleSave = () => {
    updateUser({ name: formData.name })
    setIsEditing(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={!isEditing}
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={formData.email} disabled className="bg-muted" />
          </div>

          <div>
            <Label htmlFor="phone">Phone (Optional)</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={!isEditing}
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave} size="sm" className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
              <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
              Edit Profile
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
