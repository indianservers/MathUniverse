import { evaluateExpression } from "../../../utils/calculator";
import { latestLessonEvidence } from "./lessonInteraction";
import type { LessonDefinition, LessonInteractionEvent } from "../types";

export type LessonChallenge = {
  prompt: string;
  expected: string;
  hint: string;
  kind: "numeric" | "keywords" | "interaction";
  factoryId: string;
};

export type LessonCheckResult = { correct: boolean; feedback: string };

export function createLessonChallenge(lesson: LessonDefinition, seed: number, history: LessonInteractionEvent[] = []): LessonChallenge {
  const a = 2 + (seed % 7);
  const b = 1 + (Math.floor(seed / 7) % 6);
  const specific = createSpecificChallenge(lesson, history);
  if (specific) return specific;

  const challenge = (input: Omit<LessonChallenge, "factoryId">): LessonChallenge => ({ ...input, factoryId: lesson.contract.challengeFactory });

  if (lesson.adapter === "calculator") {
    const expression = `${a}+${b}*2`;
    return challenge({ prompt: `Evaluate ${expression}.`, expected: evaluateExpression(expression, "DEG"), hint: "Apply multiplication before addition.", kind: "numeric" });
  }
  if (lesson.adapter === "algebra") {
    return challenge({ prompt: `For f(x)=${a}x+${b}, find f(2).`, expected: String(a * 2 + b), hint: "Substitute x = 2, then simplify.", kind: "numeric" });
  }
  if (lesson.adapter === "number") {
    if (/fraction|ratio|proportion|percentage/i.test(`${lesson.topic} ${lesson.title}`)) {
      return challenge({ prompt: `What is ${a}/${a + b} as a decimal? Round to 3 places.`, expected: (a / (a + b)).toFixed(3), hint: "Divide the numerator by the denominator.", kind: "numeric" });
    }
    return challenge({ prompt: `What is the greatest common divisor of ${a * b} and ${a * (b + 1)}?`, expected: String(a), hint: "List or factor both numbers.", kind: "numeric" });
  }
  if (lesson.adapter === "graph") return challenge({ prompt: `For f(x)=${a}x+${b}, find f(2).`, expected: String(a * 2 + b), hint: "Use the linked table or substitute x = 2.", kind: "numeric" });
  if (lesson.adapter === "algebra-cas" || lesson.adapter === "cas") return challenge({ prompt: `Evaluate ${a}x+${b} when x=3.`, expected: String(a * 3 + b), hint: "Substitute 3 for x before simplifying.", kind: "numeric" });
  if (lesson.adapter === "geometry2d") return challenge({ prompt: `Find the distance from (0,0) to (${a},${b}). Round to 3 places.`, expected: Math.hypot(a, b).toFixed(3), hint: "Use √(x²+y²).", kind: "numeric" });
  if (lesson.adapter === "vector") return challenge({ prompt: `Find (${a},${b}) · (2,1).`, expected: String(2 * a + b), hint: "Multiply corresponding components, then add.", kind: "numeric" });
  if (lesson.adapter === "trigonometry") return challenge({ prompt: "What is sin(30°)?", expected: "0.5", hint: "Read the vertical coordinate on the unit circle.", kind: "numeric" });
  if (lesson.adapter === "calculus") return challenge({ prompt: `For f(x)=${a}x², find f′(2).`, expected: String(4 * a), hint: "Differentiate first, then substitute x = 2.", kind: "numeric" });
  if (lesson.adapter === "spreadsheet") return challenge({ prompt: `What is the mean of ${a} and ${b}?`, expected: String((a + b) / 2), hint: "Add the values and divide by 2.", kind: "numeric" });
  if (lesson.adapter === "statistics") return challenge({ prompt: `Find the range of ${b}, ${a + b}, ${a * 2 + b}.`, expected: String(a * 2), hint: "Subtract the minimum from the maximum.", kind: "numeric" });
  if (lesson.adapter === "probability") return challenge({ prompt: "For a fair coin, what is P(heads)?", expected: "0.5", hint: "There is one favourable result among two equally likely results.", kind: "numeric" });
  if (lesson.adapter === "inference") return challenge({ prompt: "A fair die has population mean 3.5. Enter that mean.", expected: "3.5", hint: "Average the six faces 1 through 6.", kind: "numeric" });
  if (lesson.adapter === "sequence") return challenge({ prompt: `For an arithmetic sequence with first term ${a} and difference ${b}, find term 4.`, expected: String(a + 3 * b), hint: "Use aₙ = a + (n−1)d.", kind: "numeric" });
  if (lesson.adapter === "matrix") return challenge({ prompt: `Find det([[${a},1],[${b},2]]).`, expected: String(2 * a - b), hint: "For a 2×2 matrix, determinant is ad−bc.", kind: "numeric" });
  if (lesson.adapter === "complex") return challenge({ prompt: "Find the modulus of 3+4i.", expected: "5", hint: "Use √(3²+4²).", kind: "numeric" });
  if (lesson.adapter === "geometry3d") return challenge({ prompt: `Find the volume of a cube with side ${a}.`, expected: String(a ** 3), hint: "Cube the side length.", kind: "numeric" });
  if (lesson.adapter === "discrete") return challenge({ prompt: `How many ways can 2 objects be chosen from ${a}?`, expected: String((a * (a - 1)) / 2), hint: "Use n(n−1)/2.", kind: "numeric" });
  if (lesson.adapter === "finance") return challenge({ prompt: `Find one year of simple interest on ₹${a * 100} at ${b}%.`, expected: String(a * b), hint: "Use principal × rate ÷ 100.", kind: "numeric" });
  if (lesson.adapter === "authoring") {
    return challenge({ prompt: "Use the live control, then enter the word linked.", expected: "linked", hint: "The preview must respond to the control.", kind: "interaction" });
  }
  if (lesson.adapter === "learning") {
    return challenge({ prompt: "Run the activity, then enter predict-test-explain.", expected: "predict-test-explain", hint: "Name the three-part reasoning cycle.", kind: "interaction" });
  }
  return challenge({ prompt: "Try the capability, then enter accessible.", expected: "accessible", hint: "The lesson is testing an inclusive interaction.", kind: "interaction" });
}

