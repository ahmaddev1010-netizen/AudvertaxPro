import { getServiceBySlug } from "@/lib/services";
import { getFormationState } from "@/lib/services/states";
import type { Currency } from "@/lib/services/domain";

export type PricingLineItem = {
  key: string;
  label: string;
  quantity: number;
  unitAmount: number;
  total: number;
  currency: Currency;
};
export type ApplicationPricingInput = {
  serviceSlug: string;
  packageSlug?: string;
  formationState?: string;
  addOnSlugs?: string[];
  variantSlug?: string;
};
export type ApplicationPricing = {
  currency: Currency;
  lineItems: PricingLineItem[];
  subtotal: number;
  total: number;
};

export function calculateApplicationPricing({
  serviceSlug,
  packageSlug,
  formationState,
  addOnSlugs = [],
  variantSlug,
}: ApplicationPricingInput): ApplicationPricing {
  const service = getServiceBySlug(serviceSlug);
  if (!service) return { currency: "USD", lineItems: [], subtotal: 0, total: 0 };

  if (service.capabilities.hasVariants) {
    const variant = service.variants?.find(
      (item) =>
        item.variantSlug ===
        (variantSlug ?? (serviceSlug === "ein-without-ssn" ? "non-resident" : undefined)),
    );
    if (!variant) return { currency: "USD", lineItems: [], subtotal: 0, total: 0 };
    const lineItem: PricingLineItem = {
      key: `service:${service.slug}:${variant.variantSlug}`,
      label: variant.name,
      quantity: 1,
      unitAmount: variant.price,
      total: variant.price,
      currency: variant.currency,
    };
    return {
      currency: variant.currency,
      lineItems: [lineItem],
      subtotal: variant.price,
      total: variant.price,
    };
  }

  if (service.slug === "usa-llc") {
    const selectedPackage = service.packages?.find((item) => item.slug === packageSlug);
    if (!selectedPackage) return { currency: "USD", lineItems: [], subtotal: 0, total: 0 };
    const lineItems: PricingLineItem[] = [
      {
        key: `package:${selectedPackage.slug}`,
        label: selectedPackage.name,
        quantity: 1,
        unitAmount: selectedPackage.price,
        total: selectedPackage.price,
        currency: selectedPackage.currency,
      },
    ];
    const state = formationState ? getFormationState(formationState) : undefined;
    if (formationState && !state) return { currency: "USD", lineItems: [], subtotal: 0, total: 0 };
    if (state)
      lineItems.push({
        key: `state-filing:${state.slug}`,
        label: `${state.name} filing fee`,
        quantity: 1,
        unitAmount: state.filingFee,
        total: state.filingFee,
        currency: "USD",
      });
    for (const slug of new Set(addOnSlugs)) {
      const addOn = service.addOns?.find((item) => item.slug === slug);
      if (addOn && addOn.available !== false)
        lineItems.push({
          key: `add-on:${addOn.slug}`,
          label: addOn.name,
          quantity: 1,
          unitAmount: addOn.price,
          total: addOn.price,
          currency: addOn.currency,
        });
    }
    const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
    return { currency: selectedPackage.currency, lineItems, subtotal, total: subtotal };
  }

  if (
    service.capabilities.pricingModel === "fixed" &&
    typeof service.price === "number" &&
    service.currency
  ) {
    const lineItem: PricingLineItem = {
      key: `service:${service.slug}`,
      label: service.name,
      quantity: 1,
      unitAmount: service.price,
      total: service.price,
      currency: service.currency,
    };
    return {
      currency: service.currency,
      lineItems: [lineItem],
      subtotal: service.price,
      total: service.price,
    };
  }

  const selectedPackage =
    service.packages?.find((item) => item.slug === packageSlug) ?? service.packages?.[0];
  if (!selectedPackage) return { currency: "USD", lineItems: [], subtotal: 0, total: 0 };
  const lineItem: PricingLineItem = {
    key: `package:${selectedPackage.slug}`,
    label: selectedPackage.name,
    quantity: 1,
    unitAmount: selectedPackage.price,
    total: selectedPackage.price,
    currency: selectedPackage.currency,
  };
  return {
    currency: selectedPackage.currency,
    lineItems: [lineItem],
    subtotal: selectedPackage.price,
    total: selectedPackage.price,
  };
}
