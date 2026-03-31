import { NextResponse } from "next/server";
import { prisma } from "@/server/prisma";

export async function GET(_request: Request, { params }: { params: Promise<{ sceneId: string }> }) {
  const { sceneId } = await params;

  const item = await prisma.sceneDefinition.findUnique({
    where: { sceneId },
    include: {
      industry: true,
      role: true,
      workflowTemplate: true,
      executionConfig: true,
      authConfig: true,
      riskRule: true,
      versions: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!item) {
    return NextResponse.json({ message: "Scene not found" }, { status: 404 });
  }

  return NextResponse.json({
    item: {
      sceneId: item.sceneId,
      name: item.name,
      slug: item.slug,
      shortDescription: item.shortDescription,
      detailedDescription: item.detailedDescription,
      businessGoal: item.businessGoal,
      painPoint: item.painPoint,
      inputMaterials: item.inputMaterials,
      outputResult: item.outputResult,
      triggerType: item.triggerType,
      cadence: item.cadence,
      automationLevel: item.automationLevel,
      riskLevel: item.riskLevel,
      frequencyLevel: item.frequencyLevel,
      reusableLevel: item.reusableLevel,
      commercialValue: item.commercialValue,
      launchPriority: item.launchPriority,
      status: item.status,
      displayTitle: item.displayTitle,
      displaySubtitle: item.displaySubtitle,
      marketingSummary: item.marketingSummary,
      directPurchase: item.directPurchase,
      customizationRequired: item.customizationRequired,
      industry: {
        name: item.industry.name,
        slug: item.industry.slug,
        description: item.industry.description,
      },
      role: {
        name: item.role.name,
        slug: item.role.slug,
        description: item.role.description,
      },
      workflow: {
        name: item.workflowTemplate.name,
        slug: item.workflowTemplate.slug,
        description: item.workflowTemplate.description,
      },
      executionConfig: item.executionConfig,
      authConfig: item.authConfig,
      riskRule: item.riskRule,
      versions: item.versions,
    },
  });
}
