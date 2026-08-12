import { describe, expect, it } from "vitest";
import { nextDirectionalFocus, type FocusRect } from "./directionalFocus";

describe("directional focus", () => {
  const items: FocusRect[] = [
    { id: "center", left: 100, top: 100, width: 50, height: 50 },
    { id: "left", left: 10, top: 105, width: 50, height: 50 },
    { id: "right", left: 200, top: 110, width: 50, height: 50 },
    { id: "down", left: 105, top: 210, width: 50, height: 50 },
  ];
  it("chooses the closest spatial control in remote-navigation direction", () => {
    expect(nextDirectionalFocus(items[0], items, "ArrowLeft")?.id).toBe("left");
    expect(nextDirectionalFocus(items[0], items, "ArrowRight")?.id).toBe("right");
    expect(nextDirectionalFocus(items[0], items, "ArrowDown")?.id).toBe("down");
    expect(nextDirectionalFocus(items[0], items, "ArrowUp")).toBeNull();
  });
});
