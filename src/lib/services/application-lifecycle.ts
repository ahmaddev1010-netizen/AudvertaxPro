export function isCustomerApplicationEditable(status: string | undefined | null) {
  if (!status) return true;
  return ![
    "submitted",
    "ready_for_payment",
    "paid",
    "processing",
    "completed",
    "cancelled",
  ].includes(status);
}
