import { useState } from "react";
import RegularTessellationLab from "./tessellation/TessellationLab";
import { ChallengePanel, Controls, FormulaCard, LivePanel, MeasureRow, PresetGrid, PropertyCard, VIEW, fmtDeg } from "./polygonUi";
import { interiorAngleRegular, regularPolygonName, tessellationAngleCheck } from "./polygonMath";
import { SliderRow } from "../../mockup/studioLabKit";

type TessSub = "regular" | "semiregular" | "custom";
type Tile = "3" | "4" | "6";

const SEMI = [
  { id: "3.3.3.3.3.3", label: "3.3.3.3.3.3" },
  { id: "4.4.4.4", label: "4.4.4.4" },
  { id: "6.6.6", label: "6.6.6" },
  { id: "3.6.3.6", label: "3.6.3.6" },
  { id: "3.4.6.4", label: "3.4.6.4" },
  { id: "3.12.12", label: "3.12.12" },
  { id: "4.8.8", label: "4.8.8" },
  { id: "4.6.12", label: "4.6.12" },
];

function poly(cx: number, cy: number, n: number, r: number, rot = -90) {
  return Array.from({ length: n }, (_, i) => {
    const a = ((rot + (i * 360) / n) * Math.PI) / 180;
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(" ");
}

export default function TessellationLab() {
  const [sub, setSub] = useState<TessSub>("regular");
  const [semi, setSemi] = useState("6.6.6");
  const [custom, setCustom] = useState<Tile>("4");
  const [stampRot, setStampRot] = useState(0);
  const [stamps, setStamps] = useState<Array<{ x: number; y: number; kind: Tile; rot: number }>>([
    { x: 220, y: 180, kind: "4", rot: 0 },
    { x: 256, y: 180, kind: "4", rot: 0 },
    { x: 220, y: 216, kind: "4", rot: 0 },
  ]);
  const [n, setN] = useState(6);
  const test = tessellationAngleCheck(n);

  if (sub === "regular") {
    return (
      <div>
        <div className="poly-sub" style={{ marginBottom: 10 }}>
          <button type="button" className="active" onClick={() => setSub("regular")}>Regular tessellations</button>
          <button type="button" onClick={() => setSub("semiregular")}>Semi-regular</button>
          <button type="button" onClick={() => setSub("custom")}>Custom tile explorer</button>
        </div>
        <RegularTessellationLab />
      </div>
    );
  }

  return (
    <div className="poly-lab">
      <Controls title="Tessellation">
        <div className="poly-sub">
          <button type="button" onClick={() => setSub("regular")}>Regular tessellations</button>
          <button type="button" className={sub === "semiregular" ? "active" : ""} onClick={() => setSub("semiregular")}>Semi-regular</button>
          <button type="button" className={sub === "custom" ? "active" : ""} onClick={() => setSub("custom")}>Custom tile explorer</button>
        </div>
        {sub === "semiregular" ? <PresetGrid value={semi} items={SEMI} onChange={setSemi} /> : null}
        {sub === "custom" ? (
          <>
            <PresetGrid value={custom} items={[{ id: "3", label: "Triangle" }, { id: "4", label: "Square" }, { id: "6", label: "Hexagon" }]} onChange={(id) => setCustom(id as Tile)} />
            <SliderRow label="Rotate stamp" value={stampRot} min={0} max={180} step={15} onChange={setStampRot} unit="°" />
            <button type="button" className="poly-ghost" onClick={() => setStamps((c) => [...c, ...c.slice(-1).map((s) => ({ ...s, x: s.x + 36 }))])}>Duplicate last</button>
            <button type="button" className="poly-ghost" onClick={() => setStamps([])}>Clear tiles</button>
          </>
        ) : null}
        <SliderRow label="Angle test n" value={n} min={3} max={12} step={1} onChange={setN} />
      </Controls>
      <section className="msk-panel msk-canvas poly-stage">
        <svg className="msk-graph poly-svg" viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} role="img" aria-label="Tessellation extras"
          onClick={(event) => {
            if (sub !== "custom") return;
            const rect = event.currentTarget.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * VIEW.w;
            const y = ((event.clientY - rect.top) / rect.height) * VIEW.h;
            const size = custom === "6" ? 48 : 36;
            setStamps((current) => [...current, { x: Math.round(x / size) * size, y: Math.round(y / size) * size, kind: custom, rot: stampRot }]);
          }}
        >
          <rect width={VIEW.w} height={VIEW.h} fill="#f7fbff" />
          {sub === "semiregular" ? <SemiPattern id={semi} /> : null}
          {sub === "custom" ? stamps.map((s, i) => (
            <polygon key={i} points={poly(s.x, s.y, Number(s.kind), s.kind === "6" ? 22 : 18, s.rot - 90)} fill="rgba(8,185,221,.16)" stroke="#0891b2" />
          )) : null}
          <text x="20" y="26" fill="#0f172a" fontSize="14" fontWeight="800">{sub === "semiregular" ? `Vertex figure ${semi}` : "Custom repeating patch"}</text>
        </svg>
      </section>
      <LivePanel title="Vertex test">
        <MeasureRow color="#147df2" label="n" value={regularPolygonName(n)} />
        <MeasureRow color="#8b45f4" label="Interior angle" value={fmtDeg(interiorAngleRegular(n))} />
        <MeasureRow color="#0f766e" label="Sum around vertex" value={fmtDeg(test.product, 1)} />
        <p className={test.tessellates ? "poly-ok" : "poly-warn"}>{test.tessellates ? "Valid regular monohedral tessellation." : "NOT a regular monohedral tessellation."}</p>
        <FormulaCard title="Angle condition">k × interior = 360° with integer k ≥ 3. Triangle, square, and hexagon only.</FormulaCard>
        <PropertyCard title="Archimedean / custom">Semi-regular figures mix regular polygons so every vertex looks the same. Custom mode stamps and snaps tiles — educational, not CAD.</PropertyCard>
        <p className="poly-world"><b>Real world</b> Floor tiles, Islamic patterns, paving, and crystal lattices.</p>
        <ChallengePanel
          prompt="Find all regular polygons here that can tile around one vertex."
          hint="n = 3, 4, and 6."
          check={() => ({ ok: n === 3 || n === 4 || n === 6, detail: test.reason })}
          onReset={() => setN(5)}
        />
      </LivePanel>
    </div>
  );
}

function SemiPattern({ id }: { id: string }) {
  if (id === "4.4.4.4") {
    return <g>{Array.from({ length: 8 }, (_, j) => Array.from({ length: 10 }, (_, i) => <rect key={`${i}-${j}`} x={40 + i * 56} y={50 + j * 56} width="56" height="56" fill="rgba(8,185,221,.08)" stroke="#147df2" />))}</g>;
  }
  if (id === "6.6.6" || id === "3.3.3.3.3.3") {
    return (
      <g>
        {Array.from({ length: 6 }, (_, j) => Array.from({ length: 8 }, (_, i) => {
          const x = 56 + i * 66 + (j % 2) * 33;
          const y = 60 + j * 58;
          return <polygon key={`${i}-${j}`} points={poly(x, y, id === "6.6.6" ? 6 : 3, id === "6.6.6" ? 22 : 16)} fill="rgba(139,69,244,.08)" stroke="#8b45f4" />;
        }))}
      </g>
    );
  }
  if (id === "4.8.8") {
    return (
      <g>
        {Array.from({ length: 4 }, (_, j) => Array.from({ length: 5 }, (_, i) => {
          const x = 80 + i * 110;
          const y = 70 + j * 110;
          return (
            <g key={`${i}-${j}`}>
              <polygon points={poly(x, y, 8, 42, -22.5)} fill="rgba(20,125,242,.1)" stroke="#147df2" />
              <rect x={x + 30} y={y + 30} width="28" height="28" fill="rgba(245,158,11,.16)" stroke="#f59e0b" />
            </g>
          );
        }))}
      </g>
    );
  }
  if (id === "3.6.3.6") {
    return (
      <g>
        {Array.from({ length: 5 }, (_, j) => Array.from({ length: 7 }, (_, i) => {
          const x = 70 + i * 80 + (j % 2) * 40;
          const y = 70 + j * 70;
          return (
            <g key={`${i}-${j}`}>
              <polygon points={poly(x, y, 6, 24)} fill="rgba(139,69,244,.1)" stroke="#8b45f4" />
              <polygon points={poly(x + 21, y, 3, 12)} fill="rgba(20,125,242,.12)" stroke="#147df2" />
            </g>
          );
        }))}
      </g>
    );
  }
  if (id === "3.12.12" || id === "4.6.12" || id === "3.4.6.4") {
    return (
      <g>
        {Array.from({ length: 3 }, (_, j) => Array.from({ length: 4 }, (_, i) => {
          const x = 100 + i * 140;
          const y = 90 + j * 130;
          return (
            <g key={`${i}-${j}`}>
              <polygon points={poly(x, y, id === "3.4.6.4" ? 6 : 12, id === "3.4.6.4" ? 22 : 44)} fill="rgba(8,185,221,.1)" stroke="#0891b2" />
              {id === "3.12.12" ? <polygon points={poly(x + 52, y, 3, 16)} fill="rgba(245,158,11,.18)" stroke="#f59e0b" /> : null}
              {id === "4.6.12" ? <rect x={x - 12} y={y + 28} width="18" height="18" fill="rgba(245,158,11,.16)" stroke="#f59e0b" /> : null}
              {id === "3.4.6.4" ? <rect x={x + 14} y={y - 8} width="16" height="16" fill="rgba(20,125,242,.12)" stroke="#147df2" /> : null}
            </g>
          );
        }))}
      </g>
    );
  }
  return null;
}
