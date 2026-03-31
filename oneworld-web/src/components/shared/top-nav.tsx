import Link from "next/link";
import { AuthDialog } from "@/components/shared/auth-dialog";
import { ThemeToggle } from "@/components/shared/theme-toggle";

const links = [
  { href: "/", label: "首页" },
  { href: "/opc", label: "OPC" },
  { href: "/workflow", label: "工作流" },
  { href: "/scenes", label: "场景 AGENT" },
  { href: "/admin/scenes", label: "后台" },
  { href: "/workspace", label: "我的工作台" },
] as const;

export function TopNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-[color:color-mix(in_srgb,var(--background)_72%,transparent)] backdrop-blur-xl">
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-4 px-6 py-5 lg:grid-cols-[220px_minmax(0,1fr)_360px] lg:items-center">
        <div className="flex items-center gap-3 text-lg font-semibold">
          <div className="grid h-10 w-10 place-items-center rounded-2xl border border-[var(--line)] bg-[var(--panel-soft)]">一</div>
          <span>一世界</span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-3 text-sm text-[var(--text-soft)] lg:px-8">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-transparent px-4 py-2 transition hover:border-[var(--line)] hover:bg-[var(--panel-soft)] hover:text-[var(--text)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-start gap-3 lg:justify-end">
          <ThemeToggle />
          <AuthDialog />
        </div>
      </div>
    </header>
  );
}
