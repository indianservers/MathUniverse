import { describe, expect, it } from "vitest";
import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  LESSON_EXTENSION, LESSON_MIME, PORTABLE_APP_VERSION, PORTABLE_WORKSPACE_TYPES, WORKSPACE_EXTENSION, WORKSPACE_MIME,
  createDefaultLesson, createPortableMathFile, parsePortableMathFile, portableFilename, serializePortableMathFile,
  type PortableWorkspaceAdapter, type PortableWorkspaceType,
} from "./portableWorkspace";

function adapter(type: PortableWorkspaceType, scene: unknown): PortableWorkspaceAdapter {
  return {
    workspaceType: type, engine: `test-${type}`, engineVersion: "1.0.0", title: () => `${type} test`,
    serializeScene: () => scene, deserializeScene: () => undefined, getImageTarget: () => null,
    getSceneSummary: () => ({ objectCount: 1, expressionCount: 1 }),
  };
}

describe("portable Math Universe files", () => {
  it.each(PORTABLE_WORKSPACE_TYPES)("round-trips normalized %s scenes", async type => {
    const scene = { workspaceType: type, objects: [{ id: "object-1", label: "α", visible: true }], viewport: { zoom: 1.25 } };
    const original = await createPortableMathFile({ kind: "workspace", adapter: adapter(type, scene), title: "Portable Test" });
    const parsed = await parsePortableMathFile(serializePortableMathFile(original), `portable-${type}${WORKSPACE_EXTENSION}`, WORKSPACE_MIME);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.file.scene).toEqual(scene);
      expect(parsed.file.workspace.type).toBe(type);
      expect(parsed.file.integrity.contentHash).toMatch(/^[a-f0-9]{64}$/);
    }
  });

  it("round-trips lesson metadata without exposing the solution as the initial scene", async () => {
    const source = adapter("2d-geometry", { objects: [{ id: "A" }] });
    const lesson = createDefaultLesson("2d-geometry", "Circumcenter", { objects: [{ id: "A" }] });
    lesson.hints = ["First", "Second", "Third"];
    lesson.checkpoints = [{ id: "cp-1", title: "Midpoints", instructions: "Mark them", scene: { objects: [{ id: "M" }] }, validationRules: ["three midpoints"] }];
    lesson.solutionScene = { objects: [{ id: "A" }, { id: "O" }] };
    const file = await createPortableMathFile({ kind: "lesson", adapter: source, title: lesson.title, lesson, scene: lesson.initialScene });
    expect(file.fileHeader.fileExtension).toBe(LESSON_EXTENSION);
    expect(file.fileHeader.mimeType).toBe(LESSON_MIME);
    expect(file.scene).toEqual(lesson.initialScene);
    expect(file.scene).not.toEqual(lesson.solutionScene);
    expect((await parsePortableMathFile(serializePortableMathFile(file), "lesson.mathlesson", LESSON_MIME)).ok).toBe(true);
  });

  it("rejects tampering, conflicting lesson types, and unsupported readers", async () => {
    const source = adapter("cas", { cells: [{ id: "1", input: "factor(x^2-1)" }] });
    const workspace = await createPortableMathFile({ kind: "workspace", adapter: source, title: "CAS" });
    const tampered = JSON.parse(serializePortableMathFile(workspace)); tampered.scene.cells[0].input = "changed";
    expect(await parsePortableMathFile(JSON.stringify(tampered))).toMatchObject({ ok: false, error: expect.stringContaining("integrity") });
    const newer = JSON.parse(serializePortableMathFile(workspace)); newer.fileHeader.minimumReaderVersion = "99.0.0"; newer.integrity.contentHash = "";
    expect(await parsePortableMathFile(JSON.stringify(newer))).toMatchObject({ ok: false, error: expect.stringContaining("newer version") });
    const lesson = createDefaultLesson("cas", "Conflict", {});
    const lessonFile = await createPortableMathFile({ kind: "lesson", adapter: source, title: "Conflict", lesson });
    const conflict = JSON.parse(serializePortableMathFile(lessonFile)); conflict.lesson.workspaceType = "3d-graph"; conflict.integrity.contentHash = "";
    expect(await parsePortableMathFile(JSON.stringify(conflict))).toMatchObject({ ok: false, error: expect.stringContaining("conflicts") });
    expect(PORTABLE_APP_VERSION).toMatch(/^\d+\.\d+\.\d+/);
  });

  it("rejects malformed, deep, oversized and prototype-polluting payloads", async () => {
    expect(await parsePortableMathFile("{broken")).toMatchObject({ ok: false });
    expect(await parsePortableMathFile('{"__proto__":{"polluted":true}}')).toMatchObject({ ok: false, error: expect.stringContaining("unsafe") });
    let nested: unknown = "leaf"; for (let index = 0; index < 45; index += 1) nested = { nested };
    expect(await parsePortableMathFile(JSON.stringify(nested))).toMatchObject({ ok: false, error: expect.stringContaining("deeply") });
    expect(await parsePortableMathFile(JSON.stringify({ text: "x".repeat(200_001) }))).toMatchObject({ ok: false, error: expect.stringContaining("oversized text") });
  });

  it("sanitizes portable filenames and warns when external metadata disagrees", async () => {
    expect(portableFilename("../../ Résumé: Triangle?", "2d-geometry", "workspace")).toBe("resume-triangle-2d-geometry.mathworkspace");
    const file = await createPortableMathFile({ kind: "workspace", adapter: adapter("2d-graph", {}), title: "Graph" });
    const parsed = await parsePortableMathFile(serializePortableMathFile(file), "graph.txt", "application/octet-stream");
    expect(parsed.ok && parsed.warnings).toHaveLength(2);
  });

  it("validates all five distributable sample lessons with production rules", async () => {
    const directory = resolve(process.cwd(), "public/sample-lessons");
    const names = (await readdir(directory)).filter(name => name.endsWith(LESSON_EXTENSION));
    expect(names).toHaveLength(5);
    const parsed = await Promise.all(names.map(async name => parsePortableMathFile(await readFile(resolve(directory, name), "utf8"), name, LESSON_MIME)));
    expect(parsed.every(result => result.ok)).toBe(true);
    expect(new Set(parsed.flatMap(result => result.ok ? [result.file.workspace.type] : []))).toEqual(new Set(PORTABLE_WORKSPACE_TYPES));
    for (const result of parsed) if (result.ok) {
      expect(result.file.lesson?.hints.length).toBeGreaterThanOrEqual(3);
      expect(result.file.lesson?.solutionSteps.length).toBeGreaterThan(0);
      expect(result.file.preview.thumbnailIncluded).toBe(true);
    }
  });

  it("handles the required 500-object geometry corpus without mutation", async () => {
    const scene = { construction: { points: Array.from({ length: 500 }, (_, index) => ({ id: `P${index}`, x: index % 25, y: Math.floor(index / 25), label: `P${index}` })), lines: [], circles: [], polygons: [], arcs: [], loci: [], constraints: [] }, viewport: { zoom: 2 } };
    const before = JSON.stringify(scene);
    const started = performance.now();
    const file = await createPortableMathFile({ kind: "workspace", adapter: adapter("2d-geometry", scene), title: "500 object corpus" });
    const parsed = await parsePortableMathFile(serializePortableMathFile(file));
    expect(parsed.ok).toBe(true);
    expect(JSON.stringify(scene)).toBe(before);
    expect(performance.now() - started).toBeLessThan(2_500);
  });
});
