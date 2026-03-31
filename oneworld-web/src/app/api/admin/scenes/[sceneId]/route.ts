import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { prisma } from "@/server/prisma";
import { CommonStatus, SceneAutomationLevel, ScenePriorityLevel, SceneRiskLevel } from "@prisma/client";

function pickEnumValue<T extends Record<string, string>>(enumObject: T, value?: string | null) {
  if (!value) return undefined;
  return Object.values(enumObject).includes(value) ? (value as T[keyof T]) : undefined;
}

export async function PATCH(request: Request, { params }: { params: Promise<{ sceneId: string }> }) {
  const { sceneId } = await params;
  const body = await request.json();

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

  const updated = await prisma.$transaction(async (tx) => {
    const sceneDefinition = await tx.sceneDefinition.update({
      where: { id: scene.id },
      data: {
        name: body.name ?? scene.name,
        shortDescription: body.shortDescription ?? scene.shortDescription,
        marketingSummary: body.marketingSummary ?? scene.marketingSummary,
        businessGoal: body.businessGoal ?? scene.businessGoal,
        painPoint: body.painPoint ?? scene.painPoint,
        inputMaterials: body.inputMaterials ?? scene.inputMaterials,
        outputResult: body.outputResult ?? scene.outputResult,
        triggerType: body.triggerType ?? scene.triggerType,
        cadence: body.cadence ?? scene.cadence,
        automationLevel: pickEnumValue(SceneAutomationLevel, body.automationLevel) ?? scene.automationLevel,
        riskLevel: pickEnumValue(SceneRiskLevel, body.riskLevel) ?? scene.riskLevel,
        launchPriority: pickEnumValue(ScenePriorityLevel, body.launchPriority) ?? scene.launchPriority,
        directPurchase: typeof body.directPurchase === "boolean" ? body.directPurchase : scene.directPurchase,
        customizationRequired:
          typeof body.customizationRequired === "boolean" ? body.customizationRequired : scene.customizationRequired,
        status: pickEnumValue(CommonStatus, body.status) ?? scene.status,
        displayTitle: body.name ?? scene.displayTitle ?? scene.name,
      },
    });

    if (scene.executionConfig) {
      await tx.sceneExecutionConfig.update({
        where: { sceneDefinitionId: scene.id },
        data: {
          toolchainList: body.toolchainList ?? scene.executionConfig.toolchainList,
        },
      });
    }

    if (scene.authConfig) {
      await tx.sceneAuthConfig.update({
        where: { sceneDefinitionId: scene.id },
        data: {
          authRequiredList: body.authRequiredList ?? scene.authConfig.authRequiredList,
        },
      });
    }

    if (scene.riskRule) {
      await tx.sceneRiskRule.update({
        where: { sceneDefinitionId: scene.id },
        data: {
          humanConfirmationPoints: body.humanConfirmationPoints ?? scene.riskRule.humanConfirmationPoints,
          exceptionRules: body.exceptionRules ?? scene.riskRule.exceptionRules,
        },
      });
    }

    return sceneDefinition;
  });

  revalidatePath("/admin/scenes");
  revalidatePath(`/admin/scenes/${sceneId}`);
  revalidatePath(`/admin/scenes/${sceneId}/edit`);
  revalidatePath("/scenes");
  revalidatePath(`/scenes/${sceneId}`);

  return NextResponse.json({ ok: true, item: updated });
}
