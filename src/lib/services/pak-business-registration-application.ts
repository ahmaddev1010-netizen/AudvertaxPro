import type { ApplicationConfig } from "./application-config-types";

export const pakSoleBusinessRegistrationApplication: ApplicationConfig = {
  serviceSlug: "pak-sole-business-registration",
  steps: [
    {
      id: "requirements",
      title: "Business Registration Details",
      description: "Provide the details required for your sole business registration.",
      fields: [
        {
          key: "phone",
          label: "Phone number",
          description: "Use the phone number registered on your CNIC.",
          type: "text",
          required: true,
          placeholder: "03XX XXXXXXX",
          validation: { format: "phone", minLength: 7, maxLength: 30 },
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
          key: "business_name",
          label: "Name of business",
          type: "text",
          required: true,
          placeholder: "Your business name",
          validation: { minLength: 2, maxLength: 150 },
        },
        {
          key: "business_nature",
          label: "Nature of business",
          type: "textarea",
          required: true,
          placeholder: "Describe the nature of your business.",
          validation: { minLength: 2, maxLength: 1000 },
        },
        {
          key: "office_address",
          label: "Office address",
          type: "textarea",
          required: true,
          placeholder: "Full office address",
          validation: { minLength: 5, maxLength: 500 },
        },
      ],
    },
    {
      id: "documents",
      title: "CNIC Documents",
      description: "Upload the front and back of your CNIC.",
      fields: [],
    },
  ],
};

export const pakPrivateCompanyRegistrationApplication: ApplicationConfig = {
  serviceSlug: "pak-private-company-registration",
  steps: [
    {
      id: "requirements",
      title: "Company Registration Details",
      description:
        "Provide the company, contact and address details required for private company registration.",
      fields: [
        {
          key: "phone",
          label: "Phone number",
          description: "Use the phone number registered on your CNIC.",
          type: "text",
          required: true,
          placeholder: "03XX XXXXXXX",
          validation: { format: "phone", minLength: 7, maxLength: 30 },
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
          key: "company_name",
          label: "Name of company",
          type: "text",
          required: true,
          placeholder: "Your company name",
          validation: { minLength: 2, maxLength: 150 },
        },
        {
          key: "business_nature",
          label: "Nature of business",
          type: "textarea",
          required: true,
          placeholder: "Describe the nature of your business.",
          validation: { minLength: 2, maxLength: 1000 },
        },
        {
          key: "company_address",
          label: "Company address",
          type: "textarea",
          required: true,
          placeholder: "Full company address",
          validation: { minLength: 5, maxLength: 500 },
        },
      ],
    },
    {
      id: "documents",
      title: "Owner & Director CNIC Documents",
      description: "Upload the front and back of the CNIC for the owner and director.",
      fields: [],
    },
  ],
};

export const pakLlpRegistrationApplication: ApplicationConfig = {
  serviceSlug: "pak-llp-registration",
  steps: [
    {
      id: "requirements",
      title: "LLP Registration Details",
      description:
        "Provide the company, contact and address details required for LLP registration.",
      fields: [
        {
          key: "phone",
          label: "Phone number",
          description: "Use the phone number registered on your CNIC.",
          type: "text",
          required: true,
          placeholder: "03XX XXXXXXX",
          validation: { format: "phone", minLength: 7, maxLength: 30 },
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
          key: "company_name",
          label: "Name of company",
          type: "text",
          required: true,
          placeholder: "Your LLP name",
          validation: { minLength: 2, maxLength: 150 },
        },
        {
          key: "business_nature",
          label: "Nature of business",
          type: "textarea",
          required: true,
          placeholder: "Describe the nature of your business.",
          validation: { minLength: 2, maxLength: 1000 },
        },
        {
          key: "company_address",
          label: "Company address",
          type: "textarea",
          required: true,
          placeholder: "Full company address",
          validation: { minLength: 5, maxLength: 500 },
        },
      ],
    },
    {
      id: "documents",
      title: "Owner & Director CNIC Documents",
      description: "Upload the front and back of the CNIC for the owner and director.",
      fields: [],
    },
  ],
};
