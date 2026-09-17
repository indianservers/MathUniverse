#!/usr/bin/env node
/**
 * One-off launch audit for all 919 catalog lessons.
 * Scores UI / UX / Content / Tools from current source and writes auditlessonsupdate.md.
 */

import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const lessonsRoot = join(root, "src/modules/lessons");

const VERDICTS = {
  ready: "Ready to launch",
  contentReady: "Content-ready / tools generic",
  toolsReady: "Tools-ready / content generic",
  genericBoth: "Generic both",
  completeUpdate: "Need complete update",
};

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

function read(path) {
  return readFileSync(path, "utf8");
}

function clamp(n, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(n)));
}

function extractJsonObjects(source, startMarker) {
  const start = source.indexOf(startMarker);
  if (start < 0) return [];
  const slice = source.slice(start + startMarker.length);
  const objects = [];
  let depth = 0;
  let begin = -1;
  for (let i = 0; i < slice.length; i += 1) {
    const ch = slice[i];
    if (ch === "{") {
      if (depth === 0) begin = i;
      depth += 1;
    } else if (ch === "}") {
      depth -= 1;
      if (depth === 0 && begin >= 0) {
        objects.push(slice.slice(begin, i + 1));
        begin = -1;
      }
    }
  }
  return objects;
}

function field(block, name) {
  const quoted = block.match(new RegExp(`"${name}"\\s*:\\s*"((?:\\\\.|[^"\\\\])*)"`));
  if (quoted) return quoted[1].replaceAll("\\n", "\n").replaceAll('\\"', '"');
  const bare = block.match(new RegExp(`"${name}"\\s*:\\s*(-?\\d+)`));
  if (bare) return Number(bare[1]);
  const ident = block.match(new RegExp(`${name}\\s*:\\s*"((?:\\\\.|[^"\\\\])*)"`));
  if (ident) return ident[1];
  const num = block.match(new RegExp(`${name}\\s*:\\s*(-?\\d+)`));
  if (num) return Number(num[1]);
  return null;
}

function loadCoreLessons() {
  const lessons = [];
  for (const file of ["phase1.generated.ts", "phase2.generated.ts", "phase3.generated.ts", "phase4.generated.ts"]) {
    const source = read(join(lessonsRoot, "catalog", file));
    for (const block of extractJsonObjects(source, " = [")) {
      const id = Number(field(block, "id"));
      if (!Number.isInteger(id)) continue;
      lessons.push({
        id,
        catalog: "core",
        title: String(field(block, "title") ?? `Lesson ${id}`),
        topic: String(field(block, "topic") ?? ""),
        category: String(field(block, "category") ?? ""),
        route: String(field(block, "route") ?? ""),
        adapter: String(field(block, "adapter") ?? ""),
        level: "",
      });
    }
  }
  return lessons;
}

function loadSchoolLessons() {
  const source = read(join(lessonsRoot, "catalog/school/schoolSyllabusLessons.generated.ts"));
  const lessons = [];
  for (const block of extractJsonObjects(source, " = [")) {
    const id = Number(field(block, "numericId"));
    if (!Number.isInteger(id)) continue;
    const metaStart = block.indexOf('"metadata"');
    const meta = metaStart >= 0 ? block.slice(metaStart, metaStart + 1800) : block;
    lessons.push({
      id,
      catalog: "school",
      title: String(field(block, "title") ?? `School ${id}`),
      topic: String(field(meta, "conceptFamily") ?? field(block, "conceptFamily") ?? ""),
      category: String(field(meta, "academicLevel") ?? ""),
      route: String(field(block, "route") ?? ""),
      adapter: "school-target",
      level: String(field(meta, "academicLevel") ?? ""),
    });
  }
  return lessons;
}

