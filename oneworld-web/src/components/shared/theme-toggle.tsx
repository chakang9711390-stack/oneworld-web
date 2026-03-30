"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "oneworld-theme";

type ThemeMode = "light" | "dark";

function applyTheme(theme: ThemeMode) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    const nextTheme = saved === "light" || saved === "dark" ? saved : "dark";
    applyTheme(nextTheme);
    setTheme(nextTheme);
    setMounted(true);
  }, []);

  function handleToggle() {
    const nextTheme: ThemeMode = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme);
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-[var(--text)] transition hover:border-white/20 hover:bg-white/10"
      aria-label={mounted ? `切换到${theme === "dark" ? "亮色" : "暗色"}模式` : "切换主题"}
    >
      {mounted ? (theme === "dark" ? "亮色" : "暗色") : "主题"}
    </button>
  );
}
