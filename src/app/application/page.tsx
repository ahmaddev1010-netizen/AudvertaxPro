"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import USALLCApplication from "@/components/application/USALLCApplication";
import UKLTDApplication from "@/components/application/UKLTDApplication";
import USATaxationApplication from "@/components/application/USATaxationApplication";
import UKCorporateTaxApplication from "@/components/application/UKCorporateTaxApplication";

export default function ApplicationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--fm-graphite)]" />}>
      <ApplicationPageContent />
    </Suspense>
  );
}

function ApplicationPageContent() {
  const searchParams = useSearchParams();
  const service = searchParams.get("service");

  if (service === "uk-ltd") return <UKLTDApplication />;
  if (service === "uk-corporate-tax") return <UKCorporateTaxApplication />;
  if (service === "itin-processing" || service === "ein-without-ssn") {
    return <USATaxationApplication />;
  }

  return <USALLCApplication />;
}
