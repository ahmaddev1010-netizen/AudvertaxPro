"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  AlertTriangle,
  Bell,
  Building2,
  ChevronDown,
  ChevronLeft,
  Check,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  CreditCard,
  Download,
  FileCheck2,
  FileText,
  Grid2X2,
  Headphones,
  Mail,
  Menu,
  MessageCircle,
  Plus,
  Receipt,
  RefreshCw,
  Save,
  Settings,
  ShieldCheck,
  X,
  ArrowUpRight,
} from "lucide-react";
import { useApplicationState } from "@/components/application/ApplicationStateProvider";
import { getServiceBySlug, getApplicationConfig } from "@/lib/services";
import { calculateApplicationPricing } from "@/lib/pricing";
import { getDocumentsForService } from "@/lib/documents/catalog";
import { getBillingOrders, type BillingOrder } from "@/lib/api";
import { downloadPaymentSlip } from "@/lib/payment-slip";
import { useAuth } from "@/components/auth/AuthProvider";
import MyApplications from "@/components/dashboard/MyApplications";
import { Card, IconContainer, PageHeader, StatusBadge } from "@/components/ui/design-system";
import { LoadingState } from "@/components/ui/interaction-controls";
import {
  DashboardPanel,
  StatCard,
  DocumentCard,
  NotificationItem,
} from "@/components/ui/composite";
import {
  hasRequiredDashboardDocumentsPending,
  resolveDashboardDocumentStatus,
} from "@/lib/documents/dashboard-status";
import { Button } from "@/components/ui/button";

const statusLabels: Record<string, string> = {
  draft: "Draft",
  ready_for_payment: "Ready for payment",
  paid: "Paid",
  processing: "Processing",
  completed: "Completed",
  cancelled: "Cancelled",
};

const sections = [
  "Dashboard",
  "Billing",
  "Documents",
  "Notifications",
  "Support",
  "Settings",
] as const;

type Section = (typeof sections)[number];

const faqs = [
  [
    "How long does LLC formation take?",
    "Processing time depends on the state and service package. Your dashboard will show the latest application status.",
  ],
  [
    "Where can I find my documents?",
    "Open Documents from this dashboard. Formation documents will appear there when they become available.",
  ],
  [
    "How do I make a payment?",
    "Open Billing from this dashboard and continue to checkout when your application is ready for payment.",
  ],
  [
    "Can I change information after submitting?",
    "Contact support before processing begins. Our team can tell you what changes are still possible.",
  ],
] as const;

export default function DashboardPage() {
  return (
    <Suspense fallback={<LoadingState label="Loading your dashboard..." />}>
      <DashboardPageContent />
    </Suspense>
  );
}

