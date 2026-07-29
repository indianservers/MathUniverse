import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const outFile = "tmp/lesson-audit-data.json";

function loadModule(path) {
  execFileSync("npx", ["tsx", "tmp/export-lesson-audit-data.ts"], { stdio: "inherit", shell: true });
  return JSON.parse(readFileSync(path, "utf8"));
}

function countBy(items, selector) {
  const counts = {};
  for (const item of items) {
    const key = selector(item);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)));
}

function duplicates(items, selector) {
  const seen = new Map();
  const dupes = [];
  for (const item of items) {
    const key = selector(item);
    if (seen.has(key)) dupes.push(key);
    seen.set(key, true);
  }
  return [...new Set(dupes)];
}

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function coreIssues(lessons) {
  const issues = [];
  for (const lesson of lessons) {
    const prefix = `core:${lesson.id}:${lesson.title}`;
    if (!hasText(lesson.route) || !lesson.route.startsWith("/lessons/")) issues.push(`${prefix} has invalid route`);
    if (!hasText(lesson.slug) || !lesson.route.endsWith(lesson.slug)) issues.push(`${prefix} route does not end with slug`);
    if (!hasText(lesson.title)) issues.push(`${prefix} missing title`);
    if (!hasText(lesson.purpose)) issues.push(`${prefix} missing purpose`);
    if (!hasText(lesson.description)) issues.push(`${prefix} missing description`);
    if (!hasText(lesson.content?.summary)) issues.push(`${prefix} missing content.summary`);
    if (!hasText(lesson.content?.explanation)) issues.push(`${prefix} missing content.explanation`);
    if ((lesson.content?.keyIdeas?.length ?? 0) < 3) issues.push(`${prefix} has fewer than 3 key ideas`);
    if ((lesson.content?.controlGuide?.length ?? 0) < 2) issues.push(`${prefix} has fewer than 2 control guide items`);
    if ((lesson.content?.formulas?.length ?? 0) < 1) issues.push(`${prefix} has no formula card`);
    for (const formula of lesson.content?.formulas ?? []) {
      if (!hasText(formula.label) || !hasText(formula.expression) || !hasText(formula.explanation)) issues.push(`${prefix} has incomplete formula metadata`);
    }
    if (!lesson.contract?.requiredControls?.length) issues.push(`${prefix} has no required controls`);
    if (!lesson.contract?.observableOutputs?.length) issues.push(`${prefix} has no observable outputs`);
    if (!lesson.contract?.screenReaderSummary) issues.push(`${prefix} has no screen reader summary`);
    if (!lesson.preset?.adapter) issues.push(`${prefix} has no resolved preset adapter`);
  }
  return issues;
}

function schoolIssues(lessons) {
  const issues = [];
  for (const lesson of lessons) {
    const prefix = `school:${lesson.id}:${lesson.title}`;
    if (!hasText(lesson.route) || !lesson.route.startsWith("/lessons/school/")) issues.push(`${prefix} has invalid route`);
    if (!hasText(lesson.content?.summary)) issues.push(`${prefix} missing summary`);
    if ((lesson.content?.learn?.length ?? 0) < 3) issues.push(`${prefix} has fewer than 3 learn items`);
    if ((lesson.content?.explore?.length ?? 0) < 3) issues.push(`${prefix} has fewer than 3 explore items`);
    if ((lesson.content?.practice?.length ?? 0) < 3) issues.push(`${prefix} has fewer than 3 practice items`);
    if ((lesson.content?.assessmentPrompts?.length ?? 0) < 2) issues.push(`${prefix} has fewer than 2 assessment prompts`);
    if ((lesson.metadata?.learningObjectives?.length ?? 0) < 3) issues.push(`${prefix} has fewer than 3 objectives`);
    if ((lesson.metadata?.searchKeywords?.length ?? 0) < 3) issues.push(`${prefix} has weak search keywords`);
  }
  return issues;
}

