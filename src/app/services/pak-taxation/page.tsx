import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Card, SectionLabel } from "@/components/ui/design-system";

const actionBase =
  "inline-flex items-center justify-center gap-2 rounded-[var(--fm-radius-pill)] px-5 py-3.5 text-sm font-bold transition-[transform,background-color,border-color,color] duration-[var(--fm-motion-component)] ease-[var(--fm-motion-ease)] hover:-translate-y-1";

const offerings = [
  {
    title: "NTN Registration",
    price: "PKR 500",
    description: "NTN registration support with CNIC and contact verification.",
    href: "/services/pak-ntn-registration",
  },
  {
    title: "Become Filer",
    price: "PKR 2,000",
    description: "Filer registration support with identity and financial details.",
    href: "/services/pak-become-filer",
  },
  {
    title: "Salary Return",
    price: "PKR 1,500",
    description: "Salary tax return support with the required return documents.",
    href: "/services/pak-salary-return",
  },
  {
    title: "Business Return",
    price: "PKR 2,500",
    description: "Business tax return support with the required return documents.",
    href: "/services/pak-business-return",
  },
  {
    title: "DNFBP Certificate",
    price: "PKR 10,000",
    description:
      "DNFBP certificate support with FBR and police character certificate requirements.",
    href: "/services/pak-dnfbp-certificate",
  },
  {
    title: "PSEB Registration",
    price: "PKR 5,000",
    description: "Pakistan Software Export Board registration support.",
    href: "/services/pak-pseb",
  },
  {
    title: "PSW Registration",
    price: "PKR 5,000",
    description: "Pakistan Single Window registration support for filers.",
    href: "/services/pak-psw",
  },
];

export default function PakistanTaxationPage() {
  return (
    <main className="fm-page overflow-hidden">
      <section className="fm-page-hero border-b border-[var(--fm-border)] bg-[var(--fm-graphite-deep)] text-[var(--fm-text-primary)]">
        <div className="fm-page-container px-fm-6 sm:px-fm-10 lg:px-fm-14">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[.08em] text-[var(--fm-lime)] transition-[transform,color] duration-[var(--fm-motion-micro)] ease-[var(--fm-motion-ease)] hover:-translate-x-1 hover:text-[var(--fm-lime-bright)]"
          >
            ← All services
          </Link>
          <div className="mt-12 max-w-3xl">
            <SectionLabel>Pakistan taxation</SectionLabel>
            <h1 className="fm-page-hero-title mt-4">Choose your Pakistan tax service.</h1>
            <p className="fm-page-hero-description mt-6 max-w-2xl">
              Select the service you need. These are contact applications with no checkout or
              payment step.
            </p>
          </div>
          <div className="mt-12 grid gap-fm-5 md:grid-cols-2 xl:grid-cols-3">
            {offerings.map((offering, index) => (
              <Card
                key={offering.title}
                variant="interactive"
                tone="default"
                className="flex min-h-[330px] flex-col p-7 sm:p-8"
              >
                <span className="font-mono text-[10px] font-bold uppercase tracking-[.12em] text-[var(--fm-lime-bright)]">
                  0{index + 1}
                </span>
                <h2 className="mt-7 font-display text-2xl font-bold tracking-[-.035em] text-[var(--fm-card-text)]">
                  {offering.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-[var(--fm-card-muted)]">
                  {offering.description}
                </p>
                <div className="mt-8 text-3xl font-semibold text-[var(--fm-card-text)]">
                  {offering.price}
                </div>
                <Link
                  href={offering.href}
                  className={`${actionBase} mt-auto bg-[var(--fm-lime)] text-[var(--fm-graphite-deep)] hover:bg-[var(--fm-lime-bright)]`}
                >
                  View service <ArrowUpRight className="size-4" />
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="fm-page-section bg-[var(--fm-surface)] text-[var(--fm-text-primary)]">
        <div className="fm-page-container px-fm-6 sm:px-fm-10 lg:px-fm-14">
          <div className="grid gap-8 lg:grid-cols-[1fr_.7fr] lg:items-end">
            <div>
              <SectionLabel>Contact application</SectionLabel>
              <h2 className="fm-page-section-heading mt-4 max-w-2xl">
                Submit your requirements and our team will contact you in 24 hours.
              </h2>
              <p className="mt-5 max-w-2xl text-fm-body text-[var(--fm-text-secondary)]">
                Each service uses the existing contact application flow. Supporting documents are
                uploaded directly to your application where required.
              </p>
            </div>
            <Link
              href="/services"
              className={`${actionBase} border border-[var(--fm-border-accent)] bg-transparent text-[var(--fm-text-primary)] hover:bg-[var(--fm-text-primary)] hover:text-[var(--fm-surface)]`}
            >
              Explore other services <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
