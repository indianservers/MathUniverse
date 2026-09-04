import { Check, Info, RotateCcw, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./TypesRelationsTargetLesson10112.css";

type Element = 1 | 2 | 3 | 4;
type Pair = `${Element},${Element}`;
const A: Element[] = [1, 2, 3, 4];
const key = (a: Element, b: Element): Pair => `${a},${b}`;
const DEFAULT: Pair[] = [
  "1,1",
  "1,2",
  "1,3",
  "2,2",
  "2,4",
  "3,2",
  "3,3",
  "3,4",
  "4,4",
];
const positions: Record<Element, [number, number]> = {
  1: [105, 75],
  2: [355, 75],
  3: [105, 270],
  4: [355, 270],
};

const presets = [
  { name: "Identity", symbol: "Iₐ", pairs: A.map((a) => key(a, a)) },
  {
    name: "Universal",
    symbol: "Uₐ",
    pairs: A.flatMap((a) => A.map((b) => key(a, b))),
  },
  {
    name: "Less-than",
    symbol: "<",
    pairs: A.flatMap((a) => A.filter((b) => a < b).map((b) => key(a, b))),
  },
  {
    name: "Less-than-or-equal",
    symbol: "≤",
    pairs: A.flatMap((a) => A.filter((b) => a <= b).map((b) => key(a, b))),
  },
  {
    name: "Cyclic",
    symbol: "C₄",
    pairs: ["1,2", "2,3", "3,4", "4,1"] as Pair[],
  },
  { name: "Empty", symbol: "∅", pairs: [] as Pair[] },
];

function relationFacts(relation: Set<Pair>) {
  const reflexiveMissing = A.find((a) => !relation.has(key(a, a)));
  const symmetricMissing = Array.from(relation)
    .map((pair) => pair.split(",").map(Number) as [Element, Element])
    .find(([a, b]) => !relation.has(key(b, a)));
  const antisymmetricWitness = A.flatMap((a) =>
    A.map((b) => [a, b] as const),
  ).find(
    ([a, b]) => a !== b && relation.has(key(a, b)) && relation.has(key(b, a)),
  );
  const transitiveWitness = A.flatMap((a) =>
    A.flatMap((b) => A.map((c) => [a, b, c] as const)),
  ).find(
    ([a, b, c]) =>
      relation.has(key(a, b)) &&
      relation.has(key(b, c)) &&
      !relation.has(key(a, c)),
  );
  return {
    reflexive: !reflexiveMissing,
    symmetric: !symmetricMissing,
    antisymmetric: !antisymmetricWitness,
    transitive: !transitiveWitness,
    reflexiveNote: reflexiveMissing
      ? `Missing (${reflexiveMissing}, ${reflexiveMissing}).`
      : "All diagonal pairs are in R.",
    symmetricNote: symmetricMissing
      ? `(${symmetricMissing[0]}, ${symmetricMissing[1]}) is present, but (${symmetricMissing[1]}, ${symmetricMissing[0]}) is missing.`
      : "Every pair has its reverse in R.",
    antisymmetricNote: antisymmetricWitness
      ? `Counterexample: (${antisymmetricWitness[0]}, ${antisymmetricWitness[1]}) and (${antisymmetricWitness[1]}, ${antisymmetricWitness[0]}).`
      : "No distinct elements are related both ways.",
    transitiveNote: transitiveWitness
      ? `(${transitiveWitness[0]}, ${transitiveWitness[1]}) and (${transitiveWitness[1]}, ${transitiveWitness[2]}) need (${transitiveWitness[0]}, ${transitiveWitness[2]}).`
      : "Every composable pair has its required shortcut.",
  };
}

export default function TypesRelationsTargetLesson10112({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [relation, setRelation] = useState(() => new Set<Pair>(DEFAULT));
  const [dragSource, setDragSource] = useState<Element | null>(null);
  const [pointer, setPointer] = useState<[number, number] | null>(null);
  const [actions, setActions] = useState(0);
  const facts = useMemo(() => relationFacts(relation), [relation]);
  const ordered = A.flatMap((a) =>
    A.filter((b) => relation.has(key(a, b))).map((b) => `(${a}, ${b})`),
  );
  const change = (next: Set<Pair>) => {
    setRelation(next);
    setActions((value) => value + 1);
  };
  const toggle = (a: Element, b: Element) => {
    const next = new Set(relation),
      pair = key(a, b);
    if (next.has(pair)) next.delete(pair);
    else next.add(pair);
    change(next);
  };
  const graphPoint = (
    event: ReactPointerEvent<SVGSVGElement>,
  ): [number, number] => {
    const rect = event.currentTarget.getBoundingClientRect();
    return [
      ((event.clientX - rect.left) / rect.width) * 460,
      ((event.clientY - rect.top) / rect.height) * 345,
    ];
  };
  const endDrag = (target: Element) => {
    if (dragSource !== null) toggle(dragSource, target);
    setDragSource(null);
    setPointer(null);
  };
  const diagnostic = (
    label: string,
    formula: string,
    ok: boolean,
    note: string,
  ) => (
    <article className={ok ? "ok" : "bad"}>
      <span>{ok ? <Check /> : <X />}</span>
      <div>
        <h3>{label}</h3>
        <em>{formula}</em>
        <p>{note}</p>
      </div>
      <strong>{ok ? "TRUE" : "FALSE"}</strong>
    </article>
  );
  return (
    <section
      className="rel10112-page"
      data-testid="school-mockup-0786"
      data-object-model="dedicated-directed-relation-matrix-property-engine"
      data-pairs={ordered.join(";")}
      data-pair-count={relation.size}
      data-reflexive={String(facts.reflexive)}
      data-symmetric={String(facts.symmetric)}
      data-antisymmetric={String(facts.antisymmetric)}
      data-transitive={String(facts.transitive)}
      data-actions={actions}
    >
      <header>
        <small>CLASS 11 · RELATIONS AND FUNCTIONS</small>
        <h1>Types of Relations</h1>
        <p>
          Explore relations on set A = {"{"}1, 2, 3, 4{"}"}. Build a relation by
          drawing directed arrows.
          <br />
          The relation matrix and properties update instantly.
        </p>
        <button>← &nbsp; Back to School lessons</button>
      </header>
      <main>
        <section className="rel10112-graph">
          <h2>
            RELATION GRAPH{" "}
            <i>
              (A = {"{"}1, 2, 3, 4{"}"})
            </i>
            <span>
              Drag to draw arrows <Info />
            </span>
          </h2>
          <svg
            viewBox="0 0 460 345"
            onPointerMove={(event) =>
              dragSource && setPointer(graphPoint(event))
            }
            onPointerUp={(event) => {
              if (dragSource === null) return;
              const [x, y] = graphPoint(event);
              const nearest = A.find((element) => {
                const [nx, ny] = positions[element];
                return Math.hypot(x - nx, y - ny) <= 46;
              });
              if (nearest) endDrag(nearest);
              else {
                setDragSource(null);
                setPointer(null);
              }
            }}
            onPointerLeave={() => {
              setDragSource(null);
              setPointer(null);
            }}
            aria-label="Directed relation graph"
          >
            <defs>
              <marker
                id="rel10112-arrow"
                markerWidth="8"
                markerHeight="8"
                refX="7"
                refY="4"
                orient="auto"
              >
                <path d="M0,0 L8,4 L0,8 Z" />
              </marker>
            </defs>
            {A.flatMap((a) => A.map((b) => [a, b] as const))
              .filter(([a, b]) => a !== b && relation.has(key(a, b)))
              .map(([a, b]) => {
                const [x1, y1] = positions[a],
                  [x2, y2] = positions[b],
                  dx = x2 - x1,
                  dy = y2 - y1,
                  length = Math.hypot(dx, dy),
                  ox = (dx / length) * 35,
                  oy = (dy / length) * 35;
                return (
                  <line
                    key={key(a, b)}
                    x1={x1 + ox}
                    y1={y1 + oy}
                    x2={x2 - ox}
                    y2={y2 - oy}
                    className="edge"
                    markerEnd="url(#rel10112-arrow)"
                  />
                );
              })}
            {A.filter((a) => relation.has(key(a, a))).map((a) => {
              const [x, y] = positions[a];
              return (
                <path
                  key={`loop-${a}`}
                  className="edge"
                  d={`M ${x - 18} ${y - 27} C ${x - 55} ${y - 65}, ${x + 55} ${y - 65}, ${x + 18} ${y - 27}`}
                  markerEnd="url(#rel10112-arrow)"
                />
              );
            })}
            {dragSource && pointer && (
              <line
                className="draft"
                x1={positions[dragSource][0]}
                y1={positions[dragSource][1]}
                x2={pointer[0]}
                y2={pointer[1]}
                markerEnd="url(#rel10112-arrow)"
              />
            )}
            {A.map((a) => (
              <g
                key={a}
                className="node"
                role="button"
                tabIndex={0}
                aria-label={`Element ${a}`}
                onPointerDown={() => {
                  setDragSource(a);
                  setPointer(positions[a]);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") toggle(a, a);
                }}
              >
                <circle cx={positions[a][0]} cy={positions[a][1]} r="34" />
                <text x={positions[a][0]} y={positions[a][1] + 9}>
                  {a}
                </text>
              </g>
            ))}
          </svg>
          <label>Ordered pairs in R:</label>
          <output>{`{${ordered.join(", ") || " "}}`}</output>
        </section>
        <section className="rel10112-matrix">
          <h2>
            RELATION MATRIX <i>Mᵣ</i>
          </h2>
          <p>Rows = first element, Columns = second element</p>
          <div className="matrix-grid">
            <b>A</b>
            {A.map((a) => (
              <b key={`c${a}`}>{a}</b>
            ))}
            {A.flatMap((a) => [
              <b key={`r${a}`}>{a}</b>,
              ...A.map((b) => (
                <button
                  key={key(a, b)}
                  aria-label={`Toggle pair ${a}, ${b}`}
                  className={relation.has(key(a, b)) ? "selected" : ""}
                  onClick={() => toggle(a, b)}
                >
                  {relation.has(key(a, b)) ? 1 : 0}
                </button>
              )),
            ])}
          </div>
          <footer>
            <span>1 = (i, j) ∈ R</span>
            <span>0 = (i, j) ∉ R</span>
          </footer>
        </section>
        <section className="rel10112-diagnostics">
          <h2>
            RELATION PROPERTY DIAGNOSTICS <Info />
          </h2>
          {diagnostic(
            "Reflexive",
            "(a, a) ∈ R for all a ∈ A",
            facts.reflexive,
            facts.reflexiveNote,
          )}
          {diagnostic(
            "Symmetric",
            "(a, b) ∈ R ⇒ (b, a) ∈ R",
            facts.symmetric,
            facts.symmetricNote,
          )}
          {diagnostic(
            "Antisymmetric",
            "(a, b) ∈ R and (b, a) ∈ R ⇒ a = b",
            facts.antisymmetric,
            facts.antisymmetricNote,
          )}
          {diagnostic(
            "Transitive",
            "(a, b) ∈ R and (b, c) ∈ R ⇒ (a, c) ∈ R",
            facts.transitive,
            facts.transitiveNote,
          )}
        </section>
      </main>
      <footer className="rel10112-presets">
        <section>
          <h2>
            PRESET RELATIONS{" "}
            <i>
              (ON A = {"{"}1, 2, 3, 4{"}"})
            </i>
          </h2>
          <nav>
            {presets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => change(new Set(preset.pairs))}
              >
                <b>
                  {preset.name} &nbsp; {preset.symbol}
                </b>
                <span>
                  {preset.pairs.length
                    ? `{${preset.pairs.map((pair) => `(${pair.replace(",", ", ")})`).join(", ")}}`
                    : "No ordered pairs"}
                </span>
              </button>
            ))}
          </nav>
          <p>Click a preset to load it. Then modify by drawing arrows.</p>
        </section>
        <aside>
          <h2>ACTIONS</h2>
          <button onClick={() => change(new Set())}>
            <RotateCcw /> Reset Relation
          </button>
          <p>Clears all arrows and resets to ∅.</p>
        </aside>
      </footer>
    </section>
  );
}
