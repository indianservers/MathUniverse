export type Point = { x: number; y: number };
export type Triangle = [Point, Point, Point];

export function constructionSteps(kind: "perpendicular-bisector" | "angle-bisector" | "parallel", points: Point[]) {
  const required = kind === "parallel" ? 2 : 2;
  return { kind, valid: points.length >= required, steps: kind === "perpendicular-bisector" ? ["Draw equal-radius arcs from both endpoints", "Join the arc intersections"] : kind === "angle-bisector" ? ["Draw an arc across both rays", "Intersect equal arcs from the crossing points", "Join vertex to intersection"] : ["Copy the source angle at the target point", "Extend the corresponding ray"] };
}
export function constrainToCircle(point: Point, center: Point, radius: number): Point { const dx = point.x - center.x, dy = point.y - center.y, length = Math.hypot(dx, dy) || 1; return { x: center.x + dx * radius / length, y: center.y + dy * radius / length }; }
export function locusCircle(center: Point, radius: number, samples = 36) { return Array.from({ length: samples }, (_, i) => ({ x: center.x + radius * Math.cos(2 * Math.PI * i / samples), y: center.y + radius * Math.sin(2 * Math.PI * i / samples) })); }
export function congruenceSSS(first: [number, number, number], second: [number, number, number], tolerance = 1e-8) { return { congruent: [...first].sort((a,b)=>a-b).every((side,i)=>Math.abs(side-[...second].sort((a,b)=>a-b)[i])<=tolerance), criterion: "SSS" }; }
export function similarityScale(first: [number, number, number], second: [number, number, number]) { const sortedA=[...first].sort((a,b)=>a-b),sortedB=[...second].sort((a,b)=>a-b),ratios=sortedA.map((side,i)=>sortedB[i]/side);return{similar:ratios.every((r)=>Math.abs(r-ratios[0])<1e-8),scale:ratios[0],ratios}; }

