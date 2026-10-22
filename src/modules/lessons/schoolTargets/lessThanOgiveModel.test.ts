import{describe,it,expect}from'vitest';import{lessThanModel,moveLessPoint,lessAxisMax,type OgivePoint}from'./lessThanOgiveModel';
const points:OgivePoint[]=[0,4,8,15,22,28,30].map((cf,i)=>({id:i+1,x:10.5+i*10,cf}));
describe('less-than ogive model',()=>{
it('preserves the reference median and cumulative distribution',()=>{const m=lessThanModel(points);expect(m.median).toBe(40.5);expect(m.total).toBe(30);expect(lessAxisMax(30)).toBe(35);});
it('handles no observations and flat median intervals',()=>{expect(lessThanModel(points.map(p=>({...p,cf:0}))).median).toBeNull();expect(lessThanModel([0,1,1,2].map((cf,i)=>({id:i+1,x:i*10,cf}))).medianRange).toEqual([10,20]);});
it('keeps boundaries strictly ordered and cumulative edits monotonic beyond original limits',()=>{for(const p of points)for(const x of[-1000,0,25,100,1000])for(const cf of[-5,0,12.6,100,10000]){const next=moveLessPoint(points,p.id,{x,cf});expect(next.every((p,i)=>i===0||p.x>next[i-1].x&&p.cf>=next[i-1].cf)).toBe(true);expect(next[0].cf).toBe(0);expect(()=>lessThanModel(next)).not.toThrow();}const large=points.map(p=>({...p,x:p.x+100}));expect(moveLessPoint(large,7,{x:190.5}).at(-1)?.x).toBe(190.5);});
});
