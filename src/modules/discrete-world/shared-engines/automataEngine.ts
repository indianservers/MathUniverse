export type AutomatonKind = "dfa" | "nfa";

export type AutomatonTransition = {
  from: string;
  to: string;
  symbol: string;
};

export type FiniteAutomaton = {
  kind: AutomatonKind;
  states: string[];
  alphabet: string[];
  start: string;
  accepts: string[];
  transitions: AutomatonTransition[];
};

export type AutomatonFrame = {
  index: number;
  symbol: string;
  activeStates: string[];
  traversed: AutomatonTransition[];
  note: string;
};

export const epsilon = "";

export const sampleNfa: FiniteAutomaton = {
  kind: "nfa",
  states: ["q0", "q1", "q2"],
  alphabet: ["a", "b"],
  start: "q0",
  accepts: ["q2"],
  transitions: [
    { from: "q0", to: "q0", symbol: "a" },
    { from: "q0", to: "q1", symbol: epsilon },
    { from: "q1", to: "q2", symbol: "b" },
    { from: "q2", to: "q2", symbol: "b" },
  ],
};

export function parseTransitionList(input: string): AutomatonTransition[] {
  return input
    .split(/\n|;/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [left, right] = line.split("->").map((part) => part.trim());
      if (!left || !right) throw new Error(`Invalid transition: ${line}`);
      const [from, rawSymbol] = left.split(",").map((part) => part.trim());
      const symbol = rawSymbol === "eps" || rawSymbol === "epsilon" ? epsilon : rawSymbol;
      if (!from || rawSymbol === undefined || !right) throw new Error(`Invalid transition: ${line}`);
      return { from, symbol, to: right };
    });
}

export function serializeTransitions(transitions: AutomatonTransition[]) {
  return transitions.map((transition) => `${transition.from},${transition.symbol || "eps"} -> ${transition.to}`).join("\n");
}

export function normalizeAutomaton(machine: FiniteAutomaton): FiniteAutomaton {
  const transitionStates = machine.transitions.flatMap((transition) => [transition.from, transition.to]);
  const states = unique([machine.start, ...machine.states, ...machine.accepts, ...transitionStates]);
  const alphabet = unique([
    ...machine.alphabet,
    ...machine.transitions.map((transition) => transition.symbol).filter(Boolean),
  ]);
  return { ...machine, states, alphabet };
}

export function epsilonClosure(machine: FiniteAutomaton, seeds: string[]) {
  const normalized = normalizeAutomaton(machine);
  const closure = new Set(seeds);
  const stack = [...seeds];
  while (stack.length) {
    const state = stack.pop()!;
    normalized.transitions
      .filter((transition) => transition.from === state && transition.symbol === epsilon)
      .forEach((transition) => {
        if (closure.has(transition.to)) return;
        closure.add(transition.to);
        stack.push(transition.to);
      });
  }
  return Array.from(closure).sort();
}

export function simulateAutomaton(machine: FiniteAutomaton, input: string) {
  const normalized = normalizeAutomaton(machine);
  const frames: AutomatonFrame[] = [];
  let activeStates = normalized.kind === "nfa" ? epsilonClosure(normalized, [normalized.start]) : [normalized.start];
  frames.push({
    index: 0,
    symbol: "start",
    activeStates,
    traversed: [],
    note: `Start in ${activeStates.join(", ")}.`,
  });

  for (let index = 0; index < input.length; index += 1) {
    const symbol = input[index];
    const traversed = normalized.transitions.filter((transition) => activeStates.includes(transition.from) && transition.symbol === symbol);
    const next = unique(traversed.map((transition) => transition.to));
    activeStates = normalized.kind === "nfa" ? epsilonClosure(normalized, next) : next.slice(0, 1);
    frames.push({
      index: index + 1,
      symbol,
      activeStates,
      traversed,
      note: activeStates.length
        ? `Read ${symbol}; active states: ${activeStates.join(", ")}.`
        : `Read ${symbol}; no transition remains active.`,
    });
  }

  const accepted = activeStates.some((state) => normalized.accepts.includes(state));
  return { accepted, frames, finalStates: activeStates };
}

