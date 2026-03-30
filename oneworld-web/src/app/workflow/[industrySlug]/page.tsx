import { GridCard, PageShell, SectionCard, SimpleBreadcrumb } from "@/components/shared/section";
import { getWorkflowRoles } from "@/lib/api";

export default async function WorkflowIndustryPage({ params }: { params: Promise<{ industrySlug: string }> }) {
  const { industrySlug } = await params;
  const { industry, items } = await getWorkflowRoles(industrySlug);
  const currentIndustry = industry ?? { name: "当前行业", slug: industrySlug, description: "", count: 0 };

  return (
    <PageShell>
      <div className="grid gap-6">
        <SectionCard
          title={`${currentIndustry.name}｜职位卡片库`}
          description="展示该行业下的所有职位卡片，点击职位后进入工作场景库。"
          extra={<SimpleBreadcrumb items={[{ label: '工作流', href: '/workflow' }, { label: currentIndustry.name }]} />}
        />
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => (
            <GridCard key={item.slug} title={item.name} description={item.description} meta={`${item.count} 个工作场景`} href={`/workflow/${currentIndustry.slug}/${item.slug}`} />
          ))}
        </section>
      </div>
    </PageShell>
  );
}
