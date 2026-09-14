import { useEffect, useMemo, useState } from "react";
import {
  ENUM_DISPLAY_CAP,
  ENUM_PERM_LIMIT,
  factorial,
  generatePermutations,
  generatePermutationsWithRep,
  letters,
  nextPermutation,
  permutation,
  power,
  prevPermutation,
  uniqueArrangementCount,
} from "./combinatoricsMath";
import { parseArrKind, type ArrKind } from "./combinatoricsMode";
import {
  ChallengeCard,
  ComboWorkspace,
  FormulaCard,
  LiveRow,
  ProductPath,
  Seg,
  Slider,
  Slot,
  Token,
  tokenColor,
} from "./combinatoricsUi";

const CHALLENGES = [
  { prompt: "How many ways to arrange 5 distinct objects?", expected: 120, hint: "5! = 5×4×3×2×1.", proof: "5! = 120" },
  { prompt: "P(6,3) = ?", expected: 120, hint: "6×5×4.", proof: "P(6,3) = 6!/(6−3)! = 120" },
  { prompt: "Circular arrangements of 5 distinct people?", expected: 24, hint: "Fix one person: (5−1)!.", proof: "(5−1)! = 24" },
  { prompt: "Unique arrangements of BANANA?", expected: 60, hint: "6! / (3! 2!).", proof: "6!/(3!2!) = 60" },
];

