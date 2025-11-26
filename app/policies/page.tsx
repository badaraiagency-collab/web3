"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth-modal";
import { useAuth } from "@/lib/auth-context";
import {
  ShieldCheck,
  Scale,
  CreditCard,
  FileText,
  Lock,
  ArrowRight,
  CheckCircle2,
  Building2,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AutomationServicesDropdown } from "@/components/automation-services-dropdown";
import { Footer } from "@/components/footer";

export default function PoliciesPage() {
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

  const policies = [
    {
      icon: Lock,
      title: "Privacy Policy",
      description:
        "Learn how we collect, use, store, and protect your personal information. Understand your rights and our commitment to data privacy.",
      gradient: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      href: "/privacy-policy",
      highlights: [
        "Data collection & usage",
        "Security measures",
        "Your privacy rights",
        "GDPR & CCPA compliance",
      ],
    },
    {
      icon: Scale,
      title: "Terms of Service",
      description:
        "Review the legal terms and conditions that govern your use of Badar AI services. Know your rights and responsibilities.",
      gradient: "from-blue-500 to-purple-600",
      bgColor: "bg-blue-50",
      href: "/terms-of-service",
      highlights: [
        "Service usage terms",
        "Client responsibilities",
        "Intellectual property",
        "Liability limitations",
      ],
    },
    {
      icon: CreditCard,
      title: "Refund Policy",
      description:
        "Understand our refund terms, payment policies, and conditions for service cancellations and modifications.",
      gradient: "from-blue-500 to-green-500",
      bgColor: "bg-blue-50",
      href: "/refund-policy",
      highlights: [
        "Payment terms",
        "Refund conditions",
        "Service activation",
        "Cancellation policy",
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
              <div className="hidden lg:block">
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
                onClick={handleLogin}
                className="hidden md:flex text-gray-700 hover:text-gray-900"
              >
                Login
              </Button>
              <Button
                onClick={handleSignup}
                className="hidden md:flex bg-blue-600 hover:bg-blue-700 text-white"
              >
                Get Started
              </Button>
              <button
                className="lg:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6 text-gray-700" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t py-4 space-y-3">
              <Link
                href="/solution"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                Solution
              </Link>
              <Link
                href="/industries"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                Industries
              </Link>
              <Link
                href="/white-label"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                White Label
              </Link>
              <Link
                href="/resources"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                Resources
              </Link>
              <div className="px-4 pt-2">
                <AutomationServicesDropdown />
              </div>
              <div className="px-4 pt-2 space-y-2">
                <Button
                  variant="ghost"
                  onClick={handleLogin}
                  className="w-full text-gray-700 hover:text-gray-900"
                >
                  Login
                </Button>
                <Button
                  onClick={handleSignup}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Get Started
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <FileText className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Our <span className="relative inline-block">
                Policies
                <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></span>
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Transparency is at the heart of everything we do. Review our policies to understand how we protect your data, deliver our services, and uphold our commitments to you.
            </p>
          </div>
        </section>

        {/* Policies Grid */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {policies.map((policy, index) => {
                const IconComponent = policy.icon;
                return (
                  <Link
                    key={index}
                    href={policy.href}
                    className="group"
                  >
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full">
                      <div className={`w-16 h-16 bg-gradient-to-br ${policy.gradient} rounded-xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                        {policy.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed mb-6">
                        {policy.description}
                      </p>
                      <ul className="space-y-2 mb-6">
                        {policy.highlights.map((highlight, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="flex items-center gap-2 text-blue-600 group-hover:text-blue-700 font-semibold">
                        <span>Read Full Policy</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why We Have Policies Section */}
        <section className="container mx-auto px-4 py-16 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why We Have These Policies
              </h2>
              <p className="text-xl text-gray-600">
                Our policies exist to protect you, ensure transparency, and build trust
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Protection</h3>
                    <p className="text-gray-600">
                      We protect your data and privacy with industry-leading security measures
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Transparency</h3>
                    <p className="text-gray-600">
                      Clear terms and conditions so you always know what to expect
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Scale className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Compliance</h3>
                    <p className="text-gray-600">
                      We comply with GDPR, CCPA, and other international regulations
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Trust</h3>
                    <p className="text-gray-600">
                      Building long-term relationships based on trust and reliability
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Questions About Our Policies?
              </h2>
              <p className="text-xl text-gray-600">
                Our team is here to help clarify any concerns
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Company Info */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Badar AI</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-gray-700 font-medium">Office Address</p>
                      <p className="text-gray-600">
                        350 N State St<br />
                        Salt Lake City, Utah 84114<br />
                        United States
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Contact Us</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-gray-700 font-medium">Email</p>
                      <a
                        href="mailto:info@badarai.site"
                        className="text-blue-600 hover:text-blue-700 font-semibold"
                      >
                        info@badarai.site
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-gray-700 font-medium">Support</p>
                      <a
                        href="mailto:badaraiagency@gmail.com"
                        className="text-blue-600 hover:text-blue-700 font-semibold"
                      >
                        badaraiagency@gmail.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-gray-700 font-medium">Phone</p>
                      <a
                        href="tel:+12083300747"
                        className="text-blue-600 hover:text-blue-700 font-semibold"
                      >
                        +1 (208) 330-0747
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-600 to-purple-500 rounded-2xl p-12 text-white shadow-xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Experience Badar AI?
            </h2>
            <p className="text-xl mb-8 opacity-95">
              Start automating your business with confidence, backed by our transparent policies
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-6 text-lg font-semibold shadow-lg transition-all"
                onClick={handleGetStarted}
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white bg-transparent hover:bg-purple-500 hover:border-purple-500 px-8 py-6 text-lg font-semibold transition-all"
                onClick={() => router.push("/resources")}
              >
                Learn More
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

