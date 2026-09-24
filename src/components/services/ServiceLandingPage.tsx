import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { getServiceBySlug, serviceCatalog } from "@/lib/services";
import {
  getServiceNavigationGroupBySlug,
  getServiceNavigationLeafSlugs,
} from "@/lib/service-navigation";
import StartApplicationButton from "@/components/services/StartApplicationButton";
import { Card, IconContainer, SectionLabel } from "@/components/ui/design-system";

export function generateStaticParams() {
  const serviceSlugs = serviceCatalog.map((service) => service.slug);
  const navigationCategorySlugs = getServiceNavigationLeafSlugs().filter(
    (slug) => !serviceSlugs.includes(slug),
  );
  return [...serviceSlugs, ...navigationCategorySlugs].map((slug) => ({ slug }));
}

const actionBase =
  "inline-flex items-center justify-center gap-2 rounded-[var(--fm-radius-pill)] px-5 py-3.5 text-sm font-bold transition-[transform,background-color,border-color,color] duration-[var(--fm-motion-component)] ease-[var(--fm-motion-ease)] hover:-translate-y-1";

const pakistanTaxationRequirements: Record<
  string,
  { intro: string; requirements: string[]; note?: string }
> = {
  "pak-ntn-registration": {
    intro:
      "A contact application for NTN Registration. Submit the required identity and contact information and our team will follow up.",
    requirements: [
      "CNIC picture — front",
      "CNIC picture — back",
      "Email address",
      "Contact number registered on CNIC",
    ],
  },
  "pak-become-filer": {
    intro:
      "A contact application for becoming a filer. We collect the identity and financial information needed to prepare your filing process.",
    requirements: [
      "CNIC picture — front and back",
      "Contact number registered on CNIC",
      "Email address",
      "Assets detail",
      "Bank statement ended 30 June",
      "Salary income or business detail",
    ],
  },
  "pak-salary-return": {
    intro:
      "A contact application for your salary tax return. Provide your return information and supporting documents for team follow-up.",
    requirements: [
      "Login detail",
      "New assets detail",
      "Bank statement to 30 June",
      "Salary slip",
      "Investment details",
      "Contact number",
    ],
  },
  "pak-business-return": {
    intro:
      "A contact application for your business tax return. Provide your return information and supporting documents for team follow-up.",
    requirements: [
      "Login detail",
      "New assets detail",
      "Bank statement to 30 June",
      "Investment details",
      "Contact number",
    ],
  },
  "pak-dnfbp-certificate": {
    intro:
      "A contact application for a DNFBP Certificate. Submit your FBR and business information together with the required police character certificate.",
    requirements: [
      "FBR login details",
      "Police character certificate with QR code",
      "Business nature",
      "Contact number",
    ],
  },
  "pak-pseb": {
    intro:
      "A contact application for Pakistan Software Export Board registration. Submit your identity, banking and online business information for review.",
    requirements: [
      "CNIC — front and back",
      "Contact number registered on CNIC",
      "Email address",
      "Bank name",
      "Bank maintenance certificate",
      "Social media page link",
    ],
  },
  "pak-psw": {
    intro:
      "A contact application for Pakistan Single Window registration. PSW completion requires filer status to be confirmed first.",
    requirements: [
      "Filer status confirmation",
      "Business registration",
      "Email address",
      "Phone number",
      "CNIC — front and back",
    ],
    note: "If you are not a filer, the application will redirect you to Become Filer before you can continue with PSW.",
  },
};

