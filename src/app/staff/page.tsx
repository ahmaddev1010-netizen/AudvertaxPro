"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { BriefcaseBusiness, LogOut, Menu, Users, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { StaffUsersView } from "@/components/staff/StaffUsersView";

export default function StaffPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role !== "staff") router.replace(user.role === "admin" ? "/admin" : "/dashboard");
  }, [loading, router, user]);

  if (!mounted || loading || !user || user.role !== "staff") {
    return (
      <main className="grid min-h-screen place-items-center bg-[var(--fm-graphite)]">
        <p className="fm-label">Opening staff portal...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--fm-graphite)] text-[var(--fm-text-primary)]">
      {mobileSidebarOpen && <button type="button" aria-label="Close sidebar" onClick={() => setMobileSidebarOpen(false)} className="fixed inset-0 z-40 bg-black/40 lg:hidden" />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[268px] flex-col border-r border-fm-border bg-fm-surface px-4 py-5 shadow-fm-elevated transition-transform lg:translate-x-0 ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-start justify-between px-2">
          <div>
            <p className="text-3xl font-semibold tracking-tight">audvertax</p>
            <p className="fm-label mt-1">Staff workspace</p>
          </div>
          <button type="button" aria-label="Close sidebar" onClick={() => setMobileSidebarOpen(false)} className="rounded-fm-md p-2 text-fm-text-secondary hover:bg-fm-surface-raised lg:hidden"><X size={18} /></button>
        </div>
        <nav className="mt-8 space-y-2">
          <div className="flex items-center gap-3 rounded-fm-md bg-fm-lime px-3 py-3 text-sm font-semibold text-fm-graphite-deep"><Users size={18} /> Customers</div>
        </nav>
        <div className="mt-auto border-t border-fm-border-soft pt-4">
          <button type="button" onClick={() => void logout().then(() => router.replace("/login"))} className="flex w-full items-center gap-3 rounded-fm-md border border-fm-danger/30 bg-fm-danger/5 px-3 py-3 text-left text-sm font-semibold text-fm-danger hover:bg-fm-danger/10"><LogOut size={17} /> Logout</button>
        </div>
      </aside>
      <div className="min-h-screen lg:pl-[268px]">
        <header className="flex items-center justify-between gap-4 border-b border-fm-border bg-fm-surface px-4 py-4 sm:px-6 lg:px-8">
          <button type="button" aria-label="Open sidebar" onClick={() => setMobileSidebarOpen(true)} className="rounded-fm-md border border-fm-border p-2 lg:hidden"><Menu size={19} /></button>
          <div className="hidden items-center gap-2 text-sm font-semibold text-fm-text-secondary sm:flex"><BriefcaseBusiness size={17} className="text-fm-lime" /> Operations workspace</div>
          <div className="ml-auto flex items-center gap-3 text-sm text-fm-text-secondary"><span className="hidden sm:inline">{user.firstName} {user.lastName}</span><span className="rounded-full bg-fm-lime-soft px-2.5 py-1 text-xs font-semibold text-fm-lime">Staff</span></div>
        </header>
        <div className="px-4 py-5 sm:px-6 lg:px-8"><div className="mx-auto max-w-[1600px]"><StaffUsersView /></div></div>
      </div>
    </main>
  );
}
