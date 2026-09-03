import {
  ArrowLeft,
  ArrowRight,
  Check,
  Layers,
  RotateCcw,
  Shuffle,
  Trophy,
} from "lucide-react";
import { type DragEventHandler, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./SasCongruenceTargetLesson10066.css";

type Measures = { base: number; side: number; angle: number };
const START: Measures = { base: 5, side: 7, angle: 60 };

export default function SasCongruenceTargetLesson10066({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [abc, setAbc] = useState<Measures>(START);
  const [def, setDef] = useState<Measures>(START);
  const [overlay, setOverlay] = useState(true);
  const [tab, setTab] = useState(0);
  const [actions, setActions] = useState(0);
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
  };
  const matches =
    abc.base === def.base && abc.side === def.side && abc.angle === def.angle;
  const checks = [
    abc.base === def.base,
    abc.side === def.side,
    abc.angle === def.angle,
    overlay && matches,
  ];
  const reset = () =>
    act(() => {
      setAbc(START);
      setDef(START);
      setOverlay(true);
    });
  const randomize = () =>
    act(() => {
      const seed = (actions % 4) + 1;
      setAbc({ base: 4 + seed, side: 6 + seed, angle: 45 + seed * 5 });
      setDef({ base: 6, side: 8, angle: 70 });
      setOverlay(false);
    });

  return (
    <section
      className="sas10066-page"
      data-testid="school-mockup-0740"
      data-object-model="dedicated-two-triangle-sas-congruence-overlay-engine"
      data-abc={`${abc.base},${abc.side},${abc.angle}`}
      data-def={`${def.base},${def.side},${def.angle}`}
      data-overlay={String(overlay)}
      data-matches={String(matches)}
      data-score={checks.filter(Boolean).length}
      data-tab={tab}
      data-actions={actions}
    >
      <header className="sas10066-hero">
        <small>CLASS 9 · TRIANGLE PROOFS</small>
        <h1>SAS Congruence</h1>
        <p>
          <b>Objective:</b> Prove two triangles congruent using two
          corresponding sides and the included angle.
        </p>
        <div>
          <span>30 min</span>
          <span>RIGOROUS</span>
          <span>PROOF</span>
          <span>geometry2d</span>
        </div>
      </header>
      <nav className="sas10066-tabs">
        {["Interact", "Learn", "Example", "Formula", "Practice"].map(
          (label, index) => (
            <button
              key={label}
              className={tab === index ? "active" : ""}
              aria-selected={tab === index}
              onClick={() => act(() => setTab(index))}
            >
              {label}
            </button>
          ),
        )}
      </nav>
      <main>
        <section className="sas10066-lab">
          <header>
            <div>
              <h2>1. Build and compare the triangles</h2>
              <p>Adjust sides and angle so the corresponding parts match.</p>
            </div>
            <nav>
              <button onClick={reset}>
                <RotateCcw /> Reset
              </button>
              <button onClick={randomize}>
                <Shuffle /> Randomize
              </button>
              <button
                className={overlay ? "active" : ""}
                onClick={() => act(() => setOverlay((value) => !value))}
              >
                <Layers /> Overlay
              </button>
            </nav>
          </header>
          <div className="sas10066-models">
            <TriangleCard name="Triangle ABC" letters="ABC" measures={abc} />
            <Correspondence />
            <TriangleCard
              name="Triangle DEF"
              letters="DEF"
              measures={def}
              draggable
              onDragStart={(event) => {
                event.dataTransfer.setData("text/plain", "triangle-def");
                act(() => setOverlay(false));
              }}
              onActivate={() => act(() => setOverlay(true))}
            />
          </div>
          <div className="sas10066-controls">
            <MeasureControls
              title="Triangle ABC"
              labels={["Side AB", "Side AC", "∠A (included)"]}
              value={abc}
              onChange={(next) => act(() => setAbc(next))}
            />
            <div
              className={`sas10066-overlay ${overlay ? "active" : ""}`}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                if (event.dataTransfer.getData("text/plain") === "triangle-def")
                  act(() => setOverlay(true));
              }}
            >
              <p>
                {overlay
                  ? "Triangles overlaid"
                  : "Drag one triangle onto the other to test overlay"}
              </p>
              <OverlayMini abc={abc} def={def} overlay={overlay} />
            </div>
            <MeasureControls
              title="Triangle DEF"
              labels={["Side DE", "Side DF", "∠D (included)"]}
              value={def}
              onChange={(next) => act(() => setDef(next))}
            />
          </div>
          <footer className={matches ? "match" : "mismatch"}>
            <span>
              <Check />
              <b>
                {matches
                  ? "Great! The triangles match."
                  : "Keep matching corresponding parts."}
              </b>
              <small>
                {matches
                  ? "All corresponding sides and the included angle are equal."
                  : "SAS needs both side pairs and the included angle."}
              </small>
            </span>
            <strong>
              Conclusion: <i>△ABC {matches ? "≅" : "≇"} △DEF</i> by SAS
            </strong>
          </footer>
        </section>
        <section className="sas10066-theory">
          <article>
            <h2>2. Why it works (SAS Rule)</h2>
            <p>
              If two sides and the included angle of one triangle are
              respectively equal to two sides and the included angle of another
              triangle, then the two triangles are congruent.
            </p>
            <strong>
              If AB = DE, AC = DF and
              <br />
              ∠A = ∠D, then △ABC ≅ △DEF
              <br />
              <b>by SAS.</b>
            </strong>
          </article>
          <article>
            <h2>3. Worked Example</h2>
            <p>Given: AB = DE = 5, AC = DF = 7 and ∠A = ∠D = 60°.</p>
            <div className="sas10066-pair">
              <TriangleSvg letters="ABC" measures={START} />
              <TriangleSvg letters="DEF" measures={START} />
            </div>
            <p>Therefore, △ABC ≅ △DEF by SAS.</p>
          </article>
          <article className="warning">
            <h2>4. Common Misconception</h2>
            <p>
              SSA is not SAS. Two sides and a non-included angle may form two
              different triangles.
            </p>
            <SsaMini />
            <p>
              Same two sides and angle, but different triangles. This does not
              guarantee congruence.
            </p>
          </article>
        </section>
        <section className="sas10066-challenge">
          <header>
            <h2>5. Challenge: Match and Prove Congruence</h2>
            <p>
              Adjust Triangle DEF to match Triangle ABC using the controls, then
              overlay to prove they are congruent.
            </p>
          </header>
          <ul>
            {[
              "Match AB = DE",
              "Match AC = DF",
              "Match ∠A = ∠D",
              "Overlay the triangles",
            ].map((label, index) => (
              <li key={label} className={checks[index] ? "done" : ""}>
                <Check /> {label}
                <b>{checks[index] ? "✓" : "○"}</b>
              </li>
            ))}
          </ul>
          <aside className={checks.every(Boolean) ? "done" : ""}>
            <Trophy />
            <div>
              <h2>{checks.every(Boolean) ? "Well done!" : "Almost there"}</h2>
              <p>
                {checks.every(Boolean)
                  ? "Overlay complete!"
                  : "Match all three SAS measures."}
              </p>
              <strong>
                △ABC {checks.every(Boolean) ? "≅" : "?"} △DEF by SAS.
              </strong>
            </div>
          </aside>
        </section>
      </main>
      <nav className="sas10066-adjacent">
        <Link to="/lessons/school/class-9/class-9-triangle-proofs-asa-congruence">
          <ArrowLeft />
          <span>
            <small>Previous</small>
            <b>ASA Congruence</b>
          </span>
        </Link>
        <Link
          className="next"
          to="/lessons/school/class-9/class-9-triangle-proofs-aas-congruence"
        >
          <span>
            <small>Next</small>
            <b>AAS Congruence</b>
          </span>
          <ArrowRight />
        </Link>
      </nav>
    </section>
  );
}

