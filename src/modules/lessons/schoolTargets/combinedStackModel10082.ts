export type CombinedKind='cylinder'|'cone'|'hemisphere';
export const combinedLabels:Record<CombinedKind,string>={cylinder:'Cylinder',cone:'Cone',hemisphere:'Hemisphere'};
export function validCombinedStack(parts:CombinedKind[]){return parts.length<=6&&parts.every((p,i)=>p==='cylinder'||i===0||i===parts.length-1);}
export function addCombinedPart(parts:CombinedKind[],kind:CombinedKind):CombinedKind[]|null{
 if(parts.length>=6)return null;if(!parts.length)return[kind];
 if(kind==='cylinder'){const next=[...parts];next.splice(parts.at(-1)==='cylinder'?parts.length:parts.length-1,0,kind);return next;}
 if(parts.at(-1)==='cylinder')return[...parts,kind];
 if(parts[0]==='cylinder')return[kind,...parts];
 if(parts.length===1)return[kind,...parts];
 return null;
}
export function combinedSolidsModel(parts:CombinedKind[],r:number,h:number){
 if(!Number.isFinite(r)||!Number.isFinite(h)||r<=0||h<=0||!validCombinedStack(parts))throw new Error('Positive dimensions and circular-face joins required');
 const components=parts.map((kind,i)=>{const volumePi=kind==='cylinder'?r*r*h:kind==='cone'?r*r*h/3:2*r*r*r/3,curvedPi=kind==='cylinder'?2*r*h:kind==='cone'?r*Math.hypot(r,h):2*r*r,flatFaces=kind==='cylinder'?2:1,joined=(i>0?1:0)+(i<parts.length-1?1:0),exposed=flatFaces-joined;return{kind,volumePi,curvedPi,flatFaces,joined,exposed,down:i===0&&parts.length>1&&kind!=='cylinder'};});
 const vPi=components.reduce((s,c)=>s+c.volumePi,0),fullPi=components.reduce((s,c)=>s+c.curvedPi+c.flatFaces*r*r,0),joins=Math.max(0,parts.length-1),excludedPi=2*joins*r*r,sPi=fullPi-excludedPi;
 return {components,vPi,sPi,fullPi,joins,excludedPi,volume:vPi*Math.PI,surface:sPi*Math.PI,curvedPi:components.reduce((s,c)=>s+c.curvedPi,0),exposedFaces:components.reduce((s,c)=>s+c.exposed,0),slant:Math.hypot(r,h)};
}
export function combinedLayout(parts:CombinedKind[],r:number,h:number,rotation:number,exploded:boolean){
 const pitch=(14+rotation)*Math.PI/180,vertical=Math.cos(pitch),ellipse=Math.max(.025,Math.abs(Math.sin(pitch))),gap=exploded?40:0,totalUnits=parts.reduce((s,p)=>s+(p==='hemisphere'?r:h*vertical),0),gapTotal=Math.max(0,parts.length-1)*gap,scale=Math.min(88/r,(340-gapTotal)/(Math.max(.1,totalUnits)+.7*r)),rx=r*scale,ry=rx*ellipse,total=totalUnits*scale+gapTotal,bottom=50+(340-total)/2+total;
 let y=bottom;const shapes=parts.map((kind,i)=>{const height=(kind==='hemisphere'?r:h*vertical)*scale,top=y-height,bottom=y,down=i===0&&parts.length>1&&kind!=='cylinder';y=top-gap;return{kind,top,bottom,height,down,index:i};});
 return{shapes,scale,rx,ry,bottom,total,vertical,ellipse};
}
