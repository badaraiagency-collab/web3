"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useNavigation } from "@/lib/navigation-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogoutButton } from "./logout-button"
import { User, Mic, Brain, Menu, X } from "lucide-react"

interface NavbarProps {
  onAuthClick: () => void
}

export function Navbar({ onAuthClick }: NavbarProps) {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const { navigateTo, currentPage } = useNavigation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const getDisplayName = () => {
    if (user?.name) return user.name
    return user?.email?.split('@')[0] || 'User'
  }

  const getInitials = () => {
    const name = getDisplayName()
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const handleNavigation = (path: string) => {
    if (path === currentPage) {
      // If clicking on current page, refresh the data
      console.log(`[Navbar] Refreshing current page: ${path}`)
      navigateTo(path, true)
    } else {
      // Navigate to new page
      console.log(`[Navbar] Navigating to new page: ${path}`)
      navigateTo(path)
    }
  }

  return (
    <nav className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <div 
              className="cursor-pointer flex items-center"
              onClick={() => router.push('/')}
            >
              <img 
                src="/badarai-logo.png" 
                alt="BadarAI Logo" 
                className="w-12 h-12 md:w-16 md:h-16 object-contain"
              />
            </div>
          </div>

          {/* Navigation Links - Only show when authenticated */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-6">
              <Button
                variant="ghost"
                onClick={() => handleNavigation('/dashboard')}
                className={`font-medium transition-colors ${
                  currentPage === '/dashboard' 
                    ? 'text-blue-600 hover:text-blue-700' 
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Dashboard
              </Button>

              <Button
                variant="ghost"
                onClick={() => handleNavigation('/knowledge-base')}
                className={`font-medium transition-colors ${
                  currentPage === '/knowledge-base' 
                    ? 'text-blue-600 hover:text-blue-700' 
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                <Brain className="mr-2 h-4 w-4" />
                Knowledge Base
              </Button>

              <Button
                variant="ghost"
                onClick={() => handleNavigation('/voice-clone')}
                className={`font-medium transition-colors ${
                  currentPage === '/voice-clone' 
                    ? 'text-blue-600 hover:text-blue-700' 
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                <Mic className="mr-2 h-4 w-4" />
                Voice Clone
              </Button>


            </div>
          )}

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage 
                          src="" 
                          alt={getDisplayName()} 
                        />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {getDisplayName()}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    {/* Sign Out */}
                    <LogoutButton />
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Mobile Menu Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </>
            ) : (
              <>
                {/* Unauthenticated Links */}
                <div className="hidden md:flex items-center space-x-4">
                  <Button variant="ghost" className="text-sm">
                    Pricing
                  </Button>
                  <Button variant="ghost" className="text-sm">
                    Docs
                  </Button>
                </div>
                
                {/* Sign In Button */}
                <Button onClick={onAuthClick} className="btn-primary">
                  Sign In
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu for Authenticated Users */}
        {isAuthenticated && mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t pt-4">
            <div className="flex flex-col space-y-2">
              <Button
                variant="ghost"
                onClick={() => {
                  handleNavigation('/dashboard');
                  setMobileMenuOpen(false);
                }}
                className={`w-full justify-start font-medium transition-colors ${
                  currentPage === '/dashboard' 
                    ? 'text-blue-600 hover:text-blue-700' 
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Dashboard
              </Button>

              <Button
                variant="ghost"
                onClick={() => {
                  handleNavigation('/knowledge-base');
                  setMobileMenuOpen(false);
                }}
                className={`w-full justify-start font-medium transition-colors ${
                  currentPage === '/knowledge-base' 
                    ? 'text-blue-600 hover:text-blue-700' 
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                <Brain className="mr-2 h-4 w-4" />
                Knowledge Base
              </Button>

              <Button
                variant="ghost"
                onClick={() => {
                  handleNavigation('/voice-clone');
                  setMobileMenuOpen(false);
                }}
                className={`w-full justify-start font-medium transition-colors ${
                  currentPage === '/voice-clone' 
                    ? 'text-blue-600 hover:text-blue-700' 
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                <Mic className="mr-2 h-4 w-4" />
                Voice Clone
              </Button>

            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
