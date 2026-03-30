import { NextResponse } from "next/server";
import { opcIndustries, opcProjects } from "@/server/api-data";

export async function GET(_request: Request, { params }: { params: Promise<{ industrySlug: string }> }) {
  const { industrySlug } = await params;
  const industry = opcIndustries.find((item) => item.slug === industrySlug);

  return NextResponse.json({
    industry: industry ?? null,
    items: opcProjects,
  });
}
