import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Lightbulb, RotateCcw, Check, AlertTriangle, X } from "lucide-react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import { WORKSHOP, FACTORY, formulationSlots, checkFormulation, formulationTokens, placeFormulationToken, formulationSources, type FormulationScenario } from "./linearProgrammingFormulationModel";
import "./FormulatingLinearProgrammingTargetLesson10200.css";

function ModelBuilder({ scenario, practice = false }: { scenario: FormulationScenario; practice?: boolean }) {
  const [values, setValues] = useState<string[]>(Array(10).fill(""));
  const [selected, setSelected] = useState("");
  const [showCheck, setShowCheck] = useState(false);
  const [language, setLanguage] = useState(true);
  const [source, setSource] = useState(true);
  const [units, setUnits] = useState(true);
  const slots = formulationSlots(scenario);
  const result = checkFormulation(scenario, values);
  const tokens = formulationTokens(scenario);
  const sources = formulationSources(scenario, selected);
  const place = (index: number, token: string) => {
    if (!tokens.includes(token)) return;
    setValues(previous => placeFormulationToken(scenario, previous, index, token));
    setShowCheck(false);
  };
  const clear = (index: number) => { setValues(previous => previous.map((value, i) => i === index ? "" : value)); setShowCheck(false); };
  const slot = (index: number, placeholder: string) => <div className="lp-slot-wrap" key={index}><button type="button"
    className={`lp-slot ${values[index] ? result.checks[index] ? "correct" : "incorrect" : ""}`}
    aria-label={`${practice ? "Practice " : ""}${slots[index].label}`}
    onKeyDown={event => { if (event.key === "Delete" || event.key === "Backspace") { event.preventDefault(); setValues(previous => previous.map((value, i) => i === index ? "" : value)); setShowCheck(false); } }}
    onClick={() => { if (selected) place(index, selected); }}
    onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); place(index, event.dataTransfer.getData("text/plain")); }}>
    {values[index] || placeholder}
  </button>{values[index] && <button type="button" className="lp-clear" aria-label={`Clear ${practice ? "practice " : ""}${slots[index].label}`} title={`Clear ${slots[index].label}`} onClick={() => clear(index)}><X size={12} /></button>}</div>;
  return <section className={`lp-builder ${practice ? "practice" : ""}`} aria-label={practice ? "Practice model builder" : "Workshop model builder"}>
    <div className="lp-scenario-band">
      <div className="lp-scenario"><h2>{practice ? "TRY ANOTHER: PRACTICE SCENARIO" : "SCENARIO: CHAIR & TABLE WORKSHOP"}</h2>
        <p>A {practice ? "factory" : "workshop"} makes {scenario.products[0]} ({scenario.variables[0]}) and {scenario.products[1]} ({scenario.variables[1]}).</p>
        <ul>{scenario.profits.map((profit, i) => <li key={i} className={source && sources.profits[i] ? "highlight" : ""}>Profit per {scenario.products[i]} = ₹{profit}</li>)}
          {scenario.resources.map((resource, i) => <li key={resource.name} className={source && sources.resources[i] ? "highlight" : ""}>{resource.name} available: {slots[2 + i * 3].answer} ≤ {resource.limit}</li>)}
          <li>You cannot make a negative number of items.</li></ul>
      </div>
      <div className="lp-palette"><h2>DRAG THESE QUANTITIES</h2>
        <div className="lp-tokens">{tokens.map(token => <button type="button" key={token} draggable aria-pressed={selected === token}
          onClick={() => setSelected(previous => previous === token ? "" : token)} onDragStart={event => { setSelected(token); event.dataTransfer.setData("text/plain", token); }}>{token}</button>)}</div>
        <progress value={result.correct} max={10} aria-label="Model progress" /><span>{result.correct}/10 correct · {result.placed}/10 placed</span>
        <button type="button" className="lp-reset" aria-label={practice ? "Reset practice model" : "Reset workshop model"} title="Reset model" onClick={() => { setValues(Array(10).fill("")); setSelected(""); setShowCheck(false); }}><RotateCcw size={15} /></button>
      </div>
    </div>
    <div className="lp-model-cards">
      <article><h3><b>1</b> VARIABLES</h3><p>Decision variables</p>{slot(0, `Drag ${scenario.variables.join(" and ")} here`)}
        <div className="lp-live"><strong>Live check</strong><p>{result.checks[0] ? "✓ Correct variables" : `Need exactly: ${scenario.variables.join(", ")}`}</p></div></article>
      <article><h3><b>2</b> OBJECTIVE (PROFIT)</h3><p>What are we optimizing?</p><div className="lp-objective">Z = {slot(1, "Drag terms and Maximize")}</div>
        <div className="lp-live"><strong>Live check</strong><p>{result.checks[1] ? "✓ Correct profit objective" : "Need both profit terms and Maximize"}</p></div></article>
      <article><h3><b>3</b> RESOURCE CONSTRAINTS</h3><p>At most / equal to limits</p>{scenario.resources.map((resource, i) => <div key={resource.name} className="lp-resource">
        <div>{slot(2+i*3,"Drag expression")}{slot(3+i*3,"≤ / ≥ / =")}{slot(4+i*3,"Drag value")}</div><p>({resource.name})</p></div>)}
        <div className="lp-live"><strong>Live check</strong>{scenario.resources.map((resource,i) => <p key={resource.name}>{resource.name}: {result.checks.slice(2+i*3,5+i*3).every(Boolean) ? "✓ Correct" : "Incomplete or incorrect"}</p>)}</div></article>
      <article><h3><b>4</b> NON-NEGATIVITY</h3><p>You cannot produce negative items</p>{slot(8,"Drag non-negativity")}{slot(9,"Drag non-negativity")}
        <div className="lp-live"><strong>Live check</strong><p>{result.checks.slice(8).filter(Boolean).length}/2 correct</p></div></article>
    </div>
    {!practice && <div className="lp-aids">
      <article><h3>Plain Language ↔ Algebra</h3><label><input type="checkbox" checked={language} onChange={event => setLanguage(event.target.checked)} />On</label>{language && <p aria-live="polite">{sources.description || "Profit → objective. Resources → constraints."}</p>}</article>
      <article><h3><Lightbulb size={14} /> Coefficient Source</h3><label><input type="checkbox" checked={source} onChange={event => setSource(event.target.checked)} />Highlight on</label></article>
      <article><h3>Unit Check</h3><label><input type="checkbox" checked={units} onChange={event => setUnits(event.target.checked)} />On</label>{units && <p>{scenario.variables.join(", ")} → items<br />Profit → rupees<br />Limits → resource units</p>}</article>
      <article><h3>Validation</h3><p>✓ Correct</p><p>△ Incomplete</p><p>× Incorrect</p></article>
    </div>}
    <div className="lp-check"><button type="button" onClick={() => setShowCheck(true)}>Check my model</button>{showCheck && <strong role="status">{result.complete ? "Correct model" : `${10-result.correct} parts still need attention`}</strong>}</div>
  </section>;
}

