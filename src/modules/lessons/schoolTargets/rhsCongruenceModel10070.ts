export type RHS10070={hypotenuse:number;leg:number};
export const rhsStart10070:RHS10070={hypotenuse:10,leg:6};
export const rhsOther10070=(m:RHS10070)=>Math.sqrt((m.hypotenuse-m.leg)*(m.hypotenuse+m.leg));
export function rhsBounds10070(m:RHS10070,key:string){return key==='h'?[Math.hypot(m.leg,.5),20]:key==='l'?[.5,Math.sqrt(m.hypotenuse*m.hypotenuse-.25)]:[.5,Math.sqrt(400-m.leg*m.leg)];}
export function rhsChange10070(m:RHS10070,key:string,n:number):RHS10070|null{const [min,max]=rhsBounds10070(m,key);if(!Number.isFinite(n)||n<min||n>max)return null;return key==='h'?{...m,hypotenuse:n}:key==='l'?{...m,leg:n}:{...m,hypotenuse:Math.hypot(m.leg,n)};}
export const rhsGrade10070=(s:string[])=>s[0]==='∠Y'&&s[1]==='∠Q'&&s[2]==='XZ = PR'&&['XY = PQ','YZ = QR'].includes(s[3]);
export function rhsGeometry10070(m:RHS10070,mirror=false){const k=250/m.hypotenuse,o=rhsOther10070(m),x=(v:number)=>mirror?330-v:v;return{a:{x:x(40),y:285-m.leg*k},b:{x:x(40),y:285},c:{x:x(40+o*k),y:285},k};}
