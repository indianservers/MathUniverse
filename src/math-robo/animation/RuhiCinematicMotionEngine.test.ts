import {describe,it,expect,vi,afterEach} from 'vitest';
import {interpolateCommand,RuhiCinematicMotionEngine,cinematicEase} from './RuhiCinematicMotionEngine';
import type {VisualCommand} from '../../offline-intelligence/commands';
const circle:VisualCommand={kind:'circle',dimension:'2d',points:[[0,0]],width:10,height:10,radius:5,color:'#fff',objectId:'c'};
afterEach(()=>vi.unstubAllGlobals());
describe('Ruhi Cinematic Motion Engine',()=>{
 it('interpolates translation, radius and 3D positions without mutating exact state',()=>{
 const target={...circle,points:[[8,3,6]],radius:9};const p=interpolateCommand(circle,target,.5);
 expect(p.points).toEqual([[4,1.5,3]]);expect(p.radius).toBe(7);expect(circle.points).toEqual([[0,0]]);
 expect(interpolateCommand(circle,target,1)).toEqual(target);
 });
 it('keeps a polygon rigid during rotation',()=>{
 const a={...circle,kind:'triangle' as const,roboExplicitVertices:true,points:[[0,0],[2,0],[0,2]]};
 const b={...a,points:[[0,0],[0,2],[-2,0]]};const p=interpolateCommand(a,b,.5);
 expect(Math.hypot(p.points[1][0]-p.points[0][0],p.points[1][1]-p.points[0][1])).toBeCloseTo(2);
 expect(interpolateCommand(a,b,1)).toEqual(b);
 });
 it('morphs graph values through a blended expression',()=>{
 const p=interpolateCommand({...circle,kind:'plot',expression:'x^2'},{...circle,kind:'plot',expression:'(x-2)^2+3'},.5);
 expect(p.expression).toContain('(x^2)');expect(p.expression).toContain('((x-2)^2+3)');
 });
 it('grows creation continuously and finishes at the exact target',()=>{
 expect(interpolateCommand(undefined,circle,.5).radius).toBeGreaterThan(0);expect(interpolateCommand(undefined,circle,.5).radius).toBeLessThan(5);
 expect(interpolateCommand(undefined,circle,1)).toEqual(circle);expect(cinematicEase(0)).toBe(0);expect(cinematicEase(1)).toBe(1);
 });
 it('supports pause, resume, skip and ordered queue completion',async()=>{
 let callback:FrameRequestCallback=()=>{};vi.stubGlobal('requestAnimationFrame',(fn:FrameRequestCallback)=>{callback=fn;return 1;});vi.stubGlobal('cancelAnimationFrame',()=>{});
 const e=new RuhiCinematicMotionEngine(),frames:number[]=[],second:number[]=[];
 const p=e.enqueue(t=>frames.push(t),100);const q=e.enqueue(t=>second.push(t),100);
 await Promise.resolve();await Promise.resolve();callback(0);callback(50);expect(frames.at(-1)).toBe(.5);
 e.pause();callback(90);expect(frames.at(-1)).toBe(.5);e.resume();callback(100);expect(frames.at(-1)).toBeGreaterThan(.5);
 e.skip();await p;await Promise.resolve();await Promise.resolve();expect(frames.at(-1)).toBe(1);e.skip();await q;expect(second.at(-1)).toBe(1);expect(e.snapshot().status).toBe('idle');
 });
 it('reflects continuously and commits an exact reflected endpoint',()=>{const a={...circle,points:[[2,3],[4,5]],kind:'line' as const};const b={...a,points:[[2,-3],[4,-5]]};expect(interpolateCommand(a,b,.5).points).toEqual([[2,0],[4,0]]);expect(interpolateCommand(a,b,1)).toEqual(b);});
 it('keeps an explicit rotation pivot fixed',()=>{const a={...circle,kind:'triangle' as const,roboExplicitVertices:true,points:[[0,0],[2,0],[0,2]]};const b={...a,points:[[0,0],[0,2],[-2,0]]};expect(interpolateCommand(a,b,.5,{angle:90,pivot:[0,0]}).points[0]).toEqual([0,0,0]);});
 it('cancels active and queued jobs and cleans up status',async()=>{vi.stubGlobal('requestAnimationFrame',()=>1);vi.stubGlobal('cancelAnimationFrame',vi.fn());const e=new RuhiCinematicMotionEngine();const p=e.enqueue(()=>{}),q=e.enqueue(()=>{});const settled=Promise.allSettled([p,q]);await Promise.resolve();await Promise.resolve();e.cancel();expect((await settled).every(r=>r.status==='rejected')).toBe(true);expect(e.snapshot().status).toBe('idle');});
 it('reduced motion completes promptly at its exact endpoint',async()=>{let callback:FrameRequestCallback=()=>{};vi.stubGlobal('requestAnimationFrame',(fn:FrameRequestCallback)=>{callback=fn;return 1;});vi.stubGlobal('cancelAnimationFrame',()=>{});const e=new RuhiCinematicMotionEngine();e.reducedMotion=true;const frames:number[]=[];const p=e.enqueue(t=>frames.push(t));await Promise.resolve();await Promise.resolve();callback(0);callback(50);callback(100);await p;expect(frames).toEqual([0,.5,1]);});
 it('morphs 2D shape outlines through actual intermediate geometry',()=>{const rectangle={...circle,kind:'rectangle' as const,width:4,height:6};const middle=interpolateCommand(rectangle,circle,.5);expect(middle.kind).toBe('polygon');expect(middle.points).toHaveLength(128);expect(interpolateCommand(rectangle,circle,1)).toEqual(circle);});
 it('shows a full turn about an explicit pivot',()=>{const a={...circle,kind:'triangle' as const,roboExplicitVertices:true,points:[[0,0],[2,0],[0,2]]};const halfway=interpolateCommand(a,a,.5,{angle:360,pivot:[0,0]});expect(halfway.points[1][0]).toBeCloseTo(-2);expect(halfway.points[0]).toEqual([0,0]);});
 it('interpolates 3D polygon Euler rotation without rotating vertices twice',()=>{const a={...circle,dimension:'3d' as const,kind:'polygon' as const,roboExplicitVertices:true,points:[[0,0,0],[1,0,0],[0,1,0]],rotation:[0,0,0] as [number,number,number]};const b={...a,rotation:[0,0,90] as [number,number,number]};const middle=interpolateCommand(a,b,.5);expect(middle.rotation).toEqual([0,0,45]);expect(middle.points).toEqual(a.points);expect(interpolateCommand(a,b,1)).toEqual(b);});
 it('disabled motion still resolves the exact endpoint',async()=>{const e=new RuhiCinematicMotionEngine();e.enabled=false;const fn=vi.fn();await e.enqueue(fn);expect(fn).toHaveBeenCalledWith(1);});
});
