import { HelpCircle, RotateCcw, RotateCw, Settings } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useTheme } from "../../hooks/useTheme";

export default function AlgebraLabHeading({
  children,
  subtitle,
  modes,
  mode,
  onMode,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  onReset,
  helpTitle = "Explore this lab",
  helpBody = "Select a mode and change its parameters to recompute the model. Use the result and graph together. Challenges check the current values; CAS and proof entry accept expressions with powers such as x^2.",
}: {
  children: ReactNode;
  subtitle?: string;
  modes?: readonly string[];
  mode?: string;
  onMode?: (mode: string) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onReset?: () => void;
  helpTitle?: string;
  helpBody?: string;
}) {
  const [panel, setPanel] = useState<"Help" | "Settings" | null>(null);
  const { fontScale, setFontScale, reducedMotion, setReducedMotion } = useTheme();
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && /input|textarea|select/i.test(target.tagName)) {
        if (event.key === "Escape") setPanel(null);
        return;
      }
      if (event.key === "Escape") setPanel(null);
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) onRedo?.();
        else onUndo?.();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onRedo, onUndo]);
  return (
    <>
      <header className="alg-header">
        <div>
          <h1>{children}</h1>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        {modes && onMode ? (
          <nav className="alg-header-modes" aria-label="Lab modes">
            <small>Mode</small>
            {modes.map((item) => (
              <button key={item} type="button" aria-pressed={item === mode} className={item === mode ? "active" : ""} onClick={() => onMode(item)}>{item}</button>
            ))}
          </nav>
        ) : null}
        <div className="alg-header-actions">
          <button type="button" aria-label="Undo" disabled={!onUndo || !canUndo} onClick={onUndo}><RotateCcw /></button>
          <button type="button" aria-label="Redo" disabled={!onRedo || !canRedo} onClick={onRedo}><RotateCw /></button>
          <button type="button" aria-expanded={panel === "Help"} onClick={() => setPanel(panel === "Help" ? null : "Help")} aria-label="Help"><HelpCircle /></button>
          <button type="button" aria-expanded={panel === "Settings"} onClick={() => setPanel(panel === "Settings" ? null : "Settings")} aria-label="Settings"><Settings /></button>
        </div>
      </header>
      {panel === "Help" && <section className="alg-card"><h2>{helpTitle}</h2><p>{helpBody}</p>{onReset ? <button type="button" className="alg-soft-button" onClick={onReset}>Reset lab</button> : null}</section>}
      {panel === "Settings" && <section className="alg-card"><h2>Display settings</h2><label>Text size<select value={fontScale} onChange={(e) => setFontScale(e.target.value as typeof fontScale)}><option value="base">Standard</option><option value="large">Large</option><option value="xlarge">Extra large</option></select></label><label><input type="checkbox" checked={reducedMotion} onChange={(e) => setReducedMotion(e.target.checked)} />Reduce motion</label></section>}
    </>
  );
}
