export type IntegrationPreset = "substitution-cos-x2" | "by-parts-x-exp" | "partial-fractions" | "even-definite" | "odd-definite" | "area-between";

export function integrationPresetStepper(preset: IntegrationPreset) {
  const data: Record<IntegrationPreset, { expression: string; method: string; answer: string; verification: string; steps: string[] }> = {
    "substitution-cos-x2": {
      expression: "integral 2x cos(x^2) dx",
      method: "Substitution",
      answer: "sin(x^2) + C",
      verification: "d/dx sin(x^2) = 2x cos(x^2)",
      steps: ["Let u = x^2.", "Then du = 2x dx.", "Integral becomes integral cos(u) du.", "Answer is sin(u) + C = sin(x^2) + C."],
    },
    "by-parts-x-exp": {
      expression: "integral x e^x dx",
      method: "Integration by parts",
      answer: "x e^x - e^x + C",
      verification: "d/dx (x e^x - e^x) = x e^x",
      steps: ["Choose u = x and dv = e^x dx.", "Then du = dx and v = e^x.", "Use integral u dv = uv - integral v du.", "Answer is x e^x - e^x + C."],
    },
    "partial-fractions": {
      expression: "integral 1/(x^2 - 1) dx",
      method: "Partial fractions",
      answer: "1/2 ln|x - 1| - 1/2 ln|x + 1| + C",
      verification: "Differentiate the log expression to recover 1/(x^2 - 1).",
      steps: ["Factor x^2 - 1 = (x - 1)(x + 1).", "Write A/(x - 1) + B/(x + 1).", "Solve A = 1/2 and B = -1/2.", "Integrate each log term."],
    },
    "even-definite": {
      expression: "integral from -a to a of even f(x)",
      method: "Definite integral property",
      answer: "2 integral from 0 to a of f(x) dx",
      verification: "Mirror areas are equal on both sides of the y-axis.",
      steps: ["Check f(-x) = f(x).", "Split at 0.", "Match left and right areas.", "Double the right-half integral."],
    },
    "odd-definite": {
      expression: "integral from -a to a of odd f(x)",
      method: "Definite integral property",
      answer: "0",
      verification: "Positive and negative signed areas cancel.",
      steps: ["Check f(-x) = -f(x).", "Split at 0.", "Match equal opposite signed areas.", "Sum is 0."],
    },
    "area-between": {
      expression: "area between y = x and y = x^2 on [0, 1]",
      method: "Area between curves",
      answer: "1/6",
      verification: "integral_0^1 (x - x^2) dx = 1/2 - 1/3 = 1/6",
      steps: ["Find top curve: y = x.", "Find bottom curve: y = x^2.", "Integrate top minus bottom on [0, 1].", "Area = 1/6."],
    },
  };
  return data[preset];
}
