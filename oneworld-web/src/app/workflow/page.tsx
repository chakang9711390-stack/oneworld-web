import { PageShell, SectionCard } from "@/components/shared/section";
import { SearchBox } from "@/components/shared/search-box";
import { getWorkflowIndustries } from "@/lib/api";

export default async function WorkflowPage() {
  const { items } = await getWorkflowIndustries();

  return (
    <PageShell>
      <div className="grid gap-6">
        <SectionCard title="工作流行业库" description="先搜索或浏览行业分类，再进入该行业下的职位卡片库与工作场景库。" />
        <SearchBox
          placeholder="搜索行业名称、描述或职位数量"
          items={items.map((item) => ({
            title: item.name,
            description: item.description,
            meta: `${item.count} 个职位`,
            href: `/workflow/${item.slug}`,
          }))}
          emptyText="没有找到匹配的工作流行业，换个关键词试试。"
        />
      </div>
    </PageShell>
  );
}
