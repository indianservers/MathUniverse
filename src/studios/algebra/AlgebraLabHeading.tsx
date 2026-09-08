import { useState, type ReactNode } from "react";
import { useTheme } from "../../hooks/useTheme";

export default function AlgebraLabHeading({ children }: { children: ReactNode }) {
  const [panel, setPanel] = useState<"Help" | "Settings" | null>(null);
  const { toggleTheme, fontScale, setFontScale, reducedMotion, setReducedMotion } = useTheme();
  return <><header className="alg-header"><h1>{children}</h1><div className="alg-header-actions">{(["Help", "Settings"] as const).map((name) => <button type="button" key={name} aria-expanded={panel === name} onClick={() => setPanel(panel === name ? null : name)}>{name}</button>)}<button type="button" onClick={toggleTheme}>Theme</button></div></header>{panel === "Help" && <section className="alg-card"><h2>Explore this lab</h2><p>Select a mode and change its parameters to recompute the model. Use the result and graph together. Challenges check the current values; CAS and proof entry accept expressions with powers such as x^2.</p></section>}{panel === "Settings" && <section className="alg-card"><h2>Display settings</h2><label>Text size<select value={fontScale} onChange={(e) => setFontScale(e.target.value as typeof fontScale)}><option value="base">Standard</option><option value="large">Large</option><option value="xlarge">Extra large</option></select></label><label><input type="checkbox" checked={reducedMotion} onChange={(e) => setReducedMotion(e.target.checked)} />Reduce motion</label></section>}</>;
}
