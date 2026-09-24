"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "./AuthProvider";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <main className="grid min-h-screen place-items-center bg-[var(--fm-graphite)]">
        <Loader2 className="h-6 w-6 animate-spin text-[var(--fm-lime)]" />
      </main>
    );
  }

  return <>{children}</>;
}
