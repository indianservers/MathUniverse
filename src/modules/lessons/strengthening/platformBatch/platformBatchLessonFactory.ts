import type { StrengthenedLesson } from "../strengthenedLessonSchema";

export type PlatformBatchChallenge = {
  prompt: string;
  expected: string;
  hint: string;
  kind: "numeric" | "keywords" | "interaction";
  factoryId: string;
};

type Seed = {
  id: number;
  title: string;
  slug: string;
  definition: string;
  action: string;
  reason: string;
  representation: "text_table" | "transformation_animation" | "calculator_trace";
  misconception: [string, string, string];
  examples: [string, string][];
  challenge: PlatformBatchChallenge;
};

const data: Record<number, Seed> = {
  657: item(657, "Drag and Manipulate", "drag-and-manipulate", "Drag and manipulate lets learners move objects directly.", "Support pointer, touch, and keyboard movement.", "Direct movement helps learners connect action with visible change.", "transformation_animation", ["MOUSE_ONLY", "Supporting only mouse dragging.", "Provide keyboard and touch alternatives too."], [["Point movement", "Drag a point on a graph."], ["Shape resize", "Move a handle to resize."], ["Number line", "Move a marker to a value."]], "Drag and manipulate should support mouse and what?", "keyboard"),
  658: item(658, "Zoom and Pan", "zoom-and-pan", "Zoom and pan change the visible part of a workspace.", "Keep scale readable and provide a way back to the original view.", "View controls help inspect small details without changing the math object.", "transformation_animation", ["OBJECT_CHANGE", "Thinking zoom changes the object itself.", "Zoom changes the view, not the object."], [["Graph", "Zoom in near an intercept."], ["Geometry", "Pan to a distant point."], ["Map", "Inspect a small region."]], "Zoom changes the view or object?", "view"),
  659: item(659, "Reset View", "reset-view", "Reset view returns the screen to a known camera or layout.", "Restore pan, zoom, and focus without changing saved work.", "Learners can recover from getting lost in a workspace.", "calculator_trace", ["RESET_WORK", "Deleting learner work when only the view should reset.", "Reset the view separately from the construction state."], [["Graph view", "Return axes to default."], ["3D view", "Return camera angle."], ["Document view", "Return zoom to 100%."]], "Reset view should restore pan and what?", "zoom"),
  660: item(660, "Undo and Redo", "undo-and-redo", "Undo and redo move backward and forward through recent actions.", "Store a safe action history and update the display after each step.", "History controls let learners fix mistakes without starting over.", "calculator_trace", ["NO_LIMIT", "Keeping unclear or unsafe action history.", "Store clear reversible actions with sensible limits."], [["Drawing", "Undo the last line."], ["Graphing", "Redo a point move."], ["Editing", "Restore deleted text."]], "Undo and redo need an action what?", "history"),
  661: item(661, "Animation Player", "animation-player", "An animation player runs a changing model over time.", "Provide play, pause, speed, and reset controls.", "Animation reveals patterns that unfold step by step.", "transformation_animation", ["NO_PAUSE", "Running animation without pause control.", "Learners need pause and replay controls."], [["Function change", "Animate a parameter."], ["Geometry", "Animate a rotating angle."], ["Simulation", "Animate repeated trials."]], "An animation player needs play and what?", "pause"),
  662: item(662, "Snap Controls", "snap-controls", "Snap controls move objects to exact points, grids, or angles.", "Choose snap size and show when snapping is active.", "Snapping improves precision while keeping manipulation easy.", "transformation_animation", ["HIDDEN_SNAP", "Snapping objects without telling the learner.", "Show when snap is active and what grid is used."], [["Grid snap", "Move points to integer coordinates."], ["Angle snap", "Rotate by 15 degrees."], ["Shape snap", "Align edges exactly."]], "Snap controls help with what?", "precision"),
  663: item(663, "Trace and Locus", "trace-and-locus", "Trace shows a moving object's path, and locus shows all positions satisfying a condition.", "Record positions as the object moves and explain the condition.", "Paths reveal hidden relationships over motion.", "transformation_animation", ["TRACE_EQUALS_OBJECT", "Confusing the path with the moving object.", "Trace is the path left by movement, not the object itself."], [["Circle locus", "Points a fixed distance from a centre."], ["Function trace", "Track a point on a graph."], ["Mechanism", "Show a moving joint path."]], "Trace shows the object's what?", "path"),
  664: item(664, "Exact and Decimal Output", "exact-and-decimal-output", "Exact output preserves symbolic form, while decimal output gives an approximation.", "Show which mode is active and round decimals clearly.", "Mode labels prevent learners from confusing exact and approximate answers.", "text_table", ["APPROX_AS_EXACT", "Treating a rounded decimal as exact.", "Label decimals as approximate when they are rounded."], [["Fraction", "1/3 exact, 0.333... decimal."], ["Radical", "sqrt(2) exact, 1.414... decimal."], ["Pi", "pi exact, 3.14 approximate."]], "Rounded decimals should be labelled as what?", "approximate"),
  665: item(665, "Linked Views", "linked-views", "Linked views show the same object in different panels.", "Update all views from the same state.", "Linked views connect diagram, graph, table, and algebra without contradictions.", "text_table", ["DESYNC", "Letting views show different values.", "Use one shared state so views stay in sync."], [["Graph and table", "A point change updates both."], ["2D and 3D", "A net folds with the solid."], ["Algebra and diagram", "Equation matches the construction."]], "Linked views should share one what?", "state"),
  666: item(666, "Save, Duplicate and Share", "save-duplicate-and-share", "Save stores work, duplicate makes a copy, and share sends access to others.", "Preserve state, title, permissions, and version information.", "These actions help teachers reuse work without losing originals.", "text_table", ["OVERWRITE_ORIGINAL", "Editing the original when a copy was needed.", "Duplicate before experimenting with a separate version."], [["Teacher copy", "Duplicate a worksheet."], ["Student share", "Share a practice link."], ["Version save", "Save a checkpoint."]], "Duplicate protects the original by making a what?", "copy"),
  667: item(667, "Export", "export", "Export saves work into another file or format.", "Choose the format and check that important data is included.", "Export lets work move into reports, slides, or other systems.", "text_table", ["MISSING_DATA", "Exporting only a picture when data is required.", "Choose the export format that preserves needed information."], [["PNG", "Export a diagram image."], ["CSV", "Export table data."], ["PDF", "Export a printable worksheet."]], "Export should preserve needed what?", "information"),
  668: item(668, "Teacher Presentation Mode", "teacher-presentation-mode", "Teacher presentation mode shows lesson content clearly for a class display.", "Use large controls, focused views, and hidden answers until needed.", "Presentation mode supports whole-class explanation and discussion.", "text_table", ["SMALL_UI", "Using tiny learner controls on a classroom screen.", "Use large readable controls for presentation."], [["Projector", "Show a graph full-screen."], ["Discussion", "Reveal one step at a time."], ["Demonstration", "Control sliders while explaining."]], "Presentation mode needs large readable what?", "controls"),
  669: item(669, "Learner Practice Mode", "learner-practice-mode", "Learner practice mode gives students tasks, attempts, and feedback.", "Track answers, hints, progress, and next steps.", "Practice mode supports independent learning with feedback.", "text_table", ["NO_FEEDBACK", "Collecting answers without telling learners what to fix.", "Give useful feedback after attempts."], [["Quiz", "Check each answer."], ["Skill drill", "Show progress."], ["Practice path", "Offer a next task."]], "Learner practice mode should give useful what?", "feedback"),
  670: item(670, "Exam Mode", "exam-mode", "Exam mode limits tools so assessment conditions are fair.", "Disable hints, sharing, and unrelated aids according to rules.", "Controlled conditions help make results comparable.", "text_table", ["EXTRA_HELP", "Leaving hints enabled during an exam.", "Disable aids that are not allowed by the exam rules."], [["Timed test", "Hide hints."], ["Secure task", "Disable sharing."], ["Assessment", "Lock answer reveal."]], "Exam mode should follow assessment what?", "rules"),
  671: item(671, "Keyboard Navigation", "keyboard-navigation", "Keyboard navigation lets learners use the interface without a mouse.", "Provide tab order, focus styles, and arrow-key actions.", "Keyboard support is essential for accessibility and precision.", "text_table", ["NO_FOCUS", "Making controls keyboard reachable but not visibly focused.", "Show a clear focus indicator."], [["Slider", "Change value with arrows."], ["Button", "Activate with Enter."], ["Dialog", "Move through fields with Tab."]], "Keyboard navigation needs visible what?", "focus"),
  672: item(672, "Screen Reader Support", "screen-reader-support", "Screen reader support gives meaningful spoken text for interface elements.", "Use labels, roles, live text, and clear descriptions.", "It lets learners who cannot see the screen understand and operate the lesson.", "text_table", ["VISUAL_ONLY", "Putting important feedback only in colour or position.", "Provide text that a screen reader can announce."], [["Button label", "Say what the button does."], ["Graph summary", "Describe key points."], ["Live update", "Announce changed value."]], "Screen reader support needs meaningful what?", "labels"),
  673: item(673, "High Contrast and Large Text", "high-contrast-and-large-text", "High contrast and large text improve readability.", "Keep colour contrast strong and allow text to scale without overlap.", "Readable displays help many learners, including low-vision users.", "text_table", ["COLOR_ONLY", "Using colour alone to show meaning.", "Use text, shape, or labels along with colour."], [["Error text", "Show label and colour."], ["Large formula", "Scale without clipping."], ["Contrast mode", "Use dark text on light background."]], "High contrast improves what?", "readability"),
  674: item(674, "Multi-Language Terminology", "multi-language-terminology", "Multi-language terminology shows important terms in more than one language.", "Keep the mathematical meaning stable across translations.", "Clear terminology helps learners connect home language and school language.", "text_table", ["WORD_SWAP", "Translating words without checking mathematical meaning.", "Verify the accepted mathematical term in each language."], [["Glossary", "Show term and definition."], ["Bilingual label", "Pair local word with English term."], ["Teacher notes", "Explain symbol names."]], "Multi-language terms must keep the same what?", "meaning"),
};

