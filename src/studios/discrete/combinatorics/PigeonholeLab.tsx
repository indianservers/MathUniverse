import { useEffect, useState } from "react";
import { ceilDivision, evenOccupancy, occupancyMax, randomOccupancy, worstOccupancy } from "./combinatoricsMath";
import { parsePigKind } from "./combinatoricsMode";
import { ChallengeCard, ComboWorkspace, FormulaCard, LiveRow, Seg, Slider, tokenColor } from "./combinatoricsUi";

const PRESETS = [
  { id: "months", label: "Birth months", n: 13, m: 12, note: "13 people, 12 months → at least two share a month." },
  { id: "socks", label: "Sock colors", n: 11, m: 5, note: "11 socks, 5 colors. Guaranteed occupancy ceil(11/5)=3." },
  { id: "birthdays", label: "Birthdays", n: 366, m: 365, note: "366 people, 365 dates → at least two share a birthday." },
  { id: "remainders", label: "Remainders", n: 7, m: 3, note: "7 integers into 3 residue classes. ceil(7/3)=3." },
];

const CHALLENGES = [
  { prompt: "17 objects in 5 boxes. What occupancy is guaranteed?", expected: 4, hint: "ceil(17/5).", proof: "ceil(17/5)=4" },
  { prompt: "How many students guarantee at least 3 share a birth month?", expected: 25, hint: "Worst case 2×12=24, then +1.", proof: "12×2+1=25" },
  { prompt: "13 objects, 4 boxes. Guaranteed max occupancy?", expected: 4, hint: "ceil(13/4).", proof: "Even split 4,3,3,3." },
];

