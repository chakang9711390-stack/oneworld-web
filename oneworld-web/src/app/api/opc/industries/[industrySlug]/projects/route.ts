import { NextResponse } from "next/server";
import { prisma } from "@/server/prisma";

export async function GET(_request: Request, { params }: { params: Promise<{ industrySlug: string }> }) {
  const { industrySlug } = await params;

  const industry = await prisma.industry.findUnique({
    where: { slug: industrySlug },
    include: {
      opcProjectTemplates: {
        where: { status: "active" },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  return NextResponse.json({
    industry: industry
      ? {
          name: industry.name,
          slug: industry.slug,
          description: industry.description,
          count: industry.opcProjectTemplates.length,
        }
      : null,
    items:
      industry?.opcProjectTemplates.map((item) => ({
        title: item.title,
        slug: item.slug,
        description: item.description,
        status: item.isCreateEntry ? "创建入口" : "案例卡片",
      })) ?? [],
  });
}
