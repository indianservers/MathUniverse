import * as tf from '@tensorflow/tfjs';
import { features } from './roboLearning';
import { TRAINING_LABELS, splitRows, type TrainingRow } from './trainingDataset';

export const BULK_MODEL = 'indexeddb://math-robo-bulk-v1';
export type EpochResult = { epoch: number; loss: number; validationAccuracy: number };
export type TrainingReport = {
  createdAt: string; rows: number; trainRows: number; validationRows: number; testRows: number;
  epochs: number; batchSize: number; labels: string[]; testAccuracy: number;
  history: EpochResult[]; backend: string; durationSeconds: number;
  perLabel: { label: string; rows: number; correct: number }[];
};

function tensors(rows: TrainingRow[]) {
  return {
    xs: tf.tensor2d(rows.map(row => features(row.phrase))),
    ys: tf.tensor2d(rows.map(row => TRAINING_LABELS.map(label => Number(row.label === label)))),
  };
}

export async function evaluateClassifier(model: tf.LayersModel, rows: TrainingRow[], cancelled: () => boolean) {
  let correct = 0;
  const counts = new Map<string, { label: string; rows: number; correct: number }>();
  for (let i = 0; i < rows.length; i += 256) {
    if (cancelled()) throw new Error('Training cancelled. Previous saved model is unchanged.');
    const batch = rows.slice(i, i + 256);
    const predicted = tf.tidy(() => {
      const xs = tf.tensor2d(batch.map(row => features(row.phrase)));
      return Array.from((model.predict(xs) as tf.Tensor).argMax(-1).dataSync());
    });
    batch.forEach((row, index) => {
      const item = counts.get(row.label) ?? { label: row.label, rows: 0, correct: 0 };
      item.rows++;
      if (TRAINING_LABELS[predicted[index]] === row.label) { item.correct++; correct++; }
      counts.set(row.label, item);
    });
    await tf.nextFrame();
  }
  return { accuracy: correct / rows.length, perLabel: [...counts.values()] };
}

export async function trainClassifier(rows: TrainingRow[], epochs: number, batchSize: number,
  cancelled: () => boolean, progress: (fraction: number, message: string, epoch?: EpochResult) => void) {
  const split = splitRows(rows);
  if (!split.train.length || !split.validation.length || !split.test.length) throw new Error('Dataset needs examples in all three splits. Add more varied phrases; duplicate or numeric variants stay in the same split.');
  const learned = new Set(split.train.map(row => row.label));
  if ([...split.validation, ...split.test].some(row => !learned.has(row.label))) throw new Error('A held-out label has no training examples. Add varied phrases for every label. The 15-row template illustrates the schema; it is too small for meaningful training.');
  if (!Number.isInteger(epochs) || epochs < 1 || epochs > 100 || ![64, 128, 256, 512].includes(batchSize)) throw new Error('Invalid training settings.');
  await tf.ready();
  const start = performance.now();
  const model = tf.sequential({ layers: [
    tf.layers.dense({ inputShape: [512], units: 64, activation: 'relu', kernelInitializer: tf.initializers.glorotUniform({ seed: 17 }) }),
    tf.layers.dense({ units: TRAINING_LABELS.length, activation: 'softmax', kernelInitializer: tf.initializers.glorotUniform({ seed: 23 }) }),
  ] });
  model.compile({ optimizer: tf.train.adam(0.003), loss: 'categoricalCrossentropy' });
  const history: EpochResult[] = [];
  try {
    for (let epoch = 1; epoch <= epochs; epoch++) {
      const order = [...split.train];
      for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
      let loss = 0;
      for (let i = 0; i < order.length; i += batchSize) {
        if (cancelled()) throw new Error('Training cancelled. Previous saved model is unchanged.');
        const batch = order.slice(i, i + batchSize), { xs, ys } = tensors(batch);
        try {
          const result = await model.trainOnBatch(xs, ys);
          const value = Array.isArray(result) ? result[0] : result;
          if (!Number.isFinite(value)) throw new Error('Training produced a non-finite loss. Check the dataset.');
          loss += value * batch.length;
        } finally { xs.dispose(); ys.dispose(); }
        progress(((epoch - 1) + Math.min(i + batch.length, order.length) / order.length) / epochs * 0.9,
          `Epoch ${epoch}/${epochs} · ${Math.min(i + batch.length, order.length).toLocaleString()} / ${order.length.toLocaleString()} training rows`);
        await tf.nextFrame();
      }
      progress(epoch / epochs * 0.9, `Evaluating validation split after epoch ${epoch}…`);
      const validation = await evaluateClassifier(model, split.validation, cancelled);
      const result = { epoch, loss: loss / order.length, validationAccuracy: validation.accuracy };
      history.push(result); progress(epoch / epochs * 0.9, `Epoch ${epoch} complete`, result);
    }
    progress(0.95, 'Evaluating untouched test split…');
    const test = await evaluateClassifier(model, split.test, cancelled);
    const report: TrainingReport = {
      createdAt: new Date().toISOString(), rows: rows.length, trainRows: split.train.length,
      validationRows: split.validation.length, testRows: split.test.length, epochs, batchSize,
      labels: [...TRAINING_LABELS], testAccuracy: test.accuracy, history,
      backend: tf.getBackend(), durationSeconds: (performance.now() - start) / 1000, perLabel: test.perLabel,
    };
    model.setUserDefinedMetadata({ report, featureVersion: 'hashed-512-v1', task: 'phrase-intent-classification' });
    return { model, report };
  } catch (error) { disposeClassifier(model); throw error; }
}

export function disposeClassifier(model: tf.LayersModel) { model.optimizer?.dispose(); model.dispose(); }
export function predictIntent(model: tf.LayersModel, phrase: string) {
  return tf.tidy(() => {
    const scores = Array.from((model.predict(tf.tensor2d([features(phrase)])) as tf.Tensor).dataSync());
    return scores.map((score, i) => ({ label: TRAINING_LABELS[i], score })).sort((a, b) => b.score - a.score).slice(0, 3);
  });
}

export async function restoreClassifier() {
  const saved = await tf.io.listModels();
  if (!saved[BULK_MODEL]) return undefined;
  const model = await tf.loadLayersModel(BULK_MODEL);
  try {
    const metadata = await model.getUserDefinedMetadata() as { report?: TrainingReport } | undefined;
    const report = metadata?.report;
    if (!report || report.labels.join('|') !== TRAINING_LABELS.join('|') || model.inputs[0].shape[1] !== 512 || model.outputs[0].shape[1] !== TRAINING_LABELS.length) throw new Error('Saved model is incompatible with this version. Train a new model.');
    return { model, report };
  } catch (error) { model.dispose(); throw error; }
}
