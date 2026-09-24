import { Suspense } from "react";
import USATaxationApplication from "@/components/application/USATaxationApplication";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--fm-graphite)]" />}>
      <USATaxationApplication />
    </Suspense>
  );
}
