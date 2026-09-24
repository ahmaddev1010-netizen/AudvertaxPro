"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Bank,
  Briefcase,
  Buildings,
  FileText,
  List,
  SignOut,
  User,
  X,
  CaretDown,
} from "@phosphor-icons/react";
import { getServiceHref } from "@/lib/services";
import StartApplicationButton from "./services/StartApplicationButton";
import { useAuth } from "@/components/auth/AuthProvider";

type ServiceItem = {
  title: string;
  description?: string;
  href?: string;
  icon?: React.ReactNode;
  children?: ServiceItem[];
};
type ServiceGroup = { title: string; items: ServiceItem[] };
type ServicesMenu = { label: string; href?: string; groups: ServiceGroup[] };
type NavItem = { label: string; href?: string; megaMenu?: ServicesMenu };

const servicesMenu: ServicesMenu = {
  label: "Services",
  href: "/services",
  groups: [
    {
      title: "USA",
      items: [
        {
          title: "Company Registration",
          href: "/usa-llc",
          icon: <Buildings className="h-4 w-4" />,
        },
        {
          title: "Taxation",
          href: getServiceHref("usa-taxation"),
          icon: <FileText className="h-4 w-4" />,
        },
      ],
    },
    {
      title: "UK",
      items: [
        { title: "LTD Registration", href: "/uk-ltd", icon: <Buildings className="h-4 w-4" /> },
        {
          title: "LTD Compliance",
          icon: <FileText className="h-4 w-4" />,
          children: [
            { title: "Confirmation Statement", href: getServiceHref("uk-confirmation-statement") },
            { title: "Accounts Preparation", href: getServiceHref("uk-accounts-preparation") },
            {
              title: "HMRC & Companies House Submission",
              href: getServiceHref("uk-hmrc-companies-house-submission"),
            },
          ],
        },
        {
          title: "Taxation",
          icon: <FileText className="h-4 w-4" />,
          children: [
            { title: "VAT Registration", href: getServiceHref("uk-vat-registration") },
            { title: "VAT Filing", href: getServiceHref("uk-vat-filing") },
            {
              title: "Self Assessment Registration",
              href: getServiceHref("uk-self-assessment-registration"),
            },
            { title: "Self Assessment Filing", href: getServiceHref("uk-self-assessment-filing") },
            { title: "Corporate Tax", href: getServiceHref("uk-corporate-tax") },
            { title: "PAYE Registration", href: getServiceHref("uk-payee-registration") },
            { title: "Payroll Filing", href: getServiceHref("uk-payroll-filing") },
          ],
        },
        {
          title: "LTD Company Matters",
          icon: <Buildings className="h-4 w-4" />,
          children: [
            { title: "LTD Name", href: getServiceHref("uk-ltd-name") },
            { title: "LTD Address Change", href: getServiceHref("uk-ltd-address-change") },
            { title: "Add Director", href: getServiceHref("uk-add-director") },
            {
              title: "Change Director Address",
              href: getServiceHref("uk-change-director-address"),
            },
            {
              title: "Director ID Verification",
              href: getServiceHref("uk-director-id-verification"),
            },
            { title: "UK Address", href: getServiceHref("uk-address") },
            { title: "LTD Name Change", href: getServiceHref("uk-ltd-name-change") },
          ],
        },
      ],
    },
    {
      title: "UAE",
      items: [
        {
          title: "Company Registration",
          href: getServiceHref("uae-company-registration"),
          icon: <Buildings className="h-4 w-4" />,
        },
        {
          title: "Corporate Tax Registration",
          href: getServiceHref("uae-corporate-tax-registration"),
          icon: <FileText className="h-4 w-4" />,
        },
        {
          title: "Corporate Tax Filing",
          href: getServiceHref("uae-corporate-tax-filing"),
          icon: <FileText className="h-4 w-4" />,
        },
        {
          title: "VAT Registration",
          href: getServiceHref("uae-vat-registration"),
          icon: <FileText className="h-4 w-4" />,
        },
        {
          title: "VAT Filing",
          href: getServiceHref("uae-vat-filing"),
          icon: <FileText className="h-4 w-4" />,
        },
        {
          title: "Excise Tax Registration",
          href: getServiceHref("uae-excise-tax-registration"),
          icon: <FileText className="h-4 w-4" />,
        },
        {
          title: "Excise Tax Filing",
          href: getServiceHref("uae-excise-tax-filing"),
          icon: <FileText className="h-4 w-4" />,
        },
        {
          title: "Bookkeeping",
          href: getServiceHref("uae-bookkeeping"),
          icon: <Bank className="h-4 w-4" />,
        },
      ],
    },
    {
      title: "Pakistan",
      items: [
        {
          title: "Taxation",
          href: getServiceHref("pak-taxation"),
          icon: <FileText className="h-4 w-4" />,
        },
        {
          title: "Business Registration",
          icon: <Buildings className="h-4 w-4" />,
          children: [
            {
              title: "Private Company Registration",
              href: getServiceHref("pak-private-company-registration"),
            },
            { title: "LLP Registration", href: getServiceHref("pak-llp-registration") },
            {
              title: "Sole Business Registration",
              href: getServiceHref("pak-sole-business-registration"),
            },
          ],
        },
        {
          title: "Other Business Matters",
          href: getServiceHref("pak-other-business-matters"),
          icon: <Briefcase className="h-4 w-4" />,
        },
      ],
    },
  ],
};

