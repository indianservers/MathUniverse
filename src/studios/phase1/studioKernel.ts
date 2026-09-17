export function formatExactApprox(value: number, exact: boolean, digits = 4) {
  if (!Number.isFinite(value)) return "—";
  if (!exact) {
    const factor = 10 ** digits;
    return String(Math.round(value * factor) / factor);
  }
  const rounded = Math.round(value);
  if (Math.abs(value - rounded) < 1e-9) return String(rounded);
  const abs = Math.abs(value);
  for (let den = 2; den <= 24; den += 1) {
    const num = Math.round(value * den);
    if (Math.abs(value - num / den) < 1e-6) return `${num}/${den}`;
  }
  if (Math.abs(abs - Math.SQRT2) < 1e-6) return value < 0 ? "−√2" : "√2";
  if (Math.abs(abs - Math.SQRT1_2) < 1e-6) return value < 0 ? "−√2/2" : "√2/2";
  const factor = 10 ** digits;
  return String(Math.round(value * factor) / factor);
}

export function encodeFigState(value: unknown) {
  const json = JSON.stringify(value);
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeFigState<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    const padded = raw.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(raw.length / 4) * 4, "=");
    const binary = atob(padded);
    const json = new TextDecoder().decode(Uint8Array.from(binary, (ch) => characterCode(ch)));
    const parsed: unknown = JSON.parse(json);
    return parsed && typeof parsed === "object" ? { ...fallback, ...(parsed as object) } as T : fallback;
  } catch {
    return fallback;
  }
}

function characterCode(ch: string) {
  return ch.charCodeAt(0);
}

export function challengeMatches(answer: string, expected: number, tolerance = 0.03) {
  const text = answer.trim().replace(/−/g, "-").replace(/\s/g, "").toLowerCase();
  if (!text) return false;
  let value = Number(text);
  if (text.includes("/")) {
    const [num, den] = text.split("/");
    if (num && den && Number(den) !== 0) value = Number(num) / Number(den);
  }
  return Number.isFinite(value) && Math.abs(value - expected) < tolerance;
}
