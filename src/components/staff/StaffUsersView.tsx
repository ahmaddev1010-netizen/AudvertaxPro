"use client";

import { useEffect, useState } from "react";
import { Download, Upload, Users } from "lucide-react";
import {
  getStaffApplication,
  getStaffApplications,
  getStaffUsers,
  updateStaffApplicationStatus,
  uploadStaffDocument,
  type AdminApplicationDetail,
  type AdminApplicationRecord,
  type AdminUserRecord,
  type ApplicationDocument,
} from "@/lib/api";

function formatDate(value?: string) {
  return value
    ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(value))
    : "Never";
}

function formatBytes(value?: number) {
  if (typeof value !== "number") return "Unknown size";
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function FullName({ user }: { user: { firstName: string; lastName: string } }) {
  return <span>{`${user.firstName} ${user.lastName}`.trim() || "Unnamed user"}</span>;
}

function readableKey(key: string) {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function ApplicationData({ value }: { value: unknown }) {
  if (Array.isArray(value)) {
    return (
      <div className="space-y-2">
        {value.map((item, index) => (
          <div key={index} className="rounded-fm-sm border border-fm-border-soft p-2">
            <ApplicationData value={item} />
          </div>
        ))}
      </div>
    );
  }

  if (value && typeof value === "object") {
    return (
      <div className="divide-y divide-fm-border-soft rounded-fm-md border border-fm-border-soft">
        {Object.entries(value as Record<string, unknown>).map(([key, item]) => (
          <div key={key} className="grid gap-1 p-3 sm:grid-cols-[180px_1fr] sm:gap-4">
            <p className="text-xs font-semibold text-fm-text-secondary">{readableKey(key)}</p>
            <div className="min-w-0 break-words text-sm text-fm-text-primary">
              {item && typeof item === "object" ? <ApplicationData value={item} /> : String(item ?? "-")}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return <span>{String(value ?? "-")}</span>;
}

function Panel({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="rounded-fm-xl border border-fm-border-soft bg-fm-surface p-5 shadow-[0_12px_40px_rgba(0,0,0,0.12)] md:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-fm-text-secondary">{description}</p>
      </div>
      {children}
    </section>
  );
}

function documentsFromApplicationData(application: AdminApplicationDetail["application"]): ApplicationDocument[] {
  const root = application.data?.documents;
  function collect(value: unknown, defaultRole = "customer", category = "customer"): ApplicationDocument[] {
    if (Array.isArray(value)) return value.flatMap((item) => collect(item, defaultRole, category));
    if (!value || typeof value !== "object") return [];
    const item = value as Record<string, unknown>;
    const hasFile = typeof item.path === "string" && (typeof item.id === "string" || typeof item.name === "string" || typeof item.type === "string");
    const current = hasFile ? [{
      id: typeof item.id === "string" ? item.id : undefined,
      path: typeof item.path === "string" ? item.path : undefined,
      url: typeof item.url === "string" ? item.url : null,
      name: typeof item.name === "string" ? item.name : undefined,
      documentName: typeof item.documentName === "string" ? item.documentName : typeof item.name === "string" ? item.name : undefined,
      size: typeof item.size === "number" ? item.size : undefined,
      type: typeof item.type === "string" ? item.type : undefined,
      uploadedAt: typeof item.uploadedAt === "string" ? item.uploadedAt : undefined,
      uploadedBy: typeof item.uploadedByName === "string" ? item.uploadedByName : undefined,
      uploadedByRole: typeof item.uploadedByRole === "string" ? item.uploadedByRole : defaultRole,
      category,
    }] : [];
    if (hasFile) return current;
    return Object.entries(item).flatMap(([key, child]) => {
      const normalizedKey = key.toLowerCase();
      const nextRole = normalizedKey.includes("staff") ? "staff" : normalizedKey.includes("admin") ? "admin" : "customer";
      const nextCategory = normalizedKey.includes("staff") ? "staff" : normalizedKey.includes("admin") ? "admin" : normalizedKey.includes("owner") ? "owner" : normalizedKey.includes("member") ? "member" : category;
      return collect(child, nextRole, nextCategory);
    });
  }
  return collect(root);
}

function DocumentCard({ title, documents }: { title: string; documents: ApplicationDocument[] }) {
  return (
    <section className="rounded-fm-md border border-fm-border-soft bg-fm-surface p-3">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="fm-label">{title}</p>
        <span className="text-xs text-fm-text-tertiary">{documents.length} file{documents.length === 1 ? "" : "s"}</span>
      </div>
      {documents.length ? documents.map((document, index) => {
        const name = document.documentName ?? document.name ?? document.path?.split("/").pop() ?? "Uploaded document";
        const uploadedBy = typeof document.uploadedBy === "object" ? document.uploadedBy.name ?? document.uploadedBy.email : document.uploadedByName ?? document.uploadedBy;
        const uploader = document.uploadedByName ?? document.uploadedByRole ?? document.uploaderRole ?? document.role ?? uploadedBy ?? document.source ?? "Customer upload";
        return (
          <a key={`${document.path ?? document.url ?? "document"}-${index}`} href={document.url ?? "#"} target="_blank" rel="noreferrer" className="mb-2 block rounded-fm-md border border-fm-border-soft px-3 py-2.5 last:mb-0 hover:border-fm-lime">
            <span className="flex items-center justify-between gap-3 text-sm text-fm-text-primary"><span className="truncate">{name}</span><Download size={14} className="shrink-0 text-fm-text-secondary" /></span>
            <span className="mt-1 block text-xs text-fm-text-tertiary">Uploaded by: {uploader}</span>
            <span className="mt-2 grid gap-x-4 gap-y-1 border-t border-fm-border-soft pt-2 text-[11px] text-fm-text-tertiary sm:grid-cols-2">
              <span>Document ID: {document.id ?? "-"}</span>
              <span>Role: {document.uploadedByRole ?? document.role ?? "-"}</span>
              <span>Type: {document.type ?? "-"}</span>
              <span>Size: {formatBytes(document.size)}</span>
              <span>Uploaded: {document.uploadedAt ? formatDate(document.uploadedAt) : "-"}</span>
              <span className="truncate">Path: {document.path ?? "-"}</span>
            </span>
          </a>
        );
      }) : <p className="text-xs text-fm-text-secondary">No documents uploaded.</p>}
    </section>
  );
}

export function StaffUsersView() {
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [staffApplications, setStaffApplications] = useState<AdminApplicationRecord[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUserRecord | null>(null);
  const [applications, setApplications] = useState<AdminApplicationDetail[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [expandedApplicationId, setExpandedApplicationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getStaffUsers(), getStaffApplications()])
      .then(([userResponse, applicationResponse]) => {
        setUsers(userResponse.data.users);
        setStaffApplications(applicationResponse.data.applications);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load paid customers."))
      .finally(() => setLoading(false));
  }, []);

  async function uploadDocument(applicationId: string, file: File | undefined) {
    if (!file) return;
    setUploading(applicationId);
    setError("");
    try {
      const response = await uploadStaffDocument(applicationId, file);
      setApplications((current) => current.map((item) => item.application.id === applicationId
        ? { ...item, signedDocuments: [...item.signedDocuments, { ...response.data, documentName: file.name, uploadedByRole: "staff", source: "Staff upload", uploadedBy: "staff" }] }
        : item));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to upload document.");
    } finally {
      setUploading(null);
    }
  }

  async function selectUser(user: AdminUserRecord) {
    setSelectedUser(user);
    setApplications([]);
    setExpandedApplicationId(null);
    setLoadingApplications(true);
    setError("");
    try {
      const applicationIds = staffApplications.filter((application) => application?.customer?.id === user.id).map((application) => application.id);
      const details = await Promise.all((applicationIds.length ? applicationIds : user.applicationIds ?? []).map((applicationId) => getStaffApplication(applicationId)));
      setApplications(details.map((response) => {
        const detail = response.data;
        const allDocuments = [...detail.signedDocuments, ...documentsFromApplicationData(detail.application)];
        const mergedDocuments = Array.from(allDocuments.reduce((documents, document) => {
          const key = document.path ?? document.id ?? document.documentName ?? document.name ?? `document-${documents.size}`;
          documents.set(key, { ...(documents.get(key) ?? {}), ...document });
          return documents;
        }, new Map<string, ApplicationDocument>()).values());
        return { ...detail, signedDocuments: mergedDocuments };
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load application details.");
    } finally {
      setLoadingApplications(false);
    }
  }

  async function changeStatus(application: AdminApplicationDetail["application"], status: "processing" | "completed" | "cancelled") {
    setUpdatingStatus(application.id);
    setError("");
    try {
      const response = await updateStaffApplicationStatus(application.id, status, application.updatedAt);
      setApplications((current) => current.map((item) => item.application.id === application.id ? { ...item, application: { ...item.application, ...response.data.application } } : item));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update application status.");
    } finally {
      setUpdatingStatus(null);
    }
  }

  return (
    <Panel title="Paid customers" description="You can view paid customers and upload their application documents.">
      {error && <p className="mb-4 text-sm text-fm-danger">{error}</p>}
      {loading ? <p className="py-8 text-sm text-fm-text-secondary">Loading paid customers...</p> : !users.length ? <p className="py-8 text-sm text-fm-text-secondary">No paid customers yet.</p> : selectedUser ? (
        <div>
          <button type="button" onClick={() => setSelectedUser(null)} className="mb-4 text-sm font-semibold text-fm-text-secondary hover:text-fm-text-primary">← Back to paid customers</button>
          <div className="mb-5"><p className="text-lg font-semibold"><FullName user={selectedUser} /></p><p className="text-sm text-fm-text-secondary">{selectedUser.email}</p></div>
          {loadingApplications ? <p className="py-8 text-sm text-fm-text-secondary">Loading applications...</p> : !applications.length ? <p className="py-8 text-sm text-fm-text-secondary">No application details returned.</p> : <div className="space-y-3">
            {applications.map(({ application, signedDocuments }) => (
              <div key={application.id} className="rounded-fm-md border border-fm-border-soft bg-fm-surface p-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button type="button" onClick={() => setExpandedApplicationId((current) => current === application.id ? null : application.id)} className="min-w-0 flex-1 text-left"><p className="text-sm font-semibold">{application.serviceSlug ?? application.service}</p><p className="mt-1 text-xs text-fm-text-secondary">Submitted {formatDate(application.createdAt)} · {application.status ?? "Submitted"}</p></button>
                  <select value={application.status ?? "processing"} disabled={updatingStatus === application.id} onChange={(event) => void changeStatus(application, event.target.value as "processing" | "completed" | "cancelled")} className="h-9 rounded-fm-md border border-fm-border bg-fm-surface px-2 text-xs font-medium capitalize outline-none focus:border-fm-lime disabled:opacity-60">{(["processing", "completed", "cancelled"] as const).map((status) => <option key={status} value={status}>{status}</option>)}</select>
                  <label className="inline-flex cursor-pointer items-center rounded-fm-md border border-dashed border-fm-border px-3 py-2 text-xs font-semibold text-fm-text-secondary hover:border-fm-lime hover:text-fm-lime">{uploading === application.id ? "Uploading..." : "Upload document"}<input type="file" accept=".pdf,.jpg,.jpeg,.png" disabled={uploading === application.id} onChange={(event) => { void uploadDocument(application.id, event.target.files?.[0]); event.currentTarget.value = ""; }} className="sr-only" /></label>
                </div>
                {expandedApplicationId === application.id && <div className="mt-4 space-y-4 border-t border-fm-border-soft pt-4"><div><p className="fm-label mb-2">Application details</p><ApplicationData value={application.data} /></div><div><p className="fm-label mb-2">Documents</p><div className="grid gap-3 lg:grid-cols-2">{(["owner", "member", "staff", "admin", "customer"] as const).map((category) => { const documents = signedDocuments.filter((document) => (document.category ?? (document.uploadedByRole === "staff" ? "staff" : document.uploadedByRole === "admin" ? "admin" : "customer")) === category); return documents.length ? <DocumentCard key={category} title={`${category.charAt(0).toUpperCase()}${category.slice(1)} documents`} documents={documents} /> : null; })}</div></div></div>}
              </div>
            ))}
          </div>}
        </div>
      ) : users.map((user) => <button key={user.id} type="button" onClick={() => void selectUser(user)} className="flex w-full items-center justify-between gap-4 border-b border-fm-border-soft py-4 text-left last:border-b-0 hover:bg-fm-surface-raised"><span className="flex min-w-0 items-center gap-3"><Users size={18} className="shrink-0 text-fm-lime" /><span className="min-w-0"><span className="block truncate text-sm font-semibold"><FullName user={user} /></span><span className="block truncate text-xs text-fm-text-secondary">{user.email}</span></span></span><span className="text-xs text-fm-text-secondary">{user.paidApplicationsCount} paid application{user.paidApplicationsCount === 1 ? "" : "s"}</span></button>)}
    </Panel>
  );
}
