import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  Layers,
  RotateCcw,
  TriangleAlert,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./AasCongruenceTargetLesson10068.css";

type AasModel = { angleA: number; angleB: number; sideAC: number };
const START: AasModel = { angleA: 45, angleB: 70, sideAC: 6 };
const CHALLENGE: AasModel = { angleA: 52, angleB: 68, sideAC: 8 };

function solve(model: AasModel) {
  const angleC = 180 - model.angleA - model.angleB;
  const radians = (value: number) => (value * Math.PI) / 180;
  const sideAB =
    (model.sideAC * Math.sin(radians(angleC))) /
    Math.sin(radians(model.angleB));
  const sideBC =
    (model.sideAC * Math.sin(radians(model.angleA))) /
    Math.sin(radians(model.angleB));
  return { angleC, sideAB, sideBC };
}

export default function AasCongruenceTargetLesson10068({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [model, setModel] = useState<AasModel>(START);
  const [overlay, setOverlay] = useState(false);
  const [showSides, setShowSides] = useState(false);
  const [tab, setTab] = useState(0);
  const [challengeDone, setChallengeDone] = useState(false);
  const [actions, setActions] = useState(0);
  const result = solve(model);
  const challenge = solve(CHALLENGE);
  const valid = model.angleA > 0 && model.angleB > 0 && result.angleC > 0;
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
  };
  const reset = () =>
    act(() => {
      setModel(START);
      setOverlay(false);
      setShowSides(false);
    });
  return (
    <section
      className="aas10068-page"
      data-testid="school-mockup-0742"
      data-object-model="dedicated-aas-nonincluded-side-law-of-sines-engine"
      data-model={`${model.angleA},${model.angleB},${model.sideAC}`}
      data-third={result.angleC}
      data-sides={`${result.sideAB.toFixed(2)},${result.sideBC.toFixed(2)}`}
      data-overlay={String(overlay)}
      data-show-sides={String(showSides)}
      data-valid={String(valid)}
      data-challenge={String(challengeDone)}
      data-tab={tab}
      data-actions={actions}
    >
      <header className="aas10068-hero">
        <small>CLASS 9 · TRIANGLE PROOFS</small>
        <h1>AAS Congruence</h1>
        <p>
          Prove triangles congruent from two angles and a corresponding
          non-included side.
        </p>
        <div>
          <span>30 min</span>
          <span>RIGOROUS</span>
          <span>PROOF</span>
          <span>geometry2d</span>
        </div>
      </header>
      <nav className="aas10068-tabs">
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
        <section className="aas10068-lab">
          <header>
            <div>
              <h2>Construct & Verify</h2>
              <p>
                Set two angles and a corresponding non-included side. The third
                angles are computed.
              </p>
            </div>
            <nav>
              <button className="mode">AAS Mode ⓘ</button>
              <button onClick={reset}>
                <RotateCcw /> Reset
              </button>
            </nav>
          </header>
          <div className="aas10068-triangles">
            <TrianglePanel
              name="Triangle ABC"
              letters="ABC"
              model={model}
              result={result}
              showSides={showSides}
            />
            <Correspondence />
            <TrianglePanel
              name="Triangle DEF"
              letters="DEF"
              model={model}
              result={result}
              showSides={showSides}
            />
          </div>
          <div className="aas10068-controls">
            <section>
              <h3>Set Angles (equal pairs)</h3>
              <div>
                <AngleControl
                  label="∠A = ∠D"
                  value={model.angleA}
                  onChange={(angleA) =>
                    act(() => setModel({ ...model, angleA }))
                  }
                />
                <AngleControl
                  label="∠B = ∠E"
                  value={model.angleB}
                  onChange={(angleB) =>
                    act(() => setModel({ ...model, angleB }))
                  }
                />
              </div>
            </section>
            <section>
              <h3>Set Non-Included Side (equal)</h3>
              <b>AC = DF</b>
              <input
                aria-label="Equal non-included side"
                type="range"
                min="3"
                max="10"
                step="0.5"
                value={model.sideAC}
                onChange={(event) =>
                  act(() => setModel({ ...model, sideAC: +event.target.value }))
                }
              />
              <p>
                <span>3</span>
                <output>{model.sideAC}</output>
                <span>10</span>
              </p>
            </section>
            <section>
              <h3>Computed Third Angles</h3>
              <div>
                <ComputedDial label="∠C" value={result.angleC} />
                <ComputedDial label="∠F" value={result.angleC} />
              </div>
            </section>
          </div>
          <footer className={valid ? "valid" : "invalid"}>
            <span>
              <Check />
              <b>
                {valid
                  ? "Result: Triangles ABC and DEF are congruent by AAS."
                  : "Angles must form a triangle."}
              </b>
            </span>
            <nav>
              <button
                className={overlay ? "active" : ""}
                onClick={() => act(() => setOverlay((value) => !value))}
              >
                <Layers /> Overlay
              </button>
              <button
                className={showSides ? "active" : ""}
                onClick={() => act(() => setShowSides((value) => !value))}
              >
                <Eye /> Show Corresponding Sides
              </button>
            </nav>
          </footer>
          {overlay && <OverlayDiagram model={model} />}
        </section>
        <section className="aas10068-content">
          <article>
            <h2>Why It Works (Theorem)</h2>
            <p>
              If two angles and a non-included side of one triangle are
              respectively equal to two angles and the corresponding
              non-included side of another triangle, then the two triangles are
              congruent.
            </p>
            <strong>
              Symbolically:
              <br />
              <i>If ∠A = ∠D, ∠B = ∠E and AC = DF, then △ABC ≅ △DEF (by AAS).</i>
            </strong>
          </article>
          <article className="worked">
            <h2>Worked Example (Correct Use)</h2>
            <p>
              <b>Given:</b> ∠A = ∠D = 45°, ∠B = ∠E = 70°, AC = DF = 6
            </p>
            <p>
              <b>Find:</b> Prove △ABC ≅ △DEF
            </p>
            <ol>
              <li>∠A = ∠D = 45°</li>
              <li>∠B = ∠E = 70°</li>
              <li>AC = DF = 6 (not between ∠A and ∠B)</li>
              <li>∠C = ∠F = 65°</li>
            </ol>
            <strong>
              Therefore, △ABC ≅ △DEF (AAS) <Check />
            </strong>
          </article>
          <article className="warning">
            <h2>
              <TriangleAlert /> Common Mistake (AAS vs ASA)
            </h2>
            <p>
              AAS is not the same as ASA. In AAS, the given side is NOT between
              the two given angles.
            </p>
            <div>
              <MiniComparison />
              <MiniComparison asa />
            </div>
          </article>
          <article className="challenge">
            <h2>Your Turn: Challenge</h2>
            <p>
              Construct both triangles to match the given conditions, then
              verify all corresponding sides.
            </p>
            <div className="challenge-body">
              <aside>
                <b>Given</b>
                <p>∠A = ∠D = 52°</p>
                <p>∠B = ∠E = 68°</p>
                <p>AC = DF = 8</p>
                <button onClick={() => act(() => setChallengeDone(true))}>
                  <Check /> Check Answer
                </button>
              </aside>
              <TrianglePanel
                name="Triangle ABC"
                letters="ABC"
                model={CHALLENGE}
                result={challenge}
                showSides
              />
              <TrianglePanel
                name="Triangle DEF"
                letters="DEF"
                model={CHALLENGE}
                result={challenge}
                showSides
              />
            </div>
            <div className="verification">
              <span>∠C = {challengeDone ? `${challenge.angleC}°` : "?"}</span>
              <span>∠F = {challengeDone ? `${challenge.angleC}°` : "?"}</span>
              <span>
                AB = DE {challengeDone ? challenge.sideAB.toFixed(2) : "?"}
              </span>
              <span>
                BC = EF {challengeDone ? challenge.sideBC.toFixed(2) : "?"}
              </span>
              <span>AC = DF 8</span>
            </div>
          </article>
          <aside className="aas10068-see">
            <h2>What You Should See</h2>
            <p>
              <Check /> ∠C = ∠F = {challenge.angleC}°
            </p>
            <p>
              <Check /> AB = DE = {challenge.sideAB.toFixed(2)}
            </p>
            <p>
              <Check /> BC = EF = {challenge.sideBC.toFixed(2)}
            </p>
            <p>
              <Check /> AC = DF = 8 (given)
            </p>
            <p>Therefore, △ABC ≅ △DEF by AAS.</p>
          </aside>
        </section>
      </main>
      <nav className="aas10068-adjacent">
        <Link to="/lessons/school/class-9/class-9-triangle-proofs-sss-congruence">
          <ArrowLeft />
          <span>
            Previous
            <br />
            <b>SSS Congruence</b>
          </span>
        </Link>
        <Link to="/lessons/school/class-9/class-9-triangle-proofs-asa-congruence">
          <span>
            Next
            <br />
            <b>ASA Congruence</b>
          </span>
          <ArrowRight />
        </Link>
      </nav>
    </section>
  );
}

