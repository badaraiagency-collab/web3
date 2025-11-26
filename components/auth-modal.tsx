"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuth } from "@/lib/auth-context"
import { loginSchema, type LoginFormData } from "@/lib/auth-schemas"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Eye, EyeOff, Mail, Lock, ArrowLeft, UserPlus, Key, Sparkles } from "lucide-react"

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultView?: AuthView
}

type AuthView = 'login' | 'signup' | 'forgot-password'

export function AuthModal({ open, onOpenChange, defaultView = 'login' }: AuthModalProps) {
  const [currentView, setCurrentView] = useState<AuthView>(defaultView)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const { login, signup, requestPasswordReset } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  // Update view when defaultView changes
  useEffect(() => {
    if (open) {
      setCurrentView(defaultView)
    }
  }, [open, defaultView])

  // Login form
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // Signup form
  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    full_name: "",
  })

  // Forgot password form
  const [resetEmail, setResetEmail] = useState("")
  const [resetEmailSent, setResetEmailSent] = useState(false)

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      await login(data.email, data.password)
      toast({
        title: "Success!",
        description: "You have been logged in successfully.",
      })
      onOpenChange(false)
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "An error occurred during login.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async () => {
    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      })
      return
    }

    if (signupData.password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await signup(signupData.email, signupData.password, signupData.full_name)
      toast({
        title: "Success!",
        description: "Your account has been created successfully. Please log in.",
      })
      // Pre-fill email in login form and switch to login view
      const signupEmail = signupData.email
      setSignupData({ email: "", password: "", confirmPassword: "", full_name: "" })
      setCurrentView('login')
      // Pre-fill the email in login form
      loginForm.setValue("email", signupEmail)
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: error instanceof Error ? error.message : "An error occurred during signup.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordReset = async () => {
    if (!resetEmail) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await requestPasswordReset(resetEmail)
      setResetEmailSent(true)
      toast({
        title: "Reset Email Sent",
        description: "Check your email for password reset instructions.",
      })
    } catch (error) {
      toast({
        title: "Reset Failed",
        description: error instanceof Error ? error.message : "An error occurred while sending reset email.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const goBackToLogin = () => {
    setCurrentView('login')
    setResetEmailSent(false)
    setSignupData({ email: "", password: "", confirmPassword: "", full_name: "" })
    setResetEmail("")
  }

  const renderLoginView = () => (
    <div className="space-y-6">
      <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="login-email" className="text-sm font-medium">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="login-email"
              type="email"
              placeholder="Enter your email"
              className="pl-10 h-11 border-2 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all duration-200"
              {...loginForm.register("email")}
            />
          </div>
          {loginForm.formState.errors.email && (
            <p className="text-sm text-destructive flex items-center gap-1">
              {loginForm.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="login-password" className="text-sm font-medium">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="pl-10 pr-10 h-11 border-2 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all duration-200"
              {...loginForm.register("password")}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          {loginForm.formState.errors.password && (
            <p className="text-sm text-destructive flex items-center gap-1">
              {loginForm.formState.errors.password.message}
            </p>
          )}
        </div>

        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white w-full h-11 text-base font-semibold shadow-md hover:shadow-lg transition-all" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => setCurrentView('signup')}
          className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 w-full h-11 text-base font-semibold"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Create New Account
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          onClick={() => setCurrentView('forgot-password')}
          className="w-full h-11 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        >
          <Key className="mr-2 h-4 w-4" />
          Forgot Password?
        </Button>
      </div>
    </div>
  )

  const renderSignupView = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="signup-fullname" className="text-sm font-medium">Full Name</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="signup-fullname"
              type="text"
              placeholder="Enter your full name"
              className="pl-10 h-11 border-2 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all duration-200"
              value={signupData.full_name}
              onChange={(e) => setSignupData({ ...signupData, full_name: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-email" className="text-sm font-medium">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="signup-email"
              type="email"
              placeholder="Enter your email"
              className="pl-10 h-11 border-2 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all duration-200"
              value={signupData.email}
              onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-password" className="text-sm font-medium">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              className="pl-10 pr-10 h-11 border-2 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all duration-200"
              value={signupData.password}
              onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-confirm-password" className="text-sm font-medium">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="signup-confirm-password"
              type={showPassword ? "text" : "password"}
              placeholder="Confirm your password"
              className="pl-10 h-11 border-2 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all duration-200"
              value={signupData.confirmPassword}
              onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
            />
          </div>
        </div>

        <Button 
          onClick={handleSignup} 
          className="bg-blue-600 hover:bg-blue-700 text-white w-full h-11 text-base font-semibold shadow-md hover:shadow-lg transition-all" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </div>

      <Button
        type="button"
        variant="ghost"
        onClick={goBackToLogin}
        className="w-full h-11 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Sign In
      </Button>
    </div>
  )

  const renderForgotPasswordView = () => (
    <div className="space-y-6">
      {!resetEmailSent ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reset-email" className="text-sm font-medium">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="reset-email"
                type="email"
                placeholder="Enter your email"
                className="pl-10 h-11 border-2 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all duration-200"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
            </div>
          </div>

          <Button 
            onClick={handlePasswordReset} 
            className="bg-blue-600 hover:bg-blue-700 text-white w-full h-11 text-base font-semibold shadow-md hover:shadow-lg transition-all" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending reset email...
              </>
            ) : (
              "Send Reset Email"
            )}
          </Button>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <Mail className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Check Your Email</h3>
            <p className="text-sm text-muted-foreground">
              We've sent password reset instructions to your email address.
            </p>
          </div>
        </div>
      )}

      <Button
        type="button"
        variant="ghost"
        onClick={goBackToLogin}
        className="w-full h-11 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Sign In
      </Button>
    </div>
  )

  const getTitle = () => {
    switch (currentView) {
      case 'login':
        return 'Welcome Back'
      case 'signup':
        return 'Create Account'
      case 'forgot-password':
        return 'Reset Password'
      default:
        return 'Welcome Back'
    }
  }

  const getDescription = () => {
    switch (currentView) {
      case 'login':
        return 'Sign in to access your calling dashboard and start automating your outreach.'
      case 'signup':
        return 'Create a new account to get started with CallSheet.'
      case 'forgot-password':
        return 'Enter your email to receive password reset instructions.'
      default:
        return 'Sign in to access your calling dashboard and start automating your outreach.'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 text-center border-b">
          <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-medium mb-4 border border-primary/30">
            <Sparkles className="h-3 w-3" />
            AI-Powered Platform
          </div>
          <DialogTitle className="text-2xl font-bold">{getTitle()}</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground mt-2">
            {getDescription()}
          </DialogDescription>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentView === 'login' && renderLoginView()}
          {currentView === 'signup' && renderSignupView()}
          {currentView === 'forgot-password' && renderForgotPasswordView()}

          <p className="text-xs text-muted-foreground text-center mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
