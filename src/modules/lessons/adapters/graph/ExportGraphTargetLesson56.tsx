import { Download, Expand, Eye, Link, Scan } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type {
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../../types";
import {
  EXPORT_BOUNDS_56,
  EXPORT_FIT_BOUNDS_56,
  exportFilename56,
  exportPoint56,
  exportXFromPixel56,
  formatExportValue56,
  logisticPath56,
  logisticValue56,
} from "./exportGraphLesson56Model";
import "./ExportGraphTargetLesson56.css";

type ExportFormat56 = "PNG" | "SVG" | "PDF";

function saveBlob56(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function ExportGraphTargetLesson56({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [format, setFormat] = useState<ExportFormat56>("PNG");
  const [transparent, setTransparent] = useState(false);
  const [grid, setGrid] = useState(true);
  const [labels, setLabels] = useState(true);
  const [scale, setScale] = useState(2);
  const [fit, setFit] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [selectedX, setSelectedX] = useState(0);
  const [filename, setFilename] = useState("export-graph-logistic-fx-1-1+e^-x");
  const [status, setStatus] = useState("Ready to export");
  const [actions, setActions] = useState(0);
  const bounds = fit ? EXPORT_FIT_BOUNDS_56 : EXPORT_BOUNDS_56;
  const width = 620;
  const height = 570;
  const selectedY = logisticValue56(selectedX);
  const point = exportPoint56(selectedX, selectedY, bounds, width, height);
  const origin = exportPoint56(0, 0, bounds, width, height);

  const reset = () => {
    setFormat("PNG");
    setTransparent(false);
    setGrid(true);
    setLabels(true);
    setScale(2);
    setFit(false);
    setExpanded(false);
    setSelectedX(0);
    setFilename("export-graph-logistic-fx-1-1+e^-x");
    setStatus("Ready to export");
    setActions(0);
  };
  useEffect(reset, [resetToken]);

  const act = (run: () => void) => {
    run();
    setActions((value) => value + 1);
    onInteraction();
  };
  const changeX = (value: number) =>
    act(() =>
      setSelectedX(Math.max(bounds.xMin, Math.min(bounds.xMax, value))),
    );
  const drag = (event: ReactPointerEvent<SVGCircleElement>) => {
    if (event.buttons !== 1) return;
    const rect = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!rect) return;
    changeX(
      exportXFromPixel56(
        ((event.clientX - rect.left) / rect.width) * width,
        bounds,
        width,
      ),
    );
  };
  const key = (event: ReactKeyboardEvent<SVGCircleElement>) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    changeX(selectedX + (event.key === "ArrowLeft" ? -0.1 : 0.1));
  };

  const exportSvg = () => {
    if (!svgRef.current) throw new Error("Preview unavailable");
    const clone = svgRef.current.cloneNode(true) as SVGSVGElement;
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clone.setAttribute("width", String(width * scale));
    clone.setAttribute("height", String(height * scale));
    if (transparent) clone.querySelector(".export-background")?.remove();
    if (!grid) clone.querySelector(".export-grid")?.remove();
    if (!labels) clone.querySelector(".export-labels")?.remove();
    return new XMLSerializer().serializeToString(clone);
  };

  const renderPng = async () => {
    const source = exportSvg();
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const image = new Image();
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Graph rendering failed"));
      image.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = width * scale;
    canvas.height = height * scale;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas unavailable");
    if (!transparent) {
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);
    return canvas;
  };

  const download = async () => {
    act(() => setStatus("Preparing export..."));
    try {
      const name = exportFilename56(filename);
      if (format === "SVG") {
        saveBlob56(
          new Blob([exportSvg()], { type: "image/svg+xml;charset=utf-8" }),
          `${name}.svg`,
        );
      } else {
        const canvas = await renderPng();
        if (format === "PNG") {
          const blob = await new Promise<Blob | null>((resolve) =>
            canvas.toBlob(resolve, "image/png"),
          );
          if (!blob) throw new Error("PNG creation failed");
          saveBlob56(blob, `${name}.png`);
        } else {
          const { jsPDF } = await import("jspdf");
          const pdf = new jsPDF({
            orientation: "landscape",
            unit: "px",
            format: [canvas.width, canvas.height],
          });
          pdf.addImage(
            canvas.toDataURL("image/png"),
            "PNG",
            0,
            0,
            canvas.width,
            canvas.height,
          );
          pdf.save(`${name}.pdf`);
        }
      }
      setStatus(`${format} downloaded`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Export failed");
    }
  };

  return (
    <section
      className={`eg56-page${expanded ? " expanded" : ""}`}
      data-testid="2d-graphing-mockup-0148"
      data-dedicated-lesson="56"
      data-object-model="generated-logistic-graph-pointer-keyboard-draggable-selected-point-live-svg-png-and-pdf-export-scale-transparency-grid-label-filename-fit-fullscreen-copy-link-embed-and-navigation"
      data-format={format}
      data-selected={`(${selectedX.toFixed(1)}, ${selectedY.toFixed(3)})`}
      data-actions={actions}
    >
      <nav className="eg56-breadcrumb">
        ← &nbsp; Home &gt; Lessons &gt; Graphs And Functions &gt;{" "}
        <b>56 Export Graph</b>
      </nav>
      <header className="eg56-hero">
        <small>
          <b>GRAPHS AND FUNCTIONS</b>
          <b>2D GRAPHING CALCULATOR</b>
        </small>
        <h1>Export Graph</h1>
        <p>Reuse or share mathematical work.</p>
        <nav>
          <b>Foundational-Advanced</b>
          <b>⚡ Graph Explorer</b>
          <b>▣ Graphing Calculator</b>
          <b>◷ 6-10 min</b>
        </nav>
      </header>

      <section className="eg56-workspace">
        <article className="eg56-preview">
          <header>
            <h2>
              <Eye />
              Export preview
            </h2>
            <span>
              <button
                className={fit ? "active" : ""}
                onClick={() => act(() => setFit((value) => !value))}
              >
                <Scan />
                Fit to view
              </button>
              <button
                aria-label="Toggle expanded export preview"
                onClick={() => act(() => setExpanded((value) => !value))}
              >
                <Expand />
              </button>
            </span>
          </header>
          <svg
            ref={svgRef}
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label="Exportable logistic graph with draggable selected point"
          >
            <rect
              className="export-background"
              width={width}
              height={height}
              fill="white"
            />
            <g className="export-grid">
              <defs>
                <pattern
                  id="eg56-grid"
                  width="68"
                  height="68"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M68 0H0V68"
                    fill="none"
                    stroke="#dfe6ed"
                    strokeDasharray="5 4"
                  />
                </pattern>
              </defs>
              <rect width={width} height={height} fill="url(#eg56-grid)" />
            </g>
            <line
              className="axis"
              x1="0"
              x2={width}
              y1={origin.y}
              y2={origin.y}
            />
            <line
              className="axis"
              x1={origin.x}
              x2={origin.x}
              y1="50"
              y2={height}
            />
            <line
              className="asymptote"
              x1="0"
              x2={width}
              y1={exportPoint56(0, 1, bounds, width, height).y}
              y2={exportPoint56(0, 1, bounds, width, height).y}
            />
            <polyline
              className="curve"
              points={logisticPath56(bounds, width, height)}
            />
            <circle
              aria-label="Drag export selected point"
              tabIndex={0}
              className="selected-point"
              cx={point.x}
              cy={point.y}
              r="9"
              onPointerDown={(event) =>
                event.currentTarget.setPointerCapture(event.pointerId)
              }
              onPointerMove={drag}
              onKeyDown={key}
            />
            <g className="export-labels">
              <text
                className="formula"
                x={width / 2}
                y="38"
                textAnchor="middle"
              >
                f(x) = 1 / (1 + e⁻ˣ)
              </text>
              <text className="point-label" x={point.x + 18} y={point.y + 5}>
                ({formatExportValue56(selectedX)},{" "}
                {formatExportValue56(selectedY)})
              </text>
              <g
                className="legend"
                transform={`translate(${width - 230} ${height - 90})`}
              >
                <rect width="215" height="72" rx="7" />
                <text x="18" y="27">
                  — f(x) = 1 / (1 + e⁻ˣ)
                </text>
                <text x="18" y="53">
                  ● Selected point ({formatExportValue56(selectedX)},{" "}
                  {formatExportValue56(selectedY)})
                </text>
              </g>
            </g>
          </svg>
          <p>What you see is what you'll export.</p>
        </article>

        <aside className="eg56-settings">
          <h2>
            <Download />
            Export settings
          </h2>
          <h3>Format</h3>
          <section className="formats">
            {(["PNG", "SVG", "PDF"] as const).map((item) => (
              <button
                key={item}
                className={format === item ? "active" : ""}
                onClick={() => act(() => setFormat(item))}
              >
                <b>{item}</b>
                <span>{item}</span>
              </button>
            ))}
          </section>
          <label>
            Transparent background
            <input
              type="checkbox"
              checked={transparent}
              onChange={(event) =>
                act(() => setTransparent(event.target.checked))
              }
            />
          </label>
          <label>
            Include grid
            <input
              type="checkbox"
              checked={grid}
              onChange={(event) => act(() => setGrid(event.target.checked))}
            />
          </label>
          <label>
            Include labels
            <input
              type="checkbox"
              checked={labels}
              onChange={(event) => act(() => setLabels(event.target.checked))}
            />
          </label>
          <label className="scale">
            Scale
            <select
              aria-label="Export scale"
              value={scale}
              onChange={(event) =>
                act(() => setScale(Number(event.target.value)))
              }
            >
              <option value="1">Scale 1x</option>
              <option value="2">Scale 2x</option>
              <option value="3">Scale 3x</option>
            </select>
          </label>
          <button className="download" onClick={download}>
            <Download />
            Download {format}
          </button>
          <output>{status}</output>
          <hr />
          <h3>Share & embed</h3>
          <section className="share">
            <button
              onClick={() =>
                act(() => navigator.clipboard?.writeText(window.location.href))
              }
            >
              <Link />
              Copy link
            </button>
            <button
              onClick={() =>
                act(() =>
                  navigator.clipboard?.writeText(
                    `<iframe src="${window.location.href}"></iframe>`,
                  ),
                )
              }
            >
              &lt;/&gt; Classroom embed
            </button>
          </section>
        </aside>
      </section>

      <section className="eg56-details">
        <article>
          <h2>Export checklist</h2>
          <p>✓ Function: f(x) = 1 / (1 + e⁻ˣ)</p>
          <p>✓ Axes, {grid ? "grid, " : ""}and scale</p>
          <p>✓ {labels ? "Labels and legend" : "Labels excluded"}</p>
          <p>
            ✓ Selected point ({formatExportValue56(selectedX)},{" "}
            {formatExportValue56(selectedY)})
          </p>
        </article>
        <article>
          <h2>File name</h2>
          <input
            aria-label="Export file name"
            value={filename}
            onChange={(event) => act(() => setFilename(event.target.value))}
          />
          <aside>
            <b>Quality tip</b>
            <p>
              Scale {scale}x creates a {width * scale} × {height * scale}{" "}
              export.
            </p>
          </aside>
        </article>
      </section>
      <nav className="eg56-adjacent">
        <a href="/lessons/graphs-and-functions/55-dynamic-parameters">
          ←{" "}
          <span>
            PREVIOUS<b>Dynamic Parameters</b>
          </span>
        </a>
        <a href="/lessons/graphs-and-functions/57-examples">
          <span>
            Continue lesson<b>Examples</b>
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}