function TriangleCard({
  name,
  letters,
  measures,
  draggable = false,
  onDragStart,
  onActivate,
}: {
  name: string;
  letters: string;
  measures: Measures;
  draggable?: boolean;
  onDragStart?: DragEventHandler<HTMLElement>;
  onActivate?: () => void;
}) {
  return (
    <article
      className="sas10066-triangle-card"
      draggable={draggable}
      onDragStart={onDragStart}
      tabIndex={draggable ? 0 : undefined}
      aria-label={draggable ? "Draggable Triangle DEF" : undefined}
      onKeyDown={(event) => {
        if (draggable && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onActivate?.();
        }
      }}
    >
      <span>{name}</span>
      <TriangleSvg letters={letters} measures={measures} />
    </article>
  );
}

function TriangleSvg({
  letters,
  measures,
}: {
  letters: string;
  measures: Measures;
}) {
  const angle = (measures.angle * Math.PI) / 180;
  const scale = 24;
  const ax = 35,
    ay = 230,
    bx = ax + measures.base * scale,
    by = ay;
  const cx = ax + measures.side * scale * Math.cos(angle),
    cy = ay - measures.side * scale * Math.sin(angle);
  const [a, b, c] = letters.split("");
  return (
    <svg
      className="sas10066-triangle"
      viewBox="0 0 260 260"
      aria-label={`Triangle ${letters} SAS model`}
    >
      <path d={`M${ax} ${ay}L${bx} ${by}L${cx} ${cy}Z`} />
      <path
        className="angle"
        d={`M${ax + 32} ${ay}A32 32 0 0 0 ${ax + 32 * Math.cos(angle)} ${ay - 32 * Math.sin(angle)}`}
      />
      {[
        [ax, ay],
        [bx, by],
        [cx, cy],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="5" />
      ))}
      <text x={ax - 18} y={ay + 22}>
        {a}
      </text>
      <text x={bx + 8} y={by + 22}>
        {b}
      </text>
      <text x={cx - 2} y={cy - 14}>
        {c}
      </text>
      <text className="base" x={(ax + bx) / 2} y={ay + 26}>
        {measures.base}
      </text>
      <text className="side" x={(ax + cx) / 2 - 20} y={(ay + cy) / 2}>
        {measures.side}
      </text>
      <text className="degree" x={ax + 34} y={ay - 20}>
        {measures.angle}°
      </text>
    </svg>
  );
}

