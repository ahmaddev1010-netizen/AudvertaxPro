"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  KeyRound,
  ChevronRight,
  Download,
  Loader2,
  Plus,
  ShieldCheck,
  Trash2,
  Upload,
  UserRound,
  Users,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  createAdminStaff,
  getAdminApplications,
  getAdminApplication,
  getAdminStaff,
  getAdminUsers,
  getStaffUsers,
  removeAdminStaff,
  updateAdminPassword,
  updateAdminPaymentStatus,
  uploadAdminDocument,
  uploadStaffDocument,
  type AdminApplicationRecord,
  type AdminPaymentState,
  type AdminStaffRecord,
  type AdminUserRecord,
} from "@/lib/api";

function formatDate(value?: string) {
  return value ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(value)) : "Never";
}

function FullName({ user }: { user: { firstName: string; lastName: string } }) {
  return <span>{`${user.firstName} ${user.lastName}`.trim() || "Unnamed user"}</span>;
}

function normalizeStaff(value: unknown): AdminStaffRecord[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const record = item as Partial<AdminStaffRecord>;
    if (typeof record.id !== "string") return [];
    return [
      {
        ...record,
        id: record.id,
        email: typeof record.email === "string" ? record.email : "Unknown email",
        firstName: typeof record.firstName === "string" ? record.firstName : "",
        lastName: typeof record.lastName === "string" ? record.lastName : "",
        role: "staff",
      } as AdminStaffRecord,
    ];
  });
}

function hasSubmittedService(user: AdminUserRecord) {
  if (typeof user.applicationsCount === "number") return user.applicationsCount > 0;
  if (Array.isArray(user.applicationIds)) return user.applicationIds.length > 0;
  if (Array.isArray(user.applications)) return user.applications.length > 0;
  return true;
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
              {item && typeof item === "object" ? (
                <ApplicationData value={item} />
              ) : (
                String(item ?? "-")
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return <span>{String(value ?? "-")}</span>;
}

function DocumentUploadDialog({
  options,
  documentName,
  file,
  submitting,
  onNameChange,
  onFileChange,
  onSubmit,
  onClose,
}: {
  options: string[];
  documentName: string;
  file: File | null;
  submitting: boolean;
  onNameChange: (value: string) => void;
  onFileChange: (file: File | null) => void;
  onSubmit: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-[460px] rounded-fm-xl border border-fm-border bg-fm-surface p-6 shadow-fm-elevated">
        <div className="flex items-start justify-between gap-4">
          <div><p className="fm-label">Application document</p><h2 className="mt-1 text-xl font-semibold">Upload document</h2></div>
          <button type="button" onClick={onClose} className="text-sm font-semibold text-fm-text-secondary hover:text-fm-text-primary">Close</button>
        </div>
        <label className="mt-6 block text-sm font-semibold">
          Document name
          <select value={documentName} onChange={(event) => onNameChange(event.target.value)} className="mt-2 h-11 w-full rounded-fm-md border border-fm-border bg-fm-graphite-deep px-3 text-sm outline-none focus:border-fm-lime">
            {options.map((option) => <option key={option} value={option}>{readableKey(option)}</option>)}
          </select>
        </label>
        <label className="mt-4 block text-sm font-semibold">
          Select file
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(event) => onFileChange(event.target.files?.[0] ?? null)} className="mt-2 w-full rounded-fm-md border border-dashed border-fm-border bg-fm-graphite-deep p-3 text-sm text-fm-text-secondary file:mr-3 file:rounded-fm-sm file:border-0 file:bg-fm-lime file:px-3 file:py-2 file:font-semibold file:text-fm-graphite-deep" />
        </label>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="h-10 rounded-fm-md border border-fm-border px-4 text-sm font-semibold text-fm-text-secondary">Cancel</button>
          <button type="button" disabled={!file || submitting} onClick={onSubmit} className="inline-flex h-10 items-center rounded-fm-md bg-fm-lime px-4 text-sm font-semibold text-fm-graphite-deep disabled:cursor-not-allowed disabled:opacity-50">{submitting ? "Uploading..." : "Upload document"}</button>
        </div>
      </div>
    </div>
  );
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

function UserCard({
  user,
  applicationCount,
  onClick,
  onPaymentChange,
}: {
  user: AdminUserRecord;
  applicationCount: number;
  onClick: () => void;
  onPaymentChange: (user: AdminUserRecord, status: AdminPaymentState) => Promise<void>;
}) {
  const paymentStatus = user.paymentStatus ?? (user.paidApplicationsCount > 0 ? "paid" : "pending");
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") onClick();
      }}
      className="cursor-pointer rounded-fm-lg border border-fm-border-soft bg-fm-graphite-deep/40 p-4 text-left transition hover:-translate-y-px hover:border-fm-lime/50 hover:bg-fm-surface-raised"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-fm-lime-soft text-sm font-bold text-fm-lime">
            {user.firstName?.slice(0, 1).toUpperCase() || "U"}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold"><FullName user={user} /></p>
            <p className="truncate text-xs text-fm-text-secondary">{user.email}</p>
          </div>
        </div>
        <ChevronRight size={18} className="shrink-0 text-fm-text-tertiary" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-fm-text-secondary">
        <div><p className="fm-label">Services</p><p className="mt-1 text-sm text-fm-text-primary">{applicationCount} submitted</p></div>
        <div><p className="fm-label">Last activity</p><p className="mt-1 text-sm text-fm-text-primary">{formatDate(user.latestApplicationAt)}</p></div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-fm-border-soft pt-3" onClick={(event) => event.stopPropagation()}>
        <span className="text-xs text-fm-text-secondary">{user.paidApplicationsCount} paid application{user.paidApplicationsCount === 1 ? "" : "s"}</span>
        <select
          value={paymentStatus}
          onChange={(event) => void onPaymentChange(user, event.target.value as AdminPaymentState)}
          className="h-9 rounded-fm-md border border-fm-border bg-fm-surface px-2 text-xs outline-none focus:border-fm-lime"
        >
          <option value="pending">Payment pending</option>
          <option value="paid">Payment received</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>
    </div>
  );
}

