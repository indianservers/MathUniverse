export type Vector3Tuple = [number, number, number];

export type Space3DMeasurements = {
  vectorLength: number;
  vectorComponents: Vector3Tuple;
  pointDistanceFromOrigin: number;
  solidVolume: number;
  solidSurfaceArea: number;
  surfaceSampleMin: number;
  surfaceSampleMax: number;
  crossSectionSamples: number;
};

export function vectorComponents(start: Vector3Tuple, end: Vector3Tuple): Vector3Tuple {
  return [end[0] - start[0], end[1] - start[1], end[2] - start[2]];
}

export function vectorLength(start: Vector3Tuple, end: Vector3Tuple) {
  const [x, y, z] = vectorComponents(start, end);
  return Math.hypot(x, y, z);
}

export function distanceFromOrigin(point: Vector3Tuple) {
  return Math.hypot(point[0], point[1], point[2]);
}

export function solidMetrics(solid: string, size: number) {
  const radius = size / 2;
  if (solid === "box") return { volume: size * (size * 1.35) * (size * 0.72), surfaceArea: 2 * (size * size * 1.35 + size * size * 0.72 + size * 1.35 * size * 0.72) };
  if (solid === "sphere") return { volume: (4 / 3) * Math.PI * radius ** 3, surfaceArea: 4 * Math.PI * radius ** 2 };
  if (solid === "hemisphere") return { volume: (2 / 3) * Math.PI * radius ** 3, surfaceArea: 3 * Math.PI * radius ** 2 };
  if (solid === "cylinder") return { volume: Math.PI * radius ** 2 * size, surfaceArea: 2 * Math.PI * radius * (radius + size) };
  if (solid === "cone") return { volume: (Math.PI * radius ** 2 * size) / 3, surfaceArea: Math.PI * radius * (radius + Math.hypot(radius, size)) };
  if (solid === "pyramid") return { volume: (size ** 2 * size) / 3, surfaceArea: size ** 2 + 2 * size * Math.hypot(size / 2, size) };
  if (solid === "triangular-prism") {
    const side = size;
    const triangleArea = (Math.sqrt(3) / 4) * side ** 2;
    return { volume: triangleArea * size, surfaceArea: 2 * triangleArea + 3 * side * size };
  }
  if (solid === "tetrahedron") return { volume: size ** 3 / (6 * Math.sqrt(2)), surfaceArea: Math.sqrt(3) * size ** 2 };
  if (solid === "octahedron") return { volume: (Math.sqrt(2) / 3) * size ** 3, surfaceArea: 2 * Math.sqrt(3) * size ** 2 };
  if (solid === "dodecahedron") return { volume: ((15 + 7 * Math.sqrt(5)) / 4) * size ** 3, surfaceArea: 3 * Math.sqrt(25 + 10 * Math.sqrt(5)) * size ** 2 };
  if (solid === "icosahedron") return { volume: (5 * (3 + Math.sqrt(5)) / 12) * size ** 3, surfaceArea: 5 * Math.sqrt(3) * size ** 2 };
  if (solid === "torus-solid") {
    const major = size * 0.36;
    const minor = size * 0.12;
    return { volume: 2 * Math.PI ** 2 * major * minor ** 2, surfaceArea: 4 * Math.PI ** 2 * major * minor };
  }
  return { volume: size ** 3, surfaceArea: 6 * size ** 2 };
}

export function summarizeSurfaceSamples(sample: (x: number, y: number) => number, domainRadius: number, crossSection: number) {
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  let contour = 0;
  const steps = 32;
  const tolerance = 0.08 + domainRadius * 0.018;
  for (let iy = 0; iy <= steps; iy += 1) {
    const y = -domainRadius + (iy / steps) * domainRadius * 2;
    for (let ix = 0; ix <= steps; ix += 1) {
      const x = -domainRadius + (ix / steps) * domainRadius * 2;
      if (Math.hypot(x, y) > domainRadius) continue;
      const z = sample(x, y);
      if (!Number.isFinite(z)) continue;
      min = Math.min(min, z);
      max = Math.max(max, z);
      if (Math.abs(z - crossSection) <= tolerance) contour += 1;
    }
  }
  return {
    min: Number.isFinite(min) ? min : 0,
    max: Number.isFinite(max) ? max : 0,
    crossSectionSamples: contour,
  };
}
