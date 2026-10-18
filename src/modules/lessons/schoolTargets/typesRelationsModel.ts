export type Element = 1 | 2 | 3 | 4;
export type Pair = `${Element},${Element}`;
export const A: Element[] = [1, 2, 3, 4];
export const key = (a: Element, b: Element): Pair => `${a},${b}`;
export const DEFAULT: Pair[] = [
  "1,1",
  "1,2",
  "1,3",
  "2,2",
  "2,4",
  "3,2",
  "3,3",
  "3,4",
  "4,4",
];
export const positions: Record<Element, [number, number]> = {
  1: [105, 75],
  2: [355, 75],
  3: [105, 270],
  4: [355, 270],
};

export const presets = [
  { name: "Identity", symbol: "Iₐ", pairs: A.map((a) => key(a, a)) },
  {
    name: "Universal",
    symbol: "Uₐ",
    pairs: A.flatMap((a) => A.map((b) => key(a, b))),
  },
  {
    name: "Less-than",
    symbol: "<",
    pairs: A.flatMap((a) => A.filter((b) => a < b).map((b) => key(a, b))),
  },
  {
    name: "Less-than-or-equal",
    symbol: "≤",
    pairs: A.flatMap((a) => A.filter((b) => a <= b).map((b) => key(a, b))),
  },
  {
    name: "Cyclic",
    symbol: "C₄",
    pairs: ["1,2", "2,3", "3,4", "4,1"] as Pair[],
  },
  { name: "Empty", symbol: "∅", pairs: [] as Pair[] },
];

export function relationFacts(relation: Set<Pair>) {
  const reflexiveMissing = A.find((a) => !relation.has(key(a, a)));
  const symmetricMissing = A.flatMap(a=>A.filter(b=>relation.has(key(a,b))).map(b=>[a,b] as [Element,Element]))
    .find(([a, b]) => !relation.has(key(b, a)));
  const antisymmetricWitness = A.flatMap((a) =>
    A.map((b) => [a, b] as const),
  ).find(
    ([a, b]) => a !== b && relation.has(key(a, b)) && relation.has(key(b, a)),
  );
  const transitiveWitness = A.flatMap((a) =>
    A.flatMap((b) => A.map((c) => [a, b, c] as const)),
  ).find(
    ([a, b, c]) =>
      relation.has(key(a, b)) &&
      relation.has(key(b, c)) &&
      !relation.has(key(a, c)),
  );
  return {
    reflexive: !reflexiveMissing,
    symmetric: !symmetricMissing,
    antisymmetric: !antisymmetricWitness,
    transitive: !transitiveWitness,
    reflexiveNote: reflexiveMissing
      ? `Missing (${reflexiveMissing}, ${reflexiveMissing}).`
      : "All diagonal pairs are in R.",
    symmetricNote: symmetricMissing
      ? `(${symmetricMissing[0]}, ${symmetricMissing[1]}) is present, but (${symmetricMissing[1]}, ${symmetricMissing[0]}) is missing.`
      : "Every pair has its reverse in R.",
    antisymmetricNote: antisymmetricWitness
      ? `Counterexample: (${antisymmetricWitness[0]}, ${antisymmetricWitness[1]}) and (${antisymmetricWitness[1]}, ${antisymmetricWitness[0]}).`
      : "No distinct elements are related both ways.",
    transitiveNote: transitiveWitness
      ? `(${transitiveWitness[0]}, ${transitiveWitness[1]}) and (${transitiveWitness[1]}, ${transitiveWitness[2]}) need (${transitiveWitness[0]}, ${transitiveWitness[2]}).`
      : "Every composable pair has its required shortcut.",
  };
}


export function relationEdge(a:Element,b:Element){const[x,y]=positions[a],[xx,yy]=positions[b];if(a===b){const side=a===1||a===3?-1:1;return `M${x+side*23} ${y-24} C${x+side*95} ${y-85},${x+side*95} ${y+35},${x+side*23} ${y+24}`;}const dx=xx-x,dy=yy-y,l=Math.hypot(dx,dy),px=-dy/l*5,py=dx/l*5;return `M${x+dx/l*36+px} ${y+dy/l*36+py} L${xx-dx/l*39+px} ${yy-dy/l*39+py}`;}
