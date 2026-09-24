"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "./AuthProvider";

export default function GuestGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  if (loading || user) {
    return (
      <main className="grid min-h-[calc(100vh-80px)] place-items-center bg-[var(--fm-graphite)] px-6">
        <Loader2 className="h-6 w-6 animate-spin text-[var(--fm-lime)]" />
      </main>
    );
  }

  return <>{children}</>;
}
