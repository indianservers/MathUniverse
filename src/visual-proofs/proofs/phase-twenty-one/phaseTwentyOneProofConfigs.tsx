import type { PhaseTwoProofConfig, PhaseTwoValues } from "../../components/PhaseTwoProofExperience";
import {
  ComplexAdditionVisual,
  ComplexConjugateVisual,
  ComplexMultiplicationVisual,
  ComplexPlanePointVisual,
  EulerFormVisual,
  ModulusArgumentVisual,
  MultiplicationByIVisual,
  RootsOfUnityVisual,
} from "./PhaseTwentyOneComplexVisualModels";

type Complex = { re: number; im: number };

const labelsToggle = { id: "labels", label: "Show labels", defaultValue: true };
const complexRoute = "/olympyard/practice/complex-numbers-foundations";
const singleComplexParams = [param("a", "real part a", -5, 5, 2.4, 0.1), param("b", "imaginary part b", -5, 5, 1.8, 0.1)];
const twoComplexParams = [
  param("a", "z1 real a", -4, 4, 2, 0.1),
  param("b", "z1 imaginary b", -4, 4, 1.2, 0.1),
  param("c", "z2 real c", -4, 4, 1.1, 0.1),
  param("d", "z2 imaginary d", -4, 4, 1.7, 0.1),
];

export const complexPlanePointPhaseTwentyOneConfig = makeConfig({
  modelKey: "real-imag-plane-point",
  steps: ["Draw complex plane", "Choose real part a", "Choose imaginary part b", "Plot z = a + bi", "Read components", "Conclude plane representation"],
  parameters: singleComplexParams,
  prediction: ["What does the imaginary part b represent on the complex plane?", "The vertical coordinate."],
  misconception: ["Imaginary numbers cannot be drawn.", "Complex numbers are drawn as points or vectors on a plane, with imaginary part on the vertical axis."],
  tokens: ["a", "bi", "z", "coordinate-pair"],
  formula: ({ a, b }) => `z = a + bi = ${fmt(a)} ${b < 0 ? "-" : "+"} ${fmt(Math.abs(b))}i corresponds to (${fmt(a)}, ${fmt(b)})`,
  liveValues: ({ a, b }) => [value("real-part-a", "real part a", fmt(a)), value("imaginary-part-b", "imaginary part b", fmt(b)), value("coordinate-point", "coordinate point", `(${fmt(a)}, ${fmt(b)})`), value("quadrant", "quadrant", quadrant(c(a, b))), value("invariant", "invariant", "z = a + bi maps to (a,b)")],
  invariant: () => "The real part is horizontal and the imaginary part is vertical.",
  renderVisual: ComplexPlanePointVisual,
});

export const modulusArgumentPhaseTwentyOneConfig = makeConfig({
  modelKey: "modulus-argument",
  steps: ["Plot z", "Draw component triangle", "Measure distance from origin", "Measure angle", "Connect to formula", "Conclude modulus and argument"],
  parameters: singleComplexParams,
  prediction: ["What happens to |z| if z moves farther from the origin?", "The modulus increases."],
  misconception: ["Argument is the same thing as imaginary part.", "Argument is the angle of the complex number from the positive real axis."],
  tokens: ["modulus", "component-squares", "arg-z", "theta"],
  formula: ({ a, b }) => `|z| = sqrt(a^2+b^2) = ${fmt(mod(c(a, b)))} and arg(z) = theta = ${fmt(argDeg(c(a, b)))} deg`,
  liveValues: ({ a, b }) => [value("a", "a", fmt(a)), value("b", "b", fmt(b)), value("modulus", "modulus", fmt(mod(c(a, b)))), value("argument-degrees", "argument degrees", `${fmt(argDeg(c(a, b)))} deg`), value("argument-radians", "argument radians", `${fmt(argRad(c(a, b)))} rad`), value("quadrant", "quadrant", quadrant(c(a, b))), value("invariant", "invariant", "modulus follows distance formula")],
  invariant: () => "The modulus is distance from the origin; the argument is direction angle.",
  renderVisual: ModulusArgumentVisual,
});

