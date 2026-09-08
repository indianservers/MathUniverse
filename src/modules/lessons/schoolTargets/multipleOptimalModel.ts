export const OPTIMAL_VERTICES=[{label:"O",x:0,y:0},{label:"A",x:4,y:0},{label:"B",x:0,y:4}];
export const EDGE_SAMPLES=[{label:"A",x:4,y:0},{label:"P",x:2.5,y:1.5},{label:"Q",x:1,y:3},{label:"B",x:0,y:4}];
export function multipleOptimalModel(a:number,b:number,mode:"max"|"min"="max") {
  const vertices=OPTIMAL_VERTICES.map(p=>({...p,value:a*p.x+b*p.y}));
  const value=(mode==="max"?Math.max:Math.min)(...vertices.map(p=>p.value));
  const best=vertices.filter(p=>Math.abs(p.value-value)<1e-9);
  const wholeAB=best.some(p=>p.label==="A")&&best.some(p=>p.label==="B");
  return {vertices,value,best,wholeAB,kind:best.length===3?"region":best.length===2?"edge":"point",slope:b===0?null:-a/b,samples:EDGE_SAMPLES.map(p=>({...p,value:a*p.x+b*p.y}))};
}
