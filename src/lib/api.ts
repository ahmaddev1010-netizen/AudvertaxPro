const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://audvertax-back-end.vercel.app";

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    cache: "no-store",
    credentials: "include",
    headers:
      options.body instanceof FormData
        ? options.headers
        : { "Content-Type": "application/json", ...(options.headers ?? {}) },
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const apiError = data?.error;
    const message =
      typeof apiError?.message === "string"
        ? apiError.message
        : response.status >= 500
          ? "The server could not complete this request. Please try again in a moment."
          : "The request could not be completed.";
    const error = new Error(message) as Error & {
      code?: string;
      status?: number;
      details?: unknown;
    };
    error.code = typeof apiError?.code === "string" ? apiError.code : undefined;
    error.status = response.status;
    error.details = apiError?.details;
    throw error;
  }
  return data as T;
}

export type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "customer" | "admin" | "staff";
  createdAt?: string;
  updatedAt?: string;
};

export type BillingLineItem = {
  key: string;
  label: string;
  amount: number;
  currency: string;
  total: number;
};

export type BillingOrder = {
  id: string;
  applicationId: string;
  userId: string;
  lineItems: BillingLineItem[];
  subtotal: number;
  total: number;
  currency: string;
  status: "pending" | "paid";
  createdAt: string;
  updatedAt: string;
};

type AuthResponse = { success: true; data: { user: AuthUser } };
type BillingResponse = { success: true; data: BillingOrder | null };

export type ApplicationResponse = {
  success: true;
  data: {
    application: ApplicationRecord;
    applicationId: string;
    documents: Record<string, unknown>;
    billing: BillingOrder | null;
    applicationMode: "paid" | "contact";
    message: string;
  };
};

export type ApplicationRecord = {
  id: string;
  user_id: string;
  service: string;
  serviceSlug?: string;
  data: Record<string, unknown>;
  documents: Record<string, unknown>;
  status?:
    | "draft"
    | "submitted"
    | "ready_for_payment"
    | "paid"
    | "processing"
    | "completed"
    | "changes_requested"
    | "cancelled";
  createdAt: string;
  updatedAt: string;
};

export async function getMyApplications() {
  return apiRequest<{ success: true; data: { applications: ApplicationRecord[] } }>(
    "/api/v1/applications",
  );
}

export async function submitApplication(formData: FormData) {
  const applicationField = formData.get("application");

  if (typeof applicationField === "string") {
    const application = JSON.parse(applicationField) as Record<string, unknown>;
    const currentUserResponse = await getCurrentUser();

    application.user_id = currentUserResponse.data.user.id;
    formData.set("application", JSON.stringify(application));
  }

  const response = await apiRequest<ApplicationResponse>("/api/v1/applications", {
    method: "POST",
    body: formData,
  });
  if (
    response.data.applicationMode === "paid" &&
    response.data.billing &&
    typeof window !== "undefined"
  ) {
    window.location.assign(
      `/checkout?applicationId=${encodeURIComponent(response.data.applicationId)}`,
    );
  }
  return response;
}

export async function login(email: string, password: string) {
  return apiRequest<AuthResponse>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function loginWithGoogle(credential: string) {
  return apiRequest<AuthResponse>("/api/v1/auth/google", {
    method: "POST",
    body: JSON.stringify({ credential }),
  });
}

export async function resetPassword(token: string, password: string) {
  return apiRequest<{ success: true; data: { message: string; resetToken?: string } }>(
    "/api/v1/auth/reset-password",
    {
      method: "POST",
      body: JSON.stringify({ token, password }),
    },
  );
}

export async function forgotPassword(email: string) {
  return apiRequest<{ success: true; data: { message: string; resetToken?: string } }>(
    "/api/v1/auth/forgot-password",
    {
      method: "POST",
      body: JSON.stringify({ email }),
    },
  );
}

export async function register(input: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) {
  return apiRequest<AuthResponse>("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function getCurrentUser() {
  return apiRequest<AuthResponse>("/api/v1/auth/me");
}

export async function logout() {
  return apiRequest<{ success: true; data: { message: string } }>("/api/v1/auth/logout", {
    method: "POST",
  });
}

export async function getApplication(applicationId: string) {
  return apiRequest<{ success: true; data: { application: ApplicationRecord } }>(
    `/api/v1/applications/${encodeURIComponent(applicationId)}`,
  );
}

export async function getBilling(applicationId: string) {
  return apiRequest<BillingResponse>(`/api/v1/billing/${encodeURIComponent(applicationId)}`);
}

export async function createBillingOrder(applicationId: string) {
  return apiRequest<{ success: true; data: BillingOrder }>(
    `/api/v1/billing/${encodeURIComponent(applicationId)}/order`,
    { method: "POST", body: JSON.stringify({}) },
  );
}

export async function payBillingOrder(
  applicationId: string,
  confirmation: { total: number; currency: string },
) {
  return apiRequest<{ success: true; data: BillingOrder }>(
    `/api/v1/billing/${encodeURIComponent(applicationId)}/payment`,
    {
      method: "POST",
      body: JSON.stringify({
        expectedTotal: confirmation.total,
        expectedCurrency: confirmation.currency,
      }),
    },
  );
}

export async function deleteApplication(applicationId: string) {
  return apiRequest<void>(`/api/v1/applications/${encodeURIComponent(applicationId)}`, {
    method: "DELETE",
  });
}

export async function getBillingOrders() {
  return apiRequest<{ success: true; data: BillingOrder[] }>("/api/v1/billing");
}

export type AdminApplicationRecord = ApplicationRecord & {
  serviceSlug?: string;
  customer: { id: string; email: string; firstName: string; lastName: string } | null;
};

export async function getAdminApplications() {
  return apiRequest<{ success: true; data: { applications: AdminApplicationRecord[] } }>(
    "/api/v1/admin/applications",
  );
}

export async function updateAdminApplicationStatus(
  applicationId: string,
  status: ApplicationRecord["status"],
  expectedUpdatedAt: string,
) {
  return apiRequest<{ success: true; data: { application: ApplicationRecord } }>(
    `/api/v1/admin/applications/${encodeURIComponent(applicationId)}/status`,
    { method: "PATCH", body: JSON.stringify({ status, expectedUpdatedAt }) },
  );
}

export type AdminApplicationDetail = {
  application: ApplicationRecord;
  customer: { id: string; email: string; firstName: string; lastName: string } | null;
  billing: BillingOrder | null;
  signedDocuments: { path: string; url: string | null }[];
};

export async function getAdminApplication(applicationId: string) {
  return apiRequest<{ success: true; data: AdminApplicationDetail }>(
    `/api/v1/admin/applications/${encodeURIComponent(applicationId)}`,
  );
}
