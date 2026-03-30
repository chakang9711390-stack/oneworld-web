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
        <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl border border-white/15 bg-white/7 text-2xl font-semibold">
          +
        </div>
        <h3 className="text-2xl font-semibold tracking-[-0.03em]">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-white/60">{description}</p>
        {message ? <p className="mt-4 text-sm leading-6 text-white/80">{message}</p> : null}
      </div>

      <button
        onClick={handleClick}
        disabled={loading}
        className="mt-6 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "处理中..." : idleLabel}
      </button>
    </div>
  );
}
