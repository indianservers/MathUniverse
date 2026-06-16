# Number Sense / Counting Blocks / Place Value — Phase A: Audit + Upgrade/Create Design

## 1. Objective
Audit the existing Math App and design a premium browser-based interactive experience for number sense, counting blocks, and place value.

The final Phase B implementation should allow students to understand numbers through concrete visual manipulation before symbolic notation.

## 2. Current Status Classification
* Partial — extend current pieces

The app has `/number-systems`, NCERT number-system routes, arithmetic/calculator tools, primary-level formula metadata, number-theory visual proofs, progress hooks, and reusable UI controls. However, no dedicated Number Sense / Counting Blocks / Place Value route was found, and no complete base-ten block, ten-frame, or regrouping manipulative module was found.

## 3. Existing Routes and Files Found
No dedicated Number Sense / Place Value route was found.

| Route/File | Current Purpose | Relevance to Number Sense | Risk |
| ---------- | --------------- | ------------------------- | ---- |
| `/number-systems` | Existing number systems route | Best existing host for extension; covers rational, irrational, real line, and hierarchy | Medium |
| `src/pages/NumberSystems.tsx` | Number systems page with rational, irrational, real-line, 3D, and concept tabs | Has number-line and number classification pieces, but not early counting/place value | Medium |
| `/ncert/class-7-fractions-decimals` | NCERT linked concept route from syllabus/nav | Mentions fraction bars and decimal place-value model | Medium |
| `/ncert/class-7-integers` | NCERT linked concept route from syllabus | Integer number line and operations can support number order | Low |
| `/ncert/class-7-rational-numbers` | NCERT rational-number route | Useful for number-line extension after early place value | Low |
| `/ncert/class-9-number-systems` | NCERT number-system route | Later-stage number classification bridge | Low |
| `/calculator` | Scientific calculator route | Arithmetic evaluation exists, but not concrete manipulatives | Low |
| `/magic-maths` | Magic maths module route | Base-ten digit patterns and number tricks exist, not primary manipulatives | Low |
| `/problem-solver` | Step-by-step solver route | Can later link arithmetic checks; not a primary number sense surface | Medium |
| `/visual-proofs/number-theory` | Number theory visual proofs | Has object counting, digit/place-value proof references, divisibility, GCD, LCM | Low |
| `src/components/layout/navItems.ts` | Navigation and search terms | Contains number-system, rational, decimal, arithmetic, counting-tree search anchors | Medium |
| `src/data/topics.ts` | Dashboard topic metadata | Number Systems topic includes real line, decimals, surds, density | Low |
| `src/data/syllabus.ts` | Syllabus topic map | Includes integers, fractions/decimals, comparing quantities, rational numbers, exponents | Low |
| `src/data/unitUpgradePlan.ts` | Upgrade target map | Arithmetic and number-system upgrade ideas exist | Low |
| `src/pages/FormulasWorkspace.tsx` | Formula workspace with KG/Primary levels | Includes Arithmetic & Number Sense category and primary level mapping | Low |
| `src/components/ui/SliderControl.tsx` | Reusable slider component | Good for numeric controls and accessibility | Low |
| `src/components/ui/SectionCard.tsx` | Reusable card shell | Good for scene panels | Low |
| `src/components/ui/TopicTabs.tsx` | Reusable tab control | Good for counting, ten-frame, base-ten, chart, compare tabs | Low |
| `src/hooks/useProgress.ts` | Local progress tracking | Can preserve visited/interacted/completed behavior | Medium |
| `src/hooks/useLocalStorage.ts` | Local persistence hook | Useful for local practice state | Low |
| `src/visual-proofs/proofs/number-theory/NumberTheoryProofTemplate.tsx` | Number-theory proof renderer | Contains place-value proof toggle for digit-sum divisibility | Low |
| `src/visual-proofs/proofs/number-theory/numberTheoryProofConfigs.ts` | Number-theory proof configs | Contains object counting and place-value proof steps | Low |

## 4. Existing Features Found
Existing relevant pieces:

