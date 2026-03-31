import { ReactNode } from "react";
import Link from "next/link";
import { PageShell } from "@/components/shared/section";

const adminLinks = [
  { href: "/admin/scenes", label: "场景管理" },
  { href: "/admin/industries", label: "行业管理" },
  { href: "/admin/roles", label: "职业管理" },
  { href: "/admin/workflows", label: "工作流管理" },
] as const;

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <PageShell>
      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="shell-card rounded-[26px] p-5">
          <div className="mb-4 text-sm font-semibold tracking-[0.08em] text-[var(--text-soft)]">管理后台</div>
          <nav className="grid gap-2">
            {adminLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl border border-transparent px-4 py-3 text-sm text-[var(--text-soft)] transition hover:border-[var(--line)] hover:bg-[var(--panel-soft)] hover:text-[var(--text)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div>{children}</div>
      </div>
    </PageShell>
  );
}
