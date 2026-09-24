import type { AddOn, Package, Service, ServiceVariant } from "./domain";
import {
  serviceCatalog as legacyServiceCatalog,
  serviceCategories,
  type ServiceConfig as LegacyServiceConfig,
  type ServicePackageConfig as LegacyPackageConfig,
} from "./catalog";
import { jurisdictions } from "./states";

const usaFormationJurisdictionSlugs = new Set([
  "wyoming",
  "new-mexico",
  "delaware",
  "texas",
  "florida",
]);

const usaFormationPackages: Package[] = [
  {
    slug: "basic",
    name: "Basic",
    description: "Core U.S. LLC formation with the essential business setup services.",
    price: 125,
    currency: "USD",
    features: [
      "LLC Registration",
      "Registered Agent 1 year",
      "Business Mailing Address",
      "US Phone Number",
      "EIN",
      "Business Payoneer Account",
      "Business Stripe Account",
    ],
    sortOrder: 1,
  },
  {
    slug: "standard",
    name: "Standard",
    description: "Basic U.S. LLC formation plus a unique business address.",
    price: 174,
    currency: "USD",
    features: ["Everything in Basic", "Unique Business Address"],
    sortOrder: 2,
  },
  {
    slug: "premium",
    name: "Premium",
    description: "Standard U.S. LLC formation plus ITIN and PayPal account setup.",
    price: 280,
    currency: "USD",
    features: ["Everything in Standard", "Unique Business Address", "ITIN", "PayPal Account Setup"],
    sortOrder: 3,
  },
];

const usaFormationAddOns: AddOn[] = [
  {
    slug: "wise-account-setup",
    name: "Wise Account Setup",
    description: "Wise account setup with trading address and proof, plus Wise setup fees.",
    price: 75,
    currency: "USD",
    sortOrder: 1,
    available: true,
  },
];

const usaStandaloneVariants: Record<string, ServiceVariant[]> = {
  "itin-processing": [{ variantSlug: "itin", name: "ITIN", price: 150, currency: "USD" }],
  "ein-without-ssn": [
    { variantSlug: "resident", name: "International EIN — Resident", price: 10, currency: "USD" },
    {
      variantSlug: "non-resident",
      name: "International EIN — Non-Resident",
      price: 25,
      currency: "USD",
    },
  ],
};

const contactCapabilities = {
  pricingModel: "fixed" as const,
  applicationMode: "contact" as const,
  requiresPackage: false,
  requiresJurisdiction: false,
  supportsAddOns: false,
  applicationRequired: true,
  hasVariants: false,
};

const ukDirectorIdVerification: Service = {
  slug: "uk-director-id-verification",
  name: "UK Director ID Verification",
  shortDescription: "UK director identity verification with passport and bank statement review.",
  description:
    "Complete the required director identity verification submission with your legal details, LTD information, passport and bank statement.",
  category: "business-essentials",
  type: "business",
  featured: false,
  price: 25,
  currency: "GBP",
  capabilities: {
    pricingModel: "fixed",
    requiresPackage: false,
    requiresJurisdiction: false,
    supportsAddOns: false,
    applicationRequired: true,
    hasVariants: false,
  },
};

const ukAddress: Service = {
  slug: "uk-address",
  name: "UK Address",
  shortDescription: "UK address service for LTD companies, provided for one year.",
  description:
    "Provide the required personal and LTD details and upload your passport and bank statement to apply for a UK address service.",
  category: "business-essentials",
  type: "business",
  featured: false,
  price: 40,
  currency: "GBP",
  capabilities: {
    pricingModel: "fixed",
    requiresPackage: false,
    requiresJurisdiction: false,
    supportsAddOns: false,
    applicationRequired: true,
    hasVariants: false,
  },
};

const ukCorporateTaxFiling: Service = {
  slug: "uk-corporate-tax",
  name: "UK Corporate Tax Filing (CT600)",
  shortDescription: "UK Corporation Tax filing and CT600 submission.",
  description:
    "Submit your UK Corporation Tax filing (CT600) enquiry and provide your contact details so our team can follow up.",
  category: "tax-compliance",
  type: "tax",
  featured: false,
  price: 125,
  currency: "GBP",
  capabilities: { ...contactCapabilities },
};

