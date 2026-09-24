import type {
  ApplicationConfig,
  ApplicationCondition,
  ApplicationField,
  ApplicationFieldType,
  ApplicationOption,
  ApplicationStep,
} from "./application-config-types";

export type {
  ApplicationConfig,
  ApplicationCondition,
  ApplicationField,
  ApplicationFieldType,
  ApplicationOption,
  ApplicationStep,
} from "./application-config-types";

const usaMemberFields: ApplicationField[] = [
  {
    key: "full_name",
    label: "Full legal name",
    type: "text",
    required: true,
    placeholder: "Member's full legal name",
    validation: { minLength: 2, maxLength: 150 },
  },
  {
    key: "ownership_percentage",
    label: "Ownership percentage",
    type: "number",
    required: true,
    validation: { min: 1, max: 100 },
  },
  { key: "country", label: "Country of residence", type: "country", required: true },
  { key: "date_of_birth", label: "Date of birth", type: "date", required: true },
  {
    key: "address",
    label: "Residential address",
    type: "textarea",
    required: true,
    validation: { minLength: 5, maxLength: 500 },
  },
];

export const usaLlcApplication: ApplicationConfig = {
  serviceSlug: "usa-llc",
  steps: [
    {
      id: "business",
      title: "Your Business",
      description: "Tell us what you are planning to do with your company.",
      fields: [],
    },
    {
      id: "contact",
      title: "Contact Information",
      description: "Provide the contact details we should use for your application.",
      fields: [
        {
          key: "email",
          label: "Email address",
          type: "text",
          required: true,
          placeholder: "you@example.com",
        },
        {
          key: "phone",
          label: "Phone number",
          type: "text",
          required: true,
          placeholder: "+1 555 000 0000",
        },
        {
          key: "whatsapp",
          label: "WhatsApp number",
          type: "text",
          required: true,
          placeholder: "+1 555 000 0000",
        },
      ],
    },
    {
      id: "owner",
      title: "Company Structure & Owner",
      description:
        "Choose the LLC structure first, then provide the legal details for the primary owner.",
      fields: [
        {
          key: "company_type",
          label: "Company type",
          type: "radio",
          required: true,
          options: [
            {
              label: "Single member LLC",
              value: "single_member_llc",
              description:
                "You are the only company member. Your ownership is automatically set to 100%.",
            },
            {
              label: "Multi member LLC",
              value: "multi_member_llc",
              description:
                "The company has two or more members. You will enter each member's ownership below.",
            },
          ],
        },
        {
          key: "owner_full_name",
          label: "Legal full name",
          type: "text",
          required: true,
          placeholder: "Your full legal name",
          validation: { minLength: 2, maxLength: 150 },
        },
        { key: "owner_country", label: "Country of residence", type: "country", required: true },
        { key: "owner_date_of_birth", label: "Date of birth", type: "date", required: true },
        {
          key: "owner_ownership_percentage",
          label: "Ownership percentage",
          description:
            "Enter the primary owner's percentage. All member percentages must total 100%.",
          type: "number",
          required: true,
          condition: { field: "company_type", equals: "multi_member_llc" },
          validation: { min: 1, max: 100 },
        },
      ],
    },
    {
      id: "location",
      title: "Your Location",
      description: "Provide your current residential address.",
      fields: [
        {
          key: "residential_address",
          label: "Street address",
          type: "text",
          required: true,
          placeholder: "Street address",
        },
        { key: "residential_city", label: "City", type: "text", required: true },
        { key: "residential_state", label: "State / Province", type: "text", required: true },
        { key: "residential_postal_code", label: "Postal code", type: "text", required: true },
        { key: "residential_country", label: "Country", type: "country", required: true },
      ],
    },
    {
      id: "company",
      title: "Additional Company Members",
      description:
        "For a multi-member LLC, add every additional member and assign their ownership percentage.",
      fields: [
        {
          key: "members",
          label: "Additional members",
          description: "Add every additional member of the multi-member company.",
          type: "repeatable",
          required: true,
          condition: { field: "company_type", equals: "multi_member_llc" },
          itemFields: usaMemberFields,
        },
      ],
    },
    {
      id: "documents",
      title: "Identity & Address Documents",
      description: "Upload the required identity and address documents for every company member.",
      fields: [],
    },
    {
      id: "services",
      title: "Optional Services",
      description: "Review the optional services selected with your commercial package.",
      fields: [
        {
          key: "selected_add_ons",
          label: "Optional services",
          type: "checkbox",
          options: [
            {
              label: "Wise Account Setup — $75",
              value: "wise-account-setup",
              description: "Includes trading address with proof and Wise setup fees.",
            },
          ],
        },
      ],
    },
  ],
};

