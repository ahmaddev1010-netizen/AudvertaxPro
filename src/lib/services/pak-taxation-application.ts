import type { ApplicationConfig } from "./application-config-types";

const cnicFields = [
  {
    key: "email",
    label: "Email address",
    type: "text" as const,
    required: true,
    validation: { format: "email" as const, maxLength: 254 },
  },
  {
    key: "contact_number",
    label: "Contact number (registered on CNIC)",
    type: "text" as const,
    required: true,
    validation: { format: "phone" as const, minLength: 7, maxLength: 30 },
  },
];

export const pakNtnRegistrationApplication: ApplicationConfig = {
  serviceSlug: "pak-ntn-registration",
  steps: [
    {
      id: "requirements",
      title: "Contact Information",
      description: "Provide the contact information required for your NTN Registration enquiry.",
      fields: cnicFields,
    },
    {
      id: "documents",
      title: "Required Documents",
      description: "Upload the front and back pictures of your CNIC.",
      fields: [],
    },
  ],
};

export const pakBecomeFilerApplication: ApplicationConfig = {
  serviceSlug: "pak-become-filer",
  steps: [
    {
      id: "requirements",
      title: "Filer Information",
      description:
        "Provide the contact and financial information required for your Become Filer enquiry.",
      fields: [
        {
          key: "email",
          label: "Email address",
          type: "text",
          required: true,
          validation: { format: "email", maxLength: 254 },
        },
        {
          key: "contact_number",
          label: "Contact number (registered on CNIC)",
          type: "text",
          required: true,
          validation: { format: "phone", minLength: 7, maxLength: 30 },
        },
        {
          key: "assets_detail",
          label: "Assets detail",
          type: "textarea",
          required: true,
          placeholder: "Write your assets details",
        },
        {
          key: "salary_income_or_business_detail",
          label: "Salary income or business detail",
          type: "textarea",
          required: true,
          placeholder: "Provide your salary income or business details",
        },
      ],
    },
    {
      id: "documents",
      title: "Required Documents",
      description: "Upload your CNIC pictures and bank statement ended 30 June.",
      fields: [],
    },
  ],
};

export const pakSalaryReturnApplication: ApplicationConfig = {
  serviceSlug: "pak-salary-return",
  steps: [
    {
      id: "requirements",
      title: "Return Information",
      description: "Provide the information required for your Salary Return enquiry.",
      fields: [
        { key: "login_detail", label: "Login detail", type: "textarea", required: true },
        { key: "new_assets_detail", label: "New assets detail", type: "textarea", required: true },
        { key: "investment", label: "Investment", type: "textarea", required: true },
        {
          key: "contact_number",
          label: "Contact number",
          type: "text",
          required: true,
          validation: { format: "phone", minLength: 7, maxLength: 30 },
        },
      ],
    },
    {
      id: "documents",
      title: "Required Documents",
      description: "Upload your bank statement to 30 June and salary slip.",
      fields: [],
    },
  ],
};

export const pakBusinessReturnApplication: ApplicationConfig = {
  serviceSlug: "pak-business-return",
  steps: [
    {
      id: "requirements",
      title: "Return Information",
      description: "Provide the information required for your Business Return enquiry.",
      fields: [
        { key: "login_detail", label: "Login detail", type: "textarea", required: true },
        { key: "new_assets_detail", label: "New assets detail", type: "textarea", required: true },
        { key: "investment", label: "Investment", type: "textarea", required: true },
        {
          key: "contact_number",
          label: "Contact number",
          type: "text",
          required: true,
          validation: { format: "phone", minLength: 7, maxLength: 30 },
        },
      ],
    },
    {
      id: "documents",
      title: "Required Documents",
      description: "Upload your bank statement to 30 June.",
      fields: [],
    },
  ],
};

export const pakDnfbpCertificateApplication: ApplicationConfig = {
  serviceSlug: "pak-dnfbp-certificate",
  steps: [
    {
      id: "requirements",
      title: "Certificate Information",
      description: "Provide the information required for your DNFBP Certificate enquiry.",
      fields: [
        { key: "fbr_login_details", label: "FBR login details", type: "textarea", required: true },
        { key: "business_nature", label: "Business nature", type: "textarea", required: true },
        {
          key: "contact_number",
          label: "Contact number",
          type: "text",
          required: true,
          validation: { format: "phone", minLength: 7, maxLength: 30 },
        },
      ],
    },
    {
      id: "documents",
      title: "Required Documents",
      description: "Upload your police character certificate with QR code.",
      fields: [],
    },
  ],
};

export const pakPsebApplication: ApplicationConfig = {
  serviceSlug: "pak-pseb",
  steps: [
    {
      id: "requirements",
      title: "PSEB Information",
      description: "Provide the business and banking information required for your PSEB enquiry.",
      fields: [
        {
          key: "contact_number",
          label: "Contact number (registered on CNIC)",
          type: "text",
          required: true,
          validation: { format: "phone", minLength: 7, maxLength: 30 },
        },
        {
          key: "email",
          label: "Email address",
          type: "text",
          required: true,
          validation: { format: "email", maxLength: 254 },
        },
        { key: "bank_name", label: "Bank name", type: "text", required: true },
        {
          key: "social_media_page_link",
          label: "Social media page link",
          type: "text",
          required: true,
        },
      ],
    },
    {
      id: "documents",
      title: "Required Documents",
      description: "Upload your CNIC pictures and bank maintenance certificate.",
      fields: [],
    },
  ],
};

export const pakPswApplication: ApplicationConfig = {
  serviceSlug: "pak-psw",
  steps: [
    {
      id: "filer-status",
      title: "Filer Status",
      description: "A PSW application can only be completed by a filer.",
      fields: [
        {
          key: "is_filer",
          label: "Are you a filer?",
          type: "radio",
          required: true,
          options: [
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ],
        },
      ],
    },
    {
      id: "requirements",
      title: "PSW Information",
      description: "Provide the business and contact information required for your PSW enquiry.",
      fields: [
        {
          key: "business_registration",
          label: "Business registration",
          type: "textarea",
          required: true,
        },
        {
          key: "email",
          label: "Email address",
          type: "text",
          required: true,
          validation: { format: "email", maxLength: 254 },
        },
        {
          key: "phone_number",
          label: "Phone number",
          type: "text",
          required: true,
          validation: { format: "phone", minLength: 7, maxLength: 30 },
        },
      ],
    },
    {
      id: "documents",
      title: "Required Documents",
      description: "Upload the front and back pictures of your CNIC.",
      fields: [],
    },
  ],
};
