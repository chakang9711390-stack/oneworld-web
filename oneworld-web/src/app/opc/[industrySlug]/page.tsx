import { CtaCard } from "@/components/shared/cta-card";
import { GridCard, PageShell, SectionCard, SimpleBreadcrumb } from "@/components/shared/section";
import { getOpcProjects } from "@/lib/api";

export default async function OpcIndustryPage({ params }: { params: Promise<{ industrySlug: string }> }) {
  const { industrySlug } = await params;
  const { industry, items } = await getOpcProjects(industrySlug);
  const currentIndustry = industry ?? { name: "当前行业", slug: industrySlug, description: "", count: 0 };
  const [createCard, ...projectCards] = items;

  return (
    <PageShell>
      <div className="grid gap-6">
        <SectionCard
          title={`${currentIndustry.name} OPC 项目卡片库`}
          description="第一个卡片固定为创建我的 OPC，其余为行业下的示例案例卡片。"
          extra={<SimpleBreadcrumb items={[{ label: 'OPC', href: '/opc' }, { label: currentIndustry.name }]} />}
        />
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {createCard ? (
            <CtaCard
              title={createCard.title}
              description={createCard.description}
              endpoint="/api/opc/create"
              idleLabel="创建我的 OPC"
            />
          ) : null}
          {projectCards.map((item) => (
            <GridCard key={item.slug} title={item.title} description={item.description} meta={item.status} />
          ))}
        </section>
      </div>
    </PageShell>
  );
}
