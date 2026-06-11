import { describe, expect, it } from "vitest";
import { createObjectFromDefinition, evaluateDynamicWorkspace } from "./dynamicWorkspaceEngine";
import { buildConstructionProtocol, invalidProtocolReorders, reorderProtocolStep, replayProtocol } from "./constructionProtocol";

describe("construction protocol", () => {
  it("builds dependency-safe protocol steps and replay state", () => {
    const a = createObjectFromDefinition("A=(0,0)");
    const b = createObjectFromDefinition("B=(1,0)", [a]);
    const line = createObjectFromDefinition("l=Line[A,B]", [a, b]);
    const evaluated = evaluateDynamicWorkspace([line, b, a]);
    const protocol = buildConstructionProtocol(evaluated.objects);
    const lineStep = protocol.steps.find((step) => step.objectLabel === "l");

    expect(protocol.steps[0].objectLabel).toBe("A");
    expect(lineStep?.dependencies.length).toBe(2);
    expect(replayProtocol(protocol, 1).visibleIds.has(line.id)).toBe(false);
  });

  it("rejects invalid dependency reorders", () => {
    const a = createObjectFromDefinition("A=(0,0)");
    const b = createObjectFromDefinition("B=(1,0)", [a]);
    const line = createObjectFromDefinition("l=Line[A,B]", [a, b]);
    const protocol = buildConstructionProtocol(evaluateDynamicWorkspace([a, b, line]).objects);
    const attempted = reorderProtocolStep(protocol, protocol.steps.find((step) => step.objectLabel === "l")!.id, 0);

    expect(attempted.steps.map((step) => step.objectLabel)).toEqual(protocol.steps.map((step) => step.objectLabel));
    expect(invalidProtocolReorders(protocol.steps)).toHaveLength(0);
  });
});
