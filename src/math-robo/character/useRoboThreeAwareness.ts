import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { registerRoboSpatialProvider, type SpatialObject } from './spatialAwareness';
import type { IntelligenceMode } from '../../offline-intelligence/commands';

/** Read-only sensor: raycast the rendered objects and use their current world/camera matrices. */
export function useRoboThreeAwareness(mode: IntelligenceMode, metadata?: (id: string) => { label?: string; kind?: string; selected?: boolean }) {
  const { camera, gl, scene } = useThree();
  const describe = useRef(metadata); describe.current = metadata;
  useEffect(() => registerRoboSpatialProvider(mode, anchor => {
    scene.updateMatrixWorld(true); camera.updateMatrixWorld(true);
    const rect = gl.domElement.getBoundingClientRect();
    if (!rect.width || !rect.height) return [];
    const inside=anchor.x>=rect.left&&anchor.x<=rect.right&&anchor.y>=rect.top&&anchor.y<=rect.bottom;
    const nodes = new Map<string, THREE.Object3D>();
    scene.traverse(node => {
      let visible = true; for (let parent: THREE.Object3D | null = node; parent; parent = parent.parent) if (!parent.visible) visible = false;
      if (visible && typeof node.userData.immersiveId === 'string' && !nodes.has(node.userData.immersiveId)) nodes.set(node.userData.immersiveId, node);
    });
    const ray = new THREE.Raycaster();
    ray.setFromCamera(new THREE.Vector2((anchor.x - rect.left) / rect.width * 2 - 1, 1 - (anchor.y - rect.top) / rect.height * 2), camera);
    const hit = inside?ray.intersectObjects([...nodes.values()], true)[0]:undefined;
    let hitId: string | undefined;
    for (let node = hit?.object; node; node = node.parent ?? undefined) if (node.userData.immersiveId) { hitId = node.userData.immersiveId; break; }
    return [...nodes].slice(0, 100).flatMap(([id, node]): SpatialObject[] => {
      const box = new THREE.Box3().setFromObject(node); if (box.isEmpty()) return [];
      const corners: Array<{ x: number; y: number }> = [];
      for (const x of [box.min.x, box.max.x]) for (const y of [box.min.y, box.max.y]) for (const z of [box.min.z, box.max.z]) {
        const p = new THREE.Vector3(x, y, z).project(camera);
        if (p.z >= -1 && p.z <= 1) corners.push({ x: rect.left + (p.x + 1) * rect.width / 2, y: rect.top + (1 - p.y) * rect.height / 2 });
      }
      if (!corners.length) return [];
      const left = Math.min(...corners.map(p => p.x)), right = Math.max(...corners.map(p => p.x)), top = Math.min(...corners.map(p => p.y)), bottom = Math.max(...corners.map(p => p.y));
      if(right<Math.max(0,rect.left)||left>Math.min(innerWidth,rect.right)||bottom<Math.max(0,rect.top)||top>Math.min(innerHeight,rect.bottom))return [];
      const info = describe.current?.(id);
      return [{ id, label: info?.label ?? id, kind: info?.kind ?? '3D object', selected: info?.selected,
        samples: [{x:left,y:top},{x:right,y:top},{x:right,y:bottom},{x:left,y:bottom}].map(screen => ({ screen })),
        closed: true, boundsOnly: true, hit: hitId === id }];
    });
  }), [camera, gl, scene, mode]);
}
