import MathWorkspace from "./MathWorkspace";
import { useEffect } from "react";

export default function Workspace3D() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "3d- Geometry | Math Universe";
    return () => { document.title = previousTitle; };
  }, []);
  return <MathWorkspace initialView="3d" singleView />;
}
