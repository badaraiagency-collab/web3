"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AuthModal } from "@/components/auth-modal"
import { useAuth } from "@/lib/auth-context"
import { Phone, MessageSquare, Calendar, Bot, Headphones, TrendingUp, Users, Clock, CheckCircle2, ArrowRight, Mail, MapPin, Menu, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { AutomationServicesDropdown } from "@/components/automation-services-dropdown";
import { Footer } from "@/components/footer"

export default function SolutionPage() {
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
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Complete <span className="relative inline-block">
                AI Solutions
                <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400"></span>
              </span> for Your Business
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              From inbound customer service to outbound sales campaigns, BadarAI provides comprehensive 
              AI-powered calling solutions tailored to your business needs.
            </p>
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg font-semibold"
              onClick={handleGetStarted}
            >
              Get Started Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </section>

        {/* Solutions Grid */}
        <section className="container mx-auto px-4 py-16 bg-gradient-to-br from-blue-50 to-cyan-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                Our <span className="text-blue-600">Solutions</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Powerful AI-driven solutions designed to automate and optimize your business communications
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Inbound Calls */}
              <Link href="/contact" className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer block">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Inbound Call Handling</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Answer customer calls 24/7 with natural AI conversations. Handle FAQs, bookings, and routing with human-like interactions.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">24/7 availability</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Natural conversations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Instant call routing</span>
                  </li>
                </ul>
              </Link>

              {/* Outbound Calls */}
              <Link href="/contact" className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer block">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Outbound Campaigns</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Scale your outreach with automated calling campaigns. Connect with leads, follow up with customers, and grow your business.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Google Sheets integration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Smart scheduling</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Real-time analytics</span>
                  </li>
                </ul>
              </Link>

              {/* Appointment Booking */}
              <Link href="/contact" className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer block">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Appointment Scheduling</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Automate appointment bookings with calendar integration. Reduce no-shows with smart reminders and confirmations.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Calendar sync</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Automated reminders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Rescheduling support</span>
                  </li>
                </ul>
              </Link>

              {/* Customer Support */}
              <Link href="/contact" className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer block">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6">
                  <Headphones className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Customer Support</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Provide instant support with AI agents trained on your knowledge base. Resolve issues faster and improve satisfaction.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Custom knowledge base</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Multi-language support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Ticket integration</span>
                  </li>
                </ul>
              </Link>

              {/* Lead Qualification */}
              <Link href="/contact" className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer block">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Lead Qualification</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Pre-qualify leads automatically before routing to your sales team. Focus on high-value prospects and close more deals.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Smart qualification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">CRM integration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Priority scoring</span>
                  </li>
                </ul>
              </Link>

              {/* Voice Broadcasting */}
              <Link href="/contact" className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer block">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center mb-6">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Voice Broadcasting</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Send personalized voice messages at scale. Perfect for announcements, reminders, and emergency notifications.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Mass messaging</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Personalization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Delivery reports</span>
                  </li>
                </ul>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                Why Choose <span className="text-blue-600">BadarAI Solutions</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Built with cutting-edge AI technology and designed for maximum business impact
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Human-Like AI</h3>
                <p className="text-gray-600">Natural conversations that customers can't distinguish from humans</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">24/7 Availability</h3>
                <p className="text-gray-600">Never miss a call with round-the-clock AI agents</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Scalable</h3>
                <p className="text-gray-600">Handle unlimited concurrent calls with ease</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Easy Setup</h3>
                <p className="text-gray-600">Get started in 5 minutes with simple integration</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20 bg-gradient-to-r from-blue-600 to-cyan-500">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl mb-10 opacity-90">
              Join thousands of businesses already automating their communications with BadarAI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-6 text-lg font-semibold shadow-lg transition-all"
                onClick={handleGetStarted}
              >
                Start Free Trial
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-white text-white bg-transparent hover:bg-cyan-500 hover:border-cyan-500 px-8 py-6 text-lg font-semibold transition-all"
                onClick={handleSignup}
              >
                Schedule Demo
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

