export type LessonGraphView = { xMin: number; xMax: number; yMin: number; yMax: number };
export type LessonGraphPoint = { x: number; y: number };

export function validLessonGraphView(view: LessonGraphView) {
  return Object.values(view).every(Number.isFinite) && view.xMax > view.xMin && view.yMax > view.yMin;
}

/** Affine coordinates shared by rendering, pointer handling and annotations. */
export function lessonGraphProjection(view: LessonGraphView, width: number, height: number) {
  if (!validLessonGraphView(view) || !Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) throw new Error("Graph bounds and dimensions must be finite and increasing.");
  return {
    toScreen: ({x,y}: LessonGraphPoint) => ({x:(x-view.xMin)/(view.xMax-view.xMin)*width,y:(view.yMax-y)/(view.yMax-view.yMin)*height}),
    toWorld: ({x,y}: LessonGraphPoint) => ({x:view.xMin+x/width*(view.xMax-view.xMin),y:view.yMax-y/height*(view.yMax-view.yMin)}),
  };
}

export function lessonGraphTicks(min: number, max: number, target = 6) {
  if (!Number.isFinite(min) || !Number.isFinite(max) || max <= min) return [];
  const raw = (max-min)/Math.max(2,target);
  const power=10**Math.floor(Math.log10(raw));
  const normalized=raw/power;
  const factor=normalized<=1?1:normalized<=2?2:normalized<=5?5:10;
  let step=factor*power;
  let first=Math.ceil(min/step-1e-10);
  let last=Math.floor(max/step+1e-10);
  // A lone zero gives no readable scale on a narrow plot. Use the next finer nice step.
  if(last-first<1){
    step=(factor===10?5:factor===5?2:factor===2?1:.5)*power;
    first=Math.ceil(min/step-1e-10);
    last=Math.floor(max/step+1e-10);
  }
  return Array.from({length:Math.min(100,Math.max(0,last-first+1))},(_,i)=>Number(((first+i)*step).toPrecision(12)));
}

/** Null / invalid samples split paths; no interpolation across discontinuities. */
export function lessonGraphSegments(points: readonly (LessonGraphPoint | null)[]) {
  const segments: LessonGraphPoint[][]=[];
  let current: LessonGraphPoint[]=[];
  for(const point of points) {
    if(point && Number.isFinite(point.x) && Number.isFinite(point.y)) current.push(point);
    else if(current.length) { segments.push(current); current=[]; }
  }
  if(current.length) segments.push(current);
  return segments;
}

export function panLessonGraph(view: LessonGraphView, dx: number, dy: number): LessonGraphView {
  return {xMin:view.xMin+dx,xMax:view.xMax+dx,yMin:view.yMin+dy,yMax:view.yMax+dy};
}
/** Wrap point captions without dropping template tokens on narrow plots. */
export function lessonGraphLabelLines(label:string,maxCharacters:number):string[] {
  const limit=Math.max(1,Math.floor(maxCharacters)),lines:string[]=[];
  for(const paragraph of label.split('\n')) {
    let remaining=paragraph;
    while(remaining.length>limit) {
      const space=remaining.lastIndexOf(' ',limit);
      const end=space>0?space:limit;
      lines.push(remaining.slice(0,end));remaining=remaining.slice(end).trimStart();
    }
    lines.push(remaining);
  }
  return lines;
}
/** Reject pole sign changes: finite midpoint residuals must converge toward zero. */
export function lessonGraphZeroCrossingConverges(evaluate:(x:number)=>number,a:LessonGraphPoint,b:LessonGraphPoint):boolean {
  if(a.y===0||b.y===0)return true;
  if(a.y*b.y>=0)return false;
  let left=a,right=b,firstResidual:number|undefined;
  const endpointResidual=Math.min(Math.abs(a.y),Math.abs(b.y));
  for(let i=0;i<40;i++) {
    const x=(left.x+right.x)/2,y=evaluate(x);
    if(!Number.isFinite(y))return false;
    const residual=Math.abs(y);
    if(residual===0||residual<endpointResidual*1e-12)return true;
    if(firstResidual===undefined)firstResidual=residual;
    else if(residual<firstResidual*1e-6)return true;
    if(left.y*y<0)right={x,y};else left={x,y};
  }
  return false;
}
/** Find the nearest free caption row without cycling between occupied rows. */
export function lessonGraphCaptionY(preferred:number,min:number,max:number,height:number,x:number,width:number,placed:readonly {x:number;y:number;width:number;height:number}[]):number {
  const free=(y:number)=>y>=min&&y<=max&&!placed.some(p=>y<p.y+p.height+4&&y+height+4>p.y&&x<p.x+p.width+4&&x+width+4>p.x);
  const initial=Math.max(min,Math.min(max,preferred));
  if(free(initial))return initial;
  for(let distance=4;distance<=max-min+height;distance+=4){
    if(free(initial-distance))return initial-distance;
    if(free(initial+distance))return initial+distance;
  }
  return initial;
}
