"use client";

import { useState } from "react";
import Link from "next/link";

export function AutomationServicesDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false); // Tracks if dropdown is pinned via click

  const automationServices = [
    {
      title: "Communication Automations",
      description: "AI Calling, WhatsApp, SMS, Email & Chatbots",
      services: [
        "Automated Calling (Voice Bots / IVR AI)",
        "WhatsApp Bots",
        "SMS Bots",
      ],
      moreCount: 3,
      href: "/automation/communication",
    },
    {
      title: "Business & Sales Automations",
      description: "Lead Generation, CRM, Billing & E-commerce",
      services: [
        "Lead Generation Bots",
        "CRM Automation",
        "Invoice & Billing Automation",
      ],
      moreCount: 2,
      href: "/automation/business-sales",
    },
    {
      title: "Workflow Automations",
      description: "Task Management, Documents & Data Entry",
      services: [
        "Task & Project Automation",
        "Document Automation",
        "Data Entry Automation (RPA)",
      ],
      moreCount: 1,
      href: "/automation/workflow",
    },
    {
      title: "Customer Support Automations",
      description: "Helpdesk, Voice Assistants & Knowledge Base",
      services: [
        "Helpdesk Ticket Automation",
        "AI Voice Assistants",
        "Knowledge Base Bots",
      ],
      moreCount: 0,
      href: "/automation/customer-support",
    },
    {
      title: "Marketing Automations",
      description: "Ad Campaigns, Content Generation & SEO",
      services: [
        "Ad Campaign Automation",
        "Content Generation Automation",
        "SEO Automation",
      ],
      moreCount: 0,
      href: "/automation/marketing",
    },
    {
      title: "Personal / Productivity Automations",
      description: "Calendar, Email & Voice-to-Text",
      services: [
        "Calendar & Scheduling",
        "Email Sorting & Replying",
        "Note Taking & Summarization",
      ],
      moreCount: 1,
      href: "/automation/productivity",
    },
  ];

  const handleMouseEnter = () => {
    if (!isSticky) {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isSticky) {
      setIsOpen(false);
    }
  };

  const handleClick = () => {
    if (isSticky) {
      // If already sticky, close it
      setIsSticky(false);
      setIsOpen(false);
    } else {
      // Make it sticky
      setIsSticky(true);
      setIsOpen(true);
    }
  };

  const handleClose = () => {
    setIsSticky(false);
    setIsOpen(false);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={handleClick}
        className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
      >
        <span>Automation Services</span>
        <svg
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          {isSticky && (
            <div
              className="fixed inset-0 z-40 bg-black/20"
              onClick={handleClose}
            />
          )}
          <div className="fixed left-1/2 top-20 md:top-24 -translate-x-1/2 w-[95vw] md:w-[1200px] max-w-[95vw] bg-white rounded-2xl shadow-2xl z-50 border border-gray-200 animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="p-4 md:p-8 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                {automationServices.map((service, index) => (
                  <Link
                    key={index}
                    href={service.href}
                    className="block p-3 md:p-4 rounded-lg hover:bg-gray-50 transition-colors group border border-gray-100"
                    onClick={handleClose}
                  >
                    <div className="space-y-2 md:space-y-3">
                      <h3 className="text-base md:text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-600">
                        {service.description}
                      </p>
                      <ul className="space-y-1 md:space-y-2 hidden md:block">
                        {service.services.map((item, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-gray-700 flex items-start"
                          >
                            <span className="mr-2">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                      {service.moreCount > 0 && (
                        <div className="text-xs md:text-sm text-blue-600 hover:text-blue-700 font-medium hidden md:block">
                          +{service.moreCount} more service
                          {service.moreCount > 1 ? "s" : ""}
                        </div>
                      )}
                      <div className="md:hidden text-sm text-blue-600 font-medium">
                        View Details →
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-4 md:mt-8 pt-4 md:pt-6 border-t border-gray-200 text-center">
                <Link
                  href="/policies"
                  className="text-sm md:text-base text-blue-600 hover:text-blue-700 font-semibold"
                  onClick={handleClose}
                >
                  View Our Policies
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
