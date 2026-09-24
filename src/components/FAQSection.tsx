"use client";

import { useState } from "react";
import { SectionLabel } from "@/components/ui/design-system";

const FAQS = [
  {
    q: "Do I need to travel to the U.S. to form my LLC?",
    a: "No. The entire process, formation, EIN, registered agent, and bank account setup, is handled remotely. Nothing requires you to step outside Pakistan.",
  },
  {
    q: "I don't have an SSN or ITIN. Can I still get an EIN?",
    a: "Yes. We file your EIN directly with the IRS as a non-resident without an SSN. If your bank or payment processor later requires an ITIN, we handle that application too.",
  },
  {
    q: "Which state should I register my LLC in?",
    a: "It depends on your goals. Wyoming is the most popular for non-residents thanks to low fees and no state income tax. Use the State Explorer above to compare filing fees, renewals, and deadlines before you decide.",
  },
  {
    q: "How long does the entire process take?",
    a: "Most LLCs are filed and approved within 5 to 10 business days, depending on the state. EIN issuance and bank/payment gateway approvals can take a little longer and we track every step in your dashboard.",
  },
  {
    q: "Will Stripe, PayPal, and Payoneer actually work for me?",
    a: "Yes, once your LLC, EIN, and business bank account are active, we help you activate Stripe, PayPal, Payoneer, Wise, and Zelle under your U.S. entity, built specifically for non-resident founders.",
  },
  {
    q: "What happens after the first year?",
    a: "Your Audvertax dashboard tracks every renewal and compliance deadline automatically, registered agent, annual reports, and state fees, so nothing lapses and you're never caught off guard.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="relative isolate bg-[var(--fm-graphite)] text-[var(--fm-text-primary)]"
      style={{ padding: "clamp(72px,10vh,110px) 24px", scrollMarginTop: 90 }}
    >
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 items-start gap-9 lg:grid-cols-[minmax(260px,1fr)_minmax(300px,1.6fr)] lg:gap-20">
        <div className="lg:sticky lg:top-[110px]">
          <SectionLabel>FAQ</SectionLabel>
          <h2
            id="faq-heading"
            className="mt-4 font-display text-fm-section font-extrabold text-[var(--fm-text-primary)]"
          >
            The questions every founder asks first.
          </h2>
          <p className="mt-[18px] text-fm-body text-[var(--fm-text-secondary)]">
            Something else on your mind? Support replies in minutes, any hour Pakistan keeps.
          </p>
        </div>

        <div className="border-t border-[var(--fm-border)]">
          {FAQS.map((item, i) => {
            const open = openIndex === i;

            return (
              <div key={item.q} className="border-b border-[var(--fm-border)]">
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : i)}
                  className="flex w-full items-center justify-between gap-6 bg-transparent px-1.5 py-6 text-left transition-colors duration-[var(--fm-motion-component)] ease-[var(--fm-motion-ease)] hover:text-[var(--fm-lime)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fm-lime)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--fm-graphite)]"
                  aria-expanded={open}
                >
                  <span
                    className="font-display font-bold text-[var(--fm-text-primary)]"
                    style={{ fontSize: "clamp(16.5px,1.6vw,19px)", lineHeight: 1.35 }}
                  >
                    {item.q}
                  </span>
                  <span
                    className="flex-shrink-0 font-mono text-2xl leading-none text-[var(--fm-lime)] transition-transform duration-[var(--fm-motion-component)] ease-[var(--fm-motion-ease)]"
                    style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>
                <div
                  className="grid transition-[grid-template-rows] duration-[var(--fm-motion-component)] ease-[var(--fm-motion-ease)]"
                  style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[680px] px-1.5 pb-[26px] text-fm-body text-[var(--fm-text-secondary)]">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