export function checkLessonAnswer(challenge: LessonChallenge, answer: string, interacted: boolean): LessonCheckResult {
  const normalized = answer.trim().toLowerCase().replace(/[–—\s]+/g, "-");
  if (!normalized) return { correct: false, feedback: "Enter an answer before checking." };
  if (!interacted) return { correct: false, feedback: "Complete the lesson's primary interaction first, then check your answer." };
  if (challenge.kind === "numeric") {
    const actual = Number(normalized);
    const expected = Number(challenge.expected);
    const tolerance = Math.max(1e-6, Math.abs(expected) * 1e-3);
    const correct = Number.isFinite(actual) && Math.abs(actual - expected) <= tolerance;
    return { correct, feedback: correct ? "Correct — the live model and calculation agree." : `Not yet. ${challenge.hint}` };
  }
  const correct = normalized === challenge.expected.toLowerCase();
  return { correct, feedback: correct ? "Correct — you completed the interaction and identified the idea." : `Not yet. ${challenge.hint}` };
}

function createSpecificChallenge(lesson: LessonDefinition, history: LessonInteractionEvent[]): LessonChallenge | null {
  const event = latestLessonEvidence(history, lesson.contract.requiredControlIds);
  const state = isRecord(event?.after) ? event.after : {};
  const make = (prompt: string, expected: string, hint: string, kind: LessonChallenge["kind"] = "numeric"): LessonChallenge => ({ prompt, expected, hint, kind, factoryId: lesson.contract.challengeFactory });
  if (typeof state.challengePrompt === "string" && typeof state.challengeExpected === "string" && typeof state.challengeHint === "string") {
    const kind = state.challengeKind === "keywords" || state.challengeKind === "interaction" ? state.challengeKind : "numeric";
    return make(state.challengePrompt, state.challengeExpected, state.challengeHint, kind);
  }
  if (lesson.id === 443) return make("Using the displayed Euler step, what is the next y-value?", numberState(state, "nextY", 1.25).toFixed(3), "Use y₁ = y₀ + h·f(x₀,y₀).");
  if (lesson.id === 359) return make("What scale factor λ is shown for the closest eigen-direction?", numberState(state, "eigenvalue", 2).toFixed(3), "Read λ from Av = λv for the highlighted invariant direction.");
  if (lesson.id === 404) return make("Which cube face corresponds to the selected net face?", stringState(state, "pairedFace", "front"), "Use the matching label shared by the solid and net.", "keywords");
  if (lesson.id === 480) return make("What is the current interquartile range?", numberState(state, "iqr", 4).toFixed(3), "Subtract Q1 from Q3.");
  if (lesson.id === 576) return make("How many adjacent-color conflicts remain?", String(numberState(state, "conflictCount", 0)), "Count highlighted conflicting edges.");
  if (lesson.id === 582) return make("How many values satisfy the active set-builder rule?", String(numberState(state, "computedCount", 5)), "Count the highlighted members in the computed set.");
  if (lesson.id === 583) return make("What is the cardinality of the selected set-operation result?", String(numberState(state, "resultCount", 0)), "Count the elements in the displayed roster.");
  if (lesson.id === 586) return make("How many subsets are in the displayed power set?", String(numberState(state, "powerCount", 16)), "A set with n elements has 2ⁿ subsets.");
  if (lesson.id === 587) return make("Classify the active proposition: tautology, contradiction, or contingency.", stringState(state, "classification", "contingency"), "Check whether all, none, or only some result rows are true.", "keywords");
  if (lesson.id === 588) return make("Enter true or false for the highlighted connective result.", stringState(state, "result", "true"), "Apply the selected connective to the current p and q values.", "keywords");
  if (lesson.id === 589) return make("Enter the displayed witness or counterexample value.", stringState(state, "evidence", "0"), "Use the first highlighted domain member that proves or disproves the statement.", "keywords");
  if (lesson.id === 591) return make("What simple interest I is shown for the active assumptions?", numberState(state, "interest", 1200).toFixed(2), "Use I = P × r × t with r written as a decimal.");
  return null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function numberState(state: Record<string, unknown>, key: string, fallback: number) {
  const value = state[key];
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function stringState(state: Record<string, unknown>, key: string, fallback: string) {
  const value = state[key];
  return typeof value === "boolean" ? String(value) : typeof value === "string" && value.trim() ? value : fallback;
}
