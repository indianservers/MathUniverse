export type PolynomialRelation125 = ">=" | ">" | "<=" | "<";

export type PolynomialRoot125 = {
  id: number;
  value: number;
  multiplicity: number;
};

export const POLYNOMIAL_ROOTS_125: PolynomialRoot125[] = [
  { id: 0, value: -2, multiplicity: 1 },
  { id: 1, value: 1, multiplicity: 1 },
  { id: 2, value: 3, multiplicity: 1 },
];

export function orderedPolynomialRoots125(roots: PolynomialRoot125[]) {
  return [...roots].sort((left, right) => left.value - right.value || left.id - right.id);
}

export function evaluatePolynomial125(
  roots: PolynomialRoot125[],
  leading: number,
  x: number,
) {
  return roots.reduce(
    (value, root) => value * (x - root.value) ** root.multiplicity,
    leading,
  );
}

export function polynomialRelationPasses125(
  relation: PolynomialRelation125,
  value: number,
) {
  if (relation === ">") return value > 0;
  if (relation === ">=") return value >= 0;
  if (relation === "<") return value < 0;
  return value <= 0;
}

function formatEndpoint(value: number) {
 +  return Number.isInteger(value) ? String(value) : Number(value.toFixed(4)).toString();
}

type Segment125 = {
  left: number;
  right: number;
  leftClosed: boolean;
  rightClosed: boolean;
};

export function solvePolynomialInequality125(
  roots: PolynomialRoot125[],
  leading: number,
  relation: PolynomialRelation125,
) {
  const sorted = orderedPolynomialRoots125(roots);
  const grouped = sorted.reduce<Array<{ value: number; multiplicity: number }>>(
    (groups, root) => {
      const previous = groups.at(-1);
      if (previous?.value === root.value) previous.multiplicity += root.multiplicity;
      else groups.push({ value: root.value, multiplicity: root.multiplicity });
      return groups;
    },
    [],
  );
  const values = grouped.map((root) => root.value);
  const tests = values.length
    ? [values[0] - 1, ...values.slice(1).map((value, index) => (values[index] + value) / 2), values.at(-1)! + 1]
    : [0];
  const evaluations = tests.map((x) => evaluatePolynomial125(grouped.map((root, id) => ({ ...root, id })), leading, x));
  const passes = evaluations.map((value) => polynomialRelationPasses125(relation, value));
  const includeRoots = relation.includes("=");
  const segments: Segment125[] = [];
  passes.forEach((pass, index) => {
    if (!pass) return;
    segments.push({
      left: index === 0 ? Number.NEGATIVE_INFINITY : values[index - 1],
      right: index === values.length ? Number.POSITIVE_INFINITY : values[index],
      leftClosed: index > 0 && includeRoots,
      rightClosed: index < values.length && includeRoots,
    });
  });
  if (includeRoots) {
    values.forEach((value) => segments.push({ left: value, right: value, leftClosed: true, rightClosed: true }));
  }
  segments.sort((left, right) => left.left - right.left || left.right - right.right);
  const merged: Segment125[] = [];
  segments.forEach((segment) => {
    const previous = merged.at(-1);
    if (!previous || segment.left > previous.right || (segment.left === previous.right && !segment.leftClosed && !previous.rightClosed)) {
      merged.push({ ...segment });
      return;
    }
    if (segment.right > previous.right) {
      previous.right = segment.right;
      previous.rightClosed = segment.rightClosed;
    } else if (segment.right === previous.right) {
      previous.rightClosed ||= segment.rightClosed;
    }
  });
  const interval = merged.length
    ? merged
        .map((segment) => {
          if (segment.left === segment.right) return `{${formatEndpoint(segment.left)}}`;
          const left = segment.left === Number.NEGATIVE_INFINITY ? "−∞" : formatEndpoint(segment.left);
          const right = segment.right === Number.POSITIVE_INFINITY ? "∞" : formatEndpoint(segment.right);
          return `${segment.leftClosed ? "[" : "("}${left}, ${right}${segment.rightClosed ? "]" : ")"}`;
        })
        .join(" ∪ ")
    : "∅";
  return {
    sorted,
    grouped,
    degree: grouped.reduce((sum, root) => sum + root.multiplicity, 0),
    tests,
    evaluations,
    passes,
    interval,
  };
}
