"use client";

import { useState } from "react";
import { ArrowRight, CaretDown, MapPin } from "@phosphor-icons/react/dist/ssr";
import { Card } from "@/components/ui/design-system";
import { getMarketServices, markets } from "@/lib/markets";

export default function PricingSection() {
  const [openMarket, setOpenMarket] = useState<string | null>(null);

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="relative isolate overflow-hidden bg-[var(--fm-graphite-deep)] px-6 py-24 text-[var(--fm-text-primary)] sm:px-8 lg:py-28"
    >
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(55%_45%_at_50%_0%,color-mix(in_srgb,var(--fm-lime)_8%,transparent),transparent_65%)]" />
      <div className="relative z-[1] mx-auto max-w-[1400px]">
        <div className="mb-12 max-w-[760px]">
          <span className="mb-[18px] inline-block font-mono text-fm-label font-bold uppercase tracking-fm-label text-[var(--fm-lime)]">
            Choose a market
          </span>
          <h2
            id="services-heading"
            className="mt-3 font-display text-4xl font-extrabold tracking-[-.055em] text-[var(--fm-text-primary)] sm:text-5xl"
          >
            Explore the services.
          </h2>
          <p className="mt-4 text-fm-body text-[var(--fm-text-secondary)]">
            Explore the services available in each market, then choose the service that fits your
            business.
          </p>
        </div>
        <div className="grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
      </div>
    </section>
  );
}
