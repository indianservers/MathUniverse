import MathWorkspace, { type DataWorkspacePage } from "./MathWorkspace";

export default function WorkspaceData({ page = "overview" }: { page?: DataWorkspacePage }) {
  return <MathWorkspace initialView="data" singleView dataPage={page} />;
}