const NAV_ITEMS: NavItem[] = [
  { label: "Services", href: "/services", megaMenu: servicesMenu },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "Resources", href: "/resources" },
  { label: "About", href: "/about" },
];

function ServiceMenuItem({
  item,
  nested = false,
  onNavigate,
}: {
  item: ServiceItem;
  nested?: boolean;
  onNavigate?: () => void;
}) {
  const [open, setOpen] = useState(false);
  if (item.children?.length)
    return (
      <div className="min-w-0">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center gap-2 rounded-[var(--fm-radius-sm)] px-fm-2 py-[7px] text-left font-display text-[13px] font-semibold leading-snug text-[var(--fm-text-primary)] transition-colors hover:bg-[var(--fm-lime-soft)] focus-visible:bg-[var(--fm-lime-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fm-lime)]/40"
        >
          {item.icon && (
            <span className="grid h-6 w-6 flex-shrink-0 place-items-center rounded-[var(--fm-radius-sm)] bg-[var(--fm-graphite-deep)] text-[var(--fm-lime)]">
              {item.icon}
            </span>
          )}
          <span>{item.title}</span>
          <CaretDown
            className={`ml-auto h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>
        {open && (
          <div className="ml-fm-2 rounded-r-[var(--fm-radius-md)] border-l-2 border-[var(--fm-border-accent)] bg-[var(--fm-surface-raised)] px-fm-2 py-fm-2 shadow-[var(--fm-shadow-subtle)]">
            {item.children.map((child) => (
              <ServiceMenuItem
                key={`${child.title}-${child.href ?? "group"}`}
                item={child}
                nested
                onNavigate={onNavigate}
              />
            ))}
          </div>
        )}
      </div>
    );
  if (!item.href) return null;
  return (
    <Link
      href={item.href}
      role="menuitem"
      onClick={onNavigate}
      className="group flex min-w-0 items-start gap-2 rounded-[var(--fm-radius-sm)] px-fm-2 py-[7px] transition-colors hover:bg-[var(--fm-lime-soft)] focus-visible:bg-[var(--fm-lime-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fm-lime)]/40"
    >
      {item.icon && (
        <span className="mt-0.5 grid h-6 w-6 flex-shrink-0 place-items-center rounded-[var(--fm-radius-sm)] bg-[var(--fm-graphite-deep)] text-[var(--fm-lime)]">
          {item.icon}
        </span>
      )}
      <span className="min-w-0">
        <span className="block font-display text-[13px] font-semibold leading-snug text-[var(--fm-text-primary)]">
          {item.title}
        </span>
        {item.description && (
          <span className="mt-0.5 block text-xs leading-relaxed text-[var(--fm-text-secondary)]">
            {item.description}
          </span>
        )}
      </span>
      {nested && (
        <CaretDown
          className="ml-auto mt-1 h-3 w-3 flex-shrink-0 -rotate-90 text-[var(--fm-text-tertiary)]"
          aria-hidden="true"
        />
      )}
    </Link>
  );
}

const navLink =
  "inline-flex items-center justify-center gap-1 rounded-[var(--fm-radius-md)] px-3 py-2 font-display text-[14px] font-medium text-[var(--fm-text-secondary)] transition-[background-color,color] duration-[var(--fm-motion-component)] ease-[var(--fm-motion-ease)] hover:bg-[var(--fm-lime)]/[.08] hover:text-[var(--fm-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fm-lime)]/40";

export default function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const servicesRef = useRef<HTMLLIElement>(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  useEffect(() => {
    const handleOutsidePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      const dropdown = document.getElementById("services-navbar-dropdown");
      if (servicesRef.current?.contains(target) || dropdown?.contains(target)) return;
      if (window.matchMedia("(max-width: 1023px)").matches) return;
      setServicesOpen(false);
    };
    document.addEventListener("pointerdown", handleOutsidePointerDown);
    return () => document.removeEventListener("pointerdown", handleOutsidePointerDown);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setServicesOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  async function handleLogout() {
    try {
      await logout();
    } finally {
      setMobileOpen(false);
      window.location.href = "/";
    }
  }

  return (
    <header className="absolute top-0 z-[100] w-full px-4 pt-4 sm:px-8 flex justify-center">
      <nav className="fixed top-[20px] mx-auto flex w-[92%] max-w-[1400px] items-center justify-between gap-fm-5 rounded-[var(--fm-radius-xl)] border border-[var(--fm-border)] bg-[var(--fm-graphite-deep)]/[.90] py-[10px] px-5 shadow-[var(--fm-shadow-elevated)] backdrop-blur-xl">
        <Link
          href="/"
          className="flex flex-shrink-0 items-center gap-1.5"
          aria-label="Audvertax home"
        >
          <Image
            src="/audvertax_logo.png"
            alt="Audvertax"
            width={130}
            height={35}
            className="h-5 w-auto"
            priority
          />
        </Link>
        <ul
          className="hidden flex-1 items-center justify-center gap-0.5 lg:flex"
          aria-label="Primary navigation"
        >
          {NAV_ITEMS.map((item) => (
            <li key={item.label} ref={item.megaMenu ? servicesRef : undefined}>
              {item.megaMenu ? (
                <button
                  type="button"
                  className={navLink}
                  aria-expanded={servicesOpen}
                  aria-controls="services-navbar-dropdown"
                  onClick={() => setServicesOpen((value) => !value)}
                >
                  {item.label}
                  <CaretDown
                    className={`h-3.5 w-3.5 transition-transform duration-[var(--fm-motion-micro)] ease-[var(--fm-motion-ease)] ${servicesOpen ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </button>
              ) : (
                <Link href={item.href!} className={navLink}>
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {servicesOpen && (
          <div
            id="services-navbar-dropdown"
            role="menu"
            aria-label="Services menu"
            className="absolute inset-x-0 left-[50%] top-[calc(100%+8px)] z-[120] mx-auto flex w-[min(1180px,calc(100vw-32px))] flex-col justify-center overflow-hidden rounded-[var(--fm-radius-feature)] border border-[var(--fm-border)] bg-[var(--fm-surface)] shadow-[var(--fm-shadow-elevated)] backdrop-blur-xl animate-[megaMenuCurtainDrop_320ms_var(--fm-motion-ease)_both]"
          >
            <div className="flex items-end justify-between gap-fm-6 border-b border-[var(--fm-border-soft)] px-fm-6 py-fm-5">
              <div>
                <div className="font-mono text-fm-label font-bold uppercase tracking-fm-label text-[var(--fm-lime)]">
                  Service
                </div>
                <h2 className="mt-1 font-display text-xl font-bold tracking-[-0.035em] text-[var(--fm-text-primary)]">
                  {servicesMenu.label}
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-relaxed text-[var(--fm-text-secondary)]">
                Business registration, taxation, compliance and operational support across key
                markets.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-0 p-fm-3 sm:grid-cols-2 lg:grid-cols-4">
              {servicesMenu.groups.map((group) => (
                <section
                  key={group.title}
                  className="min-w-0 px-fm-3 py-fm-3 lg:border-r lg:border-[var(--fm-border-soft)] lg:last:border-r-0"
                >
                  <h3 className="mb-fm-4 flex items-center gap-2.5 rounded-[var(--fm-radius-md)] border border-[var(--fm-border-soft)] bg-[var(--fm-surface-raised)] px-fm-3 py-fm-2.5 font-display text-base font-bold tracking-[-0.015em] text-[var(--fm-text-primary)] shadow-[var(--fm-shadow-subtle)]">
                    <span
                      aria-hidden="true"
                      className="h-2 w-2 flex-shrink-0 rounded-full bg-[var(--fm-lime)] shadow-[0_0_0_3px_var(--fm-lime-soft)]"
                    />
                    {group.title}
                  </h3>
                  <div className="space-y-fm-1">
                    {group.items.map((item) => (
                      <ServiceMenuItem
                        key={`${item.title}-${item.href ?? "group"}`}
                        item={item}
                        onNavigate={() => setServicesOpen(false)}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-shrink-0 items-center gap-2.5">
          {mounted && user ? (
            <div className="group relative">
              <Link
                href="/dashboard"
                aria-label="Open account"
                className="grid h-9 w-9 place-items-center rounded-full border border-[var(--fm-lime)]/30 bg-[var(--fm-surface)] text-[var(--fm-lime-bright)] transition-[transform,border-color,background-color] duration-[var(--fm-motion-micro)] ease-[var(--fm-motion-ease)] hover:-translate-y-px hover:border-[var(--fm-lime)]/60 hover:bg-[var(--fm-surface-raised)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fm-lime)]/40"
              >
                <span className="text-sm font-bold">{user.firstName.charAt(0).toUpperCase()}</span>
              </Link>
              <div className="invisible absolute right-0 top-11 w-52 translate-y-1 rounded-[var(--fm-radius-lg)] border border-[var(--fm-border)] bg-[var(--fm-surface)] p-2 opacity-0 shadow-[var(--fm-shadow-elevated)] transition-[transform,opacity,visibility] duration-[var(--fm-motion-component)] ease-[var(--fm-motion-ease)] group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                <div className="px-3 py-2">
                  <p className="truncate text-sm font-semibold text-[var(--fm-text-primary)]">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="truncate text-xs text-[var(--fm-text-tertiary)]">{user.email}</p>
                </div>
                <Link
                  href="/dashboard"
                  className="block rounded-[var(--fm-radius-md)] px-3 py-2 text-sm font-medium text-[var(--fm-text-secondary)] transition-[background-color,color] duration-[var(--fm-motion-micro)] ease-[var(--fm-motion-ease)] hover:bg-[var(--fm-lime)]/[.08] hover:text-[var(--fm-text-primary)] focus-visible:bg-[var(--fm-lime)]/[.08] focus-visible:text-[var(--fm-text-primary)]"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-[var(--fm-radius-md)] px-3 py-2 text-left text-sm font-medium text-[var(--fm-danger)] transition-[background-color,color] duration-[var(--fm-motion-micro)] ease-[var(--fm-motion-ease)] hover:bg-[var(--fm-danger)]/10 focus-visible:bg-[var(--fm-danger)]/10"
                >
                  <SignOut className="h-4 w-4" /> Sign out
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              aria-label="Sign in or create account"
              className="grid h-9 w-9 place-items-center rounded-full border border-[var(--fm-border)] bg-[var(--fm-surface)] text-[var(--fm-text-secondary)] transition-[transform,border-color,background-color,color] duration-[var(--fm-motion-micro)] ease-[var(--fm-motion-ease)] hover:-translate-y-px hover:border-[var(--fm-lime)]/50 hover:bg-[var(--fm-surface-raised)] hover:text-[var(--fm-lime-bright)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fm-lime)]/40"
            >
              <User className="h-4 w-4" />
            </Link>
          )}
          {/* <StartApplicationButton serviceSlug="usa-llc" className="hidden items-center gap-2 whitespace-nowrap rounded-[var(--fm-radius-pill)] border border-[var(--fm-lime)] bg-[var(--fm-lime)] px-5 py-[10px] font-display text-[13.5px] font-semibold text-[var(--fm-graphite-deep)] shadow-[var(--fm-shadow-glow)] transition-[transform,background-color,box-shadow] duration-[var(--fm-motion-component)] ease-[var(--fm-motion-ease)] hover:-translate-y-px hover:bg-[var(--fm-lime-bright)] hover:shadow-[var(--fm-shadow-glow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fm-lime)]/40 sm:inline-flex hidden">START MY LLC <ArrowRight weight="bold" className="h-[13px] w-[13px]" /></StartApplicationButton> */}
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((value) => !value)}
            className="flex h-9 w-9 items-center justify-center rounded-[var(--fm-radius-md)] border border-[var(--fm-border)] bg-[var(--fm-surface)] text-[var(--fm-text-secondary)] transition-colors hover:bg-[var(--fm-surface-raised)] hover:text-[var(--fm-text-primary)] lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <List className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div
          className="fixed left-4 right-4 top-[84px] z-[110] max-h-[calc(100vh-100px)] overscroll-contain overflow-y-auto rounded-[var(--fm-radius-xl)] border border-[var(--fm-border)] bg-[var(--fm-graphite-deep)] p-2 shadow-[var(--fm-shadow-elevated)] lg:hidden"
          aria-label="Mobile navigation"
        >
          <div className="border-b border-[var(--fm-border-soft)] px-3 py-3">
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--fm-lime)]">
              Navigation
            </span>
          </div>

          <div className="p-2">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="flex w-full items-center rounded-[var(--fm-radius-md)] px-3 py-3 font-display text-[16px] font-semibold text-[var(--fm-text-primary)] hover:bg-[var(--fm-lime-soft)]"
            >
              Home
            </Link>

            {NAV_ITEMS.filter((item) => item.label !== "Services").map((item) => (
              <Link
                key={item.label}
                href={item.href!}
                onClick={() => setMobileOpen(false)}
                className="flex w-full items-center rounded-[var(--fm-radius-md)] px-3 py-3 font-display text-[16px] font-semibold text-[var(--fm-text-primary)] hover:bg-[var(--fm-lime-soft)]"
              >
                {item.label}
              </Link>
            ))}

            <div className="mt-1 rounded-[var(--fm-radius-md)] border border-[var(--fm-border-soft)] bg-[var(--fm-surface)]">
              <button
                type="button"
                aria-expanded={servicesOpen}
                aria-controls="mobile-services-dropdown"
                onClick={() => setServicesOpen((value) => !value)}
                className="flex w-full items-center justify-between px-3 py-3 font-display text-[16px] font-semibold text-[var(--fm-text-primary)]"
              >
                Services
                <CaretDown
                  className={`h-4 w-4 transition-transform ${servicesOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>

              {servicesOpen && (
                <div
                  id="mobile-services-dropdown"
                  className="border-t border-[var(--fm-border-soft)] px-1 pb-2"
                >
                  {servicesMenu.groups.map((group) => (
                    <section key={group.title} className="px-2 py-3">
                      <h3 className="mb-2 font-display text-sm font-bold text-[var(--fm-text-primary)]">
                        {group.title}
                      </h3>
                      <div className="space-y-1">
                        {group.items.map((item) => (
                          <div key={`${item.title}-${item.href ?? "group"}`}>
                            {item.href ? (
                              <Link
                                href={item.href}
                                onClick={() => {
                                  setServicesOpen(false);
                                  setMobileOpen(false);
                                }}
                                className="flex w-full items-center gap-2 rounded-[var(--fm-radius-md)] px-3 py-2.5 font-display text-sm font-medium text-[var(--fm-text-secondary)] transition-colors hover:bg-[var(--fm-lime-soft)] hover:text-[var(--fm-text-primary)]"
                              >
                                {item.icon && (
                                  <span className="text-[var(--fm-lime)]" aria-hidden="true">
                                    {item.icon}
                                  </span>
                                )}
                                {item.title}
                              </Link>
                            ) : (
                              <div className="px-3 py-2.5">
                                <div className="flex items-center gap-2 font-display text-sm font-semibold text-[var(--fm-text-primary)]">
                                  {item.icon && (
                                    <span className="text-[var(--fm-lime)]" aria-hidden="true">
                                      {item.icon}
                                    </span>
                                  )}
                                  {item.title}
                                </div>
                                {item.children?.length ? (
                                  <div className="mt-1 ml-6 space-y-1 border-l border-[var(--fm-border-soft)] pl-2">
                                    {item.children.map((child) =>
                                      child.href ? (
                                        <Link
                                          key={child.title}
                                          href={child.href}
                                          onClick={() => {
                                            setServicesOpen(false);
                                            setMobileOpen(false);
                                          }}
                                          className="block rounded-[var(--fm-radius-md)] px-2 py-2 font-display text-xs text-[var(--fm-text-secondary)] hover:bg-[var(--fm-lime-soft)] hover:text-[var(--fm-text-primary)]"
                                        >
                                          {child.title}
                                        </Link>
                                      ) : null,
                                    )}
                                  </div>
                                ) : null}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
