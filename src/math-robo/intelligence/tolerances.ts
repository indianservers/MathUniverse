export const EPSILON=1e-9;
export const DISPLAY_EPSILON=1e-6;
export const ROOT_EPSILON=1e-5;
export function near(a:number,b:number,tolerance=EPSILON){return Math.abs(a-b)<=tolerance*Math.max(1,Math.abs(a),Math.abs(b));}
export function nearVector(a:number[],b:number[],tolerance=DISPLAY_EPSILON){return a.length===b.length&&a.every((value,i)=>near(value,b[i],tolerance));}
