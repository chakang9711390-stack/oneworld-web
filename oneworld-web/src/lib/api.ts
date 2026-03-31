import { unstable_cache } from "next/cache";
import { prisma } from "@/server/prisma";

const getCachedOpcIndustries = unstable_cache(
  async () => {
    const items = await prisma.industry.findMany({
      where: {
        type: { in: ["opc", "both"] },
        status: "active",
      },
      orderBy: { sortOrder: "asc" },
      include: {
        opcProjectTemplates: {
          where: {
            status: "active",
          },
          select: { id: true },
        },
      },
    });

    return {
      items: items.map((item) => ({
        name: item.name,
        slug: item.slug,
        description: item.description ?? "",
        count: item.opcProjectTemplates.length,
      })),
    };
  },
  ["opc-industries"],
  { revalidate: 300 },
);

const getCachedWorkflowIndustries = unstable_cache(
  async () => {
    const items = await prisma.industry.findMany({
      where: {
        type: { in: ["workflow", "both"] },
        status: "active",
      },
      orderBy: { sortOrder: "asc" },
      include: {
        workflowRoles: {
          where: {
            status: "active",
          },
          select: { id: true },
        },
      },
    });

    return {
      items: items.map((item) => ({
        name: item.name,
        slug: item.slug,
        description: item.description ?? "",
        count: item.workflowRoles.length,
      })),
    };
  },
  ["workflow-industries"],
  { revalidate: 300 },
);

const getCachedWorkspaceOverview = unstable_cache(
  async () => {
    const user = await prisma.user.findFirst({
      select: {
        workspaceProjects: {
          select: {
            sourceType: true,
          },
        },
      },
    });

    const projects = user?.workspaceProjects ?? [];
    const opcCount = projects.filter((item) => item.sourceType === "opc").length;
    const workflowCount = projects.filter((item) => item.sourceType === "workflow").length;
    const projectCount = projects.length;

    return {
      opcCount,
      workflowCount,
      projectCount,
      opcSummary: opcCount > 0 ? `${opcCount} 个已沉淀` : "暂无 OPC 资产",
      workflowSummary: workflowCount > 0 ? `${workflowCount} 个工作流记录` : "暂无工作流记录",
      projectSummary: projectCount > 0 ? `${projectCount} 个项目资产` : "暂无项目",
    };
  },
  ["workspace-overview"],
  { revalidate: 60 },
);

export async function getOpcIndustries() {
  return getCachedOpcIndustries();
}

export async function getOpcProjects(industrySlug: string) {
  const getCachedIndustryProjects = unstable_cache(
    async () => {
      const industry = await prisma.industry.findFirst({
        where: {
          slug: industrySlug,
          type: { in: ["opc", "both"] },
          status: "active",
        },
        include: {
          opcProjectTemplates: {
            where: {
              status: "active",
            },
            orderBy: { sortOrder: "asc" },
            select: {
              title: true,
              slug: true,
              description: true,
              isCreateEntry: true,
            },
          },
        },
      });

      return {
        industry: industry
          ? {
              name: industry.name,
              slug: industry.slug,
              description: industry.description ?? "",
              count: industry.opcProjectTemplates.length,
            }
          : null,
        items:
          industry?.opcProjectTemplates.map((item) => ({
            title: item.title,
            slug: item.slug,
            description: item.description ?? "",
            status: item.isCreateEntry ? "创建入口" : "案例卡片",
          })) ?? [],
      };
    },
    ["opc-projects", industrySlug],
    { revalidate: 300 },
  );

  return getCachedIndustryProjects();
}

export async function getWorkflowIndustries() {
  return getCachedWorkflowIndustries();
}

