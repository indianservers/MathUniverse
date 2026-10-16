import {test, expect} from 'vitest';
import corpus from './pointDistance150.json';
import {SemanticEngine} from './semanticEngine';
import {describeObject} from './sceneContext';
import {interpretVisualRequest} from '../../offline-intelligence/commands';
import {classifyRequest} from './requestClassifier';
import type {RoboMode} from './types';

function fixture(mode: RoboMode, labels: string[], points: number[][]) {
  const engine = new SemanticEngine(mode);
  engine.sync(points.map((position, i) => {
    const command = interpretVisualRequest('Create a point', mode).command!;
    return describeObject({...command, kind: 'point', objectId: `point-${i}`, points: [position], roboLabel: labels[i]}, mode);
  }), []);
  return engine;
}

test('corpus contains exactly 150 unique user questions', () => {
  expect(corpus).toHaveLength(150);
  expect(new Set(corpus.map(row => row.question)).size).toBe(150);
});
for (const row of corpus) test(`${row.id}: ${row.question}`, async () => {
  const engine = fixture('geometry2d', [...row.labels, 'X', 'Y'], [[2,-3],[-4,-3],[30,40],[90,90]]);
  const before = engine.snapshot().objects;
  expect(classifyRequest(row.question)).toBe('QUERY');
  const answer = await engine.execute(row.question, async () => undefined);
  expect(answer.status, answer.message).toBe('success');
  expect(answer.value).toBe(6);
  expect(answer.verification?.passed).toBe(true);
  expect(engine.snapshot().objects).toEqual(before);
});

test('distance uses changed live coordinates and includes the third dimension', async () => {
  for (const mode of ['geometry2d','geometry3d'] as RoboMode[]) {
    const points = mode.endsWith('3d') ? [[0,0,0],[3,4,12]] : [[0,0],[3,4]];
    const engine = fixture(mode, ['C','D'], points);
    expect((await engine.execute('distance from C to D', async () => undefined)).value).toBe(mode.endsWith('3d') ? 13 : 5);
    const objects = engine.snapshot().objects;
    objects[1].position = [...objects[0].position];
    objects[1].command.points = [objects[1].position];
    engine.sync(objects, []);
    expect((await engine.execute('distance from C to D', async () => undefined)).value).toBe(0);
  }
});

test('missing named point cannot fall back to another selected point', async () => {
  const engine = fixture('geometry2d', ['C','X'], [[0,0],[3,4]]);
  const answer = await engine.execute('distance from C to D', async () => undefined);
  expect(answer.status).not.toBe('success');
  expect(answer.value).toBeUndefined();
});


