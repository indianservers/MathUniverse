# Olympyard Premium Upgrade Audit Roadmap

## 1. Purpose
Olympyard will become a premium browser-based Olympiad maths learning and practice module inside the existing Math App. It should help school students train for contest-style mathematics through visual reasoning, topic-wise practice, hints, solution reveal, local progress, mastery badges, and mock-test style challenges without adding backend/server code.

## 2. Current Status Classification
* Partial — extend current pieces

No dedicated `Olympyard`, `Olympiad`, or math competition route/module was found. However, the app already has strong related pieces: `/quiz`, `/daily-challenge`, `/spaced-repetition`, `/problem-solver`, `/worked-examples`, `/visual-proofs`, `/mathematical-logic`, `/combinatorics`, `/geometry`, `/number-systems`, local progress hooks, local quiz XP/streak utilities, and reusable quiz/practice components. Olympyard should extend these pieces and add a dedicated route only after preserving the current practice modules.

## 3. Existing Routes and Files Found
| Route/File | Current Purpose | Relevance to Olympyard | Risk |
| ---------- | --------------- | ---------------------- | ---- |
| `/quiz` | Topic-based quiz route | Existing MCQ, topic selection, best scores, timer, local quiz flow | Medium |
| `src/pages/Quiz.tsx` | Quiz page implementation | Best reusable practice behavior reference | Medium |
| `src/data/quizData.ts` | Generated topic quiz bank | Existing question bank shape, explanations, difficulty | Medium |
| `src/components/quiz/QuizCard.tsx` | Quiz question renderer | Reusable MCQ display and hint hook | Low |
| `src/components/quiz/QuizProgress.tsx` | Quiz progress UI | Can support Olympyard challenge progress | Low |
| `src/components/quiz/QuizResult.tsx` | Quiz result UI | Can support score summaries and review | Low |
| `src/components/quiz/TopicQuizSelector.tsx` | Quiz topic selector | Useful for Olympyard topic map patterns | Low |
| `/daily-challenge` | Deterministic daily practice | Existing streak-like daily challenge model | Medium |
| `src/pages/DailyChallenge.tsx` | Daily challenge page | Local daily challenge, streak, heatmap, check flow | Medium |
| `/spaced-repetition` | Review route | Potential review/mastery route | Medium |
| `/problem-solver` | Step-by-step solver | Useful for solution verification and worked explanations | Medium |
| `src/problem-solver/*` | Solver/classifier/helpers | Can inform word problem, arithmetic, algebra answer validation | High |
| `/worked-examples` | Solved examples library | Solution reveal and hint pattern exists | Low |
| `src/pages/WorkedExamplesLibrary.tsx` | Worked example page | Reusable step/hint design reference | Low |
| `/visual-proofs` | Visual proof hub | Supports visual reasoning and proof-based explanations | Low |
| `src/visual-proofs/*` | Visual proof components/data/proofs | Rich visual solution assets for number theory, geometry, algebra, probability | Medium |
| `/mathematical-logic` | Logic lab | Olympiad logical reasoning source | Low |
| `/combinatorics` | Counting/combinatorics module | Olympiad counting and pattern source | Low |
| `/number-systems` | Number systems route | Number sense, real line, rational/irrational foundation | Low |
| `/geometry` | Geometry concept route | Geometry reasoning, angles, area, triangles | Low |
| `/magic-maths` | Number patterns/tricks | Arithmetic tricks, digit roots, Kaprekar, calendar arithmetic | Low |
| `src/hooks/useProgress.ts` | Topic progress and quiz score persistence | Olympyard local mastery and score storage | Medium |
| `src/hooks/useLocalStorage.ts` | Local storage hook | Browser-only local Olympyard progress | Low |
| `src/components/layout/GlobalUx.tsx` | Quiz XP, streak, heatmap, command palette | Existing local gamification utilities | Medium |
| `src/workspace/practiceAssessment.ts` | Practice response evaluation | Useful for future reasoning/check rubrics | Medium |
| `src/data/contentLibrary.ts` | Lessons, worksheets, activities | Worksheet and activity metadata reference | Low |
| `src/data/engineeringPracticePacks.ts` | Practice prompt packs | Data pattern for larger practice collections | Low |

## 4. Existing Features Found
Existing relevant capabilities:

