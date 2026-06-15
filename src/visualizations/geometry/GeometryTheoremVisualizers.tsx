import { useMemo, useState } from "react";
import FormulaBlock from "../../components/ui/FormulaBlock";
import SectionCard from "../../components/ui/SectionCard";
import SliderControl from "../../components/ui/SliderControl";
import VisualLearningPanel from "../../components/ui/VisualLearningPanel";
import { roundTo } from "../../utils/math";

type TheoremId =
  | "angle-sum"
  | "exterior-angle"
  | "midpoint"
  | "basic-proportionality"
  | "similar-triangles"
  | "thales"
  | "law-of-sines"
  | "law-of-cosines"
  | "inscribed-angle"
  | "power-of-point"
  | "tangent-radius"
  | "intersecting-chords";

type Theorem = {
  id: TheoremId;
  title: string;
  formula: string;
  description: string;
  category: string;
  sliders: string[];
  realWorldUse: string;
};

const theorems: Theorem[] = [
  { id: "angle-sum", title: "Triangle Angle Sum", formula: "A + B + C = 180 deg", description: "Every Euclidean triangle has interior angles that add to 180 degrees.", category: "Triangles", sliders: ["Angle A", "Angle B"], realWorldUse: "Roof design, surveying, map triangulation, and polygon angle checks." },
  { id: "exterior-angle", title: "Exterior Angle Theorem", formula: "Exterior angle = opposite interior angle 1 + opposite interior angle 2", description: "A triangle exterior angle equals the sum of the two remote interior angles.", category: "Triangles", sliders: ["Remote angle A", "Remote angle B"], realWorldUse: "Navigation bearings, proofs, and turn-angle reasoning." },
  { id: "midpoint", title: "Midpoint Theorem", formula: "DE parallel BC and DE = 1/2 BC", description: "The segment joining midpoints of two triangle sides is parallel to the third side and half its length.", category: "Triangles", sliders: ["Base BC", "Height"], realWorldUse: "Computer graphics meshes, structural bracing, and scale drawings." },
  { id: "basic-proportionality", title: "Basic Proportionality Theorem", formula: "AD/DB = AE/EC", description: "A line parallel to one side of a triangle divides the other two sides proportionally.", category: "Triangles", sliders: ["Triangle width", "Parallel height"], realWorldUse: "Perspective drawing, map scaling, and similar-triangle measurements." },
  { id: "similar-triangles", title: "Similar Triangles", formula: "Corresponding sides are proportional; corresponding angles are equal", description: "Triangles with equal angles are scaled copies of each other.", category: "Triangles", sliders: ["Scale factor", "Base"], realWorldUse: "Indirect measurement, shadows, camera projection, and blueprints." },
  { id: "thales", title: "Thales' Theorem", formula: "Angle in a semicircle = 90 deg", description: "Any triangle drawn with the diameter of a circle as one side has a right angle on the circle.", category: "Circles", sliders: ["Point position"], realWorldUse: "Circle geometry, right-angle construction, and CAD constraints." },
  { id: "law-of-sines", title: "Law of Sines", formula: "a/sin A = b/sin B = c/sin C", description: "In any triangle, side lengths are proportional to the sines of their opposite angles.", category: "Trigonometry", sliders: ["Angle A", "Angle B"], realWorldUse: "Surveying, navigation, triangulation, and missing-side calculations." },
  { id: "law-of-cosines", title: "Law of Cosines", formula: "c^2 = a^2 + b^2 - 2ab cos C", description: "A generalization of Pythagoras for non-right triangles.", category: "Trigonometry", sliders: ["Side a", "Side b", "Included angle"], realWorldUse: "Distance estimation, robotics arms, GPS geometry, and physics vectors." },
  { id: "inscribed-angle", title: "Inscribed Angle Theorem", formula: "Inscribed angle = 1/2 central angle", description: "An angle on a circle is half the central angle that subtends the same arc.", category: "Circles", sliders: ["Central angle"], realWorldUse: "Optics, circle proofs, arc measurement, and mechanical linkages." },
  { id: "power-of-point", title: "Power of a Point", formula: "PA * PB = PC * PD", description: "Secants from the same outside point create equal products of segment lengths.", category: "Circles", sliders: ["Outside distance", "Secant angle"], realWorldUse: "Circle intersections, CAD construction, and geometric proofs." },
  { id: "tangent-radius", title: "Tangent Radius Theorem", formula: "Radius perpendicular tangent at point of contact", description: "A tangent line touches a circle at one point and is perpendicular to the radius there.", category: "Circles", sliders: ["Contact angle"], realWorldUse: "Wheels, gears, cam design, and normal vectors in graphics." },
  { id: "intersecting-chords", title: "Intersecting Chords Theorem", formula: "AE * EB = CE * ED", description: "When two chords intersect inside a circle, the products of their segments are equal.", category: "Circles", sliders: ["Intersection offset", "Chord tilt"], realWorldUse: "Circle construction, optics paths, and geometric validation." },
];