export const complexAdditionPhaseTwentyOneConfig = makeConfig({
  modelKey: "component-vector-addition",
  steps: ["Draw z1", "Draw z2", "Move z2 tip-to-tail", "Draw resultant", "Add components", "Conclude complex addition"],
  parameters: twoComplexParams,
  prediction: ["How do we add complex numbers geometrically?", "Like vectors: add real parts and imaginary parts, or use tip-to-tail addition."],
  misconception: ["Complex addition multiplies lengths and adds angles.", "Addition is component-wise; multiplication is where rotation-scaling appears."],
  tokens: ["a-plus-c", "b-plus-d", "z1", "z2", "z1-plus-z2"],
  formula: ({ a, b, c: real2, d }) => `(a+bi)+(c+di) = (a+c)+(b+d)i = ${fmt(a + real2)} ${b + d < 0 ? "-" : "+"} ${fmt(Math.abs(b + d))}i`,
  liveValues: ({ a, b, c: real2, d }) => {
    const result = c(a + real2, b + d);
    return [value("z1-real-imag", "z1 real/imag", complex(c(a, b))), value("z2-real-imag", "z2 real/imag", complex(c(real2, d))), value("result-real-imag", "result real/imag", complex(result)), value("result-modulus", "result modulus", fmt(mod(result))), value("result-argument", "result argument", `${fmt(argDeg(result))} deg`), value("invariant", "invariant", "complex addition is component-wise vector addition")];
  },
  invariant: () => "Complex addition is the same component-wise vector addition used on the plane.",
  renderVisual: ComplexAdditionVisual,
});

export const complexMultiplicationPhaseTwentyOneConfig = makeConfig({
  modelKey: "rotation-scaling",
  steps: ["Plot z1 in polar form", "Plot z2 in polar form", "Multiply lengths", "Add angles", "Draw product vector", "Conclude rotation-scaling rule"],
  parameters: twoComplexParams,
  prediction: ["What happens to the arguments when multiplying complex numbers?", "They add."],
  misconception: ["Complex multiplication is just component-wise multiplication.", "Complex multiplication rotates and scales; in polar form, lengths multiply and angles add."],
  tokens: ["r1-r2", "theta1-plus-theta2", "z1-z2-product", "cis"],
  formula: (values) => {
    const z1 = c(values.a, values.b);
    const z2 = c(values.c, values.d);
    const product = multiply(z1, z2);
    return `z1z2 = r1r2 cis(theta1+theta2) = ${complex(product)}`;
  },
  liveValues: (values) => {
    const z1 = c(values.a, values.b);
    const z2 = c(values.c, values.d);
    const product = multiply(z1, z2);
    return [value("r1", "r1", fmt(mod(z1))), value("theta1", "theta1", `${fmt(argDeg(z1))} deg`), value("r2", "r2", fmt(mod(z2))), value("theta2", "theta2", `${fmt(argDeg(z2))} deg`), value("product-modulus", "product modulus", fmt(mod(product))), value("product-argument", "product argument", `${fmt(argDeg(product))} deg`), value("product-rectangular", "product rectangular", complex(product)), value("invariant", "invariant", "multiplication multiplies moduli and adds arguments")];
  },
  invariant: () => "In polar form, complex multiplication multiplies lengths and adds angles.",
  renderVisual: ComplexMultiplicationVisual,
});

export const multiplicationByIPhaseTwentyOneConfig = makeConfig({
  modelKey: "ninety-degree-rotation",
  steps: ["Plot z", "Multiply by i", "Rotate vector by 90 degrees", "Read new coordinates", "Compare lengths", "Conclude i as rotation"],
  parameters: singleComplexParams,
  prediction: ["What does multiplying by i do geometrically?", "It rotates the complex number 90 degrees counterclockwise."],
  misconception: ["Multiplying by i only changes the imaginary part.", "It rotates the whole point/vector, changing both coordinates according to (a,b) -> (-b,a)."],
  tokens: ["i", "a-plus-bi", "negative-b-plus-ai", "ninety-degrees"],
  formula: ({ a, b }) => `i(a+bi) = -b+ai = ${fmt(-b)} ${a < 0 ? "-" : "+"} ${fmt(Math.abs(a))}i`,
  liveValues: ({ a, b }) => {
    const z = c(a, b);
    const iz = c(-b, a);
    return [value("z-real-imag", "z real/imag", complex(z)), value("iz-real-imag", "iz real/imag", complex(iz)), value("original-argument", "original argument", `${fmt(argDeg(z))} deg`), value("rotated-argument", "rotated argument", `${fmt(argDeg(iz))} deg`), value("modulus-before-after", "modulus before/after", `${fmt(mod(z))} / ${fmt(mod(iz))}`), value("invariant", "invariant", "multiplication by i preserves modulus and adds 90 degrees")];
  },
  invariant: () => "Multiplication by i is a 90 degree counterclockwise rotation.",
  renderVisual: MultiplicationByIVisual,
});

