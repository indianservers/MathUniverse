import {
  ArrowLeft,
  ArrowRight,
  Award,
  Minus,
  Plus,
  TriangleAlert,
} from "lucide-react";
import { useEffect, useMemo, useState, type DragEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./HcfGcdTargetLesson69.css";

function clampInteger(value: number) {
  if (!Number.isFinite(value)) return 2;
  return Math.max(2, Math.min(60, Math.round(value)));
}

function factorsOf(value: number) {
  return Array.from({ length: value }, (_, index) => index + 1).filter(
    (factor) => value % factor === 0,
  );
}

function primeFactorsOf(value: number) {
  const factors: number[] = [];
  let remaining = value;
  for (let divisor = 2; divisor <= remaining; divisor += 1) {
    while (remaining % divisor === 0) {
      factors.push(divisor);
      remaining /= divisor;
    }
  }
  return factors;
}

function gcd(left: number, right: number) {
  let a = Math.abs(left);
  let b = Math.abs(right);
  while (b !== 0) [a, b] = [b, a % b];
  return a;
}

function factorPowers(factors: number[]) {
  const counts = new Map<number, number>();
  factors.forEach((factor) =>
    counts.set(factor, (counts.get(factor) ?? 0) + 1),
  );
  return Array.from(counts.entries());
}

function FactorPowerExpression({ factors }: { factors: number[] }) {
  return factorPowers(factors).map(([factor, count], index) => (
    <span key={factor}>
      {index ? " × " : ""}
      {factor}
      {count > 1 ? <sup>{count}</sup> : null}
    </span>
  ));
}

function FactorDots({
  factors,
  tone,
}: {
  factors: number[];
  tone: "cyan" | "purple" | "green";
}) {
  return (
    <div className={`hcf69-prime-dots ${tone}`}>
      {factors.map((factor, index) => (
        <span key={`${factor}-${index}`}>{factor}</span>
      ))}
    </div>
  );
}

export default function HcfGcdTargetLesson69({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [first, setFirst] = useState(18);
  const [second, setSecond] = useState(24);
  const [candidate, setCandidate] = useState(6);
  const [dragFactor, setDragFactor] = useState("");
  const [actions, setActions] = useState(0);
  const firstFactors = useMemo(() => factorsOf(first), [first]);
  const secondFactors = useMemo(() => factorsOf(second), [second]);
  const shared = useMemo(
    () => firstFactors.filter((factor) => secondFactors.includes(factor)),
    [firstFactors, secondFactors],
  );
  const firstOnly = firstFactors.filter((factor) => !shared.includes(factor));
  const secondOnly = secondFactors.filter((factor) => !shared.includes(factor));
  const greatest = gcd(first, second);
  const firstPrimes = useMemo(() => primeFactorsOf(first), [first]);
  const secondPrimes = useMemo(() => primeFactorsOf(second), [second]);
  const overlapPrimes = useMemo(() => primeFactorsOf(greatest), [greatest]);
  const candidateCorrect = candidate === greatest;

  const act = () => {
    setActions((value) => value + 1);
    onInteraction();
  };
  const changePair = (which: "first" | "second", value: number) => {
    const next = clampInteger(value);
    const nextFirst = which === "first" ? next : first;
    const nextSecond = which === "second" ? next : second;
    if (which === "first") setFirst(next);
    else setSecond(next);
    setCandidate(gcd(nextFirst, nextSecond));
    act();
  };
  const chooseCandidate = (factor: number) => {
    setCandidate(factor);
    act();
  };
  const dropCandidate = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    const raw = event.dataTransfer.getData("text/shared-factor") || dragFactor;
    const factor = Number(raw);
    if (!shared.includes(factor)) return;
    setCandidate(factor);
    setDragFactor("");
    act();
  };
  useEffect(() => {
    setFirst(18);
    setSecond(24);
    setCandidate(6);
    setDragFactor("");
    setActions(0);
  }, [resetToken]);

  return (
    <div
      className="hcf69-page"
      data-testid="number-mockup-0051"
      data-dedicated-lesson="69"
      data-object-model="editable-number-pair-factor-set-venn-intersection-prime-exponent-overlap-draggable-shared-candidate-equal-group-greatest-divisor-practice-model"
      data-first={first}
      data-second={second}
      data-first-factors={firstFactors.join(",")}
      data-second-factors={secondFactors.join(",")}
      data-shared-factors={shared.join(",")}
      data-hcf={greatest}
      data-first-primes={firstPrimes.join(",")}
      data-second-primes={secondPrimes.join(",")}
      data-overlap-primes={overlapPrimes.join(",")}
      data-candidate={candidate}
      data-candidate-correct={candidateCorrect}
      data-drag-factor={dragFactor}
      data-actions={actions}
    >
      <span className="sr-only">
        HCF/GCD. Concept trace: Shared-factor intersection. HCF is the greatest shared
        factor. Prime overlap uses the lowest exponent common to both numbers.
      </span>
      <nav className="hcf69-breadcrumb">
        <a href="/" aria-label="Back">
          <ArrowLeft />
        </a>
        <a href="/">Home</a>
        <span>›</span>
        <a href="/lessons">Lessons</a>
        <span>›</span>
        <a href="/lessons/numbers-and-arithmetic">Numbers And Arithmetic</a>
        <span>›</span>
        <b>69 Hcf Gcd</b>
      </nav>
      <header className="hcf69-hero">
        <h1>HCF / GCD</h1>
        <p>Find greatest shared divisors.</p>
        <div>
          <b>♙ Foundation-Intermediate</b>
          <b>ϟ Concept + Manipulative</b>
          <b>▣ Numbers and Number Theory</b>
          <b>◷ 6-10 min</b>
        </div>
      </header>

      <main className="hcf69-layout">
        <section className="hcf69-venn-card">
          <header>
            <h2>Factor sets</h2>
            <p>Circle the factors that are common to both numbers.</p>
          </header>
          <div className="hcf69-venn">
            <h3>Factors of {first}</h3>
            <h3>Factors of {second}</h3>
            <i className="left-circle" />
            <i className="right-circle" />
            <div className="first-only">
              {firstOnly.map((factor) => (
                <button
                  type="button"
                  onClick={() => chooseCandidate(factor)}
                  key={factor}
                >
                  {factor}
                </button>
              ))}
            </div>
            <div
              className="shared"
              aria-label="Shared factor intersection drop zone"
              onDragOver={(event) => event.preventDefault()}
              onDrop={dropCandidate}
            >
              {shared.map((factor) => (
                <button
                  type="button"
                  draggable
                  className={candidate === factor ? "selected" : ""}
                  onClick={() => chooseCandidate(factor)}
                  onDragStart={(event) => {
                    event.dataTransfer.setData(
                      "text/shared-factor",
                      String(factor),
                    );
                    setDragFactor(String(factor));
                  }}
                  onDragEnd={() => setDragFactor("")}
                  key={factor}
                >
                  {factor}
                </button>
              ))}
            </div>
            <div className="second-only">
              {secondOnly.map((factor) => (
                <button
                  type="button"
                  onClick={() => chooseCandidate(factor)}
                  key={factor}
                >
                  {factor}
                </button>
              ))}
            </div>
          </div>
          <p className="hcf69-shared-line">
            <b>Shared factors: {shared.join(", ")}</b>
            <span>
              Greatest shared factor is <strong>{greatest}.</strong>
            </span>
          </p>
        </section>

        <section className="hcf69-overlap-card">
          <header>
            <h2>Prime factor overlap</h2>
            <p>Compare prime factorizations.</p>
          </header>
          <section className="hcf69-prime first">
            <h3>
              {first} = <FactorPowerExpression factors={firstPrimes} />
            </h3>
            <FactorDots factors={firstPrimes} tone="cyan" />
          </section>
          <section className="hcf69-prime second">
            <h3>
              {second} = <FactorPowerExpression factors={secondPrimes} />
            </h3>
            <FactorDots factors={secondPrimes} tone="purple" />
          </section>
          <section className="hcf69-prime overlap">
            <h3>
              Overlap: {overlapPrimes.join(" × ")} = {greatest}
            </h3>
            <FactorDots factors={overlapPrimes} tone="green" />
          </section>
        </section>

        <aside className="hcf69-side">
          <section className="hcf69-inputs">
            <h2>Number inputs</h2>
            <p>Enter the two numbers.</p>
            <NumberStepper
              label="First number"
              value={first}
              onChange={(value) => changePair("first", value)}
            />
            <NumberStepper
              label="Second number"
              value={second}
              onChange={(value) => changePair("second", value)}
            />
          </section>
          <section className="hcf69-summary">
            <h2>Shared factors</h2>
            <p>
              These factors are common to both {first} and {second}.
            </p>
            <b>Shared factors: {shared.join(", ")}</b>
          </section>
          <section className="hcf69-greatest">
            <h2>Greatest shared divisor</h2>
            <p>The largest number in the shared factors.</p>
            <b>HCF = {greatest}</b>
          </section>
          <section className="hcf69-warning">
            <TriangleAlert />
            <p>
              <b>Common misconception</b>
              <span>
                The HCF is the greatest common factor, not just any common
                factor.
              </span>
            </p>
          </section>
          <button
            type="button"
            className="hcf69-try"
            onClick={() => {
              setFirst(12);
              setSecond(20);
              setCandidate(4);
              act();
            }}
          >
            <span>
              <b>Try it next</b>
              <em>Try: Find the HCF of 12 and 20.</em>
            </span>
            <ArrowRight />
          </button>
        </aside>

        <section className="hcf69-groups">
          <header>
            <h2>Equal groups (visual proof)</h2>
            <p>
              Both {first} and {second} can be split into groups of {greatest}.
            </p>
          </header>
          <div className="hcf69-group-proof">
            <ObjectGroups value={first} groupSize={greatest} kind="star" />
            <i className="divider" />
            <ObjectGroups value={second} groupSize={greatest} kind="dot" />
            <section
              className={candidateCorrect ? "correct" : "incorrect"}
              aria-label="HCF candidate drop zone"
              onDragOver={(event) => event.preventDefault()}
              onDrop={dropCandidate}
            >
              <Award />
              <b>{candidate}</b>
              <strong>
                {candidateCorrect
                  ? `HCF = ${greatest}`
                  : `${candidate} is shared, but not greatest`}
              </strong>
              <span>
                {candidateCorrect
                  ? "Greatest shared divisor"
                  : `Drag ${greatest} here to complete the proof`}
              </span>
            </section>
          </div>
        </section>
      </main>

      <nav className="hcf69-navigation">
        <a href="/lessons/numbers-and-arithmetic/68-prime-factorisation">
          <ArrowLeft />
          <span>
            Previous lesson<b>Prime Factorisation</b>
          </span>
        </a>
        <a href="/lessons/numbers-and-arithmetic/70-lcm">
          <span>
            Next lesson<b>LCM</b>
          </span>
          <ArrowRight />
        </a>
      </nav>
    </div>
  );
}

function NumberStepper({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  const id = `hcf69-${label.toLowerCase().replace(" ", "-")}`;
  return (
    <section className="hcf69-stepper">
      <label htmlFor={id}>
        {label}: <b>{value}</b>
      </label>
      <div>
        <input
          id={id}
          aria-label={label}
          type="number"
          min="2"
          max="60"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          onClick={() => onChange(value - 1)}
        >
          <Minus />
        </button>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          onClick={() => onChange(value + 1)}
        >
          <Plus />
        </button>
      </div>
    </section>
  );
}

function ObjectGroups({
  value,
  groupSize,
  kind,
}: {
  value: number;
  groupSize: number;
  kind: "star" | "dot";
}) {
  const groupCount = value / groupSize;
  return (
    <section className={`hcf69-objects ${kind}`}>
      <h3>
        {value} objects in groups of {groupSize}
      </h3>
      <div>
        {Array.from({ length: groupCount }, (_, group) => (
          <span key={group}>
            {Array.from({ length: groupSize }, (_, item) =>
              kind === "star" ? <i key={item}>★</i> : <i key={item} />,
            )}
          </span>
        ))}
      </div>
    </section>
  );
}
