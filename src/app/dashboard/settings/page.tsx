"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { User, Bell, Shield, Save, CheckCircle2 } from "lucide-react";
import { Card, IconContainer, SectionLabel } from "@/components/ui/design-system";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";

export default function SettingsPage() {
  const { user } = useAuth();
  const settingsKey = user ? `audvertax.settings:${user.id}` : "audvertax.settings";
  const [name, setName] = useState(user ? `${user.firstName} ${user.lastName}`.trim() : "");
  const [email, setEmail] = useState("");
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [applicationAlerts, setApplicationAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    try {
      const stored = JSON.parse(window.localStorage.getItem(settingsKey) || "null");
      if (stored && typeof stored === "object") {
        if (typeof stored.name === "string") setName(stored.name);
        if (typeof stored.email === "string") setEmail(stored.email);
        if (typeof stored.emailUpdates === "boolean") setEmailUpdates(stored.emailUpdates);
        if (typeof stored.applicationAlerts === "boolean")
          setApplicationAlerts(stored.applicationAlerts);
      }
    } catch {
      window.localStorage.removeItem(settingsKey);
    }
  }, [settingsKey, user]);

  function save() {
    window.localStorage.setItem(
      settingsKey,
      JSON.stringify({ name, email, emailUpdates, applicationAlerts }),
    );
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  }

  return (
    <main className="min-h-screen bg-[var(--fm-graphite)] text-[var(--fm-text-primary)]">
      <header className="border-b border-[var(--fm-border)] bg-[var(--fm-graphite-deep)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 md:px-8">
          <div>
            <SectionLabel>Audvertax</SectionLabel>
            <h1 className="mt-1 font-semibold">Settings</h1>
          </div>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-[var(--fm-text-secondary)] hover:text-[var(--fm-text-primary)]"
          >
            Back to dashboard
          </Link>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-8 md:py-12">
        <div className="mb-8">
          <SectionLabel>Account</SectionLabel>
          <h2 className="mt-1 text-3xl font-semibold tracking-[-0.04em]">Settings</h2>
          <p className="mt-2 text-sm text-[var(--fm-text-secondary)]">
            Manage your customer profile and notification preferences.
          </p>
        </div>
        <div className="space-y-6">
          <Card variant="standard" className="p-6">
            <div className="flex items-center gap-3">
              <IconContainer>
                <User size={19} />
              </IconContainer>
              <div>
                <h3 className="font-semibold">Profile</h3>
                <p className="text-xs text-[var(--fm-text-tertiary)]">
                  Basic customer information.
                </p>
              </div>
            </div>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <label className="text-sm font-medium">
                Full name
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 h-11 w-full rounded-[var(--fm-radius-md)] border border-[var(--fm-border)] bg-[var(--fm-surface-raised)] px-3 text-sm text-[var(--fm-text-primary)] outline-none placeholder:text-[var(--fm-text-tertiary)] focus:border-[var(--fm-border-accent)] focus:ring-2 focus:ring-[var(--fm-lime-soft)]"
                />
              </label>
              <label className="text-sm font-medium">
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-2 h-11 w-full rounded-[var(--fm-radius-md)] border border-[var(--fm-border)] bg-[var(--fm-surface-raised)] px-3 text-sm text-[var(--fm-text-primary)] outline-none placeholder:text-[var(--fm-text-tertiary)] focus:border-[var(--fm-border-accent)] focus:ring-2 focus:ring-[var(--fm-lime-soft)]"
                />
              </label>
            </div>
          </Card>
          <Card variant="standard" className="p-6">
            <div className="flex items-center gap-3">
              <IconContainer>
                <Bell size={19} />
              </IconContainer>
              <div>
                <h3 className="font-semibold">Notifications</h3>
                <p className="text-xs text-[var(--fm-text-tertiary)]">
                  Choose which customer updates you receive.
                </p>
              </div>
            </div>
            <div className="mt-5 divide-y divide-[var(--fm-border)]">
              <label className="flex cursor-pointer items-center justify-between py-4">
                <span>
                  <span className="block text-sm font-semibold">Email updates</span>
                  <span className="mt-1 block text-xs text-[var(--fm-text-secondary)]">
                    General service and account updates.
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={emailUpdates}
                  onChange={(e) => setEmailUpdates(e.target.checked)}
                  className="h-5 w-5 accent-[var(--fm-lime)]"
                />
              </label>
              <label className="flex cursor-pointer items-center justify-between py-4">
                <span>
                  <span className="block text-sm font-semibold">Application alerts</span>
                  <span className="mt-1 block text-xs text-[var(--fm-text-secondary)]">
                    Important changes to your LLC application.
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={applicationAlerts}
                  onChange={(e) => setApplicationAlerts(e.target.checked)}
                  className="h-5 w-5 accent-[var(--fm-lime)]"
                />
              </label>
            </div>
          </Card>
          <Card variant="standard" className="p-6">
            <div className="flex items-center gap-4">
              <IconContainer>
                <Shield size={19} />
              </IconContainer>
              <div>
                <h3 className="font-semibold">Security</h3>
                <p className="text-sm leading-6 text-[var(--fm-text-secondary)]">
                  Authentication, sessions and account security will be connected when customer
                  authentication is introduced.
                </p>
              </div>
            </div>
          </Card>
          <div className="flex items-center justify-end gap-3">
            <span className="text-sm font-medium text-[var(--fm-success)]">
              {saved && (
                <>
                  <CheckCircle2 size={16} className="mr-1 inline" />
                  Saved locally for this account
                </>
              )}
            </span>
            <Button onClick={save}>
              <Save size={16} />
              Save settings
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