export function platformSeed(id: number) {
  return data[id];
}

export type PlatformBatchSeed = Seed;

export function platformBatchLesson(seed: Seed): StrengthenedLesson {
  const code = seed.misconception[0];
  return {
    id: seed.id,
    title: seed.title,
    route: `/lessons/platform-capabilities/${seed.id}-${seed.slug}`,
    category: "Platform Capabilities",
    topic: "Common Tools and Accessibility",
    lessonType: "tool",
    learningObjectives: [`Define ${seed.title}.`, seed.action, `Avoid this platform mistake: ${seed.misconception[1]}`],
    prerequisites: ["Basic interface controls", "Learner feedback", "Accessibility basics"],
    keyVocabulary: [{ term: seed.title, meaning: seed.definition }, { term: "Accessibility", meaning: "Design that lets more people use the lesson." }],
    introduction: `${seed.title} is a platform capability. It helps learners control, inspect, save, or access the lesson in a reliable way.`,
    basicIdea: `${seed.definition} The basic idea is to make the learner action clear and reversible when needed. ${seed.reason} A common mistake is ${seed.misconception[1]}`,
    howItWorks: `${seed.action} Then test pointer, keyboard, and readable feedback where they apply.`,
    whyItWorks: "A platform tool supports learning when it changes the view or state predictably and keeps access clear.",
    definitions: [{ id: `${seed.slug}-definition`, statement: seed.definition }],
    facts: [{ id: `${seed.slug}-fact`, statement: seed.reason }],
    formulas: [],
    conditionsAndRestrictions: ["Keep controls reachable by keyboard.", "Label important state changes.", "Separate view changes from mathematical object changes."],
    representations: [{ id: `${seed.slug}-representation`, type: seed.representation, learningPurpose: `Show how ${seed.title} changes the lesson experience.` }],
    workedExamples: [{ id: `${seed.slug}-worked-1`, prompt: seed.challenge.prompt, steps: ["Identify the platform action.", seed.action, "Check accessibility and feedback."], answer: seed.challenge.expected }],
    realLifeExamples: seed.examples.map(([context, connection], index) => ({ id: `${seed.slug}-real-${index + 1}`, context, connection })),
    misconceptions: [{ code, mistake: seed.misconception[1], correction: seed.misconception[2] }],
    interaction: { id: `${seed.slug}-interaction`, learningPurpose: `Test ${seed.title} in a compact capability preview.`, parameters: [{ id: "position", label: "Position", validRange: [0, 100] }, { id: "zoom", label: "Zoom", validRange: [1, 2] }, { id: "contrast", label: "Contrast", validValues: ["on", "off"] }], initialState: `Start with ${seed.title} in the default view.`, dynamicFeedback: "Pointer, keyboard, view, and contrast changes update the displayed state.", successCriteria: ["Use the tool", "Explain what changes", "Name the accessibility check"], accessibilityAlternative: "Describe current position, zoom, focus state, and visible feedback as text." },
    guidedExploration: [{ id: "predict", prompt: "Predict whether the tool changes the object or the view." }, { id: "test", prompt: "Use the control and read the state." }, { id: "explain", prompt: "Explain the accessibility or reliability rule." }],
    practice: [practice(`${seed.slug}-recognition`, `What is ${seed.title}?`, seed.definition, code, "recognition"), practice(`${seed.slug}-direct`, seed.challenge.prompt, seed.challenge.expected, code, "direct"), practice(`${seed.slug}-multi`, `How should ${seed.title} be tested?`, seed.action, code, "multi_step"), practice(`${seed.slug}-error`, `What is wrong with this platform mistake: ${seed.misconception[1]}`, seed.misconception[2], code, "error_diagnosis"), practice(`${seed.slug}-transfer`, `Give one use of ${seed.title}.`, seed.examples[0][0], code, "transfer")],
    challenge: { id: `${seed.slug}-challenge`, prompt: seed.challenge.prompt, successCriteria: ["Names the capability", "Uses the platform rule", "Includes accessibility or state clarity"], hints: [seed.challenge.hint, seed.misconception[2]] },
    exitCheck: [{ id: `${seed.slug}-exit`, prompt: `State one platform rule for ${seed.title}.`, answer: seed.misconception[2], criterion: "Answer names a clear usability or accessibility rule." }],
    accessibilityNotes: ["Do not rely only on pointer movement.", "Important state changes must be available as text."],
    expertReviewRequired: false,
  };
}

export function platformBatchChallenge(seed: Seed) {
  return seed.challenge;
}

function item(id: number, title: string, slug: string, definition: string, action: string, reason: string, representation: Seed["representation"], misconception: Seed["misconception"], examples: Seed["examples"], prompt: string, expected: string): Seed {
  return { id, title, slug, definition, action, reason, representation, misconception, examples, challenge: { prompt, expected, hint: `Use the ${title} capability rule.`, kind: Number.isFinite(Number(expected)) ? "numeric" : "keywords", factoryId: `platform.${slug}` } };
}

function practice(id: string, prompt: string, answer: string, misconceptionTag: string, difficulty: StrengthenedLesson["practice"][number]["difficulty"]): StrengthenedLesson["practice"][number] {
  return { id, prompt, answer, hints: ["Name the platform action.", "Check what changes.", "Check accessibility."], workedSolution: ["Identify the capability.", "Apply the platform rule.", "Check the learner-facing result."], misconceptionTag, difficulty, parameterConstraints: ["Use accessible controls and readable feedback."] };
}
