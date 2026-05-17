import { useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";

export type Theme = "light" | "dark";

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>("math-universe-theme", "dark");

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return {
    theme,
    setTheme,
    toggleTheme: () => setTheme((current) => (current === "dark" ? "light" : "dark")),
  };
}
