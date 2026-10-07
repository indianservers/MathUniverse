import * as tf from '@tensorflow/tfjs';
import { INTELLIGENCE_EXAMPLES } from './expressionCorpus';
import { interpretVisualRequest, type IntelligenceMode, type VisualCommand } from './languageEngine';
import { FLAT_SHAPES, SOLID_SHAPES } from './shapeCatalog';
import {contextualRequest, type RoboObject} from './objectConversation';
import {nlp150Corpus} from './nlp150Corpus';

const KEY = 'math-robo-learning-v1';
const MODEL = 'indexeddb://math-robo-intents-v3';
const SIGNATURE = `${KEY}-model-signature`;
const FEATURES = 512;
const labels = [...FLAT_SHAPES, ...SOLID_SHAPES, 'point', 'line', 'plot', 'midpoint', 'length', 'tangent', 'anchor', 'update', 'unsupported'];
const paraphrases = [
  {phrase: 'Sketch a round shape', kind: 'circle'},
  {phrase: 'Draw a round outline', kind: 'circle'},
  {phrase: 'Create a three sided shape', kind: 'triangle'},
  {phrase: 'Sketch a four sided equal shape', kind: 'square'},
  {phrase: 'Draw a rectangular shape', kind: 'rectangle'},
  {phrase: 'Make a round solid', kind: 'sphere'},
] as const;
export type Correction = { phrase: string; canonical: string; mode: IntelligenceMode };
const modes = ['normal', 'graph2d', 'graph3d', 'geometry2d', 'geometry3d'];
const normalize = (text: string) => text.toLowerCase().trim().replace(/\s+/g, ' ');

/** Fixed feature hashing allows new vocabulary without changing the model topology. */
export function features(text: string): number[] {
  const values = Array<number>(FEATURES).fill(0);
  const words = normalize(text).match(/[a-z]+/g) ?? [];
  for (const word of words) {
    const tokens = [word, ...Array.from({length: Math.max(0, word.length - 2)}, (_, i) => `#${word.slice(i, i + 3)}`)];
    for (const token of tokens) {
      let hash = 2166136261;
      for (const char of token) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
      values[(hash >>> 0) % FEATURES] += token.startsWith('#') ? 0.25 : 1;
    }
  }
  const norm = Math.sqrt(values.reduce((sum, value) => sum + value * value, 0)) || 1;
  return values.map(value => value / norm);
}

export function readCorrections(storage: Pick<Storage, 'getItem'>): Correction[] {
  try {
    const data: unknown = JSON.parse(storage.getItem(KEY) ?? '[]');
    if (!Array.isArray(data)) return [];
    return data.filter((item): item is Correction => !!item && typeof item.phrase === 'string' &&
      typeof item.canonical === 'string' && item.phrase.length <= 500 && item.canonical.length <= 500 &&
      modes.includes(item.mode) && !!interpretVisualRequest(item.canonical, item.mode).command).slice(-200);
  } catch { return []; }
}

