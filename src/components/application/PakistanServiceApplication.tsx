"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { submitApplication } from "@/lib/api";

type ServiceKey =
  | "pak-sole-business-registration"
  | "pak-private-company-registration"
  | "pak-llp-registration"
  | "pak-ntn-registration"
  | "pak-become-filer"
  | "pak-salary-return"
  | "pak-business-return"
  | "pak-dnfbp-certificate"
  | "pak-pseb"
  | "pak-psw";
type Field = { key: string; label: string; type?: "text" | "textarea"; placeholder?: string };

const services: Record<
  ServiceKey,
  {
    title: string;
    price: number;
    description: string;
    fields: Field[];
    documents: { key: string; label: string }[];
  }
> = {
  "pak-sole-business-registration": {
    title: "Sole Business Registration",
    price: 1500,
    description:
      "Register a sole business in Pakistan with the required business, contact and CNIC details.",
    fields: [
      { key: "phone", label: "Phone number", placeholder: "03XX XXXXXXX" },
      { key: "email", label: "Email address", placeholder: "you@example.com" },
      { key: "business_name", label: "Name of business", placeholder: "Your business name" },
      {
        key: "business_nature",
        label: "Nature of business",
        type: "textarea",
        placeholder: "Describe the nature of your business.",
      },
      {
        key: "office_address",
        label: "Office address",
        type: "textarea",
        placeholder: "Full office address",
      },
    ],
    documents: [
      { key: "cnic_front", label: "CNIC — Front" },
      { key: "cnic_back", label: "CNIC — Back" },
    ],
  },
  "pak-private-company-registration": {
    title: "Private Company Registration",
    price: 5000,
    description:
      "Register a private company in Pakistan with the required company, contact and address details.",
    fields: [
      { key: "phone", label: "Phone number", placeholder: "03XX XXXXXXX" },
      { key: "email", label: "Email address", placeholder: "you@example.com" },
      { key: "company_name", label: "Name of company", placeholder: "Your company name" },
      {
        key: "business_nature",
        label: "Nature of business",
        type: "textarea",
        placeholder: "Describe the nature of your business.",
      },
      {
        key: "company_address",
        label: "Company address",
        type: "textarea",
        placeholder: "Full company address",
      },
    ],
    documents: [
      { key: "owner_cnic_front", label: "Owner CNIC — Front" },
      { key: "owner_cnic_back", label: "Owner CNIC — Back" },
      { key: "director_cnic_front", label: "Director CNIC — Front" },
      { key: "director_cnic_back", label: "Director CNIC — Back" },
    ],
  },
  "pak-llp-registration": {
    title: "LLP Registration",
    price: 20000,
    description: "Register an LLP in Pakistan with the required company, contact and CNIC details.",
    fields: [
      { key: "phone", label: "Phone number", placeholder: "03XX XXXXXXX" },
      { key: "email", label: "Email address", placeholder: "you@example.com" },
      { key: "company_name", label: "Name of company", placeholder: "Your LLP name" },
      {
        key: "business_nature",
        label: "Nature of business",
        type: "textarea",
        placeholder: "Describe the nature of your business.",
      },
      {
        key: "company_address",
        label: "Company address",
        type: "textarea",
        placeholder: "Full company address",
      },
    ],
    documents: [
      { key: "owner_cnic_front", label: "Owner CNIC — Front" },
      { key: "owner_cnic_back", label: "Owner CNIC — Back" },
      { key: "director_cnic_front", label: "Director CNIC — Front" },
      { key: "director_cnic_back", label: "Director CNIC — Back" },
    ],
  },
  "pak-ntn-registration": {
    title: "NTN Registration",
    price: 500,
    description:
      "Provide the contact information and CNIC documents required for your NTN Registration enquiry.",
    fields: [
      { key: "email", label: "Email address", placeholder: "you@example.com" },
      {
        key: "contact_number",
        label: "Contact number (registered on CNIC)",
        placeholder: "03XX XXXXXXX",
      },
    ],
    documents: [
      { key: "cnic_front", label: "CNIC — Front" },
      { key: "cnic_back", label: "CNIC — Back" },
    ],
  },
  "pak-become-filer": {
    title: "Become Filer",
    price: 2000,
    description:
      "Provide the contact and financial information required for your Become Filer enquiry.",
    fields: [
      { key: "email", label: "Email address", placeholder: "you@example.com" },
      {
        key: "contact_number",
        label: "Contact number (registered on CNIC)",
        placeholder: "03XX XXXXXXX",
      },
      {
        key: "assets_detail",
        label: "Assets detail",
        type: "textarea",
        placeholder: "Write your assets details",
      },
      {
        key: "salary_income_or_business_detail",
        label: "Salary income or business detail",
        type: "textarea",
        placeholder: "Provide your salary income or business details",
      },
    ],
    documents: [
      { key: "cnic_front", label: "CNIC — Front" },
      { key: "cnic_back", label: "CNIC — Back" },
      { key: "bank_statement", label: "Bank statement ended 30 June" },
    ],
  },
  "pak-salary-return": {
    title: "Salary Return",
    price: 1500,
    description:
      "Provide the information and supporting documents required for your Salary Return enquiry.",
    fields: [
      { key: "login_detail", label: "Login detail", type: "textarea" },
      { key: "new_assets_detail", label: "New assets detail", type: "textarea" },
      { key: "investment", label: "Investment", type: "textarea" },
      { key: "contact_number", label: "Contact number", placeholder: "03XX XXXXXXX" },
    ],
    documents: [
      { key: "bank_statement", label: "Bank statement to 30 June" },
      { key: "salary_slip", label: "Salary slip" },
    ],
  },
  "pak-business-return": {
    title: "Business Return",
    price: 2500,
    description:
      "Provide the information and supporting documents required for your Business Return enquiry.",
    fields: [
      { key: "login_detail", label: "Login detail", type: "textarea" },
      { key: "new_assets_detail", label: "New assets detail", type: "textarea" },
      { key: "investment", label: "Investment", type: "textarea" },
      { key: "contact_number", label: "Contact number", placeholder: "03XX XXXXXXX" },
    ],
    documents: [{ key: "bank_statement", label: "Bank statement to 30 June" }],
  },
  "pak-dnfbp-certificate": {
    title: "DNFBP Certificate",
    price: 10000,
    description:
      "Provide the FBR and business information required for your DNFBP Certificate enquiry.",
    fields: [
      { key: "fbr_login_details", label: "FBR login details", type: "textarea" },
      { key: "business_nature", label: "Business nature", type: "textarea" },
      { key: "contact_number", label: "Contact number", placeholder: "03XX XXXXXXX" },
    ],
    documents: [
      { key: "police_character_certificate", label: "Police character certificate (QR Code)" },
    ],
  },
  "pak-pseb": {
    title: "PSEB Registration",
    price: 5000,
    description: "Provide the business and banking information required for your PSEB enquiry.",
    fields: [
      {
        key: "contact_number",
        label: "Contact number (registered on CNIC)",
        placeholder: "03XX XXXXXXX",
      },
      { key: "email", label: "Email address", placeholder: "you@example.com" },
      { key: "bank_name", label: "Bank name" },
      { key: "social_media_page_link", label: "Social media page link" },
    ],
    documents: [
      { key: "cnic_front", label: "CNIC — Front" },
      { key: "cnic_back", label: "CNIC — Back" },
      { key: "bank_maintenance_certificate", label: "Bank maintenance certificate" },
    ],
  },
  "pak-psw": {
    title: "PSW Registration",
    price: 5000,
    description:
      "Provide the information required for Pakistan Single Window registration. You must be a filer.",
    fields: [
      { key: "business_registration", label: "Business registration", type: "textarea" },
      { key: "email", label: "Email address", placeholder: "you@example.com" },
      { key: "phone_number", label: "Phone number", placeholder: "03XX XXXXXXX" },
    ],
    documents: [
      { key: "cnic_front", label: "CNIC — Front" },
      { key: "cnic_back", label: "CNIC — Back" },
    ],
  },
};

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[var(--fm-border)] bg-[var(--fm-surface)] p-6 sm:p-8">
      <div className="mb-7 border-l-4 border-[var(--fm-lime)] pl-4">
        <h2 className="text-2xl font-bold tracking-[-.03em] text-[var(--fm-text-primary)]">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--fm-text-secondary)]">{description}</p>
      </div>
      {children}
    </section>
  );
}
function FieldInput({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: string;
  onChange: (value: string) => void;
}) {
  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    onChange(event.target.value);
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[var(--fm-text-primary)]">
        {field.label}
      </span>
      {field.type === "textarea" ? (
        <textarea
          value={value}
          required
          placeholder={field.placeholder}
          onChange={handleChange}
          className="min-h-32 w-full rounded-xl border border-[var(--fm-border)] bg-[var(--fm-graphite-deep)] p-4 text-base text-[var(--fm-text-primary)] outline-none transition focus:border-[var(--fm-lime)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--fm-lime)_28%,transparent)]"
        />
      ) : (
        <input
          type={field.key.includes("email") ? "email" : "text"}
          value={value}
          required
          placeholder={field.placeholder}
          onChange={handleChange}
          className="h-14 w-full rounded-xl border border-[var(--fm-border)] bg-[var(--fm-graphite-deep)] px-4 text-base text-[var(--fm-text-primary)] outline-none transition focus:border-[var(--fm-lime)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--fm-lime)_28%,transparent)]"
        />
      )}
    </label>
  );
}
function FileInput({ label, onChange }: { label: string; onChange: (file: File | null) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[var(--fm-text-primary)]">
        {label}
      </span>
      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        required
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
        className="w-full rounded-xl border border-dashed border-[var(--fm-border)] bg-[var(--fm-graphite-deep)] p-4 text-sm text-[var(--fm-text-secondary)] file:mr-4 file:rounded-lg file:border-0 file:bg-[var(--fm-lime)] file:px-4 file:py-2 file:font-semibold file:text-[var(--fm-graphite-deep)]"
      />
    </label>
  );
}

