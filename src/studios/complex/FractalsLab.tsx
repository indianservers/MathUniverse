import { useMemo, type PointerEvent } from "react";
import type { StudioMockupPage } from "../mockup/studioMockupCatalog";
import { ChallengeBox, LiveRow, Panel, SliderRow, StatusOk } from "../mockup/studioLabKit";
import { FigureToolbar, Phase1LabChrome } from "../phase1/Phase1LabChrome";
import { useStudioFigure } from "../phase1/useStudioFigure";
import { juliaConnected, orbit, periodBulbLabel } from "./fractalMath";
import { computeFractalGrid } from "./fractalWorker";

type Fig = { cx: number; cy: number; iter: number };
const initial: Fig = { cx: -0.123, cy: 0.745, iter: 40 };

function FractalGrid({ kind, cx, cy, iter }: { kind: "mandel" | "julia"; cx: number; cy: number; iter: number }) {
  const cols = 72;
  const rows = 48;
  const cells = useMemo(() => computeFractalGrid({ kind, cx, cy, iter, cols, rows }), [cols, rows, cx, cy, iter, kind]);
  return (
    <svg className="msk-graph is-dark" viewBox={`0 0 ${cols} ${rows}`} role="img" aria-label={kind === "mandel" ? "Mandelbrot set" : "Julia set"}>
      {cells.map((cell) => (
        <rect key={`${cell.col}-${cell.row}`} x={cell.col} y={cell.row} width="1" height="1" fill={cell.k >= iter ? "#020617" : `hsl(${260 + cell.k * 8} 80% ${30 + cell.k * 2}%)`} />
      ))}
    </svg>
  );
}

export default function FractalsLab({ page }: { page: StudioMockupPage }) {
  const fig = useStudioFigure(initial);
  const pts = orbit(0, 0, fig.state.cx, fig.state.cy, 18);
  const inside = juliaConnected(fig.state.cx, fig.state.cy);
  const bulb = periodBulbLabel(fig.state.cx, fig.state.cy);

  const pickC = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const cx = -2.2 + ((event.clientX - rect.left) / rect.width) * 3.2;
    const cy = 1.4 - ((event.clientY - rect.top) / rect.height) * 2.8;
    fig.commit({ ...fig.state, cx, cy });
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
      {(mode) => (
        <>
          <Panel title="Fractal controls">
            <SliderRow label="Re c" value={fig.state.cx} min={-2} max={1} step={0.001} onChange={(cx) => fig.commit({ ...fig.state, cx })} />
            <SliderRow label="Im c" value={fig.state.cy} min={-1.2} max={1.2} step={0.001} onChange={(cy) => fig.commit({ ...fig.state, cy })} />
            <SliderRow label="Max iterations" value={fig.state.iter} min={12} max={80} step={1} onChange={(iter) => fig.commit({ ...fig.state, iter })} />
            <button type="button" className="msk-soft" onClick={() => fig.commit({ ...fig.state, cx: -0.123, cy: 0.745 })}>Douady rabbit</button>
            <button type="button" className="msk-soft" onClick={() => fig.commit({ ...fig.state, cx: -0.75, cy: 0.11 })}>Dendrite</button>
            <p className="msk-note">Click the Mandelbrot plot to choose c. The Julia set and orbit update together.</p>
          </Panel>
          <section className="msk-panel msk-canvas" data-studio="complex-numbers" data-mode-canvas={mode} data-cx-mode={mode}>
            <header className="cx-canvas-head">
              <h2>MANDELBROT &amp; JULIA</h2>
              <small>{mode}</small>
            </header>
            <div className="msk-dual-dark">
              <div className="is-interactive" onPointerDown={pickC}>
                <p className="msk-note">Mandelbrot set · {bulb}</p>
                <FractalGrid kind="mandel" cx={fig.state.cx} cy={fig.state.cy} iter={fig.state.iter} />
              </div>
              <div>
                <p className="msk-note">Julia set for c · {inside ? "connected" : "dust (challenge: is it connected?)"}</p>
                <FractalGrid kind="julia" cx={fig.state.cx} cy={fig.state.cy} iter={fig.state.iter} />
              </div>
            </div>
            <svg className="msk-graph" viewBox="0 0 360 80" aria-label="Orbit of 0">
              <rect width="360" height="80" fill="#0f172a" />
              {pts.map((p, i) => <circle key={i} cx={180 + p.x * 28} cy={40 - p.y * 28} r="2.4" fill="#fbbf24" />)}
            </svg>
          </section>
          <aside className="msk-panel msk-live">
            <LiveRow color="#8b45f4" label="c" value={`${fig.format(fig.state.cx, 3)} + ${fig.format(fig.state.cy, 3)}i`} />
            <LiveRow color="#08b9dd" label="|c|" value={fig.format(Math.hypot(fig.state.cx, fig.state.cy), 4)} />
            <LiveRow color="#10b981" label="Period bulb" value={bulb} />
            <LiveRow color="#08b9dd" label="Julia connected?" value={inside ? "yes" : "likely dust"} />
            <StatusOk>zₙ₊₁ = zₙ² + c. Bounded orbits stay in the set. For c=0 the orbit of 0 stays at 0.</StatusOk>
            <ChallengeBox prompt="For c=0, is 0 in the Mandelbrot set? Enter 1 for yes." expected={1} hint="Orbit stays at 0." />
          </aside>
        </>
      )}
    </Phase1LabChrome>
  );
}
