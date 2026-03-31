import Link from "next/link";
import { SectionCard } from "@/components/shared/section";
import { getScenes } from "@/lib/api";

export default async function AdminScenesPage() {
  const { items } = await getScenes();

  return (
    <div className="grid gap-6">
      <SectionCard title="场景管理" description="当前场景 AGENT 资产的后台列表页，先支持查看和进入详情。" />

      <div className="overflow-hidden rounded-[26px] border border-[var(--line)] bg-[var(--panel)]">
        <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr_140px] gap-4 border-b border-[var(--line)] px-5 py-4 text-xs uppercase tracking-[0.08em] text-[var(--text-faint)]">
          <span>场景</span>
          <span>行业</span>
          <span>职业</span>
          <span>优先级</span>
          <span>操作</span>
        </div>
        {items.map((item) => {
          const metaParts = item.meta.split("｜");
          return (
            <div
              key={item.sceneId}
              className="grid grid-cols-[1.6fr_1fr_1fr_1fr_140px] gap-4 border-b border-[var(--line)] px-5 py-4 text-sm last:border-b-0"
            >
              <div>
                <div className="font-semibold text-[var(--text)]">{item.name}</div>
                <div className="mt-1 text-[var(--text-soft)]">{item.description}</div>
              </div>
              <div className="text-[var(--text-soft)]">{metaParts[0] ?? "-"}</div>
              <div className="text-[var(--text-soft)]">{metaParts[1] ?? "-"}</div>
              <div className="text-[var(--text-soft)]">{metaParts[2] ?? "-"}</div>
              <div>
                <Link
                  href={`/admin/scenes/${item.sceneId}`}
                  className="inline-flex rounded-full border border-[var(--line)] px-4 py-2 text-sm text-[var(--text)] transition hover:bg-[var(--panel-soft)]"
                >
                  查看详情
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
