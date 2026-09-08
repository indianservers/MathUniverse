export type FormulationScenario = {
  variables: [string, string];
  products: [string, string];
  profits: [number, number];
  resources: [{ name: string; coefficients: [number, number]; limit: number }, { name: string; coefficients: [number, number]; limit: number }];
};
export const WORKSHOP: FormulationScenario = {
  variables: ["x", "y"], products: ["chairs", "tables"], profits: [50, 40],
  resources: [{ name: "Wood", coefficients: [2, 4], limit: 80 }, { name: "Labor", coefficients: [3, 2], limit: 60 }],
};
export const FACTORY: FormulationScenario = {
  variables: ["d", "c"], products: ["desks", "cabinets"], profits: [60, 70],
  resources: [{ name: "Wood", coefficients: [3, 2], limit: 120 }, { name: "Paint", coefficients: [2, 5], limit: 150 }],
};
export function formulationSlots(scenario: FormulationScenario) {
  const [x, y] = scenario.variables;
  const expression = (a: number, b: number) => `${a}${x} + ${b}${y}`;
  return [
    { label: "Variables", answer: `${x}, ${y}` },
    { label: "Objective", answer: `Maximize ${expression(...scenario.profits)}` },
    ...scenario.resources.flatMap(resource => [
      { label: `${resource.name} expression`, answer: expression(...resource.coefficients) },
      { label: `${resource.name} relation`, answer: "≤" },
      { label: `${resource.name} limit`, answer: String(resource.limit) },
    ]),
    { label: `${x} non-negativity`, answer: `${x} ≥ 0` },
    { label: `${y} non-negativity`, answer: `${y} ≥ 0` },
  ];
}
export function checkFormulation(scenario: FormulationScenario, values: string[]) {
  const slots = formulationSlots(scenario);
  const normalize = (value: string, index: number) => {
    if (index === 0) return value.split(",").map(term => term.trim()).sort().join(",");
    if (index === 1 || index === 2 || index === 5) {
      const objective = value.startsWith("Maximize ");
      const expression = objective ? value.slice("Maximize ".length) : value;
      return (objective ? "Maximize " : "") + expression.split("+").map(term => term.trim()).sort().join("+");
    }
    return value.trim();
  };
  const checks = slots.map((slot, index) => normalize(values[index] || "", index) === normalize(slot.answer, index));
  return { checks, correct: checks.filter(Boolean).length, placed: values.filter(Boolean).length, complete: checks.every(Boolean) };
}

export function formulationTokens(scenario: FormulationScenario) {
  return [...new Set([
    ...scenario.variables, ...scenario.profits.map(String),
    ...scenario.resources.flatMap(resource => [...resource.coefficients.map(String), String(resource.limit)]),
    ...scenario.resources.flatMap(resource => resource.coefficients.map((coefficient, i) => `${coefficient}${scenario.variables[i]}`)),
    ...scenario.resources.map(resource => `${resource.coefficients[0]}${scenario.variables[0]} + ${resource.coefficients[1]}${scenario.variables[1]}`),
    "Maximize", "≤", "≥", "=", "0",
  ])];
}

export function formulationSources(scenario: FormulationScenario, token: string) {
  const profits = scenario.profits.map(value => token === String(value) || token === "Maximize");
  const resources = scenario.resources.map(resource =>
    token === String(resource.limit) || resource.coefficients.some((value, i) =>
      token === String(value) || token === `${value}${scenario.variables[i]}`) ||
    token === `${resource.coefficients[0]}${scenario.variables[0]} + ${resource.coefficients[1]}${scenario.variables[1]}`);
  const variable = scenario.variables.indexOf(token);
  const descriptions = [
    ...scenario.profits.flatMap((value, i) => profits[i] ? [`${scenario.products[i]} earn ₹${value} per item`] : []),
    ...scenario.resources.flatMap((resource, i) => resources[i] ? [`${resource.name}: ${resource.coefficients[0]} units per ${scenario.products[0]}, ${resource.coefficients[1]} per ${scenario.products[1]}, ${resource.limit} available`] : []),
    ...(variable >= 0 ? [`${token} counts ${scenario.products[variable]}`] : []),
    ...(token === "≤" ? ["At most: usage cannot exceed the available resource"] : []),
    ...(token === "≥" || token === "0" ? ["Item counts cannot be negative"] : []),
    ...(token === "=" ? ["Exactly: the total equals the specified value"] : []),
  ];
  return { profits, resources, description: descriptions.join(". ") };
}

export function placeFormulationToken(scenario: FormulationScenario, values: string[], index: number, token: string) {
  if (index < 0 || index >= 10 || !formulationTokens(scenario).includes(token)) return values;
  const current = values[index] || "";
  let next = token;
  if (index === 0) {
    next = [...new Set([...current.split(", ").filter(Boolean), token])].join(", ");
  } else if (index === 1 || index === 2 || index === 5) {
    const hasMaximize = current.startsWith("Maximize ") || current === "Maximize";
    const expression = current.replace(/^Maximize\s*/, "");
    const prefix = hasMaximize || token === "Maximize" ? "Maximize " : "";
    if (token === "Maximize") next = `${prefix}${expression}`.trim();
    else if (!expression) next = prefix + token;
    else if (scenario.variables.includes(token) && /\d$/.test(expression)) next = prefix + expression + token;
    else next = `${prefix}${expression} + ${token}`;
  } else if (index >= 8) {
    next = [current, token].filter(Boolean).join(" ");
  }
  return values.map((value, i) => i === index ? next : value);
}
