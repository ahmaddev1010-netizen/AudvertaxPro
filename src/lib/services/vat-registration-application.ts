import type { ApplicationConfig, ApplicationField } from "./application-config-types";

const vatGatewayPasswordField = {
  key: "vat_registration_gateway_password",
  label: "VAT Registration Client Gateway Password",
  type: "password",
  required: true,
  placeholder: "Enter your gateway password",
} as unknown as ApplicationField;

export const ukVatRegistrationApplication: ApplicationConfig = {
  serviceSlug: "uk-vat-registration",
  steps: [
    {
      id: "requirements",
      title: "VAT Registration Details",
      description:
        "Provide the company, HMRC gateway, contact and banking details required for your VAT registration application.",
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
          key: "vat_registration_gateway_id",
          label: "VAT Registration Client Gateway ID",
          type: "text",
          required: true,
          placeholder: "Client Gateway ID",
        },
        vatGatewayPasswordField,
        {
          key: "personal_business_email_address",
          label: "Personal & business email address",
          type: "text",
          required: true,
          placeholder: "Personal and business email address",
          validation: { format: "email", maxLength: 254 },
        },
        {
          key: "personal_business_phone_number",
          label: "Personal & business phone number",
          type: "text",
          required: true,
          placeholder: "+44 0000 000000",
          validation: { format: "phone", minLength: 7, maxLength: 30 },
        },
        {
          key: "uk_bank_details",
          label: "UK bank details",
          type: "textarea",
          required: true,
          placeholder: "Enter your UK bank details",
          validation: { minLength: 5, maxLength: 1000 },
        },
      ],
    },
    {
      id: "documents",
      title: "Required Documents",
      description:
        "Upload the company registration certificate, passport, and utility bill or bank statement.",
      fields: [],
    },
  ],
};
