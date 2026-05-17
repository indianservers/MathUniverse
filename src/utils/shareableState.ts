const SLIDER_PARAM_PREFIX = "v_";

const replacements: Record<string, string> = {
  θ: "theta",
  Θ: "theta",
  φ: "phi",
  Φ: "phi",
  π: "pi",
  Π: "pi",
  Δ: "delta",
  δ: "delta",
  λ: "lambda",
  μ: "mu",
  Σ: "sigma",
  σ: "sigma",
};

export function sliderQueryKey(label: string) {
  const expanded = Array.from(label)
    .map((char) => replacements[char] ?? char)
    .join("");
  const slug = expanded
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 42);

  return `${SLIDER_PARAM_PREFIX}${slug || "value"}`;
}

export function readSliderParam(label: string) {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  const raw = params.get(sliderQueryKey(label));
  if (raw === null) return null;

  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

export function writeSliderParam(label: string, value: number) {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);
  url.searchParams.set(sliderQueryKey(label), compactNumber(value));
  window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
}

function compactNumber(value: number) {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(4)));
}
