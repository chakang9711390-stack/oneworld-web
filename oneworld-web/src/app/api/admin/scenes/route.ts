import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { prisma } from "@/server/prisma";
import { CommonStatus, SceneAutomationLevel, SceneFrequencyLevel, ScenePriorityLevel, SceneRiskLevel, SceneSourceType } from "@prisma/client";
import { requireAdmin } from "@/lib/server/auth";

function pickEnumValue<T extends Record<string, string>>(enumObject: T, value?: string | null, fallback?: T[keyof T]) {
  if (!value) return fallback;
  return Object.values(enumObject).includes(value) ? (value as T[keyof T]) : fallback;
}

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export async function POST(request: Request) {
  const admin = await requireAdmin();

  if (!admin.ok) {
    return NextResponse.json({ message: admin.message }, { status: admin.status });
  }

  const body = await request.json();

  if (!body.name || !body.industryId || !body.roleId || !body.workflowTemplateId) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  const baseSlug = slugify(body.slug || body.name || "scene");
  const sceneId = body.sceneId || `SCN-${Date.now()}`;
  const slug = `${baseSlug}-${Date.now()}`;

  const created = await prisma.$transaction(async (tx) => {
    const scene = await tx.sceneDefinition.create({
      data: {
        sceneId,
        name: body.name,
        slug,
        shortDescription: body.shortDescription || "",
        marketingSummary: body.marketingSummary || body.shortDescription || "",
        businessGoal: body.businessGoal || "",
        painPoint: body.painPoint || "",
        inputMaterials: body.inputMaterials || "",
        outputResult: body.outputResult || "",
        triggerType: body.triggerType || "manual",
        cadence: body.cadence || "ondemand",
        automationLevel: pickEnumValue(SceneAutomationLevel, body.automationLevel, SceneAutomationLevel.A3),
        riskLevel: pickEnumValue(SceneRiskLevel, body.riskLevel, SceneRiskLevel.R1),
        frequencyLevel: pickEnumValue(SceneFrequencyLevel, body.frequencyLevel, SceneFrequencyLevel.A),
        reusableLevel: body.reusableLevel || "medium",
        commercialValue: body.commercialValue || "medium",
        launchPriority: pickEnumValue(ScenePriorityLevel, body.launchPriority, ScenePriorityLevel.P1),
        status: CommonStatus.disabled,
        displayTitle: body.name,
        displaySubtitle: body.displaySubtitle || "",
        directPurchase: false,
        customizationRequired: false,
        industryId: body.industryId,
        roleId: body.roleId,
        workflowTemplateId: body.workflowTemplateId,
      },
    });

    await tx.sceneExecutionConfig.create({
      data: {
        sceneDefinitionId: scene.id,
        toolchainList: body.toolchainList || "",
      },
    });

    await tx.sceneAuthConfig.create({
      data: {
        sceneDefinitionId: scene.id,
        authRequiredList: body.authRequiredList || "",
      },
    });

    await tx.sceneRiskRule.create({
      data: {
        sceneDefinitionId: scene.id,
        humanConfirmationPoints: body.humanConfirmationPoints || "",
        exceptionRules: body.exceptionRules || "",
        rollbackSupported: false,
        alertingRequired: true,
      },
    });

    await tx.sceneVersion.create({
      data: {
        sceneDefinitionId: scene.id,
        version: "v1",
        sourceType: SceneSourceType.standard,
        maturityLevel: "draft",
        validatedCustomersCount: 0,
      },
    });

    return scene;
  });

  revalidatePath("/admin/scenes");
  revalidatePath("/scenes");

  return NextResponse.json({ ok: true, item: created });
}
