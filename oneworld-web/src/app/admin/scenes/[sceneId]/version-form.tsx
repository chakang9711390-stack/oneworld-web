"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SceneVersionForm({
  sceneId,
  version,
  sourceType,
  maturityLevel,
  validatedCustomersCount,
  owner,
  releaseNotes,
}: {
  sceneId: string;
  version: string;
  sourceType: string;
  maturityLevel: string;
  validatedCustomersCount: number;
  owner: string;
  releaseNotes: string;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    version,
    sourceType,
    maturityLevel,
    validatedCustomersCount,
    owner,
    releaseNotes,
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const response = await fetch(`/api/admin/scenes/${sceneId}/version`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      setMessage("版本信息保存失败，请稍后重试。");
      setSaving(false);
      return;
    }

    setMessage("版本信息保存成功。");
    setSaving(false);
    router.refresh();
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-[var(--text-soft)]">
          <span>当前版本</span>
          <input value={form.version} onChange={(e) => setForm((prev) => ({ ...prev, version: e.target.value }))} className="rounded-[16px] border border-[var(--line)] bg-[var(--panel-soft)] px-4 py-3" />
        </label>
        <label className="grid gap-2 text-sm text-[var(--text-soft)]">
          <span>来源类型</span>
          <select value={form.sourceType} onChange={(e) => setForm((prev) => ({ ...prev, sourceType: e.target.value }))} className="rounded-[16px] border border-[var(--line)] bg-[var(--panel-soft)] px-4 py-3">
            <option value="standard">standard</option>
            <option value="custom">custom</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm text-[var(--text-soft)]">
          <span>成熟度</span>
          <input value={form.maturityLevel} onChange={(e) => setForm((prev) => ({ ...prev, maturityLevel: e.target.value }))} className="rounded-[16px] border border-[var(--line)] bg-[var(--panel-soft)] px-4 py-3" />
        </label>
        <label className="grid gap-2 text-sm text-[var(--text-soft)]">
          <span>已验证客户数</span>
          <input type="number" value={form.validatedCustomersCount} onChange={(e) => setForm((prev) => ({ ...prev, validatedCustomersCount: Number(e.target.value) }))} className="rounded-[16px] border border-[var(--line)] bg-[var(--panel-soft)] px-4 py-3" />
        </label>
        <label className="grid gap-2 text-sm text-[var(--text-soft)] md:col-span-2">
          <span>负责人</span>
          <input value={form.owner} onChange={(e) => setForm((prev) => ({ ...prev, owner: e.target.value }))} className="rounded-[16px] border border-[var(--line)] bg-[var(--panel-soft)] px-4 py-3" />
        </label>
        <label className="grid gap-2 text-sm text-[var(--text-soft)] md:col-span-2">
          <span>版本说明</span>
          <textarea value={form.releaseNotes} onChange={(e) => setForm((prev) => ({ ...prev, releaseNotes: e.target.value }))} rows={4} className="rounded-[16px] border border-[var(--line)] bg-[var(--panel-soft)] px-4 py-3" />
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={saving} className="inline-flex rounded-full border border-[var(--line)] px-5 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--panel-soft)] disabled:opacity-60">
          {saving ? "保存中..." : "保存版本信息"}
        </button>
        {message ? <span className="text-sm text-[var(--text-soft)]">{message}</span> : null}
      </div>
    </form>
  );
}
