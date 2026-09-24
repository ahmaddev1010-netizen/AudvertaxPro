import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Card, SectionLabel } from "@/components/ui/design-system";

const taxationServices = [
  {
    slug: "pak-ntn-registration",
    name: "NTN Registration",
    price: 500,
    description: "Pakistan NTN registration support.",
  },
  {
    slug: "pak-become-filer",
    name: "Become Filer",
    price: 2000,
    description: "Pakistan filer registration support.",
  },
  {
    slug: "pak-salary-return",
    name: "Salary Return",
    price: 1500,
    description: "Pakistan salary tax return support.",
  },
  {
    slug: "pak-business-return",
    name: "Business Return",
    price: 2500,
    description: "Pakistan business tax return support.",
  },
  {
    slug: "pak-dnfbp-certificate",
    name: "DNFBP Certificate",
    price: 10000,
    description: "Pakistan DNFBP certificate support.",
  },
];

export default function Page() {
  return (
    <main className="fm-page overflow-hidden">
      <section className="relative isolate overflow-hidden border-b border-[var(--fm-border)] bg-[linear-gradient(135deg,var(--fm-graphite-deep)_0%,var(--fm-graphite)_100%)] px-5 text-[var(--fm-text-primary)] sm:px-8">
        <div className="fm-page-hero-grid" />
        <div className="fm-page-container relative z-[1]">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[.08em] text-[var(--fm-lime)] hover:text-[var(--fm-lime-bright)]"
          >
            ← All services
          </Link>
          <div className="fm-page-hero-copy mt-14">
            <SectionLabel>Pakistan / Taxation</SectionLabel>
            <h1 className="fm-page-hero-title max-w-[11ch]">Pakistan taxation services.</h1>
            <p className="fm-page-hero-description max-w-[680px]">
              Choose the Pakistan tax service that matches your filing, registration, or compliance
              requirement.
            </p>
          </div>
        </div>
      </section>

      <section className="fm-page-section bg-[var(--fm-graphite-deep)] px-5 text-[var(--fm-text-primary)] sm:px-8">
        <div className="fm-page-container">
          <div className="mb-10">
            <SectionLabel>Tax / Compliance</SectionLabel>
            <h2 className="fm-page-section-heading mt-4 max-w-[760px]">
              Choose a taxation service.
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {taxationServices.map((item, index) => (
              <Link key={item.slug} href={`/${item.slug}/application`} className="group block">
                <Card
                  variant="interactive"
                  tone="dark"
                  className="flex h-full min-h-[330px] flex-col items-start p-7 sm:p-8"
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="font-mono text-[10px] font-bold tracking-[.16em] text-[var(--fm-lime-bright)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <ArrowUpRight className="size-4 text-[var(--fm-text-tertiary)] transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[var(--fm-lime-bright)]" />
                  </div>
                  <h3 className="mt-8 font-display text-2xl font-bold tracking-[-.04em] text-[var(--fm-card-text)] sm:text-3xl">
                    {item.name}
                  </h3>
                  <p className="mt-4 text-[15px] leading-7 text-[var(--fm-card-muted)]">
                    {item.description}
                  </p>
                  <div className="mt-7 font-display text-4xl font-extrabold tracking-[-.04em] text-[var(--fm-card-text)]">
                    PKR {item.price.toLocaleString()}
                  </div>
                  <span className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-bold text-[var(--fm-lime-bright)]">
                    View service{" "}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
