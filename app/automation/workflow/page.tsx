"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth-modal";
import { useAuth } from "@/lib/auth-context";
import {
  Workflow,
  FileText,
  Database,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Zap,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AutomationServicesDropdown } from "@/components/automation-services-dropdown";

export default function WorkflowAutomationPage() {
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

  const services = [
    {
      icon: Workflow,
      title: "Task & Project Automation",
      description:
        "Automated task assignment and project tracking to keep your team in sync",
      features: [
        "Automated task assignments",
        "Progress tracking",
        "Team collaboration tools",
      ],
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      icon: FileText,
      title: "Document Automation",
      description:
        "Automated document creation and processing for faster workflows",
      features: [
        "Template-based generation",
        "Smart data extraction",
        "Version control",
      ],
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Database,
      title: "Data Entry Automation (RPA)",
      description:
        "Robotic Process Automation for repetitive tasks and data entry",
      features: [
        "Zero-error data entry",
        "Multi-system integration",
        "24/7 operation",
      ],
      gradient: "from-emerald-500 to-green-500",
    },
    {
      icon: Calendar,
      title: "Calendar & Scheduling",
      description:
        "Intelligent scheduling and meeting management that saves time",
      features: [
        "Smart scheduling",
        "Meeting reminders",
        "Calendar sync",
      ],
      gradient: "from-orange-500 to-pink-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50">
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
        <section className="py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center text-white">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Workflow Automations
              </h1>
              <p className="text-2xl mb-8 opacity-90">
                Task Management, Documents & Data Processing
              </p>
              <p className="text-xl opacity-80 max-w-3xl mx-auto">
                Streamline your business processes with intelligent workflow automation
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {services.map((service, index) => {
                const IconComponent = service.icon;
                return (
                  <div
                    key={index}
                    className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                  >
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-xl flex items-center justify-center mb-6 shadow-md`}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-indigo-600 to-pink-500">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Streamline Your Workflows?
              </h2>
              <p className="text-xl mb-10 opacity-90">
                Automate repetitive tasks and focus on what matters most
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleGetStarted}
                  size="lg"
                  className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold shadow-lg transition-all"
                >
                  Get Started Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  onClick={handleSignup}
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-indigo-600 px-8 py-6 text-lg font-semibold transition-all"
                >
                  Schedule Demo
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        defaultView={authMode}
      />
    </div>
  );
}
