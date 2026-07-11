import { Line, OrbitControls, Text } from "@react-three/drei";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import * as THREE from "three";
import ThreeSceneWrapper from "../../components/three/ThreeSceneWrapper";
import SectionCard from "../../components/ui/SectionCard";
import SliderControl, { SliderGroup } from "../../components/ui/SliderControl";

type FormulaTopic = "algebra" | "calculus";
type FormulaKind = "line" | "parabola" | "cubic" | "identity" | "system" | "sequence" | "rational" | "limit" | "derivative" | "integral" | "series" | "multivariable";

type FormulaVisual = {
  id: string;
  title: string;
  group: string;
  level: "School" | "JEE" | "Degree" | "PG";
  formula: string;
  summary: string;
  kind: FormulaKind;
};

const algebraFormulas: FormulaVisual[] = [
  { id: "linear-form", title: "Linear Form", group: "Equations", level: "School", formula: "y = mx + c", summary: "Slope controls tilt; intercept shifts the line.", kind: "line" },
  { id: "point-slope", title: "Point-Slope Form", group: "Equations", level: "School", formula: "y-y1 = m(x-x1)", summary: "A line can be built from one point and one slope.", kind: "line" },
  { id: "two-point-slope", title: "Two-Point Slope", group: "Coordinate Algebra", level: "School", formula: "m=(y2-y1)/(x2-x1)", summary: "Slope is vertical change divided by horizontal change.", kind: "line" },
  { id: "quadratic-standard", title: "Quadratic Standard Form", group: "Quadratics", level: "School", formula: "y=ax^2+bx+c", summary: "A parabola changes width, direction, roots, and intercepts.", kind: "parabola" },
  { id: "quadratic-formula", title: "Quadratic Formula", group: "Quadratics", level: "School", formula: "x=(-b +- sqrt(b^2-4ac))/(2a)", summary: "Roots appear where the parabola crosses the x-axis.", kind: "parabola" },
  { id: "discriminant", title: "Discriminant", group: "Quadratics", level: "JEE", formula: "D=b^2-4ac", summary: "D tells whether roots are real, repeated, or complex.", kind: "parabola" },
  { id: "vertex", title: "Vertex of Parabola", group: "Quadratics", level: "JEE", formula: "x=-b/(2a)", summary: "The vertex is the turning point and axis of symmetry.", kind: "parabola" },
  { id: "cubic", title: "Cubic Polynomial", group: "Polynomials", level: "JEE", formula: "p(x)=ax^3+bx^2+cx+d", summary: "Cubic graphs can bend twice and have up to three real roots.", kind: "cubic" },
  { id: "remainder", title: "Remainder Theorem", group: "Polynomials", level: "JEE", formula: "remainder = p(a) for divisor x-a", summary: "Evaluate at a to know the remainder without division.", kind: "cubic" },
  { id: "factor-theorem", title: "Factor Theorem", group: "Polynomials", level: "JEE", formula: "p(a)=0 => (x-a) is a factor", summary: "A zero of the graph becomes a linear factor.", kind: "cubic" },
  { id: "square-identity", title: "Square Identity", group: "Identities", level: "School", formula: "(a+b)^2=a^2+2ab+b^2", summary: "Area tiles explain the middle term 2ab.", kind: "identity" },
  { id: "difference-square", title: "Difference of Squares", group: "Identities", level: "School", formula: "a^2-b^2=(a-b)(a+b)", summary: "Two square areas factor into two linear dimensions.", kind: "identity" },
  { id: "cube-identity", title: "Cube Identity", group: "Identities", level: "JEE", formula: "a^3+b^3=(a+b)(a^2-ab+b^2)", summary: "Cubic expressions factor through structured volume terms.", kind: "identity" },
  { id: "linear-system", title: "Pair of Linear Equations", group: "Systems", level: "School", formula: "a1x+b1y+c1=0, a2x+b2y+c2=0", summary: "Two lines meet, stay parallel, or overlap.", kind: "system" },
  { id: "ap-nth", title: "Arithmetic Progression", group: "Sequences", level: "School", formula: "a_n=a+(n-1)d", summary: "Equal jumps create a linear sequence.", kind: "sequence" },
  { id: "ap-sum", title: "Arithmetic Progression Sum", group: "Sequences", level: "School", formula: "S_n=n/2[2a+(n-1)d]", summary: "Pairing first and last terms gives the sum.", kind: "sequence" },
  { id: "gp-nth", title: "Geometric Progression", group: "Sequences", level: "JEE", formula: "a_n=ar^(n-1)", summary: "Equal ratios create exponential growth or decay.", kind: "sequence" },
  { id: "gp-sum", title: "GP Sum", group: "Sequences", level: "JEE", formula: "S_n=a(r^n-1)/(r-1)", summary: "Finite geometric sums collect repeated scaling.", kind: "sequence" },
  { id: "rational-expression", title: "Rational Function", group: "Functions", level: "JEE", formula: "f(x)=(ax+b)/(cx+d)", summary: "Asymptotes appear where the denominator approaches zero.", kind: "rational" },
  { id: "modulus", title: "Modulus Function", group: "Functions", level: "JEE", formula: "y=|x-a|", summary: "Absolute value folds the graph at its vertex.", kind: "identity" },
];

