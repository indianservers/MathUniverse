export type RelationPair = [string, string];

export function relationMatrix(domain: string[], codomain: string[], pairs: RelationPair[]) {
  const pairSet = new Set(pairs.map(([a, b]) => `${a}->${b}`));
  return domain.map((row) => codomain.map((col) => pairSet.has(`${row}->${col}`) ? 1 : 0));
}

export function relationPropertyReport(set: string[], pairs: RelationPair[]) {
  const pairSet = new Set(pairs.map(([a, b]) => `${a}->${b}`));
  const missingReflexive = set.filter((item) => !pairSet.has(`${item}->${item}`));
  const missingSymmetric = pairs.filter(([a, b]) => !pairSet.has(`${b}->${a}`));
  const missingTransitive: RelationPair[] = [];
  for (const [a, b] of pairs) {
    for (const [c, d] of pairs) {
      if (b === c && !pairSet.has(`${a}->${d}`)) missingTransitive.push([a, d]);
    }
  }
  return {
    reflexive: missingReflexive.length === 0,
    symmetric: missingSymmetric.length === 0,
    transitive: missingTransitive.length === 0,
    equivalence: missingReflexive.length === 0 && missingSymmetric.length === 0 && missingTransitive.length === 0,
    missingReflexive,
    missingSymmetric,
    missingTransitive,
  };
}

export function functionClassifier(domain: string[], codomain: string[], pairs: RelationPair[]) {
  const imagesByInput = new Map<string, string[]>();
  for (const item of domain) imagesByInput.set(item, []);
  for (const [input, output] of pairs) imagesByInput.get(input)?.push(output);
  const functionFailures = [...imagesByInput.entries()].filter(([, outputs]) => outputs.length !== 1);
  const isFunction = functionFailures.length === 0;
  const imageValues = pairs.map(([, output]) => output);
  const oneOneFailures = imageValues.filter((output, index) => imageValues.indexOf(output) !== index);
  const missingOutputs = codomain.filter((output) => !imageValues.includes(output));
  return {
    isFunction,
    oneOne: isFunction && oneOneFailures.length === 0,
    onto: isFunction && missingOutputs.length === 0,
    bijective: isFunction && oneOneFailures.length === 0 && missingOutputs.length === 0,
    functionFailures,
    repeatedOutputs: [...new Set(oneOneFailures)],
    missingOutputs,
  };
}

export function composeRelations(first: RelationPair[], second: RelationPair[]) {
  const result: RelationPair[] = [];
  for (const [a, b] of first) {
    for (const [c, d] of second) {
      if (b === c) result.push([a, d]);
    }
  }
  return result;
}

export function inverseRelation(pairs: RelationPair[]) {
  return pairs.map(([a, b]) => [b, a] as RelationPair);
}