* Counting visuals: number-theory visual proofs include "Count the objects"; combinatorics has counting-tree concepts, but not early counting cubes.
* Arithmetic visuals: calculator, problem solver, Magic Maths digit tricks, and arithmetic upgrade-plan entries exist.
* Number line tools: `/number-systems`, NCERT integer/rational routes, and board syllabus visuals include number-line ideas.
* Base-ten blocks: no complete base-ten block component found.
* Cubes/manipulatives: algebra visual proofs use volume blocks, but no primary counting cube manipulative was found.
* Place-value charts: no full place-value chart component found; number-theory digit-sum proof can show place values.
* Quizzes: `src/components/quiz/*`, `/quiz`, and progress hooks exist for future practice linkage.
* Drag/drop components: no dedicated block drag/drop component found; workspace has draggable/math-object interaction infrastructure but should not be coupled unless safe.
* Progress tracking: `src/hooks/useProgress.ts` supports visited, interacted, completed, and quiz scores.
* Reusable UI cards/buttons/sliders: `SectionCard`, `TopicTabs`, `SliderControl`, `UiFeedback`, calculator buttons, and topic components exist.
* Local storage/progress hooks: `useLocalStorage` and `useProgress` exist.

## 5. Existing Weaknesses
Current gaps for Concept 01:

* No dedicated early number sense route.
* No drag/drop counting cubes.
* No click-to-place fallback for manipulatives.
* No snap zones for answer trays or place-value columns.
* No base-ten regrouping.
* No ten-frame.
* No complete place-value chart for hundreds/tens/ones.
* No visual correction for too many / too few blocks.
* No progressive hints for early counting.
* No beginner/professor mode for primary number sense.
* Mobile behavior for manipulative scenes is not yet defined.
* No keyboard alternative for cube movement.
* No reduced-motion plan for reward/regrouping animations.
* No tests for counting, regrouping, digit value, or block-state logic.

## 6. Upgrade/Create Decision
* Extend partial module

Recommended extension:

* Extend `/number-systems` and `src/pages/NumberSystems.tsx` with a new early-number-sense section or tab.
* Reuse `SectionCard`, `TopicTabs`, `SliderControl`, `UiFeedback`, `useProgress`, and `useLocalStorage`.
* A new route is not required for Phase B unless implementation review proves `/number-systems` becomes too crowded.
* Do not touch unrelated algebra, trigonometry, geometry workspace, calculator internals, or visual proof routes.
* Preserve the current rational, irrational, real-line, 3D, and concept tabs in `/number-systems`.

## 7. Student Learning Goals
The student should understand:

* numbers represent quantities
* counting uses one-to-one matching
* number order
* more, less, equal
* composing numbers
* decomposing numbers
* place value: ones, tens, hundreds
* 10 ones make 1 ten
* 10 tens make 1 hundred
* standard form
* expanded form
* comparing numbers using quantities
* digit value, e.g. in 348, 4 means 40

## 8. Professor / Teacher-Level Teaching Strategy
Use:

Concrete -> Visual -> Symbolic -> Practice

Teaching sequence:

1. Start with loose objects/cubes.
2. Count one object at a time.
3. Snap objects into ten-frame or grid.
4. Group 10 ones into 1 ten.
5. Group 10 tens into 1 hundred.
6. Move to place-value chart.
7. Show expanded form.
8. Show standard form.
9. Compare numbers visually.
10. Practice with instant feedback.

## 9. Premium Interaction Design
Design the premium interactions in detail.

### 9.1 Counting Cubes
* show draggable cubes
* student drags cubes into an answer tray
* cubes snap into grid positions
* live count updates
* "Check" button validates count
* wrong count shows visual correction
* keyboard fallback: plus/minus buttons

### 9.2 Show Number with Cubes
Prompt examples:

* "Show 3"
* "Show 7"
* "Show 10"

Student actions:

* drag cubes
* click cubes to add/remove
* snap into ten-frame
* check answer

Feedback:

* too few: "Add 2 more cubes."
* too many: "Remove 1 cube."
* correct: "Yes, 7 cubes show the number 7."

### 9.3 Ten-Frame
* show 10 slots
* cubes snap into slots
* highlight full ten-frame
* connect filled slots to number symbol
* support numbers 0-10