const ukConfirmationStatement: Service = {
  slug: "uk-confirmation-statement",
  name: "Confirmation Statement",
  shortDescription: "UK confirmation statement preparation and filing support.",
  description:
    "Provide the company and Companies House details required for your UK confirmation statement filing.",
  category: "tax-compliance",
  type: "compliance",
  featured: false,
  price: 75,
  currency: "GBP",
  capabilities: {
    pricingModel: "fixed",
    requiresPackage: false,
    requiresJurisdiction: false,
    supportsAddOns: false,
    applicationRequired: true,
    hasVariants: false,
  },
};

const ukVatRegistration: Service = {
  slug: "uk-vat-registration",
  name: "VAT Registration",
  shortDescription: "UK VAT registration support.",
  description:
    "Provide the required company, HMRC gateway, contact and banking details and upload the supporting documents needed for UK VAT registration.",
  category: "tax-compliance",
  type: "tax",
  featured: false,
  price: 49,
  currency: "GBP",
  capabilities: {
    pricingModel: "fixed",
    requiresPackage: false,
    requiresJurisdiction: false,
    supportsAddOns: false,
    applicationRequired: true,
    hasVariants: false,
  },
};

const ukVatFiling: Service = {
  slug: "uk-vat-filing",
  name: "VAT Return Filing",
  shortDescription: "UK VAT return filing support.",
  description:
    "Submit your UK VAT Return Filing enquiry and provide your contact details so our VAT filing team can follow up.",
  category: "tax-compliance",
  type: "tax",
  featured: false,
  price: 70,
  currency: "GBP",
  capabilities: { ...contactCapabilities },
};

const pakSoleBusinessRegistration: Service = {
  slug: "pak-sole-business-registration",
  name: "Sole Business Registration",
  shortDescription: "Pakistan sole business registration support.",
  description:
    "Register a sole business in Pakistan with the required business, contact and CNIC details.",
  category: "formation",
  type: "formation",
  featured: false,
  price: 1500,
  currency: "PKR",
  capabilities: {
    pricingModel: "fixed",
    requiresPackage: false,
    requiresJurisdiction: false,
    supportsAddOns: false,
    applicationRequired: true,
    hasVariants: false,
  },
};

const pakPrivateCompanyRegistration: Service = {
  slug: "pak-private-company-registration",
  name: "Private Company Registration",
  shortDescription: "Pakistan private company registration support.",
  description:
    "Register a private company in Pakistan with a PKR 5,000 service fee plus government fees.",
  category: "formation",
  type: "formation",
  featured: false,
  price: 5000,
  currency: "PKR",
  capabilities: {
    pricingModel: "fixed",
    requiresPackage: false,
    requiresJurisdiction: false,
    supportsAddOns: false,
    applicationRequired: true,
    hasVariants: false,
  },
};

const pakLlpRegistration: Service = {
  slug: "pak-llp-registration",
  name: "LLP Registration",
  shortDescription: "Pakistan LLP registration support.",
  description: "Register an LLP in Pakistan with the required company, contact and CNIC details.",
  category: "formation",
  type: "formation",
  featured: false,
  price: 20000,
  currency: "PKR",
  capabilities: {
    pricingModel: "fixed",
    requiresPackage: false,
    requiresJurisdiction: false,
    supportsAddOns: false,
    applicationRequired: true,
    hasVariants: false,
  },
};

const pakNtnRegistration: Service = {
  slug: "pak-ntn-registration",
  name: "NTN Registration",
  shortDescription: "Pakistan NTN registration support.",
  description:
    "NTN Registration contact service. Our team will follow up after you submit your details and documents.",
  category: "tax-compliance",
  type: "tax",
  featured: false,
  price: 500,
  currency: "PKR",
  capabilities: { ...contactCapabilities },
};

const pakBecomeFiler: Service = {
  slug: "pak-become-filer",
  name: "Become Filer",
  shortDescription: "Pakistan filer registration support.",
  description: "Become Filer contact service with the required identity and financial information.",
  category: "tax-compliance",
  type: "tax",
  featured: false,
  price: 2000,
  currency: "PKR",
  capabilities: { ...contactCapabilities },
};

const pakSalaryReturn: Service = {
  slug: "pak-salary-return",
  name: "Salary Return",
  shortDescription: "Pakistan salary tax return support.",
  description:
    "Salary Return contact service with the required return information and supporting documents.",
  category: "tax-compliance",
  type: "tax",
  featured: false,
  price: 1500,
  currency: "PKR",
  capabilities: { ...contactCapabilities },
};

