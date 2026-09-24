import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  CreditCard,
  FileText,
  Landmark,
} from "lucide-react";
import Footer from "@/components/Footer";
import { getServiceBySlug } from "@/lib/services";
import { getServiceNavigationCardItems, serviceNavigationGroups } from "@/lib/service-navigation";
import { Card, SectionLabel } from "@/components/ui/design-system";

const icons = [Building2, FileText, Landmark, CreditCard];

export default function Services() {
  const serviceCards = getServiceNavigationCardItems();

  return (
    <main className="overflow-hidden bg-[var(--fm-graphite)] text-[var(--fm-text-primary)]">
      <section className="fm-page-hero border-b border-[var(--fm-border)] bg-[var(--fm-graphite-deep)]">
        <div className="fm-page-container fm-page-hero-grid-layout px-6 md:px-8">
          <div className="fm-page-hero-copy">
            <SectionLabel>Business infrastructure / services</SectionLabel>
            <h1 className="fm-page-hero-title max-w-3xl text-[var(--fm-text-primary)]">
              Build the <span className="text-[var(--fm-lime)]">infrastructure</span> behind your
              business.
            </h1>
            <p className="fm-page-hero-description max-w-2xl">
              Formation, tax, banking and payment infrastructure—connected into one guided path for
              founders building across borders.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#services"
                className="fm-page-action bg-[var(--fm-lime)] text-[var(--fm-graphite-deep)] hover:bg-[var(--fm-lime-bright)]"
              >
                Explore services
                <ArrowUpRight className="h-5 w-5" />
              </a>
              <Link href="/how-it-works" className="fm-page-action fm-page-action--secondary">
                See the process
                <span className="font-mono text-[10px] text-[var(--fm-text-tertiary)]">01—05</span>
              </Link>
            </div>
          </div>

          <Card
            variant="feature"
            className="fm-page-hero-feature bg-[var(--fm-lime)] text-[var(--fm-graphite-deep)]"
          >
            <div className="fm-page-feature-orbit fm-page-feature-orbit--large" />
            <span className="fm-page-hero-feature-label">Audvertax / service desk</span>
            <strong className="fm-page-hero-feature-title">
              One place for the rails behind your business.
            </strong>
            <p className="fm-page-hero-feature-description">
              Choose formation, tax and operational services by market, then move into the guided
              workflow for the service you need.
            </p>
            <div className="fm-page-hero-feature-divider" />
            <span className="fm-page-hero-feature-meta">USA / UK / UAE / Pakistan</span>
          </Card>
        </div>
      </section>

      <section id="services" className="fm-page-section bg-[var(--fm-graphite-deep)]">
        <div className="fm-page-container px-6 md:px-8">
          <div className="mb-12 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <SectionLabel>01 / Service stack</SectionLabel>
              <h2 className="fm-page-section-heading max-w-[760px] text-[var(--fm-text-primary)]">
                Choose the rail your business needs next.
              </h2>
            </div>
            <p className="max-w-[360px] text-sm leading-6 text-[var(--fm-text-secondary)]">
              Each service is designed to connect with the next step, so your business
              infrastructure grows as one system.
            </p>
          </div>

          <div className="flex flex-col gap-14">
            {serviceNavigationGroups.map((country) => (
              <section
                key={country.title}
                aria-labelledby={`services-${country.title.toLowerCase()}`}
              >
                <div className="mb-6 flex items-center gap-4 border-b border-[var(--fm-border)] pb-4">
                  <h3
                    id={`services-${country.title.toLowerCase()}`}
                    className="font-display text-2xl font-bold tracking-[-.035em] sm:text-3xl"
                  >
                    {country.title}
                  </h3>
                  <span className="h-px flex-1 bg-[var(--fm-border-soft)]" />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {serviceCards
                    .filter((card) => card.country === country.title)
                    .map((card, index) => {
                      const service = getServiceBySlug(card.slug);
                      const Icon = icons[index % icons.length];
                      if (!service && !card.hasChildren) return null;

                      return (
                        <Card
                          key={card.slug}
                          variant="interactive"
                          tone="dark"
                          className="group relative min-h-[330px] overflow-hidden p-7 sm:p-9"
                        >
                          <Link
                            href={card.slug === "uk-ltd" ? "/uk-ltd" : `/${card.slug}`}
                            className="absolute inset-0 z-[1]"
                            aria-label={`Explore ${card.title}`}
                          />
                          <div className="fm-page-feature-orbit fm-page-feature-orbit--small transition-transform duration-[var(--fm-motion-component)] ease-[var(--fm-motion-ease)] group-hover:scale-110" />
                          <div className="relative z-[2] flex h-full flex-col justify-between pointer-events-none">
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="fm-page-icon-tile">
                                  <Icon className="h-5 w-5" />
                                </span>
                                <span className="font-mono text-[10px] font-bold tracking-[.16em] text-[var(--fm-text-tertiary)]">
                                  {String(index + 1).padStart(2, "0")}
                                </span>
                              </div>
                              <h4 className="mt-8 max-w-[520px] font-display text-3xl font-bold tracking-[-.045em] text-[var(--fm-card-text)] sm:text-4xl">
                                {service?.name ?? card.title}
                              </h4>
                              <p className="mt-4 max-w-[520px] text-[15px] leading-7 text-[var(--fm-card-muted)]">
                                {service?.shortDescription ??
                                  `Explore the ${card.title.toLowerCase()} services available in ${country.title}.`}
                              </p>
                            </div>
                            <span className="mt-9 inline-flex items-center gap-2 text-sm font-bold text-[var(--fm-lime-bright)]">
                              {card.hasChildren ? "View services" : "Explore service"}
                              <ArrowRight className="h-4 w-4 transition-transform duration-[var(--fm-motion-micro)] ease-[var(--fm-motion-ease)] group-hover:translate-x-1" />
                            </span>
                          </div>
                        </Card>
                      );
                    })}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section className="fm-page-section border-y border-[var(--fm-border)] bg-[var(--fm-graphite)]">
        <div className="fm-page-container px-6 md:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
            <div>
              <SectionLabel>02 / Connected by design</SectionLabel>
              <h2 className="fm-page-section-heading max-w-[620px] text-[var(--fm-text-primary)]">
                One business. Multiple rails. One guided experience.
              </h2>
            </div>
            <div className="grid gap-0 border-t border-[var(--fm-border)]">
              {[
                "Guided applications",
                "Centralized documents",
                "Payment readiness",
                "Compliance visibility",
              ].map((item, index) => (
                <div
                  key={item}
                  className="flex items-center justify-between border-b border-[var(--fm-border)] py-6"
                >
                  <div className="flex items-center gap-5">
                    <span className="font-mono text-[10px] text-[var(--fm-text-tertiary)]">
                      0{index + 1}
                    </span>
                    <strong className="text-base sm:text-lg">{item}</strong>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-[var(--fm-lime)]" />
                </div>
              ))}
            </div>
          </div>
        </div>
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
            <ArrowUpRight className="h-5 w-5 transition-transform duration-[var(--fm-motion-micro)] ease-[var(--fm-motion-ease)] group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