export const complexConjugatePhaseTwentyOneConfig = makeConfig({
  modelKey: "real-axis-reflection",
  steps: ["Plot z", "Draw real-axis mirror", "Reflect z", "Compare coordinates", "Check product with conjugate", "Conclude conjugate rule"],
  parameters: singleComplexParams,
  prediction: ["What happens to the imaginary part when taking conjugate?", "It changes sign."],
  misconception: ["Conjugate means changing both signs.", "Only the imaginary part changes sign; the real part stays the same."],
  tokens: ["a", "bi-to-negative-bi", "zbar", "real-axis"],
  formula: ({ a, b }) => `If z = ${complex(c(a, b))}, then zbar = ${complex(c(a, -b))} and z zbar = |z|^2 = ${fmt(mod(c(a, b)) ** 2)}`,
  liveValues: ({ a, b }) => [value("z", "z", complex(c(a, b))), value("conjugate", "conjugate", complex(c(a, -b))), value("real-part", "real part", fmt(a)), value("imaginary-part", "imaginary part", fmt(b)), value("product-z-zbar", "product z zbar", fmt(mod(c(a, b)) ** 2)), value("modulus-squared", "|z|^2", fmt(mod(c(a, b)) ** 2)), value("invariant", "invariant", "conjugation reflects across real axis")],
  invariant: () => "Conjugation reflects a complex number across the real axis.",
  renderVisual: ComplexConjugateVisual,
});

export const rootsOfUnityPhaseTwentyOneConfig = makeConfig({
  modelKey: "root-count-unit-circle",
  steps: ["Draw unit circle", "Choose n", "Divide full turn into n equal angles", "Plot roots", "Highlight selected root", "Conclude roots of unity"],
  parameters: [param("n", "root count n", 2, 12, 6, 1), param("k", "selected k", 0, 11, 1, 1)],
  prediction: ["How are the n roots of unity spaced on the circle?", "Equally spaced by angle 2pi/n."],
  misconception: ["z^n = 1 has only the real solution 1.", "Over complex numbers, it has n roots on the unit circle."],
  tokens: ["z-power-n-equals-one", "two-pi-k-over-n", "cis-angle", "n-roots"],
  formula: ({ n, k }) => {
    const count = Math.round(n);
    const selected = Math.max(0, Math.min(count - 1, Math.round(k)));
    return `z_k = cis(2pi k/n), k=0,...,n-1; selected angle = ${fmt((360 * selected) / count)} deg`;
  },
  liveValues: ({ n, k }) => {
    const count = Math.round(n);
    const selected = Math.max(0, Math.min(count - 1, Math.round(k)));
    const root = cis((2 * Math.PI * selected) / count);
    return [value("n", "n", count), value("k", "k", selected), value("selected-angle", "selected angle", `${fmt((360 * selected) / count)} deg`), value("selected-root", "selected root", complex(root)), value("root-count", "root count", count), value("invariant", "invariant", "roots are equally spaced on unit circle")];
  },
  invariant: () => "The n roots of unity divide the unit circle into n equal angles.",
  renderVisual: RootsOfUnityVisual,
});

