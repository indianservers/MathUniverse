import { useEffect, useMemo, useState } from "react";
import SliderControl from "../../../components/ui/SliderControl";
import { symbolicCompleteSquare, symbolicExpand, symbolicFactor, symbolicSimplify, symbolicSolve, symbolicSolveInequality, symbolicSubstitute, type SymbolicResult } from "../../../utils/symbolic";
import AdapterFrame from "../components/AdapterFrame";
import type { LessonAdapterProps } from "../types";
import { AlgebraConceptWorkspace } from "./AlgebraLessonAdapter";
import AlgebraTilesTargetLesson92 from "./AlgebraTilesTargetLesson92";
import LikeTermsTargetLesson93 from "./LikeTermsTargetLesson93";
import SubstitutionTargetLesson94 from "./SubstitutionTargetLesson94";
import ExpandingBracketsTargetLesson95 from "./ExpandingBracketsTargetLesson95";
import DoubleBracketsTargetLesson96 from "./DoubleBracketsTargetLesson96";
import FactorisationTargetLesson97 from "./FactorisationTargetLesson97";
import AlgebraicFractionsTargetLesson98 from "./AlgebraicFractionsTargetLesson98";
import IndicesTargetLesson99 from "./IndicesTargetLesson99";
import SurdsTargetLesson100 from "./SurdsTargetLesson100";
import RationalisationTargetLesson101 from "./RationalisationTargetLesson101";
import PolynomialOperationsTargetLesson102 from "./PolynomialOperationsTargetLesson102";
import SyntheticDivisionTargetLesson103 from "./SyntheticDivisionTargetLesson103";
import RemainderTheoremTargetLesson104 from "./RemainderTheoremTargetLesson104";
import FactorTheoremTargetLesson105 from "./FactorTheoremTargetLesson105";
import IdentitiesTargetLesson106 from "./IdentitiesTargetLesson106";
import OneStepEquationsTargetLesson107 from "./OneStepEquationsTargetLesson107";

function run(title: string, coefficient: number): { input: string; output: SymbolicResult } {
  const name = title.toLowerCase();
  const specific = runStrengthenedAlgebra(name, coefficient);
  if (specific) return specific;
  if (name.includes("algebraic fraction")) {
    const input = `(x^2-${coefficient ** 2})/(x-${coefficient})`;
    return {
      input,
      output: {
        result: `x+${coefficient}, x!=${coefficient}`,
        detail: `Factor the numerator, cancel only the common factor, and keep x != ${coefficient}.`,
        steps: [
          `Start with ${input}.`,
          `The original denominator x-${coefficient} cannot be 0, so x != ${coefficient}.`,
          `Factor the numerator: x^2-${coefficient ** 2} = (x-${coefficient})(x+${coefficient}).`,
          `Cancel only the common factor x-${coefficient}; do not cancel terms across addition.`,
          `The simplified expression is x+${coefficient}, with restriction x != ${coefficient}.`,
        ],
      },
    };
  }
  if (name.includes("inequal")) { const input = `${coefficient}*x+2>8`; return { input, output: symbolicSolveInequality(input) }; }
  if (name.includes("equation") || name.includes("formula") || name.includes("root")) { const input = `${coefficient}*x+2=8`; return { input, output: symbolicSolve(input) }; }
  if (name.includes("factor")) { const input = `x^2+${coefficient + 2}*x+${coefficient * 2}`; return { input, output: symbolicFactor(input) }; }
  if (name.includes("expand") || name.includes("bracket")) { const input = `(x+${coefficient})*(x+2)`; return { input, output: symbolicExpand(input) }; }
  if (name.includes("substitut")) { const input = `${coefficient}*x^2+2*x`; return { input, output: symbolicSubstitute(input, [{ name: "x", value: "3" }]) }; }
  if (name.includes("square")) { const input = `x^2+${coefficient * 2}*x+1`; return { input, output: symbolicCompleteSquare(input) }; }
  const input = `${coefficient}*x+2*x-x+4-2`; return { input, output: symbolicSimplify(input) };
}

