export type UnsupportedWorkspaceAction = {
  actionName: string;
  ok: false;
  message: string;
  reason: string;
  suggestions: string[];
  preservesState: true;
};

export function createUnsupportedWorkspaceAction(
  actionName: string,
  reason: string,
  suggestions: string[] = ["Use Select, Point, Segment, Circle, Graph, or supported import/export tools."],
): UnsupportedWorkspaceAction {
  return {
    actionName,
    ok: false,
    message: `${actionName} is not supported in this workspace yet.`,
    reason,
    suggestions,
    preservesState: true,
  };
}
