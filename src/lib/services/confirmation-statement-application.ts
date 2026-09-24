import type { ApplicationConfig, ApplicationField } from "./application-config-types";

const companiesHousePasswordField = {
  key: "companies_house_login_password",
  label: "Companies House login password",
  type: "password",
  required: true,
  placeholder: "Companies House login password",
} as unknown as ApplicationField;

export const ukConfirmationStatementApplication: ApplicationConfig = {
  serviceSlug: "uk-confirmation-statement",
  steps: [
    {
      id: "requirements",
      title: "Confirmation Statement Requirements",
      description:
        "Provide the company and Companies House details required for your confirmation statement filing.",
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
          key: "companies_house_login_email",
          label: "Companies House login email",
          type: "text",
          required: true,
          placeholder: "Companies House login email",
          validation: { format: "email", maxLength: 254 },
        },
        companiesHousePasswordField,
        {
          key: "director_personal_code",
          label: "Director personal code",
          type: "text",
          required: true,
          placeholder: "Director personal code",
        },
        {
          key: "ltd_address",
          label: "LTD address",
          type: "textarea",
          required: true,
          placeholder: "Full LTD registered address",
          validation: { minLength: 5, maxLength: 500 },
        },
      ],
    },
  ],
};
