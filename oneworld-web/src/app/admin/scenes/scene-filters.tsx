"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type SceneItem = {
  sceneId: string;
  name: string;
  description: string;
  industry: { id: string; name: string };
  role: { id: string; name: string };
  workflow: { id: string; name: string };
  launchPriority: string | null;
  riskLevel: string | null;
  automationLevel: string | null;
  status: string;
};

type Option = { id: string; name: string };

export function AdminSceneFilters({
  items,
  industries,
  roles,
}: {
  items: SceneItem[];
  industries: Option[];
  roles: Option[];
}) {
  const [industryId, setIndustryId] = useState("");
  const [roleId, setRoleId] = useState("");
  const [priority, setPriority] = useState("");
  const [risk, setRisk] = useState("");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchIndustry = !industryId || item.industry.id === industryId;
      const matchRole = !roleId || item.role.id === roleId;
      const matchPriority = !priority || item.launchPriority === priority;
      const matchRisk = !risk || item.riskLevel === risk;
      const keyword = query.trim().toLowerCase();
      const matchQuery =
        !keyword ||
        `${item.name} ${item.description} ${item.industry.name} ${item.role.name} ${item.workflow.name}`
          .toLowerCase()
          .includes(keyword);

      return matchIndustry && matchRole && matchPriority && matchRisk && matchQuery;
    });
  }, [items, industryId, roleId, priority, risk, query]);

  return (
    <div className="grid gap-5">
      <div className="grid gap-4 rounded-[26px] border border-[var(--line)] bg-[var(--panel)] p-5 md:grid-cols-2 xl:grid-cols-5">
        <label className="grid gap-2 text-sm text-[var(--text-soft)]">
          <span>行业</span>
          <select value={industryId} onChange={(e) => setIndustryId(e.target.value)} className="rounded-[16px] border border-[var(--line)] bg-[var(--panel-soft)] px-4 py-3">
            <option value="">全部</option>
            {industries.map((option) => (
              <option key={option.id} value={option.id}>{option.name}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm text-[var(--text-soft)]">
          <span>职业</span>
          <select value={roleId} onChange={(e) => setRoleId(e.target.value)} className="rounded-[16px] border border-[var(--line)] bg-[var(--panel-soft)] px-4 py-3">
            <option value="">全部</option>
            {roles.map((option) => (
              <option key={option.id} value={option.id}>{option.name}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm text-[var(--text-soft)]">
          <span>优先级</span>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="rounded-[16px] border border-[var(--line)] bg-[var(--panel-soft)] px-4 py-3">
            <option value="">全部</option>
            <option value="P0">P0</option>
            <option value="P1">P1</option>
            <option value="P2">P2</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm text-[var(--text-soft)]">
          <span>风险等级</span>
          <select value={risk} onChange={(e) => setRisk(e.target.value)} className="rounded-[16px] border border-[var(--line)] bg-[var(--panel-soft)] px-4 py-3">
            <option value="">全部</option>
            <option value="R1">R1</option>
            <option value="R2">R2</option>
            <option value="R3">R3</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm text-[var(--text-soft)]">
          <span>搜索</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="场景名/行业/职业" className="rounded-[16px] border border-[var(--line)] bg-[var(--panel-soft)] px-4 py-3" />
        </label>
      </div>

      <div className="overflow-hidden rounded-[26px] border border-[var(--line)] bg-[var(--panel)]">
        <div className="grid grid-cols-[1.5fr_1fr_1fr_110px_110px_140px] gap-4 border-b border-[var(--line)] px-5 py-4 text-xs uppercase tracking-[0.08em] text-[var(--text-faint)]">
          <span>场景</span>
          <span>行业</span>
          <span>职业</span>
          <span>优先级</span>
          <span>风险</span>
          <span>操作</span>
        </div>
        {filtered.map((item) => (
          <div key={item.sceneId} className="grid grid-cols-[1.5fr_1fr_1fr_110px_110px_140px] gap-4 border-b border-[var(--line)] px-5 py-4 text-sm last:border-b-0">
            <div>
              <div className="font-semibold text-[var(--text)]">{item.name}</div>
              <div className="mt-1 text-[var(--text-soft)]">{item.description}</div>
            </div>
            <div className="text-[var(--text-soft)]">{item.industry.name}</div>
            <div className="text-[var(--text-soft)]">{item.role.name}</div>
            <div className="text-[var(--text-soft)]">{item.launchPriority ?? "-"}</div>
            <div className="text-[var(--text-soft)]">{item.riskLevel ?? "-"}</div>
            <div>
              <Link href={`/admin/scenes/${item.sceneId}`} className="inline-flex rounded-full border border-[var(--line)] px-4 py-2 text-sm text-[var(--text)] transition hover:bg-[var(--panel-soft)]">
                查看详情
              </Link>
            </div>
          </div>
        ))}
        {filtered.length === 0 ? <div className="px-5 py-6 text-sm text-[var(--text-soft)]">没有找到符合条件的场景。</div> : null}
      </div>
    </div>
  );
}
