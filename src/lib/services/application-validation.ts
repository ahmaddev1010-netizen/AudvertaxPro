import type { ApplicationField } from "./application-config-types";
import { conditionMatches } from "../application/conditions";

export function isEmptyApplicationValue(value: unknown) {
  return (
    value === undefined ||
    value === null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  );
}

export function validateApplicationField(
  field: ApplicationField,
  value: unknown,
  answers: Record<string, unknown>,
  errors: Record<string, string>,
  keyPrefix = "",
) {
  if (!conditionMatches(field.condition, answers)) return;

  const key = keyPrefix ? `${keyPrefix}.${field.key}` : field.key;

  if (field.required && isEmptyApplicationValue(value)) {
    errors[key] = "This field is required.";
    return;
  }

  if (field.validation?.format === "email" && typeof value === "string" && value) {
    if (!/^\S+@\S+\.\S+$/.test(value)) errors[key] = "Enter a valid email address.";
  }

  if (field.validation?.format === "phone" && typeof value === "string" && value) {
    if (!/^\+?[0-9][0-9\s().-]{6,29}$/.test(value)) errors[key] = "Enter a valid phone number.";
  }

  if (field.type !== "repeatable" || !Array.isArray(value)) return;

  value.forEach((item, index) => {
    if (!item || typeof item !== "object") return;
    const itemAnswers = item as Record<string, unknown>;
    for (const itemField of field.itemFields ?? [])
      validateApplicationField(
        itemField,
        itemAnswers[itemField.key],
        itemAnswers,
        errors,
        `${key}.${index}`,
      );
  });
}

export function validateApplicationFields(
  fields: ApplicationField[],
  answers: Record<string, unknown>,
) {
  const errors: Record<string, string> = {};
  for (const field of fields) validateApplicationField(field, answers[field.key], answers, errors);
  return errors;
}

export function flattenApplicationValidationErrors(errors: Record<string, string>) {
  return Object.values(errors);
}
