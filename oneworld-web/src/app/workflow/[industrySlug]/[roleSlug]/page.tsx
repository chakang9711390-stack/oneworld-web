import { CtaCard } from "@/components/shared/cta-card";
import { GridCard, PageShell, SectionCard, SimpleBreadcrumb } from "@/components/shared/section";
import { getWorkflowRoles, getWorkflowScenes } from "@/lib/api";

export default async function WorkflowRolePage({ params }: { params: Promise<{ industrySlug: string; roleSlug: string }> }) {
  const { industrySlug, roleSlug } = await params;
  const [{ industry }, { role, items }] = await Promise.all([
    getWorkflowRoles(industrySlug),
    getWorkflowScenes(roleSlug),
  ]);

  const currentIndustry = industry ?? { name: "当前行业", slug: industrySlug, description: "", count: 0 };
  const currentRole = role ?? { name: "当前职位", slug: roleSlug, description: "", count: 0 };
  const [createCard, ...sceneCards] = items;

  return (
    <PageShell>
      <div className="grid gap-6">
        <SectionCard
          title={`${currentIndustry.name}｜${currentRole.name}｜工作场景库`}
          description="第一个场景卡片固定为生成我的工作流，其余为对应工作场景，当前先全部做成展示态。"
          extra={<SimpleBreadcrumb items={[{ label: '工作流', href: '/workflow' }, { label: currentIndustry.name, href: `/workflow/${currentIndustry.slug}` }, { label: currentRole.name }]} />}
        />
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {createCard ? (
            <CtaCard
              title={createCard.title}
              description={createCard.description}
              endpoint="/api/workflow/generate"
              idleLabel="生成我的工作流"
            />
          ) : null}
          {sceneCards.map((item) => (
            <GridCard key={item.slug} title={item.title} description={item.description} meta={item.status} />
          ))}
        </section>
      </div>
    </PageShell>
  );
}
