import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import GraphWorkspacePanel from "./GraphWorkspacePanel";
import { buildAddedGraphPlots, removeGraphPlotById, type PlotItem, type ResultTableRow } from "./graphPanelUtils";

const colors = ["#06b6d4", "#8b5cf6"];
const regressionSeed: ResultTableRow[] = [{ x: -1, y: -1 }, { x: 0, y: 0 }, { x: 1, y: 1 }];
const tableRange = { start: -2, end: 2, step: 1 };

function renderPanel(plots: PlotItem[], validationMessage = null as Parameters<typeof GraphWorkspacePanel>[0]["validationMessage"]) {
  return renderToStaticMarkup(
    <GraphWorkspacePanel
      plots={plots}
      colors={colors}
      regressionSeed={regressionSeed}
      tableRange={tableRange}
      validationMessage={validationMessage}
      onChange={() => undefined}
      onTableRangeChange={() => undefined}
    />,
  );
}

describe("GraphWorkspacePanel", () => {
  it("renders with one valid expression", () => {
    const html = renderPanel([{ id: "plot-1", expression: "sin(x)", color: colors[0], kind: "function", visible: true }]);

    expect(html).toContain("Desmos-style Graphing Lab");
    expect(html).toContain("sin(x)");
    expect(html).toContain("Functions");
    expect(html).toContain("Smart graph expression editor");
  });

  it("uses smart expression rendering for graph plot input", () => {
    const html = renderPanel([{ id: "plot-1", expression: "A subset B, y<=x^2", color: colors[0], kind: "function", visible: true }]);

    expect(html).toContain("⊂");
    expect(html).toContain("≤");
    expect(html).toContain("<sup>");
    expect(html).toContain("A subset B, y&lt;=x^2");
  });

  it("preserves the graph surface test id and renders non-empty graph marks", () => {
    const html = renderPanel([{ id: "plot-1", expression: "sin(x)", color: colors[0], kind: "function", visible: true }]);

    expect(html).toContain('data-testid="workspace-graph-surface"');
    expect(html).toContain("<path");
    expect(html).toContain("stroke=\"#06b6d4\"");
  });

  it("renders visible validation messages with suggestions", () => {
    const html = renderPanel(
      [{ id: "plot-1", expression: "sin(x)", color: colors[0], kind: "function", visible: true }],
      {
        status: "unsupported",
        input: "window.alert(1)",
        message: "Graph expression is not supported.",
        suggestions: ["Use sin(x).", "Use x^2."],
      },
    );

    expect(html).toContain('data-testid="workspace-graph-validation-message"');
    expect(html).toContain("Graph expression is not supported.");
    expect(html).toContain("Try:");
    expect(html).toContain("Use sin(x).");
  });

  it("handles an empty expression state safely", () => {
    const html = renderPanel([]);

    expect(html).toContain("Expression");
    expect(html).toContain("Add graph");
    expect(html).toContain('data-testid="workspace-graph-surface"');
  });

  it("keeps existing plots visible when validation is invalid", () => {
    const html = renderPanel(
      [{ id: "plot-1", expression: "cos(x)", color: colors[1], kind: "function", visible: true }],
      {
        status: "invalid",
        input: "bad expression",
        message: "The expression could not be plotted.",
        suggestions: ["Try y=x."],
      },
    );

    expect(html).toContain("cos(x)");
    expect(html).toContain("<path");
    expect(html).toContain("The expression could not be plotted.");
  });

  it("builds the add-expression callback payload without mutating existing plots", () => {
    const existing: PlotItem[] = [{ id: "plot-1", expression: "sin(x)", color: colors[0], kind: "function", visible: true }];

    const next = buildAddedGraphPlots(existing, "x^2", colors);

    expect(next).toHaveLength(2);
    expect(next[0].expression).toBe("x^2");
    expect(next[0].kind).toBe("function");
    expect(existing).toHaveLength(1);
  });

  it("removes an expression by id", () => {
    const plots: PlotItem[] = [
      { id: "plot-1", expression: "sin(x)", color: colors[0], kind: "function", visible: true },
      { id: "plot-2", expression: "cos(x)", color: colors[1], kind: "function", visible: true },
    ];

    const next = removeGraphPlotById(plots, "plot-1");

    expect(next).toEqual([plots[1]]);
  });
});