export function triangleCentres([a,b,c]: Triangle) {
  const centroid={x:(a.x+b.x+c.x)/3,y:(a.y+b.y+c.y)/3};
  const d=2*(a.x*(b.y-c.y)+b.x*(c.y-a.y)+c.x*(a.y-b.y));
  const circumcenter=Math.abs(d)<1e-12?undefined:{x:((a.x*a.x+a.y*a.y)*(b.y-c.y)+(b.x*b.x+b.y*b.y)*(c.y-a.y)+(c.x*c.x+c.y*c.y)*(a.y-b.y))/d,y:((a.x*a.x+a.y*a.y)*(c.x-b.x)+(b.x*b.x+b.y*b.y)*(a.x-c.x)+(c.x*c.x+c.y*c.y)*(b.x-a.x))/d};
  const lengths=[distance(b,c),distance(a,c),distance(a,b)], perimeter=lengths.reduce((s,v)=>s+v,0), incenter={x:(lengths[0]*a.x+lengths[1]*b.x+lengths[2]*c.x)/perimeter,y:(lengths[0]*a.y+lengths[1]*b.y+lengths[2]*c.y)/perimeter};
  const orthocenter=circumcenter?{x:a.x+b.x+c.x-2*circumcenter.x,y:a.y+b.y+c.y-2*circumcenter.y}:undefined;
  return {centroid,circumcenter,incenter,orthocenter};
}
export function eulerLine(triangle: Triangle) { const centers=triangleCentres(triangle);if(!centers.circumcenter||!centers.orthocenter)return null;return{through:[centers.circumcenter,centers.centroid,centers.orthocenter],ratioOGtoGH:distance(centers.circumcenter,centers.centroid)/distance(centers.centroid,centers.orthocenter)}; }
export function ninePointCircle(triangle: Triangle) { const centers=triangleCentres(triangle);if(!centers.circumcenter||!centers.orthocenter)return null;const center={x:(centers.circumcenter.x+centers.orthocenter.x)/2,y:(centers.circumcenter.y+centers.orthocenter.y)/2};return{center,radius:distance(center,{x:(triangle[0].x+triangle[1].x)/2,y:(triangle[0].y+triangle[1].y)/2})}; }
export function transformPoint(point: Point, input:{translate?:Point;rotate?:number;scale?:number;reflectX?:boolean}) { const reflected={x:point.x,y:input.reflectX?-point.y:point.y},s=input.scale??1,t=input.rotate??0,tr=input.translate??{x:0,y:0};return{x:s*(reflected.x*Math.cos(t)-reflected.y*Math.sin(t))+tr.x,y:s*(reflected.x*Math.sin(t)+reflected.y*Math.cos(t))+tr.y}; }
export function coordinateProof(points: [Point,Point,Point,Point]) { const [a,b,c,d]=points,slope=(p:Point,q:Point)=>Math.abs(q.x-p.x)<1e-12?Infinity:(q.y-p.y)/(q.x-p.x);return{slopes:[slope(a,b),slope(c,d)],parallel:near(slope(a,b),slope(c,d)),lengths:[distance(a,b),distance(c,d)]}; }
export function polygonAngles(sides:number){return{sides,interiorSum:(sides-2)*180,regularInterior:(sides-2)*180/sides,exteriorSum:360};}
export function regularPolygon(sides:number,radius:number){return Array.from({length:Math.max(3,Math.round(sides))},(_,i)=>({x:radius*Math.cos(2*Math.PI*i/Math.max(3,Math.round(sides))),y:radius*Math.sin(2*Math.PI*i/Math.max(3,Math.round(sides)))}));}
export function regularTessellation(polygonSides:number,meeting:number){const angle=(polygonSides-2)*180/polygonSides,total=angle*meeting;return{angle,total,tessellates:Math.abs(total-360)<1e-8};}
export function circleTheorems(input:{centralAngle:number;intersectingChord?:[number,number,number]}){const fourth=input.intersectingChord?input.intersectingChord[0]*input.intersectingChord[1]/input.intersectingChord[2]:undefined;return{inscribedAngle:input.centralAngle/2,missingChordSegment:fourth};}
export function powerOfPoint(distanceToCenter:number,radius:number){return{power:distanceToCenter**2-radius**2,tangentLength:distanceToCenter>=radius?Math.sqrt(distanceToCenter**2-radius**2):undefined,location:near(distanceToCenter,radius)?"on":distanceToCenter<radius?"inside":"outside"};}
export function conicPoint(kind:"ellipse"|"parabola"|"hyperbola",parameter:number,t:number):Point { if(kind==="ellipse")return{x:parameter*Math.cos(t),y:parameter*.6*Math.sin(t)};if(kind==="parabola")return{x:parameter*t*t,y:2*parameter*t};return{x:parameter/Math.cos(t),y:parameter*Math.tan(t)}; }
export function proofStepHighlight(step:number,objects:string[][]){const index=Math.max(0,Math.min(objects.length-1,Math.round(step)));return{step:index+1,highlighted:objects[index]??[],complete:index===objects.length-1};}
export function theoremCounterexample(assumptions:Record<string,boolean>,conclusion:boolean){const missing=Object.entries(assumptions).filter(([,holds])=>!holds).map(([name])=>name);return{validImplication:missing.length===0?conclusion:false,missingAssumptions:missing,counterexamplePossible:missing.length>0};}
export function cuboidSection(dimensions:[number,number,number],plane:"xy"|"xz"|"yz",position:number){const [x,y,z]=dimensions,inside=Math.abs(position)<=({xy:z,xz:y,yz:x}[plane]/2);const area=plane==="xy"?x*y:plane==="xz"?x*z:y*z;return{plane,position,inside,area:inside?area:0};}
export function validateCubeNet(faceCells:Array<[number,number]>) { const unique=new Set(faceCells.map(([x,y])=>`${x},${y}`));let edges=0;for(const[x,y]of faceCells)for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]])if(unique.has(`${x+dx},${y+dy}`))edges++;return{sixFaces:unique.size===6,connectedEdges:edges/2,plausibleNet:unique.size===6&&edges/2===5};}
export function prismDissection(baseArea:number,height:number,pieces=3){return{prismVolume:baseArea*height,pyramidVolume:baseArea*height/3,pieces,equalPyramids:pieces===3};}
export function eulerCharacteristic(vertices:number,edges:number,faces:number){const value=vertices-edges+faces;return{value,convexPolyhedron:value===2};}
export function curvedGeometryAngleSum(kind:"spherical"|"euclidean"|"hyperbolic",curvature:number,area:number){const excess=curvature*area;return{radians:Math.PI+(kind==="euclidean"?0:kind==="spherical"?Math.abs(excess):-Math.abs(excess)),comparison:kind==="spherical"?"greater than 180°":kind==="hyperbolic"?"less than 180°":"equal to 180°"};}
export function measurementInterval(value:number,absoluteError:number){return{minimum:value-Math.abs(absoluteError),maximum:value+Math.abs(absoluteError),relativeError:value===0?Infinity:Math.abs(absoluteError/value),significantDigits:Math.max(0,Math.floor(-Math.log10(Math.abs(absoluteError))))};}
export function serializeConstruction(objects:Array<{id:string;type:string;dependencies:string[];data:Record<string,number>}>){const json=JSON.stringify({version:1,objects});return{json,objectCount:objects.length,dependencyCount:objects.reduce((sum,o)=>sum+o.dependencies.length,0)};}

function distance(a:Point,b:Point){return Math.hypot(a.x-b.x,a.y-b.y);}function near(a:number,b:number){return a===b||Math.abs(a-b)<1e-8;}
