import MathWorkspace, { type DataWorkspacePage } from "./MathWorkspace";

export default function WorkspaceData({ page = "cas" }: { page?: DataWorkspacePage }) {
  return <MathWorkspace initialView="data" singleView dataPage={page} />;
}
