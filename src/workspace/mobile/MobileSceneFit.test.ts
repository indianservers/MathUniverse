import { describe, it, expect } from 'vitest';
import { BoxGeometry, Mesh, Vector3, Group } from 'three';
import { sceneObjectId, surfacePlacementOffset } from './MobileSceneFit';
describe('mobile surface contact', () => {
  it('places a translated cube flush on the tapped horizontal face', () => {
    const cube = new Mesh(new BoxGeometry(2, 2, 2)); cube.position.set(3, 4, 5); cube.updateMatrixWorld(true);
    const offset = surfacePlacementOffset([cube], new Vector3(0, 1, 0), new Vector3(0, 2, 0))!;
    expect(cube.position.clone().add(offset).toArray()).toEqual([0, 3, 0]);
  });
  it('accounts for rotated geometry when finding contact', () => {
    const cube = new Mesh(new BoxGeometry(2, 2, 2)); cube.rotation.z = Math.PI / 4; cube.updateMatrixWorld(true);
    const offset = surfacePlacementOffset([cube], new Vector3(0, 1, 0), new Vector3())!;
    expect(offset.y).toBeCloseTo(Math.sqrt(2));
  });
  it('resolves child mesh identity and rejects empty source geometry', () => {
    const group = new Group(); group.userData.ruhiObjectId = 'copy'; const cube = new Mesh(new BoxGeometry()); group.add(cube);
    expect(sceneObjectId(cube)).toBe('copy'); expect(surfacePlacementOffset([], new Vector3(0, 1, 0), new Vector3())).toBeNull();
  });
});
