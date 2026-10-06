import { describe,expect,it } from 'vitest';
import { calculateDisplayScale,parseGeometrySolidInput } from '../arGeometrySolids';
import { applyHandDimension } from './MathematicalSemanticEngine';
describe('hand mathematical semantics',()=>{
  it('changes sphere radius, formulas and rendered size together',()=>{
    const parsed=parseGeometrySolidInput('sphere radius 2 cm');if(!parsed.ok)throw Error('Fixture did not parse');
    const sphere=parsed.solid,previousScale=calculateDisplayScale(sphere);
    const updated=applyHandDimension(sphere,{objectId:sphere.id,kind:'dimension',dimension:'radius',value:4});
    expect(updated.dimensions.radius.value).toBe(4);expect(updated.calculatedValues.values.volume).toBeCloseTo(sphere.calculatedValues.values.volume*8);
    expect(calculateDisplayScale(updated)).toBe(previousScale);expect(updated.dimensions.radius.meters*calculateDisplayScale(updated)).toBeCloseTo(sphere.dimensions.radius.meters*previousScale*2);
  });
  it('respects locked objects and invalid dimensions',()=>{
    const parsed=parseGeometrySolidInput('cube side 3 cm');if(!parsed.ok)throw Error('Fixture did not parse');const solid=parsed.solid;
    expect(applyHandDimension({...solid,locked:true},{objectId:solid.id,kind:'dimension',dimension:'side',value:4}).dimensions.side.value).toBe(3);
    expect(applyHandDimension(solid,{objectId:solid.id,kind:'dimension',dimension:'radius',value:4})).toBe(solid);
  });
});
