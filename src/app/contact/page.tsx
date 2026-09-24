"use client";

import { useState } from "react";
import { Card, CardAction, SectionLabel } from "@/components/ui/design-system";

const contactDetails = [
  { label: "Email", value: "hello@foremint.com", href: "mailto:hello@foremint.com" },
  { label: "WhatsApp", value: "+92 300 1234567", href: "https://wa.me/923001234567" },
  { label: "Office hours", value: "Mon–Sat · 9:00 AM to 7:00 PM PKT", href: "#" },
];

export default function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <main className="min-h-screen bg-[var(--fm-graphite-deep)] text-[var(--fm-text-primary)]">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--fm-lime)_12%,transparent),transparent_30%),var(--fm-graphite-deep)]">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 pb-16 pt-28 md:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:pb-24 lg:pt-32">
          <div className="relative z-10">
            <SectionLabel>Contact</SectionLabel>
            <h1 className="mt-6 max-w-xl font-display text-4xl font-black tracking-[-0.06em] text-[var(--fm-text-primary)] sm:text-5xl lg:text-[5rem] lg:leading-[0.9]">
              Let&apos;s build your next U.S. setup.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-[var(--fm-text-secondary)] sm:text-lg">
              Tell us what you&apos;re launching, where you&apos;re based, and what stage
              you&apos;re in. We&apos;ll recommend the simplest path to get paid, stay compliant,
              and move faster.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {["Fast response", "U.S.-focused support", "No fluff strategy calls"].map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center rounded-[var(--fm-radius-pill)] border border-[var(--fm-border)] bg-[var(--fm-surface-raised)] px-3 py-1.5 text-sm font-medium text-[var(--fm-text-primary)]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
          <Card variant="elevated" tone="dark" className="relative z-10 p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <span className="text-sm font-semibold uppercase tracking-[0.12em] text-(--fm-card-text)">
                Need a quick answer?
              </span>
              <span className="rounded-[var(--fm-radius-pill)] bg-[var(--fm-lime-soft)] px-2.5 py-1 text-[0.62rem] font-bold tracking-[0.12em] text-[var(--fm-lime)] uppercase">
                Usually within 1 business day
              </span>
            </div>
            <div className="space-y-4">
              {contactDetails.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="group flex items-start justify-between gap-4 rounded-[var(--fm-radius-md)] border border-[var(--fm-card-border)] bg-[var(--fm-surface)] p-4 transition-[transform,border-color] duration-[var(--fm-motion-component)] hover:-translate-y-0.5 hover:border-[var(--fm-border-accent)]"
                >
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.12em] text-(--fm-card-muted)">
                      {item.label}
                    </div>
                    <div className="mt-1 text-base font-semibold text-(--fm-card-text)">
                      {item.value}
                    </div>
                  </div>
                  <span className="mt-1 inline-flex size-9 items-center justify-center rounded-[var(--fm-radius-pill)] bg-[var(--fm-surface-raised)] text-xl text-[var(--fm-lime)] transition-transform duration-[var(--fm-motion-micro)] group-hover:translate-x-0.5">
                    →
                  </span>
                </a>
              ))}
            </div>
          </Card>
        </div>
      </section>
      <section className="py-16 md:py-20">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
          <Card variant="standard" className="p-6 md:p-8">
            <SectionLabel>Why reach out?</SectionLabel>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] text-[var(--fm-text-primary)]">
              We cover the setup, not just the paperwork.
            </h2>
            <div className="mt-8 space-y-5">
              {[
                "Company formation and entity setup",
                "Banking and payment stack recommendations",
                "Compliance, tax, and documentation strategy",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-[var(--fm-radius-md)] bg-[var(--fm-surface-raised)] p-4"
                >
                  <span className="mt-0.5 flex size-7 items-center justify-center rounded-[var(--fm-radius-pill)] bg-[var(--fm-lime-soft)] text-sm font-bold text-[var(--fm-lime)]">
                    ✓
                  </span>
                  <p className="text-fm-body text-[var(--fm-text-secondary)]">{item}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card variant="standard" className="p-6 md:p-8">
            <div className="mb-6">
              <SectionLabel>Send a message</SectionLabel>
              <h3 className="mt-2 text-3xl font-black tracking-[-0.05em] text-[var(--fm-text-primary)]">
                Tell us about your business
              </h3>
            </div>
            <form
              className="grid gap-5"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <div className="grid gap-5 md:grid-cols-2">
                {[
                  ["Full name", "Your name", "text"],
                  ["Email address", "you@example.com", "email"],
                ].map(([label, placeholder, type]) => (
                  <label
                    key={label}
                    className="block text-sm font-semibold text-[var(--fm-text-primary)]"
                  >
                    {label}
                    <input
                      required
                      type={type}
                      placeholder={placeholder}
                      className="mt-2 w-full rounded-[var(--fm-radius-md)] border border-[var(--fm-border)] bg-[var(--fm-surface-raised)] px-4 py-3.5 text-base text-[var(--fm-text-primary)] outline-none placeholder:text-[var(--fm-text-tertiary)] transition focus:border-[var(--fm-lime)] focus:ring-4 focus:ring-[var(--fm-lime-soft)]"
                    />
                  </label>
                ))}
              </div>
              <label className="block text-sm font-semibold text-[var(--fm-text-primary)]">
                Service needed
                <select
                  defaultValue="LLC Formation"
                  className="mt-2 w-full rounded-[var(--fm-radius-md)] border border-[var(--fm-border)] bg-[var(--fm-surface-raised)] px-4 py-3.5 text-base text-[var(--fm-text-primary)] outline-none transition focus:border-[var(--fm-lime)] focus:ring-4 focus:ring-[var(--fm-lime-soft)]"
                >
                  <option>LLC Formation</option>
                  <option>EIN</option>
                  <option>Banking</option>
                  <option>Payment Gateway</option>
                  <option>Other</option>
                </select>
              </label>
              <label className="block text-sm font-semibold text-[var(--fm-text-primary)]">
                Message
                <textarea
                  required
                  rows={6}
                  placeholder="Tell us about your business, timeline, and what you want to achieve."
                  className="mt-2 w-full resize-none rounded-[var(--fm-radius-md)] border border-[var(--fm-border)] bg-[var(--fm-surface-raised)] px-4 py-3.5 text-base text-[var(--fm-text-primary)] outline-none placeholder:text-[var(--fm-text-tertiary)] transition focus:border-[var(--fm-lime)] focus:ring-4 focus:ring-[var(--fm-lime-soft)]"
                />
              </label>
              <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
                <CardAction
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    const form = e.currentTarget.closest("form");
                    form?.requestSubmit();
                  }}
                  className="sm:w-auto"
                >
                  Send inquiry
                </CardAction>
                <span className="text-sm text-[var(--fm-text-secondary)]">
                  Response time: under 24 hours
                </span>
              </div>
              {sent && (
                <div className="rounded-[var(--fm-radius-md)] border border-[var(--fm-success)]/30 bg-[var(--fm-success-soft)] px-4 py-3 text-sm font-medium text-[var(--fm-success)]">
                  Thanks — your inquiry has been captured locally and we&apos;ll follow up shortly.
                </div>
              )}
            </form>
          </Card>
        </div>
      </section>
    </main>
  );
}
