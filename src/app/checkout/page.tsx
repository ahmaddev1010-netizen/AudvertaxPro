import CheckoutForm from "@/components/checkout/CheckoutForm";
import { Card, SectionLabel } from "@/components/ui/design-system";

export const metadata = {
  title: "Checkout | Audvertax",
  description: "Complete your Audvertax service order.",
};

type Props = { searchParams: Promise<{ applicationId?: string }> };

export default async function CheckoutPage({ searchParams }: Props) {
  const params = await searchParams;

  if (!params.applicationId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--fm-graphite-deep)] px-6">
        <Card className="w-full max-w-md p-8 text-center">
          <SectionLabel>Checkout</SectionLabel>
          <h1 className="mt-3 text-xl font-semibold text-[var(--fm-text-primary)]">
            Checkout unavailable
          </h1>
          <p className="mt-2 text-sm leading-6 text-[var(--fm-text-secondary)]">
            We couldn&apos;t find the application associated with this checkout.
          </p>
        </Card>
      </main>
    );
  }

  return <CheckoutForm applicationId={params.applicationId} />;
}
