import { Card } from "@/components/ui/design-system";

const STEPS = [
  {
    n: "01",
    title: "Sign Up",
    desc: "Pick your entity, U.S. LLC or UK Ltd, and fill in your details. The entire onboarding takes under 10 minutes. No lawyers, no jargon, no flying to the U.S.",
  },
  {
    n: "02",
    title: "We Verify",
    desc: "Our team reviews your information, runs compliance checks, and confirms every detail is accurate and IRS-ready before touching any state or HMRC filings.",
  },
  {
    n: "03",
    title: "We File Everything",
    desc: "LLC/Ltd formation, EIN or ITIN application, registered agent, and operating agreement, all done in your name, by our specialists, while you focus on your work.",
  },
  {
    n: "04",
    title: "Start Getting Paid",
    desc: "Your Audvertax docs arrive in your Audvertax dashboard. We activate Stripe, PayPal, Payoneer, and Zelle under your new entity so you can invoice global clients today.",
  },
];

export default function ProcessSection() {
  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="relative isolate overflow-hidden bg-[var(--fm-graphite)] px-5 py-[clamp(80px,10vh,120px)] sm:px-8 lg:px-12"
    >
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(55%_45%_at_50%_100%,color-mix(in_srgb,var(--fm-lime)_5%,transparent),transparent_65%),radial-gradient(40%_40%_at_10%_30%,color-mix(in_srgb,var(--fm-lime)_3.5%,transparent),transparent_65%)]" />
      <div className="relative z-[1] mx-auto max-w-[1200px]">
        <h2
          id="process-heading"
          className="font-display text-fm-section font-extrabold tracking-[-.05em] text-[var(--fm-text-primary)]"
        >
          How Audvertax works
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-fm-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <Card key={step.n} variant="interactive" className="p-6">
              <div className="mb-6 flex items-center gap-4">
                <span className="font-mono text-sm font-bold tracking-[.12em] text-[var(--fm-lime)]">
                  {step.n}
                </span>
              </div>
              <h3 className="mb-3 font-display text-xl font-bold tracking-[-.025em] text-[var(--fm-text-primary)]">
                {step.title}
              </h3>
              <p className="text-[14.5px] leading-7 text-[var(--fm-text-secondary)]">{step.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
