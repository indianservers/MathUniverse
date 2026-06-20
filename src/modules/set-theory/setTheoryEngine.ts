export type SetElement = string;
export type OrderedPair = [string, string];
export type SetOperation = "union" | "intersection" | "difference" | "complement" | "symmetric-difference";

export type RelationProperties = {
  reflexive: boolean;
  symmetric: boolean;
  antisymmetric: boolean;
  transitive: boolean;
  equivalence: boolean;
  partialOrder: boolean;
};

export type FunctionProperties = {
  isFunction: boolean;
  injective: boolean;
  surjective: boolean;
  bijective: boolean;
};

export function uniqueElements(values: string[]) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

export function parseElements(input: string) {
  return uniqueElements(input.split(/[\s,]+/));
}

export function notation(name: string, values: string[]) {
  return `${name} = { ${uniqueElements(values).join(", ")} }`;
}

export function setUnion(a: string[], b: string[]) {
  return uniqueElements([...a, ...b]);
}

export function setIntersection(a: string[], b: string[]) {
  const bSet = new Set(b);
  return uniqueElements(a.filter((item) => bSet.has(item)));
}

export function setDifference(a: string[], b: string[]) {
  const bSet = new Set(b);
  return uniqueElements(a.filter((item) => !bSet.has(item)));
}

export function setSymmetricDifference(a: string[], b: string[]) {
  return setUnion(setDifference(a, b), setDifference(b, a));
}

export function setComplement(universe: string[], subset: string[]) {
  return setDifference(universe, subset);
}

export function applySetOperation(operation: SetOperation, universe: string[], a: string[], b: string[]) {
  if (operation === "union") return setUnion(a, b);
  if (operation === "intersection") return setIntersection(a, b);
  if (operation === "difference") return setDifference(a, b);
  if (operation === "complement") return setComplement(universe, a);
  return setSymmetricDifference(a, b);
}

export function cartesianProduct(a: string[], b: string[]): OrderedPair[] {
  return a.flatMap((left) => b.map((right) => [left, right] as OrderedPair));
}

export function powerSet(values: string[]) {
  const elements = uniqueElements(values).slice(0, 8);
  return Array.from({ length: 2 ** elements.length }, (_, mask) =>
    elements.filter((_, index) => Boolean(mask & (1 << index)))
  );
}

export function pairKey([a, b]: OrderedPair) {
  return `${a}->${b}`;
}

export function parsePairs(input: string): OrderedPair[] {
  return input
    .split(/[;\n]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const cleaned = item.replace(/[()]/g, "");
      const [left, right] = cleaned.split(/,|->|→/).map((part) => part.trim());
      if (!left || !right) throw new Error(`Invalid ordered pair: ${item}`);
      return [left, right] as OrderedPair;
    });
}

export function relationMatrix(domain: string[], pairs: OrderedPair[]) {
  const keys = new Set(pairs.map(pairKey));
  return domain.map((row) => domain.map((column) => keys.has(pairKey([row, column]))));
}

export function incidenceMatrix(domain: string[], pairs: OrderedPair[]) {
  return domain.map((node) =>
    pairs.map(([source, target]) => {
      if (source === node && target === node) return 2;
      if (source === node) return -1;
      if (target === node) return 1;
      return 0;
    })
  );
}

export function relationProperties(domain: string[], pairs: OrderedPair[]): RelationProperties {
  const elements = uniqueElements(domain);
  const keys = new Set(pairs.map(pairKey));
  const has = (a: string, b: string) => keys.has(pairKey([a, b]));
  const reflexive = elements.every((item) => has(item, item));
  const symmetric = pairs.every(([a, b]) => has(b, a));
  const antisymmetric = pairs.every(([a, b]) => a === b || !has(b, a));
  const transitive = pairs.every(([a, b]) => pairs.every(([c, d]) => b !== c || has(a, d)));
  return {
    reflexive,
    symmetric,
    antisymmetric,
    transitive,
    equivalence: reflexive && symmetric && transitive,
    partialOrder: reflexive && antisymmetric && transitive,
  };
}

