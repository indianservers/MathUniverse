import { lazy, Suspense, useMemo, useState } from 'react';
import type { Investigation3D } from './lesson3DRegistry';
import { buildInvestigation, initialInvestigation, investigationControls, type InvestigationState, type Marker3D } from './lesson3DModels';
import { surfaceGradient, type V3, type SolidKind, type SurfaceKind } from './lesson3DMath';
import type { Camera3D } from './Lesson3DScene';

const Scene=lazy(()=>import('./Lesson3DScene'));
const solids:SolidKind[]=['cube','cuboid','prism','pyramid','tetrahedron','octahedron','cylinder','cone','sphere','hemisphere','frustum'];
const sections:SolidKind[]=['cube','cuboid','pyramid','cylinder','cone','sphere','hemisphere','frustum'];
function CoordinateInputs({label,value,dimensions=3,onChange}:{label:string;value:V3;dimensions?:number;onChange:(value:V3)=>void}){
  return <fieldset className="l3d-coordinate-inputs"><legend>{label}</legend>{value.slice(0,dimensions).map((coordinate,i)=><label key={i}>{'xyz'[i]}<input type="number" aria-label={`${label} ${'xyz'[i]}`} min={-3} max={3} step={0.1} value={Number(coordinate.toFixed(3))} onChange={e=>{if(e.target.value.trim()==='')return;const next=Number(e.target.value);if(!Number.isFinite(next))return;const updated:V3=[...value];updated[i]=Math.max(-3,Math.min(3,next));onChange(updated);}}/></label>)}</fieldset>;
}
export default function Lesson3DInvestigation({config,title}:{config:Investigation3D;title:string}){
  const [state,setState]=useState(()=>initialInvestigation(config));
  const [camera,setCamera]=useState<Camera3D>('perspective');
  const [orthographic,setOrthographic]=useState(config.operation==='orthographic');
  const [axes,setAxes]=useState(true),[grid,setGrid]=useState(true),[revision,setRevision]=useState(0),[dragging,setDragging]=useState(false);
  const [prediction,setPrediction]=useState(''),[observation,setObservation]=useState(''),[recorded,setRecorded]=useState(false);
  const model=useMemo(()=>buildInvestigation(config,state),[config,state]);
  const controls=investigationControls(config),op=config.operation,family=config.family;
  const change=(patch:Partial<InvestigationState>)=>{setState(s=>({...s,...patch}));setRecorded(false);};
  const move=(kind:NonNullable<Marker3D['drag']>,point:V3)=>change(kind==='b'?{b:point}:{a:point});
  const reset=()=>{setState(initialInvestigation(config));setCamera('perspective');setOrthographic(op==='orthographic');setAxes(true);setGrid(true);setDragging(false);setRevision(n=>n+1);setPrediction('');setObservation('');setRecorded(false);};
  const surfacePoint=family==='surface'&&!['implicit','level','parametric','curve','cylindrical','spherical','double-integral'].includes(op);
  const vectorInputs=['vector','geometry','matrix','complex'].includes(family);
  const hasSecond=family==='vector'&&!['intro','position','components','unit','scale'].includes(op)||family==='geometry'&&!['ratios','cosines','parameter-line','cartesian-line'].includes(op)||family==='matrix';
  const aLabel=family==='geometry'?'First point / direction / normal':family==='matrix'?'First matrix column':family==='complex'?'Complex input':'Vector u';
  const bLabel=family==='geometry'?'Second point / direction':family==='matrix'?'Second matrix column':'Vector v';
  const selectableSolid=family==='solid'&&['section','volume','area','xray','camera','orthographic','placement'].includes(op);
  const selectableSurface=family==='surface'&&['graph','quadric','partial','gradient','tangent','normal','optimisation'].includes(op);
  const profiles:SurfaceKind[]=op==='optimisation'||op==='quadric'?['bowl','saddle']:['bowl','saddle','wave'];
  const fixedSystem=family==='matrix'&&['system','consistency'].includes(op)&&state.scenario!=='Unique';
  return <div className="l3d-investigation-body" data-testid={`lesson-3d-investigation-${config.id}`} data-family={family} data-operation={op}>
    <p className="l3d-prompt"><strong>Predict, then test.</strong> {config.question}</p>
    {config.extension&&<p className="l3d-extension">This spatial example extends the main lesson. Keep the original planar or algebraic view alongside it.</p>}
    <div className="l3d-layout">
      <aside className="l3d-controls" aria-label={`${title} 3D parameters`}>
        {vectorInputs&&!fixedSystem&&<CoordinateInputs label={aLabel} value={state.a} dimensions={family==='complex'?2:3} onChange={a=>change({a})}/>}
        {hasSecond&&!fixedSystem&&<CoordinateInputs label={bLabel} value={state.b} onChange={b=>change({b})}/>}
        {surfacePoint&&<CoordinateInputs label="Surface contact point" value={state.a} dimensions={2} onChange={a=>change({a})}/>}
        {!fixedSystem&&controls.map(control=><label className="l3d-range" key={control.key}>{control.label}<output>{Number(state[control.key].toFixed(3))}</output><input aria-label={control.label} type="range" min={control.min} max={control.max} step={control.step} value={state[control.key]} onChange={e=>change({[control.key]:Number(e.target.value)})}/></label>)}
        {fixedSystem&&<p>This fixed example demonstrates the solution classification. Choose Editable system to change its columns and right-hand side.</p>}
        {selectableSolid&&<label>Solid<select aria-label="Investigation solid" value={state.shape} onChange={e=>change({shape:e.target.value as SolidKind})}>{(op==='section'?sections:solids).map(shape=><option key={shape}>{shape}</option>)}</select></label>}
        {selectableSurface&&<label>Surface<select aria-label="Investigation surface" value={state.surface} onChange={e=>change({surface:e.target.value as SurfaceKind})}>{profiles.map(profile=><option value={profile} key={profile}>{profile==='bowl'?'Paraboloid: 0.3(x² + y²)':profile==='saddle'?'Saddle: 0.3(x² − y²)':'Wave: sin x cos y'}</option>)}</select></label>}
        {family==='geometry'&&['lines','skew','closest','line-angle'].includes(op)&&<label>Line configuration<select aria-label="Line configuration" value={state.scenario} onChange={e=>change({scenario:e.target.value})}>{['Skew','Intersecting','Parallel','Coincident'].map(kind=><option key={kind}>{kind}</option>)}</select></label>}
        {family==='matrix'&&['system','consistency'].includes(op)&&<label>System example<select aria-label="System example" value={state.scenario} onChange={e=>change({scenario:e.target.value})}><option value="Unique">Editable system</option><option value="Infinite">Infinitely many solutions</option><option value="Inconsistent">No common point</option></select></label>}
        {family==='conic'&&<div className="l3d-presets" aria-label="Conic cut presets">{[['Ellipse',0.4],['Parabola',1],['Hyperbola',1.8]].map(([name,slope])=><button key={name} type="button" onClick={()=>change({k:Number(slope)})}>{name}</button>)}</div>}
        {family==='surface'&&op==='optimisation'&&<button type="button" onClick={()=>{const [gx,gy]=surfaceGradient(state.surface,state.a[0],state.a[1]);change({a:[Math.max(-3,Math.min(3,state.a[0]-0.5*gx)),Math.max(-3,Math.min(3,state.a[1]-0.5*gy)),0]});}}>Take a gradient descent step</button>}
        {family==='vector'&&op==='cross'&&<button type="button" onClick={()=>change({a:state.b,b:state.a})}>Swap u and v</button>}
        <label className="l3d-check"><input type="checkbox" checked={axes} onChange={e=>setAxes(e.target.checked)}/>Coordinate axes</label>
        <label className="l3d-check"><input type="checkbox" checked={grid} onChange={e=>setGrid(e.target.checked)}/>xy grid</label>
        <label className="l3d-check"><input type="checkbox" checked={state.construction} onChange={e=>change({construction:e.target.checked})}/>Supporting lines and edges</label>
        <button type="button" onClick={reset}>Reset 3D investigation</button>
      </aside>
      <div className="l3d-visual-column">
        <div className="l3d-camera-toolbar" role="group" aria-label="3D camera views">{(['perspective','top','front','right'] as Camera3D[]).map(view=><button type="button" key={view} aria-pressed={camera===view} onClick={()=>{setCamera(view);setRevision(n=>n+1);}}>{view==='perspective'?'Perspective':view==='top'?'Top (xy)':view==='front'?'Front (xz)':'Side (yz)'}</button>)}<button type="button" onClick={()=>setRevision(n=>n+1)}>Fit model in view</button><label className="l3d-check"><input type="checkbox" checked={orthographic} onChange={e=>setOrthographic(e.target.checked)}/>Orthographic camera</label></div>
        <div className="l3d-canvas" role="region" aria-label={`${title} interactive 3D scene`}>
          <Suspense fallback={<p className="l3d-fallback" role="status">Loading interactive 3D scene…</p>}><Scene model={model} profile={state.surface} camera={camera} orthographic={orthographic} revision={revision} axes={axes} grid={grid} construction={state.construction} dragging={dragging} onMove={move} onDragging={setDragging}/></Suspense>
        </div>
        <p className="l3d-camera-help">Drag empty space to rotate, scroll or pinch to zoom, and use two fingers to pan. Coloured point handles move in the xy-plane; use the coordinate fields to change z. All mathematical controls work with the keyboard.</p>
        <div className="l3d-readouts" aria-label="3D mathematical results"><dl>{model.readouts.map(([label,value])=><div key={label}><dt>{label}</dt><dd><output>{value}</output></dd></div>)}</dl></div>
        <p className="l3d-model-notice">{model.notice}</p>
      </div>
    </div>
    <div className="l3d-reflection"><label>My prediction<textarea aria-label="3D investigation prediction" value={prediction} maxLength={2000} onChange={e=>{setPrediction(e.target.value);setRecorded(false);}} placeholder="Predict the change before adjusting a parameter."/></label><label>What I observed<textarea aria-label="3D investigation observation" value={observation} maxLength={2000} onChange={e=>{setObservation(e.target.value);setRecorded(false);}} placeholder="Describe the result and connect it to the equation."/></label><button type="button" disabled={!prediction.trim()||!observation.trim()} onClick={()=>setRecorded(true)}>Mark prediction compared</button><p role="status">{recorded?'Prediction and observation compared. This is a reflection, not an automatically graded answer.':'Notes remain here while this investigation is open. Use the lesson study session to save longer notes.'}</p></div>
  </div>;
}