export default function PakistanServiceApplication() {
  const pathname = usePathname();
  const service = pathname.split("/").filter(Boolean)[0] as ServiceKey;
  const config = services[service] ?? services["pak-sole-business-registration"];
  const [data, setData] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isFiler, setIsFiler] = useState("");
  const update = (key: string, value: string) =>
    setData((current) => ({ ...current, [key]: value }));

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (service === "pak-psw" && isFiler !== "yes") {
      setError("PSW registration requires filer status. Please select Yes.");
      return;
    }

    const formData = new FormData();
    const applicationDocuments: Record<string, unknown> = {};
    for (const document of config.documents) {
      const file = files[document.key];
      if (!file) {
        setError("Please upload " + document.label + ".");
        return;
      }
      const id = crypto.randomUUID();
      applicationDocuments[document.key] = {
        id,
        name: file.name,
        type: file.type,
        size: file.size,
      };
      formData.append("application_" + document.key, file);
    }
    formData.append(
      "application",
      JSON.stringify({
        service,
        data: {
          ...data,
          price: config.price,
          application_mode: "contact",
          ...(service === "pak-psw" ? { is_filer: isFiler } : {}),
        },
        documents: { application: applicationDocuments },
      }),
    );
    try {
      await submitApplication(formData);
      setSubmitted(true);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Application submission failed.",
      );
    }
  }

  if (submitted)
    return (
      <main className="fm-application-page">
        <div className="fm-application-container">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[var(--fm-lime)] text-xl font-black text-[var(--fm-graphite-deep)]">
            ✓
          </div>
          <p className="mt-6 font-mono text-xs font-bold uppercase tracking-[.16em] text-[var(--fm-lime-bright)]">
            Application received
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-[-.04em]">
            Your {config.title} application is submitted.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[var(--fm-text-secondary)]">
            We have received your information and supporting documents for review.
          </p>
          <Link
            href={"/" + service}
            className="fm-page-action fm-page-action--outline mt-8 inline-flex"
          >
            Back to service <ArrowRight className="size-4" />
          </Link>
        </div>
      </main>
    );

  return (
    <main className="fm-application-page">
      <div className="fm-application-container">
        <div className="fm-application-page-header">
          <Link
            href={"/" + service}
            className="font-mono text-[11px] font-bold uppercase tracking-[.08em] text-[var(--fm-lime)]"
          >
            ← Back to service
          </Link>
          <div className="mt-8 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[.16em] text-[var(--fm-lime-bright)]">
                Pakistan / Application
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-[-.045em] sm:text-5xl">
                {config.title}
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--fm-text-secondary)]">
                {config.description}
              </p>
            </div>
            <div className="rounded-xl border border-[var(--fm-border)] bg-[var(--fm-surface)] px-5 py-4 text-right">
              <span className="block text-xs uppercase tracking-wider text-[var(--fm-text-tertiary)]">
                Service fee
              </span>
              <strong className="mt-1 block text-3xl">PKR {config.price.toLocaleString()}</strong>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="fm-application-form">
          {service === "pak-psw" && (
            <Section
              title="Filer Status"
              description="PSW registration can only be completed by a filer."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--fm-border)] bg-[var(--fm-graphite-deep)] p-4 text-sm">
                  <input
                    type="radio"
                    name="is_filer"
                    value="yes"
                    checked={isFiler === "yes"}
                    onChange={() => setIsFiler("yes")}
                    required
                  />
                  <span>Yes, I am a filer</span>
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--fm-border)] bg-[var(--fm-graphite-deep)] p-4 text-sm">
                  <input
                    type="radio"
                    name="is_filer"
                    value="no"
                    checked={isFiler === "no"}
                    onChange={() => setIsFiler("no")}
                    required
                  />
                  <span>No, I am not a filer</span>
                </label>
              </div>
            </Section>
          )}
          <Section
            title="Required Information"
            description="Provide the information required for this service."
          >
            <div className="grid gap-5 sm:grid-cols-2">
              {config.fields.map((field) => (
                <FieldInput
                  key={field.key}
                  field={field}
                  value={data[field.key] ?? ""}
                  onChange={(value) => update(field.key, value)}
                />
              ))}
            </div>
          </Section>
          <Section
            title="Required Documents"
            description="Upload the supporting documents listed for this service."
          >
            <div className="space-y-5">
              {config.documents.map((document) => (
                <FileInput
                  key={document.key}
                  label={document.label}
                  onChange={(file) => setFiles((current) => ({ ...current, [document.key]: file }))}
                />
              ))}
            </div>
          </Section>
          {error && (
            <p className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[var(--fm-lime)] px-6 text-base font-bold text-[var(--fm-graphite-deep)] transition hover:bg-[var(--fm-lime-bright)]"
          >
            Submit {config.title} application <ArrowUpRight className="size-4" />
          </button>
        </form>
      </div>
    </main>
  );
}
