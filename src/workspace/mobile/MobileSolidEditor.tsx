import { useState } from "react";
import type { ObjectStudioItem, ObjectStudioTool, ObjectStudioTransform } from "../../graph-studio/ObjectStudioWorkspace";
import MobileNumber from "./MobileNumber";

export default function MobileSolidEditor({ object, update, tool, duplicate, remove, snap, onSnap, step, onStep }: {
  object?: ObjectStudioItem; update: (patch: Partial<ObjectStudioTransform>) => void; tool: (tool: ObjectStudioTool) => void;
  duplicate: () => void; remove: () => void; snap: boolean; onSnap: (value: boolean) => void; step: number; onStep: (value: number) => void;
}) {
  const [axis, setAxis] = useState<0 | 1 | 2>(0);
  const [angleSnap, setAngleSnap] = useState(true);
  if (!object) return <p>Select an object from Objects to edit it.</p>;
  const t = object.transform;
  const nudge = (direction: number) => { const position = [...t.position] as [number, number, number]; position[axis] += direction * step; update({ position }); };
  const rotate = (direction: number) => { const rotation = [...t.rotation] as [number, number, number]; rotation[axis] += direction * (angleSnap ? 15 : 1); update({ rotation }); };
  return <div className="mws-solid-editor"><h3>{t.name || object.label}</h3>
    <div className="mws-action-grid"><button type="button" onClick={() => tool("orbit")}>Orbit camera</button><button type="button" disabled={t.locked} onClick={() => tool("move")}>Move object</button><button type="button" disabled={t.locked} onClick={() => tool("rotate")}>Rotate object</button><button type="button" disabled={t.locked} onClick={() => tool("scale")}>Resize object</button></div>
    <fieldset disabled={t.locked}><legend>Precise transform</legend>
      <div className="mws-action-grid">{(["X", "Y", "Z"] as const).map((name, i) => <button key={name} type="button" aria-pressed={axis === i} onClick={() => setAxis(i as 0 | 1 | 2)}>{name} axis</button>)}</div>
      <div className="mws-action-grid"><button type="button" onClick={() => nudge(-1)}>Move −</button><button type="button" onClick={() => nudge(1)}>Move +</button><button type="button" onClick={() => rotate(-1)}>Rotate −</button><button type="button" onClick={() => rotate(1)}>Rotate +</button></div>
      <label><input type="checkbox" checked={angleSnap} onChange={e => setAngleSnap(e.target.checked)} />Snap rotation to 15°</label>
      <label><input type="checkbox" checked={snap} onChange={e => onSnap(e.target.checked)} />Snap movement</label><MobileNumber label="Movement step" value={step} min={.01} max={10} onChange={onStep} />
      {(["X", "Y", "Z"] as const).map((name, i) => <div key={name} className="mws-action-grid">
        <MobileNumber label={`${name} position`} value={t.position[i]} onChange={value => { const position = [...t.position] as [number, number, number]; position[i] = value; update({ position }); }} />
        <MobileNumber label={`${name} rotation degrees`} value={t.rotation[i]} onChange={value => { const rotation = [...t.rotation] as [number, number, number]; rotation[i] = value; update({ rotation }); }} />
        <MobileNumber label={`${name} dimension`} value={(t.dimensions ?? [1, 1, 1])[i]} min={.05} max={100} onChange={value => { const dimensions = [...(t.dimensions ?? [1, 1, 1])] as [number, number, number]; dimensions[i] = value; update({ dimensions }); }} />
      </div>)}
      <MobileNumber label="Object scale" value={t.scale} min={.05} max={100} onChange={scale => update({ scale })} />
    </fieldset>
    <label>Object color<input aria-label="Object color" type="color" value={t.color} onChange={e => update({ color: e.target.value })} /></label>
    <div className="mws-action-grid"><button type="button" onClick={duplicate}>Duplicate object</button><button type="button" onClick={remove}>Delete object</button></div>
  </div>;
}
