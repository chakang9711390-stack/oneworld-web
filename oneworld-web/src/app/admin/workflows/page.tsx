import { SectionCard } from "@/components/shared/section";
import { prisma } from "@/server/prisma";

export default async function AdminWorkflowsPage() {
  const items = await prisma.workflowTemplate.findMany({
    where: { status: "active" },
    orderBy: [{ industry: { sortOrder: "asc" } }, { sortOrder: "asc" }],
    include: {
      industry: { select: { name: true } },
      role: { select: { name: true } },
      sceneDefinitions: { select: { id: true } },
    },
  });

  return (
    <div className="grid gap-6">
      <SectionCard title="工作流管理" description="当前先提供只读列表，后续再接编辑能力。" />
      <div className="overflow-hidden rounded-[26px] border border-[var(--line)] bg-[var(--panel)]">
        <div className="grid grid-cols-[1.4fr_1fr_1fr_120px] gap-4 border-b border-[var(--line)] px-5 py-4 text-xs uppercase tracking-[0.08em] text-[var(--text-faint)]">
          <span>工作流</span>
          <span>行业</span>
          <span>职业</span>
          <span>场景数</span>
        </div>
        {items.map((item) => (
          <div key={item.id} className="grid grid-cols-[1.4fr_1fr_1fr_120px] gap-4 border-b border-[var(--line)] px-5 py-4 text-sm last:border-b-0">
            <div>
              <div className="font-semibold text-[var(--text)]">{item.name}</div>
              <div className="mt-1 text-[var(--text-soft)]">{item.description}</div>
            </div>
            <div className="text-[var(--text-soft)]">{item.industry.name}</div>
            <div className="text-[var(--text-soft)]">{item.role.name}</div>
            <div className="text-[var(--text-soft)]">{item.sceneDefinitions.length}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
