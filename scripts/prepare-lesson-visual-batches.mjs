import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const matrixPath = "docs/lessons/ecosystem/LESSON_CLASSIFICATION_MATRIX.csv";
const outputDir = "docs/lessons/visual-preset-batches";
const batchSize = 30;

function parseCsv(text) {
  const rows = [];
  let current = "";
  let row = [];
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (char === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
      continue;
    }
    if (char === '"') {
      quoted = !quoted;
      continue;
    }
    if (char === "," && !quoted) {
      row.push(current);
      current = "";
      continue;
    }
    if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(current);
      if (row.some((cell) => cell.length)) rows.push(row);
      row = [];
      current = "";
      continue;
    }
    current += char;
  }
  if (current.length || row.length) {
    row.push(current);
    rows.push(row);
  }
  const [headers, ...dataRows] = rows;
  return dataRows.map((dataRow) => Object.fromEntries(headers.map((header, index) => [header, dataRow[index] ?? ""])));
}

function priorityScore(record) {
  let score = 0;
  if (record.catalog === "core") score += 20;
  if (record.mainTopic === "Calculus") score += 1000;
  if (record.mainTopic === "Graphs and Functions") score += 900;
  const engine = targetVisualEngine(record);
  if (engine === "graph-2d") score += 90;
  if (engine === "geometry-2d") score += 70;
  if (engine === "cas-data") score += 50;
  if (record.currentPresetSpecificity === "family") score += 60;
  if (record.priority === "P0") score += 40;
  if (record.newPrimaryType === "visual-proof") score += 35;
  if (/local|global|extrema|critical|increasing|decreasing|concavity|inflection|limit|derivative|tangent/i.test(record.title)) score += 25;
  return score;
}

function targetVisualEngine(record) {
  if (record.currentAdapter === "calculus") return "graph-2d";
  if (record.currentAdapter === "graph") return "graph-2d";
  if (record.currentAdapter === "geometry2d" || record.currentAdapter === "vector") return "geometry-2d";
  if (record.currentAdapter === "geometry3d") return /surface|contour|gradient|tangent plane|partial|multivariable|double integral/i.test(record.title) ? "graph-3d" : "geometry-3d";
  if (record.currentAdapter === "cas" || record.currentAdapter === "algebra-cas") return "cas-data";
  return record.engine;
}

function visualGoal(record) {
  const engine = targetVisualEngine(record);
  if (engine === "graph-2d") return `Create a lesson-specific 2D graph preset for ${record.title}: exact expression, viewport, draggable points, highlighted measurements, CAS overlay, and output labels.`;
  if (engine === "graph-3d") return `Create a lesson-specific 3D graph preset for ${record.title}: surface/curve equation, camera, sections, contours, and measurements.`;
  if (engine === "geometry-2d") return `Create a theorem or construction-specific 2D geometry scene for ${record.title}: fixed objects, movable objects, invariants, and validation.`;
  if (engine === "geometry-3d") return `Create a spatial scene for ${record.title}: solid/surface state, measurements, camera, and draggable controls.`;
  if (engine === "cas-data") return `Create a CAS/Data preset for ${record.title}: expression/data state, exact operation, assumptions, outputs, and approximation policy.`;
  return `Record why ${record.title} does not need a mathematical engine, or map it to one if that is wrong.`;
}

function batch(records, size) {
  const batches = [];
  for (let index = 0; index < records.length; index += size) batches.push(records.slice(index, index + size));
  return batches;
}

function mdTable(records) {
  const headers = ["#", "lessonId", "title", "topic", "engine", "route", "visualGoal"];
  const lines = [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
  ];
  records.forEach((record, index) => {
    lines.push(`| ${index + 1} | ${record.lessonId} | ${record.title.replace(/\|/g, "\\|")} | ${record.subtopic.replace(/\|/g, "\\|")} | ${targetVisualEngine(record)} | ${record.route} | ${visualGoal(record).replace(/\|/g, "\\|")} |`);
  });
  return lines.join("\n");
}

const matrix = parseCsv(readFileSync(matrixPath, "utf8"));
const candidates = matrix
  .filter((record) => record.engine !== "none")
  .map((record) => ({ ...record, score: priorityScore(record) }))
  .sort((a, b) => b.score - a.score || Number(a.lessonId) - Number(b.lessonId));

const batches = batch(candidates, batchSize);
mkdirSync(outputDir, { recursive: true });

const summaryRows = batches.map((items, index) => ({
  id: `visual-batch-${String(index + 1).padStart(2, "0")}`,
  count: items.length,
  firstLesson: items[0]?.lessonId ?? "",
  focus: items.slice(0, 5).map((item) => item.mainTopic).join(", "),
}));

writeFileSync(
  join(outputDir, "README.md"),
  `# Lesson-Specific Visual Preset Batches\n\nPrepared from ${matrixPath}.\n\n## Batch Rules\n\n- Start only when the user says \`start\`.\n- Work in batches of ${batchSize} lessons.\n- Use existing engines only: 2D Graph, 3D Graph, 2D Geometry, 3D Geometry, CAS/Data.\n- Each lesson must receive an exact preset goal before implementation.\n- Run typecheck, touched-file lint, and representative browser smoke tests before moving to the next batch.\n- Do not bulk-generate generic visuals.\n\n## Queue Summary\n\n| Batch | Lessons | First lesson | Focus sample |\n| --- | ---: | --- | --- |\n${summaryRows.map((row) => `| ${row.id} | ${row.count} | ${row.firstLesson} | ${row.focus} |`).join("\n")}\n`,
);

for (const [index, items] of batches.entries()) {
  const batchId = `visual-batch-${String(index + 1).padStart(2, "0")}`;
  writeFileSync(
    join(outputDir, `${batchId}.md`),
    `# ${batchId}\n\nStatus: prepared, not started.\n\n${mdTable(items)}\n\n## Completion Gate\n\n- Exact visual preset implemented for every row.\n- No repeated fallback graph unless mathematically justified in notes.\n- Route smoke test confirms each lesson renders a distinct visual state.\n- Browser visual spot-check completed for representative desktop and mobile widths.\n- Accessibility summary names the actual mathematical object.\n`,
  );
}

console.log(`Prepared ${batches.length} visual preset batches for ${candidates.length} engine-backed lessons.`);
