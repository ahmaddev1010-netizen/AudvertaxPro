"use client";

import { useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

/**
 * Keeps legacy dashboard presentation data synchronized with the authenticated
 * user. Authentication itself is owned exclusively by AuthProvider.
 *
 * The dashboard historically initialized its profile fields from localStorage.
 * If an older user's data is still there when a new user signs in, update it
 * and reload once so the dashboard re-initializes from the current account.
 */
export default function DashboardUserSync() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const nextName = `${user.firstName} ${user.lastName}`.trim();
    const current = JSON.parse(
      window.localStorage.getItem(`audvertax.settings:${user.id}`) || "{}",
    );
    const identityChanged = current.name !== nextName || current.email !== user.email;

    if (!identityChanged) return;

    window.localStorage.setItem(
      `audvertax.settings:${user.id}`,
      JSON.stringify({
        ...current,
        name: nextName,
        email: user.email,
      }),
    );

    // DashboardPage historically reads these values during initial state
    // creation. Reload only when the persisted identity actually changed so
    // it cannot continue displaying the previous user's information.
    window.location.reload();
  }, [user]);

  return null;
}
