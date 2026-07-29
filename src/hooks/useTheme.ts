import { useEffect, useState, useCallback } from "react";
import { useUiStore, type ThemeMode } from "@/lib/stores/ui-store";

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function computeEffective(mode: ThemeMode): "light" | "dark" {
  return mode === "system" ? getSystemTheme() : mode;
}

export function useTheme() {
  const mode = useUiStore((state) => state.theme);
  const setTheme = useUiStore((state) => state.setTheme);
  const toggleTheme = useUiStore((state) => state.toggleTheme);
  const [effective, setEffective] = useState<"light" | "dark">(computeEffective(mode));

  const applyTheme = useCallback((effectiveTheme: "light" | "dark") => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(effectiveTheme);
    document.documentElement.dataset.theme = effectiveTheme;
    window.localStorage.setItem("khattak-theme", mode);
  }, [mode]);

  useEffect(() => {
    const t = computeEffective(mode);
    setEffective(t);
    applyTheme(t);
  }, [mode, applyTheme]);

  useEffect(() => {
    if (mode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const t = getSystemTheme();
      setEffective(t);
      applyTheme(t);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [mode, applyTheme]);

  return {
    mode,
    theme: effective,
    isDark: effective === "dark",
    isSystem: mode === "system",
    toggleTheme,
    setTheme: (t: ThemeMode) => setTheme(t),
  };
}
