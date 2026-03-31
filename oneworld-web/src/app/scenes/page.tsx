import { PageShell, SectionCard } from "@/components/shared/section";
import { SearchBox } from "@/components/shared/search-box";
import { getScenes } from "@/lib/api";

export default async function ScenesPage() {
  const { items } = await getScenes();

  return (
    <PageShell>
      <div className="grid gap-6">
        <SectionCard
          title="场景 AGENT 资产库"
          description="直接浏览一世界首批标准场景 AGENT。当前已纳入业务运营型岗位与专业生产型岗位的首批低风险、高复用场景。"
        />
        <SearchBox
          placeholder="搜索场景名称、行业、职业或优先级"
          items={items.map((item) => ({
            title: item.name,
            description: item.description,
            meta: item.meta,
            href: item.href,
          }))}
          emptyText="没有找到匹配的场景，换个关键词试试。"
        />
      </div>
    </PageShell>
  );
}
