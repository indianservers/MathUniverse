export function hypot(a: number, b: number) {
  return Math.hypot(a, b);
}

export function pythagorasTiles(a: number, b: number) {
  const c = hypot(a, b);
  return { a, b, c, a2: a * a, b2: b * b, c2: c * c, holds: Math.abs(a * a + b * b - c * c) < 1e-6 };
}

export function angleSum(tear: number) {
  const angles = [58, 47, 75];
  return { angles, sum: 180, torn: Math.min(1, Math.max(0, tear)) };
}

export function inscribedVsCentral(arc: number) {
  return { central: arc, inscribed: arc / 2 };
}

export function similarScale(k: number) {
  return { k, area: k * k, perimeter: Math.abs(k) };
}

export function twoColumnClaims(mode: string, fig: { a: number; b: number; tear: number; arc: number; k: number }) {
  const tiles = pythagorasTiles(fig.a, fig.b);
  const circle = inscribedVsCentral(fig.arc);
  const sim = similarScale(fig.k);
  if (mode === "Angle Sum") {
    return [
      { given: "△ABC is Euclidean", conclude: "∠A+∠B+∠C = 180°", live: `${angleSum(fig.tear).sum}` },
    ];
  }
  if (mode === "Circle Theorems") {
    return [
      { given: `Central arc ${circle.central}°`, conclude: "inscribed = ½ central", live: `${circle.inscribed}` },
    ];
  }
  if (mode === "Similarity") {
    return [
      { given: `Scale factor k = ${fig.k}`, conclude: "area scales by k²", live: `${sim.area}` },
    ];
  }
  return [
    { given: `Legs ${tiles.a}, ${tiles.b}`, conclude: "c² = a² + b²", live: `${tiles.c}` },
  ];
}