export const itinApplication: ApplicationConfig = {
  serviceSlug: "itin-processing",
  steps: [
    {
      id: "applicant",
      title: "Applicant Information",
      description: "Provide the legal details we need for your ITIN application.",
      fields: [
        {
          key: "legal_full_name",
          label: "Legal full name",
          type: "text",
          required: true,
          validation: { minLength: 2, maxLength: 150 },
        },
        {
          key: "email",
          label: "Email address",
          type: "text",
          required: true,
          placeholder: "you@example.com",
          validation: { format: "email", maxLength: 254 },
        },
        {
          key: "phone",
          label: "Phone number",
          type: "text",
          required: true,
          validation: { format: "phone", minLength: 7, maxLength: 30 },
        },
        {
          key: "whatsapp",
          label: "WhatsApp number",
          type: "text",
          required: true,
          validation: { format: "phone", minLength: 7, maxLength: 30 },
        },
      ],
    },
    {
      id: "documents",
      title: "Supporting Documents",
      description:
        "Upload your scanned passport. Articles of Organization and an EIN form may also be uploaded if available.",
      fields: [
        {
          key: "articles_available",
          label: "Do you have Articles of Organization available?",
          type: "radio",
          required: true,
          options: [
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ],
        },
        {
          key: "ein_form_available",
          label: "Do you have an EIN form available?",
          type: "radio",
          required: true,
          options: [
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ],
        },
      ],
    },
  ],
};

export const internationalEinApplication: ApplicationConfig = {
  serviceSlug: "ein-without-ssn",
  steps: [
    {
      id: "responsible-party",
      title: "Responsible Party",
      description:
        "Provide the legal details of the single member or responsible party with the relevant ownership interest.",
      fields: [
        {
          key: "legal_full_name",
          label: "Legal full name",
          type: "text",
          required: true,
          validation: { minLength: 2, maxLength: 150 },
        },
        {
          key: "email",
          label: "Email address",
          type: "text",
          required: true,
          placeholder: "you@example.com",
          validation: { format: "email", maxLength: 254 },
        },
        {
          key: "phone",
          label: "Phone number",
          type: "text",
          required: true,
          validation: { format: "phone", minLength: 7, maxLength: 30 },
        },
        {
          key: "whatsapp",
          label: "WhatsApp number",
          type: "text",
          required: true,
          validation: { format: "phone", minLength: 7, maxLength: 30 },
        },
      ],
    },
    {
      id: "documents",
      title: "Supporting Documents",
      description:
        "Choose either Articles of Organization or an SS-4 form and upload the selected document.",
      fields: [
        {
          key: "formation_document_type",
          label: "Document you will provide",
          type: "radio",
          required: true,
          options: [
            { label: "Articles of Organization", value: "articles" },
            { label: "SS-4", value: "ss4" },
          ],
        },
      ],
    },
  ],
};

export const ukLtdApplication: ApplicationConfig = {
  serviceSlug: "uk-ltd",
  steps: [
    {
      id: "business",
      title: "Business Details",
      description: "Tell us about the business you are establishing.",
      fields: [
        {
          key: "business_activity",
          label: "What will your business do?",
          type: "select",
          required: true,
          options: [
            { label: "E-commerce", value: "ecommerce" },
            { label: "SaaS / Software", value: "saas" },
            { label: "Agency", value: "agency" },
            { label: "Consulting", value: "consulting" },
            { label: "Trading", value: "trading" },
            { label: "Other", value: "other" },
          ],
        },
        {
          key: "business_description",
          label: "Business details",
          description: "Briefly describe the business activities, products or services.",
          type: "textarea",
          required: true,
          placeholder: "Describe what your business will do.",
          validation: { minLength: 20, maxLength: 1000 },
        },
      ],
    },
    {
      id: "director",
      title: "Director Information",
      description: "Provide the legal information for the company director.",
      fields: [
        {
          key: "director_full_name",
          label: "Full legal name",
          type: "text",
          required: true,
          placeholder: "Your full legal name",
          validation: { minLength: 2, maxLength: 150 },
        },
        { key: "director_country", label: "Country of residence", type: "country", required: true },
        { key: "director_date_of_birth", label: "Date of birth", type: "date", required: true },
      ],
    },
    {
      id: "company",
      title: "Company Details",
      description: "Provide the UK LTD name you want us to use for registration.",
      fields: [
        {
          key: "preferred_company_name",
          label: "LTD name",
          description: "Enter your preferred private limited company name.",
          type: "text",
          required: true,
          placeholder: "Example Ltd",
          validation: { minLength: 2, maxLength: 150 },
        },
      ],
    },
    {
      id: "contact",
      title: "Contact Information",
      description: "Provide the contact details we should use for your application.",
      fields: [
        {
          key: "email",
          label: "Email address",
          type: "text",
          required: true,
          placeholder: "you@example.com",
        },
        {
          key: "phone",
          label: "Contact number",
          type: "text",
          required: true,
          placeholder: "+44 0000 000000",
        },
      ],
    },
    {
      id: "location",
      title: "Residential Address",
      description: "Provide your current residential address.",
      fields: [
        {
          key: "residential_address",
          label: "Residential address",
          type: "textarea",
          required: true,
          placeholder: "Full residential address",
          validation: { minLength: 5, maxLength: 500 },
        },
        { key: "residential_city", label: "City", type: "text", required: true },
        { key: "residential_state", label: "State / Province", type: "text", required: true },
        { key: "residential_postal_code", label: "Postal code", type: "text", required: true },
        { key: "residential_country", label: "Country", type: "country", required: true },
      ],
    },
    {
      id: "documents",
      title: "Required Documents",
      description: "Upload the documents required from you for the LTD registration application.",
      fields: [],
    },
  ],
};

