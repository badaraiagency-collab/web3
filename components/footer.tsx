import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Badar AI</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              AI Calling Bot that sounds human — connect your business in just 5 minutes.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/automation/communication" className="hover:text-white transition-colors">
                  AI Calling Bot
                </Link>
              </li>
              <li>
                <Link href="/automation/communication" className="hover:text-white transition-colors">
                  Communication Automations
                </Link>
              </li>
              <li>
                <Link href="/automation/business-sales" className="hover:text-white transition-colors">
                  Business & Sales
                </Link>
              </li>
              <li>
                <Link href="/white-label" className="hover:text-white transition-colors">
                  White Label
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-white transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4">Contact</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>350 N State St, Salt Lake City, Utah 84114, US</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <a href="mailto:info@badarai.site" className="hover:text-white block transition-colors">
                    info@badarai.site
                  </a>
                  <a href="mailto:badaraiagency@gmail.com" className="hover:text-white block transition-colors">
                    badaraiagency@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <a href="tel:+12083300747" className="hover:text-white transition-colors">
                  +1 (208) 330-0747
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Badar AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

