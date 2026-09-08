import { useState, type DragEvent } from "react";
import { AlertTriangle, CheckCircle2, GripVertical, RotateCcw, ShieldCheck } from "lucide-react";
import type { LessonAdapterProps } from "../types";
import { checkPlacement, checkPractice, familyOf, graphExplanation, graphTypes, placeVariable, placementScore, practiceVariables, variables, variableTypes, type GraphType, type Placements, type PracticeAnswer, type VariableFamily, type VariableType } from "./dataTypesModel";
import "./DataTypesLesson467.css";

export default function DataTypesLesson467(props: LessonAdapterProps) {
  return <DataTypesActivity key={props.resetToken} onInteraction={props.onInteraction} />;
}

function MiniChart({ graph }: { graph: GraphType }) {
  const heights = [23, 48, 63, 44, 29, 14];
  return <svg className="dt467-chart" viewBox="0 0 120 90" role="img" aria-label={`${graph} example`}>
    {graph === "Pie chart" ? <g transform="translate(60 45)">
      <circle r="34" fill="#547cdb" />
      <path d="M0 0 L0 -34 A34 34 0 0 1 34 0Z" fill="#9bc76b" />
      <path d="M0 0 L34 0 A34 34 0 0 1 0 34Z" fill="#fb9654" />
      <path d="M0 0 L0 34 A34 34 0 0 1 -24 24Z" fill="#36b8a0" />
    </g> : <>
      <path d="M10 9V76H116" fill="none" stroke="#8393a8" />
      {graph === "Dot plot" ? [1, 4, 2, 3, 1, 4].map((count, i) => <g key={i}>
        {Array.from({ length: count }, (_, j) => <circle key={j} cx={20 + i * 17} cy={70 - j * 10} r="2.7" fill="#2585df" />)}
        <path d={`M${20 + i * 17} 76v3`} stroke="#8393a8" />
      </g>) : heights.map((height, i) => <rect key={i} x={15 + i * 16} y={75 - height} width={graph === "Histogram" ? 15 : 10} height={height} fill={graph === "Histogram" ? "#338af0" : ["#5786da", "#70a5e8", "#a4ce6d", "#fb9e42"][i % 4]} />)}
    </>}
  </svg>;
}

