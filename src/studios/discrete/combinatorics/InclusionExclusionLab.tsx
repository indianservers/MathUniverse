import { useEffect, useState } from "react";
import { regionTotals, surveyToRegions, threeSetUnion, twoSetUnion } from "./combinatoricsMath";
import { parseIeKind } from "./combinatoricsMode";
import { ChallengeCard, ComboWorkspace, FormulaCard, LiveRow, Seg, Slider } from "./combinatoricsUi";

const CHALLENGES = [
  { prompt: "A=30, B=25, overlap=8. Find |A ∪ B|.", expected: 47, hint: "30+25−8.", proof: "30+25−8=47" },
  { prompt: "A=20, B=15, A∩B=5. Union?", expected: 30, hint: "Add then subtract the overlap.", proof: "20+15−5=30" },
  { prompt: "Survey: 40+35+30−15−12−10+5. At least one subject?", expected: 73, hint: "Inclusion–exclusion with three sets.", proof: "73" },
];

const SURVEY = { math: 40, physics: 35, cs: 30, mp: 15, mc: 12, pc: 10, all: 5 };

export default function InclusionExclusionLab({
  kindRaw,
  setKind,
  pulse,
}: {
  kindRaw: string | null;
  setKind: (id: string) => void;
  pulse: string;
}) {
  const kind = parseIeKind(kindRaw);
  const [collapsed, setCollapsed] = useState(false);
  const [a, setA] = useState(20);
  const [b, setB] = useState(15);
  const [c, setC] = useState(18);
  const [ab, setAb] = useState(5);
  const [ac, setAc] = useState(4);
  const [bc, setBc] = useState(3);
  const [abc, setAbc] = useState(2);
  const [universe, setU] = useState(50);
  const [regions, setRegions] = useState({ a: 12, b: 8, c: 6, ab: 4, ac: 3, bc: 2, abc: 2 });
  const [step, setStep] = useState(0);
  const [showCounts, setShowCounts] = useState(true);
  const [ch, setCh] = useState(0);

  useEffect(() => {
    if (kind === "two") { setA(20); setB(15); setAb(5); setU(50); setStep(0); }
    if (kind === "three") { setA(20); setB(15); setC(18); setAb(6); setAc(5); setBc(4); setAbc(2); }
    if (kind === "survey") {
      const r = surveyToRegions(SURVEY);
      setRegions(r);
      setA(SURVEY.math); setB(SURVEY.physics); setC(SURVEY.cs); setAb(SURVEY.mp); setAc(SURVEY.mc); setBc(SURVEY.pc); setAbc(SURVEY.all);
    }
    if (kind === "regions") setRegions({ a: 12, b: 8, c: 6, ab: 4, ac: 3, bc: 2, abc: 2 });
    if (kind === "complement") { setA(20); setB(15); setAb(5); setU(50); }
  }, [kind]);

  const twoUnion = twoSetUnion(a, b, ab);
  const threeUnion = threeSetUnion(a, b, c, ab, ac, bc, abc);
  const totals = regionTotals(regions);
  const none = Math.max(0, universe - (kind === "three" || kind === "survey" ? threeUnion : twoUnion));
  const challenge = CHALLENGES[ch % CHALLENGES.length]!;

  const union = kind === "regions" || kind === "survey" ? totals.union : kind === "two" || kind === "complement" ? twoUnion : threeUnion;

  return (
    <ComboWorkspace
      theme="ie"
      collapsed={collapsed}
      onToggle={() => setCollapsed((v) => !v)}
      controls={
        <>
          <h2>Set counting</h2>
          <Seg
            value={kind}
            onChange={setKind}
            options={[
              { id: "two", label: "Two sets" },
              { id: "three", label: "Three sets" },
              { id: "survey", label: "Survey" },
              { id: "complement", label: "Complement" },
              { id: "regions", label: "Region-first" },
            ]}
          />
          {kind === "regions" ? (
            <>
              {(["a", "b", "c", "ab", "ac", "bc", "abc"] as const).map((key) => (
                <Slider key={key} label={key.toUpperCase()} value={regions[key]} min={0} max={20} onChange={(v) => setRegions((cur) => ({ ...cur, [key]: v }))} />
              ))}
            </>
          ) : kind === "survey" ? (
            <p className="combo-note">40 Math · 35 Physics · 30 CS · 15 M∩P · 12 M∩CS · 10 P∩CS · 5 all three.</p>
          ) : (
            <>
              <Slider label="|A|" value={a} min={0} max={40} onChange={setA} />
              <Slider label="|B|" value={b} min={0} max={40} onChange={setB} />
              {kind === "three" ? <Slider label="|C|" value={c} min={0} max={40} onChange={setC} /> : null}
              <Slider label="|A ∩ B|" value={ab} min={0} max={Math.min(a, b)} onChange={setAb} />
              {kind === "three" ? (
                <>
                  <Slider label="|A ∩ C|" value={ac} min={0} max={Math.min(a, c)} onChange={setAc} />
                  <Slider label="|B ∩ C|" value={bc} min={0} max={Math.min(b, c)} onChange={setBc} />
                  <Slider label="|A ∩ B ∩ C|" value={abc} min={0} max={Math.min(ab, ac, bc)} onChange={setAbc} />
                </>
              ) : null}
              {kind === "complement" || kind === "two" ? <Slider label="Universe" value={universe} min={union} max={80} onChange={setU} /> : null}
            </>
          )}
          <label className="combo-note"><input type="checkbox" checked={showCounts} onChange={(e) => setShowCounts(e.target.checked)} /> Show region counts</label>
          <div className="combo-btn-row">
            <button type="button" className="combo-ghost" onClick={() => setStep(0)}>Reset shade</button>
            <button type="button" className="combo-primary" onClick={() => setStep((s) => (s + 1) % 5)}>Animate step</button>
          </div>
        </>
      }
      viz={
        <>
          <h2 className={pulse === "observe" ? "combo-focus" : undefined}>Venn diagram</h2>
          <Venn
            two={kind === "two" || kind === "complement"}
            step={step}
            showCounts={showCounts}
            labels={kind === "survey" ? ["Math", "Physics", "CS"] : ["A", "B", "C"]}
            counts={kind === "regions" || kind === "survey" ? regions : {
              a: Math.max(0, a - ab - (kind === "three" ? ac - abc : 0)),
              b: Math.max(0, b - ab - (kind === "three" ? bc - abc : 0)),
              c: kind === "three" ? Math.max(0, c - ac - bc + abc) : 0,
              ab: Math.max(0, ab - (kind === "three" ? abc : 0)),
              ac: kind === "three" ? Math.max(0, ac - abc) : 0,
              bc: kind === "three" ? Math.max(0, bc - abc) : 0,
              abc: kind === "three" ? abc : 0,
            }}
            highlightNone={kind === "complement"}
          />
          <ol className="combo-note">
            {kind === "two" || kind === "complement" ? (
              <>
                <li>Shade A ({a})</li>
                <li>Shade B ({b}) — overlap counted twice</li>
                <li>Subtract |A ∩ B| = {ab}</li>
                <li>|A ∪ B| = {a} + {b} − {ab} = {twoUnion}</li>
              </>
            ) : (
              <>
                <li>Add |A|+|B|+|C| = {a + b + c}</li>
                <li>Subtract pairwise overlaps {ab}+{ac}+{bc}</li>
                <li>Add triple {abc} back</li>
                <li>Union = {threeUnion}</li>
              </>
            )}
          </ol>
        </>
      }
      insights={
        <>
          <h2>Live values</h2>
          <LiveRow color="#147df2" label="|A|" value={kind === "regions" || kind === "survey" ? totals.A : a} />
          <LiveRow color="#8b45f4" label="|B|" value={kind === "regions" || kind === "survey" ? totals.B : b} />
          {kind !== "two" && kind !== "complement" ? <LiveRow color="#10b981" label="|C|" value={kind === "regions" || kind === "survey" ? totals.C : c} /> : null}
          <LiveRow color="#f59e0b" label="Union" value={union} />
          {kind === "complement" ? <LiveRow color="#64748b" label="None" value={none} /> : null}
          {kind === "two" || kind === "complement" ? <FormulaCard title="Two sets" formula="|A ∪ B| = |A| + |B| − |A ∩ B|" note="Intersection is counted twice before subtraction." /> : null}
          {kind === "three" || kind === "survey" ? <FormulaCard title="Three sets" formula="|A∪B∪C| = |A|+|B|+|C| − |A∩B|−|A∩C|−|B∩C| + |A∩B∩C|" /> : null}
          {kind === "complement" ? <FormulaCard title="Complement" formula="desired = total − none" note={`${universe} − ${none} people in at least one set = ${universe - none}.`} /> : null}
          {kind === "regions" ? <FormulaCard title="Region-first" formula="Set totals are sums of disjoint regions" note="Impossible overlaps cannot occur because you edit atoms directly." /> : null}
          <ChallengeCard {...challenge} onNew={() => setCh((c) => c + 1)} />
        </>
      }
    />
  );
}

