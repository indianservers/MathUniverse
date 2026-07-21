export type SetLogicVisualMode = "union" | "intersection" | "difference" | "complement" | "cardinality" | "cartesian" | "implication" | "biconditional" | "contrapositive";

export function getSetLogicVisualMode(formulaId: string): SetLogicVisualMode {
  if (formulaId === "set-union") return "union";
  if (formulaId === "set-intersection") return "intersection";
  if (formulaId === "set-difference") return "difference";
  if (formulaId === "de-morgan-union") return "complement";
  if (formulaId === "cardinality-union") return "cardinality";
  if (formulaId === "cartesian-product") return "cartesian";
  if (formulaId === "biconditional") return "biconditional";
  if (formulaId === "contrapositive") return "contrapositive";
  return "implication";
}