const categories = ["All", "Triangles", "Circles", "Trigonometry"] as const;

export default function GeometryTheoremVisualizers() {
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [selectedId, setSelectedId] = useState<TheoremId>("angle-sum");
  const [x, setX] = useState(55);
  const [y, setY] = useState(45);
  const [z, setZ] = useState(70);

  const visible = useMemo(() => theorems.filter((item) => category === "All" || item.category === category), [category]);
  const selected = theorems.find((item) => item.id === selectedId) ?? theorems[0];
  const metrics = theoremMetrics(selected.id, x, y, z);

  return (
    <SectionCard title="Geometry Theorem Visualizers" description={`${theorems.length} theorem labs with formulas, live diagrams, and guided checks.`}>
      <div className="flex flex-wrap gap-2">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              category === item ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-200"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {visible.map((theorem) => (
          <button
            key={theorem.id}
            type="button"
            onClick={() => setSelectedId(theorem.id)}
            className={`min-h-[130px] rounded-2xl border p-4 text-left transition hover:-translate-y-1 ${
              selected.id === theorem.id ? "border-cyan-400 bg-cyan-50 shadow-lg shadow-cyan-500/10 dark:bg-cyan-400/10" : "border-slate-200 bg-white/70 dark:border-white/10 dark:bg-white/5"
            }`}
          >
            <p className="text-xs font-bold uppercase text-cyan-600 dark:text-cyan-300">{theorem.category}</p>
            <h3 className="mt-2 font-bold leading-6">{theorem.title}</h3>
            <p className="mt-2 text-sm leading-5 text-slate-600 dark:text-slate-300">{theorem.description}</p>
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[330px_1fr]">
        <div className="space-y-4">
          <FormulaBlock title={selected.title} formula={selected.formula} explanation={selected.description} />
          <SliderControl label={selected.sliders[0] ?? "Value A"} value={x} min={sliderMin(selected.id, 0)} max={sliderMax(selected.id, 0)} step={1} onChange={setX} unit={sliderUnit(selected.id, 0)} />
          <SliderControl label={selected.sliders[1] ?? "Value B"} value={y} min={sliderMin(selected.id, 1)} max={sliderMax(selected.id, 1)} step={1} onChange={setY} unit={sliderUnit(selected.id, 1)} />
          {selected.sliders[2] && <SliderControl label={selected.sliders[2]} value={z} min={sliderMin(selected.id, 2)} max={sliderMax(selected.id, 2)} step={1} onChange={setZ} unit={sliderUnit(selected.id, 2)} />}
          <div className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(metrics).map(([label, value]) => <Metric key={label} label={label} value={value} />)}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 dark:bg-slate-950/60">
          <div className="mb-3 rounded-xl border border-cyan-100 bg-cyan-50/80 p-3 dark:border-cyan-300/20 dark:bg-cyan-300/10">
            <p className="text-xs font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-200">What must stay true</p>
            <p className="mt-1 text-sm font-semibold leading-5 text-slate-700 dark:text-slate-200">{proofIdeaFor(selected.id)}</p>
          </div>
          <TheoremSvg theorem={selected.id} x={x} y={y} z={z} />
        </div>
      </div>

      <div className="mt-6">
        <VisualLearningPanel
          concept={selected.description}
          formula={selected.formula}
          changes={changeText(selected.id)}
          realWorldUse={selected.realWorldUse}
          steps={stepsFor(selected.id, x, y, z, metrics)}
          tasks={tasksFor(selected.id)}
          proofIdea={proofIdeaFor(selected.id)}
          misconception={misconceptionFor(selected.id)}
          teacherPrompt={teacherPromptFor(selected.id)}
        />
      </div>
    </SectionCard>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="rounded-2xl bg-slate-100 p-3 dark:bg-white/10"><p className="text-xs text-slate-500 dark:text-slate-400">{label}</p><p className="font-bold">{roundTo(value, 2)}</p></div>;
}

