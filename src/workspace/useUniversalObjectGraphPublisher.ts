import { useEffect } from "react";
import type { MathObject } from "./types";
import type { UniversalObjectScope } from "./universalObjectGraph";
import { useWorkspaceStore } from "./workspaceStore";

export function useUniversalObjectGraphPublisher(scope: UniversalObjectScope, objects: MathObject[], label?: string, enabled = true) {
  const replaceObjectScope = useWorkspaceStore((state) => state.replaceObjectScope);

  useEffect(() => {
    if (!enabled) return;
    replaceObjectScope(scope, objects, label);
  }, [enabled, label, objects, replaceObjectScope, scope]);
}
