import { notFound } from "next/navigation";

import { Card, SectionLabel } from "@/components/ui/design-system";
import { getServiceBySlug } from "@/lib/services";
import UKLTDPackageSelector from "./UKLTDPackageSelector";

export const metadata = {
  title: "Apply for a UK LTD | Audvertax",
  description: "Choose your UK LTD formation package before starting your application.",
};

type UKLTDApplyPageProps = {
  searchParams: Promise<{ package?: string }>;
};

export default async function UKLTDApplyPage({ searchParams }: UKLTDApplyPageProps) {
  const service = getServiceBySlug("uk-ltd");
  if (!service) notFound();

  const params = await searchParams;
  const initialPackage =
    params.package === "premium" || params.package === "standard" ? params.package : "standard";

  return (
    <main className="min-h-screen bg-[var(--fm-graphite-deep)] px-6 py-16 text-[var(--fm-text-primary)] md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <SectionLabel>UK LTD formation</SectionLabel>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
            Choose your formation package.
          </h1>
          <p className="mt-5 text-base leading-7 text-[var(--fm-text-secondary)]">
            Select the level of support you want before starting your application. Your package
            selection will stay attached to the application as you continue.
          </p>
        </div>
        <UKLTDPackageSelector service={service} initialPackage={initialPackage} />
      </div>
    </main>
  );
}
