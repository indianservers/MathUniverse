import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import GraphWorkspacePanel from "./GraphWorkspacePanel";
import {
  areaFillPath,
  buildAddedGraphPlots,
  removeGraphPlotById,
  type PlotItem,
  type ResultTableRow,
} from "./graphPanelUtils";

const colors = ["#06b6d4", "#8b5cf6"];
const regressionSeed: ResultTableRow[] = [
  { x: -1, y: -1 },
  { x: 0, y: 0 },
  { x: 1, y: 1 },
];
const tableRange = { start: -2, end: 2, step: 1 };

function renderPanel(
  plots: PlotItem[],
  validationMessage = null as Parameters<
    typeof GraphWorkspacePanel
  >[0]["validationMessage"],
) {
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
    const html = renderPanel([
      {
        id: "plot-1",
        expression: "sin(x)",
        color: colors[0],
        kind: "function",
        visible: true,
      },
    ]);

    expect(html).toContain("Desmos-style Graphing Lab");
    expect(html).toContain("sin(x)");
    expect(html).toContain("Functions");
    expect(html).toContain("Smart graph expression editor");
  });

  it("preserves graph plot input safely inside the plots tab", () => {
    const html = renderPanel([
      {
        id: "plot-1",
        expression: "A subset B, y<=x^2",
        color: colors[0],
        kind: "function",
        visible: true,
      },
    ]);

    expect(html).toContain("Edit graph expression A subset B");
    expect(html).toContain("A subset B, y&lt;=x^2");
  });

  it("preserves the graph surface test id and renders non-empty graph marks", () => {
    const html = renderPanel([
      {
        id: "plot-1",
        expression: "sin(x)",
        color: colors[0],
        kind: "function",
        visible: true,
      },
    ]);

    expect(html).toContain('data-testid="workspace-graph-surface"');
    expect(html).toContain("<path");
    expect(html).toContain('stroke="#06b6d4"');
  });

  it("renders axis unit labels on the graph surface", () => {
    const html = renderPanel([
      {
        id: "plot-1",
        expression: "a*x+b",
        color: colors[0],
        kind: "function",
        visible: true,
      },
    ]);

    expect(html).toContain(">1 unit</text>");
    expect(html).toContain(">x</text>");
    expect(html).toContain(">y</text>");
  });

  it("renders visible validation messages with suggestions", () => {
    const html = renderPanel(
      [
        {
          id: "plot-1",
          expression: "sin(x)",
          color: colors[0],
          kind: "function",
          visible: true,
        },
      ],
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
      [
        {
          id: "plot-1",
          expression: "cos(x)",
          color: colors[1],
          kind: "function",
          visible: true,
        },
      ],
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
    const existing: PlotItem[] = [
      {
        id: "plot-1",
        expression: "sin(x)",
        color: colors[0],
        kind: "function",
        visible: true,
      },
    ];

    const next = buildAddedGraphPlots(existing, "x^2", colors);

    expect(next).toHaveLength(2);
    expect(next[0].expression).toBe("x^2");
    expect(next[0].kind).toBe("function");
    expect(existing).toHaveLength(1);
  });

  it("offers solid, pattern, and image fills for the selected graph", () => {
    const html = renderPanel([
      {
        id: "plot-1",
        expression: "sin(x)",
        color: colors[0],
        kind: "function",
        visible: true,
        fillMode: "solid",
        fillColor: "#16a34a",
      },
    ]);

    expect(html).toContain("Outline");
    expect(html).toContain('aria-label="Graph fill"');
    expect(html).toContain("Solid color");
    expect(html).toContain("Pattern");
    expect(html).toContain("Image");
    expect(html).toContain('fill="#16a34a"');
    expect(html).toContain('stroke="#06b6d4"');
  });

  it("closes a function fill on the x-axis and a polar fill on itself", () => {
    const viewport = { xMin: -2, xMax: 2, yMin: -2, yMax: 2, width: 100, height: 100 };
    const curve = "M10.00,20.00 L90.00,20.00";
    expect(areaFillPath(curve, viewport, "function")).toBe("M10.00,20.00 L90.00,20.00 L90.00,50.00 L10.00,50.00 Z");
    expect(areaFillPath(curve, viewport, "polar").endsWith("Z")).toBe(true);
  });

  it("removes an expression by id", () => {
    const plots: PlotItem[] = [
      {
        id: "plot-1",
        expression: "sin(x)",
        color: colors[0],
        kind: "function",
        visible: true,
      },
      {
        id: "plot-2",
        expression: "cos(x)",
        color: colors[1],
        kind: "function",
        visible: true,
      },
    ];

    const next = removeGraphPlotById(plots, "plot-1");

    expect(next).toEqual([plots[1]]);
  });
});