function ServiceCategoryPage({
  slug,
  country,
  category,
}: {
  slug: string;
  country: string;
  category: NonNullable<ReturnType<typeof getServiceNavigationGroupBySlug>>["item"];
}) {
  const childServices = (category.children ?? [])
    .map((child) => getServiceBySlug(child.slug))
    .filter((service): service is NonNullable<ReturnType<typeof getServiceBySlug>> =>
      Boolean(service),
    );

  return (
    <main className="fm-page overflow-hidden">
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
              <SectionLabel>{country} / Service category</SectionLabel>
              <h1 className="fm-page-hero-title max-w-[10ch]">{category.title}</h1>
              <p className="fm-page-hero-description max-w-[650px]">
                Explore the services available under {category.title} for {country}.
              </p>
            </div>
            <Card variant="elevated" tone="lime" className="fm-page-hero-feature">
              <div className="fm-page-feature-orbit fm-page-feature-orbit--medium" />
              <span className="fm-page-hero-feature-label">Audvertax / service desk</span>
              <strong className="fm-page-hero-feature-title">Choose what you need next.</strong>
              <p className="fm-page-hero-feature-description">
                Each service below opens its own guided workflow and application path.
              </p>
              <div className="fm-page-hero-feature-divider" />
              <span className="fm-page-hero-feature-meta">
                {childServices.length} services available
              </span>
            </Card>
          </div>
        </div>
      </section>

      <section className="fm-page-section bg-[var(--fm-graphite-deep)] px-5 text-[var(--fm-text-primary)] sm:px-8">
        <div className="fm-page-container">
          <div className="mb-10">
            <SectionLabel>
              {country} / {category.title}
            </SectionLabel>
            <h2 className="fm-page-section-heading mt-4 max-w-[700px]">Choose a service.</h2>
          </div>
          <div className="grid grid-cols-1 gap-fm-4 md:grid-cols-2">
            {childServices.map((service, index) => (
              <Link key={service.slug} href={`/${service.slug}`} className="group block">
                <Card
                  variant="interactive"
                  tone="dark"
                  className="fm-page-service-card flex flex-col items-start p-7 sm:p-9"
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="font-mono text-[10px] font-bold tracking-[.16em] text-[var(--fm-lime-bright)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <ArrowUpRight className="size-4 text-[var(--fm-text-tertiary)] transition-transform duration-[var(--fm-motion-micro)] ease-[var(--fm-motion-ease)] group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[var(--fm-lime-bright)]" />
                  </div>
                  <h3 className="mt-8 max-w-[520px] font-display text-3xl font-bold tracking-[-.045em] text-[var(--fm-card-text)] sm:text-4xl">
                    {service.name}
                  </h3>
                  <p className="mt-4 max-w-[520px] text-[15px] leading-7 text-[var(--fm-card-muted)]">
                    {service.shortDescription}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-9 text-sm font-bold text-[var(--fm-lime-bright)]">
                    Explore service{" "}
                    <ArrowRight className="size-4 transition-transform duration-[var(--fm-motion-micro)] ease-[var(--fm-motion-ease)] group-hover:translate-x-1" />
                  </span>
                </Card>
              </Link>
            ))}
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

export async function ServiceLandingPage({ slug }: { slug: string }) {
  const navigationEntry = getServiceNavigationGroupBySlug(slug);

  if (navigationEntry?.item.children?.length) {
    return (
      <ServiceCategoryPage
        slug={slug}
        country={navigationEntry.country}
        category={navigationEntry.item}
      />
    );
  }

  const service = getServiceBySlug(slug);
  if (!service) return notFound();
  const serviceIndex = serviceCatalog.findIndex((item) => item.slug === slug);
  const relatedServices = serviceCatalog
    .filter((item) => item.slug !== slug)
    .slice(Math.max(0, serviceIndex), Math.max(0, serviceIndex) + 3);
  const pakistanTaxation = pakistanTaxationRequirements[slug];

  return (
    <main className="fm-page overflow-hidden">
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
              <SectionLabel>Service {String(serviceIndex + 1).padStart(2, "0")}</SectionLabel>
              <h1 className="fm-page-hero-title max-w-[10ch]">{service.name}</h1>
              <p className="fm-page-hero-description max-w-[650px]">{service.description}</p>
              <div className="mt-8 flex flex-wrap gap-fm-3">
                <StartApplicationButton
                  serviceSlug={service.slug}
                  className={`${actionBase} bg-[var(--fm-lime)] text-[var(--fm-graphite-deep)] hover:bg-[var(--fm-lime-bright)]`}
                >
                  Start application <ArrowUpRight className="size-4" />
                </StartApplicationButton>
                <Link href="/pricing" className="fm-page-action fm-page-action--secondary">
                  See pricing
                </Link>
              </div>
            </div>
            <Card variant="elevated" tone="lime" className="fm-page-hero-feature">
              <div className="fm-page-feature-orbit fm-page-feature-orbit--medium" />
              <span className="fm-page-hero-feature-label">Audvertax / service desk</span>
              <strong className="fm-page-hero-feature-title">Built for the next move.</strong>
              <p className="fm-page-hero-feature-description">
                One guided workflow from your first question to a ready-to-operate business.
              </p>
              <div className="fm-page-hero-feature-divider" />
              <span className="fm-page-hero-feature-meta">Remote-first support</span>
            </Card>
          </div>
        </div>
      </section>

      <section className="fm-page-section bg-[var(--fm-graphite-deep)] px-5 text-[var(--fm-text-primary)] sm:px-8">
        <div className="fm-page-container">
          {pakistanTaxation ? (
            <>
              <div className="mb-12 flex flex-col justify-between gap-fm-8 lg:flex-row lg:items-end">
                <div>
                  <SectionLabel>Service requirements</SectionLabel>
                  <h2 className="fm-page-section-heading max-w-[620px]">
                    What you need to get started.
                  </h2>
                </div>
                <p className="fm-page-hero-description mt-0 max-w-[430px]">
                  {pakistanTaxation.intro}
                </p>
              </div>
              <div className="grid gap-fm-12 lg:grid-cols-[1.2fr_.8fr]">
                <div className="border-t border-[var(--fm-border)]">
                  {pakistanTaxation.requirements.map((requirement, index) => (
                    <div
                      key={requirement}
                      className="grid grid-cols-[48px_1fr] gap-x-fm-4 border-b border-[var(--fm-border)] py-6"
                    >
                      <span className="font-mono text-[11px] font-bold text-[var(--fm-lime-bright)]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <strong className="text-lg text-[var(--fm-text-primary)]">
                        {requirement}
                      </strong>
                    </div>
                  ))}
                </div>
                <Card variant="standard" tone="default" className="p-7 sm:p-8">
                  <IconContainer className="mb-8 bg-[var(--fm-lime)] text-[var(--fm-graphite-deep)]">
                    PK
                  </IconContainer>
                  <p className="max-w-[360px] text-lg leading-[1.45] text-[var(--fm-text-primary)]">
                    This is a contact application — there is no checkout or payment step.
                  </p>
                  {pakistanTaxation.note && (
                    <div className="mt-6 border-l-2 border-[var(--fm-lime)] pl-3.5 text-sm leading-6 text-[var(--fm-text-secondary)]">
                      {pakistanTaxation.note}
                    </div>
                  )}
                  <p className="mt-6 text-sm leading-6 text-[var(--fm-text-secondary)]">
                    After submission, our team will contact you in 24 hours regarding your{" "}
                    {service.name} application.
                  </p>
                  <StartApplicationButton
                    serviceSlug={service.slug}
                    className={`${actionBase} mt-7 bg-[var(--fm-lime)] text-[var(--fm-graphite-deep)] hover:bg-[var(--fm-lime-bright)]`}
                  >
                    Start application <ArrowUpRight className="size-4" />
                  </StartApplicationButton>
                </Card>
              </div>
            </>
          ) : (
            <>
              <div className="mb-12 flex flex-col justify-between gap-fm-8 lg:flex-row lg:items-end">
                <div>
                  <SectionLabel>What this includes</SectionLabel>
                  <h2 className="fm-page-section-heading max-w-[560px]">
                    A guided, documented workflow.
                  </h2>
                </div>
                <p className="fm-page-hero-description mt-0 max-w-[330px]">
                  {service.shortDescription}
                </p>
              </div>
              <div className="grid gap-fm-12 lg:grid-cols-[1.2fr_.8fr]">
                <div className="border-t border-[var(--fm-border)]">
                  {[
                    [
                      "01",
                      "Review your requirements",
                      "We start with your business, location, and intended use case.",
                    ],
                    [
                      "02",
                      "Prepare the application",
                      "Your information is organized into a clear submission workflow.",
                    ],
                    [
                      "03",
                      "Track the next step",
                      "Stay informed as the service moves through review and completion.",
                    ],
                  ].map(([number, title, description]) => (
                    <div
                      key={number}
                      className="grid grid-cols-[48px_1fr] gap-x-fm-4 border-b border-[var(--fm-border)] py-6"
                    >
                      <span className="font-mono text-[11px] font-bold text-[var(--fm-lime-bright)]">
                        {number}
                      </span>
                      <strong className="text-lg text-[var(--fm-text-primary)]">{title}</strong>
                      <p className="col-start-2 mt-2 text-sm leading-6 text-[var(--fm-text-secondary)]">
                        {description}
                      </p>
                    </div>
                  ))}
                </div>
                <Card variant="standard" tone="default" className="p-7 sm:p-8">
                  <IconContainer className="mb-8 bg-[var(--fm-lime)] text-[var(--fm-graphite-deep)]">
                    FM
                  </IconContainer>
                  <p className="max-w-[330px] text-lg leading-[1.45] text-[var(--fm-text-primary)]">
                    Eligibility, documents, provider requirements and timing can vary by service.
                  </p>
                  <div className="mt-6 border-l-2 border-[var(--fm-lime)] pl-3.5 text-sm leading-6 text-[var(--fm-text-secondary)]">
                    Start an application and provide the information required for this service.
                  </div>
                  <StartApplicationButton
                    serviceSlug={service.slug}
                    className={`${actionBase} mt-7 bg-[var(--fm-lime)] text-[var(--fm-graphite-deep)] hover:bg-[var(--fm-lime-bright)]`}
                  >
                    Start application <ArrowUpRight className="size-4" />
                  </StartApplicationButton>
                </Card>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="fm-page-section bg-[var(--fm-surface)] px-5 text-[var(--fm-text-primary)] sm:px-8">
        <div className="fm-page-container">
          <div className="mb-10 flex flex-col justify-between gap-fm-8 lg:flex-row lg:items-end">
            <div>
              <SectionLabel>Complete your setup</SectionLabel>
              <h2 className="fm-page-section-heading max-w-[560px]">You may also need.</h2>
            </div>
            <Link href="/services" className="fm-page-action fm-page-action--secondary">
              Browse all services <ArrowUpRight className="size-4" />
            </Link>
          </div>
          <div className="grid gap-fm-4 md:grid-cols-3">
            {relatedServices.map((relatedService, index) => (
              <Link
                key={relatedService.slug}
                href={`/${relatedService.slug}`}
                className="group block"
              >
                <Card
                  variant="interactive"
                  tone="default"
                  className="fm-page-service-card flex flex-col items-start p-7"
                >
                  <span className="font-mono text-[10px] font-bold tracking-[.12em] text-[var(--fm-lime-bright)]">
                    0{index + 1}
                  </span>
                  <h3 className="mt-7 max-w-[260px] font-display text-2xl font-bold tracking-[-.035em] text-[var(--fm-card-text)]">
                    {relatedService.name}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--fm-card-muted)]">
                    {relatedService.shortDescription}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-bold text-[var(--fm-lime-bright)]">
                    View service{" "}
                    <ArrowRight className="size-4 transition-transform duration-[var(--fm-motion-micro)] ease-[var(--fm-motion-ease)] group-hover:translate-x-1" />
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="fm-page-cta">
        <div className="fm-page-container fm-page-cta-inner px-5 sm:px-8">
          <div>
            <SectionLabel className="text-[var(--fm-graphite-deep)]">Keep exploring</SectionLabel>
            <h2 className="fm-page-section-heading">Build the full stack.</h2>
            <p className="fm-page-cta-description">
              Pair this service with the other essentials for your business.
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
