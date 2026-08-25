import katex from "katex";
import {
  CheckCircle2,
  Copy,
  ExternalLink,
  Info,
  RotateCcw,
  Share2,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { LessonAdapterProps } from "../types";
import "./LatexFormulaTargetLesson38.css";

const sourceFor = (exponent: number) => `x^{${exponent}}+3x+2`;
const INITIAL = sourceFor(2);
const LIBRARY = [
  { name: "Fraction", source: "\\frac{a}{b}" },
  { name: "Square root", source: "\\sqrt{x}" },
  { name: "Integral", source: "\\int_{a}^{b} f(x)\\,dx" },
];

function analyze(source: string) {
  const stack = [] as string[];
  for (const char of source) {
    if (char === "{") stack.push(char);
    if (char === "}" && !stack.pop())
      return {
        balanced: false,
        valid: false,
        html: "",
        error: "Unexpected closing brace",
      };
  }
  const balanced = stack.length === 0;
  try {
    const html = katex.renderToString(source, {
      displayMode: true,
      throwOnError: true,
      strict: false,
    });
    return {
      balanced,
      valid: balanced,
      html,
      error: balanced ? "" : "Missing closing brace",
    };
  } catch (error) {
    return {
      balanced,
      valid: false,
      html: "",
      error: error instanceof Error ? error.message : "Invalid LaTeX",
    };
  }
}

export default function LatexFormulaTargetLesson38({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [source, setSource] = useState(INITIAL);
  const [exponent, setExponent] = useState(2);
  const [workspace, setWorkspace] = useState(false);
  const [shareState, setShareState] = useState("Share");
  const [copyState, setCopyState] = useState("Copy LaTeX");
  const [libraryExpanded, setLibraryExpanded] = useState(false);
  const [actions, setActions] = useState(0);
  const editor = useRef<HTMLTextAreaElement>(null);
  const report = useMemo(() => analyze(source), [source]);
  const exponentMatch = source.match(/x\^\{([^{}]+)\}/);
  const exponentDetected = Boolean(exponentMatch);
  const plusSpaced = !/\+\s{2,}/.test(source);
  const act = () => {
    setActions((value) => value + 1);
    onInteraction();
  };
  const reset = () => {
    setSource(INITIAL);
    setExponent(2);
    setWorkspace(false);
    setShareState("Share");
    setCopyState("Copy LaTeX");
    setLibraryExpanded(false);
    setActions(0);
    onInteraction();
  };
  useEffect(() => {
    setSource(INITIAL);
    setExponent(2);
    setWorkspace(false);
    setShareState("Share");
    setCopyState("Copy LaTeX");
    setLibraryExpanded(false);
    setActions(0);
  }, [resetToken]);
  const changeExponent = (value: number) => {
    const next = Math.max(1, Math.min(10, Math.round(value)));
    setExponent(next);
    setSource(sourceFor(next));
    act();
  };
  const changeSource = (next: string) => {
    setSource(next);
    const match = next.match(/x\^\{(\d+)\}/);
    if (match) setExponent(Math.max(1, Math.min(10, Number(match[1]))));
    act();
  };
  const insert = (snippet: string) => {
    const field = editor.current;
    const start = field?.selectionStart ?? source.length;
    const end = field?.selectionEnd ?? start;
    changeSource(`${source.slice(0, start)}${snippet}${source.slice(end)}`);
    requestAnimationFrame(() => {
      field?.focus();
      field?.setSelectionRange(start + snippet.length, start + snippet.length);
    });
  };
  const copy = async (kind: "copy" | "share") => {
    try {
      await navigator.clipboard?.writeText(source);
      if (kind === "copy") setCopyState("Copied");
      else setShareState("Copied");
    } catch {
      if (kind === "copy") setCopyState("Ready");
      else setShareState("Ready");
    }
    act();
  };
  return (
    <div
      className="latex-page"
      data-testid="algebra-mockup-0038"
      data-dedicated-lesson="38"
      data-object-model="editable-katex-source-exponent-group-slider-validation-comparison-library-insertion-model"
      data-source={source}
      data-exponent={exponent}
      data-valid={report.valid}
      data-balanced={report.balanced}
      data-exponent-detected={exponentDetected}
      data-plus-spaced={plusSpaced}
      data-workspace={workspace}
      data-library-expanded={libraryExpanded}
      data-actions={actions}
      aria-label="LaTeX display"
    >
      <nav className="latex-breadcrumb">
        <a href="/">&larr;</a>
        <a href="/">Home</a>
        <span>&rsaquo;</span>
        <a href="/lessons">Lessons</a>
        <span>&rsaquo;</span>
        <a href="/lessons/core-workspaces">Core Workspaces</a>
        <span>&rsaquo;</span>
        <b>38 Latex Formula Display</b>
      </nav>
      <section className="latex-shell">
        <header className="latex-header">
          <div>
            <nav>
              <b>CORE WORKSPACES</b>
              <b>ALGEBRA AND DYNAMIC VARIABLES</b>
            </nav>
            <h1>LaTeX Formula Display</h1>
            <p>Present professional notation.</p>
            <aside>
              <b>♙ Foundational-Advanced</b>
              <b>ϟ Exploration Lab</b>
              <b>▣ Algebra View / Input Bar</b>
              <b>◷ 6-10 min</b>
            </aside>
          </div>
          <menu>
            <button type="button" onClick={reset}>
              <RotateCcw />
              Reset
            </button>
            <button type="button" onClick={() => void copy("share")}>
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
          </menu>
        </header>
        <main className="latex-layout">
          <section className="source-card">
            <header>
              <h2>SOURCE LaTeX &nbsp; ⓘ</h2>
              <b>LaTeX syntax</b>
            </header>
            <div className="source-editor">
              <span>1</span>
              <textarea
                ref={editor}
                aria-label="LaTeX source"
                value={source}
                onChange={(event) => changeSource(event.target.value)}
              />
            </div>
            <footer>
              <span>
                <Info />
                Use ^&#123; &#125; for exponents. Example: x^&#123;2&#125;
              </span>
              <b>
                <CheckCircle2 />
                Autosaved
              </b>
            </footer>
          </section>
          <section className="render-card">
            <h2>RENDERED PREVIEW</h2>
            <div className={report.valid ? "formula-output" : "formula-error"}>
              {report.valid ? (
                <span dangerouslySetInnerHTML={{ __html: report.html }} />
              ) : (
                <>
                  <b>Syntax needs attention</b>
                  <small>{report.error}</small>
                </>
              )}
            </div>
            {report.valid && source.startsWith("x^{") ? (
              <p>
                <span>︸</span>
                <b>exponent group</b>
              </p>
            ) : null}
          </section>
          <aside className="latex-side">
            <section className="exponent-card">
              <h2>EXPONENT CONTROLS &nbsp; ⓘ</h2>
              <label>
                <span>
                  Exponent <b>{exponent}</b>
                </span>
                <input
                  aria-label="Exponent drag control"
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={exponent}
                  onChange={(event) =>
                    changeExponent(Number(event.target.value))
                  }
                />
                <small>
                  <i>1</i>
                  <i>10</i>
                </small>
                <input
                  aria-label="Exponent numeric value"
                  type="number"
                  min="1"
                  max="10"
                  value={exponent}
                  onChange={(event) =>
                    changeExponent(Number(event.target.value))
                  }
                />
              </label>
            </section>
            <section className="snippet-card">
              <h2>RENDERED SOURCE SNIPPETS</h2>
              <Snippet source="x^{2}" />
              <Snippet source="x^{10}" />
            </section>
            <section className="quick-card">
              <h2>QUICK ACTIONS</h2>
              <button type="button" onClick={() => void copy("copy")}>
                <Copy />
                <b>{copyState}</b>
                <small>Copy source to clipboard</small>
              </button>
            </section>
            <section className="validation-card">
              <h2>VALIDATION STATUS</h2>
              <div className={report.valid ? "valid" : "invalid"}>
                <b>{report.valid ? "✓ Syntax valid" : "! Syntax invalid"}</b>
                <p>{report.valid ? "Preview before sharing." : report.error}</p>
              </div>
            </section>
          </aside>
          <section className="grouping-card">
            <h2>GROUPING COMPARISON &nbsp; ⓘ</h2>
            <div>
              <article>
                <b>Without braces</b>
                <p>x^10 &nbsp;→&nbsp; x¹⁰</p>
                <small>Interpreted as x¹0 (not x¹⁰).</small>
              </article>
              <i>vs</i>
              <article>
                <b>With braces</b>
                <p>x^&#123;10&#125; &nbsp;→&nbsp; x¹⁰</p>
                <small>Braces keep multi-character exponents together.</small>
              </article>
            </div>
            <footer>
              <Info />
              <b>Braces keep multi-character exponents together.</b>
              <code>x^&#123;10&#125; -&gt; x¹⁰</code>
            </footer>
          </section>
          <section className="checklist-card">
            <h2>SYNTAX CHECKLIST</h2>
            {[
              [report.balanced, "braces balanced"],
              [exponentDetected, "exponent detected"],
              [plusSpaced, "plus signs spaced"],
              [report.valid, "preview ready"],
            ].map(([good, label]) => (
              <p className={good ? "good" : "bad"} key={String(label)}>
                <CheckCircle2 />
                <span>{label}</span>
                <b>{good ? "Good" : "Fix"}</b>
              </p>
            ))}
            <footer>
              <Info />
              Preview before sharing.
            </footer>
          </section>
          <section className="library-card">
            <header>
              <div>
                <h2>FORMULA LIBRARY</h2>
                <p>Insert common structures to build formulas faster.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setLibraryExpanded((value) => !value);
                  act();
                }}
              >
                {libraryExpanded ? "Show essentials" : "View all structures"}{" "}
                &nbsp;→
              </button>
            </header>
            <div>
              {LIBRARY.map((item) => (
                <article key={item.name}>
                  <b>{item.name}</b>
                  <code>{item.source}</code>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: analyze(item.source).html,
                    }}
                  />
                  <button type="button" onClick={() => insert(item.source)}>
                    Insert
                  </button>
                </article>
              ))}
            </div>
            {libraryExpanded ? (
              <p className="library-extra">
                Also supported: sums, limits, matrices, vectors, accents, and
                aligned equations.
              </p>
            ) : null}
          </section>
        </main>
        <nav className="latex-navigation">
          <a href="/lessons/core-workspaces/37-dynamic-text">
            &larr;
            <span>
              <small>Previous</small>Dynamic Text
            </span>
          </a>
          <a href="/lessons/symbolic-mathematics/428-symbol-substitution">
            <span>
              <small>Next</small>Symbol Substitution
            </span>
            &rarr;
          </a>
        </nav>
      </section>
      <footer className="latex-footer">
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

function Snippet({ source }: { source: string }) {
  const html = analyze(source).html;
  return (
    <p>
      <code>{source}</code>
      <b>→</b>
      <span dangerouslySetInnerHTML={{ __html: html }} />
    </p>
  );
}
