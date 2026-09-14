import { HelpCircle, RotateCcw, RotateCw, Settings } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useTheme } from "../../hooks/useTheme";

export default function AlgebraLabHeading({
  children,
  subtitle,
  modes,
  mode,
  onMode,
}: {
  children: ReactNode;
  subtitle?: string;
  modes?: readonly string[];
  mode?: string;
  onMode?: (mode: string) => void;
}) {
  const [panel, setPanel] = useState<"Help" | "Settings" | null>(null);
  const { fontScale, setFontScale, reducedMotion, setReducedMotion } = useTheme();
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
          <button type="button" aria-label="Undo"><RotateCcw /></button>
          <button type="button" aria-label="Redo"><RotateCw /></button>
          <button type="button" aria-expanded={panel === "Help"} onClick={() => setPanel(panel === "Help" ? null : "Help")} aria-label="Help"><HelpCircle /></button>
          <button type="button" aria-expanded={panel === "Settings"} onClick={() => setPanel(panel === "Settings" ? null : "Settings")} aria-label="Settings"><Settings /></button>
        </div>
      </header>
      {panel === "Help" && <section className="alg-card"><h2>Explore this lab</h2><p>Select a mode and change its parameters to recompute the model. Use the result and graph together. Challenges check the current values; CAS and proof entry accept expressions with powers such as x^2.</p></section>}
      {panel === "Settings" && <section className="alg-card"><h2>Display settings</h2><label>Text size<select value={fontScale} onChange={(e) => setFontScale(e.target.value as typeof fontScale)}><option value="base">Standard</option><option value="large">Large</option><option value="xlarge">Extra large</option></select></label><label><input type="checkbox" checked={reducedMotion} onChange={(e) => setReducedMotion(e.target.checked)} />Reduce motion</label></section>}
    </>
  );
}
