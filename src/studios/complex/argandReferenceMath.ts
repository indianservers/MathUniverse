export function complexLabel(a: number, b: number) {
  const number = (n: number) => Number(n.toFixed(2)).toString();
  return `${number(a)} ${b < 0 ? "−" : "+"} ${number(Math.abs(b))}i`;
}

/** Small explicit answer grammar; never evaluates user-supplied JavaScript. */
export function argandNumber(raw: string) {
  const value = raw
    .trim()
    .toLowerCase()
    .replace(/−/g, "-")
    .replace(/[\s°]/g, "");
  if (!value) return NaN;
  const root = value.match(/^(?:sqrt\(?|√\(?)(\d+(?:\.\d+)?)\)?$/);
  if (root) return Math.sqrt(Number(root[1]));
  const pi =
    value.match(/^([+-]?\d*(?:\.\d+)?)π(?:\/([+-]?\d+(?:\.\d+)?))?$/) ??
    value
      .replace(/pi/g, "π")
      .match(/^([+-]?\d*(?:\.\d+)?)π(?:\/([+-]?\d+(?:\.\d+)?))?$/);
  if (pi)
    return (
      ((pi[1] === "-" ? -1 : pi[1] === "+" ? 1 : Number(pi[1] || 1)) *
        Math.PI) /
      Number(pi[2] || 1)
    );
  const fraction = value.match(/^([+-]?\d+(?:\.\d+)?)\/([+-]?\d+(?:\.\d+)?)$/);
  if (fraction) return Number(fraction[1]) / Number(fraction[2]);
  return /^[+-]?\d+(?:\.\d+)?$/.test(value) ? Number(value) : NaN;
}

export function argandComplex(raw: string): [number, number] | null {
  const value = raw.trim().replace(/−/g, "-").replace(/\s/g, "").toLowerCase();
  const match = value.match(/^([+-]?\d+(?:\.\d+)?)([+-]\d*(?:\.\d+)?)i$/);
  if (!match) return null;
  return [
    Number(match[1]),
    match[2] === "+" ? 1 : match[2] === "-" ? -1 : Number(match[2]),
  ];
}
