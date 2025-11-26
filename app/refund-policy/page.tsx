"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth-modal";
import { useAuth } from "@/lib/auth-context";
import {
  Shield,
  FileText,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Calendar,
  Scale,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AutomationServicesDropdown } from "@/components/automation-services-dropdown";
import { Footer } from "@/components/footer";

export default function RefundPolicyPage() {
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

  const policySection = [
    {
      icon: XCircle,
      title: "Payments Are Final",
      description:
        "All payments for Badar AI services, including but not limited to AI bots, workflow automation, email automation, and voice cloning services, are final and non-refundable. Once a transaction is completed, it cannot be reversed or refunded under any circumstances, except as explicitly required by applicable law.",
      gradient: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
    },
    {
      icon: CheckCircle2,
      title: "Service Activation & Consent Verification",
      description:
        "For services such as Voice Cloning / AI Voice Services, full verification and explicit consent from the individual whose voice is being cloned are required. Services will only be activated after consent is verified, which may take up to two (2) business days. Refunds will not be provided due to delays arising from incomplete or insufficient consent documentation.",
      gradient: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      icon: AlertCircle,
      title: "No Refunds for Misuse or Violations",
      description:
        "Clients are fully responsible for using Badar AI services in compliance with all applicable laws, regulations, and third-party policies. Any misuse, illegal activity, or violation of third-party platform rules will result in immediate suspension or termination of services without refund.",
      gradient: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      icon: Clock,
      title: "Partial Service or Downtime",
      description:
        "Badar AI endeavors to provide reliable services; however, technical interruptions, integrations with third-party platforms, or unforeseen service limitations may occur. Such events do not qualify for refunds. Clients acknowledge that AI outputs may require human oversight and are not guaranteed to be error-free or fully accurate.",
      gradient: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      icon: Calendar,
      title: "Late or Missed Payments",
      description:
        "Failure to maintain timely payments may result in suspension of services. Badar AI reserves the right to restrict, pause, or terminate access without issuing a refund for missed or late payments.",
      gradient: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
    },
    {
      icon: Scale,
      title: "Exceptional Circumstances",
      description:
        "While we aim to accommodate client concerns, refunds will only be considered at Badar AI's sole discretion in extreme or exceptional circumstances. Decisions made by Badar AI regarding refunds are final and binding.",
      gradient: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
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
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Refund <span className="relative inline-block">
                Policy
                <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-green-500"></span>
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              At Badar AI, we strive to deliver cutting-edge AI automation solutions that empower our clients' businesses efficiently and ethically. Please review our refund terms carefully before purchasing or subscribing to our services.
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
            <div className="bg-gradient-to-r from-blue-600 to-green-500 rounded-2xl p-8 text-white shadow-xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">Important Notice</h3>
                  <p className="text-lg leading-relaxed opacity-95">
                    By purchasing or subscribing to our services, you acknowledge and agree that you have read, understood, and accept the following refund terms. Your use of our services constitutes your express acknowledgment and acceptance of these terms.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Policy Sections */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {policySection.map((section, index) => {
                const IconComponent = section.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1"
                  >
                    <div className={`w-14 h-14 bg-gradient-to-br ${section.gradient} rounded-xl flex items-center justify-center mb-6 shadow-md`}>
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {section.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {section.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Key Points Summary */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 md:p-12 border border-gray-200">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Key Points to Remember
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
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
                    Consent verification required for voice services
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-700 font-medium">
                    No refunds for misuse or policy violations
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-700 font-medium">
                    Service interruptions do not qualify for refunds
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-700 font-medium">
                    Late payments may result in service suspension
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-700 font-medium">
                    Refund decisions at sole discretion of Badar AI
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Support Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-gray-200">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Have Questions About Our Policy?
                </h2>
                <p className="text-xl text-gray-600">
                  Our support team is here to help clarify any concerns you may have
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4 p-6 bg-blue-50 rounded-xl">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Email Us</p>
                    <a
                      href="mailto:info@badarai.site"
                      className="text-blue-600 hover:text-blue-700 font-semibold block"
                    >
                      info@badarai.site
                    </a>
                    <a
                      href="mailto:badaraiagency@gmail.com"
                      className="text-blue-600 hover:text-blue-700 font-semibold block text-sm"
                    >
                      Support: badaraiagency@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-6 bg-green-50 rounded-xl">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Call Us</p>
                    <a
                      href="tel:+12083300747"
                      className="text-green-600 hover:text-green-700 font-semibold"
                    >
                      +1 (208) 330-0747
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-600 to-green-500 rounded-2xl p-12 text-white shadow-xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Get Started with Badar AI?
            </h2>
            <p className="text-xl mb-8 opacity-95">
              Experience cutting-edge AI automation solutions for your business
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-6 text-lg font-semibold shadow-lg transition-all"
                onClick={handleGetStarted}
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white bg-transparent hover:bg-green-500 hover:border-green-500 px-8 py-6 text-lg font-semibold transition-all"
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
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">Badar AI</h3>
              <p className="text-gray-600 leading-relaxed">
                AI Calling Bot that sounds human — connect your business in just 5 minutes.
              </p>
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
                  <Link href="/terms-of-service" className="hover:text-gray-900">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/refund-policy" className="text-blue-600 hover:text-blue-700 font-semibold">
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

            <div className="space-y-4">
              <h4 className="font-bold text-lg text-gray-900">Contact</h4>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">350 N State St, Salt Lake City, Utah 84114, US</span>
                </li>
                <li className="flex items-start gap-2">
                  <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <a href="mailto:info@badarai.site" className="hover:text-gray-900 block">
                      info@badarai.site
                    </a>
                    <a href="mailto:badaraiagency@gmail.com" className="hover:text-gray-900 block">
                      badaraiagency@gmail.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Phone className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <a href="tel:+12083300747" className="hover:text-gray-900 text-sm">
                    +1 (208) 330-0747
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

