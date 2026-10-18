import { sharedChapterLessons, normalizeChapter } from "./curriculumSharedLessons";
import { availableDrafts } from "./curriculumAvailableDrafts";
import draftMetadata from "./curriculumDraftChapters.json";
import type { CurriculumTopic } from "./curriculumTopics";

// Front-matter contents checked against the publisher's PDFs, 17 October 2026.
const books = [
  {grade: 7, code: "gegp1ps", chapters: ["Large Numbers Around Us", "Arithmetic Expressions", "A Peek Beyond the Point", "Expressions using Letter-Numbers", "Parallel and Intersecting Lines", "Number Play", "A Tale of Three Intersecting Lines", "Working with Fractions"]},
  {grade: 7, code: "gegp2ps", chapters: ["Geometric Twins", "Operations with Integers", "Finding Common Ground", "Another Peek Beyond the Point", "Connecting the Dots...", "Constructions and Tilings", "Finding the Unknown"]},
  {grade: 8, code: "hegp1ps", chapters: ["A Square and A Cube", "Power Play", "A Story of Numbers", "Quadrilaterals", "Number Play", "We Distribute, Yet Things Multiply", "Proportional Reasoning-1"]},
  {grade: 8, code: "hegp2ps", chapters: ["Fractions in Disguise", "The Baudhayana-Pythagoras Theorem", "Proportional Reasoning-2", "Exploring Some Geometric Themes", "Tales by Dots and Lines", "Algebra Play", "Area"]},
  {grade: 9, code: "iemh1ps", chapters: ["Orienting Yourself: The Use of Coordinates", "Introduction to Linear Polynomials", "The World of Numbers", "Exploring Algebraic Identities", "I’m Up and Down, and Round and Round", "Measuring Space: Perimeter and Area", "The Mathematics of Maybe: Introduction to Probability", "Predicting What Comes Next: Exploring Sequences and Progressions"]},
];
const aliases: Record<string, string> = {
  "A Peek Beyond the Point": "Fractions and Decimals", "Another Peek Beyond the Point": "Fractions and Decimals",
  "Expressions using Letter-Numbers": "Algebraic Expressions", "Parallel and Intersecting Lines": "Lines and Angles",
  "A Tale of Three Intersecting Lines": "Triangle and its Properties", "Working with Fractions": "Fractions",
  "Operations with Integers": "Integers", "Finding the Unknown": "Simple Equations",
  "A Square and A Cube": "Squares and Square Roots", "Power Play": "Exponents and Powers",
  "We Distribute, Yet Things Multiply": "Algebraic Expressions and Identities", "Proportional Reasoning-1": "Direct and Inverse Proportions",
  "Proportional Reasoning-2": "Direct and Inverse Proportions", "The Baudhayana-Pythagoras Theorem": "Pythagoras Theorem",
  "Orienting Yourself: The Use of Coordinates": "Coordinate Geometry", "Introduction to Linear Polynomials": "Polynomials",
  "The World of Numbers": "Number Systems", "Exploring Algebraic Identities": "Algebraic Expressions and Identities",
  "The Mathematics of Maybe: Introduction to Probability": "Probability", "Predicting What Comes Next: Exploring Sequences and Progressions": "Arithmetic Progressions",
};
export const currentTextbookTopics: CurriculumTopic[] = books.flatMap((book) => book.chapters.map((title, index) => {
  const ids = draftMetadata.filter((entry) => normalizeChapter(entry.chapter ?? "") === normalizeChapter(title)).map((entry) => entry.lessonId);
  const drafts = availableDrafts.filter((lesson) => ids.includes(lesson.id));
  const lessons = sharedChapterLessons(aliases[title] ?? title, `Class ${book.grade}`);
  return {id: `textbook-${book.code}-${index}`, curriculum: "NCERT", level: `Class ${book.grade}`, unit: `${title} · ${book.code.includes("2") ? "Part 2" : "Part 1"}`,
    title, summary: "Publisher chapter with shared mathematics lesson links. Links cover the named skills; exact exercise alignment is not certified.", lessons, draftLessons: drafts,
    order: 100 + (book.code.includes("2") ? 30 : 0) + index,
    mappingPending: !lessons.length && !drafts.length,
    sourceUrl: `https://ncert.nic.in/textbook/pdf/${book.code}.pdf`,
    sourceNote: "NCERT Ganita Prakash contents checked 17 October 2026. Parts 1 and 2 are identified separately; older registered topic groups remain available.",
  };
}));
