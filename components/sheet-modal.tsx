"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ExternalLink, CheckCircle, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SheetModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sheetUrl?: string
}

export function SheetModal({ open, onOpenChange, sheetUrl }: SheetModalProps) {
  const [contactsAdded, setContactsAdded] = useState(false)

  const handleOpenSheet = () => {
    if (sheetUrl) {
      window.open(sheetUrl, "_blank")
    } else {
      window.open("https://sheets.google.com/mock123", "_blank")
    }
  }

  const handleStartCalling = () => {
    onOpenChange(false)
  }

  const handleContactsChange = (checked: boolean | "indeterminate") => {
    setContactsAdded(checked === true)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <DialogTitle className="text-2xl font-bold">Your Sheet is Ready!</DialogTitle>
          <DialogDescription className="text-base">
            Your Google Sheet has been set up with the proper structure for call tracking.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Your sheet now includes these tabs: <strong>Answered</strong>, <strong>No Answer</strong>, <strong>Call back</strong>, <strong>Wrong Number</strong>, <strong>Busy</strong>, and <strong>Failed</strong>.
            </AlertDescription>
          </Alert>

          <Button onClick={handleOpenSheet} size="lg" className="w-full gap-2">
            <ExternalLink className="h-4 w-4" />
            Open Sheet
          </Button>

          <div className="flex items-center space-x-2">
            <Checkbox id="contacts" checked={contactsAdded} onCheckedChange={handleContactsChange} />
            <label
              htmlFor="contacts"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I've added contacts to the sheet
            </label>
          </div>

          <Button onClick={handleStartCalling} disabled={!contactsAdded} size="lg" className="w-full">
            Start Calling
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
