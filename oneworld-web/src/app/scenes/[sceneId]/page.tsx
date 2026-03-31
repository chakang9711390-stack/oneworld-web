import { notFound } from "next/navigation";
import { PageShell, SectionCard, SimpleBreadcrumb } from "@/components/shared/section";
import { getSceneDetail } from "@/lib/api";

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;

  return (
    <div className="grid gap-1 rounded-[20px] border border-[var(--line)] bg-[var(--panel-soft)] p-4">
      <div className="text-xs uppercase tracking-[0.12em] text-[var(--text-faint)]">{label}</div>
      <div className="text-sm leading-7 text-[var(--text)]">{value}</div>
    </div>
  );
}

export default async function SceneDetailPage({ params }: { params: Promise<{ sceneId: string }> }) {
  const { sceneId } = await params;
  const scene = await getSceneDetail(sceneId);

  if (!scene) {
    notFound();
  }

  return (
    <PageShell>
      <div className="grid gap-6">
        <SectionCard
          title={scene.name}
          description={scene.marketingSummary}
          extra={
            <SimpleBreadcrumb
              items={[
                { label: "场景 AGENT", href: "/scenes" },
                { label: scene.industry.name },
                { label: scene.role.name },
                { label: scene.name },
              ]}
            />
          }
        />

        <section className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
          <div className="grid gap-5">
            <SectionCard title="业务定义" description="当前场景的业务目标、痛点、输入与输出。" />
            <div className="grid gap-4 md:grid-cols-2">
              <InfoRow label="业务目标" value={scene.businessGoal} />
              <InfoRow label="用户痛点" value={scene.painPoint} />
              <InfoRow label="输入材料" value={scene.inputMaterials} />
              <InfoRow label="输出结果" value={scene.outputResult} />
            </div>

            <SectionCard title="执行与权限" description="当前场景的执行方式、权限要求与风险边界。" />
            <div className="grid gap-4 md:grid-cols-2">
              <InfoRow label="触发方式" value={scene.triggerType} />
              <InfoRow label="执行节奏" value={scene.cadence} />
              <InfoRow label="工具链" value={scene.executionConfig?.toolchainList} />
              <InfoRow label="授权要求" value={scene.authConfig?.authRequiredList} />
              <InfoRow label="人工确认点" value={scene.riskRule?.humanConfirmationPoints} />
              <InfoRow label="异常规则" value={scene.riskRule?.exceptionRules} />
            </div>
          </div>

          <div className="grid gap-5">
            <SectionCard title="场景状态" description="当前场景的资产级别与发布状态。" />
            <div className="grid gap-4">
              <InfoRow label="行业" value={scene.industry.name} />
              <InfoRow label="职业" value={scene.role.name} />
              <InfoRow label="工作流" value={scene.workflow.name} />
              <InfoRow label="自动化等级" value={scene.automationLevel} />
              <InfoRow label="风险等级" value={scene.riskLevel} />
              <InfoRow label="频次等级" value={scene.frequencyLevel} />
              <InfoRow label="上线优先级" value={scene.launchPriority} />
              <InfoRow label="最新版本" value={scene.latestVersion?.version ?? null} />
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
