import type { DocumentVisibilityCondition } from "../application/conditions";

export type DocumentCategory = "required" | "formation" | "tax" | "identity" | "support";
export type DocumentOwnerScope = "application" | "member";

export type DocumentDefinition = {
  id: string;
  name: string;
  description: string;
  category: DocumentCategory;
  ownerScope: DocumentOwnerScope;
  required: boolean;
  visibleWhen?: DocumentVisibilityCondition;
  fileName?: string;
};

/** Document requirements and visibility rules live here, not inside UI components. */
export const documentCatalog: Record<string, DocumentDefinition[]> = {
  "usa-llc": [
    {
      id: "member-identity",
      name: "Passport or CNIC",
      description: "A clear copy of the passport or CNIC for each company member/owner.",
      category: "identity",
      required: true,
      ownerScope: "member",
    },
    {
      id: "member-address-proof",
      name: "Bank statement or utility bill",
      description:
        "A recent bank statement or utility bill for each company member/owner as address proof.",
      category: "identity",
      required: true,
      ownerScope: "member",
    },
    {
      id: "articles-of-organization",
      name: "Articles of Organization",
      description:
        "Upload the formation document when it is already available or requested for the application.",
      category: "formation",
      required: false,
      ownerScope: "application",
    },
    {
      id: "operating-agreement",
      name: "Operating Agreement",
      description: "Company operating agreement when applicable to the selected service.",
      category: "formation",
      required: false,
      ownerScope: "application",
    },
    {
      id: "ein-confirmation",
      name: "EIN Confirmation Letter",
      description: "Federal EIN confirmation document when applicable.",
      category: "tax",
      required: false,
      ownerScope: "application",
    },
  ],
  "uk-ltd": [
    {
      id: "passport",
      name: "Passport",
      description: "Upload a clear copy of the director's passport for identity verification.",
      category: "identity",
      required: true,
      ownerScope: "application",
    },
    {
      id: "bank-statement",
      name: "Bank statement",
      description: "Upload a recent bank statement as supporting address documentation.",
      category: "identity",
      required: true,
      ownerScope: "application",
    },
  ],
  "itin-processing": [
    {
      id: "applicant-identity",
      name: "Scanned passport",
      description: "A clear scanned copy of the applicant's passport.",
      category: "identity",
      required: true,
      ownerScope: "application",
    },
    {
      id: "articles-of-organization",
      name: "Articles of Organization",
      description: "Upload your Articles of Organization if they are available.",
      category: "formation",
      required: false,
      ownerScope: "application",
      visibleWhen: { answerKey: "articles_available", equals: "yes" },
    },
    {
      id: "ein-form",
      name: "EIN form",
      description: "Upload the EIN form if it is available for your ITIN application.",
      category: "tax",
      required: false,
      ownerScope: "application",
      visibleWhen: { answerKey: "ein_form_available", equals: "yes" },
    },
  ],
  "ein-without-ssn": [
    {
      id: "articles-of-organization",
      name: "Articles of Organization",
      description:
        "Upload the Articles of Organization when this is the formation document you selected.",
      category: "formation",
      required: true,
      ownerScope: "application",
      visibleWhen: { answerKey: "formation_document_type", equals: "articles" },
    },
    {
      id: "ss4",
      name: "SS-4",
      description: "Upload the SS-4 when this is the EIN document you selected.",
      category: "tax",
      required: true,
      ownerScope: "application",
      visibleWhen: { answerKey: "formation_document_type", equals: "ss4" },
    },
  ],
  "uk-director-id-verification": [
    {
      id: "passport",
      name: "Passport",
      description: "Upload a clear copy of the director's passport for identity verification.",
      category: "identity",
      required: true,
      ownerScope: "application",
    },
    {
      id: "bank-statement",
      name: "Bank statement",
      description: "Upload a recent bank statement for the director identity verification review.",
      category: "identity",
      required: true,
      ownerScope: "application",
    },
  ],
  "uk-address": [
    {
      id: "passport",
      name: "Passport",
      description: "Upload a clear copy of your passport for the UK address service application.",
      category: "identity",
      required: true,
      ownerScope: "application",
    },
    {
      id: "bank-statement",
      name: "Bank statement",
      description: "Upload a recent bank statement for the UK address service application.",
      category: "identity",
      required: true,
      ownerScope: "application",
    },
  ],
  "uk-vat-registration": [
    {
      id: "company-registration-certificate",
      name: "Company registration certificate",
      description: "Upload the company's registration certificate.",
      category: "formation",
      required: true,
      ownerScope: "application",
    },
    {
      id: "passport",
      name: "Passport",
      description: "Upload a clear copy of the applicant's passport.",
      category: "identity",
      required: true,
      ownerScope: "application",
    },
    {
      id: "utility-bill-or-bank-statement",
      name: "Utility bill or bank statement",
      description:
        "Upload a recent utility bill or bank statement as supporting address documentation.",
      category: "identity",
      required: true,
      ownerScope: "application",
    },
  ],
  "pak-sole-business-registration": [
    {
      id: "pak-sole-cnic-front",
      name: "CNIC — Front",
      description: "Upload the front side of the applicant's CNIC.",
      category: "identity",
      required: true,
      ownerScope: "application",
    },
    {
      id: "pak-sole-cnic-back",
      name: "CNIC — Back",
      description: "Upload the back side of the applicant's CNIC.",
      category: "identity",
      required: true,
      ownerScope: "application",
    },
  ],
  "pak-private-company-registration": [
    {
      id: "pak-private-owner-cnic-front",
      name: "Owner CNIC — Front",
      description: "Upload the front side of the owner's CNIC.",
      category: "identity",
      required: true,
      ownerScope: "application",
    },
    {
      id: "pak-private-owner-cnic-back",
      name: "Owner CNIC — Back",
      description: "Upload the back side of the owner's CNIC.",
      category: "identity",
      required: true,
      ownerScope: "application",
    },
    {
      id: "pak-private-director-cnic-front",
      name: "Director CNIC — Front",
      description: "Upload the front side of the director's CNIC.",
      category: "identity",
      required: true,
      ownerScope: "application",
    },
    {
      id: "pak-private-director-cnic-back",
      name: "Director CNIC — Back",
      description: "Upload the back side of the director's CNIC.",
      category: "identity",
      required: true,
      ownerScope: "application",
    },
  ],
  "pak-llp-registration": [
    {
      id: "pak-llp-owner-cnic-front",
      name: "Owner CNIC — Front",
      description: "Upload the front side of the owner's CNIC.",
      category: "identity",
      required: true,
      ownerScope: "application",
    },
    {
      id: "pak-llp-owner-cnic-back",
      name: "Owner CNIC — Back",
      description: "Upload the back side of the owner's CNIC.",
      category: "identity",
      required: true,
      ownerScope: "application",
    },
    {
      id: "pak-llp-director-cnic-front",
      name: "Director CNIC — Front",
      description: "Upload the front side of the director's CNIC.",
      category: "identity",
      required: true,
      ownerScope: "application",
    },
    {
      id: "pak-llp-director-cnic-back",
      name: "Director CNIC — Back",
      description: "Upload the back side of the director's CNIC.",
      category: "identity",
      required: true,
      ownerScope: "application",
    },
  ],
  "pak-ntn-registration": [
    {
      id: "pak-ntn-cnic-front",
      name: "CNIC — Front",
      description: "Upload the front side of the applicant's CNIC.",
      category: "identity",
      required: true,
      ownerScope: "application",
    },
    {
      id: "pak-ntn-cnic-back",
      name: "CNIC — Back",
      description: "Upload the back side of the applicant's CNIC.",
      category: "identity",
      required: true,
      ownerScope: "application",
    },
  ],
  "pak-become-filer": [
    {
      id: "pak-filer-cnic-front",
      name: "CNIC — Front",
      description: "Upload the front side of the applicant's CNIC.",
      category: "identity",
      required: true,
      ownerScope: "application",
    },
    {
      id: "pak-filer-cnic-back",
      name: "CNIC — Back",
      description: "Upload the back side of the applicant's CNIC.",
      category: "identity",
      required: true,
      ownerScope: "application",
    },
    {
      id: "pak-filer-bank-statement",
      name: "Bank statement ended 30 June",
      description: "Upload the bank statement ending 30 June.",
      category: "tax",
      required: true,
      ownerScope: "application",
    },
  ],
  "pak-salary-return": [
    {
      id: "pak-salary-bank-statement",
      name: "Bank statement to 30 June",
      description: "Upload the bank statement to 30 June.",
      category: "tax",
      required: true,
      ownerScope: "application",
    },
    {
      id: "pak-salary-slip",
      name: "Salary slip",
      description: "Upload the relevant salary slip.",
      category: "tax",
      required: true,
      ownerScope: "application",
    },
  ],
  "pak-business-return": [
    {
      id: "pak-business-bank-statement",
      name: "Bank statement to 30 June",
      description: "Upload the bank statement to 30 June.",
      category: "tax",
      required: true,
      ownerScope: "application",
    },
  ],
  "pak-dnfbp-certificate": [
    {
      id: "pak-dnfbp-police-character-certificate",
      name: "Police character certificate (QR Code)",
      description: "Upload the police character certificate containing its QR code.",
      category: "required",
      required: true,
      ownerScope: "application",
    },
  ],
  "pak-pseb": [
    {
      id: "pak-pseb-cnic-front",
      name: "CNIC — Front",
      description: "Upload the front side of the applicant's CNIC.",
      category: "identity",
      required: true,
      ownerScope: "application",
    },
    {
      id: "pak-pseb-cnic-back",
      name: "CNIC — Back",
      description: "Upload the back side of the applicant's CNIC.",
      category: "identity",
      required: true,
      ownerScope: "application",
    },
    {
      id: "pak-pseb-bank-maintenance-certificate",
      name: "Bank maintenance certificate",
      description: "Upload the bank maintenance certificate.",
      category: "required",
      required: true,
      ownerScope: "application",
    },
  ],
  "pak-psw": [
    {
      id: "pak-psw-cnic-front",
      name: "CNIC — Front",
      description: "Upload the front side of the applicant's CNIC.",
      category: "identity",
      required: true,
      ownerScope: "application",
    },
    {
      id: "pak-psw-cnic-back",
      name: "CNIC — Back",
      description: "Upload the back side of the applicant's CNIC.",
      category: "identity",
      required: true,
      ownerScope: "application",
    },
  ],
};

export function getDocumentsForService(serviceSlug: string): DocumentDefinition[] {
  return documentCatalog[serviceSlug] ?? [];
}
