"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AuthModal } from "@/components/auth-modal"
import { useAuth } from "@/lib/auth-context"
import { Phone, Palette, Code, Users, DollarSign, Shield, Zap, CheckCircle2, ArrowRight, Crown, TrendingUp, Mail, MapPin, Menu, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { AutomationServicesDropdown } from "@/components/automation-services-dropdown"
import { Footer } from "@/components/footer"

export default function WhiteLabelPage() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  const handleLogin = () => {
    setAuthMode('login')
    setShowAuthModal(true)
  }

  const handleSignup = () => {
    setAuthMode('signup')
    setShowAuthModal(true)
  }

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push('/dashboard')
    } else {
      handleSignup()
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navbar */}
      <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 md:gap-8">
              <Link href="/" className="flex items-center">
                <Image 
                  src="/badarai-logo.png" 
                  alt="BadarAI Logo" 
                  width={70} 
                  height={70}
                  className="w-12 h-12 md:w-16 md:h-16 object-contain"
                />
              </Link>
              <div className="hidden md:block">
                <AutomationServicesDropdown />
              </div>
            </div>
            <nav className="hidden lg:flex items-center gap-8">
              <Link href="/solution" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">Solution</Link>
              <Link href="/industries" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">Industries</Link>
              <Link href="/white-label" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">White Label</Link>
              <Link href="/resources" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">Resources</Link>
            </nav>
            <div className="flex items-center gap-3">
              <Button variant="ghost" className="hidden sm:flex text-gray-700 hover:text-gray-900 font-medium" onClick={handleLogin}>Login</Button>
              <Button className="hidden sm:flex bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md hover:shadow-lg transition-all" onClick={handleSignup}>Sign Up</Button>
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t pt-4">
              <div className="flex flex-col space-y-4">
                <div className="md:hidden">
                  <AutomationServicesDropdown />
                </div>
                <Link href="/solution" className="text-gray-700 hover:text-gray-900 font-medium transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>Solution</Link>
                <Link href="/industries" className="text-gray-700 hover:text-gray-900 font-medium transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>Industries</Link>
                <Link href="/white-label" className="text-gray-700 hover:text-gray-900 font-medium transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>White Label</Link>
                <Link href="/resources" className="text-gray-700 hover:text-gray-900 font-medium transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>Resources</Link>
                <div className="sm:hidden flex flex-col gap-2 pt-2">
                  <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-gray-900 font-medium" onClick={() => { handleLogin(); setMobileMenuOpen(false); }}>Login</Button>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold" onClick={() => { handleSignup(); setMobileMenuOpen(false); }}>Sign Up</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Crown className="w-4 h-4" />
                Partner Program
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                <span className="relative inline-block">
                  White Label
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-400"></span>
                </span> AI Calling Platform
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Build your own AI calling service with BadarAI's white-label solution. 
                Complete branding control, dedicated infrastructure, and enterprise support.
              </p>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-8 py-6 text-lg font-semibold"
                onClick={handleGetStarted}
              >
                Become a Partner
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>

            {/* Partner Benefits Grid */}
            <div className="grid md:grid-cols-3 gap-8 mt-16">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">70%</div>
                <p className="text-gray-700 font-medium">Revenue Share</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
                <p className="text-gray-700 font-medium">Brand Control</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
                <p className="text-gray-700 font-medium">Technical Support</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                Everything You Need to <span className="text-purple-600">Launch Your Service</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Get a complete white-label platform with all the tools and support to succeed
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Link href="/contact" className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all cursor-pointer block">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <Palette className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Full Branding</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Complete customization of logos, colors, and domain names. Make it truly yours.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">Custom domain & subdomain</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">Logo & color customization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">Custom email templates</span>
                  </li>
                </ul>
              </Link>

              <Link href="/contact" className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all cursor-pointer block">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <Code className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">API & SDK Access</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Full API access to integrate with your existing systems and workflows.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">RESTful API</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">Webhooks support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">Developer documentation</span>
                  </li>
                </ul>
              </Link>

              <Link href="/contact" className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all cursor-pointer block">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Multi-Tenant Platform</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Manage unlimited clients with isolated environments and dedicated resources.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">Client management dashboard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">Isolated data storage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">Usage tracking & billing</span>
                  </li>
                </ul>
              </Link>

              <Link href="/contact" className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all cursor-pointer block">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Flexible Pricing</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Set your own pricing and billing terms. We handle the infrastructure.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">Custom pricing plans</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">Automated billing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">Revenue analytics</span>
                  </li>
                </ul>
              </Link>

              <Link href="/contact" className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all cursor-pointer block">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Enterprise Security</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Bank-grade security with SOC 2 Type II and HIPAA compliance.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">SOC 2 Type II certified</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">HIPAA compliant</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">Data encryption</span>
                  </li>
                </ul>
              </Link>

              <Link href="/contact" className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all cursor-pointer block">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center mb-6">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Dedicated Support</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Get priority technical support and account management for your team.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">Dedicated account manager</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">Priority support tickets</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">Training & onboarding</span>
                  </li>
                </ul>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20 bg-gradient-to-r from-purple-600 to-pink-500">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Build Your AI Empire?
            </h2>
            <p className="text-xl mb-10 opacity-90">
              Join our partner program and start offering AI calling services under your brand
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-yellow-400 hover:bg-yellow-500 text-purple-900 px-8 py-6 text-lg font-semibold shadow-lg transition-all"
                onClick={handleGetStarted}
              >
                Become a Partner
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-white text-white bg-transparent hover:bg-yellow-400 hover:border-yellow-400 hover:text-purple-900 px-8 py-6 text-lg font-semibold transition-all"
                onClick={() => router.push('/contact')}
              >
                Schedule a Call
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} defaultView={authMode} />
    </div>
  )
}

