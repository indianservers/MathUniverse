export type Mat = number[][];

const EPS = 1e-9;

export function near(a: number, b: number, tol = 1e-6) {
  return Math.abs(a - b) <= tol;
}

export function clone(matrix: Mat): Mat {
  return matrix.map((row) => [...row]);
}

export function eye(n: number): Mat {
  return Array.from({ length: n }, (_, row) => Array.from({ length: n }, (_, col) => (row === col ? 1 : 0)));
}

export function zeros(rows: number, cols: number): Mat {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0));
}

export function transpose(matrix: Mat): Mat {
  return matrix[0].map((_, col) => matrix.map((row) => row[col]));
}

export function multiply(left: Mat, right: Mat): Mat {
  return left.map((row) => right[0].map((_, col) => row.reduce((sum, value, index) => sum + value * right[index][col], 0)));
}

export function add(left: Mat, right: Mat): Mat {
  return left.map((row, rowIndex) => row.map((value, col) => value + right[rowIndex][col]));
}

export function scale(matrix: Mat, factor: number): Mat {
  return matrix.map((row) => row.map((value) => value * factor));
}

export function trace(matrix: Mat) {
  return matrix.reduce((sum, row, index) => sum + row[index], 0);
}

export function isZero(matrix: Mat, tol = 1e-6) {
  return matrix.every((row) => row.every((value) => Math.abs(value) < tol));
}

