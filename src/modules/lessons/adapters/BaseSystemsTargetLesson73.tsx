import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calculator,
  Check,
  CheckCircle2,
  ClipboardList,
  Home,
  Info,
  Rocket,
  Settings,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState, type DragEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./BaseSystemsTargetLesson73.css";

const DEFAULT_DIGITS = [1, 1, 0];

function clampBase(value: number) {
  if (!Number.isFinite(value)) return 2;
  return Math.max(2, Math.min(10, Math.round(value)));
}

function normalizeDigits(raw: string, base: number) {
  const parsed = raw.replace(/\D/g, "").slice(-3).padStart(3, "0");
  return parsed.split("").map((digit) => Math.min(Number(digit), base - 1));
}

export default function BaseSystemsTargetLesson73({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [digits, setDigits] = useState(DEFAULT_DIGITS);
  const [base, setBase] = useState(2);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [tab, setTab] = useState("Interactive Lab");
  const [practiceLoaded, setPracticeLoaded] = useState(false);
  const [actions, setActions] = useState(0);
  const placeValues = useMemo(() => [base ** 2, base, 1], [base]);
  const products = useMemo(
    () => digits.map((digit, index) => digit * placeValues[index]),
    [digits, placeValues],
  );
  const decimal = products.reduce((total, product) => total + product, 0);
  const numberText = digits.join("");
  const allowedDigits = Array.from({ length: base }, (_, value) => value);
  const lineMaximum = Math.max(10, Math.ceil(decimal / 5) * 5);

  const act = () => {
    setActions((value) => value + 1);
    onInteraction();
  };

  const changeNumber = (raw: string) => {
    setDigits(normalizeDigits(raw, base));
    setPracticeLoaded(false);
    act();
  };

  const changeBase = (value: number) => {
    const nextBase = clampBase(value);
    setBase(nextBase);
    setDigits((current) => current.map((digit) => Math.min(digit, nextBase - 1)));
    setPracticeLoaded(false);
    act();
  };

  const changeDigit = (index: number, digit: number) => {
    setDigits((current) => current.map((value, currentIndex) => currentIndex === index ? digit : value));
    setSelectedIndex(index);
    setPracticeLoaded(false);
    act();
  };

  const dropDigit = (event: DragEvent<HTMLButtonElement>, targetIndex: number) => {
    event.preventDefault();
    const raw = event.dataTransfer.getData("text/digit-index");
    const sourceIndex = raw === "" ? dragIndex : Number(raw);
    if (sourceIndex === null || !Number.isInteger(sourceIndex)) return;
    setDigits((current) => {
      const next = [...current];
      [next[sourceIndex], next[targetIndex]] = [next[targetIndex], next[sourceIndex]];
      return next;
    });
    setSelectedIndex(targetIndex);
    setDragIndex(null);
    setPracticeLoaded(false);
    act();
  };

  const loadPractice = () => {
    setBase(2);
    setDigits([1, 0, 1]);
    setSelectedIndex(0);
    setPracticeLoaded(true);
    act();
  };

  useEffect(() => {
    setDigits(DEFAULT_DIGITS);
    setBase(2);
    setSelectedIndex(0);
    setDragIndex(null);
    setTab("Interactive Lab");
    setPracticeLoaded(false);
    setActions(0);
  }, [resetToken]);

  return (
    <div
      className="base73-page"
      data-testid="number-mockup-0055"
      data-dedicated-lesson="73"
      data-object-model="editable-base-three-digit-place-value-board-draggable-digit-order-allowed-digit-palette-calculated-products-decimal-sum-number-line-practice-model"
      data-number={numberText}
      data-digits={digits.join(",")}
      data-base={base}
      data-place-values={placeValues.join(",")}
      data-products={products.join(",")}
      data-decimal={decimal}
      data-selected-index={selectedIndex}
      data-drag-index={dragIndex ?? ""}
      data-valid={digits.every((digit) => digit < base)}
      data-tab={tab}
      data-practice-loaded={practiceLoaded}
      data-actions={actions}
    >
      <span className="sr-only">
        Concept trace: Base-place conversion. Digits must be allowed in the
        chosen base. Multiply each digit by its place power and add.
      </span>
      <nav className="base73-breadcrumb">
        <a href="/" aria-label="Back"><ArrowLeft /></a>
        <a href="/">Home</a><span>›</span>
        <a href="/lessons">Lessons</a><span>›</span>
        <a href="/lessons/numbers-and-arithmetic">Numbers And Arithmetic</a><span>›</span>
        <b>73 Base Systems</b>
      </nav>

      <header className="base73-hero">
        <div className="base73-topics"><b>NUMBERS AND ARITHMETIC</b><b>NUMBERS AND NUMBER THEORY</b></div>
        <h1>Base Systems</h1>
        <p>Understand alternate representations.</p>
        <div className="base73-badges">
          <b>♙ Foundation-Intermediate</b><b>ϟ Concept + Manipulative</b><b>▣ Numbers and Number Theory</b><b>◷ 6-10 min</b>
        </div>
        <nav aria-label="Base systems lesson sections">
          {[["Interactive Lab", "⚗"], ["Explain", "▣"], ["Examples", "♧"], ["Formulas", "Σ"], ["Know more", "✧"]].map(([label, icon]) => (
            <button type="button" className={tab === label ? "active" : ""} onClick={() => { setTab(label); act(); }} key={label}><span>{icon}</span>{label}</button>
          ))}
        </nav>
      </header>

      <main className="base73-main">
        <section className="base73-board">
          <header><h2>Convert Binary {numberText}<sub>{base}</sub> to Decimal</h2><p>Use place values, multiply, and add.</p></header>
          <section className="base73-place-grid">
            {digits.map((digit, index) => (
              <article key={index}>
                <header><span>{base}<sup>{2 - index}</sup></span><b>{placeValues[index]}</b></header>
                <button
                  type="button"
                  draggable
                  aria-label={`Digit ${index + 1}: ${digit}`}
                  className={selectedIndex === index ? "selected" : ""}
                  onClick={() => changeDigit(index, (digit + 1) % base)}
                  onDragStart={(event) => { event.dataTransfer.setData("text/digit-index", String(index)); setDragIndex(index); }}
                  onDragEnd={() => setDragIndex(null)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => dropDigit(event, index)}
                >{digit}</button>
                <i>↓</i>
                <strong>{digit} × {placeValues[index]}</strong>
              </article>
            ))}
            <svg viewBox="0 0 390 86" aria-hidden="true"><path d="M65 4v14q0 30 45 30h50q35 0 35 31M325 4v14q0 30-45 30h-50q-35 0-35 31M195 4v75" /></svg>
          </section>
          <section className="base73-sum" aria-label="Decimal sum">
            {products.map((product, index) => <span key={index}><b>{product}</b>{index < products.length - 1 ? <i>+</i> : null}</span>)}<i>=</i><strong>{decimal}</strong>
          </section>
          <section className="base73-verified"><Check /><b>{numberText}<sub>{base}</sub> = {decimal}<sub>10</sub></b><span>Verified conversion</span></section>
        </section>

        <aside className="base73-side">
          <section className="base73-summary">
            <label><Home /> Number:<input aria-label="Base-system number" value={numberText} inputMode="numeric" onChange={(event) => changeNumber(event.target.value)} /></label>
            <label><Settings /> Base:<input aria-label="Number base" type="number" min="2" max="10" value={base} onChange={(event) => changeBase(Number(event.target.value))} /></label>
            <p><ClipboardList /> Decimal value:<b>{decimal}</b></p>
          </section>
          <section className="base73-allowed">
            <header><CheckCircle2 /><h3>Allowed digits: {allowedDigits.join(" and ")}</h3></header>
            <p>Valid digits for base {base} are {allowedDigits.join(" and ")}.</p>
            <div>{allowedDigits.map((digit) => <button type="button" aria-label={`Set selected digit to ${digit}`} className={digits[selectedIndex] === digit ? "active" : ""} onClick={() => changeDigit(selectedIndex, digit)} key={digit}>{digit}</button>)}</div>
            <p>Every digit must be less than the base.</p>
          </section>
          <section className="base73-why"><h3><Info /> Why this works</h3><p><b>2</b>Each place is a power of the base.</p><p><CheckCircle2 />Every digit must be less than the base.</p></section>
          <section className="base73-number-line"><h3>Number line (decimal)</h3><NumberLine value={decimal} maximum={lineMaximum} /></section>
          <section className="base73-practice"><header><Rocket /><h3>Try it yourself</h3></header><p>Try: Convert 101<sub>2</sub> to decimal.</p><button type="button" onClick={loadPractice}>{practiceLoaded ? `101₂ = ${decimal}` : "Start Practice"}<ArrowRight /></button></section>
        </aside>
      </main>

      <nav className="base73-navigation">
        <a href="/lessons/numbers-and-arithmetic/72-modular-arithmetic"><ArrowLeft /><span>PREVIOUS<b>Modular Arithmetic</b></span></a>
        <a href="/lessons/numbers-and-arithmetic/74-continued-fractions"><span>NEXT<b>Continued Fractions</b></span><ArrowRight /></a>
      </nav>
      <footer className="base73-footer">
        <h3><Sparkles /> Math Universe</h3><p>Interactive math labs, visual proofs, NCERT explorations, graphing, CAS-style tools, and classroom-ready activities.</p>
        <nav><a href="/sitemap"><BookOpen /> Sitemap</a><a href="/docs"><Calculator /> Docs</a><a href="/about">✉ About</a></nav><hr />
        <small>© 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.</small><small>www.IndianServers.com info@IndianServers.com</small>
      </footer>
    </div>
  );
}

function NumberLine({ value, maximum }: { value: number; maximum: number }) {
  const ticks = Array.from({ length: 6 }, (_, index) => (maximum / 5) * index);
  const x = 18 + (Math.min(value, maximum) / maximum) * 292;
  return <svg viewBox="0 0 328 70" role="img" aria-label={`Decimal number line marker at ${value}`}><line x1="18" y1="35" x2="310" y2="35" />{ticks.map((tick, index) => <g key={index}><line x1={18 + index * 58.4} x2={18 + index * 58.4} y1="29" y2="42" /><text x={18 + index * 58.4} y="62">{Number.isInteger(tick) ? tick : tick.toFixed(1)}</text></g>)}<circle cx={x} cy="27" r="6" /><text className="selected" x={x} y="62">{value}</text></svg>;
}
