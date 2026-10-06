import { describe, expect, it } from "vitest";
import { lessonScene } from "./geometryLessonScene";
import { lessonViewBox } from "./lessonViewBox";

describe("lesson framing", () => {
  it("centers both transformation figures with padding", () => {
    const scene=lessonScene(420,280);
    scene.polygon([{x:-200,y:0},{x:0,y:0},{x:0,y:200}]);
    scene.polygon([{x:400,y:300},{x:600,y:300},{x:600,y:500}]);
    const [x,y,w,h]=lessonViewBox(scene.result()).split(" ").map(Number);
    expect(x+w/2).toBeCloseTo(200);
    expect(y+h/2).toBeCloseTo(250);
    expect(x).toBeLessThan(-200); expect(x+w).toBeGreaterThan(600);
    expect(y).toBeLessThan(0); expect(y+h).toBeGreaterThan(500);
  });
  it("fits the entire circle rather than just the radius handle", () => {
    const scene=lessonScene(640,460);
    scene.circle({id:"O",x:120,y:90},170);
    const [x,y,w,h]=lessonViewBox(scene.result()).split(" ").map(Number);
    expect(x+w/2).toBeCloseTo(120); expect(y+h/2).toBeCloseTo(90);
    expect(x).toBeLessThan(-50); expect(y).toBeLessThan(-80);
  });
});
