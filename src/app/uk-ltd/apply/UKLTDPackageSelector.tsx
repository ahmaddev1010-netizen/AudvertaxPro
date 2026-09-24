"use client";

import { useState } from "react";
import StartApplicationButton from "@/components/services/StartApplicationButton";
import { Card, SectionLabel } from "@/components/ui/design-system";
import type { Service } from "@/lib/services/domain";

const BANK_PROVIDERS = ["Wise", "TIDE", "TAPTAP", "PAYONEER", "SUNRATE", "PAYPAL"] as const;

type UKLTDPackageSelectorProps = {
  service: Service;
  initialPackage?: "standard" | "premium";
};

export default function UKLTDPackageSelector({
  service,
  initialPackage = "standard",
}: UKLTDPackageSelectorProps) {
  const packages = service.packages ?? [];
  const [selectedPackage, setSelectedPackage] = useState(initialPackage);
  const [bankProvider, setBankProvider] = useState("");
  const premiumSelected = selectedPackage === "premium";
  const canStart = !premiumSelected || Boolean(bankProvider);

  return (
    <>
      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        {packages.map((pkg) => {
          const featured = pkg.slug === "premium";
          const selected = selectedPackage === pkg.slug;
          return (
            <button
              key={pkg.slug}
              type="button"
              onClick={() => {
                setSelectedPackage(pkg.slug as "standard" | "premium");
                if (pkg.slug !== "premium") setBankProvider("");
              }}
              className="text-left"
            >
              <Card
                variant={selected ? "elevated" : "feature"}
                className={`${selected ? "border-[var(--fm-border-accent)] bg-[var(--fm-lime-soft)]" : ""} h-full transition-colors`}
              >
                <div className="flex min-h-full flex-col p-7">
                  <div className="flex items-start justify-between gap-4">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--fm-text-tertiary)]">
                      {pkg.name}
                    </p>
                    {featured && (
                      <span className="rounded-[var(--fm-radius-pill)] bg-[var(--fm-lime-soft)] px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--fm-lime)]">
                        Recommended
                      </span>
                    )}
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-5xl font-semibold tracking-[-0.05em]">£{pkg.price}</span>
                    <span className="text-sm text-[var(--fm-text-tertiary)]">GBP</span>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-[var(--fm-text-secondary)]">
                    {pkg.description}
                  </p>
                  <ul className="mt-6 flex-1 space-y-3 border-t border-[var(--fm-border)] pt-5">
                    {pkg.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex gap-3 text-sm text-[var(--fm-text-secondary)]"
                      >
                        <span className="text-[var(--fm-lime)]">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </button>
          );
        })}
      </div>

      {premiumSelected && (
        <Card className="mt-6 p-6 md:p-7">
          <SectionLabel>Premium included benefit</SectionLabel>
          <h2 className="mt-3 text-2xl font-semibold">Choose one virtual bank account provider</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--fm-text-secondary)]">
            Premium includes UK virtual bank account setup. Select the provider you want our team to
            work with.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {BANK_PROVIDERS.map((provider) => {
              const selected = bankProvider === provider;
              return (
                <button
                  key={provider}
                  type="button"
                  onClick={() => setBankProvider(provider)}
                  className={`rounded-[var(--fm-radius-md)] border p-4 text-left transition-colors ${selected ? "border-[var(--fm-border-accent)] bg-[var(--fm-lime-soft)]" : "border-[var(--fm-border)] bg-[var(--fm-surface)] hover:border-[var(--fm-border-accent)]"}`}
                >
                  <span className="font-semibold">{provider}</span>
                  <span className="mt-1 block text-xs text-[var(--fm-text-tertiary)]">
                    {selected ? "Selected" : "Choose provider"}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>
      )}

      <div className="mt-8 flex justify-end">
        <StartApplicationButton
          serviceSlug="uk-ltd"
          packageSlug={selectedPackage}
          initialAnswers={premiumSelected ? { virtual_bank_provider: bankProvider } : undefined}
          disabled={!canStart}
          variant="default"
          size="lg"
          className="w-full sm:w-auto"
        >
          Continue with {premiumSelected ? "Premium" : "Standard"}
        </StartApplicationButton>
      </div>
      {!canStart && (
        <p className="mt-3 text-right text-sm text-[var(--fm-danger)]">
          Choose a virtual bank account provider before continuing.
        </p>
      )}
    </>
  );
}
