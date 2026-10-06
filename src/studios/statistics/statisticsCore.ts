/** Deterministic, data-based statistics. All coordinates are data coordinates. */
export const mean = (xs: number[]) => xs.reduce((a,b)=>a+b,0)/xs.length;
export const variance = (xs: number[], sample = true) => xs.reduce((s,x)=>s+(x-mean(xs))**2,0)/(xs.length-(sample?1:0));
export function quantile(xs: number[], p: number) { const s=[...xs].sort((a,b)=>a-b), i=(s.length-1)*p, lo=Math.floor(i); return s[lo]+(s[Math.min(lo+1,s.length-1)]-s[lo])*(i-lo); }
export function parseData(raw: string) {
  const tokens=raw.trim().split(/[\s,;]+/).filter(Boolean), values=tokens.map(Number);
  return {values:values.filter(Number.isFinite), invalid:tokens.filter((_,i)=>!Number.isFinite(values[i]))};
}
export function summarize(xs: number[]) {
  if(!xs.length)return null;
  const m=mean(xs), q1=quantile(xs,.25), median=quantile(xs,.5), q3=quantile(xs,.75), iqr=q3-q1, v=xs.length>1?variance(xs):NaN, populationVariance=variance(xs,false);
  return {n:xs.length,mean:m,median,q1,q3,iqr,min:Math.min(...xs),max:Math.max(...xs),variance:v,sd:Math.sqrt(v),populationVariance,skewness:populationVariance>0?mean(xs.map(x=>(x-m)**3))/populationVariance**1.5:0,outliers:xs.filter(x=>x<q1-1.5*iqr||x>q3+1.5*iqr)};
}
export function rng(seed: number) { let s=seed>>>0; return ()=>{s=(1664525*s+1013904223)>>>0;return (s+.5)/4294967296;}; }
export function logGamma(z: number): number {
  const c=[676.5203681218851,-1259.1392167224028,771.3234287776531,-176.6150291621406,12.507343278686905,-.13857109526572012,9.984369578019572e-6,1.5056327351493116e-7];
  if(z<.5)return Math.log(Math.PI)-Math.log(Math.sin(Math.PI*z))-logGamma(1-z);
  z--;let x=.99999999999980993; c.forEach((v,i)=>x+=v/(z+i+1)); const t=z+7.5;return .5*Math.log(2*Math.PI)+(z+.5)*Math.log(t)-t+Math.log(x);
}
export function betaCdf(x: number,a: number,b: number): number {
  if(x<=0)return 0;if(x>=1)return 1;
  function fraction(z:number,aa:number,bb:number){let c=1,d=1-(aa+bb)*z/(aa+1);if(Math.abs(d)<1e-30)d=1e-30;d=1/d;let h=d;
    for(let m=1;m<=200;m++){let v=m*(bb-m)*z/((aa+2*m-1)*(aa+2*m));d=1+v*d;if(Math.abs(d)<1e-30)d=1e-30;c=1+v/c;if(Math.abs(c)<1e-30)c=1e-30;d=1/d;h*=d*c;v=-(aa+m)*(aa+bb+m)*z/((aa+2*m)*(aa+2*m+1));d=1+v*d;if(Math.abs(d)<1e-30)d=1e-30;c=1+v/c;if(Math.abs(c)<1e-30)c=1e-30;d=1/d;const delta=d*c;h*=delta;if(Math.abs(delta-1)<1e-13)break;}return h;}
  const factor=Math.exp(logGamma(a+b)-logGamma(a)-logGamma(b)+a*Math.log(x)+b*Math.log1p(-x));
  return x<(a+1)/(a+b+2)?factor*fraction(x,a,b)/a:1-factor*fraction(1-x,b,a)/b;
}
export function gammaCdf(x: number,a:number) {
  if(x<=0)return 0;
  const factor=Math.exp(-x+a*Math.log(x)-logGamma(a));
  if(x<a+1){let term=1/a,sum=term;for(let n=1;n<300;n++){term*=x/(a+n);sum+=term;if(Math.abs(term)<Math.abs(sum)*1e-14)break;}return Math.min(1,sum*factor);}
  let b=x+1-a,c=1e30,d=1/b,h=d;for(let i=1;i<300;i++){const v=-i*(i-a);b+=2;d=v*d+b;if(Math.abs(d)<1e-30)d=1e-30;c=b+v/c;if(Math.abs(c)<1e-30)c=1e-30;d=1/d;const delta=d*c;h*=delta;if(Math.abs(delta-1)<1e-14)break;}return Math.max(0,1-factor*h);
}
export const normalCdf=(x:number)=>x===0?.5:x>0?.5+.5*gammaCdf(x*x/2,.5):.5-.5*gammaCdf(x*x/2,.5);
export function inverseCdf(cdf:(x:number)=>number,p:number,lo=-40,hi=40){for(let i=0;i<100;i++){const mid=(lo+hi)/2;if(cdf(mid)<p)lo=mid;else hi=mid;}return (lo+hi)/2;}
export const normalQuantile=(p:number)=>inverseCdf(normalCdf,p);
export function studentCdf(t:number,df:number){const tail=.5*betaCdf(df/(df+t*t),df/2,.5);return t>=0?1-tail:tail;}
export const studentQuantile=(p:number,df:number)=>inverseCdf(x=>studentCdf(x,df),p,-1e6,1e6);
export const fTail=(f:number,df1:number,df2:number)=>1-betaCdf(df1*f/(df1*f+df2),df1/2,df2/2);
export function meanInterval(xs:number[],level:number){const n=xs.length,m=mean(xs),se=Math.sqrt(variance(xs)/n),critical=studentQuantile((1+level)/2,n-1);return {estimate:m,se,critical,lower:m-critical*se,upper:m+critical*se,df:n-1};}
export function proportionInterval(successes:number,n:number,level:number){const p=successes/n,z=normalQuantile((1+level)/2),den=1+z*z/n,center=(p+z*z/(2*n))/den,half=z*Math.sqrt(p*(1-p)/n+z*z/(4*n*n))/den;return {estimate:p,lower:center-half,upper:center+half,critical:z};}
export function welch(xs:number[],ys:number[],nullDifference=0){const a=variance(xs)/xs.length,b=variance(ys)/ys.length,se=Math.sqrt(a+b),df=(a+b)**2/(a*a/(xs.length-1)+b*b/(ys.length-1)),difference=mean(xs)-mean(ys),t=(difference-nullDifference)/se;return {difference,se,df,t,p:2*(1-studentCdf(Math.abs(t),df))};}
export function bootstrap(xs:number[],level:number,seed:number,repeats=1000){const rand=rng(seed),estimates=Array.from({length:repeats},()=>mean(xs.map(()=>xs[Math.floor(rand()*xs.length)])));return {estimate:mean(xs),lower:quantile(estimates,(1-level)/2),upper:quantile(estimates,(1+level)/2),estimates};}
export function oneSample(xs:number[],mu:number){const se=Math.sqrt(variance(xs)/xs.length),t=se>0?(mean(xs)-mu)/se:NaN;return {t,df:xs.length-1,se,p:Number.isFinite(t)?2*(1-studentCdf(Math.abs(t),xs.length-1)):NaN};}
export function permutation(xs:number[],ys:number[],seed:number,repeats=2000){const rand=rng(seed),observed=Math.abs(mean(xs)-mean(ys)),all=[...xs,...ys];let extreme=0;for(let r=0;r<repeats;r++){const shuffled=[...all];for(let i=shuffled.length-1;i>0;i--){const j=Math.floor(rand()*(i+1));[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];}if(Math.abs(mean(shuffled.slice(0,xs.length))-mean(shuffled.slice(xs.length)))>=observed-1e-12)extreme++;}return {difference:mean(xs)-mean(ys),p:(extreme+1)/(repeats+1),repeats};}
export function chiSquare(rows:number[][]){const r=rows.length,c=rows[0].length,total=rows.flat().reduce((a,b)=>a+b,0),row=rows.map(a=>a.reduce((x,y)=>x+y,0)),col=rows[0].map((_,j)=>rows.reduce((s,a)=>s+a[j],0));const expected=rows.map((a,i)=>a.map((_,j)=>row[i]*col[j]/total));const statistic=rows.reduce((s,a,i)=>s+a.reduce((ss,v,j)=>ss+(v-expected[i][j])**2/expected[i][j],0),0),df=(r-1)*(c-1);return {statistic,df,p:1-gammaCdf(statistic/2,df/2),expected};}
export function regression(points:{x:number;y:number}[]){const n=points.length,mx=mean(points.map(p=>p.x)),my=mean(points.map(p=>p.y)),sxx=points.reduce((s,p)=>s+(p.x-mx)**2,0),syy=points.reduce((s,p)=>s+(p.y-my)**2,0),sxy=points.reduce((s,p)=>s+(p.x-mx)*(p.y-my),0),slope=sxy/sxx,intercept=my-slope*mx,residuals=points.map(p=>p.y-intercept-slope*p.x),sse=residuals.reduce((s,e)=>s+e*e,0);return {n,mx,my,sxx,slope,intercept,r:sxy/Math.sqrt(sxx*syy),r2:1-sse/syy,residuals,sse,residualSd:Math.sqrt(sse/(n-2))};}
export function anova(groups:number[][]){const all=groups.flat(),grand=mean(all),means=groups.map(mean),ssBetween=groups.reduce((s,g,i)=>s+g.length*(means[i]-grand)**2,0),ssWithin=groups.reduce((s,g,i)=>s+g.reduce((a,x)=>a+(x-means[i])**2,0),0),dfBetween=groups.length-1,dfWithin=all.length-groups.length,msBetween=ssBetween/dfBetween,msWithin=ssWithin/dfWithin,f=msBetween/msWithin;return {grand,means,ssBetween,ssWithin,ssTotal:ssBetween+ssWithin,dfBetween,dfWithin,msBetween,msWithin,f,p:Number.isFinite(f)?fTail(f,dfBetween,dfWithin):NaN};}
export type Family='Normal'|'Binomial'|'Poisson'|'Exponential'|'t'|'Chi-square';
export function distribution(family:Family,p:{mu:number;sigma:number;n:number;prob:number;lambda:number;df:number}) {
  const discrete=family==='Binomial'||family==='Poisson';
  const density=(x:number)=>{
    if(family==='Normal')return Math.exp(-.5*((x-p.mu)/p.sigma)**2)/(p.sigma*Math.sqrt(2*Math.PI));
    if(family==='Binomial')return x<0||x>p.n||!Number.isInteger(x)?0:Math.exp(logGamma(p.n+1)-logGamma(x+1)-logGamma(p.n-x+1)+x*Math.log(p.prob)+(p.n-x)*Math.log1p(-p.prob));
    if(family==='Poisson')return x<0||!Number.isInteger(x)?0:Math.exp(-p.lambda+x*Math.log(p.lambda)-logGamma(x+1));
    if(family==='Exponential')return x<0?0:p.lambda*Math.exp(-p.lambda*x);
    if(family==='t')return Math.exp(logGamma((p.df+1)/2)-logGamma(p.df/2))/(Math.sqrt(p.df*Math.PI))*(1+x*x/p.df)**(-(p.df+1)/2);
    if(x<0)return 0;
    if(x===0)return p.df<2?Infinity:p.df===2?.5:0;
    return Math.exp((p.df/2-1)*Math.log(x)-x/2-(p.df/2)*Math.log(2)-logGamma(p.df/2));
  };
  const cdf=(x:number)=>{
    if(family==='Normal')return normalCdf((x-p.mu)/p.sigma);
    if(discrete){let sum=0;for(let k=0;k<=Math.min(Math.floor(x),family==='Binomial'?p.n:Math.ceil(p.lambda+15*Math.sqrt(p.lambda)+60));k++)sum+=density(k);return Math.min(1,sum);}
    if(family==='Exponential')return x<0?0:1-Math.exp(-p.lambda*x);
    if(family==='t')return studentCdf(x,p.df);
    return gammaCdf(x/2,p.df/2);
  };
  const support=family==='Normal'?[p.mu-4*p.sigma,p.mu+4*p.sigma]:family==='Binomial'?[0,p.n]:family==='Poisson'?[0,Math.ceil(p.lambda+5*Math.sqrt(p.lambda))]:family==='Exponential'?[0,6/p.lambda]:family==='t'?[-6,6]:[0,p.df+5*Math.sqrt(2*p.df)];
  return {density,cdf,discrete,support,probability:(a:number,b:number)=>b<a?0:Math.max(0,cdf(b)-cdf(discrete?Math.ceil(a)-1:a))};
}
