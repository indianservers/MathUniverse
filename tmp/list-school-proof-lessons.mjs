import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

execFileSync("npx", ["tsx", "tmp/export-lesson-audit-data.ts"], { stdio: "inherit", shell: true });
const data = JSON.parse(readFileSync("tmp/lesson-audit-data.json", "utf8"));
const proofLessons = data.school
  .filter((lesson) => lesson.metadata.lessonType === "PROOF" || /theorem|postulate|congruence|similarity|proof|rolle|mean value|bayes|total probability|remainder|factor/i.test(lesson.title))
  .map((lesson) => ({
    id: lesson.id,
    title: lesson.title,
    level: lesson.metadata.academicLevel,
    family: lesson.metadata.conceptFamily,
    type: lesson.metadata.lessonType,
    route: lesson.route,
  }));

writeFileSync("tmp/school-proof-lessons.json", JSON.stringify(proofLessons, null, 2));
console.log(JSON.stringify({
  count: proofLessons.length,
  byLevel: proofLessons.reduce((acc, lesson) => ({ ...acc, [lesson.level]: (acc[lesson.level] ?? 0) + 1 }), {}),
  byFamily: proofLessons.reduce((acc, lesson) => ({ ...acc, [lesson.family]: (acc[lesson.family] ?? 0) + 1 }), {}),
  lessons: proofLessons.map((lesson) => `${lesson.level} | ${lesson.family} | ${lesson.title}`),
}, null, 2));
