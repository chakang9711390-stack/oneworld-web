import { PageShell, SectionCard } from "@/components/shared/section";
import { getWorkspaceOverview } from "@/lib/api";

export default async function WorkspacePage() {
  const overview = await getWorkspaceOverview();

  const cards = [
    { label: "当前 OPC 运行状态", value: String(overview.opcCount).padStart(2, "0"), summary: overview.opcSummary },
    { label: "当前工作流运行状态", value: String(overview.workflowCount).padStart(2, "0"), summary: overview.workflowSummary },
    { label: "项目数量", value: String(overview.projectCount).padStart(2, "0"), summary: overview.projectSummary },
  ];

  return (
    <PageShell>
      <div className="grid gap-6">
        <SectionCard title="我的工作台" description="承接当前项目、当前 OPC 和工作流状态。" extra={<button className="rounded-full bg-[var(--button-primary-bg)] px-5 py-3 text-sm font-semibold text-[var(--button-primary-text)]">新建项目</button>} />
        <section className="grid gap-5 md:grid-cols-3">
          {cards.map((item) => (
            <div key={item.label} className="shell-card rounded-[26px] p-6">
              <span className="text-sm text-[var(--text-soft)]">{item.label}</span>
              <strong className="mt-3 block text-5xl font-semibold tracking-[-0.04em]">{item.value}</strong>
              <p className="mt-3 text-sm leading-7 text-[var(--text-soft)]">{item.summary}</p>
            </div>
          ))}
        </section>
      </div>
    </PageShell>
  );
}
