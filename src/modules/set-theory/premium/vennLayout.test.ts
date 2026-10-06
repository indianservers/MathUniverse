import { describe, expect, it } from 'vitest';
import { clearsLabels, defaultCircles, layoutElements, markerClearance, regionClearance } from './vennLayout';
describe('Venn marker placement',()=>{
 it('keeps the entire marker and gap inside each of the eight Boolean regions',()=>{
  const u=Array.from({length:8},(_,i)=>String(i));
  const sets=[1,2,4].map(bit=>u.filter(x=>Number(x)&bit));
  const points=layoutElements(u,sets[0],sets[1],sets[2],defaultCircles);
  for(const x of u)expect(regionClearance(points[x],Number(x),defaultCircles)).toBeGreaterThanOrEqual(markerClearance);
 });
 it('separates the screenshot rosters while retaining their correct memberships',()=>{
  const u=['1','2','3','4','5','6'],a=['1','2','3','5'],b=['2','4','5','6'],c=['1','4','6'];
  const points=layoutElements(u,a,b,c,defaultCircles);
  for(const x of u){expect(clearsLabels(points[x],defaultCircles)).toBe(true);const mask=(a.includes(x)?1:0)|(b.includes(x)?2:0)|(c.includes(x)?4:0);
   expect(regionClearance(points[x],mask,defaultCircles)).toBeGreaterThanOrEqual(markerClearance);
   for(const y of u.filter(y=>y!==x))expect(Math.hypot(points[x].x-points[y].x,points[x].y-points[y].y)).toBeGreaterThanOrEqual(38);
  }
 });
});
