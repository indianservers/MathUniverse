import { useEffect, useMemo, useRef, useState } from "react";
import { Field, LiveRow, Panel, SliderRow } from "../../mockup/studioLabKit";
import { ChallengeCard, Feedback, Formula, PlaybackBar, Tip, useStepPlayer } from "./primesUi";
import {
  divisorCount,
  divisorCountFormula,
  formatLatexFactorization,
  greedyFactorPair,
  isPrime,
  missingFactor,
  nontrivialFactorPairs,
  parseChallengeInt,
  parseStudioInt,
  primeFactors,
  productOfPowers,
  randomInt,
} from "./primesMath";

type Node = { id: string; value: number; left?: string; right?: string };

let nid = 1;
const nextId = () => `n${nid++}`;

function layout(nodes: Record<string, Node>, rootId: string) {
  const pos: Record<string, { x: number; y: number }> = {};
  let leaf = 0;
  const place = (id: string, depth: number): number => {
    const node = nodes[id];
    if (!node) return 0;
    if (!node.left || !node.right) {
      const x = leaf * 96;
      leaf += 1;
      pos[id] = { x, y: depth * 108 };
      return x;
    }
    const lx = place(node.left, depth + 1);
    const rx = place(node.right, depth + 1);
    const x = (lx + rx) / 2;
    pos[id] = { x, y: depth * 108 };
    return x;
  };
  place(rootId, 0);
  const xs = Object.values(pos).map((p) => p.x);
  const ys = Object.values(pos).map((p) => p.y);
  const minX = xs.length ? Math.min(...xs) : 0;
  const maxX = xs.length ? Math.max(...xs) : 0;
  const minY = ys.length ? Math.min(...ys) : 0;
  const maxY = ys.length ? Math.max(...ys) : 0;
  const pad = 56;
  for (const id of Object.keys(pos)) {
    const p = pos[id]!;
    pos[id] = { x: p.x - minX + pad, y: p.y - minY + pad };
  }
  const width = Math.max(320, maxX - minX + pad * 2);
  const height = Math.max(180, maxY - minY + pad * 2);
  return { pos, width, height };
}

function leavesOf(nodes: Record<string, Node>, id: string): number[] {
  const node = nodes[id];
  if (!node) return [];
  if (!node.left || !node.right) return [node.value];
  return [...leavesOf(nodes, node.left), ...leavesOf(nodes, node.right)];
}

function autoSplit(value: number, last = false): [number, number] | null {
  return greedyFactorPair(value, last);
}

function buildAuto(value: number, last = false, prefix = "cmp") {
  const nodes: Record<string, Node> = {};
  let i = 0;
  const id = () => `${prefix}${i++}`;
  const root = id();
  nodes[root] = { id: root, value };
  const queue = [root];
  while (queue.length) {
    const cur = queue.shift()!;
    const node = nodes[cur]!;
    if (isPrime(node.value)) continue;
    const pair = autoSplit(node.value, last);
    if (!pair) continue;
    const L = id();
    const R = id();
    nodes[cur] = { ...node, left: L, right: R };
    nodes[L] = { id: L, value: pair[0] };
    nodes[R] = { id: R, value: pair[1] };
    queue.push(L, R);
  }
  return { nodes, rootId: root };
}

