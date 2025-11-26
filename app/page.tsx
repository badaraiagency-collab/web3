"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth-modal";
import { useAuth } from "@/lib/auth-context";
import {
  Phone,
  Clock,
  Zap,
  CheckCircle2,
  Star,
  PhoneCall,
  AlertCircle,
  Sheet,
  BarChart3,
  TrendingUp,
  ArrowRight,
  Mail,
  MapPin,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AutomationServicesDropdown } from "@/components/automation-services-dropdown";
import { Footer } from "@/components/footer";

export default function HomePage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect authenticated users to dashboard
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleLogin = () => {
    setAuthMode("login");
    setShowAuthModal(true);
  };

  const handleSignup = () => {
    setAuthMode("signup");
    setShowAuthModal(true);
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      handleSignup();
    }
  };

  // Don't render the page if user is authenticated (will redirect)
  if (isAuthenticated) {
    return null;
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
              <Link
                href="/solution"
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Solution
              </Link>
              <Link
                href="/industries"
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Industries
              </Link>
              <Link
                href="/white-label"
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                White Label
              </Link>
              <Link
                href="/resources"
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Resources
              </Link>
            </nav>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                className="hidden sm:flex text-gray-700 hover:text-gray-900 font-medium"
                onClick={handleLogin}
              >
                Login
              </Button>
              <Button
                className="hidden sm:flex bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md hover:shadow-lg transition-all"
                onClick={handleSignup}
              >
                Sign Up
              </Button>
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
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
                <Link
                  href="/solution"
                  className="text-gray-700 hover:text-gray-900 font-medium transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Solution
                </Link>
                <Link
                  href="/industries"
                  className="text-gray-700 hover:text-gray-900 font-medium transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Industries
                </Link>
                <Link
                  href="/white-label"
                  className="text-gray-700 hover:text-gray-900 font-medium transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  White Label
                </Link>
                <Link
                  href="/resources"
                  className="text-gray-700 hover:text-gray-900 font-medium transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Resources
                </Link>
                <div className="sm:hidden flex flex-col gap-2 pt-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-700 hover:text-gray-900 font-medium"
                    onClick={() => {
                      handleLogin();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                    onClick={() => {
                      handleSignup();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Sign Up
                  </Button>
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
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 text-center mb-12">
              Your Virtual{" "}
              <span className="relative inline-block">
                Human-Like
                <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-green-400"></span>
              </span>{" "}
              Call Agent
            </h1>

            {/* Main Demo Card */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 text-white mb-12 max-w-4xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Left Column - Live Demo */}
                <div className="space-y-6">
                  <div className="inline-flex items-center bg-slate-800 text-white text-sm px-3 py-1 rounded-full">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    Live Demo
                  </div>
                  <h3 className="text-2xl font-bold">
                    Can't believe?{" "}
                    <span className="text-green-400">Try NOW</span> a free test
                    call
                  </h3>
                  <p className="text-gray-300">
                    Curious how our AI agents work?
                  </p>
                  <p className="text-gray-300">
                    Call our expert agents today — available 24/7 — and let us
                    set up your automation exactly as per your requirements. Our
                    dedicated team ensures a seamless process tailored to your
                    business needs, so you can focus on growth while we handle
                    the technology.
                  </p>
                  <p className="text-gray-400 text-sm">
                    Agent is trained to discuss BadarAI services and book
                    appointments.
                  </p>
                </div>

                {/* Right Column - Call Now */}
                <div className="space-y-6 border-2 border-grey-700/40 rounded-xl p-4">
                  {/* Representative Profile */}
                  <div className="bg-slate-700/40 rounded-xl p-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full"></div>
                        <div className="absolute bottom-0 left-0 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-800">
                          <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">Elena</h4>
                        <p className="text-gray-300 text-sm">
                          BadarAI Representative
                        </p>
                        <span className="text-green-400 text-sm">
                          • Available now
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Call to Action */}
                  <div className="bg-slate-700/60 rounded-xl p-6">
                    <h4 className="font-semibold mb-3 text-white">
                      Call here to setup automation for your business
                    </h4>
                    <a
                      href="tel:+12083300747"
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-xl font-bold mb-4"
                    >
                      <PhoneCall className="w-5 h-5" />
                      +1 (208) 330-0747
                    </a>
                  </div>

                  {/* Call Now Button */}
                  <Button
                    className="w-full bg-gradient-to-r from-blue-500 to-green-400 hover:from-blue-600 hover:to-green-500 text-white font-semibold py-6 text-lg rounded-xl"
                    onClick={() => window.open("tel:+12083300747", "_self")}
                  >
                    <PhoneCall className="w-5 h-5 mr-2" />
                    Call Now for Setup
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>

                  <p className="text-gray-400 text-sm text-center">
                    Speak directly with our automation specialists
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xl text-gray-600 text-center mb-8 max-w-3xl mx-auto">
              Transform your customer service with AI technology that sounds
              completely human. Our calling bot integrates seamlessly with your
              business and starts working immediately.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg font-semibold"
                onClick={handleGetStarted}
              >
                Get Started Now
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg font-semibold"
                onClick={handleSignup}
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </section>

        {/* Google Sheets Integration Section */}
        <section className="container mx-auto px-4 py-16 bg-gradient-to-br from-blue-50 to-cyan-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                Connect Your{" "}
                <span className="text-blue-600">Google Sheets</span> in Seconds
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Add contacts to your Google Sheet, and let BadarAI call them
                automatically. Simple, powerful, and built for scaling your
                outreach.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6">
                  <Sheet className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Set Up Your Sheet
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Connect your existing Google Sheet or create a new one. We'll
                  set up the perfect structure for your contacts automatically.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  AI Makes the Calls
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Our intelligent AI agent handles all your calls with natural
                  conversation, perfect timing, and professional delivery every
                  time.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Track & Optimize
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Monitor your campaigns with detailed analytics, call success
                  rates, and comprehensive reporting in real-time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-4xl md:text-5xl font-bold text-blue-600">
                  10K+
                </div>
                <div className="text-gray-600 font-medium">Active Users</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl md:text-5xl font-bold text-green-600">
                  1M+
                </div>
                <div className="text-gray-600 font-medium">Calls Made</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl md:text-5xl font-bold text-purple-600">
                  95%
                </div>
                <div className="text-gray-600 font-medium">Success Rate</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl md:text-5xl font-bold text-orange-600">
                  24/7
                </div>
                <div className="text-gray-600 font-medium">Support</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Everything You Need to{" "}
                <span className="text-blue-600">Automate Your Calls</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Powerful features designed to streamline your outreach and
                maximize your success rate
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4 bg-blue-50 rounded-xl p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Makes/receives calls like a real agent
                  </h3>
                  <p className="text-gray-600">
                    Natural conversation flow that customers can't distinguish
                    from human agents
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-blue-50 rounded-xl p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Handles FAQs, bookings, reminders
                  </h3>
                  <p className="text-gray-600">
                    Comprehensive customer service capabilities for any business
                    need
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-blue-50 rounded-xl p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Works 24/7 for any business
                  </h3>
                  <p className="text-gray-600">
                    Perfect for call centers, restaurants, salons, and all
                    business types
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-blue-50 rounded-xl p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Setup in just 5 minutes
                  </h3>
                  <p className="text-gray-600">
                    Quick and easy integration with your existing business
                    processes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="container mx-auto px-4 py-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                How <span className="text-blue-600">BadarAI</span> Works
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Get started in minutes with our simple 3-step process
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center space-y-6">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-3xl font-bold shadow-lg">
                  1
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Connect Your Sheet
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Link your Google Sheet or create a new one with our template.
                  Add your contact information and you're ready to go.
                </p>
              </div>

              <div className="text-center space-y-6">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full flex items-center justify-center text-3xl font-bold shadow-lg">
                  2
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  AI Makes the Calls
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Our intelligent AI agent calls your contacts at optimal times
                  with natural conversation and professional delivery.
                </p>
              </div>

              <div className="text-center space-y-6">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-full flex items-center justify-center text-3xl font-bold shadow-lg">
                  3
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Track & Optimize
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Monitor results in real-time, analyze performance, and
                  optimize your campaigns for maximum success.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Business Types */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
              Perfect for Every Business Type
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                "Call Centers",
                "Restaurants",
                "Salons & Spas",
                "Medical Offices",
                "Real Estate",
                "E-commerce",
                "Service Businesses",
                "Retail Stores",
              ].map((business, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-white p-4 rounded-lg border border-gray-200"
                >
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span className="text-gray-900 font-medium">{business}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-600 to-green-400 rounded-2xl p-12 text-white text-center">
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-6 h-6 fill-yellow-300 text-yellow-300"
                  />
                ))}
              </div>
              <blockquote className="text-2xl font-semibold mb-6">
                "BadarAI has completely transformed our customer service. Our
                clients can't tell the difference between our AI agent and human
                staff. Setup was incredibly simple!"
              </blockquote>
              <p className="text-lg">— Michael Levitt</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        defaultView={authMode}
      />
    </div>
  );
}
