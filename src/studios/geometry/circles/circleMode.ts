export const CIRCLE_MODES = [
  {
    id: "chords",
    label: "Chords",
    url: "Chords",
    description: "Equal chords, bisectors and distances",
  },
  {
    id: "tangents",
    label: "Tangents",
    url: "Tangents",
    description: "Contact points and tangent properties",
  },
  {
    id: "angles",
    label: "Angles",
    url: "Angles",
    description: "Central, inscribed and intersecting angles",
  },
  {
    id: "power",
    label: "Power of a Point",
    url: "Power of a Point",
    description: "Secants, tangents and segment products",
  },
  {
    id: "arcs",
    label: "Arcs & Sectors",
    url: "Arcs & Sectors",
    description: "Arc measure, length and sector area",
  },
] as const;

export type CircleModeId = (typeof CIRCLE_MODES)[number]["id"];

const ALIAS_TO_ID: Record<string, CircleModeId> = {
  chords: "chords",
  chord: "chords",
  tangents: "tangents",
  tangent: "tangents",
  angles: "angles",
  angle: "angles",
  power: "power",
  "power of a point": "power",
  "power of point": "power",
  "power-of-a-point": "power",
  arcs: "arcs",
  "arcs & sectors": "arcs",
  "arcs and sectors": "arcs",
  "arc & sector": "arcs",
  sectors: "arcs",
};

function normalizeModeKey(raw: string): string {
  return decodeURIComponent(raw)
    .trim()
    .toLowerCase()
    .replace(/[_+]+/g, " ")
    .replace(/&/g, "&")
    .replace(/\s+/g, " ");
}

export function parseCircleMode(raw: string | null | undefined): CircleModeId {
  if (!raw) return "chords";
  const key = normalizeModeKey(raw);
  if (ALIAS_TO_ID[key]) return ALIAS_TO_ID[key];
  const andKey = key.replace(/&/g, "and");
  if (ALIAS_TO_ID[andKey]) return ALIAS_TO_ID[andKey];
  return "chords";
}

export function circleModeUrl(id: CircleModeId): string {
  return CIRCLE_MODES.find((mode) => mode.id === id)?.url ?? "Chords";
}

export function circleModeMeta(id: CircleModeId) {
  return CIRCLE_MODES.find((mode) => mode.id === id) ?? CIRCLE_MODES[0];
}

export const ANGLE_KINDS = ["central", "inscribed", "semi", "chords", "secants", "tangent", "cyclic"] as const;
export const POWER_KINDS = ["chord", "secant", "tangent", "radical"] as const;
export type AngleKind = (typeof ANGLE_KINDS)[number];
export type PowerKind = (typeof POWER_KINDS)[number];

export function parseAngleKind(raw: string | null | undefined): AngleKind {
  const key = (raw ?? "inscribed").toLowerCase();
  return (ANGLE_KINDS as readonly string[]).includes(key) ? (key as AngleKind) : "inscribed";
}

export function parsePowerKind(raw: string | null | undefined): PowerKind {
  const key = (raw ?? "chord").toLowerCase();
  return (POWER_KINDS as readonly string[]).includes(key) ? (key as PowerKind) : "chord";
}
