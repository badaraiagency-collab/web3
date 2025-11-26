"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth-modal";
import { useAuth } from "@/lib/auth-context";
import {
  Phone,
  ShoppingCart,
  Building,
  Scissors,
  Stethoscope,
  Home,
  Store,
  Wrench,
  CheckCircle2,
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

export default function IndustriesPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

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

  const industries = [
    {
      icon: Phone,
      title: "Call Centers",
      description:
        "Scale your call center operations with AI agents that handle customer inquiries, support tickets, and sales calls with human-like precision.",
      color: "from-blue-500 to-blue-600",
      benefits: [
        "Reduce operational costs by 70%",
        "Handle unlimited concurrent calls",
        "24/7 availability without breaks",
        "Consistent quality across all calls",
      ],
    },
    {
      icon: ShoppingCart,
      title: "Restaurants",
      description:
        "Automate reservations, takeout orders, and customer inquiries. Let AI handle the phone while your staff focuses on service.",
      color: "from-orange-500 to-orange-600",
      benefits: [
        "Never miss a reservation",
        "Handle peak hours effortlessly",
        "Reduce wait times for customers",
        "Integrate with POS systems",
      ],
    },
    {
      icon: Scissors,
      title: "Salons & Spas",
      description:
        "Streamline appointment booking, send reminders, and manage cancellations automatically with our AI receptionist.",
      color: "from-pink-500 to-pink-600",
      benefits: [
        "Reduce no-shows by 60%",
        "Automated appointment reminders",
        "Easy rescheduling for clients",
        "Calendar integration",
      ],
    },
    {
      icon: Stethoscope,
      title: "Medical Offices",
      description:
        "HIPAA-compliant AI calling for appointment scheduling, prescription refills, and patient reminders.",
      color: "from-green-500 to-green-600",
      benefits: [
        "HIPAA-compliant communications",
        "Insurance verification assistance",
        "Automated follow-up calls",
        "EMR integration available",
      ],
    },
    {
      icon: Home,
      title: "Real Estate",
      description:
        "Qualify leads, schedule property viewings, and follow up with prospects automatically to close more deals.",
      color: "from-purple-500 to-purple-600",
      benefits: [
        "Pre-qualify leads automatically",
        "Schedule viewings 24/7",
        "Automated follow-ups",
        "CRM integration",
      ],
    },
    {
      icon: Store,
      title: "E-commerce",
      description:
        "Provide instant customer support, process orders over phone, and handle returns with AI-powered assistance.",
      color: "from-cyan-500 to-cyan-600",
      benefits: [
        "Instant order status updates",
        "Handle returns and refunds",
        "Product recommendations",
        "Multi-channel support",
      ],
    },
    {
      icon: Wrench,
      title: "Service Businesses",
      description:
        "From plumbing to HVAC, automate service bookings, emergency dispatch, and customer follow-ups.",
      color: "from-yellow-500 to-yellow-600",
      benefits: [
        "Emergency call routing",
        "Service scheduling automation",
        "Follow-up satisfaction calls",
        "Invoice payment reminders",
      ],
    },
    {
      icon: Building,
      title: "Retail Stores",
      description:
        "Answer product inquiries, check inventory, and help customers find what they need with AI phone support.",
      color: "from-indigo-500 to-indigo-600",
      benefits: [
        "Real-time inventory checks",
        "Store hours and location info",
        "Product availability updates",
        "Loyalty program support",
      ],
    },
  ];

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
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              AI Calling Solutions for{" "}
              <span className="relative inline-block">
                Every Industry
                <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400"></span>
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              From healthcare to retail, BadarAI delivers tailored AI calling
              solutions that understand your industry's unique needs and
              compliance requirements.
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

        {/* Industries Grid */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {industries.map((industry, index) => {
                const Icon = industry.icon;
                return (
                  <Link
                    key={index}
                    href="/contact"
                    className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-blue-300 hover:shadow-xl transition-all cursor-pointer block"
                  >
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${industry.color} rounded-xl flex items-center justify-center mb-6`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {industry.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {industry.description}
                    </p>
                    <div className="space-y-3">
                      {industry.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-4 py-20 bg-gradient-to-br from-blue-50 to-cyan-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                Trusted Across <span className="text-blue-600">Industries</span>
              </h2>
              <p className="text-xl text-gray-600">
                Businesses of all sizes rely on BadarAI for their communication
                needs
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-4xl md:text-5xl font-bold text-blue-600">
                  500+
                </div>
                <div className="text-gray-600 font-medium">
                  Healthcare Providers
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl md:text-5xl font-bold text-green-600">
                  1,200+
                </div>
                <div className="text-gray-600 font-medium">Restaurants</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl md:text-5xl font-bold text-purple-600">
                  800+
                </div>
                <div className="text-gray-600 font-medium">
                  Service Businesses
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl md:text-5xl font-bold text-orange-600">
                  2,500+
                </div>
                <div className="text-gray-600 font-medium">
                  Total Businesses
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20 bg-gradient-to-r from-blue-600 to-cyan-500">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready for Your Industry?
            </h2>
            <p className="text-xl mb-10 opacity-90">
              See how BadarAI can transform communications in your industry
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-6 text-lg font-semibold rounded-lg shadow-lg transition-all"
                onClick={handleGetStarted}
              >
                Start Free Trial
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white bg-transparent hover:bg-cyan-500 hover:border-cyan-500 px-8 py-6 text-lg font-semibold rounded-lg transition-all"
                onClick={() => router.push('/contact')}
              >
                Schedule Industry Demo
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        defaultView={authMode}
      />
    </div>
  );
}
