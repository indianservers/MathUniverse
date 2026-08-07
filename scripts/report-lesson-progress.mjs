import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const manifest = JSON.parse(readFileSync(join(root, "docs/lessons/lesson-strengthening-manifest.json"), "utf8"));
const reportPath = join(root, "docs/lessons/PHASE_1_LESSON_STRENGTHENING_PROGRESS_REPORT.md");
const lessons = manifest.lessons;
const byStatus = countBy(lessons, "status");
const byCategory = countBy(lessons.filter((lesson) => lesson.catalog === "main"), "category");
const bySchoolLevel = countBy(lessons.filter((lesson) => lesson.catalog === "school"), "academicLevel");

const report = `# Phase 1 Lesson Strengthening Progress Report

Generated: 2026-08-06

## Totals

- Audited lessons represented: ${manifest.totals.all}
- Main lessons represented: ${manifest.totals.main}
- School lessons represented: ${manifest.totals.school}
- Expert-review queue: ${lessons.filter((lesson) => lesson.expertReviewRequired).length}

## Status Counts

${table("Status", "Lessons", byStatus)}

## Main Category Counts

${table("Category", "Lessons", byCategory)}

## School Level Counts

${table("School level", "Lessons", bySchoolLevel)}

## Phase 1 Decision

Keep the current lesson shell, route mapping, adapters, and renderer stack. Add route-keyed structured content and validation before replacing live copy. Phase 2 should begin with five Foundation Numbers and Arithmetic lessons, then expand by family.
`;

writeFileSync(reportPath, report, "utf8");
console.log(JSON.stringify({ reportPath, total: manifest.totals.all }, null, 2));

function countBy(items, key) {
  return Object.fromEntries(Object.entries(items.reduce((acc, item) => {
    const value = item[key] ?? "unknown";
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {})).sort(([a], [b]) => a.localeCompare(b)));
}

function table(left, right, data) {
  return [`| ${left} | ${right} |`, "|---|---:|", ...Object.entries(data).map(([key, value]) => `| ${key} | ${value} |`)].join("\n");
}
