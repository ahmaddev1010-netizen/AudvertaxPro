"use client";

import { useState, type FormEvent } from "react";
import { submitApplication } from "@/lib/api";

type DocumentReference = { id: string; file: File };

export default function UKVATRegistrationApplication() {
  const [data, setData] = useState({
    full_legal_name: "",
    ltd_name: "",
    email: "",
    vat_registration_gateway_id: "",
    vat_registration_gateway_password: "",
    personal_business_email_address: "",
    personal_business_phone_number: "",
    uk_bank_details: "",
  });
  const [companyCertificate, setCompanyCertificate] = useState<DocumentReference | null>(null);
  const [passport, setPassport] = useState<DocumentReference | null>(null);
  const [addressProof, setAddressProof] = useState<DocumentReference | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const update = (key: keyof typeof data, value: string) =>
    setData((current) => ({ ...current, [key]: value }));

  function pickFile(
    event: React.ChangeEvent<HTMLInputElement>,
    setter: (value: DocumentReference | null) => void,
  ) {
    const file = event.target.files?.[0];
    setter(file ? { id: crypto.randomUUID(), file } : null);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitted(false);

    if (
      Object.values(data).some((value) => !value.trim()) ||
      !companyCertificate ||
      !passport ||
      !addressProof
    ) {
      setError("Please complete all required fields and upload all required documents.");
      return;
    }

    setIsSubmitting(true);
    try {
      const documents = {
        company_registration_certificate: {
          id: companyCertificate.id,
          name: companyCertificate.file.name,
          type: companyCertificate.file.type,
          size: companyCertificate.file.size,
        },
        passport: {
          id: passport.id,
          name: passport.file.name,
          type: passport.file.type,
          size: passport.file.size,
        },
        utility_bill_or_bank_statement: {
          id: addressProof.id,
          name: addressProof.file.name,
          type: addressProof.file.type,
          size: addressProof.file.size,
        },
      };

      const formData = new FormData();
      formData.append(
        "application",
        JSON.stringify({
          service: "uk-vat-registration",
          data,
          documents,
        }),
      );
      formData.append(
        "company_registration_certificate",
        companyCertificate.file,
        companyCertificate.id,
      );
      formData.append("passport", passport.file, passport.id);
      formData.append("utility_bill_or_bank_statement", addressProof.file, addressProof.id);

      await submitApplication(formData);
      setSubmitted(true);
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Unable to submit application.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="fm-application-page">
      <div className="fm-application-container">
        <header className="fm-application-page-header">
          <p className="fm-application-header-badge-text">UK taxation</p>
          <h1 className="mt-4 font-display text-fm-hero font-bold tracking-[-.06em] text-[var(--fm-text-primary)]">
            VAT Registration
          </h1>
          <p className="fm-application-description">
            Provide the required company, HMRC gateway, contact, banking and supporting document
            details for your UK VAT registration.
          </p>
        </header>

        <form onSubmit={onSubmit} className="fm-application-form">
          <section className="fm-application-section">
            <h2 className="fm-application-section-title">VAT registration details</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {(
                [
                  ["full_legal_name", "Full legal name", "text"],
                  ["ltd_name", "LTD name", "text"],
                  ["email", "Email address", "email"],
                  ["vat_registration_gateway_id", "VAT Registration Client Gateway ID", "text"],
                  [
                    "vat_registration_gateway_password",
                    "VAT Registration Client Gateway Password",
                    "password",
                  ],
                  ["personal_business_email_address", "Personal & business email address", "email"],
                  ["personal_business_phone_number", "Personal & business phone number", "tel"],
                ] as const
              ).map(([key, label, type]) => (
                <label key={key}>
                  <span className="fm-application-label">{label}</span>
                  <input
                    type={type}
                    value={data[key]}
                    onChange={(event) => update(key, event.target.value)}
                    required
                    className="fm-application-input"
                    autoComplete={type === "password" ? "off" : undefined}
                  />
                </label>
              ))}
              <label className="sm:col-span-2">
                <span className="fm-application-label">UK bank details</span>
                <textarea
                  value={data.uk_bank_details}
                  onChange={(event) => update("uk_bank_details", event.target.value)}
                  required
                  rows={4}
                  className="fm-application-input fm-application-textarea"
                />
              </label>
            </div>
          </section>

          <section className="fm-application-section">
            <h2 className="fm-application-section-title">Required documents</h2>
            <div className="mt-6 grid gap-5">
              {(
                [
                  ["Company registration certificate", companyCertificate, setCompanyCertificate],
                  ["Passport", passport, setPassport],
                  ["Utility bill or bank statement", addressProof, setAddressProof],
                ] as const
              ).map(([label, value, setter]) => (
                <label key={label}>
                  <span className="fm-application-label">{label}</span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    required
                    onChange={(event) => pickFile(event, setter)}
                    className="fm-application-file"
                  />
                  {value && <span className="fm-application-file-hint">{value.file.name}</span>}
                </label>
              ))}
            </div>
          </section>

          {error && <p className="fm-application-error">{error}</p>}
          {submitted && (
            <p className="fm-application-success">Your application has been submitted.</p>
          )}
          <button type="submit" disabled={isSubmitting} className="fm-application-submit">
            {isSubmitting ? "Submitting…" : "Submit application →"}
          </button>
        </form>
      </div>
    </main>
  );
}
