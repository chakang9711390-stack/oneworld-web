"use client";

import { useState } from "react";

export function CtaCard({
  title,
  description,
  endpoint,
  idleLabel,
}: {
  title: string;
  description: string;
  endpoint: string;
  idleLabel: string;
}) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (loading) return;

    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(endpoint, { method: "POST" });
      const data = (await response.json()) as { message?: string };
      setMessage(data.message ?? "已收到请求");
    } catch {
      setMessage("请求失败，请稍后重试。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="shell-card flex min-h-[220px] flex-col justify-between rounded-[26px] p-6">
      <div>
        <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl border border-[var(--line)] bg-[var(--panel-soft)] text-2xl font-semibold">
          +
        </div>
        <h3 className="text-2xl font-semibold tracking-[-0.03em]">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-[var(--text-soft)]">{description}</p>
        {message ? <p className="mt-4 text-sm leading-6 text-[var(--text)]">{message}</p> : null}
      </div>

      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="mt-6 rounded-full bg-[var(--button-primary-bg)] px-5 py-3 text-sm font-semibold text-[var(--button-primary-text)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "处理中..." : idleLabel}
      </button>
    </div>
  );
}