function TreeSvg({
  nodes,
  rootId,
  active,
  onPick,
  label,
}: {
  nodes: Record<string, Node>;
  rootId: string;
  active: string | null;
  onPick?: (id: string) => void;
  label: string;
}) {
  const { pos, width, height } = useMemo(() => layout(nodes, rootId), [nodes, rootId]);
  return (
    <svg className="primes-tree" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label}>
      {Object.values(nodes).map((node) => {
        if (!node.left || !node.right) return null;
        const p = pos[node.id];
        const L = pos[node.left];
        const R = pos[node.right];
        if (!p || !L || !R) return null;
        return (
          <g key={`e-${node.id}`}>
            <line x1={p.x} y1={p.y} x2={L.x} y2={L.y} stroke="#64748b" strokeWidth="3" />
            <line x1={p.x} y1={p.y} x2={R.x} y2={R.y} stroke="#64748b" strokeWidth="3" />
            <title>{`${node.value} = ${nodes[node.left]?.value} × ${nodes[node.right]?.value}`}</title>
          </g>
        );
      })}
      {Object.values(nodes).map((node) => {
        const p = pos[node.id];
        if (!p) return null;
        const prime = isPrime(node.value);
        const digits = String(node.value).length;
        const r = digits > 3 ? 34 : 40;
        return (
          <g key={node.id} onClick={() => onPick?.(node.id)} style={{ cursor: onPick && !prime ? "pointer" : "default" }}>
            <circle cx={p.x} cy={p.y} r={r} fill={prime ? "#10b981" : node.id === active ? "#f59e0b" : "#8b45f4"} />
            <text x={p.x} y={p.y + 6} textAnchor="middle" fill="#fff" fontSize={digits > 3 ? 14 : 18} fontWeight="800">{node.value}</text>
            <title>{prime ? `${node.value} Prime` : `${node.value} Composite. Click to select or collapse.`}</title>
          </g>
        );
      })}
    </svg>
  );
}

type Props = {
  n: number;
  setN: (n: number) => void;
  teacherReveal?: boolean;
  onCompareGcd: (a: number, b: number) => void;
};

type Snap = { nodes: Record<string, Node>; rootId: string; active: string | null };

