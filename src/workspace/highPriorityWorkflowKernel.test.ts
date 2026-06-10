import { describe, expect, it } from "vitest";
import {
  advanceSlider,
  contextMenuForObject,
  createProjectMetadata,
  createProtocolPlaybackPlan,
  createSliderObject,
  exportPresets,
  imageWorkflowSpec,
  rankSnapCandidates,
  searchProjectMetadata,
  styleBarForObject,
  tabletControlSpec,
} from "./highPriorityWorkflowKernel";

describe("high priority workflow kernel", () => {
  it("builds dependency-safe protocol playback plans", () => {
    const plan = createProtocolPlaybackPlan([
      { id: "circle", label: "Circle", detail: "needs center", dependencies: ["center"], createdAt: 2 },
      { id: "center", label: "Center", detail: "point", createdAt: 1 },
    ], { cursor: 1, hiddenColumns: ["createdAt"] });

    expect(plan.steps.map((step) => step.id)).toEqual(["center", "circle"]);
    expect(plan.columns).not.toContain("createdAt");
    expect(plan.canReorder).toBe(false);
    expect(plan.replayLabels).toEqual(["1. Center", "2. Circle"]);
  });

  it("returns contextual style bars and right-click actions", () => {
    expect(styleBarForObject("circle")).toEqual(expect.arrayContaining(["color", "fill", "stroke", "labelMode"]));
    expect(styleBarForObject("3d")).toContain("material");
    expect(contextMenuForObject("image")).toContain("calibrate-image");
    expect(contextMenuForObject("point")).toContain("create-locus");
  });

  it("supports global slider animation and snap priority", () => {
    const slider = createSliderObject("a", { min: 0, max: 1, step: 0.1, value: 0.9, playing: true, speed: 2 });
    expect(advanceSlider(slider, 1).value).toBeCloseTo(0.9);

    const snaps = rankSnapCandidates({ x: 0, y: 0 }, [
      { id: "grid", label: "Grid", priority: 10, x: 0, y: 0, constraint: "grid" },
      { id: "intersection", label: "Intersection", priority: 90, x: 5, y: 5, constraint: "intersection" },
    ]);
    expect(snaps[0].id).toBe("intersection");
  });

  it("defines image, export, offline metadata, and tablet contracts", () => {
    expect(imageWorkflowSpec().actions).toContain("calibrate-scale");
    expect(exportPresets().map((preset) => preset.id)).toEqual(expect.arrayContaining(["png-transparent", "svg-selected", "pdf-worksheet", "ggb-lite"]));
    expect(tabletControlSpec("pen")).toMatchObject({ penMode: true, twoFingerPanZoom: true, touchHandleSize: 44 });

    const metadata = createProjectMetadata({ title: "Circle lesson", folder: "Geometry", tags: ["circle", "grade 9"] });
    expect(searchProjectMetadata([metadata], "geometry circle")).toHaveLength(1);
    expect(metadata.version).toBe(1);
  });
});
