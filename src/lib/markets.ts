import { getServiceBySlug } from "@/lib/services";
import type { Service } from "@/lib/services";

export type MarketServiceGroup = { title: string; serviceSlugs: string[] };
export type Market = {
  slug: string;
  name: string;
  code: string;
  description: string;
  serviceGroups: MarketServiceGroup[];
};

/** Canonical market configuration. */
export const markets: Market[] = [
  {
    slug: "usa",
    name: "USA",
    code: "US",
    description: "U.S. formation and taxation services.",
    serviceGroups: [
      { title: "Company Registration", serviceSlugs: ["usa-llc"] },
      { title: "Taxation", serviceSlugs: ["usa-taxation"] },
    ],
  },
  {
    slug: "uk",
    name: "UK",
    code: "GB",
    description: "UK company formation, compliance, VAT, tax and payroll services.",
    serviceGroups: [
      { title: "Company Formation", serviceSlugs: ["uk-ltd"] },
      {
        title: "LTD Compliance",
        serviceSlugs: [
          "uk-confirmation-statement",
          "uk-accounts-preparation",
          "uk-hmrc-companies-house-submission",
        ],
      },
      {
        title: "Taxation",
        serviceSlugs: [
          "uk-vat-registration",
          "uk-vat-filing",
          "uk-self-assessment-registration",
          "uk-self-assessment-filing",
          "uk-corporate-tax",
          "uk-payee-registration",
          "uk-payroll-filing",
        ],
      },
      {
        title: "LTD Name Matters",
        serviceSlugs: [
          "uk-ltd-name",
          "uk-ltd-address-change",
          "uk-add-director",
          "uk-change-director-address",
        ],
      },
      { title: "Other Company Matters", serviceSlugs: ["uk-ltd-name-change"] },
    ],
  },
  {
    slug: "uae",
    name: "UAE",
    code: "AE",
    description: "UAE company registration, tax, VAT, excise and bookkeeping services.",
    serviceGroups: [
      { title: "Company Formation", serviceSlugs: ["uae-company-registration"] },
      {
        title: "Tax & Compliance",
        serviceSlugs: [
          "uae-corporate-tax-registration",
          "uae-corporate-tax-filing",
          "uae-vat-registration",
          "uae-vat-filing",
          "uae-excise-tax-registration",
          "uae-excise-tax-filing",
          "uae-bookkeeping",
        ],
      },
    ],
  },
  {
    slug: "pak",
    name: "PAK",
    code: "PK",
    description: "Pakistan taxation, company and business registration services.",
    serviceGroups: [
      {
        title: "Taxation",
        serviceSlugs: [
          "pak-ntn-registration",
          "pak-become-filer",
          "pak-salary-return",
          "pak-business-return",
          "pak-dnfbp-certificate",
          "pak-pseb",
          "pak-psw",
        ],
      },
      {
        title: "Business Registration",
        serviceSlugs: [
          "pak-private-company-registration",
          "pak-llp-registration",
          "pak-sole-business-registration",
        ],
      },
      { title: "Other Business Matters", serviceSlugs: ["pak-other-business-matters"] },
    ],
  },
];

export function getMarketBySlug(slug: string): Market | undefined {
  return markets.find((market) => market.slug === slug);
}
export function getMarketServices(
  market: Market,
): Array<{ group: MarketServiceGroup; services: Service[] }> {
  return market.serviceGroups.map((group) => ({
    group,
    services: group.serviceSlugs
      .map((slug) => getServiceBySlug(slug))
      .filter((service): service is Service => Boolean(service)),
  }));
}
export function getMarketHref(slug: string): string {
  return `/markets/${slug}`;
}
