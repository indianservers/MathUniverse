import { Navigate, useSearchParams } from "react-router-dom";
import { shapesExplorerPathFromSolidMode } from "./geometryLabUx";

export default function GeometrySolidsRedirect() {
  const [params] = useSearchParams();
  return <Navigate to={shapesExplorerPathFromSolidMode(params.get("mode"))} replace />;
}