const calculusFormulas: FormulaVisual[] = [
  { id: "limit-definition", title: "Limit", group: "Limits", level: "JEE", formula: "lim x->a f(x)=L", summary: "Values approach L as x approaches a.", kind: "limit" },
  { id: "continuity", title: "Continuity", group: "Limits", level: "JEE", formula: "lim x->a f(x)=f(a)", summary: "The graph joins the expected value at the point.", kind: "limit" },
  { id: "standard-limit-sin", title: "Standard Trig Limit", group: "Limits", level: "JEE", formula: "lim x->0 sin x / x = 1", summary: "Near zero, sine and angle are nearly equal.", kind: "limit" },
  { id: "derivative-first", title: "Derivative Definition", group: "Derivatives", level: "JEE", formula: "f'(x)=lim h->0 [f(x+h)-f(x)]/h", summary: "Derivative is the limiting slope of secants.", kind: "derivative" },
  { id: "power-rule", title: "Power Rule", group: "Derivatives", level: "JEE", formula: "d/dx x^n = nx^(n-1)", summary: "Power functions convert to slope functions.", kind: "derivative" },
  { id: "product-rule", title: "Product Rule", group: "Derivatives", level: "JEE", formula: "(uv)'=u'v+uv'", summary: "Both factors contribute to the changing product.", kind: "derivative" },
  { id: "quotient-rule", title: "Quotient Rule", group: "Derivatives", level: "JEE", formula: "(u/v)'=(u'v-uv')/v^2", summary: "Division creates a denominator squared effect.", kind: "rational" },
  { id: "chain-rule", title: "Chain Rule", group: "Derivatives", level: "JEE", formula: "d/dx f(g(x))=f'(g(x))g'(x)", summary: "Outer rate multiplies inner rate.", kind: "derivative" },
  { id: "second-derivative", title: "Second Derivative", group: "Applications", level: "JEE", formula: "f''(x)", summary: "Second derivative detects concavity and acceleration.", kind: "derivative" },
  { id: "tangent-normal", title: "Tangent and Normal", group: "Applications", level: "JEE", formula: "m_t=f'(a), m_n=-1/f'(a)", summary: "The normal is perpendicular to the tangent.", kind: "derivative" },
  { id: "riemann", title: "Riemann Sum", group: "Integrals", level: "JEE", formula: "sum f(x_i) Delta x", summary: "Rectangles approximate area under a curve.", kind: "integral" },
  { id: "definite-integral", title: "Definite Integral", group: "Integrals", level: "JEE", formula: "int_a^b f(x) dx", summary: "Signed area accumulates between limits.", kind: "integral" },
  { id: "ftc", title: "Fundamental Theorem", group: "Integrals", level: "JEE", formula: "d/dx int_a^x f(t)dt=f(x)", summary: "Accumulation and differentiation undo each other.", kind: "integral" },
  { id: "parts", title: "Integration by Parts", group: "Integrals", level: "JEE", formula: "int u dv = uv - int v du", summary: "Reverse product rule splits hard integrals.", kind: "integral" },
  { id: "substitution", title: "Substitution", group: "Integrals", level: "JEE", formula: "int f(g(x))g'(x)dx = int f(u)du", summary: "Change variables to match the inner derivative.", kind: "integral" },
  { id: "area-between", title: "Area Between Curves", group: "Applications", level: "JEE", formula: "A=int_a^b [f(x)-g(x)]dx", summary: "Area is top curve minus bottom curve.", kind: "integral" },
  { id: "differential-equation", title: "Differential Equation", group: "Differential Equations", level: "Degree", formula: "dy/dx=ky", summary: "The rate rule generates a family of solution curves.", kind: "derivative" },
  { id: "taylor", title: "Taylor Series", group: "Series", level: "Degree", formula: "f(x)=sum f^(n)(a)(x-a)^n/n!", summary: "Local polynomial pieces approximate smooth functions.", kind: "series" },
  { id: "partial-derivative", title: "Partial Derivative", group: "Multivariable", level: "Degree", formula: "partial f / partial x", summary: "Measure slope in one direction while holding another fixed.", kind: "multivariable" },
  { id: "gradient", title: "Gradient", group: "Multivariable", level: "Degree", formula: "grad f = <f_x, f_y>", summary: "The gradient points toward steepest increase.", kind: "multivariable" },
  { id: "line-integral", title: "Line Integral", group: "Vector Calculus", level: "PG", formula: "int_C F dot dr", summary: "Accumulate a field along a curve.", kind: "multivariable" },
  { id: "fourier", title: "Fourier Series", group: "Series", level: "PG", formula: "f(x) ~ a0 + sum an cos nx + bn sin nx", summary: "Periodic functions decompose into waves.", kind: "series" },
];

