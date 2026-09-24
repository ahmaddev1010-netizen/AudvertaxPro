"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { submitApplication } from "@/lib/api";
import type { FormEvent, ReactNode } from "react";

type FormData = Record<string, string>;

type DocumentReference = {
  id: string;
  file: File;
};

type Member = {
  id: number;
  name: string;
  percentage: string;
  dob: string;
  identityDocument: DocumentReference | null;
  addressDocument: DocumentReference | null;
};

const initialData: FormData = {
  email: "",
  phone: "",
  whatsapp: "",
  company_type: "",
  owner_full_name: "",
  owner_country: "",
  owner_date_of_birth: "",
  owner_ownership_percentage: "",
  residential_address: "",
  residential_city: "",
  residential_state: "",
  residential_postal_code: "",
  residential_country: "",
};

export default function USALLCApplication() {
  const searchParams = useSearchParams();
  const [data, setData] = useState(initialData);
  const [ownerIdentityDocument, setOwnerIdentityDocument] = useState<DocumentReference | null>(
    null,
  );
  const [ownerAddressDocument, setOwnerAddressDocument] = useState<DocumentReference | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [wiseAccountSetup, setWiseAccountSetup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function update(key: string, value: string) {
    setData((current) => ({ ...current, [key]: value }));
  }

  function handleCompanyTypeChange(value: string) {
    setData((current) => ({
      ...current,
      company_type: value,
      owner_ownership_percentage:
        value === "single_member_llc" ? "100" : current.owner_ownership_percentage,
    }));

    if (value === "single_member_llc") {
      setMembers([]);
    }
  }

  function addMember() {
    setMembers((current) => [
      ...current,
      {
        id: Date.now(),
        name: "",
        percentage: "",
        dob: "",
        identityDocument: null,
        addressDocument: null,
      },
    ]);
  }

  function updateMember(
    id: number,
    key: keyof Omit<Member, "id">,
    value: string | DocumentReference | null,
  ) {
    setMembers((current) =>
      current.map((member) => (member.id === id ? { ...member, [key]: value } : member)),
    );
  }

  function removeMember(id: number) {
    setMembers((current) => current.filter((member) => member.id !== id));
  }

  function createDocumentReference(file: File | null): DocumentReference | null {
    return file ? { id: `doc_${crypto.randomUUID()}`, file } : null;
  }

  function fileMetadata(document: DocumentReference | null) {
    if (!document) return null;

    return {
      id: document.id,
      name: document.file.name,
      type: document.file.type,
      size: document.file.size,
    };
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitted(false);

    if (data.company_type === "multi_member_llc") {
      const currentPercentage = [
        data.owner_ownership_percentage,
        ...members.map((member) => member.percentage),
      ].reduce((total, percentage) => total + (Number(percentage) || 0), 0);

      if (currentPercentage !== 100) {
        setSubmitError(`your current percentage is ${currentPercentage}, it should be 100`);
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const formData = new FormData();

      const applicationData = {
        service: "usa-llc",
        data: {
          ...data,
          packageSlug: searchParams.get("package") ?? "",
          formationState: searchParams.get("state") ?? "",
          addOnSlugs: wiseAccountSetup ? ["wise-account-setup"] : [],
          owner_ownership_percentage:
            data.company_type === "single_member_llc" ? "100" : data.owner_ownership_percentage,
          members:
            data.company_type === "single_member_llc"
              ? []
              : members.map(({ id, identityDocument, addressDocument, ...member }) => member),
          optional_services: {
            wise_account_setup: wiseAccountSetup,
          },
        },
        documents: {
          owner: {
            identity_document: fileMetadata(ownerIdentityDocument),
            address_document: fileMetadata(ownerAddressDocument),
          },
          members:
            data.company_type === "single_member_llc"
              ? []
              : members.map(({ identityDocument, addressDocument }) => ({
                  identity_document: fileMetadata(identityDocument),
                  address_document: fileMetadata(addressDocument),
                })),
        },
      };

      formData.append("application", JSON.stringify(applicationData));

      if (ownerIdentityDocument) {
        formData.append("owner_identity_document", ownerIdentityDocument.file);
      }

      if (ownerAddressDocument) {
        formData.append("owner_address_document", ownerAddressDocument.file);
      }

      if (data.company_type === "multi_member_llc") {
        members.forEach(({ identityDocument, addressDocument }, index) => {
          if (identityDocument) {
            formData.append(`member_${index}_identity_document`, identityDocument.file);
          }

          if (addressDocument) {
            formData.append(`member_${index}_address_document`, addressDocument.file);
          }
        });
      }

      await submitApplication(formData);
      setSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to submit your application. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="fm-application-page">
      <div className="fm-application-grid" />
      <div className="fm-application-glow" />

      <div className="fm-application-container">
        <header className="fm-application-page-header">
          <div>
            <div className="max-w-3xl">
              <div className="fm-application-header-badge">
                <span>USA LLC / Application</span>
              </div>
              <h1 className="fm-application-title">Complete your application.</h1>
              <p className="fm-application-description">
                One page. Everything we need to prepare your USA LLC formation is collected below.
              </p>
            </div>
          </div>
        </header>

        <form onSubmit={submit} className="fm-application-form">
          <Section title="Contact information">
            <div className="grid gap-5 md:grid-cols-2">
              <Input
                label="Email address"
                type="email"
                value={data.email}
                onChange={(v) => update("email", v)}
                required
              />
              <Input
                label="Phone number"
                type="tel"
                value={data.phone}
                onChange={(v) => update("phone", v)}
                required
              />
              <Input
                label="WhatsApp number"
                type="tel"
                value={data.whatsapp}
                onChange={(v) => update("whatsapp", v)}
                required
              />
            </div>
          </Section>

          <Section title="Company structure & owner">
            <fieldset>
              <legend className="fm-application-label">Company type</legend>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {[
                  ["single_member_llc", "Single member LLC"],
                  ["multi_member_llc", "Multi member LLC"],
                ].map(([value, label]) => (
                  <label
                    key={value}
                    className="flex cursor-pointer items-center rounded-[var(--fm-radius-md)] border border-[var(--fm-border)] bg-[var(--fm-graphite-deep)] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--fm-lime)_45%,var(--fm-border))] has-[:checked]:border-[var(--fm-lime)] has-[:checked]:bg-[var(--fm-lime-soft)] has-[:checked]:shadow-[0_0_24px_var(--fm-lime-glow)]"
                  >
                    <input
                      required
                      type="radio"
                      name="company_type"
                      value={value}
                      checked={data.company_type === value}
                      onChange={(e) => handleCompanyTypeChange(e.target.value)}
                    />
                    <span className="ml-3 text-sm font-semibold">{label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <Input
                label="Legal full name"
                value={data.owner_full_name}
                onChange={(v) => update("owner_full_name", v)}
                required
              />
              <Input
                label="Country of residence"
                value={data.owner_country}
                onChange={(v) => update("owner_country", v)}
                required
              />
              <Input
                label="Date of birth"
                type="date"
                value={data.owner_date_of_birth}
                onChange={(v) => update("owner_date_of_birth", v)}
                required
              />
              {data.company_type === "single_member_llc" ? (
                <Input
                  label="Ownership percentage"
                  type="number"
                  value="100"
                  onChange={() => {}}
                  required
                />
              ) : (
                <Input
                  label="Ownership percentage"
                  type="number"
                  value={data.owner_ownership_percentage}
                  onChange={(v) => update("owner_ownership_percentage", v)}
                  required
                />
              )}
            </div>
          </Section>

          {data.company_type === "multi_member_llc" && (
            <Section title="LLC members">
              <p className="text-sm leading-6 text-[var(--fm-text-secondary)]">
                Add each additional LLC member and provide their ownership and verification details.
              </p>

              <div className="mt-6 space-y-5">
                {members.map((member, index) => (
                  <div
                    key={member.id}
                    className="rounded-[var(--fm-radius-md)] border border-[var(--fm-border)] bg-[var(--fm-graphite-deep)] p-5 sm:p-6"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-sm font-bold uppercase tracking-[.08em] text-[var(--fm-text-secondary)]">
                        Member {index + 1}
                      </h3>
                      <button
                        type="button"
                        onClick={() => removeMember(member.id)}
                        className="text-xs font-semibold text-[var(--fm-text-tertiary)] transition-colors hover:text-[var(--fm-text-primary)]"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                      <Input
                        label="Full name"
                        value={member.name}
                        onChange={(value) => updateMember(member.id, "name", value)}
                        required
                      />
                      <Input
                        label="Ownership percentage"
                        type="number"
                        value={member.percentage}
                        onChange={(value) => updateMember(member.id, "percentage", value)}
                        required
                      />
                      <Input
                        label="Date of birth"
                        type="date"
                        value={member.dob}
                        onChange={(value) => updateMember(member.id, "dob", value)}
                        required
                      />
                    </div>

                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                      <FileInput
                        label="Identity document"
                        onChange={(file) =>
                          updateMember(member.id, "identityDocument", createDocumentReference(file))
                        }
                      />
                      <FileInput
                        label="Proof of address"
                        onChange={(file) =>
                          updateMember(member.id, "addressDocument", createDocumentReference(file))
                        }
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addMember}
                  className="w-full rounded-[var(--fm-radius-md)] border border-dashed border-[var(--fm-border)] bg-[var(--fm-surface)] px-5 py-4 text-sm font-bold text-[var(--fm-text-primary)] transition-all duration-200 hover:border-[var(--fm-lime)] hover:bg-[var(--fm-lime-soft)]"
                >
                  + Add member
                </button>
              </div>
            </Section>
          )}

          <Section title="Residential address">
            <div className="grid gap-5 md:grid-cols-2">
              <Input
                label="Street address"
                value={data.residential_address}
                onChange={(v) => update("residential_address", v)}
                required
              />
              <Input
                label="City"
                value={data.residential_city}
                onChange={(v) => update("residential_city", v)}
                required
              />
              <Input
                label="State / Province"
                value={data.residential_state}
                onChange={(v) => update("residential_state", v)}
                required
              />
              <Input
                label="Postal code"
                value={data.residential_postal_code}
                onChange={(v) => update("residential_postal_code", v)}
                required
              />
              <Input
                label="Country"
                value={data.residential_country}
                onChange={(v) => update("residential_country", v)}
                required
              />
            </div>
          </Section>

          <Section title="Primary owner identity & address documents">
            <p className="text-sm leading-6 text-[var(--fm-text-secondary)]">
              Upload the required identity and address documents for the primary owner.
            </p>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <FileInput
                label="Identity document"
                onChange={(file) => setOwnerIdentityDocument(createDocumentReference(file))}
              />
              <FileInput
                label="Proof of address"
                onChange={(file) => setOwnerAddressDocument(createDocumentReference(file))}
              />
            </div>
          </Section>

          <Section title="Optional services">
            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                checked={wiseAccountSetup}
                onChange={(e) => setWiseAccountSetup(e.target.checked)}
              />
              <span>Wise Account Setup — $75</span>
            </label>
          </Section>

          {submitError && (
            <div
              role="alert"
              aria-live="assertive"
              className="rounded-[var(--fm-radius-md)] border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200"
            >
              <p className="font-semibold">Application submission failed</p>
              <p className="mt-1">{submitError}</p>
            </div>
          )}
          {submitted && (
            <p className="rounded-[var(--fm-radius-md)] border border-[var(--fm-lime)]/30 bg-[var(--fm-lime-soft)] px-4 py-3 text-sm text-[var(--fm-text-primary)]">
              Application submitted successfully.
            </p>
          )}

          <div className="flex flex-col gap-4 rounded-[var(--fm-radius-feature)] border border-[var(--fm-border)] bg-[var(--fm-surface)] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[.15em] text-[var(--fm-text-tertiary)]">
                Final review
              </p>
              <p className="mt-1 text-sm text-[var(--fm-text-secondary)]">
                Check your information before submitting.
              </p>
            </div>
            <button type="submit" disabled={isSubmitting} className="fm-application-submit">
              {isSubmitting ? "Submitting..." : "Submit USA LLC application"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="fm-application-section">
      <div className="fm-application-section-header">
        <span className="fm-application-section-accent" />
        <h2 className="fm-application-section-title">{title}</h2>
      </div>
      <div className="fm-application-section-content">{children}</div>
    </section>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="fm-application-label">{label}</span>
      <input
        required={required}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="fm-application-input"
      />
    </label>
  );
}

function FileInput({ label, onChange }: { label: string; onChange?: (file: File | null) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      <input
        type="file"
        onChange={(e) => onChange?.(e.target.files?.[0] ?? null)}
        className="fm-application-file"
      />
    </label>
  );
}