export function det(matrix: Mat): number {
  if (matrix.length === 1) return matrix[0][0];
  if (matrix.length === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  return matrix[0].reduce((sum, value, col) => {
    const minor = matrix.slice(1).map((row) => row.filter((_, index) => index !== col));
    return sum + (col % 2 ? -1 : 1) * value * det(minor);
  }, 0);
}

export function rref(input: Mat) {
  const matrix = clone(input);
  const rows = matrix.length;
  const cols = matrix[0]?.length ?? 0;
  let rank = 0;
  let col = 0;
  while (rank < rows && col < cols) {
    let pivot = rank;
    for (let row = rank + 1; row < rows; row += 1) {
      if (Math.abs(matrix[row][col]) > Math.abs(matrix[pivot][col])) pivot = row;
    }
    if (Math.abs(matrix[pivot][col]) < 1e-10) {
      col += 1;
      continue;
    }
    [matrix[rank], matrix[pivot]] = [matrix[pivot], matrix[rank]];
    const divisor = matrix[rank][col];
    for (let index = col; index < cols; index += 1) matrix[rank][index] /= divisor;
    for (let row = 0; row < rows; row += 1) {
      if (row === rank) continue;
      const factor = matrix[row][col];
      for (let index = col; index < cols; index += 1) matrix[row][index] -= factor * matrix[rank][index];
    }
    rank += 1;
    col += 1;
  }
  return { matrix, rank };
}

export function inverse(matrix: Mat): Mat | null {
  const n = matrix.length;
  if (rref(matrix).rank < n) return null;
  const augmented = matrix.map((row, index) => [...row, ...eye(n)[index]]);
  const reduced = rref(augmented);
  return reduced.matrix.map((row) => row.slice(n));
}

/** Monic characteristic polynomial coefficients, highest degree first. */
export function characteristicCoefficients(matrix: Mat) {
  const n = matrix.length;
  if (n === 2) {
    const tr = trace(matrix);
    const determinant = det(matrix);
    return { degree: 2, trace: tr, sigma: 0, determinant, coefficients: [1, -tr, determinant] };
  }
  const tr = trace(matrix);
  const determinant = det(matrix);
  const sigma = det([[matrix[1][1], matrix[1][2]], [matrix[2][1], matrix[2][2]]])
    + det([[matrix[0][0], matrix[0][2]], [matrix[2][0], matrix[2][2]]])
    + det([[matrix[0][0], matrix[0][1]], [matrix[1][0], matrix[1][1]]]);
  return { degree: 3, trace: tr, sigma, determinant, coefficients: [1, -tr, sigma, -determinant] };
}

export function evaluatePolynomial(matrix: Mat, coefficients: number[]) {
  let result = scale(eye(matrix.length), coefficients[coefficients.length - 1]);
  for (let power = 1; power < coefficients.length; power += 1) {
    let term = eye(matrix.length);
    for (let step = 0; step < power; step += 1) term = multiply(term, matrix);
    result = add(result, scale(term, coefficients[coefficients.length - 1 - power]));
  }
  return result;
}

export function cayleyHamilton(matrix: Mat) {
  const poly = characteristicCoefficients(matrix);
  const value = evaluatePolynomial(matrix, poly.coefficients);
  return { ...poly, value, zero: isZero(value) };
}

export function powerCoefficients2(matrixTrace: number, determinant: number, exponent: number) {
  let alphaPrev = 0;
  let betaPrev = 1;
  let alpha = 1;
  let beta = 0;
  if (exponent === 0) return { alpha: 0, beta: 1 };
  if (exponent === 1) return { alpha: 1, beta: 0 };
  for (let n = 2; n <= exponent; n += 1) {
    const nextAlpha = matrixTrace * alpha - determinant * alphaPrev;
    const nextBeta = matrixTrace * beta - determinant * betaPrev;
    alphaPrev = alpha;
    betaPrev = beta;
    alpha = nextAlpha;
    beta = nextBeta;
  }
  return { alpha, beta };
}

export function matrixPower2(matrix: Mat, exponent: number) {
  const { alpha, beta } = powerCoefficients2(trace(matrix), det(matrix), exponent);
  return add(scale(matrix, alpha), scale(eye(2), beta));
}

export function powerCoefficients3(matrixTrace: number, sigma: number, determinant: number, exponent: number) {
  const states = [
    { alpha: 0, beta: 0, gamma: 1 },
    { alpha: 0, beta: 1, gamma: 0 },
    { alpha: 1, beta: 0, gamma: 0 },
  ];
  if (exponent <= 2) return states[exponent];
  for (let n = 3; n <= exponent; n += 1) {
    const a = states[n - 1];
    const b = states[n - 2];
    const c = states[n - 3];
    states.push({
      alpha: matrixTrace * a.alpha - sigma * b.alpha + determinant * c.alpha,
      beta: matrixTrace * a.beta - sigma * b.beta + determinant * c.beta,
      gamma: matrixTrace * a.gamma - sigma * b.gamma + determinant * c.gamma,
    });
  }
  return states[exponent];
}

export function inverseFromCayley(matrix: Mat): { inverse: Mat; formula: string } | null {
  const determinant = det(matrix);
  if (Math.abs(determinant) < EPS) return null;
  if (matrix.length === 2) {
    const tr = trace(matrix);
    return {
      inverse: scale(add(scale(eye(2), tr), scale(matrix, -1)), 1 / determinant),
      formula: "(tr(A) I − A) / det(A)",
    };
  }
  const poly = characteristicCoefficients(matrix);
  const square = multiply(matrix, matrix);
  const numerator = add(add(square, scale(matrix, -poly.trace)), scale(eye(3), poly.sigma));
  return { inverse: scale(numerator, 1 / determinant), formula: "(A² − tr(A) A + σ I) / det(A)" };
}

export function cubicRoots(a: number, b: number, c: number) {
  const p = (3 * b - a * a) / 3;
  const q = (2 * a * a * a - 9 * a * b + 27 * c) / 27;
  const discriminant = (q * q) / 4 + (p * p * p) / 27;
  const shift = -a / 3;
  if (discriminant > 1e-10) {
    const root = Math.sqrt(discriminant);
    const u = Math.cbrt(-q / 2 + root);
    const v = Math.cbrt(-q / 2 - root);
    const real = u + v;
    const pair = -(u + v) / 2;
    const imag = (Math.sqrt(3) / 2) * (u - v);
    return [
      { real: real + shift, imag: 0 },
      { real: pair + shift, imag },
      { real: pair + shift, imag: -imag },
    ];
  }
  if (Math.abs(p) < 1e-12) return [0, 1, 2].map(() => ({ real: shift, imag: 0 }));
  const radius = 2 * Math.sqrt(-p / 3);
  const argument = Math.max(-1, Math.min(1, (-q / 2) / Math.sqrt((-p / 3) ** 3)));
  const phi = Math.acos(argument);
  return [0, 1, 2].map((k) => ({ real: radius * Math.cos((phi + 2 * Math.PI * k) / 3) + shift, imag: 0 }));
}

export function eigenvalues3(matrix: Mat) {
  const poly = characteristicCoefficients(matrix);
  const [, a, b, c] = poly.coefficients;
  const roots = cubicRoots(a, b, c);
  const real = roots.filter((root) => Math.abs(root.imag) < 1e-6).map((root) => root.real).sort((left, right) => left - right);
  return { roots, real, approximate: true as const };
}

function kernel2(matrix: Mat) {
  const rank = rref(matrix).rank;
  const dimension = 2 - rank;
  if (dimension === 2) return { vectors: [[1, 0], [0, 1]] as Array<[number, number]>, dimension };
  if (dimension === 0) return { vectors: [] as Array<[number, number]>, dimension };
  const [a, b] = matrix[0];
  const [c, d] = matrix[1];
  const raw: [number, number] = Math.hypot(a, b) > 1e-8 ? [-b, a] : Math.hypot(c, d) > 1e-8 ? [-d, c] : [1, 0];
  const length = Math.hypot(raw[0], raw[1]) || 1;
  return { vectors: [[raw[0] / length, raw[1] / length]] as Array<[number, number]>, dimension };
}

export function diagonalize2(matrix: Mat) {
  const tr = trace(matrix);
  const determinant = det(matrix);
  const discriminant = tr * tr - 4 * determinant;
  if (discriminant < -1e-8) {
    return {
      diagonalizable: false,
      reason: "The eigenvalues are complex conjugates, so there is no real eigenbasis.",
      eigenvalues: [] as number[],
      algebraic: [] as number[],
      geometric: [] as number[],
    };
  }
  const root = Math.sqrt(Math.max(0, discriminant));
  const low = (tr - root) / 2;
  const high = (tr + root) / 2;
  const repeated = Math.abs(high - low) < 1e-7;
  const values = repeated ? [low] : [low, high];
  const spaces = values.map((lambda) => kernel2([[matrix[0][0] - lambda, matrix[0][1]], [matrix[1][0], matrix[1][1] - lambda]]));
  const algebraic = repeated ? [2] : [1, 1];
  const geometric = spaces.map((space) => space.dimension);
  const vectors = spaces.flatMap((space) => space.vectors);
  if (vectors.length < 2) {
    return {
      diagonalizable: false,
      reason: "A repeated eigenvalue has only one independent eigenvector, so the matrix is defective.",
      eigenvalues: values,
      algebraic,
      geometric,
      vectors,
    };
  }
  const change = [vectors[0], vectors[1]].reduce<Mat>((columns, vector, index) => {
    columns[0][index] = vector[0];
    columns[1][index] = vector[1];
    return columns;
  }, [[0, 0], [0, 0]]);
  const changeInverse = inverse(change);
  if (!changeInverse) {
    return { diagonalizable: false, reason: "The candidate eigenvectors are dependent.", eigenvalues: values, algebraic, geometric, vectors };
  }
  const diagonal = [[repeated ? low : low, 0], [0, repeated ? low : high]];
  const rebuilt = multiply(multiply(change, diagonal), changeInverse);
  return {
    diagonalizable: isZero(add(rebuilt, scale(matrix, -1)), 1e-5),
    reason: repeated ? "Repeated eigenvalue, but two independent eigenvectors." : "Two independent eigenvectors.",
    eigenvalues: repeated ? [low, low] : [low, high],
    algebraic: repeated ? [2] : [1, 1],
    geometric: repeated ? [2] : [1, 1],
    vectors,
    P: change,
    D: diagonal,
    rebuilt,
  };
}

export const diagonal3Presets = [
  {
    id: "distinct",
    label: "Distinct eigenvalues",
    matrix: [[2, 0, 0], [0, 3, 0], [0, 0, 5]],
    diagonalizable: true,
    eigenvalues: [2, 3, 5],
    algebraic: [1, 1, 1],
    geometric: [1, 1, 1],
  },
  {
    id: "repeated-ok",
    label: "Repeated, still diagonalizable",
    matrix: [[2, 0, 0], [0, 2, 0], [0, 0, 5]],
    diagonalizable: true,
    eigenvalues: [2, 5],
    algebraic: [2, 1],
    geometric: [2, 1],
  },
  {
    id: "defective",
    label: "Repeated and defective",
    matrix: [[2, 1, 0], [0, 2, 0], [0, 0, 5]],
    diagonalizable: false,
    eigenvalues: [2, 5],
    algebraic: [2, 1],
    geometric: [1, 1],
  },
] ;

export function multiplicity3(matrix: Mat, lambda: number) {
  const shifted = matrix.map((row, rowIndex) => row.map((value, col) => value - (rowIndex === col ? lambda : 0)));
  return matrix.length - rref(shifted).rank;
}

export function quadraticValue(a: number, b: number, c: number, x: number, y: number) {
  return a * x * x + 2 * b * x * y + c * y * y;
}

export function classifyQuadratic(a: number, b: number, c: number) {
  const matrix = [[a, b], [b, c]] as Mat;
  const info = diagonalize2(matrix);
  const values = info.eigenvalues ?? [];
  const definite = (predicate: (value: number) => boolean) => values.length === 2 && values.every(predicate);
  let type = "indefinite";
  if (definite((value) => value > 1e-8)) type = "positive definite";
  else if (definite((value) => value < -1e-8)) type = "negative definite";
  else if (values.length === 2 && values.every((value) => value >= -1e-8) && values.some((value) => Math.abs(value) <= 1e-8)) type = "positive semidefinite";
  else if (values.length === 2 && values.every((value) => value <= 1e-8) && values.some((value) => Math.abs(value) <= 1e-8)) type = "negative semidefinite";
  else if (values.some((value) => value > 1e-8) && values.some((value) => value < -1e-8)) type = "indefinite";
  const leading = a;
  const determinant = a * c - b * b;
  let sylvester = "Sylvester does not classify the semidefinite boundary.";
  if (leading > 1e-8 && determinant > 1e-8) sylvester = "Both leading minors are positive, so the form is positive definite.";
  else if (leading < -1e-8 && determinant > 1e-8) sylvester = "The first minor is negative and the determinant is positive, so the form is negative definite.";
  else if (determinant < -1e-8) sylvester = "The determinant is negative, so the form is indefinite.";
  return { matrix, eigenvalues: values, type, sylvester, determinant, leading };
}

export function principalAxes(a: number, b: number, c: number): {
  orthonormal: boolean;
  canonical: Mat | null;
  eigenvalues: number[];
  vectors: Array<[number, number]>;
  P: Mat | null;
} {
  const info = diagonalize2([[a, b], [b, c]]);
  if (!info.P || !info.diagonalizable || !info.vectors || info.vectors.length < 2) {
    return { orthonormal: false, canonical: null, eigenvalues: info.eigenvalues ?? [], vectors: info.vectors ?? [], P: null };
  }
  const first = info.vectors[0];
  const secondRaw = info.vectors[1];
  const dot = first[0] * secondRaw[0] + first[1] * secondRaw[1];
  const corrected: [number, number] = [secondRaw[0] - dot * first[0], secondRaw[1] - dot * first[1]];
  const length = Math.hypot(corrected[0], corrected[1]) || 1;
  const second: [number, number] = [corrected[0] / length, corrected[1] / length];
  const P = [[first[0], second[0]], [first[1], second[1]]];
  const canonical = multiply(multiply(transpose(P), [[a, b], [b, c]]), P);
  return { orthonormal: near(first[0] * second[0] + first[1] * second[1], 0, 1e-5), canonical, eigenvalues: info.eigenvalues ?? [], vectors: [first, second], P };
}

export function luFactor(input: Mat) {
  const n = input.length;
  const upper = clone(input);
  const lower = eye(n);
  const permutation = eye(n);
  const steps: string[] = [];
  let singular = false;
  for (let column = 0; column < n - 1; column += 1) {
    let pivot = column;
    for (let row = column + 1; row < n; row += 1) {
      if (Math.abs(upper[row][column]) > Math.abs(upper[pivot][column])) pivot = row;
    }
    if (pivot !== column) {
      [upper[column], upper[pivot]] = [upper[pivot], upper[column]];
      [permutation[column], permutation[pivot]] = [permutation[pivot], permutation[column]];
      for (let index = 0; index < column; index += 1) {
        [lower[column][index], lower[pivot][index]] = [lower[pivot][index], lower[column][index]];
      }
      steps.push(`Swap row ${column + 1} with row ${pivot + 1}`);
    }
    if (Math.abs(upper[column][column]) < 1e-10) {
      singular = true;
      steps.push(`Pivot ${column + 1} is zero, so LU stops.`);
      break;
    }
    for (let row = column + 1; row < n; row += 1) {
      const multiplier = upper[row][column] / upper[column][column];
      lower[row][column] = multiplier;
      steps.push(`Multiplier L[${row + 1},${column + 1}] = ${multiplier.toFixed(3)}`);
      for (let index = column; index < n; index += 1) upper[row][index] -= multiplier * upper[column][index];
    }
  }
  if (Math.abs(upper[n - 1][n - 1]) < 1e-10) singular = true;
  const product = multiply(lower, upper);
  const permuted = multiply(permutation, input);
  return { L: lower, U: upper, P: permutation, steps, singular, matches: isZero(add(product, scale(permuted, -1)), 1e-5) };
}

export function qrFactor(input: Mat) {
  const rows = input.length;
  const cols = input[0].length;
  const basis: number[][] = [];
  const upper = zeros(cols, cols);
  for (let column = 0; column < cols; column += 1) {
    let vector = input.map((row) => row[column]);
    for (let previous = 0; previous < basis.length; previous += 1) {
      const coefficient = vector.reduce((sum, value, index) => sum + value * basis[previous][index], 0);
      upper[previous][column] = coefficient;
      vector = vector.map((value, index) => value - coefficient * basis[previous][index]);
    }
    const length = Math.hypot(...vector);
    upper[column][column] = length;
    if (length < 1e-10) return { Q: null, R: upper, orthonormal: false, matches: false };
    basis.push(vector.map((value) => value / length));
  }
  const Q = Array.from({ length: rows }, (_, row) => basis.map((vector) => vector[row]));
  const rebuilt = multiply(Q, upper);
  const gram = multiply(transpose(Q), Q);
  return { Q, R: upper, orthonormal: isZero(add(gram, scale(eye(cols), -1)), 1e-5), matches: isZero(add(rebuilt, scale(input, -1)), 1e-5) };
}

export function leastSquaresQr(matrix: Mat, target: number[]) {
  const factor = qrFactor(matrix);
  if (!factor.Q) return null;
  const projected = multiply(transpose(factor.Q), target.map((value) => [value])).map((row) => row[0]);
  const solution = [...projected];
  for (let row = solution.length - 1; row >= 0; row -= 1) {
    let sum = projected[row];
    for (let col = row + 1; col < solution.length; col += 1) sum -= factor.R[row][col] * solution[col];
    if (Math.abs(factor.R[row][row]) < 1e-10) return null;
    solution[row] = sum / factor.R[row][row];
  }
  return { ...factor, solution };
}

export function svd2(matrix: Mat) {
  const gram = multiply(transpose(matrix), matrix);
  const eigen = diagonalize2(gram);
  if (!eigen.P || !eigen.eigenvalues) return null;
  const order = eigen.eigenvalues[0] >= eigen.eigenvalues[1] ? [0, 1] : [1, 0];
  const singular = order.map((index) => Math.sqrt(Math.max(0, eigen.eigenvalues?.[index] ?? 0)));
  const right = order.map((index) => [eigen.P?.[0][index] ?? 0, eigen.P?.[1][index] ?? 0]);
  const left: Array<[number, number]> = [];
  singular.forEach((sigma, index) => {
    if (sigma > 1e-8) {
      const image = multiply(matrix, right[index].map((value) => [value])).map((row) => row[0]);
      left.push([image[0] / sigma, image[1] / sigma]);
    }
  });
  if (left.length === 1) left.push([-left[0][1], left[0][0]]);
  if (left.length === 0) left.push([1, 0], [0, 1]);
  const U = [[left[0][0], left[1][0]], [left[0][1], left[1][1]]];
  const V = [[right[0][0], right[1][0]], [right[0][1], right[1][1]]];
  const sigma = [[singular[0], 0], [0, singular[1]]];
  const rebuilt = multiply(multiply(U, sigma), transpose(V));
  const rank = singular.filter((value) => value > 1e-7).length;
  const rankOne = scale(multiply(left[0].map((value) => [value]), [right[0]]), singular[0]);
  return {
    U,
    sigma,
    V,
    singular,
    rank,
    condition: singular[1] < 1e-8 ? Infinity : singular[0] / singular[1],
    rebuilt,
    matches: isZero(add(rebuilt, scale(matrix, -1)), 1e-4),
    rankOne,
  };
}

export function similarMatrix(matrix: Mat, change: Mat) {
  const changeInverse = inverse(change);
  if (!changeInverse) return null;
  const image = multiply(multiply(changeInverse, matrix), change);
  const source = characteristicCoefficients(matrix);
  const target = characteristicCoefficients(image);
  return {
    B: image,
    sameTrace: near(trace(matrix), trace(image)),
    sameDeterminant: near(det(matrix), det(image)),
    samePolynomial: source.coefficients.every((value, index) => near(value, target.coefficients[index])),
  };
}

export const jordanPresets = [
  {
    id: "already",
    label: "2×2 Jordan block",
    matrix: [[2, 1], [0, 2]],
    lambda: 2,
    algebraic: 2,
    geometric: 1,
    chain: [[1, 0], [0, 1]] as Array<[number, number]>,
    note: "(A − 2I) sends (0, 1) to (1, 0), and (1, 0) to 0.",
  },
  {
    id: "similar",
    label: "Similar defective 2×2",
    matrix: [[3, -1], [1, 1]],
    lambda: 2,
    algebraic: 2,
    geometric: 1,
    chain: [[1, 1], [1, 0]] as Array<[number, number]>,
    note: "A chain of length 2 replaces the missing eigenvector.",
  },
  {
    id: "block3",
    label: "3×3 Jordan block",
    matrix: [[3, 1, 0], [0, 3, 1], [0, 0, 3]],
    lambda: 3,
    algebraic: 3,
    geometric: 1,
    chain: [] as Array<[number, number]>,
    note: "One block of size 3: algebraic multiplicity 3 and geometric multiplicity 1.",
  },
] ;

export function jordanCheck(preset: (typeof jordanPresets)[number]) {
  const shifted = preset.matrix.map((row, index) => row.map((value, col) => value - (index === col ? preset.lambda : 0)));
  const geo = preset.matrix.length - rref(shifted).rank;
  if (preset.chain.length < 2 || preset.matrix.length !== 2) {
    return { geometric: geo, diagonalizable: geo >= preset.algebraic, reconstructed: preset.matrix.length === 3 ? clone(preset.matrix) : null };
  }
  const [eigenvector, generalized] = preset.chain;
  const P = [[eigenvector[0], generalized[0]], [eigenvector[1], generalized[1]]];
  const J = [[preset.lambda, 1], [0, preset.lambda]];
  const Pinv = inverse(P);
  const rebuilt = Pinv ? multiply(multiply(P, J), Pinv) : null;
  return { geometric: geo, diagonalizable: false, P, J, rebuilt, matches: rebuilt ? isZero(add(rebuilt, scale(preset.matrix, -1)), 1e-5) : false };
}