export default function FactorTreePanel({ n, setN, teacherReveal, onCompareGcd }: Props) {
  const [nodes, setNodes] = useState<Record<string, Node>>(() => {
    const id = nextId();
    return { [id]: { id, value: n } };
  });
  const [rootId, setRootId] = useState(() => Object.keys(nodes)[0]!);
  const [active, setActive] = useState<string | null>(() => (isPrime(n) ? null : Object.keys(nodes)[0]!));
  const [aIn, setAIn] = useState("2");
  const [bIn, setBIn] = useState("42");
  const [gcdB, setGcdB] = useState("60");
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [compare, setCompare] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);
  const [challengeKey, setChallengeKey] = useState(0);
  const [inputError, setInputError] = useState("");
  const [history, setHistory] = useState<Snap[]>([]);

  const lastN = useRef(n);
  const nodesRef = useRef(nodes);
  nodesRef.current = nodes;
  const snapshot = (): Snap => ({ nodes: nodesRef.current, rootId, active });

  const rebuild = (value: number) => {
    nid += 1;
    const id = nextId();
    setNodes({ [id]: { id, value } });
    setRootId(id);
    setActive(isPrime(value) ? null : id);
    setHistory([]);
    setFeedback(isPrime(value)
      ? { ok: true, text: `${value} is prime. Its only positive factors are 1 and ${value}. Prime factorization: ${value}.` }
      : null);
    setCompare(false);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };
  useEffect(() => {
    if (lastN.current === n) return;
    lastN.current = n;
    rebuild(n);
  }, [n]);

  const setNumber = (value: number) => {
    lastN.current = value;
    setN(value);
    rebuild(value);
  };

  const splitNode = (id: string, left: number, right: number) => {
    const node = nodesRef.current[id];
    if (!node || left * right !== node.value) return;
    if (left === 1 || right === 1) {
      setFeedback({ ok: false, text: "Choose a non-trivial factor pair." });
      return;
    }
    setHistory((h) => [...h, snapshot()]);
    const L = nextId();
    const R = nextId();
    setNodes((prev) => ({
      ...prev,
      [id]: { ...prev[id]!, left: L, right: R },
      [L]: { id: L, value: left },
      [R]: { id: R, value: right },
    }));
    setActive(isPrime(left) && isPrime(right) ? null : (isPrime(left) ? R : L));
    setFeedback({ ok: true, text: `${node.value} = ${left} × ${right}` });
  };

  const prune = (map: Record<string, Node>, id: string) => {
    const node = map[id];
    if (!node) return;
    if (node.left) prune(map, node.left);
    if (node.right) prune(map, node.right);
    if (node.left) delete map[node.left];
    if (node.right) delete map[node.right];
  };

  const collapse = (id: string) => {
    const node = nodesRef.current[id];
    if (!node?.left || !node.right) return;
    setHistory((h) => [...h, snapshot()]);
    setNodes((prev) => {
      const next = { ...prev };
      prune(next, id);
      next[id] = { id, value: node.value };
      return next;
    });
    setActive(id);
  };

  const swapChildren = (id: string) => {
    const node = nodes[id];
    if (!node?.left || !node.right) return;
    setHistory((h) => [...h, snapshot()]);
    setNodes((prev) => ({ ...prev, [id]: { ...prev[id]!, left: node.right, right: node.left } }));
  };

  const undo = () => {
    const prev = history[history.length - 1];
    if (!prev) return;
    setHistory((h) => h.slice(0, -1));
    setNodes(prev.nodes);
    setRootId(prev.rootId);
    setActive(prev.active);
    setPlaying(false);
  };

  const complete = Object.values(nodes).every((node) => isPrime(node.value) || (node.left && node.right));
  const leafValues = leavesOf(nodes, rootId);
  const powers = primeFactors(n);
  const expanded = leafValues.join(" \\times ");
  const exponent = formatLatexFactorization(powers);
  const product = leafValues.reduce((acc, v) => acc * v, 1);
  const pair = active ? nontrivialFactorPairs(nodes[active]?.value ?? 0) : [];
  const compareTree = useMemo(() => (compare ? buildAuto(n, true) : null), [compare, n]);
  const composites = Object.values(nodes).filter((node) => !isPrime(node.value) && !node.left);

  useStepPlayer(playing, speed, () => {
    const composite = composites[0];
    if (!composite) {
      setPlaying(false);
      return;
    }
    const next = autoSplit(composite.value);
    if (next) splitNode(composite.id, next[0], next[1]);
    else setPlaying(false);
  });

  const challenge = useMemo(() => {
    const kind = challengeKey % 5;
    if (kind === 0) return { prompt: "Build a factor tree for 180. Enter the exponent of 2 in 180 = 2^a × 3^2 × 5.", expected: 2, hint: "180 = 2 × 2 × 3 × 3 × 5.", load: 180, check: (raw: string) => parseChallengeInt(raw) === 2 };
    if (kind === 1) return { prompt: "Find a number whose prime factorization is 2³ × 3 × 5.", expected: 120, hint: "Multiply the prime powers.", load: 120, check: (raw: string) => parseChallengeInt(raw) === 120 };
    if (kind === 2) return { prompt: "Complete the missing factor: 126 = 2 × ? × 7", expected: missingFactor(126, [2, 7]) ?? 9, hint: "126 / 14.", load: 126 };
    if (kind === 3) return { prompt: "Which product equals 360? Enter 360 if 2³ × 3² × 5 is correct.", expected: 360, hint: "2³ × 3² × 5 = 8 × 9 × 5.", load: 360 };
    return {
      prompt: "Find a number with exactly 18 positive divisors. (Any valid n.)",
      expected: 180,
      hint: "Use (a+1)(b+1)… = 18, e.g. 100 = 2²×5², 180 = 2²×3²×5.",
      load: undefined as number | undefined,
      check: (raw: string) => {
        const v = parseChallengeInt(raw);
        return v != null && v > 1 && divisorCount(v) === 18;
      },
    };
  }, [challengeKey]);

  const onPick = (id: string) => {
    const node = nodes[id];
    if (!node) return;
    if (node.left && node.right) {
      collapse(id);
      return;
    }
    if (!isPrime(node.value)) setActive(id);
  };

  return (
    <>
      <Panel title="Factor Tree">
        <SliderRow label="Number" value={n} min={2} max={1000} step={1} onChange={setNumber} />
        <Field label="Number">
          <input
            value={String(n)}
            onChange={(e) => {
              const parsed = parseStudioInt(e.target.value, 2, 1000, "Number");
              if (!parsed.ok) { setInputError(parsed.error); return; }
              setInputError("");
              setNumber(parsed.value);
            }}
          />
        </Field>
        {inputError ? <p className="msk-note">{inputError}</p> : null}
        <PlaybackBar
          playing={playing}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onPrev={undo}
          onNext={() => {
            const composite = composites[0];
            const next = composite ? autoSplit(composite.value) : null;
            if (composite && next) splitNode(composite.id, next[0], next[1]);
          }}
          onReset={() => rebuild(n)}
          onRandom={() => setNumber(randomInt(12, 360))}
          onAuto={() => setPlaying(true)}
          autoLabel="Auto Solve"
          speed={speed}
          onSpeed={setSpeed}
          disablePrev={history.length === 0}
        />
        <div className="msk-btn-row">
          <button type="button" className="msk-soft" onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}>Fit to view</button>
          <button type="button" className="msk-soft" onClick={() => setCompare((v) => !v)}>Compare Factor Trees</button>
          {challenge.load ? <button type="button" className="msk-soft" onClick={() => setNumber(challenge.load!)}>Load challenge number {challenge.load}</button> : null}
        </div>
        <div className="msk-btn-row">
          <Field label="Compare GCD with B">
            <input value={gcdB} onChange={(e) => setGcdB(e.target.value)} />
          </Field>
          <button type="button" className="msk-soft" onClick={() => {
            const B = parseStudioInt(gcdB, 1, 1000, "B");
            if (!B.ok) { setFeedback({ ok: false, text: B.error }); return; }
            onCompareGcd(n, B.value);
          }}>Send {n} and B to GCD & LCM</button>
        </div>
        {active && nodes[active] && !isPrime(nodes[active]!.value) ? (
          <>
            <p className="msk-note">{nodes[active]!.value} is composite. Click a non-trivial factor pair, or click a split node to collapse it.</p>
            <div className="primes-pair">
              {pair.map(([a, b]) => (
                <button key={`${a}x${b}`} type="button" onClick={() => splitNode(active, a, b)}>{a} × {b}</button>
              ))}
            </div>
            <div className="msk-btn-row">
              <Field label="factor A"><input value={aIn} onChange={(e) => setAIn(e.target.value)} /></Field>
              <Field label="factor B"><input value={bIn} onChange={(e) => setBIn(e.target.value)} /></Field>
              <button type="button" className="msk-soft" onClick={() => {
                const A = parseStudioInt(aIn, 1, n, "A");
                const B = parseStudioInt(bIn, 1, n, "B");
                if (!A.ok) { setFeedback({ ok: false, text: A.error }); return; }
                if (!B.ok) { setFeedback({ ok: false, text: B.error }); return; }
                const parent = nodes[active]!.value;
                if (A.value * B.value !== parent) {
                  setFeedback({ ok: false, text: `${A.value} × ${B.value} = ${A.value * B.value}, not ${parent}. Try another factor pair.` });
                  return;
                }
                splitNode(active, A.value, B.value);
              }}>Split</button>
              {nodes[active]?.left ? <button type="button" className="msk-soft" onClick={() => swapChildren(active)}>Swap children</button> : null}
            </div>
          </>
        ) : null}
      </Panel>
      <section
        className="msk-panel msk-canvas"
        tabIndex={0}
        onKeyDown={(e) => {
          if (!composites.length) return;
          const idx = Math.max(0, composites.findIndex((c) => c.id === active));
          if (e.key === "ArrowRight") {
            e.preventDefault();
            setActive(composites[(idx + 1) % composites.length]!.id);
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            setActive(composites[(idx - 1 + composites.length) % composites.length]!.id);
          }
          if (e.key === "Enter" && active) {
            const next = autoSplit(nodes[active]?.value ?? 0);
            if (next) splitNode(active, next[0], next[1]);
          }
        }}
      >
        <div className="primes-legend">
          <span><i style={{ background: "#10b981" }} />Prime leaf</span>
          <span><i style={{ background: "#8b45f4" }} />Composite</span>
          <span><i style={{ background: "#f59e0b" }} />Active split</span>
        </div>
        {isPrime(n) ? (
          <Formula value={`${n}\\text{ is prime. Factorization: }${n}`} />
        ) : (
          <>
            {active && nodes[active] && !isPrime(nodes[active]!.value) && !nodes[active]!.left ? (
              <div className="primes-split-dock">
                <p className="msk-note"><b>{nodes[active]!.value}</b> is composite. Choose a factor pair to grow the tree.</p>
                <div className="primes-pair">
                  {pair.map(([a, b]) => (
                    <button key={`${a}x${b}`} type="button" onClick={() => splitNode(active, a, b)}>{a} × {b}</button>
                  ))}
                </div>
              </div>
            ) : null}
            <div className={`primes-tree-wrap${compare ? " is-compare" : ""}`}>
              <div
                className="primes-tree-pane"
                onWheel={(e) => {
                  if (!e.ctrlKey) return;
                  e.preventDefault();
                  setZoom((z) => Math.min(2.2, Math.max(0.7, z + (e.deltaY > 0 ? -0.08 : 0.08))));
                }}
              >
                <div style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: "center top" }}>
                  <TreeSvg nodes={nodes} rootId={rootId} active={active} onPick={onPick} label={`Factor tree of ${n}`} />
                </div>
              </div>
              {compare && compareTree ? (
                <div className="primes-tree-pane">
                  <p className="msk-note">Another first split, same primes.</p>
                  <TreeSvg nodes={compareTree.nodes} rootId={compareTree.rootId} active={null} label={`Alternate factor tree of ${n}`} />
                </div>
              ) : null}
            </div>
          </>
        )}
        {complete ? (
          <p className="msk-note">
            Unique factorization: {leafValues.join(" × ")} — any other tree yields the same primes up to order.
          </p>
        ) : null}
        <Formula value={complete ? `${n} = ${expanded} = ${exponent}` : leafValues.length > 1 ? `${n} = ${expanded}` : String(n)} />
        {complete && product === n ? <p className="msk-ok">{leafValues.join(" × ")} = {n} ✓</p> : null}
        <p className="msk-note"><Tip term="Fundamental Theorem of Arithmetic">Every integer greater than 1 factors uniquely into primes, up to order.</Tip></p>
      </section>
      <aside className="msk-panel msk-live">
        <LiveRow color="#147df2" label="Number" value={String(n)} />
        <LiveRow color="#8b45f4" label="Expanded" value={leafValues.join(" × ") || "—"} />
        <LiveRow color="#10b981" label="Exponent form" value={complete ? formatLatexFactorization(powers).replace(/\\times/g, "×").replace(/\^\{(\d+)\}/g, "^$1") : "in progress"} />
        <LiveRow color="#f59e0b" label="Divisor count" value={`${divisorCount(n)} · ${divisorCountFormula(n)}`} />
        <LiveRow color="#08b9dd" label="Check" value={complete && product === n ? `${productOfPowers(powers)} = ${n}` : "Keep splitting composites"} />
        <Feedback ok={feedback?.ok ?? null} text={feedback?.text ?? ""} />
        <ChallengeCard {...challenge} onNew={() => setChallengeKey((k) => k + 1)} reveal={teacherReveal} />
      </aside>
    </>
  );
}