export const eulerFormPhaseTwentyOneConfig = makeConfig({
  modelKey: "cos-sin-unit-circle",
  steps: ["Draw unit circle", "Pick angle theta", "Locate point on circle", "Read cos theta and sin theta", "Write cos theta + i sin theta", "Conclude Euler form"],
  parameters: [param("theta", "theta", -3.14, 3.14, 0.9, 0.05)],
  prediction: ["What is the modulus of e^{i theta}?", "1."],
  misconception: ["e^{i theta} is a mysterious exponential unrelated to the unit circle.", "Euler form gives the unit-circle point with coordinates cos theta and sin theta."],
  tokens: ["e-i-theta", "cos-theta", "i-sin-theta", "theta"],
  formula: ({ theta }) => `e^{i theta} = cos theta + i sin theta = ${fmt(Math.cos(theta))} ${Math.sin(theta) < 0 ? "-" : "+"} ${fmt(Math.abs(Math.sin(theta)))}i`,
  liveValues: ({ theta }) => {
    const z = cis(theta);
    return [value("theta-degrees", "theta degrees", `${fmt(theta * 180 / Math.PI)} deg`), value("theta-radians", "theta radians", `${fmt(theta)} rad`), value("cos-theta", "cos theta", fmt(z.re)), value("sin-theta", "sin theta", fmt(z.im)), value("complex-form", "complex form", complex(z)), value("modulus", "modulus", fmt(mod(z))), value("argument", "argument", `${fmt(argDeg(z))} deg`), value("invariant", "invariant", "e^{i theta} lies on unit circle with modulus 1")];
  },
  invariant: () => "Euler form is the unit-circle point with coordinates cos theta and sin theta.",
  renderVisual: EulerFormVisual,
});

export const phaseTwentyOneRouteSlugs = [
  ["complex-numbers", "complex-number-plane-point"],
  ["complex-numbers", "modulus-and-argument"],
  ["complex-numbers", "complex-addition-vector"],
  ["complex-numbers", "complex-multiplication-rotation-scaling"],
  ["complex-numbers", "multiplication-by-i-rotation"],
  ["complex-numbers", "complex-conjugate-reflection"],
  ["complex-numbers", "roots-of-unity"],
  ["complex-numbers", "euler-form-unit-circle"],
] as const;

export const phaseTwentyOneConfigs = [
  complexPlanePointPhaseTwentyOneConfig,
  modulusArgumentPhaseTwentyOneConfig,
  complexAdditionPhaseTwentyOneConfig,
  complexMultiplicationPhaseTwentyOneConfig,
  multiplicationByIPhaseTwentyOneConfig,
  complexConjugatePhaseTwentyOneConfig,
  rootsOfUnityPhaseTwentyOneConfig,
  eulerFormPhaseTwentyOneConfig,
];

type ConfigInput = {
  modelKey: string;
  steps: string[];
  parameters: PhaseTwoProofConfig["parameters"];
  prediction: [string, string];
  misconception: [string, string];
  tokens: string[];
  formula: PhaseTwoProofConfig["formula"];
  liveValues: PhaseTwoProofConfig["liveValues"];
  invariant: (values: PhaseTwoValues) => string;
  renderVisual: PhaseTwoProofConfig["renderVisual"];
};

function makeConfig(input: ConfigInput): PhaseTwoProofConfig & { phaseTwentyOneModelKey: string } {
  return {
    phaseTwentyOneModelKey: input.modelKey,
    steps: input.steps.map(step),
    parameters: input.parameters,
    toggles: [labelsToggle],
    olympyardRoute: complexRoute,
    prediction: prompt(input.prediction[0], input.prediction[1]),
    misconception: misconception(input.misconception[0], input.misconception[1]),
    formulaTokens: () => input.tokens.map((token) => ({ id: token, label: tokenLabel(token), visualLabel: tokenVisualLabel(token) })),
    formula: input.formula,
    explanation: (values) => input.invariant(values),
    liveValues: input.liveValues,
    invariants: (values) => [{ id: `complex-${input.modelKey}-invariant`, label: "complex invariant", holds: true, explanation: input.invariant(values) }],
    assumptions: ["Browser-only SVG complex-plane model.", "Coordinates and counts are bounded to keep labels readable on mobile.", "Rounded values support classroom intuition while formulas preserve the complex-number relationship."],
    renderVisual: input.renderVisual,
  };
}

