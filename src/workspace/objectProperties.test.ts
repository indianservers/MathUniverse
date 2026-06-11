import { describe, expect, it } from "vitest";
import { createMathObject } from "./coreObjects";
import { applyObjectProperties, evaluateObjectProperties } from "./objectProperties";

describe("object properties", () => {
  it("evaluates captions, label modes, conditional visibility, layers, and dynamic color", () => {
    const object = createMathObject({
      id: "A",
      kind: "point",
      label: "A",
      value: "5",
      properties: {
        caption: "Control point",
        labelMode: "name-value",
        layer: 3,
        conditionalVisibility: "a > 0",
        dynamicColor: { red: "255", green: "a*10", blue: "0" },
      },
    });

    const evaluated = evaluateObjectProperties(object, { variables: { a: 5 } });

    expect(evaluated.visible).toBe(true);
    expect(evaluated.label).toBe("A = 5");
    expect(evaluated.caption).toBe("Control point");
    expect(evaluated.layer).toBe(3);
    expect(evaluated.style.color).toBe("#ff3200");
  });

  it("sorts by layer and hides objects with false conditions", () => {
    const low = createMathObject({ id: "low", kind: "point", label: "low", properties: { layer: 0 } });
    const high = createMathObject({ id: "high", kind: "point", label: "high", properties: { layer: 5, conditionalVisibility: "a < 0" } });
    const [first, second] = applyObjectProperties([high, low], { variables: { a: 1 } });

    expect(first.id).toBe("low");
    expect(second.status).toBe("hidden");
  });
});