export function equivalenceClasses(domain: string[], pairs: OrderedPair[]) {
  const keys = new Set(pairs.map(pairKey));
  const unseen = new Set(domain);
  const classes: string[][] = [];
  for (const item of domain) {
    if (!unseen.has(item)) continue;
    const group = domain.filter((candidate) => keys.has(pairKey([item, candidate])) && keys.has(pairKey([candidate, item])));
    group.forEach((member) => unseen.delete(member));
    classes.push(group.length ? group : [item]);
  }
  return classes;
}

export function coverRelations(domain: string[], pairs: OrderedPair[]) {
  const keys = new Set(pairs.map(pairKey));
  const comparable = (a: string, b: string) => a !== b && keys.has(pairKey([a, b]));
  return pairs.filter(([a, b]) => {
    if (a === b) return false;
    return !domain.some((middle) => middle !== a && middle !== b && comparable(a, middle) && comparable(middle, b));
  });
}

export function hasseLevels(domain: string[], pairs: OrderedPair[]) {
  const covers = coverRelations(domain, pairs);
  const below = new Map(domain.map((item) => [item, 0]));
  for (let pass = 0; pass < domain.length; pass += 1) {
    covers.forEach(([a, b]) => below.set(b, Math.max(below.get(b) ?? 0, (below.get(a) ?? 0) + 1)));
  }
  return domain.map((item) => ({ id: item, level: below.get(item) ?? 0 }));
}

export function functionProperties(domain: string[], codomain: string[], pairs: OrderedPair[]): FunctionProperties {
  const domainSet = new Set(domain);
  const codomainSet = new Set(codomain);
  const allPairsStayInsideSets = pairs.every(([a, b]) => domainSet.has(a) && codomainSet.has(b));
  const imageByDomain = new Map<string, string[]>();
  pairs.forEach(([a, b]) => {
    if (domainSet.has(a) && codomainSet.has(b)) {
      imageByDomain.set(a, [...(imageByDomain.get(a) ?? []), b]);
    }
  });
  const isFunction = allPairsStayInsideSets && domain.every((item) => (imageByDomain.get(item) ?? []).length === 1);
  const images = domain.flatMap((item) => imageByDomain.get(item) ?? []);
  const injective = isFunction && new Set(images).size === images.length;
  const surjective = isFunction && codomain.every((item) => images.includes(item));
  return { isFunction, injective, surjective, bijective: injective && surjective };
}

export function randomProblem(seed = Date.now()) {
  const values = ["1", "2", "3", "4", "5"];
  const shift = seed % values.length;
  const a = values.filter((_, index) => (index + shift) % 2 === 0);
  const b = values.filter((_, index) => (index + shift) % 3 !== 0);
  const operation: SetOperation = ["union", "intersection", "difference", "symmetric-difference"][shift % 4] as SetOperation;
  return { a, b, operation, answer: applySetOperation(operation, values, a, b) };
}

export function venn3Regions(a: string[], b: string[], c: string[]) {
  const aSet = new Set(a);
  const bSet = new Set(b);
  const cSet = new Set(c);
  const all = uniqueElements([...a, ...b, ...c]);
  return {
    onlyA: all.filter((item) => aSet.has(item) && !bSet.has(item) && !cSet.has(item)),
    onlyB: all.filter((item) => !aSet.has(item) && bSet.has(item) && !cSet.has(item)),
    onlyC: all.filter((item) => !aSet.has(item) && !bSet.has(item) && cSet.has(item)),
    aAndB: all.filter((item) => aSet.has(item) && bSet.has(item) && !cSet.has(item)),
    aAndC: all.filter((item) => aSet.has(item) && !bSet.has(item) && cSet.has(item)),
    bAndC: all.filter((item) => !aSet.has(item) && bSet.has(item) && cSet.has(item)),
    allThree: all.filter((item) => aSet.has(item) && bSet.has(item) && cSet.has(item)),
  };
}