function param(id: string, label: string, min: number, max: number, defaultValue: number, step = 1) {
  return { id, label, min, max, defaultValue, step };
}
function value(id: string, label: string, item: number | string) { return { id, label, value: item }; }
function step(title: string, index: number) { return { id: `p21-${index}`, title, description: title, focusLabel: index < 2 ? "complex plane setup" : index < 5 ? "complex relation" : "conclusion" }; }
function prompt(question: string, answer: string) {
  return { question, correctFeedback: `Yes. ${answer}`, incorrectFeedback: "Use the complex-plane visual before choosing.", revealAfterAnswer: true, options: [{ id: "correct", label: answer, correct: true, feedback: "Correct." }, { id: "shortcut", label: "Use only a memorized rule.", feedback: "The complex-plane visual explains why the rule works." }] };
}
function misconception(question: string, explanation: string) {
  return { question, explanation, visualHint: "Highlight the connected complex-plane point, vector, angle, or unit-circle feature.", options: [{ id: "visual", label: "Use the complex-plane model.", correct: true, feedback: "Correct." }, { id: "symbol-only", label: "Ignore the plane geometry.", feedback: "Complex plane geometry gives the formula its meaning." }] };
}

function tokenLabel(token: string) {
  const labels: Record<string, string> = {
    a: "a", bi: "bi", z: "z", "coordinate-pair": "(a,b)",
    modulus: "|z|", "component-squares": "a^2+b^2", "arg-z": "arg(z)", theta: "theta",
    "a-plus-c": "a+c", "b-plus-d": "b+d", z1: "z1", z2: "z2", "z1-plus-z2": "z1+z2",
    "r1-r2": "r1r2", "theta1-plus-theta2": "theta1+theta2", "z1-z2-product": "z1z2", cis: "cis",
    i: "i", "a-plus-bi": "a+bi", "negative-b-plus-ai": "-b+ai", "ninety-degrees": "90 degrees",
    "bi-to-negative-bi": "bi -> -bi", zbar: "zbar", "real-axis": "real axis",
    "z-power-n-equals-one": "z^n = 1", "two-pi-k-over-n": "2pi k/n", "cis-angle": "cis(...)", "n-roots": "n roots",
    "e-i-theta": "e^{i theta}", "cos-theta": "cos theta", "i-sin-theta": "i sin theta",
  };
  return labels[token] ?? token.replace(/-/g, " ");
}

function tokenVisualLabel(token: string) {
  if (token === "a" || token === "bi" || token === "z" || token.includes("coordinate")) return "complex point and components";
  if (token.includes("modulus") || token.includes("arg") || token === "theta" || token.includes("squares")) return "polar radius and argument";
  if (token.includes("plus") || token === "z1" || token === "z2") return "complex addition vectors";
  if (token.includes("r1") || token.includes("theta1") || token.includes("product") || token === "cis") return "rotation-scaling product";
  if (token === "i" || token.includes("ninety") || token.includes("negative-b")) return "90 degree rotation arc";
  if (token.includes("zbar") || token.includes("real-axis") || token.includes("negative-bi")) return "real-axis reflection";
  if (token.includes("root") || token.includes("two-pi") || token.includes("z-power")) return "unit-circle roots";
  if (token.includes("cos") || token.includes("sin") || token.includes("e-i")) return "Euler unit-circle coordinates";
  return "complex-plane visual feature";
}

function c(re: number, im: number): Complex { return { re, im }; }
function multiply(a: Complex, b: Complex): Complex { return { re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re }; }
function mod(z: Complex) { return Math.hypot(z.re, z.im); }
function argRad(z: Complex) { return Math.atan2(z.im, z.re); }
function argDeg(z: Complex) { return argRad(z) * 180 / Math.PI; }
function cis(theta: number): Complex { return c(Math.cos(theta), Math.sin(theta)); }
function quadrant(z: Complex) {
  if (Math.abs(z.re) < 0.001 && Math.abs(z.im) < 0.001) return "origin";
  if (Math.abs(z.re) < 0.001) return "imaginary axis";
  if (Math.abs(z.im) < 0.001) return "real axis";
  return z.re > 0 && z.im > 0 ? "I" : z.re < 0 && z.im > 0 ? "II" : z.re < 0 && z.im < 0 ? "III" : "IV";
}
function complex(z: Complex) { return `${fmt(z.re)} ${z.im < 0 ? "-" : "+"} ${fmt(Math.abs(z.im))}i`; }
function fmt(item: number) { return Number.isFinite(item) ? item.toFixed(2).replace(/0+$/, "").replace(/\.$/, "") : "0"; }
