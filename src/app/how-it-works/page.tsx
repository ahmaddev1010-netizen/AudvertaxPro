import Link from "next/link";
import {
  ArrowRight,
  Check,
  FileText,
  Globe,
  Buildings,
  ShieldCheck,
} from "@phosphor-icons/react/dist/ssr";
import { Card, SectionLabel } from "@/components/ui/design-system";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    title: "Choose your service",
    description:
      "Tell us what you want to build. Start with a USA LLC, UK LTD, or another business service and select the option that fits your goals.",
    icon: Globe,
    label: "Choose",
  },
  {
    number: "02",
    title: "Complete your application",
    description:
      "Work through a guided application and provide the founder, company, and identity information required for your service.",
    icon: FileText,
    label: "Apply",
  },
  {
    number: "03",
    title: "We handle the process",
    description:
      "Our team reviews your information and coordinates the relevant formation, filing, and supporting service steps.",
    icon: ShieldCheck,
    label: "Process",
  },
  {
    number: "04",
    title: "Receive your documents",
    description:
      "Track your progress, receive your formation documents, and move on to the next stage of operating your business.",
    icon: Buildings,
    label: "Operate",
  },
];

const expectations = [
  "A guided application instead of a confusing filing process",
  "Clear progress through each stage of your service",
  "One place for your documents and application information",
  "A path from formation into banking, payments, and compliance",
];

export default function Page() {
  return (
    <main className="fm-page overflow-hidden">
      <section className="fm-page-hero fm-page-hero--balanced relative isolate border-b border-[var(--fm-border)] bg-[radial-gradient(circle_at_78%_18%,var(--fm-hero-glow),transparent_28%),linear-gradient(135deg,var(--fm-graphite-deep)_0%,var(--fm-surface)_100%)] px-5 text-[var(--fm-text-primary)] sm:px-8">
        <div className="fm-page-hero-grid" />
        <div className="fm-page-container relative">
          <div className="max-w-[900px]">
            <SectionLabel>How it works</SectionLabel>
            <h1 className="fm-page-hero-title text-[var(--fm-text-primary)]">
              From idea to <span className="text-[var(--fm-lime)]">business,</span> without the
              guesswork.
            </h1>
            <p className="fm-page-hero-description max-w-[650px]">
              Audvertax turns company formation into a clear, staged process. Choose a service,
              complete your application, let us handle the work, and keep moving.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button render={<Link href="/services" />}>
                Explore services <ArrowRight weight="bold" className="h-4 w-4" />
              </Button>
              <Button render={<Link href="/pricing" />} variant="outline">
                View pricing
              </Button>
            </div>
          </div>
        </div>
      </section>
      <section className="fm-page-section px-5 sm:px-8">
        <div className="fm-page-container">
          <div className="mb-12 max-w-[650px]">
            <SectionLabel>The process</SectionLabel>
            <h2 className="fm-page-section-heading text-[var(--fm-text-primary)]">
              Four stages. One clear path.
            </h2>
            <p className="mt-4 text-fm-body text-[var(--fm-text-secondary)]">
              Every stage has a clear purpose, so you always know what happens next.
            </p>
          </div>
          <div className="relative grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-fm-5">
            <div className="pointer-events-none absolute left-[12%] right-[12%] top-[76px] hidden h-px bg-gradient-to-r from-transparent via-[var(--fm-lime)]/35 to-transparent lg:block" />
            {steps.map(({ number, title, description, icon: Icon, label }) => (
              <Card
                key={number}
                variant="interactive"
                tone="default"
                className="group relative border-t-0 p-6 sm:p-7"
              >
                <div className="relative flex items-center justify-between">
                  <div className="fm-page-icon-tile">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-[11px] font-bold tracking-[.12em] text-[var(--fm-card-muted)]">
                    {number}
                  </span>
                </div>
                <div className="mt-7 fm-label text-[10px]">{label}</div>
                <h3 className="mt-2 font-display text-xl font-extrabold tracking-[-.03em] text-[var(--fm-card-text)]">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[var(--fm-card-muted)]">{description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="px-5 pb-20 sm:px-8 sm:pb-24 lg:pb-28">
        <Card
          variant="elevated"
          tone="default"
          className="mx-auto grid max-w-[1400px] overflow-hidden p-0 lg:grid-cols-[1fr_.9fr]"
        >
          <div className="p-8 sm:p-10 lg:p-14">
            <SectionLabel>What you can expect</SectionLabel>
            <h2 className="mt-4 max-w-[600px] font-display text-3xl font-extrabold tracking-[-.045em] text-[var(--fm-card-text)] sm:text-4xl">
              A guided experience built around the work you actually need to get done.
            </h2>
            <div className="mt-8 grid gap-4">
              {expectations.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 text-sm leading-6 text-[var(--fm-card-muted)]"
                >
                  <span className="mt-0.5 grid h-5 w-5 flex-shrink-0 place-items-center rounded-full bg-[var(--fm-lime)]/12 text-[var(--fm-lime)]">
                    <Check className="h-3 w-3" />
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="relative flex min-h-[330px] items-end overflow-hidden bg-[var(--fm-lime)] p-8 text-[var(--fm-graphite-deep)] sm:p-10 lg:p-14">
            <div className="fm-page-feature-orbit fm-page-feature-orbit--large" />
            <div className="relative">
              <div className="font-mono text-[10px] font-bold uppercase tracking-[.16em] text-[var(--fm-graphite-deep)]/60">
                Your next move
              </div>
              <div className="mt-3 font-display text-3xl font-extrabold tracking-[-.045em]">
                Start with the service that matches your goal.
              </div>
              <Button render={<Link href="/services" />} variant="card" className="mt-7">
                Browse services <ArrowRight weight="bold" className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </section>
      <section className="fm-page-cta">
        <div className="fm-page-container fm-page-cta-inner px-6 md:px-8">
          <div>
            <SectionLabel>03 / Next move</SectionLabel>
            <h2 className="fm-page-section-heading max-w-[720px] text-[var(--fm-graphite-deep)]">
              Not sure which service comes first?
            </h2>
            <p className="fm-page-cta-description">
              Start with the process and see how Foremint connects the right service to the next
              step.
            </p>
          </div>
          <Link
            href="/how-it-works"
            className="fm-page-action fm-page-action--lime-outline group w-fit"
          >
            See how it works
            <ArrowRight className="h-5 w-5 transition-transform duration-[var(--fm-motion-micro)] ease-[var(--fm-motion-ease)] group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>
      </section>
    </main>
  );
}
