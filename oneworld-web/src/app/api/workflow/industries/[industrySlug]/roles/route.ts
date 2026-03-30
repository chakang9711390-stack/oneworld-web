import { NextResponse } from "next/server";
import { workflowIndustries, workflowRoles } from "@/server/api-data";

export async function GET(_request: Request, { params }: { params: Promise<{ industrySlug: string }> }) {
  const { industrySlug } = await params;
  const industry = workflowIndustries.find((item) => item.slug === industrySlug);

  return NextResponse.json({
    industry: industry ?? null,
    items: workflowRoles,
  });
}
