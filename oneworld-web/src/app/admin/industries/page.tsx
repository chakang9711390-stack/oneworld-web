import { SectionCard } from "@/components/shared/section";
import { getWorkflowIndustries } from "@/lib/api";

export default async function AdminIndustriesPage() {
  const { items } = await getWorkflowIndustries();

  return (
    <div className="grid gap-6">
      <SectionCard title="行业管理" description="当前先提供只读列表，后续再接编辑能力。" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <div key={item.slug} className="shell-card rounded-[24px] p-5">
            <div className="text-lg font-semibold text-[var(--text)]">{item.name}</div>
            <div className="mt-2 text-sm leading-7 text-[var(--text-soft)]">{item.description}</div>
            <div className="mt-4 text-sm text-[var(--text-faint)]">{item.count} 个职位</div>
          </div>
        ))}
      </div>
    </div>
  );
}
