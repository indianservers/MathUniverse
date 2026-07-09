import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import NCERTPracticeCheck from "./NCERTPracticeCheck";

describe("NCERTPracticeCheck", () => {
  it("renders prompt, hint, and accessible answer controls", () => {
    const html = renderToStaticMarkup(
      <NCERTPracticeCheck
        questions={[{
          id: "q1",
          prompt: "What is 2 + 3?",
          answer: 5,
          hint: "Add both numbers.",
          explanation: "2 + 3 = 5.",
        }]}
      />,
    );

    expect(html).toContain("What is 2 + 3?");
    expect(html).toContain("Hint: Add both numbers.");
    expect(html).toContain("Practice answer");
    expect(html).toContain("Check answer");
  });
});
