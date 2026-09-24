import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Card, IconContainer, SectionLabel } from "@/components/ui/design-system";
import { getServiceBySlug } from "@/lib/services";

export const metadata = {
  title: "UK LTD Formation | Audvertax",
  description: "Form a UK private limited company through a guided application with Audvertax.",
};

export default function UKLTDPage() {
  const service = getServiceBySlug("uk-ltd");
  if (!service) return null;

  const journey = [
    "Choose your package",
    "Complete company details",
    "Add optional services",
    "Review and checkout",
    "Track your order",
  ];

  const formationSteps = [
    ["01", "Company", "Set up the legal entity and core company details."],
    ["02", "Services", "Add only the operational services your business needs."],
    ["03", "Progress", "Review, pay and track the formation from one place."],
  ];

  return (
    <main className="overflow-hidden bg-[var(--fm-graphite)] text-[var(--fm-text-primary)]">
      <section className="fm-page-hero border-b border-[var(--fm-border)] bg-[var(--fm-graphite-deep)]">
        <div className="fm-page-container fm-page-hero-grid-layout px-6 md:px-8">
          <div className="fm-page-hero-copy">
            <SectionLabel>UK LTD Formation</SectionLabel>
            <h1 className="fm-page-hero-title max-w-3xl">Start your UK company from anywhere.</h1>
            <p className="fm-page-hero-description max-w-2xl">
              Form your UK private limited company through a guided application, with a clear setup
              process for local and international founders.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/uk-ltd/apply"
                className="fm-page-action bg-[var(--fm-lime)] text-[var(--fm-graphite-deep)] hover:bg-[var(--fm-lime-bright)]"
              >
                Start your UK LTD
                <ArrowUpRight className="h-5 w-5" />
              </Link>
              <Link href="/services" className="fm-page-action fm-page-action--secondary">
                View services
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--fm-text-tertiary)]">
              <span>✓ Guided application</span>
              <span>✓ Remote-friendly process</span>
              <span>✓ Formation support</span>
            </div>
          </div>

          <Card
            variant="feature"
            className="fm-page-hero-feature bg-[var(--fm-lime)] text-[var(--fm-graphite-deep)]"
          >
            <div className="fm-page-feature-orbit fm-page-feature-orbit--large" />
            <span className="fm-page-hero-feature-label">Formation journey</span>
            <div className="mt-6 space-y-2">
              {journey.map((title, index) => (
                <div
                  key={title}
                  className="relative z-[1] flex items-center gap-4 p-3 transition-colors duration-[var(--fm-motion-component)] ease-[var(--fm-motion-ease)] hover:bg-[color-mix(in_srgb,var(--fm-graphite-deep)_6%,transparent)]"
                >
                  <IconContainer className="size-9 rounded-full border-[var(--fm-graphite-deep)] bg-transparent text-xs font-mono font-semibold text-[var(--fm-graphite-deep)]">
                    {String(index + 1).padStart(2, "0")}
                  </IconContainer>
                  <span className="text-sm font-medium text-[var(--fm-graphite-deep)]">
                    {title}
                  </span>
                </div>
              ))}
            </div>
            <div className="fm-page-hero-feature-divider" />
            <span className="fm-page-hero-feature-meta">UK / LTD Formation</span>
          </Card>
        </div>
      </section>

      <section className="fm-page-section border-b border-[var(--fm-border)] bg-[var(--fm-graphite-deep)]">
        <div className="fm-page-container px-6 md:px-8">
          <div className="mb-12 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <SectionLabel>01 / Packages</SectionLabel>
              <h2 className="fm-page-section-heading max-w-[760px]">
                Choose the level of support you need.
              </h2>
            </div>
            <p className="max-w-[360px] text-sm leading-6 text-[var(--fm-text-secondary)]">
              Start with essential formation or choose a more complete setup.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {service.packages?.map((pkg) => {
              const featured = pkg.slug === "premium";
              return (
                <Link
                  key={pkg.slug}
                  href={`/uk-ltd/apply?package=${encodeURIComponent(pkg.slug)}`}
                  className={`group relative min-h-[250px] flex flex-col justify-between overflow-hidden rounded-[var(--fm-radius-feature)] border p-6 text-left shadow-[var(--fm-shadow-subtle)] transition-[transform,border-color,background-color,box-shadow] duration-[var(--fm-motion-component)] ease-[var(--fm-motion-ease)] hover:-translate-y-1 hover:shadow-[var(--fm-shadow-elevated)] ${featured ? "border-[var(--fm-lime)] bg-[var(--fm-lime)] text-[var(--fm-graphite-deep)] -translate-y-1 shadow-[0_18px_50px_color-mix(in_srgb,var(--fm-lime)_18%,transparent)]" : "border-[var(--fm-card-border)] bg-[var(--fm-card-bg)] text-[var(--fm-text-primary)] hover:border-[var(--fm-border-accent)] hover:bg-[var(--fm-surface-raised)]"}`}
                >
                  <div>
                    <span
                      className={`pointer-events-none absolute inset-x-0 top-0 h-1 bg-[var(--fm-lime)] opacity-0 transition-opacity duration-[var(--fm-motion-component)] group-hover:opacity-100 ${featured ? "opacity-100 bg-[var(--fm-graphite-deep)]" : ""}`}
                    />
                    <p
                      className={`font-mono text-[10px] font-bold uppercase tracking-[.14em] ${featured ? "text-[var(--fm-graphite-deep)] opacity-70" : "text-[var(--fm-text-secondary)]"}`}
                    >
                      {pkg.name}
                    </p>
                    {featured && (
                      <span className="mt-2 inline-flex rounded-[var(--fm-radius-pill)] bg-[var(--fm-graphite-deep)] px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[.08em] text-[var(--fm-lime)] w-fit">
                        Recommended
                      </span>
                    )}
                    <p className="mt-3 font-display text-4xl font-extrabold tracking-[-.04em]">
                      £{pkg.price}
                    </p>
                    <p
                      className={`mt-3 min-h-[40px] text-xs leading-5 ${featured ? "text-[var(--fm-graphite-deep)] opacity-80" : "text-[var(--fm-text-secondary)]"}`}
                    >
                      {pkg.description}
                    </p>
                    <ul
                      className={`mt-5 space-y-2 border-t pt-4 ${featured ? "border-[color-mix(in_srgb,var(--fm-graphite-deep)_20%,transparent)]" : "border-[var(--fm-border)]"}`}
                    >
                      {pkg.features.map((feature) => (
                        <li
                          key={feature}
                          className={`flex gap-2 text-xs ${featured ? "text-[var(--fm-graphite-deep)]" : "text-[var(--fm-text-secondary)]"}`}
                        >
                          <span
                            className={
                              featured
                                ? "font-bold text-[var(--fm-graphite-deep)]"
                                : "font-bold text-[var(--fm-lime)]"
                            }
                          >
                            ✓
                          </span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <span
                    className={`mt-5 inline-flex items-center gap-2 text-xs font-bold ${featured ? "text-[var(--fm-graphite-deep)]" : "text-[var(--fm-lime-bright)]"}`}
                  >
                    Choose {pkg.name}
                    <ArrowRight className="h-4 w-4 transition-transform duration-[var(--fm-motion-micro)] ease-[var(--fm-motion-ease)] group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="fm-page-section border-b border-[var(--fm-border)]">
        <div className="fm-page-container px-6 md:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
            <div>
              <SectionLabel>02 / Formation decision</SectionLabel>
              <h2 className="fm-page-section-heading max-w-[620px]">
                A UK company setup should feel like a system, not a form.
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {formationSteps.map(([number, title, description]) => (
                <Card key={number} variant="interactive" className="fm-page-service-card p-5">
                  <p className="font-mono text-[11px] text-[var(--fm-lime)]">{number}</p>
                  <h3 className="mt-6 text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--fm-text-secondary)]">
                    {description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="fm-page-cta">
        <div className="fm-page-container fm-page-cta-inner px-6 md:px-8">
          <div>
            <SectionLabel>03 / Ready when you are</SectionLabel>
            <h2 className="fm-page-section-heading max-w-[720px] text-[var(--fm-graphite-deep)]">
              Ready to establish your UK company?
            </h2>
            <p className="fm-page-cta-description">
              Complete the guided application and move from company idea to UK registration.
            </p>
          </div>
          <Link
            href="/uk-ltd/apply"
            className="fm-page-action fm-page-action--lime-outline group w-fit"
          >
            Start your UK LTD
            <ArrowUpRight className="h-5 w-5 transition-transform duration-[var(--fm-motion-micro)] ease-[var(--fm-motion-ease)] group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>
      </section>
    </main>
  );
}
