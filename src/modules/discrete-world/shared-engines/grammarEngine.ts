export type GrammarRule = {
  from: string;
  alternatives: string[][];
};

export type Grammar = {
  start: string;
  terminals: string[];
  variables: string[];
  rules: GrammarRule[];
};

export type DerivationStep = {
  sententialForm: string[];
  appliedRule: string;
};

export const sampleGrammar: Grammar = {
  start: "S",
  terminals: ["a", "b"],
  variables: ["S"],
  rules: [{ from: "S", alternatives: [["a", "S", "b"], ["a", "b"]] }],
};

export function parseGrammar(input: string, start = "S"): Grammar {
  const rules = input
    .split(/\n|;/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [from, right] = line.split("->").map((part) => part.trim());
      if (!from || !right) throw new Error(`Invalid production: ${line}`);
      const alternatives = right.split("|").map((alt) => tokenizeProduction(alt.trim()));
      return { from, alternatives };
    });
  const variables = Array.from(new Set(rules.map((rule) => rule.from)));
  const terminals = Array.from(new Set(rules.flatMap((rule) => rule.alternatives.flat()).filter((symbol) => !variables.includes(symbol) && symbol !== "eps")));
  return { start, terminals, variables, rules };
}

export function serializeGrammar(grammar: Grammar) {
  return grammar.rules.map((rule) => `${rule.from} -> ${rule.alternatives.map((alt) => alt.join(" ") || "eps").join(" | ")}`).join("\n");
}

export function deriveString(grammar: Grammar, target: string, maxSteps = 10) {
  const targetSymbols = target.split("");
  const queue: DerivationStep[][] = [[{ sententialForm: [grammar.start], appliedRule: "start" }]];
  const visited = new Set<string>([grammar.start]);

  while (queue.length) {
    const path = queue.shift()!;
    const current = path[path.length - 1].sententialForm;
    if (current.join("") === target) return { accepted: true, steps: path };
    if (path.length > maxSteps || terminalPrefixTooLong(current, targetSymbols, grammar.variables)) continue;

    const variableIndex = current.findIndex((symbol) => grammar.variables.includes(symbol));
    if (variableIndex < 0) continue;
    const variable = current[variableIndex];
    const rule = grammar.rules.find((item) => item.from === variable);
    if (!rule) continue;
    for (const alt of rule.alternatives) {
      const replacement = alt[0] === "eps" ? [] : alt;
      const next = [...current.slice(0, variableIndex), ...replacement, ...current.slice(variableIndex + 1)];
      const key = `${next.join(" ")}:${path.length}`;
      if (visited.has(key)) continue;
      visited.add(key);
      queue.push([...path, { sententialForm: next, appliedRule: `${variable} -> ${alt.join(" ")}` }]);
    }
  }

  return { accepted: false, steps: queue[0] ?? [] };
}

export function grammarClassification(grammar: Grammar) {
  const regular = grammar.rules.every((rule) =>
    rule.alternatives.every((alt) => alt.length <= 2 && (alt.length < 2 || grammar.variables.includes(alt[1])))
  );
  const contextFree = grammar.rules.every((rule) => rule.from.length === 1 && grammar.variables.includes(rule.from));
  return {
    regular,
    contextFree,
    type: regular ? "Regular grammar" : contextFree ? "Context-free grammar" : "Unrestricted grammar preview",
  };
}

export function boundedDerivations(grammar: Grammar, target: string, maxSteps = 8) {
  const results: DerivationStep[][] = [];
  const queue: DerivationStep[][] = [[{ sententialForm: [grammar.start], appliedRule: "start" }]];
  while (queue.length && results.length < 12) {
    const path = queue.shift()!;
    const current = path[path.length - 1].sententialForm;
    if (current.join("") === target) {
      results.push(path);
      continue;
    }
    if (path.length > maxSteps || terminalPrefixTooLong(current, target.split(""), grammar.variables)) continue;
    const variableIndex = current.findIndex((symbol) => grammar.variables.includes(symbol));
    if (variableIndex < 0) continue;
    const rule = grammar.rules.find((item) => item.from === current[variableIndex]);
    if (!rule) continue;
    rule.alternatives.forEach((alt) => {
      const replacement = alt[0] === "eps" ? [] : alt;
      queue.push([...path, {
        sententialForm: [...current.slice(0, variableIndex), ...replacement, ...current.slice(variableIndex + 1)],
        appliedRule: `${rule.from} -> ${alt.join(" ")}`,
      }]);
    });
  }
  return results;
}

export function ambiguityCheck(grammar: Grammar, target: string) {
  const derivations = boundedDerivations(grammar, target, 9);
  return {
    ambiguous: derivations.length > 1,
    derivationCount: derivations.length,
    note: derivations.length > 1
      ? `${target} has multiple bounded leftmost derivations.`
      : `${target} has ${derivations.length} bounded derivation(s).`,
  };
}

export function parseTreeLevels(steps: DerivationStep[]) {
  return steps.map((step, index) => ({
    level: index,
    nodes: step.sententialForm.map((symbol, symbolIndex) => ({ id: `${index}-${symbolIndex}-${symbol}`, label: symbol })),
    rule: step.appliedRule,
  }));
}

export function cnfPreview(grammar: Grammar) {
  const steps = [
    "Add a fresh start symbol when the original start appears on a right-hand side.",
    "Remove epsilon productions while preserving nullable combinations.",
    "Remove unit productions A -> B.",
    "Replace terminals inside long productions with terminal variables.",
    "Break productions longer than two symbols into binary productions.",
  ];
  const alreadyBinary = grammar.rules.every((rule) => rule.alternatives.every((alt) => alt.length <= 2));
  return { alreadyBinary, steps };
}

function tokenizeProduction(input: string) {
  if (!input || input === "eps" || input === "epsilon") return ["eps"];
  const spaced = input.trim().split(/\s+/);
  return spaced.length > 1 ? spaced : input.trim().split("");
}

function terminalPrefixTooLong(form: string[], target: string[], variables: string[]) {
  const terminalPrefix = form.filter((symbol) => !variables.includes(symbol));
  return terminalPrefix.length > target.length;
}
