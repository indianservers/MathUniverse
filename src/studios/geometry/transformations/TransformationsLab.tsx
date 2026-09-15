import { useMemo, useState, type PointerEvent } from "react";
import type { StudioMockupPage } from "../../mockup/studioMockupCatalog";
import { ChallengeBox, LiveRow, Panel, SliderRow, StatusOk, StepList } from "../../mockup/studioLabKit";
import { FigureToolbar, Phase1LabChrome } from "../../phase1/Phase1LabChrome";
import { useStudioFigure } from "../../phase1/useStudioFigure";
import { applyTransform, distance, isIsometry, type Point } from "./transformationMath";

const PRE = [
  { id: "A", x: 1, y: 0.2 },
  { id: "B", x: 2.4, y: 0.4 },
  { id: "C", x: 1.5, y: 1.8 },
];

const ORIGIN = { x: 0, y: 0 };

type Fig = { tx: number; ty: number; rot: number; k: number; ax: number; ay: number };

const initial: Fig = { tx: 1.2, ty: 0.4, rot: 30, k: 1.2, ax: 1, ay: 0.2 };

function toSvg(p: Point) {
  return { x: 210 + p.x * 70, y: 200 - p.y * 70 };
}

export default function TransformationsLab({ page }: { page: StudioMockupPage }) {
  const fig = useStudioFigure(initial);
  const [drag, setDrag] = useState<string | null>(null);
  const pre = useMemo(() => [{ ...PRE[0]!, x: fig.state.ax, y: fig.state.ay }, PRE[1]!, PRE[2]!], [fig.state.ax, fig.state.ay]);

  const onPointer = (event: PointerEvent<SVGSVGElement>) => {
    if (!drag) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width * 8 - 3;
    const y = 2.4 - (event.clientY - rect.top) / rect.height * 4.8;
    if (drag === "A") fig.commit({ ...fig.state, ax: x, ay: y });
    if (drag === "T") fig.commit({ ...fig.state, tx: x, ty: y });
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
        const t = { x: fig.state.tx, y: fig.state.ty };
        const image = pre.map((p) => applyTransform(mode, p, t, fig.state.rot, fig.state.k, ORIGIN));
        const iso = isIsometry(mode, fig.state.k);
        const ab = distance(pre[0]!, pre[1]!);
        const abImage = distance(image[0]!, image[1]!);
        const expected = mode === "Rotate" ? -1 : mode === "Dilate" ? fig.state.k : fig.state.tx;
        return (
          <>
            <Panel title={mode}>
              {mode === "Translate" || mode === "Compose" ? (
                <>
                  <SliderRow label="Translate x" value={fig.state.tx} min={-3} max={4} step={0.1} onChange={(tx) => fig.commit({ ...fig.state, tx })} />
                  <SliderRow label="Translate y" value={fig.state.ty} min={-2} max={3} step={0.1} onChange={(ty) => fig.commit({ ...fig.state, ty })} />
                </>
              ) : null}
              {mode === "Rotate" || mode === "Compose" ? (
                <SliderRow label="Rotate °" value={fig.state.rot} min={-180} max={180} step={1} onChange={(rot) => fig.commit({ ...fig.state, rot })} />
              ) : null}
              {mode === "Dilate" || mode === "Compose" ? (
                <SliderRow label="Dilate k" value={fig.state.k} min={-1.6} max={2.4} step={0.05} onChange={(k) => fig.commit({ ...fig.state, k })} />
              ) : null}
              {mode === "Reflect" ? <p className="msk-note">The mirror is the y-axis. Drag A; distances to the line stay equal.</p> : null}
              <p className="msk-note">Drag vertex A or the translation handle T. Undo, share, and exact labels stay on the figure.</p>
            </Panel>
            <section className="msk-panel msk-canvas">
              <svg
                className="msk-graph is-interactive"
                viewBox="0 0 420 280"
                role="img"
                aria-label={`${mode} transformation`}
                data-mode-canvas={mode}
                onPointerDown={(event) => {
                  const rect = event.currentTarget.getBoundingClientRect();
                  const sx = event.clientX - rect.left;
                  const sy = event.clientY - rect.top;
                  const a = toSvg(pre[0]!);
                  const th = toSvg(t);
                  setDrag(Math.hypot(sx - th.x, sy - th.y) < 16 ? "T" : "A");
                  event.currentTarget.setPointerCapture(event.pointerId);
                }}
                onPointerMove={onPointer}
                onPointerUp={() => setDrag(null)}
              >
                <rect width="420" height="280" fill="#f8fbff" />
                <line x1="210" y1="8" x2="210" y2="272" stroke="#cbd5e1" />
                <line x1="12" y1="200" x2="408" y2="200" stroke="#cbd5e1" />
                <polygon points={pre.map((p) => `${toSvg(p).x},${toSvg(p).y}`).join(" ")} fill="rgba(20,125,242,.12)" stroke="#147df2" />
                <polygon points={image.map((p) => `${toSvg(p).x},${toSvg(p).y}`).join(" ")} fill="rgba(139,69,244,.12)" stroke="#8b45f4" />
                {pre.map((p, i) => {
                  const s = toSvg(p);
                  return <circle key={p.id} cx={s.x} cy={s.y} r={i === 0 ? 7 : 4} fill="#147df2" />;
                })}
                {image.map((p, i) => {
                  const s = toSvg(p);
                  return <circle key={`i${i}`} cx={s.x} cy={s.y} r="4" fill="#8b45f4" />;
                })}
                <circle cx={toSvg(t).x} cy={toSvg(t).y} r="6" fill="#f59e0b" />
                <text x={toSvg(t).x + 8} y={toSvg(t).y} fill="#b45309" fontSize="11">T</text>
              </svg>
            </section>
            <aside className="msk-panel msk-live">
              <LiveRow color="#147df2" label="Pre-image" value="△ABC" />
              <LiveRow color="#8b45f4" label="Image A′" value={`(${fig.format(image[0]!.x, 2)}, ${fig.format(image[0]!.y, 2)})`} />
              <LiveRow color="#f59e0b" label="AB vs A′B′" value={`${fig.format(ab, 2)} → ${fig.format(abImage, 2)}`} />
              <LiveRow color="#08b9dd" label="Isometry?" value={iso ? "Yes · distances kept" : "No · dilation"} />
              <StatusOk>{mode === "Compose" ? "Maps apply translate, then rotate, then dilate (right to left on the stack)." : `${mode} is applied to every vertex.`}</StatusOk>
              <StepList items={[`${mode} determines every image point uniquely.`, "Drag A to see the invariant.", "Share the URL to restore this figure."]} />
              <ChallengeBox
                prompt={mode === "Rotate" ? "Rotation of 180° around origin sends (1,0) to x=?" : "What is the live translation x (or k if dilating)?"}
                expected={mode === "Rotate" ? -1 : expected}
                hint={mode === "Rotate" ? "Halfway around the origin." : "Read the live T or k value."}
              />
            </aside>
          </>
        );
      }}
    </Phase1LabChrome>
  );
}
