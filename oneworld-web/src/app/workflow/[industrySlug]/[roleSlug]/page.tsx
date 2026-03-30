import { GridCard, PageShell, SectionCard, SimpleBreadcrumb } from "@/components/shared/section";
import { workflowIndustries, workflowRoles, workflowScenes } from "@/lib/data";

export default async function WorkflowRolePage({ params }: { params: Promise<{ industrySlug: string; roleSlug: string }> }) {
  const { industrySlug, roleSlug } = await params;
  const industry = workflowIndustries.find((item) => item.slug === industrySlug) ?? workflowIndustries[0];
  const role = workflowRoles.find((item) => item.slug === roleSlug) ?? workflowRoles[0];

  return (
    <PageShell>
      <div className="grid gap-6">
        <SectionCard
          title={`${industry.name}｜${role.name}｜工作场景库`}
          description="第一个场景卡片固定为生成我的工作流，其余为对应工作场景，当前先全部做成展示态。"
          extra={<SimpleBreadcrumb items={[{ label: '工作流', href: '/workflow' }, { label: industry.name, href: `/workflow/${industry.slug}` }, { label: role.name }]} />}
        />
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {workflowScenes.map((item) => (
            <GridCard key={item.title} title={item.title} description={item.description} meta={item.status} />
          ))}
        </section>
      </div>
    </PageShell>
  );
}
