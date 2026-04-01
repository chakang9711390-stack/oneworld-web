import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionCard, SimpleBreadcrumb } from "@/components/shared/section";
import { getSceneDetail } from "@/lib/api";
import { AdminSceneActions } from "./actions";
import { SceneVersionForm } from "./version-form";

function AdminField({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="grid gap-1 rounded-[18px] border border-[var(--line)] bg-[var(--panel-soft)] p-4">
      <div className="text-xs uppercase tracking-[0.08em] text-[var(--text-faint)]">{label}</div>
      <div className="text-sm leading-7 text-[var(--text)]">{value || "—"}</div>
    </div>
  );
}

export default async function AdminSceneDetailPage({ params }: { params: Promise<{ sceneId: string }> }) {
  const { sceneId } = await params;
  const scene = await getSceneDetail(sceneId);

  if (!scene) notFound();

  return (
    <div className="grid gap-6">
      <SectionCard
        title={`场景详情｜${scene.name}`}
        description="后台详情页先支持查看核心资产字段，下一步接编辑页。"
        extra={
          <SimpleBreadcrumb
            items={[
              { label: "管理后台", href: "/admin/scenes" },
              { label: "场景管理", href: "/admin/scenes" },
              { label: scene.name },
            ]}
          />
        }
      />

      <div className="flex flex-wrap gap-3">
        <Link
          href={`/admin/scenes/${scene.sceneId}/edit`}
          className="inline-flex rounded-full border border-[var(--line)] px-4 py-2 text-sm text-[var(--text)] transition hover:bg-[var(--panel-soft)]"
        >
          编辑场景
        </Link>
        <Link
          href={`/scenes/${scene.sceneId}`}
          className="inline-flex rounded-full border border-[var(--line)] px-4 py-2 text-sm text-[var(--text)] transition hover:bg-[var(--panel-soft)]"
        >
          前台查看
        </Link>
      </div>

      <AdminSceneActions sceneId={scene.sceneId} />

      <section className="grid gap-5 xl:grid-cols-2">
        <div className="grid gap-5">
          <SectionCard title="基础与业务定义" description="当前场景的归属、目标、痛点与输入输出。" />
          <div className="grid gap-4 md:grid-cols-2">
            <AdminField label="sceneId" value={scene.sceneId} />
            <AdminField label="行业" value={scene.industry.name} />
            <AdminField label="职业" value={scene.role.name} />
            <AdminField label="工作流" value={scene.workflow.name} />
            <AdminField label="业务目标" value={scene.businessGoal} />
            <AdminField label="用户痛点" value={scene.painPoint} />
            <AdminField label="输入材料" value={scene.inputMaterials} />
            <AdminField label="输出结果" value={scene.outputResult} />
          </div>
        </div>

        <div className="grid gap-5">
          <SectionCard title="执行、权限与风控" description="当前场景执行配置、权限要求和风险边界。" />
          <div className="grid gap-4 md:grid-cols-2">
            <AdminField label="触发方式" value={scene.triggerType} />
            <AdminField label="执行节奏" value={scene.cadence} />
            <AdminField label="自动化等级" value={scene.automationLevel} />
            <AdminField label="风险等级" value={scene.riskLevel} />
            <AdminField label="频次等级" value={scene.frequencyLevel} />
            <AdminField label="上线优先级" value={scene.launchPriority} />
            <AdminField label="工具链" value={scene.executionConfig?.toolchainList} />
            <AdminField label="授权要求" value={scene.authConfig?.authRequiredList} />
            <AdminField label="人工确认点" value={scene.riskRule?.humanConfirmationPoints} />
            <AdminField label="异常规则" value={scene.riskRule?.exceptionRules} />
            <AdminField label="最新版本" value={scene.latestVersion?.version ?? null} />
            <AdminField label="版本成熟度" value={scene.latestVersion?.maturityLevel ?? null} />
          </div>
        </div>
      </section>

      <div className="grid gap-5">
        <SectionCard title="版本与成熟度管理" description="当前场景版本、来源、成熟度与验证状态的后台维护区。" />
        <SceneVersionForm
          sceneId={scene.sceneId}
          version={scene.latestVersion?.version ?? "v1"}
          sourceType={scene.latestVersion?.sourceType ?? "standard"}
          maturityLevel={scene.latestVersion?.maturityLevel ?? "draft"}
          validatedCustomersCount={scene.latestVersion?.validatedCustomersCount ?? 0}
          owner={scene.latestVersion?.owner ?? ""}
          releaseNotes={scene.latestVersion?.releaseNotes ?? ""}
        />
      </div>
    </div>
  );
}
