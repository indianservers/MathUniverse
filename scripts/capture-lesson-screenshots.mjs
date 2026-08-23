import { build } from "esbuild";
import { chromium } from "playwright";
import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const projectRoot = process.cwd();
const outputRoot = process.argv.includes("--out")
  ? path.resolve(process.argv[process.argv.indexOf("--out") + 1])
  : "D:\\Math App Screenshots for UI Update";
const baseUrl = process.argv.includes("--base-url")
  ? process.argv[process.argv.indexOf("--base-url") + 1].replace(/\/$/, "")
  : "http://127.0.0.1:3536";
const limitArg = process.argv.find((arg) => arg.startsWith("--limit="));
const limit = limitArg ? Number.parseInt(limitArg.split("=")[1] ?? "", 10) : 0;
const force = process.argv.includes("--force");

const screenshotsDir = path.join(outputRoot, "desktop-full-page");
const manifestPath = path.join(outputRoot, "lesson-screenshot-manifest.json");
const summaryPath = path.join(outputRoot, "lesson-screenshot-summary.json");
const csvPath = path.join(outputRoot, "lesson-screenshot-manifest.csv");
const tempEntry = path.join(outputRoot, ".lesson-screenshot-catalog-entry.ts");
const tempBundle = path.join(outputRoot, ".lesson-screenshot-catalog-bundle.mjs");

function moduleSpecifier(...segments) {
  return path.join(projectRoot, ...segments).replaceAll("\\", "/");
}

function sanitize(value, fallback = "untitled") {
  const cleaned = String(value || fallback)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
  return (cleaned || fallback).slice(0, 92);
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

async function exists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function loadCatalog() {
  await mkdir(outputRoot, { recursive: true });
  const entry = `
    import { lessonCatalog } from "${moduleSpecifier("src/modules/lessons/catalog/lessonCatalog.ts")}";
    import { schoolLessonCatalog } from "${moduleSpecifier("src/modules/lessons/catalog/school/schoolSyllabusCatalog.ts")}";
    import { advancedConceptLessons } from "${moduleSpecifier("src/modules/lessons/catalog/advanced/advancedConceptLessons.ts")}";

    export const lessons = [
      ...lessonCatalog.map((lesson) => ({
        source: "interactive",
        id: lesson.id,
        numericId: lesson.id,
        title: lesson.title,
        route: lesson.route,
        class: lesson.level,
        topic: lesson.topic,
        category: lesson.category,
        categorySlug: lesson.categorySlug,
        subtopic: lesson.feature,
        adapter: lesson.adapter,
        estimatedMinutes: null,
      })),
      ...schoolLessonCatalog.map((lesson) => ({
        source: "school",
        id: lesson.id,
        numericId: lesson.numericId,
        title: lesson.title,
        route: lesson.route,
        class: lesson.metadata.academicLevel,
        topic: lesson.metadata.conceptFamily,
        category: "School Lessons",
        categorySlug: "school",
        subtopic: lesson.metadata.syllabusTags[0]?.chapter ?? lesson.metadata.conceptFamily,
        adapter: lesson.metadata.engineDependencies?.join("; ") ?? "",
        estimatedMinutes: lesson.metadata.estimatedMinutes,
      })),
      ...advancedConceptLessons.map((lesson) => ({
        source: "advanced",
        id: lesson.id,
        numericId: lesson.numericId,
        title: lesson.title,
        route: lesson.route,
        class: "Advanced",
        topic: lesson.strand,
        category: "Advanced Concept Lessons",
        categorySlug: "advanced-concepts",
        subtopic: lesson.strand,
        adapter: lesson.toolRoute,
        estimatedMinutes: lesson.estimatedMinutes,
      })),
    ];
  `;
  await writeFile(tempEntry, entry, "utf8");
  await build({
    entryPoints: [tempEntry],
    outfile: tempBundle,
    bundle: true,
    format: "esm",
    platform: "node",
    logLevel: "silent",
  });
  const imported = await import(`${pathToFileURL(tempBundle).href}?t=${Date.now()}`);
  await rm(tempEntry, { force: true });
  await rm(tempBundle, { force: true });
  return imported.lessons;
}

function withFileNames(lessons) {
  const seen = new Map();
  return lessons.map((lesson, index) => {
    const baseName = [
      String(index + 1).padStart(4, "0"),
      sanitize(lesson.source),
      sanitize(lesson.class),
      sanitize(lesson.topic),
      sanitize(lesson.title),
    ].join("-");
    const count = seen.get(baseName) ?? 0;
    seen.set(baseName, count + 1);
    const filename = `${baseName}${count ? `-${count + 1}` : ""}.png`;
    return {
      index: index + 1,
      ...lesson,
      url: `${baseUrl}${lesson.route}`,
      filename,
      screenshotPath: path.join(screenshotsDir, filename),
      status: "pending",
      capturedAt: null,
      error: null,
    };
  });
}

async function writeManifest(records) {
  const payload = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    viewport: { width: 1440, height: 1100, deviceScaleFactor: 1 },
    screenshotMode: "desktop full-page",
    total: records.length,
    captured: records.filter((record) => record.status === "captured" || record.status === "existing").length,
    failed: records.filter((record) => record.status === "failed").length,
    records,
  };
  await writeFile(manifestPath, JSON.stringify(payload, null, 2), "utf8");
  const csv = [
    ["index", "source", "id", "numericId", "title", "class", "topic", "subtopic", "category", "adapter", "route", "url", "filename", "screenshotPath", "status", "error"].join(","),
    ...records.map((record) => [
      record.index,
      record.source,
      record.id,
      record.numericId,
      record.title,
      record.class,
      record.topic,
      record.subtopic,
      record.category,
      record.adapter,
      record.route,
      record.url,
      record.filename,
      record.screenshotPath,
      record.status,
      record.error,
    ].map(csvCell).join(",")),
  ].join("\n");
  await writeFile(csvPath, csv, "utf8");
  await writeFile(summaryPath, JSON.stringify({
    generatedAt: payload.generatedAt,
    baseUrl,
    outputRoot,
    screenshotsDir,
    total: payload.total,
    captured: payload.captured,
    failed: payload.failed,
    bySource: records.reduce((acc, record) => {
      acc[record.source] ??= { total: 0, captured: 0, failed: 0 };
      acc[record.source].total += 1;
      if (record.status === "captured" || record.status === "existing") acc[record.source].captured += 1;
      if (record.status === "failed") acc[record.source].failed += 1;
      return acc;
    }, {}),
  }, null, 2), "utf8");
}

