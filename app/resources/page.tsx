"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AuthModal } from "@/components/auth-modal"
import { useAuth } from "@/lib/auth-context"
import { Phone, BookOpen, FileText, Video, HelpCircle, MessageCircle, Download, ExternalLink, ArrowRight, Mail, MapPin, Menu, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { AutomationServicesDropdown } from "@/components/automation-services-dropdown"
import { Footer } from "@/components/footer"

export default function ResourcesPage() {
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
              <span className="relative inline-block">
                Resources
                <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400"></span>
              </span> & Support
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Everything you need to succeed with BadarAI - guides, tutorials, documentation, and support
            </p>
          </div>
        </section>

        {/* Quick Links */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-6">
              <a href="#documentation" className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 hover:shadow-lg transition-all group">
                <BookOpen className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Documentation</h3>
                <p className="text-gray-600 text-sm group-hover:text-gray-900">Complete API reference and guides</p>
              </a>
              
              <a href="#tutorials" className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 hover:shadow-lg transition-all group">
                <Video className="w-12 h-12 text-green-600 mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Video Tutorials</h3>
                <p className="text-gray-600 text-sm group-hover:text-gray-900">Step-by-step video guides</p>
              </a>
              
              <a href="#faq" className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 hover:shadow-lg transition-all group">
                <HelpCircle className="w-12 h-12 text-purple-600 mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">FAQ</h3>
                <p className="text-gray-600 text-sm group-hover:text-gray-900">Common questions answered</p>
              </a>
              
              <a href="#support" className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 hover:shadow-lg transition-all group">
                <MessageCircle className="w-12 h-12 text-orange-600 mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Support</h3>
                <p className="text-gray-600 text-sm group-hover:text-gray-900">Get help from our team</p>
              </a>
            </div>
          </div>
        </section>

        {/* Documentation Section */}
        <section id="documentation" className="container mx-auto px-4 py-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                <span className="text-blue-600">Documentation</span>
              </h2>
              <p className="text-xl text-gray-600">
                Comprehensive guides to help you integrate and use BadarAI
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link href="/contact" className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all cursor-pointer block">
                <FileText className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Getting Started</h3>
                <p className="text-gray-600 mb-4">Quick start guide to set up your first AI agent in minutes</p>
                <span className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-2">
                  Read Guide
                  <ExternalLink className="w-4 h-4" />
                </span>
              </Link>

              <Link href="/contact" className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all cursor-pointer block">
                <FileText className="w-10 h-10 text-green-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">API Reference</h3>
                <p className="text-gray-600 mb-4">Complete REST API documentation with code examples</p>
                <span className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-2">
                  View Docs
                  <ExternalLink className="w-4 h-4" />
                </span>
              </Link>

              <Link href="/contact" className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all cursor-pointer block">
                <FileText className="w-10 h-10 text-purple-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Integrations</h3>
                <p className="text-gray-600 mb-4">Connect BadarAI with your favorite tools and platforms</p>
                <span className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-2">
                  Explore
                  <ExternalLink className="w-4 h-4" />
                </span>
              </Link>

              <Link href="/contact" className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all cursor-pointer block">
                <FileText className="w-10 h-10 text-orange-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Google Sheets Setup</h3>
                <p className="text-gray-600 mb-4">Learn how to connect and manage contacts via Google Sheets</p>
                <span className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-2">
                  Learn More
                  <ExternalLink className="w-4 h-4" />
                </span>
              </Link>

              <Link href="/contact" className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all cursor-pointer block">
                <FileText className="w-10 h-10 text-pink-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Voice Customization</h3>
                <p className="text-gray-600 mb-4">Clone voices and customize your AI agent's personality</p>
                <span className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-2">
                  Read Guide
                  <ExternalLink className="w-4 h-4" />
                </span>
              </Link>

              <Link href="/contact" className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all cursor-pointer block">
                <FileText className="w-10 h-10 text-cyan-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Best Practices</h3>
                <p className="text-gray-600 mb-4">Tips and tricks to maximize your AI calling success</p>
                <span className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-2">
                  View Tips
                  <ExternalLink className="w-4 h-4" />
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* Video Tutorials */}
        <section id="tutorials" className="container mx-auto px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                Video <span className="text-green-600">Tutorials</span>
              </h2>
              <p className="text-xl text-gray-600">
                Watch and learn from our step-by-step video guides
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Link href="/contact" className="bg-gray-100 rounded-xl overflow-hidden group cursor-pointer block">
                <div className="aspect-video bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Video className="w-10 h-10 text-white" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Getting Started with BadarAI</h3>
                  <p className="text-gray-600">5-minute tutorial on setting up your first AI calling campaign</p>
                </div>
              </Link>

              <Link href="/contact" className="bg-gray-100 rounded-xl overflow-hidden group cursor-pointer block">
                <div className="aspect-video bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Video className="w-10 h-10 text-white" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Google Sheets Integration</h3>
                  <p className="text-gray-600">Learn how to connect and sync your contacts automatically</p>
                </div>
              </Link>

              <Link href="/contact" className="bg-gray-100 rounded-xl overflow-hidden group cursor-pointer block">
                <div className="aspect-video bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Video className="w-10 h-10 text-white" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Voice Cloning Tutorial</h3>
                  <p className="text-gray-600">Create custom AI voices that sound like your brand</p>
                </div>
              </Link>

              <Link href="/contact" className="bg-gray-100 rounded-xl overflow-hidden group cursor-pointer block">
                <div className="aspect-video bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Video className="w-10 h-10 text-white" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Analytics & Reporting</h3>
                  <p className="text-gray-600">Track your campaign performance and optimize results</p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="container mx-auto px-4 py-20 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                Frequently Asked <span className="text-purple-600">Questions</span>
              </h2>
              <p className="text-xl text-gray-600">
                Find answers to common questions about BadarAI
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "How quickly can I get started with BadarAI?",
                  a: "You can start making AI-powered calls in as little as 5 minutes. Simply sign up, connect your Google Sheets or upload contacts, and configure your AI agent settings."
                },
                {
                  q: "Does BadarAI support multiple languages?",
                  a: "Yes! BadarAI supports over 30 languages and can automatically detect and respond in the customer's preferred language."
                },
                {
                  q: "How much does BadarAI cost?",
                  a: "Pricing is based on usage. Plans start at $99/month for up to 1,000 minutes. We also offer custom enterprise plans for high-volume users."
                },
                {
                  q: "Can I integrate BadarAI with my CRM?",
                  a: "Absolutely! BadarAI offers native integrations with popular CRMs like Salesforce, HubSpot, and Zoho. We also provide a REST API for custom integrations."
                },
                {
                  q: "Is BadarAI HIPAA compliant?",
                  a: "Yes, BadarAI is fully HIPAA compliant and suitable for healthcare organizations. We follow strict data security and privacy protocols."
                },
                {
                  q: "What kind of support do you offer?",
                  a: "We offer 24/7 email support for all users, priority phone support for premium plans, and dedicated account managers for enterprise customers."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-md">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section id="support" className="container mx-auto px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                Need <span className="text-orange-600">Help?</span>
              </h2>
              <p className="text-xl text-gray-600">
                Our support team is here to help you succeed
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white border-2 border-blue-200 rounded-2xl p-8 text-center hover:shadow-xl transition-all">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Live Chat</h3>
                <p className="text-gray-600 mb-6">Get instant answers from our support team</p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Start Chat
                </Button>
              </div>

              <div className="bg-white border-2 border-green-200 rounded-2xl p-8 text-center hover:shadow-xl transition-all">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Phone Support</h3>
                <p className="text-gray-600 mb-6">Talk to our experts directly</p>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  Call Now
                </Button>
              </div>

              <div className="bg-white border-2 border-purple-200 rounded-2xl p-8 text-center hover:shadow-xl transition-all">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Resources</h3>
                <p className="text-gray-600 mb-6">Download guides and templates</p>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  Browse Resources
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20 bg-gradient-to-r from-blue-600 to-cyan-500">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-10 opacity-90">
              Join thousands of businesses using BadarAI to automate their calls
            </p>
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold"
              onClick={handleGetStarted}
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </section>
      </main>

      <Footer />

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} defaultView={authMode} />
    </div>
  )
}

