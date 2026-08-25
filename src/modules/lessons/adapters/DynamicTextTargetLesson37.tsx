import {
  ExternalLink,
  RotateCcw,
  Share2,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { LessonAdapterProps } from "../types";
import "./DynamicTextTargetLesson37.css";

const INITIAL_TEMPLATE = "When x = {x}, the output 2x + 3 is {y}.";

export default function DynamicTextTargetLesson37({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [template, setTemplate] = useState(INITIAL_TEMPLATE);
  const [x, setX] = useState(2);
  const [tab, setTab] = useState(0);
  const [workspace, setWorkspace] = useState(false);
  const [shareState, setShareState] = useState("Share");
  const [extraVariable, setExtraVariable] = useState(false);
  const [actions, setActions] = useState(0);
  const editor = useRef<HTMLTextAreaElement>(null);
  const y = 2 * x + 3;
  const z = x + y;
  const placeholders = useMemo(
    () => Array.from(new Set(template.match(/\{[xyz]\}/g) ?? [])),
    [template],
  );
  const act = () => {
    setActions((value) => value + 1);
    onInteraction();
  };
  const reset = () => {
    setTemplate(INITIAL_TEMPLATE);
    setX(2);
    setTab(0);
    setWorkspace(false);
    setShareState("Share");
    setExtraVariable(false);
    setActions(0);
    onInteraction();
  };
  useEffect(() => {
    setTemplate(INITIAL_TEMPLATE);
    setX(2);
    setTab(0);
    setWorkspace(false);
    setShareState("Share");
    setExtraVariable(false);
    setActions(0);
  }, [resetToken]);
  const renderText = (value: number) =>
    template
      .replaceAll("{x}", String(value))
      .replaceAll("{y}", String(2 * value + 3))
      .replaceAll("{z}", String(3 * value + 3));
  const insert = (token: "{x}" | "{y}" | "{z}") => {
    const field = editor.current;
    const start = field?.selectionStart ?? template.length;
    const end = field?.selectionEnd ?? start;
    setTemplate(`${template.slice(0, start)}${token}${template.slice(end)}`);
    act();
    requestAnimationFrame(() => {
      field?.focus();
      field?.setSelectionRange(start + 3, start + 3);
    });
  };
  const share = async () => {
    try {
      await navigator.clipboard?.writeText(renderText(x));
      setShareState("Copied");
    } catch {
      setShareState("Ready");
    }
    act();
  };
  return (
    <div
      className="dynamic-text-page"
      data-testid="algebra-mockup-0037"
      data-dedicated-lesson="37"
      data-object-model="editable-placeholder-template-linked-affine-variable-live-preview-comparison-state-model"
      data-template={template}
      data-x={x}
      data-y={y}
      data-z={z}
      data-rendered={renderText(x)}
      data-placeholders={placeholders.join(",")}
      data-tab={tab}
      data-workspace={workspace}
      data-extra-variable={extraVariable}
      data-actions={actions}
      aria-label="Dynamic text"
    >
      <nav className="dynamic-breadcrumb">
        <a href="/">&larr;</a>
        <a href="/">Home</a>
        <span>&rsaquo;</span>
        <a href="/lessons">Lessons</a>
        <span>&rsaquo;</span>
        <a href="/lessons/core-workspaces">Core Workspaces</a>
        <span>&rsaquo;</span>
        <b>37 Dynamic Text</b>
      </nav>
      <header className="dynamic-header">
        <div>
          <h1>Dynamic Text</h1>
          <p>Explain live mathematical relationships.</p>
          <nav>
            <b>♙ Foundational-Advanced</b>
            <b>ϟ Exploration Lab</b>
            <b>▣ Algebra View</b>
            <b>◷ 6-10 min</b>
          </nav>
        </div>
        <aside>
          <button type="button" onClick={reset}>
            <RotateCcw />
            Reset
          </button>
          <button type="button" onClick={() => void share()}>
            <Share2 />
            {shareState}
          </button>
          <button
            type="button"
            className={workspace ? "active" : ""}
            onClick={() => {
              setWorkspace((value) => !value);
              act();
            }}
          >
            <ExternalLink />
            Workspace
          </button>
        </aside>
      </header>
      <nav className="dynamic-tabs">
        {[
          "Interaction + visualization",
          "Explain",
          "Examples",
          "Formulas",
          "Know more",
        ].map((label, index) => (
          <button
            type="button"
            className={tab === index ? "active" : ""}
            onClick={() => {
              setTab(index);
              act();
            }}
            key={label}
          >
            {["⊙", "▣", "♧", "Σ", "✣"][index]} {label}
          </button>
        ))}
      </nav>
      <main className="dynamic-layout">
        <section className="template-column">
          <section className="template-editor">
            <header>
              <div>
                <h2>1. Template editor &nbsp; ⓘ</h2>
                <p>Create text with live linked values.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setTemplate("");
                  act();
                }}
              >
                <Trash2 />
                Clear
              </button>
            </header>
            <div className="editor-box">
              <span>1</span>
              <div className="source-overlay" aria-hidden="true">
                <SourceTemplate template={template} />
              </div>
              <textarea
                ref={editor}
                aria-label="Dynamic text template"
                value={template}
                onChange={(event) => {
                  setTemplate(event.target.value);
                  act();
                }}
              />
              <span>2</span>
            </div>
            <p>
              Use &#123;x&#125;, &#123;y&#125;, or other linked values as
              placeholders.
            </p>
          </section>
          <section className="variables-card">
            <h2>Available variables</h2>
            <div>
              <button type="button" onClick={() => insert("{x}")}>
                <b>x</b>
                <small>Input value</small>
              </button>
              <button type="button" onClick={() => insert("{y}")}>
                <b>y</b>
                <small>Output (2x + 3)</small>
              </button>
              {extraVariable ? (
                <button type="button" onClick={() => insert("{z}")}>
                  <b>z</b>
                  <small>x + y</small>
                </button>
              ) : (
                <button
                  type="button"
                  className="add"
                  onClick={() => {
                    setExtraVariable(true);
                    act();
                  }}
                >
                  + Add variable
                </button>
              )}
            </div>
          </section>
        </section>
        <section className="preview-column">
          <section className="live-preview">
            <header>
              <div>
                <h2>2. Live preview (current)</h2>
                <p>Updates automatically as values change.</p>
              </div>
              <b>
                <i />
                Live
              </b>
            </header>
            <div className="rendered-text">
              <RenderedTemplate template={template} x={x} />
            </div>
            <div className="calculation">
              <b>Live calculation</b>
              <p>
                <i>y</i> = 2 (<strong>{x}</strong>) + 3 = <strong>{y}</strong>
              </p>
            </div>
          </section>
          <section className="another-preview">
            <h2>3. Another preview state</h2>
            <p>See how the text updates with a different value.</p>
            <div>
              <RenderedTemplate template={template} x={4} />
            </div>
            <strong>
              <i>y</i> = 2 (<b>4</b>) + 3 = <b>11</b>
            </strong>
          </section>
        </section>
        <aside className="value-column">
          <section className="values-card">
            <h2>4. Values</h2>
            <p>Control the linked values.</p>
            <label>
              <b>
                x <small>(input value)</small>
              </b>
              <input
                aria-label="Linked x drag control"
                type="range"
                min="-10"
                max="10"
                step="1"
                value={x}
                onChange={(event) => {
                  setX(Number(event.target.value));
                  act();
                }}
              />
              <span>
                <small>-10</small>
                <small>10</small>
              </span>
              <input
                aria-label="Linked x numeric value"
                type="number"
                min="-10"
                max="10"
                value={x}
                onChange={(event) => {
                  setX(Math.max(-10, Math.min(10, Number(event.target.value))));
                  act();
                }}
              />
            </label>
            <label>
              <b>
                y <small>(linked value)</small>
              </b>
              <small>Formula: y = 2x + 3</small>
              <output>{y}</output>
            </label>
          </section>
          <section className="placeholders-card">
            <h2>5. Placeholders used</h2>
            <p>These placeholders appear in your text.</p>
            <div>
              {placeholders.map((token) => (
                <button
                  type="button"
                  onClick={() => insert(token as "{x}" | "{y}" | "{z}")}
                  key={token}
                >
                  {token}
                </button>
              ))}
            </div>
          </section>
          <section className="linked-warning">
            <TriangleAlert />
            <p>
              <b>Use linked values,</b>
              <br />
              not typed fixed numbers.
            </p>
          </section>
        </aside>
      </main>
      <nav className="dynamic-navigation">
        <a href="/lessons/core-workspaces/36-boolean-variables">
          &larr;
          <span>
            <small>Previous</small>Boolean Variables
          </span>
        </a>
        <a href="/lessons/core-workspaces/38-latex-formula-display">
          <span>
            <small>Next</small>LaTeX Formula Display
          </span>
          &rarr;
        </a>
      </nav>
      <footer className="dynamic-footer">
        <h2>✣ Math Universe</h2>
        <p>
          Interactive math labs, visual proofs, NCERT explorations, graphing,
          CAS-style tools, and classroom-ready activities.
        </p>
        <nav>
          <button type="button" onClick={act}>
            ▣ Sitemap
          </button>
          <button type="button" onClick={act}>
            ⚑ Docs
          </button>
          <button type="button" onClick={act}>
            ✉ About
          </button>
        </nav>
        <hr />
        <small>
          © 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.
          <br />
          <br />
          www.IndianServers.com info@IndianServers.com
        </small>
      </footer>
    </div>
  );
}

function RenderedTemplate({ template, x }: { template: string; x: number }) {
  const values: Record<string, string> = {
    "{x}": String(x),
    "{y}": String(2 * x + 3),
    "{z}": String(3 * x + 3),
  };
  return (
    <span className="rendered-content">
      {template
        .split(/(\{[xyz]\})/g)
        .map((part, index) =>
          values[part] ? (
            <mark key={index}>{values[part]}</mark>
          ) : (
            <span key={index}>{part}</span>
          ),
        )}
    </span>
  );
}

function SourceTemplate({ template }: { template: string }) {
  return (
    <>
      {template.split(/(\{[xyz]\})/g).map((part, index) =>
        /^\{[xyz]\}$/.test(part) ? (
          <mark key={index}>{part}</mark>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  );
}