export async function getWorkflowRoles(industrySlug: string) {
  const getCachedIndustryRoles = unstable_cache(
    async () => {
      const industry = await prisma.industry.findFirst({
        where: {
          slug: industrySlug,
          type: { in: ["workflow", "both"] },
          status: "active",
        },
        include: {
          workflowRoles: {
            where: {
              status: "active",
            },
            orderBy: { sortOrder: "asc" },
            select: {
              name: true,
              slug: true,
              description: true,
              workflowScenes: {
                where: {
                  status: "active",
                },
                select: { id: true },
              },
            },
          },
        },
      });

      return {
        industry: industry
          ? {
              name: industry.name,
              slug: industry.slug,
              description: industry.description ?? "",
              count: industry.workflowRoles.length,
            }
          : null,
        items:
          industry?.workflowRoles.map((item) => ({
            name: item.name,
            slug: item.slug,
            description: item.description ?? "",
            count: item.workflowScenes.length,
          })) ?? [],
      };
    },
    ["workflow-roles", industrySlug],
    { revalidate: 300 },
  );

  return getCachedIndustryRoles();
}

export async function getWorkflowScenes(roleSlug: string) {
  const getCachedRoleScenes = unstable_cache(
    async () => {
      const role = await prisma.workflowRole.findFirst({
        where: {
          slug: roleSlug,
          status: "active",
        },
        include: {
          workflowScenes: {
            where: {
              status: "active",
            },
            orderBy: { sortOrder: "asc" },
            select: {
              title: true,
              slug: true,
              description: true,
              isGenerateEntry: true,
            },
          },
        },
      });

      return {
        role: role
          ? {
              name: role.name,
              slug: role.slug,
              description: role.description ?? "",
              count: role.workflowScenes.length,
            }
          : null,
        items:
          role?.workflowScenes.map((item) => ({
            title: item.title,
            slug: item.slug,
            description: item.description ?? "",
            status: item.isGenerateEntry ? "生成入口" : "场景卡片",
          })) ?? [],
      };
    },
    ["workflow-scenes", roleSlug],
    { revalidate: 300 },
  );

  return getCachedRoleScenes();
}

export async function getWorkspaceOverview() {
  return getCachedWorkspaceOverview();
}

export async function getScenes() {
  const getCachedScenes = unstable_cache(
    async () => {
      const items = await prisma.sceneDefinition.findMany({
        where: {
          status: "active",
        },
        orderBy: [{ launchPriority: "asc" }, { createdAt: "asc" }],
        include: {
          industry: {
            select: { id: true, name: true, slug: true },
          },
          role: {
            select: { id: true, name: true, slug: true },
          },
          workflowTemplate: {
            select: { id: true, name: true, slug: true },
          },
        },
      });

      return {
        items: items.map((item) => ({
          sceneId: item.sceneId,
          name: item.name,
          slug: item.slug,
          description: item.shortDescription ?? "",
          meta: `${item.industry.name}｜${item.role.name}｜${item.launchPriority ?? "P1"}`,
          href: `/scenes/${item.sceneId}`,
          industry: item.industry,
          role: item.role,
          workflow: item.workflowTemplate,
          launchPriority: item.launchPriority,
          riskLevel: item.riskLevel,
          automationLevel: item.automationLevel,
          status: item.status,
        })),
      };
    },
    ["scene-list"],
    { revalidate: 120 },
  );

  return getCachedScenes();
}

export async function getSceneDetail(sceneId: string) {
  const getCachedSceneDetail = unstable_cache(
    async () => {
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

      if (!item) return null;

      return {
        sceneId: item.sceneId,
        name: item.name,
        description: item.shortDescription ?? "",
        marketingSummary: item.marketingSummary ?? item.shortDescription ?? "",
        businessGoal: item.businessGoal ?? "",
        painPoint: item.painPoint ?? "",
        inputMaterials: item.inputMaterials ?? "",
        outputResult: item.outputResult ?? "",
        triggerType: item.triggerType ?? "",
        cadence: item.cadence ?? "",
        automationLevel: item.automationLevel ?? null,
        riskLevel: item.riskLevel ?? null,
        frequencyLevel: item.frequencyLevel ?? null,
        launchPriority: item.launchPriority ?? null,
        directPurchase: item.directPurchase,
        customizationRequired: item.customizationRequired,
        industry: item.industry,
        role: item.role,
        workflow: item.workflowTemplate,
        executionConfig: item.executionConfig,
        authConfig: item.authConfig,
        riskRule: item.riskRule,
        latestVersion: item.versions[0] ?? null,
      };
    },
    ["scene-detail", sceneId],
    { revalidate: 120 },
  );

  return getCachedSceneDetail();
}
