"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SceneEditPageProps = {
  scene: {
    sceneId: string;
    name: string;
    description: string;
    marketingSummary: string;
    businessGoal: string;
    painPoint: string;
    inputMaterials: string;
    outputResult: string;
    triggerType: string;
    cadence: string;
    automationLevel: string | null;
    riskLevel: string | null;
    launchPriority: string | null;
    toolchainList: string;
    authRequiredList: string;
    humanConfirmationPoints: string;
    exceptionRules: string;
  };
};

function InputField({ label, value, onChange, disabled = false }: { label: string; value: string; onChange: (value: string) => void; disabled?: boolean }) {
  return (
    <label className="grid gap-2 text-sm text-[var(--text-soft)]">
      <span>{label}</span>
      <input
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-[16px] border border-[var(--line)] bg-[var(--panel-soft)] px-4 py-3 text-sm text-[var(--text)] disabled:opacity-60"
      />
    </label>
  );
}

function TextAreaField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2 text-sm text-[var(--text-soft)]">
      <span>{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="rounded-[16px] border border-[var(--line)] bg-[var(--panel-soft)] px-4 py-3 text-sm text-[var(--text)]"
      />
    </label>
  );
}

export function AdminSceneEditForm({ scene }: SceneEditPageProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState(scene);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const response = await fetch(`/api/admin/scenes/${scene.sceneId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        shortDescription: form.description,
        marketingSummary: form.marketingSummary,
        businessGoal: form.businessGoal,
        painPoint: form.painPoint,
        inputMaterials: form.inputMaterials,
        outputResult: form.outputResult,
        triggerType: form.triggerType,
        cadence: form.cadence,
        automationLevel: form.automationLevel,
        riskLevel: form.riskLevel,
        launchPriority: form.launchPriority,
        toolchainList: form.toolchainList,
        authRequiredList: form.authRequiredList,
        humanConfirmationPoints: form.humanConfirmationPoints,
        exceptionRules: form.exceptionRules,
      }),
    });

    if (!response.ok) {
      setMessage("保存失败，请稍后重试。");
      setSaving(false);
      return;
    }

    setMessage("保存成功。");
    setSaving(false);
    router.refresh();
  }

  return (
    <form className="grid gap-6" onSubmit={handleSubmit}>
      <div className="grid gap-5 xl:grid-cols-2">
        <div className="grid gap-4 md:grid-cols-2 xl:col-span-2">
          <InputField label="场景名称" value={form.name} onChange={(value) => setForm((prev) => ({ ...prev, name: value }))} />
          <InputField label="sceneId" value={form.sceneId} onChange={() => {}} disabled />
          <TextAreaField label="场景摘要" value={form.description} onChange={(value) => setForm((prev) => ({ ...prev, description: value }))} />
          <TextAreaField label="营销摘要" value={form.marketingSummary} onChange={(value) => setForm((prev) => ({ ...prev, marketingSummary: value }))} />
          <TextAreaField label="业务目标" value={form.businessGoal} onChange={(value) => setForm((prev) => ({ ...prev, businessGoal: value }))} />
          <TextAreaField label="用户痛点" value={form.painPoint} onChange={(value) => setForm((prev) => ({ ...prev, painPoint: value }))} />
          <TextAreaField label="输入材料" value={form.inputMaterials} onChange={(value) => setForm((prev) => ({ ...prev, inputMaterials: value }))} />
          <TextAreaField label="输出结果" value={form.outputResult} onChange={(value) => setForm((prev) => ({ ...prev, outputResult: value }))} />
          <InputField label="触发方式" value={form.triggerType} onChange={(value) => setForm((prev) => ({ ...prev, triggerType: value }))} />
          <InputField label="执行节奏" value={form.cadence} onChange={(value) => setForm((prev) => ({ ...prev, cadence: value }))} />
          <InputField label="自动化等级" value={form.automationLevel || ""} onChange={(value) => setForm((prev) => ({ ...prev, automationLevel: value }))} />
          <InputField label="风险等级" value={form.riskLevel || ""} onChange={(value) => setForm((prev) => ({ ...prev, riskLevel: value }))} />
          <InputField label="上线优先级" value={form.launchPriority || ""} onChange={(value) => setForm((prev) => ({ ...prev, launchPriority: value }))} />
          <TextAreaField label="工具链" value={form.toolchainList} onChange={(value) => setForm((prev) => ({ ...prev, toolchainList: value }))} />
          <TextAreaField label="授权要求" value={form.authRequiredList} onChange={(value) => setForm((prev) => ({ ...prev, authRequiredList: value }))} />
          <TextAreaField label="人工确认点" value={form.humanConfirmationPoints} onChange={(value) => setForm((prev) => ({ ...prev, humanConfirmationPoints: value }))} />
          <TextAreaField label="异常规则" value={form.exceptionRules} onChange={(value) => setForm((prev) => ({ ...prev, exceptionRules: value }))} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex rounded-full border border-[var(--line)] px-5 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--panel-soft)] disabled:opacity-60"
        >
          {saving ? "保存中..." : "保存修改"}
        </button>
        {message ? <span className="text-sm text-[var(--text-soft)]">{message}</span> : null}
      </div>
    </form>
  );
}
