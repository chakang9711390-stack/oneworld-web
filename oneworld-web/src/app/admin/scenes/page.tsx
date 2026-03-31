import Link from "next/link";
import { SectionCard } from "@/components/shared/section";
import { getScenes } from "@/lib/api";
import { prisma } from "@/server/prisma";
import { AdminSceneFilters } from "./scene-filters";

export default async function AdminScenesPage() {
  const [{ items }, industries, roles] = await Promise.all([
    getScenes(),
    prisma.industry.findMany({ where: { status: "active" }, orderBy: { sortOrder: "asc" }, select: { id: true, name: true } }),
    prisma.workflowRole.findMany({ where: { status: "active" }, orderBy: { sortOrder: "asc" }, select: { id: true, name: true } }),
  ]);

  return (
    <div className="grid gap-6">
      <SectionCard title="场景管理" description="当前场景 AGENT 资产的后台列表页，已支持筛选、查看、进入详情和创建新场景。" />

      <div>
        <Link
          href="/admin/scenes/new"
          className="inline-flex rounded-full border border-[var(--line)] px-4 py-2 text-sm text-[var(--text)] transition hover:bg-[var(--panel-soft)]"
        >
          新建场景
        </Link>
      </div>

      <AdminSceneFilters items={items} industries={industries} roles={roles} />
    </div>
  );
}
