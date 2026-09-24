import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { Card, IconContainer, SectionLabel } from "@/components/ui/design-system";
import { getServiceBySlug } from "@/lib/services";
import { getServiceBySlug as getCommercialService } from "@/lib/services/commercial-catalog";

export default function UsaTaxationPage() {
  const service = getServiceBySlug("usa-taxation");
  const itin = getCommercialService("itin-processing");
  const ein = getCommercialService("ein-without-ssn");
  if (!service || !itin || !ein) notFound();

  const resident = ein.variants?.find((variant) => variant.variantSlug === "resident");
  const nonResident = ein.variants?.find((variant) => variant.variantSlug === "non-resident");
  if (!resident || !nonResident) notFound();

  const offerings = [
    {
      title: "ITIN",
      price: itin.variants?.[0]?.price ?? 150,
      description: "ITIN application support for eligible applicants.",
      href: "/itin-processing/apply",
      label: "Start ITIN",
    },
    {
      title: "International EIN — Resident",
      price: resident.price,
      description: "International EIN support for the resident pathway.",
      href: "/ein-without-ssn/apply?variant=resident",
      label: "Start Resident EIN",
    },
    {
      title: "International EIN — Non-Resident",
      price: nonResident.price,
      description: "International EIN support for the non-resident pathway.",
      href: "/ein-without-ssn/apply?variant=non-resident",
      label: "Start Non-Resident EIN",
    },
  ];

  return (
    <main className="fm-page">
      <section className="fm-page-hero relative isolate overflow-hidden border-b border-[var(--fm-border)] bg-[radial-gradient(circle_at_87%_18%,color-mix(in_srgb,var(--fm-lime)_14%,transparent),transparent_28%),linear-gradient(135deg,var(--fm-graphite-deep)_0%,var(--fm-graphite)_100%)] px-5 text-[var(--fm-text-primary)] sm:px-8">
        <div className="fm-page-hero-grid" />
        <div className="fm-page-container relative z-[1]">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[.08em] text-[var(--fm-lime)] transition-[transform,color] duration-[var(--fm-motion-micro)] ease-[var(--fm-motion-ease)] hover:-translate-x-1 hover:text-[var(--fm-lime-bright)]"
          >
            <span aria-hidden="true">←</span> All services
          </Link>

          <div className="fm-page-hero-grid-layout mt-14">
            <div className="fm-page-hero-copy">
              <SectionLabel>USA / Taxation</SectionLabel>
              <h1 className="fm-page-hero-title max-w-[10ch]">Choose your U.S. tax service.</h1>
              <p className="fm-page-hero-description max-w-[650px]">
                Select the exact service you need. Each option goes directly to its requirement and
                application flow.
              </p>
            </div>

            <Card variant="elevated" tone="lime" className="fm-page-hero-feature">
              <div className="fm-page-feature-orbit fm-page-feature-orbit--medium" />
              <span className="fm-page-hero-feature-label">Audvertax / tax desk</span>
              <strong className="fm-page-hero-feature-title">Choose the right tax pathway.</strong>
              <p className="fm-page-hero-feature-description">
                Start with the identification or tax number service that matches your U.S. filing
                needs.
              </p>
              <div className="fm-page-hero-feature-divider" />
              <span className="fm-page-hero-feature-meta">3 services available</span>
            </Card>
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
                  className="fm-page-service-card flex flex-col items-start p-7 sm:p-8"
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="font-mono text-[10px] font-bold tracking-[.16em] text-[var(--fm-lime-bright)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <ArrowUpRight className="size-4 text-[var(--fm-text-tertiary)] transition-transform duration-[var(--fm-motion-micro)] ease-[var(--fm-motion-ease)] group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[var(--fm-lime-bright)]" />
                  </div>
                  <h3 className="mt-8 max-w-[360px] font-display text-2xl font-bold tracking-[-.04em] text-[var(--fm-card-text)] sm:text-3xl">
                    {offering.title}
                  </h3>
                  <p className="mt-4 max-w-[420px] text-[15px] leading-7 text-[var(--fm-card-muted)]">
                    {offering.description}
                  </p>
                  <div className="mt-7 font-display text-4xl font-extrabold tracking-[-.04em] text-[var(--fm-card-text)]">
                    ${offering.price}
                  </div>
                  <span className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-bold text-[var(--fm-lime-bright)]">
                    {offering.label}
                    <ArrowRight className="size-4 transition-transform duration-[var(--fm-motion-micro)] ease-[var(--fm-motion-ease)] group-hover:translate-x-1" />
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
                Your selected service opens its own requirement workflow.
              </h2>
              <p className="mt-5 max-w-2xl text-fm-body leading-7 text-[var(--fm-text-secondary)]">
                Your legal details, contact information, supporting documents and checkout are
                handled inside the existing application engine. The commercial variant is persisted
                with the application so the correct price reaches billing.
              </p>
            </div>

            <Card variant="standard" tone="default" className="p-7 sm:p-8">
              <IconContainer className="mb-7 bg-[var(--fm-lime)] text-[var(--fm-graphite-deep)]">
                US
              </IconContainer>
              <p className="text-lg leading-[1.45] text-[var(--fm-text-primary)]">
                Select the service that matches your U.S. tax requirement, then continue through its
                dedicated application flow.
              </p>
              <Link href="/services" className="fm-page-action fm-page-action--outline mt-7 w-fit">
                Explore other services
                <ArrowRight className="size-4" />
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
            View all services
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
