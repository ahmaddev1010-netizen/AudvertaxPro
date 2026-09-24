/**
 * Static service catalog. The catalog is the source of truth for service
 * identity, content, and the canonical slug used by /services/[slug].
 */

export type ServiceCategoryConfig = {
  slug: string;
  name: string;
  description: string;
  sortOrder: number;
};

export type ServicePackageConfig = {
  slug: string;
  name: string;
  description: string;
  price: number;
  currency: "USD" | "GBP";
  features: string[];
  sortOrder: number;
};

export type ServiceRecommendation = {
  serviceSlug: string;
  reason: string;
  required?: boolean;
};

export type ServiceConfig = {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  category: string;
  type:
    | "formation"
    | "business"
    | "tax"
    | "compliance"
    | "banking"
    | "payments"
    | "ecommerce"
    | "branding"
    | "other";
  featured: boolean;
  packages?: ServicePackageConfig[];
  recommendations?: ServiceRecommendation[];
};

export const serviceCategories: ServiceCategoryConfig[] = [
  {
    slug: "formation",
    name: "Business Formation",
    description: "Form and structure your company in the United States or United Kingdom.",
    sortOrder: 1,
  },
  {
    slug: "business-essentials",
    name: "Business Essentials",
    description: "Essential services that help you establish and operate your business.",
    sortOrder: 2,
  },
  {
    slug: "banking-payments",
    name: "Banking & Payments",
    description: "Business banking and payment infrastructure support.",
    sortOrder: 3,
  },
  {
    slug: "tax-compliance",
    name: "Tax & Compliance",
    description: "Tax, reporting and ongoing compliance support.",
    sortOrder: 4,
  },
  {
    slug: "branding-growth",
    name: "Branding & Growth",
    description: "Services that help establish and grow your business presence.",
    sortOrder: 5,
  },
  {
    slug: "ecommerce",
    name: "E-commerce",
    description: "E-commerce account and marketplace management services.",
    sortOrder: 6,
  },
];

