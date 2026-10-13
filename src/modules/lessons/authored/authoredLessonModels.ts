import type { LessonModelResult } from "./authoredLessonTypes";
import { evaluateSchoolModel } from "./authoredSchoolModels";
import { evaluateAdvancedModel } from "./authoredAdvancedModels";

const fmt = (n: number) => Number.isInteger(n) ? String(n) : Number(n.toPrecision(9)).toString();
function factors(n: number): Array<[number, number]> {
  if (!Number.isInteger(n) || n < 1 || n > 1_000_000) throw new Error("Choose a whole number from 1 to 1,000,000.");
  const result: Array<[number, number]> = [];
  for (let p = 2; p * p <= n; p++) { let exponent = 0; while (n % p === 0) { n /= p; exponent++; } if (exponent) result.push([p, exponent]); }
  if (n > 1) result.push([n, 1]);
  return result;
}
const expansion = (f: Array<[number, number]>) => f.length ? f.map(([p, e]) => `${p}^${e}`).join(" × ") : "1 (no prime factors)";
function result(heading: string, formula: string, steps: string[], outputs: Array<[string, number | string]>, table?: LessonModelResult["table"], plot?: LessonModelResult["plot"]): LessonModelResult {
  return { heading, formula, steps, outputs: outputs.map(([label, value]) => ({ label, value: typeof value === "number" ? fmt(value) : value })), ...(table ? { table } : {}), ...(plot ? { plot } : {}) };
}
export function evaluateAuthoredModel(model: string, v: Record<string, number>): LessonModelResult {
  if (Object.values(v).some(x => !Number.isFinite(x))) throw new Error("Enter a finite number in every control.");
  const n = v.n ?? 5, a = v.a ?? 3, b = v.b ?? 4;
  switch (model) {
    case "square-array": {
      if (!Number.isInteger(n) || n < 1 || n > 20) throw new Error("The array uses a whole-number side from 1 to 20.");
      return result("Rows and columns make a square", "n² = n × n", [`There are ${n} rows.`, `Each row contains ${n} unit squares.`, `${n} × ${n} = ${n * n} unit squares.`], [["Side", n], ["Area", n * n]], undefined, { kind: "square-grid", values: [n] });
    }
    case "square-pattern": {
      const f = factors(n), divisorCount = f.reduce((p, [, e]) => p * (e + 1), 1), isSquare = f.every(([, e]) => e % 2 === 0);
      return result("Test a square using prime exponents", "d(n) = ∏(eᵢ + 1)", [`${n} = ${expansion(f)}.`, `A perfect square has an even exponent on every prime.`, `The ${divisorCount} positive divisors form pairs${isSquare ? ", with one unpaired square root" : ""}.`], [["Perfect square?", isSquare ? "Yes" : "No"], ["Last digit", n % 10], ["Positive divisor count", divisorCount]], { headers: ["Prime", "Exponent", "Exponent parity"], rows: f.map(([p, e]) => [p, e, e % 2 ? "odd" : "even"]) });
    }
    case "odd-square": return result("An odd border grows the square", "(n+1)² − n² = 2n + 1", [`Start with ${n}² = ${n * n}.`, `Add ${n} cells on two edges and one corner: ${2 * n + 1}.`, `The new area is ${(n + 1) ** 2}.`], [["Old area", n * n], ["Odd border", 2 * n + 1], ["New area", (n + 1) ** 2]], { headers: ["k", "k²", "Next odd difference"], rows: Array.from({ length: 6 }, (_, i) => [i + 1, (i + 1) ** 2, 2 * (i + 1) + 1]) }, { kind: "bars", values: [n * n, (n + 1) ** 2] });
    case "triangular-square": return result("Two triangular arrays join into a square", "Tₙ + Tₙ₊₁ = (n+1)²", [`T${n} = ${n}(${n}+1)/2 = ${n * (n + 1) / 2}.`, `T${n + 1} = (${n}+1)(${n}+2)/2 = ${(n + 1) * (n + 2) / 2}.`, `Add to obtain ${(n + 1) ** 2}.`], [["First triangular number", n * (n + 1) / 2], ["Next triangular number", (n + 1) * (n + 2) / 2], ["Combined square", (n + 1) ** 2]], undefined, { kind: "bars", values: [n * (n + 1) / 2, (n + 1) * (n + 2) / 2, (n + 1) ** 2] });
    case "root-factors": {
      const f = factors(n), k = v.k ?? 2;
      if (![2, 3].includes(k)) throw new Error("This tool supports square and cube roots.");
      const outside = f.reduce((p, [q, e]) => p * q ** Math.floor(e / k), 1), inside = f.reduce((p, [q, e]) => p * q ** (e % k), 1);
      return result("Group prime factors to extract a root", `⁽${k}⁾√n = outside × ⁽${k}⁾√inside`, [`Factor ${n}: ${expansion(f)}.`, `For each prime, group exponents into sets of ${k}.`, `One copy from each complete group leaves the root; unmatched factors remain inside.`], [["Outside factor", outside], ["Remaining radicand", inside], ["Exact integer root?", inside === 1 ? "Yes" : "No"], ["Numerical root", n ** (1 / k)]], { headers: ["Prime", "Exponent", "Complete groups", "Remainder"], rows: f.map(([p, e]) => [p, e, Math.floor(e / k), e % k]) });
    }
    case "root-bracket": {
      if (n < 0) throw new Error("Real square roots require n ≥ 0.");
      const low = Math.floor(Math.sqrt(n)), high = Math.ceil(Math.sqrt(n));
      return result("Bracket the square root", "k² ≤ n ≤ (k+1)²", [`${low}² = ${low ** 2}.`, `${high}² = ${high ** 2}.`, `${n} lies between these squares; its nonnegative square root lies between their roots.`], [["Lower bound", low], ["Upper bound", high], ["Approximate root", Math.sqrt(n)]], undefined, { kind: "bars", values: [low ** 2, n, high ** 2] });
    }
    case "square-completion": {
      const f = factors(n), correction = f.reduce((p, [q, e]) => p * (e % 2 ? q : 1), 1);
      return result("Repair odd prime exponents", "Smallest multiplier = product of primes with odd exponent", [`${n} = ${expansion(f)}.`, `Odd exponents need one extra prime to become even, or one removed prime to become even.`, `The same square-free factor ${correction} gives the smallest positive whole-number multiplier and divisor.`], [["Multiplier", correction], ["Product", n * correction], ["Root of product", Math.sqrt(n * correction)], ["Divisor", correction], ["Quotient", n / correction], ["Root of quotient", Math.sqrt(n / correction)]], { headers: ["Prime", "Exponent", "Repair factor"], rows: f.map(([p, e]) => [p, e, e % 2 ? p : 1]) });
    }
    case "cube-array": return result("A cube has three equal dimensions", "V = n³", [`One layer contains ${n} × ${n} = ${n * n} unit cubes.`, `${n} equal layers contain ${n * n} × ${n} = ${n ** 3}.`, `Volume is measured in cubic units, not square units.`], [["Edge", n], ["Cubes in one layer", n * n], ["Volume", n ** 3]], { headers: ["Edge", "Square", "Cube"], rows: Array.from({ length: 6 }, (_, i) => [i + 1, (i + 1) ** 2, (i + 1) ** 3]) }, { kind: "bars", values: [n, n * n, n ** 3] });
    case "taxicab": {
      const total = a ** 3 + b ** 3, pairs: number[][] = [];
      for (let x = 1; x <= Math.cbrt(total); x++) for (let y = x; y <= Math.cbrt(total); y++) if (x ** 3 + y ** 3 === total) pairs.push([x, y, total]);
      return result("Find two positive cube representations", "N = a³ + b³", [`${a}³ + ${b}³ = ${total}.`, `Search positive pairs in nondecreasing order, so swapped pairs are not counted twice.`, `${pairs.length} distinct unordered positive pair(s) give this total.`], [["Sum", total], ["Representations", pairs.length]], { headers: ["First base", "Second base", "Cube sum"], rows: pairs });
    }
    case "odd-cube": {
      const terms = Array.from({ length: n }, (_, i) => n * (n - 1) + 1 + 2 * i);
      return result("An odd-number run gives a cube", "n³ = sum of n odd numbers centred at n²", [`Start at n(n−1)+1 = ${terms[0]}.`, `Take ${n} consecutive odd numbers, ending at ${terms.at(-1)}.`, `Their mean is ${n * n}; count × mean = ${n} × ${n * n} = ${n ** 3}.`], [["Count", n], ["Mean", n * n], ["Sum", terms.reduce((p, q) => p + q, 0)]], { headers: ["Position", "Odd term"], rows: terms.map((x, i) => [i + 1, x]) }, { kind: "bars", values: terms });
    }
    case "differences": {
      const degree = v.degree ?? 2, seq = Array.from({ length: 7 }, (_, i) => (i + 1) ** degree), first = seq.slice(1).map((x, i) => x - seq[i]), second = first.slice(1).map((x, i) => x - first[i]), third = second.slice(1).map((x, i) => x - second[i]);
      return result("Take successive differences", "Δf(n) = f(n+1) − f(n)", [`Sequence: ${seq.join(", ")}.`, `First differences: ${first.join(", ")}.`, `Second differences: ${second.join(", ")}.`, `Third differences: ${third.join(", ")}.`], [["Degree", degree], ["Constant difference order", degree]], { headers: ["n", "n^degree", "First difference", "Second difference"], rows: seq.map((x, i) => [i + 1, x, first[i] ?? "—", second[i] ?? "—"]) }, { kind: "bars", values: seq });
    }
    case "root-iteration": {
      if (n <= 0) throw new Error("Choose a positive radicand.");
      let x = v.guess ?? 5; if (x <= 0) throw new Error("The starting guess must be positive.");
      const rows: Array<Array<string | number>> = [];
      for (let i = 0; i < 5; i++) { rows.push([i, fmt(x), fmt(x * x - n)]); x = (x + n / x) / 2; }
      return result("Improve a root estimate using an average", "x_next = (x + n/x)/2", [`x and n/x have product n.`, `If x is too large, n/x is too small; averaging balances the estimates.`, `The displayed values are numerical approximations, not a historical claim or an exact symbolic proof.`], [["Final estimate", x], ["Squared-value error", x * x - n]], { headers: ["Iteration", "Estimate", "Estimate² − n"], rows });
    }
    case "doubling": return result("Count doubling stages", "Qₖ = Q₀ × 2ᵏ", [`Initial amount: ${a}.`, `Each stage multiplies the amount by 2.`, `After ${n} stages: ${a} × 2^${n} = ${a * 2 ** n}.`], [["Initial", a], ["Stages", n], ["Final", a * 2 ** n]], { headers: ["Stage", "Amount"], rows: Array.from({ length: n + 1 }, (_, i) => [i, a * 2 ** i]) }, { kind: "bars", values: Array.from({ length: n + 1 }, (_, i) => a * 2 ** i) });
    case "power-product": { const base = v.base ?? 2; return result("Keep the common base", "bᵃ × bᶜ = bᵃ⁺ᶜ; bᵃ ÷ bᶜ = bᵃ⁻ᶜ", [`${base}^${a} × ${base}^${b} combines ${a + b} copies of the same base.`, `Division cancels common copies and leaves exponent ${a - b}.`, `Division requires a nonzero base.`], [["Product exponent", a + b], ["Product", base ** (a + b)], ["Quotient exponent", a - b], ["Quotient", base ** (a - b)]]); }
    case "power-power": { const base = v.base ?? 2; return result("A power repeats a whole powered block", "(bᵃ)ᶜ = bᵃᶜ", [`One block is ${base}^${a} = ${base ** a}.`, `Repeat it as a factor ${b} times.`, `There are ${a} × ${b} = ${a * b} total copies of ${base}.`], [["Exponent", a * b], ["Value", base ** (a * b)]], undefined, { kind: "bars", values: [base ** a, base ** (a * b)] }); }
    case "zero-power": { const base = v.base ?? 5; if (base === 0) throw new Error("This identity requires a nonzero base; 0^0 is outside the lesson's rule."); return result("A nonzero quantity divided by itself is one", "b⁰ = bᵃ/bᵃ = 1, b ≠ 0", [`${base}^${a} / ${base}^${a} = 1.`, `Subtract the exponents: a−a=0.`, `Therefore ${base}^0=1.`], [["Nonzero base", base], ["Zero power", 1]]); }
    case "negative-power": { const base = v.base ?? 2; if (base === 0) throw new Error("Negative powers of zero are undefined."); return result("Negative powers mean reciprocals", "b⁻ⁿ = 1/bⁿ", [`${base}^${n} = ${base ** n}.`, `The reciprocal is 1/${base ** n}.`, `Multiply the positive and negative powers to check the result is 1.`], [["Denominator", base ** n], ["Reciprocal", base ** (-n)], ["Check product", base ** n * base ** (-n)]]); }
    case "decimal-power": { const exponent = v.exponent ?? 4, coefficient = v.coefficient ?? 3.45; return result("Power-of-ten place value", "value = c × 10ᵉ", [`Coefficient: ${coefficient}.`, `A positive exponent shifts place values left; a negative exponent shifts them right.`, `${coefficient} × 10^${exponent} = ${fmt(coefficient * 10 ** exponent)}.`], [["Coefficient", coefficient], ["Exponent", exponent], ["Value", coefficient * 10 ** exponent]], { headers: ["Exponent", "Scaled value"], rows: Array.from({ length: 7 }, (_, i) => [i - 3, fmt(coefficient * 10 ** (i - 3))]) }); }
    case "scientific": { const value = v.value ?? 45000; if (value === 0) return result("Zero is a special case", "0 is written separately", ["The normalized coefficient rule applies to nonzero numbers."], [["Value", 0]]); const exponent = Math.floor(Math.log10(Math.abs(value))), coefficient = value / 10 ** exponent; return result("Normalize scientific notation", "x = c × 10ᵉ, 1 ≤ |c| < 10", [`The magnitude lies between 10^${exponent} and 10^${exponent + 1}.`, `Divide by 10^${exponent}: c=${fmt(coefficient)}.`, `Check c × 10^e returns the original value.`], [["Coefficient", coefficient], ["Exponent", exponent], ["Reconstructed value", coefficient * 10 ** exponent]]); }
    case "scientific-compare": { const x = a * 10 ** (v.e ?? 4), y = b * 10 ** (v.f ?? 5); return result("Compare exponents before normalized coefficients", "x = a × 10ᵉ; y = b × 10ᶠ", [`First value: ${fmt(x)}.`, `Second value: ${fmt(y)}.`, `For positive normalized coefficients, a higher exponent means a larger value.`], [["First value", x], ["Second value", y], ["Comparison", x === y ? "Equal" : x > y ? "First is larger" : "Second is larger"], ["Ratio first/second", x / y]], undefined, { kind: "bars", values: [x, y] }); }
    default: { const extended=evaluateSchoolModel(model,v)??evaluateAdvancedModel(model,v); if(extended)return extended; throw new Error(`No implemented interactive model: ${model}`); }
  }
}
export function checkAuthoredAnswer(answer: string, expected: string, tolerance = 1e-8): boolean {
  const parse = (s: string) => { const t = s.trim().replace(/,/g, ""); if (/^[+-]?\d+(?:\.\d+)?\s*\/\s*[+-]?\d+(?:\.\d+)?$/.test(t)) { const [p, q] = t.split("/").map(Number); return q === 0 ? NaN : p / q; } return /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(t) ? Number(t) : NaN; };
  const x = parse(answer), y = parse(expected);
  return Number.isFinite(x) && Number.isFinite(y) ? Math.abs(x - y) <= tolerance * Math.max(1, Math.abs(y)) : answer.trim().toLowerCase() === expected.trim().toLowerCase();
}
