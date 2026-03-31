"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Option = { id: string; name: string; industryId?: string; roleId?: string };

type NewSceneFormProps = {
  industries: Option[];
  roles: Option[];
  workflows: Option[];
};

function InputField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2 text-sm text-[var(--text-soft)]">
      <span>{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="rounded-[16px] border border-[var(--line)] bg-[var(--panel-soft)] px-4 py-3 text-sm text-[var(--text)]" />
    </label>
  );
}

function TextAreaField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2 text-sm text-[var(--text-soft)]">
      <span>{label}</span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={4} className="rounded-[16px] border border-[var(--line)] bg-[var(--panel-soft)] px-4 py-3 text-sm text-[var(--text)]" />
    </label>
  );
}

function SelectField({ label, value, onChange, options, placeholder = "请选择" }: { label: string; value: string; onChange: (value: string) => void; options: Option[]; placeholder?: string }) {
  return (
    <label className="grid gap-2 text-sm text-[var(--text-soft)]">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="rounded-[16px] border border-[var(--line)] bg-[var(--panel-soft)] px-4 py-3 text-sm text-[var(--text)]">
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>{option.name}</option>
        ))}
      </select>
    </label>
  );
}

export function NewSceneForm({ industries, roles, workflows }: NewSceneFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    shortDescription: "",
    marketingSummary: "",
    businessGoal: "",
    painPoint: "",
    inputMaterials: "",
    outputResult: "",
    triggerType: "manual",
    cadence: "ondemand",
    automationLevel: "A3",
    riskLevel: "R1",
    frequencyLevel: "A",
    launchPriority: "P1",
    toolchainList: "",
    authRequiredList: "",
    humanConfirmationPoints: "",
    exceptionRules: "",
    industryId: "",
    roleId: "",
    workflowTemplateId: "",
  });
  const [roleOptions, setRoleOptions] = useState<Option[]>(roles);
  const [workflowOptions, setWorkflowOptions] = useState<Option[]>(workflows);

  useEffect(() => {
    async function loadRoles() {
      if (!form.industryId) {
        setRoleOptions([]);
        setWorkflowOptions([]);
        return;
      }

      const response = await fetch(`/api/admin/roles?industryId=${form.industryId}`);
      const result = await response.json();
      setRoleOptions(result.items || []);
      setForm((prev) => ({ ...prev, roleId: "", workflowTemplateId: "" }));
      setWorkflowOptions([]);
    }

    loadRoles();
  }, [form.industryId]);

  useEffect(() => {
    async function loadWorkflows() {
      if (!form.industryId || !form.roleId) {
        setWorkflowOptions([]);
        return;
      }

      const response = await fetch(`/api/admin/workflows?industryId=${form.industryId}&roleId=${form.roleId}`);
      const result = await response.json();
      setWorkflowOptions(result.items || []);
      setForm((prev) => ({ ...prev, workflowTemplateId: "" }));
    }

    loadWorkflows();
  }, [form.industryId, form.roleId]);

  const canSubmit = useMemo(() => {
    return form.name && form.industryId && form.roleId && form.workflowTemplateId;
  }, [form]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const response = await fetch("/api/admin/scenes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const result = await response.json();

    if (!response.ok) {
      setMessage(result.message || "创建失败，请稍后重试。");
      setSaving(false);
      return;
    }

    setMessage("创建成功，正在跳转...");
    router.push(`/admin/scenes/${result.item.sceneId}`);
    router.refresh();
  }

  return (
    <form className="grid gap-6" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <SelectField label="行业" value={form.industryId} onChange={(value) => setForm((prev) => ({ ...prev, industryId: value }))} options={industries} />
        <SelectField label="职业" value={form.roleId} onChange={(value) => setForm((prev) => ({ ...prev, roleId: value }))} options={roleOptions} placeholder={form.industryId ? "请选择职业" : "请先选择行业"} />
        <SelectField label="工作流" value={form.workflowTemplateId} onChange={(value) => setForm((prev) => ({ ...prev, workflowTemplateId: value }))} options={workflowOptions} placeholder={form.roleId ? "请选择工作流" : "请先选择职业"} />
        <InputField label="场景名称" value={form.name} onChange={(value) => setForm((prev) => ({ ...prev, name: value }))} />
        <TextAreaField label="场景摘要" value={form.shortDescription} onChange={(value) => setForm((prev) => ({ ...prev, shortDescription: value }))} />
        <TextAreaField label="营销摘要" value={form.marketingSummary} onChange={(value) => setForm((prev) => ({ ...prev, marketingSummary: value }))} />
        <TextAreaField label="业务目标" value={form.businessGoal} onChange={(value) => setForm((prev) => ({ ...prev, businessGoal: value }))} />
        <TextAreaField label="用户痛点" value={form.painPoint} onChange={(value) => setForm((prev) => ({ ...prev, painPoint: value }))} />
        <TextAreaField label="输入材料" value={form.inputMaterials} onChange={(value) => setForm((prev) => ({ ...prev, inputMaterials: value }))} />
        <TextAreaField label="输出结果" value={form.outputResult} onChange={(value) => setForm((prev) => ({ ...prev, outputResult: value }))} />
        <InputField label="触发方式" value={form.triggerType} onChange={(value) => setForm((prev) => ({ ...prev, triggerType: value }))} />
        <InputField label="执行节奏" value={form.cadence} onChange={(value) => setForm((prev) => ({ ...prev, cadence: value }))} />
        <InputField label="自动化等级" value={form.automationLevel} onChange={(value) => setForm((prev) => ({ ...prev, automationLevel: value }))} />
        <InputField label="风险等级" value={form.riskLevel} onChange={(value) => setForm((prev) => ({ ...prev, riskLevel: value }))} />
        <InputField label="频次等级" value={form.frequencyLevel} onChange={(value) => setForm((prev) => ({ ...prev, frequencyLevel: value }))} />
        <InputField label="上线优先级" value={form.launchPriority} onChange={(value) => setForm((prev) => ({ ...prev, launchPriority: value }))} />
        <TextAreaField label="工具链" value={form.toolchainList} onChange={(value) => setForm((prev) => ({ ...prev, toolchainList: value }))} />
        <TextAreaField label="授权要求" value={form.authRequiredList} onChange={(value) => setForm((prev) => ({ ...prev, authRequiredList: value }))} />
        <TextAreaField label="人工确认点" value={form.humanConfirmationPoints} onChange={(value) => setForm((prev) => ({ ...prev, humanConfirmationPoints: value }))} />
        <TextAreaField label="异常规则" value={form.exceptionRules} onChange={(value) => setForm((prev) => ({ ...prev, exceptionRules: value }))} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={saving || !canSubmit} className="inline-flex rounded-full border border-[var(--line)] px-5 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--panel-soft)] disabled:opacity-60">
          {saving ? "创建中..." : "创建场景"}
        </button>
        {message ? <span className="text-sm text-[var(--text-soft)]">{message}</span> : null}
      </div>
    </form>
  );
}
