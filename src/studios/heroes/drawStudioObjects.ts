import { visibleStudioObjects, type StudioObject } from './studioObjects';
type C = CanvasRenderingContext2D;
type Point = [number,number];
const palette=['#3cdcff','#ae7aff','#ffcc78','#70edc5'];
const tau=Math.PI*2;

function bessel(x:number,order:number){let term=order===0?1:x/2,total=term;for(let k=1;k<35;k++){term*=-(x*x/4)/(k*(k+order));total+=term;}return total;}
function gamma(x:number):number{
 const p=[676.5203681218851,-1259.1392167224028,771.3234287776531,-176.6150291621406,12.507343278686905,-.13857109526572012,9.984369578019572e-6,1.5056327351493116e-7];
 if(x<.5)return Math.PI/(Math.sin(Math.PI*x)*gamma(1-x));let a=.9999999999998099;const z=x-1;p.forEach((v,i)=>{a+=v/(z+i+1);});const t=z+7.5;return Math.sqrt(tau)*t**(z+.5)*Math.exp(-t)*a;
}
export function objectPlot(variant:string,x:number):number{
 switch(variant){
  case 'quadratic':return x*x-1;case 'cubic':return x*x*x-x;case 'absolute':return Math.abs(x);case 'system':return x;case 'reciprocal':return Math.abs(x)<.05?NaN:1/x;
  case 'continuous':return Math.sin(x);case 'derivative':return 2*x;case 'taylor':return x-x**3/6;
  case 'exp':case 'initial':return Math.exp(x);case 'decay':return Math.exp(-x);case 'logistic':return 1/(1+Math.exp(-3*x));
  case 'infection':return Math.exp(-2*x*x);case 'recovered':return 1/(1+Math.exp(-3*x));case 'fit':case 'scatter':case 'residual':return .65*x+.4;case 'sensitivity':return x*x;
  case 'normal':return Math.exp(-x*x/2)/Math.sqrt(tau);case 'uniform':return Math.abs(x)<=1?.5:0;case 'cdf':return .5*(1+erf(x/Math.sqrt(2)));
  case 'alternative':return Math.exp(-((x-1)**2)/2)/Math.sqrt(tau);case 'errors':return Math.exp(-x*x/2)/Math.sqrt(tau);
  case 'beta':return Math.abs(x)<=1?1.5*(1-x*x):0;case 'likelihood':{const p=(x+2)/4;return p>=0&&p<=1?300*p**6*(1-p)**4:0;}
  case 'posterior':{const p=(x+2)/4;return p>=0&&p<=1?12000*p**7*(1-p)**5:0;}
  case 'gamma':return gamma((x+2)*.6+.3)/3;case 'bessel0':return bessel((x+2)*3,0);case 'bessel1':return bessel((x+2)*3,1);
  case 'legendre2':return (3*(x/2)**2-1)/2;case 'legendre3':return (5*(x/2)**3-3*x/2)/2;
  case 'hermite':return (4*x*x-2)/8;case 'laguerre':{const u=x+2;return 1-2*u+u*u/2;}
  case 'chebyshev':return 4*(x/2)**3-3*x/2;case 'erf':return erf(x);case 'sinc':return Math.abs(x)<1e-8?1:Math.sin(4*x)/(4*x);
  case 'zeta':{const s=1.3+(x+2)*.6;let sum=0;for(let n=1;n<=120;n++)sum+=n**-s;return sum/3;}
  case 'secant':return Math.abs(Math.cos(x))<.08?NaN:1/Math.cos(x);
  default:throw new Error(`Missing mathematical curve: ${variant}`);
 }
}
function erf(x:number){const sign=Math.sign(x),v=Math.abs(x),t=1/(1+.3275911*v);return sign*(1-(((((1.061405429*t-1.453152027)*t)+1.421413741)*t-.284496736)*t+.254829592)*t*Math.exp(-v*v));}

