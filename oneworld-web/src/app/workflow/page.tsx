import { GridCard, PageShell, SectionCard } from "@/components/shared/section";
import { workflowIndustries } from "@/lib/data";

export default function WorkflowPage() {
  return (
    <PageShell>
      <div className="grid gap-6">
        <SectionCard title="工作流行业库" description="先搜索或浏览行业分类，再进入该行业下的职位卡片库与工作场景库。" />
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {workflowIndustries.map((item) => (
            <GridCard key={item.slug} title={item.name} description={item.description} meta={`${item.count} 个职位`} href={`/workflow/${item.slug}`} />
          ))}
        </section>
      </div>
    </PageShell>
  );
}
