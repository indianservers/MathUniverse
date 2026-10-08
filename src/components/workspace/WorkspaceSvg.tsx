import {CinematicSvgPreview} from '../../math-robo/animation/CinematicSvgPreview';
import { forwardRef, type SVGProps } from "react";

/** The SVG surface shared by the constructor and its lesson presentations. */
const WorkspaceSvg = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(function WorkspaceSvg(props, ref) {
  return <svg {...props} ref={ref}>{props.children}<CinematicSvgPreview mode="geometry2d" toScreen={(x,y)=>({x:320+x*40,y:210-y*40})} bounds={{xMin:-100,xMax:100,yMin:-100,yMax:100}}/></svg>;
});
export default WorkspaceSvg;
