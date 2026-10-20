export type BreakType = 'removable' | 'jump' | 'infinite';
export function discontinuityValue(type:BreakType,x:number):number|null {
 if(type==='removable')return x===0?3:2+x*x/4;
 if(type==='jump')return x<=0?2+x*x/4:-1+x/4;
 return x===0?null:1/(x*x);
}
