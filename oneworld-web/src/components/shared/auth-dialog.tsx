"use client";

import { useState } from "react";

type AuthMode = "login" | "register";

async function submitAuth(endpoint: string, payload: { email: string; password: string; nickname?: string }) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as { message?: string; error?: string };

  if (!response.ok) {
    throw new Error(data.error ?? "提交失败");
  }

  return data;
}

export function AuthDialog({
  triggerLabel,
  mode,
}: {
  triggerLabel: string;
  mode: AuthMode;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data =
        mode === "login"
          ? await submitAuth("/api/auth/login", { email, password })
          : await submitAuth("/api/auth/register", { email, password, nickname });

      setMessage(data.message ?? "提交成功");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "提交失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={mode === "register" ? "rounded-full bg-white px-4 py-2 text-sm font-semibold text-black" : "rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-[var(--text)]"}
      >
        {triggerLabel}
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 px-4 backdrop-blur-sm">
          <div className="shell-card w-full max-w-md rounded-[30px] p-6 shadow-[0_24px_80px_rgba(0,0,0,.26)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold tracking-[-0.03em]">{mode === "login" ? "登录" : "注册"}</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">
                  {mode === "login" ? "先用演示登录流程打通交互，再接真实鉴权。" : "先用演示注册流程恢复可用性，再继续接后端能力。"}
                </p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="text-sm text-[var(--text-soft)]">
                关闭
              </button>
            </div>

            <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
              {mode === "register" ? (
                <label className="grid gap-2 text-sm">
                  <span>昵称</span>
                  <input
                    value={nickname}
                    onChange={(event) => setNickname(event.target.value)}
                    className="rounded-[16px] border border-[var(--line)] bg-[var(--panel-soft)] px-4 py-3"
                    placeholder="输入昵称"
                  />
                </label>
              ) : null}

              <label className="grid gap-2 text-sm">
                <span>邮箱</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="rounded-[16px] border border-[var(--line)] bg-[var(--panel-soft)] px-4 py-3"
                  placeholder="name@example.com"
                  required
                />
              </label>

              <label className="grid gap-2 text-sm">
                <span>密码</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="rounded-[16px] border border-[var(--line)] bg-[var(--panel-soft)] px-4 py-3"
                  placeholder="至少 6 位"
                  required
                />
              </label>

              {message ? <div className="rounded-[16px] border border-[var(--line)] bg-[var(--panel-soft)] px-4 py-3 text-sm text-[var(--text-soft)]">{message}</div> : null}

              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "提交中..." : mode === "login" ? "立即登录" : "立即注册"}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