export default function FormulaVisualizationAtlas({ topic }: { topic: FormulaTopic }) {
  const formulas = topic === "algebra" ? algebraFormulas : calculusFormulas;
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("All");
  const [selectedId, setSelectedId] = useState(formulas[0].id);
  const [a, setA] = useState(1.2);
  const [b, setB] = useState(1);
  const [c, setC] = useState(-1);
  const [n, setN] = useState(6);
  const [visualMode, setVisualMode] = useState<"2d" | "3d">("2d");
  const groups = useMemo(() => ["All", ...Array.from(new Set(formulas.map((item) => item.group)))], [formulas]);
  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    return formulas.filter((item) => {
      const groupMatch = group === "All" || item.group === group;
      const textMatch = !value || [item.title, item.group, item.level, item.formula, item.summary].join(" ").toLowerCase().includes(value);
      return groupMatch && textMatch;
    });
  }, [formulas, group, query]);
  const selected = formulas.find((item) => item.id === selectedId) ?? filtered[0] ?? formulas[0];

  return (
    <SectionCard title={`${topic === "algebra" ? "Algebra" : "Calculus"} Formula Visualizer`} description="Search formulas, select a card, then use sliders to see the visual model change." compact>
      <div className="grid gap-3 xl:grid-cols-[390px_minmax(0,1fr)]">
        <div className="space-y-3">
          <label className="flex min-h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-base font-bold dark:border-white/10 dark:bg-slate-950/60">
            <Search className="h-5 w-5 text-slate-400" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search formula..." className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-slate-400" />
          </label>
          <div className="mobile-safe-scroll">
            <div className="flex gap-2">
              {groups.map((item) => (
                <button key={item} type="button" onClick={() => setGroup(item)} className={group === item ? "action-primary min-h-11 px-4 py-2 text-sm" : "tool-button min-h-11 px-4 py-2 text-sm"}>
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="max-h-[430px] space-y-2 overflow-y-auto pr-1">
            {filtered.map((item) => (
              <button key={item.id} type="button" onClick={() => setSelectedId(item.id)} className={`w-full rounded-xl border p-4 text-left transition ${selected.id === item.id ? "border-cyan-300 bg-cyan-50 dark:border-cyan-300/50 dark:bg-cyan-400/10" : "border-slate-200 bg-white/75 hover:border-cyan-200 dark:border-white/10 dark:bg-white/5"}`}>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-lg font-black leading-6 text-slate-950 dark:text-white">{item.title}</p>
                  <span className="mini-chip">{item.level}</span>
                </div>
                <p className="mt-2 break-words font-mono text-base font-black leading-6 text-cyan-700 dark:text-cyan-200">{item.formula}</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">{item.summary}</p>
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <SliderGroup title="Formula parameters">
            <SliderControl density="compact" label="a" value={a} min={-4} max={4} step={0.1} onChange={setA} />
            <SliderControl density="compact" label="b" value={b} min={-4} max={4} step={0.1} onChange={setB} />
            <SliderControl density="compact" label="c" value={c} min={-5} max={5} step={0.1} onChange={setC} />
            <SliderControl density="compact" label="n" value={n} min={1} max={20} step={1} onChange={setN} />
          </SliderGroup>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setVisualMode("2d")} className={visualMode === "2d" ? "action-primary min-h-11 px-4 py-2 text-sm" : "tool-button min-h-11 px-4 py-2 text-sm"}>2D visual</button>
            <button type="button" onClick={() => setVisualMode("3d")} className={visualMode === "3d" ? "action-primary min-h-11 px-4 py-2 text-sm" : "tool-button min-h-11 px-4 py-2 text-sm"}>3D visual</button>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-slate-950/40">
            {visualMode === "2d" ? <FormulaVisual formula={selected} a={a} b={b} c={c} n={Math.round(n)} /> : <FormulaVisual3D formula={selected} a={a} b={b} c={c} n={Math.round(n)} />}
          </div>
          <div className="grid gap-2 md:grid-cols-3">
            <Fact label="group" value={selected.group} />
            <Fact label="level" value={selected.level} />
            <Fact label="formula" value={selected.formula} />
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

function FormulaVisual3D({ formula, a, b, c, n }: { formula: FormulaVisual; a: number; b: number; c: number; n: number }) {
  return (
    <ThreeSceneWrapper height="430px" mobileHeight="360px" cameraPosition={[5, 3.6, 6.2]} fov={44} quality="high" chrome="cinematic" sceneLabel={`${formula.title} 3D`} interactionLabel="Drag rotate - scroll zoom">
      <OrbitControls enableDamping makeDefault />
      <Grid3D />
      <FormulaScene3D formula={formula} a={a} b={b} c={c} n={n} />
    </ThreeSceneWrapper>
  );
}

function FormulaScene3D({ formula, a, b, c, n }: { formula: FormulaVisual; a: number; b: number; c: number; n: number }) {
  if (formula.kind === "identity") return <IdentityBlocks3D a={a} b={b} />;
  if (formula.kind === "system") return <SystemLines3D a={a} b={b} c={c} />;
  if (formula.kind === "integral") return <IntegralBars3D a={a} b={b} c={c} n={n} />;
  if (formula.kind === "multivariable") return <Surface3D a={a} b={b} />;
  return <Curve3D formula={formula} a={a} b={b} c={c} n={n} />;
}

function formulaY(kind: FormulaKind, x: number, a: number, b: number, c: number, n: number) {
  if (kind === "line") return a * x + b;
  if (kind === "parabola") return a * x * x * 0.35 + b * x * 0.45 + c * 0.35;
  if (kind === "cubic") return 0.08 * a * x ** 3 + 0.18 * b * x * x + c * 0.3;
  if (kind === "rational") return (a * x + b) / (x - c || 0.0001);
  if (kind === "limit") return Math.abs(x) < 0.04 ? 1 : Math.sin(x) / x;
  if (kind === "derivative") return Math.sin(x) + 0.14 * a * x * x;
  if (kind === "series") return Array.from({ length: Math.max(1, n) }, (_, index) => index).reduce((sum, k) => sum + ((k % 2 === 0 ? 1 : -1) * x ** (2 * k + 1)) / factorial(2 * k + 1), 0);
  if (kind === "sequence") return a + Math.max(0, Math.round(x + 4)) * b * 0.45;
  return Math.sin(x) + Math.cos(b * x) * 0.5;
}

function Curve3D({ formula, a, b, c, n }: { formula: FormulaVisual; a: number; b: number; c: number; n: number }) {
  const points = useMemo(() => Array.from({ length: 180 }, (_, index) => {
    const x = -4 + (index / 179) * 8;
    const y = Math.max(-3, Math.min(3, formulaY(formula.kind, x, a, b, c, n)));
    const z = formula.kind === "sequence" ? Math.sin(index * 0.6) * 0.25 : Math.sin(x * 1.3) * 0.45;
    return new THREE.Vector3(x, y, z);
  }), [a, b, c, formula.kind, n]);
  const projected = points.map((point) => new THREE.Vector3(point.x, point.y, -1.2));
  return (
    <group>
      <Line points={points} color="#22d3ee" lineWidth={4} />
      <Line points={projected} color="#f59e0b" lineWidth={2} dashed dashSize={0.15} gapSize={0.1} />
      <mesh position={[0, 0, -1.23]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8.4, 6.2]} />
        <meshStandardMaterial color="#0f172a" transparent opacity={0.22} side={THREE.DoubleSide} />
      </mesh>
      <Text position={[-3.8, 2.9, 0]} fontSize={0.3} color="#e0f2fe" anchorX="left">{formula.formula}</Text>
    </group>
  );
}

function IntegralBars3D({ a, b, c, n }: { a: number; b: number; c: number; n: number }) {
  const count = Math.max(3, Math.min(18, n));
  const dx = 6 / count;
  return (
    <group>
      {Array.from({ length: count }, (_, i) => {
        const x = -3 + i * dx + dx / 2;
        const h = Math.max(0.12, Math.min(3, formulaY("derivative", x, a, b, c, n) + 1.2));
        return (
          <mesh key={i} position={[x, h / 2 - 1.4, 0]} castShadow>
            <boxGeometry args={[dx * 0.82, h, 0.55]} />
            <meshStandardMaterial color={i % 2 ? "#8b5cf6" : "#22d3ee"} transparent opacity={0.72} />
          </mesh>
        );
      })}
      <Text position={[-3.4, 2.2, 0.7]} fontSize={0.3} color="#e0f2fe" anchorX="left">Riemann rectangles become volume blocks</Text>
    </group>
  );
}

function IdentityBlocks3D({ a, b }: { a: number; b: number }) {
  const sizeA = Math.max(0.7, Math.abs(a) * 0.5);
  const sizeB = Math.max(0.55, Math.abs(b) * 0.48);
  return (
    <group position={[-1.2, -1.1, 0]}>
      <BoxBlock position={[sizeA / 2, sizeA / 2, 0]} size={[sizeA, sizeA, 0.36]} color="#22d3ee" label="a^2" />
      <BoxBlock position={[sizeA + sizeB / 2, sizeA / 2, 0]} size={[sizeB, sizeA, 0.36]} color="#f59e0b" label="ab" />
      <BoxBlock position={[sizeA / 2, sizeA + sizeB / 2, 0]} size={[sizeA, sizeB, 0.36]} color="#f59e0b" label="ab" />
      <BoxBlock position={[sizeA + sizeB / 2, sizeA + sizeB / 2, 0]} size={[sizeB, sizeB, 0.36]} color="#a78bfa" label="b^2" />
    </group>
  );
}

function BoxBlock({ position, size, color, label }: { position: [number, number, number]; size: [number, number, number]; color: string; label: string }) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} transparent opacity={0.78} />
      </mesh>
      <Text position={[0, 0, size[2] / 2 + 0.04]} fontSize={0.22} color="#f8fafc">{label}</Text>
    </group>
  );
}

function SystemLines3D({ a, b, c }: { a: number; b: number; c: number }) {
  const lineA = [new THREE.Vector3(-4, a * -4 + b, -0.35), new THREE.Vector3(4, a * 4 + b, -0.35)];
  const lineB = [new THREE.Vector3(-4, (-b || 1) * -4 + c, 0.45), new THREE.Vector3(4, (-b || 1) * 4 + c, 0.45)];
  return (
    <group>
      <Line points={lineA} color="#22d3ee" lineWidth={4} />
      <Line points={lineB} color="#f59e0b" lineWidth={4} />
      <mesh position={[0, 0, -0.35]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[8, 6]} /><meshStandardMaterial color="#0891b2" transparent opacity={0.16} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0, 0.45]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[8, 6]} /><meshStandardMaterial color="#f59e0b" transparent opacity={0.12} side={THREE.DoubleSide} /></mesh>
      <Text position={[-3.6, 2.8, 0.8]} fontSize={0.3} color="#e0f2fe" anchorX="left">solution as line intersection layers</Text>
    </group>
  );
}

