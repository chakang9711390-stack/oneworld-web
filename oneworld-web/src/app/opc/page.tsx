import { GridCard, PageShell, SectionCard } from "@/components/shared/section";
import { opcIndustries } from "@/lib/data";

export default function OpcPage() {
  return (
    <PageShell>
      <div className="grid gap-6">
        <SectionCard title="OPC 行业库" description="先搜索或浏览行业分类，进入后再查看该行业下的 OPC 项目卡片库。" />
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {opcIndustries.map((item) => (
            <GridCard key={item.slug} title={item.name} description={item.description} meta={`${item.count} 个 OPC 项目`} href={`/opc/${item.slug}`} />
          ))}
        </section>
      </div>
    </PageShell>
  );
}