async function main() {
  await mkdir(screenshotsDir, { recursive: true });
  const allLessons = withFileNames(await loadCatalog());
  const records = Number.isFinite(limit) && limit > 0 ? allLessons.slice(0, limit) : allLessons;

  let existingManifest = null;
  if (await exists(manifestPath)) {
    try {
      existingManifest = JSON.parse(await readFile(manifestPath, "utf8"));
    } catch {
      existingManifest = null;
    }
  }
  const previousByRoute = new Map((existingManifest?.records ?? []).map((record) => [record.route, record]));
  for (const record of records) {
    const previous = previousByRoute.get(record.route);
    if (previous?.status === "captured" || previous?.status === "existing") {
      record.status = (await exists(previous.screenshotPath)) ? "existing" : "pending";
      record.capturedAt = previous.capturedAt;
      record.error = null;
    }
  }

  await writeManifest(records);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1100 },
    deviceScaleFactor: 1,
    colorScheme: "light",
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  page.setDefaultTimeout(45_000);
  page.setDefaultNavigationTimeout(60_000);

  for (const record of records) {
    if (!force && (record.status === "existing" || (await exists(record.screenshotPath)))) {
      record.status = "existing";
      record.error = null;
      await writeManifest(records);
      console.log(`[skip] ${record.index}/${records.length} ${record.title}`);
      continue;
    }
    try {
      console.log(`[capture] ${record.index}/${records.length} ${record.route}`);
      await page.goto(record.url, { waitUntil: "domcontentloaded", timeout: 60_000 });
      await page.waitForLoadState("networkidle", { timeout: 20_000 }).catch(() => undefined);
      await page.addStyleTag({
        content: `
          * { scroll-behavior: auto !important; animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; }
          .route-progress, [aria-label="Loading page"] { display: none !important; }
          button[aria-label*="Scroll"], .scroll-to-top { display: none !important; }
        `,
      }).catch(() => undefined);
      await page.evaluate(() => document.fonts?.ready).catch(() => undefined);
      await page.waitForTimeout(900);
      await page.screenshot({ path: record.screenshotPath, fullPage: true, type: "png", animations: "disabled", timeout: 60_000 });
      record.status = "captured";
      record.capturedAt = new Date().toISOString();
      record.error = null;
    } catch (error) {
      record.status = "failed";
      record.capturedAt = null;
      record.error = error instanceof Error ? error.message : String(error);
      console.error(`[failed] ${record.index}/${records.length} ${record.route}: ${record.error}`);
    }
    await writeManifest(records);
  }

  await browser.close();
  await writeManifest(records);
  const failed = records.filter((record) => record.status === "failed").length;
  console.log(`Done. ${records.length - failed}/${records.length} screenshots ready. Failed: ${failed}.`);
  console.log(`Manifest: ${manifestPath}`);
  console.log(`CSV: ${csvPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