function Correspondence() {
  return (
    <aside className="sas10066-correspondence">
      <b>Correspondence</b>
      <p>
        <i className="blue" /> A <span>↔</span> D
      </p>
      <p>
        <i className="orange" /> B <span>↔</span> E
      </p>
      <p>
        <i className="purple" /> C <span>↔</span> F
      </p>
    </aside>
  );
}

function MeasureControls({
  title,
  labels,
  value,
  onChange,
}: {
  title: string;
  labels: string[];
  value: Measures;
  onChange: (value: Measures) => void;
}) {
  const rows: Array<[keyof Measures, number, number]> = [
    ["base", 3, 8],
    ["side", 4, 9],
    ["angle", 30, 100],
  ];
  return (
    <section aria-label={`${title} controls`}>
      {rows.map(([key, min, max], index) => (
        <label key={key}>
          <b>{labels[index]}</b>
          <span>
            <button
              aria-label={`Decrease ${labels[index]}`}
              onClick={() =>
                onChange({ ...value, [key]: Math.max(min, value[key] - 1) })
              }
            >
              −
            </button>
            <input
              aria-label={labels[index]}
              type="range"
              min={min}
              max={max}
              value={value[key]}
              onChange={(event) =>
                onChange({ ...value, [key]: Number(event.target.value) })
              }
            />
            <output>
              {value[key]}
              {key === "angle" ? "°" : ""}
            </output>
            <button
              aria-label={`Increase ${labels[index]}`}
              onClick={() =>
                onChange({ ...value, [key]: Math.min(max, value[key] + 1) })
              }
            >
              +
            </button>
          </span>
        </label>
      ))}
    </section>
  );
}

function OverlayMini({
  abc,
  def,
  overlay,
}: {
  abc: Measures;
  def: Measures;
  overlay: boolean;
}) {
  return (
    <svg viewBox="0 0 130 100" aria-label="Triangle overlay comparison">
      <path d="M15 83L70 83L42 24Z" />
      <path
        className={overlay ? "overlaid" : "offset"}
        d={overlay ? "M15 83L70 83L42 24Z" : "M48 83L103 83L76 24Z"}
      />
      <text x="42" y="96">
        {abc.base}/{def.base}
      </text>
    </svg>
  );
}

function SsaMini() {
  return (
    <svg
      className="sas10066-ssa"
      viewBox="0 0 260 110"
      aria-label="SSA ambiguity example"
    >
      <path d="M15 90L95 90L62 20Z M150 90L245 90L220 20Z" />
      <text x="18" y="77">
        30°
      </text>
      <text x="152" y="77">
        30°
      </text>
      <text x="31" y="55">
        7
      </text>
      <text x="190" y="55">
        7
      </text>
      <text x="52" y="105">
        5
      </text>
      <text x="194" y="105">
        5
      </text>
    </svg>
  );
}
