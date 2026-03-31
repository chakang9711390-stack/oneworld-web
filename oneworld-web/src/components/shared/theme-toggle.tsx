"use client";

import { useEffect, useSyncExternalStore } from "react";

const STORAGE_KEY = "oneworld-theme";

type ThemeMode = "light" | "dark";

function readStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return "dark";
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return saved === "light" || saved === "dark" ? saved : "dark";
}

function applyTheme(theme: ThemeMode) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      callback();
    }
  };

  window.addEventListener("storage", handleStorage);
  return () => window.removeEventListener("storage", handleStorage);
}

export function ThemeToggle() {
  const theme = useSyncExternalStore<ThemeMode>(subscribe, readStoredTheme, () => "dark");

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  function handleToggle() {
    const nextTheme: ThemeMode = theme === "dark" ? "light" : "dark";
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
    window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY, newValue: nextTheme }));
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="rounded-full border border-[var(--line)] bg-[var(--panel-soft)] px-4 py-2 text-sm text-[var(--text)] transition hover:border-[var(--line-strong)] hover:bg-[var(--panel)]"
      aria-label={`切换到${theme === "dark" ? "亮色" : "暗色"}模式`}
      suppressHydrationWarning
    >
      <span suppressHydrationWarning>{theme === "dark" ? "亮色" : "暗色"}</span>
    </button>
  );
}