function Surface3D({ a, b }: { a: number; b: number }) {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(7, 7, 46, 46);
    const positions = geo.attributes.position;
    for (let i = 0; i < positions.count; i += 1) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      positions.setZ(i, 0.5 * Math.sin(a * x) + 0.35 * Math.cos(b * y));
    }
    positions.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }, [a, b]);
  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      <mesh castShadow receiveShadow>
        <primitive object={geometry} attach="geometry" />
        <meshStandardMaterial color="#22d3ee" wireframe={false} transparent opacity={0.68} side={THREE.DoubleSide} />
      </mesh>
      <mesh>
        <primitive object={geometry.clone()} attach="geometry" />
        <meshStandardMaterial color="#f8fafc" wireframe transparent opacity={0.18} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Grid3D() {
  return (
    <group>
      <gridHelper args={[9, 18, "#38bdf8", "#334155"]} position={[0, -1.6, 0]} />
      <Line points={[new THREE.Vector3(-4.5, -1.58, 0), new THREE.Vector3(4.5, -1.58, 0)]} color="#e0f2fe" lineWidth={2} />
      <Line points={[new THREE.Vector3(0, -1.58, -4.5), new THREE.Vector3(0, -1.58, 4.5)]} color="#e0f2fe" lineWidth={2} />
      <Text position={[4.7, -1.45, 0]} fontSize={0.26} color="#e0f2fe">x</Text>
      <Text position={[0.2, -1.45, 4.7]} fontSize={0.26} color="#e0f2fe">z</Text>
    </group>
  );
}

