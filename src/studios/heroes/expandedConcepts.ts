export const expandedConcepts:Record<string,[string,string][]>={
 'linear-algebra':[
 ['Horizontal stretch','A = diag(2,1)'],['Vertical compression','A = diag(1,½)'],['Reflection across x','A = diag(1,−1)'],['Reflection across y','A = diag(−1,1)'],['Quarter-turn rotation','R(π/2)'],['Horizontal shear','A = [1 s; 0 1]'],['Vertical shear','A = [1 0; s 1]'],['Projection onto x','A = diag(1,0)'],['Projection onto y','A = diag(0,1)'],['Coordinate swap','A = [0 1; 1 0]'],['Negative eigenvalue','Av = −v'],['Positive eigenvalue','Av = 2v'],['Area-preserving squeeze','det diag(2,½) = 1'],['Matrix composition','R(θ) diag(2,1)'],['Inverse round trip','A⁻¹Av = v']
 ],
 statistics:[
 ['Spinning coin','Two equiprobable faces'],['Rolling die','Six equiprobable faces'],['Ace of spades','P(A♠) = 1/52'],['Ace of hearts','P(A♥) = 1/52'],['Two-dice sum','P(sum=7) = 6/36'],['Bernoulli trials','P(X=1) = 0.7'],['Geometric waiting','P(X=k) = ½ᵏ'],['Exponential waiting','f(x) = e⁻ˣ, x ≥ 0'],['Triangular density','f(x) = 1−|x|, |x|≤1'],['Normal interval area','P(−a ≤ Z ≤ a)'],['Mean marker','x̄ = 3'],['Median marker','median(1,2,3,4,5) = 3'],['Interquartile range','Q₃−Q₁ = 2'],['Negative correlation','r = −1'],['Law of large numbers','Head frequency → ½']
 ],
 discrete:[
 ['XOR truth table','P ⊕ Q'],['NAND truth table','¬(P ∧ Q)'],['Implication table','P ⇒ Q'],['Biconditional table','P ⇔ Q'],['Power-set masks','P({a,b,c}): 8 subsets'],['Gray-code walk','Consecutive codes differ by 1 bit'],['Hamming distance','d(000,111) = 3'],['Cycle graph C₅','5 vertices, 5 edges'],['Complete graph K₅','5 vertices, 10 edges'],['Bipartite graph K₃,₃','6 vertices, 9 edges'],['Cube graph Q₃','8 vertices, 12 edges'],['Triangular numbers','1,3,6,10,15'],['Square numbers','1,4,9,16,25'],['Powers of three','1,3,9,27,81'],['Pascal row four','1,4,6,4,1']
 ],
 'continued-fractions':[
 ['Silver-ratio tail','1+√2 = [2;2,2,…]'],['Square-root three tail','√3 = [1;1,2,1,2,…]'],['Euler-number coefficients','e = [2;1,2,1,1,4,…]'],['Pi coefficient ladder','π = [3;7,15,1,…]'],['Rational termination','43/19 = [2;3,1,4]'],['Mediant construction','1/3 ⊕ 1/2 = 2/5'],['Determinant identity','pₙqₙ₋₁−pₙ₋₁qₙ = ±1'],['Numerator recurrence','pₙ = aₙpₙ₋₁+pₙ₋₂'],['Denominator growth','1,1,2,3,5,8,13'],['Golden approximation gap','|φ−p/q|'],['Silver convergents','2,5/2,12/5,29/12'],['Root-three convergents','1,2,5/3,7/4,19/11'],['Euler convergents','2,3,8/3,11/4,19/7'],['Pi approximation gap','|π−p/q|'],['Finite nested evaluation','[1;2,2] = 7/5']
 ]
};

