import {LessonGraphWorkspace} from './LessonGraphWorkspace';

/** Unscaled position preview; keeps lesson-supplied display percentages and text. */
export function LessonPointPreview({label,point,axes,color}:{label:string;point:{left:number;top:number};axes:{left:number;top:number};color:string}) {
  return <LessonGraphWorkspace title="Point P" description={label}>
    <div className="lesson-point-preview" role="img" aria-label={label}>
      <span className="lesson-preview-x" style={{top:`${axes.top}%`}}/><span className="lesson-preview-y" style={{left:`${axes.left}%`}}/>
      <span className="lesson-preview-point" style={{left:`${point.left}%`,top:`${point.top}%`,background:color}}/>
      <span className="lesson-preview-label" style={{left:`${point.left}%`,top:`${point.top}%`,color}}>P</span>
    </div>
  </LessonGraphWorkspace>;
}
