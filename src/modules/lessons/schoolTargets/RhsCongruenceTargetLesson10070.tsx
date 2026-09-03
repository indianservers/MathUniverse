import {
  ArrowLeft,
  ArrowRight,
  Check,
  Expand,
  FlipHorizontal2,
  Layers,
  Lock,
  TriangleAlert,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./RhsCongruenceTargetLesson10070.css";

type RhsModel = { hypotenuse: number; leg: number };
const START: RhsModel = { hypotenuse: 10, leg: 6 };
const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));
const otherLeg = (model: RhsModel) =>
  Math.sqrt(Math.max(0, model.hypotenuse ** 2 - model.leg ** 2));

export default function RhsCongruenceTargetLesson10070({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [model, setModel] = useState<RhsModel>(START);
  const [parts, setParts] = useState([true, true, false]);
  const [view, setView] = useState<"normal" | "mirror" | "overlay">("normal");
  const [expanded, setExpanded] = useState(false);
  const [tab, setTab] = useState(0);
  const [challenge, setChallenge] = useState([
    "∠Y",
    "∠Q",
    "XZ = PR",
    "XY = PQ",
  ]);
  const [checked, setChecked] = useState(false);
  const [actions, setActions] = useState(0);
  const other = otherLeg(model);
  const valid = model.hypotenuse > model.leg && other > 0;
  const rhsSatisfied = valid && parts[0] && (parts[1] || parts[2]);
  const challengeCorrect =
    checked && challenge.join("|") === "∠Y|∠Q|XZ = PR|XY = PQ";
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
  };
  const setLeg = (leg: number) =>
    act(() => setModel({ ...model, leg: clamp(leg, 2, model.hypotenuse - 1) }));
  const setHypotenuse = (hypotenuse: number) =>
    act(() =>
      setModel({
        ...model,
        hypotenuse: clamp(hypotenuse, model.leg + 1, 16),
      }),
    );
  const setOther = (next: number) =>
    act(() =>
      setModel({
        ...model,
        hypotenuse: Math.sqrt(model.leg ** 2 + clamp(next, 2, 14) ** 2),
      }),
    );
  return (
    <section
      className={`rhs10070-page ${expanded ? "expanded" : ""}`}
      data-testid="school-mockup-0744"
      data-object-model="dedicated-rhs-pythagorean-locked-right-triangle-engine"
      data-model={`${model.hypotenuse.toFixed(2)},${model.leg.toFixed(2)},${other.toFixed(2)}`}
      data-parts={parts.map(Number).join(",")}
      data-view={view}
      data-valid={String(valid)}
      data-satisfied={String(rhsSatisfied)}
      data-expanded={String(expanded)}
      data-challenge={String(challengeCorrect)}
      data-actions={actions}
    >
      <header className="rhs10070-hero">
        <small>CLASS 9 · TRIANGLE PROOFS</small>
        <h1>RHS Congruence</h1>
        <p>
          Prove right triangles congruent using hypotenuse and one corresponding
          side.
        </p>
        <div>
          <span>Theorem</span>
          <span>◎ Right Triangles</span>
          <span>◷ 30 min</span>
          <span>▥ Rigorous</span>
          <span>▣ NCERT: 7.2</span>
        </div>
      </header>
      <nav className="rhs10070-tabs">
        {["INTERACT", "LEARN", "EXAMPLE", "FORMULA", "PRACTICE"].map(
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
        <section className="rhs10070-lab">
          <header>
            <div>
              <h2>♙ INTERACTIVE CONGRUENCE LAB</h2>
              <p>
                Adjust sides below. Right angles are locked. Use Mirror or
                Overlay to verify congruence.
              </p>
            </div>
            <nav>
              <button
                className={view === "mirror" ? "active" : ""}
                onClick={() => act(() => setView("mirror"))}
              >
                <FlipHorizontal2 /> Mirror
              </button>
              <button
                className={view === "overlay" ? "active" : ""}
                onClick={() => act(() => setView("overlay"))}
              >
                <Layers /> Overlay
              </button>
              <button
                aria-label="Toggle fullscreen lesson"
                onClick={() => act(() => setExpanded((value) => !value))}
              >
                <Expand />
              </button>
            </nav>
          </header>
          <div className={`rhs10070-diagrams ${view}`}>
            <RightTriangle
              title="Triangle 1"
              letters="ABC"
              model={model}
              color="blue"
              onLeg={setLeg}
            />
            <button
              aria-label="Swap triangles"
              onClick={() =>
                act(() =>
                  setView((value) =>
                    value === "mirror" ? "normal" : "mirror",
                  ),
                )
              }
            >
              ⇄
            </button>
            <RightTriangle
              title="Triangle 2"
              letters="DEF"
              model={model}
              color="purple"
              mirrored={view === "mirror"}
              onLeg={setLeg}
            />
          </div>
          <div className="rhs10070-controls">
            <section>
              <h3>Select equal parts</h3>
              {[
                "Hypotenuse (AC = DF)",
                "One corresponding leg (AB = DE)",
                "Other leg (BC = EF)",
              ].map((label, index) => (
                <label key={label}>
                  <input
                    type="checkbox"
                    checked={parts[index]}
                    onChange={(e) =>
                      act(() => {
                        const next = [...parts];
                        next[index] = e.target.checked;
                        setParts(next);
                      })
                    }
                  />
                  {label}
                  <i className={["purple", "blue", "gray"][index]} />
                </label>
              ))}
            </section>
            <section>
              <h3>Adjust sides</h3>
              <Stepper
                label="Hypotenuse"
                value={model.hypotenuse}
                onDown={() => setHypotenuse(model.hypotenuse - 1)}
                onUp={() => setHypotenuse(model.hypotenuse + 1)}
              />
              <Stepper
                label="Leg (adjacent)"
                value={model.leg}
                onDown={() => setLeg(model.leg - 1)}
                onUp={() => setLeg(model.leg + 1)}
              />
              <Stepper
                label="Other leg"
                value={other}
                onDown={() => setOther(other - 1)}
                onUp={() => setOther(other + 1)}
              />
            </section>
            <section>
              <h3>Right angles (locked)</h3>
              <p>
                <input type="checkbox" checked readOnly /> ∠B = 90° <Lock />
              </p>
              <p>
                <input type="checkbox" checked readOnly /> ∠E = 90° <Lock />
              </p>
            </section>
          </div>
          <footer className={rhsSatisfied ? "pass" : "fail"}>
            <Check />
            <span>
              <b>
                {rhsSatisfied
                  ? "RHS conditions satisfied!"
                  : "Select the RHS conditions."}
              </b>
              <i>
                AC = DF = {model.hypotenuse.toFixed(0)} and AB = DE ={" "}
                {model.leg.toFixed(0)} with ∠B = ∠E = 90°
              </i>
            </span>
            <strong>
              Therefore, △ABC {rhsSatisfied ? "≅" : "?"} △DEF
              <br />
              by RHS Congruence.
            </strong>
          </footer>
        </section>
        <section className="rhs10070-theory">
          <article>
            <h2>WHY RHS WORKS</h2>
            <p>
              In right triangles, the hypotenuse is always the longest side.
            </p>
            <p>
              If the hypotenuse and one corresponding side are equal, then by
              Pythagoras Theorem, the third sides are also equal.
            </p>
            <strong>
              Pythagoras link
              <br />
              <i>
                If AC = DF and AB = DE and ∠B = ∠E = 90°, then BC = √(AC² − AB²)
                = √(DF² − DE²) = EF
              </i>
              <br />
              Thus, △ABC ≅ △DEF (SSS).
            </strong>
          </article>
          <article>
            <h2>WORKED EXAMPLE</h2>
            <div>
              <table>
                <tbody>
                  <tr>
                    <th>Given</th>
                    <td>Right triangles △PQR and △MNO</td>
                  </tr>
                  <tr>
                    <th>Right angles</th>
                    <td>∠Q = ∠N = 90°</td>
                  </tr>
                  <tr>
                    <th>Hypotenuse</th>
                    <td>PR = MO = 10</td>
                  </tr>
                  <tr>
                    <th>One leg</th>
                    <td>PQ = MN = 6</td>
                  </tr>
                </tbody>
              </table>
              <MiniRight />
              <MiniRight />
            </div>
            <ol>
              <li>∠Q = ∠N = 90°</li>
              <li>PR = MO = 10</li>
              <li>PQ = MN = 6</li>
            </ol>
            <p>By RHS Congruence, △PQR ≅ △MNO.</p>
          </article>
          <article className="warning">
            <h2>
              <TriangleAlert /> WATCH OUT!
            </h2>
            <b>RHS applies ONLY to right triangles.</b>
            <h3>Not applicable when:</h3>
            <p>× Triangles are not right-angled.</p>
            <p>× Right angles are not known.</p>
            <p>× SSA (side-side-angle) is given.</p>
            <p>× AAA or only sides without right angle.</p>
            <strong>Always verify both right angles are 90° □.</strong>
          </article>
          <article className="challenge">
            <h2>YOUR TURN: CHALLENGE</h2>
            <p>Identify the marked parts, then check RHS congruence.</p>
            <div className="rhs10070-challenge-diagrams">
              <ChallengeTriangle letters="XYZ" />
              <ChallengeTriangle letters="PQR" />
            </div>
            <div className="rhs10070-selects">
              {[
                ["Right angle (left)", ["∠Y", "∠X", "∠Z"]],
                ["Right angle (right)", ["∠Q", "∠P", "∠R"]],
                ["Hypotenuse", ["XZ = PR", "XY = PQ", "YZ = QR"]],
                ["Matching leg", ["XY = PQ", "YZ = QR", "XZ = PR"]],
              ].map(([label, options], index) => (
                <label key={String(label)}>
                  {String(label)}
                  <select
                    value={challenge[index]}
                    onChange={(e) =>
                      act(() => {
                        const next = [...challenge];
                        next[index] = e.target.value;
                        setChallenge(next);
                      })
                    }
                  >
                    {(options as string[]).map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
            <footer>
              <button onClick={() => act(() => setChecked(true))}>
                Check RHS
              </button>
              <span className={challengeCorrect ? "correct" : ""}>
                {checked
                  ? challengeCorrect
                    ? "Correct: △XYZ ≅ △PQR by RHS."
                    : "Review the marked right angles and sides."
                  : "Result will appear here."}
              </span>
            </footer>
          </article>
        </section>
      </main>
      <nav className="rhs10070-adjacent">
        <Link to="/lessons/school/class-9/class-9-pythagoras-theorem">
          <ArrowLeft /> Previous: Pythagoras Theorem
        </Link>
        <Link to="/lessons/school/class-9/class-9-triangle-proofs-aas-congruence">
          Next: AAS Congruence <ArrowRight />
        </Link>
      </nav>
    </section>
  );
}

function RightTriangle({
  title,
  letters,
  model,
  color,
  mirrored = false,
  onLeg,
}: {
  title: string;
  letters: string;
  model: RhsModel;
  color: string;
  mirrored?: boolean;
  onLeg: (n: number) => void;
}) {
  const other = otherLeg(model),
    scale = 26,
    base = other * scale,
    height = model.leg * scale,
    [a, b, c] = letters.split("");
  return (
    <article
      className={`rhs10070-triangle ${color} ${mirrored ? "mirrored" : ""}`}
    >
      <b>{title}</b>
      <svg
        viewBox="0 0 330 280"
        aria-label={`Interactive RHS triangle ${letters}`}
      >
        <path d={`M45 235V${235 - height}L${45 + base} 235Z`} />
        <path className="right" d="M45 235V214H66V235" />
        <circle
          className="handle"
          cx="45"
          cy={235 - height}
          r="6"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp") onLeg(model.leg + 1);
            if (e.key === "ArrowDown") onLeg(model.leg - 1);
          }}
          onPointerMove={(e) => {
            if (e.buttons === 1) {
              const rect =
                e.currentTarget.ownerSVGElement?.getBoundingClientRect();
              if (rect)
                onLeg(
                  Math.round(
                    clamp(
                      (rect.bottom - e.clientY) / 26,
                      2,
                      model.hypotenuse - 1,
                    ),
                  ),
                );
            }
          }}
        />
        <circle cx="45" cy="235" r="5" />
        <circle cx={45 + base} cy="235" r="5" />
        <text x="38" y={225 - height}>
          {a}
        </text>
        <text x="25" y="252">
          {b}
        </text>
        <text x={52 + base} y="252">
          {c}
        </text>
        <text className="leg" x="18" y={235 - height / 2}>
          {model.leg.toFixed(0)}
        </text>
        <text className="other" x={45 + base / 2} y="258">
          {other.toFixed(0)}
        </text>
        <text className="hyp" x={55 + base / 2} y={225 - height / 2}>
          {model.hypotenuse.toFixed(0)}
        </text>
      </svg>
    </article>
  );
}
function Stepper({
  label,
  value,
  onDown,
  onUp,
}: {
  label: string;
  value: number;
  onDown: () => void;
  onUp: () => void;
}) {
  return (
    <label>
      <span>{label}</span>
      <output>{value.toFixed(0)}</output>
      <button aria-label={`Decrease ${label}`} onClick={onDown}>
        −
      </button>
      <button aria-label={`Increase ${label}`} onClick={onUp}>
        +
      </button>
    </label>
  );
}
function MiniRight() {
  return (
    <svg className="rhs10070-mini" viewBox="0 0 110 105">
      <path d="M10 90V15L100 90Z" />
      <path className="right" d="M10 90V76H24V90" />
      <text x="2" y="55">
        6
      </text>
      <text x="48" y="102">
        8
      </text>
      <text x="55" y="48">
        10
      </text>
    </svg>
  );
}
function ChallengeTriangle({ letters }: { letters: string }) {
  const [a, b, c] = letters.split("");
  return (
    <svg viewBox="0 0 240 150" aria-label={`RHS challenge triangle ${letters}`}>
      <path d="M20 130V20L220 130Z" />
      <path className="right" d="M20 130V112H38V130" />
      <text x="12" y="15">
        {a}
      </text>
      <text x="5" y="145">
        {b}
      </text>
      <text x="222" y="145">
        {c}
      </text>
      <text x="2" y="80">
        7
      </text>
      <text x="108" y="146">
        24
      </text>
      <text x="122" y="75">
        25
      </text>
    </svg>
  );
}
