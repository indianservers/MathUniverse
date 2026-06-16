# Olympyard Phase 3 - Topic-Wise Question Bank + Hints

## 1. Files Inspected
- `OLYMPYARD_PREMIUM_UPGRADE_AUDIT_ROADMAP.md`
- `OLYMPYARD_PHASE_1_FOUNDATION_TOPIC_MAP.md`
- `OLYMPYARD_PHASE_2_QUESTION_ENGINE.md`
- `src/data/olympyardQuestions.ts`
- `src/data/olympyardTopics.ts`
- `src/pages/Olympyard.tsx`
- `src/pages/OlympyardPractice.tsx`
- `src/components/olympyard/OlympyardQuestionRenderer.tsx`
- `src/components/olympyard/OlympyardQuestionRenderer.test.ts`

## 2. Files Changed
- `src/data/olympyardQuestions.ts`
- `src/data/olympyardTopics.ts`
- `src/pages/Olympyard.tsx`
- `src/pages/OlympyardPractice.tsx`
- `src/components/olympyard/OlympyardQuestionRenderer.test.ts`
- `OLYMPYARD_PREMIUM_UPGRADE_AUDIT_ROADMAP.md`

## 3. Files Created
- `OLYMPYARD_PHASE_3_QUESTION_BANK.md`

## 4. Question Bank Summary
Phase 3 replaces the tiny Phase 2 sample-only bank with a data-driven starter question bank.

- Total questions: 126
- Topic coverage: 18 topics
- Questions per topic: 7
- Minimum hints per question: 4
- Minimum solution steps per question: 2
- Common mistake note: present on every question
- Estimated seconds: generated for every question

The bank stays browser-only and lives in `src/data/olympyardQuestions.ts`; no backend or server code was added.

## 5. Topic Coverage
The starter bank covers:

| Topic | Questions |
| --- | ---: |
| Number Sense | 7 |
| Arithmetic Tricks | 7 |
| Fractions and Decimals | 7 |
| Ratios and Proportions | 7 |
| Patterns and Sequences | 7 |
| Logical Reasoning | 7 |
| Number Theory | 7 |
| Divisibility Rules | 7 |
| Factors and Multiples | 7 |
| Geometry Reasoning | 7 |
| Area and Perimeter | 7 |
| Counting and Combinatorics | 7 |
| Probability Puzzles | 7 |
| Data Interpretation | 7 |
| Clock and Calendar | 7 |
| Algebraic Thinking | 7 |
| Word Problems | 7 |
| Mixed Review | 7 |

The original topic id `mixed-mock-test` was preserved for route compatibility, while the visible topic title is now `Mixed Review`.

## 6. Grade And Difficulty Coverage
Grade bands used:

- `class-1-2`
- `class-3-4`
- `class-5-6`
- `class-7-8`
- `class-9-10`

Difficulties used:

- `warm-up`
- `basic`
- `intermediate`
- `advanced`
- `speed`

The Olympyard home filters and practice page filters now read from the same browser-local grade and difficulty settings.

## 7. Question Types Covered
The Phase 3 bank includes:

- `mcq`
- `numeric`
- `click-match`
- `pattern`
- `geometry-marker`
- `step-fill`

The Phase 2 renderer and validator still support `visual-mcq`; future visual-MCQ items can be added without changing the renderer contract.

## 8. Integration Status
- Topic cards now show live question counts from the bank instead of the Phase 2 sample count.
- Selecting a topic opens `/olympyard/practice/:topicId`.
- The practice page filters the selected topic by the current grade and difficulty selectors.
- If a narrow filter has no matching questions, the page gracefully falls back to the full topic set.
- The Phase 2 question renderer displays the Phase 3 questions without hardcoding questions inside React components.

## 9. Tests / Build / Lint Status
Completed verification:

- `npm test -- src/components/olympyard/OlympyardQuestionRenderer.test.ts src/data/olympyardTopics.test.ts` passed: 2 files, 15 tests.
- Targeted Olympyard lint passed for the changed Olympyard files.
- `npm run build` passed.

Full project lint status:

- `npm run lint` still fails on pre-existing unrelated project-wide issues in files such as `public/sw.js`, `src/pages/MathWorkspace.tsx`, `src/data/formulaLibrary.ts`, and several non-Olympyard modules.
- No Olympyard-specific lint failures remain from Phase 3.

## 10. Remaining Issues
- The bank is a strong starter set, not a complete Olympiad curriculum.
- Most visual states are metadata-ready rather than fully illustrated custom diagrams.
- Full local attempt progress is not yet updated from every Phase 3 practice attempt.
- `visual-mcq` rendering is supported, but the starter bank currently emphasizes MCQ, numeric, matching, pattern, geometry-marker, and step-fill items.
- Mock test sequencing is still using the Mixed Review topic route, not a timed adaptive mock-test engine.

## 11. Recommendation For Phase 4
Implement practice modes, mock tests, and local progress:

- topic session scoring
- attempt/correct/streak updates from real answers
- optional timer only in Olympiad Mode
- mock-test queue from multiple topics
- review missed questions
- mastery badges by topic and grade band
- richer visual renderers for diagram metadata
