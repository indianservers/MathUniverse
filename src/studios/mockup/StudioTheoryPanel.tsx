import type { StudioMockupPage } from "./studioMockupCatalog";
import { studioTheoryContent } from "./studioTheoryContent";
import "./StudioTheoryPanel.css";

export const studioTheoryId = (studioId: string, pageId: string) => `studio-theory-${studioId}-${pageId}`;

export default function StudioTheoryPanel({ studioId, page, mode }: { studioId: string; page: Pick<StudioMockupPage, "id" | "label" | "modes">; mode?: string | null }) {
  const theory = studioTheoryContent[studioId]?.[page.id];
  if (!theory) return null;
  const activeMode = mode && page.modes.includes(mode) ? mode : page.modes[0];
  return (
    <section id={studioTheoryId(studioId, page.id)} className="studio-theory" aria-label={`${page.label} theory and examples`}>
      <div className="studio-theory-heading">
        <div><span className="studio-theory-kicker">LEARN THE WHY</span><h2>{page.label}: theory and worked examples</h2></div>
        {activeMode ? <span className="studio-theory-mode">Current lab mode: {activeMode}</span> : null}
      </div>
      <div className="studio-theory-principles">
        <article><h3>Core idea</h3><p>{theory.principle}</p></article>
        <article><h3>How to work it</h3><p>{theory.method}</p></article>
        <article className="studio-theory-caution"><h3>Watch for</h3><p>{theory.caution}</p></article>
      </div>
      <div className="studio-theory-example-heading"><h3>Three worked examples</h3><p>Use the lab controls to test these relationships.</p></div>
      <div className="studio-theory-examples">
        {theory.examples.map((example, index) => (
          <article key={example.title}>
            <span className="studio-theory-number">{index + 1}</span>
            <h4>{example.title}</h4>
            <p>{example.setup}</p>
            <strong>{example.result}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}