function sliderMin(id: TheoremId, index: number) {
  if (id === "similar-triangles" && index === 0) return 1;
  if (id === "thales") return 15;
  if (id === "power-of-point" && index === 0) return 20;
  if (id === "intersecting-chords" && index === 0) return -55;
  return 10;
}

function sliderMax(id: TheoremId, index: number) {
  if (id === "similar-triangles" && index === 0) return 5;
  if (id === "angle-sum" || id === "exterior-angle" || id === "law-of-sines") return 80;
  if (id === "law-of-cosines" && index === 2) return 150;
  if (id === "thales") return 165;
  if (id === "inscribed-angle") return 150;
  if (id === "tangent-radius") return 360;
  if (id === "intersecting-chords" && index === 0) return 55;
  return 120;
}

function sliderUnit(id: TheoremId, index: number) {
  if (["angle-sum", "exterior-angle", "law-of-sines", "law-of-cosines", "thales", "inscribed-angle", "power-of-point", "tangent-radius", "intersecting-chords"].includes(id) && (index > 1 || !["midpoint", "basic-proportionality", "similar-triangles"].includes(id))) return "deg";
  return "";
}

function theoremMetrics(id: TheoremId, x: number, y: number, z: number): Record<string, number> {
  if (id === "angle-sum") {
    const c = Math.max(1, 180 - x - y);
    return { "Angle C": c, Total: x + y + c };
  }
  if (id === "exterior-angle") return { Exterior: x + y, "Remote sum": x + y };
  if (id === "midpoint") return { BC: x, DE: x / 2, "Height": y };
  if (id === "basic-proportionality") {
    const ratio = Math.min(0.85, Math.max(0.15, y / 120));
    return { "AD/AB": ratio, "AE/AC": ratio, "DE/BC": ratio };
  }
  if (id === "similar-triangles") return { Scale: x, "Small base": y, "Large base": x * y };
  if (id === "thales") return { "Angle APB": 90, "Diameter": 12 };
  if (id === "law-of-sines") {
    const cAngle = Math.max(1, 180 - x - y);
    const k = 8;
    return { "Angle C": cAngle, "Side a": k * Math.sin(deg(x)), "Side b": k * Math.sin(deg(y)), "Side c": k * Math.sin(deg(cAngle)) };
  }
  if (id === "law-of-cosines") {
    const sideC = Math.sqrt(x * x + y * y - 2 * x * y * Math.cos(deg(z)));
    return { "Side c": sideC, "c squared": sideC * sideC };
  }
  if (id === "inscribed-angle") return { "Central angle": x, "Inscribed angle": x / 2 };
  if (id === "power-of-point") {
    const pa = x / 10;
    const pb = pa + 6;
    const pc = Math.max(1, pa + y / 30);
    return { "PA * PB": pa * pb, "PC target": pc, "PD": (pa * pb) / pc };
  }
  if (id === "tangent-radius") return { "Contact angle": x, "Radius-tangent angle": 90 };
  const ae = 5 + Math.abs(x) / 20;
  const eb = 9 - Math.abs(x) / 30;
  const ce = 4 + y / 30;
  return { "AE * EB": ae * eb, "CE": ce, "ED": (ae * eb) / ce };
}

function TheoremSvg({ theorem, x, y, z }: { theorem: TheoremId; x: number; y: number; z: number }) {
  if (["thales", "inscribed-angle", "power-of-point", "tangent-radius", "intersecting-chords"].includes(theorem)) return <CircleTheoremSvg theorem={theorem} x={x} y={y} z={z} />;
  return <TriangleTheoremSvg theorem={theorem} x={x} y={y} z={z} />;
}

