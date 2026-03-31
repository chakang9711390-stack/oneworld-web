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