export function determinizeNfa(machine: FiniteAutomaton): FiniteAutomaton {
  const normalized = normalizeAutomaton({ ...machine, kind: "nfa" });
  const startSet = epsilonClosure(normalized, [normalized.start]);
  const queue = [startSet];
  const seen = new Set([stateSetId(startSet)]);
  const transitions: AutomatonTransition[] = [];
  const accepts = new Set<string>();

  while (queue.length) {
    const current = queue.shift()!;
    const currentId = stateSetId(current);
    if (current.some((state) => normalized.accepts.includes(state))) accepts.add(currentId);
    normalized.alphabet.forEach((symbol) => {
      const reached = normalized.transitions
        .filter((transition) => current.includes(transition.from) && transition.symbol === symbol)
        .map((transition) => transition.to);
      const closed = epsilonClosure(normalized, reached);
      if (!closed.length) return;
      const nextId = stateSetId(closed);
      transitions.push({ from: currentId, symbol, to: nextId });
      if (seen.has(nextId)) return;
      seen.add(nextId);
      queue.push(closed);
    });
  }

  return {
    kind: "dfa",
    states: Array.from(seen),
    alphabet: normalized.alphabet,
    start: stateSetId(startSet),
    accepts: Array.from(accepts),
    transitions,
  };
}

export function minimizeDfa(machine: FiniteAutomaton) {
  const dfa = normalizeAutomaton({ ...machine, kind: "dfa" });
  const accepting = new Set(dfa.accepts);
  let partitions = [
    dfa.states.filter((state) => accepting.has(state)),
    dfa.states.filter((state) => !accepting.has(state)),
  ].filter((part) => part.length);
  let changed = true;
  while (changed) {
    changed = false;
    const nextPartitions: string[][] = [];
    for (const part of partitions) {
      const buckets = new Map<string, string[]>();
      part.forEach((state) => {
        const signature = dfa.alphabet.map((symbol) => {
          const target = dfa.transitions.find((transition) => transition.from === state && transition.symbol === symbol)?.to ?? "";
          return partitions.findIndex((candidate) => candidate.includes(target));
        }).join(",");
        buckets.set(signature, [...(buckets.get(signature) ?? []), state]);
      });
      nextPartitions.push(...buckets.values());
      if (buckets.size > 1) changed = true;
    }
    partitions = nextPartitions;
  }
  return {
    partitions,
    stateCount: partitions.length,
    explanation: partitions.map((part, index) => `M${index} = { ${part.join(", ")} }`),
  };
}

type RegexAst =
  | { type: "literal"; value: string }
  | { type: "epsilon" }
  | { type: "concat"; left: RegexAst; right: RegexAst }
  | { type: "union"; left: RegexAst; right: RegexAst }
  | { type: "star"; child: RegexAst };

export function regexToNfa(pattern: string): FiniteAutomaton {
  const ast = parseRegex(pattern);
  let stateCounter = 0;
  const transitions: AutomatonTransition[] = [];
  const nextState = () => `r${stateCounter++}`;
  const build = (node: RegexAst): { start: string; accept: string } => {
    if (node.type === "literal") {
      const start = nextState();
      const accept = nextState();
      transitions.push({ from: start, to: accept, symbol: node.value });
      return { start, accept };
    }
    if (node.type === "epsilon") {
      const start = nextState();
      const accept = nextState();
      transitions.push({ from: start, to: accept, symbol: epsilon });
      return { start, accept };
    }
    if (node.type === "concat") {
      const left = build(node.left);
      const right = build(node.right);
      transitions.push({ from: left.accept, to: right.start, symbol: epsilon });
      return { start: left.start, accept: right.accept };
    }
    if (node.type === "union") {
      const start = nextState();
      const accept = nextState();
      const left = build(node.left);
      const right = build(node.right);
      transitions.push({ from: start, to: left.start, symbol: epsilon }, { from: start, to: right.start, symbol: epsilon });
      transitions.push({ from: left.accept, to: accept, symbol: epsilon }, { from: right.accept, to: accept, symbol: epsilon });
      return { start, accept };
    }
    const start = nextState();
    const accept = nextState();
    const child = build(node.child);
    transitions.push({ from: start, to: child.start, symbol: epsilon }, { from: start, to: accept, symbol: epsilon });
    transitions.push({ from: child.accept, to: child.start, symbol: epsilon }, { from: child.accept, to: accept, symbol: epsilon });
    return { start, accept };
  };
  const built = build(ast);
  return normalizeAutomaton({
    kind: "nfa",
    states: [],
    alphabet: Array.from(new Set(pattern.replace(/[()*|]/g, "").split("").filter(Boolean))),
    start: built.start,
    accepts: [built.accept],
    transitions,
  });
}