function TriangleTheoremSvg({ theorem, x, y, z }: { theorem: TheoremId; x: number; y: number; z: number }) {
  const left = { x: 70, y: 270 };
  const right = { x: 350, y: 270 };
  const top = { x: 200 + (x - 45) * 1.2, y: 70 + (80 - y) * 0.8 };
  const ratio = theorem === "basic-proportionality" ? Math.min(0.85, Math.max(0.15, y / 120)) : 0.5;
  const d = lerp(top, left, ratio);
  const e = lerp(top, right, ratio);
  const scale = theorem === "similar-triangles" ? x : 2;
  const sideC = theorem === "law-of-cosines" ? Math.sqrt(x * x + y * y - 2 * x * y * Math.cos(deg(z))) : 0;

  return (
    <svg viewBox="0 0 440 330" className="h-[330px] w-full">
      <polygon points={`${left.x},${left.y} ${right.x},${right.y} ${top.x},${top.y}`} fill="rgba(34,211,238,.16)" stroke="#06b6d4" strokeWidth="3" />
      {theorem === "midpoint" && <line x1={d.x} y1={d.y} x2={e.x} y2={e.y} stroke="#f59e0b" strokeWidth="5" />}
      {theorem === "basic-proportionality" && <line x1={d.x} y1={d.y} x2={e.x} y2={e.y} stroke="#f59e0b" strokeWidth="4" strokeDasharray="8 5" />}
      {theorem === "similar-triangles" && (
        <g transform="translate(245 25)">
          <polygon points={`0,190 ${38 * scale},190 ${20 * scale},${190 - 28 * scale}`} fill="rgba(245,158,11,.2)" stroke="#f59e0b" strokeWidth="3" />
          <text x="0" y="215" fill="#f59e0b">scale {roundTo(scale, 1)}x</text>
        </g>
      )}
      {theorem === "exterior-angle" && <line x1={right.x} y1={right.y} x2="420" y2={right.y} stroke="#f59e0b" strokeWidth="4" />}
      {theorem === "law-of-cosines" && <text x="150" y="305" fill="#f59e0b">c = {roundTo(sideC, 2)}</text>}
      {theorem === "law-of-sines" && <text x="115" y="305" fill="#f59e0b">a/sin A = b/sin B = c/sin C</text>}
      <circle cx={left.x} cy={left.y} r="5" fill="#8b5cf6" /><circle cx={right.x} cy={right.y} r="5" fill="#8b5cf6" /><circle cx={top.x} cy={top.y} r="5" fill="#8b5cf6" />
      <text x={left.x - 28} y={left.y - 8} fill="#7c3aed">A</text>
      <text x={right.x + 10} y={right.y - 8} fill="#7c3aed">B</text>
      <text x={top.x - 5} y={top.y - 12} fill="#7c3aed">C</text>
      <text x="28" y="28" fill="#0f172a" className="dark:fill-slate-100">{theoremLabel(theorem, x, y, z)}</text>
    </svg>
  );
}

