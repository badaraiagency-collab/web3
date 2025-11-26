"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth-modal";
import { useAuth } from "@/lib/auth-context";
import {
  Scale,
  FileText,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  AlertTriangle,
  Users,
  Plug,
  XCircle,
  Gavel,
  RefreshCw,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Building2,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AutomationServicesDropdown } from "@/components/automation-services-dropdown";
import { Footer } from "@/components/footer";

export default function TermsOfServicePage() {
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

  const termsSection = [
    {
      icon: CheckCircle2,
      number: "1",
      title: "Acceptance of Terms",
      description:
        "By using Badar AI services, you agree to be bound by these Terms of Service, our Privacy Policy, and any additional guidelines or rules communicated to you. If you do not agree, you must refrain from using our services. Your continued use of our platform constitutes acceptance of these terms.",
      gradient: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: ShieldCheck,
      number: "2",
      title: "Services Provided",
      description:
        'Badar AI offers AI-powered tools, including automation workflows, email automation, AI bots, and voice cloning technologies. All services are provided "as-is" and may require human oversight. Badar AI does not guarantee the completeness, accuracy, or appropriateness of AI-generated content.',
      gradient: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: Users,
      number: "3",
      title: "Client Responsibilities",
      description:
        "Clients are solely responsible for: Compliance with all applicable local and international laws, including GDPR, CCPA, TCPA, CAN-SPAM, and WhatsApp/Meta policies. Obtaining explicit consent for any voice cloning or communications involving AI-generated content. Ensuring that communications via email, phone, SMS, or AI voice adhere to legal and ethical standards. Any damages, fines, or legal consequences arising from misuse of services.",
      gradient: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: FileText,
      number: "4",
      title: "Intellectual Property",
      description:
        "All AI workflows, scripts, software, and automation processes remain the exclusive property of Badar AI. Clients are granted a limited, non-transferable license strictly for business use and may not resell or redistribute our intellectual property without explicit written permission.",
      gradient: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      icon: CreditCard,
      number: "5",
      title: "Payments & Billing",
      description:
        "All payments are final and non-refundable. Badar AI reserves the right to suspend or terminate services for missed or late payments. Fees for services, including any add-ons or upgrades, must be paid in full before access is granted. Pricing may be subject to change with notice.",
      gradient: "from-cyan-500 to-cyan-600",
      bgColor: "bg-cyan-50",
    },
    {
      icon: AlertTriangle,
      number: "6",
      title: "Liability Limitations",
      description:
        "Badar AI is not liable for: Lost profits, business interruptions, or errors in AI-generated outputs. Failed message deliveries or communication disruptions caused by third-party platforms. Legal or regulatory consequences resulting from client misuse. Maximum liability, if any, is strictly limited to the fees paid for services within the 30 days preceding the claim.",
      gradient: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      icon: ShieldCheck,
      number: "7",
      title: "Indemnification",
      description:
        "Clients agree to indemnify, defend, and hold harmless Badar AI, its employees, affiliates, and partners from any claims, damages, or legal actions arising from their use of services. This includes but is not limited to any third-party claims related to your use of our services.",
      gradient: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50",
    },
    {
      icon: Plug,
      number: "8",
      title: "Third-Party Integrations",
      description:
        "Services may integrate with external platforms such as Google, Meta, Twilio, and telecom providers. Badar AI is not responsible for any service interruptions, account restrictions, or policy changes imposed by third parties. You are responsible for maintaining compliance with all third-party terms.",
      gradient: "from-teal-500 to-teal-600",
      bgColor: "bg-teal-50",
    },
    {
      icon: XCircle,
      number: "9",
      title: "Service Termination",
      description:
        "Badar AI may suspend or terminate services at its discretion for violations of these terms, legal non-compliance, or misuse of services. Termination does not entitle clients to a refund. We reserve the right to terminate service immediately without notice for serious violations.",
      gradient: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
    },
    {
      icon: Gavel,
      number: "10",
      title: "Governing Law & Dispute Resolution",
      description:
        "Clients agree to attempt resolution of disputes through mediation or arbitration prior to pursuing legal action. These Terms of Service shall be governed by applicable law in the jurisdiction where Badar AI operates. Any disputes shall be resolved in the courts of that jurisdiction.",
      gradient: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      icon: RefreshCw,
      number: "11",
      title: "Changes to Terms",
      description:
        "Badar AI reserves the right to update these Terms of Service at any time. Continued use of services constitutes acceptance of any modifications. We will notify users of significant changes via email or through our platform.",
      gradient: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
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
                <Scale className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Terms of <span className="relative inline-block">
                Service
                <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></span>
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Welcome to Badar AI, a provider of advanced AI automation solutions. By accessing or using our services, you agree to comply with the following terms.
            </p>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 rounded-full text-blue-700 font-medium">
              <FileText className="w-5 h-5" />
              <span>Last Updated: October 2024</span>
            </div>
          </div>
        </section>

        {/* Important Notice */}
        <section className="container mx-auto px-4 py-8 mb-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-600 to-purple-500 rounded-2xl p-8 text-white shadow-xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">Legal Agreement</h3>
                  <p className="text-lg leading-relaxed opacity-95">
                    These Terms of Service constitute a legally binding agreement between you and Badar AI. Please read them carefully before using our services. Your access to and use of the service is conditioned on your acceptance and compliance with these terms.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Terms Sections */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="space-y-8">
              {termsSection.map((section, index) => {
                const IconComponent = section.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
                  >
                    <div className="flex items-start gap-6">
                      <div className={`w-16 h-16 bg-gradient-to-br ${section.gradient} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md`}>
                        <span className="text-2xl font-bold text-white">{section.number}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                          <IconComponent className="w-6 h-6 text-gray-700" />
                          {section.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed text-lg">
                          {section.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Key Points Summary */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-2xl p-8 md:p-12 border border-gray-200">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Key Points to Remember
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-700 font-medium">
                    All services provided "as-is" with no guarantees
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-700 font-medium">
                    Clients responsible for legal compliance
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-700 font-medium">
                    All payments are final and non-refundable
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-700 font-medium">
                    Limited liability for service interruptions
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-700 font-medium">
                    Intellectual property remains with Badar AI
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-700 font-medium">
                    Terms may be updated at any time
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information Section */}
        <section className="container mx-auto px-4 py-16 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                About Us & Contact Information
              </h2>
              <p className="text-xl text-gray-600">
                Get in touch with us for any questions or support
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* About Us Card */}
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

              {/* Contact Card */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
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
              Ready to Get Started with Badar AI?
            </h2>
            <p className="text-xl mb-8 opacity-95">
              Experience cutting-edge AI automation solutions for your business
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
      <footer className="bg-gray-50 border-t border-gray-200 px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">BadarAI</h3>
              <p className="text-gray-600 leading-relaxed">
                AI Calling Bot that sounds human — connect your business in just 5 minutes.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-lg text-gray-900">Contact</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>350 N State St, Salt Lake City, UT 84114</span>
                </li>
                <li className="flex items-start gap-2">
                  <Mail className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <a href="mailto:info@badarai.site" className="hover:text-gray-900">
                    info@badarai.site
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <Phone className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <a href="tel:+12083300747" className="hover:text-gray-900">
                    +1 (208) 330-0747
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-lg text-gray-900">Services</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link href="/automation/communication" className="hover:text-gray-900">
                    AI Calling Bot
                  </Link>
                </li>
                <li>
                  <Link href="/automation/communication" className="hover:text-gray-900">
                    Communication Automations
                  </Link>
                </li>
                <li>
                  <Link href="/automation/business-sales" className="hover:text-gray-900">
                    Business & Sales Automations
                  </Link>
                </li>
                <li>
                  <Link href="/automation/workflow" className="hover:text-gray-900">
                    Workflow Automations
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-lg text-gray-900">Legal</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link href="/solution" className="hover:text-gray-900">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="hover:text-gray-900">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-service" className="text-blue-600 hover:text-blue-700 font-semibold">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/refund-policy" className="hover:text-gray-900">
                    Refund Policy
                  </Link>
                </li>
                <li>
                  <a href="mailto:badaraiagency@gmail.com" className="hover:text-gray-900">
                    Customer Support
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-300 pt-8 text-center">
            <p className="text-gray-600">
              © {new Date().getFullYear()} Badar AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </div>
  );
}