export function AdminUsersView() {
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [applications, setApplications] = useState<AdminApplicationRecord[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUserRecord | null>(null);
  const [uploadingApplication, setUploadingApplication] = useState<string | null>(null);
  const [expandedApplicationId, setExpandedApplicationId] = useState<string | null>(null);
  const [applicationDocuments, setApplicationDocuments] = useState<Record<string, Array<{ path: string; url: string | null }>>>({});
  const [loadingDocuments, setLoadingDocuments] = useState<string | null>(null);
  const [uploadTarget, setUploadTarget] = useState<{ applicationId: string; options: string[] } | null>(null);
  const [uploadDocumentName, setUploadDocumentName] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadUsers() {
    setLoading(true);
    try {
      const [userResponse, applicationResponse] = await Promise.all([getAdminUsers(), getAdminApplications()]);
      setUsers(userResponse.data.users.filter(hasSubmittedService));
      setApplications(applicationResponse.data.applications);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load users.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    Promise.all([getAdminUsers(), getAdminApplications()])
      .then(([userResponse, applicationResponse]) => {
        setUsers(userResponse.data.users.filter(hasSubmittedService));
        setApplications(applicationResponse.data.applications);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load users."))
      .finally(() => setLoading(false));
  }, []);

  async function changePaymentStatus(user: AdminUserRecord, status: AdminPaymentState) {
    try {
      const response = await updateAdminPaymentStatus(user.id, status);
      setUsers((current) => current.map((item) => (item.id === user.id ? response.data.user : item)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update payment status.");
    }
  }

  async function uploadDocument() {
    if (!uploadTarget || !uploadFile) return;
    setUploadingApplication(uploadTarget.applicationId);
    setError("");
    try {
      const response = await uploadAdminDocument(uploadTarget.applicationId, uploadFile, uploadDocumentName);
      setApplicationDocuments((current) => ({
        ...current,
        [uploadTarget.applicationId]: [
          ...(current[uploadTarget.applicationId] ?? []),
          response.data,
        ],
      }));
      setUploadTarget(null);
      setUploadFile(null);
      setUploadDocumentName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to upload document.");
    } finally {
      setUploadingApplication(null);
    }
  }

  async function toggleApplication(applicationId: string) {
    if (expandedApplicationId === applicationId) {
      setExpandedApplicationId(null);
      return;
    }
    setExpandedApplicationId(applicationId);
    if (applicationDocuments[applicationId]) return;
    setLoadingDocuments(applicationId);
    try {
      const response = await getAdminApplication(applicationId);
      setApplicationDocuments((current) => ({
        ...current,
        [applicationId]: response.data.signedDocuments,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load uploaded documents.");
    } finally {
      setLoadingDocuments(null);
    }
  }

  const selectedApplications = selectedUser
    ? applications.filter((application) => application.customer?.id === selectedUser.id)
    : [];

  return (
    <Panel title="Service users" description="Users who have submitted at least one service application.">
      {error && <p className="mb-4 rounded-fm-md border border-fm-danger/30 bg-fm-danger/5 p-3 text-sm text-fm-danger">{error}</p>}
      {loading ? (
        <p className="py-8 text-center text-sm text-fm-text-secondary">Loading users...</p>
      ) : !users.length ? (
        <p className="py-8 text-center text-sm text-fm-text-secondary">No users have submitted a service yet.</p>
      ) : (
        selectedUser ? (
          <div className="rounded-fm-lg border border-fm-lime/30 bg-fm-lime/5 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-fm-text-secondary hover:text-fm-text-primary"
                >
                  <ArrowLeft size={15} /> Back to users
                </button>
                <p className="fm-label">User details</p>
                <h3 className="mt-1 text-lg font-semibold"><FullName user={selectedUser} /></h3>
                <p className="text-sm text-fm-text-secondary">{selectedUser.email}</p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {selectedApplications.length ? selectedApplications.map((application) => (
                  <div key={application.id} className="rounded-fm-md border border-fm-border-soft bg-fm-surface p-3">
                    <button
                      type="button"
                      onClick={() => void toggleApplication(application.id)}
                      className="flex w-full flex-wrap items-center justify-between gap-3 text-left"
                    >
                    <div>
                      <p className="text-sm font-semibold">{application.serviceSlug ?? application.service}</p>
                      <p className="mt-1 text-xs text-fm-text-secondary">Submitted {formatDate(application.createdAt)}</p>
                    </div>
                      <span className="flex items-center gap-2">
                        <span className="rounded-full border border-fm-border px-2.5 py-1 text-xs font-medium">{application.status?.replaceAll("_", " ") ?? "Submitted"}</span>
                        <span className="text-lg text-fm-text-tertiary">{expandedApplicationId === application.id ? "−" : "+"}</span>
                      </span>
                    </button>
                    {expandedApplicationId === application.id && (
                      <div className="mt-4 border-t border-fm-border-soft pt-4">
                        <p className="fm-label mb-2">Uploaded documents</p>
                        {loadingDocuments === application.id ? (
                          <p className="mb-3 text-xs text-fm-text-secondary">Loading documents...</p>
                        ) : applicationDocuments[application.id]?.length ? (
                          <div className="mb-4 space-y-2">
                            {applicationDocuments[application.id].map((document) => (
                              <a
                                key={document.path}
                                href={document.url ?? "#"}
                                download
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-between rounded-fm-md border border-fm-border-soft px-3 py-2 text-xs text-fm-text-secondary hover:border-fm-lime hover:text-fm-lime"
                              >
                                <span className="truncate">{document.path.split("/").pop()}</span>
                                <Download size={14} />
                              </a>
                            ))}
                          </div>
                        ) : (
                          <p className="mb-3 text-xs text-fm-text-secondary">No uploaded documents.</p>
                        )}
                        <p className="fm-label mb-2">Complete application details</p>
                        <ApplicationData value={application.data} />
                        <button
                          type="button"
                          onClick={() => {
                            const options = Object.keys(application.documents ?? {}).length
                              ? Object.keys(application.documents)
                              : ["other"];
                            setUploadTarget({ applicationId: application.id, options });
                            setUploadDocumentName(options[0]);
                            setUploadFile(null);
                          }}
                          className="mt-3 inline-flex items-center gap-2 rounded-fm-md border border-dashed border-fm-border px-3 py-2 text-xs font-semibold text-fm-text-secondary hover:border-fm-lime hover:text-fm-lime"
                        >
                          <Upload size={14} />
                          Upload document
                        </button>
                      </div>
                    )}
                </div>
              )) : <p className="text-sm text-fm-text-secondary">No application details returned for this user.</p>}
            </div>
          </div>
        ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {users.map((user) => {
              const applicationCount = applications.filter((application) => application.customer?.id === user.id).length || user.applicationsCount;
              return <UserCard key={user.id} user={user} applicationCount={applicationCount} onClick={() => setSelectedUser(user)} onPaymentChange={changePaymentStatus} />;
            })}
          </div>
        </>
        )
      )}
      {uploadTarget && (
        <DocumentUploadDialog
          options={uploadTarget.options}
          documentName={uploadDocumentName}
          file={uploadFile}
          submitting={uploadingApplication === uploadTarget.applicationId}
          onNameChange={setUploadDocumentName}
          onFileChange={setUploadFile}
          onSubmit={() => void uploadDocument()}
          onClose={() => {
            setUploadTarget(null);
            setUploadFile(null);
          }}
        />
      )}
    </Panel>
  );
}

export function StaffManagementView() {
  const [staff, setStaff] = useState<AdminStaffRecord[]>([]);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadStaff = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const response = await getAdminStaff();
      setStaff(normalizeStaff(response.data?.staff));
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load staff.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    getAdminStaff()
      .then((response) => {
        if (!active) return;
        setStaff(normalizeStaff(response.data?.staff));
        setError("");
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : "Unable to load staff.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function addStaff(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await createAdminStaff(form);
      await loadStaff(false);
      setForm({ firstName: "", lastName: "", email: "", password: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create staff account.");
    } finally {
      setSubmitting(false);
    }
  }

  async function removeStaff(staffMember: AdminStaffRecord) {
    if (removingId) return;
    if (!window.confirm(`Remove ${staffMember.email} from staff?`)) return;
    setRemovingId(staffMember.id);
    setError("");
    try {
      await removeAdminStaff(staffMember.id);
      await loadStaff(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to remove staff account.");
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <div className="space-y-5">
      <Panel title="Add employee" description="Create a staff account manually. Staff can only access paid users and upload documents.">
        <form onSubmit={addStaff} className="grid gap-3 md:grid-cols-2">
          {(["firstName", "lastName", "email", "password"] as const).map((field) => (
            <input
              key={field}
              required
              type={field === "email" ? "email" : field === "password" ? "password" : "text"}
              value={form[field]}
              onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))}
              placeholder={field === "firstName" ? "First name" : field === "lastName" ? "Last name" : field === "email" ? "Employee email" : "Temporary password"}
              className="h-10 rounded-fm-md border border-fm-border bg-fm-graphite-deep px-3 text-sm outline-none placeholder:text-fm-text-tertiary focus:border-fm-lime"
            />
          ))}
          <button type="submit" disabled={submitting} className="inline-flex h-10 items-center justify-center gap-2 rounded-fm-md bg-fm-lime px-4 text-sm font-semibold text-fm-graphite-deep disabled:opacity-60 md:col-span-2 md:justify-self-start">
            {submitting ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
            {submitting ? "Creating..." : "Add employee"}
          </button>
        </form>
        {error && <p className="mt-3 text-sm text-fm-danger">{error}</p>}
      </Panel>

      <Panel title="Current staff" description="Only administrators can add or remove employee accounts.">
        {loading ? <p className="py-6 text-sm text-fm-text-secondary">Loading staff...</p> : !staff.length ? <p className="py-6 text-sm text-fm-text-secondary">No staff accounts yet.</p> : staff.map((member) => (
          <div key={member.id} className="flex items-center justify-between gap-4 border-b border-fm-border-soft py-4 last:border-b-0">
            <div className="flex min-w-0 items-center gap-3"><UserRound size={18} className="shrink-0 text-fm-lime" /><div className="min-w-0"><p className="truncate text-sm font-semibold"><FullName user={member} /></p><p className="truncate text-xs text-fm-text-secondary">{member.email}</p></div></div>
            <button type="button" disabled={removingId !== null} onClick={() => void removeStaff(member)} className="inline-flex items-center gap-1.5 rounded-fm-md border border-fm-danger/30 px-3 py-2 text-xs font-semibold text-fm-danger hover:bg-fm-danger/10 disabled:cursor-not-allowed disabled:opacity-50"><Trash2 size={14} /> {removingId === member.id ? "Removing..." : "Remove"}</button>
          </div>
        ))}
      </Panel>
    </div>
  );
}

export function AdminSecurityView() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  async function updatePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const response = await updateAdminPassword(currentPassword, newPassword);
      setMessage(response.data.message || "Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update password.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Panel title="Security settings" description="Your admin email is fixed. You can update your password at any time.">
      <div className="mb-5 flex items-center gap-3 rounded-fm-md border border-fm-border-soft bg-fm-graphite-deep p-4"><ShieldCheck size={20} className="text-fm-lime" /><div><p className="text-sm font-semibold">{user?.email}</p><p className="text-xs text-fm-text-secondary">Admin email cannot be changed</p></div></div>
      <form onSubmit={updatePassword} className="max-w-md space-y-4">
        <input required type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} placeholder="Current password" className="h-11 w-full rounded-fm-md border border-fm-border bg-fm-graphite-deep px-3 text-sm outline-none focus:border-fm-lime" />
        <input required minLength={8} type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder="New password (8+ characters)" className="h-11 w-full rounded-fm-md border border-fm-border bg-fm-graphite-deep px-3 text-sm outline-none focus:border-fm-lime" />
        {error && <p className="text-sm text-fm-danger">{error}</p>}
        {message && <p className="text-sm text-fm-success">{message}</p>}
        <button type="submit" disabled={saving} className="inline-flex h-10 items-center gap-2 rounded-fm-md bg-fm-lime px-4 text-sm font-semibold text-fm-graphite-deep disabled:opacity-60"><KeyRound size={15} />{saving ? "Updating..." : "Update password"}</button>
      </form>
    </Panel>
  );
}

export function StaffUsersView() {
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    getStaffUsers().then((response) => setUsers(response.data.users)).catch((err) => setError(err instanceof Error ? err.message : "Unable to load paid users.")).finally(() => setLoading(false));
  }, []);

  async function uploadDocument(applicationId: string, file: File | undefined) {
    if (!file) return;
    setUploading(applicationId);
    setError("");
    try {
      await uploadStaffDocument(applicationId, file);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to upload document.");
    } finally {
      setUploading(null);
    }
  }

  return (
    <Panel title="Paid customers" description="You can view paid customers and upload their application documents.">
      {error && <p className="mb-4 text-sm text-fm-danger">{error}</p>}
      {loading ? <p className="py-8 text-sm text-fm-text-secondary">Loading paid customers...</p> : !users.length ? <p className="py-8 text-sm text-fm-text-secondary">No paid customers yet.</p> : users.map((user) => <div key={user.id} className="border-b border-fm-border-soft py-4 last:border-b-0"><div className="flex items-center justify-between gap-4"><div className="flex min-w-0 items-center gap-3"><Users size={18} className="shrink-0 text-fm-lime" /><div className="min-w-0"><p className="truncate text-sm font-semibold"><FullName user={user} /></p><p className="truncate text-xs text-fm-text-secondary">{user.email}</p></div></div><span className="text-xs text-fm-text-secondary">{user.paidApplicationsCount} paid application{user.paidApplicationsCount === 1 ? "" : "s"}</span></div>{user.applicationIds?.map((applicationId) => <label key={applicationId} className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-fm-md border border-dashed border-fm-border px-3 py-2 text-xs font-semibold text-fm-text-secondary hover:border-fm-lime hover:text-fm-lime"><span>Upload for {applicationId.slice(0, 10)}</span><input type="file" accept=".pdf,.jpg,.jpeg,.png" disabled={uploading === applicationId} onChange={(event) => { void uploadDocument(applicationId, event.target.files?.[0]); event.currentTarget.value = ""; }} className="sr-only" /></label>)}</div>)}
    </Panel>
  );
}