function runStrengthenedAlgebra(name: string, coefficient: number): { input: string; output: SymbolicResult } | null {
  const c = coefficient;
  const model = (
    input: string,
    result: string,
    detail: string,
    steps: string[],
  ): { input: string; output: SymbolicResult } => ({ input, output: { result, detail, steps } });
  if (name.includes("algebra tiles")) return model(`${c}x+${c + 1}x-2`, `${2 * c + 1}x-2`, "Combine only matching x tiles and unit tiles.", ["Build x tiles and unit tiles.", `Combine x terms: ${c}x + ${c + 1}x = ${2 * c + 1}x.`, "Keep the unit term separate.", `Result: ${2 * c + 1}x - 2.`]);
  if (name.includes("like terms")) return model(`${c}x+2x+3-${c - 1}`, `${c + 2}x+${4 - c}`, "Like terms have the same variable part and power.", ["Group x terms with x terms.", `Add coefficients: ${c} + 2 = ${c + 2}.`, `Combine constants: 3 - ${c - 1} = ${4 - c}.`, "Do not combine x with constants."]);
  if (name.includes("substitution")) return model(`${c}x+1, x=3`, `${3 * c + 1}`, "Replace the variable with the chosen value, then follow order of operations.", [`Replace x with 3 in ${c}x+1.`, `Compute ${c}*3 + 1.`, `The value is ${3 * c + 1}.`]);
  if (name.includes("expanding brackets")) return model(`${c}(x+3)`, `${c}x+${3 * c}`, "The outside factor multiplies every term inside.", [`Multiply ${c} by x.`, `Multiply ${c} by 3.`, `Result: ${c}x + ${3 * c}.`]);
  if (name.includes("double brackets")) return model(`(x+${c})(x+2)`, `x^2+${c + 2}x+${2 * c}`, "Each term in the first bracket multiplies each term in the second.", ["x times x gives x^2.", `The middle terms are 2x and ${c}x.`, `The constant term is ${2 * c}.`]);
  if (name.includes("factorisation")) return model(`x^2+${c + 3}x+${3 * c}`, `(x+${c})(x+3)`, "Factorisation rewrites a sum as a product.", [`Find numbers that multiply to ${3 * c} and add to ${c + 3}.`, `They are ${c} and 3.`, "Expand back to check."]);
  if (name.includes("indices")) return model(`x^${c}*x^2`, `x^${c + 2}`, "Same bases multiply by adding indices.", [`Read ${c} copies of x times 2 more copies.`, `Add powers: ${c} + 2 = ${c + 2}.`, "Keep the base x unchanged."]);
  if (name.includes("surds")) return model("sqrt(72)", "6sqrt(2)", "Use the largest square factor inside the root.", ["Write 72 = 36 x 2.", "sqrt(36) = 6.", "So sqrt(72) = 6sqrt(2)."]);
  if (name.includes("rationalisation")) return model(`1/sqrt(${c + 1})`, `sqrt(${c + 1})/${c + 1}`, "Multiply numerator and denominator by the same surd.", [`Multiply by sqrt(${c + 1})/sqrt(${c + 1}).`, `The denominator becomes ${c + 1}.`, "The value is unchanged because the multiplier equals 1."]);
  if (name.includes("polynomial operations")) return model(`(x^2+${c}x)+(2x+3)`, `x^2+${c + 2}x+3`, "Add polynomials by combining like powers.", ["Keep the x^2 term.", `Combine x terms: ${c}x + 2x = ${c + 2}x.`, "Keep the constant 3."]);
  if (name.includes("synthetic division")) return model(`(x^2+${c + 2}x+${2 * c})/(x+2)`, `x+${c}, remainder 0`, "Use -2 for divisor x+2 in synthetic division.", ["Use a = -2 because x+2 = x-(-2).", `The coefficients divide to quotient x+${c}.`, "The last synthetic value is remainder 0."]);
  if (name.includes("remainder theorem")) return model(`f(x)=x^2+${c}x+1, divide by x-2`, `${2 * c + 5}`, "The remainder after division by x-a is f(a).", ["Here a = 2.", `Compute f(2) = 4 + ${2 * c} + 1.`, `Remainder = ${2 * c + 5}.`]);
  if (name.includes("factor theorem")) return model(`f(x)=x^2-${c + 1}x+${c}`, "x-1 is a factor", "x-a is a factor exactly when f(a)=0.", ["Test a = 1.", `f(1)=1-${c + 1}+${c}=0.`, "So x-1 is a factor."]);
  if (name.includes("identities")) return model(`(x+${c})^2`, `x^2+${2 * c}x+${c ** 2}`, "The square identity is true for every allowed x.", ["Use (a+b)^2 = a^2 + 2ab + b^2.", `Middle term: 2*x*${c} = ${2 * c}x.`, `Last term: ${c}^2 = ${c ** 2}.`]);
  if (name.includes("one-step")) return model(`x+${c}=12`, `x=${12 - c}`, "Undo one operation on both sides.", [`Subtract ${c} from both sides.`, `x = ${12 - c}.`, "Check by substituting back."]);
  if (name.includes("multi-step")) return model(`2x+${c}=14`, `x=${(14 - c) / 2}`, "Undo addition first, then division.", [`Subtract ${c} from both sides.`, `2x = ${14 - c}.`, `Divide by 2: x = ${(14 - c) / 2}.`]);
  if (name.includes("equations with fractions")) return model(`x/${c}+1=5`, `x=${4 * c}`, "Clear the denominator by multiplying every term correctly.", ["Subtract 1 from both sides.", `x/${c} = 4.`, `Multiply by ${c}: x = ${4 * c}.`]);
  if (name.includes("literal equations")) return model("A=l*w, solve for w", "w=A/l, l!=0", "Other variables stay unless valid inverse steps remove them.", ["Divide both sides by l.", "w = A/l.", "State l != 0 because division by zero is not allowed."]);
  if (name.includes("simultaneous")) return model(`x+y=${c + 5}, x-y=1`, `x=${(c + 6) / 2}, y=${(c + 4) / 2}`, "The solution must satisfy both equations at once.", ["Add equations to remove y.", `2x = ${c + 6}.`, "Substitute x back to find y."]);
  if (name.includes("three-variable")) return model(`x+y+z=${c + 4}, x-y=1, z=2`, `x=${(c + 3) / 2}, y=${(c + 1) / 2}, z=2`, "Use one equation to reduce the system, then solve the smaller pair.", ["Use z = 2.", `Then x+y = ${c + 2}.`, "Solve with x-y = 1."]);
  if (name.includes("linear equations")) return model(`${c}x+2=${2 * c + 8}`, `x=${(2 * c + 6) / c}`, "A linear equation isolates a first-power variable.", ["Subtract 2 from both sides.", `${c}x = ${2 * c + 6}.`, `Divide by ${c}.`]);
  if (name.includes("quadratic equations")) return model(`x^2-${c + 3}x+${3 * c}=0`, `x=${c} or x=3`, "Factored quadratics use the zero product rule.", [`Factor as (x-${c})(x-3)=0.`, `Set x-${c}=0 or x-3=0.`, "List both roots."]);
  if (name.includes("polynomial equations")) return model(`(x-1)(x-2)(x-${c})=0`, `x=1, 2, ${c}`, "Every factor can give a root.", ["Use the zero product rule.", "Set each factor equal to zero.", "Check all roots in the product."]);
  if (name.includes("rational equations")) return model(`1/(x-${c})=2`, `x=${c + 0.5}, x!=${c}`, "State denominator restrictions before clearing fractions.", [`x cannot equal ${c}.`, `Multiply by x-${c}.`, `1 = 2x - ${2 * c}, so x = ${c + 0.5}.`]);
  if (name.includes("radical equations")) return model(`sqrt(x+${c})=${c + 2}`, `x=${(c + 2) ** 2 - c}`, "Square only after isolating the radical, then check.", ["Square both sides.", `x+${c} = ${(c + 2) ** 2}.`, `x = ${(c + 2) ** 2 - c}.`]);
  if (name.includes("exponential equations")) return model(`2^x=2^${c}`, `x=${c}`, "Equal positive bases have equal exponents.", ["The bases are both 2.", `So x = ${c}.`, "Do not divide the right side by the base."]);
  if (name.includes("logarithmic equations")) return model(`log_2(x)=${c}`, `x=${2 ** c}`, "Rewrite logarithmic form in exponential form.", [`log_2(x)=${c} means x=2^${c}.`, `Compute 2^${c} = ${2 ** c}.`, "Check x is positive."]);
  if (name.includes("trigonometric equations")) return model("sin(x)=1/2, 0<=x<360", "x=30 or 150 degrees", "Sine is positive in quadrants I and II.", ["Reference angle is 30 degrees.", "Use quadrants I and II.", "The solutions are 30 degrees and 150 degrees."]);
  if (name.includes("absolute-value")) return model(`|x-${c}|=2`, `x=${c - 2} or ${c + 2}`, "Distance can go left or right from the center.", [`x-${c}=2 or x-${c}=-2.`, `Solve both equations.`, "Check both distances equal 2."]);
  if (name.includes("linear inequalities")) return model(`${c}x+2>8`, `x>${6 / c}`, "Solve like a linear equation; flip signs only when multiplying or dividing by a negative.", ["Subtract 2 from both sides.", `${c}x > 6.`, `Divide by positive ${c}, so the sign stays the same.`]);
  if (name.includes("compound inequalities")) return model(`2<x<=${c + 4}`, `2<x<=${c + 4}`, "Compound inequalities use overlap for and statements.", ["Mark x greater than 2.", `Also mark x at most ${c + 4}.`, "Keep only the overlap and match endpoint circles."]);
  if (name.includes("quadratic inequalities")) return model(`(x-2)(x-${c + 3})>0`, `x<2 or x>${c + 3}`, "Quadratic inequalities need sign intervals, not roots only.", ["Find critical points 2 and the other root.", "Test each interval.", "Choose intervals where the product is positive."]);
  if (name.includes("polynomial inequalities")) return model(`(x+1)(x-2)(x-${c})>=0`, "use sign chart", "Polynomial inequalities are solved with roots and sign charts.", ["Mark all roots on a number line.", "Test signs between neighbouring roots.", "Include roots because equality is allowed."]);
  if (name.includes("two-variable inequalities")) return model(`y<${c}x+1`, "shade test-point side", "A two-variable inequality shades a half-plane.", ["Draw the boundary line.", "Use a dashed line for a strict sign.", "Test (0,0) to choose the shading side."]);
  if (name.includes("systems of inequalities")) return model(`y>=x and y<=${c + 2}`, "overlap region", "A system keeps points satisfying every inequality.", ["Shade each inequality.", "Find where the shaded regions overlap.", "That overlap is the feasible region."]);
  if (name.includes("numerical solver")) return model("x^3-x-1=0", "x approx 1.325", "A numerical solver gives an approximation that must be checked.", ["Find a sign change between 1 and 2.", "Improve the guess until the residual is small.", "Substitute the rounded answer back to check."]);
  return null;
}

