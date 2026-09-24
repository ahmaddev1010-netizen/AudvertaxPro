import type { DocumentDefinition } from "./catalog";

export function resolveDashboardDocument(
  definition: DocumentDefinition,
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
  const matches = applicationDocuments.filter((entry) => {
    const targetId = entry.documentType ?? entry.documentId ?? entry.id ?? "";
    const matchesDocument =
      !targetId || targetId === definition.id || targetId.includes(definition.id);
    const matchesOwner =
      !entry.ownerId || entry.ownerId === "application" || memberIds.includes(entry.ownerId);
    return matchesDocument && matchesOwner;
  });

  const statusEntry = matches[0];
  const resolvedStatus = statusEntry?.status ?? (definition.required ? "required" : "requested");

  return {
    ...definition,
    id: definition.id,
    status: resolvedStatus,
    fileName: statusEntry?.fileName ?? definition.fileName ?? "",
    required: definition.required,
  };
}