function FormulaVisual({ formula, a, b, c, n }: { formula: FormulaVisual; a: number; b: number; c: number; n: number }) {
  const width = 760;
  const height = 360;
  const sx = (x: number) => width / 2 + x * 74;
  const sy = (y: number) => height / 2 - y * 48;
  const fn = (x: number) => {
    if (formula.kind === "line") return a * x + b;
    if (formula.kind === "parabola") return a * x * x + b * x + c;
    if (formula.kind === "cubic") return 0.18 * a * x ** 3 + 0.35 * b * x * x + c;
    if (formula.kind === "rational") return (a * x + b) / (x - c || 0.0001);
    if (formula.kind === "limit") return Math.abs(x) < 0.05 ? 1 : Math.sin(x) / x;
    if (formula.kind === "derivative") return Math.sin(x) + 0.2 * a * x * x;
    if (formula.kind === "series") return Array.from({ length: Math.max(1, n) }, (_, index) => index).reduce((sum, k) => sum + ((k % 2 === 0 ? 1 : -1) * x ** (2 * k + 1)) / factorial(2 * k + 1), 0);
    if (formula.kind === "sequence") return a + Math.max(0, Math.round(x + 4)) * b;
    return Math.sin(x) + Math.cos(b * x) * 0.5;
  };
  const path = Array.from({ length: 220 }, (_, index) => {
    const x = -5 + (index / 219) * 10;
    const y = Math.max(-6, Math.min(6, fn(x)));
    return `${index ? "L" : "M"}${sx(x)},${sy(y)}`;
  }).join(" ");
  const pointX = 1.2;
  const pointY = fn(pointX);
  const slope = derivative(fn, pointX);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-[360px] w-full">
      <rect width={width} height={height} rx="14" fill="#f8fafc" />
      <Grid width={width} height={height} />
      {formula.kind === "identity" && <IdentityTiles a={a} b={b} />}
      {formula.kind === "system" && <SystemLines a={a} b={b} c={c} sx={sx} sy={sy} />}
      {formula.kind === "integral" && <IntegralBars fn={fn} sx={sx} sy={sy} n={n} />}
      {formula.kind === "multivariable" && <GradientField />}
      {!["identity", "system", "multivariable"].includes(formula.kind) && <path d={path} fill="none" stroke="#06b6d4" strokeWidth="4" />}
      {["derivative", "limit"].includes(formula.kind) && <line x1={sx(pointX - 1.2)} y1={sy(pointY - slope * 1.2)} x2={sx(pointX + 1.2)} y2={sy(pointY + slope * 1.2)} stroke="#f59e0b" strokeWidth="3" />}
      <rect x="14" y="14" width="330" height="66" rx="12" fill="#ffffff" opacity="0.92" stroke="#e2e8f0" />
      <text x="28" y="42" fill="#0f172a" fontSize="22" fontWeight="900">{formula.title}</text>
      <text x="28" y="66" fill="#075985" fontSize="17" fontWeight="800">{formula.formula}</text>
    </svg>
  );
}

