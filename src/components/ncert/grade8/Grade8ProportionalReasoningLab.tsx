import { useMemo, useState, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import FormulaBlock from "../../ui/FormulaBlock";
import NCERTTabbedWorkspace from "../layout/NCERTTabbedWorkspace";
import {
  areRatiosEquivalent,
  divideWholeInRatio,
  generateProportionTable,
  getActualDistanceFromMapScale,
  getDirectProportionValue,
  getInverseProportionValue,
  getMapDistanceFromActualScale,
  getPieAnglesFromRatio,
  getPiePercentagesFromRatio,
  getRepresentativeFraction,
  simplifyRatio,
  type LengthUnit,
  type RelationshipType,
  round,
} from "./proportionalReasoningMath";

const tabIds = ["equivalent-ratios", "map-scale", "ratio-splitter", "pie-ratio", "direct-inverse", "practice"];

export default function Grade8ProportionalReasoningLab() {
  const [searchParams] = useSearchParams();
  const requestedTab = searchParams.get("tab") ?? "";
  const defaultTabId = tabIds.includes(requestedTab) ? requestedTab : "equivalent-ratios";

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-cyan-200 bg-white/95 p-5 shadow-sm dark:border-cyan-300/20 dark:bg-slate-950/80">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-700 dark:text-cyan-200">Class 8 - Ganita Prakash Part II - Chapter 3 - hegp203.pdf</p>
            <h1 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">Proportional Reasoning-2</h1>
            <p className="mt-2 max-w-4xl text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">
              Work with equivalent ratios, cross multiplication, representative fractions, map scale, multi-term sharing, pie slices, and direct/inverse proportion.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {["ratio", "map scale", "pie chart", "inverse proportion"].map((item) => <Badge key={item}>{item}</Badge>)}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <ResourceLink to="/formulas/proportional-reasoning-2" label="Formula category" />
          <ResourceLink to="/visual-formulas/proportional-reasoning-2" label="Visual formulas" />
          <ResourceLink to="/problem-solver" label="Solver" />
          <ResourceLink to="/ncert/class-8-fractals-and-solid-views" label="Next: Fractals and Solid Views" />
        </div>
      </section>

      <NCERTTabbedWorkspace
        ariaLabel="Class 8 proportional reasoning tabs"
        defaultTabId={defaultTabId}
        tabs={[
          { id: "equivalent-ratios", label: "Ratios", badge: "cross", content: <EquivalentRatiosTab /> },
          { id: "map-scale", label: "Map Scale", badge: "RF", content: <MapScaleTab /> },
          { id: "ratio-splitter", label: "Splitter", badge: "shares", content: <RatioSplitterTab /> },
          { id: "pie-ratio", label: "Pie Ratio", badge: "360 deg", content: <PieRatioTab /> },
          { id: "direct-inverse", label: "Direct/Inverse", badge: "k", content: <DirectInverseTab /> },
          { id: "practice", label: "Practice", badge: "score", content: <PracticeTab /> },
        ]}
      />
    </div>
  );
}

function EquivalentRatiosTab() {
  const [a, setA] = useState(2);
  const [b, setB] = useState(3);
  const [c, setC] = useState(8);
  const [d, setD] = useState(12);
  const [missingMode, setMissingMode] = useState(false);
  const ad = a * d;
  const bc = b * c;
  const equivalent = areRatiosEquivalent([a, b], [c, d]);
  const missingD = b * c / a;
  const simplifiedLeft = simplifyRatio([a, b]).join(":");
  const simplifiedRight = simplifyRatio([c, d]).join(":");
  return (
    <TwoColumn title="Cross multiplication and equivalent ratios" aside={<FormulaBlock title="Cross multiplication principle" formula="\\frac{a}{b}=\\frac{c}{d}\\iff ad=bc" explanation="For non-zero denominators, equal ratios have equal cross-products." />}>
      <ControlGrid>
        <NumberInput label="A" value={a} onChange={setA} />
        <NumberInput label="B" value={b} onChange={setB} />
        <NumberInput label="C" value={c} onChange={setC} />
        <NumberInput label="D" value={d} onChange={setD} />
      </ControlGrid>
      <div className="mt-3 flex flex-wrap gap-2">
        <button className="action-secondary" type="button" onClick={() => setMissingMode((value) => !value)}>Missing value mode</button>
        <button className="action-secondary" type="button" onClick={() => { setA(3); setB(5); setC(12); setD(20); }}>Generate example</button>
        <button className="action-secondary" type="button" onClick={() => { setA(2); setB(3); setC(8); setD(12); }}>Reset</button>
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <Metric label="Ratio form" value={`${a}/${b} ${equivalent ? "=" : "!="} ${c}/${d}`} />
        <Metric label="Cross products" value={`${a} x ${d}=${ad}, ${b} x ${c}=${bc}`} />
        <Metric label="Verdict" value={equivalent ? "Equivalent" : "Not equivalent"} />
      </div>
      {missingMode && <p className="mt-3 rounded-2xl bg-cyan-50 p-3 text-sm font-bold text-cyan-900">If {a}/{b} = {c}/d, then d = ({b} x {c}) / {a} = {round(missingD, 4)}.</p>}
      <BarComparison left={[a, b]} right={[c, d]} />
      <p className="mt-3 text-sm font-semibold text-slate-600 dark:text-slate-300">Simplified forms: {simplifiedLeft} and {simplifiedRight}. Equal simplified forms mean equal ratios.</p>
    </TwoColumn>
  );
}

