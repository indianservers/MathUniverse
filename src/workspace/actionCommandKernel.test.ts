import { describe, expect, it } from "vitest";
import { createAnimationAction, parseStyleAction, parseTransformCommand } from "./actionCommandKernel";

describe("action command kernel", () => {
  it("computes browser-only point transformations", () => {
    const rotate = parseTransformCommand("Rotate", ["(2,0)", "90", "(0,0)"]);
    const translate = parseTransformCommand("Translate", ["(2,1)", "(3,-1)"]);
    const dilate = parseTransformCommand("Dilate", ["(2,1)", "2", "(0,0)"]);
    const mirror = parseTransformCommand("Mirror", ["(2,1)", "(0,0)", "(1,0)"]);

    expect(rotate.result.x).toBeCloseTo(0);
    expect(rotate.result.y).toBeCloseTo(2);
    expect(translate.result).toEqual({ x: 5, y: 0 });
    expect(dilate.result).toEqual({ x: 4, y: 2 });
    expect(mirror.result).toEqual({ x: 2, y: -1 });
  });

  it("normalizes style and label actions for unified menus", () => {
    expect(parseStyleAction("SetColor", ["A", "#06b6d4"]).patch).toEqual({ color: "#06b6d4", fill: undefined });
    expect(parseStyleAction("ShowLabel", ["A", "hidden"]).patch).toEqual({ labelMode: "hidden" });
    expect(parseStyleAction("SetOpacity", ["poly1", "2"]).patch).toEqual({ opacity: 1 });
    expect(parseStyleAction("SetTrace", ["c", "off"]).patch).toEqual({ trace: false });
  });

  it("creates start and stop animation actions", () => {
    expect(createAnimationAction("StartAnimation", ["scene", "1.5"])).toMatchObject({ target: "scene", playing: true, speed: 1.5 });
    expect(createAnimationAction("StopAnimation", ["scene"])).toMatchObject({ target: "scene", playing: false, speed: 1 });
  });
});
