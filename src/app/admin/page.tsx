"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  FileText,
  Mail,
  Menu,
  MessageCircle,
  Settings,
  X,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  getAdminApplication,
  getAdminApplications,
  updateAdminApplicationStatus,
  type AdminApplicationDetail,
} from "@/lib/api";

const adminStatuses = ["processing", "completed", "cancelled"] as const;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(
    new Date(value),
  );
}
function displayStatus(status: string) {
  return status.replaceAll("_", " ").replace(/\b\w/g, (m) => m.toUpperCase());
}
function countryOf(app: any) {
  const data = app.data ?? {};
  return String(
    data.country ?? data.countryName ?? data.formationState ?? data.jurisdiction ?? "—",
  );
}

function humanizeKey(key: string) {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function formatValue(value: unknown): string | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value) || typeof value === "object") return null;
  return String(value);
}

function MembersPanel({ members }: { members: unknown }) {
  if (!Array.isArray(members) || !members.length) return null;
  return (
    <div className="rounded-fm-lg border border-fm-border overflow-hidden">
      <div className="border-b border-fm-border bg-fm-surface-raised p-4">
        <p className="fm-label">LLC members</p>
      </div>
      <div className="divide-y divide-fm-border-soft">
        {members.map((member, index) => {
          const item =
            member && typeof member === "object" ? (member as Record<string, unknown>) : {};
          return (
            <div key={String(item.id ?? index)} className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-semibold">
                  Member {index + 1}: {String(item.name ?? "Unnamed member")}
                </p>
                <span className="rounded-full border border-fm-border px-2.5 py-1 text-xs font-medium">
                  {String(item.percentage ?? "0")}% ownership
                </span>
              </div>
              <p className="mt-3 text-sm text-fm-text-secondary">
                Date of birth:{" "}
                <span className="text-fm-text-primary">{String(item.dob ?? "—")}</span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ReadableData({ value, skipKeys = [] }: { value: unknown; skipKeys?: string[] }) {
  if (Array.isArray(value)) {
    return (
      <div className="divide-y divide-fm-border-soft">
        {value.map((item, index) => (
          <div key={index} className="p-4">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-fm-text-tertiary">
              Item {index + 1}
            </p>
            <ReadableData value={item} />
          </div>
        ))}
      </div>
    );
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).filter(
      ([key]) => !skipKeys.includes(key),
    );
    return (
      <div className="divide-y divide-fm-border-soft">
        {entries.map(([key, item]) => {
          const scalar = formatValue(item);
          return (
            <div
              key={key}
              className="grid gap-1 p-4 sm:grid-cols-[minmax(150px,0.7fr)_1fr] sm:gap-5"
            >
              <p className="text-xs font-semibold text-fm-text-secondary">{humanizeKey(key)}</p>
              <div className="min-w-0 text-sm text-fm-text-primary">
                {scalar !== null ? (
                  <p className="break-words whitespace-pre-wrap">{scalar}</p>
                ) : (
                  <div className="overflow-hidden rounded-fm-md border border-fm-border-soft bg-fm-graphite-deep">
                    <ReadableData value={item} skipKeys={skipKeys} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return <p className="p-4 text-sm">{formatValue(value) ?? "—"}</p>;
}

export default function AdminPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [apps, setApps] = useState<any[]>([]);
  const [selected, setSelected] = useState<AdminApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [sort, setSort] = useState<"recent" | "old">("recent");

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role !== "admin") {
      router.replace("/dashboard");
      return;
    }
    getAdminApplications()
      .then((response) =>
        setApps(
          response.data.applications.map((app) => ({
            ...app,
            serviceSlug: app.serviceSlug ?? app.service,
          })),
        ),
      )
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load applications."))
      .finally(() => setLoading(false));
  }, [authLoading, router, user]);

  const services = useMemo(() => [...new Set(apps.map((app) => app.serviceSlug))].sort(), [apps]);
  const countries = useMemo(
    () => [...new Set(apps.map(countryOf))].filter((x) => x !== "—").sort(),
    [apps],
  );
  const filtered = useMemo(
    () =>
      apps
        .filter(
          (app) =>
            (statusFilter === "all" || app.status === statusFilter) &&
            (serviceFilter === "all" || app.serviceSlug === serviceFilter) &&
            (countryFilter === "all" || countryOf(app) === countryFilter),
        )
        .sort((a, b) =>
          sort === "recent"
            ? +new Date(b.createdAt) - +new Date(a.createdAt)
            : +new Date(a.createdAt) - +new Date(b.createdAt),
        ),
    [apps, statusFilter, serviceFilter, countryFilter, sort],
  );

  if (authLoading || !user || user.role !== "admin")
    return (
      <main className="fm-page flex min-h-screen items-center justify-center px-fm-6">
        <p className="fm-label">Loading admin panel...</p>
      </main>
    );

  async function openApplication(id: string) {
    setDetailLoading(true);
    setError("");
    try {
      setSelected((await getAdminApplication(id)).data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load application.");
    } finally {
      setDetailLoading(false);
    }
  }

  async function changeStatus(status: (typeof adminStatuses)[number]) {
    if (!selected) return;
    try {
      const response = await updateAdminApplicationStatus(
        selected.application.id,
        status,
        selected.application.updatedAt,
      );
      setSelected({ ...selected, application: response.data.application });
      setApps((current) =>
        current.map((app) =>
          app.id === selected.application.id ? { ...app, ...response.data.application } : app,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update application.");
    }
  }

  return (
    <div className="h-screen overflow-hidden bg-[var(--fm-graphite)] text-[var(--fm-text-primary)]">
      {mobileOpen && (
        <button
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 md:hidden"
        />
      )}
      <aside
        className={[
          `fixed inset-y-0 left-0 z-50 flex flex-col border-r border-[var(--fm-border)] bg-[var(--fm-graphite-deep)] transition-all duration-300`,
          sidebarOpen ? "w-[252px]" : "w-0 md:w-[72px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        ].join(" ")}
      >
        <div className="relative flex h-[69px] shrink-0 items-center border-b border-[var(--fm-border)] px-4">
          <div className="flex items-center gap-2">
            <span
              className={`text-[28px] font-semibold tracking-[-1.7px] ${!sidebarOpen ? "md:opacity-0" : ""}`}
            >
              audvertax
            </span>
            <span className="rounded-full bg-[var(--fm-lime-soft)] px-2 py-0.5 font-mono text-[9px] font-semibold text-[var(--fm-lime)]">
              Admin
            </span>
          </div>
          <button onClick={() => setMobileOpen(false)} className="ml-auto md:hidden">
            <X size={19} />
          </button>
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="absolute -right-3 top-[42px] hidden h-6 w-6 items-center justify-center rounded-full border border-[var(--fm-border)] bg-[var(--fm-surface)] md:flex"
          >
            <ChevronLeft size={14} className={!sidebarOpen ? "rotate-180" : ""} />
          </button>
        </div>
        <nav className="flex-1 px-2.5 pt-3">
          <div className="mb-1 flex h-[42px] items-center gap-3 rounded-[var(--fm-radius-md)] bg-[var(--fm-lime)] px-4 text-sm font-medium text-[var(--fm-graphite-deep)]">
            <FileText size={20} />{" "}
            <span className={!sidebarOpen ? "md:hidden" : ""}>Applications</span>
          </div>
          <div className="mb-1 flex h-[42px] items-center gap-3 px-4 text-sm text-[var(--fm-text-secondary)]">
            <Settings size={20} /> <span className={!sidebarOpen ? "md:hidden" : ""}>Settings</span>
          </div>
        </nav>
        <div
          className={`border-t border-[var(--fm-border)] p-3 ${!sidebarOpen ? "md:opacity-0" : ""}`}
        >
          <a
            href="https://wa.me/923164466335"
            target="_blank"
            rel="noreferrer"
            className="mb-3 flex items-center gap-3 rounded-[var(--fm-radius-md)] border border-[var(--fm-border-soft)] bg-[var(--fm-surface)] px-3 py-2.5"
          >
            <MessageCircle size={19} className="text-[var(--fm-success)]" />
            <span className="text-xs">WhatsApp Support</span>
          </a>
          <a
            href="mailto:support@audvertax.pk"
            className="flex items-center gap-3 rounded-[var(--fm-radius-md)] border border-[var(--fm-border-soft)] bg-[var(--fm-surface)] px-3 py-2.5"
          >
            <Mail size={18} />
            <span className="text-xs">Email Support</span>
          </a>
        </div>
      </aside>

      <div
        className={`h-full min-h-0 transition-[margin] duration-300 ${sidebarOpen ? "md:ml-[252px]" : "md:ml-[72px]"}`}
      >
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed left-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--fm-border)] bg-[var(--fm-surface)] shadow-lg md:hidden"
          aria-label="Open navigation"
        >
          <Menu size={19} />
        </button>
        <main className="h-full min-h-0 overflow-hidden px-fm-4 py-fm-4 md:px-fm-6 md:py-fm-5">
          <div className="mx-auto flex h-full min-h-0 max-w-[1600px] flex-col">
            {error && (
              <div className="mb-5 rounded-fm-lg border border-fm-danger/30 bg-fm-danger/5 p-fm-4 text-sm text-fm-danger">
                {error}
              </div>
            )}
            <section className="mb-4 grid shrink-0 gap-2 rounded-fm-xl border border-fm-border-soft bg-fm-surface/80 p-3 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur md:grid-cols-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 min-w-0 rounded-fm-md border border-fm-border-soft bg-fm-graphite-deep px-3 text-sm outline-none transition-[border-color,box-shadow,background-color] duration-200 hover:border-fm-border focus:border-fm-lime focus:bg-fm-surface-raised focus:ring-2 focus:ring-fm-lime/10"
              >
                <option value="all">All statuses</option>
                {adminStatuses.map((s) => (
                  <option key={s} value={s}>
                    {displayStatus(s)}
                  </option>
                ))}
              </select>
              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="h-10 min-w-0 rounded-fm-md border border-fm-border-soft bg-fm-graphite-deep px-3 text-sm outline-none transition-[border-color,box-shadow,background-color] duration-200 hover:border-fm-border focus:border-fm-lime focus:bg-fm-surface-raised focus:ring-2 focus:ring-fm-lime/10"
              >
                <option value="all">All services</option>
                {services.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="h-10 min-w-0 rounded-fm-md border border-fm-border-soft bg-fm-graphite-deep px-3 text-sm outline-none transition-[border-color,box-shadow,background-color] duration-200 hover:border-fm-border focus:border-fm-lime focus:bg-fm-surface-raised focus:ring-2 focus:ring-fm-lime/10"
              >
                <option value="all">All countries / jurisdictions</option>
                {countries.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as "recent" | "old")}
                className="h-10 min-w-0 rounded-fm-md border border-fm-border-soft bg-fm-graphite-deep px-3 text-sm outline-none transition-[border-color,box-shadow,background-color] duration-200 hover:border-fm-border focus:border-fm-lime focus:bg-fm-surface-raised focus:ring-2 focus:ring-fm-lime/10"
              >
                <option value="recent">Recent first</option>
                <option value="old">Oldest first</option>
              </select>
            </section>
            <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(360px,420px)]">
              <section className="flex min-h-0 flex-col overflow-hidden rounded-fm-xl border border-fm-border-soft bg-fm-surface shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
                {loading ? (
                  <div className="p-10 text-center">Loading applications...</div>
                ) : !filtered.length ? (
                  <div className="p-10 text-center text-sm text-fm-text-secondary">
                    No applications match these filters.
                  </div>
                ) : (
                  <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-2 md:p-3">
                    {filtered.map((app) => (
                      <button
                        key={app.id}
                        onClick={() => openApplication(app.id)}
                        className={`block w-full min-w-0 rounded-fm-lg border p-4 text-left transition-[border-color,background-color,box-shadow,transform] duration-200 ${
                          selected?.application.id === app.id
                            ? "border-fm-lime bg-fm-lime/10 shadow-[0_8px_24px_rgba(0,0,0,0.16)]"
                            : "border-fm-border-soft bg-fm-graphite-deep/50 hover:-translate-y-px hover:border-fm-border hover:bg-fm-surface-raised"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-mono text-[10px] text-fm-text-tertiary">{app.id}</p>
                            <h3 className="mt-1 break-words font-semibold">{app.serviceSlug}</h3>
                            <p className="mt-1 text-sm text-fm-text-secondary">
                              {app.customer
                                ? `${app.customer.firstName} ${app.customer.lastName} · ${app.customer.email}`
                                : "Unknown customer"}
                            </p>
                          </div>
                          <span
                            className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${
                              selected?.application.id === app.id
                                ? "border-fm-lime bg-fm-lime text-fm-graphite-deep"
                                : "border-fm-border bg-fm-surface"
                            }`}
                          >
                            {displayStatus(app.status)}
                          </span>
                        </div>
                        <p className="mt-3 text-xs text-fm-text-tertiary">
                          {countryOf(app)} · {formatDate(app.createdAt)}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </section>
              <section className="flex min-h-0 flex-col overflow-hidden rounded-fm-xl border border-fm-border-soft bg-fm-surface shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
                {detailLoading ? (
                  <div className="p-8 text-center">Loading application...</div>
                ) : !selected ? (
                  <div className="p-8 text-center text-sm text-fm-text-secondary">
                    Select an application to inspect all answers, documents and billing.
                  </div>
                ) : (
                  <div className="min-h-0 flex-1 overflow-y-auto p-5 md:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-mono text-[10px] text-fm-text-tertiary">
                          {selected.application.id}
                        </p>
                        <h2 className="mt-1 text-xl font-semibold">
                          {selected.application.serviceSlug}
                        </h2>
                        <p className="mt-1 text-sm text-fm-text-secondary">
                          {selected.customer
                            ? `${selected.customer.firstName} ${selected.customer.lastName} · ${selected.customer.email}`
                            : "Unknown customer"}
                        </p>
                      </div>
                      <button onClick={() => setSelected(null)} aria-label="Close details">
                        <X size={18} />
                      </button>
                    </div>
                    <div className="mt-6 space-y-5">
                      <div>
                        <p className="fm-label">Status</p>
                        <select
                          value={selected.application.status}
                          onChange={(e) => changeStatus(e.target.value as any)}
                          className="mt-2 h-10 w-full rounded-fm-md border border-fm-border bg-fm-graphite-deep px-3 text-sm"
                        >
                          {adminStatuses.map((s) => (
                            <option key={s} value={s}>
                              {displayStatus(s)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <p className="fm-label">Submitted</p>
                        <p className="mt-1 text-sm">{formatDate(selected.application.createdAt)}</p>
                      </div>
                      {selected.billing && (
                        <div className="rounded-fm-lg border border-fm-border p-4">
                          <p className="fm-label">Billing</p>
                          <p className="mt-2 text-sm">
                            {selected.billing.currency} {selected.billing.total.toFixed(2)} ·{" "}
                            {selected.billing.status}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="fm-label">Application details</p>
                        <div className="mt-2 overflow-hidden rounded-fm-lg border border-fm-border">
                          {selected.application.serviceSlug === "usa-llc" && (
                            <div className="mb-4">
                              <MembersPanel members={selected.application.data.members} />
                            </div>
                          )}
                          <ReadableData
                            value={selected.application.data}
                            skipKeys={
                              selected.application.serviceSlug === "usa-llc" ? ["members"] : []
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <p className="fm-label">Documents</p>
                        <div className="mt-2 space-y-2">
                          {selected.signedDocuments.length ? (
                            selected.signedDocuments.map((doc) => (
                              <a
                                key={doc.path}
                                href={doc.url ?? "#"}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-between rounded-fm-md border border-fm-border p-3 text-sm hover:bg-fm-surface-raised"
                              >
                                <span className="truncate">{doc.path.split("/").pop()}</span>
                                <ExternalLink size={15} />
                              </a>
                            ))
                          ) : (
                            <p className="text-sm text-fm-text-secondary">No uploaded documents.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
