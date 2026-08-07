import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import NumberLessonAdapter from "./NumberLessonAdapter";

describe("NumberLessonAdapter", () => {
  it("renders Complex Numbers with a complex-specific label", () => {
    const lesson = lessonCatalog.find((item) => item.id === 63)!;
    const html = renderToStaticMarkup(
      <NumberLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
    );

    expect(html).toContain("Complex Numbers");
    expect(html).toContain("complex point");
    expect(html).toContain("real part and an imaginary part");
  });
});
