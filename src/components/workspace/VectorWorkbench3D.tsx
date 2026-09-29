import { useMemo } from "react";
import {
  vectorAngle3, vectorCross3, vectorDot3, vectorMagnitude3, vectorProjection3,
  vectorUnit3, vectorWorkbenchResult, type Vector3Tuple, type VectorView3D,
} from "../../workspace/vectorWorkbench3d";
import "./VectorWorkbench3D.css";

type Props = {
  a: Vector3Tuple;
  b: Vector3Tuple;
  view: VectorView3D;
  visible: boolean;
  focus: boolean;
  onA: (value: Vector3Tuple) => void;
  onB: (value: Vector3Tuple) => void;
  onView: (value: VectorView3D) => void;
  onVisible: (value: boolean) => void;
  onFocus: (value: boolean) => void;
};

const presets: { label: string; a: Vector3Tuple; b: Vector3Tuple }[] = [
  { label: "Perpendicular", a: [3, 0, 0], b: [0, 0, 2] },
  { label: "Same direction", a: [2, 1, 0], b: [4, 2, 0] },
  { label: "3D turn", a: [2, 1, 1], b: [-1, 2, 2] },
];

const labels: Record<VectorView3D, string> = {
  sum: "A + B", difference: "A − B", cross: "A × B", projection: "projᵦ A",
};

const fmt = (value: number) => Number.isFinite(value) ? Number(value.toFixed(2)).toString() : "—";
const fmtVector = (vector: Vector3Tuple | null) => vector ? `(${vector.map(fmt).join(", ")})` : "undefined";

export default function VectorWorkbench3D({ a, b, view, visible, focus, onA, onB, onView, onVisible, onFocus }: Props) {
  const result = useMemo(() => vectorWorkbenchResult(a, b, view), [a, b, view]);
  const angle = vectorAngle3(a, b);
  const cross = vectorCross3(a, b);
  const projection = vectorProjection3(a, b);
  const explanation = view === "sum"
    ? "Add matching components. The purple arrow reaches the opposite corner of the parallelogram."
    : view === "difference"
      ? "Subtract matching components. From the same origin, A − B points from B’s tip to A’s tip."
      : view === "cross"
        ? "The cross product is perpendicular to both vectors. Its length is their parallelogram area."
        : "Projection is the part of A along B. It may point opposite to B when the dot product is negative.";

  const update = (vector: Vector3Tuple, index: number, raw: string, onChange: (value: Vector3Tuple) => void) => {
    const next = Number(raw);
    if (!Number.isFinite(next)) return;
    const copy: Vector3Tuple = [...vector];
    copy[index] = Math.max(-10, Math.min(10, next));
    onChange(copy);
  };

  return (
    <div className="vector-workbench" aria-label="Vector Lab">
      <div className="vector-workbench-heading">
        <strong>Vector Lab</strong>
        <label><input type="checkbox" checked={visible} onChange={(event) => onVisible(event.target.checked)} /> Show in 3D scene</label>
      </div>
      <label className="vector-workbench-focus"><input type="checkbox" checked={focus} onChange={(event) => onFocus(event.target.checked)} /> Focus vectors in the scene</label>
      <p className="vector-workbench-intro">Edit two vectors and see their relationship in the workspace.</p>
      <div className="vector-workbench-presets" aria-label="Vector examples">
        {presets.map((preset) => <button type="button" key={preset.label} onClick={() => { onA(preset.a); onB(preset.b); onVisible(true); }}>{preset.label}</button>)}
      </div>
      {([["A", a, onA], ["B", b, onB]] as const).map(([name, vector, onChange]) => (
        <fieldset className="vector-workbench-inputs" key={name}>
          <legend><span className={`vector-chip vector-chip-${name.toLowerCase()}`} /> Vector {name} <small>{fmtVector(vector)}</small></legend>
          {(["x", "y", "z"] as const).map((axis, index) => <label key={axis}>{axis}<input type="number" min="-10" max="10" step="0.25" value={vector[index]} aria-label={`Vector ${name} ${axis}`} onChange={(event) => update(vector, index, event.target.value, onChange)} /></label>)}
        </fieldset>
      ))}
      <div className="vector-workbench-operations" aria-label="Vector operation">
        {(Object.keys(labels) as VectorView3D[]).map((operation) => <button type="button" key={operation} className={view === operation ? "active" : ""} aria-pressed={view === operation} onClick={() => { onView(operation); onVisible(true); }}>{labels[operation]}</button>)}
      </div>
      <div className="vector-workbench-result" aria-live="polite">
        <span>Result · {labels[view]}</span><strong>{fmtVector(result)}</strong>
        {result === null && <small>Choose a nonzero vector B to define the projection.</small>}
      </div>
      <p className="vector-workbench-explanation">{explanation}</p>
      <div className="vector-workbench-stats">
        <div><span>|A|</span><strong>{fmt(vectorMagnitude3(a))}</strong></div>
        <div><span>|B|</span><strong>{fmt(vectorMagnitude3(b))}</strong></div>
        <div><span>A · B</span><strong>{fmt(vectorDot3(a, b))}</strong></div>
        <div><span>Angle</span><strong>{angle === null ? "undefined" : `${fmt(angle)}°`}</strong></div>
        <div><span>|A × B| · area</span><strong>{fmt(vectorMagnitude3(cross))}</strong></div>
        <div><span>unit A</span><strong>{fmtVector(vectorUnit3(a))}</strong></div>
      </div>
      <p className="vector-workbench-footnote">{projection === null ? "Projection needs B ≠ 0." : `Projection of A on B: ${fmtVector(projection)}`} {angle === null ? "The angle needs two nonzero vectors." : ""} Arrows share a scale and shrink together when needed to fit the scene.</p>
    </div>
  );
}
