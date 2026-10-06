import {describe,it,expect} from 'vitest';
import {orbit, wavePath} from './trigHeroMath';
describe('cinematic trigonometry geometry',()=>{
  it('maps exact quadrant values into screen coordinates',()=>{
    for(const t of [0,Math.PI/2,Math.PI,Math.PI*1.5]){const p=orbit(t);expect(p.x*p.x+p.y*p.y).toBeCloseTo(1);expect(p.px).toBeCloseTo(420+119*Math.cos(t));expect(p.py).toBeCloseTo(205-119*Math.sin(t));}
  });
  it('starts each wave at the corresponding live projection',()=>{
    for(const t of [0,.73,Math.PI,5])for(const cosine of [false,true]){const start=wavePath(t,cosine).split(' ')[0];const y=Number(start.split(',')[1]);expect(y).toBeCloseTo(205-68*(cosine?Math.cos(t):Math.sin(t)),2);}
  });
});
