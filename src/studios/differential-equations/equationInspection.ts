/** A conservative reader for text entered in the teaching labs. It never claims a symbolic solution. */
export function normalizeEquation(value: string) {
  return value.toLowerCase().replace(/[\s·*]/g, "").replace(/[−–]/g, "-").replace(/²/g, "^2").replace(/³/g, "^3");
}

export function inspectEquation(value: string) {
  const text = normalizeEquation(value);
  const hasDerivative = /dy\/dx|y'+|d\^?\d*y\/dx|∂|partial/.test(text);
  const partial = /∂|partial/.test(text);
  const derivativeOrder = /y'''|d\^3y|d3y/.test(text) ? 3 : /y''|d\^2y|d2y/.test(text) ? 2 : hasDerivative ? 1 : 0;
  const nonlinear = /y\^([2-9]|\([^)]*\))|y\*y|sin\(y\)|cos\(y\)|e\^y|\(y'\)\^2|yy'/.test(text);
  return {
    hasDerivative,
    order: derivativeOrder,
    kind: partial ? "Partial" : "Ordinary",
    linearity: nonlinear ? "Nonlinear" : "Appears linear",
    explanation: !hasDerivative
      ? "Enter a derivative such as y' or dy/dx to inspect a differential equation."
      : nonlinear
        ? "A power, product, or nonlinear function of y appears. Use a guided example for a verified solution method."
        : "The visible terms appear linear in y and its derivatives. A full classification still depends on the complete equation.",
  };
}
