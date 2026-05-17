import { useMemo, useState } from "react";
import SectionCard from "../components/ui/SectionCard";
import TopicHeader from "../components/ui/TopicHeader";

type Token = { type: "var" | "op" | "left" | "right"; value: string };

const precedence: Record<string, number> = { "!": 4, "&": 3, "|": 2, ">": 1, "=": 0 };

export default function TruthTableGenerator() {
  const [expression, setExpression] = useState("(P & Q) -> R");
  const parsed = useMemo(() => buildTruthTable(expression), [expression]);

  return (
    <div className="space-y-6">
      <TopicHeader title="Truth Table Generator" subtitle="Enter propositional logic and generate every valuation automatically." difficulty="Logic Tool" estimatedMinutes={8} />
      <SectionCard title="Expression" description="Use ! for NOT, & for AND, | for OR, -> for implication, <-> for biconditional, and parentheses.">
        <input className="w-full rounded-2xl border border-slate-200 bg-white p-4 font-mono text-lg dark:border-white/10 dark:bg-slate-950/60" value={expression} onChange={(event) => setExpression(event.target.value)} />
        <div className="mt-4 rounded-2xl bg-slate-100 p-4 font-mono text-sm dark:bg-white/10">
          {highlight(expression).map((part, index) => <span key={`${part.text}-${index}`} className={part.className}>{part.text}</span>)}
        </div>
      </SectionCard>
      <SectionCard title="Truth Table">
        {parsed.error ? (
          <p className="rounded-2xl bg-rose-50 p-4 font-semibold text-rose-700 dark:bg-rose-400/10 dark:text-rose-200">{parsed.error}</p>
        ) : (
          <div className="mobile-safe-scroll">
            <table className="min-w-full overflow-hidden rounded-2xl text-sm">
              <thead className="bg-slate-100 dark:bg-white/10">
                <tr>{[...parsed.variables, expression].map((header) => <th key={header} className="px-4 py-3 text-left font-black">{header}</th>)}</tr>
              </thead>
              <tbody>
                {parsed.rows.map((row, index) => (
                  <tr key={index} className="border-t border-slate-200 dark:border-white/10">
                    {parsed.variables.map((variable) => <td key={variable} className="px-4 py-3 font-mono">{row.values[variable] ? "T" : "F"}</td>)}
                    <td className="px-4 py-3 font-mono font-black text-cyan-700 dark:text-cyan-200">{row.result ? "T" : "F"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );
}

function buildTruthTable(input: string) {
  try {
    const tokens = tokenize(input);
    const rpn = toRpn(tokens);
    const variables = Array.from(new Set(tokens.filter((token) => token.type === "var").map((token) => token.value))).sort();
    if (!variables.length) throw new Error("Add at least one variable.");
    const rows = Array.from({ length: 2 ** variables.length }, (_, mask) => {
      const values = Object.fromEntries(variables.map((variable, index) => [variable, Boolean(mask & (1 << (variables.length - index - 1)))])) as Record<string, boolean>;
      return { values, result: evaluateRpn(rpn, values) };
    });
    return { variables, rows, error: "" };
  } catch (error) {
    return { variables: [], rows: [], error: error instanceof Error ? error.message : "Invalid expression" };
  }
}

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  for (let index = 0; index < input.length;) {
    const char = input[index];
    if (/\s/.test(char)) { index += 1; continue; }
    if (/[A-Za-z]/.test(char)) {
      let name = "";
      while (/[A-Za-z0-9_]/.test(input[index] ?? "")) name += input[index++];
      tokens.push({ type: "var", value: name });
      continue;
    }
    if (input.startsWith("<->", index)) { tokens.push({ type: "op", value: "=" }); index += 3; continue; }
    if (input.startsWith("->", index)) { tokens.push({ type: "op", value: ">" }); index += 2; continue; }
    if ("!&|".includes(char)) tokens.push({ type: "op", value: char });
    else if (char === "(") tokens.push({ type: "left", value: char });
    else if (char === ")") tokens.push({ type: "right", value: char });
    else throw new Error(`Unexpected token: ${char}`);
    index += 1;
  }
  return tokens;
}

function toRpn(tokens: Token[]) {
  const output: Token[] = [];
  const ops: Token[] = [];
  tokens.forEach((token) => {
    if (token.type === "var") output.push(token);
    if (token.type === "op") {
      while (ops.length && ops[ops.length - 1].type === "op" && precedence[ops[ops.length - 1].value] >= precedence[token.value]) output.push(ops.pop()!);
      ops.push(token);
    }
    if (token.type === "left") ops.push(token);
    if (token.type === "right") {
      while (ops.length && ops[ops.length - 1].type !== "left") output.push(ops.pop()!);
      if (!ops.length) throw new Error("Mismatched parentheses");
      ops.pop();
    }
  });
  while (ops.length) {
    const op = ops.pop()!;
    if (op.type === "left") throw new Error("Mismatched parentheses");
    output.push(op);
  }
  return output;
}

function evaluateRpn(rpn: Token[], values: Record<string, boolean>) {
  const stack: boolean[] = [];
  rpn.forEach((token) => {
    if (token.type === "var") stack.push(values[token.value]);
    if (token.type === "op") {
      if (token.value === "!") stack.push(!stack.pop());
      else {
        const b = stack.pop();
        const a = stack.pop();
        if (a === undefined || b === undefined) throw new Error("Missing operand");
        if (token.value === "&") stack.push(a && b);
        if (token.value === "|") stack.push(a || b);
        if (token.value === ">") stack.push(!a || b);
        if (token.value === "=") stack.push(a === b);
      }
    }
  });
  if (stack.length !== 1) throw new Error("Invalid expression");
  return stack[0];
}

function highlight(input: string) {
  return input.split(/(\s+|<->|->|[()!&|])/g).filter(Boolean).map((text) => ({
    text,
    className: /[()]/.test(text) ? "text-violet-600 dark:text-violet-300" : /<->|->|[!&|]/.test(text) ? "font-black text-cyan-700 dark:text-cyan-200" : /[A-Za-z]/.test(text) ? "text-amber-700 dark:text-amber-200" : "",
  }));
}