export const serviceCatalog: ServiceConfig[] = [
  {
    slug: "usa-llc",
    name: "USA LLC Formation",
    shortDescription: "Form a U.S. LLC remotely with guided filing and formation support.",
    description:
      "Complete your U.S. LLC formation through a guided application, state selection and document workflow.",
    category: "formation",
    type: "formation",
    featured: true,
    recommendations: [
      {
        serviceSlug: "ein-without-ssn",
        reason: "Many non-U.S. founders need an EIN after forming their company.",
      },
      {
        serviceSlug: "registered-agent-us-address",
        reason: "Maintain a compliant registered-agent relationship for your company.",
      },
      {
        serviceSlug: "operating-agreement",
        reason: "Useful for documenting the ownership and operating structure of your LLC.",
      },
      {
        serviceSlug: "us-business-banking",
        reason: "Set up business banking after your company is formed.",
      },
      {
        serviceSlug: "payment-gateway-setup",
        reason: "Useful if you need to accept online payments through your business.",
      },
    ],
  },
  {
    slug: "uk-ltd",
    name: "UK LTD Formation",
    shortDescription: "Form a UK private limited company with guided registration support.",
    description:
      "Set up a UK LTD through a guided company formation workflow designed for local and international founders.",
    category: "formation",
    type: "formation",
    featured: true,
    packages: [
      {
        slug: "standard",
        name: "Standard",
        description:
          "Essential UK LTD registration with the core company formation and registration documents.",
        price: 165,
        currency: "GBP",
        features: [
          "Director ID verification",
          "UK registered address",
          "Lease agreement as proof of address",
          "LTD registration documents",
          "Articles of Association",
          "Memorandum of Association",
          "Certificate of Incorporation",
          "UTR number",
          "Authentication code",
        ],
        sortOrder: 1,
      },
      {
        slug: "premium",
        name: "Premium",
        description:
          "UK LTD registration with the complete Standard package plus UK virtual bank account setup.",
        price: 225,
        currency: "GBP",
        features: ["Everything in Standard", "UK virtual bank account setup — choose one"],
        sortOrder: 2,
      },
    ],
    recommendations: [
      {
        serviceSlug: "business-address",
        reason: "Useful for eligible founders who need a business address solution.",
      },
      {
        serviceSlug: "us-business-banking",
        reason: "Business banking may be useful depending on your operating model.",
      },
      {
        serviceSlug: "payment-gateway-setup",
        reason: "Useful for businesses that need online payment processing.",
      },
      {
        serviceSlug: "compliance-renewals",
        reason: "Keep track of recurring company obligations.",
      },
    ],
  },
  {
    slug: "ein-without-ssn",
    name: "EIN without an SSN",
    shortDescription: "Assisted EIN application support for eligible non-U.S. founders.",
    description:
      "Guided preparation and submission support for founders applying for a U.S. EIN without an SSN where eligible.",
    category: "business-essentials",
    type: "business",
    featured: true,
  },
  {
    slug: "registered-agent-us-address",
    name: "Registered Agent & U.S. Address",
    shortDescription: "Registered-agent and eligible U.S. address support.",
    description:
      "Maintain a registered-agent relationship and access address solutions for eligible business workflows.",
    category: "business-essentials",
    type: "business",
    featured: false,
  },
  {
    slug: "business-address",
    name: "Business Address",
    shortDescription: "Business-address solutions for eligible founders and workflows.",
    description: "Access a business-address option appropriate for your business requirements.",
    category: "business-essentials",
    type: "business",
    featured: false,
  },
  {
    slug: "operating-agreement",
    name: "Operating Agreement",
    shortDescription: "Operating agreement preparation for your LLC structure.",
    description:
      "Prepare an operating agreement that documents the ownership and operating structure of your LLC.",
    category: "business-essentials",
    type: "business",
    featured: false,
  },
  {
    slug: "us-phone",
    name: "U.S. Phone Number",
    shortDescription: "Business communications support for eligible plans.",
    description: "Set up a U.S. business phone solution for eligible use cases.",
    category: "business-essentials",
    type: "business",
    featured: false,
  },
  {
    slug: "us-business-banking",
    name: "U.S. Business Banking",
    shortDescription: "Assisted setup for eligible U.S. business banking solutions.",
    description:
      "Prepare your business for banking applications with account-readiness and documentation support.",
    category: "banking-payments",
    type: "banking",
    featured: true,
  },
  {
    slug: "payment-gateway-setup",
    name: "Payment Gateway Setup",
    shortDescription: "Support preparing and applying for online payment processors.",
    description:
      "Prepare your business for payment processor applications and understand the requirements involved.",
    category: "banking-payments",
    type: "payments",
    featured: true,
  },
  {
    slug: "wise-trading-address",
    name: "Wise Trading Address",
    shortDescription: "Address support for eligible financial workflows.",
    description: "Business-address support for eligible payment and financial workflows.",
    category: "banking-payments",
    type: "banking",
    featured: false,
  },
  {
    slug: "compliance-renewals",
    name: "Compliance & Renewals",
    shortDescription: "Track annual reports, renewals and recurring obligations.",
    description: "Keep your business on top of recurring filing and compliance requirements.",
    category: "tax-compliance",
    type: "compliance",
    featured: true,
  },
  {
    slug: "annual-report",
    name: "Annual Report",
    shortDescription: "Annual-report preparation and filing support.",
    description: "Get support preparing and filing annual reports for eligible U.S. entities.",
    category: "tax-compliance",
    type: "compliance",
    featured: false,
  },
  {
    slug: "itin-processing",
    name: "ITIN Processing",
    shortDescription: "Assisted W-7 preparation and submission support.",
    description:
      "Support for founders who actually require an ITIN and meet the relevant requirements.",
    category: "tax-compliance",
    type: "tax",
    featured: false,
  },
  {
    slug: "bookkeeping-tax",
    name: "Bookkeeping & Tax Referrals",
    shortDescription: "Connect your business with accounting and tax professionals.",
    description: "Referral and coordination support for bookkeeping and tax-filing professionals.",
    category: "tax-compliance",
    type: "tax",
    featured: false,
  },
  {
    slug: "tax-consultation",
    name: "Tax Consultation",
    shortDescription: "Referral and consultation support for business tax questions.",
    description:
      "Connect with appropriate tax professionals for questions about your specific business situation.",
    category: "tax-compliance",
    type: "tax",
    featured: false,
  },
  {
    slug: "trademark",
    name: "Trademark",
    shortDescription: "U.S. trademark application preparation support.",
    description:
      "Prepare a U.S. trademark application for an eligible brand name, logo or other mark.",
    category: "branding-growth",
    type: "branding",
    featured: false,
  },
  {
    slug: "website",
    name: "Website",
    shortDescription: "Conversion-focused website package for your business.",
    description: "Build a professional website for your newly established business.",
    category: "branding-growth",
    type: "branding",
    featured: false,
  },
  {
    slug: "ebay",
    name: "eBay Services",
    shortDescription: "eBay account and marketplace management support.",
    description: "Support for eligible eBay account setup, management and marketplace operations.",
    category: "ecommerce",
    type: "ecommerce",
    featured: true,
  },

  // Services represented by the current megamenu taxonomy.
  {
    slug: "usa-taxation",
    name: "USA Taxation",
    shortDescription: "U.S. business taxation support for eligible requirements.",
    description:
      "Tax support for eligible U.S. business requirements. Specific obligations depend on your entity, activity and circumstances.",
    category: "tax-compliance",
    type: "tax",
    featured: false,
  },
  {
    slug: "uk-confirmation-statement",
    name: "Confirmation Statement",
    shortDescription: "UK confirmation statement preparation and filing support.",
    description:
      "Support preparing and filing the required UK confirmation statement for eligible companies.",
    category: "tax-compliance",
    type: "compliance",
    featured: false,
  },
  {
    slug: "uk-accounts-preparation",
    name: "Accounts Preparation",
    shortDescription: "UK company accounts preparation support.",
    description:
      "Support preparing company accounts for eligible UK companies and their filing workflow.",
    category: "tax-compliance",
    type: "compliance",
    featured: false,
  },
  {
    slug: "uk-hmrc-companies-house-submission",
    name: "HMRC & Company House Submission",
    shortDescription: "Submission support for eligible UK company filings.",
    description: "Support coordinating eligible submissions to HMRC and Companies House.",
    category: "tax-compliance",
    type: "compliance",
    featured: false,
  },
  {
    slug: "uk-vat-registration",
    name: "VAT Registration",
    shortDescription: "UK VAT registration support.",
    description:
      "Guided support for eligible businesses completing a UK VAT registration workflow.",
    category: "tax-compliance",
    type: "tax",
    featured: false,
  },
  {
    slug: "uk-vat-filing",
    name: "VAT Filing",
    shortDescription: "UK VAT return filing support.",
    description: "Support preparing and filing eligible UK VAT returns.",
    category: "tax-compliance",
    type: "tax",
    featured: false,
  },
  {
    slug: "uk-self-assessment-registration",
    name: "Self Assessment Registration",
    shortDescription: "UK Self Assessment registration support.",
    description: "Support for eligible individuals who need to register for UK Self Assessment.",
    category: "tax-compliance",
    type: "tax",
    featured: false,
  },
  {
    slug: "uk-self-assessment-filing",
    name: "Self Assessment Filing",
    shortDescription: "UK Self Assessment filing support.",
    description: "Support preparing and filing an eligible UK Self Assessment return.",
    category: "tax-compliance",
    type: "tax",
    featured: false,
  },
  {
    slug: "uk-corporate-tax",
    name: "Corporate Tax",
    shortDescription: "UK corporation tax support.",
    description: "Support for eligible UK companies with corporation tax filing requirements.",
    category: "tax-compliance",
    type: "tax",
    featured: false,
  },
  {
    slug: "uk-payee-registration",
    name: "PAYE Registration",
    shortDescription: "UK PAYE registration support.",
    description: "Support for eligible employers completing a UK PAYE registration workflow.",
    category: "tax-compliance",
    type: "tax",
    featured: false,
  },
  {
    slug: "uk-payroll-filing",
    name: "Payroll Filing",
    shortDescription: "UK payroll filing support.",
    description: "Support for eligible employers managing UK payroll filing requirements.",
    category: "tax-compliance",
    type: "compliance",
    featured: false,
  },
  {
    slug: "uk-ltd-name",
    name: "Ltd Name Matters",
    shortDescription: "Support for eligible UK company name matters.",
    description:
      "Guided support for eligible company-name requirements and related Companies House workflows.",
    category: "business-essentials",
    type: "business",
    featured: false,
  },
  {
    slug: "uk-ltd-address-change",
    name: "Ltd Address Change",
    shortDescription: "UK company address change support.",
    description:
      "Support updating eligible company address information with the relevant UK filing authority.",
    category: "business-essentials",
    type: "business",
    featured: false,
  },
  {
    slug: "uk-add-director",
    name: "Add Director",
    shortDescription: "UK director appointment support.",
    description:
      "Support for eligible UK companies adding a director and completing the relevant filing workflow.",
    category: "business-essentials",
    type: "business",
    featured: false,
  },
  {
    slug: "uk-change-director-address",
    name: "Change Director Address",
    shortDescription: "UK director address change support.",
    description:
      "Support updating an eligible director's address through the relevant company filing workflow.",
    category: "business-essentials",
    type: "business",
    featured: false,
  },
  {
    slug: "uk-ltd-name-change",
    name: "Ltd Name Change",
    shortDescription: "UK company name change support.",
    description:
      "Support completing an eligible UK company name change and associated filing workflow.",
    category: "business-essentials",
    type: "business",
    featured: false,
  },
  {
    slug: "uae-company-registration",
    name: "UAE Company Registration",
    shortDescription: "UAE company registration support.",
    description: "Guided support for eligible UAE company registration requirements.",
    category: "formation",
    type: "formation",
    featured: false,
  },
  {
    slug: "uae-corporate-tax-registration",
    name: "UAE Corporate Tax Registration",
    shortDescription: "UAE corporate tax registration support.",
    description:
      "Support for eligible UAE businesses completing corporate tax registration requirements.",
    category: "tax-compliance",
    type: "tax",
    featured: false,
  },
  {
    slug: "uae-corporate-tax-filing",
    name: "UAE Corporate Tax Filing",
    shortDescription: "UAE corporate tax filing support.",
    description: "Support preparing and filing eligible UAE corporate tax requirements.",
    category: "tax-compliance",
    type: "tax",
    featured: false,
  },
  {
    slug: "uae-vat-registration",
    name: "UAE VAT Registration",
    shortDescription: "UAE VAT registration support.",
    description: "Support for eligible UAE businesses completing VAT registration requirements.",
    category: "tax-compliance",
    type: "tax",
    featured: false,
  },
  {
    slug: "uae-vat-filing",
    name: "UAE VAT Filing",
    shortDescription: "UAE VAT filing support.",
    description: "Support preparing and filing eligible UAE VAT returns.",
    category: "tax-compliance",
    type: "tax",
    featured: false,
  },
  {
    slug: "uae-excise-tax-registration",
    name: "UAE Excise Tax Registration",
    shortDescription: "UAE excise tax registration support.",
    description:
      "Support for eligible businesses completing UAE excise tax registration requirements.",
    category: "tax-compliance",
    type: "tax",
    featured: false,
  },
  {
    slug: "uae-excise-tax-filing",
    name: "UAE Excise Tax Filing",
    shortDescription: "UAE excise tax filing support.",
    description: "Support preparing and filing eligible UAE excise tax requirements.",
    category: "tax-compliance",
    type: "tax",
    featured: false,
  },
  {
    slug: "uae-bookkeeping",
    name: "UAE Bookkeeping",
    shortDescription: "UAE bookkeeping support.",
    description:
      "Bookkeeping support for eligible UAE business workflows and reporting requirements.",
    category: "tax-compliance",
    type: "tax",
    featured: false,
  },
  {
    slug: "pak-taxation",
    name: "Pakistan Taxation",
    shortDescription: "Pakistan business taxation support.",
    description: "Tax support for eligible Pakistan business requirements and filing workflows.",
    category: "tax-compliance",
    type: "tax",
    featured: false,
  },
  {
    slug: "pak-private-company-registration",
    name: "Private Company Registration",
    shortDescription: "Pakistan private company registration support.",
    description:
      "Guided support for eligible private company registration requirements in Pakistan.",
    category: "formation",
    type: "formation",
    featured: false,
  },
  {
    slug: "pak-llp-registration",
    name: "LLP Registration",
    shortDescription: "Pakistan LLP registration support.",
    description: "Guided support for eligible LLP registration requirements in Pakistan.",
    category: "formation",
    type: "formation",
    featured: false,
  },
  {
    slug: "pak-other-business-matters",
    name: "Other Business Matters",
    shortDescription: "Support for other eligible Pakistan business requirements.",
    description:
      "A starting point for discussing business requirements that do not fit the standard service categories.",
    category: "business-essentials",
    type: "business",
    featured: false,
  },
];

export function getServiceBySlug(slug: string): ServiceConfig | undefined {
  return serviceCatalog.find((service) => service.slug === slug);
}

export function getServiceHref(slug: string): string {
  return `/${slug}`;
}

export function getServicesByCategory(category: string): ServiceConfig[] {
  return serviceCatalog.filter((service) => service.category === category);
}

export function getFeaturedServices(): ServiceConfig[] {
  return serviceCatalog.filter((service) => service.featured);
}

export function getServicePackages(slug: string): ServicePackageConfig[] {
  return getServiceBySlug(slug)?.packages ?? [];
}

export function getServiceRecommendations(slug: string): ServiceRecommendation[] {
  return getServiceBySlug(slug)?.recommendations ?? [];
}
