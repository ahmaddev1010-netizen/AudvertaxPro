/** Canonical domain contracts shared by catalog, application and pricing code. */
export type Currency = "USD" | "GBP" | "PKR";
export type PricingModel = "fixed" | "formation" | "quote";
export type ApplicationMode = "paid" | "contact";
export type ServiceType =
  | "formation"
  | "business"
  | "tax"
  | "compliance"
  | "banking"
  | "payments"
  | "ecommerce"
  | "branding"
  | "other";
export type ServiceCapabilities = {
  pricingModel: PricingModel;
  applicationMode?: ApplicationMode;
  requiresPackage: boolean;
  requiresJurisdiction: boolean;
  supportsAddOns: boolean;
  applicationRequired: boolean;
  hasVariants: boolean;
};
export function getApplicationMode(capabilities: ServiceCapabilities): ApplicationMode {
  return (
    capabilities.applicationMode ?? (capabilities.pricingModel === "quote" ? "contact" : "paid")
  );
}
export type PackageInclusion = { serviceSlug: string; label?: string };
export type Package = {
  slug: string;
  name: string;
  description: string;
  price: number;
  currency: Currency;
  features: string[];
  inclusions?: PackageInclusion[];
  sortOrder: number;
};
export type AddOn = {
  slug: string;
  name: string;
  description: string;
  price: number;
  currency: Currency;
  sortOrder?: number;
  available?: boolean;
};
export type ServiceVariant = {
  variantSlug: string;
  name: string;
  price: number;
  currency: Currency;
  description?: string;
};
export type Jurisdiction = {
  slug: string;
  code: string;
  name: string;
  country: string;
  filingFee: number;
  renewalFee: number;
  renewalDue?: string;
  description: string;
  suitableFor: string[];
};
export type Service = {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  category: string;
  type: ServiceType;
  featured: boolean;
  capabilities: ServiceCapabilities;
  price?: number;
  currency?: Currency;
  packages?: Package[];
  addOns?: AddOn[];
  jurisdictions?: Jurisdiction[];
  variants?: ServiceVariant[];
  recommendations?: { serviceSlug: string; reason: string; required?: boolean }[];
};
export type ApplicationSelection = {
  serviceSlug: string;
  packageSlug?: string;
  jurisdictionSlug?: string;
  variantSlug?: string;
  addOnSlugs: string[];
  initialAnswers?: Record<string, unknown>;
};
export type PricingLineItem = {
  key: string;
  label: string;
  quantity: number;
  unitAmount: number;
  total: number;
  currency: Currency;
};
export type PricingResult = {
  currency: Currency;
  lineItems: PricingLineItem[];
  subtotal: number;
  total: number;
  pricingVersion?: string;
};
export type BillingOrder = {
  id: string;
  applicationId: string;
  lineItems: PricingLineItem[];
  subtotal: number;
  total: number;
  currency: Currency;
  status: string;
};
