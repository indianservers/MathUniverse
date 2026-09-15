import { useState, type PointerEvent } from "react";
import type { StudioMockupPage } from "../mockup/studioMockupCatalog";
import { ChallengeBox, LiveRow, Panel, StatusOk, StepList } from "../mockup/studioLabKit";
import { FigureToolbar, Phase1LabChrome } from "../phase1/Phase1LabChrome";
import { useStudioFigure } from "../phase1/useStudioFigure";
import { areIndependent, coordinates, gramSchmidt, spanDimension } from "./vectorSpaceMath";
import { ArrowDefs, DragHandle, FormulaBridge, NudgeSlider, VectorRay, LA_A, LA_B, LA_C, LA_D } from "./linearAlgebraCanvas";
import { markLinearComplete } from "./linearAlgebraStudioSession";

type Fig = { ax: number; ay: number; bx: number; by: number; n: number; px: number; py: number };
const initial: Fig = { ax: 2, ay: 0.4, bx: 0.4, by: 1.6, n: 2, px: 1.2, py: 1 };

function svgX(x: number) { return 210 + x * 48; }
function svgY(y: number) { return 180 - y * 48; }

export default function VectorSpacesLab({ page }: { page: StudioMockupPage }) {
  const fig = useStudioFigure(initial);
  const [drag, setDrag] = useState<"a" | "b" | "p" | null>(null);

  const move = (event: PointerEvent<SVGSVGElement>) => {
    if (!drag) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width * 8 - 4.4;
    const y = 3.75 - (event.clientY - rect.top) / rect.height * 7.5;
    if (drag === "a") fig.commit({ ...fig.state, ax: x, ay: y });
    if (drag === "b") fig.commit({ ...fig.state, bx: x, by: y });
    if (drag === "p") fig.commit({ ...fig.state, px: x, py: y });
  };

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
        const independent = areIndependent(fig.state.ax, fig.state.ay, fig.state.bx, fig.state.by);
        const n = mode === "Span" ? fig.state.n : 2;
        const dim = spanDimension(n, independent);
        const coords = coordinates(fig.state.px, fig.state.py, fig.state.ax, fig.state.ay, fig.state.bx, fig.state.by);
        const gs = gramSchmidt(fig.state.ax, fig.state.ay, fig.state.bx, fig.state.by);
        return (
          <>
            <Panel title={mode}>
              <NudgeSlider label="Vectors in the set" value={fig.state.n} min={1} max={3} step={1} onChange={(n) => fig.commit({ ...fig.state, n })} />
              <p className="msk-note">Drag a, b, and probe p. Grey b means it lies in span(a).</p>
            </Panel>
            <section className="msk-panel msk-canvas">
              <svg
                className="msk-graph is-interactive"
                viewBox="0 0 420 240"
                role="img"
                aria-label="Span"
                data-mode-canvas={mode}
                onPointerDown={(event) => {
                  const rect = event.currentTarget.getBoundingClientRect();
                  const sx = event.clientX - rect.left;
                  const sy = event.clientY - rect.top;
                  const hits: Array<["a" | "b" | "p", number, number]> = [
                    ["a", svgX(fig.state.ax), svgY(fig.state.ay)],
                    ["b", svgX(fig.state.bx), svgY(fig.state.by)],
                    ["p", svgX(fig.state.px), svgY(fig.state.py)],
                  ];
                  const hit = hits.find((item) => Math.hypot(sx - item[1], sy - item[2]) < 18);
                  setDrag(hit?.[0] ?? "a");
                  event.currentTarget.setPointerCapture(event.pointerId);
                }}
                onPointerMove={move}
                onPointerUp={() => setDrag(null)}
              >
                <rect width="420" height="240" fill="#f8fbff" />
                <ArrowDefs />
                <line x1="210" y1="12" x2="210" y2="228" stroke="#cbd5e1" />
                <line x1="16" y1="180" x2="404" y2="180" stroke="#cbd5e1" />
                {n >= 2 && independent ? (
                  <polygon
                    points={`${svgX(0)},${svgY(0)} ${svgX(fig.state.ax)},${svgY(fig.state.ay)} ${svgX(fig.state.ax + fig.state.bx)},${svgY(fig.state.ay + fig.state.by)} ${svgX(fig.state.bx)},${svgY(fig.state.by)}`}
                    fill="rgba(20,125,242,.12)"
                    stroke="#147df2"
                  />
                ) : n >= 2 ? (
                  <line x1={svgX(-3 * fig.state.ax)} y1={svgY(-3 * fig.state.ay)} x2={svgX(3 * fig.state.ax)} y2={svgY(3 * fig.state.ay)} stroke="#94a3b8" strokeWidth="6" opacity="0.35" />
                ) : null}
                <VectorRay x1={svgX(0)} y1={svgY(0)} x2={svgX(fig.state.ax)} y2={svgY(fig.state.ay)} color={LA_A} marker="la-a" />
                {n >= 2 ? <VectorRay x1={svgX(0)} y1={svgY(0)} x2={svgX(fig.state.bx)} y2={svgY(fig.state.by)} color={independent ? LA_B : "#94a3b8"} dashed={!independent} marker="la-b" /> : null}
                {mode === "Basis" || mode === "Gram-Schmidt" || n >= 2 ? (
                  <>
                    <VectorRay x1={svgX(0)} y1={svgY(0)} x2={svgX(gs.u1[0] * 2)} y2={svgY(gs.u1[1] * 2)} color={LA_D} marker="la-d" />
                    <VectorRay x1={svgX(0)} y1={svgY(0)} x2={svgX(gs.u2[0] * 2)} y2={svgY(gs.u2[1] * 2)} color={LA_C} marker="la-c" />
                  </>
                ) : null}
                <DragHandle x={svgX(fig.state.ax)} y={svgY(fig.state.ay)} fill={LA_A} label="a" />
                {n >= 2 ? <DragHandle x={svgX(fig.state.bx)} y={svgY(fig.state.by)} fill={independent ? LA_B : "#94a3b8"} label="b" shape="square" /> : null}
                <DragHandle x={svgX(fig.state.px)} y={svgY(fig.state.py)} fill={LA_C} label={coords ? `(${fig.format(coords.s, 1)}, ${fig.format(coords.t, 1)})` : "p"} shape="diamond" />
              </svg>
              <FormulaBridge>{independent ? "The parallelogram is span{a, b}." : "b lies on the line of a, so the span collapses to a line."}</FormulaBridge>
            </section>
            <aside className="msk-panel msk-live">
              <LiveRow color="#147df2" label="dim span" value={String(dim)} />
              <LiveRow color="#8b45f4" label="Independent?" value={independent ? "Yes" : "No · b in span(a)"} />
              <LiveRow color="#f59e0b" label="Coords of p" value={coords ? `(${fig.format(coords.s, 2)}, ${fig.format(coords.t, 2)})` : "not a basis"} />
              <LiveRow color="#10b981" label="Gram–Schmidt u1·u2" value={fig.format(gs.u1[0] * gs.u2[0] + gs.u1[1] * gs.u2[1], 3)} />
              <StatusOk>{mode === "Coordinates" ? "Coordinates are the weights on the current basis." : "A basis is independent and spanning. Green/amber are the orthonormal preview in R² (lift to R³ by adding a third independent direction)."}</StatusOk>
              <StepList items={["Drag vectors to fill or collapse the span.", "Dependence greys the second vector.", "Read coordinates of p in that basis."]} />
              <ChallengeBox prompt="Dimension of R²?" expected={2} hint="Two independent directions." page={page} onCorrect={() => markLinearComplete(page.id)} />
            </aside>
          </>
        );
      }}
    </Phase1LabChrome>
  );
}
