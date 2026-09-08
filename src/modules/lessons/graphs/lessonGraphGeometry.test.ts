import { describe, expect, it } from "vitest";
import { lessonGraphCaptionY, lessonGraphLabelLines, lessonGraphProjection, lessonGraphSegments, lessonGraphTicks, lessonGraphZeroCrossingConverges, panLessonGraph } from "./lessonGraphGeometry";

describe("lesson graph coordinates",()=>{
  it('distinguishes converging roots from sign changes at poles',()=>{
    for(const [fn,a,b] of [[(x:number)=>x*x-2,1.4,1.5],[(x:number)=>1e6*(x-.03),0,.1],[(x:number)=>x-1e-15,0,.1]] as const){
      expect(lessonGraphZeroCrossingConverges(fn,{x:a,y:fn(a)},{x:b,y:fn(b)})).toBe(true);
    }
    for(const [fn,a,b] of [[(x:number)=>1/(x-.03),0,.1],[(x:number)=>Math.tan(x),1.5,1.6],[(x:number)=>1/x,-.1,.1]] as const){
      expect(lessonGraphZeroCrossingConverges(fn,{x:a,y:fn(a)},{x:b,y:fn(b)})).toBe(false);
    }
  });
  it('wraps full dynamic labels and long tokens without losing content',()=>{
    const label='P = (3, 2), distance = 3.61';
    const lines=lessonGraphLabelLines(label,15);
    expect(lines.every(line=>line.length<=15)).toBe(true);
    expect(lines.join(' ')).toBe(label);
    expect(lessonGraphLabelLines('123456789',4).join('')).toBe('123456789');
    expect(lessonGraphLabelLines('A\nB',10)).toEqual(['A','B']);
  });
  it("keeps data coordinates invariant under responsive rendering",()=>{
    const view={xMin:-5,xMax:5,yMin:-4,yMax:6};
    for(const [width,height] of [[1000,600],[600,400],[250,300]]) {
      const projection=lessonGraphProjection(view,width,height);
      for(const point of [{x:2,y:3},{x:-5,y:-4},{x:5,y:6}]) {
        const roundTrip=projection.toWorld(projection.toScreen(point));
        expect(roundTrip.x).toBeCloseTo(point.x,12);
        expect(roundTrip.y).toBeCloseTo(point.y,12);
      }
    }
  });
  it("does not connect samples across excluded values or asymptotes",()=>{
    expect(lessonGraphSegments([{x:-1,y:-1},null,{x:1,y:1},{x:2,y:Infinity},{x:3,y:1/3}])).toEqual([[{x:-1,y:-1}],[{x:1,y:1}],[{x:3,y:1/3}]]);
  });
  it("preserves spans when panning",()=>{
    const p=panLessonGraph({xMin:-2,xMax:8,yMin:-7,yMax:3},3,-2);
    expect(p).toEqual({xMin:1,xMax:11,yMin:-9,yMax:1});
  });
  it("generates bounded ticks for fractional and large domains",()=>{
    expect(lessonGraphTicks(-4,4,3)).toEqual([-4,-2,0,2,4]);
    expect(lessonGraphTicks(1.1,1.9,3)).toEqual([1.2,1.4,1.6,1.8]);
    expect(lessonGraphTicks(-.3,.3)).toEqual([-.3,-.2,-.1,0,.1,.2,.3]);
    for(const [min,max] of [[-1e6,2e6],[1,1.00001],[-9,-2]]) {
      const ticks=lessonGraphTicks(min,max);
      expect(ticks.length).toBeGreaterThan(0);
      expect(ticks.length).toBeLessThanOrEqual(100);
      expect(ticks.every(t=>t>=min&&t<=max&&Number.isFinite(t))).toBe(true);
    }
  });
  it("rejects degenerate ranges without altering the caller's bounds",()=>{
    expect(()=>lessonGraphProjection({xMin:2,xMax:2,yMin:0,yMax:1},400,300)).toThrow();
  });
});


describe('caption placement',()=>{
  it('finds a free row for a third nearby caption instead of cycling',()=>{
    const placed=[{x:20,y:58,width:100,height:18},{x:20,y:34,width:100,height:18}];
    const y=lessonGraphCaptionY(70,16,160,18,20,100,placed);
    expect(y).toBeGreaterThanOrEqual(16);expect(y+18).toBeLessThanOrEqual(178);
    for(const p of placed)expect(y>=p.y+p.height+4||y+18+4<=p.y).toBe(true);
  });
  it('keeps disjoint captions in place and clamps to available space',()=>{
    expect(lessonGraphCaptionY(58,16,160,18,140,80,[{x:20,y:58,width:100,height:18}])).toBe(58);
    expect(lessonGraphCaptionY(-200,16,160,18,20,100,[])).toBe(16);
  });
});