type P=[number,number];
export function drawExpandedConcepts(c:CanvasRenderingContext2D,id:string,time:number,width:number,height:number){
 const items=expandedConcepts[id];if(!items)return;
 const cols=width<600?2:5,rows=Math.ceil(items.length/cols),cellW=width/cols,cellH=height/rows;
 c.clearRect(0,0,width,height);
 const colors=['#48dfff','#b98aff','#ffd17c'];
 items.forEach(([name,formula],i)=>{
  const t=time*.7+i*.3,col=colors[i%3];
  c.save();c.translate((i%cols+.5)*cellW,(Math.floor(i/cols)+.5)*cellH-15);c.scale(Math.min(cellW/160,cellH/150),Math.min(cellW/160,cellH/150));
  const line=(pts:P[],color=col)=>{c.beginPath();pts.forEach(([x,y],j)=>j?c.lineTo(x,y):c.moveTo(x,y));c.strokeStyle=color;c.lineWidth=1.4;c.stroke();};
  const text=(s:string,x:number,y:number,size=12)=>{c.fillStyle=col;c.font=`${size}px "Cambria Math", Georgia, serif`;c.textAlign='center';c.fillText(s,x,y,145);};
  const dot=(x:number,y:number,r=3)=>{c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fillStyle=col;c.fill();};
  c.strokeStyle=col+'55';c.fillStyle='#0b183988';c.beginPath();c.roundRect(-73,-48,146,94,9);c.fill();c.stroke();c.shadowColor=col;c.shadowBlur=6;
  if(id==='linear-algebra'){
   const s=(1-Math.cos(t))/2,angle=s*Math.PI/2;
   const matrices:number[][]=[[1+s,0,0,1],[1,0,0,1-s/2],[1,0,0,1-2*s],[1-2*s,0,0,1],[Math.cos(angle),-Math.sin(angle),Math.sin(angle),Math.cos(angle)],[1,s,0,1],[1,0,s,1],[1,0,0,1-s],[1-s,0,0,1],[1-s,s,s,1-s],[1-2*s,0,0,1],[1+s,0,0,1],[1+s,0,0,1/(1+s)],[Math.cos(angle)*(1+s),-Math.sin(angle),Math.sin(angle)*(1+s),Math.cos(angle)],[1+Math.sin(t)**2,0,0,1]];
   const [a,b,d,e]=matrices[i],map=(x:number,y:number):P=>[(a*x+b*y)*17,-(d*x+e*y)*17];
   for(let k=-1;k<=1;k++){line([map(k,-1),map(k,1)],col+'88');line([map(-1,k),map(1,k)],col+'88');}
   line([[0,0],map(1,0)],'#48dfff');line([[0,0],map(0,1)],'#b98aff');dot(...map(1,1));
  }else if(id==='statistics'){
   if(i===0){c.beginPath();c.ellipse(0,0,27*Math.max(.1,Math.abs(Math.cos(t))),27,0,0,Math.PI*2);c.strokeStyle=col;c.stroke();text(Math.cos(t)>0?'H':'T',0,5,20);}
   else if(i===1){const n=Math.floor(t)%6+1;const faces:P[][]=[[[0,0]],[[-16,-16],[16,16]],[[-16,-16],[0,0],[16,16]],[[-16,-16],[16,-16],[-16,16],[16,16]],[[-16,-16],[16,-16],[0,0],[-16,16],[16,16]],[[-16,-18],[16,-18],[-16,0],[16,0],[-16,18],[16,18]]];c.save();c.rotate(.12*Math.sin(t));line([[-30,-30],[30,-30],[30,30],[-30,30],[-30,-30]]);faces[n-1].forEach(([x,y])=>dot(x,y,4));c.restore();}
   else if(i===2||i===3){text('A',-40,-20,20);text(i===2?'♠':'♥',0,15,35);line([[-50,-35],[50,-35],[50,35],[-50,35],[-50,-35]]);dot(-45+90*((t*.3)%1),35);}
   else if([4,5,6].includes(i)){const values=i===4?[1,2,3,4,5,6,5,4,3,2,1]:i===5?[.3,.7]:[.5,.25,.125,.0625,.03125];values.forEach((v,k)=>{const x=-55+k*110/values.length;c.fillStyle=col+(k===Math.floor(t)%values.length?'cc':'66');c.fillRect(x,30-v/Math.max(...values)*60,100/values.length, v/Math.max(...values)*60);});}
   else if(i===7||i===8||i===9){const points:P[]=[];for(let k=0;k<=80;k++){const x=-2+k*.05,y=i===7?(x<0?0:Math.exp(-x)):i===8?Math.max(0,1-Math.abs(x)):Math.exp(-x*x/2);points.push([x*28,30-y*58]);if(i===9&&Math.abs(x)<.3+1.2*(1+Math.sin(t))/2)line([[x*28,30],[x*28,30-y*58]],col+'55');}line(points);dot(...points[Math.floor(t*10)%81]);}
   else if(i<13){line([[-50,0],[50,0]]);[1,2,3,4,5].forEach((n,k)=>{dot(-50+k*25,0);text(String(n),-50+k*25,25,11);});line([[0,-25],[0,10]],'#fff');if(i===12){line([[-25,-15],[25,-15]]);dot(-25,-15);dot(25,-15);}dot(45*Math.sin(t),-30,2);}
   else if(i===13){line([[-50,30],[50,-30]]);for(let k=0;k<7;k++)dot(-45+k*15,27-k*9,2);dot(45*Math.sin(t),-27*Math.sin(t),4);}
   else{line([[-55,0],[55,0]],'#fff');const pts:P[]=[];for(let n=1;n<50;n++){let heads=0;for(let k=1;k<=n;k++)heads+=Math.sin(k*12.9898)>0?1:0;pts.push([-55+n*2.2, -(heads/n-.5)*65]);}line(pts);dot(...pts[Math.floor(t*4)%49]);}
  }else if(id==='discrete'){
   if(i<4){for(let k=0;k<4;k++){const p=k>>1,q=k&1,result=i===0?p^q:i===1?Number(!(p&&q)):i===2?Number(!p||q):Number(p===q);text(`${p}  ${q}  →  ${result}`,0,-27+k*18,13);if(k===Math.floor(t)%4)dot(-55,-31+k*18);}}
   else if(i<7){const k=Math.floor(t)%8,n=i===5?k^(k>>1):i===6?Math.floor(t)%4===3?7:(1<<Math.floor(t)%4)-1:k;text(n.toString(2).padStart(3,'0'),0,5,26);if(i===4)text(['a','b','c'].filter((_,j)=>n&(1<<j)).join(', ')||'∅',0,30,14);}
   else if(i<11){const n=i===9?6:i===10?8:5,pts:P[]=Array.from({length:n},(_,k)=>i===10?[(k&1?1:-1)*23+(k&4?12:-12),(k&2?1:-1)*23+(k&4?-8:8)]:[35*Math.cos(k*Math.PI*2/n),35*Math.sin(k*Math.PI*2/n)]);for(let a=0;a<n;a++)for(let b=a+1;b<n;b++){const edge=i===7?b===a+1||(a===0&&b===4):i===8?true:i===9?a<3&&b>=3:[1,2,4].includes(a^b);if(edge)line([pts[a],pts[b]]);}pts.forEach(([x,y],k)=>dot(x,y,k===Math.floor(t)%n?5:2));}
   else{const values=i===11?[1,3,6,10,15]:i===12?[1,4,9,16,25]:i===13?[1,3,9,27,81]:[1,4,6,4,1];values.forEach((n,k)=>{c.fillStyle=col+(k===Math.floor(t)%5?'dd':'77');c.fillRect(-55+k*23,25-n/Math.max(...values)*55,16,n/Math.max(...values)*55);text(String(n),-47+k*23,40,10);});}
  }else{
   const coefficients=[[2,2,2,2,2],[1,1,2,1,2],[2,1,2,1,1,4],[3,7,15,1],[2,3,1,4],[0,2,2,2],[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1],[2,2,2,2],[1,1,2,1,2],[2,1,2,1,1,4],[3,7,15,1],[1,2,2]][i];
   let pn2=0,pn1=1,qn2=1,qn1=0;const pairs:number[][]=[];coefficients.forEach(a=>{const pn=a*pn1+pn2,qn=a*qn1+qn2;pairs.push([pn,qn]);pn2=pn1;pn1=pn;qn2=qn1;qn1=qn;});
   const k=Math.floor(t)%pairs.length,[pn,qn]=pairs[k];
   if(i===5){text('1/3   +   1/2',0,-15,17);text('↓  2/5',0,20,20);dot(-40+80*((t*.4)%1),0);}
   else if(i===6&&k>0){const [pp,qq]=pairs[k-1];text(`${pn}×${qq} − ${pp}×${qn}`,0,-10,15);text(`= ${pn*qq-pp*qn}`,0,20,22);}
   else if(i===8){[1,1,2,3,5,8,13].forEach((n,j)=>{c.fillStyle=col+'88';c.fillRect(-60+j*18,30-n*4,12,n*4);});dot(-54+Math.floor(t)%7*18,-30);}
   else if(i===9||i===13){const target=i===9?(1+Math.sqrt(5))/2:Math.PI;const error=Math.abs(target-pn/qn);text(`${pn}/${qn}`,0,-12,22);text(`gap ${error.toPrecision(3)}`,0,18,15);}
   else if(i===14){text('[1;2,2]',0,-15,20);text(k===0?'1':k===1?'1 + 1/2':'1 + 1/(2+1/2) = 7/5',0,20,14);}
   else{ text(`[${coefficients[0]+(k ? '; '+coefficients.slice(1,k+1).join(', ') : '')}]`,0,-20,14);text(`${pn}/${qn}`,0,12,22);text((pn/qn).toFixed(6),0,34,12); }
  }
  c.shadowBlur=0;c.font='600 12px system-ui';c.textAlign='center';c.fillStyle='#e0efff';c.fillText(name,0,65,148);text(formula,0,84,11);c.restore();
 });
}



