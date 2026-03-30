import { PageShell, SectionCard } from "@/components/shared/section";
import { workspaceOverview } from "@/lib/data";

export default function WorkspacePage() {
  return (
    <PageShell>
      <div className="grid gap-6">
        <SectionCard title="我的工作台" description="承接当前项目、当前 OPC 和工作流状态。" extra={<button className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black">新建项目</button>} />
        <section className="grid gap-5 md:grid-cols-3">
          {workspaceOverview.map((item) => (
            <div key={item.label} className="shell-card rounded-[26px] p-6">
              <span className="text-sm text-white/60">{item.label}</span>
              <strong className="mt-3 block text-5xl font-semibold tracking-[-0.04em]">{item.value}</strong>
              <p className="mt-3 text-sm leading-7 text-white/60">{item.summary}</p>
            </div>
          ))}
        </section>
      </div>
    </PageShell>
  );
}
