import { persistWorkspaceChromeTheme, WORKSPACE_CHROME_LABELS, type WorkspaceChromeTheme } from "../../workspace/workspaceChromeTheme";

type Props = {
  theme: WorkspaceChromeTheme;
  storageKey: string;
  onChange: (theme: WorkspaceChromeTheme) => void;
};

export default function WorkspaceChromeThemeToggle({ theme, storageKey, onChange }: Props) {
  return (
    <div className="workspace-chrome-theme-toggle" role="group" aria-label="Workspace color theme">
      {(["default", "glow", "light"] as const).map((item) => (
        <button
          key={item}
          type="button"
          aria-pressed={theme === item}
          title={WORKSPACE_CHROME_LABELS[item]}
          aria-label={`${WORKSPACE_CHROME_LABELS[item]} theme`}
          onClick={() => {
            persistWorkspaceChromeTheme(storageKey, item);
            onChange(item);
          }}
        >
          {WORKSPACE_CHROME_LABELS[item]}
        </button>
      ))}
    </div>
  );
}
