import { greedyColoring } from "../../../studios/discrete/discreteEnhancementEngine";
export type MapRegion={id:number;vertices:string[];label:[number,number]};
export type RegionMap={points:Record<string,[number,number]>;regions:MapRegion[]};
export const fourColorMap:RegionMap={points:{A:[20,20],B:[105,30],C:[200,36],D:[280,20],E:[20,125],F:[105,115],G:[190,125],H:[280,125],I:[16,225],J:[105,250],K:[193,240],L:[280,240],M:[40,335],N:[100,318],O:[148,330],P:[190,322],Q:[264,350],R:[95,425],S:[148,418],T:[225,430]},regions:[
  {id:1,vertices:["A","B","F","E"],label:[62,75]},
  {id:2,vertices:["B","C","G","F"],label:[151,81]},
  {id:3,vertices:["C","D","H","G"],label:[238,85]},
  {id:4,vertices:["E","F","J","I"],label:[58,183]},
  {id:5,vertices:["F","G","K","J"],label:[149,186]},
  {id:6,vertices:["G","H","L","K"],label:[236,191]},
  {id:7,vertices:["I","J","N","M"],label:[58,283]},
  {id:8,vertices:["J","K","P","O","N"],label:[147,286]},
  {id:9,vertices:["K","L","Q","P"],label:[233,287]},
  {id:10,vertices:["M","N","O","S","R"],label:[103,374]},
  {id:11,vertices:["O","P","Q","T","S"],label:[199,379]},
]};
export const practiceColorMap:RegionMap={points:{A:[60,20],B:[155,20],C:[195,70],D:[195,150],E:[155,195],F:[60,195],G:[20,150],H:[20,70],I:[78,65],J:[135,65],K:[135,147],L:[78,147]},regions:[
  {id:1,vertices:["A","B","C","J","I","H"],label:[107,43]},
  {id:2,vertices:["H","I","L","G"],label:[47,108]},
  {id:3,vertices:["I","J","K","L"],label:[106,108]},
  {id:4,vertices:["J","C","D","K"],label:[169,108]},
  {id:5,vertices:["G","L","K","D","E","F"],label:[107,170]},
]};
const edgeKey=(a:string,b:string)=>[a,b].sort().join(":");
export function mapEdges(map:RegionMap):[number,number][] {
  const owners=new Map<string,number[]>();
  for(const region of map.regions)region.vertices.forEach((v,i)=>{const key=edgeKey(v,region.vertices[(i+1)%region.vertices.length]);owners.set(key,[...(owners.get(key)??[]),region.id]);});
  return [...owners.values()].filter(ids=>ids.length===2).map(ids=>ids as [number,number]);
}
export const initialMapColors=[0,1,2,3,0,1,2,1,3,0,2];
export const palette=[{name:"Cyan",hex:"#72d1e9"},{name:"Yellow",hex:"#ffdf68"},{name:"Purple",hex:"#be92e4"},{name:"Orange",hex:"#ffac64"}];
export function coloringStatus(map:RegionMap,colors:number[],limit=4) {
  const conflicts=mapEdges(map).filter(([a,b])=>colors[a-1]>=0&&colors[a-1]===colors[b-1]);
  const incomplete=map.regions.filter(r=>!Number.isInteger(colors[r.id-1])||colors[r.id-1]<0||colors[r.id-1]>=limit).map(r=>r.id);
  return {conflicts,incomplete,used:new Set(colors.filter(c=>c>=0&&c<limit)).size,valid:conflicts.length===0&&incomplete.length===0};
}
export function suggestedColors(map:RegionMap) {
  const adjacency:Record<string,string[]>={};map.regions.forEach(r=>{adjacency[r.id]=[];});
  mapEdges(map).forEach(([a,b])=>{adjacency[a].push(String(b));adjacency[b].push(String(a));});
  const {colors}=greedyColoring(adjacency);
  return map.regions.map(r=>colors[r.id]-1);
}
// Canonical shared polylines keep jagged borders identical in neighboring regions.
export function regionPath(map:RegionMap,region:MapRegion,jagged=true) {
  const points:[number,number][]=[];
  region.vertices.forEach((name,i)=>{
    const next=region.vertices[(i+1)%region.vertices.length],names=[name,next].sort(),a=map.points[names[0]],b=map.points[names[1]],dx=b[0]-a[0],dy=b[1]-a[1],length=Math.hypot(dx,dy),chain:[number,number][]=[];
    for(let j=0;j<=8;j++){const t=j/8,offset=jagged&&j>0&&j<8?Math.sin(j*2.7+names[0].charCodeAt(0)) * 2.2:0;chain.push([a[0]+dx*t-dy/length*offset,a[1]+dy*t+dx/length*offset]);}
    points.push(...(name===names[0]?chain:chain.reverse()).slice(0,-1));
  });
  return points.map(([x,y],i)=>`${i?"L":"M"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ")+"Z";
}
