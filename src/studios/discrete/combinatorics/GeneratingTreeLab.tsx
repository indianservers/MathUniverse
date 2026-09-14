import { useEffect, useMemo, useState } from "react";
import {
  combination,
  countLeaves,
  countNodes,
  generateBinaryTree,
  generateCombinationTree,
  generateDiceTree,
  generatePathTree,
  generatePermutationTree,
  layoutTree,
  letters,
  permutation,
  power,
  treeDepth,
  type TreeNode,
} from "./combinatoricsMath";
import { parseTreeKind } from "./combinatoricsMode";
import { ChallengeCard, ComboWorkspace, FormulaCard, LiveRow, Seg, Slider } from "./combinatoricsUi";

const CHALLENGES = [
  { prompt: "How many binary strings of length 5?", expected: 32, hint: "2⁵.", proof: "2^5=32" },
  { prompt: "Leaves in the permutation tree of ABC?", expected: 6, hint: "3×2×1.", proof: "3!=6" },
  { prompt: "Choose 2 from A B C D. How many leaves?", expected: 6, hint: "C(4,2).", proof: "C(4,2)=6" },
];

export default function GeneratingTreeLab({
  kindRaw,
  setKind,
  pulse,
}: {
  kindRaw: string | null;
  setKind: (id: string) => void;
  pulse: string;
}) {
  const kind = parseTreeKind(kindRaw);
  const [collapsed, setCollapsed] = useState(false);
  const [depth, setDepth] = useState(3);
  const [visible, setVisible] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [hover, setHover] = useState("");
  const [hideInvalid, setHideInvalid] = useState(true);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [n, setN] = useState(3);
  const [r, setR] = useState(2);
  const [ch, setCh] = useState(0);

  useEffect(() => {
    if (kind === "binary" || kind === "restricted") { setDepth(3); setVisible(1); }
    if (kind === "permutation") { setN(3); setVisible(1); }
    if (kind === "selection") { setN(4); setR(2); setVisible(1); }
    if (kind === "dice") { setN(2); setDepth(2); }
    if (kind === "paths") { setN(2); setR(2); }
    setPlaying(false);
    setVisible(8);
  }, [kind]);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setVisible((v) => {
        if (v >= 8) { setPlaying(false); return v; }
        return v + 1;
      });
    }, 500);
    return () => window.clearInterval(id);
  }, [playing]);

  const root = useMemo(() => {
    if (kind === "binary") return generateBinaryTree(depth, false);
    if (kind === "restricted") return generateBinaryTree(depth, true);
    if (kind === "permutation") return generatePermutationTree(letters(n));
    if (kind === "selection") return generateCombinationTree(letters(n), r);
    if (kind === "dice") return generateDiceTree(Math.min(n, 3), 6);
    return generatePathTree(n, r);
  }, [kind, depth, n, r]);

  const maxD = treeDepth(root);
  const leaves = countLeaves(root, true);
  const nodes = countNodes(root);
  const challenge = CHALLENGES[ch % CHALLENGES.length]!;
  const branching = kind === "binary" || kind === "restricted" ? 2 : kind === "dice" ? 6 : kind === "permutation" ? n : kind === "selection" ? "include path" : "R/D";

  const clip = (node: TreeNode, d: number): TreeNode => ({
    ...node,
    children: d >= visible ? [] : node.children.filter((c) => !(hideInvalid && c.blocked)).map((child) => clip(child, d + 1)),
  });
  const clipped = clip(root, 0);
  const drawn = layoutTree(clipped, 640, 420);

  return (
    <ComboWorkspace
      collapsed={collapsed}
      onToggle={() => setCollapsed((v) => !v)}
      controls={
        <>
          <h2>Tree scenario</h2>
          <Seg
            value={kind}
            onChange={setKind}
            options={[
              { id: "binary", label: "Binary strings" },
              { id: "permutation", label: "Permutations" },
              { id: "selection", label: "Selections" },
              { id: "restricted", label: "Restricted" },
              { id: "dice", label: "Dice" },
              { id: "paths", label: "Paths" },
            ]}
          />
          {kind === "binary" || kind === "restricted" ? <Slider label="Length" value={depth} min={2} max={4} onChange={setDepth} /> : null}
          {kind === "permutation" ? <Slider label="Items n" value={n} min={2} max={4} onChange={setN} /> : null}
          {kind === "selection" ? <><Slider label="n" value={n} min={3} max={5} onChange={setN} /><Slider label="Choose r" value={r} min={1} max={n} onChange={setR} /></> : null}
          {kind === "dice" ? <Slider label="Dice" value={n} min={1} max={3} onChange={setN} /> : null}
          {kind === "paths" ? <><Slider label="Down" value={n} min={1} max={3} onChange={setN} /><Slider label="Right" value={r} min={1} max={3} onChange={setR} /></> : null}
          <div className="combo-btn-row">
            <button type="button" className="combo-ghost" onClick={() => setVisible(0)}>Reset</button>
            <button type="button" className="combo-ghost" onClick={() => setVisible((v) => Math.min(8, v + 1))}>Step level</button>
            <button type="button" className="combo-primary" onClick={() => setPlaying((p) => !p)}>{playing ? "Pause" : "Play"}</button>
            <button type="button" className="combo-ghost" onClick={() => setVisible(8)}>Expand all</button>
            <button type="button" className="combo-ghost" onClick={() => setVisible(0)}>Collapse all</button>
            <button type="button" className="combo-ghost" onClick={() => { setPan({ x: 0, y: 0 }); setZoom(1); }}>Fit tree</button>
          </div>
          <label className="combo-note"><input type="checkbox" checked={hideInvalid} onChange={(e) => setHideInvalid(e.target.checked)} /> Hide invalid branches</label>
          <p className="combo-note">Hover a node to highlight its path. Restricted mode blocks consecutive 1s.</p>
        </>
      }
      viz={
        <>
          <h2 className={pulse === "observe" ? "combo-focus" : undefined}>Generating tree</h2>
          <svg
            className="combo-tree"
            viewBox="0 0 640 420"
            role="img"
            aria-label="Generating tree"
            onPointerDown={(e) => {
              const origin = { x: e.clientX - pan.x, y: e.clientY - pan.y };
              const move = (ev: PointerEvent) => setPan({ x: ev.clientX - origin.x, y: ev.clientY - origin.y });
              const up = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
              window.addEventListener("pointermove", move);
              window.addEventListener("pointerup", up);
            }}
          >
            <rect width="640" height="420" fill="#f7fbff" />
            <g transform={`translate(${pan.x} ${pan.y}) scale(${zoom})`}>
              {drawn.map((node) =>
                node.children.map((child) => {
                  const to = drawn.find((d) => d.id === child.id);
                  if (!to) return null;
                  return <line key={`${node.id}-${child.id}`} x1={node.x} y1={node.y} x2={to.x} y2={to.y} stroke={child.blocked ? "#fca5a5" : hover && (hover.startsWith(child.path) || child.path.startsWith(hover)) ? "#147df2" : "#94a3b8"} strokeWidth="1.6" />;
                }),
              )}
              {drawn.map((node) => (
                <g key={node.id} onMouseEnter={() => setHover(node.path)} onMouseLeave={() => setHover("")}>
                  <circle cx={node.x} cy={node.y} r="14" fill={node.blocked ? "#fecaca" : hover && (hover === node.path || hover.startsWith(node.path) && node.path) ? "#147df2" : node.valid && !node.children.length ? "#10b981" : "#8b45f4"} />
                  <text x={node.x} y={node.y + 4} textAnchor="middle" fill="#fff" fontSize="9" fontWeight="800">{node.label}</text>
                </g>
              ))}
            </g>
          </svg>
          <div className="combo-btn-row">
            <button type="button" className="combo-ghost" onClick={() => setZoom((z) => Math.min(2, z + 0.15))}>Zoom +</button>
            <button type="button" className="combo-ghost" onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))}>Zoom −</button>
          </div>
        </>
      }
      insights={
        <>
          <h2>Tree census</h2>
          <LiveRow color="#147df2" label="Branching" value={String(branching)} />
          <LiveRow color="#8b45f4" label="Depth" value={maxD} />
          <LiveRow color="#08b9dd" label="Nodes" value={nodes} />
          <LiveRow color="#10b981" label="Valid leaves" value={leaves} />
          <LiveRow color="#f59e0b" label="Visible levels" value={visible} />
          {kind === "binary" ? <FormulaCard title="Independent choices" formula="2ⁿ leaves" note={`${power(2, depth)} binary strings of length ${depth}.`} /> : null}
          {kind === "permutation" ? <FormulaCard title="Permutation tree" formula="n × (n−1) × ⋯ × 1" note={`P(${n},${n}) = ${permutation(n, n)}.`} /> : null}
          {kind === "selection" ? <FormulaCard title="Increasing choices" formula="C(n,r)" note={`No order duplicates. C(${n},${r}) = ${combination(n, r)}.`} /> : null}
          {kind === "restricted" ? <FormulaCard title="Blocked branches" formula="count only valid leaves" note="Consecutive 1s are muted red and excluded from the leaf count." /> : null}
          {kind === "dice" ? <FormulaCard title="Dice" formula="6ⁿ" note={`${power(6, n)} outcomes.`} /> : null}
          {kind === "paths" ? <FormulaCard title="Grid paths" formula="C(rows+cols, rows)" note={`${combination(n + r, n)} paths using only Right and Down.`} /> : null}
          <ChallengeCard {...challenge} onNew={() => setCh((c) => c + 1)} />
        </>
      }
    />
  );
}
