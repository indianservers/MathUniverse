import{describe,it,expect}from'vitest';import{frustumModel,frustumNet,frustumGeometry}from'./frustumConeModel';
describe('frustum geometry',()=>{
it('uses actual cone similarity to construct its net',()=>{const m=frustumModel(6,3,8);expect(m.volume).toBeCloseTo(168*Math.PI,12);expect(m.theta).toBeCloseTo(6*Math.PI/Math.sqrt(73),12);expect(m.degrees).toBeCloseTo(126.4,0);expect(m.outerSlant).toBeCloseTo(2*Math.sqrt(73),12);});
it('preserves arc lengths, lateral area and fitted cone dimensions across slider values',()=>{let count=0;for(let R=1;R<=10;R+=.5)for(let r=.5;r<R;r+=.5)for(let h=1;h<=15;h+=.5){const m=frustumModel(R,r,h),n=frustumNet(R,r,h),g=frustumGeometry(R,r,h,1);if(Math.abs(m.outerSlant*m.theta-2*Math.PI*R)>1e-8||Math.abs(m.innerSlant*m.theta-2*Math.PI*r)>1e-8||Math.abs(.5*m.theta*(m.outerSlant**2-m.innerSlant**2)-m.csa)>1e-7||Math.abs(m.outerSlant-m.innerSlant-m.slant)>1e-8)throw Error('Invalid annular sector');if(Math.abs(n.Ri/n.Ro-r/R)>1e-9||g.shownHeight*g.scale>4.8+1e-8||2*R*g.scale>4.8+1e-8||g.ghostTop<0||g.ghostTop>=R)throw Error('Invalid projection geometry');count++;}expect(count).toBeGreaterThan(5000);});
it('rejects cylinders and impossible top radii',()=>{for(const a of[[3,3,4],[2,3,4],[4,0,4],[4,2,0]])expect(()=>frustumModel(...a as [number,number,number])).toThrow();});
});

