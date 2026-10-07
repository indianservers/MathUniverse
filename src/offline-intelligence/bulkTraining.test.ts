import { describe, expect, it } from 'vitest';
import * as tf from '@tensorflow/tfjs';
import { SAMPLE_ROWS, splitRows, validateRows, type TrainingRow } from './trainingDataset';
import { disposeClassifier, predictIntent, trainClassifier } from './bulkTraining';

function fixture(): TrainingRow[] {
  const words = ['please','kindly','now','quickly','carefully','hello','today','here','again','first','next','then','also','finally','simply','slowly','accurately','clearly','neatly','immediately'];
  return words.flatMap(word => ['circle', 'square'].map(label => ({ phrase: `${word} draw ${label}`, label, canonical: `Create ${label}`, mode: 'geometry2d' as const })));
}
describe('Bulk intent training', () => {
  it('accepts the 15 reviewed template rows and rejects conflicting labels and missing scene context', () => {
    expect(validateRows(SAMPLE_ROWS)).toHaveLength(15);
    expect(() => validateRows([{ ...SAMPLE_ROWS[2], context: undefined }])).toThrow('context');
    expect(() => validateRows([SAMPLE_ROWS[0], { ...SAMPLE_ROWS[1], phrase: SAMPLE_ROWS[0].phrase }])).toThrow('conflicts');
    expect(() => validateRows([{ ...SAMPLE_ROWS[0], label: 'circle' }])).toThrow('matching label');
  });
  it('keeps duplicates and numerical variations in one held-out group', () => {
    const rows = [SAMPLE_ROWS[0], { ...SAMPLE_ROWS[0], phrase: 'Draw a rectangle 2 by 9' }];
    const split = splitRows(rows);
    expect(Object.values(split).map(part => part.length).sort()).toEqual([0,0,2]);
    const large = Array.from({ length: 100_000 }, (_, i) => ({ ...rows[i % 2] }));
    expect(Object.values(splitRows(large)).reduce((sum, part) => sum + part.length, 0)).toBe(100_000);
  });
  it('learns real parameters, evaluates unseen phrases, and disposes batch tensors including cancellation', async () => {
    await tf.setBackend('cpu'); await tf.ready();
    const before = tf.memory().numTensors;
    const rows = validateRows(fixture());
    const result = await trainClassifier(rows, 2, 64, () => false, () => undefined);
    expect(result.report.rows).toBe(40);
    expect(result.report.testRows).toBeGreaterThan(0);
    expect(result.report.history).toHaveLength(2);
    expect(result.model.countParams()).toBeGreaterThan(30_000);
    expect(predictIntent(result.model, 'draw circle')).toHaveLength(3);
    let bytes = 0;
    await result.model.save(tf.io.withSaveHandler(async artifact => {
      bytes = (artifact.weightData as ArrayBuffer).byteLength;
      expect(artifact.userDefinedMetadata?.featureVersion).toBe('hashed-512-v1');
      return { modelArtifactsInfo: { dateSaved: new Date(), modelTopologyType: 'JSON' } };
    }));
    expect(bytes).toBeGreaterThan(100_000);
    disposeClassifier(result.model);
    await expect(trainClassifier(rows, 1, 64, () => true, () => undefined)).rejects.toThrow('cancelled');
    expect(tf.memory().numTensors).toBe(before);
  }, 30000);
});
