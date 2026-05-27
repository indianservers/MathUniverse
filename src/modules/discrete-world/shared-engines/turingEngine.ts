export type TuringMove = "L" | "R" | "S";

export type TuringTransition = {
  state: string;
  read: string;
  write: string;
  move: TuringMove;
  next: string;
};

export type TuringMachine = {
  states: string[];
  start: string;
  halt: string[];
  blank: string;
  transitions: TuringTransition[];
};

export type TuringFrame = {
  step: number;
  state: string;
  head: number;
  tape: Record<number, string>;
  note: string;
};

export const unaryIncrementMachine: TuringMachine = {
  states: ["scan", "halt"],
  start: "scan",
  halt: ["halt"],
  blank: "_",
  transitions: [
    { state: "scan", read: "1", write: "1", move: "R", next: "scan" },
    { state: "scan", read: "_", write: "1", move: "S", next: "halt" },
  ],
};

export function parseTuringTransitions(input: string): TuringTransition[] {
  return input
    .split(/\n|;/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [left, right] = line.split("->").map((part) => part.trim());
      const [state, read] = left.split(",").map((part) => part.trim());
      const [write, move, next] = right.split(",").map((part) => part.trim());
      if (!state || read === undefined || !write || !["L", "R", "S"].includes(move) || !next) {
        throw new Error(`Invalid transition: ${line}`);
      }
      return { state, read, write, move: move as TuringMove, next };
    });
}

export function serializeTuringTransitions(transitions: TuringTransition[]) {
  return transitions.map((transition) => `${transition.state},${transition.read} -> ${transition.write},${transition.move},${transition.next}`).join("\n");
}

export function simulateTuring(machine: TuringMachine, input: string, maxSteps = 40) {
  let state = machine.start;
  let head = 0;
  const tape: Record<number, string> = {};
  input.split("").forEach((symbol, index) => { tape[index] = symbol; });
  const frames: TuringFrame[] = [{ step: 0, state, head, tape: { ...tape }, note: "Initial tape loaded." }];

  for (let step = 1; step <= maxSteps; step += 1) {
    if (machine.halt.includes(state)) break;
    const read = tape[head] ?? machine.blank;
    const transition = machine.transitions.find((item) => item.state === state && item.read === read);
    if (!transition) {
      frames.push({ step, state, head, tape: { ...tape }, note: `No rule for (${state}, ${read}); halted.` });
      break;
    }
    tape[head] = transition.write;
    state = transition.next;
    if (transition.move === "L") head -= 1;
    if (transition.move === "R") head += 1;
    frames.push({
      step,
      state,
      head,
      tape: { ...tape },
      note: `Write ${transition.write}, move ${transition.move}, enter ${transition.next}.`,
    });
  }

  return { halted: machine.halt.includes(state), frames };
}

export function visibleTape(frame: TuringFrame, blank = "_", radius = 8) {
  return Array.from({ length: radius * 2 + 1 }, (_, index) => {
    const position = frame.head - radius + index;
    return { position, symbol: frame.tape[position] ?? blank, active: position === frame.head };
  });
}

export function simulateTwoTapeCopy(input: string) {
  const source: Record<number, string> = {};
  const target: Record<number, string> = {};
  input.split("").forEach((symbol, index) => { source[index] = symbol; });
  const frames: Array<{ step: number; sourceHead: number; targetHead: number; source: Record<number, string>; target: Record<number, string>; note: string }> = [];
  let sourceHead = 0;
  let targetHead = 0;
  frames.push({ step: 0, sourceHead, targetHead, source: { ...source }, target: { ...target }, note: "Two-tape copy machine starts at the left edge." });
  for (let step = 1; step <= input.length; step += 1) {
    const symbol = source[sourceHead] ?? "_";
    target[targetHead] = symbol;
    frames.push({ step, sourceHead, targetHead, source: { ...source }, target: { ...target }, note: `Copy ${symbol} from tape 1 to tape 2, then move both heads right.` });
    sourceHead += 1;
    targetHead += 1;
  }
  frames.push({ step: input.length + 1, sourceHead, targetHead, source: { ...source }, target: { ...target }, note: "Blank reached on tape 1; halt." });
  return frames;
}

export function universalMachineEncoding(machine: TuringMachine) {
  const states = new Map(machine.states.map((state, index) => [state, `q${index}`]));
  return machine.transitions.map((transition, index) => ({
    index,
    encoded: `${states.get(transition.state) ?? transition.state}|${transition.read}|${transition.write}|${transition.move}|${states.get(transition.next) ?? transition.next}`,
    meaning: `If state=${transition.state} and read=${transition.read}, write ${transition.write}, move ${transition.move}, enter ${transition.next}.`,
  }));
}
