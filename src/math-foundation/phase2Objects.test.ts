import { describe, expect, it } from "vitest";
import { MathDependencyGraph } from "./dependencyGraph";
import { applySliderValue, createSliderTrack, Phase2ObjectRegistry, sliderValueAt } from "./phase2Objects";

describe("phase 2 object registry", () => {
  it("keeps objects backed by the shared dependency graph", () => {
    const graph = new MathDependencyGraph(); const registry = new Phase2ObjectRegistry(graph);
    const scalar = registry.add({ id: "scalar", type: "SCALAR", name: "a", definition: "a=2", visible: true, locked: false });
    const fn = registry.add({ id: "fn", type: "FUNCTION", name: "f", definition: "f(x)=x^2+a", visible: true, locked: false });
    expect(graph.evaluateExpression("f(a)").exactForm).toBe("6");
    expect(registry.usedBy(scalar.id)).toContain(fn.nodeId);
    registry.select([scalar.id, fn.id]); registry.batch({ visible: false, style: { opacity: 0.4 } });
    expect(registry.list().every((entry) => !entry.visible && entry.style.opacity === 0.4)).toBe(true);
    expect(registry.serialize()).toMatchObject({ version: 1, selection: ["scalar", "fn"] });
  });

  it("uses rational slider steps for playback and direct changes", () => {
    const graph = new MathDependencyGraph(); graph.define("a=0", "a");
    const track = { ...createSliderTrack({ objectId: "a", symbol: "a", min: 0, max: 1, stepNumerator: 1, stepDenominator: 10, value: 0, speed: 1, duration: 1, direction: "FORWARD", loop: "ONCE", easing: "LINEAR" }), playing: true, startedAt: 1000 };
    expect(sliderValueAt(track, 1550)).toBe(0.6);
    const applied = applySliderValue(graph, track, 0.56);
    expect(applied.track.value).toBe(0.6);
    expect(graph.evaluateExpression("a").exactForm).toBe("3/5");
  });
});
