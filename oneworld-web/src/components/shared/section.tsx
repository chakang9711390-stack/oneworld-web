import Link from "next/link";
import { ReactNode } from "react";

export function PageShell({ children }: { children: ReactNode }) {
  return <main className="shell-page">{children}</main>;
}

export function Hero() {
  return (
    <section className="shell-card grid gap-6 overflow-hidden rounded-[34px] px-8 py-12 shadow-[0_24px_80px_rgba(0,0,0,.18)] md:px-12">
      <h1 className="text-center text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
        OPC / 工作流一键生成平台
      </h1>
      <div className="grid gap-4 md:grid-cols-[1fr_auto]">
        <div className="flex min-h-14 items-center rounded-[20px] border border-[var(--line)] bg-[var(--panel-soft)] px-5 text-sm text-[var(--text-soft)]">
          我想找到适合自己的 OPC，或者直接进入产品工作流
        </div>
        <Link href="/opc" className="inline-flex items-center justify-center rounded-full bg-[var(--button-primary-bg)] px-6 py-3 text-sm font-semibold text-[var(--button-primary-text)] transition hover:opacity-92">
          开始探索
        </Link>
      </div>
    </section>
  );
}

export function SectionCard({ title, description, extra }: { title: string; description?: string; extra?: ReactNode }) {
  return (
    <section className="shell-card rounded-[26px] p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-[-0.03em]">{title}</h2>
          {description ? <p className="mt-2 max-w-3xl text-sm leading-7 text-white/60">{description}</p> : null}
        </div>
        {extra}
      </div>
    </section>
  );
}

export function GridCard({ title, description, meta, href }: { title: string; description: string; meta: string; href?: string }) {
  const content = (
    <div className="shell-card flex min-h-[220px] flex-col justify-between rounded-[26px] p-6 transition hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_24px_80px_rgba(0,0,0,.42)]">
      <div>
        <h3 className="text-2xl font-semibold tracking-[-0.03em]">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-white/60">{description}</p>
      </div>
      <div className="mt-6 flex items-center justify-between text-sm text-white/70">
        <span>{meta}</span>
        <span>进入 →</span>
      </div>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

export function SimpleBreadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-white/60">
      {items.map((item, index) => (
        <div key={`${item.label}-${index}`} className="flex items-center gap-2">
          {item.href ? <Link href={item.href}>{item.label}</Link> : <span>{item.label}</span>}
          {index < items.length - 1 ? <span>/</span> : null}
        </div>
      ))}
    </div>
  );
}
