import {describe,it,expect} from 'vitest';
import {simplifyRational} from './SimplifyTargetLesson429';
describe('rational factor cancellation',()=>{
 it('preserves individual bracketed factors and their domain',()=>{const m=simplifyRational('(x+2)*(x-1)/(x-1)');expect(m.valid).toBe(true);expect(m.restrictions).toEqual([1]);expect(m.cancelled.map(f=>f.root)).toEqual([1]);expect(m.simplified).toBe('(x+2)');});
 it('handles a grouped denominator and numerical coefficient',()=>{const m=simplifyRational('2*(x+3)*(x-2)/(x*(x+3))');expect(m.restrictions).toEqual([-3,0]);expect(m.simplified).toBe('2(x-2)/x');});
 it('rejects unparsed polynomial content',()=>{expect(simplifyRational('(x^2+1)/(x+1)').valid).toBe(false);expect(simplifyRational('(x+1)junk/(x+1)').valid).toBe(false);});
});