### 9.4 Base-Ten Blocks
* ones cubes
* tens rods
* hundred flats
* build numbers up to 999 if safe
* show live value

Example:

Prompt:
"Build 42"

Expected:

* 4 tens rods
* 2 ones cubes

Display:

* `4 tens + 2 ones`
* `40 + 2`
* `42`

### 9.5 Regrouping
* drag 10 ones into "Make a ten" zone
* convert to 1 ten rod
* drag 10 tens into "Make a hundred" zone
* convert to 1 hundred flat
* allow split:
  * 1 ten -> 10 ones
  * 1 hundred -> 10 tens

Important:
Regrouping must preserve value.

### 9.6 Place-Value Chart
Columns:

* Hundreds
* Tens
* Ones

Interactions:

* drag blocks into columns
* invalid drop gives explanation
* live number updates
* digit cards update
* expanded form updates

### 9.7 Compare Numbers
* build number A
* build number B
* student chooses `<`, `>`, or `=`
* visual comparison highlights which side has more value
* correction explains place-value comparison

### 9.8 Number Line
* draggable marker
* jump by ones/tens
* place target number
* connect block quantity to position

### 9.9 Fix the Model
Show an incorrect block model.

Example:
Prompt:
"This model says 34, but something is wrong. Fix it."

Student:

* moves/removes/adds blocks
* checks answer
* gets correction

## 10. Visual Models Required
Recommend:

* loose cubes
* ten-frame
* base-ten ones cubes
* tens rods
* hundred flats
* place-value chart
* number line
* comparison balance / two trays
* expanded-form cards
* standard-form number card
* regrouping machine/zone
* correction overlay

## 11. Practice and Challenge Ideas
1. Show number up to 3 with cubes.
2. Show number up to 5 with cubes.
3. Show number up to 10 in a ten-frame.
4. Count scattered objects.
5. Drag the correct number of cubes.
6. Match number symbol to quantity.
7. Match quantity to number symbol.
8. Build 12 using 1 ten and 2 ones.
9. Build 35 using tens and ones.
10. Build 100 using ten tens.
11. Convert 10 ones into 1 ten.
12. Split 1 ten into 10 ones.
13. Convert 10 tens into 1 hundred.
14. Compare 23 and 32 using blocks.
15. Choose `<`, `>`, or `=`.
16. Fill missing expanded form: `40 + 7 = ___`.
17. Match `5 tens + 6 ones` to `56`.
18. Place 78 on a number line.
19. Identify the value of 4 in 348.
20. Drag digits into hundreds/tens/ones columns.
21. Fix a wrong block model.
22. Create your own number and explain it.
23. Count by tens.
24. Count by hundreds.
25. Decompose 264 into hundreds, tens, ones.

## 12. Beginner Mode
Design:

* large blocks
* minimal text
* numbers 0-10 first
* one task at a time
* big prompt
* big check button
* friendly visual correction
* no dense terminology
* optional spoken-label-ready text structure
* reward animation only if reduced motion allows

## 13. Professor Mode
Design:

* expanded form
* standard form
* digit value
* base-ten regrouping explanation
* compare using place value
* decomposition strategies
* mental math bridge
* multi-representation panel:
  * blocks
  * chart
  * expanded form
  * standard form

## 14. Accessibility Requirements
Include:

* drag must have click/keyboard alternative
* cubes must be selectable by keyboard
* add/remove buttons
* snap zones must have labels
* live count must be text-readable
* color not sole indicator
* large touch targets
* reduced-motion support
* screen-reader summary of current model
* check feedback must be text-visible
* no timed mandatory tasks

## 15. Mobile Requirements
Include:

* touch-friendly cubes
* large snap zones
* one-column layout
* no horizontal overflow
* compact place-value chart
* cubes should not become too tiny
* drag must not break page scroll
* sticky prompt/check area if safe
* scroll-safe workspace

## 16. Math Safety Requirements
Ensure:

* count never negative
* no impossible block states
* regrouping preserves value
* place-value chart validates column logic
* comparison uses actual numeric value
* random questions stay within selected difficulty
* no NaN
* no Infinity
* duplicate block IDs not allowed
* max block count limits to avoid performance issues