export default function FormulatingLinearProgrammingTargetLesson10200({ lesson }: { lesson: SchoolSyllabusLesson }) {
  const [guide, setGuide] = useState("≤");
  return <main className="lp10200" data-testid="school-mockup-0874">
    <header className="lp-heading"><Link to="/lessons/school/class-12"><ArrowLeft size={14} />School lessons</Link><small>CLASS 12 · LINEAR PROGRAMMING</small><h1>{lesson.title}</h1><div className="lp-tags"><span>20 min</span><span>ADVANCED</span><span>PRACTICE</span><span>model builder</span></div></header>
    <ModelBuilder scenario={WORKSHOP} />
    <section className="lp-mistakes"><h2><AlertTriangle size={15} /> COMMON MISTAKES (AVOID THESE)</h2><div><article><h3>Do not reverse inequality directions.</h3><p>At most means ≤, not ≥.</p></article><article><h3>Do not omit non-negativity.</h3><p>Always include x ≥ 0 and y ≥ 0.</p></article><article><h3>Use the correct coefficients.</h3><p>Wood: 2x + 4y ≤ 80</p><p>Labor: 3x + 2y ≤ 60</p></article></div></section>
    <section className="lp-guide"><h2>WHAT CHANGES? (INEQUALITY GUIDE)</h2><div>{[{sign:"≤", title:"AT MOST", sentence:"The total cannot exceed the limit.", expression:"2x + 4y ≤ 80"},{sign:"≥",title:"AT LEAST",sentence:"The total must meet the requirement.",expression:"3x + 2y ≥ 60"},{sign:"=",title:"EQUAL TO",sentence:"The total must be exactly the value.",expression:"x + y = 50"}].map(item => <article key={item.sign}><h3>{item.title} ({item.sign})</h3><p>{item.sentence}</p><p>{item.expression}</p><button type="button" aria-pressed={guide===item.sign} onClick={() => setGuide(item.sign)}>Use: {item.sign}</button></article>)}</div><p aria-live="polite">{guide === "≤" ? "At most 80 units: 2x + 4y ≤ 80" : guide === "≥" ? "At least 60 hours: 3x + 2y ≥ 60" : "Exactly 50 items: x + y = 50"}</p></section>
    <section className="lp-reference"><article><h2>COMPLETE MODEL (REFERENCE)</h2><p>Maximize Z = 50x + 40y</p><p>Subject to 2x + 4y ≤ 80</p><p>3x + 2y ≤ 60</p><p>x ≥ 0, y ≥ 0</p></article><article><h3><Check size={14} />All checks</h3><p>Variables: x, y</p><p>Profit objective: Maximize</p><p>Resources: at-most constraints</p><p>Non-negativity included</p></article><article><h3>Quick recap</h3><p>Profit drives the objective.</p><p>Resources create limits.</p><p>Coefficients come from usage per unit.</p></article></section>
    <ModelBuilder scenario={FACTORY} practice />
  </main>;
}