function MapScaleTab() {
  const [mode, setMode] = useState<"rf" | "actual" | "map">("actual");
  const [mapDistance, setMapDistance] = useState(3.2);
  const [mapUnit, setMapUnit] = useState<LengthUnit>("cm");
  const [actualDistance, setActualDistance] = useState(1.6);
  const [actualUnit, setActualUnit] = useState<LengthUnit>("km");
  const [scaleDenominator, setScaleDenominator] = useState(50000);
  const result = useMemo(() => {
    try {
      if (mode === "rf") return getRepresentativeFraction({ mapDistance, actualDistance, mapUnit, actualUnit });
      if (mode === "actual") return getActualDistanceFromMapScale({ mapDistance, scaleDenominator, mapUnit, outputUnit: actualUnit });
      return getMapDistanceFromActualScale({ actualDistance, scaleDenominator, actualUnit, outputUnit: mapUnit });
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Invalid scale input.", steps: [] };
    }
  }, [actualDistance, actualUnit, mapDistance, mapUnit, mode, scaleDenominator]);

  return (
    <TwoColumn title="Map scale and representative fraction lab" aside={<FormulaBlock title="Representative fraction" formula="RF=\\frac{map\\ distance}{actual\\ distance}=1:n" explanation="Convert both distances to the same unit before making the ratio." />}>
      <div className="grid gap-3 md:grid-cols-3">
        <Select label="Mode" value={mode} onChange={(v) => setMode(v as typeof mode)} options={[["rf", "Find RF"], ["actual", "Find actual"], ["map", "Find map"]]} />
        <NumberInput label="Map distance" value={mapDistance} onChange={setMapDistance} />
        <UnitSelect label="Map unit" value={mapUnit} onChange={setMapUnit} />
        <NumberInput label="Actual distance" value={actualDistance} onChange={setActualDistance} />
        <UnitSelect label="Actual unit" value={actualUnit} onChange={setActualUnit} />
        <NumberInput label="Scale denominator" value={scaleDenominator} onChange={setScaleDenominator} />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button className="action-secondary" type="button" onClick={() => { setMapDistance(5); setMapUnit("cm"); setActualDistance(250); setActualUnit("m"); setScaleDenominator(5000); }}>Classroom plan</button>
        <button className="action-secondary" type="button" onClick={() => { setMapDistance(4); setMapUnit("cm"); setActualDistance(2); setActualUnit("km"); setScaleDenominator(50000); }}>City map</button>
        <button className="action-secondary" type="button" onClick={() => setMode(mode === "actual" ? "map" : "actual")}>Swap mode</button>
      </div>
      <ResultPanel result={result} />
      <ScaleBar mapDistance={mapDistance} mapUnit={mapUnit} scaleDenominator={scaleDenominator} />
    </TwoColumn>
  );
}

