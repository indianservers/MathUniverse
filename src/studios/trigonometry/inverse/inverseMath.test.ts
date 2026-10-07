import { describe, expect, it } from 'vitest';
import { bounds, composition, degrees, inverseValue, legacyInverseRoute, piLabel } from './inverseMath';

describe('inverse trigonometry principal branches',()=>{
  it.each([[-1,-Math.PI/2],[0,0],[.5,Math.PI/6],[1,Math.PI/2]])('arcsin(%s) = %s',(x,y)=>expect(inverseValue('arcsin',x)).toBeCloseTo(y,12));
  it.each([[-1,Math.PI],[0,Math.PI/2],[.5,Math.PI/3],[1,0]])('arccos(%s) = %s',(x,y)=>expect(inverseValue('arccos',x)).toBeCloseTo(y,12));
  it.each([[0,0],[1,Math.PI/4],[Math.sqrt(3),Math.PI/3],[-1,-Math.PI/4]])('arctan(%s) = %s',(x,y)=>expect(inverseValue('arctan',x)).toBeCloseTo(y,12));
  it('rejects values outside the real domain and nonfinite inputs',()=>{
    expect(inverseValue('arcsin',1.001)).toBeNull();expect(inverseValue('arccos',-1.001)).toBeNull();expect(inverseValue('arctan',Infinity)).toBeNull();expect(inverseValue('arcsin',NaN)).toBeNull();
  });
  it('does not attain tangent asymptotes for finite inputs',()=>{
    for(const x of [-Number.MAX_VALUE,-1e6,-10,0,10,1e6,Number.MAX_VALUE]){
      const result=inverseValue('arctan',x)!;expect(result).toBeGreaterThan(bounds.arctan[0]);expect(result).toBeLessThan(bounds.arctan[1]);
    }
  });
  it('matches the example angle readouts',()=>{
    expect(degrees(inverseValue('arcsin',.6)!)).toBeCloseTo(36.8698976,6);
    expect(inverseValue('arctan',1.5)).toBeCloseTo(.9827937,6);
  });
  it('satisfies direct compositions throughout their domains',()=>{
    for(const x of [-1,-.25,0,.5,1]){
      expect(composition('arcsin',false,x).output).toBeCloseTo(x,12);
      expect(composition('arccos',false,x).output).toBeCloseTo(x,12);
    }
    expect(composition('arctan',false,2).output).toBeCloseTo(2,12);
    expect(composition('arctan',false,1e6)).toMatchObject({output:1e6,identity:true});
    expect(composition('arcsin',false,2).output).toBeNull();
  });
  it('folds reverse compositions instead of returning unrestricted angles',()=>{
    expect(composition('arcsin',true,3*Math.PI/4).output).toBeCloseTo(Math.PI/4,12);
    expect(composition('arccos',true,5*Math.PI/4).output).toBeCloseTo(3*Math.PI/4,12);
    expect(composition('arctan',true,3*Math.PI/4).output).toBeCloseTo(-Math.PI/4,12);
    expect(composition('arcsin',true,3*Math.PI/4).identity).toBe(false);
    expect(composition('arctan',true,-Math.PI/4).identity).toBe(true);
  });
  it('rejects tangent poles in reverse compositions',()=>{
    for(const x of [-3*Math.PI/2,-Math.PI/2,Math.PI/2,3*Math.PI/2])expect(composition('arctan',true,x).output).toBeNull();
  });
  it('formats exact π values and maps all five legacy modes',()=>{
    expect(piLabel(-Math.PI/2)).toBe('−π/2');expect(piLabel(3*Math.PI/4)).toBe('3π/4');expect(piLabel(0)).toBe('0');
    for(const [mode,slug] of [['Arcsin','arcsin'],['Arccos','arccos'],['Arctan','arctan'],['Principal Values','principal-values'],['Compositions','compositions']])expect(legacyInverseRoute(mode)).toBe(`/trigonometry/inverse/${slug}`);
    expect(legacyInverseRoute('bad')).toBeNull();
  });
});