export default function PigeonholeLab({
  kindRaw,
  setKind,
  pulse,
}: {
  kindRaw: string | null;
  setKind: (id: string) => void;
  pulse: string;
}) {
  const kind = parsePigKind(kindRaw);
  const [collapsed, setCollapsed] = useState(false);
  const [n, setN] = useState(5);
  const [m, setM] = useState(4);
  const [dist, setDist] = useState<number[]>([2, 1, 1, 1]);
  const [mode, setMode] = useState("manual");
  const [drag, setDrag] = useState<number | null>(null);
  const [ch, setCh] = useState(0);
  const [preset, setPreset] = useState("months");

  const applyDist = (next: number[]) => setDist(next);

  useEffect(() => {
    if (kind === "basic") { setN(5); setM(4); applyDist(worstOccupancy(5, 4)); }
    if (kind === "generalized") { setN(13); setM(4); applyDist(evenOccupancy(13, 4)); }
    if (kind === "examples") {
      const p = PRESETS[0]!;
      setN(p.n); setM(p.m); applyDist(evenOccupancy(Math.min(p.n, 24), p.m));
    }
    if (kind === "challenge") { setN(17); setM(5); applyDist(evenOccupancy(17, 5)); }
  }, [kind]);

  const guaranteed = ceilDivision(n, m);
  const maxOcc = occupancyMax(dist);
  const displayN = Math.min(n, 36);
  const displayM = Math.min(m, 12);
  const challenge = CHALLENGES[ch % CHALLENGES.length]!;

  const redistribute = (style: string) => {
    setMode(style);
    const boxes = Math.max(1, displayM);
    if (style === "even") applyDist(evenOccupancy(displayN, boxes));
    if (style === "worst") applyDist(worstOccupancy(displayN, boxes));
    if (style === "random") applyDist(randomOccupancy(displayN, boxes));
  };

  const moveTo = (box: number) => {
    if (drag == null) return;
    setDist((current) => {
      const next = [...current];
      if (next[drag]! > 0) next[drag] -= 1;
      next[box] = (next[box] ?? 0) + 1;
      return next;
    });
    setDrag(null);
  };

  return (
    <ComboWorkspace
      collapsed={collapsed}
      onToggle={() => setCollapsed((v) => !v)}
      controls={
        <>
          <h2>Pigeonhole setup</h2>
          <Seg
            value={kind}
            onChange={setKind}
            options={[
              { id: "basic", label: "Basic demo" },
              { id: "generalized", label: "Generalized" },
              { id: "examples", label: "Examples" },
              { id: "challenge", label: "Challenge" },
            ]}
          />
          <Slider label="Objects n" value={n} min={2} max={kind === "examples" ? 366 : 24} onChange={(v) => { setN(v); applyDist(evenOccupancy(Math.min(v, 36), displayM)); }} />
          <Slider label="Containers m" value={m} min={2} max={12} onChange={(v) => { setM(v); applyDist(evenOccupancy(displayN, Math.min(v, 12))); }} />
          <Seg
            label="Distribution"
            value={mode}
            onChange={redistribute}
            options={[
              { id: "random", label: "Random" },
              { id: "even", label: "Even" },
              { id: "manual", label: "Manual" },
              { id: "worst", label: "Worst-case" },
            ]}
          />
          {kind === "examples" ? (
            <div className="combo-btn-row">
              {PRESETS.map((item) => (
                <button key={item.id} type="button" className={`combo-ghost${preset === item.id ? " is-on" : ""}`} onClick={() => { setPreset(item.id); setN(item.n); setM(item.m); applyDist(evenOccupancy(Math.min(item.n, 24), Math.min(item.m, 12))); }}>{item.label}</button>
              ))}
            </div>
          ) : null}
          <p className="combo-note">Drag a highlighted ball color, then click a box to move one object.</p>
        </>
      }
      viz={
        <>
          <h2 className={pulse === "observe" ? "combo-focus" : undefined}>Containers</h2>
          <div className="combo-bins" aria-label="Pigeonholes">
            {Array.from({ length: displayM }, (_, i) => {
              const count = dist[i] ?? 0;
              const hot = count >= 2 && kind === "basic";
              const isMax = count === guaranteed && count === maxOcc;
              return (
                <button
                  key={i}
                  type="button"
                  className={`combo-bin${hot ? " is-hot" : ""}${isMax ? " is-max" : ""}`}
                  onClick={() => moveTo(i)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => moveTo(i)}
                >
                  <b>Box {i + 1}</b>
                  <div className="combo-balls">
                    {Array.from({ length: count }, (_, j) => (
                      <span
                        key={j}
                        className="combo-ball"
                        style={{ background: tokenColor("B", i) }}
                        draggable
                        onDragStart={() => setDrag(i)}
                        onClick={() => setDrag(i)}
                      />
                    ))}
                  </div>
                  <small>{count}</small>
                </button>
              );
            })}
          </div>
          {n > 36 ? <p className="combo-note">Showing 36 of {n} objects. Counts still use n={n}.</p> : null}
          {kind === "examples" ? <p className="combo-note">{PRESETS.find((p) => p.id === preset)?.note}</p> : null}
        </>
      }
      insights={
        <>
          <h2>Live occupancy</h2>
          <LiveRow color="#147df2" label="Objects" value={n} />
          <LiveRow color="#8b45f4" label="Boxes" value={m} />
          <LiveRow color="#f59e0b" label="ceil(n/m)" value={guaranteed} />
          <LiveRow color="#ef4444" label="Current max" value={maxOcc} />
          <LiveRow color="#10b981" label="Distribution" value={dist.slice(0, displayM).join(" · ")} />
          <FormulaCard title="Pigeonhole" formula="guaranteed occupancy = ⌈n/m⌉" note={n > m ? "More objects than boxes forces at least one box with ≥ 2 in the basic case." : "Increase n past m to force a collision."} />
          <p className="combo-note">{kind === "generalized" ? `Even split cannot keep every box below ${guaranteed}.` : "At least one box must contain ≥ 2 when n > m."}</p>
          <ChallengeCard {...challenge} proof={challenge.proof} onNew={() => setCh((c) => c + 1)} />
        </>
      }
    />
  );
}