function IdentityTiles({ a, b }: { a: number; b: number }) {
  const sizeA = Math.max(45, Math.abs(a) * 28);
  const sizeB = Math.max(35, Math.abs(b) * 26);
  const x = 245;
  const y = 95;
  return (
    <g>
      <rect x={x} y={y} width={sizeA} height={sizeA} fill="#06b6d4" opacity="0.35" stroke="#06b6d4" strokeWidth="3" />
      <rect x={x + sizeA} y={y} width={sizeB} height={sizeA} fill="#f59e0b" opacity="0.3" stroke="#f59e0b" strokeWidth="3" />
      <rect x={x} y={y + sizeA} width={sizeA} height={sizeB} fill="#f59e0b" opacity="0.3" stroke="#f59e0b" strokeWidth="3" />
      <rect x={x + sizeA} y={y + sizeA} width={sizeB} height={sizeB} fill="#8b5cf6" opacity="0.32" stroke="#8b5cf6" strokeWidth="3" />
      <text x={x} y={y + sizeA + sizeB + 32} fill="#0f172a" fontSize="20" fontWeight="900">(a+b)^2 pieces</text>
    </g>
  );
}

function SystemLines({ a, b, c, sx, sy }: { a: number; b: number; c: number; sx: (x: number) => number; sy: (y: number) => number }) {
  const line = (m: number, k: number) => `M${sx(-5)},${sy(m * -5 + k)} L${sx(5)},${sy(m * 5 + k)}`;
  return <g><path d={line(a, b)} stroke="#06b6d4" strokeWidth="4" /><path d={line(-b || 1, c)} stroke="#f59e0b" strokeWidth="4" /><text x="260" y="315" fill="#0f172a" fontSize="20" fontWeight="900">intersection = solution</text></g>;
}

