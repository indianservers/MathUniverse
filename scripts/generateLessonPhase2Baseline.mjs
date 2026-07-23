import { build } from "esbuild";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { stdout } from "node:process";
import { pathToFileURL } from "node:url";

const repositoryRoot = resolve(import.meta.dirname, "..");
const temporaryDirectory = await mkdtemp(join(tmpdir(), "lesson-phase2-audit-"));
const bundlePath = join(temporaryDirectory, "catalog.mjs");

try {
  await build({
    entryPoints: [resolve(repositoryRoot, "src/modules/lessons/catalog/lessonCatalog.ts")],
    outfile: bundlePath,
    bundle: true,
    platform: "node",
    format: "esm",
    logLevel: "silent",
  });
  const { lessonCatalog } = await import(`${pathToFileURL(bundlePath).href}?generated=${Date.now()}`);
  const adapterSources = await loadAdapterSources();
  const records = lessonCatalog.map((lesson) => auditLesson(lesson, adapterSources[lesson.adapter] ?? ""));
  const output = resolve(repositoryRoot, "docs/lessons/LESSON_PHASE_2_BASELINE_AUDIT.json");
  await writeFile(output, `${JSON.stringify(records, null, 2)}\n`, "utf8");
  stdout.write(`Wrote ${records.length} records to ${output}\n${JSON.stringify(summarize(records), null, 2)}\n`);
} finally {
  await rm(temporaryDirectory, { recursive: true, force: true });
}

async function loadAdapterSources() {
  const adapterFiles = {
    calculator: "Calculator", algebra: "Algebra", number: "Number", authoring: "Authoring", learning: "Learning", platform: "Platform",
    graph: "Graph", "algebra-cas": "AlgebraCas", geometry2d: "Geometry2D", vector: "Vector", trigonometry: "Trigonometry", cas: "Cas",
    calculus: "Calculus", spreadsheet: "Spreadsheet", statistics: "Statistics", probability: "Probability", inference: "Inference",
    sequence: "Sequence", matrix: "Matrix", complex: "Complex", geometry3d: "Geometry3D", discrete: "Discrete", finance: "Finance",
  };
  return Object.fromEntries(await Promise.all(Object.entries(adapterFiles).map(async ([adapter, file]) => [adapter, await readFile(resolve(repositoryRoot, `src/modules/lessons/adapters/${file}LessonAdapter.tsx`), "utf8")])));
}

function auditLesson(lesson, adapterSource) {
  const lessonSpecific = lesson.preset.specificity === "lesson";
  const metadataCallsForManipulation = /drag|move|construct|orbit|slice|fold|shade|trace|edit|select|add|draw|transform|animate|play|sort|filter/i.test(lesson.interactions);
  const adapterHasDrag = /kind:\s*["']drag["']|onPointer|onMouseMove|draggable/i.test(adapterSource);
  const adapterHasKeyboard = /onKeyDown|SliderControl|<input|<select|<button/i.test(adapterSource);
  const adapterHasDynamicSummary = /aria-live|role=["']status["']|aria-label=\{`|aria-label=\{/i.test(adapterSource);
  const priorityActivity = [359, 404, 443, 480, 576, 582, 583, 586, 587, 588, 589, 591].includes(lesson.id);
  const reasons = [];
  const requiredRemediation = [];

  if (!lessonSpecific) {
    reasons.push("Preset specificity is family; the lesson is not explicitly bound to a certified concept factory.");
    requiredRemediation.push("Resolve to a typed lesson- or concept-specific preset factory.");
  }
  if (!priorityActivity) {
    reasons.push("Rendered state is shared with other lessons in the adapter family.");
    reasons.push("Challenge generation falls through to adapter-level behavior rather than the active lesson model.");
    requiredRemediation.push("Bind visible controls, derived outputs, evidence, and challenge to this concept.");
  }
  if (metadataCallsForManipulation && !adapterHasDrag && !priorityActivity) {
    reasons.push("Workbook interaction metadata calls for manipulation or construction not implemented by this adapter surface.");
    requiredRemediation.push("Add pedagogically appropriate direct manipulation with keyboard and exact-value alternatives.");
  }
  if (!adapterHasDynamicSummary) {
    reasons.push("Adapter source has no verified dynamic mathematical screen-reader summary.");
    requiredRemediation.push("Announce the active mathematical state and observable output, not only control labels.");
  }
  reasons.push("Responsive, 200% zoom, persistence, reset assertions, and workspace state transfer are not yet route-certified in Phase 2.");
  requiredRemediation.push("Run and record route-level responsive, runtime, and workspace-handoff certification.");

  return {
    lessonId: lesson.id,
    route: lesson.route,
    title: lesson.title,
    category: lesson.category,
    topic: lesson.topic,
    adapter: lesson.adapter,
    preset: lesson.preset.id,
    presetSpecificity: lesson.preset.specificity,
    interactionStatus: priorityActivity ? "partial" : "generic",
    challengeStatus: priorityActivity ? "lesson-specific" : "family-generic",
    directManipulationStatus: metadataCallsForManipulation ? (adapterHasDrag || [404, 576].includes(lesson.id) ? "appropriate-and-present" : "appropriate-but-missing") : "not-required",
    keyboardStatus: priorityActivity || adapterHasKeyboard ? "partial" : "fail",
    responsiveStatus: "unverified",
    resetStatus: priorityActivity ? "pass" : "unverified",
    workspaceHandoffStatus: "partial",
    dynamicScreenReaderSummaryStatus: adapterHasDynamicSummary && priorityActivity ? "partial" : "missing",
    resetAssertionsStatus: priorityActivity ? "partial" : "unverified",
    secondRepresentationStatus: priorityActivity ? "meaningful" : "unverified-or-generic",
    workbookInteractionMatch: priorityActivity ? "partial" : "unverified",
    reasons: unique(reasons),
    requiredRemediation: unique(requiredRemediation),
  };
}

function summarize(records) {
  const count = (key, value) => records.filter((record) => record[key] === value).length;
  return {
    total: records.length,
    lessonSpecificPresets: count("presetSpecificity", "lesson"),
    familyPresets: count("presetSpecificity", "family"),
    partialInteractions: count("interactionStatus", "partial"),
    genericInteractions: count("interactionStatus", "generic"),
    lessonSpecificChallenges: count("challengeStatus", "lesson-specific"),
    familyGenericChallenges: count("challengeStatus", "family-generic"),
    directManipulationMissing: count("directManipulationStatus", "appropriate-but-missing"),
    fullyCertified: count("interactionStatus", "certified"),
  };
}

function unique(values) { return [...new Set(values)]; }
