import { describe, expect, it } from "vitest";
import { createObjectFromDefinition, evaluateDynamicWorkspace } from "./dynamicWorkspaceEngine";
import { exportIsmobj, importIsmobj, ismobjFilename, parseIsmobj } from "./ismobjExchange";
import type { WorkspaceSnapshot } from "./types";

describe("IndianServersMathObject exchange", () => {
  it("exports and imports .ismobj packages with algebra and protocol", () => {
    const a = createObjectFromDefinition("A=(0,0)");
    const b = createObjectFromDefinition("B=(3,4)", [a]);
    const s = createObjectFromDefinition("s=Segment[A,B]", [a, b]);
    const objects = evaluateDynamicWorkspace([a, b, s]).objects;
    const snapshot: WorkspaceSnapshot = {
      project: { id: "p", title: "Demo Project", updatedAt: 1, schemaVersion: 2 },
      objects,
      scenes: [],
      selectedObjectId: null,
      selectedObjectIds: [],
    };

    const json = exportIsmobj(snapshot);
    const pkg = parseIsmobj(json);
    const imported = importIsmobj(json);

    expect(pkg.schema).toBe("IndianServersMathObject");
    expect(pkg.manifest.integrity.objectCount).toBe(3);
    expect(pkg.algebra).toHaveLength(3);
    expect(pkg.protocol.steps).toHaveLength(3);
    expect(pkg.engine?.geometry2dObjectCount).toBe(3);
    expect(pkg.engine?.measurementObjects.some((object) => object.metadata?.source === "engine-measurement")).toBe(true);
    expect(pkg.manifest.compatibility.features).toContain("engine-measurements");
    expect(imported.objects).toHaveLength(3);
    expect(ismobjFilename("Demo Project")).toBe("demo-project.ismobj");
  });

  it("backfills engine metadata when importing older .ismobj packages", () => {
    const a = createObjectFromDefinition("A=(0,0)");
    const b = createObjectFromDefinition("B=(0,4)", [a]);
    const line = createObjectFromDefinition("s=Segment[A,B]", [a, b]);
    const objects = evaluateDynamicWorkspace([a, b, line]).objects;
    const snapshot: WorkspaceSnapshot = {
      project: { id: "old", title: "Old Project", updatedAt: 1, schemaVersion: 2 },
      objects,
      scenes: [],
      selectedObjectId: null,
      selectedObjectIds: [],
    };
    const parsed = JSON.parse(exportIsmobj(snapshot));
    delete parsed.engine;

    const pkg = parseIsmobj(JSON.stringify(parsed));

    expect(pkg.engine?.geometry2dObjectCount).toBe(3);
    expect(pkg.engine?.measurementObjects.length).toBeGreaterThan(0);
  });
});
