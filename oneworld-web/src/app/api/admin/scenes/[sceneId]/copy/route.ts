import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { prisma } from "@/server/prisma";
import { SceneSourceType } from "@prisma/client";

export async function POST(_request: Request, { params }: { params: Promise<{ sceneId: string }> }) {
  const { sceneId } = await params;

  const scene = await prisma.sceneDefinition.findUnique({
    where: { sceneId },
    include: {
      executionConfig: true,
      authConfig: true,
      riskRule: true,
    },
  });

  if (!scene) {
    return NextResponse.json({ message: "Scene not found" }, { status: 404 });
  }

  const copied = await prisma.$transaction(async (tx) => {
    const copySceneId = `${scene.sceneId}-COPY-${Date.now()}`;
    const copySlug = `${scene.slug}-copy-${Date.now()}`;

    const created = await tx.sceneDefinition.create({
      data: {
        sceneId: copySceneId,
        name: `${scene.name}（副本）`,
        slug: copySlug,
        shortDescription: scene.shortDescription,
        detailedDescription: scene.detailedDescription,
        businessGoal: scene.businessGoal,
        painPoint: scene.painPoint,
        inputMaterials: scene.inputMaterials,
        outputResult: scene.outputResult,
        triggerType: scene.triggerType,
        cadence: scene.cadence,
        automationLevel: scene.automationLevel,
        riskLevel: scene.riskLevel,
        frequencyLevel: scene.frequencyLevel,
        reusableLevel: scene.reusableLevel,
        commercialValue: scene.commercialValue,
        launchPriority: scene.launchPriority,
        status: scene.status,
        displayTitle: scene.displayTitle,
        displaySubtitle: scene.displaySubtitle,
        marketingSummary: scene.marketingSummary,
        directPurchase: scene.directPurchase,
        customizationRequired: scene.customizationRequired,
        industryId: scene.industryId,
        roleId: scene.roleId,
        workflowTemplateId: scene.workflowTemplateId,
      },
    });

    await tx.sceneExecutionConfig.create({
      data: {
        sceneDefinitionId: created.id,
        toolchainList: scene.executionConfig?.toolchainList ?? "",
        dependencyServices: scene.executionConfig?.dependencyServices ?? "",
        environmentRequirements: scene.executionConfig?.environmentRequirements ?? "",
        modelRequirements: scene.executionConfig?.modelRequirements ?? "",
        preloadedKnowledge: scene.executionConfig?.preloadedKnowledge ?? "",
        executionStepsSummary: scene.executionConfig?.executionStepsSummary ?? "",
        promptStrategyRef: scene.executionConfig?.promptStrategyRef ?? "",
      },
    });

    await tx.sceneAuthConfig.create({
      data: {
        sceneDefinitionId: created.id,
        authRequiredList: scene.authConfig?.authRequiredList ?? "",
        accountTypesRequired: scene.authConfig?.accountTypesRequired ?? "",
        loginStateRequired: scene.authConfig?.loginStateRequired ?? "",
        fileAccessRequired: scene.authConfig?.fileAccessRequired ?? "",
        externalPlatformAccessRequired: scene.authConfig?.externalPlatformAccessRequired ?? "",
        minimalPermissionScope: scene.authConfig?.minimalPermissionScope ?? "",
        sensitivePermissions: scene.authConfig?.sensitivePermissions ?? "",
        authorizationNotes: scene.authConfig?.authorizationNotes ?? "",
      },
    });

    await tx.sceneRiskRule.create({
      data: {
        sceneDefinitionId: created.id,
        humanConfirmationPoints: scene.riskRule?.humanConfirmationPoints ?? "",
        forbiddenActions: scene.riskRule?.forbiddenActions ?? "",
        exceptionRules: scene.riskRule?.exceptionRules ?? "",
        rollbackSupported: scene.riskRule?.rollbackSupported ?? false,
        rollbackNotes: scene.riskRule?.rollbackNotes ?? "",
        alertingRequired: scene.riskRule?.alertingRequired ?? false,
        alertingChannels: scene.riskRule?.alertingChannels ?? "",
      },
    });

    await tx.sceneVersion.create({
      data: {
        sceneDefinitionId: created.id,
        version: "v1",
        sourceType: SceneSourceType.standard,
        maturityLevel: "draft",
        validatedCustomersCount: 0,
      },
    });

    return created;
  });

  revalidatePath("/admin/scenes");
  revalidatePath("/scenes");

  return NextResponse.json({ ok: true, item: copied });
}