function DashboardPageContent() {
  const router = useRouter();
  const params = useSearchParams();
  const requested = params.get("section") as Section | null;
  const active: Section = requested && sections.includes(requested) ? requested : "Dashboard";

  const { application, applications, refreshApplications, refreshError } = useApplicationState();
  const { user, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [newLLC, setNewLLC] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [applicationAlerts, setApplicationAlerts] = useState(true);
  const [saved, setSaved] = useState(false);
  const [readNotifications, setReadNotifications] = useState<string[]>([]);

  const name = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();
  const email = user?.email ?? "";
  const customerName = name || "Customer";

  const service = application ? getServiceBySlug(application.serviceSlug) : undefined;
  const pricing = application
    ? calculateApplicationPricing({
        serviceSlug: application.serviceSlug,
        packageSlug: application.packageSlug,
        formationState: application.formationState,
        variantSlug: application.variantSlug,
        addOnSlugs: application.addOnSlugs,
      })
    : null;
  const progress = application
    ? (() => {
        const stepCount = getApplicationConfig(application.serviceSlug)?.steps.length ?? 0;
        if (stepCount <= 0) return 0;
        const step = Math.min(Math.max(application.currentStep, 0), stepCount - 1);
        return Math.min(100, Math.max(0, Math.round(((step + 1) / stepCount) * 100)));
      })()
    : 0;
  const documents = application ? getDocumentsForService(application.serviceSlug) : [];

  function openSection(section: Section) {
    setMobileOpen(false);
    router.push(
      section === "Dashboard" ? "/dashboard" : `/dashboard?section=${encodeURIComponent(section)}`,
    );
  }

  async function refresh() {
    setRefreshing(true);
    try {
      await refreshApplications();
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (accountMenuRef.current && !accountMenuRef.current.contains(target)) {
        setAccountMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  async function handleLogout() {
    setAccountMenuOpen(false);
    try {
      await logout();
    } finally {
      router.push("/");
    }
  }

  function saveSettings() {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  }

  const notificationItems = useMemo(
    () => [
      {
        id: "welcome",
        title: "Welcome to your Audvertax dashboard",
        text: "Your customer portal is ready. You can manage your applications, billing and documents here.",
        type: "account",
        time: "Just now",
      },
      ...(application
        ? [
            {
              id: "application-status",
              title: `${service?.name ?? "Your application"} is ${(statusLabels[application.status] ?? application.status.replaceAll("_", " ")).toLowerCase()}`,
              text: `Application ${application.id} is currently at ${progress}% progress.`,
              type: "application",
              time: "Application update",
            },
          ]
        : []),
      ...(application && ["draft", "ready_for_payment"].includes(application.status)
        ? [
            {
              id: "payment",
              title: "Payment action available",
              text: `Your current order total is ${pricing?.currency ?? ""} ${pricing?.total.toFixed(2) ?? "0.00"}. Open Billing when you are ready to continue.`,
              type: "billing",
              time: "Action required",
            },
          ]
        : []),
      ...(application &&
      hasRequiredDashboardDocumentsPending(
        documents,
        application.documents,
        application.members.map((member) => member.id),
      )
        ? [
            {
              id: "documents",
              title: "Required documents need attention",
              text: "Review the Documents section to see which customer documents are required.",
              type: "documents",
              time: "Action required",
            },
          ]
        : []),
    ],
    [application, service, progress, pricing, documents],
  );

  const unreadCount = notificationItems.filter(
    (item) => !readNotifications.includes(item.id),
  ).length;

  const markAllRead = () => setReadNotifications(notificationItems.map((item) => item.id));

  const markRead = (id: string) =>
    setReadNotifications((current) => (current.includes(id) ? current : [...current, id]));

  const stats = [
    {
      label: "Total Companies",
      value: applications.length,
      icon: Building2,
    },
    {
      label: "Active Companies",
      value: applications.filter((item) => item.status === "completed").length,
      icon: ShieldCheck,
    },
    {
      label: "Pending Actions",
      value: applications.filter((item) => !["completed", "cancelled"].includes(item.status))
        .length,
      icon: AlertTriangle,
    },
    {
      label: "Pending Payments",
      value: applications.filter((item) => ["ready_for_payment", "draft"].includes(item.status))
        .length,
      icon: CreditCard,
    },
    {
      label: "Upcoming Renewals",
      value: 0,
      icon: RefreshCw,
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--fm-graphite)] text-[var(--fm-text-primary)]">
      {mobileOpen && (
        <button
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 md:hidden"
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-[var(--fm-border)] bg-[var(--fm-graphite-deep)] text-[var(--fm-text-primary)] transition-all duration-300",
          sidebarOpen ? "w-[252px]" : "w-0 md:w-[72px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        ].join(" ")}
      >
        <div className="relative flex h-[69px] shrink-0 items-center border-b border-[var(--fm-border)] px-4">
          <div
            className={["flex items-center gap-2", !sidebarOpen ? "md:opacity-0" : ""].join(" ")}
          >
            <span className="text-[28px] font-semibold tracking-[-1.7px]">audvertax</span>
            <span className="rounded-full bg-[var(--fm-lime-soft)] px-2 py-0.5 font-mono text-[9px] font-semibold text-[var(--fm-lime)]">
              Customer
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto rounded-[var(--fm-radius-sm)] p-1.5 md:hidden"
          >
            <X size={19} />
          </button>
          <button
            onClick={() => setSidebarOpen((value) => !value)}
            aria-label="Toggle sidebar"
            className="absolute -right-3 top-[42px] hidden h-6 w-6 items-center justify-center rounded-full border border-[var(--fm-border)] bg-[var(--fm-surface)] text-[var(--fm-text-primary)] shadow-[var(--fm-shadow-subtle)] md:flex"
          >
            <ChevronLeft size={14} className={!sidebarOpen ? "rotate-180" : ""} />
          </button>
        </div>

        <nav className="flex-1 px-2.5 pt-3">
          {(
            [
              ["Dashboard", Grid2X2],
              ["Billing", CreditCard],
              ["Documents", FileText],
              ["Notifications", Bell],
              ["Support", Headphones],
              ["Settings", Settings],
            ] as const
          ).map(([label, Icon]) => (
            <button
              key={label}
              onClick={() => openSection(label)}
              className={[
                "mb-1 flex h-[42px] w-full items-center gap-3 rounded-[var(--fm-radius-md)] px-4 text-left transition-colors duration-[var(--fm-motion-micro)]",
                active === label
                  ? "bg-[var(--fm-lime)] text-[var(--fm-graphite-deep)]"
                  : "text-[var(--fm-text-secondary)] hover:bg-[var(--fm-surface)] hover:text-[var(--fm-text-primary)]",
                !sidebarOpen ? "md:justify-center md:px-0" : "",
              ].join(" ")}
            >
              <Icon size={20} strokeWidth={1.8} />
              <span className={["text-sm font-medium", !sidebarOpen ? "md:hidden" : ""].join(" ")}>
                {label}
              </span>
            </button>
          ))}

          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className={[
              "mb-1 mt-2 flex h-[42px] w-full items-center gap-3 border-t border-[var(--fm-border)] px-4 pt-2 text-left text-[var(--fm-text-secondary)] transition-colors hover:text-[var(--fm-text-primary)]",
              !sidebarOpen ? "md:justify-center md:px-0" : "",
            ].join(" ")}
          >
            <Grid2X2 size={20} strokeWidth={1.8} />
            <span className={["text-sm font-medium", !sidebarOpen ? "md:hidden" : ""].join(" ")}>
              Homepage
            </span>
          </Link>
        </nav>

        <div
          className={[
            "border-t border-[var(--fm-border)] p-3",
            !sidebarOpen ? "md:opacity-0" : "",
          ].join(" ")}
        >
          <p className="mb-3 px-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--fm-text-tertiary)]">
            Need help?
          </p>
          <a
            href="https://wa.me/923164466335"
            target="_blank"
            rel="noreferrer"
            className="mb-3 flex items-center gap-3 rounded-[var(--fm-radius-md)] border border-[var(--fm-border-soft)] bg-[var(--fm-surface)] px-3 py-2.5"
          >
            <MessageCircle size={19} className="text-[var(--fm-success)]" />
            <span>
              <span className="block text-xs font-medium text-[var(--fm-text-primary)]">
                WhatsApp
              </span>
              <span className="block font-mono text-[10px] text-[var(--fm-text-tertiary)]">
                +92 316 4466335
              </span>
            </span>
          </a>
          <a
            href="mailto:support@audvertax.pk"
            className="flex items-center gap-3 rounded-[var(--fm-radius-md)] border border-[var(--fm-border-soft)] bg-[var(--fm-surface)] px-3 py-2.5"
          >
            <Mail size={18} className="text-[var(--fm-text-secondary)]" />
            <span>
              <span className="block text-xs font-medium">Email Support</span>
              <span className="block font-mono text-[10px] text-[var(--fm-text-tertiary)]">
                support@audvertax.pk
              </span>
            </span>
          </a>
        </div>
      </aside>

      <div
        className={[
          "min-h-screen transition-[margin] duration-300",
          sidebarOpen ? "md:ml-[252px]" : "md:ml-[72px]",
        ].join(" ")}
      >
        <header className="sticky top-0 z-30 flex h-[53px] items-center justify-between border-b border-[var(--fm-border)] bg-[var(--fm-surface)] px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-[var(--fm-radius-sm)] p-1.5 md:hidden"
            >
              <Menu size={21} />
            </button>
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--fm-text-tertiary)]">
              {active}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[var(--fm-text-secondary)]">
            <button
              onClick={refresh}
              aria-label="Refresh"
              className="rounded-[var(--fm-radius-sm)] p-1.5 hover:text-[var(--fm-text-primary)]"
            >
              <RefreshCw size={19} className={refreshing ? "animate-spin" : ""} />
            </button>

            <div className="relative">
              <button
                onClick={() => setNotifications((value) => !value)}
                aria-label="Notifications"
                className="relative rounded-[var(--fm-radius-sm)] p-1.5 hover:text-[var(--fm-text-primary)]"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--fm-lime)] px-1 font-mono text-[9px] font-bold text-[var(--fm-graphite-deep)]">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
              {notifications && (
                <NotificationPopover
                  items={notificationItems}
                  unreadCount={unreadCount}
                  readNotifications={readNotifications}
                  markRead={markRead}
                  markAllRead={markAllRead}
                  onOpenAll={() => {
                    setNotifications(false);
                    openSection("Notifications");
                  }}
                />
              )}
            </div>

            <div className="h-7 w-px bg-[var(--fm-border)]" />
            <div ref={accountMenuRef} className="group relative">
              <button
                type="button"
                onMouseEnter={() => setAccountMenuOpen(true)}
                onMouseLeave={() => setAccountMenuOpen(false)}
                onClick={() => setAccountMenuOpen((value) => !value)}
                aria-label="Account menu"
                aria-expanded={accountMenuOpen}
                className="flex size-8 items-center justify-center rounded-full border border-[var(--fm-border)] bg-[var(--fm-surface-raised)] font-mono text-[11px] font-bold text-[var(--fm-lime)] transition-colors hover:border-[var(--fm-lime)]/50 hover:text-[var(--fm-lime-bright)]"
              >
                {customerName.slice(0, 2).toUpperCase() || "AU"}
              </button>

              <div
                role="menu"
                aria-label="Account menu"
                onMouseEnter={() => setAccountMenuOpen(true)}
                onMouseLeave={() => setAccountMenuOpen(false)}
                className={[
                  "absolute right-0 top-[calc(100%+10px)] w-56 rounded-[var(--fm-radius-lg)] border border-[var(--fm-border)] bg-[var(--fm-surface)] p-2 shadow-[var(--fm-shadow-elevated)] transition-[visibility,opacity,transform] duration-[var(--fm-motion-component)] ease-[var(--fm-motion-ease)]",
                  accountMenuOpen
                    ? "visible translate-y-0 opacity-100"
                    : "invisible translate-y-1 opacity-0 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100",
                ].join(" ")}
              >
                <div className="px-3 py-2">
                  <p className="truncate text-sm font-semibold text-[var(--fm-text-primary)]">
                    {customerName}
                  </p>
                  <p className="truncate text-xs text-[var(--fm-text-tertiary)]">{email}</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-[var(--fm-radius-md)] px-3 py-2 text-left text-sm font-medium text-[var(--fm-danger)] transition-colors hover:bg-[var(--fm-danger)]/10"
                >
                  <span aria-hidden="true">↩</span> Sign out
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1120px] px-4 py-8 sm:px-6 lg:px-8">
          {refreshError && (
            <div
              role="alert"
              className="mb-6 flex items-start gap-3 rounded-[var(--fm-radius-md)] border border-[var(--fm-danger)]/30 bg-[var(--fm-danger-soft)] p-4 text-sm text-[var(--fm-danger)]"
            >
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="font-semibold">Unable to refresh your applications</p>
                <p className="mt-1">{refreshError}</p>
              </div>
            </div>
          )}
          {active === "Dashboard" && (
            <>
              <PageHeader
                title={`Welcome back, ${customerName}`}
                description="Here's an overview of your business portfolio and pending actions."
                className="mb-7"
              />
              <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <StatCard
                      key={stat.label}
                      label={stat.label}
                      value={stat.value}
                      icon={<Icon size={20} />}
                    />
                  );
                })}
              </section>
              <section className="mt-7">
                <MyApplications />
              </section>
            </>
          )}
          {active === "Billing" && (
            <DashboardBilling
              application={application}
              applications={applications}
              service={service}
              pricing={pricing}
            />
          )}
          {active === "Documents" && (
            <DashboardDocuments application={application} documents={documents} />
          )}
          {active === "Notifications" && (
            <DashboardNotifications
              items={notificationItems}
              unreadCount={unreadCount}
              markRead={markRead}
              markAllRead={markAllRead}
            />
          )}
          {active === "Support" && <DashboardSupport faqOpen={faqOpen} setFaqOpen={setFaqOpen} />}
          {active === "Settings" && (
            <DashboardSettings
              name={name}
              email={email}
              emailUpdates={emailUpdates}
              setEmailUpdates={setEmailUpdates}
              applicationAlerts={applicationAlerts}
              setApplicationAlerts={setApplicationAlerts}
              saved={saved}
              save={saveSettings}
            />
          )}
        </main>

        {newLLC && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4">
            <Card variant="feature" className="w-full max-w-[430px] p-6">
              <div className="flex items-start justify-between">
                <div>
                  <IconContainer>
                    <Building2 size={22} />
                  </IconContainer>
                  <h2 className="mt-4 text-xl font-semibold tracking-[-0.03em]">Start a New LLC</h2>
                  <p className="mt-1 text-sm text-[var(--fm-text-secondary)]">
                    Begin your LLC registration.
                  </p>
                </div>
                <button
                  onClick={() => setNewLLC(false)}
                  className="rounded-[var(--fm-radius-sm)] p-1.5 text-[var(--fm-text-tertiary)] hover:text-[var(--fm-text-primary)]"
                >
                  <X size={18} />
                </button>
              </div>
              <Link
                href="/usa-llc"
                onClick={() => setNewLLC(false)}
                className="mt-6 flex h-11 w-full items-center justify-center rounded-[var(--fm-radius-md)] bg-[var(--fm-lime)] text-sm font-semibold text-[var(--fm-graphite-deep)] transition-colors hover:bg-[var(--fm-lime-bright)]"
              >
                Continue
                <Plus size={17} className="ml-2" />
              </Link>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

function DashboardBilling({ application, applications, service, pricing }: any) {
  const [orders, setOrders] = useState<BillingOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getBillingOrders()
      .then((response) => {
        if (active) setOrders(response.data);
      })
      .catch(() => {
        if (active) setOrders([]);
      })
      .finally(() => {
        if (active) setOrdersLoading(false);
      });
    return () => {
      active = false;
    };
  }, [application?.id]);

  return (
    <>
      <PageHeader
        eyebrow="Payments"
        title="Billing & Payments"
        description="Review your current application charges and payment status."
        className="mb-7"
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <DashboardPanel
          title="Current order"
          description={service?.name ?? application?.serviceSlug ?? "Your applications"}
          action={
            application ? (
              <StatusBadge status="neutral">{statusLabels[application.status]}</StatusBadge>
            ) : undefined
          }
        >
          {application && pricing ? (
            <div>
              {pricing.lineItems.map((item: any) => (
                <div
                  key={item.key}
                  className="flex justify-between border-b border-[var(--fm-border-soft)] py-4 text-sm"
                >
                  <span>{item.label}</span>
                  <b>
                    {item.currency} {item.total.toFixed(2)}
                  </b>
                </div>
              ))}
              <div className="mt-5 flex justify-between">
                <span className="text-sm text-[var(--fm-text-tertiary)]">Total</span>
                <b className="text-xl">
                  {pricing.currency} {pricing.total.toFixed(2)}
                </b>
              </div>
              {application.status === "ready_for_payment" && (
                <Link
                  href={`/checkout?applicationId=${application.id}`}
                  className="mt-6 flex h-11 items-center justify-center rounded-[var(--fm-radius-md)] bg-[var(--fm-lime)] text-sm font-semibold text-[var(--fm-graphite-deep)] hover:bg-[var(--fm-lime-bright)]"
                >
                  Continue to payment <ArrowUpRight size={16} className="ml-2" />
                </Link>
              )}
            </div>
          ) : (
            <p className="text-sm text-[var(--fm-text-secondary)]">
              Select an application to review its billing.
            </p>
          )}
        </DashboardPanel>
        <div className="space-y-6">
          <DashboardPanel title="Bills" description="Your persisted billing orders">
            {ordersLoading ? (
              <p className="text-sm text-[var(--fm-text-secondary)]">Loading bills...</p>
            ) : orders.length ? (
              <div className="space-y-3">
                {orders.map((order) => {
                  const orderApplication = applications.find(
                    (item: any) => item.id === order.applicationId,
                  );
                  const orderService = orderApplication
                    ? getServiceBySlug(orderApplication.serviceSlug)
                    : undefined;

                  const downloadSlip = () => {
                    downloadPaymentSlip({
                      applicationId: order.applicationId,
                      orderId: order.id,
                      serviceName: orderService?.name ?? "Service application",
                      status: order.status === "paid" ? "paid" : "pending",
                      currency: order.currency,
                      total: order.total,
                      paymentReference: order.status === "paid" ? order.id : undefined,
                      paidAt: order.status === "paid" ? order.updatedAt : undefined,
                    });
                  };

                  return (
                    <div
                      key={order.id}
                      className="rounded-[var(--fm-radius-lg)] border border-[var(--fm-border)] bg-[var(--fm-surface)] p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[11px] leading-5 text-[var(--fm-text-tertiary)]">
                          {order.applicationId}
                        </span>
                        <StatusBadge status={order.status === "paid" ? "success" : "warning"}>
                          {order.status === "paid" ? "Paid" : "Pending"}
                        </StatusBadge>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <p className="text-[16px] font-semibold tracking-[-0.02em] text-[var(--fm-text-primary)]">
                          {order.currency} {order.total.toFixed(2)}
                        </p>
                        <button
                          type="button"
                          onClick={downloadSlip}
                          className="inline-flex items-center gap-1.5 rounded-[var(--fm-radius-pill)] border border-[var(--fm-border)] bg-[var(--fm-surface-raised)] px-2.5 py-1.5 text-[11px] font-medium text-[var(--fm-text-primary)] transition-colors hover:bg-[var(--fm-surface)]"
                        >
                          Slip <Download size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-[var(--fm-text-secondary)]">No billing orders yet.</p>
            )}
          </DashboardPanel>
          <InfoCard
            icon={CreditCard}
            title="Payment method"
            text="Secure card payments will be enabled when Stripe is reconnected."
          />
          <InfoCard
            icon={Receipt}
            title="Invoices & receipts"
            text="Confirmed payment receipts will appear here when billing is connected."
          />
        </div>
      </div>
    </>
  );
}
function DashboardDocuments({ application, documents }: any) {
  return (
    <>
      <PageHeader
        eyebrow="Your files"
        title="Documents"
        description="Required documents and formation documents for your application."
        className="mb-7"
      />
      <DashboardPanel>
        {application ? (
          <div className="space-y-3">
            {documents.map((doc: any) => {
              const documentStatus = resolveDashboardDocumentStatus(
                doc,
                application.documents,
                application.members.map((member: any) => member.id),
              );

              return (
                <DocumentCard
                  key={doc.id}
                  title={doc.name}
                  description={doc.description}
                  status={
                    <StatusBadge
                      status={
                        documentStatus === "required"
                          ? "warning"
                          : documentStatus === "uploaded"
                            ? "neutral"
                            : documentStatus === "approved"
                              ? "success"
                              : "neutral"
                      }
                    >
                      {documentStatus === "required"
                        ? "Required"
                        : documentStatus === "uploaded"
                          ? "Uploaded"
                          : documentStatus === "approved"
                            ? "Approved"
                            : "Pending"}
                    </StatusBadge>
                  }
                  meta={doc.id}
                />
              );
            })}
          </div>
        ) : (
          <Empty
            title="No documents yet"
            text="Start an application to see document requirements."
          />
        )}
      </DashboardPanel>
    </>
  );
}

function DashboardNotifications({ items, unreadCount, markRead, markAllRead }: any) {
  return (
    <>
      <PageHeader
        eyebrow="Updates"
        title="Notifications"
        description="Stay up to date with your applications, payments and document requirements."
        className="mb-7"
      />
      <DashboardPanel
        title="Your notifications"
        description={
          unreadCount
            ? `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`
            : "You're all caught up"
        }
        action={
          unreadCount > 0 ? (
            <Button variant="outline" size="sm" onClick={markAllRead}>
              <Check size={14} />
              Mark all as read
            </Button>
          ) : undefined
        }
      >
        {items.length ? (
          <div className="-mx-5 -mb-5">
            {items.map((item: any) => (
              <button
                key={item.id}
                onClick={() => markRead(item.id)}
                className="block w-full text-left hover:bg-[var(--fm-surface-raised)]"
              >
                <NotificationItem
                  title={item.title}
                  description={item.text}
                  timestamp={item.time}
                  unread={true}
                />
              </button>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center">
            <Bell className="mx-auto text-[var(--fm-text-tertiary)]" size={38} />
            <h3 className="mt-4 font-semibold">No notifications</h3>
            <p className="mt-1 text-sm text-[var(--fm-text-tertiary)]">
              You&apos;re all caught up.
            </p>
          </div>
        )}
      </DashboardPanel>
    </>
  );
}

function NotificationPopover({
  items,
  unreadCount,
  readNotifications,
  markRead,
  markAllRead,
  onOpenAll,
}: any) {
  return (
    <div className="absolute right-0 top-10 z-50 w-[350px] overflow-hidden rounded-[var(--fm-radius-lg)] border border-[var(--fm-border)] bg-[var(--fm-surface)] shadow-[var(--fm-shadow-elevated)]">
      <div className="flex items-center justify-between border-b border-[var(--fm-border)] px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold">Notifications</h3>
          <p className="font-mono text-[10px] text-[var(--fm-text-tertiary)]">
            {unreadCount ? `${unreadCount} unread` : "All caught up"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="text-[10px] font-semibold text-[var(--fm-lime)]">
            Mark read
          </button>
        )}
      </div>
      <div className="max-h-[360px] overflow-auto">
        {items.slice(0, 4).map((item: any) => (
          <button
            key={item.id}
            onClick={() => markRead(item.id)}
            className="block w-full text-left hover:bg-[var(--fm-surface-raised)]"
          >
            <NotificationItem
              title={item.title}
              description={item.text}
              timestamp={item.time}
              unread={!readNotifications.includes(item.id)}
            />
          </button>
        ))}
        {!items.length && (
          <p className="p-6 text-center text-xs text-[var(--fm-text-tertiary)]">No notifications</p>
        )}
      </div>
      <button
        onClick={onOpenAll}
        className="w-full border-t border-[var(--fm-border)] px-4 py-3 text-xs font-semibold text-[var(--fm-lime)] hover:bg-[var(--fm-surface-raised)]"
      >
        View all notifications
      </button>
    </div>
  );
}

function DashboardSupport({ faqOpen, setFaqOpen }: any) {
  return (
    <>
      <PageHeader
        eyebrow="Customer care"
        title="How can we help?"
        description="Get help with your application, payments, documents or formation service."
        className="mb-7"
      />
      <div className="grid gap-fm-5 md:grid-cols-2">
        <InfoCard
          icon={MessageCircle}
          title="WhatsApp Support"
          text="Chat with our support team about your application."
          href="https://wa.me/923164466335"
        />
        <InfoCard
          icon={Mail}
          title="Email Support"
          text="Send us your question and our team can review it."
          href="mailto:support@audvertax.pk"
        />
      </div>
      <DashboardPanel
        title="Frequently asked questions"
        description="Quick answers to common questions."
        className="mt-6"
      >
        <div className="divide-y divide-[var(--fm-border-soft)]">
          {faqs.map(([question, answer], index) => (
            <div key={question}>
              <button
                onClick={() => setFaqOpen(faqOpen === index ? null : index)}
                className="flex w-full justify-between py-4 text-left text-sm font-medium"
              >
                {question}
                <ChevronDown size={17} className={faqOpen === index ? "rotate-180" : ""} />
              </button>
              {faqOpen === index && (
                <p className="pb-4 pr-8 text-sm leading-6 text-[var(--fm-text-secondary)]">
                  {answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </DashboardPanel>
    </>
  );
}

function DashboardSettings({
  name,
  email,
  emailUpdates,
  setEmailUpdates,
  applicationAlerts,
  setApplicationAlerts,
  saved,
  save,
}: any) {
  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Settings"
        description="Manage your customer profile and notification preferences."
        className="mb-7"
      />
      <div className="space-y-6">
        <DashboardPanel title="Profile" description="Basic customer information.">
          <div className="grid gap-fm-5 md:grid-cols-2">
            <label className="text-sm font-medium">
              Full name
              <input
                value={name}
                readOnly
                className="mt-2 h-11 w-full rounded-[var(--fm-radius-md)] border border-[var(--fm-border)] bg-[var(--fm-graphite-deep)] px-3 text-sm text-[var(--fm-text-primary)]"
              />
            </label>
            <label className="text-sm font-medium">
              Email
              <input
                type="email"
                value={email}
                readOnly
                className="mt-2 h-11 w-full rounded-[var(--fm-radius-md)] border border-[var(--fm-border)] bg-[var(--fm-graphite-deep)] px-3 text-sm text-[var(--fm-text-primary)]"
              />
            </label>
          </div>
        </DashboardPanel>

        <DashboardPanel title="Notifications">
          <Toggle label="Email updates" checked={emailUpdates} setChecked={setEmailUpdates} />
          <Toggle
            label="Application alerts"
            checked={applicationAlerts}
            setChecked={setApplicationAlerts}
          />
        </DashboardPanel>

        <DashboardPanel
          title="Security"
          description="Authentication and account security are managed by your Audvertax account session."
        />

        <div className="flex items-center justify-end gap-3">
          <span className="text-sm font-medium text-[var(--fm-success)]">
            {saved && (
              <>
                <CheckCircle2 size={16} className="mr-1 inline" />
                Saved
              </>
            )}
          </span>
          <Button onClick={save}>
            <Save size={16} />
            Save settings
          </Button>
        </div>
      </div>
    </>
  );
}

function Toggle({ label, checked, setChecked }: any) {
  return (
    <label className="flex cursor-pointer items-center justify-between border-b border-[var(--fm-border-soft)] py-4 last:border-b-0">
      <span className="text-sm font-medium">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => setChecked(event.target.checked)}
        className="size-5 accent-[var(--fm-lime)]"
      />
    </label>
  );
}

function InfoCard({ icon: Icon, title, text, href }: any) {
  const content = (
    <Card variant="interactive" className="p-5">
      <IconContainer>
        <Icon size={21} />
      </IconContainer>
      <h3 className="mt-4 text-sm font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--fm-text-secondary)]">{text}</p>
      {href && (
        <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[var(--fm-lime)]">
          Open
          <ArrowUpRight size={15} />
        </span>
      )}
    </Card>
  );

  return href ? (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
    >
      {content}
    </a>
  ) : (
    content
  );
}

function Empty({ title, text }: { title: string; text: string }) {
  return (
    <Card className="p-10 text-center">
      <ShieldCheck className="mx-auto text-[var(--fm-text-tertiary)]" size={34} />
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-[var(--fm-text-secondary)]">{text}</p>
    </Card>
  );
}