function trianglePoints(model: AasModel) {
  const base = 205,
    angleA = (model.angleA * Math.PI) / 180,
    angleB = (model.angleB * Math.PI) / 180;
  const height =
    (base * Math.sin(angleA) * Math.sin(angleB)) /
    Math.sin(Math.PI - angleA - angleB);
  return { x: 25 + height / Math.tan(angleA), y: 210 - height };
}
function TrianglePanel({
  name,
  letters,
  model,
  result,
  showSides,
}: {
  name: string;
  letters: string;
  model: AasModel;
  result: ReturnType<typeof solve>;
  showSides: boolean;
}) {
  const p = trianglePoints(model),
    [a, b, c] = letters.split("");
  return (
    <article className="aas10068-triangle-panel">
      <b>{name}</b>
      <svg viewBox="0 0 260 245" aria-label={`AAS triangle ${letters}`}>
        <path className="shape" d={`M25 210L230 210L${p.x} ${p.y}Z`} />
        <path className="left" d="M25 210H56A31 31 0 0 0 46 187Z" />
        <path className="right" d="M230 210H197A33 33 0 0 1 213 181Z" />
        <circle cx="25" cy="210" r="4" />
        <circle cx="230" cy="210" r="4" />
        <circle cx={p.x} cy={p.y} r="4" />
        <text x="8" y="229">
          {a}
        </text>
        <text x="232" y="229">
          {b}
        </text>
        <text x={p.x - 5} y={p.y - 9}>
          {c}
        </text>
        <text className="green" x="62" y="112">
          {model.sideAC}
        </text>
        <text className="green" x="47" y="194">
          {model.angleA}°
        </text>
        <text className="purple" x="190" y="194">
          {model.angleB}°
        </text>
        <text className="blue" x={p.x - 14} y={p.y + 30}>
          {result.angleC}°
        </text>
        {showSides && (
          <>
            <text className="side" x="110" y="232">
              {result.sideAB.toFixed(2)}
            </text>
            <text className="side" x="185" y="110">
              {result.sideBC.toFixed(2)}
            </text>
          </>
        )}
      </svg>
    </article>
  );
}
function Correspondence() {
  return (
    <aside className="aas10068-correspondence">
      <b>Correspondence</b>
      <p>A ↔ D</p>
      <p>B ↔ E</p>
      <p>C ↔ F</p>
    </aside>
  );
}
function AngleControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <label className="aas10068-angle-control">
      <b>{label}</b>
      <div className="aas10068-angle-dial">
        <input
          aria-label={label}
          type="range"
          min="20"
          max="120"
          value={value}
          onChange={(e) => onChange(+e.target.value)}
        />
        <i style={{ transform: `rotate(${value * 1.8 - 90}deg)` }}>
          <em />
        </i>
        <strong>{value}°</strong>
      </div>
      <span>
        <button
          aria-label={`Decrease ${label}`}
          onClick={() => onChange(Math.max(20, value - 1))}
        >
          −
        </button>
        <button
          aria-label={`Increase ${label}`}
          onClick={() => onChange(Math.min(120, value + 1))}
        >
          +
        </button>
      </span>
    </label>
  );
}
function ComputedDial({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <b>{label}</b>
      <i>{value}°</i>
    </div>
  );
}
function OverlayDiagram({ model }: { model: AasModel }) {
  return (
    <div className="aas10068-overlay">
      <TrianglePanel
        name="Overlay ABC/DEF"
        letters="ABC"
        model={model}
        result={solve(model)}
        showSides
      />
    </div>
  );
}
function MiniComparison({ asa = false }: { asa?: boolean }) {
  return (
    <figure>
      <b>{asa ? "ASA (Different)" : "AAS (Correct)"}</b>
      <svg viewBox="0 0 150 95">
        <path d={asa ? "M8 80L142 80L83 15Z" : "M8 80L125 80L70 15Z"} />
        <path className="left" d="M8 80H26L17 65Z" />
        <path className="right" d={`${asa ? "M142" : "M125"} 80H106L116 64Z`} />
        <text x="55" y="93">
          {asa ? "included" : "not included"}
        </text>
      </svg>
      <p>{asa ? "ASA does NOT apply" : "AAS applies"}</p>
    </figure>
  );
}
