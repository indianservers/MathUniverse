import { describe, expect, it } from "vitest";
import {
  adaptivePerformancePolicy, assessTeacherActivity, auditAccessibleControls, checkpoint, createHistory,
  createProjectDeepLink, createStudioProject, differentiatePolynomial, evaluatePolynomial, exportStudioProject,
  importStudioProject, labelledResult, readProjectDeepLink, redoCheckpoint, responsiveStudioLayout,
  runAdaptiveComputation, transferStudioObject, undoCheckpoint,
} from "./studioPlatformEngine";

describe("shared studio platform engine", () => {
  it("round-trips the shared project format and deep link", () => {
    const project = createStudioProject("Quadratic investigation", "algebra", new Date("2026-01-02T00:00:00Z"));
    project.objects.push({ id: "f", kind: "expression", name: "f", value: "x^2", sourceStudio: "algebra" });
    expect(importStudioProject(exportStudioProject(project))).toEqual(project);
    const link = createProjectDeepLink("https://math.test", "/algebra/advanced", project);
    expect(readProjectDeepLink(link)).toEqual(project);
  });

  it("transfers compatible objects and shares symbolic operations", () => {
    const object = transferStudioObject({ id: "p", kind: "point", name: "P", value: [1, 2], sourceStudio: "geometry" }, "calculus");
    expect(object.provenance).toBe("geometry → calculus");
    expect(differentiatePolynomial([3, 0, -2])).toEqual([6, 0]);
    expect(evaluatePolynomial([1, 0, -4], 3)).toBe(5);
  });

  it("supports named undo and redo checkpoints", () => {
    const changed = checkpoint(createHistory({ x: 1 }), { x: 2 }, "Move point");
    expect(undoCheckpoint(changed).present.state.x).toBe(1);
    expect(redoCheckpoint(undoCheckpoint(changed)).present.name).toBe("Move point");
  });

  it("audits accessibility and chooses responsive layouts", () => {
    expect(auditAccessibleControls([{ label: "Plot", keyboard: true, contrastRatio: 7, reducedMotion: true }]).passed).toBe(true);
    expect(auditAccessibleControls([{ keyboard: false, contrastRatio: 2, reducedMotion: false }]).issues).toHaveLength(3);
    expect(responsiveStudioLayout(420).sidebar).toBe("drawer");
    expect(responsiveStudioLayout(1400).columns).toBe(3);
  });

  it("labels provenance, assesses activities and adapts computation", async () => {
    expect(labelledResult("1/3", "exact").label).toBe("Exact");
    expect(assessTeacherActivity({ title: "Slope", prompt: "Find it", expected: 2, tolerance: 0.01, hint: "Use rise/run" }, 1, 2)).toMatchObject({ correct: false, progress: 50, feedback: "Use rise/run" });
    expect(adaptivePerformancePolicy(80_000, 8, true)).toMatchObject({ execution: "worker", quality: "adaptive", chunkSize: 20_000 });
    await expect(runAdaptiveComputation([1, 2, 3], (value) => value * value, 2)).resolves.toEqual([1, 4, 9]);
  });
});
