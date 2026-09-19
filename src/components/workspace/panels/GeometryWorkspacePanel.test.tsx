import { createRef } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { certifyGeometryConstruction } from "../../../workspace/geometryConstructionCertification";
import GeometryWorkspacePanel, {
  type Construction,
  type GeometryGraphSettings,
  type GeometryTool,
  type SelectedGeometryObject,
  type WorkspaceImage,
} from "./GeometryWorkspacePanel";

const construction: Construction = {
  points: [
    { id: "a", x: 160, y: 200, label: "A" },
    { id: "b", x: 320, y: 200, label: "B" },
    { id: "c", x: 260, y: 100, label: "C" },
  ],
  lines: [
    { id: "ab", a: "a", b: "b", style: { label: "segment", color: "#22d3ee" } },
  ],
  circles: [{ id: "circle-a", center: "a", edge: "c" }],
  polygons: [{ id: "tri", points: ["a", "b", "c"] }],
  arcs: [{ id: "angle-abc", center: "b", start: "a", end: "c", kind: "angle" }],
  loci: [
    {
      id: "trace-a",
      label: "trace A",
      points: [
        { x: 150, y: 200 },
        { x: 170, y: 205 },
      ],
      style: { color: "#ec4899" },
    },
  ],
  constraints: [{ id: "mid-ab", type: "midpoint", a: "a", b: "b", point: "c" }],
};

const image: WorkspaceImage = {
  id: "image-1",
  name: "Reference",
  src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E",
  x: 20,
  y: 20,
  width: 80,
  height: 50,
  opacity: 0.8,
};

const graphSettings: GeometryGraphSettings = {
  showGrid: true,
  showAxes: true,
  showUnitLabels: true,
  showPointLabels: true,
  showMeasurements: true,
  highContrastGrid: false,
  snapToGrid: true,
  snapToObjects: true,
};

function renderPanel(
  options: {
    activeTool?: GeometryTool;
    selectedGeometry?: SelectedGeometryObject | null;
    selectedPointIds?: string[];
    polygonDraft?: string[];
    picks?: SelectedGeometryObject[];
    images?: WorkspaceImage[];
    sidebar?: React.ReactNode;
    unifiedObjectsPanel?: React.ReactNode;
    camera?: { x: number; y: number; width: number; height: number };
  } = {},
) {
  return renderToStaticMarkup(
    <MemoryRouter>
      <GeometryWorkspacePanel
        activeTool={options.activeTool ?? "point"}
        construction={construction}
        selectedGeometry={options.selectedGeometry ?? null}
        selectedPointIds={options.selectedPointIds ?? []}
        polygonDraft={options.polygonDraft ?? []}
        geometryObjectPicks={options.picks ?? []}
        constructionAccuracyReport={certifyGeometryConstruction(construction)}
        workspaceImages={options.images ?? []}
        selectedImageId={options.images?.[0]?.id ?? null}
        graphSettings={graphSettings}
        camera={options.camera ?? { x: 0, y: 0, width: 640, height: 420 }}
        boardRef={createRef<SVGSVGElement>()}
        imageInputRef={createRef<HTMLInputElement>()}
        sidebar={
          options.sidebar ?? (
            <aside data-testid="workspace-geometry-object-list">
              Inspector
            </aside>
          )
        }
        unifiedObjectsPanel={options.unifiedObjectsPanel}
        onImageUpload={() => undefined}
        onToolChange={() => undefined}
        onSelectAll={() => undefined}
        onMoveSelected={() => undefined}
        onRotateSelected={() => undefined}
        onDilateSelected={() => undefined}
        onResizeSelected={() => undefined}
        onUndo={() => undefined}
        onRedo={() => undefined}
        onDeleteSelected={() => undefined}
        onShowHide={() => undefined}
        onLockSelected={() => undefined}
        onTraceSelected={() => undefined}
        onStopTrace={() => undefined}
        onClearTrace={() => undefined}
        onReset={() => undefined}
        onSave={() => undefined}
        onLoad={() => undefined}
        onGraphSettingsChange={() => undefined}
        onZoom={() => undefined}
        onFitView={() => undefined}
        onResetView={() => undefined}
        onBoardWheel={() => undefined}
        onBoardKeyDown={() => undefined}
        onClearPendingPicks={() => undefined}
        onBoardPointerDown={() => undefined}
        onBoardPointerMove={() => undefined}
        onBoardPointerUp={() => undefined}
        onBoardPointerLeave={() => undefined}
        onBoardContextMenu={() => undefined}
        onGeometryExportRef={() => undefined}
      />
    </MemoryRouter>,
  );
}

