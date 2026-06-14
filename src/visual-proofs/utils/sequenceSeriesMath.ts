export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function arithmeticTerm(a: number, d: number, n: number) {
  return a + (n - 1) * d;
}

export function arithmeticSum(a: number, d: number, n: number) {
  return (n / 2) * (2 * a + (n - 1) * d);
}

export function naturalNumberSum(n: number) {
  return (n * (n + 1)) / 2;
}

export function oddNumberSum(n: number) {
  return n * n;
}

export function geometricTerm(a: number, r: number, n: number) {
  return a * r ** (n - 1);
}

export function finiteGeometricSum(a: number, r: number, n: number) {
  if (r === 1) return a * n;
  return (a * (1 - r ** n)) / (1 - r);
}

export function infiniteGeometricSum(a: number, r: number) {
  return Math.abs(r) < 1 ? a / (1 - r) : Number.NaN;
}

export function triangularNumber(n: number) {
  return naturalNumberSum(n);
}

export function squareNumber(n: number) {
  return n * n;
}

export function fibonacci(n: number): number {
  if (n <= 0) return 0;
  if (n <= 2) return 1;
  let previous = 1;
  let current = 1;
  for (let index = 3; index <= n; index += 1) {
    [previous, current] = [current, previous + current];
  }
  return current;
}

export function fibonacciList(n: number) {
  return Array.from({ length: n }, (_, index) => fibonacci(index + 1));
}

export function fibonacciSum(n: number) {
  return fibonacci(n + 2) - 1;
}

export function binomialCoefficient(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  const take = Math.min(k, n - k);
  let value = 1;
  for (let index = 1; index <= take; index += 1) {
    value = (value * (n - take + index)) / index;
  }
  return value;
}

export function pascalTriangleRows(rows: number) {
  return Array.from({ length: rows }, (_, row) => Array.from({ length: row + 1 }, (_, col) => binomialCoefficient(row, col)));
}

export function harmonicPartialSum(n: number) {
  let sum = 0;
  for (let index = 1; index <= n; index += 1) sum += 1 / index;
  return sum;
}

export function formatNumber(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(3).replace(/\.?0+$/, "");
}
