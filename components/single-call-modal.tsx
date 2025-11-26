"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Phone, Loader2 } from "lucide-react"
import { apiService, type SingleCallRequest, type SubscriptionData } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface SingleCallModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
}

export function SingleCallModal({ open, onOpenChange, userId }: SingleCallModalProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingConfig, setIsLoadingConfig] = useState(false)
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(false)
  const [savedPhoneNumber, setSavedPhoneNumber] = useState<string | null>(null)
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [formData, setFormData] = useState({
    phone_number: "",
    name: "",
    company_name: "",
  })
  const [phoneError, setPhoneError] = useState<string>("")

  // Load subscription when modal opens
  useEffect(() => {
    const loadSubscription = async () => {
      if (!open) return
      
      setIsLoadingSubscription(true)
      try {
        const subscriptionResult = await apiService.getSubscription({
          showToast: false,
          forceRefresh: false
        })
        
        if (subscriptionResult.success && subscriptionResult.data) {
          setSubscription(subscriptionResult.data)
        } else {
          setSubscription(null)
        }
      } catch (error) {
        setSubscription(null)
      } finally {
        setIsLoadingSubscription(false)
      }
    }

    loadSubscription()
  }, [open])

  // Load phone_number from configuration when modal opens
  useEffect(() => {
    const loadConfiguration = async () => {
      if (!open) {
        // Reset all form state when modal closes
        setFormData({
          phone_number: "",
          name: "",
          company_name: "",
        })
        setPhoneError("")
        setIsLoading(false)
        setIsLoadingConfig(false)
        return
      }
      
      setIsLoadingConfig(true)
      try {
        const config = await apiService.getConfiguration({
          showToast: false,
          forceRefresh: false
        })
        
        if (config.success && config.configuration?.phone_number) {
          setSavedPhoneNumber(config.configuration.phone_number)
          // Store in localStorage for later use
          localStorage.setItem('userPhoneNumber', config.configuration.phone_number)
        } else {
          // Try to get from localStorage as fallback
          const stored = localStorage.getItem('userPhoneNumber')
          if (stored) {
            setSavedPhoneNumber(stored)
          }
        }
      } catch (error) {
        // Try to get from localStorage as fallback
        const stored = localStorage.getItem('userPhoneNumber')
        if (stored) {
          setSavedPhoneNumber(stored)
        }
      } finally {
        setIsLoadingConfig(false)
      }
    }

    loadConfiguration()
  }, [open])

  // Validate phone number format
  const validatePhoneNumber = (phone: string): { isValid: boolean; error: string; cleaned: string } => {
    if (!phone || !phone.trim()) {
      return { isValid: false, error: "Phone number is required", cleaned: "" }
    }

    // Remove all non-digit characters except +
    let cleaned = phone.replace(/[^\d+]/g, '')
    
    // Check if it starts with +
    if (!cleaned.startsWith('+')) {
      return { 
        isValid: false, 
        error: "Phone number must include country code with + prefix (e.g., +12083300747)", 
        cleaned: "" 
      }
    }

    // Remove the + for validation
    const digitsOnly = cleaned.substring(1)
    
    // Check minimum length (country code + at least 7 digits for local number)
    if (digitsOnly.length < 8) {
      return { 
        isValid: false, 
        error: "Phone number is too short. Include country code and complete number (e.g., +12083300747)", 
        cleaned: "" 
      }
    }

    // Check maximum length (E.164 format: max 15 digits)
    if (digitsOnly.length > 15) {
      return { 
        isValid: false, 
        error: "Phone number is too long. Maximum 15 digits allowed", 
        cleaned: "" 
      }
    }

    // Validate country code (first 1-3 digits should be valid country code)
    const firstDigit = digitsOnly[0]
    
    // Country codes start with 1-9 (not 0)
    if (firstDigit === '0') {
      return { 
        isValid: false, 
        error: "Invalid country code. Country codes cannot start with 0", 
        cleaned: "" 
      }
    }

    // Check if it's a valid format (all digits after +)
    if (!/^\d+$/.test(digitsOnly)) {
      return { 
        isValid: false, 
        error: "Phone number can only contain digits after country code", 
        cleaned: "" 
      }
    }

    return { isValid: true, error: "", cleaned: digitsOnly }
  }

  // Check if form is valid
  const phoneValidation = validatePhoneNumber(formData.phone_number)
  const isFormValid = formData.name.trim() !== "" && 
                      formData.company_name.trim() !== "" && 
                      formData.phone_number.trim() !== "" &&
                      phoneValidation.isValid

  const performCall = async (cleanedPhoneNumber: string, phoneNumberToUse: string) => {
    setIsLoading(true)

    try {
      // Extract country code (first 2 characters) and sip_call_from (remaining)
      const countryCode = phoneNumberToUse.substring(0, 2)
      const sipCallFrom = phoneNumberToUse.substring(2)

      const requestData: SingleCallRequest = {
        user_id: userId,
        phone_number: cleanedPhoneNumber,
        sip_call_from: sipCallFrom,
        name: formData.name.trim(),
        company_name: formData.company_name.trim(),
        country_code: countryCode,
      }

      const response = await apiService.singleCall(requestData, {
        showToast: false,
      })

      if (response.status === "success") {
        toast({
          title: "Call Initiated Successfully",
          description: response.message || "Your call has been initiated.",
        })
        
        // Reset form but keep modal open so user can make another call
        setFormData({
          phone_number: "",
          name: "",
          company_name: "",
        })
        setPhoneError("")
      } else {
        toast({
          title: "Call Initiation Failed",
          description: response.message || "Failed to initiate call. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.errorResult?.message || "Failed to initiate call. Please try again."
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Validate phone number
    const phoneValidation = validatePhoneNumber(formData.phone_number)
    
    if (!phoneValidation.isValid) {
      setPhoneError(phoneValidation.error)
      toast({
        title: "Validation Error",
        description: phoneValidation.error || "Please enter a valid phone number with country code.",
        variant: "destructive",
      })
      return
    }

    if (!formData.name.trim() || !formData.company_name.trim()) {
      toast({
        title: "Validation Error",
        description: "Name and Company Name are required fields.",
        variant: "destructive",
      })
      return
    }

    // Use the cleaned phone number (digits only, without +)
    const cleanedPhoneNumber = phoneValidation.cleaned

    if (!savedPhoneNumber) {
      toast({
        title: "Configuration Error",
        description: "Phone number not configured. Please configure your phone number first.",
        variant: "destructive",
      })
      return
    }

    await performCall(cleanedPhoneNumber, savedPhoneNumber)
  }

  const handleChange = (field: keyof typeof formData) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))

      // Validate phone number in real-time
      if (field === "phone_number") {
        const validation = validatePhoneNumber(value)
        setPhoneError(validation.error)
      }
    }
  }

  const handleInitiateCall = async () => {
    // Validate phone number
    const phoneValidation = validatePhoneNumber(formData.phone_number)
    
    if (!phoneValidation.isValid) {
      setPhoneError(phoneValidation.error)
      toast({
        title: "Validation Error",
        description: phoneValidation.error || "Please enter a valid phone number with country code.",
        variant: "destructive",
      })
      return
    }

    if (!formData.name.trim() || !formData.company_name.trim()) {
      toast({
        title: "Validation Error",
        description: "Name and Company Name are required fields.",
        variant: "destructive",
      })
      return
    }

    // Use the cleaned phone number (digits only, without +)
    const cleanedPhoneNumber = phoneValidation.cleaned

    // If savedPhoneNumber is null, try to reload configuration
    let phoneNumberToUse = savedPhoneNumber
    if (!phoneNumberToUse) {
      setIsLoadingConfig(true)
      try {
        const config = await apiService.getConfiguration({
          showToast: false,
          forceRefresh: true
        })
        
        if (config.success && config.configuration?.phone_number) {
          phoneNumberToUse = config.configuration.phone_number
          setSavedPhoneNumber(phoneNumberToUse)
          localStorage.setItem('userPhoneNumber', phoneNumberToUse)
        } else {
          // Try localStorage as fallback
          const stored = localStorage.getItem('userPhoneNumber')
          if (stored) {
            phoneNumberToUse = stored
            setSavedPhoneNumber(stored)
          }
        }
      } catch (error) {
        // Try localStorage as fallback
        const stored = localStorage.getItem('userPhoneNumber')
        if (stored) {
          phoneNumberToUse = stored
          setSavedPhoneNumber(stored)
        }
      } finally {
        setIsLoadingConfig(false)
      }
    }

    if (!phoneNumberToUse) {
      toast({
        title: "Configuration Error",
        description: "Phone number not configured. Please configure your phone number in settings first.",
        variant: "destructive",
      })
      return
    }

    await performCall(cleanedPhoneNumber, phoneNumberToUse)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-blue-600" />
            Initiate Single Call
          </DialogTitle>
          <DialogDescription>
            Make a single call to a phone number. Fill in the required information below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="e.g., John Doe"
              value={formData.name}
              onChange={handleChange("name")}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company_name">
              Company Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="company_name"
              type="text"
              placeholder="e.g., Acme Corp"
              value={formData.company_name}
              onChange={handleChange("company_name")}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone_number">
              Phone Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone_number"
              type="tel"
              placeholder="e.g., +12083300747"
              value={formData.phone_number}
              onChange={handleChange("phone_number")}
              required
              disabled={isLoading}
              className={phoneError ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {phoneError ? (
              <p className="text-xs text-red-500">
                {phoneError}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Enter complete phone number with country code (e.g., +12083300747 for US, +442071234567 for UK)
              </p>
            )}
          </div>

          {savedPhoneNumber && (
            <div className="text-xs text-muted-foreground bg-blue-50 p-2 rounded">
              Using configured phone number: {savedPhoneNumber}
            </div>
          )}

          {isLoadingConfig && (
            <div className="text-xs text-muted-foreground bg-gray-50 p-2 rounded">
              Loading configuration...
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="button"
              disabled={isLoading || !isFormValid || isLoadingConfig}
              onClick={handleInitiateCall}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Initiating...
                </>
              ) : (
                <>
                  <Phone className="mr-2 h-4 w-4" />
                  Initiate Call
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
