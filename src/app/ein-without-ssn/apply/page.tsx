import { notFound } from "next/navigation";
import StartApplicationButton from "@/components/services/StartApplicationButton";
import { Card, SectionLabel } from "@/components/ui/design-system";
import { getServiceBySlug } from "@/lib/services";

export default async function InternationalEINApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ variant?: string }>;
}) {
  const service = getServiceBySlug("ein-without-ssn");
  if (!service) notFound();

  const { variant } = await searchParams;
  const selectedVariant =
    variant === "resident" || variant === "non-resident" ? variant : undefined;
  const pathways = selectedVariant
    ? (service.variants?.filter((item) => item.variantSlug === selectedVariant) ?? [])
    : (service.variants ?? []);

  if (!pathways.length) notFound();

  return (
    <main className="min-h-screen bg-[var(--fm-graphite-deep)] px-6 py-20 text-[var(--fm-text-primary)] md:py-28">
      <div className="mx-auto max-w-4xl">
        <SectionLabel>USA taxation</SectionLabel>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
          International EIN
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--fm-text-secondary)]">
          Provide the responsible-party details and the selected formation document, then review the
          fixed service fee at checkout.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {pathways.map((pathway) => (
            <Card key={pathway.variantSlug} className="flex h-full flex-col p-6 md:p-7">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--fm-text-tertiary)]">
                {pathway.name}
              </p>
              <p className="mt-3 text-4xl font-semibold">${pathway.price}</p>
              <p className="mt-3 text-sm leading-6 text-[var(--fm-text-secondary)]">
                Legal full name of the single member or responsible party with the higher
                shareholding, email, phone, WhatsApp number, and either Articles of Organization or
                SS-4 are collected in the application.
              </p>
              <StartApplicationButton
                serviceSlug="ein-without-ssn"
                variantSlug={pathway.variantSlug}
                size="lg"
                className="mt-7"
              >
                Start {pathway.name} →
              </StartApplicationButton>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