* Quiz system: `/quiz`, `Quiz.tsx`, `QuizCard`, `QuizProgress`, `QuizResult`, `TopicQuizSelector`.
* Progress system: `useProgress`, local best scores, local quiz XP, heatmap, and streak utilities.
* Question bank: `src/data/quizData.ts` with generated MCQs, explanations, topics, and difficulties.
* Problem solver: `src/problem-solver/*` includes classifiers, algebra, systems, statistics, matrices, word problems, graphing utilities, and tests.
* Worked examples: `/worked-examples` has rendered math, hints, and step reveal.
* Visual modules: number systems, geometry, trigonometry, combinatorics, logic, graph theory, visual proofs, daily challenge, and magic maths.
* Scoring: quiz score percentage, best scores, XP, streak, daily challenge solved state.
* Hints: quiz assisted hint hook and worked-example hint toggles.
* Levels: existing topic difficulties and quiz question difficulties; no Olympyard ladder yet.
* Topic pages: broad math topics and app navigation already exist.
* Local storage: `useLocalStorage`, quiz best scores, daily challenge state, XP, streak, heatmap.

## 5. Existing Weaknesses
Current gaps for Olympyard:

* No dedicated Olympyard/Olympiad route or structure.
* No topic-wise Olympiad challenge ladder.
* No unified grade/class filters for contest practice.
* No visual reasoning support inside the quiz engine.
* No adaptive hint ladder with multiple hint levels.
* Timed practice exists only as a simple optional quiz timer.
* Wrong answers have explanation review, but no deep step-by-step correction flow.
* Difficulty progression is topic-level rather than contest ladder.
* Local score/streak exists, but not Olympyard mastery badges.
* No drag/drop reasoning tasks.
* No geometry diagram marking tasks.
* No pattern-builder or formula-builder challenge renderer.
* Mobile behavior for advanced Olympiad visual tasks is not defined.
* Keyboard fallback for visual interactions is not yet defined.

## 6. Olympyard Product Vision
Olympyard should become:

* topic-wise Olympiad preparation
* level-based problem-solving journey
* visual-first reasoning
* challenge cards
* hint ladder
* step-by-step solution reveal
* local progress
* mastery badges
* practice by grade/class
* beginner/professor mode

The experience should feel like a contest training garden: students see the idea, try a problem, request hints gradually, check their reasoning, and learn from a clear visual solution.

## 7. Suggested Olympyard Topics
1. Number Sense and Place Value
2. Arithmetic Tricks
3. Fractions and Decimals
4. Ratios and Proportions
5. Patterns and Sequences
6. Logical Reasoning
7. Number Theory Basics
8. Divisibility Rules
9. Factors and Multiples
10. Geometry Reasoning
11. Angles and Triangles
12. Area and Perimeter Puzzles
13. Counting and Combinatorics
14. Probability Puzzles
15. Data Interpretation
16. Time, Calendar, Clock Problems
17. Money and Measurement
18. Algebraic Thinking
19. Word Problems
20. Mixed Mock Tests

## 8. Difficulty Structure
Recommended levels:

* Level 1: Warm-up
* Level 2: School Olympiad Basic
* Level 3: Intermediate Reasoning
* Level 4: Advanced Challenge
* Level 5: Speed Round / Mock Test

Recommended grade/class filters:

* Class 1-2
* Class 3-4
* Class 5-6
* Class 7-8
* Class 9-10

## 9. Interaction Design
Olympyard should include:

* visual MCQs
* drag-to-match
* click-to-select
* number-line tasks
* pattern completion
* geometry diagram marking
* formula-builder chips
* fill missing step
* check/submit
* progressive hints
* step solution reveal
* retry with similar problem
* local score and streak

Every drag task needs a click/keyboard fallback. Timers should be optional and never the only mode.

## 10. Component Architecture
Recommended components:

* `OlympyardHome`
* `OlympyardTopicMap`
* `OlympyardChallengeCard`
* `OlympyardQuestionRenderer`
* `OlympyardVisualMCQ`
* `OlympyardDragMatch`
* `OlympyardPatternBuilder`
* `OlympyardGeometryMarker`
* `OlympyardHintLadder`
* `OlympyardSolutionReveal`
* `OlympyardProgressPanel`
* `OlympyardMockTest`
* `OlympyardQuestionBank`
* `OlympyardLocalProgress`

Implementation should reuse existing quiz/progress UI patterns where possible instead of rewriting them from scratch.

