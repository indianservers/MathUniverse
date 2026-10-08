import { describe, expect, it } from 'vitest';
import { carryCircleElements,connectedCircleLayout,maskAt, clearsLabels, defaultCircles, layoutElements, markerClearance, regionClearance } from './vennLayout';
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

describe('circle-connected Venn elements',()=>{
 it('carries owned and shared elements while leaving nonmembers fixed',()=>{
  const before={id:'A' as const,x:200,y:200,r:100},after={...before,x:300,y:240};
  const points={own:{x:170,y:170},shared:{x:250,y:200},outside:{x:450,y:200}};
  expect(carryCircleElements(points,before,after)).toEqual({own:{x:270,y:210},shared:{x:350,y:240},outside:points.outside});
  expect(carryCircleElements(points,before,{...before,r:50}).own).toEqual({x:185,y:185});
 });
 it('updates overlap sets and keeps repaired markers fully in their represented regions',()=>{
  const u=['1','2','3','4','5','6'],sets=[['1','2','3','5'],['2','4','5','6'],['1','4','6']];
  const points=layoutElements(u,sets[0],sets[1],sets[2],defaultCircles);
  const after={...defaultCircles[1],x:550,y:170},circles=defaultCircles.map(circle=>circle.id==='B'?after:circle);
  const result=connectedCircleLayout(u,points,defaultCircles[1],after,circles);
  expect(result.sets[1]).toEqual(sets[1]);
  for(const item of u){const mask=result.sets.reduce((m,set,i)=>m|(set.includes(item)?1<<i:0),0);expect(maskAt(result.points[item],circles)).toBe(mask);expect(regionClearance(result.points[item],mask,circles)).toBeGreaterThanOrEqual(markerClearance);expect(clearsLabels(result.points[item],circles)).toBe(true);}
 });
 it('respects changed roster membership instead of keeping stale manually dragged positions',()=>{
  const points=layoutElements(['x'],['x'],[],[],defaultCircles);
  const updated=layoutElements(['x'],[],['x'],[],defaultCircles,points);
  expect(maskAt(updated.x,defaultCircles)).toBe(2);
 });
});
