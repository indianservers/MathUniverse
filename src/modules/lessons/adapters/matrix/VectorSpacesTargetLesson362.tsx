import { CheckCircle2, Info, RotateCcw, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./VectorSpacesTargetLesson362.css";
type Vector = [number, number, number];
type Candidate = "plane" | "shifted" | "line" | "curved";
const defaults = {
    u: [1, 2, 0] as Vector,
    v: [-1, 1, 0] as Vector,
    a: 2,
    b: -1,
  },
  clean = (n: number) => Number(n.toFixed(2)),
  candidates: { id: Candidate; title: string; formula: string }[] = [
    { id: "plane", title: "Plane through origin", formula: "z = 0" },
    { id: "shifted", title: "Shifted plane", formula: "z = 1" },
    { id: "line", title: "Line through origin", formula: "Span{(1,1,1)}" },
    { id: "curved", title: "Curved surface", formula: "z = x² - y²" },
  ];
const member = (id: Candidate, [x, y, z]: Vector) =>
  id === "plane"
    ? Math.abs(z) < 0.001
    : id === "shifted"
      ? Math.abs(z - 1) < 0.001
      : id === "line"
        ? Math.abs(x - y) < 0.001 && Math.abs(y - z) < 0.001
        : Math.abs(z - (x * x - y * y)) < 0.001;
const checks = (id: Candidate) => ({
  zero: member(id, [0, 0, 0]),
  addition: id === "plane" || id === "line",
  scalar: id === "plane" || id === "line",
});
export default function VectorSpacesTargetLesson362({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [candidate, setCandidate] = useState<Candidate>("plane"),
    [u, setU] = useState<Vector>(defaults.u),
    [v, setV] = useState<Vector>(defaults.v),
    [a, setA] = useState(defaults.a),
    [b, setB] = useState(defaults.b),
    [tab, setTab] = useState("Interactive Lab"),
    [challenge, setChallenge] = useState<"" | "correct" | "incorrect">(""),
    [actions, setActions] = useState(0),
    closure = checks(candidate),
    isSubspace = closure.zero && closure.addition && closure.scalar,
    combination: Vector = [
      clean(a * u[0] + b * v[0]),
      clean(a * u[1] + b * v[1]),
      clean(a * u[2] + b * v[2]),
    ],
    combinationInside = member(candidate, combination),
    uInside = member(candidate, u),
    vInside = member(candidate, v);
  const act = (fn: () => void) => {
      fn();
      setActions((x) => x + 1);
      onInteraction();
    },
    reset = () => {
      setCandidate("plane");
      setU(defaults.u);
      setV(defaults.v);
      setA(defaults.a);
      setB(defaults.b);
      setTab("Interactive Lab");
      setChallenge("");
      setActions(0);
    },
    select = (id: Candidate) =>
      act(() => {
        setCandidate(id);
        setChallenge("");
      }),
    update = (which: "u" | "v", i: number, value: string) =>
      act(() => {
        (which === "u" ? setU : setV)(
          (x) => x.map((n, j) => (j === i ? Number(value) : n)) as Vector,
        );
        setChallenge("");
      });
  useEffect(reset, [resetToken]);
  const project = ([x, y, z]: Vector) =>
    `${315 + (x - y) * 54},${230 + (x + y) * 25 - z * 65}`;
  return (
    <section
      className="vs362-page"
      data-testid="matrix-mockup-0547"
      data-object-model="candidate-set-membership-rule-zero-addition-scalar-closure-editable-linear-combination-three-dimensional-projection-subspace-verdict"
      data-candidate={candidate}
      data-u={JSON.stringify(u)}
      data-v={JSON.stringify(v)}
      data-combination={JSON.stringify(combination)}
      data-u-inside={uInside}
      data-v-inside={vInside}
      data-combination-inside={combinationInside}
      data-zero={closure.zero}
      data-addition={closure.addition}
      data-scalar={closure.scalar}
      data-subspace={isSubspace}
      data-tab={tab}
      data-challenge={challenge}
      data-actions={actions}
    >
      <header className="vs362-hero">
        <b>ADVANCED MATHEMATICS</b>
        <h1>Vector Spaces</h1>
        <p>Sets closed under linear combination</p>
        <code>au + bv ∈ V &nbsp; for all u,v ∈ V and a,b ∈ R</code>
      </header>
      <nav className="vs362-tabs">
        {[
          "Interactive Lab",
          "Axioms",
          "Worked Example",
          "Misconceptions",
          "Challenge",
        ].map((t) => (
          <button
            key={t}
            className={tab === t ? "active" : ""}
            onClick={() => act(() => setTab(t))}
          >
            {t}
          </button>
        ))}
      </nav>
      <section className="vs362-lab">
        <aside>
          <h3>
            <b>1</b>Choose a candidate set V
          </h3>
          {candidates.map((c) => (
            <button
              className={candidate === c.id ? "active" : ""}
              key={c.id}
              onClick={() => select(c.id)}
            >
              <i />
              <span>
                <strong>{c.title}</strong>
                <small>{c.formula}</small>
              </span>
            </button>
          ))}
          <p>
            <Info />
            About these sets
          </p>
        </aside>
        <div className="vs362-plot">
          <svg viewBox="0 0 630 500">
            <path
              d="M315 30V450M55 335L315 230 575 335M55 125L315 230 575 125"
              fill="none"
              stroke="#8d99a9"
              strokeDasharray="5 4"
            />
            {candidate === "plane" || candidate === "shifted" ? (
              <polygon
                points="65,235 315,115 565,235 315,355"
                fill={candidate === "plane" ? "#298eca66" : "#df6da155"}
                stroke="#5696bc"
              />
            ) : candidate === "line" ? (
              <line
                x1="120"
                y1="380"
                x2="500"
                y2="80"
                stroke="#3aac50"
                strokeWidth="4"
              />
            ) : (
              <path
                d="M90 300 Q180 90 315 260 Q450 430 555 190"
                fill="#9466dc35"
                stroke="#8252d4"
                strokeWidth="3"
              />
            )}
            {[
              [u, "u", "#07b8d4"],
              [v, "v", "#8438e9"],
              [combination, "au + bv", "#f0a000"],
            ].map(([vector, name, color]) => (
              <g key={String(name)}>
                <line
                  x1="315"
                  y1="230"
                  x2={project(vector as Vector).split(",")[0]}
                  y2={project(vector as Vector).split(",")[1]}
                  stroke={String(color)}
                  strokeWidth="5"
                />
                <circle
                  cx={project(vector as Vector).split(",")[0]}
                  cy={project(vector as Vector).split(",")[1]}
                  r="6"
                  fill={String(color)}
                />
                <text
                  x={Number(project(vector as Vector).split(",")[0]) + 8}
                  y={Number(project(vector as Vector).split(",")[1]) - 7}
                >
                  {String(name)}
                </text>
              </g>
            ))}
          </svg>
          <button onClick={() => act(reset)}>
            <RotateCcw />
            Reset view
          </button>
        </div>
        <aside>
          <h3>
            <b>2</b>Choose vectors u,v ∈ V
          </h3>
          {[
            ["u", u],
            ["v", v],
          ].map(([name, vector]) => (
            <label key={String(name)}>
              <b>{String(name)} =</b>
              {(vector as Vector).map((n, i) => (
                <input
                  aria-label={`${name} coordinate ${i + 1}`}
                  key={i}
                  type="number"
                  value={n}
                  onChange={(e) => update(name as "u" | "v", i, e.target.value)}
                />
              ))}
            </label>
          ))}
          <section>
            <h3>
              <b>3</b>Choose scalars a,b ∈ R
            </h3>
            <label>
              a ={" "}
              <input
                aria-label="Scalar a"
                type="range"
                min="-4"
                max="4"
                step="1"
                value={a}
                onChange={(e) => act(() => setA(Number(e.target.value)))}
              />
              <output>{a}</output>
            </label>
            <label>
              b ={" "}
              <input
                aria-label="Scalar b"
                type="range"
                min="-4"
                max="4"
                step="1"
                value={b}
                onChange={(e) => act(() => setB(Number(e.target.value)))}
              />
              <output>{b}</output>
            </label>
          </section>
          <section>
            <h3>Linear combination</h3>
            <code>({combination.join(", ")})</code>
            <p className={combinationInside ? "correct" : "incorrect"}>
              {combinationInside ? "lies in V" : "does not lie in V"}
            </p>
          </section>
        </aside>
      </section>
      <section className="vs362-verdict">
        <article>
          <h2>Closure test</h2>
          <p>We check whether V satisfies the vector space axioms.</p>
          {[
            ["Zero vector", closure.zero],
            ["Closed under addition", closure.addition],
            ["Closed under scalar multiplication", closure.scalar],
          ].map(([name, ok]) => (
            <div key={String(name)}>
              {ok ? <CheckCircle2 /> : <XCircle />}
              <b>{String(name)}</b>
              <strong className={ok ? "correct" : "incorrect"}>
                {ok ? "Yes" : "No"}
              </strong>
            </div>
          ))}
        </article>
        <article>
          <h2>Verdict</h2>
          {isSubspace ? <CheckCircle2 /> : <XCircle />}
          <strong>
            {isSubspace ? "V is a subspace" : "V is not a subspace"}
          </strong>
          <p>
            {isSubspace
              ? "The set is closed under every linear combination."
              : "At least one vector-space axiom fails."}
          </p>
        </article>
      </section>
      <section className="vs362-notes">
        <article>
          <h3>Key idea</h3>
          <p>
            A set V is a vector space if for any u,v ∈ V and a,b ∈ R, au+bv ∈ V.
          </p>
        </article>
        <article>
          <h3>Axioms</h3>
          <ol>
            <li>0 ∈ V</li>
            <li>u+v ∈ V</li>
            <li>au ∈ V</li>
          </ol>
        </article>
        <article>
          <h3>Worked Example</h3>
          <p>
            W = &#123;(x,y,z):x+y+z=0&#125; is a plane through the origin and a
            subspace.
          </p>
        </article>
      </section>
      <section className="vs362-bottom">
        <article>
          <h3>Common misconception</h3>
          <strong>Not every plane is a subspace.</strong>
          <p>The plane z=1 does not contain the zero vector.</p>
        </article>
        <article>
          <h3>Challenge: Test this set</h3>
          <p>S = &#123;(x,y,z):x-2y+z=3&#125;. Is it a subspace?</p>
          <button
            onClick={() =>
              act(() => {
                setCandidate("shifted");
                setChallenge("correct");
              })
            }
          >
            Test this set
          </button>
          {challenge && (
            <output className="correct">
              Not a subspace: it does not pass through the origin.
            </output>
          )}
        </article>
      </section>
    </section>
  );
}
