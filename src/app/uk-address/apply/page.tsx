import { notFound } from "next/navigation";

import StartApplicationButton from "@/components/services/StartApplicationButton";
import { Card, SectionLabel } from "@/components/ui/design-system";
import { getServiceBySlug } from "@/lib/services";

export default function UKAddressApplyPage() {
  const service = getServiceBySlug("uk-address");
  if (!service) notFound();

  return (
    <main className="fm-page min-h-screen bg-[var(--fm-graphite-deep)] px-fm-6 pb-24 pt-36 sm:px-fm-10 lg:px-fm-14">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="mb-10 max-w-3xl">
          <SectionLabel>UK company matters</SectionLabel>
          <h1 className="mt-4 max-w-[12ch] font-display text-fm-hero font-bold tracking-[-.06em] text-[var(--fm-text-primary)]">
            UK Address
          </h1>
          <p className="mt-6 max-w-2xl text-fm-body text-[var(--fm-text-secondary)]">
            Apply for a UK address service for your LTD company and provide the required identity
            and supporting documents.
          </p>
        </div>

        <Card
          variant="elevated"
          className="mb-8 flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8"
        >
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[.12em] text-[var(--fm-text-tertiary)]">
              Service price · 1 year
            </p>
            <p className="mt-2 text-3xl font-bold tracking-[-.04em] text-[var(--fm-text-primary)]">
              £40 GBP / year
            </p>
          </div>
          <StartApplicationButton serviceSlug="uk-address" size="lg" className="shrink-0">
            Start application →
          </StartApplicationButton>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <Card variant="standard" className="p-6 sm:p-8">
            <SectionLabel>Requirements</SectionLabel>
            <div className="mt-6 divide-y divide-[var(--fm-border)]">
              {[
                "Full legal name",
                "LTD name",
                "Email",
                "Contact number",
                "Residential address",
                "Passport",
                "Bank statement",
              ].map((item, index) => (
                <div key={item} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  <span className="font-mono text-[10px] font-bold text-[var(--fm-lime-bright)]">
                    0{index + 1}
                  </span>
                  <span className="text-sm font-medium text-[var(--fm-text-primary)]">{item}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card variant="standard" className="p-6 sm:p-8">
            <SectionLabel>After your order</SectionLabel>
            <h2 className="mt-4 text-xl font-semibold tracking-[-.02em] text-[var(--fm-text-primary)]">
              What happens next
            </h2>
            <div className="mt-6 space-y-5 text-sm leading-6 text-[var(--fm-text-secondary)]">
              <p>Our team will contact you within 24 hours after your order is placed.</p>
              <p>UK Address processing normally takes 3 to 5 business days.</p>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
