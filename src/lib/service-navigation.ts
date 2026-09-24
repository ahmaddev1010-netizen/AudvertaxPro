export type ServiceNavigationItem = {
  title: string;
  slug?: string;
  children?: Array<{ title: string; slug: string }>;
};

export type ServiceNavigationGroup = {
  title: string;
  items: ServiceNavigationItem[];
};

/**
 * Canonical service taxonomy shared by the Services navbar and Services page.
 * Parent items with children represent a single category page/card; their
 * children are shown inside that parent page rather than as separate cards.
 */
export const serviceNavigationGroups: ServiceNavigationGroup[] = [
  {
    title: "USA",
    items: [
      { title: "Company Registration", slug: "usa-llc" },
      { title: "Taxation", slug: "usa-taxation" },
    ],
  },
  {
    title: "UK",
    items: [
      { title: "LTD Registration", slug: "uk-ltd" },
      {
        title: "LTD Compliance",
        slug: "uk-ltd-compliance",
        children: [
          { title: "Confirmation Statement", slug: "uk-confirmation-statement" },
          { title: "Accounts Preparation", slug: "uk-accounts-preparation" },
          {
            title: "HMRC & Companies House Submission",
            slug: "uk-hmrc-companies-house-submission",
          },
        ],
      },
      {
        title: "Taxation",
        slug: "uk-taxation",
        children: [
          { title: "VAT Registration", slug: "uk-vat-registration" },
          { title: "VAT Filing", slug: "uk-vat-filing" },
          { title: "Self Assessment Registration", slug: "uk-self-assessment-registration" },
          { title: "Self Assessment Filing", slug: "uk-self-assessment-filing" },
          { title: "Corporate Tax", slug: "uk-corporate-tax" },
          { title: "PAYE Registration", slug: "uk-payee-registration" },
          { title: "Payroll Filing", slug: "uk-payroll-filing" },
        ],
      },
      {
        title: "LTD Company Matters",
        slug: "uk-ltd-company-matters",
        children: [
          { title: "LTD Name", slug: "uk-ltd-name" },
          { title: "LTD Address Change", slug: "uk-ltd-address-change" },
          { title: "Add Director", slug: "uk-add-director" },
          { title: "Change Director Address", slug: "uk-change-director-address" },
          { title: "Director ID Verification", slug: "uk-director-id-verification" },
          { title: "UK Address", slug: "uk-address" },
          { title: "LTD Name Change", slug: "uk-ltd-name-change" },
        ],
      },
    ],
  },
  {
    title: "UAE",
    items: [
      { title: "Company Registration", slug: "uae-company-registration" },
      { title: "Corporate Tax Registration", slug: "uae-corporate-tax-registration" },
      { title: "Corporate Tax Filing", slug: "uae-corporate-tax-filing" },
      { title: "VAT Registration", slug: "uae-vat-registration" },
      { title: "VAT Filing", slug: "uae-vat-filing" },
      { title: "Excise Tax Registration", slug: "uae-excise-tax-registration" },
      { title: "Excise Tax Filing", slug: "uae-excise-tax-filing" },
      { title: "Bookkeeping", slug: "uae-bookkeeping" },
    ],
  },
  {
    title: "Pakistan",
    items: [
      { title: "Taxation", slug: "pak-taxation" },
      {
        title: "Business Registration",
        slug: "pak-business-registration",
        children: [
          { title: "Private Company Registration", slug: "pak-private-company-registration" },
          { title: "LLP Registration", slug: "pak-llp-registration" },
          { title: "Sole Business Registration", slug: "pak-sole-business-registration" },
        ],
      },
      { title: "Other Business Matters", slug: "pak-other-business-matters" },
    ],
  },
];

export function getServiceNavigationCardItems(): Array<{
  country: string;
  title: string;
  slug: string;
  hasChildren: boolean;
}> {
  return serviceNavigationGroups.flatMap((group) =>
    group.items.flatMap((item) =>
      item.slug
        ? [
            {
              country: group.title,
              title: item.title,
              slug: item.slug,
              hasChildren: Boolean(item.children?.length),
            },
          ]
        : [],
    ),
  );
}

export function getServiceNavigationGroupBySlug(
  slug: string,
): { country: string; item: ServiceNavigationItem } | undefined {
  for (const group of serviceNavigationGroups) {
    const item = group.items.find((candidate) => candidate.slug === slug);
    if (item) return { country: group.title, item };
  }
  return undefined;
}

export function getServiceNavigationCategorySlugs(): string[] {
  return serviceNavigationGroups.flatMap((group) =>
    group.items.flatMap((item) => (item.children?.length && item.slug ? [item.slug] : [])),
  );
}

/** Returns all leaf services exposed inside the navigation hierarchy. */
export function getServiceNavigationLeafSlugs(): string[] {
  return serviceNavigationGroups.flatMap((group) =>
    group.items.flatMap(
      (item) => item.children?.map((child) => child.slug) ?? (item.slug ? [item.slug] : []),
    ),
  );
}
