export type ComparisonPoint = { x: number; y: number };
export const comparisonDefault = [{ x: 1, y: 2.1 }, { x: 2, y: 2.7 }, { x: 3, y: 3.6 }, { x: 4, y: 5 }, { x: 5, y: 7.4 }, { x: 6, y: 11.1 }, { x: 7, y: 15.3 }, { x: 8, y: 24.6 }, { x: 9, y: 36.9 }, { x: 10, y: 54.6 }];
function fitLinear(points: ComparisonPoint[]) {
  if (points.length < 2) return null;
  const n = points.length, xm = points.reduce((s,p) => s+p.x,0)/n, ym = points.reduce((s,p) => s+p.y,0)/n;
  const xx = points.reduce((s,p) => s+(p.x-xm)**2,0), xy = points.reduce((s,p) => s+(p.x-xm)*(p.y-ym),0);
  return xx > 1e-12 ? [ym-xy/xx*xm,xy/xx] as const : null;
}
function fitQuadratic(points: ComparisonPoint[]) {
  if (points.length < 3) return null;
  const a = Array.from({length:3},(_,r) => [...Array.from({length:3},(_,c) => points.reduce((s,p) => s+p.x**(r+c),0)),points.reduce((s,p) => s+p.x**r*p.y,0)]);
  for(let c=0;c<3;c++) {
    let pivot=c;for(let r=c+1;r<3;r++)if(Math.abs(a[r][c])>Math.abs(a[pivot][c]))pivot=r;
    if(Math.abs(a[pivot][c])<1e-12)return null;
    [a[c],a[pivot]]=[a[pivot],a[c]];const divisor=a[c][c];a[c]=a[c].map(v=>v/divisor);
    for(let r=0;r<3;r++)if(r!==c){const factor=a[r][c];a[r]=a[r].map((v,j)=>v-factor*a[c][j]);}
  }
  return a.map(row=>row[3]);
}
function model(points: ComparisonPoint[], predict: ((x:number)=>number)|null, params:number) {
  const predictions=points.map(p=>predict?.(p.x)??NaN), valid=Boolean(predict)&&predictions.every(Number.isFinite);
  const residuals=points.map((p,i)=>p.y-predictions[i]),sse=valid?residuals.reduce((s,e)=>s+e**2,0):NaN;
  const mean=points.reduce((s,p)=>s+p.y,0)/points.length,sst=points.reduce((s,p)=>s+(p.y-mean)**2,0);
  return {valid,predictions,predict:predict??(()=>NaN),sse,rmse:Math.sqrt(sse/points.length),r2:sst>1e-12?1-sse/sst:NaN,params,score:sse+2*params};
}
export function compareModels(points:ComparisonPoint[]=comparisonDefault) {
  const linear=fitLinear(points),quad=fitQuadratic(points);
  // An exponential fits log(y) against x; using log(x) would fit a power law.
  const exponential=points.every(p=>p.y>0)?fitLinear(points.map(p=>({x:p.x,y:Math.log(p.y)}))):null;
  return {
    linear:model(points,linear?x=>linear[0]+linear[1]*x:null,2),
    quadratic:model(points,quad?x=>quad[0]+quad[1]*x+quad[2]*x*x:null,3),
    exponential:model(points,exponential?x=>Math.exp(exponential[0]+exponential[1]*x):null,2),
  };
}
