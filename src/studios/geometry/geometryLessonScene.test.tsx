import { describe, expect, it } from "vitest";
import { lessonScene, nativeLessonScene } from "./geometryLessonScene";
import { transformationLessonScene } from "./geometryStudioScenes";
import { affineConstraintPoint } from "../../workspace/geometryAffineConstraint";
import { withLessonOverlays } from "./geometryLessonOverlays";

describe("embedded lesson scenes", () => {
  it("keeps lesson lengths and the camera consistent with native 40-pixel units", () => {
    const scene = lessonScene(420, 280, p => p, 70);
    scene.line({ id: "A", x: 70, y: 140 }, { id: "B", x: 280, y: 140 });
    const native = nativeLessonScene(scene.result());
    const [a,b] = native.workspaceSnapshot.construction.points;
    expect((b.x-a.x)/40).toBe(3);
    expect(native.geometryCamera.width).toBeCloseTo(240);
    expect(scene.result().construction.points[0].x).toBe(70);
  });
  it("connects anonymous geometry endpoints to existing source points", () => {
    const scene = lessonScene(400,300);
    scene.point({ id: "A", x: 20, y: 30 });
    scene.line({ x:20,y:30 }, { x:120,y:30 });
    expect(scene.construction.lines[0].a).toBe("A");
    expect(scene.construction.points).toHaveLength(2);
  });
  it("keeps transformed images dependent after native coordinate conversion", () => {
    const source = [{id:"A",x:0,y:0},{id:"B",x:2,y:0},{id:"C",x:0,y:2}];
    const image = source.map(p => ({...p,x:p.x+3,y:p.y+1}));
    const native = nativeLessonScene(transformationLessonScene("Translate",source,image,{x:3,y:1}));
    const construction=native.workspaceSnapshot.construction;
    const constraint=construction.constraints.find(c=>c.type==="affine" && c.source==="A")!;
    if (constraint.type!=="affine") throw new Error("missing transform");
    const before=affineConstraintPoint(constraint,construction.points)!;
    const moved=construction.points.map(p=>p.id==="A"?{...p,x:p.x+40}:p);
    expect(affineConstraintPoint(constraint,moved)!.x-before.x).toBeCloseTo(40);
  });
  it("includes visible lesson circles without duplicating the source scene", () => {
    const scene=lessonScene(400,300);
    const result=withLessonOverlays(scene.result(), <circle cx={200} cy={150} r={70} stroke="#147df2" />);
    expect(result.construction.circles).toHaveLength(1);
    expect(scene.construction.circles).toHaveLength(0);
  });
});