function drawObject(c:C,item:StudioObject,t:number,color:string){
 const v=item.variant||'',d=item.data||[],p=(Math.sin(t*.6)+1)/2;
 const line=(points:Point[],stroke=color,width=1.5)=>{c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.strokeStyle=stroke;c.lineWidth=width;c.stroke();};
 const dot=(x:number,y:number,r=2.5,fill=color)=>{c.beginPath();c.arc(x,y,r,0,tau);c.fillStyle=fill;c.fill();};
 const text=(s:string,x:number,y:number,size=12,fill=color)=>{c.fillStyle=fill;c.font=`${size}px "Cambria Math", Georgia, serif`;c.textAlign='center';c.fillText(s,x,y);};
 const ellipse=(x:number,y:number,rx:number,ry=rx,stroke=color)=>{c.beginPath();c.ellipse(x,y,rx,ry,0,0,tau);c.strokeStyle=stroke;c.lineWidth=1.4;c.stroke();};
 const curve=(f:(x:number)=>number,stroke=color)=>{let points:Point[]=[];for(let k=0;k<=70;k++){const x=-2+k/70*4,y=f(x);if(!Number.isFinite(y)||Math.abs(y)>2.6){if(points.length)line(points,stroke);points=[];}else points.push([x*23,12-y*16]);}if(points.length)line(points,stroke);};
 const axes=()=>{line([[-49,16],[49,16]],'#48628b',.7);line([[0,-27],[0,30]],'#48628b',.7);};
 const pointOnCurve=(f:(x:number)=>number)=>{const x=-1.8+3.6*p,y=f(x);if(Number.isFinite(y)&&Math.abs(y)<2.6)dot(x*23,12-y*16,3,'#fff');};
 c.shadowColor=color;c.shadowBlur=5;
 switch(item.kind){
  case 'plot':{
   axes();const f=(x:number)=>objectPlot(v,x);curve(f);pointOnCurve(f);
   if(v==='system')curve(x=>-x,palette[1]);if(v==='derivative')curve(x=>x*x,palette[1]);if(v==='taylor')curve(Math.sin,palette[1]);if(v==='errors')curve(x=>objectPlot('alternative',x),palette[1]);
   if(['fit','scatter','residual'].includes(v)){for(let j=0;j<8;j++){const x=-1.7+j*.48,y=f(x)+.3*Math.sin(j*3.1);dot(x*23,12-y*16,1.8,palette[1]);if(v==='residual')line([[x*23,12-y*16],[x*23,12-f(x)*16]],palette[2],1);}}
   break;
  }
  case 'fraction':{
   const den=v==='equivalent'?[2,4,8][Math.floor(t/2)%3]:d[1]||2,num=v==='equivalent'?den/2:d[0]||1;for(let k=0;k<den;k++){c.beginPath();c.moveTo(0,0);c.arc(0,0,26,-Math.PI/2+k*tau/den,-Math.PI/2+(k+1)*tau/den);c.closePath();c.fillStyle=k<num?`${color}66`:'#162340';c.fill();c.strokeStyle=k===Math.floor(t)%den?palette[2]:color;c.stroke();}
   text(`${num}/${den}`,0,4,14,'#fff');break;
  }
  case 'line':case 'convergents':{
   const nums=d.length?d:[0,1,2,3],min=Math.min(...nums),max=Math.max(...nums),px=(n:number)=>-43+86*(n-min)/Math.max(max-min,1);
   line([[-49,5],[49,5]]);nums.forEach((n,k)=>{line([[px(n),0],[px(n),10]],color,1);dot(px(n),5,k===Math.floor(t)%nums.length?4:1.8,k===Math.floor(t)%nums.length?palette[2]:color);if(nums.length<=6&&(v!=='density'||k===0||k===nums.length-1))text(Number(n.toFixed(2)).toString(),px(n),25,10);});
   if(item.kind==='convergents')line(nums.map((n,k)=>[-43+k*86/(nums.length-1),-22+(max-n)/Math.max(max-min,.1)*22]),palette[1]);break;
  }
  case 'digits':case 'identity':{
   const stages:Record<string,string[]>={binary:['000','001','010','011','100','101','110','111'],'powers-i':['i','−1','−i','1'],decimal:['3/8','0.3','0.37','0.375'],recurring:['0.3','0.33','0.333','0.3333…'],sqrt2:['1.4','1.41','1.414','1.4142…'],pi:['3.1','3.14','3.141','3.14159…'],cf:['[1;2]','[1;2,2]','[1;2,2,2,…]'],division:['x² − 1','(x − 1)(x + 1)','x + 1, x ≠ 1'],linear:['2x + 4 = 10','2x = 6','x = 3'],identity:['a · e','a'],inverse:['a · a⁻¹','e'],separate:['y′ = y','dy/y = dt','ln|y| = t + C'],factor:['y′ + py = q','(μy)′ = μq'],euclid:['48 = 2×18 + 12','18 = 1×12 + 6','12 = 2×6'],recurrence:['q₀ = 1','q₁ = a₁','q₂ = a₂q₁ + q₀'],fermat:['n = 3, 4, …','No positive integer','solutions (proved)']};
   const sequence=stages[v]||[item.formula];const s=sequence[Math.floor(t/1.8)%sequence.length];
   text(s,0,3,s.length>20?10:16);line([[-38,16],[-38+76*((t/1.8)%1),16]],palette[2],2);break;
  }
  case 'tiles':{
   const rect=(x:number,y:number,w:number,h:number,col:string)=>{c.fillStyle=col+'44';c.strokeStyle=col;c.fillRect(x,y,w,h);c.strokeRect(x,y,w,h);};
   if(['square','complete','product','distribute','determinant','golden'].includes(v)){
    if(v==='golden'){rect(-32,-20,64,64/((1+Math.sqrt(5))/2),color);line([[7.55,-20],[7.55,19.55]],palette[2]);dot(7.55,19.55-39.55*p,3,palette[2]);}
    else if(v==='determinant'){const s=.5*Math.sin(t);line([[-25,-20],[15,-20],[15+30*s,20],[-25+30*s,20],[-25,-20]]);text('det = 1',0,6,12,palette[2]);}
    else if(v==='distribute'||v==='product'){const split=24+8*p;rect(-42,-18,split,32,color);rect(-42+split,-18,76-split,32,palette[1]);text(v==='product'?"u′v":'ab',-42+split/2,3,12);text(v==='product'?"uv′":'ac',-4+split/2,3,12,palette[1]);}
    else{const shift=v==='complete'?8*(1-p):5;rect(-30,-22,30,30,color);rect(shift,-22,10,30,palette[1]);rect(-30,8+shift,30,10,palette[1]);rect(shift,8+shift,10,10,palette[2]);text('x²',-15,-3,12);}
    break;
   }
   if(v==='choose'||v==='die'){const combos=[[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]],selected=combos[Math.floor(t)%6];const n=v==='die'?Math.floor(t)%6+1:4;c.strokeStyle=color;c.strokeRect(-28,-25,56,50);for(let k=0;k<n;k++){const x=-13+(k%2)*26,y=-14+Math.floor(k/2)*14;dot(x,y,4,v==='choose'&&selected.includes(k)?palette[2]:color);}break;}
   if(v==='pythagoras'){c.strokeStyle=color;c.strokeRect(-43,-22,18,18);c.strokeRect(-17,-22,24,24);c.strokeStyle=palette[1];c.strokeRect(18,-22,30,30);text('9 + 16 = 25',0,30,12);break;}
   const cols=v==='percent'?10:v==='cartesian'?3:4,rows=v==='percent'?10:v==='cartesian'?2:3,size=v==='percent'?5:13;
   for(let k=0;k<cols*rows;k++){const x=(k%cols-cols/2)*size,y=(Math.floor(k/cols)-rows/2)*size;const selected=v==='percent'?(k<25?0:3):v==='four-color'?(k+Math.floor(k/cols))%4:k<=Math.floor(p*(cols*rows-1))?0:3;c.fillStyle=v==='percent'?(k<25?`${color}88`:'#172847'):palette[selected%4]+'66';c.fillRect(x,y,size-2,size-2);}
   break;
  }
  case 'matrix':case 'table':{
   const n=v==='mod5'?5:v==='mod4'||v==='diagonal'?4:3,cell=16;
   for(let row=0;row<n;row++)for(let col=0;col<n;col++){const x=(col-(n-1)/2)*cell,y=(row-(n-1)/2)*cell;const active=v==='diagonal'?row===col:(row*n+col)===Math.floor(t*2)%(n*n);c.fillStyle=active?`${color}44`:'#13213a';c.fillRect(x-7,y-10,14,14);let s=v==='mod5'?String(row*col%5):v==='mod4'?String((row+col)%4):v==='and'?String(row%2&&col%2?1:0):v==='or'?String(row%2||col%2?1:0):v==='adjacency'?String(row!==col?1:0):String(row===col?1:0);if(v==='entries')s=String([[2,1,0],[1,3,0],[0,0,1]][row][col]);text(s,x,y+1,11);}
   if(['shear','rotation','rank'].includes(v)){c.save();c.translate(0,-3);if(v==='rotation')c.rotate(t*.25);if(v==='shear')c.transform(1,0,.4*Math.sin(t),1,0,0);if(v==='rank')c.scale(1,.15+.85*p);c.strokeStyle=palette[2];c.strokeRect(-27,-27,54,54);c.restore();}break;
  }
  case 'vector':{
   axes();const angle=.4+t*.25;let a:Point=[32,0],b:Point=[22*Math.cos(angle),-22*Math.sin(angle)];
   if(v==='conjugate'||v==='reflection'){a=[27,-19];b=[27,19];}if(v==='quarter'){a=[24*Math.cos(angle),-24*Math.sin(angle)];b=[a[1],-a[0]];}
   if(v==='inverse'){a=[20*Math.cos(angle),-20*Math.sin(angle)];b=[31.25*Math.cos(angle),31.25*Math.sin(angle)];}
   if(v==='orthogonal'||v==='basis'||v==='cross'){a=[35,0];b=[0,-26];}if(v==='scale'||v==='eigen'){a=[15,-10];b=[a[0]*(1+2*p),a[1]*(1+2*p)];}if(v==='null')b=[0,0];
   const arrow=(start:Point,end:Point,col:string)=>{line([start,end],col,2);const a=Math.atan2(end[1]-start[1],end[0]-start[0]);line([[end[0]-5*Math.cos(a-.5),end[1]-5*Math.sin(a-.5)],end,[end[0]-5*Math.cos(a+.5),end[1]-5*Math.sin(a+.5)]],col);};
   arrow([0,16],[a[0],a[1]+16],color);arrow([0,16],[b[0],b[1]+16],palette[1]);
   if(v==='addition'){arrow([a[0],a[1]+16],[a[0]+b[0],a[1]+b[1]+16],palette[1]);arrow([0,16],[a[0]+b[0],a[1]+b[1]+16],palette[2]);}if(v==='projection')line([[b[0],b[1]+16],[b[0],16]],palette[2],1);break;
  }
  case 'polygon':{
   if(v==='bisector'){line([[-35,17],[35,17]]);line([[0,-29],[0,29]],palette[1]);ellipse(-35,17,42);ellipse(35,17,42,42,palette[1]);dot(0,17);break;}
   if(v==='euler'){const points:Point[]=[[0,20]];let x=0,y=1;for(let k=0;k<6;k++){points.push([-43+x*18,20-y*10]);y+=.35*y;x+=.35;}line(points);dot(...points[Math.floor(p*(points.length-1))]);break;}
   const n=d[0]||3,angle=v==='reflection'||v==='roots'?0:t*.18,scale=v==='dilate'?20+10*p:27;const pts:Point[]=Array.from({length:n},(_,k)=>[scale*Math.cos(k*tau/n+angle),scale*Math.sin(k*tau/n+angle)]);line([...pts,pts[0]]);pts.forEach(([x,y],k)=>dot(x,y,k===Math.floor(t)%n?4:2,k===Math.floor(t)%n?palette[2]:color));
   if(v==='roots')ellipse(0,0,scale);if(v==='triangle')text('α + β + γ',0,4,10,palette[2]);if(v==='similar'){c.save();c.scale(.55,.55);line([...pts,pts[0]],palette[1]);c.restore();}if(v==='arc')ellipse(0,0,30);break;
  }
  case 'circle':{
   const r=v==='scale'?28:26,a=t*.35,x=r*Math.cos(a),y=(v==='phase'?1:-1)*r*Math.sin(a);ellipse(0,0,r,v==='singular'?14:r);line([[0,0],[x,y]]);dot(x,y,3,'#fff');
   if(v==='scale'){ellipse(0,0,14,14,palette[1]);dot(x/2,y/2,3,palette[1]);}
   if(v==='conjugate')dot(x,-y,3,palette[1]);if(v==='clock'){const n=d[0]||6;for(let k=0;k<n;k++)dot(r*Math.cos(k*tau/n),r*Math.sin(k*tau/n),k===Math.floor(t)%n?4:1.5);}
   if(['sine','cosine','modulus','euler','argument'].includes(v))line([[x,y],[x,0],[0,0]],palette[1],1);
   if(v==='demoivre'||v==='half'){const m=v==='half'?.5:3;line([[0,0],[r*Math.cos(m*a),-r*Math.sin(m*a)]],palette[1]);}
   if(v==='tangent'){line([[r,-30],[r,30]],palette[2]);line([[0,0],[r,Math.max(-30,Math.min(30,-r*Math.tan(a)))]],palette[1]);}
   if(v==='chord')line([[-22,14],[22,14]],palette[1]);if(v==='inscribed')line([[-20,16],[x,y],[20,16]],palette[1]);if(v==='squaring'){c.strokeStyle=palette[1];c.strokeRect(-r*Math.sqrt(Math.PI)/2,-r*Math.sqrt(Math.PI)/2,r*Math.sqrt(Math.PI),r*Math.sqrt(Math.PI));}
   if(v==='harmonic')line(Array.from({length:80},(_,k)=>{const a=k*tau/79,rad=24*Math.abs(Math.cos(3*a));return [rad*Math.cos(a),rad*Math.sin(a)] as Point;}),palette[1]);
   if(v==='packing'){for(let j=0;j<6;j++){const a=j*tau/6;ellipse(16*Math.cos(a),16*Math.sin(a),8,8,palette[1]);}}break;
  }
  case 'spiral':{
   if(v==='lorenz'){let x=.1,y=0,z=0;const pts:Point[]=[];for(let i=0;i<1000;i++){const dx=10*(y-x),dy=x*(28-z)-y,dz=x*y-8*z/3;x+=dx*.008;y+=dy*.008;z+=dz*.008;if(i>100&&i%3===0)pts.push([x*1.5,25-z*1.2]);}line(pts);dot(...pts[Math.floor(p*(pts.length-1))],3,palette[2]);}
   else{const pts:Point[]=Array.from({length:90},(_,k)=>{const a=k/89*tau*2,rad=v==='golden'?.55*Math.exp(a*Math.log((1+Math.sqrt(5))/2)/(Math.PI/2)):2*Math.exp(a*.2);return [rad*Math.cos(a+t*.1),rad*Math.sin(a+t*.1)];});line(pts);dot(...pts[Math.floor(p*(pts.length-1))]);}break;
  }
  case 'venn':{
   if(v==='nested'||v==='complexity'){[34,26,18,10].forEach((r,k)=>ellipse(0,7,r,r,palette[k]));dot(0,7,2+2*p);}
   else if(v==='partition'){for(let k=0;k<3;k++){ellipse(-30+k*30,0,13,22,palette[k]);dot(-30+k*30,12*Math.sin(t+k),2,palette[k]);}}
   else{c.save();c.fillStyle=`${color}33`;c.beginPath();c.arc(-13,0,25,0,tau);if(v==='intersection'){c.clip();c.beginPath();c.arc(13,0,25,0,tau);}c.fill();if(['union','symmetric','inclusion'].includes(v)){c.fillStyle=palette[1]+'33';c.beginPath();c.arc(13,0,25,0,tau);c.fill();}c.restore();ellipse(-13,0,25);ellipse(13,0,25,25,palette[1]);dot(6*Math.sin(t),9*Math.cos(t),3,palette[2]);}break;
  }
  case 'mapping':{
   if(['square','mobius','polar','reciprocal'].includes(v)){
    const angle=t*.25,z:Point=[.8*Math.cos(angle),.8*Math.sin(angle)];
    const mapped:Point=v==='square'?[z[0]*z[0]-z[1]*z[1],2*z[0]*z[1]]:v==='mobius'?[(z[0]*z[0]+z[1]*z[1]-1)/((z[0]+1)**2+z[1]*z[1]),2*z[1]/((z[0]+1)**2+z[1]*z[1])]:v==='reciprocal'?[z[0]/.64,-z[1]/.64]:z;
    ellipse(-28,0,22);ellipse(28,0,22,22,palette[1]);line([[-28,0],[-28+z[0]*22,-z[1]*22]]);line([[28,0],[28+Math.max(-1,Math.min(1,mapped[0]))*20,-Math.max(-1,Math.min(1,mapped[1]))*20]],palette[1]);dot(-28+z[0]*22,-z[1]*22,3);dot(28+Math.max(-1,Math.min(1,mapped[0]))*20,-Math.max(-1,Math.min(1,mapped[1]))*20,3,palette[2]);break;
   }
   const count=v==='pigeonhole'?5:3;ellipse(-34,0,12,30);ellipse(34,0,12,30,palette[1]);for(let k=0;k<count;k++){const y=-22+k*44/(count-1),target=v==='kernel'||v==='surjective'?0:v==='conjugate'?-y:y;dot(-34,y,2);dot(34,target,2,palette[1]);line([[-29,y],[29,target]],k===Math.floor(t)%count?palette[2]:'#52618e',1);const progress=(t*.2+k/count)%1;dot(-29+58*progress,y+(target-y)*progress,2.5);}break;
  }
  case 'network':case 'tree':{
   if(v==='cube'){const points:Point[]=Array.from({length:8},(_,i)=>{const x=(i&1?1:-1)*17,y=(i&2?1:-1)*17,z=(i&4?1:-1)*17;return [x*Math.cos(t*.2)+z*Math.sin(t*.2),y+.35*(-x*Math.sin(t*.2)+z*Math.cos(t*.2))];});points.forEach((point,i)=>[1,2,4].forEach(bit=>{if(!(i&bit))line([point,points[i|bit]]);}));points.forEach(([x,y])=>dot(x,y,2));break;}
   const n=d[0]||6;let pts:Point[]=Array.from({length:n},(_,k)=>[30*Math.cos(k*tau/n),25*Math.sin(k*tau/n)]),edges:Point[]=[];
   if(item.kind==='tree'||v==='tree'||v==='lattice'){pts=[[0,-25],[-23,-3],[23,-3],[-37,23],[-12,23],[12,23],[37,23]];edges=[[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]];}
   else{edges=pts.map((_,k)=>[k,(k+1)%n]);if(['complete','weighted','flow','bfs','coloring','cube','bridges','bridge'].includes(v))for(let k=2;k<n;k++)edges.push([0,k]);}
   edges.forEach(([a,b],k)=>{const active=k===Math.floor(t)%edges.length;line([pts[a],pts[b]],active?palette[2]:'#516794',active?2.5:1);if(active){const progress=(t%1);dot(pts[a][0]+(pts[b][0]-pts[a][0])*progress,pts[a][1]+(pts[b][1]-pts[a][1])*progress,3);}});
   pts.forEach(([x,y],k)=>{dot(x,y,3,v==='coloring'?palette[k%3]:color);if(v==='factors')text(['12','2','6','','','2','3'][k]||'',x,y-7,10);if(v==='pascal')text(['1','1','1','1','2','2','1'][k],x,y-7,10);});break;
  }
  case 'bars':{
   const nums=d.length?d:[1,3,5,3,1],max=Math.max(...nums),w=85/nums.length;
   nums.forEach((value,k)=>{const h=38*value/max;const active=k===Math.floor(t)%nums.length;c.fillStyle=active?`${palette[2]}99`:`${color}66`;c.fillRect(-43+k*w,24-h,w-3,h);if(active)dot(-43+k*w+(w-3)/2,24-h-4,2,palette[2]);});line([[-46,25],[46,25]],'#668bb5',1);break;
  }
  case 'interval':{
   line([[-47,5],[47,5]],'#587093',1);const spread=v==='se'||v==='confidence'?18+12*(1-p):28;
   line([[-spread,5],[spread,5]],color,3);[-spread,spread].forEach((x,k)=>{if(v==='half-open'&&k===1)ellipse(x,5,3);else dot(x,5,3);});dot(0,5,3,palette[2]);
   if(v==='box'){c.strokeStyle=palette[1];c.strokeRect(-17,-7,34,24);line([[0,-7],[0,17]],palette[2]);}
   if(v==='coverage')for(let j=0;j<3;j++){const shift=12*Math.sin(t*.2+j*2);line([[-18+shift,-22+j*12],[18+shift,-22+j*12]],palette[j]);}break;
  }
  case 'field':{
   const field=(x:number,y:number):Point=>v==='sink'?[-x,-y]:v==='saddle'?[x,-y]:v==='laplace'?[x,y]:[1,x-y];
   for(let j=-2;j<=2;j++)for(let k=-2;k<=2;k++){const [dx,dy]=field(j,k),a=Math.atan2(dy,dx),x=j*17,y=k*12;line([[x-4*Math.cos(a),y+4*Math.sin(a)],[x+4*Math.cos(a),y-4*Math.sin(a)]],color,1);}
   if(v==='sink'){const r=27*Math.exp(-(t%5)*.6);dot(r*Math.cos(.7),-r*Math.sin(.7),3,palette[2]);}
   else if(v==='saddle'){const s=t%4-2;dot(5*Math.exp(s),-5*Math.exp(-s),3,palette[2]);}
   else if(v==='laplace'){const r=4*Math.exp((t%4)*.5);dot(r*Math.cos(.7),-r*Math.sin(.7),3,palette[2]);}
   else{const x=t%6/3-.5,y=x-1+.8*Math.exp(-(x+2));dot(x*17,-y*12,3,palette[2]);}break;
  }
  case 'pendulum':{
   const a=.55*Math.sin(t),x=34*Math.sin(a),y=-24+34*Math.cos(a);line([[-28,-24],[28,-24]],'#718bac');line([[0,-24],[x,y]],color,2);dot(x,y,6,palette[2]);break;
  }
  case 'spring':{
   const end=18+15*Math.sin(t);line([[-45,-20],[-45,20]],'#718bac');line(Array.from({length:17},(_,k)=>[-43+(end+43)*k/16,k===0||k===16?0:k%2?8:-8] as Point));c.fillStyle=color+'66';c.fillRect(end,-12,17,24);break;
  }
  case 'surface':{
   if(v==='sphere'||v==='torus'){for(let k=0;k<5;k++)ellipse(0,0,30,3+k*5,palette[k%4]);ellipse(0,0,8+15*p,26,palette[1]);}
   else if(v==='planes'){for(let k=0;k<2;k++)line([[-35,-15+k*25],[20,-25+k*25],[40,-10+k*25],[-15,0+k*25],[-35,-15+k*25]],palette[k]);}
   else{for(let k=0;k<7;k++){const depth=k/6;line(Array.from({length:35},(_,j)=>{const x=j/34*2-1,y=depth*2-1,amp=v==='heat'?Math.exp(-.35*(t%8)):v==='reaction'?1/(1+Math.exp(-(t%8-3))):1;const z=v==='revolution'?Math.sqrt(Math.max(0,1-x*x))*Math.cos(depth*tau):Math.exp(-3*(x*x+y*y));return [x*35+y*10,17+y*10-z*28*amp] as Point;}),palette[k%2]);}}break;
  }
  case 'wave':{
   axes();const fn=(x:number)=>{if(v==='orthogonal')return Math.sin(2*x+t*.2);if(v==='cosine')return Math.cos(x+t);if(v==='harmonic')return Math.sin(x+2);if(v==='damped')return Math.exp(-.2*(x+2))*Math.sin(Math.sqrt(.96)*(x+2));if(v==='standing'||v==='boundary')return Math.sin((x+2)*Math.PI/4)*Math.cos(t);if(v==='forced')return -.5*(x+2)*Math.cos(x+2);if(v==='heat')return Math.exp(-.25*(t%8))*Math.sin((x+2)*Math.PI/4);if(v==='frequency')return Math.sin(2*x+t);if(v==='beats')return .5*(Math.sin(4*x-t)+Math.sin(4.8*x-t));if(v==='amplitude')return (.5+p)*Math.sin(x+t);return Math.sin(3*x-t);};curve(fn);if(v==='orthogonal')curve(x=>Math.sin(x+t*.2),palette[1]);pointOnCurve(fn);break;
  }
  case 'sieve':{
   for(let n=2;n<=25;n++){const prime=Array.from({length:Math.max(0,Math.floor(Math.sqrt(n))-1)},(_,k)=>k+2).every(k=>n%k!==0);const x=-40+(n-2)%6*16,y=-20+Math.floor((n-2)/6)*14;text(String(n),x,y,10,prime?color:'#48617b');if(n===Math.floor(t*2)%24+2)ellipse(x,y-3,7,7,palette[2]);}break;
  }
  case 'balance':{
   c.save();c.rotate(.06*Math.sin(t));line([[-40,-8],[40,-8]],palette[2],2);line([[-30,-8],[-42,14],[-18,14],[-30,-8]]);line([[30,-8],[18,14],[42,14],[30,-8]],palette[1]);text('2x + 4',-30,10,10);text('10',30,10,12,palette[1]);c.restore();line([[0,-8],[0,27],[-16,27],[16,27]],palette[2]);break;
  }
  case 'tangent':case 'limit':{
   axes();const f=(x:number)=>x*x/2;curve(f);const a=v==='optimum'?0:.5,h=.12+(1-p)*1.2,m=v==='optimum'?0:(f(a+h)-f(a))/h;
   if(item.kind==='limit'){const x=v==='left'?a-h:a+h;dot(x*23,12-f(x)*16,4,palette[2]);ellipse(a*23,12-f(a)*16,4);}
   else{line([[(a-1)*23,12-(f(a)-m)*16],[(a+1)*23,12-(f(a)+m)*16]],palette[2],2);dot(a*23,12-f(a)*16,3);dot((a+h)*23,12-f(a+h)*16,3,palette[1]);}break;
  }
  case 'integral':{
   axes();const tail=v==='tails'||v==='pvalue',f=tail?(x:number)=>objectPlot('normal',x)*3:v==='signed'?Math.sin:(x:number)=>1+.3*Math.cos(x);
   const n=6+Math.floor(p*12),width=4/n;for(let k=0;k<n;k++){const x=-2+k*width,y=f(x+width/2);if(tail&&Math.abs(x)<1.3)continue;if(v==='accumulation'&&k>p*n)continue;c.fillStyle=color+'44';c.fillRect(x*23,12-y*16,width*23-1,y*16);}curve(f);break;
  }
 }
 c.shadowBlur=0;
}

