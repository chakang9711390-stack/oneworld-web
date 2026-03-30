import { GridCard, PageShell, SectionCard, SimpleBreadcrumb } from "@/components/shared/section";
import { opcIndustries, opcProjects } from "@/lib/data";

export default async function OpcIndustryPage({ params }: { params: Promise<{ industrySlug: string }> }) {
  const { industrySlug } = await params;
  const industry = opcIndustries.find((item) => item.slug === industrySlug) ?? opcIndustries[0];

  return (
    <PageShell>
      <div className="grid gap-6">
        <SectionCard
          title={`${industry.name} OPC 项目卡片库`}
          description="第一个卡片固定为创建我的 OPC，其余为行业下的示例案例卡片。"
          extra={<SimpleBreadcrumb items={[{ label: 'OPC', href: '/opc' }, { label: industry.name }]} />}
        />
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {opcProjects.map((item) => (
            <GridCard key={item.title} title={item.title} description={item.description} meta={item.status} />
          ))}
        </section>
      </div>
    </PageShell>
  );
}
