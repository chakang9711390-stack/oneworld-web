import { NextResponse } from "next/server";
import { prisma } from "@/server/prisma";

export async function GET() {
  const items = await prisma.sceneDefinition.findMany({
    where: {
      status: "active",
    },
    orderBy: [
      { launchPriority: "asc" },
      { createdAt: "asc" },
    ],
    include: {
      industry: {
        select: { name: true, slug: true },
      },
      role: {
        select: { name: true, slug: true },
      },
      workflowTemplate: {
        select: { name: true, slug: true },
      },
    },
  });

  return NextResponse.json({
    items: items.map((item) => ({
      sceneId: item.sceneId,
      name: item.name,
      slug: item.slug,
      summary: item.shortDescription,
      automationLevel: item.automationLevel,
      riskLevel: item.riskLevel,
      frequencyLevel: item.frequencyLevel,
      launchPriority: item.launchPriority,
      industry: item.industry,
      role: item.role,
      workflow: item.workflowTemplate,
    })),
  });
}