function RatioSplitterTab() {
  const [total, setTotal] = useState(900);
  const [parts, setParts] = useState([2, 3, 4]);
  const shares = divideWholeInRatio(total, parts);
  const sum = parts.reduce((acc, part) => acc + part, 0);
  return (
    <TwoColumn title="Multi-term ratio splitter" aside={<FormulaBlock title="Share formula" formula="share=T\\times\\frac{part}{sum\\ of\\ parts}" explanation="A ratio part is a fraction of the total number of parts." />}>
      <NumberInput label="Total" value={total} onChange={setTotal} />
      <PartEditor parts={parts} setParts={setParts} />
      <div className="mt-3 flex flex-wrap gap-2">
        <button className="action-secondary" type="button" onClick={() => setParts(simplifyRatio(parts))}>Normalize ratio</button>
        <button className="action-secondary" type="button" onClick={() => { setTotal(120); setParts([1, 2, 3]); }}>Students example</button>
        <button className="action-secondary" type="button" onClick={() => { setTotal(900); setParts([2, 3, 4]); }}>Reset</button>
      </div>
      <StackedBar parts={parts} values={shares} />
      <Table rows={parts.map((part, i) => [`Part ${i + 1}`, `${part}/${sum}`, round(shares[i], 4)])} />
    </TwoColumn>
  );
}

function PieRatioTab() {
  const [parts, setParts] = useState([2, 3, 4]);
  const [total, setTotal] = useState(900);
  const [view, setView] = useState<"angle" | "percentage" | "quantity">("angle");
  const angles = getPieAnglesFromRatio(parts);
  const percentages = getPiePercentagesFromRatio(parts);
  const quantities = divideWholeInRatio(total, parts);
  return (
    <TwoColumn title="Pie ratio and percentage visualizer" aside={<FormulaBlock title="Pie angle" formula="\\theta_i=\\frac{p_i}{\\sum p_i}\\times360^\\circ" explanation="Pie sectors are proportional to their ratio parts." />}>
      <PartEditor parts={parts} setParts={setParts} />
      <NumberInput label="Total quantity" value={total} onChange={setTotal} />
      <Select label="View" value={view} onChange={(v) => setView(v as typeof view)} options={[["angle", "Angle"], ["percentage", "Percentage"], ["quantity", "Quantity"]]} />
      <PieSvg angles={angles} />
      <Table rows={parts.map((part, i) => [`Part ${i + 1}`, view === "angle" ? `${angles[i]} deg` : view === "percentage" ? `${percentages[i]}%` : round(quantities[i], 4), `${part} part(s)`])} />
    </TwoColumn>
  );
}

function DirectInverseTab() {
  const [type, setType] = useState<RelationshipType>("inverse");
  const [x1, setX1] = useState(6);
  const [y1, setY1] = useState(10);
  const [x2, setX2] = useState(12);
  const result = type === "direct" ? getDirectProportionValue({ x1, y1, x2 }) : getInverseProportionValue({ x1, y1, x2 });
  const table = generateProportionTable({ relationshipType: type, constant: result.constant, xValues: [1, 2, 3, 4, 5, 6].map((n) => n * (type === "inverse" ? 2 : 1)) });
  return (
    <TwoColumn title="Direct and inverse proportion lab" aside={<FormulaBlock title={type === "direct" ? "Direct proportion" : "Inverse proportion"} formula={type === "direct" ? "\\frac{y}{x}=k" : "xy=k"} explanation={type === "direct" ? "The ratio stays constant." : "The product stays constant."} />}>
      <div className="grid gap-3 md:grid-cols-4">
        <Select label="Relationship" value={type} onChange={(v) => setType(v as RelationshipType)} options={[["direct", "Direct"], ["inverse", "Inverse"]]} />
        <NumberInput label="x1" value={x1} onChange={setX1} />
        <NumberInput label="y1" value={y1} onChange={setY1} />
        <NumberInput label="x2" value={x2} onChange={setX2} />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button className="action-secondary" type="button" onClick={() => { setType("inverse"); setX1(6); setY1(10); setX2(12); }}>Workers and days</button>
        <button className="action-secondary" type="button" onClick={() => { setType("direct"); setX1(4); setY1(20); setX2(7); }}>Cost and quantity</button>
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <Metric label="Constant" value={round(result.constant, 4)} />
        <Metric label="y2" value={round(result.y2, 4)} />
        <Metric label="Model" value={type === "direct" ? "line" : "hyperbola"} />
      </div>
      <GraphSvg table={table} type={type} />
      <Table rows={table.map((row) => [row.x, round(row.y, 4), type === "direct" ? `y/x=${round(row.y / row.x, 4)}` : `xy=${round(row.x * row.y, 4)}`])} />
      <p className="mt-3 rounded-2xl bg-amber-50 p-3 text-sm font-bold text-amber-900">Common mistake: inverse proportion is not solved by the direct formula. Use constant product, not constant ratio.</p>
    </TwoColumn>
  );
}

