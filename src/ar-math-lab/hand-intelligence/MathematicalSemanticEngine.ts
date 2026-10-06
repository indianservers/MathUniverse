import { calculateDisplayScale, updateGeometryDimension } from '../arGeometrySolids';
import type { ARGeneratedGeometrySolid } from '../types';
import type { SemanticEdit } from './types';

/** Change mathematical dimensions and their derived formulas while retaining scene magnification. */
export function applyHandDimension(solid:ARGeneratedGeometrySolid,edit:SemanticEdit):ARGeneratedGeometrySolid{
  if(solid.locked||solid.id!==edit.objectId||edit.kind!=='dimension'||!edit.dimension||!solid.dimensions[edit.dimension]||!Number.isFinite(edit.value)||edit.value!<=0)return solid;
  const magnification=calculateDisplayScale(solid);
  const updated=updateGeometryDimension(solid,edit.dimension,edit.value!);
  // A fitted sphere must visibly grow with its radius; re-fitting every frame would cancel the gesture.
  return solid.displayScaleMode==='real-scale'||solid.displayScaleMode==='custom'?updated:{...updated,displayScaleMode:'custom',customScale:magnification};
}