describe("GeometryWorkspacePanel", () => {
  it("renders the geometry board with stable test ids", () => {
    const html = renderPanel();

    expect(html).toContain('data-testid="workspace-geometry-board"');
    expect(html).toContain('role="application"');
    expect(html).toContain("Geometry constructor");
    expect(html).toContain("∠ABC");
    expect(html).toContain('data-testid="workspace-geometry-graph-settings"');
    expect(html).toContain("Graph Settings");
    expect(html).toContain('aria-label="Home page"');
    expect(html).toContain("Load / Import");
    expect(html).not.toContain('class="geometry-studio-rail"');
    expect(html).not.toContain(">Learn</button>");
    expect(html).not.toContain('aria-label="Zoom"');
    expect(html).toContain('aria-label="Fit all objects"');
    expect(html).toContain('aria-label="Pane controls"');
    expect(html).toContain('aria-label="Enlarge active pane"');
    expect(html).toContain('aria-label="Expand active pane"');
    expect(html).toContain('aria-label="Resize tools pane"');
    expect(html).toContain('aria-label="Resize object inspector pane"');
    expect(html).not.toContain("Construction Protocol");
    expect(html).not.toContain('aria-label="Resize construction protocol pane"');
    expect(html).toContain('data-testid="geometry-view-range"');
    expect(html).toContain("Range</span> x -8…8 · y -5…5.5");
  });

  it("renders supported geometry tools and active tool state", () => {
    const html = renderPanel({ activeTool: "line" });

    expect(html).toContain("Point");
    expect(html).toContain("Line");
    expect(html).toContain("Circle");
    expect(html).toContain("geometry-palette-button-active");
    expect(html).toContain('data-testid="workspace-geometry-tool-point"');
    expect(html).toContain('data-testid="workspace-geometry-tool-line"');
    expect(html).toContain('data-testid="workspace-geometry-tool-circle"');
  });

  it("keeps tick labels readable at the maximum coordinate range", () => {
    const html = renderPanel({
      camera: { x: 0, y: 0, width: 163_840, height: 107_520 },
    });

    expect(html).toContain('font-size="2560"');
    expect(html).toContain('title="Maximum coordinate range reached"');
    expect(html).toContain("x -8…4088");
  });

  it("renders existing point line circle polygon locus and measurement marks", () => {
    const html = renderPanel();

    expect(html).toContain('data-point-id="a"');
    expect(html).toContain('data-object-type="line"');
    expect(html).toContain('data-object-type="circle"');
    expect(html).toContain('data-object-type="polygon"');
    expect(html).toContain('data-object-type="locus"');
    expect(html).toContain('data-testid="workspace-geometry-measurements"');
  });

  it("can hide point labels and measurement overlays through graph settings", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <GeometryWorkspacePanel
          activeTool="point"
          construction={construction}
          selectedGeometry={null}
          selectedPointIds={[]}
          polygonDraft={[]}
          geometryObjectPicks={[]}
          constructionAccuracyReport={certifyGeometryConstruction(construction)}
          workspaceImages={[]}
          selectedImageId={null}
          graphSettings={{
            ...graphSettings,
            showPointLabels: false,
            showMeasurements: false,
          }}
          camera={{ x: 0, y: 0, width: 640, height: 420 }}
          boardRef={createRef<SVGSVGElement>()}
          imageInputRef={createRef<HTMLInputElement>()}
          sidebar={<aside>Inspector</aside>}
          onImageUpload={() => undefined}
          onToolChange={() => undefined}
          onSelectAll={() => undefined}
          onMoveSelected={() => undefined}
          onRotateSelected={() => undefined}
          onDilateSelected={() => undefined}
          onResizeSelected={() => undefined}
          onUndo={() => undefined}
          onRedo={() => undefined}
          onDeleteSelected={() => undefined}
          onShowHide={() => undefined}
          onLockSelected={() => undefined}
          onTraceSelected={() => undefined}
          onStopTrace={() => undefined}
          onClearTrace={() => undefined}
          onReset={() => undefined}
          onSave={() => undefined}
          onLoad={() => undefined}
          onGraphSettingsChange={() => undefined}
          onZoom={() => undefined}
          onFitView={() => undefined}
          onResetView={() => undefined}
          onBoardWheel={() => undefined}
          onBoardKeyDown={() => undefined}
          onClearPendingPicks={() => undefined}
          onBoardPointerDown={() => undefined}
          onBoardPointerMove={() => undefined}
          onBoardPointerUp={() => undefined}
          onBoardPointerLeave={() => undefined}
          onBoardContextMenu={() => undefined}
          onGeometryExportRef={() => undefined}
        />
      </MemoryRouter>,
    );

    expect(html).not.toContain('data-testid="workspace-geometry-measurements"');
    expect(html).not.toContain(">A</text>");
  });

  it("indicates selected objects and pending construction picks", () => {
    const html = renderPanel({
      activeTool: "parallel",
      selectedGeometry: { type: "point", id: "a" },
      selectedPointIds: ["a"],
      picks: [{ type: "line", id: "ab" }],
    });

    expect(html).toContain("Pick the through-point");
    expect(html).toContain("Picked:");
    expect(html).toContain("AB");
    expect(html).toContain("#f97316");
  });

  it("renders polygon draft angle preview and selected image state", () => {
    const html = renderPanel({
      activeTool: "angle",
      selectedPointIds: ["a", "b"],
      polygonDraft: ["a", "b"],
      images: [image],
    });

    expect(html).toContain('data-image-id="image-1"');
    expect(html).toContain("<polyline");
    expect(html).toContain('stroke="#f97316"');
  });

  it("handles empty construction state safely", () => {
    const emptyConstruction: Construction = {
      points: [],
      lines: [],
      circles: [],
      polygons: [],
      arcs: [],
      loci: [],
      constraints: [],
    };
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <GeometryWorkspacePanel
          activeTool="select"
          construction={emptyConstruction}
          selectedGeometry={null}
          selectedPointIds={[]}
          polygonDraft={[]}
          geometryObjectPicks={[]}
          constructionAccuracyReport={certifyGeometryConstruction(
            emptyConstruction,
          )}
          workspaceImages={[]}
          selectedImageId={null}
          graphSettings={{
            ...graphSettings,
            showGrid: false,
            showAxes: false,
            showUnitLabels: false,
          }}
          camera={{ x: 0, y: 0, width: 640, height: 420 }}
          boardRef={createRef<SVGSVGElement>()}
          imageInputRef={createRef<HTMLInputElement>()}
          sidebar={<aside>Empty inspector</aside>}
          onImageUpload={() => undefined}
          onToolChange={() => undefined}
          onSelectAll={() => undefined}
          onMoveSelected={() => undefined}
          onRotateSelected={() => undefined}
          onDilateSelected={() => undefined}
          onResizeSelected={() => undefined}
          onUndo={() => undefined}
          onRedo={() => undefined}
          onDeleteSelected={() => undefined}
          onShowHide={() => undefined}
          onLockSelected={() => undefined}
          onTraceSelected={() => undefined}
          onStopTrace={() => undefined}
          onClearTrace={() => undefined}
          onReset={() => undefined}
          onSave={() => undefined}
          onLoad={() => undefined}
          onGraphSettingsChange={() => undefined}
          onZoom={() => undefined}
          onFitView={() => undefined}
          onResetView={() => undefined}
          onBoardWheel={() => undefined}
          onBoardKeyDown={() => undefined}
          onClearPendingPicks={() => undefined}
          onBoardPointerDown={() => undefined}
          onBoardPointerMove={() => undefined}
          onBoardPointerUp={() => undefined}
          onBoardPointerLeave={() => undefined}
          onBoardContextMenu={() => undefined}
          onGeometryExportRef={() => undefined}
        />
      </MemoryRouter>,
    );

    expect(html).toContain('data-testid="workspace-geometry-board"');
    expect(html).toContain("Move");
    expect(html).toContain("Touch mode");
  });

  it("keeps the objects pane on construction items and withholds the shared graph registry", () => {
    const html = renderPanel({
      unifiedObjectsPanel: <div>Unified Dynamic Workspace cone cylinder</div>,
    });

    expect(html).toContain("Points");
    expect(html).toContain("8 objects");
    expect(html).not.toContain("Unified Dynamic Workspace cone cylinder");
    expect(html).toContain("Construct");
    expect(html).toContain("Measure");
    expect(html).toContain('data-geometry-studio-mode="Construct"');
    expect(html).not.toContain("Pinned measurements");
    expect(html).toContain('data-geometry-theme="dark"');
    expect(html).toContain('data-chrome-theme="default"');
    expect(html).toContain("Default theme");
    expect(html).toContain("Glow theme");
    expect(html).toContain("Light theme");
    expect(html).toContain('aria-label="Workspace color theme"');
  });
});
