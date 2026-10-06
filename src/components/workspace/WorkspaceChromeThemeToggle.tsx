import { Moon, Sparkles, Sun } from "lucide-react";
import { persistWorkspaceChromeTheme, type WorkspaceChromeTheme } from "../../workspace/workspaceChromeTheme";

type Props = {
  theme: WorkspaceChromeTheme;
  storageKey: string;
  onChange: (theme: WorkspaceChromeTheme) => void;
};

export default function WorkspaceChromeThemeToggle({ theme, storageKey, onChange }: Props) {
  // Keep the legacy stored "default" identifier compatible while naming it Dark in the UI.
  const label = theme === "default" ? "Dark" : theme === "light" ? "Light" : "Glow";
  const Icon = theme === "default" ? Moon : theme === "light" ? Sun : Sparkles;
  const cycleTheme = () => {
    const next = theme === "light" ? "default" : theme === "default" ? "glow" : "light";
    persistWorkspaceChromeTheme(storageKey, next);
    onChange(next);
  };

  return (
    <button type="button" className="studio-theme-button workspace-chrome-theme-toggle"
      aria-label={`Theme: ${label}`} title={`Theme: ${label} — click to change`}
      onClick={cycleTheme}>
      <Icon size={18} />
    </button>
  );
}
