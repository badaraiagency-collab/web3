"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth-modal";
import { useAuth } from "@/lib/auth-context";
import {
  ShieldCheck,
  FileText,
  CheckCircle2,
  Lock,
  Database,
  Share2,
  AlertTriangle,
  Bot,
  Plug,
  UserCheck,
  FileSignature,
  CreditCard,
  Mic,
  XCircle,
  Users,
  Gavel,
  RefreshCw,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Building2,
  Eye,
  Server,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AutomationServicesDropdown } from "@/components/automation-services-dropdown";
import { Footer } from "@/components/footer";

export default function PrivacyPolicyPage() {
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

  const privacySection = [
    {
      icon: ShieldCheck,
      number: "1",
      title: "Our Commitment to Privacy",
      description:
        "At Badar AI, we are committed to providing reliable AI automation services while ensuring the protection and responsible use of client data. We take privacy seriously and implement industry-standard security measures to safeguard your information. This policy outlines how we collect, use, store, and protect your data when you use our services.",
      gradient: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: UserCheck,
      number: "2",
      title: "Lawful Use & Client Responsibility",
      description:
        "By using our services, you agree that all tools, including but not limited to AI bots, email automation, workflow automation, and voice cloning technologies, will be used only for lawful, ethical, and compliant purposes. Clients are fully responsible for the content, calls, messages, or emails they generate through our services and must comply with all applicable local and international laws, including GDPR, CCPA, TCPA, CAN-SPAM, and WhatsApp/Meta policies.",
      gradient: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: Database,
      number: "3",
      title: "Data Collection & Use",
      description:
        "We handle personal data such as emails, phone numbers, contact names, communication logs, and usage analytics only for the purpose of delivering and improving our services. This information is collected when you register for an account, configure AI agents, upload contact lists, or use our automation features. We use this data to process your requests, provide customer support, improve our AI models, and ensure service quality.",
      gradient: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: Share2,
      number: "4",
      title: "Data Sharing & Third Parties",
      description:
        "Your information is never sold to third parties. Data may be securely shared only with trusted partners necessary for service operations, such as cloud hosting providers (AWS, Google Cloud), telecom partners for call services, and payment processors. These partners are contractually obligated to maintain data confidentiality and security. We only share the minimum data necessary for these partners to perform their services.",
      gradient: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      icon: Server,
      number: "5",
      title: "Data Storage & Retention",
      description:
        "Your data is securely stored on encrypted servers in compliant data centers. We retain personal data only for as long as required to provide active services or as mandated by law. When you terminate your account, your data will be deleted within 90 days unless legal obligations require longer retention. You can request data deletion at any time by contacting our support team.",
      gradient: "from-cyan-500 to-cyan-600",
      bgColor: "bg-cyan-50",
    },
    {
      icon: Lock,
      number: "6",
      title: "Data Security Measures",
      description:
        "While we take reasonable and industry-standard measures to secure and protect data through encryption, firewalls, access controls, and regular security audits, no system is completely immune to breaches, hacking, or third-party failures. Badar AI cannot be held responsible for security incidents or data breaches resulting from events outside of our control, including but not limited to sophisticated cyber attacks, zero-day vulnerabilities, or third-party platform compromises.",
      gradient: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      icon: AlertTriangle,
      number: "7",
      title: "Client Liability for Misuse",
      description:
        "Badar AI does not take responsibility for any misuse, violations, or penalties arising from client actions. All damages, fines, legal consequences, or regulatory penalties resulting from your use of our services remain solely your responsibility. This includes but is not limited to violations of anti-spam laws, telemarketing regulations, privacy laws, or platform policies.",
      gradient: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
    },
    {
      icon: Bot,
      number: "8",
      title: "AI-Generated Content Accuracy",
      description:
        "Clients acknowledge that AI-generated outputs may not always be fully accurate, complete, or appropriate for all contexts. AI models can produce errors, hallucinations, or inappropriate responses. Clients agree that human oversight is required when using automation for decision-making, customer communication, or any critical business processes. Badar AI is not liable for decisions made based on AI outputs.",
      gradient: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50",
    },
    {
      icon: Plug,
      number: "9",
      title: "Third-Party Platform Integrations",
      description:
        "Our services may integrate with third-party platforms such as Google, Meta (Facebook/WhatsApp), Twilio, Stripe, and various telecom providers. Badar AI is not liable for any disruptions, service interruptions, account restrictions, policy changes, or account suspensions caused by such external platforms. You are responsible for maintaining compliance with all third-party platform terms and policies.",
      gradient: "from-teal-500 to-teal-600",
      bgColor: "bg-teal-50",
    },
    {
      icon: UserCheck,
      number: "10",
      title: "Consent & Authorization Requirements",
      description:
        "Clients are solely responsible for ensuring that all customer communications are conducted with proper consent and legal authorization. This includes obtaining consent before making phone calls, sending text messages, emails, or using voice cloning technologies. You must maintain documented proof of consent and comply with all applicable consent requirements under TCPA, GDPR, CCPA, and other relevant laws.",
      gradient: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      icon: Mic,
      number: "11",
      title: "Voice Cloning Consent Requirements",
      description:
        "Clients selecting Voice Cloning / AI Voice Services must provide explicit written, verbal, and video consent from the person whose voice is being cloned. Full verification will take up to two (2) business days before services can be activated. A separate consent agreement must be signed where required. Unauthorized voice cloning is strictly prohibited and may result in immediate account termination and legal action.",
      gradient: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      icon: Eye,
      number: "12",
      title: "Your Privacy Rights",
      description:
        "Depending on your jurisdiction, you may have rights regarding your personal data, including the right to access, correct, delete, or export your data. You may also have the right to restrict processing or object to certain uses of your data. To exercise these rights, contact us at info@badarai.site. We will respond to your request within 30 days as required by applicable law.",
      gradient: "from-violet-500 to-violet-600",
      bgColor: "bg-violet-50",
    },
    {
      icon: XCircle,
      number: "13",
      title: "Service Termination for Violations",
      description:
        "Any violation of privacy laws, consent requirements, or our acceptable use policies may result in immediate suspension or termination of services without refund. We reserve the right to investigate suspected violations and cooperate with law enforcement agencies when necessary. Terminated accounts may be reported to relevant authorities if illegal activity is suspected.",
      gradient: "from-rose-500 to-rose-600",
      bgColor: "bg-rose-50",
    },
    {
      icon: FileSignature,
      number: "14",
      title: "Intellectual Property Protection",
      description:
        "All AI workflows, scripts, software, algorithms, and automation processes remain the intellectual property of Badar AI and are provided to the client under a limited license strictly for their business use. Clients may not reverse engineer, copy, resell, redistribute, or create derivative works from our proprietary technology without explicit written permission.",
      gradient: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      icon: XCircle,
      number: "15",
      title: "Limitation of Liability",
      description:
        "Badar AI is not liable for any lost profits, business interruptions, errors in AI responses, failed message deliveries, data breaches resulting from third-party failures, or legal consequences arising from client misuse of services. Our maximum liability, if any, is strictly limited to the fees you paid for services within the last 30 days preceding any claim.",
      gradient: "from-slate-500 to-slate-600",
      bgColor: "bg-slate-50",
    },
    {
      icon: Users,
      number: "16",
      title: "Indemnification",
      description:
        "Clients agree to indemnify, defend, and hold harmless Badar AI, its employees, officers, directors, affiliates, and partners from any claims, damages, losses, liabilities, costs, or legal actions related to their usage of our services. This includes claims arising from your violation of laws, breach of this policy, infringement of third-party rights, or misuse of our platform.",
      gradient: "from-lime-500 to-lime-600",
      bgColor: "bg-lime-50",
    },
    {
      icon: Gavel,
      number: "17",
      title: "Dispute Resolution",
      description:
        "In the event of disputes related to privacy, data handling, or service use, clients agree first to attempt resolution through good faith negotiation and mediation before pursuing legal action. Any disputes that cannot be resolved through mediation shall be subject to binding arbitration in accordance with the rules of the American Arbitration Association.",
      gradient: "from-sky-500 to-sky-600",
      bgColor: "bg-sky-50",
    },
    {
      icon: RefreshCw,
      number: "18",
      title: "Policy Updates & Changes",
      description:
        "We may update this Privacy Policy at any time to reflect changes in our practices, legal requirements, or service offerings. Significant changes will be communicated via email or through prominent notices on our platform. Your continued use of our services after any modifications constitutes acceptance of the updated policy. We encourage you to review this policy periodically.",
      gradient: "from-fuchsia-500 to-fuchsia-600",
      bgColor: "bg-fuchsia-50",
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
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Lock className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Privacy <span className="relative inline-block">
                Policy
                <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500"></span>
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              At Badar AI, we are committed to protecting your privacy and ensuring the responsible use of your data. This policy explains how we collect, use, store, and safeguard your information.
            </p>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-50 rounded-full text-green-700 font-medium">
              <FileText className="w-5 h-5" />
              <span>Last Updated: October 2024</span>
            </div>
          </div>
        </section>

        {/* Important Notice */}
        <section className="container mx-auto px-4 py-8 mb-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl p-8 text-white shadow-xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">Your Privacy Matters</h3>
                  <p className="text-lg leading-relaxed opacity-95">
                    This Privacy Policy is a binding agreement between you and Badar AI. By using our services, you acknowledge that you have read, understood, and agree to be bound by this policy. If you do not agree with any part of this policy, please discontinue use of our services immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy Sections */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="space-y-8">
              {privacySection.map((section, index) => {
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

        {/* Key Privacy Points Summary */}
        <section className="container mx-auto px-4 py-16 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 md:p-12 border border-gray-200 shadow-lg">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Key Privacy Points
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-700 font-medium">
                    We never sell your data to third parties
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-700 font-medium">
                    Data encrypted and stored securely
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-700 font-medium">
                    You're responsible for lawful use
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-700 font-medium">
                    Explicit consent required for voice cloning
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-700 font-medium">
                    Data retained only as long as necessary
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-700 font-medium">
                    You have rights to access and delete your data
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact & Data Rights Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Questions About Your Privacy?
              </h2>
              <p className="text-xl text-gray-600">
                Contact us to exercise your privacy rights or for any privacy-related inquiries
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* About Us Card */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Badar AI</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
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
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Privacy Inquiries</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
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
                    <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
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
                    <Phone className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
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
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl p-12 text-white shadow-xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Get Started with Badar AI?
            </h2>
            <p className="text-xl mb-8 opacity-95">
              Experience cutting-edge AI automation with privacy and security built-in
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-emerald-400 hover:bg-emerald-500 text-green-900 px-8 py-6 text-lg font-semibold shadow-lg transition-all"
                onClick={handleGetStarted}
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white bg-transparent hover:bg-emerald-400 hover:border-emerald-400 hover:text-green-900 px-8 py-6 text-lg font-semibold transition-all"
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
                  <Link href="/privacy-policy" className="text-green-600 hover:text-green-700 font-semibold">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-service" className="hover:text-gray-900">
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