function Venn({
  two,
  step,
  showCounts,
  labels,
  counts,
  highlightNone,
}: {
  two: boolean;
  step: number;
  showCounts: boolean;
  labels: string[];
  counts: { a: number; b: number; c: number; ab: number; ac: number; bc: number; abc: number };
  highlightNone: boolean;
}) {
  const aFill = step >= 1 ? "rgba(20,125,242,.28)" : "rgba(20,125,242,.12)";
  const bFill = step >= 2 ? "rgba(139,69,244,.28)" : "rgba(139,69,244,.12)";
  const cFill = step >= 1 && !two ? "rgba(16,185,129,.22)" : "rgba(16,185,129,.1)";
  return (
    <svg className="combo-venn" viewBox="0 0 420 320" role="img" aria-label="Venn diagram">
      <rect width="420" height="320" fill={highlightNone ? "#eef6ff" : "#f7fbff"} />
      <rect x="18" y="18" width="384" height="284" rx="16" fill={highlightNone && step >= 3 ? "#dbeafe" : "#fff"} stroke="#dce7f4" />
      <circle cx={two ? 168 : 150} cy="150" r="88" fill={aFill} stroke="#147df2" strokeWidth="2" />
      <circle cx={two ? 252 : 250} cy="150" r="88" fill={bFill} stroke="#8b45f4" strokeWidth="2" />
      {!two ? <circle cx="200" cy="220" r="88" fill={cFill} stroke="#10b981" strokeWidth="2" /> : null}
      {step >= 3 ? <circle cx={two ? 210 : 200} cy={two ? 150 : 175} r="28" fill="rgba(245,158,11,.45)" /> : null}
      <text x="110" y="80" fill="#147df2" fontWeight="800">{labels[0]}</text>
      <text x="290" y="80" fill="#8b45f4" fontWeight="800">{labels[1]}</text>
      {!two ? <text x="188" y="300" fill="#10b981" fontWeight="800">{labels[2]}</text> : null}
      {showCounts ? (
        <>
          <text x={two ? 118 : 108} y="148" fontSize="13" fontWeight="800" fill="#147df2">{showCounts ? counts.a : ""}</text>
          <text x={two ? 292 : 298} y="148" fontSize="13" fontWeight="800" fill="#8b45f4">{showCounts ? counts.b : ""}</text>
          {two ? <text x="198" y="154" fontSize="13" fontWeight="800" fill="#b45309">{showCounts ? counts.ab : ""}</text> : (
            <>
              <text x="198" y="258" fontSize="13" fontWeight="800" fill="#047857">{showCounts ? counts.c : ""}</text>
              <text x="198" y="138" fontSize="12" fontWeight="800">{showCounts ? counts.ab : ""}</text>
              <text x="142" y="204" fontSize="12" fontWeight="800">{showCounts ? counts.ac : ""}</text>
              <text x="252" y="204" fontSize="12" fontWeight="800">{showCounts ? counts.bc : ""}</text>
              <text x="194" y="186" fontSize="12" fontWeight="800" fill="#b45309">{showCounts ? counts.abc : ""}</text>
            </>
          )}
        </>
      ) : null}
    </svg>
  );
}
