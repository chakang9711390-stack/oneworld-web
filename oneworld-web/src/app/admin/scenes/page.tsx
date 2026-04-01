import Link from "next/link";
import { SectionCard } from "@/components/shared/section";
import { getScenes } from "@/lib/api";
import { prisma } from "@/server/prisma";
import { AdminSceneFilters } from "./scene-filters";

export default async function AdminScenesPage() {
  const [{ items }, industries, roles, versions] = await Promise.all([
    getScenes(),
    prisma.industry.findMany({ where: { status: "active" }, orderBy: { sortOrder: "asc" }, select: { id: true, name: true } }),
    prisma.workflowRole.findMany({ where: { status: "active" }, orderBy: { sortOrder: "asc" }, select: { id: true, name: true } }),
    prisma.sceneVersion.findMany({ orderBy: { createdAt: "desc" }, select: { sceneDefinitionId: true, validatedCustomersCount: true } }),
  ]);

  const validatedMap = new Map(versions.map((item) => [item.sceneDefinitionId, item.validatedCustomersCount]));

  return (
    <div className="grid gap-6">
      <SectionCard title="场景管理" description="当前场景 AGENT 资产的后台列表页，已支持筛选、查看、创建新场景，并展示状态和商业化字段。" />

      <div>
        <Link
          href="/admin/scenes/new"
          className="inline-flex rounded-full border border-[var(--line)] px-4 py-2 text-sm text-[var(--text)] transition hover:bg-[var(--panel-soft)]"
        >
          新建场景
        </Link>
      </div>

      <AdminSceneFilters
        items={items.map((item) => ({
          ...item,
          validatedCustomersCount: validatedMap.get(item.sceneId) ?? 0,
        }))}
        industries={industries}
        roles={roles}
      />
    </div>
  );
}
