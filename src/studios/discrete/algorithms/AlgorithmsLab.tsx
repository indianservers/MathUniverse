import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import type { StudioMockupPage } from "../../mockup/studioMockupCatalog";
import { ChallengeBox, LiveRow, Panel, SliderRow, StatusOk } from "../../mockup/studioLabKit";
import { FigureToolbar, Phase1LabChrome } from "../../phase1/Phase1LabChrome";
import { useStudioFigure } from "../../phase1/useStudioFigure";
import { bfs, dfs, sampleGraph } from "../../../modules/graph-theory/graphTheoryEngine";
import {
  binarySearchSteps,
  bubbleSortFrames,
  complexitySample,
  euclidSteps,
  linearSearchSteps,
  mergeSortFrames,
} from "./algorithmMath";

type Fig = { n: number; target: number; euclidA: number; euclidB: number };
const initial: Fig = { n: 12, target: 43, euclidA: 84, euclidB: 60 };
const SEED = [38, 27, 43, 3, 9, 10, 19, 27, 38, 43, 55, 61, 66, 82, 93, 7, 22, 31, 44, 50];

export default function AlgorithmsLab({ page }: { page: StudioMockupPage }) {
  const fig = useStudioFigure(initial);
  const [step, setStep] = useState(1);
  const data = SEED.slice(0, fig.state.n);
  const bubble = useMemo(() => bubbleSortFrames(data), [data]);
  const merge = useMemo(() => mergeSortFrames(data), [data]);
  const euclid = euclidSteps(fig.state.euclidA, fig.state.euclidB);
  const linear = linearSearchSteps(data, fig.state.target);
  const binary = binarySearchSteps(data, fig.state.target);
  const bfsRun = bfs(sampleGraph);
  const dfsRun = dfs(sampleGraph);
  const curve = complexitySample(fig.state.n);

  return (
    <Phase1LabChrome
      page={page}
      toolbar={
        <FigureToolbar
          canUndo={fig.canUndo}
          canRedo={fig.canRedo}
          exact={fig.exact}
          onUndo={fig.undo}
          onRedo={fig.redo}
          onReset={fig.reset}
          onShare={() => void fig.share()}
          onExact={fig.setExact}
        />
      }
    >
      {(mode) => {
        const frames = mode === "Sorting" ? merge : bubble;
        const frame = frames[Math.min(step, frames.length - 1)] ?? frames[0]!;
        const searchHit = mode === "Searching" ? linear.find((s) => s.found) : null;
        return (
          <>
            <Panel title={mode}>
              <SliderRow label="n / array length" value={fig.state.n} min={6} max={20} step={1} onChange={(n) => fig.commit({ ...fig.state, n })} />
              <SliderRow label="Step" value={step} min={1} max={Math.max(2, frames.length)} step={1} onChange={setStep} />
              {mode === "Searching" ? <SliderRow label="Target" value={fig.state.target} min={1} max={99} step={1} onChange={(target) => fig.commit({ ...fig.state, target })} /> : null}
              {mode === "Euclid" ? (
                <>
                  <SliderRow label="a" value={fig.state.euclidA} min={8} max={200} step={1} onChange={(euclidA) => fig.commit({ ...fig.state, euclidA })} />
                  <SliderRow label="b" value={fig.state.euclidB} min={8} max={200} step={1} onChange={(euclidB) => fig.commit({ ...fig.state, euclidB })} />
                </>
              ) : null}
              <div className="msk-btn-row">
                <button type="button" className="msk-soft" onClick={() => setStep((s) => Math.max(1, s - 1))}>Back</button>
                <button type="button" className="msk-soft" onClick={() => setStep((s) => s + 1)}>Step</button>
                <button type="button" className="msk-soft" onClick={() => setStep(1)}>Rewind</button>
              </div>
              <p className="msk-note">Algorithm: Merge Sort · dataset random(20). Bubble is the slow twin on the same array.</p>
            </Panel>
            <section className="msk-panel msk-canvas" data-mode-canvas={mode}>
              <div className="msk-split-canvas">
                <svg className="msk-graph" viewBox="0 0 420 180" role="img" aria-label="Array visualization">
                  <rect width="420" height="180" fill="#f8fbff" />
                  {(mode === "Searching" ? binary.sorted : frame.arr).map((v, i) => (
                    <rect key={i} x={12 + i * 20} y={160 - v} width="14" height={v} fill={i === (frame as { hi?: number }).hi ? "#f59e0b" : "#c7d2fe"} />
                  ))}
                </svg>
              <ol className="msk-step-tape" aria-label="Algorithm step tape">
                {frames.slice(0, Math.min(step, 12)).map((item, i) => (
                  <li key={`${item.note}-${i}`} className={i === Math.min(step, frames.length) - 1 ? "is-hot" : undefined}>{item.note}</li>
                ))}
              </ol>
                <pre className="msk-code">{mode === "Sorting"
                  ? `if left > right
  return
mid = (left + right) / 2
MergeSort(A, left, mid)
MergeSort(A, mid + 1, right)
Merge(A, left, mid, right)`
                  : mode === "Searching"
                    ? "while lo ≤ hi: mid = (lo+hi)/2"
                    : mode === "Euclid"
                      ? "while b ≠ 0: (a,b) = (b, a mod b)"
                      : mode === "Graph Traversal"
                        ? "BFS queue / DFS stack on Graph Theory sample"
                        : "T(n) overlay"}</pre>
              </div>
              {mode === "Graph Traversal" ? (
                <p className="msk-note">BFS visits {bfsRun.filter((s) => s.label === "BFS").map((s) => s.activeNodes[0]).join(" → ")}. DFS {dfsRun.filter((s) => s.label === "DFS").map((s) => s.activeNodes[0]).join(" → ")}. Full debugger: <Link to="/graph-theory?tab=algorithms">Graph Theory</Link></p>
              ) : null}
              {mode === "Complexity" ? (
                <svg className="msk-graph" viewBox="0 0 240 90" aria-label="Complexity comparison">
                  <rect width="240" height="90" fill="#f8fbff" />
                  <polyline points="10,70 80,48 150,32 230,18" fill="none" stroke="#147df2" />
                  <polyline points="10,70 80,40 150,22 230,10" fill="none" stroke="#8b45f4" />
                  <polyline points="10,70 80,60 150,55 230,52" fill="none" stroke="#f59e0b" />
                </svg>
              ) : null}
            </section>
            <aside className="msk-panel msk-live">
              <LiveRow color="#08b9dd" label="Comparisons" value={`${frame.arr.length}/${step}`} />
              <LiveRow color="#8b45f4" label="Step" value={`${step}/${frames.length}`} />
              {mode === "Euclid" ? <LiveRow color="#10b981" label="gcd steps vs size" value={`${euclid.count} steps for max=${Math.max(fig.state.euclidA, fig.state.euclidB)}`} /> : null}
              {mode === "Searching" ? <LiveRow color="#f59e0b" label="Linear vs binary" value={`${linear.length} vs ${binary.steps.length}${searchHit ? " · hit" : ""}`} /> : null}
              {mode === "Complexity" ? <LiveRow color="#147df2" label="n log n vs n²" value={`${fig.format(curve.nlog, 1)} vs ${curve.n2}`} /> : null}
              <StatusOk>Algorithm is correct — array will be sorted in ascending order. Merge Sort O(n log n); bubble is O(n²).</StatusOk>
              <ChallengeBox {...page.challenge} />
            </aside>
          </>
        );
      }}
    </Phase1LabChrome>
  );
}
