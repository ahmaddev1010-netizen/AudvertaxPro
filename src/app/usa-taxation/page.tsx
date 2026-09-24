import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Card, IconContainer, SectionLabel } from "@/components/ui/design-system";

const offerings = [
  {
    title: "ITIN",
    price: 150,
    description: "ITIN application support for eligible applicants.",
    href: "/itin-processing/application",
    label: "Start ITIN",
  },
  {
    title: "International EIN — Resident",
    price: 10,
    description: "International EIN support for the resident pathway.",
    href: "/ein-without-ssn/application?variant=resident",
    label: "Start Resident EIN",
  },
  {
    title: "International EIN — Non-Resident",
    price: 25,
    description: "International EIN support for the non-resident pathway.",
    href: "/ein-without-ssn/application?variant=non-resident",
    label: "Start Non-Resident EIN",
  },
];

export default function UsaTaxationPage() {
  return (
    <main className="fm-page overflow-hidden">
      <section className="fm-page-hero relative isolate overflow-hidden border-b border-[var(--fm-border)] bg-[radial-gradient(circle_at_87%_18%,color-mix(in_srgb,var(--fm-lime)_14%,transparent),transparent_28%),linear-gradient(135deg,var(--fm-graphite-deep)_0%,var(--fm-graphite)_100%)] px-5 text-[var(--fm-text-primary)] sm:px-8">
        <div className="fm-page-hero-grid" />
        <div className="fm-page-container relative z-[1]">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[.08em] text-[var(--fm-lime)] hover:text-[var(--fm-lime-bright)]"
          >
            ← All services
          </Link>
          <div className="fm-page-hero-copy mt-14">
            <SectionLabel>USA / Taxation</SectionLabel>
            <h1 className="fm-page-hero-title max-w-[10ch]">Choose your U.S. tax service.</h1>
            <p className="fm-page-hero-description max-w-[650px]">
              Select the taxation service that matches your needs. Each package has its own
              requirements and application flow.
            </p>
          </div>
        </div>
      </section>

      <section className="fm-page-section bg-[var(--fm-graphite-deep)] px-5 text-[var(--fm-text-primary)] sm:px-8">
        <div className="fm-page-container">
          <div className="mb-10">
            <SectionLabel>USA / Taxation</SectionLabel>
            <h2 className="fm-page-section-heading mt-4 max-w-[700px]">Choose a service.</h2>
          </div>
          <div className="grid grid-cols-1 gap-fm-4 lg:grid-cols-3">
            {offerings.map((offering, index) => (
              <Link key={offering.title} href={offering.href} className="group block">
                <Card
                  variant="interactive"
                  tone="dark"
                  className="fm-page-service-card flex h-full flex-col items-start p-7 sm:p-8"
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="font-mono text-[10px] font-bold tracking-[.16em] text-[var(--fm-lime-bright)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <ArrowUpRight className="size-4 text-[var(--fm-text-tertiary)] transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[var(--fm-lime-bright)]" />
                  </div>
                  <h3 className="mt-8 max-w-[360px] font-display text-2xl font-bold tracking-[-.04em] text-[var(--fm-card-text)] sm:text-3xl">
                    {offering.title}
                  </h3>
                  <p className="mt-4 max-w-[420px] text-[15px] leading-7 text-[var(--fm-card-muted)]">
                    {offering.description}
                  </p>
                  <div className="mt-7 font-display text-4xl font-extrabold tracking-[-.04em] text-[var(--fm-card-text)]">
                    $ {offering.price}
                  </div>
                  <span className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-bold text-[var(--fm-lime-bright)]">
                    {offering.label}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="fm-page-section bg-[var(--fm-surface)] px-5 text-[var(--fm-text-primary)] sm:px-8">
        <div className="fm-page-container">
          <div className="grid gap-12 lg:grid-cols-[1fr_.7fr] lg:items-end lg:gap-16">
            <div>
              <SectionLabel>Application flow</SectionLabel>
              <h2 className="fm-page-section-heading max-w-2xl">
                Each selection opens the same simple application surface with service-specific
                requirements.
              </h2>
              <p className="mt-5 max-w-2xl text-fm-body leading-7 text-[var(--fm-text-secondary)]">
                The selected service and variant are included with the submitted application.
                Required documents are uploaded with the application and stored with it.
              </p>
            </div>
            <Card variant="standard" tone="default" className="p-7 sm:p-8">
              <IconContainer className="mb-7 bg-[var(--fm-lime)] text-[var(--fm-graphite-deep)]">
                US
              </IconContainer>
              <p className="text-lg leading-[1.45] text-[var(--fm-text-primary)]">
                Start with the tax service you need. The application asks only for the information
                and documents relevant to that service.
              </p>
              <Link href="/services" className="fm-page-action fm-page-action--outline mt-7 w-fit">
                Explore other services <ArrowRight className="size-4" />
              </Link>
            </Card>
          </div>
        </div>
      </section>

      <section className="fm-page-cta">
        <div className="fm-page-container fm-page-cta-inner px-5 sm:px-8">
          <div>
            <SectionLabel className="text-[var(--fm-graphite-deep)]">Keep exploring</SectionLabel>
            <h2 className="fm-page-section-heading">Build the full stack.</h2>
            <p className="fm-page-cta-description">
              Choose another service when you are ready for the next step.
            </p>
          </div>
          <Link href="/services" className="fm-page-action fm-page-action--lime-outline">
            View all services <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