function advancedIssues(lessons) {
  const issues = [];
  const validTools = new Set([
    "/math-lab/continued-fractions",
    "/math-lab/famous-problems",
    "/math-lab/stats-inference",
    "/math-lab/differential-equations",
    "/math-lab/special-functions",
    "/math/slope-fields",
  ]);
  for (const lesson of lessons) {
    const prefix = `advanced:${lesson.id}:${lesson.title}`;
    if (!hasText(lesson.route) || !lesson.route.startsWith("/lessons/advanced-concepts/")) issues.push(`${prefix} has invalid route`);
    if (!validTools.has(lesson.toolRoute)) issues.push(`${prefix} links to unrecognized tool route ${lesson.toolRoute}`);
    if ((lesson.objectives?.length ?? 0) < 3) issues.push(`${prefix} has fewer than 3 objectives`);
    if ((lesson.learn?.length ?? 0) < 3) issues.push(`${prefix} has fewer than 3 learn items`);
    if ((lesson.explore?.length ?? 0) < 3) issues.push(`${prefix} has fewer than 3 explore items`);
    if ((lesson.practice?.length ?? 0) < 3) issues.push(`${prefix} has fewer than 3 practice items`);
    if ((lesson.assessmentPrompts?.length ?? 0) < 2) issues.push(`${prefix} has fewer than 2 assessment prompts`);
  }
  return issues;
}

function formulaWarnings(core) {
  const warnings = [];
  const suspicious = [
    { pattern: /\^\^/, reason: "double exponent marker" },
    { pattern: /sqrt\s*\(/i, reason: "plain sqrt() should be checked for display consistency" },
    { pattern: /undefined|null|NaN/i, reason: "placeholder value" },
    { pattern: /pii|sinn|coss|tann/i, reason: "possible duplicated function token" },
    { pattern: /([=+\-*/^])\s*\1/, reason: "repeated operator" },
  ];
  for (const lesson of core) {
    for (const formula of lesson.content?.formulas ?? []) {
      for (const check of suspicious) {
        if (check.pattern.test(formula.expression)) warnings.push({ lesson: lesson.id, title: lesson.title, expression: formula.expression, reason: check.reason });
      }
    }
  }
  return warnings;
}

const data = loadModule(outFile);
const core = data.core;
const school = data.school;
const advanced = data.advanced;
const allRoutes = [
  ...core.map((lesson) => lesson.route),
  ...school.map((lesson) => lesson.route),
  ...advanced.map((lesson) => lesson.route),
];

const report = {
  totals: {
    core: core.length,
    school: school.length,
    advanced: advanced.length,
    all: core.length + school.length + advanced.length,
  },
  uniqueness: {
    duplicateCoreIds: duplicates(core, (lesson) => lesson.id),
    duplicateSchoolIds: duplicates(school, (lesson) => lesson.id),
    duplicateAdvancedIds: duplicates(advanced, (lesson) => lesson.id),
    duplicateRoutes: duplicates(allRoutes, (route) => route),
  },
  core: {
    byPhase: countBy(core, (lesson) => `Phase ${lesson.phase}`),
    byCategory: countBy(core, (lesson) => lesson.category),
    byAdapter: countBy(core, (lesson) => lesson.adapter),
    byPresetSpecificity: countBy(core, (lesson) => lesson.preset?.specificity ?? "missing"),
    formulaCount: core.reduce((sum, lesson) => sum + (lesson.content?.formulas?.length ?? 0), 0),
    issues: coreIssues(core),
    formulaWarnings: formulaWarnings(core),
  },
  school: {
    byAcademicLevel: countBy(school, (lesson) => lesson.metadata?.academicLevel ?? "missing"),
    byLessonType: countBy(school, (lesson) => lesson.metadata?.lessonType ?? "missing"),
    issues: schoolIssues(school),
  },
  advanced: {
    byStrand: countBy(advanced, (lesson) => lesson.strand),
    byToolRoute: countBy(advanced, (lesson) => lesson.toolRoute),
    pathwayCount: data.advancedPathways.length,
    issues: advancedIssues(advanced),
  },
};

writeFileSync("tmp/lesson-audit-results.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
