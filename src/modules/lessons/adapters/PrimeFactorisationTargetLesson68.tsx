import {
  ArrowLeft,
  HelpCircle,
  Lightbulb,
  Maximize2,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { LessonAdapterProps } from "../types";
import "./PrimeFactorisationTargetLesson68.css";

type FactorNode = {
  value: number;
  path: string;
  children?: [FactorNode, FactorNode];
};

function clampInteger(value: number, minimum: number, maximum: number) {
  if (!Number.isFinite(value)) return minimum;
  return Math.max(minimum, Math.min(maximum, Math.round(value)));
}

function isPrime(value: number) {
  if (value < 2) return false;
  for (let divisor = 2; divisor <= Math.sqrt(value); divisor += 1) {
    if (value % divisor === 0) return false;
  }
  return true;
}

function splitValue(value: number): [number, number] | null {
  if (isPrime(value)) return null;
  if (value === 24) return [6, 4];
  for (let divisor = 2; divisor <= Math.sqrt(value); divisor += 1) {
    if (value % divisor === 0) return [divisor, value / divisor];
  }
  return null;
}

function buildTree(value: number, path = "root"): FactorNode {
  const split = splitValue(value);
  if (!split) return { value, path };
  return {
    value,
    path,
    children: [
      buildTree(split[0], `${path}-left`),
      buildTree(split[1], `${path}-right`),
    ],
  };
}

function collectLeaves(node: FactorNode): number[] {
  if (!node.children) return [node.value];
  return [
    ...collectLeaves(node.children[0]),
    ...collectLeaves(node.children[1]),
  ];
}

function collectSplits(node: FactorNode): Array<[number, number, number]> {
  if (!node.children) return [];
  return [
    [node.value, node.children[0].value, node.children[1].value],
    ...collectSplits(node.children[0]),
    ...collectSplits(node.children[1]),
  ];
}

function leafCount(node: FactorNode): number {
  return node.children
    ? leafCount(node.children[0]) + leafCount(node.children[1])
    : 1;
}

function treeGraphics(node: FactorNode) {
  const lines: ReactNode[] = [];
  const nodes: ReactNode[] = [];
  const operators: ReactNode[] = [];
  const visit = (
    current: FactorNode,
    start: number,
    end: number,
    depth: number,
  ) => {
    const x = (start + end) / 2;
    const y = 42 + depth * 118;
    if (current.children) {
      const [left, right] = current.children;
      const totalLeaves = leafCount(current);
      const leftEnd = start + ((end - start) * leafCount(left)) / totalLeaves;
      const leftX = (start + leftEnd) / 2;
      const rightX = (leftEnd + end) / 2;
      const childY = y + 112;
      lines.push(
        <line
          x1={x}
          y1={y + 29}
          x2={leftX}
          y2={childY - 27}
          key={`${current.path}-l`}
        />,
      );
      lines.push(
        <line
          x1={x}
          y1={y + 29}
          x2={rightX}
          y2={childY - 27}
          key={`${current.path}-r`}
        />,
      );
      operators.push(
        <text x={(leftX + rightX) / 2} y={childY + 8} key={`${current.path}-x`}>
          ×
        </text>,
      );
      visit(left, start, leftEnd, depth + 1);
      visit(right, leftEnd, end, depth + 1);
    }
    const prime = !current.children;
    nodes.push(
      <g className={prime ? "prime" : "composite"} key={current.path}>
        {prime ? (
          <circle cx={x} cy={y} r="30" />
        ) : (
          <rect x={x - 48} y={y - 28} width="96" height="56" rx="9" />
        )}
        <text x={x} y={y + 10}>
          {current.value}
        </text>
      </g>,
    );
  };
  visit(node, -25, 667, 0);
  return { lines, nodes, operators };
}

function ExponentExpression({ factors }: { factors: number[] }) {
  const counts = new Map<number, number>();
  factors.forEach((factor) =>
    counts.set(factor, (counts.get(factor) ?? 0) + 1),
  );
  return Array.from(counts.entries()).map(([factor, count], index) => (
    <span key={factor}>
      {index > 0 ? " × " : ""}
      {factor}
      {count > 1 ? <sup>{count}</sup> : null}
    </span>
  ));
}

function exponentText(factors: number[]) {
  const counts = new Map<number, number>();
  factors.forEach((factor) =>
    counts.set(factor, (counts.get(factor) ?? 0) + 1),
  );
  return Array.from(counts.entries())
    .map(([factor, count]) =>
      count === 1 ? String(factor) : `${factor}^${count}`,
    )
    .join(" × ");
}

export default function PrimeFactorisationTargetLesson68({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [number, setNumber] = useState(24);
  const [candidate, setCandidate] = useState(3);
  const [rebuildCount, setRebuildCount] = useState(4);
  const [expanded, setExpanded] = useState(false);
  const [actions, setActions] = useState(0);
  const tree = useMemo(() => buildTree(number), [number]);
  const factors = useMemo(
    () => collectLeaves(tree).sort((a, b) => a - b),
    [tree],
  );
  const splits = useMemo(() => collectSplits(tree), [tree]);
  const graphics = useMemo(() => treeGraphics(tree), [tree]);
  const exponentForm = exponentText(factors);
  const rebuiltFactors = factors.slice(0, rebuildCount);
  const rebuiltProduct = rebuiltFactors.reduce(
    (product, factor) => product * factor,
    1,
  );
  const candidateCount = factors.filter(
    (factor) => factor === candidate,
  ).length;

  const act = () => {
    setActions((value) => value + 1);
    onInteraction();
  };
  const changeNumber = (value: number) => {
    const next = clampInteger(value, 4, 100);
    setNumber(next);
    const nextFactors = collectLeaves(buildTree(next)).sort((a, b) => a - b);
    setCandidate(nextFactors[0]);
    setRebuildCount(nextFactors.length);
    act();
  };
  const reset = () => {
    setNumber(24);
    setCandidate(3);
    setRebuildCount(4);
    setExpanded(false);
    setActions(0);
    onInteraction();
  };
  useEffect(() => {
    setNumber(24);
    setCandidate(3);
    setRebuildCount(4);
    setExpanded(false);
    setActions(0);
  }, [resetToken]);

  return (
    <div
      className={`factorisation68-page ${expanded ? "expanded" : ""}`}
      data-testid="number-mockup-0050"
      data-dedicated-lesson="68"
      data-object-model="editable-composite-recursive-binary-factor-tree-prime-leaves-split-steps-exponent-compression-rebuild-slider-candidate-frequency-practice-model"
      data-number={number}
      data-prime-factors={factors.join(",")}
      data-exponent-form={exponentForm}
      data-split-steps={splits.map((split) => split.join("x")).join(",")}
      data-candidate={candidate}
      data-candidate-count={candidateCount}
      data-rebuild-count={rebuildCount}
      data-rebuilt-product={rebuiltProduct}
      data-expanded={expanded}
      data-actions={actions}
    >
      <span className="sr-only">
        Concept trace: Prime factor tree. Keep splitting until all factors are
        prime. Prime factorisation is unique apart from factor order.
      </span>
      <nav className="factorisation68-breadcrumb">
        <a href="/" aria-label="Back">
          <ArrowLeft />
        </a>
        <a href="/">Home</a>
        <span>›</span>
        <a href="/lessons">Lessons</a>
        <span>›</span>
        <a href="/lessons/numbers-and-arithmetic">Numbers And Arithmetic</a>
        <span>›</span>
        <b>68 Prime Factorisation</b>
      </nav>
      <header className="factorisation68-title">
        <h1>Prime Factorisation</h1>
        <p>Decompose numbers uniquely.</p>
      </header>

      <main className="factorisation68-grid">
        <div className="factorisation68-left">
          <section className="factorisation68-tree-card">
            <header>
              <Lightbulb />
              <b>Keep splitting until every factor is prime.</b>
              <button
                type="button"
                aria-label="Expand factor tree"
                onClick={() => {
                  setExpanded((value) => !value);
                  act();
                }}
              >
                <Maximize2 />
              </button>
            </header>
            <svg
              viewBox="0 0 680 345"
              role="img"
              aria-label={`Prime factor tree for ${number}`}
            >
              <g className="branches">{graphics.lines}</g>
              <g className="operators">{graphics.operators}</g>
              <g className="nodes">{graphics.nodes}</g>
            </svg>
            <section className="factorisation68-exponent">
              <h3>
                <Maximize2 /> Exponent form (compressed)
              </h3>
              <p>
                <span>{factors.join(" × ")}</span>
                <b>=</b>
                <strong>
                  <ExponentExpression factors={factors} />
                </strong>
              </p>
            </section>
            <section className="factorisation68-rebuild">
              <header>
                <ShieldCheck />
                <b>Rebuild check</b>
              </header>
              <div className="factorisation68-rebuild-equation">
                <div>
                  {factors.map((factor, index) => (
                    <span
                      className={index < rebuildCount ? "active" : "inactive"}
                      key={`${factor}-${index}`}
                    >
                      {factor}
                    </span>
                  ))}
                </div>
                <b>=</b>
                <strong>
                  {rebuildCount === factors.length ? number : rebuiltProduct}
                </strong>
              </div>
              <input
                aria-label="Rebuild prime factors"
                type="range"
                min="1"
                max={factors.length}
                step="1"
                value={rebuildCount}
                onChange={(event) => {
                  setRebuildCount(Number(event.target.value));
                  act();
                }}
              />
              <p>
                Rebuild check: {rebuiltFactors.join(" × ")} = {rebuiltProduct}
              </p>
            </section>
          </section>
          <button
            type="button"
            className="factorisation68-practice"
            onClick={() => changeNumber(18)}
          >
            <HelpCircle />
            <span>Try: What is the prime factorisation of 18?</span>
            <b>›</b>
          </button>
        </div>

        <aside className="factorisation68-side">
          <section className="factorisation68-steps">
            <label htmlFor="factorisation68-number">Number:</label>
            <input
              id="factorisation68-number"
              aria-label="Number to factorise"
              type="number"
              min="4"
              max="100"
              value={number}
              onChange={(event) => changeNumber(Number(event.target.value))}
            />
            <ol>
              {splits.map(([parent, left, right], index) => (
                <li key={`${parent}-${index}`}>
                  <b>{index + 1}</b>
                  <span>
                    {parent} = {left} × {right}
                  </span>
                </li>
              ))}
            </ol>
          </section>
          <section className="factorisation68-primes">
            <h3>Prime factors:</h3>
            <div>
              {factors.map((factor, index) => (
                <button
                  type="button"
                  className={candidate === factor ? "selected" : ""}
                  onClick={() => {
                    setCandidate(factor);
                    act();
                  }}
                  key={`${factor}-${index}`}
                >
                  {factor}
                </button>
              ))}
            </div>
          </section>
          <section className="factorisation68-formula">
            <b>
              {number} = <ExponentExpression factors={factors} />
            </b>
          </section>
          <section className="factorisation68-insight">
            <header>
              <Scale />
              <b>Comparison insight</b>
            </header>
            <label htmlFor="factorisation68-candidate">
              Candidate divisor:
            </label>
            <select
              id="factorisation68-candidate"
              aria-label="Candidate prime divisor"
              value={candidate}
              onChange={(event) => {
                setCandidate(Number(event.target.value));
                act();
              }}
            >
              {Array.from(new Set(factors)).map((factor) => (
                <option key={factor}>{factor}</option>
              ))}
            </select>
            <p>
              <b>{candidate}</b> is used{" "}
              <strong>
                {candidateCount === 1 ? "once" : `${candidateCount} times`}
              </strong>{" "}
              in the prime factorisation of {number}.
            </p>
          </section>
        </aside>
      </main>
      <button
        type="button"
        className="factorisation68-reset sr-only"
        onClick={reset}
      >
        Reset factor tree
      </button>
    </div>
  );
}