function IntegralBars({ fn, sx, sy, n }: { fn: (x: number) => number; sx: (x: number) => number; sy: (y: number) => number; n: number }) {
  const count = Math.max(2, n);
  const dx = 6 / count;
  return <g>{Array.from({ length: count }, (_, i) => {
    const x = -3 + i * dx;
    const y = Math.max(0, Math.min(5, fn(x + dx)));
    return <rect key={i} x={sx(x)} y={sy(y)} width={dx * 74} height={Math.max(0, sy(0) - sy(y))} fill="#8b5cf6" opacity="0.28" stroke="#8b5cf6" />;
  })}</g>;
}

function GradientField() {
  return <g>{Array.from({ length: 8 }, (_, i) => Array.from({ length: 5 }, (_, j) => <line key={`${i}-${j}`} x1={160 + i * 64} y1={105 + j * 42} x2={190 + i * 64} y2={92 + j * 42} stroke="#10b981" strokeWidth="3" />))}<ellipse cx="390" cy="180" rx="210" ry="86" fill="#06b6d4" opacity="0.12" stroke="#06b6d4" strokeWidth="3" /></g>;
}

function Grid({ width, height }: { width: number; height: number }) {
  return <g opacity="0.6">{Array.from({ length: 11 }).map((_, i) => <line key={`v-${i}`} x1={(i / 10) * width} x2={(i / 10) * width} y1="0" y2={height} stroke="#e2e8f0" />)}{Array.from({ length: 7 }).map((_, i) => <line key={`h-${i}`} x1="0" x2={width} y1={(i / 6) * height} y2={(i / 6) * height} stroke="#e2e8f0" />)}<line x1="0" x2={width} y1={height / 2} y2={height / 2} stroke="#94a3b8" /><line x1={width / 2} x2={width / 2} y1="0" y2={height} stroke="#94a3b8" /></g>;
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-slate-100 p-3 dark:bg-white/10"><p className="text-xs font-black uppercase text-slate-500">{label}</p><p className="mt-1 break-words font-mono text-sm font-black">{value}</p></div>;
}

function derivative(fn: (x: number) => number, x: number) {
  const h = 0.001;
  return (fn(x + h) - fn(x - h)) / (2 * h);
}

function factorial(value: number): number {
  let result = 1;
  for (let i = 2; i <= value; i += 1) result *= i;
  return result;
}