export const ukDirectorIdVerificationApplication: ApplicationConfig = {
  serviceSlug: "uk-director-id-verification",
  steps: [
    {
      id: "requirements",
      title: "Verification Details",
      description:
        "Provide the director and company information required for UK identity verification.",
      fields: [
        {
          key: "full_legal_name",
          label: "Full legal name",
          type: "text",
          required: true,
          placeholder: "Your full legal name",
          validation: { minLength: 2, maxLength: 150 },
        },
        {
          key: "ltd_name",
          label: "LTD name",
          type: "text",
          required: true,
          placeholder: "Example Ltd",
          validation: { minLength: 2, maxLength: 150 },
        },
        {
          key: "email",
          label: "Email address",
          type: "text",
          required: true,
          placeholder: "you@example.com",
          validation: { format: "email", maxLength: 254 },
        },
        {
          key: "contact_no",
          label: "Contact number",
          type: "text",
          required: true,
          placeholder: "+44 0000 000000",
          validation: { format: "phone", minLength: 7, maxLength: 30 },
        },
        {
          key: "residential_address",
          label: "Residential address",
          type: "textarea",
          required: true,
          placeholder: "Full residential address",
          validation: { minLength: 5, maxLength: 500 },
        },
      ],
    },
    {
      id: "documents",
      title: "Identity Documents",
      description: "Upload your passport and bank statement for the verification review.",
      fields: [],
    },
  ],
};

export const ukAddressApplication: ApplicationConfig = {
  serviceSlug: "uk-address",
  steps: [
    {
      id: "requirements",
      title: "UK Address Details",
      description: "Provide the legal and LTD information required for your UK address service.",
      fields: [
        {
          key: "full_legal_name",
          label: "Full legal name",
          type: "text",
          required: true,
          placeholder: "Your full legal name",
          validation: { minLength: 2, maxLength: 150 },
        },
        {
          key: "ltd_name",
          label: "LTD name",
          type: "text",
          required: true,
          placeholder: "Example Ltd",
          validation: { minLength: 2, maxLength: 150 },
        },
        {
          key: "email",
          label: "Email address",
          type: "text",
          required: true,
          placeholder: "you@example.com",
          validation: { format: "email", maxLength: 254 },
        },
        {
          key: "contact_no",
          label: "Contact number",
          type: "text",
          required: true,
          placeholder: "+44 0000 000000",
          validation: { format: "phone", minLength: 7, maxLength: 30 },
        },
        {
          key: "residential_address",
          label: "Residential address",
          type: "textarea",
          required: true,
          placeholder: "Full residential address",
          validation: { minLength: 5, maxLength: 500 },
        },
      ],
    },
    {
      id: "documents",
      title: "Required Documents",
      description: "Upload your passport and bank statement for the UK address service.",
      fields: [],
    },
  ],
};

export const ukCorporateTaxFilingApplication: ApplicationConfig = {
  serviceSlug: "uk-corporate-tax",
  steps: [
    {
      id: "requirements",
      title: "Contact Information",
      description:
        "Provide your contact and company details so our UK Corporate Tax team can follow up with you about the CT600 filing.",
      fields: [
        {
          key: "full_legal_name",
          label: "Full legal name",
          type: "text",
          required: true,
          placeholder: "Your full legal name",
          validation: { minLength: 2, maxLength: 150 },
        },
        {
          key: "ltd_name",
          label: "LTD name",
          type: "text",
          required: true,
          placeholder: "Example Ltd",
          validation: { minLength: 2, maxLength: 150 },
        },
        {
          key: "email",
          label: "Email address",
          type: "text",
          required: true,
          placeholder: "you@example.com",
          validation: { format: "email", maxLength: 254 },
        },
        {
          key: "contact_no",
          label: "Contact number",
          type: "text",
          required: true,
          placeholder: "+44 0000 000000",
          validation: { format: "phone", minLength: 7, maxLength: 30 },
        },
      ],
    },
  ],
};
