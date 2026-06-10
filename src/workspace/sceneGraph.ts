import type { MathObject, MathScene, MathSceneNode, MathVec3 } from "./types";

const DEFAULT_CAMERA_POSITION: MathVec3 = { x: 5, y: 4, z: 6 };
const DEFAULT_CAMERA_TARGET: MathVec3 = { x: 0, y: 0, z: 0 };

export function createDefaultScenes(objects: MathObject[] = []): MathScene[] {
  return [
    createScene("scene-2d", "2D Geometry Scene", "2d", objects.filter((object) => object.dimension === "2d")),
    createScene("scene-3d", "3D Workspace Scene", "3d", objects.filter((object) => object.dimension === "3d")),
  ];
}

export function createScene(id: string, title: string, dimension: MathScene["dimension"], objects: MathObject[] = []): MathScene {
  const rootNodeId = `${id}:root`;
  const root: MathSceneNode = {
    id: rootNodeId,
    objectId: rootNodeId,
    parentId: null,
    children: objects.map((object) => `${id}:node:${object.id}`),
    order: 0,
    visible: true,
    locked: false,
  };

  const objectNodes = objects.map<MathSceneNode>((object, index) => ({
    id: `${id}:node:${object.id}`,
    objectId: object.id,
    parentId: rootNodeId,
    children: [],
    order: index + 1,
    visible: object.visible,
    locked: object.locked ?? false,
  }));

  return {
    id,
    title,
    dimension,
    rootNodeId,
    nodes: [root, ...objectNodes],
    selectedIds: [],
    activeTool: null,
    settings: {
      gridVisible: true,
      snapEnabled: true,
      units: "unit",
      camera: dimension === "3d" ? { position: DEFAULT_CAMERA_POSITION, target: DEFAULT_CAMERA_TARGET, orthographic: false, autoRotate: false } : undefined,
    },
  };
}

export function syncScenesWithObjects(scenes: MathScene[], objects: MathObject[]): MathScene[] {
  const existingScenes = scenes.length ? scenes : createDefaultScenes(objects);
  const objectIds = new Set(objects.map((object) => object.id));

  return existingScenes.map((scene) => {
    const sceneObjects = objects.filter((object) => object.dimension === scene.dimension);
    const nodesByObjectId = new Map(scene.nodes.map((node) => [node.objectId, node]));
    const root = scene.nodes.find((node) => node.id === scene.rootNodeId) ?? scene.nodes[0];
    const rootNode: MathSceneNode = root
      ? { ...root, parentId: null, objectId: root.objectId || scene.rootNodeId }
      : { id: scene.rootNodeId, objectId: scene.rootNodeId, parentId: null, children: [], order: 0, visible: true, locked: false };

    const childNodes = sceneObjects.map<MathSceneNode>((object, index) => {
      const existing = nodesByObjectId.get(object.id);
      return {
        id: existing?.id ?? `${scene.id}:node:${object.id}`,
        objectId: object.id,
        parentId: rootNode.id,
        children: existing?.children.filter((childId) => scene.nodes.some((node) => node.id === childId && objectIds.has(node.objectId))) ?? [],
        order: existing?.order ?? index + 1,
        visible: object.visible,
        locked: object.locked ?? false,
      };
    });

    return {
      ...scene,
      rootNodeId: rootNode.id,
      nodes: [{ ...rootNode, children: childNodes.map((node) => node.id) }, ...childNodes.sort((first, second) => first.order - second.order)],
      selectedIds: scene.selectedIds.filter((id) => objectIds.has(id)),
    };
  });
}

export function selectSceneObjects(scene: MathScene, objectIds: string[], append = false): MathScene {
  const availableIds = new Set(scene.nodes.map((node) => node.objectId));
  const incoming = objectIds.filter((id) => availableIds.has(id));
  const selectedIds = append ? Array.from(new Set([...scene.selectedIds, ...incoming])) : incoming;
  return { ...scene, selectedIds };
}

export function setSceneTool(scene: MathScene, activeTool: string | null): MathScene {
  return { ...scene, activeTool };
}

export function updateSceneNode(scene: MathScene, nodeId: string, patch: Partial<MathSceneNode>): MathScene {
  return {
    ...scene,
    nodes: scene.nodes.map((node) => (node.id === nodeId ? { ...node, ...patch } : node)),
  };
}

export function getSceneObjects(scene: MathScene, objects: MathObject[]) {
  const objectMap = new Map(objects.map((object) => [object.id, object]));
  return scene.nodes
    .filter((node) => node.parentId !== null)
    .sort((first, second) => first.order - second.order)
    .map((node) => objectMap.get(node.objectId))
    .filter((object): object is MathObject => Boolean(object));
}
