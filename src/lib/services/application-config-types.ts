export type ApplicationFieldType =
  | "text"
  | "textarea"
  | "select"
  | "radio"
  | "country"
  | "state"
  | "number"
  | "date"
  | "checkbox"
  | "repeatable";

export type ApplicationOption = {
  label: string;
  value: string;
  description?: string;
};

export type ApplicationCondition = {
  field: string;
  equals?: string | number | boolean;
  notEquals?: string | number | boolean;
};

export type ApplicationField = {
  key: string;
  label: string;
  description?: string;
  type: ApplicationFieldType;
  required?: boolean;
  placeholder?: string;
  options?: ApplicationOption[];
  itemFields?: ApplicationField[];
  condition?: ApplicationCondition;
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    format?: "email" | "phone";
  };
};

export type ApplicationStep = {
  id: string;
  title: string;
  description: string;
  fields: ApplicationField[];
};

export type ApplicationConfig = {
  serviceSlug: string;
  steps: ApplicationStep[];
};
