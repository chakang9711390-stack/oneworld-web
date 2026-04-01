"use client";

import { useEffect, useMemo, useState } from "react";

type PanelMode = "login" | "register";
type Provider = "google" | "apple";

type AuthUser = {
  id: string;
  email: string;
  nickname?: string | null;
  isAdmin?: boolean;
};

type AuthResponse = {
  ok?: boolean;
  error?: string;
  message?: string;
  user?: AuthUser;
};

const loginBenefits = ["继续你的项目工作台", "同步 OPC / 工作流 进度", "后续可无缝接入正式第三方登录"];
const registerBenefits = ["用邮箱创建你的专属账号", "后续可绑定 Google / Apple", "为正式商用认证体系预留结构"];

async function submitJson<T>(url: string, payload?: object, method: "GET" | "POST" = "POST") {
  const response = await fetch(url, {
    method,
    headers: method === "POST" ? { "Content-Type": "application/json" } : undefined,
    body: method === "POST" ? JSON.stringify(payload ?? {}) : undefined,
    credentials: "include",
  });

  const data = (await response.json()) as T;

  if (!response.ok) {
    const message = (data as AuthResponse).error ?? "请求失败";
    throw new Error(message);
  }

  return data;
}

function ProviderButton({ provider, onClick }: { provider: Provider; onClick: (provider: Provider) => void }) {
  const label = provider === "google" ? "Google" : "Apple";
  const icon = provider === "google" ? "G" : "";

  return (
    <button
      type="button"
      onClick={() => onClick(provider)}
      className="flex h-12 items-center justify-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--panel-soft)] px-4 text-sm font-medium text-[var(--text)] transition hover:border-[var(--line-strong)] hover:bg-[var(--panel)]"
    >
      <span className="grid h-7 w-7 place-items-center rounded-full border border-[var(--line)] bg-[var(--background)] text-sm font-semibold">
        {icon}
      </span>
      <span>继续使用 {label}</span>
    </button>
  );
}

