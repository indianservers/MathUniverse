import {describe,it,expect} from 'vitest';
import {numberSetRegions} from './layout';
const at=(r:typeof numberSetRegions[number],theta:number)=>({x:r[1]+r[3]*Math.cos(theta),y:r[2]+r[4]*Math.sin(theta)});
const measure=(r:typeof numberSetRegions[number],p:{x:number;y:number})=>((p.x-r[1])/r[3])**2+((p.y-r[2])/r[4])**2;
describe('Number set diagram geometry',()=>{
 it('draws every nested set entirely inside its containing set',()=>{for(let i=1;i<5;i++)for(let j=0;j<360;j++)expect(measure(numberSetRegions[i-1],at(numberSetRegions[i],j*Math.PI/180))).toBeLessThan(1);});
 it('places the irrational region inside R and entirely outside Q',()=>{for(let j=0;j<360;j++){const p=at(numberSetRegions[5],j*Math.PI/180);expect(measure(numberSetRegions[0],p)).toBeLessThan(1);expect(measure(numberSetRegions[1],p)).toBeGreaterThan(1);}});
});
