"use client";

import Link from "next/link";
import { useState } from "react";
import { MessageCircle, Mail, FileQuestion, ChevronDown, ArrowUpRight } from "lucide-react";
import { Card, IconContainer, SectionLabel } from "@/components/ui/design-system";

const faqs = [
  [
    "How long does LLC formation take?",
    "Processing time depends on the state and service package. Your dashboard will show the latest application status.",
  ],
  [
    "Where can I find my documents?",
    "Open Documents from your dashboard. Formation documents will appear there when they become available.",
  ],
  [
    "How do I make a payment?",
    "Open Billing from your dashboard and continue to checkout when your application is ready for payment.",
  ],
  [
    "Can I change information after submitting?",
    "Contact support before processing begins. Our team can tell you what changes are still possible.",
  ],
] as const;

export default function SupportPage() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <main className="min-h-screen bg-[var(--fm-graphite)] text-[var(--fm-text-primary)]">
      <header className="border-b border-[var(--fm-border)] bg-[var(--fm-graphite-deep)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 md:px-8">
          <div>
            <SectionLabel>Audvertax</SectionLabel>
            <h1 className="mt-1 font-semibold">Support</h1>
          </div>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-[var(--fm-text-secondary)] hover:text-[var(--fm-text-primary)]"
          >
            Back to dashboard
          </Link>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-8 md:py-12">
        <div className="mb-8">
          <SectionLabel>Customer care</SectionLabel>
          <h2 className="mt-1 text-3xl font-semibold tracking-[-0.04em]">How can we help?</h2>
          <p className="mt-2 text-sm text-[var(--fm-text-secondary)]">
            Get help with your application, payments, documents or formation service.
          </p>
        </div>
        <div className="grid gap-fm-5 md:grid-cols-2">
          <a href="https://wa.me/923164466335" target="_blank" rel="noreferrer" className="group">
            <Card variant="interactive" className="h-full p-6">
              <MessageCircle className="text-[var(--fm-success)]" size={24} />
              <h3 className="mt-4 font-semibold">WhatsApp Support</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--fm-text-secondary)]">
                Chat with our support team about your application.
              </p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[var(--fm-lime)]">
                Open WhatsApp <ArrowUpRight size={15} />
              </span>
            </Card>
          </a>
          <a href="mailto:support@foremint.pk" className="group">
            <Card variant="interactive" className="h-full p-6">
              <Mail className="text-[var(--fm-lime)]" size={24} />
              <h3 className="mt-4 font-semibold">Email Support</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--fm-text-secondary)]">
                Send us your question and our team can review it.
              </p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[var(--fm-lime)]">
                Email support <ArrowUpRight size={15} />
              </span>
            </Card>
          </a>
        </div>
        <Card variant="standard" className="mt-6 p-6">
          <div className="flex items-center gap-3">
            <IconContainer>
              <FileQuestion size={19} />
            </IconContainer>
            <div>
              <h3 className="font-semibold">Frequently asked questions</h3>
              <p className="text-xs text-[var(--fm-text-tertiary)]">
                Quick answers to common questions.
              </p>
            </div>
          </div>
          <div className="mt-5 divide-y divide-[var(--fm-border)]">
            {faqs.map(([question, answer], index) => (
              <div key={question}>
                <button
                  onClick={() => setOpen(open === index ? null : index)}
                  className="flex w-full items-center justify-between py-4 text-left text-sm font-semibold"
                >
                  <span>{question}</span>
                  <ChevronDown
                    size={17}
                    className={`transition-transform ${open === index ? "rotate-180" : ""}`}
                  />
                </button>
                {open === index && (
                  <p className="pb-4 pr-8 text-sm leading-6 text-[var(--fm-text-secondary)]">
                    {answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </main>
  );
}