function CircleTheoremSvg({ theorem, x, y }: { theorem: TheoremId; x: number; y: number; z: number }) {
  const cx = 220, cy = 165, r = 105;
  const a = pointOnCircle(cx, cy, r, 205);
  const b = pointOnCircle(cx, cy, r, -25);
  const p = theorem === "thales" ? pointOnCircle(cx, cy, r, x) : pointOnCircle(cx, cy, r, 90);
  const q = pointOnCircle(cx, cy, r, x);
  const t = pointOnCircle(cx, cy, r, x);
  const tangentAngle = deg(x + 90);

  return (
    <svg viewBox="0 0 440 330" className="h-[330px] w-full">
      <circle cx={cx} cy={cy} r={r} fill="rgba(34,211,238,.12)" stroke="#06b6d4" strokeWidth="4" />
      {theorem === "thales" && <><line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#8b5cf6" strokeWidth="4" /><line x1={a.x} y1={a.y} x2={p.x} y2={p.y} stroke="#f59e0b" strokeWidth="4" /><line x1={b.x} y1={b.y} x2={p.x} y2={p.y} stroke="#f59e0b" strokeWidth="4" /><text x={p.x + 8} y={p.y - 8} fill="#f59e0b">90 deg</text></>}
      {theorem === "inscribed-angle" && <><line x1={cx} y1={cy} x2={a.x} y2={a.y} stroke="#8b5cf6" strokeWidth="3" /><line x1={cx} y1={cy} x2={q.x} y2={q.y} stroke="#8b5cf6" strokeWidth="3" /><line x1={p.x} y1={p.y} x2={a.x} y2={a.y} stroke="#f59e0b" strokeWidth="3" /><line x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke="#f59e0b" strokeWidth="3" /><text x="24" y="28" fill="#f59e0b">inscribed = {roundTo(x / 2, 1)} deg</text></>}
      {theorem === "power-of-point" && <><circle cx="55" cy={cy} r="5" fill="#f59e0b" /><line x1="55" y1={cy} x2={b.x} y2={b.y} stroke="#f59e0b" strokeWidth="4" /><line x1="55" y1={cy} x2={pointOnCircle(cx, cy, r, y).x} y2={pointOnCircle(cx, cy, r, y).y} stroke="#8b5cf6" strokeWidth="4" /><text x="26" y={cy - 12} fill="#f59e0b">P</text></>}
      {theorem === "tangent-radius" && <><line x1={cx} y1={cy} x2={t.x} y2={t.y} stroke="#8b5cf6" strokeWidth="4" /><line x1={t.x - 150 * Math.cos(tangentAngle)} y1={t.y - 150 * Math.sin(tangentAngle)} x2={t.x + 150 * Math.cos(tangentAngle)} y2={t.y + 150 * Math.sin(tangentAngle)} stroke="#f59e0b" strokeWidth="4" /><text x={t.x + 8} y={t.y - 8} fill="#f59e0b">90 deg</text></>}
      {theorem === "intersecting-chords" && <><line x1={pointOnCircle(cx, cy, r, 210).x} y1={pointOnCircle(cx, cy, r, 210).y} x2={pointOnCircle(cx, cy, r, 20).x} y2={pointOnCircle(cx, cy, r, 20).y} stroke="#f59e0b" strokeWidth="4" /><line x1={pointOnCircle(cx, cy, r, 150 + y / 2).x} y1={pointOnCircle(cx, cy, r, 150 + y / 2).y} x2={pointOnCircle(cx, cy, r, -70).x} y2={pointOnCircle(cx, cy, r, -70).y} stroke="#8b5cf6" strokeWidth="4" /><circle cx={cx + x} cy={cy} r="5" fill="#ef4444" /><text x={cx + x + 8} y={cy - 8} fill="#ef4444">E</text></>}
      <circle cx={cx} cy={cy} r="4" fill="#06b6d4" />
      <text x="24" y="306" fill="#0f172a" className="dark:fill-slate-100">{theoremLabel(theorem, x, y, 0)}</text>
    </svg>
  );
}

function theoremLabel(theorem: TheoremId, x: number, y: number, z: number) {
  if (theorem === "angle-sum") return `${x} deg + ${y} deg + ${Math.max(1, 180 - x - y)} deg = 180 deg`;
  if (theorem === "exterior-angle") return `Exterior angle = ${x} deg + ${y} deg = ${x + y} deg`;
  if (theorem === "law-of-cosines") return `c^2 = ${x}^2 + ${y}^2 - 2(${x})(${y})cos(${z} deg)`;
  return theorems.find((item) => item.id === theorem)?.formula ?? "";
}

function changeText(id: TheoremId) {
  if (id === "angle-sum") return "Changing two angles forces the third angle to adjust so the total remains 180 degrees.";
  if (id === "law-of-cosines") return "Changing the included angle changes the opposite side; at 90 degrees this becomes Pythagoras.";
  if (id.includes("circle") || ["thales", "inscribed-angle", "power-of-point", "tangent-radius", "intersecting-chords"].includes(id)) return "Moving the point or angle changes the diagram, while the circle relationship remains invariant.";
  return "Moving the sliders changes lengths or angles, while the theorem relationship remains true.";
}

function stepsFor(id: TheoremId, x: number, y: number, z: number, metrics: Record<string, number>) {
  if (id === "angle-sum") return [`Start with angle A = ${roundTo(x, 1)} degrees.`, `Set angle B = ${roundTo(y, 1)} degrees.`, `The third angle becomes ${roundTo(metrics["Angle C"], 1)} degrees.`, `Total stays ${roundTo(metrics.Total, 1)} degrees.`];
  if (id === "exterior-angle") return [`Look at the outside straight line at the vertex.`, `A straight line measures 180 degrees.`, `The inside angle beside the exterior angle plus the exterior angle makes 180 degrees.`, `The three inside triangle angles also make 180 degrees, so the exterior angle equals the two far inside angles.`];
  if (id === "midpoint") return [`Mark the middle of the two sides.`, `The small top triangle keeps the same angles as the full triangle.`, `Its side lengths are half of the matching full-triangle sides.`, `So the middle segment is parallel to the base and has half the base length.`];
  if (id === "basic-proportionality") return [`Draw a line parallel to the base.`, `Parallel lines create equal corresponding angles.`, `The small triangle and large triangle are similar.`, `Matching sides must keep the same ratio, so AD/DB = AE/EC.`];
  if (id === "similar-triangles") return [`First match equal angles, not side lengths.`, `Equal angles force the two triangles to have the same shape.`, `One triangle is only a scaled copy of the other.`, `Every matching side is multiplied by the same scale factor.`];
  if (id === "thales") return [`Use the diameter as the longest side.`, `Join the circle center to the point on the circle.`, `Those two center-to-point segments are equal radii.`, `The equal-radius angles force the angle on the circle to become 90 degrees.`];
  if (id === "law-of-cosines") return [`Use sides a=${roundTo(x, 1)} and b=${roundTo(y, 1)}.`, `Use included angle C=${roundTo(z, 1)} degrees.`, `Compute c^2 with the cosine correction term.`, `The opposite side is c=${roundTo(metrics["Side c"], 2)}.`];
  if (id === "law-of-sines") return [`Choose two angles.`, `The third angle is ${roundTo(metrics["Angle C"], 1)} degrees.`, `Each side divided by sine of its opposite angle gives the same constant.`, `This lets you solve missing sides or angles.`];
  if (id === "inscribed-angle") return [`Pick the same arc for both angles.`, `The center angle opens across the full arc.`, `The angle on the circle sees the same arc from the edge.`, `The edge angle is always half the center angle.`];
  if (id === "power-of-point") return [`Start from the outside point P.`, `Draw two secants that cut the same circle.`, `The hidden triangles made by the secants are similar.`, `Similarity makes the products PA * PB and PC * PD equal.`];
  if (id === "tangent-radius") return [`Find the exact touch point.`, `Draw the radius from the center to that point.`, `A tangent cannot cut through the circle.`, `So it must meet the radius at a right angle.`];
  if (id === "intersecting-chords") return [`Look at the crossing point E inside the circle.`, `The two chords create pairs of equal angles.`, `Those equal angles create similar small triangles.`, `Similarity gives AE * EB = CE * ED.`];
  return [`Select the theorem card.`, `Move the sliders and watch the marked lengths or angles update.`, `Compare the metric cards on the left.`, `The equality remains true even as the diagram changes.`];
}

function tasksFor(id: TheoremId) {
  if (id === "angle-sum") return ["Set two angles, then predict the third before reading it.", "Make a skinny triangle and check the total.", "Explain why the total is not 200 degrees."];
  if (id === "exterior-angle") return ["Cover the inside angle next to the exterior angle.", "Add the two far inside angles.", "Check the outside angle matches their sum."];
  if (id === "midpoint") return ["Double DE mentally and compare with BC.", "Move the height and check if parallel direction changes.", "Say why midpoint matters."];
  if (id === "basic-proportionality") return ["Move the parallel line upward.", "Compare the two side ratios.", "Explain what would fail if the line was not parallel."];
  if (id === "law-of-cosines") return ["Set the included angle to 90 degrees.", "Compare the formula with Pythagoras.", "Increase the angle and watch side c grow."];
  if (id === "inscribed-angle") return ["Set central angle to 100 degrees.", "Check the inscribed angle is 50 degrees.", "Try another arc size."];
  if (id === "similar-triangles") return ["Set scale to 2.", "Double the base.", "Confirm every matching side scales together."];
  if (id === "thales") return ["Move the point around the circle.", "Check the angle stays 90 degrees.", "Explain why the diameter is special."];
  if (id === "power-of-point") return ["Move the outside point farther away.", "Compare PA * PB with the second secant product.", "Say why the lengths can change but product stays fixed."];
  if (id === "tangent-radius") return ["Move the touch point.", "Find the radius line.", "Check the tangent remains perpendicular."];
  if (id === "intersecting-chords") return ["Move E left and right.", "Multiply the two pieces of each chord.", "Check the products stay equal."];
  return ["Move each slider.", "Read the formula card.", "Use the metric cards to verify the theorem."];
}

function proofIdeaFor(id: TheoremId) {
  const ideas: Record<TheoremId, string> = {
    "angle-sum": "A triangle can be folded or compared with a straight line, so its three angles always make 180 degrees.",
    "exterior-angle": "The outside angle is exactly what remains from the straight line, so it matches the two far inside angles.",
    midpoint: "Midpoints make a half-size copy of the whole triangle.",
    "basic-proportionality": "A parallel line creates a smaller similar triangle inside the larger triangle.",
    "similar-triangles": "Same angles means same shape; only the size changes.",
    thales: "A diameter splits the circle into right-angle triangles from equal radii.",
    "law-of-sines": "Each side is tied to the height of the same triangle, so side divided by sine of the opposite angle is constant.",
    "law-of-cosines": "The cosine term corrects Pythagoras when the angle is not 90 degrees.",
    "inscribed-angle": "An angle at the circle edge sees half as much turn as the angle at the center.",
    "power-of-point": "Two secants from the same point form similar triangles, which force equal products.",
    "tangent-radius": "The shortest line from the center to the tangent is the radius to the touch point, so it is perpendicular.",
    "intersecting-chords": "Crossing chords make similar triangles, which turn segment ratios into equal products.",
  };
  return ideas[id];
}

function misconceptionFor(id: TheoremId) {
  const mistakes: Record<TheoremId, string> = {
    "angle-sum": "Do not add the two given angles and forget the third angle. The theorem is about all three interior angles.",
    "exterior-angle": "The exterior angle is not added to all three inside angles. It equals only the two remote interior angles.",
    midpoint: "A segment between any two side points is not enough. The points must be midpoints.",
    "basic-proportionality": "The ratio theorem needs a line parallel to the third side. Without parallel lines, the ratios may fail.",
    "similar-triangles": "Similar does not mean equal size. Congruent means equal size; similar means same shape.",
    thales: "The 90 degree angle happens only when the side is a diameter of the circle.",
    "law-of-sines": "Match each side with its opposite angle. Mixing adjacent angles gives wrong ratios.",
    "law-of-cosines": "The angle in the cosine term must be the included angle between sides a and b.",
    "inscribed-angle": "The center angle and edge angle must stand on the same arc.",
    "power-of-point": "Use whole secant lengths from P, not only the pieces inside the circle.",
    "tangent-radius": "A tangent touches once. A line that cuts the circle twice is a secant, not a tangent.",
    "intersecting-chords": "Multiply the two pieces of the same chord, not neighboring pieces from different chords.",
  };
  return mistakes[id];
}

function teacherPromptFor(id: TheoremId) {
  const prompts: Record<TheoremId, string> = {
    "angle-sum": "Can you predict the missing angle without calculating all over again?",
    "exterior-angle": "Which two inside angles are far away from the exterior angle?",
    midpoint: "What changed: size, direction, or shape?",
    "basic-proportionality": "Where do you see the smaller triangle hiding?",
    "similar-triangles": "Point to matching angles first, then matching sides.",
    thales: "Where is the diameter, and where is the right angle?",
    "law-of-sines": "Which side is opposite this angle?",
    "law-of-cosines": "What happens when the angle becomes 90 degrees?",
    "inscribed-angle": "Are both angles looking at the same arc?",
    "power-of-point": "Which lengths start at point P?",
    "tangent-radius": "Can a tangent lean without cutting the circle?",
    "intersecting-chords": "Which two pieces belong to one chord?",
  };
  return prompts[id];
}

function deg(value: number) {
  return (value * Math.PI) / 180;
}

function lerp(a: { x: number; y: number }, b: { x: number; y: number }, t: number) {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

function pointOnCircle(cx: number, cy: number, r: number, angle: number) {
  return { x: cx + r * Math.cos(deg(angle)), y: cy + r * Math.sin(deg(angle)) };
}
