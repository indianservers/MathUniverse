import { forwardRef, type SVGProps } from "react";

/** The SVG surface shared by the constructor and its lesson presentations. */
const WorkspaceSvg = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(function WorkspaceSvg(props, ref) {
  return <svg {...props} ref={ref} />;
});
export default WorkspaceSvg;
