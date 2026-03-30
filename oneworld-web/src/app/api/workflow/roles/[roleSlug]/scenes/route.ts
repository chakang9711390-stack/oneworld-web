import { NextResponse } from "next/server";
import { workflowRoles, workflowScenes } from "@/server/api-data";

export async function GET(_request: Request, { params }: { params: Promise<{ roleSlug: string }> }) {
  const { roleSlug } = await params;
  const role = workflowRoles.find((item) => item.slug === roleSlug);

  return NextResponse.json({
    role: role ?? null,
    items: workflowScenes,
  });
}
