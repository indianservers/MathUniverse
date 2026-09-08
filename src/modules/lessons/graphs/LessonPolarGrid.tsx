import {lessonGraphTicks, type LessonGraphView} from './lessonGraphGeometry';

export function LessonPolarGrid({view,px,py,xScale,yScale,clipId,showLabels}:{view:LessonGraphView;px:(x:number)=>number;py:(y:number)=>number;xScale:number;yScale:number;clipId:string;showLabels:boolean}){
 const maximum=Math.max(...[view.xMin,view.xMax].flatMap(x=>[view.yMin,view.yMax].map(y=>Math.hypot(x,y))));
 const radii=lessonGraphTicks(0,maximum,4).filter(r=>r>0);
 const labelRadius=.85*Math.min(view.xMax,-view.xMin,view.yMax,-view.yMin);
 return <g className="lesson-cartesian-grid lesson-polar-grid" clipPath={`url(#${clipId})`}>
  {radii.map(r=><ellipse key={r} data-radius={r} cx={px(0)} cy={py(0)} rx={r*xScale} ry={r*yScale}/>)}
  {Array.from({length:12},(_,i)=>{const angle=i*Math.PI/6;return <line key={i} data-angle={angle} x1={px(0)} y1={py(0)} x2={px(maximum*Math.cos(angle))} y2={py(maximum*Math.sin(angle))}/>;})}
  {showLabels&&radii.filter(r=>r<=Math.min(view.xMax,view.yMax)).map(r=><text key={`r${r}`} x={px(r/Math.SQRT2)} y={py(r/Math.SQRT2)+12}>{`r=${r}`}</text>)}
  {showLabels&&labelRadius>0&&[0,90,180,270].map(degrees=>{const angle=degrees*Math.PI/180,c=Math.cos(angle);return <text key={degrees} x={px(labelRadius*c)} y={py(labelRadius*Math.sin(angle))+4} textAnchor={c>.1?'end':c<-.1?'start':'middle'}>{degrees}°</text>;})}
 </g>;
}
