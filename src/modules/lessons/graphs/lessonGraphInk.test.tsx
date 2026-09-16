import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LessonGraphInkLegend, lessonGraphInkProps } from "./LessonGraphInk";
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("lesson graph ink", () => {
  it("keeps chord, tangent, and angle as distinct colors without glowing labels", () => {
    const html = renderToString(<svg {...lessonGraphInkProps}><LessonGraphInkLegend /></svg>);
    expect(html).toContain("data-lesson-graph-ink");
    expect(html).toContain("Chord");
    expect(html).toContain("Tangent");
    expect(html).toContain("Angle");
    expect(html).not.toContain("glow");
    expect(html).toContain("#2563eb");
    expect(html).toContain("#f59e0b");
    expect(html).toContain("#ec4899");
  });

  it("scopes ink CSS to lesson figures, not studio workspaces", () => {
    const css = readFileSync(join(__dirname, "lessonGraphInk.css"), "utf8");
    expect(css).toContain("svg[data-lesson-graph-ink]");
    expect(css).toContain("Lesson figures only");
    expect(css).toContain("svg[data-lesson-graph-ink] text");
    expect(css).toContain("text-shadow: none");
    expect(css).not.toContain(".msk-");
    expect(css).not.toContain(".clab-");
  });

  it("is never imported from studio workspaces", () => {
    const hits = execSync(
      "grep -R --include='*.ts' --include='*.tsx' 'LessonGraphInk' src/studios || true",
      { encoding: "utf8", cwd: join(__dirname, "../../../..") },
    );
    expect(hits.trim()).toBe("");
  });
});
