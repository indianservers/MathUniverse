import { interpretVisualRequest, type IntelligenceMode } from './languageEngine';
import { FLAT_SHAPES, SOLID_SHAPES } from './shapeCatalog';

export const TRAINING_LABELS = [...FLAT_SHAPES, ...SOLID_SHAPES, 'point', 'line', 'plot', 'midpoint', 'length', 'tangent', 'anchor', 'update', 'move', 'rotate', 'reflect', 'perpendicular', 'intersection', 'compare', 'contains', 'unsupported'];
export type TrainingRow = { phrase: string; canonical: string; mode: IntelligenceMode; label: string; context?: string[] };
const modes = ['normal', 'graph2d', 'graph3d', 'geometry2d', 'geometry3d'];
export const SAMPLE_ROWS: TrainingRow[] = [
  { phrase: 'Draw a rectangle 4 by 6', canonical: 'Create rectangle width 4 height 6', mode: 'geometry2d', label: 'rectangle' },
  { phrase: 'Draw a circle of radius 5', canonical: 'Create circle radius 5', mode: 'geometry2d', label: 'circle' },
  { phrase: 'What is the midpoint of that line?', canonical: 'Find midpoint of the last line', mode: 'graph2d', label: 'midpoint', context: ['Draw line (0,0) to (6,8)'] },
  { phrase: 'Draw a perpendicular line through the midpoint', canonical: 'Draw perpendicular through midpoint of last line', mode: 'geometry2d', label: 'perpendicular', context: ['Draw line (0,0) to (6,8)'] },
  { phrase: 'Move the triangle 3 units right and 2 units up', canonical: 'Translate the triangle (3,2)', mode: 'geometry2d', label: 'move', context: ['Draw triangle (0,0) (4,0) (2,3)'] },
  { phrase: 'Reflect the shape across the y-axis', canonical: 'Reflect last object across y-axis', mode: 'geometry2d', label: 'reflect', context: ['Create triangle (1,1) (4,1) (2,3)'] },
  { phrase: 'Find where these two lines intersect', canonical: 'Find intersection of last two lines', mode: 'graph2d', label: 'intersection', context: ['Draw line (0,0) to (4,4)', 'Draw line (0,4) to (4,0)'] },
  { phrase: 'Which object is larger?', canonical: 'Compare area of last two objects', mode: 'geometry2d', label: 'compare', context: ['Create square side 3', 'Create circle radius 2'] },
  { phrase: 'Is this point inside the circle?', canonical: 'Check if last point lies inside last circle', mode: 'geometry2d', label: 'contains', context: ['Create circle radius 5', 'Create point (1,2)'] },
  { phrase: 'Rotate the square by 90 degrees', canonical: 'Rotate the square 90 degrees', mode: 'geometry2d', label: 'rotate', context: ['Create square side 4'] },
  { phrase: 'Plot y equals x squared', canonical: 'Plot y = x^2', mode: 'graph2d', label: 'plot' },
  { phrase: 'Draw a sphere of radius 3', canonical: 'Create sphere radius 3', mode: 'geometry3d', label: 'sphere' },
  { phrase: 'Draw a cube with side 4', canonical: 'Create cube side 4', mode: 'geometry3d', label: 'cube' },
  { phrase: 'Plot z equals sine x times cosine y', canonical: 'Plot z = sin(x)*cos(y)', mode: 'graph3d', label: 'plot' },
  { phrase: 'What is the midpoint of the 3D line?', canonical: 'Find midpoint of last line', mode: 'graph3d', label: 'midpoint', context: ['Draw line (0,0,0) to (6,8,2)'] },
];

export function validateRows(input: unknown[]): TrainingRow[] {
  if (!input.length || input.length > 100_000) throw new Error('Provide between 1 and 100,000 rows.');
  const seen = new Map<string, string>();
  return input.map((value, index) => {
    const row = value as TrainingRow;
    const fail = (message: string): never => { throw new Error(`Row ${index + 1}: ${message}`); };
    if (!row || typeof row.phrase !== 'string' || !row.phrase.trim() || row.phrase.length > 500) fail('phrase must contain 1–500 characters.');
    if (!modes.includes(row.mode)) fail('invalid mode.');
    if (typeof row.canonical !== 'string' || !row.canonical.trim() || row.canonical.length > 500) fail('canonical must contain 1–500 characters.');
    if (!TRAINING_LABELS.includes(row.label)) fail('unknown label.');
    if (row.context !== undefined && (!Array.isArray(row.context) || row.context.length > 20 || row.context.some(item => typeof item !== 'string' || item.length > 500 || !interpretVisualRequest(item, row.mode).command))) fail('context must contain up to 20 valid object creation commands.');
    const creation = [...FLAT_SHAPES, ...SOLID_SHAPES, 'point', 'line', 'plot'] as string[];
    if (creation.includes(row.label)) {
      const command = interpretVisualRequest(row.canonical, row.mode).command;
      if (!command || command.action !== 'create' || command.kind !== row.label) fail('canonical must be a valid creation command matching label.');
    } else if (row.label !== 'unsupported' && !row.context?.length) fail('follow-up operations require context with existing objects.');
    const key = phraseGroup(row.phrase);
    if (!key) fail('phrase needs English words for this feature encoder.');
    if (seen.has(key) && seen.get(key) !== row.label) fail('this phrase conflicts with another label.');
    seen.set(key, row.label);
    return { phrase: row.phrase.trim(), canonical: row.canonical.trim(), mode: row.mode, label: row.label, ...(row.context ? { context: row.context } : {}) };
  });
}

// Numeric variants stay together because the classifier deliberately ignores numbers.
export function phraseGroup(phrase: string) { return (phrase.toLowerCase().match(/[a-z]+/g) ?? []).join(' '); }
export function splitRows(rows: TrainingRow[]) {
  const train: TrainingRow[] = [], validation: TrainingRow[] = [], test: TrainingRow[] = [];
  for (const row of rows) {
    let hash = 2166136261;
    for (const char of phraseGroup(row.phrase)) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
    const bucket = (hash >>> 0) % 10;
    (bucket === 0 ? test : bucket === 1 ? validation : train).push(row);
  }
  return { train, validation, test };
}

export async function readDataset(file: File): Promise<TrainingRow[]> {
  if (file.size > 100 * 1024 * 1024) throw new Error('Maximum file size is 100 MB.');
  const rows: unknown[] = [];
  const reader = file.stream().pipeThrough(new TextDecoderStream()).getReader();
  let pending = '', lineNumber = 0;
  const parse = (line: string) => {
    lineNumber++;
    if (!line.trim()) return;
    if (rows.length >= 100_000) throw new Error('Maximum dataset size is 100,000 rows.');
    try { rows.push(JSON.parse(line.replace(/^\uFEFF/, ''))); }
    catch { throw new Error(`Line ${lineNumber}: invalid JSON. Use one JSON object per line (JSONL).`); }
  };
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      pending += chunk.value;
      const lines = pending.split('\n'); pending = lines.pop() ?? '';
      lines.forEach(parse);
      if (pending.length > 10_000) throw new Error('A row is too long; use one JSON object per line.');
    }
    if (pending.trim()) parse(pending);
  } finally { await reader.cancel(); reader.releaseLock(); }
  return validateRows(rows);
}
