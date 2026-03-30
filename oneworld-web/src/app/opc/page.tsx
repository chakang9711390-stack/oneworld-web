import { PageShell, SectionCard } from "@/components/shared/section";
import { SearchBox } from "@/components/shared/search-box";
import { getOpcIndustries } from "@/lib/api";

export default async function OpcPage() {
  const { items } = await getOpcIndustries();

  return (
    <PageShell>
      <div className="grid gap-6">
        <SectionCard title="OPC 行业库" description="先搜索或浏览行业分类，进入后再查看该行业下的 OPC 项目卡片库。" />
        <SearchBox
          placeholder="搜索行业名称、描述或项目数量"
          items={items.map((item) => ({
            title: item.name,
            description: item.description,
            meta: `${item.count} 个 OPC 项目`,
            href: `/opc/${item.slug}`,
          }))}
          emptyText="没有找到匹配的 OPC 行业，换个关键词试试。"
        />
      </div>
    </PageShell>
  );
}
