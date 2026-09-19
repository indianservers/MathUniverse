import { useState } from "react";
import type { StudioMockupPage } from "../../mockup/studioMockupCatalog";
import { ChallengeBox, LiveRow, Panel, SliderRow, StatusOk, StepList, clamp } from "../../mockup/studioLabKit";
import { FigureToolbar, Phase1LabChrome } from "../../phase1/Phase1LabChrome";
import { useStudioFigure } from "../../phase1/useStudioFigure";
import { angleSum, inscribedVsCentral, pythagorasTiles, similarScale, twoColumnClaims } from "./proofMath";

type Fig = { a: number; b: number; tear: number; arc: number; k: number };
const initial: Fig = { a: 3, b: 4, tear: 0.4, arc: 80, k: 2 };

export default function ProofsLab({ page }: { page: StudioMockupPage }) {
  const fig = useStudioFigure(initial);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
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
        const tiles = pythagorasTiles(fig.state.a, fig.state.b);
        const torn = angleSum(fig.state.tear);
        const circle = inscribedVsCentral(fig.state.arc);
        const sim = similarScale(fig.state.k);
        const expected = mode === "Pythagoras" ? 5 : mode === "Angle Sum" ? 180 : mode === "Circle Theorems" ? circle.inscribed : mode === "Similarity" ? sim.area : fig.state.a * fig.state.b;
        return (
          <>
            <Panel title={mode}>
              {mode === "Pythagoras" || mode === "Area Proofs" ? (
                <>
                  <SliderRow label="Leg a" value={fig.state.a} min={1} max={8} step={0.1} onChange={(a) => fig.commit({ ...fig.state, a })} />
                  <SliderRow label="Leg b" value={fig.state.b} min={1} max={8} step={0.1} onChange={(b) => fig.commit({ ...fig.state, b })} />
                </>
              ) : null}
              {mode === "Angle Sum" ? <SliderRow label="Tear onto a line" value={fig.state.tear} min={0} max={1} step={0.02} onChange={(tear) => fig.commit({ ...fig.state, tear })} /> : null}
              {mode === "Circle Theorems" ? <SliderRow label="Central arc °" value={fig.state.arc} min={20} max={160} step={1} onChange={(arc) => fig.commit({ ...fig.state, arc })} /> : null}
              {mode === "Similarity" ? <SliderRow label="Scale k" value={fig.state.k} min={0.5} max={3} step={0.05} onChange={(k) => fig.commit({ ...fig.state, k })} /> : null}
            </Panel>
            <section className="msk-panel msk-canvas">
              <svg
                className="msk-graph is-interactive"
                viewBox="0 0 420 240"
                role="img"
                aria-label={mode}
                data-mode-canvas={mode}
                onPointerMove={(event: PointerEvent<SVGSVGElement>) => {
                  if (event.buttons === 0) return;
                  const box = event.currentTarget.getBoundingClientRect();
                  fig.commit({ ...fig.state, a: clamp((event.clientX - box.left) / box.width * 8, 1, 8), b: clamp(8 - (event.clientY - box.top) / box.height * 8, 1, 8) });
                }}
              >
                <rect width="420" height="240" fill="#f8fbff" />
                {mode === "Pythagoras" || mode === "Area Proofs" ? (
                  <>
                    <polygon points={`80,200 ${80 + tiles.a * 18},200 ${80 + tiles.a * 18},${200 - tiles.b * 18} 80,${200 - tiles.b * 18}`} fill="rgba(20,125,242,.16)" stroke="#147df2" />
                    <rect x={80 + tiles.a * 18} y={200 - tiles.a * 18} width={tiles.a * 18} height={tiles.a * 18} fill="rgba(8,185,221,.2)" stroke="#08b9dd" />
                    <rect x={80 - tiles.b * 18} y={200 - tiles.b * 18} width={tiles.b * 18} height={tiles.b * 18} fill="rgba(139,69,244,.16)" stroke="#8b45f4" />
                    <text x="70" y="28" fill="#0f172a" fontSize="13">{fig.format(tiles.a, 2)}² + {fig.format(tiles.b, 2)}² = {fig.format(tiles.c, 2)}²</text>
                  </>
                ) : null}
                {mode === "Angle Sum" ? (
                  <>
                    <polygon points="80,190 260,190 150,70" fill="rgba(20,125,242,.12)" stroke="#147df2" />
                    <line x1="40" y1="210" x2={40 + torn.torn * 300} y2="210" stroke="#f59e0b" strokeWidth="6" />
                    <text x="48" y="34" fill="#0f172a" fontSize="13">Tear progress {fig.format(torn.torn * 100, 0)}% · sum {torn.sum}°</text>
                  </>
                ) : null}
                {mode === "Circle Theorems" ? (
                  <>
                    <circle cx="200" cy="120" r="78" fill="none" stroke="#147df2" />
                    <path d={`M200,120 L278,120 A78,78 0 0 ${circle.central > 180 ? 1 : 0} ${200 + 78 * Math.cos((circle.central * Math.PI) / 180)},${120 - 78 * Math.sin((circle.central * Math.PI) / 180)}`} fill="rgba(139,69,244,.2)" stroke="#8b45f4" />
                    <text x="40" y="28" fill="#0f172a" fontSize="13">Inscribed {fig.format(circle.inscribed, 1)}° = ½ · central {fig.format(circle.central, 1)}°</text>
                  </>
                ) : null}
                {mode === "Similarity" ? (
                  <>
                    <polygon points="70,200 190,200 70,90" fill="rgba(20,125,242,.14)" stroke="#147df2" />
                    <polygon points={`230,200 ${230 + 120 * sim.k / 2},200 230,${200 - 110 * sim.k / 2}`} fill="rgba(139,69,244,.12)" stroke="#8b45f4" />
                    <text x="40" y="28" fill="#0f172a" fontSize="13">Area scale k² = {fig.format(sim.area, 2)}</text>
                  </>
                ) : null}
              </svg>
            </section>
            <aside className="msk-panel msk-live">
              {mode === "Pythagoras" || mode === "Area Proofs" ? (
                <>
                  <LiveRow color="#08b9dd" label="a²" value={fig.format(tiles.a2)} />
                  <LiveRow color="#8b45f4" label="b²" value={fig.format(tiles.b2)} />
                  <LiveRow color="#f59e0b" label="c²" value={fig.format(tiles.c2)} />
                </>
              ) : null}
              {mode === "Angle Sum" ? <LiveRow color="#f59e0b" label="∠A+∠B+∠C" value={`${torn.sum}°`} /> : null}
              {mode === "Circle Theorems" ? <LiveRow color="#8b45f4" label="Inscribed" value={`${fig.format(circle.inscribed, 1)}°`} /> : null}
              {mode === "Similarity" ? <LiveRow color="#147df2" label="k² (area)" value={fig.format(sim.area, 2)} /> : null}
              <StatusOk>
                {mode === "Angle Sum" ? "∠A+∠B+∠C = 180°" : mode === "Circle Theorems" ? "Inscribed angle is half the centre" : "a² + b² = c²"}
              </StatusOk>
              <StepList items={["Watch the figure respond.", "Name the invariant.", "Tick the two-column step that matches this figure."]} />
              <ol className="msk-mini-table" aria-label="Two-column proof from this figure">
                {twoColumnClaims(mode, fig.state).map((row) => {
                  const key = `${mode}:${row.conclude}`;
                  const on = checked[key] ?? (mode === "Pythagoras" ? tiles.holds : false);
                  return (
                    <li key={row.conclude}>
                      <label>
                        <input
                          type="checkbox"
                          checked={on}
                          onChange={(event) => setChecked((prev) => ({ ...prev, [key]: event.target.checked }))}
                        />
                        {" "}Given {row.given} → {row.conclude} (live {row.live})
                      </label>
                    </li>
                  );
                })}
              </ol>
              <ChallengeBox
                prompt={mode === "Pythagoras" ? "In a 3-4-5 triangle, hypotenuse is?" : mode === "Angle Sum" ? "Angle sum of a triangle (degrees)?" : "Read the live value for this proof."}
                expected={expected}
                hint="Match the live figure, not a remembered slogan."
              />
            </aside>
          </>
        );
      }}
    </Phase1LabChrome>
  );
}
