import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const manifestPath = join(root, "docs/lessons/lesson-strengthening-manifest.json");
const reportPath = join(root, "docs/lessons/GENERIC_CONTENT_BASELINE_REPORT.md");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

const bannedPhrases = [
  "This concept helps us understand mathematics.",
  "Move the controls and observe what happens.",
  "Try different values to explore the idea.",
  "This is useful in real life.",
  "Complete the challenge using the tools.",
  "The visual shows another representation.",
  "Think carefully and find the answer.",
  "small experiment",
  "watch the output",
  "connects it to an interactive representation",
  "syllabus gap",
];

const sourceFiles = [
  "src/modules/lessons/engine/lessonContent.ts",
  "src/modules/lessons/engine/lessonRuntime.ts",
  "src/modules/lessons/engine/lessonContracts.ts",
  "src/modules/lessons/catalog/school/schoolSyllabusLessons.generated.ts",
  "src/modules/lessons/pages/SchoolLessonPage.tsx",
];

const matches = [];
for (const file of sourceFiles) {
  const text = readFileSync(join(root, file), "utf8");
  const lines = text.split(/\r?\n/);
  lines.forEach((line, index) => {
    for (const phrase of bannedPhrases) {
      if (line.toLowerCase().includes(phrase.toLowerCase())) {
        matches.push({ file, line: index + 1, phrase, text: line.trim() });
      }
    }
  });
}

const report = `# Generic Content Baseline Report

Generated: 2026-08-06

## Baseline Counts

- Original audited lessons needing strengthening: ${manifest.totals.all}
- Main catalog generic lessons: ${manifest.totals.main}
- School syllabus template lessons: ${manifest.totals.school}
- Source-level generic phrase matches: ${matches.length}

## Meaning

This is a Phase 1 baseline. It does not claim the lessons are strengthened. It records where generic copy currently enters so Phase 2 can remove it by lesson family.

## Matched Source Phrases

| Source file | Line | Matched phrase | Recommended fix |
|---|---:|---|---|
${matches.map((match) => `| ${match.file} | ${match.line} | ${escapePipe(match.phrase)} | Replace with validated route-keyed lesson content or lesson-specific generator output. |`).join("\n")}

## Remaining Routes

All ${manifest.totals.all} audited routes remain pending until Phase 2 content and Phase 3 verification are complete.
`;

writeFileSync(reportPath, report, "utf8");
console.log(JSON.stringify({ matches: matches.length, reportPath }, null, 2));

function escapePipe(value) {
  return String(value).replace(/\|/g, "\\|");
}
