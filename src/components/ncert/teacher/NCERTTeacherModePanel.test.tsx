import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import NCERTTeacherModePanel from "./NCERTTeacherModePanel";

describe("NCERTTeacherModePanel", () => {
  it("renders a printable worksheet and answer key", () => {
    const html = renderToStaticMarkup(
      <NCERTTeacherModePanel
        title="Integers"
        classLevel="Class 7"
        questions={[{
          id: "q1",
          conceptId: "class-7-integers",
          difficulty: "easy",
          prompt: "Find -3 + 7.",
          answer: 4,
          answerType: "numeric",
          hint: "Move right.",
          explanation: "-3 + 7 = 4.",
        }]}
      />,
    );
    expect(html).toContain("Teacher worksheet mode");
    expect(html).toContain("Name:");
    expect(html).toContain("Answer Key");
    expect(html).toContain("Find -3 + 7.");
  });
});