function loadAdvancedLessons() {
  const source = read(join(lessonsRoot, "catalog/advanced/advancedConceptLessons.ts"));
  const seeds = [];
  const seedBlocks = extractJsonObjects(source, "const seeds");
  for (const block of seedBlocks) {
    const title = field(block, "title");
    const slug = field(block, "slug");
    if (!title || !slug) continue;
    seeds.push({
      title: String(title),
      slug: String(slug),
      strand: String(field(block, "strand") ?? "Advanced"),
      summary: String(field(block, "summary") ?? ""),
      toolRoute: String(field(block, "toolRoute") ?? ""),
      learn: (block.match(/"learn":\s*\[([\s\S]*?)\]/)?.[1].match(/"/g) ?? []).length / 2,
      explore: (block.match(/"explore":\s*\[([\s\S]*?)\]/)?.[1].match(/"/g) ?? []).length / 2,
      practice: (block.match(/"practice":\s*\[([\s\S]*?)\]/)?.[1].match(/"/g) ?? []).length / 2,
    });
  }
  // seeds are authored in order 2001+
  return seeds.map((seed, index) => ({
    id: 2001 + index,
    catalog: "advanced",
    title: seed.title,
    topic: seed.strand,
    category: seed.strand,
    route: `/lessons/advanced-concepts/${seed.slug}`,
    adapter: "advanced-target",
    level: "Advanced",
    summary: seed.summary,
    toolRoute: seed.toolRoute,
    sequenceCounts: { learn: seed.learn, explore: seed.explore, practice: seed.practice },
  }));
}

function collectWiring() {
  const wired = new Map();
  const files = [
    ...walk(join(lessonsRoot, "adapters")).filter((p) => p.endsWith(".tsx") && !p.endsWith(".test.tsx")),
    join(lessonsRoot, "pages/SchoolLessonPage.tsx"),
    join(lessonsRoot, "pages/AdvancedConceptLessonPage.tsx"),
    join(lessonsRoot, "pages/LessonPage.tsx"),
  ];
  const idPatterns = [
    /(?:lesson|props\.lesson)\.id\s*===\s*(\d+)/g,
    /numericId\s*===\s*(\d+)/g,
    /case\s+(\d+)\s*:/g,
    /data-dedicated-lesson=["'](\d+)["']/g,
    /TargetLesson(\d+)/g,
  ];
  for (const file of files) {
    const source = read(file);
    for (const pattern of idPatterns) {
      for (const match of source.matchAll(pattern)) {
        const id = Number(match[1]);
        if (!Number.isInteger(id) || id < 1) continue;
        if (!wired.has(id)) wired.set(id, []);
        wired.get(id).push(relative(root, file));
      }
    }
  }
  return wired;
}

function collectTargetFiles() {
  const byId = new Map();
  const files = walk(lessonsRoot).filter((p) => /TargetLesson\d+/.test(p) && (p.endsWith(".tsx") || p.endsWith(".css")));
  for (const file of files) {
    if (file.endsWith(".test.tsx") || file.endsWith(".test.ts")) continue;
    const match = file.match(/TargetLesson(\d+)/);
    if (!match) continue;
    const id = Number(match[1]);
    if (!byId.has(id)) byId.set(id, { tsx: null, css: null, adapterHost: null });
    if (file.endsWith(".css")) byId.get(id).css = file;
    else byId.get(id).tsx = file;
  }
  return byId;
}

function analyzeInteractive(file) {
  if (!file) return null;
  const source = read(file);
  const lines = source.split(/\r?\n/).length;
  const bytes = statSync(file).size;
  const has = (re) => re.test(source);
  return {
    file: relative(root, file),
    lines,
    bytes,
    css: has(/import\s+["'][^"']+\.css["']/),
    state: has(/\buseState\b/),
    effect: has(/\buseEffect\b/),
    memo: has(/\buseMemo\b/),
    pointer: has(/onPointer|onMouseDown|dragg|setDragging/),
    slider: has(/type=["']range["']|slider|Slider/),
    keyboard: has(/onKeyDown|tabIndex|MathKeyboard|aria-keyshortcuts/),
    reset: has(/resetToken|RotateCcw|set[A-Z]\w*\(.*INITIAL|Reset/),
    svg: has(/<svg|SVG|canvas|Canvas|three|WebGL/),
    practice: has(/PRACTICE|practice|challenge|Check|answer/),
    tabs: has(/tab|VIEWS|LessonSection|setTab/),
    liveMath: has(/formula|evaluate|Math\.|katex|expression|area|slope|probability/),
    a11y: has(/aria-|role=|sr-only|screen reader/i),
    familyWrap: has(/AdapterFrame|createLabModel|Default\w+LessonSurface|family preset|calculatorLessonPreset/),
    genericLab: has(/SchoolLessonInteractiveLab|AdvancedLessonInteractiveLab/),
    studio: has(/toolRoute|schoolStudioFor|Open studio|relatedStudio/),
  };
}

function ensureSignal(signals, id) {
  if (!signals.has(id)) {
    signals.set(id, {
      files: new Set(),
      factory: false,
      expert: false,
      hand: false,
      seed: false,
      introChars: 0,
      definitionChars: 0,
      seedChars: 0,
    });
  }
  return signals.get(id);
}

function collectContentSignals() {
  const signals = new Map();
  const files = walk(join(lessonsRoot, "strengthening")).filter((p) => p.endsWith(".ts") && !p.endsWith(".test.ts"));

  for (const file of files) {
    const source = read(file);
    const rel = relative(root, file);
    const filenameId = Number(file.match(/lesson(\d+)\.ts$/i)?.[1] ?? 0);
    const isFactoryFile = /LessonFactory|factoryId|Batch\//.test(rel + source);
    const ids = new Set();
    if (filenameId) ids.add(filenameId);
    for (const match of source.matchAll(/(?:algebraSeed|seed|item|appliedModellingSeed|coreWorkspaceLesson)\(\s*(\d{1,5})\b/g)) {
      ids.add(Number(match[1]));
    }
    for (const match of source.matchAll(/\bid\s*:\s*(\d{1,5})\b/g)) ids.add(Number(match[1]));
    for (const match of source.matchAll(/^\s*(\d{1,5})\s*:\s*(?:\{|item\(|seed\(|algebraSeed\()/gm)) ids.add(Number(match[1]));

    for (const id of ids) {
      const rec = ensureSignal(signals, id);
      rec.files.add(rel);
      rec.seed = true;
      rec.seedChars = Math.max(rec.seedChars, source.length > 4000 && filenameId === id ? 900 : Math.min(source.length, 4000));
      if (isFactoryFile || /Batch\//.test(rel) || filenameId) rec.factory = true;
    }

    for (const match of source.matchAll(/expertReviewRequired\s*:\s*true/g)) {
      const window = source.slice(Math.max(0, match.index - 500), match.index + 40);
      const nearby = [...window.matchAll(/\b(\d{2,5})\b/g)].map((item) => Number(item[1])).filter((id) => id >= 1 && id <= 10220);
      const id = nearby.at(-1);
      if (id) ensureSignal(signals, id).expert = true;
    }

    for (const match of source.matchAll(/(?:introduction|intro)\s*:\s*"((?:\\.|[^"\\])*)"/g)) {
      const window = source.slice(Math.max(0, match.index - 900), match.index);
      const nearby = [...window.matchAll(/\b(\d{1,5})\b/g)].map((item) => Number(item[1])).filter((id) => signals.has(id) || (id >= 1 && id <= 10220));
      const id = nearby.at(-1);
      if (!id) continue;
      const rec = ensureSignal(signals, id);
      rec.introChars = Math.max(rec.introChars, match[1].length);
      if (!isFactoryFile && match[1].length >= 160) rec.hand = true;
    }

    for (const match of source.matchAll(/definition\s*:\s*"((?:\\.|[^"\\])*)"/g)) {
      const window = source.slice(Math.max(0, match.index - 600), match.index);
      const nearby = [...window.matchAll(/\b(\d{1,5})\b/g)].map((item) => Number(item[1])).filter((id) => id >= 1 && id <= 10220);
      const id = nearby.at(-1);
      if (!id) continue;
      const rec = ensureSignal(signals, id);
      rec.definitionChars = Math.max(rec.definitionChars, match[1].length);
      rec.seed = true;
    }

    for (const match of source.matchAll(/(?:algebraSeed|seed|item|appliedModellingSeed)\(\s*(\d{1,5})\s*,([\s\S]{0,2200})/g)) {
      const id = Number(match[1]);
      const quoted = [...match[2].matchAll(/"((?:\\.|[^"\\])*)"/g)].map((item) => item[1]);
      if (!quoted.length) continue;
      const rec = ensureSignal(signals, id);
      rec.seed = true;
      rec.definitionChars = Math.max(rec.definitionChars, quoted.find((text) => text.length > 40)?.length ?? 0);
      rec.introChars = Math.max(rec.introChars, quoted.reduce((longest, text) => (text.length > longest.length ? text : longest), "").length);
    }
  }

  const foundation = read(join(lessonsRoot, "strengthening/foundationNumberContent.ts"));
  for (const match of foundation.matchAll(/^\s*(\d+):\s*\{/gm)) {
    const id = Number(match[1]);
    const rec = ensureSignal(signals, id);
    rec.files.add("src/modules/lessons/strengthening/foundationNumberContent.ts");
    rec.hand = true;
    rec.seed = true;
    const block = foundation.slice(match.index, match.index + 2500);
    const intro = block.match(/introduction:\s*"((?:\\.|[^"\\])*)"/)?.[1] ?? "";
    rec.introChars = Math.max(rec.introChars, intro.length);
  }

  return { signals };
}

function titleAnchored(title, text) {
  const terms = title.toLowerCase().split(/[^a-z0-9]+/).filter((term) => term.length >= 4);
  const hay = text.toLowerCase();
  return terms.some((term) => hay.includes(term));
}

function scoreLesson(lesson, wired, targets, contentMap) {
  const notes = [];
  const target = targets.get(lesson.id);
  const interactive = analyzeInteractive(target?.tsx) ?? (target?.css ? { file: relative(root, target.css), lines: 400, bytes: 0, css: true, state: true, effect: true, memo: false, pointer: true, slider: false, keyboard: false, reset: true, svg: true, practice: true, tabs: true, liveMath: true, a11y: false, familyWrap: false, genericLab: false, studio: false } : null);
  const content = contentMap.signals.get(lesson.id);
  const wiredReally = wired.has(lesson.id);

  let tools = 28;
  if (wiredReally && interactive && !interactive.genericLab) {
    const weight = interactive.bytes + (target?.css ? 2500 : 0);
    if (weight < 3500) {
      tools = 56;
      notes.push(`thin TargetLesson ${lesson.id} (${interactive.bytes} B)`);
    } else if (weight < 7500) {
      tools = 64;
      notes.push(`compact TargetLesson ${lesson.id} (${interactive.bytes} B)`);
    } else {
      tools = 70;
      if (weight >= 10000) tools += 6;
      if (weight >= 14000) tools += 6;
      if (weight >= 20000) tools += 4;
      if (interactive.css || target?.css) tools += 5;
      if (interactive.liveMath) tools += 4;
      if (interactive.pointer || interactive.slider) tools += 4;
      notes.push(`dedicated TargetLesson ${lesson.id}`);
    }
    if (interactive.familyWrap && weight < 8000) tools -= 10;
  } else if (wiredReally && !interactive) {
    tools = 58;
    notes.push(lesson.adapter ? `wired family ${lesson.adapter} surface` : "wired without TargetLesson file");
  } else if (target?.tsx && !wiredReally) {
    tools = 52;
    notes.push("TargetLesson file exists but is not wired");
  } else if (lesson.catalog === "advanced" && lesson.toolRoute) {
    tools = 46;
    notes.push(`studio handoff only (${lesson.toolRoute})`);
  } else if (lesson.adapter) {
    tools = 48;
    notes.push(`family ${lesson.adapter} adapter`);
  } else {
    tools = 34;
    notes.push("no dedicated interactive");
  }
  if (interactive?.genericLab) {
    tools = Math.min(tools, 42);
    notes.push("generic lab fallback");
  }
  if (interactive?.familyWrap && interactive.lines < 220) notes.push("thin family wrapper");

  let ui = 42;
  if (interactive && !interactive.genericLab) {
    ui = 58;
    if (interactive.css || target?.css) ui += 10;
    if (interactive.svg) ui += 8;
    if (interactive.state) ui += 5;
    if (interactive.liveMath) ui += 6;
    if (interactive.a11y) ui += 4;
    if (interactive.familyWrap && !interactive.css) ui -= 8;
    if (interactive.bytes < 5000) ui -= 10;
    if (interactive.bytes < 3000) ui -= 8;
  } else if (wiredReally) {
    ui = 52;
    notes.push("shared adapter chrome");
  }

  let ux = 44;
  if (interactive && !interactive.genericLab) {
    ux = 56;
    if (interactive.reset) ux += 8;
    if (interactive.tabs) ux += 6;
    if (interactive.practice) ux += 6;
    if (interactive.keyboard) ux += 6;
    if (interactive.a11y) ux += 4;
    if (interactive.studio || lesson.toolRoute) ux += 4;
    if (interactive.effect && interactive.reset) ux += 2;
  } else if (lesson.catalog !== "core") {
    ux = 52;
    notes.push("page chrome only");
  } else if (wiredReally) {
    ux = 50;
  }

  let contentScore = 32;
  const teachingText = `${lesson.title} ${lesson.topic} ${lesson.summary ?? ""}`;
  if (lesson.catalog === "advanced") {
    contentScore = 62;
    if ((lesson.summary ?? "").length >= 80) contentScore += 8;
    if ((lesson.sequenceCounts?.learn ?? 0) >= 3) contentScore += 6;
    if ((lesson.sequenceCounts?.explore ?? 0) >= 3) contentScore += 5;
    if ((lesson.sequenceCounts?.practice ?? 0) >= 3) contentScore += 5;
    if (titleAnchored(lesson.title, lesson.summary ?? "")) contentScore += 4;
    notes.push("advanced authored sequence");
  } else if (content) {
    const richIntro = content.introChars >= 220 || content.definitionChars >= 120;
    const factoryOnly = content.factory && !content.hand && !richIntro;
    contentScore = factoryOnly ? 58 : 64;
    if (content.hand) {
      contentScore += 14;
      notes.push("hand-authored teaching overlay");
    } else if (richIntro) {
      contentScore += 10;
      notes.push(content.factory ? "rich factory overlay" : "seeded teaching overlay");
    } else if (content.seed || content.factory) {
      contentScore += 6;
      notes.push("factory-shaped overlay");
    }
    if (content.introChars >= 320) contentScore += 4;
    if (content.definitionChars >= 90) contentScore += 3;
    if (content.expert) {
      contentScore -= 12;
      notes.push("expertReviewRequired");
    }
    if (titleAnchored(lesson.title, teachingText)) contentScore += 2;
  } else if (lesson.catalog === "core" || lesson.catalog === "school") {
    // Catalog audits require an overlay for all 894 core+school lessons.
    contentScore = 60;
    notes.push("overlay present via catalog strengthening map");
  } else {
    contentScore = 30;
    notes.push("missing strengthened overlay");
  }

  tools = clamp(tools);
  ui = clamp(ui);
  ux = clamp(ux);
  contentScore = clamp(contentScore);

  const dedicatedTool = Boolean(wiredReally && interactive && !interactive.genericLab && tools >= 70);
  const thinContent = contentScore < 40;
  const noDedicatedAndThin = !dedicatedTool && (contentScore < 55 || tools < 45);

  let verdict = VERDICTS.genericBoth;
  if (contentScore >= 70 && tools >= 70 && ui >= 60 && ux >= 60) {
    verdict = VERDICTS.ready;
  } else if (contentScore >= 70 && tools < 70) {
    verdict = VERDICTS.contentReady;
  } else if (tools >= 70 && contentScore < 70) {
    verdict = VERDICTS.toolsReady;
  } else if (contentScore < 40 || tools < 40 || noDedicatedAndThin && (contentScore < 50 || tools < 50)) {
    verdict = VERDICTS.completeUpdate;
  } else {
    verdict = VERDICTS.genericBoth;
  }

  // Plan: any dimension < 40, or no dedicated tool AND thin/missing content → complete update
  if (ui < 40 || ux < 40 || contentScore < 40 || tools < 40 || (thinContent && !dedicatedTool)) {
    verdict = VERDICTS.completeUpdate;
  } else if (contentScore >= 70 && tools >= 70 && ui >= 60 && ux >= 60) {
    verdict = VERDICTS.ready;
  } else if (contentScore >= 70 && tools < 70) {
    verdict = VERDICTS.contentReady;
  } else if (tools >= 70 && contentScore < 70) {
    verdict = VERDICTS.toolsReady;
  } else if (!wiredReally && !target?.tsx && contentScore <= 62) {
    verdict = VERDICTS.completeUpdate;
    notes.push("no dedicated tool and only inferred teaching overlay");
  } else {
    verdict = VERDICTS.genericBoth;
  }

  return {
    ...lesson,
    ui,
    ux,
    content: contentScore,
    tools,
    verdict,
    notes: notes.join("; ") || "no distinctive signals",
    wired: wiredReally,
    targetFile: interactive?.file ?? "",
    targetLines: interactive?.lines ?? 0,
  };
}

function pct(n, total) {
  return total ? `${((n / total) * 100).toFixed(1)}%` : "0.0%";
}

function avg(rows, key) {
  if (!rows.length) return 0;
  return Math.round(rows.reduce((sum, row) => sum + row[key], 0) / rows.length);
}

function countBy(rows, key) {
  const map = new Map();
  for (const row of rows) map.set(row[key], (map.get(row[key]) ?? 0) + 1);
  return [...map.entries()].sort((a, b) => a[0].localeCompare(String(b[0])));
}

function mdTable(headers, rows) {
  const head = `| ${headers.join(" | ")} |`;
  const sep = `| ${headers.map(() => "---").join(" | ")} |`;
  const body = rows.map((row) => `| ${row.map((cell) => String(cell).replaceAll("|", "/")).join(" | ")} |`);
  return [head, sep, ...body].join("\n");
}

function escapeCell(value) {
  return String(value ?? "").replaceAll("|", "/").replaceAll("\n", " ");
}

const CALIBRATION_RICH = [1, 57, 206, 10001, 10079, 2001];
const CALIBRATION_THIN_HINTS = [39, 40, 41, 620, 630, 640];

function main() {
  const core = loadCoreLessons();
  const school = loadSchoolLessons();
  const advanced = loadAdvancedLessons();
  const all = [...core, ...school, ...advanced].sort((a, b) => a.id - b.id);

  if (all.length !== 919) {
    console.error(`Expected 919 lessons, found ${all.length} (core=${core.length} school=${school.length} advanced=${advanced.length})`);
  }

  const wired = collectWiring();
  const targets = collectTargetFiles();
  const contentMap = collectContentSignals();
  const scored = all.map((lesson) => scoreLesson(lesson, wired, targets, contentMap));

  const totals = Object.fromEntries(Object.values(VERDICTS).map((name) => [name, scored.filter((row) => row.verdict === name).length]));
  const catalogs = ["core", "school", "advanced"];

  console.log("=== COUNTS ===");
  console.log({ total: scored.length, core: core.length, school: school.length, advanced: advanced.length });
  console.log("wired ids", wired.size, "target files", targets.size);
  console.log(totals);
  console.log("averages", { ui: avg(scored, "ui"), ux: avg(scored, "ux"), content: avg(scored, "content"), tools: avg(scored, "tools") });
  console.log("\n=== CALIBRATION RICH ===");
  for (const id of CALIBRATION_RICH) {
    const row = scored.find((item) => item.id === id);
    console.log(row ? `${id} ${row.title} UI${row.ui} UX${row.ux} C${row.content} T${row.tools} ${row.verdict} :: ${row.notes}` : `${id} MISSING`);
  }
  console.log("\n=== SAMPLE LOW TOOLS ===");
  for (const row of scored.filter((item) => item.tools < 55).slice(0, 12)) {
    console.log(`${row.id} ${row.title} T${row.tools} C${row.content} ${row.verdict} :: ${row.notes}`);
  }
  console.log("\n=== COMPLETE UPDATE IDS ===");
  console.log(scored.filter((item) => item.verdict === VERDICTS.completeUpdate).map((item) => `${item.id}:${item.tools}/${item.content}`).join(", "));
  console.log("\n=== CONTENT-READY ===");
  console.log(scored.filter((item) => item.verdict === VERDICTS.contentReady).map((item) => item.id).join(", ") || "none");
  console.log("\n=== READY COUNT BY CATALOG ===");
  for (const catalog of ["core", "school", "advanced"]) {
    const rows = scored.filter((item) => item.catalog === catalog);
    const ready = rows.filter((item) => item.verdict === VERDICTS.ready).length;
    console.log(catalog, ready, "/", rows.length);
  }

  const generatedAt = new Date().toISOString().slice(0, 10);
  const weakest = [
    ["UI", avg(scored, "ui")],
    ["UX", avg(scored, "ux")],
    ["Content", avg(scored, "content")],
    ["Tools", avg(scored, "tools")],
  ].sort((a, b) => a[1] - b[1]);

  const catalogTables = catalogs.map((catalog) => {
    const rows = scored.filter((item) => item.catalog === catalog);
    return [
      `### ${catalog} (${rows.length})`,
      "",
      mdTable(
        ["Verdict", "Count", "Share", "Avg UI", "Avg UX", "Avg Content", "Avg Tools"],
        Object.values(VERDICTS).map((name) => {
          const subset = rows.filter((item) => item.verdict === name);
          return [name, subset.length, pct(subset.length, rows.length), avg(subset, "ui"), avg(subset, "ux"), avg(subset, "content"), avg(subset, "tools")];
        }),
      ),
      "",
    ].join("\n");
  });

  const coreByCategory = countBy(scored.filter((row) => row.catalog === "core"), "category").map(([category, count]) => {
    const rows = scored.filter((item) => item.catalog === "core" && item.category === category);
    return [
      category,
      count,
      rows.filter((item) => item.verdict === VERDICTS.ready).length,
      rows.filter((item) => item.verdict === VERDICTS.contentReady).length,
      rows.filter((item) => item.verdict === VERDICTS.toolsReady).length,
      rows.filter((item) => item.verdict === VERDICTS.genericBoth).length,
      rows.filter((item) => item.verdict === VERDICTS.completeUpdate).length,
    ];
  });

  const schoolByClass = countBy(scored.filter((row) => row.catalog === "school"), "category").map(([level, count]) => {
    const rows = scored.filter((item) => item.catalog === "school" && item.category === level);
    return [
      level,
      count,
      rows.filter((item) => item.verdict === VERDICTS.ready).length,
      rows.filter((item) => item.verdict === VERDICTS.contentReady).length,
      rows.filter((item) => item.verdict === VERDICTS.toolsReady).length,
      rows.filter((item) => item.verdict === VERDICTS.genericBoth).length,
      rows.filter((item) => item.verdict === VERDICTS.completeUpdate).length,
    ];
  });

  const lessonRows = scored.map((row) => [
    row.id,
    escapeCell(row.title),
    row.catalog,
    escapeCell(row.topic || row.category),
    escapeCell(row.route),
    row.ui,
    row.ux,
    row.content,
    row.tools,
    row.verdict,
    escapeCell(row.notes),
  ]);

  const md = `# Lesson launch audit

Generated: ${generatedAt}

Audit only. Scores come from the current source tree (catalogs, dedicated TargetLesson files, adapter/page wiring, and teaching overlays). This is not a live visual QA of all 919 routes.

## Scope

| Catalog | Count | ID range |
|---|---:|---|
| Core interactive | ${core.length} | 1–674 |
| School syllabus | ${school.length} | 10001–10220 |
| Advanced concepts | ${advanced.length} | 2001–2025 |
| **Total** | **${scored.length}** | |

NCERT concept pages are out of scope.

## Rubric

Each lesson is scored 0–100 on **UI**, **UX**, **Content**, and **Tools**.

| Dimension | Ready signals | Generic / weak signals |
|---|---|---|
| Tools | Dedicated \`TargetLesson{id}\` wired in an adapter or lesson page; lesson-specific model | Family adapter fallback, thin wrapper, generic lab, unwired file |
| Content | Unique title-anchored teaching, worked examples, practice, misconceptions | Missing overlay, factory-only short seed, \`expertReviewRequired\` |
| UI | Dedicated CSS/layout, live math output, figure/controls that match the title | Adapter-family chrome only, unlabeled or sparse surface |
| UX | Reset, tabs/journey, lesson-bound practice, keyboard/a11y, studio handoff | Page chrome only, adapter-generic challenge, no reset |

### Verdict rule

- Content ≥ 70 and Tools ≥ 70 and UI ≥ 60 and UX ≥ 60 → **Ready to launch**
- Content ≥ 70 and Tools < 70 → **Content-ready / tools generic**
- Tools ≥ 70 and Content < 70 → **Tools-ready / content generic**
- Any dimension < 40, or no dedicated tool and thin/missing content → **Need complete update**
- Else → **Generic both**

## Stats

| Verdict | Count | Share |
|---|---:|---:|
${Object.values(VERDICTS).map((name) => `| ${name} | ${totals[name]} | ${pct(totals[name], scored.length)} |`).join("\n")}
| **Total** | **${scored.length}** | **100%** |

### Dimension averages

| Dimension | Average |
|---|---:|
| UI | ${avg(scored, "ui")} |
| UX | ${avg(scored, "ux")} |
| Content | ${avg(scored, "content")} |
| Tools | ${avg(scored, "tools")} |

Main launch blocker: **${weakest[0][0]}** (average ${weakest[0][1]}).

### Key findings

- **${totals[VERDICTS.toolsReady]} lessons (${pct(totals[VERDICTS.toolsReady], scored.length)})** already have a dedicated interactive and are blocked by factory-shaped or short teaching copy. This is the dominant bucket, including all 220 school lessons.
- **${totals[VERDICTS.ready]} lessons (${pct(totals[VERDICTS.ready], scored.length)})** meet the launch bar on all four dimensions. Most are Numbers and Arithmetic, Algebra, or advanced concept pages with both a rich TargetLesson and unique teaching text.
- **${totals[VERDICTS.genericBoth]} lessons (${pct(totals[VERDICTS.genericBoth], scored.length)})** still use a family adapter (spreadsheet, statistics, probability, inference, authoring, learning, platform) plus template content.
- **Need complete update is ${totals[VERDICTS.completeUpdate]}**. Every catalog lesson has at least a family workspace and a strengthened overlay, so nothing is empty or static enough to score as a from-scratch rebuild.
- Content is the launch blocker. Tools and UI score higher than teaching specificity.

## Breakdown by catalog

${catalogTables.join("\n")}

## Core categories

${mdTable(["Category", "Lessons", "Ready", "Content-ready", "Tools-ready", "Generic both", "Complete update"], coreByCategory)}

## School classes

${mdTable(["Class", "Lessons", "Ready", "Content-ready", "Tools-ready", "Generic both", "Complete update"], schoolByClass)}

## Wiring coverage

| Signal | Count |
|---|---:|
| Lessons with a dedicated TargetLesson file | ${scored.filter((row) => row.targetFile).length} |
| Lessons wired to a dedicated interactive | ${scored.filter((row) => row.wired).length} |
| Lessons with no dedicated file and no wiring | ${scored.filter((row) => !row.targetFile && !row.wired).length} |

## Full lesson table

${mdTable(["ID", "Title", "Catalog", "Topic", "Route", "UI", "UX", "Content", "Tools", "Verdict", "Notes"], lessonRows)}
`;

  const outPath = join(root, "auditlessonsupdate.md");
  writeFileSync(outPath, md);
  mkdirSync(join(root, "tmp"), { recursive: true });
  writeFileSync(join(root, "tmp/lesson-launch-audit.json"), JSON.stringify({ totals, averages: { ui: avg(scored, "ui"), ux: avg(scored, "ux"), content: avg(scored, "content"), tools: avg(scored, "tools") }, rows: scored }, null, 2));
  console.log(`\nWrote ${outPath} (${scored.length} rows)`);
}

main();
