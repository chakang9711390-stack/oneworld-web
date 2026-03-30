import { NextResponse } from "next/server";
import { prisma } from "@/server/prisma";

export async function GET(_request: Request, { params }: { params: Promise<{ industrySlug: string }> }) {
  const { industrySlug } = await params;

  const industry = await prisma.industry.findUnique({
    where: { slug: industrySlug },
    include: {
      workflowRoles: {
        where: { status: "active" },
        orderBy: { sortOrder: "asc" },
        include: { workflowScenes: true },
      },
    },
  });

  return NextResponse.json({
    industry: industry
      ? {
          name: industry.name,
          slug: industry.slug,
          description: industry.description,
          count: industry.workflowRoles.length,
        }
      : null,
    items:
      industry?.workflowRoles.map((item) => ({
        name: item.name,
        slug: item.slug,
        description: item.description,
        count: item.workflowScenes.length,
      })) ?? [],
  });
}
