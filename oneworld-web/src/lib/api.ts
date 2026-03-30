import { headers } from "next/headers";

async function resolveBaseUrl() {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const proto = headerStore.get("x-forwarded-proto") ?? "http";

  if (!host) {
    return "http://127.0.0.1:3000";
  }

  return `${proto}://${host}`;
}

async function request<T>(path: string): Promise<T> {
  const baseUrl = await resolveBaseUrl();
  const response = await fetch(`${baseUrl}${path}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${path}`);
  }

  return response.json() as Promise<T>;
}

export async function getOpcIndustries() {
  return request<{ items: Array<{ name: string; slug: string; description: string; count: number }> }>(
    "/api/opc/industries",
  );
}

export async function getOpcProjects(industrySlug: string) {
  return request<{
    industry: { name: string; slug: string; description: string; count: number } | null;
    items: Array<{ title: string; slug: string; description: string; status: string }>;
  }>(`/api/opc/industries/${industrySlug}/projects`);
}

export async function getWorkflowIndustries() {
  return request<{ items: Array<{ name: string; slug: string; description: string; count: number }> }>(
    "/api/workflow/industries",
  );
}

export async function getWorkflowRoles(industrySlug: string) {
  return request<{
    industry: { name: string; slug: string; description: string; count: number } | null;
    items: Array<{ name: string; slug: string; description: string; count: number }>;
  }>(`/api/workflow/industries/${industrySlug}/roles`);
}

export async function getWorkflowScenes(roleSlug: string) {
  return request<{
    role: { name: string; slug: string; description: string; count: number } | null;
    items: Array<{ title: string; slug: string; description: string; status: string }>;
  }>(`/api/workflow/roles/${roleSlug}/scenes`);
}

export async function getWorkspaceOverview() {
  return request<{
    opcCount: number;
    workflowCount: number;
    projectCount: number;
    opcSummary: string;
    workflowSummary: string;
    projectSummary: string;
  }>("/api/workspace/overview");
}
