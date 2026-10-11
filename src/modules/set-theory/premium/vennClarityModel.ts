import type { Expression } from "./math";
import { expressionResult } from "./math";
import type { Model } from "./vennLearningEngine";
export const operationHelp: Record<
  Expression,
  { name: string; read: string; rule: string; tip: string }
> = {
  "A ∪ B": {
    name: "Union · either",
    read: "A union B",
    rule: "Include everyone in A or B, including members in both.",
    tip: "The overlap is included once, never twice.",
  },
  "A ∩ B": {
    name: "Intersection · both",
    read: "A intersection B",
    rule: "Include only members belonging to both A and B.",
    tip: "Members may also belong to C; that does not exclude them.",
  },
  "A − B": {
    name: "Difference · A without B",
    read: "A minus B",
    rule: "Start with A and remove every member of B.",
    tip: "Order matters: A minus B can differ from B minus A.",
  },
  "B − A": {
    name: "Difference · B without A",
    read: "B minus A",
    rule: "Start with B and remove every member of A.",
    tip: "An element must belong to B and must not belong to A.",
  },
  Aᶜ: {
    name: "Complement · outside A",
    read: "A complement",
    rule: "Include every member of U that does not belong to A.",
    tip: "Complement always depends on the chosen universe.",
  },
  Bᶜ: {
    name: "Complement · outside B",
    read: "B complement",
    rule: "Include every member of U that does not belong to B.",
    tip: "Elements outside all three circles can be included.",
  },
  "A △ B": {
    name: "Exactly one · not both",
    read: "A symmetric difference B",
    rule: "Include members in A or B, but exclude their shared members.",
    tip: "The overlap is excluded; the two exclusive parts remain.",
  },
  "A ∩ B ∩ C": {
    name: "All three",
    read: "A intersection B intersection C",
    rule: "Include only members belonging to all three sets.",
    tip: "Look at the central region shared by A, B and C.",
  },
  "A ∪ B ∪ C": {
    name: "Any of the three",
    read: "A union B union C",
    rule: "Include members belonging to at least one of the three sets.",
    tip: "Exclude only the region outside all three circles.",
  },
};
export function operationPartition(expression: Expression, model: Model) {
  const included = expressionResult(
    expression,
    model.universe,
    model.setA,
    model.setB,
    model.setC,
  );
  return {
    included: model.universe.filter((x) => included.includes(x)),
    excluded: model.universe.filter((x) => !included.includes(x)),
  };
}
