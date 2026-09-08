import {
  BadgeHelp,
  BarChart3,
  BookOpenCheck,
  Braces,
  Calculator,
  Check,
  ChevronRight,
  CircleHelp,
  FlaskConical,
  FunctionSquare,
  Home,
  Lightbulb,
  LineChart,
  Moon,
  MoveRight,
  RotateCcw,
  Settings,
  Sparkles,
  SquareFunction,
  Target,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { useState, type CSSProperties, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { sampleFunction } from "../utils/mathEngine/graphSampler";
import AlgebraEnhancementWorkbench from "../studios/algebra/AlgebraEnhancementWorkbench";
import "./AlgebraStudio.css";

type AlgebraPage = "home" | "expressions" | "equations" | "functions" | "polynomials" | "systems" | "exponents" | "sequences" | "proof" | "cas" | "advanced";

type StudioNavItem = {
  id: AlgebraPage;
  label: string;
  route: string;
  icon: LucideIcon;
};

const studioNav: StudioNavItem[] = [
  { id: "home", label: "Studio Home", route: "/algebra", icon: Home },
  { id: "expressions", label: "Expressions", route: "/algebra/expressions", icon: FunctionSquare },
  { id: "equations", label: "Equations", route: "/algebra/equations", icon: MoveRight },
  { id: "functions", label: "Functions", route: "/algebra/functions", icon: LineChart },
  { id: "polynomials", label: "Polynomials", route: "/algebra/polynomials", icon: SquareFunction },
  { id: "systems", label: "Systems", route: "/algebra/systems", icon: Braces },
  { id: "exponents", label: "Exponents & Logs", route: "/algebra/exponents-logs", icon: Sparkles },
  { id: "sequences", label: "Sequences", route: "/algebra/sequences", icon: BarChart3 },
  { id: "proof", label: "Algebraic Proof", route: "/algebra/proof", icon: BookOpenCheck },
  { id: "cas", label: "CAS Explorer", route: "/algebra/cas", icon: Calculator },
  { id: "advanced", label: "Advanced Workbench", route: "/algebra/advanced", icon: FlaskConical },
];

const routePage: Record<string, AlgebraPage> = Object.fromEntries(studioNav.map((item) => [item.route, item.id])) as Record<string, AlgebraPage>;

export default function AlgebraStudio() {
  const location = useLocation();
  const page = routePage[location.pathname] ?? "home";
  return (
    <main className="alg-studio">
      <AlgebraSidebar page={page} />
      <section className="alg-stage">
        {page === "home" && <StudioHome />}
        {page === "expressions" && <ExpressionsLab />}
        {page === "equations" && <EquationsLab />}
        {page === "functions" && <FunctionsLab />}
        {page === "polynomials" && <PolynomialsLab />}
        {page === "systems" && <SystemsLab />}
        {page === "exponents" && <ExponentsLab />}
        {page === "sequences" && <SequencesLab />}
        {page === "proof" && <ProofLab />}
        {page === "cas" && <CasGateway />}
        {page === "advanced" && <AlgebraEnhancementWorkbench />}
      </section>
    </main>
  );
}

function AlgebraSidebar({ page }: { page: AlgebraPage }) {
  return (
    <aside className="alg-sidebar">
      <Link className="alg-brand" to="/algebra" aria-label="Algebra Studio home"><AlgebraMark /><span><b>ALGEBRA</b><b>STUDIO</b></span></Link>
      <Link className="alg-main-link" to="/"><Home /> <span>Main</span></Link>
      <nav aria-label="Algebra Studio navigation">
        {studioNav.map(({ id, label, route, icon: Icon }) => (
          <NavLink key={id} to={route} end={id === "home"} className={id === page ? "active" : ""}><Icon /><span>{label}</span></NavLink>
        ))}
      </nav>
    </aside>
  );
}

function AlgebraMark() {
  return <span className="alg-mark" aria-hidden="true"><i /><i /><i /></span>;
}

function StudioHeader({ title, subtitle, tabs, activeTab, onTab }: { title: string; subtitle: string; tabs?: string[]; activeTab?: string; onTab?: (tab: string) => void }) {
  return (
    <>
      <header className="alg-header">
        <div><h1>{title}</h1><p>{subtitle}</p></div>
        <div className="alg-header-actions"><button type="button" aria-label="Help"><CircleHelp /></button><button type="button" aria-label="Settings"><Settings /></button><button type="button" aria-label="Theme"><Moon /></button></div>
      </header>
      {tabs && <nav className="alg-top-tabs" aria-label={`${title} modes`}>{tabs.map((tab) => <button type="button" key={tab} className={tab === activeTab ? "active" : ""} onClick={() => onTab?.(tab)}>{tab}</button>)}</nav>}
    </>
  );
}

function StudioHome() {
  const topics = studioNav.slice(1);
  return (
    <div className="alg-page alg-home">
      <StudioHeader title="Welcome to Algebra Studio" subtitle="Explore, connect, and master algebra through interactive visual models." />
      <section className="alg-concept-map" aria-label="Algebra concept map">
        <div className="alg-map-group left">{topics.slice(0, 5).map((item) => <Link key={item.id} to={item.route}><item.icon />{item.label}</Link>)}</div>
        <div className="alg-map-core"><AlgebraMark /><b>ALGEBRA</b></div>
        <div className="alg-map-group right">{topics.slice(5).map((item) => <Link key={item.id} to={item.route}><item.icon />{item.label}</Link>)}</div>
      </section>
      <div className="alg-home-grid">
        <section className="alg-panel alg-launch"><PanelHeading title="Launch a topic" subtitle="Choose a topic to explore with interactive visual models." />
          <div className="alg-topic-grid">{topics.map((item, index) => <TopicCard key={item.id} item={item} index={index + 1} />)}</div>
        </section>
        <aside className="alg-home-aside">
          <Card title="Continue experiment" icon={<FlaskConical />}><MiniParabola /><b>Quadratic Functions</b><small>Last active: recently</small><Link className="alg-gradient-button" to="/algebra/functions">Continue</Link></Card>
          <Card title="Your learning journey" icon={<Target />}><div className="alg-progress"><strong>68%</strong></div><dl><div><dt>Topics explored</dt><dd>7 / 9</dd></div><div><dt>Skills mastered</dt><dd>42 / 68</dd></div><div><dt>Challenges solved</dt><dd>24 / 32</dd></div></dl></Card>
          <Card title="Visual challenge" icon={<BadgeHelp />}><p>Which expressions are equivalent to 2(x + 3) − (x − 1)?</p><div className="alg-answer-grid">{["x + 7", "2x + 5", "3x + 7", "x + 5", "2x + 6", "x + 6"].map((answer) => <button type="button" key={answer}>{answer}</button>)}</div><button className="alg-gradient-button" type="button">Check answer</button></Card>
        </aside>
      </div>
      <LearningStrip />
    </div>
  );
}

function TopicCard({ item, index }: { item: StudioNavItem; index: number }) {
  const Icon = item.icon;
  return <Link className="alg-topic-card" to={item.route}><span className="alg-topic-number">{index}</span><header><Icon /><b>{item.label}</b></header><MiniTopicVisual id={item.id} /><p>{topicDescription(item.id)}</p></Link>;
}

function MiniTopicVisual({ id }: { id: AlgebraPage }) {
  if (id === "expressions") return <div className="alg-mini-tiles"><i>x</i><i>x</i><i>+</i><i>3</i></div>;
  if (id === "equations") return <div className="alg-mini-balance"><span>2x + 3</span><b>⚖</b><span>7</span></div>;
  if (id === "functions" || id === "polynomials") return <MiniParabola />;
  if (id === "systems") return <div className="alg-mini-system"><i /><i /></div>;
  if (id === "exponents") return <div className="alg-mini-formula">y = 2ˣ | y = log₂x</div>;
  if (id === "sequences") return <div className="alg-mini-sequence">● | ●● | ●●● | …</div>;
  if (id === "proof") return <div className="alg-mini-proof"><span>Given</span><b>→</b><span>Show</span><b>→</b><span>Therefore</span></div>;
  return <div className="alg-mini-formula">expand((x + 2)³)</div>;
}

function ExpressionsLab() {
  const [x2, setX2] = useState(1), [x, setX] = useState(1), [units, setUnits] = useState(-2);
  const expression = `${x2 === 1 ? "x²" : `${x2}x²`} ${x >= 0 ? "+" : "−"} ${Math.abs(x)}x ${units >= 0 ? "+" : "−"} ${Math.abs(units)}`;
  return <div className="alg-page"><StudioHeader title="Expressions & Algebra Tiles Lab" subtitle="Build, transform, and factor algebraic expressions with interactive tiles and visual models." tabs={["Simplify", "Expand", "Factor", "Combine Terms"]} activeTab="Simplify" />
    <div className="alg-three-column expressions-layout">
      <div className="alg-stack"><Card title="1. Drag tiles to build your expression"><TilePicker onTile={(kind) => kind === "x2" ? setX2((v) => v + 1) : kind === "x" ? setX((v) => v + 1) : setUnits((v) => v + 1)} /><button type="button" className="alg-soft-button" onClick={() => { setX2(1); setX(1); setUnits(-2); }}><RotateCcw /> Reset tiles</button></Card><Card title="3. Grouping trays (factor by grouping)"><div className="alg-drop-trays"><div>Group A<small>Drop tiles here</small></div><div>Group B<small>Drop tiles here</small></div></div></Card><Card title="4. Factor rectangle (area model)"><AreaModel /></Card></div>
      <div className="alg-stack"><Card title="2. Expression builder"><div className="alg-built-tiles"><i>x²</i><i>{x}x</i><i>{units}</i><button type="button" onClick={() => setUnits((v) => v + 1)}>+</button></div><div className="alg-live-expression"><small>Live expression</small><strong>{expression}</strong></div></Card><Card title="5. Visual model"><AreaModel large /></Card></div>
      <div className="alg-stack"><Card title="6. Equivalent forms"><ValidationRows rows={[expression, "(x − 1)(x + 2)", "x(x − 1) + 2(x − 1)"]} /></Card><Card title="7. Step validation"><ValidationRows rows={["Combine like terms", "Rewrite the expression", "Factor into two binomials"]} /></Card><Card title="8. Explanation"><p>You built <b>{expression}</b>. The area model shows the expression as a sum of four parts and connects factoring with geometry.</p><div className="alg-success">Factored form: (x − 1)(x + 2) <Check /></div></Card></div>
    </div><LearningStrip /></div>;
}

function EquationsLab() {
  const [left, setLeft] = useState(3), [right, setRight] = useState(2), [constant, setConstant] = useState(6);
  const solution = right === left ? null : constant / (left - right);
  return <div className="alg-page"><StudioHeader title="Equations & Inequalities Lab" subtitle="Solve equations and inequalities using the balance model. Preserve equality and check solutions." tabs={["Linear", "Quadratic", "Absolute Value", "Inequalities"]} activeTab="Linear" />
    <div className="alg-three-column equation-layout">
      <div className="alg-stack"><Card title="Equation"><label className="alg-field">Equation<input value={`${left}x + ${constant} = ${right}x`} readOnly /></label><label className="alg-field">Goal<select><option>Solve for x</option></select></label></Card><Card title="Operations"><div className="alg-operation-grid">{[["+", "Add"], ["−", "Subtract"], ["×", "Multiply"], ["÷", "Divide"]].map(([symbol, label]) => <button type="button" key={label} onClick={() => setConstant((v) => label === "Add" ? v + 1 : label === "Subtract" ? v - 1 : v)}>{symbol} {label}</button>)}</div></Card></div>
      <div className="alg-stack"><Card title="Balance Model"><BalanceModel left={left} right={right} constant={constant} /><div className="alg-slider-row"><label>Left x<input type="range" min="1" max="5" value={left} onChange={(e) => setLeft(+e.target.value)} /></label><label>Right x<input type="range" min="0" max="4" value={right} onChange={(e) => setRight(+e.target.value)} /></label></div></Card><Card title="Solution on Number Line"><NumberLine value={solution ?? 0} /><div className="alg-result">x = {solution === null ? "all real values" : round(solution)}</div></Card></div>
      <div className="alg-stack"><Card title="Steps"><ValidationRows rows={["Start with the original equation", `Subtract ${right}x from both sides`, `Subtract ${constant} from both sides`]} /></Card><Card title="Solution & Validation"><div className="alg-formula-large">x = {solution === null ? "ℝ" : round(solution)}</div><div className="alg-success">Valid solution <Check /></div></Card><Card title="Why it works" icon={<Lightbulb />}><p>Applying the same operation to both sides preserves equality. Substitution checks the result in the original equation.</p></Card></div>
    </div><LearningStrip /></div>;
}

function FunctionsLab() {
  const [a, setA] = useState(1.5), [h, setH] = useState(2), [k, setK] = useState(-1);
  return <div className="alg-page"><StudioHeader title="Functions & Transformations Lab" subtitle="Explore families, transformations, composition, inverse, and piecewise functions." tabs={["Families", "Transformations", "Composition", "Inverse", "Piecewise"]} activeTab="Families" />
    <div className="alg-three-column graph-layout"><div className="alg-stack"><Card title="Mode"><label className="alg-field">Base function<select><option>f(x) = x²</option></select></label><Slider label="a (stretch)" min={-3} max={3} step={0.1} value={a} onChange={setA} /><Slider label="h (horizontal)" min={-6} max={6} step={0.5} value={h} onChange={setH} /><Slider label="k (vertical)" min={-6} max={6} step={0.5} value={k} onChange={setK} /></Card><Card title="Input → Output Machine"><div className="alg-machine"><span>x</span><ChevronRight /><span>x − {h}</span><ChevronRight /><span>( )²</span><ChevronRight /><span>× {a}</span><ChevronRight /><span>{k >= 0 ? "+" : ""}{k}</span></div></Card></div>
      <div className="alg-stack"><Card title={`f(x) = x² | g(x) = ${a}(x − ${h})² ${k >= 0 ? "+" : "−"} ${Math.abs(k)}`}><AlgebraGraph series={[{ expression: "x^2", color: "#08b7d7" }, { expression: `${a}*(x-${h})^2+${k}`, color: "#8b4cf6" }]} view={{ xMin: -6, xMax: 7, yMin: -3, yMax: 9 }} /></Card><Card title="Mapping view"><MappingTable fn={(x) => a * (x - h) ** 2 + k} /></Card></div>
      <div className="alg-stack"><Card title="Function"><div className="alg-formula cyan">f(x) = x²</div><div className="alg-formula violet">g(x) = {a}(x − {h})² {k >= 0 ? "+" : "−"} {Math.abs(k)}</div></Card><Card title="Domain & Range"><ValidationRows rows={["f: Domain (−∞, ∞), Range [0, ∞)", `g: Domain (−∞, ∞), Range [${k}, ∞)`]} /></Card><Card title="Transformation sequence"><ol className="alg-steps"><li>Shift right {h} units</li><li>Vertical stretch by a = {a}</li><li>Shift {k < 0 ? "down" : "up"} {Math.abs(k)} unit</li></ol><div className="alg-success">All set! <Check /></div></Card></div></div><LearningStrip /></div>;
}

function PolynomialsLab() {
  const [r1, setR1] = useState(-3), [r2, setR2] = useState(-1), [r3, setR3] = useState(2), [r4, setR4] = useState(4), [scale, setScale] = useState(0.08);
  const expression = `${scale}*(x-${r1})*(x-${r2})^2*(x-${r3})*(x-${r4})`;
  return <div className="alg-page"><StudioHeader title="Polynomials Lab" subtitle="Explore polynomial functions through roots, factors, division, and end behavior." tabs={["Roots", "Factors", "Division", "End Behavior", "Multiplicity"]} activeTab="Roots" />
    <div className="alg-three-column graph-layout"><div className="alg-stack"><Card title="Polynomial Builder"><div className="alg-segmented">{[1,2,3,4,5].map((n) => <button type="button" className={n === 4 ? "active" : ""} key={n}>{n}</button>)}</div></Card><Card title="Root Controls"><Slider label={`r₁ = ${r1}`} min={-5} max={5} step={1} value={r1} onChange={setR1} /><Slider label={`r₂ = ${r2} (double)`} min={-5} max={5} step={1} value={r2} onChange={setR2} /><Slider label={`r₃ = ${r3}`} min={-5} max={5} step={1} value={r3} onChange={setR3} /><Slider label={`r₄ = ${r4}`} min={-5} max={5} step={1} value={r4} onChange={setR4} /></Card><Card title="Leading coefficient"><Slider label={`a = ${scale}`} min={0.02} max={0.2} step={0.01} value={scale} onChange={setScale} /></Card></div>
      <div className="alg-stack"><Card title="Interactive polynomial graph"><AlgebraGraph series={[{ expression, color: "#08b7d7" }]} view={{ xMin: -6, xMax: 6, yMin: -7, yMax: 7 }} roots={[r1,r2,r3,r4]} /><div className="alg-formula-large">f(x) = a(x − r₁)(x − r₂)²(x − r₃)(x − r₄)</div></Card></div>
      <div className="alg-stack"><Card title="Live Root & Factor Table"><table className="alg-table"><thead><tr><th>Root</th><th>Multiplicity</th><th>Behavior</th><th>Factor</th></tr></thead><tbody>{[[r1,1],[r2,2],[r3,1],[r4,1]].map(([root,m]) => <tr key={`${root}-${m}`}><td>{root}</td><td>{m}</td><td>{m === 2 ? "Touches" : "Crosses"}</td><td>(x {root < 0 ? "+" : "−"} {Math.abs(root)}){m === 2 ? "²" : ""}</td></tr>)}</tbody></table><div className="alg-success">All roots valid <Check /></div></Card><Card title="Synthetic Division"><div className="alg-synthetic">−1 | 1 −2 −13 14 24<hr />| 1 −3 −10 24 0</div></Card><Card title="End Behavior"><p>Even degree with a positive leading coefficient.</p><b>Both ends rise.</b></Card></div></div><LearningStrip /></div>;
}

function SystemsLab() {
  const [m1, setM1] = useState(2), [b1, setB1] = useState(1), [m2, setM2] = useState(-1), [b2, setB2] = useState(4);
  const x = (b2 - b1) / (m1 - m2), y = m1 * x + b1;
  return <div className="alg-page"><StudioHeader title="Systems of Equations Lab" subtitle="Solve and explore linear systems using multiple methods and visual models." tabs={["Graphing", "Substitution", "Elimination", "Matrices", "Inequalities"]} activeTab="Graphing" />
    <div className="alg-three-column graph-layout"><div className="alg-stack"><Card title="Equations"><div className="alg-formula cyan">Eq. 1 | y = {m1}x + {b1}</div><Slider label="m (slope)" min={-5} max={5} step={0.5} value={m1} onChange={setM1} /><Slider label="b (y-intercept)" min={-5} max={5} step={0.5} value={b1} onChange={setB1} /><div className="alg-formula violet">Eq. 2 | y = {m2}x + {b2}</div><Slider label="m (slope)" min={-5} max={5} step={0.5} value={m2} onChange={setM2} /><Slider label="b (y-intercept)" min={-5} max={5} step={0.5} value={b2} onChange={setB2} /></Card></div>
      <div className="alg-stack"><Card title="Graphing view"><AlgebraGraph series={[{ expression: `${m1}*x+${b1}`, color: "#087df2" }, { expression: `${m2}*x+${b2}`, color: "#8546f6" }]} view={{ xMin: -5, xMax: 6, yMin: -4, yMax: 7 }} roots={[]} intersection={{x,y}} /></Card></div>
      <div className="alg-stack"><Card title="Solution"><div className="alg-success">Unique solution</div><div className="alg-formula-large">(x, y) = ({round(x)}, {round(y)})</div></Card><Card title="Elimination method"><div className="alg-equation-steps">{m1}x − y = {round(-b1)}<br />{m2}x − y = {round(-b2)}<hr />Intersection gives x = {round(x)}</div></Card><Card title="Solution classification"><div className="alg-classification"><button className="active">Unique</button><button>None</button><button>Infinite</button></div></Card></div></div><LearningStrip /></div>;
}

function ExponentsLab() {
  const [base, setBase] = useState(2), [point, setPoint] = useState(2);
  const output = base ** point;
  return <div className="alg-page"><StudioHeader title="Exponents Radicals & Logarithms Lab" subtitle="Explore exponent laws, radicals, exponential and logarithmic functions, and their inverse relationship." tabs={["Exponent Laws", "Radicals", "Exponential & Logs", "Equations"]} activeTab="Exponential & Logs" />
    <div className="alg-four-column"><div className="alg-stack"><Card title="Function & Base Controls"><Slider label={`Base (a) = ${base}`} min={0.5} max={5} step={0.5} value={base} onChange={setBase} /><Slider label={`Point on f(x): x = ${point}`} min={-2} max={4} step={0.5} value={point} onChange={setPoint} /><div className="alg-formula">({point}, {round(output)}) ↔ ({round(output)}, {point})</div></Card><Card title="Function Toggles"><ValidationRows rows={["y = aˣ", "y = logₐ(x)", "Reflection y = x"]} /></Card></div>
      <div className="alg-stack alg-wide"><Card title="Exponential & Logarithmic Functions"><AlgebraGraph series={[{ expression: `${base}^x`, color: "#087df2" }, { expression: `log(x)/log(${base})`, color: "#8546f6" }, { expression: "x", color: "#ef9900", dashed: true }]} view={{ xMin: -4, xMax: 8, yMin: -4, yMax: 8 }} /></Card></div>
      <div className="alg-stack"><Card title="Live Algebra & Validation"><div className="alg-formula cyan">f({point}) = {round(output)}</div><div className="alg-formula violet">g({round(output)}) = {point}</div><div className="alg-success">Inverse pair <Check /></div></Card><Card title="Law Tiles"><div className="alg-law-grid">{["aᵐ·aⁿ = aᵐ⁺ⁿ", "aᵐ/aⁿ = aᵐ⁻ⁿ", "(aᵐ)ⁿ = aᵐⁿ", "a⁻ⁿ = 1/aⁿ", "a⁰ = 1", "(ab)ⁿ = aⁿbⁿ"].map((law) => <button type="button" key={law}>{law}</button>)}</div></Card></div>
      <div className="alg-stack"><Card title="Radical Simplifier"><div className="alg-formula-large">√72x⁵</div><div className="alg-flow">√36 · 2 · x⁴ · x <ChevronRight /> 6x²√2x</div><div className="alg-success">Simplified <Check /></div></Card><Card title="Equation Solver"><div className="alg-equation-steps">2ˣ = 64<br />2ˣ = 2⁶<br /><b>x = 6</b></div><div className="alg-success">Solution is valid <Check /></div></Card></div></div><LearningStrip /></div>;
}

function SequencesLab() {
  const [first, setFirst] = useState(3), [difference, setDifference] = useState(4), [count, setCount] = useState(10);
  const terms = Array.from({ length: count }, (_, i) => first + i * difference), sum = terms.reduce((a,b) => a+b,0);
  return <div className="alg-page"><StudioHeader title="Sequences & Progressions Lab" subtitle="Explore patterns, formulas, and sums across different types of sequences." tabs={["Arithmetic", "Geometric", "Recursive", "Sigma", "Patterns"]} activeTab="Arithmetic" />
    <div className="alg-three-column sequence-layout"><div className="alg-stack"><Card title="Sequence Controls"><Slider label={`First term a₁ = ${first}`} min={-10} max={20} step={1} value={first} onChange={setFirst} /><Slider label={`Common difference d = ${difference}`} min={-10} max={10} step={1} value={difference} onChange={setDifference} /><Slider label={`Number of terms n = ${count}`} min={3} max={12} step={1} value={count} onChange={setCount} /></Card><Card title="Partial Sum Visualization"><div className="alg-formula-large">Sₙ = n/2[2a₁ + (n−1)d]</div><strong className="alg-big-result">S{count} = {sum}</strong><DotPattern count={Math.min(count, 8)} /></Card></div>
      <div className="alg-stack"><Card title="Pattern Builder (Growing by term)"><DotPattern count={Math.min(count, 6)} /><p className="alg-center">Each term increases by adding <b>{difference}</b>.</p></Card><Card title="Sequence Plot"><SequenceGraph values={terms} /></Card><Card title="Term Table"><div className="alg-term-table">{terms.map((term, i) => <span key={i}><small>{i+1}</small><b>{term}</b><em>{i ? `${difference >= 0 ? "+" : ""}${difference}` : "a₁"}</em></span>)}</div></Card></div>
      <div className="alg-stack"><Card title="Sequence Formulas"><div className="alg-formula">aₙ = {first} + (n−1)·{difference}</div><div className="alg-formula-large">aₙ = {difference}n {first-difference >= 0 ? "+" : "−"} {Math.abs(first-difference)}</div><div className="alg-success">Sₙ = {sum} for n = {count}</div></Card><Card title="Live Validation"><ValidationRows rows={[`Next term: ${first+count*difference}`, `Sum: ${sum}`, `Common difference: ${difference}`, "Arithmetic sequence: VALID"]} /></Card><Card title="Prediction Challenge"><p>What is the 20th term?</p><input placeholder="Enter number…" /><button className="alg-gradient-button" type="button">Check</button></Card></div></div><LearningStrip /></div>;
}

function ProofLab() {
  const [complete, setComplete] = useState(false);
  const steps = ["(a + b)²", "(a + b)(a + b)", "a(a + b) + b(a + b)", "a² + ab + ab + b²", "a² + 2ab + b²"];
  return <div className="alg-page"><StudioHeader title="Algebraic Proof Lab" subtitle="Build and validate algebraic proofs with interactive visual models." tabs={["Identities", "Equation Proof", "Induction", "Inequality", "Counterexample"]} activeTab="Identities" />
    <div className="alg-goal"><span>Goal</span> Prove the identity <b>(a + b)² = a² + 2ab + b²</b><div>Proof progress <progress value={complete ? 5 : 4} max="5" /> {complete ? "5 / 5" : "4 / 5"}</div></div>
    <div className="alg-three-column proof-layout"><div className="alg-stack alg-wide"><Card title="Two-Column Proof Builder"><table className="alg-proof-table"><thead><tr><th>Statements</th><th>Reasons</th></tr></thead><tbody>{steps.map((step,i) => <tr key={step}><td><span>{i+1}</span>{step}</td><td>{["Given", "Definition of square", "Distributive property", "Distributive property", complete ? "Combine like terms" : "Choose a reason"][i]} {i > 0 && (i < 4 || complete) && <Check />}</td></tr>)}</tbody></table><button className="alg-gradient-button" type="button" onClick={() => setComplete(true)}>{complete ? "Proof complete" : "Validate final reason"}</button></Card><div className="alg-proof-tools"><Card title="Add Step"><select><option>Expand using distributive property</option></select><input placeholder="Enter your statement" /><button className="alg-gradient-button" type="button">Add to proof</button></Card><Card title="Symbol Palette"><div className="alg-symbols">{["a","b","ab","a²","b²","( )","+","−","=","∴","√"].map((s) => <button type="button" key={s}>{s}</button>)}</div></Card></div></div>
      <div className="alg-stack"><Card title="Visual Model: Area Model"><ProofAreaModel /><div className="alg-formula-large">a² + ab + ab + b² = a² + 2ab + b²</div></Card></div>
      <div className="alg-stack"><Card title="Assumptions"><p>a, b ∈ ℝ</p><small>All expressions are defined.</small></Card><Card title="Equivalence Check"><div className="alg-success">LHS = RHS <Check /></div><div className="alg-formula-large">(a + b)² ≡ a² + 2ab + b²</div></Card><Card title="Step Validation"><ValidationRows rows={steps.map((_,i) => `${i+1}. ${i < 4 || complete ? "Valid" : "Check reason"}`)} /></Card></div></div><LearningStrip /></div>;
}

function CasGateway() {
  return <div className="alg-page"><StudioHeader title="CAS Step Explorer" subtitle="Computer Algebra System — step-by-step transformations and verification." tabs={["Solve", "Simplify", "Factor", "Expand", "Substitute"]} activeTab="Solve" />
    <div className="alg-cas-notice"><Calculator /><div><b>Connected to the existing CAS workspace</b><p>The Algebra Studio keeps CAS computation in the established workspace so projects, history, and symbolic results remain in one place.</p></div><Link className="alg-gradient-button" to="/workspace/data/cas">Open CAS Workspace <ChevronRight /></Link></div>
    <div className="alg-three-column cas-layout"><div className="alg-stack"><Card title="1. Expression"><div className="alg-formula-large">2x² − 8x − 10 = 0</div></Card><Card title="2. Method"><div className="alg-segmented"><button className="active">Solve</button><button>Factor</button><button>Expand</button></div><Link className="alg-gradient-button" to="/workspace/data/cas">Compute Steps in CAS</Link></Card><Card title="3. Alternate Valid Methods"><ValidationRows rows={["Quadratic Formula", "Completing the Square", "Factoring", "Graphical"]} /></Card></div>
      <div className="alg-stack"><Card title="4. Step-by-Step Solution"><ol className="alg-cas-steps"><li><b>Standard form</b><span>2x² − 8x − 10 = 0</span></li><li><b>Identify coefficients</b><span>a = 2, b = −8, c = −10</span></li><li><b>Apply quadratic formula</b><span>x = (8 ± √144) / 4</span></li><li><b>Solutions</b><span>x = 5, x = −1</span></li></ol></Card></div>
      <div className="alg-stack"><Card title="5. Visual Model"><AlgebraGraph series={[{ expression: "2*x^2-8*x-10", color: "#08a9d1" }]} view={{ xMin: -6, xMax: 8, yMin: -20, yMax: 10 }} roots={[-1,5]} /></Card><Card title="6. Solution Verification"><div className="alg-success">Both solutions satisfy the original equation <Check /></div><div className="alg-verify-grid"><span>x = −1<br />2(−1)² − 8(−1) − 10 = 0</span><span>x = 5<br />2(5)² − 8(5) − 10 = 0</span></div></Card></div></div><LearningStrip /></div>;
}

function Card({ title, icon, children, className = "" }: { title: string; icon?: ReactNode; children: ReactNode; className?: string }) { return <section className={`alg-card ${className}`}><h2>{icon}{title}</h2>{children}</section>; }
function PanelHeading({ title, subtitle }: { title: string; subtitle: string }) { return <header className="alg-panel-heading"><h2>{title}</h2><p>{subtitle}</p></header>; }
function LearningStrip() { const items: Array<[LucideIcon,string,string]> = [[Target,"Observe","Look closely at patterns and relationships."],[Lightbulb,"Understand","Connect ideas and build meaning."],[CircleHelp,"Why","Ask questions and discover why."],[FlaskConical,"Try","Practice with interactive tools."],[Trophy,"Challenge","Solve problems and level up."]]; return <footer className="alg-learning-strip">{items.map(([Icon,title,text]) => <div key={title}><Icon /><span><b>{title}</b><small>{text}</small></span></div>)}</footer>; }
function topicDescription(id: AlgebraPage) { return ({ expressions:"Build and simplify algebraic expressions.", equations:"Solve and balance equations visually.", functions:"Explore functions and transformations.", polynomials:"Analyze polynomials and their roots.", systems:"Solve systems graphically.", exponents:"Work with exponential and logarithmic functions.", sequences:"Find patterns and general terms.", proof:"Construct and validate algebraic proofs.", cas:"Open the connected CAS workspace.", advanced:"Use 25 connected algebra analysis tools.", home:"" } as Record<AlgebraPage,string>)[id]; }
function MiniParabola() { return <svg className="alg-mini-parabola" viewBox="0 0 180 70"><path d="M10 12 Q55 105 90 42 Q125 -18 170 55" fill="none" stroke="url(#mini-grad)" strokeWidth="3"/><defs><linearGradient id="mini-grad"><stop stopColor="#08b9da"/><stop offset="1" stopColor="#8c42f5"/></linearGradient></defs><line x1="6" x2="174" y1="55" y2="55" stroke="#9aa7bd"/><line x1="90" x2="90" y1="5" y2="65" stroke="#9aa7bd"/></svg>; }
function TilePicker({ onTile }: { onTile: (kind: "x2" | "x" | "unit") => void }) { return <div className="alg-tile-picker"><button type="button" onClick={() => onTile("x2")}>x²</button><button type="button" onClick={() => onTile("x")}>+x</button><button type="button" onClick={() => onTile("x")}>−x</button><button type="button" onClick={() => onTile("unit")}>+1</button><button type="button" onClick={() => onTile("unit")}>−1</button></div>; }
function AreaModel({ large = false }: { large?: boolean }) { return <div className={`alg-area-model ${large ? "large" : ""}`}><span>x²</span><span>2x</span><span>−x</span><span>−2</span></div>; }
function ValidationRows({ rows }: { rows: string[] }) { return <div className="alg-validation-rows">{rows.map((row) => <div key={row}><span>{row}</span><Check /></div>)}</div>; }
function Slider({ label, min, max, step, value, onChange }: { label: string; min: number; max: number; step: number; value: number; onChange: (value: number) => void }) { return <label className="alg-slider"><span>{label}</span><div><input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} /><output>{round(value)}</output></div></label>; }
function BalanceModel({ left, right, constant }: { left: number; right: number; constant: number }) { return <div className="alg-balance"><div>{Array.from({length:left},(_,i)=><i key={i}>x</i>)}<i>+{constant}</i></div><span>⚖</span><div>{Array.from({length:right},(_,i)=><i key={i}>x</i>)}</div><b>Balanced ✓</b></div>; }
function NumberLine({ value }: { value: number }) { const left = Math.max(3, Math.min(97, ((value+10)/20)*100)); return <div className="alg-number-line"><i style={{ left: `${left}%` } as CSSProperties}/><span>−10</span><span>0</span><span>10</span></div>; }
function MappingTable({ fn }: { fn: (x: number) => number }) { return <div className="alg-mapping">{[-2,-1,0,1,2,3,4].map((x) => <span key={x}><small>{x}</small><MoveRight/><b>{round(fn(x))}</b></span>)}</div>; }
function DotPattern({ count }: { count: number }) { return <div className="alg-dot-pattern">{Array.from({length:count},(_,term) => <div key={term}><small>n = {term+1}</small><span>{Array.from({length:Math.min(30,term*3+1)},(_,i)=><i key={i}/>)}</span><b>a{term+1}</b></div>)}</div>; }
function SequenceGraph({ values }: { values: number[] }) { const max=Math.max(...values,1), W=700,H=210,P=30; const points=values.map((v,i)=>`${P+i/(Math.max(1,values.length-1))*(W-P*2)},${H-P-v/max*(H-P*2)}`).join(" "); return <svg className="alg-sequence-graph" viewBox={`0 0 ${W} ${H}`}><line x1={P} x2={W-P} y1={H-P} y2={H-P}/><line x1={P} x2={P} y1={P} y2={H-P}/><polyline points={points}/>{values.map((v,i) => { const x=P+i/(Math.max(1,values.length-1))*(W-P*2), y=H-P-v/max*(H-P*2); return <g key={i}><circle cx={x} cy={y} r="6"/><text x={x} y={y-12} textAnchor="middle">{v}</text></g>; })}</svg>; }
function ProofAreaModel() { return <div className="alg-proof-area"><span>a²</span><span>ab</span><span>ab</span><span>b²</span></div>; }

function AlgebraGraph({ series, view, roots = [], intersection }: { series: Array<{ expression: string; color: string; dashed?: boolean }>; view: {xMin:number;xMax:number;yMin:number;yMax:number}; roots?: number[]; intersection?: {x:number;y:number} }) {
  const W=760,H=470,P=32, sx=(x:number)=>P+(x-view.xMin)/(view.xMax-view.xMin)*(W-P*2), sy=(y:number)=>H-P-(y-view.yMin)/(view.yMax-view.yMin)*(H-P*2);
  const plotted=series.map((s)=>({...s,points:sampleFunction(s.expression,view.xMin,view.xMax,500).points}));
  const graphPath=(points:ReturnType<typeof sampleFunction>["points"])=>{ let d="",drawing=false; for(const point of points){if(!point.valid||point.y===null||point.y<view.yMin-5||point.y>view.yMax+5){drawing=false;continue;} d+=`${drawing?"L":"M"}${sx(point.x).toFixed(1)},${sy(point.y).toFixed(1)} `;drawing=true;} return d; };
  const xTicks=integerTicks(view.xMin,view.xMax), yTicks=integerTicks(view.yMin,view.yMax);
  return <svg className="alg-graph" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Interactive algebra graph"><defs><pattern id="alg-grid" width="35" height="35" patternUnits="userSpaceOnUse"><path d="M35 0H0V35" fill="none" stroke="#dce8f5" strokeWidth="1"/></pattern></defs><rect width={W} height={H} fill="url(#alg-grid)"/>{xTicks.map(x=><line key={`x${x}`} x1={sx(x)} x2={sx(x)} y1={P} y2={H-P} className="grid"/>)}{yTicks.map(y=><line key={`y${y}`} x1={P} x2={W-P} y1={sy(y)} y2={sy(y)} className="grid"/>)}<line x1={P} x2={W-P} y1={sy(0)} y2={sy(0)} className="axis"/><line x1={sx(0)} x2={sx(0)} y1={P} y2={H-P} className="axis"/>{plotted.map((s)=><path key={s.expression} d={graphPath(s.points)} fill="none" stroke={s.color} strokeWidth="3" strokeDasharray={s.dashed?"8 7":undefined}/>)}{roots.map((r,i)=><circle key={`${r}-${i}`} cx={sx(r)} cy={sy(0)} r="7" className="root"/>)}{intersection&&Number.isFinite(intersection.x)&&<g><line x1={sx(intersection.x)} x2={sx(intersection.x)} y1={sy(0)} y2={sy(intersection.y)} className="guide"/><circle cx={sx(intersection.x)} cy={sy(intersection.y)} r="7" className="intersection"/><text x={sx(intersection.x)+10} y={sy(intersection.y)-10}>({round(intersection.x)}, {round(intersection.y)})</text></g>}</svg>;
}
function integerTicks(min:number,max:number){const step=max-min>20?5:max-min>10?2:1,out:number[]=[];for(let v=Math.ceil(min/step)*step;v<=max;v+=step)out.push(v);return out;}
function round(value:number){return Math.round(value*100)/100;}