export function AuthDialog() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<PanelMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<string>("");
  const [noticeType, setNoticeType] = useState<"success" | "error" | "info">("info");
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [checkingUser, setCheckingUser] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadCurrentUser() {
      try {
        const response = await fetch("/api/auth/me", { credentials: "include" });
        const data = await response.json();
        if (!mounted) return;
        setCurrentUser(data || null);
      } catch {
        if (!mounted) return;
        setCurrentUser(null);
      } finally {
        if (mounted) {
          setCheckingUser(false);
        }
      }
    }

    loadCurrentUser();

    return () => {
      mounted = false;
    };
  }, []);

  const panelCopy = useMemo(
    () => ({
      login: {
        eyebrow: "欢迎回来",
        title: "登录一世界",
        description: "用邮箱继续进入你的项目工作台。Google / Apple 登录结构已预留，正式域名确定后可直接接入。",
        primaryLabel: submitting ? "登录中..." : "邮箱登录",
        alternateLabel: "还没有账号？去注册",
        benefits: loginBenefits,
      },
      register: {
        eyebrow: "创建账号",
        title: "注册一世界",
        description: "先用邮箱完成账号创建，后续可以无缝补接 Google / Apple 登录能力。",
        primaryLabel: submitting ? "注册中..." : "创建账号",
        alternateLabel: "已有账号？去登录",
        benefits: registerBenefits,
      },
    }),
    [submitting],
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setNotice("");

    try {
      const payload = mode === "register" ? { email, password, nickname } : { email, password };
      const url = mode === "register" ? "/api/auth/register" : "/api/auth/login";
      const data = await submitJson<AuthResponse>(url, payload);
      setNotice(data.message ?? (mode === "register" ? "注册成功" : "登录成功"));
      setNoticeType("success");
      setCurrentUser(data.user ?? null);
      setOpen(false);
      window.location.reload();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "提交失败");
      setNoticeType("error");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout() {
    setSubmitting(true);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setCurrentUser(null);
      window.location.reload();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleProviderLogin(provider: Provider) {
    setNoticeType("info");
    if (provider === "google") {
      setNotice("Google 登录入口已按正式结构预留，待正式域名确定后直接接入 OAuth。\n当前阶段先使用邮箱登录。");
      return;
    }

    setNotice("Apple 登录入口已按正式结构预留，待正式域名确定后直接接入 Apple Sign In。\n当前阶段先使用邮箱登录。");
  }

  function handleOpen(nextMode: PanelMode) {
    setMode(nextMode);
    setOpen(true);
    setNotice("");
  }

  const currentPanel = panelCopy[mode];

  if (checkingUser) {
    return <div className="rounded-full border border-[var(--line)] bg-[var(--panel-soft)] px-4 py-2 text-sm text-[var(--text-soft)]">加载中...</div>;
  }

  if (currentUser) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--panel-soft)] px-4 py-2 text-sm text-[var(--text)]">
          <span>{currentUser.nickname || currentUser.email}</span>
          {currentUser.isAdmin ? (
            <span className="rounded-full bg-[var(--button-primary-bg)] px-2 py-0.5 text-xs font-semibold text-[var(--button-primary-text)]">Admin</span>
          ) : null}
        </div>
        <button
          type="button"
          onClick={handleLogout}
          disabled={submitting}
          className="rounded-full border border-[var(--line)] bg-[var(--panel-soft)] px-4 py-2 text-sm text-[var(--text)] transition hover:border-[var(--line-strong)] hover:bg-[var(--panel)] disabled:opacity-60"
        >
          {submitting ? "退出中..." : "退出"}
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => handleOpen("login")}
          className="rounded-full border border-[var(--line)] bg-[var(--panel-soft)] px-4 py-2 text-sm text-[var(--text)] transition hover:border-[var(--line-strong)] hover:bg-[var(--panel)]"
        >
          登录
        </button>
        <button
          type="button"
          onClick={() => handleOpen("register")}
          className="rounded-full bg-[var(--button-primary-bg)] px-4 py-2 text-sm font-semibold text-[var(--button-primary-text)] transition hover:opacity-92"
        >
          注册
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 bg-[rgba(3,4,8,.62)] px-4 py-6 backdrop-blur-xl">
          <div className="mx-auto grid min-h-full w-full max-w-[1040px] place-items-center">
            <div className="auth-modal-grid w-full overflow-hidden rounded-[36px] border border-[var(--line-strong)] bg-[var(--background-2)] shadow-[0_40px_120px_rgba(0,0,0,.32)]">
              <aside className="relative overflow-hidden border-b border-[var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,.05),rgba(255,255,255,.015))] p-8 lg:border-b-0 lg:border-r">
                <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(255,255,255,.12),transparent_70%)]" />
                <div className="relative z-10 flex h-full flex-col justify-between gap-8">
                  <div className="grid gap-4">
                    <div className="inline-flex w-fit items-center rounded-full border border-[var(--line)] bg-[var(--panel-soft)] px-3 py-1 text-xs tracking-[0.18em] text-[var(--text-soft)] uppercase">
                      {currentPanel.eyebrow}
                    </div>
                    <div className="grid gap-3">
                      <h2 className="text-4xl font-semibold tracking-[-0.04em] text-[var(--text)]">{currentPanel.title}</h2>
                      <p className="max-w-md text-sm leading-7 text-[var(--text-soft)]">{currentPanel.description}</p>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    {currentPanel.benefits.map((item) => (
                      <div key={item} className="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--panel-soft)] px-4 py-3 text-sm text-[var(--text)]">
                        <span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--button-primary-bg)] text-xs font-semibold text-[var(--button-primary-text)]">
                          ✓
                        </span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>

              <section className="p-8 lg:p-10">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-[var(--text-soft)]">一世界账号系统</p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--text)]">
                      {mode === "login" ? "继续你的工作流" : "创建你的专属账号"}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-full border border-[var(--line)] px-3 py-1.5 text-sm text-[var(--text-soft)] transition hover:border-[var(--line-strong)] hover:bg-[var(--panel-soft)] hover:text-[var(--text)]"
                  >
                    关闭
                  </button>
                </div>

                <div className="mt-8 grid gap-3">
                  <ProviderButton provider="google" onClick={handleProviderLogin} />
                  <ProviderButton provider="apple" onClick={handleProviderLogin} />
                </div>

                <div className="my-7 flex items-center gap-4 text-xs uppercase tracking-[0.18em] text-[var(--text-faint)]">
                  <span className="h-px flex-1 bg-[var(--line)]" />
                  <span>或使用邮箱</span>
                  <span className="h-px flex-1 bg-[var(--line)]" />
                </div>

                <form className="grid gap-4" onSubmit={handleSubmit}>
                  {mode === "register" ? (
                    <label className="grid gap-2">
                      <span className="text-sm text-[var(--text-soft)]">昵称</span>
                      <input
                        value={nickname}
                        onChange={(event) => setNickname(event.target.value)}
                        className="h-13 rounded-[18px] border border-[var(--line)] bg-[var(--panel-soft)] px-4 text-[15px] text-[var(--text)] placeholder:text-[var(--text-soft)] transition focus:border-[var(--line-strong)]"
                        placeholder="输入你的昵称"
                      />
                    </label>
                  ) : null}

                  <label className="grid gap-2">
                    <span className="text-sm text-[var(--text-soft)]">邮箱</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="h-13 rounded-[18px] border border-[var(--line)] bg-[var(--panel-soft)] px-4 text-[15px] text-[var(--text)] placeholder:text-[var(--text-soft)] transition focus:border-[var(--line-strong)]"
                      placeholder="name@example.com"
                      required
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm text-[var(--text-soft)]">密码</span>
                    <input
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="h-13 rounded-[18px] border border-[var(--line)] bg-[var(--panel-soft)] px-4 text-[15px] text-[var(--text)] placeholder:text-[var(--text-soft)] transition focus:border-[var(--line-strong)]"
                      placeholder={mode === "login" ? "输入密码" : "至少 8 位，建议包含字母与数字"}
                      required
                    />
                  </label>

                  {notice ? (
                    <div
                      className={noticeType === "error"
                        ? "rounded-[18px] border border-[rgba(255,120,120,.24)] bg-[rgba(120,24,24,.18)] px-4 py-3 text-sm leading-6 text-[rgb(255,210,210)]"
                        : noticeType === "success"
                          ? "rounded-[18px] border border-[rgba(112,210,160,.22)] bg-[rgba(20,88,56,.18)] px-4 py-3 text-sm leading-6 text-[rgb(214,255,229)]"
                          : "rounded-[18px] border border-[var(--line)] bg-[var(--panel-soft)] px-4 py-3 text-sm leading-6 text-[var(--text-soft)]"
                      }
                    >
                      {notice}
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-2 flex h-13 items-center justify-center rounded-full bg-[var(--button-primary-bg)] px-5 text-sm font-semibold text-[var(--button-primary-text)] transition hover:opacity-92 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {currentPanel.primaryLabel}
                  </button>
                </form>

                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === "login" ? "register" : "login");
                    setNotice("");
                  }}
                  className="mt-5 text-sm text-[var(--text-soft)] transition hover:text-[var(--text)]"
                >
                  {currentPanel.alternateLabel}
                </button>
              </section>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
