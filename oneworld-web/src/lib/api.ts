const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${path}`);
  }

  return response.json() as Promise<T>;
}

export async function getOpcIndustries() {
  return request<{ items: Array<{ name: string; slug: string; description: string; count: number }> }>(
    '/api/opc/industries',
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
    '/api/workflow/industries',
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
  }>('/api/workspace/overview');
}