function PracticeTab() {
  const questions = [
    ["Equivalent ratio", "Is 6:9 equivalent to 10:15?", areRatiosEquivalent([6, 9], [10, 15]) ? "Yes, both simplify to 2:3." : "No."],
    ["Map scale", "Scale 1:50000 and map distance 3.2 cm.", `${getActualDistanceFromMapScale({ mapDistance: 3.2, scaleDenominator: 50000, mapUnit: "cm", outputUnit: "km" }).actual} km`],
    ["Ratio split", "Divide 900 in 2:3:4.", divideWholeInRatio(900, [2, 3, 4]).join(", ")],
    ["Pie angle", "Angle for first part in 2:3:4.", `${getPieAnglesFromRatio([2, 3, 4])[0]} deg`],
  ];
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {questions.map(([title, prompt, answer]) => <InfoCard key={title} title={title} text={`${prompt} Answer: ${answer}`} />)}
      <InfoCard title="Teacher note" text="Use the tabs as stations: ratio check, map scale, sharing, pie chart, and inverse proportion." />
      <InfoCard title="Back/next" text="Previous exact Chapter 2 route is not linked until implemented. Next chapter: Fractals and Solid Views." />
    </div>
  );
}

function TwoColumn({ title, children, aside }: { title: string; children: ReactNode; aside: ReactNode }) {
  return <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_330px]"><section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/70"><h2 className="text-lg font-black">{title}</h2>{children}</section><aside className="space-y-3">{aside}<ResourceLink to="/visual-formulas/proportional-reasoning-2" label="Open visual formula" /><ResourceLink to="/problem-solver" label="Try in solver" /></aside></div>;
}

function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return <label className="block rounded-xl bg-slate-100 p-3 text-sm font-black dark:bg-white/10">{label}<input className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono dark:border-white/10 dark:bg-slate-950" type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} /></label>;
}

function UnitSelect({ label, value, onChange }: { label: string; value: LengthUnit; onChange: (value: LengthUnit) => void }) {
  return <Select label={label} value={value} onChange={(v) => onChange(v as LengthUnit)} options={[["mm", "mm"], ["cm", "cm"], ["m", "m"], ["km", "km"]]} />;
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: Array<[string, string]> }) {
  return <label className="block rounded-xl bg-slate-100 p-3 text-sm font-black dark:bg-white/10">{label}<select className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-slate-950" value={value} onChange={(e) => onChange(e.target.value)}>{options.map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label>;
}

function ControlGrid({ children }: { children: ReactNode }) {
  return <div className="mt-3 grid gap-3 md:grid-cols-4">{children}</div>;
}

function Badge({ children }: { children: ReactNode }) {
  return <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-2 text-xs font-black text-cyan-900 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-50">{children}</span>;
}

function ResourceLink({ to, label }: { to: string; label: string }) {
  return <Link to={to} className="action-secondary">{label}</Link>;
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-xl bg-slate-100 p-3 dark:bg-white/10"><p className="text-xs font-black uppercase text-slate-500">{label}</p><p className="mt-1 text-lg font-black">{value}</p></div>;
}

function ResultPanel({ result }: { result: { steps?: string[]; error?: string; text?: string; denominator?: number; actual?: number; map?: number } }) {
  return <div className="mt-4 rounded-2xl bg-cyan-50 p-4 text-sm font-bold text-cyan-950">{result.error ? result.error : <><p className="text-lg font-black">{result.text ?? (result.actual !== undefined ? `Actual = ${round(result.actual, 6)}` : result.map !== undefined ? `Map = ${round(result.map, 6)}` : "")}</p>{result.steps?.map((step) => <p key={step} className="mt-1">{step}</p>)}</>}</div>;
}

function BarComparison({ left, right }: { left: number[]; right: number[] }) {
  return <div className="mt-4 grid gap-3"><StackedBar parts={left} values={left} /><StackedBar parts={right} values={right} /></div>;
}

