import { useEffect, useMemo, useState } from "react";
import {
  combination,
  combinationWithRepetition,
  factorial,
  generateCombinations,
  generatePermutations,
  generateSubsets,
  letters,
  pascalTriangle,
  permutation,
  starsAndBars,
} from "./combinatoricsMath";
import { parseSelKind } from "./combinatoricsMode";
import {
  ChallengeCard,
  ComboWorkspace,
  FormulaCard,
  LiveRow,
  ProductPath,
  Seg,
  Slider,
  Token,
  tokenColor,
} from "./combinatoricsUi";

const CHALLENGES = [
  { prompt: "Choose 3 from 8. How many selections?", expected: 56, hint: "C(8,3) = 8!/(3!5!).", proof: "C(8,3)=56" },
  { prompt: "C(6,3) = ?", expected: 20, hint: "Row 6 of Pascal, entry 3.", proof: "C(5,2)+C(5,3)=10+10=20" },
  { prompt: "Subsets of a 3-element set?", expected: 8, hint: "2³.", proof: "C(3,0)+…+C(3,3)=8" },
  { prompt: "Scoops: 4 from 3 flavors, repetition allowed?", expected: 15, hint: "C(3+4−1,4).", proof: "C(6,4)=15" },
];

export default function SelectionsLab({
  kindRaw,
  setKind,
  pulse,
}: {
  kindRaw: string | null;
  setKind: (id: string) => void;
  pulse: string;
}) {
  const kind = parseSelKind(kindRaw);
  const [collapsed, setCollapsed] = useState(false);
  const [n, setN] = useState(6);
  const [r, setR] = useState(3);
  const [picked, setPicked] = useState<string[]>(["A", "C", "E"]);
  const [hover, setHover] = useState<{ n: number; k: number } | null>({ n: 6, k: 3 });
  const [orderMatters, setOrderMatters] = useState(false);
  const [scoops, setScoops] = useState([2, 1, 1]);
  const [ch, setCh] = useState(0);
  const items = letters(n);
  const pascal = useMemo(() => pascalTriangle(8), []);

  useEffect(() => {
    if (kind === "ncr") { setN(6); setR(3); setPicked(["A", "C", "E"]); }
    if (kind === "compare") { setN(3); setR(2); }
    if (kind === "pascal") { setN(6); setR(3); setHover({ n: 6, k: 3 }); }
    if (kind === "repetition") { setN(3); setR(4); setScoops([2, 1, 1]); }
    if (kind === "subsets") setN(3);
  }, [kind]);

  const toggle = (label: string) => {
    setPicked((current) => {
      if (current.includes(label)) return current.filter((x) => x !== label);
      if (current.length >= r) return [...current.slice(1), label];
      return [...current, label];
    });
  };

  const c = combination(n, r);
  const p = permutation(n, r);
  const combos = generateCombinations(items, Math.min(r, n));
  const perms = generatePermutations(items, Math.min(r, n), 60);
  const subsets = generateSubsets(letters(Math.min(n, 4)));
  const flavors = ["V", "C", "S"];
  const bars = starsAndBars(scoops);
  const withRep = combinationWithRepetition(n, r);
  const challenge = CHALLENGES[ch % CHALLENGES.length]!;
  const scoopTotal = scoops.reduce((s, v) => s + v, 0);

  return (
    <ComboWorkspace
      theme="sel"
      collapsed={collapsed}
      onToggle={() => setCollapsed((v) => !v)}
      controls={
        <>
          <h2>Selection setup</h2>
          <Seg
            label="Selection type"
            value={kind}
            onChange={setKind}
            options={[
              { id: "ncr", label: "Choose k from n" },
              { id: "compare", label: "Order vs not" },
              { id: "pascal", label: "Pascal" },
              { id: "repetition", label: "With repetition" },
              { id: "subsets", label: "Subsets" },
            ]}
          />
          {kind !== "repetition" ? <Slider label="n" value={n} min={3} max={kind === "subsets" ? 4 : 8} onChange={setN} /> : <Slider label="Flavors n" value={n} min={2} max={4} onChange={setN} />}
          {kind !== "subsets" ? <Slider label="Choose r" value={r} min={0} max={kind === "repetition" ? 6 : n} onChange={setR} /> : null}
          {kind === "compare" || kind === "ncr" ? (
            <label className="combo-note">
              <input type="checkbox" checked={orderMatters} onChange={(e) => setOrderMatters(e.target.checked)} /> Order matters
            </label>
          ) : null}
          <p className="combo-note">Click tokens to select a subset. Order does not matter unless the comparison toggle is on.</p>
        </>
      }
      viz={
        <>
          {kind === "pascal" ? (
            <>
              <h2>Pascal connection</h2>
              <div className="combo-pascal" aria-label="Pascal triangle">
                {pascal.map((row, i) => (
                  <span key={i}>
                    {row.map((value, k) => {
                      const on = hover?.n === i && hover?.k === k;
                      const parent = hover && i === hover.n - 1 && (k === hover.k - 1 || k === hover.k);
                      return (
                        <i
                          key={`${i}-${k}`}
                          className={on ? "is-on" : parent ? "is-parent" : ""}
                          onMouseEnter={() => setHover({ n: i, k })}
                        >
                          {value}
                        </i>
                      );
                    })}
                  </span>
                ))}
              </div>
              {hover ? (
                <p className="combo-formula">
                  C({hover.n},{hover.k}) = {combination(hover.n, hover.k)}
                  {hover.n > 0 && hover.k > 0 && hover.k < hover.n
                    ? ` = C(${hover.n - 1},${hover.k - 1}) + C(${hover.n - 1},${hover.k}) = ${combination(hover.n - 1, hover.k - 1)} + ${combination(hover.n - 1, hover.k)}`
                    : ""}
                </p>
              ) : null}
            </>
          ) : null}
          {kind === "ncr" || kind === "compare" ? (
            <>
              <h2 className={pulse === "observe" ? "combo-focus" : undefined}>Objects</h2>
              <div className="combo-tokens">
                {items.map((label, i) => (
                  <Token key={label} label={label} color={tokenColor(label, i)} selected={picked.includes(label)} onClick={() => toggle(label)} />
                ))}
              </div>
              <p className="combo-note">Selection tray (unordered)</p>
              <div className="combo-stage">
                {picked.map((label, i) => <Token key={label} label={label} color={tokenColor(label, i)} />)}
              </div>
              {kind === "compare" ? (
                <div className="combo-compare">
                  <div className="combo-card">
                    <h3>Order matters · P({n},{r}) = {p}</h3>
                    <div className="combo-list">{perms.slice(0, 12).map((row) => <span key={row.join("")}>{row.join("")}</span>)}</div>
                  </div>
                  <div className="combo-card">
                    <h3>Order does not · C({n},{r}) = {c}</h3>
                    <div className="combo-list">{combos.map((row) => <span key={row.join("")} className={picked.slice().sort().join("") === row.slice().sort().join("") ? "is-on" : ""}>{row.join("")}</span>)}</div>
                    <p className="combo-note">ABC, ACB, BAC collapse into one combination.</p>
                  </div>
                </div>
              ) : (
                <>
                  <p className="combo-note">{orderMatters ? `Those ${picked.length} items would count as ${factorial(picked.length)} ordered lists.` : "ABC, ACB, and BAC are the same selection."}</p>
                  {picked.length >= 2 && !orderMatters ? (
                    <div className="combo-collapse" aria-label="Orders collapse">
                      {generatePermutations(picked, picked.length, 12).map((row) => <s key={row.join("")}>{row.join("")}</s>)}
                      <span>→</span>
                      <strong>{[...picked].sort().join("")}</strong>
                    </div>
                  ) : null}
                </>
              )}
            </>
          ) : null}
          {kind === "subsets" ? (
            <>
              <h2>Power set of {`{${letters(n).join(",")}}`}</h2>
              <div className="combo-subset">
                {[0, 1, 2, 3, 4].filter((size) => size <= n).map((size) => (
                  <div key={size}>
                    <em>C({n},{size})={combination(n, size)}</em>
                    {subsets.filter((s) => s.length === size).map((s) => <span key={s.join("") || "empty"} className="combo-list"><span>{s.length ? `{${s.join(",")}}` : "∅"}</span></span>)}
                  </div>
                ))}
              </div>
              <ProductPath factors={Array.from({ length: n + 1 }, (_, k) => combination(n, k))} total={2 ** n} />
            </>
          ) : null}
          {kind === "repetition" ? (
            <>
              <h2>Stars and bars</h2>
              <p className="combo-note">4 scoops from vanilla, chocolate, strawberry.</p>
              {flavors.map((f, i) => (
                <Slider key={f} label={`${f} scoops`} value={scoops[i] ?? 0} min={0} max={r} onChange={(v) => setScoops((cur) => { const next = [...cur]; next[i] = v; return next; })} />
              ))}
              <p className="combo-stars">{bars}</p>
              <p className="combo-formula">C(n+r−1, r) = C({n}+{r}−1, {r}) = {withRep}</p>
              <p className="combo-note">Current composition uses {scoopTotal} scoops. Stars are scoops; bars separate flavors.</p>
            </>
          ) : null}
        </>
      }
      insights={
        <>
          <h2>Live values</h2>
          <LiveRow color="#147df2" label="n" value={n} />
          <LiveRow color="#8b45f4" label="r" value={r} />
          <LiveRow color="#10b981" label="C(n,r)" value={c} />
          {kind === "compare" ? <LiveRow color="#f59e0b" label="P(n,r)" value={p} /> : null}
          <LiveRow color="#08b9dd" label="Selected" value={picked.join("") || "—"} />
          {kind === "subsets" ? <LiveRow color="#0ea5e9" label="2ⁿ" value={2 ** n} /> : null}
          {kind === "repetition" ? <LiveRow color="#f59e0b" label="C(n+r−1,r)" value={withRep} /> : null}
          {kind === "ncr" || kind === "compare" ? <FormulaCard title="Formula" formula="C(n,r) = n! / [r!(n−r)!]" note="Order does not matter. C(n,r)=C(n,n−r)." /> : null}
          {kind === "pascal" ? <FormulaCard title="Pascal identity" formula="C(n,k)=C(n−1,k−1)+C(n−1,k)" note="Hover a cell to see its two parents flow into it." /> : null}
          {kind === "repetition" ? <FormulaCard title="With repetition" formula="C(n+r−1, r)" note="Stars and bars counts flavor compositions." /> : null}
          {kind === "subsets" ? <FormulaCard title="Power set" formula="2ⁿ = Σ C(n,k)" note="Group subsets by size." /> : null}
          <ChallengeCard {...challenge} onNew={() => setCh((c) => c + 1)} />
        </>
      }
    />
  );
}
