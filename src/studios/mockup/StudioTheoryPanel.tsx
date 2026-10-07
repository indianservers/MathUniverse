import { LabSectionContext } from '../curriculum/FocusedLab';
import { useContext, useEffect, useState, type KeyboardEvent } from "react";
import type { StudioMockupPage } from "./studioMockupCatalog";
import { studioSimpleWords } from "./studioSimpleWords";
import { studioTheoryContent } from "./studioTheoryContent";
import { studioFormulaCards } from "./studioLearningTabs";
import "./StudioTheoryPanel.css";

export const studioTheoryId = (studioId: string, pageId: string) => `studio-theory-${studioId}-${pageId}`;
const theoryTabs = [
  { id: "theory", label: "Theory & examples" },
  { id: "simple", label: "In Simple words" },
  { id: "formulas", label: "Formulas" },
  { id: "live", label: "Real-time examples" },
  { id: "practice", label: "Try these" },
] as const;
type TheoryTab = (typeof theoryTabs)[number]["id"];

export default function StudioTheoryPanel({ studioId, page, mode }: { studioId: string; page: Pick<StudioMockupPage, "id" | "label" | "modes"> & Partial<Pick<StudioMockupPage, "learning">>; mode?: string | null }) {
  const labSection=useContext(LabSectionContext);
  useEffect(()=>{if(labSection)setActiveTab(labSection==='meaning'?'simple':labSection==='uses'?'live':labSection==='quiz'?'practice':'theory');},[labSection]);
  const [activeTab, setActiveTab] = useState<TheoryTab>("theory");
  const [exampleIndex, setExampleIndex] = useState(0);
  useEffect(() => { setActiveTab("theory"); setExampleIndex(0); }, [studioId, page.id]);
  const theory = studioTheoryContent[studioId]?.[page.id];
  const simple = studioSimpleWords[studioId]?.[page.id];
  if (!theory || !simple) return null;
  const activeMode = mode && page.modes.includes(mode) ? mode : page.modes[0];
  const baseId = studioTheoryId(studioId, page.id);
  const formulas = studioFormulaCards(studioId, page.id, theory);
  const jumpToLab = (element: HTMLElement) => {
    let scroller: HTMLElement | null = element.parentElement;
    while (scroller && scroller.scrollHeight <= scroller.clientHeight + 1) scroller = scroller.parentElement;
    if (scroller) scroller.scrollTo({ top: 0, behavior: "smooth" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const chooseWithKeyboard = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const index = theoryTabs.findIndex((tab) => tab.id === activeTab);
    const next = event.key === "Home" ? theoryTabs[0].id : event.key === "End" ? theoryTabs.at(-1)!.id : theoryTabs[(index + (event.key === "ArrowRight" ? 1 : -1) + theoryTabs.length) % theoryTabs.length].id;
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
        {theoryTabs.map((tab) => <button key={tab.id} id={`${baseId}-tab-${tab.id}`} type="button" role="tab" aria-selected={activeTab === tab.id} aria-controls={`${baseId}-panel-${tab.id}`} tabIndex={activeTab === tab.id ? 0 : -1} onClick={() => setActiveTab(tab.id)} onKeyDown={chooseWithKeyboard}>{tab.label}</button>)}
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
          <button type="button" onClick={(event) => jumpToLab(event.currentTarget)}>Back to lab controls ↑</button>
        </div>
      ) : null}
      </div>
      <div id={`${baseId}-panel-formulas`} role="tabpanel" aria-labelledby={`${baseId}-tab-formulas`} hidden={activeTab !== "formulas"}>
        <p className="studio-theory-tab-intro">Relationships used in {page.label}. Each card shows the setup that makes the relationship useful.</p>
        <div className="studio-theory-formula-grid">
          {formulas.map((formula, index) => <article key={`${formula.title}-${index}`}>
            <span className="studio-theory-number">{index + 1}</span><h3>{formula.title}</h3>
            <div className="studio-theory-formula" aria-label={`${formula.title} relationship`}>{formula.expression}</div>
            <p><strong>Given:</strong> {formula.context}</p>
            {formula.result !== formula.expression && <p><strong>What it tells us:</strong> {formula.result}</p>}
          </article>)}
        </div>
      </div>
      <div id={`${baseId}-panel-live`} role="tabpanel" aria-labelledby={`${baseId}-tab-live`} hidden={activeTab !== "live"}>
        <p className="studio-theory-tab-intro">Choose a situation, then change the matching quantities in the lab and compare its displayed result.</p>
        <div className="studio-theory-example-chooser" role="group" aria-label={`${page.label} example situations`}>
          {theory.examples.map((example, index) => <button key={example.title} type="button" aria-pressed={exampleIndex === index} onClick={() => setExampleIndex(index)}>{index + 1}. {example.title}</button>)}
        </div>
        <article className="studio-theory-live-card">
          <span className="studio-theory-kicker">EXAMPLE {exampleIndex + 1} OF 3</span>
          <h3>{theory.examples[exampleIndex].title}</h3>
          <p><strong>Set up:</strong> {theory.examples[exampleIndex].setup}</p>
          <p><strong>Expected result:</strong> {theory.examples[exampleIndex].result}</p>
          {page.learning?.observe && <p><strong>Observe in this lab:</strong> {page.learning.observe}</p>}
          {page.learning?.try && <p><strong>Change next:</strong> {page.learning.try}</p>}
          <button type="button" onClick={(event) => jumpToLab(event.currentTarget)}>Open lab controls ↑</button>
        </article>
      </div>
      <div id={`${baseId}-panel-practice`} role="tabpanel" aria-labelledby={`${baseId}-tab-practice`} hidden={activeTab !== "practice"}>
        <p className="studio-theory-tab-intro">Work each setup before opening its result. Use the lab to check your reasoning.</p>
        <div className="studio-theory-practice-list">
          {theory.examples.map((example, index) => <details key={`${example.title}-${index}`}>
            <summary><span className="studio-theory-number">{index + 1}</span><span><strong>{example.title}</strong><small>{example.setup}</small></span></summary>
            <p>{example.result}</p>
          </details>)}
        </div>
        {page.learning?.challenge && <div className="studio-theory-practice-challenge"><h3>Extend the idea</h3><p>{page.learning.challenge}</p></div>}
      </div>
    </section>
  );
}
