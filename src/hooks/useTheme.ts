import { useEffect } from "react";
import { useUiStore } from "@/lib/stores/ui-store";

export function useTheme() {
  const theme = useUiStore((state) => state.theme);
  const toggleTheme = useUiStore((state) => state.toggleTheme);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("khattak-theme", theme);
  }, [theme]);

  return {
    theme,
    toggleTheme,
    isDark: theme === "dark",
  };
}
