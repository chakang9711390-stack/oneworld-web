import Link from "next/link";

const links = [
  { href: "/", label: "首页" },
  { href: "/opc", label: "OPC" },
  { href: "/workflow", label: "工作流" },
  { href: "/workspace", label: "我的工作台" },
] as const;

export function TopNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-black/40 backdrop-blur-xl">
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-4 px-6 py-5 lg:grid-cols-[220px_1fr_220px] lg:items-center">
        <div className="flex items-center gap-3 text-lg font-semibold">
          <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/15 bg-white/5">一</div>
          <span>一世界</span>
        </div>

        <nav className="flex flex-wrap items-center gap-3 text-sm text-white/70">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-transparent px-4 py-2 transition hover:border-white/10 hover:bg-white/5 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-start gap-3 lg:justify-end">
          <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/85">登录</button>
          <button className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">注册</button>
        </div>
      </div>
    </header>
  );
}
