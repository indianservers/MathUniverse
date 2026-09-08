import{useState,type ReactNode}from"react";import*as geo from"./geometryEnhancementEngine";
function Tool({id,title,children}:{id:string;title:string;children:ReactNode}){return <article data-enhancement-id={id} className="min-h-40 rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-white/10 dark:bg-slate-950/70"><h2 className="text-sm font-black">{title}</h2>{children}</article>};
function Out({children}:{children:unknown}){return <output className="mt-3 block break-words rounded-lg bg-cyan-50 p-2 font-mono text-[11px] leading-5 text-slate-800 dark:bg-cyan-950/40 dark:text-cyan-50">{JSON.stringify(children,(_k,v)=>typeof v==="number"?Number.isFinite(v)?Math.round(v*1e5)/1e5:String(v):v)}</output>};
function Input({label,value,onChange}:{label:string;value:number;onChange:(v:number)=>void}){return <label className="grid gap-1 text-xs font-bold"><span>{label}</span><input className="h-10 rounded-lg border border-slate-200 bg-white px-2 dark:border-white/10 dark:bg-slate-900" type="number" step="0.1" value={value} onChange={e=>onChange(Number(e.target.value))}/></label>};
export default function GeometryEnhancementWorkbench(){const[a,setA]=useState(3),[b,setB]=useState(4),[c,setC]=useState(5),[angle,setAngle]=useState(60),[sides,setSides]=useState(6);const theta=angle*Math.PI/180,tri:geo.Triangle=[{x:0,y:0},{x:a,y:0},{x:0,y:b}],n=Math.max(3,Math.round(Math.abs(sides)));return <div className="space-y-4 p-2"><section className="rounded-xl border border-cyan-200 bg-gradient-to-r from-cyan-50 to-violet-50 p-4"><h1 className="text-xl font-black">Advanced Geometry Workbench</h1><p className="mt-1 text-sm text-slate-600">Twenty-five construction, theorem, transformation, circle, solid, topology, and measurement tools.</p></section><section aria-label="Shared geometry parameters" className="grid gap-3 rounded-xl border border-slate-200 bg-white/80 p-4 sm:grid-cols-2 xl:grid-cols-5"><Input label="Length a" value={a} onChange={setA}/><Input label="Length b" value={b} onChange={setB}/><Input label="Length c / radius" value={c} onChange={setC}/><Input label="Angle (degrees)" value={angle} onChange={setAngle}/><Input label="Polygon sides" value={sides} onChange={setSides}/></section><section aria-label="Twenty-five Geometry enhancements" className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
<Tool id="GEO-01" title="1. Compass-and-straightedge construction"><Out>{geo.constructionSteps("angle-bisector",tri)}</Out></Tool>
<Tool id="GEO-02" title="2. Constraint-preserving drag"><Out>{geo.constrainToCircle({x:a,y:b},{x:0,y:0},Math.abs(c))}</Out></Tool>
<Tool id="GEO-03" title="3. Dynamic locus"><Out>{{sample:geo.locusCircle({x:a,y:b},Math.abs(c),n).slice(0,4),points:n}}</Out></Tool>
<Tool id="GEO-04" title="4. Congruence proof"><Out>{geo.congruenceSSS([a,b,c],[c,a,b])}</Out></Tool>
<Tool id="GEO-05" title="5. Similarity mapping"><Out>{geo.similarityScale([a,b,c],[2*a,2*b,2*c])}</Out></Tool>
<Tool id="GEO-06" title="6. Triangle centres"><Out>{geo.triangleCentres(tri)}</Out></Tool>
<Tool id="GEO-07" title="7. Euler line"><Out>{geo.eulerLine(tri)}</Out></Tool>
<Tool id="GEO-08" title="8. Nine-point circle"><Out>{geo.ninePointCircle(tri)}</Out></Tool>
<Tool id="GEO-09" title="9. Transformation composition"><Out>{geo.transformPoint({x:a,y:b},{rotate:theta,scale:c/5,translate:{x:1,y:-1}})}</Out></Tool>
<Tool id="GEO-10" title="10. Coordinate proof"><Out>{geo.coordinateProof([{x:0,y:0},{x:a,y:b},{x:1,y:1},{x:1+a,y:1+b}])}</Out></Tool>
<Tool id="GEO-11" title="11. Polygon-angle dissection"><Out>{geo.polygonAngles(n)}</Out></Tool>
<Tool id="GEO-12" title="12. Regular-polygon construction"><Out>{{vertices:geo.regularPolygon(n,Math.abs(c)).slice(0,6),count:n}}</Out></Tool>
<Tool id="GEO-13" title="13. Tessellation validation"><Out>{geo.regularTessellation(n,Math.max(2,Math.round(Math.abs(a))))}</Out></Tool>
<Tool id="GEO-14" title="14. Circle theorem explorer"><Out>{geo.circleTheorems({centralAngle:angle,intersectingChord:[Math.abs(a),Math.abs(b),Math.max(.1,Math.abs(c))]})}</Out></Tool>
<Tool id="GEO-15" title="15. Power of a point"><Out>{geo.powerOfPoint(Math.abs(a)+Math.abs(c),Math.abs(c))}</Out></Tool>
<Tool id="GEO-16" title="16. Conic construction"><Out>{{ellipse:geo.conicPoint("ellipse",Math.abs(c),theta),parabola:geo.conicPoint("parabola",Math.abs(c),theta)}}</Out></Tool>
<Tool id="GEO-17" title="17. Diagram-linked proof step"><Out>{geo.proofStepHighlight(Math.round(a)%3,[["AB","AC"],["parallel DE"],["ratio AD/DB"]])}</Out></Tool>
<Tool id="GEO-18" title="18. Assumption counterexample"><Out>{geo.theoremCounterexample({parallel:angle===0,equalSides:a===b},true)}</Out></Tool>
<Tool id="GEO-19" title="19. Solid cross-section plane"><Out>{geo.cuboidSection([Math.abs(a),Math.abs(b),Math.abs(c)],"xy",0)}</Out></Tool>
<Tool id="GEO-20" title="20. Foldable cube net"><Out>{geo.validateCubeNet([[0,0],[1,0],[2,0],[3,0],[1,1],[1,-1]])}</Out></Tool>
<Tool id="GEO-21" title="21. Volume dissection"><Out>{geo.prismDissection(Math.abs(a*b),Math.abs(c))}</Out></Tool>
<Tool id="GEO-22" title="22. Euler polyhedron formula"><Out>{geo.eulerCharacteristic(8,12,6)}</Out></Tool>
<Tool id="GEO-23" title="23. Non-Euclidean triangle"><Out>{geo.curvedGeometryAngleSum(angle>=0?"spherical":"hyperbolic",Math.abs(angle)/1000,Math.abs(a*b)/10)}</Out></Tool>
<Tool id="GEO-24" title="24. Measurement uncertainty"><Out>{geo.measurementInterval(a,Math.abs(b)/100)}</Out></Tool>
<Tool id="GEO-25" title="25. Construction exchange"><Out>{geo.serializeConstruction([{id:"A",type:"point",dependencies:[],data:{x:0,y:0}},{id:"circle1",type:"circle",dependencies:["A"],data:{radius:c}}])}</Out></Tool>
</section></div>}
