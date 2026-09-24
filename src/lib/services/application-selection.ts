import type { ApplicationSelection, Service } from "./domain";
import { getJurisdiction } from "./states";
import { getServiceBySlug } from "./commercial-catalog";

export type SelectionValidation = { valid: boolean; service?: Service; errors: string[] };

export function createApplicationSelection(
  input: Partial<ApplicationSelection> & Pick<ApplicationSelection, "serviceSlug">,
): ApplicationSelection {
  return {
    serviceSlug: input.serviceSlug,
    ...(input.packageSlug ? { packageSlug: input.packageSlug } : {}),
    ...(input.jurisdictionSlug ? { jurisdictionSlug: input.jurisdictionSlug } : {}),
    ...(input.variantSlug ? { variantSlug: input.variantSlug } : {}),
    addOnSlugs: [...new Set(input.addOnSlugs ?? [])],
    initialAnswers: input.initialAnswers,
  };
}

export function validateApplicationSelection(selection: ApplicationSelection): SelectionValidation {
  const errors: string[] = [];
  const service = getServiceBySlug(selection.serviceSlug);
  if (!service) return { valid: false, errors: [`Unknown service: ${selection.serviceSlug}`] };
  if (service.capabilities.requiresPackage && !selection.packageSlug)
    errors.push("A package is required for this service.");
  if (
    selection.packageSlug &&
    !service.packages?.some((item) => item.slug === selection.packageSlug)
  )
    errors.push(`Unknown package: ${selection.packageSlug}`);
  if (service.capabilities.requiresJurisdiction && !selection.jurisdictionSlug)
    errors.push("A jurisdiction is required for this service.");
  if (selection.jurisdictionSlug && !getJurisdiction(selection.jurisdictionSlug))
    errors.push(`Unknown jurisdiction: ${selection.jurisdictionSlug}`);
  if (service.variants?.length && !selection.variantSlug)
    errors.push("A service variant is required for this service.");
  if (
    selection.variantSlug &&
    !service.variants?.some((item) => item.variantSlug === selection.variantSlug)
  )
    errors.push(`Unknown service variant: ${selection.variantSlug}`);
  if (selection.addOnSlugs.length && !service.capabilities.supportsAddOns)
    errors.push("This service does not support add-ons.");
  for (const slug of selection.addOnSlugs) {
    const addOn = service.addOns?.find((item) => item.slug === slug);
    if (!addOn) errors.push(`Unknown add-on: ${slug}`);
    else if (addOn.available === false) errors.push(`Add-on is unavailable: ${slug}`);
  }
  return { valid: errors.length === 0, service, errors };
}

export function selectionToApplicationInput(selection: ApplicationSelection) {
  return {
    serviceSlug: selection.serviceSlug,
    packageSlug: selection.packageSlug,
    formationState: selection.jurisdictionSlug,
    variantSlug: selection.variantSlug,
    addOnSlugs: selection.addOnSlugs,
  };
}
