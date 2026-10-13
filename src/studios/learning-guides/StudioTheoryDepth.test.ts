import {describe,it,expect} from 'vitest';
import {enhancedLabs,resolveEnhancedLab} from './labEnhancementRegistry';
import {theoryBlocks,conceptTheoryBlocks} from './StudioTheoryDepth';
describe('Expanded studio theory',()=>{
 it('covers every registered guide and all studios with its own relationships and worked cases',()=>{
  expect(enhancedLabs).toHaveLength(504);
  expect(new Set(enhancedLabs.map(l=>l.studioId)).size).toBe(19);
  for(const lab of enhancedLabs){const blocks=theoryBlocks(lab);expect(blocks.some(b=>b.heading===`Meaning of ${lab.title}`),lab.key).toBe(true);expect(blocks.filter(b=>b.heading.startsWith('Worked case:')),lab.key).toHaveLength(3);for(const b of blocks){expect(b.paragraphs.every(p=>typeof p==='string'&&p.trim().length>0),lab.key).toBe(true);}expect(blocks.some(b=>b.paragraphs.includes(lab.copy.caution)),lab.key).toBe(true);}
 });
 it('includes the projection derivation, nonunit-vector distinction and numerical verification',()=>{
  const lab=resolveEnhancedLab('/linear-algebra/orthogonality','?mode=Vector+Decomp')!;
  const text=conceptTheoryBlocks(lab).flatMap(b=>b.paragraphs).join(' ');
  expect(text).toContain('c=(v·u)/(u·u)');expect(text).toContain('10=8+2');expect(text).toContain('Rank-deficient');expect(text).toContain('zero u');expect(text).toContain('unique nearest point');
 });
});
