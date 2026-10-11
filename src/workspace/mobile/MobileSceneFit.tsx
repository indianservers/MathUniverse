import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { Box3, Vector3, Vector2, Raycaster, Mesh, Matrix3, Matrix4, Quaternion, PerspectiveCamera, type Object3D } from "three";
import type { SelectionRect } from "./MobileRectangleSelection";

export function sceneObjectId(object: Object3D): string | undefined {
  for (let node: Object3D | null = object; node; node = node.parent) {
    const id = node.userData.immersiveId ?? node.userData.ruhiObjectId;
    if (id) return id;
  }
}
export function surfacePlacementOffset(source: Object3D[], normal: Vector3, point: Vector3): Vector3 | null {
  const bounds = new Box3(); source.forEach(object => bounds.expandByObject(object));
  if (bounds.isEmpty()) return null;
  const center = bounds.getCenter(new Vector3());
  let support = Infinity;
  source.forEach(object => object.traverse(node => {
    if (!(node instanceof Mesh) || !node.visible) return;
    const positions = node.geometry.getAttribute('position');
    if (!positions) return;
    for (let i = 0; i < positions.count; i++) {
      const vertex = new Vector3().fromBufferAttribute(positions, i).applyMatrix4(node.matrixWorld);
      support = Math.min(support, vertex.sub(center).dot(normal));
    }
  }));
  return Number.isFinite(support) ? point.clone().addScaledVector(normal, -support).sub(center) : null;
}

export function requestMobileSceneFit(id?: string) {
  window.dispatchEvent(new CustomEvent("mws-fit-solid", { detail: id }));
}
export default function MobileSceneFit() {
  const { camera, scene, controls } = useThree();
  useEffect(() => {
    const roots = () => {
      const result: Object3D[] = [];
      scene.updateMatrixWorld(true);
      scene.traverse(object => {
        if ((object.userData.immersiveId || object.userData.ruhiObjectId) && !sceneObjectId(object.parent ?? scene)) {
          let visible = true;
          for (let node: Object3D | null = object; node; node = node.parent) visible &&= node.visible;
          if (visible) result.push(object);
        }
      }); return result;
    };
    const rectangle = (event: Event) => {
      const rect = (event as CustomEvent<SelectionRect>).detail;
      camera.updateMatrixWorld(true);
      const ids = [...new Set(roots().filter(object => {
        const box = new Box3().setFromObject(object);
        if (box.isEmpty()) return false;
        const center = box.getCenter(new Vector3());
        if (center.clone().applyMatrix4(camera.matrixWorldInverse).z >= 0) return false;
        const projected = center.project(camera), x = (projected.x + 1) / 2, y = (1 - projected.y) / 2;
        return projected.z >= -1 && projected.z <= 1 && x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
      }).map(object => sceneObjectId(object)!))];
      window.dispatchEvent(new CustomEvent('mws-rectangle-selection', { detail: ids }));
    };
    const orient = (event: Event) => {
      const face = (event as CustomEvent<string>).detail;
      const directions: Record<string, number[]> = { Front: [0, 0, 1], Back: [0, 0, -1], Right: [1, 0, 0], Left: [-1, 0, 0], Top: [0, 1, .0001], Bottom: [0, -1, .0001] };
      if (!directions[face]) return;
      const orbit = controls as unknown as { target: Vector3; update: () => void } | undefined;
      const target = orbit?.target ?? new Vector3(), distance = Math.max(.5, camera.position.distanceTo(target));
      scene.updateMatrixWorld(true);
      const rotation = new Quaternion(); scene.traverse(node => { if (node.userData.mobileSceneRoot) node.getWorldQuaternion(rotation); });
      camera.position.copy(target).addScaledVector(new Vector3(...directions[face] as [number, number, number]).normalize().applyQuaternion(rotation), distance);
      camera.up.set(0, 1, 0).applyQuaternion(rotation); camera.lookAt(target); orbit?.update();
    };
    const place = (event: Event) => {
      const { id, x, y } = (event as CustomEvent<{ id: string; x: number; y: number }>).detail;
      const objects = roots(), source = objects.filter(object => sceneObjectId(object) === id);
      const ray = new Raycaster(); camera.updateMatrixWorld(true); ray.setFromCamera(new Vector2(x * 2 - 1, 1 - y * 2), camera);
      const hit = ray.intersectObjects(objects.filter(object => sceneObjectId(object) !== id), true).find(hit => hit.object instanceof Mesh && hit.object.visible && hit.face);
      if (!hit?.face) { window.dispatchEvent(new CustomEvent('mws-unavailable', { detail: 'Tap a visible face of another object.' })); return; }
      const normal = hit.face.normal.clone().applyMatrix3(new Matrix3().getNormalMatrix(hit.object.matrixWorld)).normalize();
      if (normal.dot(ray.ray.direction) > 0) normal.negate();
      const offset = surfacePlacementOffset(source, normal, hit.point);
      if (offset) {
        let space = source[0].parent;
        while (space && !space.userData.mobileSceneRoot && !space.userData.mobileTransformRoot) space = space.parent;
        if (space?.userData.mobileTransformRoot) space = space.parent;
        const inverse = new Matrix4().copy(space?.matrixWorld ?? new Matrix4()).invert();
        const localOffset = offset.applyMatrix4(inverse).sub(new Vector3().applyMatrix4(inverse));
        window.dispatchEvent(new CustomEvent('mws-surface-placed', { detail: { id, offset: localOffset.toArray() } }));
      }
    };
    const fit = (event: Event) => {
      const id = (event as CustomEvent<string | undefined>).detail;
      const bounds = new Box3();
      scene.updateMatrixWorld(true);
      scene.traverse(object => {
        if (!object.visible || (!object.userData.immersiveId && !object.userData.ruhiObjectId)) return;
        if (id && object.userData.immersiveId !== id && object.userData.ruhiObjectId !== id) return;
        if (!object.getWorldPosition(new Vector3()).toArray().every(Number.isFinite)) return;
        bounds.expandByObject(object);
      });
      if (bounds.isEmpty()) return;
      const center = bounds.getCenter(new Vector3()), size = bounds.getSize(new Vector3());
      const orbit = controls as unknown as { target: Vector3; update: () => void } | undefined;
      const direction = camera.position.clone().sub(orbit?.target ?? new Vector3()).normalize();
      const fov = camera instanceof PerspectiveCamera ? camera.fov * Math.PI / 180 : Math.PI / 4;
      const aspect = camera instanceof PerspectiveCamera ? Math.min(1, camera.aspect) : 1;
      const distance = Math.max(.5, size.length() / (2 * Math.tan(fov / 2) * aspect)) * 1.2;
      camera.position.copy(center).addScaledVector(direction, distance);camera.lookAt(center);
      orbit?.target.copy(center);orbit?.update();camera.updateProjectionMatrix();
    };
    window.addEventListener("mws-fit-solid", fit);
    window.addEventListener('mws-select-solid-rectangle', rectangle);
    window.addEventListener('mws-orient-solid', orient);
    window.addEventListener('mws-place-solid', place);
    return () => { window.removeEventListener("mws-fit-solid", fit); window.removeEventListener('mws-select-solid-rectangle', rectangle); window.removeEventListener('mws-orient-solid', orient); window.removeEventListener('mws-place-solid', place); };
  }, [camera, controls, scene]);
  return null;
}