function StackedBar({ parts, values }: { parts: number[]; values: number[] }) {
  const sum = parts.reduce((a, b) => a + b, 0);
  const colors = ["#22d3ee", "#a78bfa", "#f59e0b", "#34d399", "#fb7185"];
  return <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white"><div className="flex h-14">{parts.map((part, i) => <div key={i} className="flex items-center justify-center text-xs font-black text-slate-950" style={{ width: `${(part / sum) * 100}%`, background: colors[i] }}>{round(values[i], 2)}</div>)}</div></div>;
}

function PartEditor({ parts, setParts }: { parts: number[]; setParts: (parts: number[]) => void }) {
  return <div className="mt-3 grid gap-2 md:grid-cols-5">{parts.map((part, i) => <NumberInput key={i} label={`Part ${i + 1}`} value={part} onChange={(v) => setParts(parts.map((p, idx) => idx === i ? Math.max(1, v) : p))} />)}<button type="button" className="action-secondary" onClick={() => setParts(parts.length < 5 ? [...parts, 1] : parts)}>Add</button><button type="button" className="action-secondary" onClick={() => setParts(parts.length > 2 ? parts.slice(0, -1) : parts)}>Remove</button></div>;
}

function Table({ rows }: { rows: Array<Array<string | number>> }) {
  return <div className="mt-3 overflow-x-auto rounded-2xl border border-slate-200"><table className="w-full text-left text-sm"><tbody>{rows.map((row, i) => <tr key={i} className="border-t border-slate-100 first:border-0">{row.map((cell, j) => <td key={j} className="px-3 py-2 font-semibold">{cell}</td>)}</tr>)}</tbody></table></div>;
}

function ScaleBar({ mapDistance, mapUnit, scaleDenominator }: { mapDistance: number; mapUnit: LengthUnit; scaleDenominator: number }) {
  return <svg viewBox="0 0 620 160" className="mt-4 h-40 w-full rounded-2xl bg-slate-950"><line x1="80" y1="80" x2="540" y2="80" stroke="#22d3ee" strokeWidth="10" /><text x="80" y="55" fill="#e0f2fe" fontWeight="900">{mapDistance} {mapUnit} on map</text><text x="270" y="125" fill="#facc15" fontWeight="900">scale 1:{scaleDenominator}</text></svg>;
}

function PieSvg({ angles }: { angles: number[] }) {
  let start = -90;
  const colors = ["#22d3ee", "#a78bfa", "#f59e0b", "#34d399", "#fb7185"];
  return <svg viewBox="0 0 320 240" className="mt-4 h-60 w-full rounded-2xl bg-slate-950">{angles.map((angle, i) => { const path = sectorPath(160, 120, 88, start, start + angle); start += angle; return <path key={i} d={path} fill={colors[i]} stroke="#020617" strokeWidth="3" />; })}<circle cx="160" cy="120" r="4" fill="#fff" /></svg>;
}

function sectorPath(cx: number, cy: number, r: number, start: number, end: number) {
  const a = (deg: number) => ({ x: cx + r * Math.cos((Math.PI / 180) * deg), y: cy + r * Math.sin((Math.PI / 180) * deg) });
  const s = a(start), e = a(end);
  return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${end - start > 180 ? 1 : 0} 1 ${e.x} ${e.y} Z`;
}

function GraphSvg({ table, type }: { table: Array<{ x: number; y: number }>; type: RelationshipType }) {
  const maxX = Math.max(...table.map((p) => p.x), 1);
  const maxY = Math.max(...table.map((p) => p.y), 1);
  const points = table.map((p) => `${50 + (p.x / maxX) * 260},${210 - (p.y / maxY) * 160}`).join(" ");
  return <svg viewBox="0 0 360 240" className="mt-4 h-60 w-full rounded-2xl bg-slate-950"><line x1="45" y1="210" x2="330" y2="210" stroke="#e0f2fe" /><line x1="50" y1="25" x2="50" y2="215" stroke="#e0f2fe" /><polyline points={points} fill="none" stroke={type === "direct" ? "#22d3ee" : "#f59e0b"} strokeWidth="4" />{table.map((p) => <circle key={`${p.x}-${p.y}`} cx={50 + (p.x / maxX) * 260} cy={210 - (p.y / maxY) * 160} r="5" fill="#fff" />)}</svg>;
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/70"><h3 className="font-black">{title}</h3><p className="mt-2 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">{text}</p></div>;
}
