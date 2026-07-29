import { describe, expect, it } from "vitest";
import { buildBoardTextExport } from "./boardExport";
import { createBoardDocument } from "./boardPersistence";

describe("Board export configuration", () => {
  it("exports structured JSON with optional tutor exclusion", () => {
    const document = createBoardDocument("Export Test");
    document.tutorMessages = [{ id: "m", role: "tutor", mode: "hint", text: "Try balancing.", referencedElementIds: [], verified: true, createdAt: new Date().toISOString() }];
    const output = buildBoardTextExport(document, "json", { includeTutor: false });
    expect(JSON.parse(output).document.tutorMessages).toEqual([]);
  });

  it("exports LaTeX and accessible tutor text", () => {
    const document = createBoardDocument();
    document.elements = [{ id: "math", type: "math-expression", latex: "x^2", sourceStrokeIds: [], bounds: { x: 0, y: 0, width: 10, height: 10 }, createdAt: new Date().toISOString() }];
    document.tutorMessages = [{ id: "m", role: "tutor", mode: "hint", text: "Inspect the exponent.", referencedElementIds: ["math"], verified: true, createdAt: new Date().toISOString() }];
    expect(buildBoardTextExport(document, "latex", { includeTutor: true })).toBe("x^2");
    expect(buildBoardTextExport(document, "tutor-text", { includeTutor: true })).toContain("Inspect the exponent");
  });
});
