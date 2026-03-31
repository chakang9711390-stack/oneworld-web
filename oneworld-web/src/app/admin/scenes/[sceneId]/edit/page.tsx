import { notFound } from "next/navigation";
import { SectionCard, SimpleBreadcrumb } from "@/components/shared/section";
import { getSceneDetail } from "@/lib/api";

function InputField({ label, value }: { label: string; value?: string | null }) {
  return (
    <label className="grid gap-2 text-sm text-[var(--text-soft)]">
      <span>{label}</span>
      <input
        defaultValue={value ?? ""}
        className="rounded-[16px] border border-[var(--line)] bg-[var(--panel-soft)] px-4 py-3 text-sm text-[var(--text)]"
      />
    </label>
  );
}

function TextAreaField({ label, value }: { label: string; value?: string | null }) {
  return (
    <label className="grid gap-2 text-sm text-[var(--text-soft)]">
      <span>{label}</span>
      <textarea
        defaultValue={value ?? ""}
        rows={4}
        className="rounded-[16px] border border-[var(--line)] bg-[var(--panel-soft)] px-4 py-3 text-sm text-[var(--text)]"
      />
    </label>
  );
}

export default async function AdminSceneEditPage({ params }: { params: Promise<{ sceneId: string }> }) {
  const { sceneId } = await params;
  const scene = await getSceneDetail(sceneId);

  if (!scene) notFound();

  return (
    <div className="grid gap-6">
      <SectionCard
        title={`编辑场景｜${scene.name}`}
        description="当前先落最小可用编辑页，下一步再接真实保存接口。"
        extra={
          <SimpleBreadcrumb
            items={[
              { label: "管理后台", href: "/admin/scenes" },
              { label: "场景管理", href: "/admin/scenes" },
              { label: scene.name, href: `/admin/scenes/${scene.sceneId}` },
              { label: "编辑" },
            ]}
          />
        }
      />

      <form className="grid gap-6">
        <div className="grid gap-5 xl:grid-cols-2">
          <SectionCard title="基础信息" description="先支持查看和编辑核心字段。" />
          <div className="grid gap-4 md:grid-cols-2 xl:col-span-2">
            <InputField label="场景名称" value={scene.name} />
            <InputField label="sceneId" value={scene.sceneId} />
            <InputField label="行业" value={scene.industry.name} />
            <InputField label="职业" value={scene.role.name} />
            <InputField label="工作流" value={scene.workflow.name} />
            <InputField label="上线优先级" value={scene.launchPriority} />
            <TextAreaField label="场景摘要" value={scene.description} />
            <TextAreaField label="营销摘要" value={scene.marketingSummary} />
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <SectionCard title="业务定义与执行配置" description="下一步会接真实保存接口。" />
          <div className="grid gap-4 md:grid-cols-2 xl:col-span-2">
            <TextAreaField label="业务目标" value={scene.businessGoal} />
            <TextAreaField label="用户痛点" value={scene.painPoint} />
            <TextAreaField label="输入材料" value={scene.inputMaterials} />
            <TextAreaField label="输出结果" value={scene.outputResult} />
            <InputField label="触发方式" value={scene.triggerType} />
            <InputField label="执行节奏" value={scene.cadence} />
            <InputField label="自动化等级" value={scene.automationLevel} />
            <InputField label="风险等级" value={scene.riskLevel} />
            <TextAreaField label="工具链" value={scene.executionConfig?.toolchainList} />
            <TextAreaField label="授权要求" value={scene.authConfig?.authRequiredList} />
            <TextAreaField label="人工确认点" value={scene.riskRule?.humanConfirmationPoints} />
            <TextAreaField label="异常规则" value={scene.riskRule?.exceptionRules} />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="inline-flex rounded-full border border-[var(--line)] px-5 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--panel-soft)]"
          >
            保存（下一步接真实接口）
          </button>
        </div>
      </form>
    </div>
  );
}
