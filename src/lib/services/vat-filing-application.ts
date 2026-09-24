import type { ApplicationConfig } from "./application-config-types";

export const ukVatFilingApplication: ApplicationConfig = {
  serviceSlug: "uk-vat-filing",
  steps: [
    {
      id: "requirements",
      title: "Contact Information",
      description:
        "Provide your company and contact details so our VAT filing team can follow up with you.",
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