function DataTypesActivity({ onInteraction }: Pick<LessonAdapterProps, "onInteraction">) {
  const [placements, setPlacements] = useState<Placements>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("Classify all variables and match each to a graph.");
  const [answers, setAnswers] = useState<Record<string, PracticeAnswer>>({});
  const [checked, setChecked] = useState(false);
  const selectedVariable = variables.find(variable => variable.id === selected);
  const results = checkPractice(answers);

  function place(id: string | null, destination: VariableFamily | GraphType) {
    const variable = variables.find(item => item.id === id);
    if (!variable) return;
    setPlacements(state => placeVariable(state, variable.id, destination));
    const message = destination === "Categorical" || destination === "Numerical"
      ? `${destination === familyOf(variable.type) ? "Correct" : "Not quite"}: ${variable.label} is ${variable.type.toLowerCase()}. ${variable.explanation}`
      : `${variable.label}: ${graphExplanation(variable.type, destination)}`;
    setFeedback(message);
    onInteraction();
  }
  function drop(event: DragEvent, destination: VariableFamily | GraphType) {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/plain");
    if (variables.some(variable => variable.id === id)) { setSelected(id); place(id, destination); }
  }
  function destination(name: VariableFamily | GraphType, detail: string, graph = false) {
    const assigned = variables.filter(variable => (graph ? placements[variable.id]?.graph : placements[variable.id]?.family) === name);
    return <button type="button" className={`dt467-destination ${graph ? "dt467-graph-destination" : ""}`}
      aria-label={selectedVariable ? `Assign ${selectedVariable.label} to ${name}` : `Assign selected variable to ${name}`}
      aria-disabled={!selected} onClick={() => selected ? place(selected, name) : setFeedback("Select a variable first.")}
      onDragOver={event => { event.preventDefault(); event.dataTransfer.dropEffect = "move"; }} onDrop={event => drop(event, name)}>
      <span><strong>{name}</strong><small>{detail}</small></span>
      {graph && <MiniChart graph={name as GraphType} />}
      <span className="dt467-drop-label">{assigned.length ? assigned.map(variable => <span className="dt467-assignment" key={variable.id}>
        {variable.label}<span>{(graph ? checkPlacement(variable, placements[variable.id]).graphCorrect : checkPlacement(variable, placements[variable.id]).familyCorrect) ? "Correct" : "Review"}</span>
      </span>) : graph ? "Drop variable here" : "Drop here"}</span>
    </button>;
  }
  function answer(id: string, field: keyof PracticeAnswer, value: string) {
    setAnswers(state => ({ ...state, [id]: { ...state[id], [field]: value || undefined } }));
    setChecked(false);
    onInteraction();
  }
  return <div className="dt467" data-testid="statistics-mockup-0430" data-target-family="statistics-and-regression" aria-label="Data Types activity">
    <section className="dt467-interact" aria-labelledby="dt467-heading">
      <header className="dt467-heading"><div><span className="dt467-eyebrow">Interact</span><h2 id="dt467-heading">Classify the variables and match to the best graph</h2></div>
        <button className="dt467-reset" type="button" aria-label="Reset Data Types activity" title="Reset activity" onClick={() => { setPlacements({}); setSelected(null); setAnswers({}); setChecked(false); setFeedback("Activity reset. Classify all variables and match each to a graph."); onInteraction(); }}><RotateCcw size={17} /></button>
      </header>
      <div className="dt467-workspace">
        <section className="dt467-classify"><h3><b>1</b> Drag each variable to its data type</h3>
          <div className="dt467-families">
            {destination("Categorical", "Labels or groups; no arithmetic meaning. Nominal or Ordinal.")}
            {destination("Numerical", "Numbers; arithmetic meaning. Discrete or Continuous.")}
          </div>
          <div className="dt467-variables">{variables.map(variable => <button type="button" draggable key={variable.id}
            aria-pressed={selected === variable.id} className="dt467-variable" onClick={() => { setSelected(variable.id); onInteraction(); }}
            onDragStart={event => { setSelected(variable.id); event.dataTransfer.setData("text/plain", variable.id); event.dataTransfer.effectAllowed = "move"; }}>
            <span><strong>{variable.label}</strong><small>{variable.sample}</small></span><GripVertical size={14} aria-hidden="true" />
          </button>)}</div>
        </section>
        <section className="dt467-match"><h3><b>2</b> Match each variable to the best graph</h3>
          <div className="dt467-graphs">
            {destination("Bar chart", "Compares category frequencies.", true)}
            {destination("Pie chart", "Shows parts of a whole.", true)}
            {destination("Dot plot", "Individual numerical observations.", true)}
            {destination("Histogram", "Numerical data grouped into intervals.", true)}
          </div>
          <div className="dt467-feedback" role="status" aria-live="polite"><strong><ShieldCheck size={17} /> Instant feedback</strong><p>{feedback}</p><span>{placementScore(placements)} / 10 fully matched</span></div>
        </section>
      </div>
    </section>
    <div className="dt467-study">
      <section><span className="dt467-eyebrow">Learn</span><h3>Definition</h3><p>A variable is a characteristic that can take different values.</p>
        <h4>Categorical</h4><p>Values are labels or groups.</p><ul><li><strong>Nominal:</strong> no natural order.</li><li><strong>Ordinal:</strong> a meaningful order.</li></ul>
        <h4>Numerical</h4><p>Values are numbers.</p><ul><li><strong>Discrete:</strong> countable values.</li><li><strong>Continuous:</strong> measured on a scale.</li></ul>
        <aside><strong>Rule of thumb</strong><p>Counts are discrete. Measurements can be continuous even when rounded.</p></aside>
      </section>
      <section><span className="dt467-eyebrow">Example (worked)</span><h3>Example: Classify correctly</h3><p>Classify each variable and choose an appropriate graph.</p>
        <table><thead><tr><th>Variable</th><th>Type</th><th>Best graph</th></tr></thead><tbody>
          {[["Favorite ice cream flavor", "Nominal", "Bar chart"], ["Grade level (Freshman, Sophomore, Junior, Senior)", "Ordinal", "Bar chart"], ["Number of books read", "Discrete", "Dot plot"], ["Time to finish a race (min)", "Continuous", "Histogram"]].map(row => <tr key={row[0]}>{row.map(cell => <td key={cell}>{cell}</td>)}</tr>)}
        </tbody></table><p className="dt467-success"><CheckCircle2 size={16} /> Each graph preserves the variable's structure.</p>
      </section>
      <section><span className="dt467-eyebrow">Formula / reference</span><h3>Quick reference</h3><h4>Categorical</h4><p>Nominal: labels, no order.<br />Ordinal: ordered labels.</p><h4>Numerical</h4><p>Discrete: countable values.<br />Continuous: measurable values.</p>
        <table><thead><tr><th>Type</th><th>Example</th><th>Graph</th></tr></thead><tbody>
          {[["Nominal", "Blood type", "Bar chart"], ["Ordinal", "Class rank", "Bar chart"], ["Discrete", "Siblings", "Dot plot"], ["Continuous", "Height", "Histogram"]].map(row => <tr key={row[0]}>{row.map(cell => <td key={cell}>{cell}</td>)}</tr>)}
        </tbody></table>
      </section>
    </div>
    <div className="dt467-lower">
      <section><span className="dt467-eyebrow dt467-warning"><AlertTriangle size={13} /> Misconception guard</span><h3>Common mistake</h3><p>Treating ordinal categories as measurements.</p><p>Rank gaps do not measure equal differences in attainment. Use order to rank, not to calculate attainment differences.</p>
        <div className="dt467-comparison"><div><strong className="dt467-warning">Incorrect inference</strong><p>2nd - 1st = 3rd - 2nd</p><small>Equal rank gaps do not imply equal score gaps.</small></div><div><strong className="dt467-success">Correct interpretation</strong><MiniChart graph="Bar chart" /><small>Compare category frequencies; preserve their order.</small></div></div>
      </section>
      <section><span className="dt467-eyebrow">Practice challenge</span><h3>Your turn!</h3><p>Classify each variable and match it to a suitable graph.</p>
        <table className="dt467-practice"><thead><tr><th>Variable</th><th>Type (choose)</th><th>Best graph</th></tr></thead><tbody>{practiceVariables.map((variable, index) => <tr key={variable.id}>
          <td>{variable.label}<small>{variable.sample}</small>{checked && <span className={results[index] ? "dt467-success" : "dt467-warning"}>{results[index] ? "Correct" : `Review: ${variable.type}. ${variable.explanation}`}</span>}</td>
          <td><select aria-label={`${variable.label} type`} value={answers[variable.id]?.type ?? ""} onChange={event => answer(variable.id, "type", event.target.value as VariableType)}><option value="">Select type</option>{variableTypes.map(type => <option key={type}>{type}</option>)}</select></td>
          <td><select aria-label={`${variable.label} graph`} value={answers[variable.id]?.graph ?? ""} onChange={event => answer(variable.id, "graph", event.target.value as GraphType)}><option value="">Select graph</option>{graphTypes.map(graph => <option key={graph}>{graph}</option>)}</select>{checked && !results[index] && <small>{answers[variable.id]?.graph ? graphExplanation(variable.type, answers[variable.id].graph!) : "Choose a graph."}</small>}</td>
        </tr>)}</tbody></table>
        <div className="dt467-check"><button type="button" onClick={() => { setChecked(true); onInteraction(); }}><ShieldCheck size={16} /> Check my answers</button><output aria-live="polite">{checked ? results.filter(Boolean).length : 0} / 4 correct{checked ? "" : " (not checked)"}</output></div>
      </section>
    </div>
  </div>;
}
