"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isDashboard = pathname === "/dashboard";
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");
  const isApplication = pathname === "/application" || pathname.endsWith("/application");
  const showSiteChrome = !isDashboard && !isAdmin && !isApplication;

  const applicationBackPath =
    pathname === "/application"
      ? (() => {
          const service = searchParams.get("service");
          return service ? `/${service}` : "/";
        })()
      : pathname.replace(/\/application\/?$/, "");

  return (
    <div className="relative">
      {showSiteChrome && <NavBar />}
      {isApplication && (
        <div className="fm-application-backlink-wrap">
          <Link href={applicationBackPath} className="fm-application-backlink">
            <span aria-hidden="true">←</span>
            <span>Back</span>
          </Link>
        </div>
      )}
      {children}
      {showSiteChrome && <Footer />}
    </div>
  );
}
