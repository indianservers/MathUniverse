export type VariableType = "Nominal" | "Ordinal" | "Discrete" | "Continuous";
export type VariableFamily = "Categorical" | "Numerical";
export type GraphType = "Bar chart" | "Pie chart" | "Dot plot" | "Histogram";
export interface Variable {
  id: string;
  label: string;
  sample: string;
  type: VariableType;
  explanation: string;
}
export const variableTypes: VariableType[] = ["Nominal", "Ordinal", "Discrete", "Continuous"];
export const graphTypes: GraphType[] = ["Bar chart", "Pie chart", "Dot plot", "Histogram"];
export const variables: Variable[] = [
  { id: "blood", label: "Blood type", sample: "A, B, AB, O", type: "Nominal", explanation: "Blood groups are labels with no natural order." },
  { id: "temperature", label: "Daily temperature (C)", sample: "18.6, 21.4, 19.1, ...", type: "Continuous", explanation: "Temperature is measured on a continuous scale, even when rounded." },
  { id: "rank", label: "Class rank", sample: "1st, 2nd, 3rd, ...", type: "Ordinal", explanation: "Ranks have an order, but adjacent ranks need not represent equal differences in attainment." },
  { id: "satisfaction", label: "Satisfaction rating (1-5)", sample: "1, 2, 3, 4, 5", type: "Ordinal", explanation: "These ratings are ordered categories; equal numerical gaps do not establish equal satisfaction gaps." },
  { id: "shirt", label: "Shirt size", sample: "S, M, L, XL", type: "Ordinal", explanation: "Sizes have a natural order without equal measurement intervals." },
  { id: "score", label: "Score in math (%)", sample: "62, 78, 91, 88; whole marks / 100", type: "Discrete", explanation: "Here scores are whole marks out of 100: only 101 percentages are possible. A percentage is not automatically continuous." },
  { id: "height", label: "Student height (cm)", sample: "132.5, 141.0, 158.2, ...", type: "Continuous", explanation: "Height is a measurement, not a count; recorded precision does not change its underlying type." },
  { id: "wait", label: "Wait time (minutes)", sample: "3.2, 7.5, 1.8, 9.1, ...", type: "Continuous", explanation: "Elapsed time can take values between any two recorded measurements." },
  { id: "siblings", label: "Number of siblings", sample: "0, 1, 2, 3, ...", type: "Discrete", explanation: "Siblings are counted in whole numbers." },
  { id: "pets", label: "Number of pets", sample: "0, 1, 2, 3, ...", type: "Discrete", explanation: "Pets are counted, so fractional counts are not possible." },
];
export const practiceVariables: Variable[] = [
  { id: "genre", label: "Favorite movie genre", sample: "One favorite per respondent", type: "Nominal", explanation: "Genres are unordered labels." },
  { id: "experience", label: "Years of experience", sample: "Measured duration, e.g. 2.7 years", type: "Continuous", explanation: "Elapsed duration is continuous; completed whole years would instead be discrete." },
  { id: "steps", label: "Daily steps taken", sample: "Total count each day", type: "Discrete", explanation: "Steps are counted in whole numbers." },
  { id: "rating", label: "Customer satisfaction (1-10)", sample: "Ordered response categories", type: "Ordinal", explanation: "A rating scale does not guarantee equal differences between responses." },
];
export function familyOf(type: VariableType): VariableFamily {
  return type === "Nominal" || type === "Ordinal" ? "Categorical" : "Numerical";
}
export function suitableGraphs(type: VariableType): GraphType[] {
  // These tasks concern distributions of one variable, not paired observations.
  if (type === "Nominal") return ["Bar chart", "Pie chart"];
  if (type === "Ordinal") return ["Bar chart", "Pie chart"];
  if (type === "Discrete") return ["Dot plot", "Bar chart", "Histogram"];
  return ["Histogram", "Dot plot"];
}
export function graphExplanation(type: VariableType, graph: GraphType): string {
  if (!suitableGraphs(type).includes(graph)) return familyOf(type) === "Categorical"
    ? "Category labels are not measured positions on a numerical axis. Compare category frequencies with a bar chart."
    : "Display these numerical observations on a number line or in numerical intervals.";
  if (graph === "Pie chart") return "Valid for mutually exclusive categories covering the whole sample. A bar chart makes ordered comparisons clearer.";
  if (graph === "Histogram" && type === "Discrete") return "Valid when counts are grouped into clearly defined numerical bins; a dot plot preserves individual counts.";
  if (graph === "Dot plot" && type === "Continuous") return "Valid for a small sample of measurements; a histogram summarizes a larger sample in intervals.";
  return "This graph preserves the variable's category or numerical structure.";
}
export interface Placement { family?: VariableFamily; graph?: GraphType }
export type Placements = Record<string, Placement>;
export function placeVariable(state: Placements, id: string, destination: VariableFamily | GraphType): Placements {
  if (!variables.some(variable => variable.id === id)) return state;
  const field = destination === "Categorical" || destination === "Numerical" ? "family" : "graph";
  return { ...state, [id]: { ...state[id], [field]: destination } };
}
export function checkPlacement(variable: Variable, placement: Placement = {}) {
  return {
    familyCorrect: placement.family === familyOf(variable.type),
    graphCorrect: placement.graph !== undefined && suitableGraphs(variable.type).includes(placement.graph),
  };
}
export function placementScore(state: Placements): number {
  return variables.filter(variable => {
    const result = checkPlacement(variable, state[variable.id]);
    return result.familyCorrect && result.graphCorrect;
  }).length;
}
export interface PracticeAnswer { type?: VariableType; graph?: GraphType }
export function checkPractice(answers: Record<string, PracticeAnswer>): boolean[] {
  return practiceVariables.map(variable => answers[variable.id]?.type === variable.type
    && suitableGraphs(variable.type).includes(answers[variable.id]?.graph as GraphType));
}
