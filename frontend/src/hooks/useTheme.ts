import { useEffect } from "react";

export function useTheme() {
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
    document.documentElement.dataset.theme = "light";
    document.documentElement.style.colorScheme = "light";
  }, []);

  return {
    mode: "light" as const,
    theme: "light" as const,
    isDark: false,
    isSystem: false,
    toggleTheme: () => {},
    setTheme: () => {},
  };
}
