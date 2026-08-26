import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calculator,
  Check,
  Grid2X2,
  Languages,
  Lightbulb,
  Pencil,
  RotateCcw,
  Share2,
  Sparkles,
} from "lucide-react";
import { useEffect, useState, type DragEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./DecimalPlaceValueTargetLesson79.css";
import "./DecimalPlaceValueTargetLesson79Tuning.css";

function clampHundredths(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(99, Math.round(value)));
}

function parseDecimal(value: string) {
  return clampHundredths(Number(value) * 100);
}

function decimalText(value: number) {
  return (value / 100).toFixed(2);
}

function digits(value: number) {
  return { ones: 0, tenths: Math.floor(value / 10), hundredths: value % 10 };
}

export default function DecimalPlaceValueTargetLesson79({ resetToken, onInteraction }: LessonAdapterProps) {
  const [first, setFirst] = useState(50);
  const [second, setSecond] = useState(47);
  const [tab, setTab] = useState("Interaction + visualization");
  const [language, setLanguage] = useState("English (English)");
  const [shareState, setShareState] = useState("Share");
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [practiceLoaded, setPracticeLoaded] = useState(false);
  const [dragging, setDragging] = useState("");
  const [actions, setActions] = useState(0);
  const firstDigits = digits(first);
  const secondDigits = digits(second);
  const comparison = first === second ? "=" : first > second ? ">" : "<";
  const decidingPlace = firstDigits.tenths !== secondDigits.tenths ? "Tenths" : firstDigits.hundredths !== secondDigits.hundredths ? "Hundredths" : "Equal";
  const decidingFirst = decidingPlace === "Tenths" ? firstDigits.tenths : firstDigits.hundredths;
  const decidingSecond = decidingPlace === "Tenths" ? secondDigits.tenths : secondDigits.hundredths;
  const difference = Math.abs(first - second);
  const lineMinimum = Math.max(0, Math.floor(Math.min(first, second) / 5) * 5 - 5);
  const lineMaximum = Math.min(100, Math.max(lineMinimum + 15, Math.ceil(Math.max(first, second) / 5) * 5));

  const act = () => { setActions((count) => count + 1); onInteraction(); };
  const change = (key: "first" | "second", value: number) => {
    (key === "first" ? setFirst : setSecond)(clampHundredths(value));
    setPracticeLoaded(false);
    act();
  };
  const dropCell = (event: DragEvent<HTMLButtonElement>, key: "first" | "second", count: number) => {
    event.preventDefault();
    if (!event.dataTransfer.getData("text/decimal-grid-cell")) return;
    change(key, count);
    setDragging("");
  };
  const reset = () => {
    setFirst(50);
    setSecond(47);
    setTab("Interaction + visualization");
    setLanguage("English (English)");
    setShareState("Share");
    setWorkspaceOpen(false);
    setPracticeLoaded(false);
    setDragging("");
    setActions(0);
    onInteraction();
  };
  const share = async () => {
    try {
      await navigator.clipboard?.writeText(`${decimalText(first)} ${comparison} ${decimalText(second)}`);
      setShareState("Copied");
    } catch {
      setShareState("Ready");
    }
    act();
  };
  const loadPractice = () => {
    setFirst(60);
    setSecond(58);
    setPracticeLoaded(true);
    act();
  };
  useEffect(() => { reset(); }, [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="decimal79-page"
      data-testid="number-mockup-0061"
      data-dedicated-lesson="79"
      data-object-model="exact-hundredths-dual-editable-decimals-place-chart-draggable-hundred-grids-deciding-digit-number-line-trailing-zero-practice-model"
      data-first={decimalText(first)}
      data-second={decimalText(second)}
      data-first-count={first}
      data-second-count={second}
      data-first-digits={`${firstDigits.ones},${firstDigits.tenths},${firstDigits.hundredths}`}
      data-second-digits={`${secondDigits.ones},${secondDigits.tenths},${secondDigits.hundredths}`}
      data-deciding-place={decidingPlace}
      data-comparison={comparison}
      data-difference={difference}
      data-line-min={decimalText(lineMinimum)}
      data-line-max={decimalText(lineMaximum)}
      data-tab={tab}
      data-language={language}
      data-share-state={shareState}
      data-workspace-open={workspaceOpen}
      data-practice-loaded={practiceLoaded}
      data-dragging={dragging}
      data-actions={actions}
    >
      <span className="sr-only">Concept trace: Decimal place-value alignment. Trailing zeros can help compare decimals. Compare the first unequal place from left to right.</span>
      <nav className="decimal79-breadcrumb"><a href="/" aria-label="Back"><ArrowLeft /></a><a href="/">Home</a><span>›</span><a href="/lessons">Lessons</a><span>›</span><a href="/lessons/numbers-and-arithmetic">Numbers And Arithmetic</a><span>›</span><b>79 Decimal Place Value</b></nav>

      <header className="decimal79-hero"><aside><small>NUMBERS AND ARITHMETIC</small><small>FRACTIONS, DECIMALS, RATIOS AND PERCENTAGES</small></aside><h1>Decimal Place Value</h1><p>Understand decimal positions.</p><nav><b>♙ Foundational–Intermediate</b><b>ϟ Concept + Manipulative</b><b>▣ Fractions, Decimals, Ratios and Percentages</b><b>◷ 6–10 min</b></nav><section><button type="button" onClick={() => { setLanguage((current) => current.startsWith("English") ? "Hindi (हिन्दी)" : "English (English)"); act(); }}><Languages />{language}<span>⌄</span></button><button type="button" onClick={reset}><RotateCcw />Reset</button><button type="button" onClick={() => void share()}><Share2 />{shareState}</button></section><button type="button" className="decimal79-workspace" onClick={() => { setWorkspaceOpen((current) => !current); act(); }}>↗ {workspaceOpen ? "Workspace open" : "Workspace"}</button></header>
      <nav className="decimal79-tabs" aria-label="Decimal place value lesson sections">{[["Interaction + visualization", "⊙"], ["Explain", "▣"], ["Examples", "♧"], ["Formulas", "Σ"], ["Know more", "✣"]].map(([label, icon]) => <button type="button" className={tab === label ? "active" : ""} onClick={() => { setTab(label); act(); }} key={label}><span>{icon}</span>{label}</button>)}</nav>

      <main className="decimal79-main">
        <section className="decimal79-lab"><small>ALIGN DECIMAL PLACES</small><h2>Compare {decimalText(first)} and {decimalText(second)}</h2><p>Use place value to compare. Check tenths first, then hundredths.</p><PlaceChart first={first} second={second} decidingPlace={decidingPlace} /><section className="decimal79-decision-callout"><span>★</span><div><b>{decidingPlace}: {decidingFirst} {comparison} {decidingSecond}</b><p>Since {decidingFirst} {comparison} {decidingSecond} in the {decidingPlace.toLowerCase()} place, {decimalText(first)} is {comparison === ">" ? "greater than" : comparison === "<" ? "less than" : "equal to"} {decimalText(second)}.</p></div></section><h2 className="decimal79-grid-title">Visualize on hundred grids</h2><p className="decimal79-grid-subtitle">Each grid represents 1 whole (100 hundredths).</p><div className="decimal79-grids"><HundredGrid name="First" value={first} color="cyan" onChange={(value) => change("first", value)} onDrop={dropCell} onDrag={setDragging} /><HundredGrid name="Second" value={second} color="purple" onChange={(value) => change("second", value)} onDrop={dropCell} onDrag={setDragging} /></div><p className="decimal79-zero-note">ⓘ &nbsp; Trailing zeros help align places.</p><h2 className="decimal79-line-title">Locate on the number line</h2><p className="decimal79-line-subtitle">Both numbers are between {decimalText(lineMinimum)} and {decimalText(lineMaximum)}.</p><DecimalLine first={first} second={second} minimum={lineMinimum} maximum={lineMaximum} onChange={change} /><footer><Check />{decimalText(first)} {comparison} {decimalText(second)}</footer></section>

        <aside className="decimal79-side"><section className="decimal79-values"><label>First decimal:<input aria-label="First decimal" inputMode="decimal" value={decimalText(first)} onChange={(event) => change("first", parseDecimal(event.target.value))} /></label><hr /><label>Second decimal:<input aria-label="Second decimal" inputMode="decimal" value={decimalText(second)} onChange={(event) => change("second", parseDecimal(event.target.value))} /></label></section><section className="decimal79-align"><Grid2X2 /><div><h3>Align decimal places</h3><p>Write each number with the same number of decimal places.</p><b>{decimalText(first)} &nbsp;→&nbsp; 0 | {firstDigits.tenths} | {firstDigits.hundredths}</b><b>{decimalText(second)} &nbsp;→&nbsp; 0 | {secondDigits.tenths} | {secondDigits.hundredths}</b><small>(Ones | Tenths | Hundredths)</small></div></section><section className="decimal79-tenths"><span>▥</span><div><h3>{decidingPlace}: {decidingFirst} {comparison} {decidingSecond}</h3><p>Compare {decidingPlace.toLowerCase()} first. {decidingFirst} is {comparison === ">" ? "greater than" : comparison === "<" ? "less than" : "equal to"} {decidingSecond} {decidingPlace.toLowerCase()}.</p></div></section><section className="decimal79-side-decision"><Check /><div><h3>Decision</h3><b>{decimalText(first)} {comparison} {decimalText(second)}</b><p>Since {decidingFirst} {comparison} {decidingSecond} in the {decidingPlace.toLowerCase()} place, {decimalText(first)} is {comparison === ">" ? "greater" : comparison === "<" ? "less" : "equal"}.</p></div></section><section className="decimal79-why"><Lightbulb /><div><h3>Why this works</h3><p>Trailing zeros help align places.</p><p>Compare tenths before hundredths.</p></div></section><button type="button" className="decimal79-practice" onClick={loadPractice}><Pencil /><span><b>{practiceLoaded ? `Solved: 0.60 ${comparison} 0.58` : "Try it!"}</b><small>Try: Compare 0.6 and 0.58.</small></span></button></aside>
      </main>

      <nav className="decimal79-navigation"><a href="/lessons/numbers-and-arithmetic/78-fraction-operations"><ArrowLeft /><span>PREVIOUS<b>Fraction Operations</b></span></a><a href="/lessons/numbers-and-arithmetic/80-decimal-operations"><span>NEXT<b>Decimal Operations</b></span><ArrowRight /></a></nav>
      <footer className="decimal79-footer"><h3><Sparkles /> Math Universe</h3><p>Interactive math labs, visual proofs, NCERT explorations, graphing, CAS-style tools, and classroom-ready activities.</p><nav><a href="/sitemap"><BookOpen /> Sitemap</a><a href="/docs"><Calculator /> Docs</a><a href="/about">✉ About</a></nav><hr /><small>© 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.</small><small>www.IndianServers.com info@IndianServers.com</small></footer>
    </div>
  );
}

function PlaceChart({ first, second, decidingPlace }: { first: number; second: number; decidingPlace: string }) {
  const rows = [["First decimal", decimalText(first), digits(first), "cyan"], ["Second decimal", decimalText(second), digits(second), "purple"]] as const;
  return <div className="decimal79-chart"><header><b>Ones</b><b>Tenths</b><b>Hundredths</b></header>{rows.map(([label, value, valueDigits, color]) => <section className={color} key={label}><h3>{label}<b>{value}</b></h3><span>{valueDigits.ones}</span><span className={decidingPlace === "Tenths" ? "active" : ""}>{valueDigits.tenths}</span><span className={decidingPlace === "Hundredths" ? "active" : ""}>{valueDigits.hundredths}</span></section>)}</div>;
}

function HundredGrid({ name, value, color, onChange, onDrop, onDrag }: { name: "First" | "Second"; value: number; color: "cyan" | "purple"; onChange: (value: number) => void; onDrop: (event: DragEvent<HTMLButtonElement>, key: "first" | "second", count: number) => void; onDrag: (value: string) => void }) {
  const key = name === "First" ? "first" : "second";
  return <article className={`decimal79-grid ${color}`}><h3>{name} decimal: {decimalText(value)}</h3><div>{Array.from({ length: 100 }, (_, index) => <button type="button" draggable aria-label={`${name} hundred grid cell ${index + 1}`} className={index < value ? "selected" : ""} onClick={() => onChange(index < value ? index : index + 1)} onDragStart={(event) => { event.dataTransfer.setData("text/decimal-grid-cell", `${key}:${index + 1}`); onDrag(`${key}:${index + 1}`); }} onDragEnd={() => onDrag("")} onDragOver={(event) => event.preventDefault()} onDrop={(event) => onDrop(event, key, index + 1)} key={index} />)}</div><b>{value} hundredths</b>{name === "Second" && value < 50 ? <small>{50 - value} hundredths fewer</small> : null}</article>;
}

function DecimalLine({ first, second, minimum, maximum, onChange }: { first: number; second: number; minimum: number; maximum: number; onChange: (key: "first" | "second", value: number) => void }) {
  const span = Math.max(1, maximum - minimum);
  const left = (value: number) => (value - minimum) / span * 100;
  return <div className="decimal79-line"><i /><div>{Array.from({ length: span + 1 }, (_, index) => minimum + index).map((value) => <button type="button" aria-label={`Decimal number line ${decimalText(value)}`} style={{ left: `${left(value)}%` }} onClick={() => onChange("first", value)} key={value}><span>{decimalText(value)}</span></button>)}</div><span className="marker first" aria-label={`First decimal marker ${decimalText(first)}`} style={{ left: `${left(first)}%` }}><b>{decimalText(first)}</b></span><span className="marker second" aria-label={`Second decimal marker ${decimalText(second)}`} style={{ left: `${left(second)}%` }}><b>{decimalText(second)}</b></span></div>;
}