export type PdaTransition = {
  from: string;
  input: string;
  pop: string;
  push: string;
  to: string;
};

export type PushdownAutomaton = {
  start: string;
  accepts: string[];
  bottom: string;
  transitions: PdaTransition[];
};

export const balancedParenthesesPda: PushdownAutomaton = {
  start: "scan",
  accepts: ["accept"],
  bottom: "$",
  transitions: [
    { from: "scan", input: "(", pop: "$", push: "$(", to: "scan" },
    { from: "scan", input: "(", pop: "(", push: "((", to: "scan" },
    { from: "scan", input: ")", pop: "(", push: "", to: "scan" },
    { from: "scan", input: "", pop: "$", push: "$", to: "accept" },
  ],
};

export function simulatePda(machine: PushdownAutomaton, input: string, maxSteps = 80) {
  type Config = { state: string; index: number; stack: string[]; trace: string[] };
  const queue: Config[] = [{ state: machine.start, index: 0, stack: [machine.bottom], trace: ["Start with bottom marker."] }];
  const seen = new Set<string>();
  while (queue.length) {
    const config = queue.shift()!;
    const key = `${config.state}:${config.index}:${config.stack.join("")}`;
    if (seen.has(key) || config.trace.length > maxSteps) continue;
    seen.add(key);
    if (machine.accepts.includes(config.state) && config.index === input.length) return { accepted: true, trace: config.trace, stack: config.stack };
    const top = config.stack[config.stack.length - 1] ?? "";
    const symbol = input[config.index] ?? "";
    machine.transitions
      .filter((transition) => transition.from === config.state && transition.pop === top && (transition.input === symbol || transition.input === ""))
      .forEach((transition) => {
        const nextStack = config.stack.slice(0, -1);
        transition.push.split("").forEach((item) => {
          if (item) nextStack.push(item);
        });
        queue.push({
          state: transition.to,
          index: config.index + (transition.input ? 1 : 0),
          stack: nextStack,
          trace: [...config.trace, `${transition.from}, ${transition.input || "eps"}, pop ${transition.pop}, push ${transition.push || "eps"} -> ${transition.to}`],
        });
      });
  }
  return { accepted: false, trace: ["No accepting PDA branch found."], stack: [] };
}

function parseRegex(pattern: string): RegexAst {
  const tokens = insertConcat(pattern.replace(/\s+/g, "")).split("");
  const output: string[] = [];
  const ops: string[] = [];
  const precedence: Record<string, number> = { "|": 1, ".": 2, "*": 3 };
  tokens.forEach((token) => {
    if (/^[A-Za-z0-9]$/.test(token)) output.push(token);
    else if (token === "(") ops.push(token);
    else if (token === ")") {
      while (ops.length && ops[ops.length - 1] !== "(") output.push(ops.pop()!);
      ops.pop();
    } else {
      while (ops.length && ops[ops.length - 1] !== "(" && precedence[ops[ops.length - 1]] >= precedence[token]) output.push(ops.pop()!);
      ops.push(token);
    }
  });
  while (ops.length) output.push(ops.pop()!);
  const stack: RegexAst[] = [];
  output.forEach((token) => {
    if (/^[A-Za-z0-9]$/.test(token)) stack.push({ type: "literal", value: token });
    else if (token === "*") stack.push({ type: "star", child: stack.pop() ?? { type: "epsilon" } });
    else {
      const right = stack.pop() ?? { type: "epsilon" };
      const left = stack.pop() ?? { type: "epsilon" };
      stack.push(token === "|" ? { type: "union", left, right } : { type: "concat", left, right });
    }
  });
  return stack[0] ?? { type: "epsilon" };
}

function insertConcat(pattern: string) {
  let output = "";
  for (let index = 0; index < pattern.length; index += 1) {
    const current = pattern[index];
    const next = pattern[index + 1];
    output += current;
    if (!next) continue;
    if ((/^[A-Za-z0-9)]$/.test(current) || current === "*") && (/^[A-Za-z0-9(]$/.test(next))) output += ".";
  }
  return output;
}

function stateSetId(states: string[]) {
  return `{${states.join(",")}}`;
}

function unique(values: string[]) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}
