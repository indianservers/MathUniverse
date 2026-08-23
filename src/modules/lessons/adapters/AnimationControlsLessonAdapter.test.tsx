import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import AnimationControlsLessonAdapter, {
  ANIMATION_CONTROL_FRAMES,
  animationFrameOutput,
} from "./AnimationControlsLessonAdapter";

describe("AnimationControlsLessonAdapter", () => {
  it("calculates the exact linear output for every animation frame", () => {
    expect(ANIMATION_CONTROL_FRAMES).toEqual([0, 0.5, 1, 1.5, 2, 2]);
    expect(animationFrameOutput(0)).toEqual({ frame: 0, a: 0, y: 1 });
    expect(animationFrameOutput(3)).toEqual({ frame: 3, a: 1.5, y: 4 });
    expect(animationFrameOutput(5)).toEqual({ frame: 5, a: 2, y: 5 });
    expect(animationFrameOutput(99)).toEqual({ frame: 5, a: 2, y: 5 });
  });

  it("renders the lesson-specific graph, playback controls, and exact frame table", () => {
    const lesson = lessonCatalog.find((item) => item.id === 24)!;
    const html = renderToStaticMarkup(
      <AnimationControlsLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
    );

    expect(html).toContain("Animate parameter a from 0 to 2");
    expect(html).toContain("y = ax + 1");
    expect(html).toContain("Current frame 3");
    expect(html).toContain("y(2) = 4");
    expect(html).toContain("Step back");
    expect(html).toContain("Step forward");
    expect(html).toContain("Frame table");
    expect(html).toContain("The existing 2D graph sampler recalculates");
    expect(html).not.toContain("Input, rule, and checked output");
  });
});
