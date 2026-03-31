"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminSceneActions({ sceneId }: { sceneId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function updateStatus(status: "active" | "disabled" | "archived") {
    setLoading(status);
    await fetch(`/api/admin/scenes/${sceneId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setLoading(null);
    router.refresh();
  }

  async function copyScene() {
    setLoading("copy");
    const response = await fetch(`/api/admin/scenes/${sceneId}/copy`, {
      method: "POST",
    });
    const result = await response.json();
    setLoading(null);
    if (result?.item?.sceneId) {
      router.push(`/admin/scenes/${result.item.sceneId}`);
      router.refresh();
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button type="button" onClick={() => updateStatus("active")} disabled={!!loading} className="inline-flex rounded-full border border-[var(--line)] px-4 py-2 text-sm text-[var(--text)] transition hover:bg-[var(--panel-soft)] disabled:opacity-60">
        {loading === "active" ? "处理中..." : "启用"}
      </button>
      <button type="button" onClick={() => updateStatus("disabled")} disabled={!!loading} className="inline-flex rounded-full border border-[var(--line)] px-4 py-2 text-sm text-[var(--text)] transition hover:bg-[var(--panel-soft)] disabled:opacity-60">
        {loading === "disabled" ? "处理中..." : "下线"}
      </button>
      <button type="button" onClick={() => updateStatus("archived")} disabled={!!loading} className="inline-flex rounded-full border border-[var(--line)] px-4 py-2 text-sm text-[var(--text)] transition hover:bg-[var(--panel-soft)] disabled:opacity-60">
        {loading === "archived" ? "处理中..." : "归档"}
      </button>
      <button type="button" onClick={copyScene} disabled={!!loading} className="inline-flex rounded-full border border-[var(--line)] px-4 py-2 text-sm text-[var(--text)] transition hover:bg-[var(--panel-soft)] disabled:opacity-60">
        {loading === "copy" ? "复制中..." : "复制场景"}
      </button>
    </div>
  );
}
