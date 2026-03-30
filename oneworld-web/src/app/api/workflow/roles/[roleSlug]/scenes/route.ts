import { NextResponse } from "next/server";
import { prisma } from "@/server/prisma";

export async function GET(_request: Request, { params }: { params: Promise<{ roleSlug: string }> }) {
  const { roleSlug } = await params;

  const role = await prisma.workflowRole.findUnique({
    where: { slug: roleSlug },
    include: {
      workflowScenes: {
        where: { status: "active" },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  return NextResponse.json({
    role: role
      ? {
          name: role.name,
          slug: role.slug,
          description: role.description,
          count: role.workflowScenes.length,
        }
      : null,
    items:
      role?.workflowScenes.map((item) => ({
        title: item.title,
        slug: item.slug,
        description: item.description,
        status: item.isGenerateEntry ? "生成入口" : "场景卡片",
      })) ?? [],
  });
}
