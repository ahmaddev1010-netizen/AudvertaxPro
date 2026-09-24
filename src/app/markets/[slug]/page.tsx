import Link from "next/link";
import { ArrowLeft, ArrowRight, MapPin } from "@phosphor-icons/react/dist/ssr";
import { notFound } from "next/navigation";
import { Card, SectionLabel } from "@/components/ui/design-system";
import { getServiceHref } from "@/lib/services";
import { getMarketBySlug, getMarketHref, getMarketServices, markets } from "@/lib/markets";

export function generateStaticParams() {
  return markets.map((market) => ({ slug: market.slug }));
}

export default async function MarketPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const market = getMarketBySlug(slug);
  if (!market) return notFound();

  const serviceGroups = getMarketServices(market).filter(({ services }) => services.length > 0);
  const serviceCount = serviceGroups.reduce((total, group) => total + group.services.length, 0);

  return (
    <main className="fm-page overflow-hidden">
      <section className="relative isolate overflow-hidden border-b border-[var(--fm-border)] bg-[var(--fm-graphite-deep)] px-fm-5 pb-fm-20 pt-fm-20 text-[var(--fm-text-primary)] sm:px-fm-8 sm:pb-fm-24 sm:pt-fm-24 lg:pb-28 lg:pt-fm-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,var(--fm-hero-glow),transparent_28%),linear-gradient(135deg,var(--fm-graphite-deep)_0%,var(--fm-graphite)_100%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(var(--fm-hero-grid-line)_1px,transparent_1px),linear-gradient(90deg,var(--fm-hero-grid-line)_1px,transparent_1px)] [background-size:var(--fm-hero-grid-size)_var(--fm-hero-grid-size)] [mask-image:var(--fm-hero-grid-mask)]" />
        <div className="relative mx-auto max-w-[1400px]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[.08em] text-[var(--fm-lime)] transition-[transform,color] duration-[var(--fm-motion-micro)] ease-[var(--fm-motion-ease)] hover:-translate-x-1 hover:text-[var(--fm-lime-bright)]"
          >
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
          <div className="mt-14 grid items-end gap-fm-12 lg:grid-cols-[1.2fr_.8fr]">
            <div>
              <SectionLabel>Market / {market.code}</SectionLabel>
              <h1 className="mt-4 max-w-[9ch] font-display text-fm-hero font-bold tracking-[-.06em]">
                Build in {market.name}.
              </h1>
              <p className="mt-6 max-w-[650px] text-fm-body text-[var(--fm-text-secondary)]">
                {market.description}
              </p>
            </div>
            <Card
              variant="elevated"
              tone="lime"
              className="relative min-h-[250px] overflow-hidden p-7 sm:p-8"
            >
              <MapPin className="h-6 w-6 text-[var(--fm-graphite-deep)]" />
              <strong className="mt-12 block font-display text-4xl font-extrabold tracking-[-.05em] text-[var(--fm-graphite-deep)]">
                {serviceCount} services
              </strong>
              <p className="mt-3 max-w-[300px] text-sm leading-6 text-[rgba(16,19,16,.72)]">
                Explore the services available for businesses building and operating in{" "}
                {market.name}.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-[var(--fm-graphite-deep)] px-fm-5 py-fm-20 sm:px-fm-8 sm:py-fm-24 lg:py-28">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-12 max-w-[760px]">
            <SectionLabel>Services in {market.name}</SectionLabel>
            <h2 className="mt-4 font-display text-fm-section font-bold tracking-[-.05em] text-[var(--fm-text-primary)]">
              Everything you can explore for this market.
            </h2>
            <p className="mt-5 max-w-[650px] text-fm-body text-[var(--fm-text-secondary)]">
              Choose a service to view its dedicated service page, requirements and next steps.
            </p>
          </div>

          <div className="space-y-12">
            {serviceGroups.map(({ group, services }) => (
              <section
                key={group.title}
                aria-labelledby={`market-${market.slug}-${group.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`}
              >
                <div className="mb-5 flex items-end justify-between gap-4 border-b border-[var(--fm-border)] pb-4">
                  <h3
                    id={`market-${market.slug}-${group.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`}
                    className="font-display text-2xl font-bold tracking-[-.035em] text-[var(--fm-text-primary)]"
                  >
                    {group.title}
                  </h3>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[.12em] text-[var(--fm-text-tertiary)]">
                    {services.length} {services.length === 1 ? "service" : "services"}
                  </span>
                </div>
                <div className="grid gap-fm-4 md:grid-cols-2 lg:grid-cols-3">
                  {services.map((service, index) => (
                    <Link
                      key={service.slug}
                      href={getServiceHref(service.slug)}
                      className="group block h-full"
                    >
                      <Card
                        variant="interactive"
                        tone="dark"
                        className="flex h-full min-h-[230px] flex-col p-7"
                      >
                        <span className="font-mono text-[10px] font-bold tracking-[.12em] text-[var(--fm-lime-bright)]">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <h4 className="mt-7 font-display text-2xl font-bold tracking-[-.035em] text-[var(--fm-card-text)]">
                          {service.name}
                        </h4>
                        <p className="mt-3 text-sm leading-6 text-[var(--fm-card-muted)]">
                          {service.shortDescription}
                        </p>
                        <span className="mt-auto inline-flex items-center gap-2 pt-7 text-sm font-bold text-[var(--fm-lime-bright)]">
                          Explore service{" "}
                          <ArrowRight className="h-4 w-4 transition-transform duration-[var(--fm-motion-micro)] group-hover:translate-x-1" />
                        </span>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--fm-surface)] px-fm-5 py-16 sm:px-fm-8">
        <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <SectionLabel>Keep exploring</SectionLabel>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-[-.04em] text-[var(--fm-text-primary)]">
              Looking for another market?
            </h2>
          </div>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-[var(--fm-radius-pill)] border border-[var(--fm-border)] bg-[var(--fm-surface-raised)] px-5 py-3.5 text-sm font-bold text-[var(--fm-text-primary)] transition-[transform,border-color] duration-[var(--fm-motion-micro)] hover:-translate-y-px hover:border-[var(--fm-border-accent)]"
          >
            Compare markets <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
