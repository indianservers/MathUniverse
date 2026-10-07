import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import CinematicHero, { heroCatalog } from './CinematicHero';
import { studioObjects, visibleStudioObjects } from './studioObjects';
import { drawStudioObjects, objectPlot } from './drawStudioObjects';
import { drawMathScene } from './mathScenes';


function recordingCanvas(){
 const commands:unknown[][]=[];
 const ctx=new Proxy({}, {
  get:(_,key)=>key==='createRadialGradient'?()=>({addColorStop:()=>{}}):(...args:unknown[])=>{
   for(const arg of args)if(typeof arg==='number'&&!Number.isFinite(arg))throw new Error(`${String(key)} received ${arg}`);
   commands.push([key,...args]);
  },
  set:(_,key,value)=>{commands.push([key,value]);return true;}
 }) as CanvasRenderingContext2D;
 return {ctx,commands};
}

describe('subject-specific cinematic objects',()=>{
 it('gives every referenced studio 15 named mathematical objects and accessible controls',()=>{
  expect(Object.keys(heroCatalog)).toHaveLength(18);
  for(const id of Object.keys(heroCatalog)){
   expect(studioObjects[id],id).toHaveLength(15);
   expect(new Set(studioObjects[id].map(o=>o.name)).size).toBe(15);
   const html=renderToString(<MemoryRouter><CinematicHero id={id}/></MemoryRouter>);
   expect(html).toContain('Pause motion');expect(html).toContain('Replay scene');
   expect(visibleStudioObjects(id)).toHaveLength(6);expect(html).not.toContain('Explore 15 more living concepts');
   for(const item of visibleStudioObjects(id))expect(html).toContain(item.name.replaceAll('>','&gt;'));
  }
 });
 it('draws all studio objects at multiple animation phases with finite coordinates',()=>{
  for(const id of Object.keys(heroCatalog))for(const t of [0,2,8,29]){
   const {ctx,commands}=recordingCanvas();drawMathScene(ctx,id,760,620,t);
   for(const item of visibleStudioObjects(id))expect(commands.some(c=>c[0]==='fillText'&&c[1]===item.name),`${id}: ${item.name}`).toBe(true);
  }
 });
 it('changes the scene as mathematical motion advances',()=>{
  for(const id of Object.keys(heroCatalog)){
   const first=recordingCanvas(),second=recordingCanvas();drawStudioObjects(first.ctx,id,8);drawStudioObjects(second.ctx,id,9);
   expect(first.commands,id).not.toEqual(second.commands);
  }
 });
 it('uses the named mathematical functions, including correct roots and special-function values',()=>{
  expect(objectPlot('quadratic',1)).toBe(0);expect(objectPlot('quadratic',-1)).toBe(0);
  expect(objectPlot('derivative',1.5)).toBe(3);
  expect(objectPlot('logistic',0)).toBe(.5);
  expect(objectPlot('normal',0)).toBeCloseTo(1/Math.sqrt(2*Math.PI),10);
  expect(objectPlot('bessel0',-2)).toBeCloseTo(1,10);
  expect(objectPlot('bessel1',-2)).toBeCloseTo(0,10);
  expect(objectPlot('gamma',-5/6)).toBeCloseTo(1/3,8);
  expect(objectPlot('legendre2',2)).toBe(1);
  expect(objectPlot('legendre3',-2)).toBe(-1);
  expect(objectPlot('sinc',0)).toBe(1);
  expect(Number.isNaN(objectPlot('reciprocal',0))).toBe(true);
 });
});

