"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Buildings,
  CaretDown,
  Check,
  FileText,
  MapPin,
  Sparkle,
} from "@phosphor-icons/react/dist/ssr";
import { Card, SectionLabel } from "@/components/ui/design-system";
import { getMarketServices, markets } from "@/lib/markets";
import { getServiceBySlug, getServiceHref } from "@/lib/services";
import type { Service } from "@/lib/services";

type PricingNode = { title: string; serviceSlug?: string; children?: PricingNode[] };

function formatPrice(price: number, currency: string) {
  if (price === 0) return "Custom";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

function NodeList({
  nodes,
  depth = 0,
  selectedSlug,
  onSelect,
}: {
  nodes: PricingNode[];
  depth?: number;
  selectedSlug: string | null;
  onSelect: (slug: string) => void;
}) {
  return (
    <div
      className={depth > 0 ? "mt-2 space-y-2 border-l border-[var(--fm-border)] pl-3" : "space-y-2"}
    >
      {nodes.map((node) => {
        const hasChildren = Boolean(node.children?.length);
        const selected = node.serviceSlug === selectedSlug;
        return (
          <div key={node.title}>
            {node.serviceSlug ? (
              <button
                type="button"
                onClick={() => onSelect(node.serviceSlug!)}
                className={[
                  "group flex w-full items-center justify-between gap-3 rounded-[var(--fm-radius-md)] border px-4 py-3 text-left transition-[background-color,border-color,transform] duration-[var(--fm-motion-micro)] ease-[var(--fm-motion-ease)]",
                  selected
                    ? "border-[var(--fm-lime)]/45 bg-[var(--fm-lime)]/[.10]"
                    : "border-[var(--fm-border)] bg-[var(--fm-surface)] hover:-translate-y-px hover:border-[var(--fm-border-accent)] hover:bg-[var(--fm-surface-raised)]",
                ].join(" ")}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[var(--fm-border)] bg-[var(--fm-graphite-deep)] text-[var(--fm-lime-bright)]">
                    <FileText className="h-4 w-4" />
                  </span>
                  <span className="truncate text-sm font-semibold text-[var(--fm-text-primary)]">
                    {node.title}
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-[var(--fm-text-tertiary)] transition-transform group-hover:translate-x-0.5" />
              </button>
            ) : (
              <div className="flex items-center gap-3 rounded-[var(--fm-radius-md)] border border-[var(--fm-border)] bg-[var(--fm-surface-raised)] px-4 py-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--fm-graphite-deep)] text-[var(--fm-lime-bright)]">
                  {hasChildren && <CaretDown className="h-4 w-4" weight="bold" />}
                </span>
                <span className="text-sm font-bold text-[var(--fm-text-primary)]">
                  {node.title}
                </span>
              </div>
            )}
            {hasChildren && (
              <NodeList
                nodes={node.children!}
                depth={depth + 1}
                selectedSlug={selectedSlug}
                onSelect={onSelect}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function PricingDetail({ service }: { service: Service }) {
  const packages = service.packages ?? [];
  return (
    <Card variant="elevated" className="h-fit overflow-hidden">
      <div className="border-b border-[var(--fm-card-divider)] p-6 sm:p-8">
        <SectionLabel>Selected service</SectionLabel>
        <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-.045em] text-[var(--fm-card-text)]">
          {service.name}
        </h2>
        <p className="mt-3 text-sm leading-6 text-[var(--fm-card-muted)]">
          {service.shortDescription}
        </p>
      </div>
      {packages.length > 0 ? (
        <div className="divide-y divide-[var(--fm-card-divider)]">
          {packages.map((item, index) => (
            <div key={item.slug} className="p-6 sm:p-8">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-xl font-extrabold tracking-[-.03em] text-[var(--fm-card-text)]">
                      {item.name}
                    </h3>
                    {index === 0 && packages.length > 1 && (
                      <span className="inline-flex items-center gap-1 rounded-[var(--fm-radius-pill)] bg-[var(--fm-lime)]/10 px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-[.1em] text-[var(--fm-lime)]">
                        <Sparkle weight="fill" className="h-3 w-3" /> Starting option
                      </span>
                    )}
                  </div>
                  <p className="mt-2 max-w-[470px] text-sm leading-6 text-[var(--fm-card-muted)]">
                    {item.description}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <div className="font-display text-2xl font-extrabold tracking-[-.04em] text-[var(--fm-card-text)]">
                    {formatPrice(item.price, item.currency)}
                  </div>
                  {item.price > 0 && (
                    <div className="mt-1 font-mono text-[9px] uppercase tracking-[.12em] text-[var(--fm-card-muted)]">
                      One-time
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {item.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-start gap-2 text-xs leading-5 text-[var(--fm-card-muted)]"
                  >
                    <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[var(--fm-card-action-bg)]/15 text-[var(--fm-card-action-bg)]">
                      <Check weight="bold" className="h-2.5 w-2.5" />
                    </span>
                    {feature}
                  </div>
                ))}
              </div>
              <Link
                href={getServiceHref(service.slug)}
                className="mt-6 inline-flex items-center gap-2 rounded-[var(--fm-radius-pill)] bg-[var(--fm-lime)] px-5 py-3 text-sm font-bold text-[var(--fm-graphite-deep)] transition-transform duration-[var(--fm-motion-micro)] hover:-translate-y-px hover:bg-[var(--fm-lime-bright)]"
              >
                Continue with {service.name} <ArrowRight weight="bold" className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 sm:p-8">
          <div className="rounded-[var(--fm-radius-lg)] border border-dashed border-[var(--fm-border-accent)] bg-[var(--fm-lime)]/[.05] p-5">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[.14em] text-[var(--fm-lime)]">
              Pricing status
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--fm-card-muted)]">
              This service is in the catalog, but a public package price has not been configured
              yet. No price has been invented here.
            </p>
          </div>
          <Link
            href={getServiceHref(service.slug)}
            className="mt-6 inline-flex items-center gap-2 rounded-[var(--fm-radius-pill)] border border-[var(--fm-border)] bg-[var(--fm-surface)] px-5 py-3 text-sm font-bold text-[var(--fm-text-primary)] hover:border-[var(--fm-border-accent)] hover:bg-[var(--fm-surface-raised)]"
          >
            View service <ArrowRight weight="bold" className="h-4 w-4" />
          </Link>
        </div>
      )}
    </Card>
  );
}

export default function CountryPricingExplorer() {
  const [selectedCountryKey, setSelectedCountryKey] = useState<string | null>(null);
  const [selectedServiceSlug, setSelectedServiceSlug] = useState<string | null>(null);
  const selectedCountry = markets.find((market) => market.slug === selectedCountryKey) ?? null;
  const selectedMarketServices = selectedCountry ? getMarketServices(selectedCountry) : [];
  const selectedService = selectedServiceSlug ? getServiceBySlug(selectedServiceSlug) : undefined;
  const [openMarket, setOpenMarket] = useState<string | null>(null);
  function selectCountry(key: string) {
    setSelectedCountryKey(key);
    setSelectedServiceSlug(null);
    window.history.replaceState(null, "", `/pricing?country=${key}`);
  }
  function resetCountry() {
    setSelectedCountryKey(null);
    setSelectedServiceSlug(null);
    window.history.replaceState(null, "", "/pricing");
  }

  return (
    <main className="fm-page overflow-hidden">
      <section className="fm-page-hero relative isolate border-b border-[var(--fm-border)] bg-[var(--fm-graphite-deep)] text-[var(--fm-text-primary)] px-5 sm:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,var(--fm-hero-glow),transparent_28%),linear-gradient(135deg,var(--fm-graphite-deep)_0%,var(--fm-graphite)_100%)]" />
        <div className="fm-page-hero-grid" />
        <div className="fm-page-container relative">
          <SectionLabel>Pricing</SectionLabel>
          <h1 className="fm-page-hero-title max-w-[980px]">
            Choose your country.
            <br /> <span className="text-[var(--fm-lime)]">See price.</span>
          </h1>
          <p className="fm-page-hero-description max-w-[720px]">
            Pricing follows the same service hierarchy used across Audvertax, so you can move from a
            country to a main service, then into its sub-services and final service pricing.
          </p>
        </div>
      </section>
      <section className="fm-page-section px-5 sm:px-8">
        <div className="fm-page-container">
          {!selectedCountry ? (
            <>
              <div className="mb-12 max-w-[760px]">
                <SectionLabel>Choose a market</SectionLabel>
                <h2 className="fm-page-section-heading text-[var(--fm-text-primary)]">
                  Pricing is organized by where your business is being built.
                </h2>
                <p className="mt-4 text-fm-body text-[var(--fm-text-secondary)]">
                  Select Explore to open this same pricing page for the country you want to review.
                </p>
              </div>
              <div className="grid gap-fm-5 sm:grid-cols-2 lg:grid-cols-4">
                {markets.map((market, index) => {
                  const isOpen = openMarket === market.slug;
                  const marketServices = getMarketServices(market);

                  return (
                    <Card
                      key={market.slug}
                      variant="interactive"
                      tone="dark"
                      className="group flex min-h-[320px] flex-col justify-between p-7"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="grid h-11 w-11 place-items-center rounded-full border border-[var(--fm-lime)]/25 bg-[var(--fm-lime)]/10 text-[var(--fm-lime)]">
                            <MapPin className="h-5 w-5" />
                          </span>
                          <span className="font-mono text-[10px] font-bold tracking-[.14em] text-[var(--fm-text-tertiary)]">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <h3 className="mt-8 font-display text-3xl font-extrabold tracking-[-.045em] text-[var(--fm-card-text)]">
                          {market.name}
                        </h3>
                        <p className="mt-3 text-sm leading-6 text-[var(--fm-card-muted)]">
                          {market.description}
                        </p>
                      </div>

                      <div className="mt-8">
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          aria-controls={`market-services-${market.slug}`}
                          onClick={() => setOpenMarket(isOpen ? null : market.slug)}
                          className="inline-flex w-full items-center justify-between rounded-[var(--fm-radius-pill)] bg-[var(--fm-lime)] px-5 py-3.5 text-sm font-bold text-[var(--fm-graphite-deep)] transition-transform duration-[var(--fm-motion-component)] hover:-translate-y-px hover:bg-[var(--fm-lime-bright)]"
                        >
                          Explore
                          <CaretDown
                            weight="bold"
                            className={`h-4 w-4 transition-transform duration-[var(--fm-motion-component)] ${isOpen ? "rotate-180" : ""}`}
                          />
                        </button>

                        <div
                          id={`market-services-${market.slug}`}
                          className={`grid transition-[grid-template-rows,opacity,margin] duration-[var(--fm-motion-component)] ease-[var(--fm-motion-ease)] ${isOpen ? "mt-4 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0"}`}
                        >
                          <div className="min-h-0 overflow-hidden">
                            <div className="space-y-2 border-t border-[var(--fm-card-divider)] pt-4">
                              {marketServices.map(({ group, services }) => (
                                <div key={group.title}>
                                  <p className="mb-2 font-mono text-[9px] font-bold uppercase tracking-[.14em] text-[var(--fm-card-muted)]">
                                    {group.title}
                                  </p>
                                  <div className="space-y-1">
                                    {services.map((service) => (
                                      <a
                                        key={service.slug}
                                        href={`/${service.slug}`}
                                        className="flex items-center justify-between rounded-lg px-2.5 py-2 text-sm font-medium text-[var(--fm-card-text)] transition-colors hover:bg-[var(--fm-lime)]/10 hover:text-[var(--fm-lime)]"
                                      >
                                        <span>{service.name}</span>
                                        <ArrowRight weight="bold" className="h-3.5 w-3.5 shrink-0" />
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </>
          ) : (
            <div>
              <button
                type="button"
                onClick={resetCountry}
                className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-[var(--fm-text-secondary)] transition-colors hover:text-[var(--fm-text-primary)]"
              >
                <ArrowLeft className="h-4 w-4" /> All countries
              </button>
              <div className="grid gap-8 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] lg:items-start">
                <Card variant="elevated" className="p-6 sm:p-8">
                  <SectionLabel>{selectedCountry.code} market</SectionLabel>
                  <h2 className="mt-3 font-display text-4xl font-extrabold tracking-[-.055em] text-[var(--fm-card-text)]">
                    {selectedCountry.name}
                  </h2>
                  <p className="mt-4 text-sm leading-6 text-[var(--fm-card-muted)]">
                    {selectedCountry.description}
                  </p>
                  <div className="mt-8 flex items-center gap-3 text-sm text-[var(--fm-card-muted)]">
                    <Buildings className="h-5 w-5 text-[var(--fm-card-action-bg)]" />{" "}
                    {selectedMarketServices.length} primary service areas
                  </div>
                </Card>
                <div>
                  <SectionLabel>Services</SectionLabel>
                  <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-.045em] text-[var(--fm-text-primary)]">
                    Explore {selectedCountry.name} services
                  </h2>
                  <div className="mt-6">
                    <NodeList
                      nodes={selectedMarketServices.map(({ group, services }) => ({
                        title: group.title,
                        children: services.map((service) => ({
                          title: service.name,
                          serviceSlug: service.slug,
                        })),
                      }))}
                      selectedSlug={selectedServiceSlug}
                      onSelect={setSelectedServiceSlug}
                    />
                  </div>
                </div>
              </div>
              {selectedService && (
                <div className="mt-10">
                  <PricingDetail service={selectedService} />
                </div>
              )}
            </div>
          )}
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
            <ArrowRight className="h-5 w-5 transition-transform duration-[var(--fm-motion-micro)] ease-[var(--fm-motion-ease)] group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>
      </section>
    </main>
  );
}