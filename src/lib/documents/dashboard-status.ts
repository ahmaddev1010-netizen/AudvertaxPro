import type { DocumentDefinition } from "./catalog";

export function resolveDashboardDocumentStatus(
  document: DocumentDefinition,
  applicationDocuments: Array<{
    id?: string;
    documentType?: string;
    status?: string;
    fileName?: string;
    documentId?: string;
    ownerId?: string;
  }>,
  memberIds: string[],
): "required" | "uploaded" | "approved" | "requested" | "pending" {
  if (!applicationDocuments?.length) {
    return document.required ? "required" : "pending";
  }

  const matches = applicationDocuments.filter((entry) => {
    const targetId = entry.documentType ?? entry.documentId ?? entry.id ?? "";
    const matchesDocument = !targetId || targetId === document.id || targetId.includes(document.id);
    const matchesOwner =
      !entry.ownerId || memberIds.includes(entry.ownerId) || entry.ownerId === "application";
    return matchesDocument && matchesOwner;
  });

  if (!matches.length) {
    return document.required ? "required" : "pending";
  }

  const status = matches[0]?.status ?? "uploaded";
  if (status === "approved") return "approved";
  if (status === "uploaded") return "uploaded";
  if (status === "requested") return "requested";
  return document.required ? "required" : "pending";
}

export function hasRequiredDashboardDocumentsPending(
  documents: DocumentDefinition[],
  applicationDocuments: Array<{
    id?: string;
    documentType?: string;
    status?: string;
    fileName?: string;
    documentId?: string;
    ownerId?: string;
  }>,
  memberIds: string[],
) {
  return documents.some(
    (document) =>
      document.required &&
      resolveDashboardDocumentStatus(document, applicationDocuments, memberIds) !== "approved" &&
      resolveDashboardDocumentStatus(document, applicationDocuments, memberIds) !== "uploaded",
  );
}