const pakBusinessReturn: Service = {
  slug: "pak-business-return",
  name: "Business Return",
  shortDescription: "Pakistan business tax return support.",
  description:
    "Business Return contact service with the required return information and supporting documents.",
  category: "tax-compliance",
  type: "tax",
  featured: false,
  price: 2500,
  currency: "PKR",
  capabilities: { ...contactCapabilities },
};

const pakDnfbpCertificate: Service = {
  slug: "pak-dnfbp-certificate",
  name: "DNFBP Certificate",
  shortDescription: "Pakistan DNFBP certificate support.",
  description:
    "DNFBP Certificate contact service with FBR and police character certificate requirements.",
  category: "tax-compliance",
  type: "tax",
  featured: false,
  price: 10000,
  currency: "PKR",
  capabilities: { ...contactCapabilities },
};

const pakPseb: Service = {
  slug: "pak-pseb",
  name: "PSEB Registration",
  shortDescription: "Pakistan Software Export Board registration support.",
  description: "PSEB contact service for Pakistan software exporters.",
  category: "tax-compliance",
  type: "business",
  featured: false,
  price: 5000,
  currency: "PKR",
  capabilities: { ...contactCapabilities },
};

const pakPsw: Service = {
  slug: "pak-psw",
  name: "PSW Registration",
  shortDescription: "Pakistan Single Window registration support.",
  description: "PSW contact service. Only filers can complete the PSW enquiry flow.",
  category: "tax-compliance",
  type: "business",
  featured: false,
  price: 5000,
  currency: "PKR",
  capabilities: { ...contactCapabilities },
};

function capabilitiesFor(service: LegacyServiceConfig) {
  const isUsaLlc = service.slug === "usa-llc";
  const hasVariants = Boolean(usaStandaloneVariants[service.slug]?.length);
  return {
    pricingModel: service.type === "formation" ? ("formation" as const) : ("fixed" as const),
    applicationMode: "paid" as const,
    requiresPackage: Boolean(service.packages?.length) || isUsaLlc,
    requiresJurisdiction: isUsaLlc,
    supportsAddOns: isUsaLlc,
    applicationRequired: true,
    hasVariants,
  };
}

function normalizePackage(pkg: LegacyPackageConfig): Package {
  return {
    slug: pkg.slug,
    name: pkg.name,
    description: pkg.description,
    price: pkg.price,
    currency: pkg.currency,
    features: pkg.features,
    sortOrder: pkg.sortOrder,
  };
}

function normalizeService(service: LegacyServiceConfig): Service {
  const isUsaLlc = service.slug === "usa-llc";
  const variants = usaStandaloneVariants[service.slug];
  return {
    slug: service.slug,
    name: service.name,
    shortDescription: service.shortDescription,
    description: service.description,
    category: service.category,
    type: service.type,
    featured: service.featured,
    capabilities: capabilitiesFor(service),
    packages: isUsaLlc ? usaFormationPackages : service.packages?.map(normalizePackage),
    addOns: isUsaLlc ? usaFormationAddOns : undefined,
    jurisdictions: isUsaLlc
      ? jurisdictions.filter((item) => usaFormationJurisdictionSlugs.has(item.slug))
      : undefined,
    variants,
    recommendations: service.recommendations,
  };
}

const customServices = [
  ukDirectorIdVerification,
  ukAddress,
  ukCorporateTaxFiling,
  ukConfirmationStatement,
  ukVatRegistration,
  ukVatFiling,
  pakPrivateCompanyRegistration,
  pakLlpRegistration,
  pakSoleBusinessRegistration,
  pakNtnRegistration,
  pakBecomeFiler,
  pakSalaryReturn,
  pakBusinessReturn,
  pakDnfbpCertificate,
  pakPseb,
  pakPsw,
];

export const commercialServiceCatalog: Service[] = [
  ...legacyServiceCatalog
    .filter(
      (service) => !customServices.some((customService) => customService.slug === service.slug),
    )
    .map(normalizeService),
  ...customServices,
];

export const commercialServiceCategories = serviceCategories;

export function getCommercialServiceBySlug(slug: string): Service | undefined {
  return commercialServiceCatalog.find((service) => service.slug === slug);
}

export function getCommercialServiceHref(slug: string): string {
  return `/${slug}`;
}

export const serviceCatalog: Service[] = commercialServiceCatalog;
export const getServiceBySlug = getCommercialServiceBySlug;
export const getServiceHref = getCommercialServiceHref;