export class RoboLearning {
  private model?: tf.LayersModel;
  private queue: Promise<unknown> = Promise.resolve();
  private corrections: Correction[];
  constructor(private storage?: Storage) { this.corrections = storage ? readCorrections(storage) : []; }
  get count() { return this.corrections.length; }
  private serial<T>(operation: () => Promise<T>): Promise<T> {
    const next = this.queue.then(operation);
    this.queue = next.catch(() => undefined);
    return next;
  }
  private compile() { this.model!.compile({optimizer: tf.train.adam(0.015), loss: 'categoricalCrossentropy'}); }
  private release() { this.model?.optimizer?.dispose(); this.model?.dispose(); this.model=undefined; }
  private async initialize() {
    if (this.model) return;
    // This small classifier runs faster without shader setup and leaves the GPU to the canvas.
    await tf.setBackend('cpu');
    await tf.ready();
    if (this.storage && this.storage.getItem(SIGNATURE) === JSON.stringify(this.corrections)) {
      try {
        const loaded = await tf.loadLayersModel(MODEL);
        if (loaded.inputs[0].shape[1] === FEATURES && loaded.outputs[0].shape[1] === labels.length) {
          this.model = loaded; this.compile();
          if (this.corrections.length) await this.train(8);
          return;
        }
        loaded.dispose();
      } catch { /* A new device, or unavailable IndexedDB: train from bundled examples. */ }
    }
    if(typeof window!=='undefined') {
      try {
        this.model=await tf.loadLayersModel(`${import.meta.env.BASE_URL}models/math-robo-intents-v3/model.json`);
        this.compile();
        if(this.corrections.length)await this.train(8);
        await this.persistModel();
        return;
      } catch { this.release(); /* Missing/corrupt starter assets: rebuild locally. */ }
    }
    this.model = tf.sequential({layers: [
      tf.layers.dense({inputShape: [FEATURES], units: 64, activation: 'relu', kernelInitializer: tf.initializers.glorotUniform({seed: 17})}),
      tf.layers.dense({units: labels.length, activation: 'softmax', kernelInitializer: tf.initializers.glorotUniform({seed: 23})}),
    ]});
    this.compile();
    try { await this.train(24); } catch (error) { this.release(); throw error; }
    await this.persistModel();
  }
  private async train(epochs: number) {
    const examples: {phrase:string;kind:string}[] = INTELLIGENCE_EXAMPLES.flatMap(example => {
      const command = interpretVisualRequest(example.request, example.mode).command;
      return command?.action === 'create' ? [{phrase: example.request, kind: command.kind}] : [];
    });
    // Train intent routing from the same reviewed workspace concepts used by the NLP regression suite.
    for(const mode of ['graph2d','graph3d'] as IntelligenceMode[]) {
      for(const example of nlp150Corpus(mode)) {
        const concept=example.reject?'unsupported':example.category==='anchor'?'anchor':example.category==='tangent'?'tangent':
          example.category==='query'?(/mid[ -]?point/i.test(example.request)?'midpoint':'length'):example.category==='edit'?'update':example.kind;
        if(concept)examples.push({phrase:example.request,kind:concept});
      }
    }
    for (const example of paraphrases) {
      for (let i=0;i<8;i++) examples.push(example);
    }
    // Replay the original corpus to reduce forgetting when adapting to personal phrases.
    for (const correction of this.corrections) {
      const kind = interpretVisualRequest(correction.canonical, correction.mode).command!.kind;
      for (let i = 0; i < 12; i++) examples.push({phrase: correction.phrase, kind});
    }
    const xs = tf.tensor2d(examples.map(example => features(example.phrase)));
    const ys = tf.tensor2d(examples.map(example => labels.map(label => Number(label === example.kind))));
    try { await this.model!.fit(xs, ys, {epochs, batchSize: 64, shuffle: false, yieldEvery: 'batch'}); }
    finally { xs.dispose(); ys.dispose(); }
  }
  private async persistModel() {
    if (!this.storage) return;
    try { await this.model!.save(MODEL); this.storage.setItem(SIGNATURE,JSON.stringify(this.corrections)); } catch { /* Corrections still allow reconstruction on next startup. */ }
  }
  ready() { return this.serial(() => this.initialize()); }
  exportModel(handler:tf.io.IOHandler) {
    return this.serial(async()=>{await this.initialize();return this.model!.save(handler);});
  }
  interpret(input: string, mode: IntelligenceMode, previous?: VisualCommand, objects?:RoboObject[]) {
    return this.serial(async () => {
      const correction = this.corrections.find(item => normalize(item.phrase) === normalize(input) && item.mode === mode);
      if (correction) return { ...interpretVisualRequest(correction.canonical, mode, previous), source: 'Your correction' };
      const parsed = interpretVisualRequest(input, mode, previous);
      const context=objects?contextualRequest(input,mode,objects):undefined;
      try {
        await this.initialize();
        const scores = tf.tidy(() => {
          const tensor = this.model!.predict(tf.tensor2d([features(input)])) as tf.Tensor;
          return Array.from(tensor.dataSync());
        });
        if(context)return {...context,source:'TensorFlow.js + workspace geometry engine'};
        // Existing valid commands and validation errors always preserve precise mathematical parameters.
        if (parsed.command || (parsed.message && !parsed.message.startsWith('Give a mathematical expression,'))) return {...parsed, source: 'TensorFlow.js + validated parser'};
        const ranked = scores.map((score, index) => ({score, index})).sort((a, b) => b.score - a.score);
        const kind = labels[ranked[0].index];
        const visual = /\b(draw|sketch|create|make|build|show|add|render)\b/i.test(input);
        const knownWords = new Set(INTELLIGENCE_EXAMPLES.flatMap(example => example.request.toLowerCase().match(/[a-z]+/g) ?? []));
        paraphrases.forEach(item => (item.phrase.match(/[a-z]+/g) ?? []).forEach(word => knownWords.add(word)));
        this.corrections.forEach(item => (item.phrase.toLowerCase().match(/[a-z]+/g) ?? []).forEach(word => knownWords.add(word)));
        const words = input.toLowerCase().match(/[a-z]+/g) ?? [];
        const coverage = words.length ? words.filter(word => knownWords.has(word)).length / words.length : 0;
        if (visual && coverage >= 0.75 && !['plot','midpoint','length','tangent','anchor','update','unsupported'].includes(kind) && ranked[0].score >= 0.9 && ranked[0].score - ranked[1].score >= 0.3) {
          const inferred = interpretVisualRequest(`Create ${kind} ${input}`, mode, previous);
          if (inferred.command) return {...inferred, source: 'TensorFlow.js prediction'};
        }
      } catch { /* Math and drawing remain available if ML initialization fails. */ }
      return {...context??parsed, source: 'Validated parser / math solver'};
    });
  }
  teach(phrase: string, canonical: string, mode: IntelligenceMode) {
    return this.serial(async () => {
      if (!phrase.trim() || phrase.length > 500 || !canonical.trim() || canonical.length > 500) throw new Error('Use a phrase and example command of up to 500 characters.');
      const result = interpretVisualRequest(canonical, mode);
      if (!result.command || result.command.action !== 'create') throw new Error('Teach with a complete drawing command, such as “Create circle radius 3”.');
      await this.initialize();
      const next = [...this.corrections.filter(item => !(normalize(item.phrase) === normalize(phrase) && item.mode === mode)), {phrase: phrase.trim(), canonical: canonical.trim(), mode}].slice(-200);
      // Persist before mutating memory; unavailable storage must not be reported as durable learning.
      if (!this.storage) throw new Error('Learning storage is unavailable in this browser.');
      this.storage.setItem(KEY, JSON.stringify(next));
      this.corrections = next;
      await this.train(8);
      await this.persistModel();
    });
  }
  reset() {
    return this.serial(async () => {
      this.storage?.removeItem(KEY);
      this.storage?.removeItem(SIGNATURE);
      this.corrections = [];
      this.release();
      try { await tf.io.removeModel(MODEL); } catch { /* No saved model. */ }
    });
  }
  dispose() { return this.serial(async () => { this.release(); }); }
}

let singleton: RoboLearning | undefined;
export function getRoboLearning() {
  if (!singleton) {
    let storage: Storage | undefined;
    try { storage = window.localStorage; } catch { /* Private/blocked storage. */ }
    singleton = new RoboLearning(storage);
  }
  return singleton;
}