## 17. Component Recommendations
Recommend components:

* `NumberSenseVisualizer`
* `CountingCubesScene`
* `TenFrameScene`
* `BaseTenBlocksScene`
* `PlaceValueChart`
* `DraggableCube`
* `DraggableTenRod`
* `HundredFlat`
* `SnapZone`
* `NumberPromptCard`
* `LiveCountPanel`
* `RegroupingPanel`
* `NumberLineBuilder`
* `CompareNumbersPanel`
* `ExpandedFormPanel`
* `VisualFeedbackPanel`
* `ProgressiveHintPanel`
* `PracticeQuestionCard`
* `ConceptModeToggle`

## 18. Data Structure Recommendation
Recommend:

```ts
type PlaceValueBlockType = "one" | "ten" | "hundred";

type PlaceValueBlock = {
  id: string;
  type: PlaceValueBlockType;
  value: 1 | 10 | 100;
  x?: number;
  y?: number;
  zone?: "workspace" | "ones" | "tens" | "hundreds" | "answer" | "regroup";
};

type NumberSenseTaskType =
  | "show-number"
  | "count-objects"
  | "build-number"
  | "regroup"
  | "compare"
  | "expanded-form"
  | "number-line"
  | "fix-model";

type NumberSenseTask = {
  id: string;
  type: NumberSenseTaskType;
  prompt: string;
  targetNumber: number;
  maxNumber: number;
  allowedBlocks: PlaceValueBlockType[];
  answerCheck: "count" | "place-value" | "comparison" | "expanded-form";
  hints: string[];
};
```

## 19. Testing Plan
Plan tests for:

* task generation within limits
* count validation
* show-number answer validation
* build-number validation
* regrouping 10 ones = 1 ten
* regrouping 10 tens = 1 hundred
* split 1 ten = 10 ones
* split 1 hundred = 10 tens
* expanded form calculation
* digit value calculation
* comparison values
* invalid drops
* duplicate block IDs
* no negative count
* no NaN/Infinity
* keyboard fallback state changes

## 20. Risks and Things Not to Touch
Mention:

* do not break existing arithmetic/problem-solver modules
* do not duplicate an existing number/place-value route
* do not introduce heavy drag/drop dependency unless already used
* do not require backend
* do not make drag the only way to answer
* do not create thousands of DOM blocks
* do not force animations
* do not rewrite unrelated navigation
* do not remove existing fallback views

## 21. Phase B Implementation Strategy
Recommend safe implementation order:

1. If existing route exists, upgrade it; if partial route exists, extend it; if missing, create safe route/component.
2. Add `NumberSenseVisualizer`.
3. Add counting cubes scene.
4. Add ten-frame scene.
5. Add base-ten blocks.
6. Add place-value chart.
7. Add regrouping controls.
8. Add compare numbers.
9. Add number line.
10. Add practice/check/hints.
11. Add keyboard/click fallback.
12. Add mobile polish.
13. Add tests.
14. Verify routes.
15. Update documentation.

## 22. Acceptance Criteria for Phase A
Phase A is complete when:

* existing files/routes are audited
* current status is classified as Existing / Partial / Missing
* upgrade/create decision is clear
* current gaps are documented
* premium interaction design is clear
* Phase B implementation plan is ready
* risks are identified
* no actual code implementation was done

## 23. Suggested Codex Prompt for Phase B
Implement only Concept 01 Phase B for Number Sense / Counting Blocks / Place Value. Use the Phase A classification: Partial — extend current pieces. Extend the existing `/number-systems` experience rather than creating a duplicate route unless implementation inspection proves a separate safe route is necessary. Preserve all existing app behavior and keep everything browser-based with no backend/server code. Add counting cubes, ten-frame, base-ten blocks, place-value chart, regrouping, compare numbers, number line, and practice/check/hints as appropriate. Add click/keyboard fallback for drag. Add tests for counting, regrouping, digit value, expanded form, comparison, invalid states, and no NaN/Infinity. Run typecheck/build/targeted lint as available. Verify routes. Update Phase B MD and the master roadmap after implementation.

