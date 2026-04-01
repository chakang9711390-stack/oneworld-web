import { CommonStatus, Prisma } from "@prisma/client";
import { prisma } from "@/server/prisma";

function buildWorkflowSceneSlug(baseSlug: string) {
  return `${baseSlug}-wf`;
}

async function ensureUniqueWorkflowSceneSlug(tx: Prisma.TransactionClient, baseSlug: string, sceneDefinitionId: string) {
  const existingByScene = await tx.workflowScene.findFirst({
    where: { sceneDefinitionId },
    select: { slug: true },
  });

  if (existingByScene?.slug) return existingByScene.slug;

  const initialSlug = buildWorkflowSceneSlug(baseSlug);
  const existingSlug = await tx.workflowScene.findUnique({ where: { slug: initialSlug } });

  if (!existingSlug) return initialSlug;

  return `${initialSlug}-${Date.now()}`;
}

export async function syncWorkflowSceneWithSceneStatus(sceneId: string, nextStatus: CommonStatus) {
  return prisma.$transaction(async (tx) => {
    const scene = await tx.sceneDefinition.findUnique({
      where: { sceneId },
      include: {
        workflowScenes: true,
      },
    });

    if (!scene) {
      throw new Error("SCENE_NOT_FOUND");
    }

    const updatedScene = await tx.sceneDefinition.update({
      where: { id: scene.id },
      data: { status: nextStatus },
    });

    const existingWorkflowScene = scene.workflowScenes[0] ?? null;

    if (nextStatus === CommonStatus.active) {
      const workflowSceneData = {
        roleId: scene.roleId,
        title: scene.displayTitle || scene.name,
        description: scene.shortDescription || scene.marketingSummary || "",
        status: CommonStatus.active,
        isGenerateEntry: false,
        sceneDefinitionId: scene.id,
        sourceType: "published_scene",
      };

      if (existingWorkflowScene) {
        await tx.workflowScene.update({
          where: { id: existingWorkflowScene.id },
          data: workflowSceneData,
        });
      } else {
        const slug = await ensureUniqueWorkflowSceneSlug(tx, scene.slug, scene.id);
        const maxSort = await tx.workflowScene.aggregate({
          where: { roleId: scene.roleId },
          _max: { sortOrder: true },
        });

        await tx.workflowScene.create({
          data: {
            ...workflowSceneData,
            slug,
            sortOrder: (maxSort._max.sortOrder ?? 0) + 1,
          },
        });
      }
    } else if (existingWorkflowScene) {
      await tx.workflowScene.update({
        where: { id: existingWorkflowScene.id },
        data: { status: nextStatus },
      });
    }

    return updatedScene;
  });
}