export default function ArrangementsLab({
  kindRaw,
  setKind,
  pulse,
}: {
  kindRaw: string | null;
  setKind: (id: string) => void;
  pulse: string;
}) {
  const kind = parseArrKind(kindRaw);
  const [collapsed, setCollapsed] = useState(false);
  const [n, setN] = useState(4);
  const [r, setR] = useState(3);
  const [word, setWord] = useState("BANANA");
  const [playing, setPlaying] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const [ch, setCh] = useState(0);
  const items = letters(kind === "repetition" ? Math.min(n, 4) : n);
  const [order, setOrder] = useState<string[]>(() => [...items]);
  const [slots, setSlots] = useState<(string | null)[]>(() => items.map(() => null));
  const [drag, setDrag] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [lockA, setLockA] = useState(true);
  const [listMode, setListMode] = useState<"grid" | "sequence" | "tree">("grid");
  const [repeatOn, setRepeatOn] = useState(true);

  useEffect(() => {
    if (kind === "all") {
      setN(4); setOrder(["A", "B", "C", "D"]); setSlots([null, null, null, null]);
    }
    if (kind === "npr") { setN(6); setR(3); setSlots([null, null, null]); }
    if (kind === "repetition") { setN(3); setR(4); setSlots([null, null, null, null]); }
    if (kind === "circular") { setN(5); setRotation(0); }
    if (kind === "repeated") setWord("BANANA");
  }, [kind]);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setOrder((current) => {
        const next = [...current];
        if (!nextPermutation(next)) next.sort();
        setSlots(next.slice(0, slotCount));
        return next;
      });
      setHighlight((h) => h + 1);
    }, 650);
    return () => window.clearInterval(id);
  }, [playing]);

  const pool = kind === "repeated" ? word.split("") : items;
  const slotCount = kind === "npr" || kind === "repetition" ? r : kind === "all" ? n : n;
  const placed = slots.filter(Boolean) as string[];
  const remainingChoices = kind === "repetition" && repeatOn
    ? Array.from({ length: slotCount }, () => n)
    : Array.from({ length: slotCount }, (_, i) => Math.max(0, (kind === "npr" ? n : n) - i));
  const totalAll = factorial(n);
  const totalNpr = permutation(n, r);
  const totalRep = power(n, r);
  const totalCirc = factorial(Math.max(0, n - 1));
  const totalWord = uniqueArrangementCount(word);
  const listed = useMemo(() => {
    if (kind === "repetition") return generatePermutationsWithRep(letters(n), r, ENUM_DISPLAY_CAP);
    if (n > ENUM_PERM_LIMIT) return [];
    return kind === "npr" ? generatePermutations(items, r, ENUM_DISPLAY_CAP) : generatePermutations(items, n, ENUM_DISPLAY_CAP);
  }, [kind, items, n, r]);
  const listedTotal = kind === "repetition" ? totalRep : kind === "npr" ? totalNpr : totalAll;
  const challenge = CHALLENGES[ch % CHALLENGES.length]!;

  const dropAt = (index: number) => {
    if (!drag) return;
    setSlots((current) => {
      const next = [...current];
      const used = next.indexOf(drag);
      if (used >= 0 && !(kind === "repetition" && repeatOn)) next[used] = null;
      next[index] = drag;
      return next;
    });
  };

  const shuffle = () => {
    const copy = [...pool];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j]!, copy[i]!];
    }
    setOrder(copy);
    setSlots(copy.slice(0, slotCount));
  };

  const people = letters(n);
  const rotated = people.map((_, i) => people[(i + rotation) % n]!);

  const applyPerm = (perm: string[]) => {
    setOrder(perm);
    setSlots(perm.slice(0, slotCount));
    setHighlight((h) => h + 1);
  };

  return (
    <ComboWorkspace
      theme="arr"
      collapsed={collapsed}
      onToggle={() => setCollapsed((v) => !v)}
      controls={
        <>
          <h2>Arrangement setup</h2>
          <Seg
            label="Arrangement type"
            value={kind}
            onChange={(id) => setKind(id)}
            options={[
              { id: "all", label: "Arrange all" },
              { id: "npr", label: "P(n,r)" },
              { id: "repetition", label: "Repetition" },
              { id: "circular", label: "Circular" },
              { id: "repeated", label: "Repeated objects" },
            ]}
          />
          {kind !== "repeated" ? <Slider label="Objects n" value={n} min={kind === "repetition" ? 2 : 3} max={kind === "repetition" ? 4 : 7} onChange={(v) => { setN(v); setSlots(Array.from({ length: kind === "npr" || kind === "repetition" ? r : v }, () => null)); setOrder(letters(v)); }} /> : null}
          {kind === "npr" || kind === "repetition" ? <Slider label="Positions r" value={r} min={1} max={kind === "repetition" ? 5 : n} onChange={(v) => { setR(v); setSlots(Array.from({ length: v }, () => null)); }} /> : null}
          {kind === "repetition" ? (
            <label className="combo-note"><input type="checkbox" checked={repeatOn} onChange={(e) => setRepeatOn(e.target.checked)} /> Repetition ON</label>
          ) : null}
          {kind === "repeated" ? (
            <div className="combo-btn-row">
              {["BANANA", "BOOK", "MISS"].map((w) => (
                <button key={w} type="button" className={`combo-ghost${word === w ? " is-on" : ""}`} onClick={() => setWord(w)}>{w}</button>
              ))}
            </div>
          ) : null}
          <div className="combo-btn-row">
            <button type="button" className="combo-ghost" onClick={shuffle}>Shuffle</button>
            <button type="button" className="combo-ghost" onClick={() => { const next = [...order]; if (!nextPermutation(next)) next.sort(); applyPerm(next); }}>Next</button>
            <button type="button" className="combo-ghost" onClick={() => { const next = [...order]; if (!prevPermutation(next)) next.sort().reverse(); applyPerm(next); }}>Previous</button>
            <button type="button" className="combo-primary" onClick={() => setPlaying((p) => !p)}>{playing ? "Pause" : "Animate"}</button>
            <button type="button" className="combo-ghost" onClick={() => { setPlaying(false); setSlots(Array.from({ length: slotCount }, () => null)); setOrder(letters(n)); setDrag(null); }}>Reset</button>
          </div>
          <p className="combo-note">Click a token, then click a numbered slot — or drag. Order creates a new outcome.</p>
        </>
      }
      viz={
        <>
          <h2 className={pulse === "observe" ? "combo-focus" : undefined}>Arrangement stage</h2>
          {kind !== "circular" ? (
            <>
              <p className="combo-note">Object pool</p>
              <div className="combo-tokens" aria-label="Object pool">
                {(kind === "repeated" ? word.split("") : items).map((label, i) => {
                  const used = !(kind === "repetition" && repeatOn) && slots.includes(label);
                  return (
                    <Token
                      key={`${label}-${i}`}
                      label={label}
                      color={tokenColor(label, i)}
                      draggable
                      muted={used}
                      selected={drag === label}
                      onDragStart={() => setDrag(label)}
                      onClick={() => setDrag(label)}
                    />
                  );
                })}
              </div>
              {kind !== "repeated" ? (
                <div className={`combo-stage${pulse === "understand" ? " combo-focus" : ""}`} aria-label="Ordered slots">
                  {Array.from({ length: slotCount }, (_, i) => (
                    <Slot
                      key={i}
                      index={i}
                      value={slots[i] ?? null}
                      choices={remainingChoices[i]}
                      color={tokenColor(slots[i] ?? "A", i)}
                      onDrop={() => dropAt(i)}
                    />
                  ))}
                </div>
              ) : (
                <div className="combo-stage">
                  {word.split("").map((label, i) => <Token key={`${label}${i}`} label={label} color={tokenColor(label)} muted={label === "A" && i > 0} />)}
                </div>
              )}
              {kind === "repeated" ? <p className="combo-note">Identical letters share a color family. Swapping two A’s leaves the word unchanged, so we divide by 3! × 2! for BANANA.</p> : null}
              {kind !== "repeated" && kind !== "circular" ? (
                <div>
                  <p className="combo-note">Why the product works</p>
                  <ProductPath factors={remainingChoices} total={kind === "repetition" && repeatOn ? totalRep : kind === "npr" ? totalNpr : totalAll} />
                </div>
              ) : null}
              {kind !== "circular" && kind !== "repeated" ? (
                <>
                  <Seg value={listMode} onChange={(id) => setListMode(id as typeof listMode)} options={[{ id: "grid", label: "Grid" }, { id: "sequence", label: "Sequence" }, { id: "tree", label: "Tree" }]} />
                  {n > ENUM_PERM_LIMIT ? <p className="combo-note">{listedTotal} total — showing first {ENUM_DISPLAY_CAP} would overflow; count only.</p> : listMode === "tree" ? (
                    <div className="combo-tree-list" aria-label="Arrangement tree">
                      {listed.map((row, i) => (
                        <div key={row.join("") + i} className={i === highlight % listed.length ? "combo-focus" : undefined}>
                          {row.map((ch, d) => <span key={d}>{"· ".repeat(d)}<b>{ch}</b></span>)}
                          {" → "}{row.join("")}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={`combo-list${listMode === "sequence" ? " is-seq" : ""}`} aria-label="Enumerated arrangements">
                      {listed.map((row, i) => <span key={row.join("") + i} className={i === highlight % listed.length ? "is-on" : ""}>{row.join("")}</span>)}
                    </div>
                  )}
                  {listedTotal > listed.length ? <p className="combo-note">{listedTotal} total — showing first {listed.length}.</p> : null}
                </>
              ) : null}
            </>
          ) : (
            <>
              <CircularTable people={rotated} lockA={lockA} rotation={rotation} />
              <p className="combo-note">These linear strings are the same circular seating — rotate until A is first.</p>
              <div className="combo-rotations">
                {people.map((_, i) => {
                  const rot = people.map((__, j) => people[(j + i) % n]!).join("");
                  return <span key={rot} className={i === rotation ? "is-on" : ""}>{rot}</span>;
                })}
              </div>
              <div className="combo-btn-row">
                <button type="button" className="combo-ghost" onClick={() => setRotation((v) => (v + 1) % n)}>Rotate table</button>
                <label className="combo-note"><input type="checkbox" checked={lockA} onChange={(e) => setLockA(e.target.checked)} /> Lock A at top</label>
              </div>
            </>
          )}
        </>
      }
      insights={
        <>
          <h2>Live values</h2>
          {kind === "all" ? <LiveRow color="#147df2" label="n!" value={totalAll} /> : null}
          {kind === "npr" ? <><LiveRow color="#147df2" label="n" value={n} /><LiveRow color="#8b45f4" label="r" value={r} /><LiveRow color="#10b981" label="P(n,r)" value={totalNpr} /></> : null}
          {kind === "repetition" ? <LiveRow color="#08b9dd" label={repeatOn ? "n^r" : "P(n,r)"} value={repeatOn ? totalRep : permutation(n, r)} /> : null}
          {kind === "circular" ? <LiveRow color="#f59e0b" label="(n−1)!" value={totalCirc} /> : null}
          {kind === "repeated" ? <LiveRow color="#8b45f4" label="unique" value={totalWord} /> : null}
          <LiveRow color="#64748b" label="Current arrangement" value={(kind === "circular" ? rotated : kind === "repeated" ? word.split("") : (placed.length ? placed : order)).join("")} />
          <LiveRow color="#0ea5e9" label="Index" value={String((highlight % Math.max(1, listedTotal)) + 1)} />
          {kind === "all" ? <FormulaCard title="Formula" formula="n! = n × (n−1) × ⋯ × 1" note="Each filled slot removes one remaining choice." /> : null}
          {kind === "npr" ? <FormulaCard title="Formula" formula="P(n,r) = n! / (n−r)!" note={`${n} × ${n - 1} × … for ${r} slots.`} /> : null}
          {kind === "repetition" ? <FormulaCard title="Formula" formula={repeatOn ? "n^r" : "P(n,r) = n!/(n−r)!"} note={repeatOn ? "Each slot independently chooses among n symbols." : "Without repetition, later slots have fewer choices."} /> : null}
          {kind === "circular" ? <FormulaCard title="Formula" formula="(n − 1)!" note="Rotations of the same seating are equivalent. Fix A at the top, then arrange the rest." /> : null}
          {kind === "repeated" ? <FormulaCard title="Formula" formula="n! / (n₁! n₂! ⋯)" note={`${word}: ${word.length}! / (${Object.entries(word.split("").reduce<Record<string, number>>((a, ch) => { a[ch] = (a[ch] ?? 0) + 1; return a; }, {})).map(([k, v]) => `${v} ${k}`).join(", ")}) = ${totalWord}. Swapping identical letters does not create a new word.`} /> : null}
          <ChallengeCard {...challenge} onNew={() => setCh((c) => c + 1)} />
        </>
      }
    />
  );
}

function CircularTable({
  people,
  lockA,
  rotation,
}: {
  people: string[];
  lockA: boolean;
  rotation: number;
}) {
  const n = people.length;
  const shown = lockA ? ["A", ...people.filter((p) => p !== "A")] : people;
  return (
    <svg className="combo-circle" viewBox="0 0 420 340" role="img" aria-label="Circular table">
      <circle cx="210" cy="160" r="104" fill="#fff" stroke="#dce7f4" strokeWidth="22" />
      <circle cx="210" cy="160" r="58" fill="#f8fbff" stroke="#e2e8f0" />
      {shown.map((p, i) => {
        const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
        const x = 210 + Math.cos(a) * 104;
        const y = 160 + Math.sin(a) * 104;
        return (
          <g key={`${p}${i}`}>
            <circle cx={x} cy={y} r="20" fill={tokenColor(p, i)} />
            <text x={x} y={y + 5} textAnchor="middle" fill="#fff" fontSize="13" fontWeight="800">{p}</text>
          </g>
        );
      })}
      <text x="210" y="156" textAnchor="middle" fontSize="12" fill="#64748b">{lockA ? "A fixed" : "free rotate"}</text>
      <text x="210" y="176" textAnchor="middle" fontSize="12" fill="#40516d">step {rotation}</text>
      <text x="210" y="318" textAnchor="middle" fontSize="13" fill="#40516d">Linear {n}! = {n === 5 ? 120 : ""} · circular ({n}−1)! = {n === 5 ? 24 : ""}</text>
    </svg>
  );
}