export default function AlgebraCasLessonAdapter({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  if (lesson.id === 92) {
    return <AlgebraTilesTargetLesson92 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 93) {
    return <LikeTermsTargetLesson93 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 94) {
    return <SubstitutionTargetLesson94 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 95) {
    return <ExpandingBracketsTargetLesson95 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 96) {
    return <DoubleBracketsTargetLesson96 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 97) {
    return <FactorisationTargetLesson97 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 98) {
    return <AlgebraicFractionsTargetLesson98 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 99) {
    return <IndicesTargetLesson99 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 100) {
    return <SurdsTargetLesson100 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 101) {
    return <RationalisationTargetLesson101 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 102) {
    return <PolynomialOperationsTargetLesson102 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 103) {
    return <SyntheticDivisionTargetLesson103 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 104) {
    return <RemainderTheoremTargetLesson104 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 105) {
    return <FactorTheoremTargetLesson105 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 106) {
    return <IdentitiesTargetLesson106 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 107) {
    return <OneStepEquationsTargetLesson107 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.categorySlug === "algebra" && lesson.id >= 108 && lesson.id <= 128) {
    return <AlgebraConceptWorkspace lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }

  return <LegacyAlgebraCasLessonAdapter lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
}

function LegacyAlgebraCasLessonAdapter({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  const initial = lesson.id === 98 ? 2 : lesson.id % 4 + 2;
  const [coefficient, setCoefficient] = useState(initial);
  const [step, setStep] = useState(0);
  useEffect(() => { setCoefficient(initial); setStep(0); }, [initial, resetToken]);
  const model = useMemo(() => {
    try {
      return run(lesson.title, coefficient);
    } catch (error) {
      return { input: "x", output: { result: "Try another value", detail: error instanceof Error ? error.message : "CAS error", steps: [] } as SymbolicResult };
    }
  }, [coefficient, lesson.title]);
  const isAlgebraicFraction = lesson.id === 98;

  return <AdapterFrame title={`${lesson.title} - balance + CAS`} value={model.output.result} footer={isAlgebraicFraction ? "Algebraic fractions must keep original denominator restrictions after cancellation." : "The symbolic result and reveal steps come from the existing CAS engine, not string matching."}>
    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900">
        <p className="text-xs font-black uppercase text-slate-500">Expression</p>
        <div className="mt-3 flex min-h-28 items-center justify-center gap-3" aria-label={`Algebra model for ${model.input}`}>
          <div className="rounded-xl border-2 border-cyan-400 bg-cyan-100 px-5 py-4 font-mono font-black text-cyan-950">{model.input}</div>
          <span className="text-2xl font-black">-&gt;</span>
          <div className="rounded-xl border-2 border-emerald-400 bg-emerald-100 px-5 py-4 font-mono font-black text-emerald-950">{model.output.result}</div>
        </div>
        {isAlgebraicFraction ? <div className="mt-3 grid gap-2 sm:grid-cols-3"><MiniFact label="Excluded value" value={`x != ${coefficient}`} /><MiniFact label="Common factor" value={`x-${coefficient}`} /><MiniFact label="Valid cancel" value="factor only" /></div> : null}
        <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3 text-sm dark:border-white/10 dark:bg-slate-950">
          <span className="text-[10px] font-black uppercase text-cyan-600">Step {Math.min(step + 1, Math.max(1, model.output.steps.length))}</span>
          <p className="mt-1">{model.output.steps[step] ?? model.output.detail}</p>
        </div>
      </div>
      <div className="space-y-3">
        <SliderControl density="compact" label={isAlgebraicFraction ? "Excluded value a" : "Coefficient"} value={coefficient} min={1} max={8} step={1} onChange={(value) => { setCoefficient(value); setStep(0); onInteraction(); }} />
        <button type="button" className="action-secondary w-full justify-center" onClick={() => { setStep((value) => Math.min(value + 1, Math.max(0, model.output.steps.length - 1))); onInteraction(); }}>Reveal next step</button>
        <p className="rounded-xl bg-slate-100 p-3 font-mono text-sm dark:bg-white/10">{model.input}</p>
      </div>
    </div>
  </AdapterFrame>;
}

function MiniFact({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-white p-2 text-center dark:bg-white/10"><span className="block text-[10px] font-black uppercase text-slate-500">{label}</span><strong className="font-mono text-sm">{value}</strong></div>;
}
