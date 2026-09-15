export type Gate = "AND" | "OR" | "XOR" | "NAND" | "NOR";

export function evalGate(gate: Gate, p: boolean, q: boolean) {
  if (gate === "AND") return p && q;
  if (gate === "OR") return p || q;
  if (gate === "XOR") return p !== q;
  if (gate === "NAND") return !(p && q);
  return !(p || q);
}

export function truthTable(gate: Gate) {
  const rows = [false, true].flatMap((p) => [false, true].map((q) => ({ p, q, out: evalGate(gate, p, q) })));
  return rows;
}

export function xorFromAndOrNot(p: boolean, q: boolean) {
  return (p || q) && !(p && q);
}

export function cnfForm(gate: Gate) {
  if (gate === "AND") return "P ∧ Q";
  if (gate === "OR") return "P ∨ Q";
  if (gate === "NAND") return "¬P ∨ ¬Q";
  if (gate === "NOR") return "¬P ∧ ¬Q";
  return "(P ∨ Q) ∧ (¬P ∨ ¬Q)";
}

export function dnfForm(gate: Gate) {
  const hits = truthTable(gate).filter((row) => row.out);
  if (!hits.length) return "⊥";
  return hits.map((row) => `(${row.p ? "P" : "¬P"} ∧ ${row.q ? "Q" : "¬Q"})`).join(" ∨ ");
}

export function dpllSat(clauses: string[][]) {
  const vars = [...new Set(clauses.flatMap((c) => c.map((lit) => lit.replace("~", ""))))];
  const assign: Record<string, boolean> = {};
  const litTrue = (lit: string, env: Record<string, boolean>) => {
    const neg = lit.startsWith("~");
    const v = neg ? lit.slice(1) : lit;
    if (!(v in env)) return null;
    return neg ? !env[v] : env[v];
  };
  const search = (env: Record<string, boolean>): boolean => {
    const remaining = clauses.map((c) => c.filter((lit) => litTrue(lit, env) !== false));
    if (remaining.some((c) => c.length === 0)) return false;
    if (remaining.every((c) => c.some((lit) => litTrue(lit, env) === true))) {
      Object.assign(assign, env);
      return true;
    }
    const next = vars.find((v) => !(v in env));
    if (!next) return false;
    return search({ ...env, [next]: true }) || search({ ...env, [next]: false });
  };
  return { sat: search({}), assignment: assign };
}

export function satWitness(gate: Gate) {
  return truthTable(gate).find((row) => row.out) ?? null;
}
