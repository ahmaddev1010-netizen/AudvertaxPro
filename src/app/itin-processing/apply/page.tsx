import { notFound } from "next/navigation";
import StartApplicationButton from "@/components/services/StartApplicationButton";
import { Card, SectionLabel } from "@/components/ui/design-system";
import { getServiceBySlug } from "@/lib/services";

export default function ITINApplyPage() {
  const service = getServiceBySlug("itin-processing");
  if (!service) notFound();
  return (
    <main className="min-h-screen bg-[var(--fm-graphite-deep)] px-6 py-20 text-[var(--fm-text-primary)] md:py-28">
      <div className="mx-auto max-w-4xl">
        <SectionLabel>USA taxation</SectionLabel>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
          Apply for ITIN processing.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--fm-text-secondary)]">
          Provide your legal details and supporting documents, then review the fixed $150 service
          fee at checkout.
        </p>
        <Card variant="elevated" className="mt-10 p-6 md:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--fm-text-tertiary)]">
                Service fee
              </p>
              <p className="mt-2 text-4xl font-semibold">$150</p>
              <p className="mt-2 text-sm text-[var(--fm-text-secondary)]">
                Document and eligibility requirements are collected during the application.
              </p>
            </div>
            <StartApplicationButton serviceSlug="itin-processing" variantSlug="itin" size="lg">
              Start ITIN application →
            </StartApplicationButton>
          </div>
        </Card>
      </div>
    </main>
  );
}