## 11. Data Structure Recommendation
```ts
type OlympyardGradeBand =
  | "class-1-2"
  | "class-3-4"
  | "class-5-6"
  | "class-7-8"
  | "class-9-10";

type OlympyardDifficulty =
  | "warm-up"
  | "basic"
  | "intermediate"
  | "advanced"
  | "speed";

type OlympyardQuestionType =
  | "mcq"
  | "visual-mcq"
  | "numeric"
  | "drag-match"
  | "pattern"
  | "geometry-marker"
  | "step-fill"
  | "graph"
  | "mock-test";

type OlympyardQuestion = {
  id: string;
  topicId: string;
  gradeBand: OlympyardGradeBand;
  difficulty: OlympyardDifficulty;
  type: OlympyardQuestionType;
  prompt: string;
  visualState?: Record<string, unknown>;
  choices?: Array<{
    id: string;
    label: string;
    correct?: boolean;
    feedback?: string;
  }>;
  answer: string | number | string[] | Record<string, unknown>;
  hints: Array<{
    level: 1 | 2 | 3 | 4;
    title: string;
    body: string;
  }>;
  solutionSteps: string[];
  commonMistake?: string;
  estimatedSeconds?: number;
};
```

## 12. Testing Plan
Plan tests for:

* question bank validation
* no duplicate IDs
* every question has answer
* every question has hints
* every question has solution steps
* scoring logic
* local progress
* topic filtering
* difficulty filtering
* answer validation
* no NaN/Infinity
* route loading

Additional QA:

* keyboard fallback for each question type
* optional timer behavior
* mobile layout for visual question renderers
* reduced-motion behavior for reward and solution animations

## 13. Phase Plan
1. Foundation + route/topic map
2. Question engine + visual renderer
3. Topic-wise question bank + hints
4. Practice modes + mock tests + local progress
5. Polish + accessibility + mobile + final audit

### Phase 1 Implementation Status
Status: **Implemented**

Phase 1 added the `/olympyard` foundation route, topic metadata, grade and difficulty filters, Beginner/Olympiad mode toggle, browser-local progress shell, home/dashboard entry, practice navigation entry, and topic metadata validation tests. Existing quiz, problem-solver, progress, and visual modules were preserved and linked to rather than duplicated.

### Phase 2 Implementation Status
Status: **Implemented**

Phase 2 added an Olympyard-specific browser-only question engine, visual renderer, validation helper, hint ladder, solution reveal, feedback panel, five sample questions, and `/olympyard/practice/:topicId`. Existing quiz/problem-solver modules remain untouched; the Olympyard engine is separate because its interaction types go beyond the current MCQ quiz renderer.

### Phase 3 Implementation Status
Status: **Implemented**

Phase 3 added a data-driven Olympyard starter question bank with 126 questions across 18 topics, four-level hints, solution steps, common mistake notes, visual-state metadata, live topic question counts, and grade/difficulty filtering on the practice route. The implementation reuses the Phase 2 renderer and stays fully browser-based with no backend/server code.

### Phase 4 Implementation Status
Status: **Implemented**

Phase 4 added Topic Practice progress updates, Mixed Practice, Weak Area Practice, Speed Round, Mock Test, optional timer, skip, review screen, score summary, topic breakdown, solution review, retry incorrect entry point, local topic mastery, weak-topic detection, mock score history, and local badges. Progress remains browser-only through a namespaced localStorage key.

### Phase 5 Implementation Status
Status: **Implemented**

Phase 5 completed a focused Olympyard polish and audit pass: labelled native controls, no timer-only tasks, no drag-only tasks, visible feedback and hint text, responsive setup/results grids, memoized question selection, one-question mock rendering, compact solution review, route smoke checks, and final documentation. Remaining work is curriculum depth and richer visual renderers, not core infrastructure.

## 14. Risks
* Do not hardcode too many questions inside components.
* Do not require backend.
* Do not break existing quiz/problem-solver modules.
* Avoid huge DOM for visual reasoning tasks.
* Avoid timed-only tasks.
* Maintain keyboard fallback.
* Avoid duplicating `/quiz`; Olympyard should have a distinct contest-practice purpose.
* Preserve local storage keys or migrate carefully if sharing progress data.

## 15. Final Recommendation
Recommended first implementation phase: **Foundation + route/topic map**.

Safe route plan:

* Add `/olympyard` only in Phase 1 implementation, not in this audit prompt.
* Keep `/quiz`, `/daily-challenge`, `/spaced-repetition`, `/problem-solver`, and `/worked-examples` untouched.
* Build `OlympyardHome` as a new shell that links out to existing modules where useful and gradually hosts Olympyard-specific question renderers.
* Store progress locally through a new namespaced key such as `math-universe-olympyard-progress`.
* Start with MCQ, numeric, visual-MCQ, and hint-ladder support before drag/match and geometry-marker tasks.
