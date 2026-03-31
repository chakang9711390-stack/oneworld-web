import { SectionCard, SimpleBreadcrumb } from "@/components/shared/section";
import { prisma } from "@/server/prisma";
import { NewSceneForm } from "./new-scene-form";

export default async function AdminSceneNewPage() {
  const [industries, roles, workflows] = await Promise.all([
    prisma.industry.findMany({
      where: { status: "active" },
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true },
    }),
    prisma.workflowRole.findMany({
      where: { status: "active" },
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true },
    }),
    prisma.workflowTemplate.findMany({
      where: { status: "active" },
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <div className="grid gap-6">
      <SectionCard
        title="新建场景"
        description="当前已接入真实创建接口，可直接创建新的场景 AGENT 资产。"
        extra={
          <SimpleBreadcrumb
            items={[
              { label: "管理后台", href: "/admin/scenes" },
              { label: "场景管理", href: "/admin/scenes" },
              { label: "新建场景" },
            ]}
          />
        }
      />

      <NewSceneForm industries={industries} roles={roles} workflows={workflows} />
    </div>
  );
}