export const objectPositions:Point[]=[...Array.from({length:5},(_,k)=>[100+k*140,72] as Point),...Array.from({length:5},(_,k)=>[100+k*140,535] as Point),[65,210],[65,320],[65,430],[695,240],[695,380]];

export function drawStudioObjects(c:C,id:string,time:number,compact=false){
 const objects=visibleStudioObjects(id);if(!objects.length)return;
 objects.forEach((item,index)=>{
  const [x,y]=compact?[100+(index%2)*200,320+Math.floor(index/2)*145]:[135+(index%3)*245,index<3?72:535],t=time*(.6+(index%5)*.08)+index*.65,color=palette[index%4];
  c.save();c.translate(x,y);c.globalAlpha*=Math.min(1,Math.max(0,(time-index*.055)/.8));
  const glow=c.createRadialGradient(0,0,2,0,0,53);glow.addColorStop(0,color+'15');glow.addColorStop(1,color+'00');c.fillStyle=glow;c.fillRect(-58,-48,116,96);
  if(['plot','matrix','table','identity'].includes(item.kind)){c.fillStyle='#091a3433';c.strokeStyle=color+'33';c.lineWidth=.7;c.beginPath();c.roundRect(-55,-40,110,77,7);c.fill();c.stroke();}
  drawObject(c,item,t,color);
  c.shadowBlur=0;c.textAlign='center';c.font='600 12px system-ui';c.fillStyle='#c3ddf6';c.fillText(item.name,0,45);
  c.font='11px "Cambria Math", Georgia, serif';c.fillStyle=color;c.fillText(item.formula,0,61,126);c.restore();
 });
}

