import { readdirSync, readFileSync } from "node:fs";
import { isAbsolute, join } from "node:path";

const root = process.cwd();
const manifestPath = join(root, "docs/lessons/lesson-strengthening-manifest.json");
const briefsRoot = join(root, "content/lesson-briefs");
const manifest = readJson(manifestPath);
const briefFiles = collectBriefFiles(briefsRoot);
const lessons = briefFiles.flatMap((file) => readJson(file).lessons.map((lesson) => ({ ...lesson, sourceFile: file })));
const errors = [];

if (manifest.totals.all !== 882) errors.push(`Manifest total must be 882, found ${manifest.totals.all}`);
if (manifest.totals.main !== 662) errors.push(`Main total must be 662, found ${manifest.totals.main}`);
if (manifest.totals.school !== 220) errors.push(`School total must be 220, found ${manifest.totals.school}`);
if (lessons.length !== manifest.totals.all) errors.push(`Brief count ${lessons.length} does not match manifest total ${manifest.totals.all}`);

const manifestRoutes = new Set(manifest.lessons.map((lesson) => lesson.route));
const briefRoutes = new Set(lessons.map((lesson) => lesson.route));
for (const route of manifestRoutes) {
  if (!briefRoutes.has(route)) errors.push(`Missing brief for ${route}`);
}
if (briefRoutes.size !== lessons.length) errors.push("Duplicate brief routes found");

for (const lesson of lessons) {
  for (const error of validateLesson(lesson)) {
    errors.push(`${lesson.route}: ${error}`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(JSON.stringify({
  manifest: manifest.totals,
  briefFiles: briefFiles.length,
  briefs: lessons.length,
  expertReview: lessons.filter((lesson) => lesson.expertReviewRequired).length,
  status: "valid",
}, null, 2));

function validateLesson(lesson) {
  const errors = [];
  for (const field of ["title", "route", "category", "topic", "introduction", "basicIdea", "howItWorks", "whyItWorks"]) {
    if (typeof lesson[field] !== "string" || !lesson[field].trim()) errors.push(`${field} is missing`);
  }
  if (!lesson.route?.startsWith("/lessons/")) errors.push("route must start with /lessons/");
  if (!lesson.learningObjectives?.length) errors.push("learningObjectives is empty");
  if (!lesson.interaction?.learningPurpose?.trim()) errors.push("interaction without learning purpose");
  if (!lesson.challenge?.successCriteria?.length) errors.push("challenge without success criteria");
  const practiceIds = lesson.practice?.map((item) => item.id) ?? [];
  if (new Set(practiceIds).size !== practiceIds.length) errors.push("duplicate practice IDs");
  for (const formula of lesson.formulas ?? []) {
    if (!formula.variables?.length) errors.push(`formula ${formula.id} has no variables`);
  }
  for (const representation of lesson.representations ?? []) {
    if (representation.graphDomain && representation.graphDomain[0] >= representation.graphDomain[1]) {
      errors.push(`invalid graph domain for ${representation.id}`);
    }
  }
  return errors;
}

function readJson(path) {
  return JSON.parse(readFileSync(isAbsolute(path) ? path : join(root, path), "utf8"));
}

function collectBriefFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) return collectBriefFiles(fullPath);
    return entry.name === "briefs.json" ? [fullPath] : [];
  });
}
