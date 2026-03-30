"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export type SearchItem = {
  title: string;
  description: string;
  href?: string;
  meta: string;
};

export function SearchBox({
  placeholder,
  items,
  emptyText = "没有匹配结果",
}: {
  placeholder: string;
  items: SearchItem[];
  emptyText?: string;
}) {
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return items;

    return items.filter((item) => {
      const text = `${item.title} ${item.description} ${item.meta}`.toLowerCase();
      return text.includes(keyword);
    });
  }, [items, query]);

  return (
    <div className="grid gap-4">
      <div className="shell-card rounded-[22px] p-4">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--panel-soft)] px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--text-soft)]"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredItems.map((item) => {
          const card = (
            <div className="shell-card flex min-h-[220px] flex-col justify-between rounded-[26px] p-6 transition hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_24px_80px_rgba(0,0,0,.16)]">
              <div>
                <h3 className="text-2xl font-semibold tracking-[-0.03em]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--text-soft)]">{item.description}</p>
              </div>
              <div className="mt-6 flex items-center justify-between text-sm text-[var(--text-soft)]">
                <span>{item.meta}</span>
                <span>{item.href ? "进入 →" : "仅展示"}</span>
              </div>
            </div>
          );

          return item.href ? (
            <Link key={`${item.title}-${item.meta}`} href={item.href}>
              {card}
            </Link>
          ) : (
            <div key={`${item.title}-${item.meta}`}>{card}</div>
          );
        })}
      </div>

      {filteredItems.length === 0 ? (
        <div className="shell-card rounded-[22px] px-5 py-4 text-sm text-[var(--text-soft)]">{emptyText}</div>
      ) : null}
    </div>
  );
}
