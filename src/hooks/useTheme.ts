import { useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";

export type Theme = "light" | "dark" | "high-contrast";

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>("math-universe-theme", "light");
  const [fontScale, setFontScale] = useLocalStorage<"base" | "large" | "xlarge">("math-universe-font-scale", "base");
  const [reducedMotion, setReducedMotion] = useLocalStorage("math-universe-reduced-motion", false);
  const [colorBlindPalette, setColorBlindPalette] = useLocalStorage("math-universe-color-blind-palette", false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.classList.toggle("high-contrast", theme === "high-contrast");
    root.style.fontSize = fontScale === "xlarge" ? "18px" : fontScale === "large" ? "17px" : "";
    root.classList.toggle("reduced-motion", reducedMotion);
    root.classList.toggle("color-blind-palette", colorBlindPalette);
  }, [colorBlindPalette, fontScale, reducedMotion, theme]);

  return {
    theme,
    setTheme,
    fontScale,
    setFontScale,
    reducedMotion,
    setReducedMotion,
    colorBlindPalette,
    setColorBlindPalette,
    toggleTheme: () => setTheme((current) => current === "dark" ? "high-contrast" : current === "high-contrast" ? "light" : "dark"),
  };
}
