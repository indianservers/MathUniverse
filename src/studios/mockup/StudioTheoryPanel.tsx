import { useEffect, useState, type KeyboardEvent } from "react";
import type { StudioMockupPage } from "./studioMockupCatalog";
import { studioSimpleWords } from "./studioSimpleWords";
import { studioTheoryContent } from "./studioTheoryContent";
import "./StudioTheoryPanel.css";

export const studioTheoryId = (studioId: string, pageId: string) => `studio-theory-${studioId}-${pageId}`;
type TheoryTab = "theory" | "simple";

export default function StudioTheoryPanel({ studioId, page, mode }: { studioId: string; page: Pick<StudioMockupPage, "id" | "label" | "modes"> & Partial<Pick<StudioMockupPage, "learning">>; mode?: string | null }) {
  const [activeTab, setActiveTab] = useState<TheoryTab>("theory");
  useEffect(() => setActiveTab("theory"), [studioId, page.id]);
  const theory = studioTheoryContent[studioId]?.[page.id];
  const simple = studioSimpleWords[studioId]?.[page.id];
  if (!theory || !simple) return null;
  const activeMode = mode && page.modes.includes(mode) ? mode : page.modes[0];
  const baseId = studioTheoryId(studioId, page.id);
  const chooseWithKeyboard = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next: TheoryTab = event.key === "Home" ? "theory" : event.key === "End" ? "simple" : activeTab === "theory" ? "simple" : "theory";
    setActiveTab(next);
    document.getElementById(`${baseId}-tab-${next}`)?.focus();
  };
  return (
    <section id={baseId} className="studio-theory" aria-label={`${page.label} learning content`}>
      <div className="studio-theory-heading">
        <div><span className="studio-theory-kicker">LEARN THE WHY</span><h2>{page.label}: learn and explore</h2></div>
        {activeMode ? <span className="studio-theory-mode">Current lab mode: {activeMode}</span> : null}
      </div>
      <div className="studio-theory-tabs" role="tablist" aria-label={`${page.label} explanations`}>
        <button id={`${baseId}-tab-theory`} type="button" role="tab" aria-selected={activeTab === "theory"} aria-controls={`${baseId}-panel-theory`} tabIndex={activeTab === "theory" ? 0 : -1} onClick={() => setActiveTab("theory")} onKeyDown={chooseWithKeyboard}>Theory &amp; examples</button>
        <button id={`${baseId}-tab-simple`} type="button" role="tab" aria-selected={activeTab === "simple"} aria-controls={`${baseId}-panel-simple`} tabIndex={activeTab === "simple" ? 0 : -1} onClick={() => setActiveTab("simple")} onKeyDown={chooseWithKeyboard}>In Simple words</button>
      </div>
      <div id={`${baseId}-panel-simple`} className="studio-theory-simple" role="tabpanel" aria-labelledby={`${baseId}-tab-simple`} hidden={activeTab !== "simple"}>
        <span className="studio-theory-kicker">THE SAME IDEA, PLAINLY</span>
        <p>{simple}</p>
      </div>
      <div id={`${baseId}-panel-theory`} role="tabpanel" aria-labelledby={`${baseId}-tab-theory`} hidden={activeTab !== "theory"}>
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
      {page.learning && page.id !== "home" ? (
        <div className="studio-theory-experiment">
          <div><h3>Test it in the live lab</h3><p>{page.learning.try}</p><strong>{page.learning.why}</strong></div>
          <button type="button" onClick={(event) => {
            let scroller: HTMLElement | null = event.currentTarget.parentElement;
            while (scroller && scroller.scrollHeight <= scroller.clientHeight + 1) scroller = scroller.parentElement;
            if (scroller) scroller.scrollTo({ top: 0, behavior: "smooth" });
            else window.scrollTo({ top: 0, behavior: "smooth" });
          }}>Back to lab controls ↑</button>
        </div>
      ) : null}
      </div>
    </section>
  );
}
