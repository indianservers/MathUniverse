import"./vendor-icons-B6CDzemE.js";/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const lo="171",xn={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},Mn={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Td=0,eh=1,Ad=2,Ym=3,qm=0,Mh=1,Cd=2,Xn=3,pi=0,nn=1,Cn=2,ui=0,rr=1,th=2,nh=3,ih=4,Rd=5,Pi=100,Pd=101,Id=102,Ld=103,Ud=104,Dd=200,Fd=201,Nd=202,Od=203,Ta=204,Aa=205,Bd=206,kd=207,zd=208,Vd=209,Gd=210,Hd=211,Wd=212,Xd=213,Yd=214,Ca=0,Ra=1,Pa=2,ur=3,Ia=4,La=5,Ua=6,Da=7,co=0,qd=1,Zd=2,fi=0,jd=1,Kd=2,Jd=3,Qd=4,$d=5,ep=6,tp=7,rh="attached",np="detached",fl=300,mi=301,Ii=302,Gs=303,Hs=304,es=306,Ws=1e3,Rn=1001,Xs=1002,Xt=1003,Sh=1004,Zm=1004,Wr=1005,jm=1005,At=1006,Is=1007,Km=1007,Zn=1008,Jm=1008,Qn=1009,bh=1010,wh=1011,Jr=1012,dl=1013,gi=1014,pn=1015,ts=1016,pl=1017,ml=1018,fr=1020,Eh=35902,Th=1021,Ah=1022,tn=1023,Ch=1024,Rh=1025,sr=1026,dr=1027,gl=1028,ho=1029,Ph=1030,_l=1031,Qm=1032,vl=1033,Ls=33776,Us=33777,Ds=33778,Fs=33779,Fa=35840,Na=35841,Oa=35842,Ba=35843,ka=36196,za=37492,Va=37496,Ga=37808,Ha=37809,Wa=37810,Xa=37811,Ya=37812,qa=37813,Za=37814,ja=37815,Ka=37816,Ja=37817,Qa=37818,$a=37819,el=37820,tl=37821,Ns=36492,nl=36494,il=36495,Ih=36283,rl=36284,sl=36285,ol=36286,ip=2200,rp=2201,sp=2202,Ys=2300,al=2301,Sa=2302,er=2400,tr=2401,qs=2402,yl=2500,Lh=2501,$m=0,eg=1,tg=2,op=3200,Uh=3201,ng=3202,ig=3203,Ui=0,ap=1,li="",$t="srgb",pr="srgb-linear",Zs="linear",dt="srgb",rg=0,Ji=7680,sg=7681,og=7682,ag=7683,lg=34055,cg=34056,hg=5386,ug=512,fg=513,dg=514,pg=515,mg=516,gg=517,_g=518,sh=519,lp=512,cp=513,hp=514,Dh=515,up=516,fp=517,dp=518,pp=519,js=35044,vg=35048,yg=35040,xg=35045,Mg=35049,Sg=35041,bg=35046,wg=35050,Eg=35042,Tg="100",oh="300 es",jn=2e3,Ks=2001;let $n=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const i=this._listeners[e];if(i!==void 0){const r=i.indexOf(t);r!==-1&&i.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let r=0,o=i.length;r<o;r++)i[r].call(this,e);e.target=null}}};const qt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Eu=1234567;const or=Math.PI/180,Qr=180/Math.PI;function bn(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(qt[s&255]+qt[s>>8&255]+qt[s>>16&255]+qt[s>>24&255]+"-"+qt[e&255]+qt[e>>8&255]+"-"+qt[e>>16&15|64]+qt[e>>24&255]+"-"+qt[t&63|128]+qt[t>>8&255]+"-"+qt[t>>16&255]+qt[t>>24&255]+qt[n&255]+qt[n>>8&255]+qt[n>>16&255]+qt[n>>24&255]).toLowerCase()}function Qe(s,e,t){return Math.max(e,Math.min(t,s))}function Fh(s,e){return(s%e+e)%e}function Ag(s,e,t,n,i){return n+(s-e)*(i-n)/(t-e)}function Cg(s,e,t){return s!==e?(t-s)/(e-s):0}function Os(s,e,t){return(1-t)*s+t*e}function Rg(s,e,t,n){return Os(s,e,1-Math.exp(-t*n))}function Pg(s,e=1){return e-Math.abs(Fh(s,e*2)-e)}function Ig(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*(3-2*s))}function Lg(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*s*(s*(s*6-15)+10))}function Ug(s,e){return s+Math.floor(Math.random()*(e-s+1))}function Dg(s,e){return s+Math.random()*(e-s)}function Fg(s){return s*(.5-Math.random())}function Ng(s){s!==void 0&&(Eu=s);let e=Eu+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Og(s){return s*or}function Bg(s){return s*Qr}function kg(s){return(s&s-1)===0&&s!==0}function zg(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function Vg(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function Gg(s,e,t,n,i){const r=Math.cos,o=Math.sin,a=r(t/2),l=o(t/2),c=r((e+n)/2),h=o((e+n)/2),u=r((e-n)/2),f=o((e-n)/2),d=r((n-e)/2),p=o((n-e)/2);switch(i){case"XYX":s.set(a*h,l*u,l*f,a*c);break;case"YZY":s.set(l*f,a*h,l*u,a*c);break;case"ZXZ":s.set(l*u,l*f,a*h,a*c);break;case"XZX":s.set(a*h,l*p,l*d,a*c);break;case"YXY":s.set(l*d,a*h,l*p,a*c);break;case"ZYZ":s.set(l*p,l*d,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function en(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function et(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}const Nh={DEG2RAD:or,RAD2DEG:Qr,generateUUID:bn,clamp:Qe,euclideanModulo:Fh,mapLinear:Ag,inverseLerp:Cg,lerp:Os,damp:Rg,pingpong:Pg,smoothstep:Ig,smootherstep:Lg,randInt:Ug,randFloat:Dg,randFloatSpread:Fg,seededRandom:Ng,degToRad:Og,radToDeg:Bg,isPowerOfTwo:kg,ceilPowerOfTwo:zg,floorPowerOfTwo:Vg,setQuaternionFromProperEuler:Gg,normalize:et,denormalize:en};class Me{constructor(e=0,t=0){Me.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Qe(this.x,e.x,t.x),this.y=Qe(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Qe(this.x,e,t),this.y=Qe(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Qe(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*i+e.x,this.y=r*i+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Je{constructor(e,t,n,i,r,o,a,l,c){Je.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,o,a,l,c)}set(e,t,n,i,r,o,a,l,c){const h=this.elements;return h[0]=e,h[1]=i,h[2]=a,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],u=n[7],f=n[2],d=n[5],p=n[8],_=i[0],g=i[3],m=i[6],x=i[1],y=i[4],v=i[7],A=i[2],w=i[5],T=i[8];return r[0]=o*_+a*x+l*A,r[3]=o*g+a*y+l*w,r[6]=o*m+a*v+l*T,r[1]=c*_+h*x+u*A,r[4]=c*g+h*y+u*w,r[7]=c*m+h*v+u*T,r[2]=f*_+d*x+p*A,r[5]=f*g+d*y+p*w,r[8]=f*m+d*v+p*T,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8];return t*o*h-t*a*c-n*r*h+n*a*l+i*r*c-i*o*l}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=h*o-a*c,f=a*l-h*r,d=c*r-o*l,p=t*u+n*f+i*d;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/p;return e[0]=u*_,e[1]=(i*c-h*n)*_,e[2]=(a*n-i*o)*_,e[3]=f*_,e[4]=(h*t-i*l)*_,e[5]=(i*r-a*t)*_,e[6]=d*_,e[7]=(n*l-c*t)*_,e[8]=(o*t-n*r)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,r,o,a){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+e,-i*c,i*l,-i*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(sc.makeScale(e,t)),this}rotate(e){return this.premultiply(sc.makeRotation(-e)),this}translate(e,t){return this.premultiply(sc.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const sc=new Je;function mp(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}const Hg={Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array};function Xr(s,e){return new Hg[s](e)}function Js(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function gp(){const s=Js("canvas");return s.style.display="block",s}const Tu={};function Hr(s){s in Tu||(Tu[s]=!0,console.warn(s))}function Wg(s,e,t){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}function Xg(s){const e=s.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function Yg(s){const e=s.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const Au=new Je().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Cu=new Je().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function qg(){const s={enabled:!0,workingColorSpace:pr,spaces:{},convert:function(i,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===dt&&(i.r=di(i.r),i.g=di(i.g),i.b=di(i.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(i.applyMatrix3(this.spaces[r].toXYZ),i.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===dt&&(i.r=jr(i.r),i.g=jr(i.g),i.b=jr(i.b))),i},fromWorkingColorSpace:function(i,r){return this.convert(i,this.workingColorSpace,r)},toWorkingColorSpace:function(i,r){return this.convert(i,r,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===li?Zs:this.spaces[i].transfer},getLuminanceCoefficients:function(i,r=this.workingColorSpace){return i.fromArray(this.spaces[r].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,r,o){return i.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return s.define({[pr]:{primaries:e,whitePoint:n,transfer:Zs,toXYZ:Au,fromXYZ:Cu,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:$t},outputColorSpaceConfig:{drawingBufferColorSpace:$t}},[$t]:{primaries:e,whitePoint:n,transfer:dt,toXYZ:Au,fromXYZ:Cu,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:$t}}}),s}const at=qg();function di(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function jr(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let wr;class _p{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{wr===void 0&&(wr=Js("canvas")),wr.width=e.width,wr.height=e.height;const n=wr.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=wr}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Js("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),r=i.data;for(let o=0;o<r.length;o++)r[o]=di(r[o]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(di(t[n]/255)*255):t[n]=di(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Zg=0;class nr{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Zg++}),this.uuid=bn(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?r.push(oc(i[o].image)):r.push(oc(i[o]))}else r=oc(i);n.url=r}return t||(e.images[this.uuid]=n),n}}function oc(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?_p.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let jg=0;class Mt extends $n{constructor(e=Mt.DEFAULT_IMAGE,t=Mt.DEFAULT_MAPPING,n=Rn,i=Rn,r=At,o=Zn,a=tn,l=Qn,c=Mt.DEFAULT_ANISOTROPY,h=li){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:jg++}),this.uuid=bn(),this.name="",this.source=new nr(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Me(0,0),this.repeat=new Me(1,1),this.center=new Me(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Je,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==fl)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Ws:e.x=e.x-Math.floor(e.x);break;case Rn:e.x=e.x<0?0:1;break;case Xs:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Ws:e.y=e.y-Math.floor(e.y);break;case Rn:e.y=e.y<0?0:1;break;case Xs:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Mt.DEFAULT_IMAGE=null;Mt.DEFAULT_MAPPING=fl;Mt.DEFAULT_ANISOTROPY=1;class tt{constructor(e=0,t=0,n=0,i=1){tt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*i+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*i+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*i+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*i+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,r;const l=e.elements,c=l[0],h=l[4],u=l[8],f=l[1],d=l[5],p=l[9],_=l[2],g=l[6],m=l[10];if(Math.abs(h-f)<.01&&Math.abs(u-_)<.01&&Math.abs(p-g)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+_)<.1&&Math.abs(p+g)<.1&&Math.abs(c+d+m-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const y=(c+1)/2,v=(d+1)/2,A=(m+1)/2,w=(h+f)/4,T=(u+_)/4,C=(p+g)/4;return y>v&&y>A?y<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(y),i=w/n,r=T/n):v>A?v<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(v),n=w/i,r=C/i):A<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(A),n=T/r,i=C/r),this.set(n,i,r,t),this}let x=Math.sqrt((g-p)*(g-p)+(u-_)*(u-_)+(f-h)*(f-h));return Math.abs(x)<.001&&(x=1),this.x=(g-p)/x,this.y=(u-_)/x,this.z=(f-h)/x,this.w=Math.acos((c+d+m-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Qe(this.x,e.x,t.x),this.y=Qe(this.y,e.y,t.y),this.z=Qe(this.z,e.z,t.z),this.w=Qe(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Qe(this.x,e,t),this.y=Qe(this.y,e,t),this.z=Qe(this.z,e,t),this.w=Qe(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class vp extends $n{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new tt(0,0,e,t),this.scissorTest=!1,this.viewport=new tt(0,0,e,t);const i={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:At,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new Mt(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,i=e.textures.length;n<i;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new nr(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Bn extends vp{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class xl extends Mt{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Xt,this.minFilter=Xt,this.wrapR=Rn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Kg extends Bn{constructor(e=1,t=1,n=1,i={}){super(e,t,i),this.isWebGLArrayRenderTarget=!0,this.depth=n,this.texture=new xl(null,e,t,n),this.texture.isRenderTargetTexture=!0}}class Oh extends Mt{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Xt,this.minFilter=Xt,this.wrapR=Rn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Jg extends Bn{constructor(e=1,t=1,n=1,i={}){super(e,t,i),this.isWebGL3DRenderTarget=!0,this.depth=n,this.texture=new Oh(null,e,t,n),this.texture.isRenderTargetTexture=!0}}class Ot{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,r,o,a){let l=n[i+0],c=n[i+1],h=n[i+2],u=n[i+3];const f=r[o+0],d=r[o+1],p=r[o+2],_=r[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u;return}if(a===1){e[t+0]=f,e[t+1]=d,e[t+2]=p,e[t+3]=_;return}if(u!==_||l!==f||c!==d||h!==p){let g=1-a;const m=l*f+c*d+h*p+u*_,x=m>=0?1:-1,y=1-m*m;if(y>Number.EPSILON){const A=Math.sqrt(y),w=Math.atan2(A,m*x);g=Math.sin(g*w)/A,a=Math.sin(a*w)/A}const v=a*x;if(l=l*g+f*v,c=c*g+d*v,h=h*g+p*v,u=u*g+_*v,g===1-a){const A=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=A,c*=A,h*=A,u*=A}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,i,r,o){const a=n[i],l=n[i+1],c=n[i+2],h=n[i+3],u=r[o],f=r[o+1],d=r[o+2],p=r[o+3];return e[t]=a*p+h*u+l*d-c*f,e[t+1]=l*p+h*f+c*u-a*d,e[t+2]=c*p+h*d+a*f-l*u,e[t+3]=h*p-a*u-l*f-c*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,r=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(i/2),u=a(r/2),f=l(n/2),d=l(i/2),p=l(r/2);switch(o){case"XYZ":this._x=f*h*u+c*d*p,this._y=c*d*u-f*h*p,this._z=c*h*p+f*d*u,this._w=c*h*u-f*d*p;break;case"YXZ":this._x=f*h*u+c*d*p,this._y=c*d*u-f*h*p,this._z=c*h*p-f*d*u,this._w=c*h*u+f*d*p;break;case"ZXY":this._x=f*h*u-c*d*p,this._y=c*d*u+f*h*p,this._z=c*h*p+f*d*u,this._w=c*h*u-f*d*p;break;case"ZYX":this._x=f*h*u-c*d*p,this._y=c*d*u+f*h*p,this._z=c*h*p-f*d*u,this._w=c*h*u+f*d*p;break;case"YZX":this._x=f*h*u+c*d*p,this._y=c*d*u+f*h*p,this._z=c*h*p-f*d*u,this._w=c*h*u-f*d*p;break;case"XZY":this._x=f*h*u-c*d*p,this._y=c*d*u-f*h*p,this._z=c*h*p+f*d*u,this._w=c*h*u+f*d*p;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],r=t[8],o=t[1],a=t[5],l=t[9],c=t[2],h=t[6],u=t[10],f=n+a+u;if(f>0){const d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(h-l)*d,this._y=(r-c)*d,this._z=(o-i)*d}else if(n>a&&n>u){const d=2*Math.sqrt(1+n-a-u);this._w=(h-l)/d,this._x=.25*d,this._y=(i+o)/d,this._z=(r+c)/d}else if(a>u){const d=2*Math.sqrt(1+a-n-u);this._w=(r-c)/d,this._x=(i+o)/d,this._y=.25*d,this._z=(l+h)/d}else{const d=2*Math.sqrt(1+u-n-a);this._w=(o-i)/d,this._x=(r+c)/d,this._y=(l+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Qe(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,r=e._z,o=e._w,a=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+o*a+i*c-r*l,this._y=i*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-i*a,this._w=o*h-n*a-i*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,i=this._y,r=this._z,o=this._w;let a=o*e._w+n*e._x+i*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=i,this._z=r,this;const l=1-a*a;if(l<=Number.EPSILON){const d=1-t;return this._w=d*o+t*this._w,this._x=d*n+t*this._x,this._y=d*i+t*this._y,this._z=d*r+t*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,a),u=Math.sin((1-t)*h)/c,f=Math.sin(t*h)/c;return this._w=o*u+this._w*f,this._x=n*u+this._x*f,this._y=i*u+this._y*f,this._z=r*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class I{constructor(e=0,t=0,n=0){I.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Ru.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Ru.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*i,this.y=r[1]*t+r[4]*n+r[7]*i,this.z=r[2]*t+r[5]*n+r[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*i+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*i+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*i+r[14])*o,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,r=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*i-a*n),h=2*(a*t-r*i),u=2*(r*n-o*t);return this.x=t+l*c+o*u-a*h,this.y=n+l*h+a*c-r*u,this.z=i+l*u+r*h-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i,this.y=r[1]*t+r[5]*n+r[9]*i,this.z=r[2]*t+r[6]*n+r[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Qe(this.x,e.x,t.x),this.y=Qe(this.y,e.y,t.y),this.z=Qe(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Qe(this.x,e,t),this.y=Qe(this.y,e,t),this.z=Qe(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,r=e.z,o=t.x,a=t.y,l=t.z;return this.x=i*l-r*a,this.y=r*o-n*l,this.z=n*a-i*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return ac.copy(this).projectOnVector(e),this.sub(ac)}reflect(e){return this.sub(ac.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Qe(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const ac=new I,Ru=new Ot;class wt{constructor(e=new I(1/0,1/0,1/0),t=new I(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Dn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Dn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Dn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,Dn):Dn.fromBufferAttribute(r,o),Dn.applyMatrix4(e.matrixWorld),this.expandByPoint(Dn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),wo.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),wo.copy(n.boundingBox)),wo.applyMatrix4(e.matrixWorld),this.union(wo)}const i=e.children;for(let r=0,o=i.length;r<o;r++)this.expandByObject(i[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Dn),Dn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ms),Eo.subVectors(this.max,ms),Er.subVectors(e.a,ms),Tr.subVectors(e.b,ms),Ar.subVectors(e.c,ms),bi.subVectors(Tr,Er),wi.subVectors(Ar,Tr),Oi.subVectors(Er,Ar);let t=[0,-bi.z,bi.y,0,-wi.z,wi.y,0,-Oi.z,Oi.y,bi.z,0,-bi.x,wi.z,0,-wi.x,Oi.z,0,-Oi.x,-bi.y,bi.x,0,-wi.y,wi.x,0,-Oi.y,Oi.x,0];return!lc(t,Er,Tr,Ar,Eo)||(t=[1,0,0,0,1,0,0,0,1],!lc(t,Er,Tr,Ar,Eo))?!1:(To.crossVectors(bi,wi),t=[To.x,To.y,To.z],lc(t,Er,Tr,Ar,Eo))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Dn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Dn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(ni[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),ni[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),ni[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),ni[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),ni[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),ni[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),ni[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),ni[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(ni),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const ni=[new I,new I,new I,new I,new I,new I,new I,new I],Dn=new I,wo=new wt,Er=new I,Tr=new I,Ar=new I,bi=new I,wi=new I,Oi=new I,ms=new I,Eo=new I,To=new I,Bi=new I;function lc(s,e,t,n,i){for(let r=0,o=s.length-3;r<=o;r+=3){Bi.fromArray(s,r);const a=i.x*Math.abs(Bi.x)+i.y*Math.abs(Bi.y)+i.z*Math.abs(Bi.z),l=e.dot(Bi),c=t.dot(Bi),h=n.dot(Bi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}const Qg=new wt,gs=new I,cc=new I;class It{constructor(e=new I,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Qg.setFromPoints(e).getCenter(n);let i=0;for(let r=0,o=e.length;r<o;r++)i=Math.max(i,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;gs.subVectors(e,this.center);const t=gs.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(gs,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(cc.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(gs.copy(e.center).add(cc)),this.expandByPoint(gs.copy(e.center).sub(cc))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const ii=new I,hc=new I,Ao=new I,Ei=new I,uc=new I,Co=new I,fc=new I;class Di{constructor(e=new I,t=new I(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ii)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=ii.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(ii.copy(this.origin).addScaledVector(this.direction,t),ii.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){hc.copy(e).add(t).multiplyScalar(.5),Ao.copy(t).sub(e).normalize(),Ei.copy(this.origin).sub(hc);const r=e.distanceTo(t)*.5,o=-this.direction.dot(Ao),a=Ei.dot(this.direction),l=-Ei.dot(Ao),c=Ei.lengthSq(),h=Math.abs(1-o*o);let u,f,d,p;if(h>0)if(u=o*l-a,f=o*a-l,p=r*h,u>=0)if(f>=-p)if(f<=p){const _=1/h;u*=_,f*=_,d=u*(u+o*f+2*a)+f*(o*u+f+2*l)+c}else f=r,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*l)+c;else f=-r,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*l)+c;else f<=-p?(u=Math.max(0,-(-o*r+a)),f=u>0?-r:Math.min(Math.max(-r,-l),r),d=-u*u+f*(f+2*l)+c):f<=p?(u=0,f=Math.min(Math.max(-r,-l),r),d=f*(f+2*l)+c):(u=Math.max(0,-(o*r+a)),f=u>0?r:Math.min(Math.max(-r,-l),r),d=-u*u+f*(f+2*l)+c);else f=o>0?-r:r,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(hc).addScaledVector(Ao,f),d}intersectSphere(e,t){ii.subVectors(e.center,this.origin);const n=ii.dot(this.direction),i=ii.dot(ii)-n*n,r=e.radius*e.radius;if(i>r)return null;const o=Math.sqrt(r-i),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,r,o,a,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return c>=0?(n=(e.min.x-f.x)*c,i=(e.max.x-f.x)*c):(n=(e.max.x-f.x)*c,i=(e.min.x-f.x)*c),h>=0?(r=(e.min.y-f.y)*h,o=(e.max.y-f.y)*h):(r=(e.max.y-f.y)*h,o=(e.min.y-f.y)*h),n>o||r>i||((r>n||isNaN(n))&&(n=r),(o<i||isNaN(i))&&(i=o),u>=0?(a=(e.min.z-f.z)*u,l=(e.max.z-f.z)*u):(a=(e.max.z-f.z)*u,l=(e.min.z-f.z)*u),n>l||a>i)||((a>n||n!==n)&&(n=a),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,ii)!==null}intersectTriangle(e,t,n,i,r){uc.subVectors(t,e),Co.subVectors(n,e),fc.crossVectors(uc,Co);let o=this.direction.dot(fc),a;if(o>0){if(i)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Ei.subVectors(this.origin,e);const l=a*this.direction.dot(Co.crossVectors(Ei,Co));if(l<0)return null;const c=a*this.direction.dot(uc.cross(Ei));if(c<0||l+c>o)return null;const h=-a*Ei.dot(fc);return h<0?null:this.at(h/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Ye{constructor(e,t,n,i,r,o,a,l,c,h,u,f,d,p,_,g){Ye.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,o,a,l,c,h,u,f,d,p,_,g)}set(e,t,n,i,r,o,a,l,c,h,u,f,d,p,_,g){const m=this.elements;return m[0]=e,m[4]=t,m[8]=n,m[12]=i,m[1]=r,m[5]=o,m[9]=a,m[13]=l,m[2]=c,m[6]=h,m[10]=u,m[14]=f,m[3]=d,m[7]=p,m[11]=_,m[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ye().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,i=1/Cr.setFromMatrixColumn(e,0).length(),r=1/Cr.setFromMatrixColumn(e,1).length(),o=1/Cr.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){const f=o*h,d=o*u,p=a*h,_=a*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=d+p*c,t[5]=f-_*c,t[9]=-a*l,t[2]=_-f*c,t[6]=p+d*c,t[10]=o*l}else if(e.order==="YXZ"){const f=l*h,d=l*u,p=c*h,_=c*u;t[0]=f+_*a,t[4]=p*a-d,t[8]=o*c,t[1]=o*u,t[5]=o*h,t[9]=-a,t[2]=d*a-p,t[6]=_+f*a,t[10]=o*l}else if(e.order==="ZXY"){const f=l*h,d=l*u,p=c*h,_=c*u;t[0]=f-_*a,t[4]=-o*u,t[8]=p+d*a,t[1]=d+p*a,t[5]=o*h,t[9]=_-f*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){const f=o*h,d=o*u,p=a*h,_=a*u;t[0]=l*h,t[4]=p*c-d,t[8]=f*c+_,t[1]=l*u,t[5]=_*c+f,t[9]=d*c-p,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){const f=o*l,d=o*c,p=a*l,_=a*c;t[0]=l*h,t[4]=_-f*u,t[8]=p*u+d,t[1]=u,t[5]=o*h,t[9]=-a*h,t[2]=-c*h,t[6]=d*u+p,t[10]=f-_*u}else if(e.order==="XZY"){const f=o*l,d=o*c,p=a*l,_=a*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=f*u+_,t[5]=o*h,t[9]=d*u-p,t[2]=p*u-d,t[6]=a*h,t[10]=_*u+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose($g,e,e0)}lookAt(e,t,n){const i=this.elements;return vn.subVectors(e,t),vn.lengthSq()===0&&(vn.z=1),vn.normalize(),Ti.crossVectors(n,vn),Ti.lengthSq()===0&&(Math.abs(n.z)===1?vn.x+=1e-4:vn.z+=1e-4,vn.normalize(),Ti.crossVectors(n,vn)),Ti.normalize(),Ro.crossVectors(vn,Ti),i[0]=Ti.x,i[4]=Ro.x,i[8]=vn.x,i[1]=Ti.y,i[5]=Ro.y,i[9]=vn.y,i[2]=Ti.z,i[6]=Ro.z,i[10]=vn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],u=n[5],f=n[9],d=n[13],p=n[2],_=n[6],g=n[10],m=n[14],x=n[3],y=n[7],v=n[11],A=n[15],w=i[0],T=i[4],C=i[8],b=i[12],M=i[1],U=i[5],L=i[9],F=i[13],N=i[2],Q=i[6],V=i[10],le=i[14],Z=i[3],te=i[7],K=i[11],O=i[15];return r[0]=o*w+a*M+l*N+c*Z,r[4]=o*T+a*U+l*Q+c*te,r[8]=o*C+a*L+l*V+c*K,r[12]=o*b+a*F+l*le+c*O,r[1]=h*w+u*M+f*N+d*Z,r[5]=h*T+u*U+f*Q+d*te,r[9]=h*C+u*L+f*V+d*K,r[13]=h*b+u*F+f*le+d*O,r[2]=p*w+_*M+g*N+m*Z,r[6]=p*T+_*U+g*Q+m*te,r[10]=p*C+_*L+g*V+m*K,r[14]=p*b+_*F+g*le+m*O,r[3]=x*w+y*M+v*N+A*Z,r[7]=x*T+y*U+v*Q+A*te,r[11]=x*C+y*L+v*V+A*K,r[15]=x*b+y*F+v*le+A*O,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],r=e[12],o=e[1],a=e[5],l=e[9],c=e[13],h=e[2],u=e[6],f=e[10],d=e[14],p=e[3],_=e[7],g=e[11],m=e[15];return p*(+r*l*u-i*c*u-r*a*f+n*c*f+i*a*d-n*l*d)+_*(+t*l*d-t*c*f+r*o*f-i*o*d+i*c*h-r*l*h)+g*(+t*c*u-t*a*d-r*o*u+n*o*d+r*a*h-n*c*h)+m*(-i*a*h-t*l*u+t*a*f+i*o*u-n*o*f+n*l*h)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=e[9],f=e[10],d=e[11],p=e[12],_=e[13],g=e[14],m=e[15],x=u*g*c-_*f*c+_*l*d-a*g*d-u*l*m+a*f*m,y=p*f*c-h*g*c-p*l*d+o*g*d+h*l*m-o*f*m,v=h*_*c-p*u*c+p*a*d-o*_*d-h*a*m+o*u*m,A=p*u*l-h*_*l-p*a*f+o*_*f+h*a*g-o*u*g,w=t*x+n*y+i*v+r*A;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const T=1/w;return e[0]=x*T,e[1]=(_*f*r-u*g*r-_*i*d+n*g*d+u*i*m-n*f*m)*T,e[2]=(a*g*r-_*l*r+_*i*c-n*g*c-a*i*m+n*l*m)*T,e[3]=(u*l*r-a*f*r-u*i*c+n*f*c+a*i*d-n*l*d)*T,e[4]=y*T,e[5]=(h*g*r-p*f*r+p*i*d-t*g*d-h*i*m+t*f*m)*T,e[6]=(p*l*r-o*g*r-p*i*c+t*g*c+o*i*m-t*l*m)*T,e[7]=(o*f*r-h*l*r+h*i*c-t*f*c-o*i*d+t*l*d)*T,e[8]=v*T,e[9]=(p*u*r-h*_*r-p*n*d+t*_*d+h*n*m-t*u*m)*T,e[10]=(o*_*r-p*a*r+p*n*c-t*_*c-o*n*m+t*a*m)*T,e[11]=(h*a*r-o*u*r-h*n*c+t*u*c+o*n*d-t*a*d)*T,e[12]=A*T,e[13]=(h*_*i-p*u*i+p*n*f-t*_*f-h*n*g+t*u*g)*T,e[14]=(p*a*i-o*_*i-p*n*l+t*_*l+o*n*g-t*a*g)*T,e[15]=(o*u*i-h*a*i+h*n*l-t*u*l-o*n*f+t*a*f)*T,this}scale(e){const t=this.elements,n=e.x,i=e.y,r=e.z;return t[0]*=n,t[4]*=i,t[8]*=r,t[1]*=n,t[5]*=i,t[9]*=r,t[2]*=n,t[6]*=i,t[10]*=r,t[3]*=n,t[7]*=i,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),r=1-n,o=e.x,a=e.y,l=e.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-i*l,c*l+i*a,0,c*a+i*l,h*a+n,h*l-i*o,0,c*l-i*a,h*l+i*o,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,r,o){return this.set(1,n,r,0,e,1,o,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,r=t._x,o=t._y,a=t._z,l=t._w,c=r+r,h=o+o,u=a+a,f=r*c,d=r*h,p=r*u,_=o*h,g=o*u,m=a*u,x=l*c,y=l*h,v=l*u,A=n.x,w=n.y,T=n.z;return i[0]=(1-(_+m))*A,i[1]=(d+v)*A,i[2]=(p-y)*A,i[3]=0,i[4]=(d-v)*w,i[5]=(1-(f+m))*w,i[6]=(g+x)*w,i[7]=0,i[8]=(p+y)*T,i[9]=(g-x)*T,i[10]=(1-(f+_))*T,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;let r=Cr.set(i[0],i[1],i[2]).length();const o=Cr.set(i[4],i[5],i[6]).length(),a=Cr.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),e.x=i[12],e.y=i[13],e.z=i[14],Fn.copy(this);const c=1/r,h=1/o,u=1/a;return Fn.elements[0]*=c,Fn.elements[1]*=c,Fn.elements[2]*=c,Fn.elements[4]*=h,Fn.elements[5]*=h,Fn.elements[6]*=h,Fn.elements[8]*=u,Fn.elements[9]*=u,Fn.elements[10]*=u,t.setFromRotationMatrix(Fn),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,i,r,o,a=jn){const l=this.elements,c=2*r/(t-e),h=2*r/(n-i),u=(t+e)/(t-e),f=(n+i)/(n-i);let d,p;if(a===jn)d=-(o+r)/(o-r),p=-2*o*r/(o-r);else if(a===Ks)d=-o/(o-r),p=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=d,l[14]=p,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,i,r,o,a=jn){const l=this.elements,c=1/(t-e),h=1/(n-i),u=1/(o-r),f=(t+e)*c,d=(n+i)*h;let p,_;if(a===jn)p=(o+r)*u,_=-2*u;else if(a===Ks)p=r*u,_=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-f,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-d,l[2]=0,l[6]=0,l[10]=_,l[14]=-p,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const Cr=new I,Fn=new Ye,$g=new I(0,0,0),e0=new I(1,1,1),Ti=new I,Ro=new I,vn=new I,Pu=new Ye,Iu=new Ot;class wn{constructor(e=0,t=0,n=0,i=wn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,r=i[0],o=i[4],a=i[8],l=i[1],c=i[5],h=i[9],u=i[2],f=i[6],d=i[10];switch(t){case"XYZ":this._y=Math.asin(Qe(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Qe(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Qe(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Qe(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Qe(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-Qe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Pu.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Pu,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Iu.setFromEuler(this),this.setFromQuaternion(Iu,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}wn.DEFAULT_ORDER="XYZ";class Ml{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let t0=0;const Lu=new I,Rr=new Ot,ri=new Ye,Po=new I,_s=new I,n0=new I,i0=new Ot,Uu=new I(1,0,0),Du=new I(0,1,0),Fu=new I(0,0,1),Nu={type:"added"},r0={type:"removed"},Pr={type:"childadded",child:null},dc={type:"childremoved",child:null};class ut extends $n{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:t0++}),this.uuid=bn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ut.DEFAULT_UP.clone();const e=new I,t=new wn,n=new Ot,i=new I(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Ye},normalMatrix:{value:new Je}}),this.matrix=new Ye,this.matrixWorld=new Ye,this.matrixAutoUpdate=ut.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ut.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ml,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Rr.setFromAxisAngle(e,t),this.quaternion.multiply(Rr),this}rotateOnWorldAxis(e,t){return Rr.setFromAxisAngle(e,t),this.quaternion.premultiply(Rr),this}rotateX(e){return this.rotateOnAxis(Uu,e)}rotateY(e){return this.rotateOnAxis(Du,e)}rotateZ(e){return this.rotateOnAxis(Fu,e)}translateOnAxis(e,t){return Lu.copy(e).applyQuaternion(this.quaternion),this.position.add(Lu.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Uu,e)}translateY(e){return this.translateOnAxis(Du,e)}translateZ(e){return this.translateOnAxis(Fu,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(ri.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Po.copy(e):Po.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),_s.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ri.lookAt(_s,Po,this.up):ri.lookAt(Po,_s,this.up),this.quaternion.setFromRotationMatrix(ri),i&&(ri.extractRotation(i.matrixWorld),Rr.setFromRotationMatrix(ri),this.quaternion.premultiply(Rr.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Nu),Pr.child=e,this.dispatchEvent(Pr),Pr.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(r0),dc.child=e,this.dispatchEvent(dc),dc.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),ri.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),ri.multiply(e.parent.matrixWorld)),e.applyMatrix4(ri),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Nu),Pr.child=e,this.dispatchEvent(Pr),Pr.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(_s,e,n0),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(_s,i0,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(e.materials,this.material[l]));i.material=a}else i.material=r(e.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];i.animations.push(r(e.animations,l))}}if(t){const a=o(e.geometries),l=o(e.materials),c=o(e.textures),h=o(e.images),u=o(e.shapes),f=o(e.skeletons),d=o(e.animations),p=o(e.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),d.length>0&&(n.animations=d),p.length>0&&(n.nodes=p)}return n.object=i,n;function o(a){const l=[];for(const c in a){const h=a[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}}ut.DEFAULT_UP=new I(0,1,0);ut.DEFAULT_MATRIX_AUTO_UPDATE=!0;ut.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Nn=new I,si=new I,pc=new I,oi=new I,Ir=new I,Lr=new I,Ou=new I,mc=new I,gc=new I,_c=new I,vc=new tt,yc=new tt,xc=new tt;class dn{constructor(e=new I,t=new I,n=new I){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),Nn.subVectors(e,t),i.cross(Nn);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(e,t,n,i,r){Nn.subVectors(i,t),si.subVectors(n,t),pc.subVectors(e,t);const o=Nn.dot(Nn),a=Nn.dot(si),l=Nn.dot(pc),c=si.dot(si),h=si.dot(pc),u=o*c-a*a;if(u===0)return r.set(0,0,0),null;const f=1/u,d=(c*l-a*h)*f,p=(o*h-a*l)*f;return r.set(1-d-p,p,d)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,oi)===null?!1:oi.x>=0&&oi.y>=0&&oi.x+oi.y<=1}static getInterpolation(e,t,n,i,r,o,a,l){return this.getBarycoord(e,t,n,i,oi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,oi.x),l.addScaledVector(o,oi.y),l.addScaledVector(a,oi.z),l)}static getInterpolatedAttribute(e,t,n,i,r,o){return vc.setScalar(0),yc.setScalar(0),xc.setScalar(0),vc.fromBufferAttribute(e,t),yc.fromBufferAttribute(e,n),xc.fromBufferAttribute(e,i),o.setScalar(0),o.addScaledVector(vc,r.x),o.addScaledVector(yc,r.y),o.addScaledVector(xc,r.z),o}static isFrontFacing(e,t,n,i){return Nn.subVectors(n,t),si.subVectors(e,t),Nn.cross(si).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Nn.subVectors(this.c,this.b),si.subVectors(this.a,this.b),Nn.cross(si).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return dn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return dn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,r){return dn.getInterpolation(e,this.a,this.b,this.c,t,n,i,r)}containsPoint(e){return dn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return dn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,r=this.c;let o,a;Ir.subVectors(i,n),Lr.subVectors(r,n),mc.subVectors(e,n);const l=Ir.dot(mc),c=Lr.dot(mc);if(l<=0&&c<=0)return t.copy(n);gc.subVectors(e,i);const h=Ir.dot(gc),u=Lr.dot(gc);if(h>=0&&u<=h)return t.copy(i);const f=l*u-h*c;if(f<=0&&l>=0&&h<=0)return o=l/(l-h),t.copy(n).addScaledVector(Ir,o);_c.subVectors(e,r);const d=Ir.dot(_c),p=Lr.dot(_c);if(p>=0&&d<=p)return t.copy(r);const _=d*c-l*p;if(_<=0&&c>=0&&p<=0)return a=c/(c-p),t.copy(n).addScaledVector(Lr,a);const g=h*p-d*u;if(g<=0&&u-h>=0&&d-p>=0)return Ou.subVectors(r,i),a=(u-h)/(u-h+(d-p)),t.copy(i).addScaledVector(Ou,a);const m=1/(g+_+f);return o=_*m,a=f*m,t.copy(n).addScaledVector(Ir,o).addScaledVector(Lr,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const yp={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ai={h:0,s:0,l:0},Io={h:0,s:0,l:0};function Mc(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}class Fe{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=$t){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,at.toWorkingColorSpace(this,t),this}setRGB(e,t,n,i=at.workingColorSpace){return this.r=e,this.g=t,this.b=n,at.toWorkingColorSpace(this,i),this}setHSL(e,t,n,i=at.workingColorSpace){if(e=Fh(e,1),t=Qe(t,0,1),n=Qe(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=Mc(o,r,e+1/3),this.g=Mc(o,r,e),this.b=Mc(o,r,e-1/3)}return at.toWorkingColorSpace(this,i),this}setStyle(e,t=$t){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=i[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=$t){const n=yp[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=di(e.r),this.g=di(e.g),this.b=di(e.b),this}copyLinearToSRGB(e){return this.r=jr(e.r),this.g=jr(e.g),this.b=jr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=$t){return at.fromWorkingColorSpace(Zt.copy(this),e),Math.round(Qe(Zt.r*255,0,255))*65536+Math.round(Qe(Zt.g*255,0,255))*256+Math.round(Qe(Zt.b*255,0,255))}getHexString(e=$t){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=at.workingColorSpace){at.fromWorkingColorSpace(Zt.copy(this),t);const n=Zt.r,i=Zt.g,r=Zt.b,o=Math.max(n,i,r),a=Math.min(n,i,r);let l,c;const h=(a+o)/2;if(a===o)l=0,c=0;else{const u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case n:l=(i-r)/u+(i<r?6:0);break;case i:l=(r-n)/u+2;break;case r:l=(n-i)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=at.workingColorSpace){return at.fromWorkingColorSpace(Zt.copy(this),t),e.r=Zt.r,e.g=Zt.g,e.b=Zt.b,e}getStyle(e=$t){at.fromWorkingColorSpace(Zt.copy(this),e);const t=Zt.r,n=Zt.g,i=Zt.b;return e!==$t?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(Ai),this.setHSL(Ai.h+e,Ai.s+t,Ai.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Ai),e.getHSL(Io);const n=Os(Ai.h,Io.h,t),i=Os(Ai.s,Io.s,t),r=Os(Ai.l,Io.l,t);return this.setHSL(n,i,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*i,this.g=r[1]*t+r[4]*n+r[7]*i,this.b=r[2]*t+r[5]*n+r[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Zt=new Fe;Fe.NAMES=yp;let s0=0;class Kt extends $n{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:s0++}),this.uuid=bn(),this.name="",this.type="Material",this.blending=rr,this.side=pi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ta,this.blendDst=Aa,this.blendEquation=Pi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Fe(0,0,0),this.blendAlpha=0,this.depthFunc=ur,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=sh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ji,this.stencilZFail=Ji,this.stencilZPass=Ji,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==rr&&(n.blending=this.blending),this.side!==pi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ta&&(n.blendSrc=this.blendSrc),this.blendDst!==Aa&&(n.blendDst=this.blendDst),this.blendEquation!==Pi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==ur&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==sh&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ji&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Ji&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Ji&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const o=[];for(const a in r){const l=r[a];delete l.metadata,o.push(l)}return o}if(t){const r=i(e.textures),o=i(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class vi extends Kt{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Fe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new wn,this.combine=co,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const ci=o0();function o0(){const s=new ArrayBuffer(4),e=new Float32Array(s),t=new Uint32Array(s),n=new Uint32Array(512),i=new Uint32Array(512);for(let l=0;l<256;++l){const c=l-127;c<-27?(n[l]=0,n[l|256]=32768,i[l]=24,i[l|256]=24):c<-14?(n[l]=1024>>-c-14,n[l|256]=1024>>-c-14|32768,i[l]=-c-1,i[l|256]=-c-1):c<=15?(n[l]=c+15<<10,n[l|256]=c+15<<10|32768,i[l]=13,i[l|256]=13):c<128?(n[l]=31744,n[l|256]=64512,i[l]=24,i[l|256]=24):(n[l]=31744,n[l|256]=64512,i[l]=13,i[l|256]=13)}const r=new Uint32Array(2048),o=new Uint32Array(64),a=new Uint32Array(64);for(let l=1;l<1024;++l){let c=l<<13,h=0;for(;(c&8388608)===0;)c<<=1,h-=8388608;c&=-8388609,h+=947912704,r[l]=c|h}for(let l=1024;l<2048;++l)r[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)o[l]=l<<23;o[31]=1199570944,o[32]=2147483648;for(let l=33;l<63;++l)o[l]=2147483648+(l-32<<23);o[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(a[l]=1024);return{floatView:e,uint32View:t,baseTable:n,shiftTable:i,mantissaTable:r,exponentTable:o,offsetTable:a}}function fn(s){Math.abs(s)>65504&&console.warn("THREE.DataUtils.toHalfFloat(): Value out of range."),s=Qe(s,-65504,65504),ci.floatView[0]=s;const e=ci.uint32View[0],t=e>>23&511;return ci.baseTable[t]+((e&8388607)>>ci.shiftTable[t])}function Cs(s){const e=s>>10;return ci.uint32View[0]=ci.mantissaTable[ci.offsetTable[e]+(s&1023)]+ci.exponentTable[e],ci.floatView[0]}const a0={toHalfFloat:fn,fromHalfFloat:Cs},Ct=new I,Lo=new Me;class mt{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=js,this.updateRanges=[],this.gpuType=pn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Lo.fromBufferAttribute(this,t),Lo.applyMatrix3(e),this.setXY(t,Lo.x,Lo.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Ct.fromBufferAttribute(this,t),Ct.applyMatrix3(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Ct.fromBufferAttribute(this,t),Ct.applyMatrix4(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ct.fromBufferAttribute(this,t),Ct.applyNormalMatrix(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ct.fromBufferAttribute(this,t),Ct.transformDirection(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=en(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=et(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=en(t,this.array)),t}setX(e,t){return this.normalized&&(t=et(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=en(t,this.array)),t}setY(e,t){return this.normalized&&(t=et(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=en(t,this.array)),t}setZ(e,t){return this.normalized&&(t=et(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=en(t,this.array)),t}setW(e,t){return this.normalized&&(t=et(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=et(t,this.array),n=et(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=et(t,this.array),n=et(n,this.array),i=et(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e*=this.itemSize,this.normalized&&(t=et(t,this.array),n=et(n,this.array),i=et(i,this.array),r=et(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==js&&(e.usage=this.usage),e}}class l0 extends mt{constructor(e,t,n){super(new Int8Array(e),t,n)}}class c0 extends mt{constructor(e,t,n){super(new Uint8Array(e),t,n)}}class h0 extends mt{constructor(e,t,n){super(new Uint8ClampedArray(e),t,n)}}class u0 extends mt{constructor(e,t,n){super(new Int16Array(e),t,n)}}class Bh extends mt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class f0 extends mt{constructor(e,t,n){super(new Int32Array(e),t,n)}}class kh extends mt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class d0 extends mt{constructor(e,t,n){super(new Uint16Array(e),t,n),this.isFloat16BufferAttribute=!0}getX(e){let t=Cs(this.array[e*this.itemSize]);return this.normalized&&(t=en(t,this.array)),t}setX(e,t){return this.normalized&&(t=et(t,this.array)),this.array[e*this.itemSize]=fn(t),this}getY(e){let t=Cs(this.array[e*this.itemSize+1]);return this.normalized&&(t=en(t,this.array)),t}setY(e,t){return this.normalized&&(t=et(t,this.array)),this.array[e*this.itemSize+1]=fn(t),this}getZ(e){let t=Cs(this.array[e*this.itemSize+2]);return this.normalized&&(t=en(t,this.array)),t}setZ(e,t){return this.normalized&&(t=et(t,this.array)),this.array[e*this.itemSize+2]=fn(t),this}getW(e){let t=Cs(this.array[e*this.itemSize+3]);return this.normalized&&(t=en(t,this.array)),t}setW(e,t){return this.normalized&&(t=et(t,this.array)),this.array[e*this.itemSize+3]=fn(t),this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=et(t,this.array),n=et(n,this.array)),this.array[e+0]=fn(t),this.array[e+1]=fn(n),this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=et(t,this.array),n=et(n,this.array),i=et(i,this.array)),this.array[e+0]=fn(t),this.array[e+1]=fn(n),this.array[e+2]=fn(i),this}setXYZW(e,t,n,i,r){return e*=this.itemSize,this.normalized&&(t=et(t,this.array),n=et(n,this.array),i=et(i,this.array),r=et(r,this.array)),this.array[e+0]=fn(t),this.array[e+1]=fn(n),this.array[e+2]=fn(i),this.array[e+3]=fn(r),this}}class Ge extends mt{constructor(e,t,n){super(new Float32Array(e),t,n)}}let p0=0;const An=new Ye,Sc=new ut,Ur=new I,yn=new wt,vs=new wt,Nt=new I;class nt extends $n{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:p0++}),this.uuid=bn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(mp(e)?kh:Bh)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Je().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return An.makeRotationFromQuaternion(e),this.applyMatrix4(An),this}rotateX(e){return An.makeRotationX(e),this.applyMatrix4(An),this}rotateY(e){return An.makeRotationY(e),this.applyMatrix4(An),this}rotateZ(e){return An.makeRotationZ(e),this.applyMatrix4(An),this}translate(e,t,n){return An.makeTranslation(e,t,n),this.applyMatrix4(An),this}scale(e,t,n){return An.makeScale(e,t,n),this.applyMatrix4(An),this}lookAt(e){return Sc.lookAt(e),Sc.updateMatrix(),this.applyMatrix4(Sc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ur).negate(),this.translate(Ur.x,Ur.y,Ur.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let i=0,r=e.length;i<r;i++){const o=e[i];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Ge(n,3))}else{const n=Math.min(e.length,t.count);for(let i=0;i<n;i++){const r=e[i];t.setXYZ(i,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new wt);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new I(-1/0,-1/0,-1/0),new I(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const r=t[n];yn.setFromBufferAttribute(r),this.morphTargetsRelative?(Nt.addVectors(this.boundingBox.min,yn.min),this.boundingBox.expandByPoint(Nt),Nt.addVectors(this.boundingBox.max,yn.max),this.boundingBox.expandByPoint(Nt)):(this.boundingBox.expandByPoint(yn.min),this.boundingBox.expandByPoint(yn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new It);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new I,1/0);return}if(e){const n=this.boundingSphere.center;if(yn.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){const a=t[r];vs.setFromBufferAttribute(a),this.morphTargetsRelative?(Nt.addVectors(yn.min,vs.min),yn.expandByPoint(Nt),Nt.addVectors(yn.max,vs.max),yn.expandByPoint(Nt)):(yn.expandByPoint(vs.min),yn.expandByPoint(vs.max))}yn.getCenter(n);let i=0;for(let r=0,o=e.count;r<o;r++)Nt.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(Nt));if(t)for(let r=0,o=t.length;r<o;r++){const a=t[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)Nt.fromBufferAttribute(a,c),l&&(Ur.fromBufferAttribute(e,c),Nt.add(Ur)),i=Math.max(i,n.distanceToSquared(Nt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,i=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new mt(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let C=0;C<n.count;C++)a[C]=new I,l[C]=new I;const c=new I,h=new I,u=new I,f=new Me,d=new Me,p=new Me,_=new I,g=new I;function m(C,b,M){c.fromBufferAttribute(n,C),h.fromBufferAttribute(n,b),u.fromBufferAttribute(n,M),f.fromBufferAttribute(r,C),d.fromBufferAttribute(r,b),p.fromBufferAttribute(r,M),h.sub(c),u.sub(c),d.sub(f),p.sub(f);const U=1/(d.x*p.y-p.x*d.y);isFinite(U)&&(_.copy(h).multiplyScalar(p.y).addScaledVector(u,-d.y).multiplyScalar(U),g.copy(u).multiplyScalar(d.x).addScaledVector(h,-p.x).multiplyScalar(U),a[C].add(_),a[b].add(_),a[M].add(_),l[C].add(g),l[b].add(g),l[M].add(g))}let x=this.groups;x.length===0&&(x=[{start:0,count:e.count}]);for(let C=0,b=x.length;C<b;++C){const M=x[C],U=M.start,L=M.count;for(let F=U,N=U+L;F<N;F+=3)m(e.getX(F+0),e.getX(F+1),e.getX(F+2))}const y=new I,v=new I,A=new I,w=new I;function T(C){A.fromBufferAttribute(i,C),w.copy(A);const b=a[C];y.copy(b),y.sub(A.multiplyScalar(A.dot(b))).normalize(),v.crossVectors(w,b);const U=v.dot(l[C])<0?-1:1;o.setXYZW(C,y.x,y.y,y.z,U)}for(let C=0,b=x.length;C<b;++C){const M=x[C],U=M.start,L=M.count;for(let F=U,N=U+L;F<N;F+=3)T(e.getX(F+0)),T(e.getX(F+1)),T(e.getX(F+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new mt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,d=n.count;f<d;f++)n.setXYZ(f,0,0,0);const i=new I,r=new I,o=new I,a=new I,l=new I,c=new I,h=new I,u=new I;if(e)for(let f=0,d=e.count;f<d;f+=3){const p=e.getX(f+0),_=e.getX(f+1),g=e.getX(f+2);i.fromBufferAttribute(t,p),r.fromBufferAttribute(t,_),o.fromBufferAttribute(t,g),h.subVectors(o,r),u.subVectors(i,r),h.cross(u),a.fromBufferAttribute(n,p),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,g),a.add(h),l.add(h),c.add(h),n.setXYZ(p,a.x,a.y,a.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let f=0,d=t.count;f<d;f+=3)i.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),o.fromBufferAttribute(t,f+2),h.subVectors(o,r),u.subVectors(i,r),h.cross(u),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Nt.fromBufferAttribute(e,t),Nt.normalize(),e.setXYZ(t,Nt.x,Nt.y,Nt.z)}toNonIndexed(){function e(a,l){const c=a.array,h=a.itemSize,u=a.normalized,f=new c.constructor(l.length*h);let d=0,p=0;for(let _=0,g=l.length;_<g;_++){a.isInterleavedBufferAttribute?d=l[_]*a.data.stride+a.offset:d=l[_]*h;for(let m=0;m<h;m++)f[p++]=c[d++]}return new mt(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new nt,n=this.index.array,i=this.attributes;for(const a in i){const l=i[a],c=e(l,n);t.setAttribute(a,c)}const r=this.morphAttributes;for(const a in r){const l=[],c=r[a];for(let h=0,u=c.length;h<u;h++){const f=c[h],d=e(f,n);l.push(d)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const i={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,f=c.length;u<f;u++){const d=c[u];h.push(d.toJSON(e.data))}h.length>0&&(i[l]=h,r=!0)}r&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const i=e.attributes;for(const c in i){const h=i[c];this.setAttribute(c,h.clone(t))}const r=e.morphAttributes;for(const c in r){const h=[],u=r[c];for(let f=0,d=u.length;f<d;f++)h.push(u[f].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let c=0,h=o.length;c<h;c++){const u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Bu=new Ye,ki=new Di,Uo=new It,ku=new I,Do=new I,Fo=new I,No=new I,bc=new I,Oo=new I,zu=new I,Bo=new I;class vt extends ut{constructor(e=new nt,t=new vi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const a=this.morphTargetInfluences;if(r&&a){Oo.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=a[l],u=r[l];h!==0&&(bc.fromBufferAttribute(u,e),o?Oo.addScaledVector(bc,h):Oo.addScaledVector(bc.sub(t),h))}t.add(Oo)}return t}raycast(e,t){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Uo.copy(n.boundingSphere),Uo.applyMatrix4(r),ki.copy(e.ray).recast(e.near),!(Uo.containsPoint(ki.origin)===!1&&(ki.intersectSphere(Uo,ku)===null||ki.origin.distanceToSquared(ku)>(e.far-e.near)**2))&&(Bu.copy(r).invert(),ki.copy(e.ray).applyMatrix4(Bu),!(n.boundingBox!==null&&ki.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,ki)))}_computeIntersections(e,t,n){let i;const r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,f=r.groups,d=r.drawRange;if(a!==null)if(Array.isArray(o))for(let p=0,_=f.length;p<_;p++){const g=f[p],m=o[g.materialIndex],x=Math.max(g.start,d.start),y=Math.min(a.count,Math.min(g.start+g.count,d.start+d.count));for(let v=x,A=y;v<A;v+=3){const w=a.getX(v),T=a.getX(v+1),C=a.getX(v+2);i=ko(this,m,e,n,c,h,u,w,T,C),i&&(i.faceIndex=Math.floor(v/3),i.face.materialIndex=g.materialIndex,t.push(i))}}else{const p=Math.max(0,d.start),_=Math.min(a.count,d.start+d.count);for(let g=p,m=_;g<m;g+=3){const x=a.getX(g),y=a.getX(g+1),v=a.getX(g+2);i=ko(this,o,e,n,c,h,u,x,y,v),i&&(i.faceIndex=Math.floor(g/3),t.push(i))}}else if(l!==void 0)if(Array.isArray(o))for(let p=0,_=f.length;p<_;p++){const g=f[p],m=o[g.materialIndex],x=Math.max(g.start,d.start),y=Math.min(l.count,Math.min(g.start+g.count,d.start+d.count));for(let v=x,A=y;v<A;v+=3){const w=v,T=v+1,C=v+2;i=ko(this,m,e,n,c,h,u,w,T,C),i&&(i.faceIndex=Math.floor(v/3),i.face.materialIndex=g.materialIndex,t.push(i))}}else{const p=Math.max(0,d.start),_=Math.min(l.count,d.start+d.count);for(let g=p,m=_;g<m;g+=3){const x=g,y=g+1,v=g+2;i=ko(this,o,e,n,c,h,u,x,y,v),i&&(i.faceIndex=Math.floor(g/3),t.push(i))}}}}function m0(s,e,t,n,i,r,o,a){let l;if(e.side===nn?l=n.intersectTriangle(o,r,i,!0,a):l=n.intersectTriangle(i,r,o,e.side===pi,a),l===null)return null;Bo.copy(a),Bo.applyMatrix4(s.matrixWorld);const c=t.ray.origin.distanceTo(Bo);return c<t.near||c>t.far?null:{distance:c,point:Bo.clone(),object:s}}function ko(s,e,t,n,i,r,o,a,l,c){s.getVertexPosition(a,Do),s.getVertexPosition(l,Fo),s.getVertexPosition(c,No);const h=m0(s,e,t,n,Do,Fo,No,zu);if(h){const u=new I;dn.getBarycoord(zu,Do,Fo,No,u),i&&(h.uv=dn.getInterpolatedAttribute(i,a,l,c,u,new Me)),r&&(h.uv1=dn.getInterpolatedAttribute(r,a,l,c,u,new Me)),o&&(h.normal=dn.getInterpolatedAttribute(o,a,l,c,u,new I),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const f={a,b:l,c,normal:new I,materialIndex:0};dn.getNormal(Do,Fo,No,f.normal),h.face=f,h.barycoord=u}return h}class _r extends nt{constructor(e=1,t=1,n=1,i=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:r,depthSegments:o};const a=this;i=Math.floor(i),r=Math.floor(r),o=Math.floor(o);const l=[],c=[],h=[],u=[];let f=0,d=0;p("z","y","x",-1,-1,n,t,e,o,r,0),p("z","y","x",1,-1,n,t,-e,o,r,1),p("x","z","y",1,1,e,n,t,i,o,2),p("x","z","y",1,-1,e,n,-t,i,o,3),p("x","y","z",1,-1,e,t,n,i,r,4),p("x","y","z",-1,-1,e,t,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new Ge(c,3)),this.setAttribute("normal",new Ge(h,3)),this.setAttribute("uv",new Ge(u,2));function p(_,g,m,x,y,v,A,w,T,C,b){const M=v/T,U=A/C,L=v/2,F=A/2,N=w/2,Q=T+1,V=C+1;let le=0,Z=0;const te=new I;for(let K=0;K<V;K++){const O=K*U-F;for(let J=0;J<Q;J++){const ue=J*M-L;te[_]=ue*x,te[g]=O*y,te[m]=N,c.push(te.x,te.y,te.z),te[_]=0,te[g]=0,te[m]=w>0?1:-1,h.push(te.x,te.y,te.z),u.push(J/T),u.push(1-K/C),le+=1}}for(let K=0;K<C;K++)for(let O=0;O<T;O++){const J=f+O+Q*K,ue=f+O+Q*(K+1),k=f+(O+1)+Q*(K+1),X=f+(O+1)+Q*K;l.push(J,ue,X),l.push(ue,k,X),Z+=6}a.addGroup(d,Z,b),d+=Z,f+=le}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new _r(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function $r(s){const e={};for(const t in s){e[t]={};for(const n in s[t]){const i=s[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function Qt(s){const e={};for(let t=0;t<s.length;t++){const n=$r(s[t]);for(const i in n)e[i]=n[i]}return e}function g0(s){const e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function xp(s){const e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:at.workingColorSpace}const Qs={clone:$r,merge:Qt};var _0=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,v0=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Pn extends Kt{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=_0,this.fragmentShader=v0,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=$r(e.uniforms),this.uniformsGroups=g0(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const o=this.uniforms[i].value;o&&o.isTexture?t.uniforms[i]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[i]={type:"m4",value:o.toArray()}:t.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class uo extends ut{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ye,this.projectionMatrix=new Ye,this.projectionMatrixInverse=new Ye,this.coordinateSystem=jn}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Ci=new I,Vu=new Me,Gu=new Me;class Rt extends uo{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Qr*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(or*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Qr*2*Math.atan(Math.tan(or*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Ci.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Ci.x,Ci.y).multiplyScalar(-e/Ci.z),Ci.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Ci.x,Ci.y).multiplyScalar(-e/Ci.z)}getViewSize(e,t){return this.getViewBounds(e,Vu,Gu),t.subVectors(Gu,Vu)}setViewOffset(e,t,n,i,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(or*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,r=-.5*i;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*i/l,t-=o.offsetY*n/c,i*=o.width/l,n*=o.height/c}const a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Dr=-90,Fr=1;class Mp extends ut{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new Rt(Dr,Fr,e,t);i.layers=this.layers,this.add(i);const r=new Rt(Dr,Fr,e,t);r.layers=this.layers,this.add(r);const o=new Rt(Dr,Fr,e,t);o.layers=this.layers,this.add(o);const a=new Rt(Dr,Fr,e,t);a.layers=this.layers,this.add(a);const l=new Rt(Dr,Fr,e,t);l.layers=this.layers,this.add(l);const c=new Rt(Dr,Fr,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,r,o,a,l]=t;for(const c of t)this.remove(c);if(e===jn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Ks)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,l,c,h]=this.children,u=e.getRenderTarget(),f=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,i),e.render(t,r),e.setRenderTarget(n,1,i),e.render(t,o),e.setRenderTarget(n,2,i),e.render(t,a),e.setRenderTarget(n,3,i),e.render(t,l),e.setRenderTarget(n,4,i),e.render(t,c),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,i),e.render(t,h),e.setRenderTarget(u,f,d),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}}class fo extends Mt{constructor(e,t,n,i,r,o,a,l,c,h){e=e!==void 0?e:[],t=t!==void 0?t:mi,super(e,t,n,i,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Sp extends Bn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new fo(i,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:At}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new _r(5,5,5),r=new Pn({name:"CubemapFromEquirect",uniforms:$r(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:nn,blending:ui});r.uniforms.tEquirect.value=t;const o=new vt(i,r),a=t.minFilter;return t.minFilter===Zn&&(t.minFilter=At),new Mp(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,n,i){const r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,i);e.setRenderTarget(r)}}class Sl{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new Fe(e),this.density=t}clone(){return new Sl(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class bl{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new Fe(e),this.near=t,this.far=n}clone(){return new bl(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class bp extends ut{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new wn,this.environmentIntensity=1,this.environmentRotation=new wn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class wl{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=js,this.updateRanges=[],this.version=0,this.uuid=bn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,r=this.stride;i<r;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=bn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=bn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Jt=new I;class Sn{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Jt.fromBufferAttribute(this,t),Jt.applyMatrix4(e),this.setXYZ(t,Jt.x,Jt.y,Jt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Jt.fromBufferAttribute(this,t),Jt.applyNormalMatrix(e),this.setXYZ(t,Jt.x,Jt.y,Jt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Jt.fromBufferAttribute(this,t),Jt.transformDirection(e),this.setXYZ(t,Jt.x,Jt.y,Jt.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=en(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=et(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=et(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=et(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=et(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=et(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=en(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=en(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=en(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=en(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=et(t,this.array),n=et(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=et(t,this.array),n=et(n,this.array),i=et(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=et(t,this.array),n=et(n,this.array),i=et(i,this.array),r=et(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return new mt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Sn(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class zh extends Kt{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Fe(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let Nr;const ys=new I,Or=new I,Br=new I,kr=new Me,xs=new Me,wp=new Ye,zo=new I,Ms=new I,Vo=new I,Hu=new Me,wc=new Me,Wu=new Me;class Ep extends ut{constructor(e=new zh){if(super(),this.isSprite=!0,this.type="Sprite",Nr===void 0){Nr=new nt;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new wl(t,5);Nr.setIndex([0,1,2,0,2,3]),Nr.setAttribute("position",new Sn(n,3,0,!1)),Nr.setAttribute("uv",new Sn(n,2,3,!1))}this.geometry=Nr,this.material=e,this.center=new Me(.5,.5)}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Or.setFromMatrixScale(this.matrixWorld),wp.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Br.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Or.multiplyScalar(-Br.z);const n=this.material.rotation;let i,r;n!==0&&(r=Math.cos(n),i=Math.sin(n));const o=this.center;Go(zo.set(-.5,-.5,0),Br,o,Or,i,r),Go(Ms.set(.5,-.5,0),Br,o,Or,i,r),Go(Vo.set(.5,.5,0),Br,o,Or,i,r),Hu.set(0,0),wc.set(1,0),Wu.set(1,1);let a=e.ray.intersectTriangle(zo,Ms,Vo,!1,ys);if(a===null&&(Go(Ms.set(-.5,.5,0),Br,o,Or,i,r),wc.set(0,1),a=e.ray.intersectTriangle(zo,Vo,Ms,!1,ys),a===null))return;const l=e.ray.origin.distanceTo(ys);l<e.near||l>e.far||t.push({distance:l,point:ys.clone(),uv:dn.getInterpolation(ys,zo,Ms,Vo,Hu,wc,Wu,new Me),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function Go(s,e,t,n,i,r){kr.subVectors(s,t).addScalar(.5).multiply(n),i!==void 0?(xs.x=r*kr.x-i*kr.y,xs.y=i*kr.x+r*kr.y):xs.copy(kr),s.copy(e),s.x+=xs.x,s.y+=xs.y,s.applyMatrix4(wp)}const Ho=new I,Xu=new I;class Tp extends ut{constructor(){super(),this._currentLevel=0,this.type="LOD",Object.defineProperties(this,{levels:{enumerable:!0,value:[]},isLOD:{value:!0}}),this.autoUpdate=!0}copy(e){super.copy(e,!1);const t=e.levels;for(let n=0,i=t.length;n<i;n++){const r=t[n];this.addLevel(r.object.clone(),r.distance,r.hysteresis)}return this.autoUpdate=e.autoUpdate,this}addLevel(e,t=0,n=0){t=Math.abs(t);const i=this.levels;let r;for(r=0;r<i.length&&!(t<i[r].distance);r++);return i.splice(r,0,{distance:t,hysteresis:n,object:e}),this.add(e),this}removeLevel(e){const t=this.levels;for(let n=0;n<t.length;n++)if(t[n].distance===e){const i=t.splice(n,1);return this.remove(i[0].object),!0}return!1}getCurrentLevel(){return this._currentLevel}getObjectForDistance(e){const t=this.levels;if(t.length>0){let n,i;for(n=1,i=t.length;n<i;n++){let r=t[n].distance;if(t[n].object.visible&&(r-=r*t[n].hysteresis),e<r)break}return t[n-1].object}return null}raycast(e,t){if(this.levels.length>0){Ho.setFromMatrixPosition(this.matrixWorld);const i=e.ray.origin.distanceTo(Ho);this.getObjectForDistance(i).raycast(e,t)}}update(e){const t=this.levels;if(t.length>1){Ho.setFromMatrixPosition(e.matrixWorld),Xu.setFromMatrixPosition(this.matrixWorld);const n=Ho.distanceTo(Xu)/e.zoom;t[0].object.visible=!0;let i,r;for(i=1,r=t.length;i<r;i++){let o=t[i].distance;if(t[i].object.visible&&(o-=o*t[i].hysteresis),n>=o)t[i-1].object.visible=!1,t[i].object.visible=!0;else break}for(this._currentLevel=i-1;i<r;i++)t[i].object.visible=!1}}toJSON(e){const t=super.toJSON(e);this.autoUpdate===!1&&(t.object.autoUpdate=!1),t.object.levels=[];const n=this.levels;for(let i=0,r=n.length;i<r;i++){const o=n[i];t.object.levels.push({object:o.object.uuid,distance:o.distance,hysteresis:o.hysteresis})}return t}}const Yu=new I,qu=new tt,Zu=new tt,y0=new I,ju=new Ye,Wo=new I,Ec=new It,Ku=new Ye,Tc=new Di;class Ap extends vt{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=rh,this.bindMatrix=new Ye,this.bindMatrixInverse=new Ye,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new wt),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Wo),this.boundingBox.expandByPoint(Wo)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new It),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Wo),this.boundingSphere.expandByPoint(Wo)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){const n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ec.copy(this.boundingSphere),Ec.applyMatrix4(i),e.ray.intersectsSphere(Ec)!==!1&&(Ku.copy(i).invert(),Tc.copy(e.ray).applyMatrix4(Ku),!(this.boundingBox!==null&&Tc.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,Tc)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new tt,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.fromBufferAttribute(t,n);const r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===rh?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===np?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const n=this.skeleton,i=this.geometry;qu.fromBufferAttribute(i.attributes.skinIndex,e),Zu.fromBufferAttribute(i.attributes.skinWeight,e),Yu.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let r=0;r<4;r++){const o=Zu.getComponent(r);if(o!==0){const a=qu.getComponent(r);ju.multiplyMatrices(n.bones[a].matrixWorld,n.boneInverses[a]),t.addScaledVector(y0.copy(Yu).applyMatrix4(ju),o)}}return t.applyMatrix4(this.bindMatrixInverse)}}class Vh extends ut{constructor(){super(),this.isBone=!0,this.type="Bone"}}class Kn extends Mt{constructor(e=null,t=1,n=1,i,r,o,a,l,c=Xt,h=Xt,u,f){super(null,o,a,l,c,h,i,r,u,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Ju=new Ye,x0=new Ye;class El{constructor(e=[],t=[]){this.uuid=bn(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new Ye)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const n=new Ye;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const e=this.bones,t=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let r=0,o=e.length;r<o;r++){const a=e[r]?e[r].matrixWorld:x0;Ju.multiplyMatrices(a,t[r]),Ju.toArray(n,r*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new El(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const n=new Kn(t,e,e,tn,pn);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){const i=this.bones[t];if(i.name===e)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,i=e.bones.length;n<i;n++){const r=e.bones[n];let o=t[r];o===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",r),o=new Vh),this.bones.push(o),this.boneInverses.push(new Ye().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){const e={metadata:{version:4.6,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,n=this.boneInverses;for(let i=0,r=t.length;i<r;i++){const o=t[i];e.bones.push(o.uuid);const a=n[i];e.boneInverses.push(a.toArray())}return e}}class mr extends mt{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const zr=new Ye,Qu=new Ye,Xo=[],$u=new wt,M0=new Ye,Ss=new vt,bs=new It;class Cp extends vt{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new mr(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,M0)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new wt),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,zr),$u.copy(e.boundingBox).applyMatrix4(zr),this.boundingBox.union($u)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new It),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,zr),bs.copy(e.boundingSphere).applyMatrix4(zr),this.boundingSphere.union(bs)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,o=e*r+1;for(let a=0;a<n.length;a++)n[a]=i[o+a]}raycast(e,t){const n=this.matrixWorld,i=this.count;if(Ss.geometry=this.geometry,Ss.material=this.material,Ss.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),bs.copy(this.boundingSphere),bs.applyMatrix4(n),e.ray.intersectsSphere(bs)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,zr),Qu.multiplyMatrices(n,zr),Ss.matrixWorld=Qu,Ss.raycast(e,Xo);for(let o=0,a=Xo.length;o<a;o++){const l=Xo[o];l.instanceId=r,l.object=this,t.push(l)}Xo.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new mr(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new Kn(new Float32Array(i*this.count),i,this.count,gl,pn));const r=this.morphTexture.source.data.data;let o=0;for(let c=0;c<n.length;c++)o+=n[c];const a=this.geometry.morphTargetsRelative?1:1-o,l=i*e;r[l]=a,r.set(n,l+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}const Ac=new I,S0=new I,b0=new Je;class Yn{constructor(e=new I(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=Ac.subVectors(n,t).cross(S0.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(Ac),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||b0.getNormalMatrix(e),i=this.coplanarPoint(Ac).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const zi=new It,Yo=new I;class ns{constructor(e=new Yn,t=new Yn,n=new Yn,i=new Yn,r=new Yn,o=new Yn){this.planes=[e,t,n,i,r,o]}set(e,t,n,i,r,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(i),a[4].copy(r),a[5].copy(o),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=jn){const n=this.planes,i=e.elements,r=i[0],o=i[1],a=i[2],l=i[3],c=i[4],h=i[5],u=i[6],f=i[7],d=i[8],p=i[9],_=i[10],g=i[11],m=i[12],x=i[13],y=i[14],v=i[15];if(n[0].setComponents(l-r,f-c,g-d,v-m).normalize(),n[1].setComponents(l+r,f+c,g+d,v+m).normalize(),n[2].setComponents(l+o,f+h,g+p,v+x).normalize(),n[3].setComponents(l-o,f-h,g-p,v-x).normalize(),n[4].setComponents(l-a,f-u,g-_,v-y).normalize(),t===jn)n[5].setComponents(l+a,f+u,g+_,v+y).normalize();else if(t===Ks)n[5].setComponents(a,u,_,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),zi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),zi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(zi)}intersectsSprite(e){return zi.center.set(0,0,0),zi.radius=.7071067811865476,zi.applyMatrix4(e.matrixWorld),this.intersectsSphere(zi)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(Yo.x=i.normal.x>0?e.max.x:e.min.x,Yo.y=i.normal.y>0?e.max.y:e.min.y,Yo.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(Yo)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Cc(s,e){return s-e}function w0(s,e){return s.z-e.z}function E0(s,e){return e.z-s.z}class T0{constructor(){this.index=0,this.pool=[],this.list=[]}push(e,t,n,i){const r=this.pool,o=this.list;this.index>=r.length&&r.push({start:-1,count:-1,z:-1,index:-1});const a=r[this.index];o.push(a),this.index++,a.start=e,a.count=t,a.z=n,a.index=i}reset(){this.list.length=0,this.index=0}}const hn=new Ye,A0=new Fe(1,1,1),Rc=new ns,qo=new wt,Vi=new It,ws=new I,ef=new I,C0=new I,Pc=new T0,jt=new vt,Zo=[];function R0(s,e,t=0){const n=e.itemSize;if(s.isInterleavedBufferAttribute||s.array.constructor!==e.array.constructor){const i=s.count;for(let r=0;r<i;r++)for(let o=0;o<n;o++)e.setComponent(r+t,o,s.getComponent(r,o))}else e.array.set(s.array,t*n);e.needsUpdate=!0}function Gi(s,e){if(s.constructor!==e.constructor){const t=Math.min(s.length,e.length);for(let n=0;n<t;n++)e[n]=s[n]}else{const t=Math.min(s.length,e.length);e.set(new s.constructor(s.buffer,0,t))}}class Rp extends vt{get maxInstanceCount(){return this._maxInstanceCount}get instanceCount(){return this._instanceInfo.length-this._availableInstanceIds.length}get unusedVertexCount(){return this._maxVertexCount-this._nextVertexStart}get unusedIndexCount(){return this._maxIndexCount-this._nextIndexStart}constructor(e,t,n=t*2,i){super(new nt,i),this.isBatchedMesh=!0,this.perObjectFrustumCulled=!0,this.sortObjects=!0,this.boundingBox=null,this.boundingSphere=null,this.customSort=null,this._instanceInfo=[],this._geometryInfo=[],this._availableInstanceIds=[],this._availableGeometryIds=[],this._nextIndexStart=0,this._nextVertexStart=0,this._geometryCount=0,this._visibilityChanged=!0,this._geometryInitialized=!1,this._maxInstanceCount=e,this._maxVertexCount=t,this._maxIndexCount=n,this._multiDrawCounts=new Int32Array(e),this._multiDrawStarts=new Int32Array(e),this._multiDrawCount=0,this._multiDrawInstances=null,this._matricesTexture=null,this._indirectTexture=null,this._colorsTexture=null,this._initMatricesTexture(),this._initIndirectTexture()}_initMatricesTexture(){let e=Math.sqrt(this._maxInstanceCount*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4),n=new Kn(t,e,e,tn,pn);this._matricesTexture=n}_initIndirectTexture(){let e=Math.sqrt(this._maxInstanceCount);e=Math.ceil(e);const t=new Uint32Array(e*e),n=new Kn(t,e,e,ho,gi);this._indirectTexture=n}_initColorsTexture(){let e=Math.sqrt(this._maxInstanceCount);e=Math.ceil(e);const t=new Float32Array(e*e*4).fill(1),n=new Kn(t,e,e,tn,pn);n.colorSpace=at.workingColorSpace,this._colorsTexture=n}_initializeGeometry(e){const t=this.geometry,n=this._maxVertexCount,i=this._maxIndexCount;if(this._geometryInitialized===!1){for(const r in e.attributes){const o=e.getAttribute(r),{array:a,itemSize:l,normalized:c}=o,h=new a.constructor(n*l),u=new mt(h,l,c);t.setAttribute(r,u)}if(e.getIndex()!==null){const r=n>65535?new Uint32Array(i):new Uint16Array(i);t.setIndex(new mt(r,1))}this._geometryInitialized=!0}}_validateGeometry(e){const t=this.geometry;if(!!e.getIndex()!=!!t.getIndex())throw new Error('THREE.BatchedMesh: All geometries must consistently have "index".');for(const n in t.attributes){if(!e.hasAttribute(n))throw new Error(`THREE.BatchedMesh: Added geometry missing "${n}". All geometries must have consistent attributes.`);const i=e.getAttribute(n),r=t.getAttribute(n);if(i.itemSize!==r.itemSize||i.normalized!==r.normalized)throw new Error("THREE.BatchedMesh: All attributes must have a consistent itemSize and normalized value.")}}validateInstanceId(e){const t=this._instanceInfo;if(e<0||e>=t.length||t[e].active===!1)throw new Error(`THREE.BatchedMesh: Invalid instanceId ${e}. Instance is either out of range or has been deleted.`)}validateGeometryId(e){const t=this._geometryInfo;if(e<0||e>=t.length||t[e].active===!1)throw new Error(`THREE.BatchedMesh: Invalid geometryId ${e}. Geometry is either out of range or has been deleted.`)}setCustomSort(e){return this.customSort=e,this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new wt);const e=this.boundingBox,t=this._instanceInfo;e.makeEmpty();for(let n=0,i=t.length;n<i;n++){if(t[n].active===!1)continue;const r=t[n].geometryIndex;this.getMatrixAt(n,hn),this.getBoundingBoxAt(r,qo).applyMatrix4(hn),e.union(qo)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new It);const e=this.boundingSphere,t=this._instanceInfo;e.makeEmpty();for(let n=0,i=t.length;n<i;n++){if(t[n].active===!1)continue;const r=t[n].geometryIndex;this.getMatrixAt(n,hn),this.getBoundingSphereAt(r,Vi).applyMatrix4(hn),e.union(Vi)}}addInstance(e){if(this._instanceInfo.length>=this.maxInstanceCount&&this._availableInstanceIds.length===0)throw new Error("THREE.BatchedMesh: Maximum item count reached.");const n={visible:!0,active:!0,geometryIndex:e};let i=null;this._availableInstanceIds.length>0?(this._availableInstanceIds.sort(Cc),i=this._availableInstanceIds.shift(),this._instanceInfo[i]=n):(i=this._instanceInfo.length,this._instanceInfo.push(n));const r=this._matricesTexture;hn.identity().toArray(r.image.data,i*16),r.needsUpdate=!0;const o=this._colorsTexture;return o&&(A0.toArray(o.image.data,i*4),o.needsUpdate=!0),this._visibilityChanged=!0,i}addGeometry(e,t=-1,n=-1){this._initializeGeometry(e),this._validateGeometry(e);const i={vertexStart:-1,vertexCount:-1,reservedVertexCount:-1,indexStart:-1,indexCount:-1,reservedIndexCount:-1,start:-1,count:-1,boundingBox:null,boundingSphere:null,active:!0},r=this._geometryInfo;i.vertexStart=this._nextVertexStart,i.reservedVertexCount=t===-1?e.getAttribute("position").count:t;const o=e.getIndex();if(o!==null&&(i.indexStart=this._nextIndexStart,i.reservedIndexCount=n===-1?o.count:n),i.indexStart!==-1&&i.indexStart+i.reservedIndexCount>this._maxIndexCount||i.vertexStart+i.reservedVertexCount>this._maxVertexCount)throw new Error("THREE.BatchedMesh: Reserved space request exceeds the maximum buffer size.");let l;return this._availableGeometryIds.length>0?(this._availableGeometryIds.sort(Cc),l=this._availableGeometryIds.shift(),r[l]=i):(l=this._geometryCount,this._geometryCount++,r.push(i)),this.setGeometryAt(l,e),this._nextIndexStart=i.indexStart+i.reservedIndexCount,this._nextVertexStart=i.vertexStart+i.reservedVertexCount,l}setGeometryAt(e,t){if(e>=this._geometryCount)throw new Error("THREE.BatchedMesh: Maximum geometry count reached.");this._validateGeometry(t);const n=this.geometry,i=n.getIndex()!==null,r=n.getIndex(),o=t.getIndex(),a=this._geometryInfo[e];if(i&&o.count>a.reservedIndexCount||t.attributes.position.count>a.reservedVertexCount)throw new Error("THREE.BatchedMesh: Reserved space not large enough for provided geometry.");const l=a.vertexStart,c=a.reservedVertexCount;a.vertexCount=t.getAttribute("position").count;for(const h in n.attributes){const u=t.getAttribute(h),f=n.getAttribute(h);R0(u,f,l);const d=u.itemSize;for(let p=u.count,_=c;p<_;p++){const g=l+p;for(let m=0;m<d;m++)f.setComponent(g,m,0)}f.needsUpdate=!0,f.addUpdateRange(l*d,c*d)}if(i){const h=a.indexStart,u=a.reservedIndexCount;a.indexCount=t.getIndex().count;for(let f=0;f<o.count;f++)r.setX(h+f,l+o.getX(f));for(let f=o.count,d=u;f<d;f++)r.setX(h+f,l);r.needsUpdate=!0,r.addUpdateRange(h,a.reservedIndexCount)}return a.start=i?a.indexStart:a.vertexStart,a.count=i?a.indexCount:a.vertexCount,a.boundingBox=null,t.boundingBox!==null&&(a.boundingBox=t.boundingBox.clone()),a.boundingSphere=null,t.boundingSphere!==null&&(a.boundingSphere=t.boundingSphere.clone()),this._visibilityChanged=!0,e}deleteGeometry(e){const t=this._geometryInfo;if(e>=t.length||t[e].active===!1)return this;const n=this._instanceInfo;for(let i=0,r=n.length;i<r;i++)n[i].geometryIndex===e&&this.deleteInstance(i);return t[e].active=!1,this._availableGeometryIds.push(e),this._visibilityChanged=!0,this}deleteInstance(e){return this.validateInstanceId(e),this._instanceInfo[e].active=!1,this._availableInstanceIds.push(e),this._visibilityChanged=!0,this}optimize(){let e=0,t=0;const n=this._geometryInfo,i=n.map((o,a)=>a).sort((o,a)=>n[o].vertexStart-n[a].vertexStart),r=this.geometry;for(let o=0,a=n.length;o<a;o++){const l=i[o],c=n[l];if(c.active!==!1){if(r.index!==null){if(c.indexStart!==t){const{indexStart:h,vertexStart:u,reservedIndexCount:f}=c,d=r.index,p=d.array,_=e-u;for(let g=h;g<h+f;g++)p[g]=p[g]+_;d.array.copyWithin(t,h,h+f),d.addUpdateRange(t,f),c.indexStart=t}t+=c.reservedIndexCount}if(c.vertexStart!==e){const{vertexStart:h,reservedVertexCount:u}=c,f=r.attributes;for(const d in f){const p=f[d],{array:_,itemSize:g}=p;_.copyWithin(e*g,h*g,(h+u)*g),p.addUpdateRange(e*g,u*g)}c.vertexStart=e}e+=c.reservedVertexCount,c.start=r.index?c.indexStart:c.vertexStart,this._nextIndexStart=r.index?c.indexStart+c.reservedIndexCount:0,this._nextVertexStart=c.vertexStart+c.reservedVertexCount}}return this}getBoundingBoxAt(e,t){if(e>=this._geometryCount)return null;const n=this.geometry,i=this._geometryInfo[e];if(i.boundingBox===null){const r=new wt,o=n.index,a=n.attributes.position;for(let l=i.start,c=i.start+i.count;l<c;l++){let h=l;o&&(h=o.getX(h)),r.expandByPoint(ws.fromBufferAttribute(a,h))}i.boundingBox=r}return t.copy(i.boundingBox),t}getBoundingSphereAt(e,t){if(e>=this._geometryCount)return null;const n=this.geometry,i=this._geometryInfo[e];if(i.boundingSphere===null){const r=new It;this.getBoundingBoxAt(e,qo),qo.getCenter(r.center);const o=n.index,a=n.attributes.position;let l=0;for(let c=i.start,h=i.start+i.count;c<h;c++){let u=c;o&&(u=o.getX(u)),ws.fromBufferAttribute(a,u),l=Math.max(l,r.center.distanceToSquared(ws))}r.radius=Math.sqrt(l),i.boundingSphere=r}return t.copy(i.boundingSphere),t}setMatrixAt(e,t){this.validateInstanceId(e);const n=this._matricesTexture,i=this._matricesTexture.image.data;return t.toArray(i,e*16),n.needsUpdate=!0,this}getMatrixAt(e,t){return this.validateInstanceId(e),t.fromArray(this._matricesTexture.image.data,e*16)}setColorAt(e,t){return this.validateInstanceId(e),this._colorsTexture===null&&this._initColorsTexture(),t.toArray(this._colorsTexture.image.data,e*4),this._colorsTexture.needsUpdate=!0,this}getColorAt(e,t){return this.validateInstanceId(e),t.fromArray(this._colorsTexture.image.data,e*4)}setVisibleAt(e,t){return this.validateInstanceId(e),this._instanceInfo[e].visible===t?this:(this._instanceInfo[e].visible=t,this._visibilityChanged=!0,this)}getVisibleAt(e){return this.validateInstanceId(e),this._instanceInfo[e].visible}setGeometryIdAt(e,t){return this.validateInstanceId(e),this.validateGeometryId(t),this._instanceInfo[e].geometryIndex=t,this}getGeometryIdAt(e){return this.validateInstanceId(e),this._instanceInfo[e].geometryIndex}getGeometryRangeAt(e,t={}){this.validateGeometryId(e);const n=this._geometryInfo[e];return t.vertexStart=n.vertexStart,t.vertexCount=n.vertexCount,t.reservedVertexCount=n.reservedVertexCount,t.indexStart=n.indexStart,t.indexCount=n.indexCount,t.reservedIndexCount=n.reservedIndexCount,t.start=n.start,t.count=n.count,t}setInstanceCount(e){const t=this._availableInstanceIds,n=this._instanceInfo;for(t.sort(Cc);t[t.length-1]===n.length;)n.pop(),t.pop();if(e<n.length)throw new Error(`BatchedMesh: Instance ids outside the range ${e} are being used. Cannot shrink instance count.`);const i=new Int32Array(e),r=new Int32Array(e);Gi(this._multiDrawCounts,i),Gi(this._multiDrawStarts,r),this._multiDrawCounts=i,this._multiDrawStarts=r,this._maxInstanceCount=e;const o=this._indirectTexture,a=this._matricesTexture,l=this._colorsTexture;o.dispose(),this._initIndirectTexture(),Gi(o.image.data,this._indirectTexture.image.data),a.dispose(),this._initMatricesTexture(),Gi(a.image.data,this._matricesTexture.image.data),l&&(l.dispose(),this._initColorsTexture(),Gi(l.image.data,this._colorsTexture.image.data))}setGeometrySize(e,t){const n=[...this._geometryInfo].filter(a=>a.active);if(Math.max(...n.map(a=>a.vertexStart+a.reservedVertexCount))>e)throw new Error(`BatchedMesh: Geometry vertex values are being used outside the range ${t}. Cannot shrink further.`);if(this.geometry.index&&Math.max(...n.map(l=>l.indexStart+l.reservedIndexCount))>t)throw new Error(`BatchedMesh: Geometry index values are being used outside the range ${t}. Cannot shrink further.`);const r=this.geometry;r.dispose(),this._maxVertexCount=e,this._maxIndexCount=t,this._geometryInitialized&&(this._geometryInitialized=!1,this.geometry=new nt,this._initializeGeometry(r));const o=this.geometry;r.index&&Gi(r.index.array,o.index.array);for(const a in r.attributes)Gi(r.attributes[a].array,o.attributes[a].array)}raycast(e,t){const n=this._instanceInfo,i=this._geometryInfo,r=this.matrixWorld,o=this.geometry;jt.material=this.material,jt.geometry.index=o.index,jt.geometry.attributes=o.attributes,jt.geometry.boundingBox===null&&(jt.geometry.boundingBox=new wt),jt.geometry.boundingSphere===null&&(jt.geometry.boundingSphere=new It);for(let a=0,l=n.length;a<l;a++){if(!n[a].visible||!n[a].active)continue;const c=n[a].geometryIndex,h=i[c];jt.geometry.setDrawRange(h.start,h.count),this.getMatrixAt(a,jt.matrixWorld).premultiply(r),this.getBoundingBoxAt(c,jt.geometry.boundingBox),this.getBoundingSphereAt(c,jt.geometry.boundingSphere),jt.raycast(e,Zo);for(let u=0,f=Zo.length;u<f;u++){const d=Zo[u];d.object=this,d.batchId=a,t.push(d)}Zo.length=0}jt.material=null,jt.geometry.index=null,jt.geometry.attributes={},jt.geometry.setDrawRange(0,1/0)}copy(e){return super.copy(e),this.geometry=e.geometry.clone(),this.perObjectFrustumCulled=e.perObjectFrustumCulled,this.sortObjects=e.sortObjects,this.boundingBox=e.boundingBox!==null?e.boundingBox.clone():null,this.boundingSphere=e.boundingSphere!==null?e.boundingSphere.clone():null,this._geometryInfo=e._geometryInfo.map(t=>({...t,boundingBox:t.boundingBox!==null?t.boundingBox.clone():null,boundingSphere:t.boundingSphere!==null?t.boundingSphere.clone():null})),this._instanceInfo=e._instanceInfo.map(t=>({...t})),this._maxInstanceCount=e._maxInstanceCount,this._maxVertexCount=e._maxVertexCount,this._maxIndexCount=e._maxIndexCount,this._geometryInitialized=e._geometryInitialized,this._geometryCount=e._geometryCount,this._multiDrawCounts=e._multiDrawCounts.slice(),this._multiDrawStarts=e._multiDrawStarts.slice(),this._matricesTexture=e._matricesTexture.clone(),this._matricesTexture.image.data=this._matricesTexture.image.data.slice(),this._colorsTexture!==null&&(this._colorsTexture=e._colorsTexture.clone(),this._colorsTexture.image.data=this._colorsTexture.image.data.slice()),this}dispose(){return this.geometry.dispose(),this._matricesTexture.dispose(),this._matricesTexture=null,this._indirectTexture.dispose(),this._indirectTexture=null,this._colorsTexture!==null&&(this._colorsTexture.dispose(),this._colorsTexture=null),this}onBeforeRender(e,t,n,i,r){if(!this._visibilityChanged&&!this.perObjectFrustumCulled&&!this.sortObjects)return;const o=i.getIndex(),a=o===null?1:o.array.BYTES_PER_ELEMENT,l=this._instanceInfo,c=this._multiDrawStarts,h=this._multiDrawCounts,u=this._geometryInfo,f=this.perObjectFrustumCulled,d=this._indirectTexture,p=d.image.data;f&&(hn.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse).multiply(this.matrixWorld),Rc.setFromProjectionMatrix(hn,e.coordinateSystem));let _=0;if(this.sortObjects){hn.copy(this.matrixWorld).invert(),ws.setFromMatrixPosition(n.matrixWorld).applyMatrix4(hn),ef.set(0,0,-1).transformDirection(n.matrixWorld).transformDirection(hn);for(let x=0,y=l.length;x<y;x++)if(l[x].visible&&l[x].active){const v=l[x].geometryIndex;this.getMatrixAt(x,hn),this.getBoundingSphereAt(v,Vi).applyMatrix4(hn);let A=!1;if(f&&(A=!Rc.intersectsSphere(Vi)),!A){const w=u[v],T=C0.subVectors(Vi.center,ws).dot(ef);Pc.push(w.start,w.count,T,x)}}const g=Pc.list,m=this.customSort;m===null?g.sort(r.transparent?E0:w0):m.call(this,g,n);for(let x=0,y=g.length;x<y;x++){const v=g[x];c[_]=v.start*a,h[_]=v.count,p[_]=v.index,_++}Pc.reset()}else for(let g=0,m=l.length;g<m;g++)if(l[g].visible&&l[g].active){const x=l[g].geometryIndex;let y=!1;if(f&&(this.getMatrixAt(g,hn),this.getBoundingSphereAt(x,Vi).applyMatrix4(hn),y=!Rc.intersectsSphere(Vi)),!y){const v=u[x];c[_]=v.start*a,h[_]=v.count,p[_]=g,_++}}d.needsUpdate=!0,this._multiDrawCount=_,this._visibilityChanged=!1}onBeforeShadow(e,t,n,i,r,o){this.onBeforeRender(e,null,i,r,o)}}class rn extends Kt{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Fe(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const ll=new I,cl=new I,tf=new Ye,Es=new Di,jo=new It,Ic=new I,nf=new I;class Li extends ut{constructor(e=new nt,t=new rn){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let i=1,r=t.count;i<r;i++)ll.fromBufferAttribute(t,i-1),cl.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=ll.distanceTo(cl);e.setAttribute("lineDistance",new Ge(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),jo.copy(n.boundingSphere),jo.applyMatrix4(i),jo.radius+=r,e.ray.intersectsSphere(jo)===!1)return;tf.copy(i).invert(),Es.copy(e.ray).applyMatrix4(tf);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,h=n.index,f=n.attributes.position;if(h!==null){const d=Math.max(0,o.start),p=Math.min(h.count,o.start+o.count);for(let _=d,g=p-1;_<g;_+=c){const m=h.getX(_),x=h.getX(_+1),y=Ko(this,e,Es,l,m,x);y&&t.push(y)}if(this.isLineLoop){const _=h.getX(p-1),g=h.getX(d),m=Ko(this,e,Es,l,_,g);m&&t.push(m)}}else{const d=Math.max(0,o.start),p=Math.min(f.count,o.start+o.count);for(let _=d,g=p-1;_<g;_+=c){const m=Ko(this,e,Es,l,_,_+1);m&&t.push(m)}if(this.isLineLoop){const _=Ko(this,e,Es,l,p-1,d);_&&t.push(_)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function Ko(s,e,t,n,i,r){const o=s.geometry.attributes.position;if(ll.fromBufferAttribute(o,i),cl.fromBufferAttribute(o,r),t.distanceSqToSegment(ll,cl,Ic,nf)>n)return;Ic.applyMatrix4(s.matrixWorld);const l=e.ray.origin.distanceTo(Ic);if(!(l<e.near||l>e.far))return{distance:l,point:nf.clone().applyMatrix4(s.matrixWorld),index:i,face:null,faceIndex:null,barycoord:null,object:s}}const rf=new I,sf=new I;class ei extends Li{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let i=0,r=t.count;i<r;i+=2)rf.fromBufferAttribute(t,i),sf.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+rf.distanceTo(sf);e.setAttribute("lineDistance",new Ge(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Pp extends Li{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class Gh extends Kt{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Fe(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const of=new Ye,ah=new Di,Jo=new It,Qo=new I;class Ip extends ut{constructor(e=new nt,t=new Gh){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,r=e.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Jo.copy(n.boundingSphere),Jo.applyMatrix4(i),Jo.radius+=r,e.ray.intersectsSphere(Jo)===!1)return;of.copy(i).invert(),ah.copy(e.ray).applyMatrix4(of);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,u=n.attributes.position;if(c!==null){const f=Math.max(0,o.start),d=Math.min(c.count,o.start+o.count);for(let p=f,_=d;p<_;p++){const g=c.getX(p);Qo.fromBufferAttribute(u,g),af(Qo,g,l,i,e,t,this)}}else{const f=Math.max(0,o.start),d=Math.min(u.count,o.start+o.count);for(let p=f,_=d;p<_;p++)Qo.fromBufferAttribute(u,p),af(Qo,p,l,i,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function af(s,e,t,n,i,r,o){const a=ah.distanceSqToPoint(s);if(a<t){const l=new I;ah.closestPointToPoint(s,l),l.applyMatrix4(n);const c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}class Yr extends ut{constructor(){super(),this.isGroup=!0,this.type="Group"}}class P0 extends Mt{constructor(e,t,n,i,r,o,a,l,c){super(e,t,n,i,r,o,a,l,c),this.isVideoTexture=!0,this.minFilter=o!==void 0?o:At,this.magFilter=r!==void 0?r:At,this.generateMipmaps=!1;const h=this;function u(){h.needsUpdate=!0,e.requestVideoFrameCallback(u)}"requestVideoFrameCallback"in e&&e.requestVideoFrameCallback(u)}clone(){return new this.constructor(this.image).copy(this)}update(){const e=this.image;"requestVideoFrameCallback"in e===!1&&e.readyState>=e.HAVE_CURRENT_DATA&&(this.needsUpdate=!0)}}class I0 extends Mt{constructor(e,t){super({width:e,height:t}),this.isFramebufferTexture=!0,this.magFilter=Xt,this.minFilter=Xt,this.generateMipmaps=!1,this.needsUpdate=!0}}class Tl extends Mt{constructor(e,t,n,i,r,o,a,l,c,h,u,f){super(null,o,a,l,c,h,i,r,u,f),this.isCompressedTexture=!0,this.image={width:t,height:n},this.mipmaps=e,this.flipY=!1,this.generateMipmaps=!1}}class L0 extends Tl{constructor(e,t,n,i,r,o){super(e,t,n,r,o),this.isCompressedArrayTexture=!0,this.image.depth=i,this.wrapR=Rn,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class U0 extends Tl{constructor(e,t,n){super(void 0,e[0].width,e[0].height,t,n,mi),this.isCompressedCubeTexture=!0,this.isCubeTexture=!0,this.image=e}}class D0 extends Mt{constructor(e,t,n,i,r,o,a,l,c){super(e,t,n,i,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Hh extends Mt{constructor(e,t,n,i,r,o,a,l,c,h=sr){if(h!==sr&&h!==dr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===sr&&(n=gi),n===void 0&&h===dr&&(n=fr),super(null,i,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:Xt,this.minFilter=l!==void 0?l:Xt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class kn{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,i=this.getPoint(0),r=0;t.push(0);for(let o=1;o<=e;o++)n=this.getPoint(o/e),r+=n.distanceTo(i),t.push(r),i=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){const n=this.getLengths();let i=0;const r=n.length;let o;t?o=t:o=e*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(i=Math.floor(a+(l-a)/2),c=n[i]-o,c<0)a=i+1;else if(c>0)l=i-1;else{l=i;break}if(i=l,n[i]===o)return i/(r-1);const h=n[i],f=n[i+1]-h,d=(o-h)/f;return(i+d)/(r-1)}getTangent(e,t){let i=e-1e-4,r=e+1e-4;i<0&&(i=0),r>1&&(r=1);const o=this.getPoint(i),a=this.getPoint(r),l=t||(o.isVector2?new Me:new I);return l.copy(a).sub(o).normalize(),l}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t){const n=new I,i=[],r=[],o=[],a=new I,l=new Ye;for(let d=0;d<=e;d++){const p=d/e;i[d]=this.getTangentAt(p,new I)}r[0]=new I,o[0]=new I;let c=Number.MAX_VALUE;const h=Math.abs(i[0].x),u=Math.abs(i[0].y),f=Math.abs(i[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),f<=c&&n.set(0,0,1),a.crossVectors(i[0],n).normalize(),r[0].crossVectors(i[0],a),o[0].crossVectors(i[0],r[0]);for(let d=1;d<=e;d++){if(r[d]=r[d-1].clone(),o[d]=o[d-1].clone(),a.crossVectors(i[d-1],i[d]),a.length()>Number.EPSILON){a.normalize();const p=Math.acos(Qe(i[d-1].dot(i[d]),-1,1));r[d].applyMatrix4(l.makeRotationAxis(a,p))}o[d].crossVectors(i[d],r[d])}if(t===!0){let d=Math.acos(Qe(r[0].dot(r[e]),-1,1));d/=e,i[0].dot(a.crossVectors(r[0],r[e]))>0&&(d=-d);for(let p=1;p<=e;p++)r[p].applyMatrix4(l.makeRotationAxis(i[p],d*p)),o[p].crossVectors(i[p],r[p])}return{tangents:i,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class Al extends kn{constructor(e=0,t=0,n=1,i=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=i,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(e,t=new Me){const n=t,i=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=i;for(;r>i;)r-=i;r<Number.EPSILON&&(o?r=0:r=i),this.aClockwise===!0&&!o&&(r===i?r=-i:r=r-i);const a=this.aStartAngle+e*r;let l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),f=l-this.aX,d=c-this.aY;l=f*h-d*u+this.aX,c=f*u+d*h+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class Lp extends Al{constructor(e,t,n,i,r,o){super(e,t,n,n,i,r,o),this.isArcCurve=!0,this.type="ArcCurve"}}function Wh(){let s=0,e=0,t=0,n=0;function i(r,o,a,l){s=r,e=a,t=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){i(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,h,u){let f=(o-r)/c-(a-r)/(c+h)+(a-o)/h,d=(a-o)/h-(l-o)/(h+u)+(l-a)/u;f*=h,d*=h,i(o,a,f,d)},calc:function(r){const o=r*r,a=o*r;return s+e*r+t*o+n*a}}}const $o=new I,Lc=new Wh,Uc=new Wh,Dc=new Wh;class Up extends kn{constructor(e=[],t=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=i}getPoint(e,t=new I){const n=t,i=this.points,r=i.length,o=(r-(this.closed?0:1))*e;let a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,h;this.closed||a>0?c=i[(a-1)%r]:($o.subVectors(i[0],i[1]).add(i[0]),c=$o);const u=i[a%r],f=i[(a+1)%r];if(this.closed||a+2<r?h=i[(a+2)%r]:($o.subVectors(i[r-1],i[r-2]).add(i[r-1]),h=$o),this.curveType==="centripetal"||this.curveType==="chordal"){const d=this.curveType==="chordal"?.5:.25;let p=Math.pow(c.distanceToSquared(u),d),_=Math.pow(u.distanceToSquared(f),d),g=Math.pow(f.distanceToSquared(h),d);_<1e-4&&(_=1),p<1e-4&&(p=_),g<1e-4&&(g=_),Lc.initNonuniformCatmullRom(c.x,u.x,f.x,h.x,p,_,g),Uc.initNonuniformCatmullRom(c.y,u.y,f.y,h.y,p,_,g),Dc.initNonuniformCatmullRom(c.z,u.z,f.z,h.z,p,_,g)}else this.curveType==="catmullrom"&&(Lc.initCatmullRom(c.x,u.x,f.x,h.x,this.tension),Uc.initCatmullRom(c.y,u.y,f.y,h.y,this.tension),Dc.initCatmullRom(c.z,u.z,f.z,h.z,this.tension));return n.set(Lc.calc(l),Uc.calc(l),Dc.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(i.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const i=this.points[t];e.points.push(i.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(new I().fromArray(i))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function lf(s,e,t,n,i){const r=(n-e)*.5,o=(i-t)*.5,a=s*s,l=s*a;return(2*t-2*n+r+o)*l+(-3*t+3*n-2*r-o)*a+r*s+t}function F0(s,e){const t=1-s;return t*t*e}function N0(s,e){return 2*(1-s)*s*e}function O0(s,e){return s*s*e}function Bs(s,e,t,n){return F0(s,e)+N0(s,t)+O0(s,n)}function B0(s,e){const t=1-s;return t*t*t*e}function k0(s,e){const t=1-s;return 3*t*t*s*e}function z0(s,e){return 3*(1-s)*s*s*e}function V0(s,e){return s*s*s*e}function ks(s,e,t,n,i){return B0(s,e)+k0(s,t)+z0(s,n)+V0(s,i)}class Xh extends kn{constructor(e=new Me,t=new Me,n=new Me,i=new Me){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new Me){const n=t,i=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(ks(e,i.x,r.x,o.x,a.x),ks(e,i.y,r.y,o.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Dp extends kn{constructor(e=new I,t=new I,n=new I,i=new I){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new I){const n=t,i=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(ks(e,i.x,r.x,o.x,a.x),ks(e,i.y,r.y,o.y,a.y),ks(e,i.z,r.z,o.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Yh extends kn{constructor(e=new Me,t=new Me){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new Me){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new Me){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Fp extends kn{constructor(e=new I,t=new I){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new I){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new I){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class qh extends kn{constructor(e=new Me,t=new Me,n=new Me){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new Me){const n=t,i=this.v0,r=this.v1,o=this.v2;return n.set(Bs(e,i.x,r.x,o.x),Bs(e,i.y,r.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Zh extends kn{constructor(e=new I,t=new I,n=new I){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new I){const n=t,i=this.v0,r=this.v1,o=this.v2;return n.set(Bs(e,i.x,r.x,o.x),Bs(e,i.y,r.y,o.y),Bs(e,i.z,r.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class jh extends kn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new Me){const n=t,i=this.points,r=(i.length-1)*e,o=Math.floor(r),a=r-o,l=i[o===0?o:o-1],c=i[o],h=i[o>i.length-2?i.length-1:o+1],u=i[o>i.length-3?i.length-1:o+2];return n.set(lf(a,l.x,c.x,h.x,u.x),lf(a,l.y,c.y,h.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(i.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const i=this.points[t];e.points.push(i.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(new Me().fromArray(i))}return this}}var hl=Object.freeze({__proto__:null,ArcCurve:Lp,CatmullRomCurve3:Up,CubicBezierCurve:Xh,CubicBezierCurve3:Dp,EllipseCurve:Al,LineCurve:Yh,LineCurve3:Fp,QuadraticBezierCurve:qh,QuadraticBezierCurve3:Zh,SplineCurve:jh});class Np extends kn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new hl[n](t,e))}return this}getPoint(e,t){const n=e*this.getLength(),i=this.getCurveLengths();let r=0;for(;r<i.length;){if(i[r]>=n){const o=i[r]-n,a=this.curves[r],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,t)}r++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let n=0,i=this.curves.length;n<i;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let n;for(let i=0,r=this.curves;i<r.length;i++){const o=r[i],a=o.isEllipseCurve?e*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?e*o.points.length:e,l=o.getPoints(a);for(let c=0;c<l.length;c++){const h=l[c];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const i=e.curves[t];this.curves.push(i.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){const i=this.curves[t];e.curves.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const i=e.curves[t];this.curves.push(new hl[i.type]().fromJSON(i))}return this}}class $s extends Np{constructor(e){super(),this.type="Path",this.currentPoint=new Me,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const n=new Yh(this.currentPoint.clone(),new Me(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,i){const r=new qh(this.currentPoint.clone(),new Me(e,t),new Me(n,i));return this.curves.push(r),this.currentPoint.set(n,i),this}bezierCurveTo(e,t,n,i,r,o){const a=new Xh(this.currentPoint.clone(),new Me(e,t),new Me(n,i),new Me(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),n=new jh(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,i,r,o){const a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+a,t+l,n,i,r,o),this}absarc(e,t,n,i,r,o){return this.absellipse(e,t,n,n,i,r,o),this}ellipse(e,t,n,i,r,o,a,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,n,i,r,o,a,l),this}absellipse(e,t,n,i,r,o,a,l){const c=new Al(e,t,n,i,r,o,a,l);if(this.curves.length>0){const u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class po extends nt{constructor(e=[new Me(0,-.5),new Me(.5,0),new Me(0,.5)],t=12,n=0,i=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:i},t=Math.floor(t),i=Qe(i,0,Math.PI*2);const r=[],o=[],a=[],l=[],c=[],h=1/t,u=new I,f=new Me,d=new I,p=new I,_=new I;let g=0,m=0;for(let x=0;x<=e.length-1;x++)switch(x){case 0:g=e[x+1].x-e[x].x,m=e[x+1].y-e[x].y,d.x=m*1,d.y=-g,d.z=m*0,_.copy(d),d.normalize(),l.push(d.x,d.y,d.z);break;case e.length-1:l.push(_.x,_.y,_.z);break;default:g=e[x+1].x-e[x].x,m=e[x+1].y-e[x].y,d.x=m*1,d.y=-g,d.z=m*0,p.copy(d),d.x+=_.x,d.y+=_.y,d.z+=_.z,d.normalize(),l.push(d.x,d.y,d.z),_.copy(p)}for(let x=0;x<=t;x++){const y=n+x*h*i,v=Math.sin(y),A=Math.cos(y);for(let w=0;w<=e.length-1;w++){u.x=e[w].x*v,u.y=e[w].y,u.z=e[w].x*A,o.push(u.x,u.y,u.z),f.x=x/t,f.y=w/(e.length-1),a.push(f.x,f.y);const T=l[3*w+0]*v,C=l[3*w+1],b=l[3*w+0]*A;c.push(T,C,b)}}for(let x=0;x<t;x++)for(let y=0;y<e.length-1;y++){const v=y+x*e.length,A=v,w=v+e.length,T=v+e.length+1,C=v+1;r.push(A,w,C),r.push(T,C,w)}this.setIndex(r),this.setAttribute("position",new Ge(o,3)),this.setAttribute("uv",new Ge(a,2)),this.setAttribute("normal",new Ge(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new po(e.points,e.segments,e.phiStart,e.phiLength)}}class Cl extends po{constructor(e=1,t=1,n=4,i=8){const r=new $s;r.absarc(0,-t/2,e,Math.PI*1.5,0),r.absarc(0,t/2,e,0,Math.PI*.5),super(r.getPoints(n),i),this.type="CapsuleGeometry",this.parameters={radius:e,length:t,capSegments:n,radialSegments:i}}static fromJSON(e){return new Cl(e.radius,e.length,e.capSegments,e.radialSegments)}}class Rl extends nt{constructor(e=1,t=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:i},t=Math.max(3,t);const r=[],o=[],a=[],l=[],c=new I,h=new Me;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let u=0,f=3;u<=t;u++,f+=3){const d=n+u/t*i;c.x=e*Math.cos(d),c.y=e*Math.sin(d),o.push(c.x,c.y,c.z),a.push(0,0,1),h.x=(o[f]/e+1)/2,h.y=(o[f+1]/e+1)/2,l.push(h.x,h.y)}for(let u=1;u<=t;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new Ge(o,3)),this.setAttribute("normal",new Ge(a,3)),this.setAttribute("uv",new Ge(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Rl(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class is extends nt{constructor(e=1,t=1,n=1,i=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};const c=this;i=Math.floor(i),r=Math.floor(r);const h=[],u=[],f=[],d=[];let p=0;const _=[],g=n/2;let m=0;x(),o===!1&&(e>0&&y(!0),t>0&&y(!1)),this.setIndex(h),this.setAttribute("position",new Ge(u,3)),this.setAttribute("normal",new Ge(f,3)),this.setAttribute("uv",new Ge(d,2));function x(){const v=new I,A=new I;let w=0;const T=(t-e)/n;for(let C=0;C<=r;C++){const b=[],M=C/r,U=M*(t-e)+e;for(let L=0;L<=i;L++){const F=L/i,N=F*l+a,Q=Math.sin(N),V=Math.cos(N);A.x=U*Q,A.y=-M*n+g,A.z=U*V,u.push(A.x,A.y,A.z),v.set(Q,T,V).normalize(),f.push(v.x,v.y,v.z),d.push(F,1-M),b.push(p++)}_.push(b)}for(let C=0;C<i;C++)for(let b=0;b<r;b++){const M=_[b][C],U=_[b+1][C],L=_[b+1][C+1],F=_[b][C+1];(e>0||b!==0)&&(h.push(M,U,F),w+=3),(t>0||b!==r-1)&&(h.push(U,L,F),w+=3)}c.addGroup(m,w,0),m+=w}function y(v){const A=p,w=new Me,T=new I;let C=0;const b=v===!0?e:t,M=v===!0?1:-1;for(let L=1;L<=i;L++)u.push(0,g*M,0),f.push(0,M,0),d.push(.5,.5),p++;const U=p;for(let L=0;L<=i;L++){const N=L/i*l+a,Q=Math.cos(N),V=Math.sin(N);T.x=b*V,T.y=g*M,T.z=b*Q,u.push(T.x,T.y,T.z),f.push(0,M,0),w.x=Q*.5+.5,w.y=V*.5*M+.5,d.push(w.x,w.y),p++}for(let L=0;L<i;L++){const F=A+L,N=U+L;v===!0?h.push(N,N+1,F):h.push(N+1,N,F),C+=3}c.addGroup(m,C,v===!0?1:2),m+=C}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new is(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Pl extends is{constructor(e=1,t=1,n=32,i=1,r=!1,o=0,a=Math.PI*2){super(0,e,t,n,i,r,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:i,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(e){return new Pl(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Fi extends nt{constructor(e=[],t=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:i};const r=[],o=[];a(i),c(n),h(),this.setAttribute("position",new Ge(r,3)),this.setAttribute("normal",new Ge(r.slice(),3)),this.setAttribute("uv",new Ge(o,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function a(x){const y=new I,v=new I,A=new I;for(let w=0;w<t.length;w+=3)d(t[w+0],y),d(t[w+1],v),d(t[w+2],A),l(y,v,A,x)}function l(x,y,v,A){const w=A+1,T=[];for(let C=0;C<=w;C++){T[C]=[];const b=x.clone().lerp(v,C/w),M=y.clone().lerp(v,C/w),U=w-C;for(let L=0;L<=U;L++)L===0&&C===w?T[C][L]=b:T[C][L]=b.clone().lerp(M,L/U)}for(let C=0;C<w;C++)for(let b=0;b<2*(w-C)-1;b++){const M=Math.floor(b/2);b%2===0?(f(T[C][M+1]),f(T[C+1][M]),f(T[C][M])):(f(T[C][M+1]),f(T[C+1][M+1]),f(T[C+1][M]))}}function c(x){const y=new I;for(let v=0;v<r.length;v+=3)y.x=r[v+0],y.y=r[v+1],y.z=r[v+2],y.normalize().multiplyScalar(x),r[v+0]=y.x,r[v+1]=y.y,r[v+2]=y.z}function h(){const x=new I;for(let y=0;y<r.length;y+=3){x.x=r[y+0],x.y=r[y+1],x.z=r[y+2];const v=g(x)/2/Math.PI+.5,A=m(x)/Math.PI+.5;o.push(v,1-A)}p(),u()}function u(){for(let x=0;x<o.length;x+=6){const y=o[x+0],v=o[x+2],A=o[x+4],w=Math.max(y,v,A),T=Math.min(y,v,A);w>.9&&T<.1&&(y<.2&&(o[x+0]+=1),v<.2&&(o[x+2]+=1),A<.2&&(o[x+4]+=1))}}function f(x){r.push(x.x,x.y,x.z)}function d(x,y){const v=x*3;y.x=e[v+0],y.y=e[v+1],y.z=e[v+2]}function p(){const x=new I,y=new I,v=new I,A=new I,w=new Me,T=new Me,C=new Me;for(let b=0,M=0;b<r.length;b+=9,M+=6){x.set(r[b+0],r[b+1],r[b+2]),y.set(r[b+3],r[b+4],r[b+5]),v.set(r[b+6],r[b+7],r[b+8]),w.set(o[M+0],o[M+1]),T.set(o[M+2],o[M+3]),C.set(o[M+4],o[M+5]),A.copy(x).add(y).add(v).divideScalar(3);const U=g(A);_(w,M+0,x,U),_(T,M+2,y,U),_(C,M+4,v,U)}}function _(x,y,v,A){A<0&&x.x===1&&(o[y]=x.x-1),v.x===0&&v.z===0&&(o[y]=A/2/Math.PI+.5)}function g(x){return Math.atan2(x.z,-x.x)}function m(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Fi(e.vertices,e.indices,e.radius,e.details)}}class Il extends Fi{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,i=1/n,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-i,-n,0,-i,n,0,i,-n,0,i,n,-i,-n,0,-i,n,0,i,-n,0,i,n,0,-n,0,-i,n,0,-i,-n,0,i,n,0,i],o=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,o,e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Il(e.radius,e.detail)}}const ea=new I,ta=new I,Fc=new I,na=new dn;class Op extends nt{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){const i=Math.pow(10,4),r=Math.cos(or*t),o=e.getIndex(),a=e.getAttribute("position"),l=o?o.count:a.count,c=[0,0,0],h=["a","b","c"],u=new Array(3),f={},d=[];for(let p=0;p<l;p+=3){o?(c[0]=o.getX(p),c[1]=o.getX(p+1),c[2]=o.getX(p+2)):(c[0]=p,c[1]=p+1,c[2]=p+2);const{a:_,b:g,c:m}=na;if(_.fromBufferAttribute(a,c[0]),g.fromBufferAttribute(a,c[1]),m.fromBufferAttribute(a,c[2]),na.getNormal(Fc),u[0]=`${Math.round(_.x*i)},${Math.round(_.y*i)},${Math.round(_.z*i)}`,u[1]=`${Math.round(g.x*i)},${Math.round(g.y*i)},${Math.round(g.z*i)}`,u[2]=`${Math.round(m.x*i)},${Math.round(m.y*i)},${Math.round(m.z*i)}`,!(u[0]===u[1]||u[1]===u[2]||u[2]===u[0]))for(let x=0;x<3;x++){const y=(x+1)%3,v=u[x],A=u[y],w=na[h[x]],T=na[h[y]],C=`${v}_${A}`,b=`${A}_${v}`;b in f&&f[b]?(Fc.dot(f[b].normal)<=r&&(d.push(w.x,w.y,w.z),d.push(T.x,T.y,T.z)),f[b]=null):C in f||(f[C]={index0:c[x],index1:c[y],normal:Fc.clone()})}}for(const p in f)if(f[p]){const{index0:_,index1:g}=f[p];ea.fromBufferAttribute(a,_),ta.fromBufferAttribute(a,g),d.push(ea.x,ea.y,ea.z),d.push(ta.x,ta.y,ta.z)}this.setAttribute("position",new Ge(d,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}class ar extends $s{constructor(e){super(e),this.uuid=bn(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let n=0,i=this.holes.length;n<i;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const i=e.holes[t];this.holes.push(i.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){const i=this.holes[t];e.holes.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const i=e.holes[t];this.holes.push(new $s().fromJSON(i))}return this}}const G0={triangulate:function(s,e,t=2){const n=e&&e.length,i=n?e[0]*t:s.length;let r=Bp(s,0,i,t,!0);const o=[];if(!r||r.next===r.prev)return o;let a,l,c,h,u,f,d;if(n&&(r=q0(s,e,r,t)),s.length>80*t){a=c=s[0],l=h=s[1];for(let p=t;p<i;p+=t)u=s[p],f=s[p+1],u<a&&(a=u),f<l&&(l=f),u>c&&(c=u),f>h&&(h=f);d=Math.max(c-a,h-l),d=d!==0?32767/d:0}return eo(r,o,t,a,l,d,0),o}};function Bp(s,e,t,n,i){let r,o;if(i===r_(s,e,t,n)>0)for(r=e;r<t;r+=n)o=cf(r,s[r],s[r+1],o);else for(r=t-n;r>=e;r-=n)o=cf(r,s[r],s[r+1],o);return o&&Ll(o,o.next)&&(no(o),o=o.next),o}function gr(s,e){if(!s)return s;e||(e=s);let t=s,n;do if(n=!1,!t.steiner&&(Ll(t,t.next)||xt(t.prev,t,t.next)===0)){if(no(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function eo(s,e,t,n,i,r,o){if(!s)return;!o&&r&&Q0(s,n,i,r);let a=s,l,c;for(;s.prev!==s.next;){if(l=s.prev,c=s.next,r?W0(s,n,i,r):H0(s)){e.push(l.i/t|0),e.push(s.i/t|0),e.push(c.i/t|0),no(s),s=c.next,a=c.next;continue}if(s=c,s===a){o?o===1?(s=X0(gr(s),e,t),eo(s,e,t,n,i,r,2)):o===2&&Y0(s,e,t,n,i,r):eo(gr(s),e,t,n,i,r,1);break}}}function H0(s){const e=s.prev,t=s,n=s.next;if(xt(e,t,n)>=0)return!1;const i=e.x,r=t.x,o=n.x,a=e.y,l=t.y,c=n.y,h=i<r?i<o?i:o:r<o?r:o,u=a<l?a<c?a:c:l<c?l:c,f=i>r?i>o?i:o:r>o?r:o,d=a>l?a>c?a:c:l>c?l:c;let p=n.next;for(;p!==e;){if(p.x>=h&&p.x<=f&&p.y>=u&&p.y<=d&&qr(i,a,r,l,o,c,p.x,p.y)&&xt(p.prev,p,p.next)>=0)return!1;p=p.next}return!0}function W0(s,e,t,n){const i=s.prev,r=s,o=s.next;if(xt(i,r,o)>=0)return!1;const a=i.x,l=r.x,c=o.x,h=i.y,u=r.y,f=o.y,d=a<l?a<c?a:c:l<c?l:c,p=h<u?h<f?h:f:u<f?u:f,_=a>l?a>c?a:c:l>c?l:c,g=h>u?h>f?h:f:u>f?u:f,m=lh(d,p,e,t,n),x=lh(_,g,e,t,n);let y=s.prevZ,v=s.nextZ;for(;y&&y.z>=m&&v&&v.z<=x;){if(y.x>=d&&y.x<=_&&y.y>=p&&y.y<=g&&y!==i&&y!==o&&qr(a,h,l,u,c,f,y.x,y.y)&&xt(y.prev,y,y.next)>=0||(y=y.prevZ,v.x>=d&&v.x<=_&&v.y>=p&&v.y<=g&&v!==i&&v!==o&&qr(a,h,l,u,c,f,v.x,v.y)&&xt(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;y&&y.z>=m;){if(y.x>=d&&y.x<=_&&y.y>=p&&y.y<=g&&y!==i&&y!==o&&qr(a,h,l,u,c,f,y.x,y.y)&&xt(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;v&&v.z<=x;){if(v.x>=d&&v.x<=_&&v.y>=p&&v.y<=g&&v!==i&&v!==o&&qr(a,h,l,u,c,f,v.x,v.y)&&xt(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function X0(s,e,t){let n=s;do{const i=n.prev,r=n.next.next;!Ll(i,r)&&kp(i,n,n.next,r)&&to(i,r)&&to(r,i)&&(e.push(i.i/t|0),e.push(n.i/t|0),e.push(r.i/t|0),no(n),no(n.next),n=s=r),n=n.next}while(n!==s);return gr(n)}function Y0(s,e,t,n,i,r){let o=s;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&t_(o,a)){let l=zp(o,a);o=gr(o,o.next),l=gr(l,l.next),eo(o,e,t,n,i,r,0),eo(l,e,t,n,i,r,0);return}a=a.next}o=o.next}while(o!==s)}function q0(s,e,t,n){const i=[];let r,o,a,l,c;for(r=0,o=e.length;r<o;r++)a=e[r]*n,l=r<o-1?e[r+1]*n:s.length,c=Bp(s,a,l,n,!1),c===c.next&&(c.steiner=!0),i.push(e_(c));for(i.sort(Z0),r=0;r<i.length;r++)t=j0(i[r],t);return t}function Z0(s,e){return s.x-e.x}function j0(s,e){const t=K0(s,e);if(!t)return e;const n=zp(t,s);return gr(n,n.next),gr(t,t.next)}function K0(s,e){let t=e,n=-1/0,i;const r=s.x,o=s.y;do{if(o<=t.y&&o>=t.next.y&&t.next.y!==t.y){const f=t.x+(o-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(f<=r&&f>n&&(n=f,i=t.x<t.next.x?t:t.next,f===r))return i}t=t.next}while(t!==e);if(!i)return null;const a=i,l=i.x,c=i.y;let h=1/0,u;t=i;do r>=t.x&&t.x>=l&&r!==t.x&&qr(o<c?r:n,o,l,c,o<c?n:r,o,t.x,t.y)&&(u=Math.abs(o-t.y)/(r-t.x),to(t,s)&&(u<h||u===h&&(t.x>i.x||t.x===i.x&&J0(i,t)))&&(i=t,h=u)),t=t.next;while(t!==a);return i}function J0(s,e){return xt(s.prev,s,e.prev)<0&&xt(e.next,s,s.next)<0}function Q0(s,e,t,n){let i=s;do i.z===0&&(i.z=lh(i.x,i.y,e,t,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==s);i.prevZ.nextZ=null,i.prevZ=null,$0(i)}function $0(s){let e,t,n,i,r,o,a,l,c=1;do{for(t=s,s=null,r=null,o=0;t;){for(o++,n=t,a=0,e=0;e<c&&(a++,n=n.nextZ,!!n);e++);for(l=c;a>0||l>0&&n;)a!==0&&(l===0||!n||t.z<=n.z)?(i=t,t=t.nextZ,a--):(i=n,n=n.nextZ,l--),r?r.nextZ=i:s=i,i.prevZ=r,r=i;t=n}r.nextZ=null,c*=2}while(o>1);return s}function lh(s,e,t,n,i){return s=(s-t)*i|0,e=(e-n)*i|0,s=(s|s<<8)&16711935,s=(s|s<<4)&252645135,s=(s|s<<2)&858993459,s=(s|s<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,s|e<<1}function e_(s){let e=s,t=s;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==s);return t}function qr(s,e,t,n,i,r,o,a){return(i-o)*(e-a)>=(s-o)*(r-a)&&(s-o)*(n-a)>=(t-o)*(e-a)&&(t-o)*(r-a)>=(i-o)*(n-a)}function t_(s,e){return s.next.i!==e.i&&s.prev.i!==e.i&&!n_(s,e)&&(to(s,e)&&to(e,s)&&i_(s,e)&&(xt(s.prev,s,e.prev)||xt(s,e.prev,e))||Ll(s,e)&&xt(s.prev,s,s.next)>0&&xt(e.prev,e,e.next)>0)}function xt(s,e,t){return(e.y-s.y)*(t.x-e.x)-(e.x-s.x)*(t.y-e.y)}function Ll(s,e){return s.x===e.x&&s.y===e.y}function kp(s,e,t,n){const i=ra(xt(s,e,t)),r=ra(xt(s,e,n)),o=ra(xt(t,n,s)),a=ra(xt(t,n,e));return!!(i!==r&&o!==a||i===0&&ia(s,t,e)||r===0&&ia(s,n,e)||o===0&&ia(t,s,n)||a===0&&ia(t,e,n))}function ia(s,e,t){return e.x<=Math.max(s.x,t.x)&&e.x>=Math.min(s.x,t.x)&&e.y<=Math.max(s.y,t.y)&&e.y>=Math.min(s.y,t.y)}function ra(s){return s>0?1:s<0?-1:0}function n_(s,e){let t=s;do{if(t.i!==s.i&&t.next.i!==s.i&&t.i!==e.i&&t.next.i!==e.i&&kp(t,t.next,s,e))return!0;t=t.next}while(t!==s);return!1}function to(s,e){return xt(s.prev,s,s.next)<0?xt(s,e,s.next)>=0&&xt(s,s.prev,e)>=0:xt(s,e,s.prev)<0||xt(s,s.next,e)<0}function i_(s,e){let t=s,n=!1;const i=(s.x+e.x)/2,r=(s.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&i<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==s);return n}function zp(s,e){const t=new ch(s.i,s.x,s.y),n=new ch(e.i,e.x,e.y),i=s.next,r=e.prev;return s.next=e,e.prev=s,t.next=i,i.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function cf(s,e,t,n){const i=new ch(s,e,t);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function no(s){s.next.prev=s.prev,s.prev.next=s.next,s.prevZ&&(s.prevZ.nextZ=s.nextZ),s.nextZ&&(s.nextZ.prevZ=s.prevZ)}function ch(s,e,t){this.i=s,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function r_(s,e,t,n){let i=0;for(let r=e,o=t-n;r<t;r+=n)i+=(s[o]-s[r])*(s[r+1]+s[o+1]),o=r;return i}class Jn{static area(e){const t=e.length;let n=0;for(let i=t-1,r=0;r<t;i=r++)n+=e[i].x*e[r].y-e[r].x*e[i].y;return n*.5}static isClockWise(e){return Jn.area(e)<0}static triangulateShape(e,t){const n=[],i=[],r=[];hf(e),uf(n,e);let o=e.length;t.forEach(hf);for(let l=0;l<t.length;l++)i.push(o),o+=t[l].length,uf(n,t[l]);const a=G0.triangulate(n,i);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}}function hf(s){const e=s.length;e>2&&s[e-1].equals(s[0])&&s.pop()}function uf(s,e){for(let t=0;t<e.length;t++)s.push(e[t].x),s.push(e[t].y)}class Ul extends nt{constructor(e=new ar([new Me(.5,.5),new Me(-.5,.5),new Me(-.5,-.5),new Me(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const n=this,i=[],r=[];for(let a=0,l=e.length;a<l;a++){const c=e[a];o(c)}this.setAttribute("position",new Ge(i,3)),this.setAttribute("uv",new Ge(r,2)),this.computeVertexNormals();function o(a){const l=[],c=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1;let f=t.bevelEnabled!==void 0?t.bevelEnabled:!0,d=t.bevelThickness!==void 0?t.bevelThickness:.2,p=t.bevelSize!==void 0?t.bevelSize:d-.1,_=t.bevelOffset!==void 0?t.bevelOffset:0,g=t.bevelSegments!==void 0?t.bevelSegments:3;const m=t.extrudePath,x=t.UVGenerator!==void 0?t.UVGenerator:s_;let y,v=!1,A,w,T,C;m&&(y=m.getSpacedPoints(h),v=!0,f=!1,A=m.computeFrenetFrames(h,!1),w=new I,T=new I,C=new I),f||(g=0,d=0,p=0,_=0);const b=a.extractPoints(c);let M=b.shape;const U=b.holes;if(!Jn.isClockWise(M)){M=M.reverse();for(let B=0,ie=U.length;B<ie;B++){const R=U[B];Jn.isClockWise(R)&&(U[B]=R.reverse())}}const F=Jn.triangulateShape(M,U),N=M;for(let B=0,ie=U.length;B<ie;B++){const R=U[B];M=M.concat(R)}function Q(B,ie,R){return ie||console.error("THREE.ExtrudeGeometry: vec does not exist"),B.clone().addScaledVector(ie,R)}const V=M.length,le=F.length;function Z(B,ie,R){let oe,$,me;const ee=B.x-ie.x,de=B.y-ie.y,fe=R.x-B.x,E=R.y-B.y,S=ee*ee+de*de,D=ee*E-de*fe;if(Math.abs(D)>Number.EPSILON){const Y=Math.sqrt(S),q=Math.sqrt(fe*fe+E*E),re=ie.x-de/Y,Se=ie.y+ee/Y,ye=R.x-E/q,be=R.y+fe/q,Le=((ye-re)*E-(be-Se)*fe)/(ee*E-de*fe);oe=re+ee*Le-B.x,$=Se+de*Le-B.y;const we=oe*oe+$*$;if(we<=2)return new Me(oe,$);me=Math.sqrt(we/2)}else{let Y=!1;ee>Number.EPSILON?fe>Number.EPSILON&&(Y=!0):ee<-Number.EPSILON?fe<-Number.EPSILON&&(Y=!0):Math.sign(de)===Math.sign(E)&&(Y=!0),Y?(oe=-de,$=ee,me=Math.sqrt(S)):(oe=ee,$=de,me=Math.sqrt(S/2))}return new Me(oe/me,$/me)}const te=[];for(let B=0,ie=N.length,R=ie-1,oe=B+1;B<ie;B++,R++,oe++)R===ie&&(R=0),oe===ie&&(oe=0),te[B]=Z(N[B],N[R],N[oe]);const K=[];let O,J=te.concat();for(let B=0,ie=U.length;B<ie;B++){const R=U[B];O=[];for(let oe=0,$=R.length,me=$-1,ee=oe+1;oe<$;oe++,me++,ee++)me===$&&(me=0),ee===$&&(ee=0),O[oe]=Z(R[oe],R[me],R[ee]);K.push(O),J=J.concat(O)}for(let B=0;B<g;B++){const ie=B/g,R=d*Math.cos(ie*Math.PI/2),oe=p*Math.sin(ie*Math.PI/2)+_;for(let $=0,me=N.length;$<me;$++){const ee=Q(N[$],te[$],oe);j(ee.x,ee.y,-R)}for(let $=0,me=U.length;$<me;$++){const ee=U[$];O=K[$];for(let de=0,fe=ee.length;de<fe;de++){const E=Q(ee[de],O[de],oe);j(E.x,E.y,-R)}}}const ue=p+_;for(let B=0;B<V;B++){const ie=f?Q(M[B],J[B],ue):M[B];v?(T.copy(A.normals[0]).multiplyScalar(ie.x),w.copy(A.binormals[0]).multiplyScalar(ie.y),C.copy(y[0]).add(T).add(w),j(C.x,C.y,C.z)):j(ie.x,ie.y,0)}for(let B=1;B<=h;B++)for(let ie=0;ie<V;ie++){const R=f?Q(M[ie],J[ie],ue):M[ie];v?(T.copy(A.normals[B]).multiplyScalar(R.x),w.copy(A.binormals[B]).multiplyScalar(R.y),C.copy(y[B]).add(T).add(w),j(C.x,C.y,C.z)):j(R.x,R.y,u/h*B)}for(let B=g-1;B>=0;B--){const ie=B/g,R=d*Math.cos(ie*Math.PI/2),oe=p*Math.sin(ie*Math.PI/2)+_;for(let $=0,me=N.length;$<me;$++){const ee=Q(N[$],te[$],oe);j(ee.x,ee.y,u+R)}for(let $=0,me=U.length;$<me;$++){const ee=U[$];O=K[$];for(let de=0,fe=ee.length;de<fe;de++){const E=Q(ee[de],O[de],oe);v?j(E.x,E.y+y[h-1].y,y[h-1].x+R):j(E.x,E.y,u+R)}}}k(),X();function k(){const B=i.length/3;if(f){let ie=0,R=V*ie;for(let oe=0;oe<le;oe++){const $=F[oe];G($[2]+R,$[1]+R,$[0]+R)}ie=h+g*2,R=V*ie;for(let oe=0;oe<le;oe++){const $=F[oe];G($[0]+R,$[1]+R,$[2]+R)}}else{for(let ie=0;ie<le;ie++){const R=F[ie];G(R[2],R[1],R[0])}for(let ie=0;ie<le;ie++){const R=F[ie];G(R[0]+V*h,R[1]+V*h,R[2]+V*h)}}n.addGroup(B,i.length/3-B,0)}function X(){const B=i.length/3;let ie=0;ce(N,ie),ie+=N.length;for(let R=0,oe=U.length;R<oe;R++){const $=U[R];ce($,ie),ie+=$.length}n.addGroup(B,i.length/3-B,1)}function ce(B,ie){let R=B.length;for(;--R>=0;){const oe=R;let $=R-1;$<0&&($=B.length-1);for(let me=0,ee=h+g*2;me<ee;me++){const de=V*me,fe=V*(me+1),E=ie+oe+de,S=ie+$+de,D=ie+$+fe,Y=ie+oe+fe;pe(E,S,D,Y)}}}function j(B,ie,R){l.push(B),l.push(ie),l.push(R)}function G(B,ie,R){se(B),se(ie),se(R);const oe=i.length/3,$=x.generateTopUV(n,i,oe-3,oe-2,oe-1);ae($[0]),ae($[1]),ae($[2])}function pe(B,ie,R,oe){se(B),se(ie),se(oe),se(ie),se(R),se(oe);const $=i.length/3,me=x.generateSideWallUV(n,i,$-6,$-3,$-2,$-1);ae(me[0]),ae(me[1]),ae(me[3]),ae(me[1]),ae(me[2]),ae(me[3])}function se(B){i.push(l[B*3+0]),i.push(l[B*3+1]),i.push(l[B*3+2])}function ae(B){r.push(B.x),r.push(B.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return o_(t,n,e)}static fromJSON(e,t){const n=[];for(let r=0,o=e.shapes.length;r<o;r++){const a=t[e.shapes[r]];n.push(a)}const i=e.options.extrudePath;return i!==void 0&&(e.options.extrudePath=new hl[i.type]().fromJSON(i)),new Ul(n,e.options)}}const s_={generateTopUV:function(s,e,t,n,i){const r=e[t*3],o=e[t*3+1],a=e[n*3],l=e[n*3+1],c=e[i*3],h=e[i*3+1];return[new Me(r,o),new Me(a,l),new Me(c,h)]},generateSideWallUV:function(s,e,t,n,i,r){const o=e[t*3],a=e[t*3+1],l=e[t*3+2],c=e[n*3],h=e[n*3+1],u=e[n*3+2],f=e[i*3],d=e[i*3+1],p=e[i*3+2],_=e[r*3],g=e[r*3+1],m=e[r*3+2];return Math.abs(a-h)<Math.abs(o-c)?[new Me(o,1-l),new Me(c,1-u),new Me(f,1-p),new Me(_,1-m)]:[new Me(a,1-l),new Me(h,1-u),new Me(d,1-p),new Me(g,1-m)]}};function o_(s,e,t){if(t.shapes=[],Array.isArray(s))for(let n=0,i=s.length;n<i;n++){const r=s[n];t.shapes.push(r.uuid)}else t.shapes.push(s.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class Dl extends Fi{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Dl(e.radius,e.detail)}}class mo extends Fi{constructor(e=1,t=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],i=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,i,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new mo(e.radius,e.detail)}}class yi extends nt{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const r=e/2,o=t/2,a=Math.floor(n),l=Math.floor(i),c=a+1,h=l+1,u=e/a,f=t/l,d=[],p=[],_=[],g=[];for(let m=0;m<h;m++){const x=m*f-o;for(let y=0;y<c;y++){const v=y*u-r;p.push(v,-x,0),_.push(0,0,1),g.push(y/a),g.push(1-m/l)}}for(let m=0;m<l;m++)for(let x=0;x<a;x++){const y=x+c*m,v=x+c*(m+1),A=x+1+c*(m+1),w=x+1+c*m;d.push(y,v,w),d.push(v,A,w)}this.setIndex(d),this.setAttribute("position",new Ge(p,3)),this.setAttribute("normal",new Ge(_,3)),this.setAttribute("uv",new Ge(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new yi(e.width,e.height,e.widthSegments,e.heightSegments)}}class Fl extends nt{constructor(e=.5,t=1,n=32,i=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:i,thetaStart:r,thetaLength:o},n=Math.max(3,n),i=Math.max(1,i);const a=[],l=[],c=[],h=[];let u=e;const f=(t-e)/i,d=new I,p=new Me;for(let _=0;_<=i;_++){for(let g=0;g<=n;g++){const m=r+g/n*o;d.x=u*Math.cos(m),d.y=u*Math.sin(m),l.push(d.x,d.y,d.z),c.push(0,0,1),p.x=(d.x/t+1)/2,p.y=(d.y/t+1)/2,h.push(p.x,p.y)}u+=f}for(let _=0;_<i;_++){const g=_*(n+1);for(let m=0;m<n;m++){const x=m+g,y=x,v=x+n+1,A=x+n+2,w=x+1;a.push(y,v,w),a.push(v,A,w)}}this.setIndex(a),this.setAttribute("position",new Ge(l,3)),this.setAttribute("normal",new Ge(c,3)),this.setAttribute("uv",new Ge(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Fl(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class Nl extends nt{constructor(e=new ar([new Me(0,.5),new Me(-.5,-.5),new Me(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};const n=[],i=[],r=[],o=[];let a=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let h=0;h<e.length;h++)c(e[h]),this.addGroup(a,l,h),a+=l,l=0;this.setIndex(n),this.setAttribute("position",new Ge(i,3)),this.setAttribute("normal",new Ge(r,3)),this.setAttribute("uv",new Ge(o,2));function c(h){const u=i.length/3,f=h.extractPoints(t);let d=f.shape;const p=f.holes;Jn.isClockWise(d)===!1&&(d=d.reverse());for(let g=0,m=p.length;g<m;g++){const x=p[g];Jn.isClockWise(x)===!0&&(p[g]=x.reverse())}const _=Jn.triangulateShape(d,p);for(let g=0,m=p.length;g<m;g++){const x=p[g];d=d.concat(x)}for(let g=0,m=d.length;g<m;g++){const x=d[g];i.push(x.x,x.y,0),r.push(0,0,1),o.push(x.x,x.y)}for(let g=0,m=_.length;g<m;g++){const x=_[g],y=x[0]+u,v=x[1]+u,A=x[2]+u;n.push(y,v,A),l+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes;return a_(t,e)}static fromJSON(e,t){const n=[];for(let i=0,r=e.shapes.length;i<r;i++){const o=t[e.shapes[i]];n.push(o)}return new Nl(n,e.curveSegments)}}function a_(s,e){if(e.shapes=[],Array.isArray(s))for(let t=0,n=s.length;t<n;t++){const i=s[t];e.shapes.push(i.uuid)}else e.shapes.push(s.uuid);return e}class go extends nt{constructor(e=1,t=32,n=16,i=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(o+a,Math.PI);let c=0;const h=[],u=new I,f=new I,d=[],p=[],_=[],g=[];for(let m=0;m<=n;m++){const x=[],y=m/n;let v=0;m===0&&o===0?v=.5/t:m===n&&l===Math.PI&&(v=-.5/t);for(let A=0;A<=t;A++){const w=A/t;u.x=-e*Math.cos(i+w*r)*Math.sin(o+y*a),u.y=e*Math.cos(o+y*a),u.z=e*Math.sin(i+w*r)*Math.sin(o+y*a),p.push(u.x,u.y,u.z),f.copy(u).normalize(),_.push(f.x,f.y,f.z),g.push(w+v,1-y),x.push(c++)}h.push(x)}for(let m=0;m<n;m++)for(let x=0;x<t;x++){const y=h[m][x+1],v=h[m][x],A=h[m+1][x],w=h[m+1][x+1];(m!==0||o>0)&&d.push(y,v,w),(m!==n-1||l<Math.PI)&&d.push(v,A,w)}this.setIndex(d),this.setAttribute("position",new Ge(p,3)),this.setAttribute("normal",new Ge(_,3)),this.setAttribute("uv",new Ge(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new go(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Ol extends Fi{constructor(e=1,t=0){const n=[1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],i=[2,1,0,0,3,2,1,3,0,2,3,1];super(n,i,e,t),this.type="TetrahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Ol(e.radius,e.detail)}}class Bl extends nt{constructor(e=1,t=.4,n=12,i=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:i,arc:r},n=Math.floor(n),i=Math.floor(i);const o=[],a=[],l=[],c=[],h=new I,u=new I,f=new I;for(let d=0;d<=n;d++)for(let p=0;p<=i;p++){const _=p/i*r,g=d/n*Math.PI*2;u.x=(e+t*Math.cos(g))*Math.cos(_),u.y=(e+t*Math.cos(g))*Math.sin(_),u.z=t*Math.sin(g),a.push(u.x,u.y,u.z),h.x=e*Math.cos(_),h.y=e*Math.sin(_),f.subVectors(u,h).normalize(),l.push(f.x,f.y,f.z),c.push(p/i),c.push(d/n)}for(let d=1;d<=n;d++)for(let p=1;p<=i;p++){const _=(i+1)*d+p-1,g=(i+1)*(d-1)+p-1,m=(i+1)*(d-1)+p,x=(i+1)*d+p;o.push(_,g,x),o.push(g,m,x)}this.setIndex(o),this.setAttribute("position",new Ge(a,3)),this.setAttribute("normal",new Ge(l,3)),this.setAttribute("uv",new Ge(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Bl(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class kl extends nt{constructor(e=1,t=.4,n=64,i=8,r=2,o=3){super(),this.type="TorusKnotGeometry",this.parameters={radius:e,tube:t,tubularSegments:n,radialSegments:i,p:r,q:o},n=Math.floor(n),i=Math.floor(i);const a=[],l=[],c=[],h=[],u=new I,f=new I,d=new I,p=new I,_=new I,g=new I,m=new I;for(let y=0;y<=n;++y){const v=y/n*r*Math.PI*2;x(v,r,o,e,d),x(v+.01,r,o,e,p),g.subVectors(p,d),m.addVectors(p,d),_.crossVectors(g,m),m.crossVectors(_,g),_.normalize(),m.normalize();for(let A=0;A<=i;++A){const w=A/i*Math.PI*2,T=-t*Math.cos(w),C=t*Math.sin(w);u.x=d.x+(T*m.x+C*_.x),u.y=d.y+(T*m.y+C*_.y),u.z=d.z+(T*m.z+C*_.z),l.push(u.x,u.y,u.z),f.subVectors(u,d).normalize(),c.push(f.x,f.y,f.z),h.push(y/n),h.push(A/i)}}for(let y=1;y<=n;y++)for(let v=1;v<=i;v++){const A=(i+1)*(y-1)+(v-1),w=(i+1)*y+(v-1),T=(i+1)*y+v,C=(i+1)*(y-1)+v;a.push(A,w,C),a.push(w,T,C)}this.setIndex(a),this.setAttribute("position",new Ge(l,3)),this.setAttribute("normal",new Ge(c,3)),this.setAttribute("uv",new Ge(h,2));function x(y,v,A,w,T){const C=Math.cos(y),b=Math.sin(y),M=A/v*y,U=Math.cos(M);T.x=w*(2+U)*.5*C,T.y=w*(2+U)*b*.5,T.z=w*Math.sin(M)*.5}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new kl(e.radius,e.tube,e.tubularSegments,e.radialSegments,e.p,e.q)}}class zl extends nt{constructor(e=new Zh(new I(-1,-1,0),new I(-1,1,0),new I(1,1,0)),t=64,n=1,i=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:i,closed:r};const o=e.computeFrenetFrames(t,r);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;const a=new I,l=new I,c=new Me;let h=new I;const u=[],f=[],d=[],p=[];_(),this.setIndex(p),this.setAttribute("position",new Ge(u,3)),this.setAttribute("normal",new Ge(f,3)),this.setAttribute("uv",new Ge(d,2));function _(){for(let y=0;y<t;y++)g(y);g(r===!1?t:0),x(),m()}function g(y){h=e.getPointAt(y/t,h);const v=o.normals[y],A=o.binormals[y];for(let w=0;w<=i;w++){const T=w/i*Math.PI*2,C=Math.sin(T),b=-Math.cos(T);l.x=b*v.x+C*A.x,l.y=b*v.y+C*A.y,l.z=b*v.z+C*A.z,l.normalize(),f.push(l.x,l.y,l.z),a.x=h.x+n*l.x,a.y=h.y+n*l.y,a.z=h.z+n*l.z,u.push(a.x,a.y,a.z)}}function m(){for(let y=1;y<=t;y++)for(let v=1;v<=i;v++){const A=(i+1)*(y-1)+(v-1),w=(i+1)*y+(v-1),T=(i+1)*y+v,C=(i+1)*(y-1)+v;p.push(A,w,C),p.push(w,T,C)}}function x(){for(let y=0;y<=t;y++)for(let v=0;v<=i;v++)c.x=y/t,c.y=v/i,d.push(c.x,c.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new zl(new hl[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}}class Kh extends nt{constructor(e=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:e},e!==null){const t=[],n=new Set,i=new I,r=new I;if(e.index!==null){const o=e.attributes.position,a=e.index;let l=e.groups;l.length===0&&(l=[{start:0,count:a.count,materialIndex:0}]);for(let c=0,h=l.length;c<h;++c){const u=l[c],f=u.start,d=u.count;for(let p=f,_=f+d;p<_;p+=3)for(let g=0;g<3;g++){const m=a.getX(p+g),x=a.getX(p+(g+1)%3);i.fromBufferAttribute(o,m),r.fromBufferAttribute(o,x),ff(i,r,n)===!0&&(t.push(i.x,i.y,i.z),t.push(r.x,r.y,r.z))}}}else{const o=e.attributes.position;for(let a=0,l=o.count/3;a<l;a++)for(let c=0;c<3;c++){const h=3*a+c,u=3*a+(c+1)%3;i.fromBufferAttribute(o,h),r.fromBufferAttribute(o,u),ff(i,r,n)===!0&&(t.push(i.x,i.y,i.z),t.push(r.x,r.y,r.z))}}this.setAttribute("position",new Ge(t,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}function ff(s,e,t){const n=`${s.x},${s.y},${s.z}-${e.x},${e.y},${e.z}`,i=`${e.x},${e.y},${e.z}-${s.x},${s.y},${s.z}`;return t.has(n)===!0||t.has(i)===!0?!1:(t.add(n),t.add(i),!0)}var df=Object.freeze({__proto__:null,BoxGeometry:_r,CapsuleGeometry:Cl,CircleGeometry:Rl,ConeGeometry:Pl,CylinderGeometry:is,DodecahedronGeometry:Il,EdgesGeometry:Op,ExtrudeGeometry:Ul,IcosahedronGeometry:Dl,LatheGeometry:po,OctahedronGeometry:mo,PlaneGeometry:yi,PolyhedronGeometry:Fi,RingGeometry:Fl,ShapeGeometry:Nl,SphereGeometry:go,TetrahedronGeometry:Ol,TorusGeometry:Bl,TorusKnotGeometry:kl,TubeGeometry:zl,WireframeGeometry:Kh});class Vp extends Kt{constructor(e){super(),this.isShadowMaterial=!0,this.type="ShadowMaterial",this.color=new Fe(0),this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.fog=e.fog,this}}class Gp extends Pn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Jh extends Kt{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Fe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Fe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ui,this.normalScale=new Me(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new wn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Hp extends Jh{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Me(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Qe(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Fe(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Fe(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Fe(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class Wp extends Kt{constructor(e){super(),this.isMeshPhongMaterial=!0,this.type="MeshPhongMaterial",this.color=new Fe(16777215),this.specular=new Fe(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Fe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ui,this.normalScale=new Me(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new wn,this.combine=co,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.specular.copy(e.specular),this.shininess=e.shininess,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Xp extends Kt{constructor(e){super(),this.isMeshToonMaterial=!0,this.defines={TOON:""},this.type="MeshToonMaterial",this.color=new Fe(16777215),this.map=null,this.gradientMap=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Fe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ui,this.normalScale=new Me(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.gradientMap=e.gradientMap,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.alphaMap=e.alphaMap,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}class Yp extends Kt{constructor(e){super(),this.isMeshNormalMaterial=!0,this.type="MeshNormalMaterial",this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ui,this.normalScale=new Me(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(e)}copy(e){return super.copy(e),this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.flatShading=e.flatShading,this}}class qp extends Kt{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Fe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Fe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ui,this.normalScale=new Me(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new wn,this.combine=co,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Vl extends Kt{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=op,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Gl extends Kt{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Zp extends Kt{constructor(e){super(),this.isMeshMatcapMaterial=!0,this.defines={MATCAP:""},this.type="MeshMatcapMaterial",this.color=new Fe(16777215),this.matcap=null,this.map=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ui,this.normalScale=new Me(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={MATCAP:""},this.color.copy(e.color),this.matcap=e.matcap,this.map=e.map,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.alphaMap=e.alphaMap,this.flatShading=e.flatShading,this.fog=e.fog,this}}class jp extends rn{constructor(e){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(e)}copy(e){return super.copy(e),this.scale=e.scale,this.dashSize=e.dashSize,this.gapSize=e.gapSize,this}}function ir(s,e,t){return!s||!t&&s.constructor===e?s:typeof e.BYTES_PER_ELEMENT=="number"?new e(s):Array.prototype.slice.call(s)}function Kp(s){return ArrayBuffer.isView(s)&&!(s instanceof DataView)}function Jp(s){function e(i,r){return s[i]-s[r]}const t=s.length,n=new Array(t);for(let i=0;i!==t;++i)n[i]=i;return n.sort(e),n}function hh(s,e,t){const n=s.length,i=new s.constructor(n);for(let r=0,o=0;o!==n;++r){const a=t[r]*e;for(let l=0;l!==e;++l)i[o++]=s[a+l]}return i}function Qh(s,e,t,n){let i=1,r=s[0];for(;r!==void 0&&r[n]===void 0;)r=s[i++];if(r===void 0)return;let o=r[n];if(o!==void 0)if(Array.isArray(o))do o=r[n],o!==void 0&&(e.push(r.time),t.push.apply(t,o)),r=s[i++];while(r!==void 0);else if(o.toArray!==void 0)do o=r[n],o!==void 0&&(e.push(r.time),o.toArray(t,t.length)),r=s[i++];while(r!==void 0);else do o=r[n],o!==void 0&&(e.push(r.time),t.push(o)),r=s[i++];while(r!==void 0)}function l_(s,e,t,n,i=30){const r=s.clone();r.name=e;const o=[];for(let l=0;l<r.tracks.length;++l){const c=r.tracks[l],h=c.getValueSize(),u=[],f=[];for(let d=0;d<c.times.length;++d){const p=c.times[d]*i;if(!(p<t||p>=n)){u.push(c.times[d]);for(let _=0;_<h;++_)f.push(c.values[d*h+_])}}u.length!==0&&(c.times=ir(u,c.times.constructor),c.values=ir(f,c.values.constructor),o.push(c))}r.tracks=o;let a=1/0;for(let l=0;l<r.tracks.length;++l)a>r.tracks[l].times[0]&&(a=r.tracks[l].times[0]);for(let l=0;l<r.tracks.length;++l)r.tracks[l].shift(-1*a);return r.resetDuration(),r}function c_(s,e=0,t=s,n=30){n<=0&&(n=30);const i=t.tracks.length,r=e/n;for(let o=0;o<i;++o){const a=t.tracks[o],l=a.ValueTypeName;if(l==="bool"||l==="string")continue;const c=s.tracks.find(function(m){return m.name===a.name&&m.ValueTypeName===l});if(c===void 0)continue;let h=0;const u=a.getValueSize();a.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline&&(h=u/3);let f=0;const d=c.getValueSize();c.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline&&(f=d/3);const p=a.times.length-1;let _;if(r<=a.times[0]){const m=h,x=u-h;_=a.values.slice(m,x)}else if(r>=a.times[p]){const m=p*u+h,x=m+u-h;_=a.values.slice(m,x)}else{const m=a.createInterpolant(),x=h,y=u-h;m.evaluate(r),_=m.resultBuffer.slice(x,y)}l==="quaternion"&&new Ot().fromArray(_).normalize().conjugate().toArray(_);const g=c.times.length;for(let m=0;m<g;++m){const x=m*d+f;if(l==="quaternion")Ot.multiplyQuaternionsFlat(c.values,x,_,0,c.values,x);else{const y=d-f*2;for(let v=0;v<y;++v)c.values[x+v]-=_[v]}}}return s.blendMode=Lh,s}const h_={convertArray:ir,isTypedArray:Kp,getKeyframeOrder:Jp,sortedArray:hh,flattenJSON:Qh,subclip:l_,makeClipAdditive:c_};class _o{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let n=this._cachedIndex,i=t[n],r=t[n-1];e:{t:{let o;n:{i:if(!(e<i)){for(let a=n+2;;){if(i===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=i,i=t[++n],e<i)break t}o=t.length;break n}if(!(e>=r)){const a=t[1];e<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(i=r,r=t[--n-1],e>=r)break t}o=n,n=0;break n}break e}for(;n<o;){const a=n+o>>>1;e<t[a]?o=a:n=a+1}if(i=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,i)}return this.interpolate_(n,r,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=e*i;for(let o=0;o!==i;++o)t[o]=n[r+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}}class Qp extends _o{constructor(e,t,n,i){super(e,t,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:er,endingEnd:er}}intervalChanged_(e,t,n){const i=this.parameterPositions;let r=e-2,o=e+1,a=i[r],l=i[o];if(a===void 0)switch(this.getSettings_().endingStart){case tr:r=e,a=2*t-n;break;case qs:r=i.length-2,a=t+i[r]-i[r+1];break;default:r=e,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case tr:o=e,l=2*n-t;break;case qs:o=1,l=n+i[1]-i[0];break;default:o=e-1,l=t}const c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(e,t,n,i){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=this._offsetPrev,u=this._offsetNext,f=this._weightPrev,d=this._weightNext,p=(n-t)/(i-t),_=p*p,g=_*p,m=-f*g+2*f*_-f*p,x=(1+f)*g+(-1.5-2*f)*_+(-.5+f)*p+1,y=(-1-d)*g+(1.5+d)*_+.5*p,v=d*g-d*_;for(let A=0;A!==a;++A)r[A]=m*o[h+A]+x*o[c+A]+y*o[l+A]+v*o[u+A];return r}}class $h extends _o{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=(n-t)/(i-t),u=1-h;for(let f=0;f!==a;++f)r[f]=o[c+f]*u+o[l+f]*h;return r}}class $p extends _o{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}}class zn{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=ir(t,this.TimeBufferType),this.values=ir(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:ir(e.times,Array),values:ir(e.values,Array)};const i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new $p(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new $h(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Qp(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case Ys:t=this.InterpolantFactoryMethodDiscrete;break;case al:t=this.InterpolantFactoryMethodLinear;break;case Sa:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Ys;case this.InterpolantFactoryMethodLinear:return al;case this.InterpolantFactoryMethodSmooth:return Sa}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e}return this}trim(e,t){const n=this.times,i=n.length;let r=0,o=i-1;for(;r!==i&&n[r]<e;)++r;for(;o!==-1&&n[o]>t;)--o;if(++o,r!==0||o!==i){r>=o&&(o=Math.max(o,1),r=o-1);const a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);const n=this.times,i=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){const l=n[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(i!==void 0&&Kp(i))for(let a=0,l=i.length;a!==l;++a){const c=i[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===Sa,r=e.length-1;let o=1;for(let a=1;a<r;++a){let l=!1;const c=e[a],h=e[a+1];if(c!==h&&(a!==1||c!==e[0]))if(i)l=!0;else{const u=a*n,f=u-n,d=u+n;for(let p=0;p!==n;++p){const _=t[u+p];if(_!==t[f+p]||_!==t[d+p]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];const u=a*n,f=o*n;for(let d=0;d!==n;++d)t[f+d]=t[u+d]}++o}}if(r>0){e[o]=e[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)t[l+c]=t[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,i}}zn.prototype.TimeBufferType=Float32Array;zn.prototype.ValueBufferType=Float32Array;zn.prototype.DefaultInterpolation=al;class vr extends zn{constructor(e,t,n){super(e,t,n)}}vr.prototype.ValueTypeName="bool";vr.prototype.ValueBufferType=Array;vr.prototype.DefaultInterpolation=Ys;vr.prototype.InterpolantFactoryMethodLinear=void 0;vr.prototype.InterpolantFactoryMethodSmooth=void 0;class eu extends zn{}eu.prototype.ValueTypeName="color";class io extends zn{}io.prototype.ValueTypeName="number";class em extends _o{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-t)/(i-t);let c=e*a;for(let h=c+a;c!==h;c+=4)Ot.slerpFlat(r,0,o,c-a,o,c,l);return r}}class vo extends zn{InterpolantFactoryMethodLinear(e){return new em(this.times,this.values,this.getValueSize(),e)}}vo.prototype.ValueTypeName="quaternion";vo.prototype.InterpolantFactoryMethodSmooth=void 0;class yr extends zn{constructor(e,t,n){super(e,t,n)}}yr.prototype.ValueTypeName="string";yr.prototype.ValueBufferType=Array;yr.prototype.DefaultInterpolation=Ys;yr.prototype.InterpolantFactoryMethodLinear=void 0;yr.prototype.InterpolantFactoryMethodSmooth=void 0;class ro extends zn{}ro.prototype.ValueTypeName="vector";class so{constructor(e="",t=-1,n=[],i=yl){this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=bn(),this.duration<0&&this.resetDuration()}static parse(e){const t=[],n=e.tracks,i=1/(e.fps||1);for(let o=0,a=n.length;o!==a;++o)t.push(f_(n[o]).scale(i));const r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r}static toJSON(e){const t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode};for(let r=0,o=n.length;r!==o;++r)t.push(zn.toJSON(n[r]));return i}static CreateFromMorphTargetSequence(e,t,n,i){const r=t.length,o=[];for(let a=0;a<r;a++){let l=[],c=[];l.push((a+r-1)%r,a,(a+1)%r),c.push(0,1,0);const h=Jp(l);l=hh(l,1,h),c=hh(c,1,h),!i&&l[0]===0&&(l.push(r),c.push(c[0])),o.push(new io(".morphTargetInfluences["+t[a].name+"]",l,c).scale(1/n))}return new this(e,-1,o)}static findByName(e,t){let n=e;if(!Array.isArray(e)){const i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){const i={},r=/^([\w-]*?)([\d]+)$/;for(let a=0,l=e.length;a<l;a++){const c=e[a],h=c.name.match(r);if(h&&h.length>1){const u=h[1];let f=i[u];f||(i[u]=f=[]),f.push(c)}}const o=[];for(const a in i)o.push(this.CreateFromMorphTargetSequence(a,i[a],t,n));return o}static parseAnimation(e,t){if(!e)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;const n=function(u,f,d,p,_){if(d.length!==0){const g=[],m=[];Qh(d,g,m,p),g.length!==0&&_.push(new u(f,g,m))}},i=[],r=e.name||"default",o=e.fps||30,a=e.blendMode;let l=e.length||-1;const c=e.hierarchy||[];for(let u=0;u<c.length;u++){const f=c[u].keys;if(!(!f||f.length===0))if(f[0].morphTargets){const d={};let p;for(p=0;p<f.length;p++)if(f[p].morphTargets)for(let _=0;_<f[p].morphTargets.length;_++)d[f[p].morphTargets[_]]=-1;for(const _ in d){const g=[],m=[];for(let x=0;x!==f[p].morphTargets.length;++x){const y=f[p];g.push(y.time),m.push(y.morphTarget===_?1:0)}i.push(new io(".morphTargetInfluence["+_+"]",g,m))}l=d.length*o}else{const d=".bones["+t[u].name+"]";n(ro,d+".position",f,"pos",i),n(vo,d+".quaternion",f,"rot",i),n(ro,d+".scale",f,"scl",i)}}return i.length===0?null:new this(r,l,i,a)}resetDuration(){const e=this.tracks;let t=0;for(let n=0,i=e.length;n!==i;++n){const r=this.tracks[n];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let t=0;t<this.tracks.length;t++)e.push(this.tracks[t].clone());return new this.constructor(this.name,this.duration,e,this.blendMode)}toJSON(){return this.constructor.toJSON(this)}}function u_(s){switch(s.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return io;case"vector":case"vector2":case"vector3":case"vector4":return ro;case"color":return eu;case"quaternion":return vo;case"bool":case"boolean":return vr;case"string":return yr}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+s)}function f_(s){if(s.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=u_(s.type);if(s.times===void 0){const t=[],n=[];Qh(s.keys,t,n,"value"),s.times=t,s.values=n}return e.parse!==void 0?e.parse(s):new e(s.name,s.times,s.values,s.interpolation)}const hi={enabled:!1,files:{},add:function(s,e){this.enabled!==!1&&(this.files[s]=e)},get:function(s){if(this.enabled!==!1)return this.files[s]},remove:function(s){delete this.files[s]},clear:function(){this.files={}}};class tu{constructor(e,t,n){const i=this;let r=!1,o=0,a=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(h){a++,r===!1&&i.onStart!==void 0&&i.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,i.onProgress!==void 0&&i.onProgress(h,o,a),o===a&&(r=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){const u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,f=c.length;u<f;u+=2){const d=c[u],p=c[u+1];if(d.global&&(d.lastIndex=0),d.test(h))return p}return null}}}const tm=new tu;class mn{constructor(e){this.manager=e!==void 0?e:tm,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const n=this;return new Promise(function(i,r){n.load(e,i,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}mn.DEFAULT_MATERIAL_NAME="__DEFAULT";const ai={};class d_ extends Error{constructor(e,t){super(e),this.response=t}}class _i extends mn{constructor(e){super(e)}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=hi.get(e);if(r!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0),r;if(ai[e]!==void 0){ai[e].push({onLoad:t,onProgress:n,onError:i});return}ai[e]=[],ai[e].push({onLoad:t,onProgress:n,onError:i});const o=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),a=this.mimeType,l=this.responseType;fetch(o).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;const h=ai[e],u=c.body.getReader(),f=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),d=f?parseInt(f):0,p=d!==0;let _=0;const g=new ReadableStream({start(m){x();function x(){u.read().then(({done:y,value:v})=>{if(y)m.close();else{_+=v.byteLength;const A=new ProgressEvent("progress",{lengthComputable:p,loaded:_,total:d});for(let w=0,T=h.length;w<T;w++){const C=h[w];C.onProgress&&C.onProgress(A)}m.enqueue(v),x()}},y=>{m.error(y)})}}});return new Response(g)}else throw new d_(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(h=>new DOMParser().parseFromString(h,a));case"json":return c.json();default:if(a===void 0)return c.text();{const u=/charset="?([^;"\s]*)"?/i.exec(a),f=u&&u[1]?u[1].toLowerCase():void 0,d=new TextDecoder(f);return c.arrayBuffer().then(p=>d.decode(p))}}}).then(c=>{hi.add(e,c);const h=ai[e];delete ai[e];for(let u=0,f=h.length;u<f;u++){const d=h[u];d.onLoad&&d.onLoad(c)}}).catch(c=>{const h=ai[e];if(h===void 0)throw this.manager.itemError(e),c;delete ai[e];for(let u=0,f=h.length;u<f;u++){const d=h[u];d.onError&&d.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}}class p_ extends mn{constructor(e){super(e)}load(e,t,n,i){const r=this,o=new _i(this.manager);o.setPath(this.path),o.setRequestHeader(this.requestHeader),o.setWithCredentials(this.withCredentials),o.load(e,function(a){try{t(r.parse(JSON.parse(a)))}catch(l){i?i(l):console.error(l),r.manager.itemError(e)}},n,i)}parse(e){const t=[];for(let n=0;n<e.length;n++){const i=so.parse(e[n]);t.push(i)}return t}}class m_ extends mn{constructor(e){super(e)}load(e,t,n,i){const r=this,o=[],a=new Tl,l=new _i(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(r.withCredentials);let c=0;function h(u){l.load(e[u],function(f){const d=r.parse(f,!0);o[u]={width:d.width,height:d.height,format:d.format,mipmaps:d.mipmaps},c+=1,c===6&&(d.mipmapCount===1&&(a.minFilter=At),a.image=o,a.format=d.format,a.needsUpdate=!0,t&&t(a))},n,i)}if(Array.isArray(e))for(let u=0,f=e.length;u<f;++u)h(u);else l.load(e,function(u){const f=r.parse(u,!0);if(f.isCubemap){const d=f.mipmaps.length/f.mipmapCount;for(let p=0;p<d;p++){o[p]={mipmaps:[]};for(let _=0;_<f.mipmapCount;_++)o[p].mipmaps.push(f.mipmaps[p*f.mipmapCount+_]),o[p].format=f.format,o[p].width=f.width,o[p].height=f.height}a.image=o}else a.image.width=f.width,a.image.height=f.height,a.mipmaps=f.mipmaps;f.mipmapCount===1&&(a.minFilter=At),a.format=f.format,a.needsUpdate=!0,t&&t(a)},n,i);return a}}class oo extends mn{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,o=hi.get(e);if(o!==void 0)return r.manager.itemStart(e),setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0),o;const a=Js("img");function l(){h(),hi.add(e,this),t&&t(this),r.manager.itemEnd(e)}function c(u){h(),i&&i(u),r.manager.itemError(e),r.manager.itemEnd(e)}function h(){a.removeEventListener("load",l,!1),a.removeEventListener("error",c,!1)}return a.addEventListener("load",l,!1),a.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),r.manager.itemStart(e),a.src=e,a}}class g_ extends mn{constructor(e){super(e)}load(e,t,n,i){const r=new fo;r.colorSpace=$t;const o=new oo(this.manager);o.setCrossOrigin(this.crossOrigin),o.setPath(this.path);let a=0;function l(c){o.load(e[c],function(h){r.images[c]=h,a++,a===6&&(r.needsUpdate=!0,t&&t(r))},void 0,i)}for(let c=0;c<e.length;++c)l(c);return r}}class __ extends mn{constructor(e){super(e)}load(e,t,n,i){const r=this,o=new Kn,a=new _i(this.manager);return a.setResponseType("arraybuffer"),a.setRequestHeader(this.requestHeader),a.setPath(this.path),a.setWithCredentials(r.withCredentials),a.load(e,function(l){let c;try{c=r.parse(l)}catch(h){if(i!==void 0)i(h);else{console.error(h);return}}c.image!==void 0?o.image=c.image:c.data!==void 0&&(o.image.width=c.width,o.image.height=c.height,o.image.data=c.data),o.wrapS=c.wrapS!==void 0?c.wrapS:Rn,o.wrapT=c.wrapT!==void 0?c.wrapT:Rn,o.magFilter=c.magFilter!==void 0?c.magFilter:At,o.minFilter=c.minFilter!==void 0?c.minFilter:At,o.anisotropy=c.anisotropy!==void 0?c.anisotropy:1,c.colorSpace!==void 0&&(o.colorSpace=c.colorSpace),c.flipY!==void 0&&(o.flipY=c.flipY),c.format!==void 0&&(o.format=c.format),c.type!==void 0&&(o.type=c.type),c.mipmaps!==void 0&&(o.mipmaps=c.mipmaps,o.minFilter=Zn),c.mipmapCount===1&&(o.minFilter=At),c.generateMipmaps!==void 0&&(o.generateMipmaps=c.generateMipmaps),o.needsUpdate=!0,t&&t(o,c)},n,i),o}}class v_ extends mn{constructor(e){super(e)}load(e,t,n,i){const r=new Mt,o=new oo(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(e,function(a){r.image=a,r.needsUpdate=!0,t!==void 0&&t(r)},n,i),r}}class Ni extends ut{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Fe(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class nm extends Ni{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ut.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Fe(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const Nc=new Ye,pf=new I,mf=new I;class nu{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Me(512,512),this.map=null,this.mapPass=null,this.matrix=new Ye,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ns,this._frameExtents=new Me(1,1),this._viewportCount=1,this._viewports=[new tt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;pf.setFromMatrixPosition(e.matrixWorld),t.position.copy(pf),mf.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(mf),t.updateMatrixWorld(),Nc.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Nc),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Nc)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class y_ extends nu{constructor(){super(new Rt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(e){const t=this.camera,n=Qr*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height,r=e.distance||t.far;(n!==t.fov||i!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=i,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class im extends Ni{constructor(e,t,n=0,i=Math.PI/3,r=0,o=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(ut.DEFAULT_UP),this.updateMatrix(),this.target=new ut,this.distance=n,this.angle=i,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new y_}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}const gf=new Ye,Ts=new I,Oc=new I;class x_ extends nu{constructor(){super(new Rt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Me(4,2),this._viewportCount=6,this._viewports=[new tt(2,1,1,1),new tt(0,1,1,1),new tt(3,1,1,1),new tt(1,1,1,1),new tt(3,0,1,1),new tt(1,0,1,1)],this._cubeDirections=[new I(1,0,0),new I(-1,0,0),new I(0,0,1),new I(0,0,-1),new I(0,1,0),new I(0,-1,0)],this._cubeUps=[new I(0,1,0),new I(0,1,0),new I(0,1,0),new I(0,1,0),new I(0,0,1),new I(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,i=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Ts.setFromMatrixPosition(e.matrixWorld),n.position.copy(Ts),Oc.copy(n.position),Oc.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(Oc),n.updateMatrixWorld(),i.makeTranslation(-Ts.x,-Ts.y,-Ts.z),gf.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(gf)}}class rm extends Ni{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new x_}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class lr extends uo{constructor(e=-1,t=1,n=1,i=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-e,o=n+e,a=i+t,l=i-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class M_ extends nu{constructor(){super(new lr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class sm extends Ni{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ut.DEFAULT_UP),this.updateMatrix(),this.target=new ut,this.shadow=new M_}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class om extends Ni{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class am extends Ni{constructor(e,t,n=10,i=10){super(e,t),this.isRectAreaLight=!0,this.type="RectAreaLight",this.width=n,this.height=i}get power(){return this.intensity*this.width*this.height*Math.PI}set power(e){this.intensity=e/(this.width*this.height*Math.PI)}copy(e){return super.copy(e),this.width=e.width,this.height=e.height,this}toJSON(e){const t=super.toJSON(e);return t.object.width=this.width,t.object.height=this.height,t}}class lm{constructor(){this.isSphericalHarmonics3=!0,this.coefficients=[];for(let e=0;e<9;e++)this.coefficients.push(new I)}set(e){for(let t=0;t<9;t++)this.coefficients[t].copy(e[t]);return this}zero(){for(let e=0;e<9;e++)this.coefficients[e].set(0,0,0);return this}getAt(e,t){const n=e.x,i=e.y,r=e.z,o=this.coefficients;return t.copy(o[0]).multiplyScalar(.282095),t.addScaledVector(o[1],.488603*i),t.addScaledVector(o[2],.488603*r),t.addScaledVector(o[3],.488603*n),t.addScaledVector(o[4],1.092548*(n*i)),t.addScaledVector(o[5],1.092548*(i*r)),t.addScaledVector(o[6],.315392*(3*r*r-1)),t.addScaledVector(o[7],1.092548*(n*r)),t.addScaledVector(o[8],.546274*(n*n-i*i)),t}getIrradianceAt(e,t){const n=e.x,i=e.y,r=e.z,o=this.coefficients;return t.copy(o[0]).multiplyScalar(.886227),t.addScaledVector(o[1],2*.511664*i),t.addScaledVector(o[2],2*.511664*r),t.addScaledVector(o[3],2*.511664*n),t.addScaledVector(o[4],2*.429043*n*i),t.addScaledVector(o[5],2*.429043*i*r),t.addScaledVector(o[6],.743125*r*r-.247708),t.addScaledVector(o[7],2*.429043*n*r),t.addScaledVector(o[8],.429043*(n*n-i*i)),t}add(e){for(let t=0;t<9;t++)this.coefficients[t].add(e.coefficients[t]);return this}addScaledSH(e,t){for(let n=0;n<9;n++)this.coefficients[n].addScaledVector(e.coefficients[n],t);return this}scale(e){for(let t=0;t<9;t++)this.coefficients[t].multiplyScalar(e);return this}lerp(e,t){for(let n=0;n<9;n++)this.coefficients[n].lerp(e.coefficients[n],t);return this}equals(e){for(let t=0;t<9;t++)if(!this.coefficients[t].equals(e.coefficients[t]))return!1;return!0}copy(e){return this.set(e.coefficients)}clone(){return new this.constructor().copy(this)}fromArray(e,t=0){const n=this.coefficients;for(let i=0;i<9;i++)n[i].fromArray(e,t+i*3);return this}toArray(e=[],t=0){const n=this.coefficients;for(let i=0;i<9;i++)n[i].toArray(e,t+i*3);return e}static getBasisAt(e,t){const n=e.x,i=e.y,r=e.z;t[0]=.282095,t[1]=.488603*i,t[2]=.488603*r,t[3]=.488603*n,t[4]=1.092548*n*i,t[5]=1.092548*i*r,t[6]=.315392*(3*r*r-1),t[7]=1.092548*n*r,t[8]=.546274*(n*n-i*i)}}class cm extends Ni{constructor(e=new lm,t=1){super(void 0,t),this.isLightProbe=!0,this.sh=e}copy(e){return super.copy(e),this.sh.copy(e.sh),this}fromJSON(e){return this.intensity=e.intensity,this.sh.fromArray(e.sh),this}toJSON(e){const t=super.toJSON(e);return t.object.sh=this.sh.toArray(),t}}class Hl extends mn{constructor(e){super(e),this.textures={}}load(e,t,n,i){const r=this,o=new _i(r.manager);o.setPath(r.path),o.setRequestHeader(r.requestHeader),o.setWithCredentials(r.withCredentials),o.load(e,function(a){try{t(r.parse(JSON.parse(a)))}catch(l){i?i(l):console.error(l),r.manager.itemError(e)}},n,i)}parse(e){const t=this.textures;function n(r){return t[r]===void 0&&console.warn("THREE.MaterialLoader: Undefined texture",r),t[r]}const i=this.createMaterialFromType(e.type);if(e.uuid!==void 0&&(i.uuid=e.uuid),e.name!==void 0&&(i.name=e.name),e.color!==void 0&&i.color!==void 0&&i.color.setHex(e.color),e.roughness!==void 0&&(i.roughness=e.roughness),e.metalness!==void 0&&(i.metalness=e.metalness),e.sheen!==void 0&&(i.sheen=e.sheen),e.sheenColor!==void 0&&(i.sheenColor=new Fe().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(i.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&i.emissive!==void 0&&i.emissive.setHex(e.emissive),e.specular!==void 0&&i.specular!==void 0&&i.specular.setHex(e.specular),e.specularIntensity!==void 0&&(i.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&i.specularColor!==void 0&&i.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(i.shininess=e.shininess),e.clearcoat!==void 0&&(i.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(i.dispersion=e.dispersion),e.iridescence!==void 0&&(i.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(i.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(i.transmission=e.transmission),e.thickness!==void 0&&(i.thickness=e.thickness),e.attenuationDistance!==void 0&&(i.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&i.attenuationColor!==void 0&&i.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(i.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(i.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(i.fog=e.fog),e.flatShading!==void 0&&(i.flatShading=e.flatShading),e.blending!==void 0&&(i.blending=e.blending),e.combine!==void 0&&(i.combine=e.combine),e.side!==void 0&&(i.side=e.side),e.shadowSide!==void 0&&(i.shadowSide=e.shadowSide),e.opacity!==void 0&&(i.opacity=e.opacity),e.transparent!==void 0&&(i.transparent=e.transparent),e.alphaTest!==void 0&&(i.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(i.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(i.depthFunc=e.depthFunc),e.depthTest!==void 0&&(i.depthTest=e.depthTest),e.depthWrite!==void 0&&(i.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(i.colorWrite=e.colorWrite),e.blendSrc!==void 0&&(i.blendSrc=e.blendSrc),e.blendDst!==void 0&&(i.blendDst=e.blendDst),e.blendEquation!==void 0&&(i.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(i.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(i.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(i.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&i.blendColor!==void 0&&i.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(i.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(i.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(i.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(i.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(i.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(i.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(i.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(i.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(i.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(i.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(i.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(i.rotation=e.rotation),e.linewidth!==void 0&&(i.linewidth=e.linewidth),e.dashSize!==void 0&&(i.dashSize=e.dashSize),e.gapSize!==void 0&&(i.gapSize=e.gapSize),e.scale!==void 0&&(i.scale=e.scale),e.polygonOffset!==void 0&&(i.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(i.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(i.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(i.dithering=e.dithering),e.alphaToCoverage!==void 0&&(i.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(i.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(i.forceSinglePass=e.forceSinglePass),e.visible!==void 0&&(i.visible=e.visible),e.toneMapped!==void 0&&(i.toneMapped=e.toneMapped),e.userData!==void 0&&(i.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?i.vertexColors=e.vertexColors>0:i.vertexColors=e.vertexColors),e.uniforms!==void 0)for(const r in e.uniforms){const o=e.uniforms[r];switch(i.uniforms[r]={},o.type){case"t":i.uniforms[r].value=n(o.value);break;case"c":i.uniforms[r].value=new Fe().setHex(o.value);break;case"v2":i.uniforms[r].value=new Me().fromArray(o.value);break;case"v3":i.uniforms[r].value=new I().fromArray(o.value);break;case"v4":i.uniforms[r].value=new tt().fromArray(o.value);break;case"m3":i.uniforms[r].value=new Je().fromArray(o.value);break;case"m4":i.uniforms[r].value=new Ye().fromArray(o.value);break;default:i.uniforms[r].value=o.value}}if(e.defines!==void 0&&(i.defines=e.defines),e.vertexShader!==void 0&&(i.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(i.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(i.glslVersion=e.glslVersion),e.extensions!==void 0)for(const r in e.extensions)i.extensions[r]=e.extensions[r];if(e.lights!==void 0&&(i.lights=e.lights),e.clipping!==void 0&&(i.clipping=e.clipping),e.size!==void 0&&(i.size=e.size),e.sizeAttenuation!==void 0&&(i.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(i.map=n(e.map)),e.matcap!==void 0&&(i.matcap=n(e.matcap)),e.alphaMap!==void 0&&(i.alphaMap=n(e.alphaMap)),e.bumpMap!==void 0&&(i.bumpMap=n(e.bumpMap)),e.bumpScale!==void 0&&(i.bumpScale=e.bumpScale),e.normalMap!==void 0&&(i.normalMap=n(e.normalMap)),e.normalMapType!==void 0&&(i.normalMapType=e.normalMapType),e.normalScale!==void 0){let r=e.normalScale;Array.isArray(r)===!1&&(r=[r,r]),i.normalScale=new Me().fromArray(r)}return e.displacementMap!==void 0&&(i.displacementMap=n(e.displacementMap)),e.displacementScale!==void 0&&(i.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(i.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(i.roughnessMap=n(e.roughnessMap)),e.metalnessMap!==void 0&&(i.metalnessMap=n(e.metalnessMap)),e.emissiveMap!==void 0&&(i.emissiveMap=n(e.emissiveMap)),e.emissiveIntensity!==void 0&&(i.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(i.specularMap=n(e.specularMap)),e.specularIntensityMap!==void 0&&(i.specularIntensityMap=n(e.specularIntensityMap)),e.specularColorMap!==void 0&&(i.specularColorMap=n(e.specularColorMap)),e.envMap!==void 0&&(i.envMap=n(e.envMap)),e.envMapRotation!==void 0&&i.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(i.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(i.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(i.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(i.lightMap=n(e.lightMap)),e.lightMapIntensity!==void 0&&(i.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(i.aoMap=n(e.aoMap)),e.aoMapIntensity!==void 0&&(i.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(i.gradientMap=n(e.gradientMap)),e.clearcoatMap!==void 0&&(i.clearcoatMap=n(e.clearcoatMap)),e.clearcoatRoughnessMap!==void 0&&(i.clearcoatRoughnessMap=n(e.clearcoatRoughnessMap)),e.clearcoatNormalMap!==void 0&&(i.clearcoatNormalMap=n(e.clearcoatNormalMap)),e.clearcoatNormalScale!==void 0&&(i.clearcoatNormalScale=new Me().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(i.iridescenceMap=n(e.iridescenceMap)),e.iridescenceThicknessMap!==void 0&&(i.iridescenceThicknessMap=n(e.iridescenceThicknessMap)),e.transmissionMap!==void 0&&(i.transmissionMap=n(e.transmissionMap)),e.thicknessMap!==void 0&&(i.thicknessMap=n(e.thicknessMap)),e.anisotropyMap!==void 0&&(i.anisotropyMap=n(e.anisotropyMap)),e.sheenColorMap!==void 0&&(i.sheenColorMap=n(e.sheenColorMap)),e.sheenRoughnessMap!==void 0&&(i.sheenRoughnessMap=n(e.sheenRoughnessMap)),i}setTextures(e){return this.textures=e,this}createMaterialFromType(e){return Hl.createMaterialFromType(e)}static createMaterialFromType(e){const t={ShadowMaterial:Vp,SpriteMaterial:zh,RawShaderMaterial:Gp,ShaderMaterial:Pn,PointsMaterial:Gh,MeshPhysicalMaterial:Hp,MeshStandardMaterial:Jh,MeshPhongMaterial:Wp,MeshToonMaterial:Xp,MeshNormalMaterial:Yp,MeshLambertMaterial:qp,MeshDepthMaterial:Vl,MeshDistanceMaterial:Gl,MeshBasicMaterial:vi,MeshMatcapMaterial:Zp,LineDashedMaterial:jp,LineBasicMaterial:rn,Material:Kt};return new t[e]}}class uh{static decodeText(e){if(console.warn("THREE.LoaderUtils: decodeText() has been deprecated with r165 and will be removed with r175. Use TextDecoder instead."),typeof TextDecoder<"u")return new TextDecoder().decode(e);let t="";for(let n=0,i=e.length;n<i;n++)t+=String.fromCharCode(e[n]);try{return decodeURIComponent(escape(t))}catch{return t}}static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}class Wl extends nt{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}toJSON(){const e=super.toJSON();return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}}class hm extends mn{constructor(e){super(e)}load(e,t,n,i){const r=this,o=new _i(r.manager);o.setPath(r.path),o.setRequestHeader(r.requestHeader),o.setWithCredentials(r.withCredentials),o.load(e,function(a){try{t(r.parse(JSON.parse(a)))}catch(l){i?i(l):console.error(l),r.manager.itemError(e)}},n,i)}parse(e){const t={},n={};function i(d,p){if(t[p]!==void 0)return t[p];const g=d.interleavedBuffers[p],m=r(d,g.buffer),x=Xr(g.type,m),y=new wl(x,g.stride);return y.uuid=g.uuid,t[p]=y,y}function r(d,p){if(n[p]!==void 0)return n[p];const g=d.arrayBuffers[p],m=new Uint32Array(g).buffer;return n[p]=m,m}const o=e.isInstancedBufferGeometry?new Wl:new nt,a=e.data.index;if(a!==void 0){const d=Xr(a.type,a.array);o.setIndex(new mt(d,1))}const l=e.data.attributes;for(const d in l){const p=l[d];let _;if(p.isInterleavedBufferAttribute){const g=i(e.data,p.data);_=new Sn(g,p.itemSize,p.offset,p.normalized)}else{const g=Xr(p.type,p.array),m=p.isInstancedBufferAttribute?mr:mt;_=new m(g,p.itemSize,p.normalized)}p.name!==void 0&&(_.name=p.name),p.usage!==void 0&&_.setUsage(p.usage),o.setAttribute(d,_)}const c=e.data.morphAttributes;if(c)for(const d in c){const p=c[d],_=[];for(let g=0,m=p.length;g<m;g++){const x=p[g];let y;if(x.isInterleavedBufferAttribute){const v=i(e.data,x.data);y=new Sn(v,x.itemSize,x.offset,x.normalized)}else{const v=Xr(x.type,x.array);y=new mt(v,x.itemSize,x.normalized)}x.name!==void 0&&(y.name=x.name),_.push(y)}o.morphAttributes[d]=_}e.data.morphTargetsRelative&&(o.morphTargetsRelative=!0);const u=e.data.groups||e.data.drawcalls||e.data.offsets;if(u!==void 0)for(let d=0,p=u.length;d!==p;++d){const _=u[d];o.addGroup(_.start,_.count,_.materialIndex)}const f=e.data.boundingSphere;if(f!==void 0){const d=new I;f.center!==void 0&&d.fromArray(f.center),o.boundingSphere=new It(d,f.radius)}return e.name&&(o.name=e.name),e.userData&&(o.userData=e.userData),o}}class S_ extends mn{constructor(e){super(e)}load(e,t,n,i){const r=this,o=this.path===""?uh.extractUrlBase(e):this.path;this.resourcePath=this.resourcePath||o;const a=new _i(this.manager);a.setPath(this.path),a.setRequestHeader(this.requestHeader),a.setWithCredentials(this.withCredentials),a.load(e,function(l){let c=null;try{c=JSON.parse(l)}catch(u){i!==void 0&&i(u),console.error("THREE:ObjectLoader: Can't parse "+e+".",u.message);return}const h=c.metadata;if(h===void 0||h.type===void 0||h.type.toLowerCase()==="geometry"){i!==void 0&&i(new Error("THREE.ObjectLoader: Can't load "+e)),console.error("THREE.ObjectLoader: Can't load "+e);return}r.parse(c,t)},n,i)}async loadAsync(e,t){const n=this,i=this.path===""?uh.extractUrlBase(e):this.path;this.resourcePath=this.resourcePath||i;const r=new _i(this.manager);r.setPath(this.path),r.setRequestHeader(this.requestHeader),r.setWithCredentials(this.withCredentials);const o=await r.loadAsync(e,t),a=JSON.parse(o),l=a.metadata;if(l===void 0||l.type===void 0||l.type.toLowerCase()==="geometry")throw new Error("THREE.ObjectLoader: Can't load "+e);return await n.parseAsync(a)}parse(e,t){const n=this.parseAnimations(e.animations),i=this.parseShapes(e.shapes),r=this.parseGeometries(e.geometries,i),o=this.parseImages(e.images,function(){t!==void 0&&t(c)}),a=this.parseTextures(e.textures,o),l=this.parseMaterials(e.materials,a),c=this.parseObject(e.object,r,l,a,n),h=this.parseSkeletons(e.skeletons,c);if(this.bindSkeletons(c,h),this.bindLightTargets(c),t!==void 0){let u=!1;for(const f in o)if(o[f].data instanceof HTMLImageElement){u=!0;break}u===!1&&t(c)}return c}async parseAsync(e){const t=this.parseAnimations(e.animations),n=this.parseShapes(e.shapes),i=this.parseGeometries(e.geometries,n),r=await this.parseImagesAsync(e.images),o=this.parseTextures(e.textures,r),a=this.parseMaterials(e.materials,o),l=this.parseObject(e.object,i,a,o,t),c=this.parseSkeletons(e.skeletons,l);return this.bindSkeletons(l,c),this.bindLightTargets(l),l}parseShapes(e){const t={};if(e!==void 0)for(let n=0,i=e.length;n<i;n++){const r=new ar().fromJSON(e[n]);t[r.uuid]=r}return t}parseSkeletons(e,t){const n={},i={};if(t.traverse(function(r){r.isBone&&(i[r.uuid]=r)}),e!==void 0)for(let r=0,o=e.length;r<o;r++){const a=new El().fromJSON(e[r],i);n[a.uuid]=a}return n}parseGeometries(e,t){const n={};if(e!==void 0){const i=new hm;for(let r=0,o=e.length;r<o;r++){let a;const l=e[r];switch(l.type){case"BufferGeometry":case"InstancedBufferGeometry":a=i.parse(l);break;default:l.type in df?a=df[l.type].fromJSON(l,t):console.warn(`THREE.ObjectLoader: Unsupported geometry type "${l.type}"`)}a.uuid=l.uuid,l.name!==void 0&&(a.name=l.name),l.userData!==void 0&&(a.userData=l.userData),n[l.uuid]=a}}return n}parseMaterials(e,t){const n={},i={};if(e!==void 0){const r=new Hl;r.setTextures(t);for(let o=0,a=e.length;o<a;o++){const l=e[o];n[l.uuid]===void 0&&(n[l.uuid]=r.parse(l)),i[l.uuid]=n[l.uuid]}}return i}parseAnimations(e){const t={};if(e!==void 0)for(let n=0;n<e.length;n++){const i=e[n],r=so.parse(i);t[r.uuid]=r}return t}parseImages(e,t){const n=this,i={};let r;function o(l){return n.manager.itemStart(l),r.load(l,function(){n.manager.itemEnd(l)},void 0,function(){n.manager.itemError(l),n.manager.itemEnd(l)})}function a(l){if(typeof l=="string"){const c=l,h=/^(\/\/)|([a-z]+:(\/\/)?)/i.test(c)?c:n.resourcePath+c;return o(h)}else return l.data?{data:Xr(l.type,l.data),width:l.width,height:l.height}:null}if(e!==void 0&&e.length>0){const l=new tu(t);r=new oo(l),r.setCrossOrigin(this.crossOrigin);for(let c=0,h=e.length;c<h;c++){const u=e[c],f=u.url;if(Array.isArray(f)){const d=[];for(let p=0,_=f.length;p<_;p++){const g=f[p],m=a(g);m!==null&&(m instanceof HTMLImageElement?d.push(m):d.push(new Kn(m.data,m.width,m.height)))}i[u.uuid]=new nr(d)}else{const d=a(u.url);i[u.uuid]=new nr(d)}}}return i}async parseImagesAsync(e){const t=this,n={};let i;async function r(o){if(typeof o=="string"){const a=o,l=/^(\/\/)|([a-z]+:(\/\/)?)/i.test(a)?a:t.resourcePath+a;return await i.loadAsync(l)}else return o.data?{data:Xr(o.type,o.data),width:o.width,height:o.height}:null}if(e!==void 0&&e.length>0){i=new oo(this.manager),i.setCrossOrigin(this.crossOrigin);for(let o=0,a=e.length;o<a;o++){const l=e[o],c=l.url;if(Array.isArray(c)){const h=[];for(let u=0,f=c.length;u<f;u++){const d=c[u],p=await r(d);p!==null&&(p instanceof HTMLImageElement?h.push(p):h.push(new Kn(p.data,p.width,p.height)))}n[l.uuid]=new nr(h)}else{const h=await r(l.url);n[l.uuid]=new nr(h)}}}return n}parseTextures(e,t){function n(r,o){return typeof r=="number"?r:(console.warn("THREE.ObjectLoader.parseTexture: Constant should be in numeric form.",r),o[r])}const i={};if(e!==void 0)for(let r=0,o=e.length;r<o;r++){const a=e[r];a.image===void 0&&console.warn('THREE.ObjectLoader: No "image" specified for',a.uuid),t[a.image]===void 0&&console.warn("THREE.ObjectLoader: Undefined image",a.image);const l=t[a.image],c=l.data;let h;Array.isArray(c)?(h=new fo,c.length===6&&(h.needsUpdate=!0)):(c&&c.data?h=new Kn:h=new Mt,c&&(h.needsUpdate=!0)),h.source=l,h.uuid=a.uuid,a.name!==void 0&&(h.name=a.name),a.mapping!==void 0&&(h.mapping=n(a.mapping,b_)),a.channel!==void 0&&(h.channel=a.channel),a.offset!==void 0&&h.offset.fromArray(a.offset),a.repeat!==void 0&&h.repeat.fromArray(a.repeat),a.center!==void 0&&h.center.fromArray(a.center),a.rotation!==void 0&&(h.rotation=a.rotation),a.wrap!==void 0&&(h.wrapS=n(a.wrap[0],_f),h.wrapT=n(a.wrap[1],_f)),a.format!==void 0&&(h.format=a.format),a.internalFormat!==void 0&&(h.internalFormat=a.internalFormat),a.type!==void 0&&(h.type=a.type),a.colorSpace!==void 0&&(h.colorSpace=a.colorSpace),a.minFilter!==void 0&&(h.minFilter=n(a.minFilter,vf)),a.magFilter!==void 0&&(h.magFilter=n(a.magFilter,vf)),a.anisotropy!==void 0&&(h.anisotropy=a.anisotropy),a.flipY!==void 0&&(h.flipY=a.flipY),a.generateMipmaps!==void 0&&(h.generateMipmaps=a.generateMipmaps),a.premultiplyAlpha!==void 0&&(h.premultiplyAlpha=a.premultiplyAlpha),a.unpackAlignment!==void 0&&(h.unpackAlignment=a.unpackAlignment),a.compareFunction!==void 0&&(h.compareFunction=a.compareFunction),a.userData!==void 0&&(h.userData=a.userData),i[a.uuid]=h}return i}parseObject(e,t,n,i,r){let o;function a(f){return t[f]===void 0&&console.warn("THREE.ObjectLoader: Undefined geometry",f),t[f]}function l(f){if(f!==void 0){if(Array.isArray(f)){const d=[];for(let p=0,_=f.length;p<_;p++){const g=f[p];n[g]===void 0&&console.warn("THREE.ObjectLoader: Undefined material",g),d.push(n[g])}return d}return n[f]===void 0&&console.warn("THREE.ObjectLoader: Undefined material",f),n[f]}}function c(f){return i[f]===void 0&&console.warn("THREE.ObjectLoader: Undefined texture",f),i[f]}let h,u;switch(e.type){case"Scene":o=new bp,e.background!==void 0&&(Number.isInteger(e.background)?o.background=new Fe(e.background):o.background=c(e.background)),e.environment!==void 0&&(o.environment=c(e.environment)),e.fog!==void 0&&(e.fog.type==="Fog"?o.fog=new bl(e.fog.color,e.fog.near,e.fog.far):e.fog.type==="FogExp2"&&(o.fog=new Sl(e.fog.color,e.fog.density)),e.fog.name!==""&&(o.fog.name=e.fog.name)),e.backgroundBlurriness!==void 0&&(o.backgroundBlurriness=e.backgroundBlurriness),e.backgroundIntensity!==void 0&&(o.backgroundIntensity=e.backgroundIntensity),e.backgroundRotation!==void 0&&o.backgroundRotation.fromArray(e.backgroundRotation),e.environmentIntensity!==void 0&&(o.environmentIntensity=e.environmentIntensity),e.environmentRotation!==void 0&&o.environmentRotation.fromArray(e.environmentRotation);break;case"PerspectiveCamera":o=new Rt(e.fov,e.aspect,e.near,e.far),e.focus!==void 0&&(o.focus=e.focus),e.zoom!==void 0&&(o.zoom=e.zoom),e.filmGauge!==void 0&&(o.filmGauge=e.filmGauge),e.filmOffset!==void 0&&(o.filmOffset=e.filmOffset),e.view!==void 0&&(o.view=Object.assign({},e.view));break;case"OrthographicCamera":o=new lr(e.left,e.right,e.top,e.bottom,e.near,e.far),e.zoom!==void 0&&(o.zoom=e.zoom),e.view!==void 0&&(o.view=Object.assign({},e.view));break;case"AmbientLight":o=new om(e.color,e.intensity);break;case"DirectionalLight":o=new sm(e.color,e.intensity),o.target=e.target||"";break;case"PointLight":o=new rm(e.color,e.intensity,e.distance,e.decay);break;case"RectAreaLight":o=new am(e.color,e.intensity,e.width,e.height);break;case"SpotLight":o=new im(e.color,e.intensity,e.distance,e.angle,e.penumbra,e.decay),o.target=e.target||"";break;case"HemisphereLight":o=new nm(e.color,e.groundColor,e.intensity);break;case"LightProbe":o=new cm().fromJSON(e);break;case"SkinnedMesh":h=a(e.geometry),u=l(e.material),o=new Ap(h,u),e.bindMode!==void 0&&(o.bindMode=e.bindMode),e.bindMatrix!==void 0&&o.bindMatrix.fromArray(e.bindMatrix),e.skeleton!==void 0&&(o.skeleton=e.skeleton);break;case"Mesh":h=a(e.geometry),u=l(e.material),o=new vt(h,u);break;case"InstancedMesh":h=a(e.geometry),u=l(e.material);const f=e.count,d=e.instanceMatrix,p=e.instanceColor;o=new Cp(h,u,f),o.instanceMatrix=new mr(new Float32Array(d.array),16),p!==void 0&&(o.instanceColor=new mr(new Float32Array(p.array),p.itemSize));break;case"BatchedMesh":h=a(e.geometry),u=l(e.material),o=new Rp(e.maxInstanceCount,e.maxVertexCount,e.maxIndexCount,u),o.geometry=h,o.perObjectFrustumCulled=e.perObjectFrustumCulled,o.sortObjects=e.sortObjects,o._drawRanges=e.drawRanges,o._reservedRanges=e.reservedRanges,o._visibility=e.visibility,o._active=e.active,o._bounds=e.bounds.map(_=>{const g=new wt;g.min.fromArray(_.boxMin),g.max.fromArray(_.boxMax);const m=new It;return m.radius=_.sphereRadius,m.center.fromArray(_.sphereCenter),{boxInitialized:_.boxInitialized,box:g,sphereInitialized:_.sphereInitialized,sphere:m}}),o._maxInstanceCount=e.maxInstanceCount,o._maxVertexCount=e.maxVertexCount,o._maxIndexCount=e.maxIndexCount,o._geometryInitialized=e.geometryInitialized,o._geometryCount=e.geometryCount,o._matricesTexture=c(e.matricesTexture.uuid),e.colorsTexture!==void 0&&(o._colorsTexture=c(e.colorsTexture.uuid));break;case"LOD":o=new Tp;break;case"Line":o=new Li(a(e.geometry),l(e.material));break;case"LineLoop":o=new Pp(a(e.geometry),l(e.material));break;case"LineSegments":o=new ei(a(e.geometry),l(e.material));break;case"PointCloud":case"Points":o=new Ip(a(e.geometry),l(e.material));break;case"Sprite":o=new Ep(l(e.material));break;case"Group":o=new Yr;break;case"Bone":o=new Vh;break;default:o=new ut}if(o.uuid=e.uuid,e.name!==void 0&&(o.name=e.name),e.matrix!==void 0?(o.matrix.fromArray(e.matrix),e.matrixAutoUpdate!==void 0&&(o.matrixAutoUpdate=e.matrixAutoUpdate),o.matrixAutoUpdate&&o.matrix.decompose(o.position,o.quaternion,o.scale)):(e.position!==void 0&&o.position.fromArray(e.position),e.rotation!==void 0&&o.rotation.fromArray(e.rotation),e.quaternion!==void 0&&o.quaternion.fromArray(e.quaternion),e.scale!==void 0&&o.scale.fromArray(e.scale)),e.up!==void 0&&o.up.fromArray(e.up),e.castShadow!==void 0&&(o.castShadow=e.castShadow),e.receiveShadow!==void 0&&(o.receiveShadow=e.receiveShadow),e.shadow&&(e.shadow.intensity!==void 0&&(o.shadow.intensity=e.shadow.intensity),e.shadow.bias!==void 0&&(o.shadow.bias=e.shadow.bias),e.shadow.normalBias!==void 0&&(o.shadow.normalBias=e.shadow.normalBias),e.shadow.radius!==void 0&&(o.shadow.radius=e.shadow.radius),e.shadow.mapSize!==void 0&&o.shadow.mapSize.fromArray(e.shadow.mapSize),e.shadow.camera!==void 0&&(o.shadow.camera=this.parseObject(e.shadow.camera))),e.visible!==void 0&&(o.visible=e.visible),e.frustumCulled!==void 0&&(o.frustumCulled=e.frustumCulled),e.renderOrder!==void 0&&(o.renderOrder=e.renderOrder),e.userData!==void 0&&(o.userData=e.userData),e.layers!==void 0&&(o.layers.mask=e.layers),e.children!==void 0){const f=e.children;for(let d=0;d<f.length;d++)o.add(this.parseObject(f[d],t,n,i,r))}if(e.animations!==void 0){const f=e.animations;for(let d=0;d<f.length;d++){const p=f[d];o.animations.push(r[p])}}if(e.type==="LOD"){e.autoUpdate!==void 0&&(o.autoUpdate=e.autoUpdate);const f=e.levels;for(let d=0;d<f.length;d++){const p=f[d],_=o.getObjectByProperty("uuid",p.object);_!==void 0&&o.addLevel(_,p.distance,p.hysteresis)}}return o}bindSkeletons(e,t){Object.keys(t).length!==0&&e.traverse(function(n){if(n.isSkinnedMesh===!0&&n.skeleton!==void 0){const i=t[n.skeleton];i===void 0?console.warn("THREE.ObjectLoader: No skeleton found with UUID:",n.skeleton):n.bind(i,n.bindMatrix)}})}bindLightTargets(e){e.traverse(function(t){if(t.isDirectionalLight||t.isSpotLight){const n=t.target,i=e.getObjectByProperty("uuid",n);i!==void 0?t.target=i:t.target=new ut}})}}const b_={UVMapping:fl,CubeReflectionMapping:mi,CubeRefractionMapping:Ii,EquirectangularReflectionMapping:Gs,EquirectangularRefractionMapping:Hs,CubeUVReflectionMapping:es},_f={RepeatWrapping:Ws,ClampToEdgeWrapping:Rn,MirroredRepeatWrapping:Xs},vf={NearestFilter:Xt,NearestMipmapNearestFilter:Sh,NearestMipmapLinearFilter:Wr,LinearFilter:At,LinearMipmapNearestFilter:Is,LinearMipmapLinearFilter:Zn};class w_ extends mn{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"}}setOptions(e){return this.options=e,this}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,o=hi.get(e);if(o!==void 0){if(r.manager.itemStart(e),o.then){o.then(c=>{t&&t(c),r.manager.itemEnd(e)}).catch(c=>{i&&i(c)});return}return setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0),o}const a={};a.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",a.headers=this.requestHeader;const l=fetch(e,a).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign(r.options,{colorSpaceConversion:"none"}))}).then(function(c){return hi.add(e,c),t&&t(c),r.manager.itemEnd(e),c}).catch(function(c){i&&i(c),hi.remove(e),r.manager.itemError(e),r.manager.itemEnd(e)});hi.add(e,l),r.manager.itemStart(e)}}let sa;class iu{static getContext(){return sa===void 0&&(sa=new(window.AudioContext||window.webkitAudioContext)),sa}static setContext(e){sa=e}}class E_ extends mn{constructor(e){super(e)}load(e,t,n,i){const r=this,o=new _i(this.manager);o.setResponseType("arraybuffer"),o.setPath(this.path),o.setRequestHeader(this.requestHeader),o.setWithCredentials(this.withCredentials),o.load(e,function(l){try{const c=l.slice(0);iu.getContext().decodeAudioData(c,function(u){t(u)}).catch(a)}catch(c){a(c)}},n,i);function a(l){i?i(l):console.error(l),r.manager.itemError(e)}}}const yf=new Ye,xf=new Ye,Hi=new Ye;class T_{constructor(){this.type="StereoCamera",this.aspect=1,this.eyeSep=.064,this.cameraL=new Rt,this.cameraL.layers.enable(1),this.cameraL.matrixAutoUpdate=!1,this.cameraR=new Rt,this.cameraR.layers.enable(2),this.cameraR.matrixAutoUpdate=!1,this._cache={focus:null,fov:null,aspect:null,near:null,far:null,zoom:null,eyeSep:null}}update(e){const t=this._cache;if(t.focus!==e.focus||t.fov!==e.fov||t.aspect!==e.aspect*this.aspect||t.near!==e.near||t.far!==e.far||t.zoom!==e.zoom||t.eyeSep!==this.eyeSep){t.focus=e.focus,t.fov=e.fov,t.aspect=e.aspect*this.aspect,t.near=e.near,t.far=e.far,t.zoom=e.zoom,t.eyeSep=this.eyeSep,Hi.copy(e.projectionMatrix);const i=t.eyeSep/2,r=i*t.near/t.focus,o=t.near*Math.tan(or*t.fov*.5)/t.zoom;let a,l;xf.elements[12]=-i,yf.elements[12]=i,a=-o*t.aspect+r,l=o*t.aspect+r,Hi.elements[0]=2*t.near/(l-a),Hi.elements[8]=(l+a)/(l-a),this.cameraL.projectionMatrix.copy(Hi),a=-o*t.aspect-r,l=o*t.aspect-r,Hi.elements[0]=2*t.near/(l-a),Hi.elements[8]=(l+a)/(l-a),this.cameraR.projectionMatrix.copy(Hi)}this.cameraL.matrixWorld.copy(e.matrixWorld).multiply(xf),this.cameraR.matrixWorld.copy(e.matrixWorld).multiply(yf)}}class um extends Rt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class fm{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Mf(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=Mf();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function Mf(){return performance.now()}const Wi=new I,Sf=new Ot,A_=new I,Xi=new I;class C_ extends ut{constructor(){super(),this.type="AudioListener",this.context=iu.getContext(),this.gain=this.context.createGain(),this.gain.connect(this.context.destination),this.filter=null,this.timeDelta=0,this._clock=new fm}getInput(){return this.gain}removeFilter(){return this.filter!==null&&(this.gain.disconnect(this.filter),this.filter.disconnect(this.context.destination),this.gain.connect(this.context.destination),this.filter=null),this}getFilter(){return this.filter}setFilter(e){return this.filter!==null?(this.gain.disconnect(this.filter),this.filter.disconnect(this.context.destination)):this.gain.disconnect(this.context.destination),this.filter=e,this.gain.connect(this.filter),this.filter.connect(this.context.destination),this}getMasterVolume(){return this.gain.gain.value}setMasterVolume(e){return this.gain.gain.setTargetAtTime(e,this.context.currentTime,.01),this}updateMatrixWorld(e){super.updateMatrixWorld(e);const t=this.context.listener,n=this.up;if(this.timeDelta=this._clock.getDelta(),this.matrixWorld.decompose(Wi,Sf,A_),Xi.set(0,0,-1).applyQuaternion(Sf),t.positionX){const i=this.context.currentTime+this.timeDelta;t.positionX.linearRampToValueAtTime(Wi.x,i),t.positionY.linearRampToValueAtTime(Wi.y,i),t.positionZ.linearRampToValueAtTime(Wi.z,i),t.forwardX.linearRampToValueAtTime(Xi.x,i),t.forwardY.linearRampToValueAtTime(Xi.y,i),t.forwardZ.linearRampToValueAtTime(Xi.z,i),t.upX.linearRampToValueAtTime(n.x,i),t.upY.linearRampToValueAtTime(n.y,i),t.upZ.linearRampToValueAtTime(n.z,i)}else t.setPosition(Wi.x,Wi.y,Wi.z),t.setOrientation(Xi.x,Xi.y,Xi.z,n.x,n.y,n.z)}}class dm extends ut{constructor(e){super(),this.type="Audio",this.listener=e,this.context=e.context,this.gain=this.context.createGain(),this.gain.connect(e.getInput()),this.autoplay=!1,this.buffer=null,this.detune=0,this.loop=!1,this.loopStart=0,this.loopEnd=0,this.offset=0,this.duration=void 0,this.playbackRate=1,this.isPlaying=!1,this.hasPlaybackControl=!0,this.source=null,this.sourceType="empty",this._startedAt=0,this._progress=0,this._connected=!1,this.filters=[]}getOutput(){return this.gain}setNodeSource(e){return this.hasPlaybackControl=!1,this.sourceType="audioNode",this.source=e,this.connect(),this}setMediaElementSource(e){return this.hasPlaybackControl=!1,this.sourceType="mediaNode",this.source=this.context.createMediaElementSource(e),this.connect(),this}setMediaStreamSource(e){return this.hasPlaybackControl=!1,this.sourceType="mediaStreamNode",this.source=this.context.createMediaStreamSource(e),this.connect(),this}setBuffer(e){return this.buffer=e,this.sourceType="buffer",this.autoplay&&this.play(),this}play(e=0){if(this.isPlaying===!0){console.warn("THREE.Audio: Audio is already playing.");return}if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}this._startedAt=this.context.currentTime+e;const t=this.context.createBufferSource();return t.buffer=this.buffer,t.loop=this.loop,t.loopStart=this.loopStart,t.loopEnd=this.loopEnd,t.onended=this.onEnded.bind(this),t.start(this._startedAt,this._progress+this.offset,this.duration),this.isPlaying=!0,this.source=t,this.setDetune(this.detune),this.setPlaybackRate(this.playbackRate),this.connect()}pause(){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this.isPlaying===!0&&(this._progress+=Math.max(this.context.currentTime-this._startedAt,0)*this.playbackRate,this.loop===!0&&(this._progress=this._progress%(this.duration||this.buffer.duration)),this.source.stop(),this.source.onended=null,this.isPlaying=!1),this}stop(e=0){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this._progress=0,this.source!==null&&(this.source.stop(this.context.currentTime+e),this.source.onended=null),this.isPlaying=!1,this}connect(){if(this.filters.length>0){this.source.connect(this.filters[0]);for(let e=1,t=this.filters.length;e<t;e++)this.filters[e-1].connect(this.filters[e]);this.filters[this.filters.length-1].connect(this.getOutput())}else this.source.connect(this.getOutput());return this._connected=!0,this}disconnect(){if(this._connected!==!1){if(this.filters.length>0){this.source.disconnect(this.filters[0]);for(let e=1,t=this.filters.length;e<t;e++)this.filters[e-1].disconnect(this.filters[e]);this.filters[this.filters.length-1].disconnect(this.getOutput())}else this.source.disconnect(this.getOutput());return this._connected=!1,this}}getFilters(){return this.filters}setFilters(e){return e||(e=[]),this._connected===!0?(this.disconnect(),this.filters=e.slice(),this.connect()):this.filters=e.slice(),this}setDetune(e){return this.detune=e,this.isPlaying===!0&&this.source.detune!==void 0&&this.source.detune.setTargetAtTime(this.detune,this.context.currentTime,.01),this}getDetune(){return this.detune}getFilter(){return this.getFilters()[0]}setFilter(e){return this.setFilters(e?[e]:[])}setPlaybackRate(e){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this.playbackRate=e,this.isPlaying===!0&&this.source.playbackRate.setTargetAtTime(this.playbackRate,this.context.currentTime,.01),this}getPlaybackRate(){return this.playbackRate}onEnded(){this.isPlaying=!1,this._progress=0}getLoop(){return this.hasPlaybackControl===!1?(console.warn("THREE.Audio: this Audio has no playback control."),!1):this.loop}setLoop(e){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this.loop=e,this.isPlaying===!0&&(this.source.loop=this.loop),this}setLoopStart(e){return this.loopStart=e,this}setLoopEnd(e){return this.loopEnd=e,this}getVolume(){return this.gain.gain.value}setVolume(e){return this.gain.gain.setTargetAtTime(e,this.context.currentTime,.01),this}copy(e,t){return super.copy(e,t),e.sourceType!=="buffer"?(console.warn("THREE.Audio: Audio source type cannot be copied."),this):(this.autoplay=e.autoplay,this.buffer=e.buffer,this.detune=e.detune,this.loop=e.loop,this.loopStart=e.loopStart,this.loopEnd=e.loopEnd,this.offset=e.offset,this.duration=e.duration,this.playbackRate=e.playbackRate,this.hasPlaybackControl=e.hasPlaybackControl,this.sourceType=e.sourceType,this.filters=e.filters.slice(),this)}clone(e){return new this.constructor(this.listener).copy(this,e)}}const Yi=new I,bf=new Ot,R_=new I,qi=new I;class P_ extends dm{constructor(e){super(e),this.panner=this.context.createPanner(),this.panner.panningModel="HRTF",this.panner.connect(this.gain)}connect(){super.connect(),this.panner.connect(this.gain)}disconnect(){super.disconnect(),this.panner.disconnect(this.gain)}getOutput(){return this.panner}getRefDistance(){return this.panner.refDistance}setRefDistance(e){return this.panner.refDistance=e,this}getRolloffFactor(){return this.panner.rolloffFactor}setRolloffFactor(e){return this.panner.rolloffFactor=e,this}getDistanceModel(){return this.panner.distanceModel}setDistanceModel(e){return this.panner.distanceModel=e,this}getMaxDistance(){return this.panner.maxDistance}setMaxDistance(e){return this.panner.maxDistance=e,this}setDirectionalCone(e,t,n){return this.panner.coneInnerAngle=e,this.panner.coneOuterAngle=t,this.panner.coneOuterGain=n,this}updateMatrixWorld(e){if(super.updateMatrixWorld(e),this.hasPlaybackControl===!0&&this.isPlaying===!1)return;this.matrixWorld.decompose(Yi,bf,R_),qi.set(0,0,1).applyQuaternion(bf);const t=this.panner;if(t.positionX){const n=this.context.currentTime+this.listener.timeDelta;t.positionX.linearRampToValueAtTime(Yi.x,n),t.positionY.linearRampToValueAtTime(Yi.y,n),t.positionZ.linearRampToValueAtTime(Yi.z,n),t.orientationX.linearRampToValueAtTime(qi.x,n),t.orientationY.linearRampToValueAtTime(qi.y,n),t.orientationZ.linearRampToValueAtTime(qi.z,n)}else t.setPosition(Yi.x,Yi.y,Yi.z),t.setOrientation(qi.x,qi.y,qi.z)}}class I_{constructor(e,t=2048){this.analyser=e.context.createAnalyser(),this.analyser.fftSize=t,this.data=new Uint8Array(this.analyser.frequencyBinCount),e.getOutput().connect(this.analyser)}getFrequencyData(){return this.analyser.getByteFrequencyData(this.data),this.data}getAverageFrequency(){let e=0;const t=this.getFrequencyData();for(let n=0;n<t.length;n++)e+=t[n];return e/t.length}}class pm{constructor(e,t,n){this.binding=e,this.valueSize=n;let i,r,o;switch(t){case"quaternion":i=this._slerp,r=this._slerpAdditive,o=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(n*6),this._workIndex=5;break;case"string":case"bool":i=this._select,r=this._select,o=this._setAdditiveIdentityOther,this.buffer=new Array(n*5);break;default:i=this._lerp,r=this._lerpAdditive,o=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(n*5)}this._mixBufferRegion=i,this._mixBufferRegionAdditive=r,this._setIdentity=o,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(e,t){const n=this.buffer,i=this.valueSize,r=e*i+i;let o=this.cumulativeWeight;if(o===0){for(let a=0;a!==i;++a)n[r+a]=n[a];o=t}else{o+=t;const a=t/o;this._mixBufferRegion(n,r,0,a,i)}this.cumulativeWeight=o}accumulateAdditive(e){const t=this.buffer,n=this.valueSize,i=n*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(t,i,0,e,n),this.cumulativeWeightAdditive+=e}apply(e){const t=this.valueSize,n=this.buffer,i=e*t+t,r=this.cumulativeWeight,o=this.cumulativeWeightAdditive,a=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,r<1){const l=t*this._origIndex;this._mixBufferRegion(n,i,l,1-r,t)}o>0&&this._mixBufferRegionAdditive(n,i,this._addIndex*t,1,t);for(let l=t,c=t+t;l!==c;++l)if(n[l]!==n[l+t]){a.setValue(n,i);break}}saveOriginalState(){const e=this.binding,t=this.buffer,n=this.valueSize,i=n*this._origIndex;e.getValue(t,i);for(let r=n,o=i;r!==o;++r)t[r]=t[i+r%n];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){const e=this.valueSize*3;this.binding.setValue(this.buffer,e)}_setAdditiveIdentityNumeric(){const e=this._addIndex*this.valueSize,t=e+this.valueSize;for(let n=e;n<t;n++)this.buffer[n]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){const e=this._origIndex*this.valueSize,t=this._addIndex*this.valueSize;for(let n=0;n<this.valueSize;n++)this.buffer[t+n]=this.buffer[e+n]}_select(e,t,n,i,r){if(i>=.5)for(let o=0;o!==r;++o)e[t+o]=e[n+o]}_slerp(e,t,n,i){Ot.slerpFlat(e,t,e,t,e,n,i)}_slerpAdditive(e,t,n,i,r){const o=this._workIndex*r;Ot.multiplyQuaternionsFlat(e,o,e,t,e,n),Ot.slerpFlat(e,t,e,t,e,o,i)}_lerp(e,t,n,i,r){const o=1-i;for(let a=0;a!==r;++a){const l=t+a;e[l]=e[l]*o+e[n+a]*i}}_lerpAdditive(e,t,n,i,r){for(let o=0;o!==r;++o){const a=t+o;e[a]=e[a]+e[n+o]*i}}}const ru="\\[\\]\\.:\\/",L_=new RegExp("["+ru+"]","g"),su="[^"+ru+"]",U_="[^"+ru.replace("\\.","")+"]",D_=/((?:WC+[\/:])*)/.source.replace("WC",su),F_=/(WCOD+)?/.source.replace("WCOD",U_),N_=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",su),O_=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",su),B_=new RegExp("^"+D_+F_+N_+O_+"$"),k_=["material","materials","bones","map"];class z_{constructor(e,t,n){const i=n||ht.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();const n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){const n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,r=n.length;i!==r;++i)n[i].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}}class ht{constructor(e,t,n){this.path=t,this.parsedPath=n||ht.parseTrackName(t),this.node=ht.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new ht.Composite(e,t,n):new ht(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(L_,"")}static parseTrackName(e){const t=B_.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);const n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){const r=n.nodeName.substring(i+1);k_.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){const n=function(r){for(let o=0;o<r.length;o++){const a=r[o];if(a.name===t||a.uuid===t)return a;const l=n(a.children);if(l)return l}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,n=t.objectName,i=t.propertyName;let r=t.propertyIndex;if(e||(e=ht.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}const o=e[i];if(o===void 0){const c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?a=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}ht.Composite=z_;ht.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ht.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ht.prototype.GetterByBindingType=[ht.prototype._getValue_direct,ht.prototype._getValue_array,ht.prototype._getValue_arrayElement,ht.prototype._getValue_toArray];ht.prototype.SetterByBindingTypeAndVersioning=[[ht.prototype._setValue_direct,ht.prototype._setValue_direct_setNeedsUpdate,ht.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ht.prototype._setValue_array,ht.prototype._setValue_array_setNeedsUpdate,ht.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ht.prototype._setValue_arrayElement,ht.prototype._setValue_arrayElement_setNeedsUpdate,ht.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ht.prototype._setValue_fromArray,ht.prototype._setValue_fromArray_setNeedsUpdate,ht.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];class V_{constructor(){this.isAnimationObjectGroup=!0,this.uuid=bn(),this._objects=Array.prototype.slice.call(arguments),this.nCachedObjects_=0;const e={};this._indicesByUUID=e;for(let n=0,i=arguments.length;n!==i;++n)e[arguments[n].uuid]=n;this._paths=[],this._parsedPaths=[],this._bindings=[],this._bindingsIndicesByPath={};const t=this;this.stats={objects:{get total(){return t._objects.length},get inUse(){return this.total-t.nCachedObjects_}},get bindingsPerObject(){return t._bindings.length}}}add(){const e=this._objects,t=this._indicesByUUID,n=this._paths,i=this._parsedPaths,r=this._bindings,o=r.length;let a,l=e.length,c=this.nCachedObjects_;for(let h=0,u=arguments.length;h!==u;++h){const f=arguments[h],d=f.uuid;let p=t[d];if(p===void 0){p=l++,t[d]=p,e.push(f);for(let _=0,g=o;_!==g;++_)r[_].push(new ht(f,n[_],i[_]))}else if(p<c){a=e[p];const _=--c,g=e[_];t[g.uuid]=p,e[p]=g,t[d]=_,e[_]=f;for(let m=0,x=o;m!==x;++m){const y=r[m],v=y[_];let A=y[p];y[p]=v,A===void 0&&(A=new ht(f,n[m],i[m])),y[_]=A}}else e[p]!==a&&console.error("THREE.AnimationObjectGroup: Different objects with the same UUID detected. Clean the caches or recreate your infrastructure when reloading scenes.")}this.nCachedObjects_=c}remove(){const e=this._objects,t=this._indicesByUUID,n=this._bindings,i=n.length;let r=this.nCachedObjects_;for(let o=0,a=arguments.length;o!==a;++o){const l=arguments[o],c=l.uuid,h=t[c];if(h!==void 0&&h>=r){const u=r++,f=e[u];t[f.uuid]=h,e[h]=f,t[c]=u,e[u]=l;for(let d=0,p=i;d!==p;++d){const _=n[d],g=_[u],m=_[h];_[h]=g,_[u]=m}}}this.nCachedObjects_=r}uncache(){const e=this._objects,t=this._indicesByUUID,n=this._bindings,i=n.length;let r=this.nCachedObjects_,o=e.length;for(let a=0,l=arguments.length;a!==l;++a){const c=arguments[a],h=c.uuid,u=t[h];if(u!==void 0)if(delete t[h],u<r){const f=--r,d=e[f],p=--o,_=e[p];t[d.uuid]=u,e[u]=d,t[_.uuid]=f,e[f]=_,e.pop();for(let g=0,m=i;g!==m;++g){const x=n[g],y=x[f],v=x[p];x[u]=y,x[f]=v,x.pop()}}else{const f=--o,d=e[f];f>0&&(t[d.uuid]=u),e[u]=d,e.pop();for(let p=0,_=i;p!==_;++p){const g=n[p];g[u]=g[f],g.pop()}}}this.nCachedObjects_=r}subscribe_(e,t){const n=this._bindingsIndicesByPath;let i=n[e];const r=this._bindings;if(i!==void 0)return r[i];const o=this._paths,a=this._parsedPaths,l=this._objects,c=l.length,h=this.nCachedObjects_,u=new Array(c);i=r.length,n[e]=i,o.push(e),a.push(t),r.push(u);for(let f=h,d=l.length;f!==d;++f){const p=l[f];u[f]=new ht(p,e,t)}return u}unsubscribe_(e){const t=this._bindingsIndicesByPath,n=t[e];if(n!==void 0){const i=this._paths,r=this._parsedPaths,o=this._bindings,a=o.length-1,l=o[a],c=e[a];t[c]=n,o[n]=l,o.pop(),r[n]=r[a],r.pop(),i[n]=i[a],i.pop()}}}class mm{constructor(e,t,n=null,i=t.blendMode){this._mixer=e,this._clip=t,this._localRoot=n,this.blendMode=i;const r=t.tracks,o=r.length,a=new Array(o),l={endingStart:er,endingEnd:er};for(let c=0;c!==o;++c){const h=r[c].createInterpolant(null);a[c]=h,h.settings=l}this._interpolantSettings=l,this._interpolants=a,this._propertyBindings=new Array(o),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._weightInterpolant=null,this.loop=rp,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(e){return this._startTime=e,this}setLoop(e,t){return this.loop=e,this.repetitions=t,this}setEffectiveWeight(e){return this.weight=e,this._effectiveWeight=this.enabled?e:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(e){return this._scheduleFading(e,0,1)}fadeOut(e){return this._scheduleFading(e,1,0)}crossFadeFrom(e,t,n){if(e.fadeOut(t),this.fadeIn(t),n){const i=this._clip.duration,r=e._clip.duration,o=r/i,a=i/r;e.warp(1,o,t),this.warp(a,1,t)}return this}crossFadeTo(e,t,n){return e.crossFadeFrom(this,t,n)}stopFading(){const e=this._weightInterpolant;return e!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}setEffectiveTimeScale(e){return this.timeScale=e,this._effectiveTimeScale=this.paused?0:e,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(e){return this.timeScale=this._clip.duration/e,this.stopWarping()}syncWith(e){return this.time=e.time,this.timeScale=e.timeScale,this.stopWarping()}halt(e){return this.warp(this._effectiveTimeScale,0,e)}warp(e,t,n){const i=this._mixer,r=i.time,o=this.timeScale;let a=this._timeScaleInterpolant;a===null&&(a=i._lendControlInterpolant(),this._timeScaleInterpolant=a);const l=a.parameterPositions,c=a.sampleValues;return l[0]=r,l[1]=r+n,c[0]=e/o,c[1]=t/o,this}stopWarping(){const e=this._timeScaleInterpolant;return e!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(e,t,n,i){if(!this.enabled){this._updateWeight(e);return}const r=this._startTime;if(r!==null){const l=(e-r)*n;l<0||n===0?t=0:(this._startTime=null,t=n*l)}t*=this._updateTimeScale(e);const o=this._updateTime(t),a=this._updateWeight(e);if(a>0){const l=this._interpolants,c=this._propertyBindings;switch(this.blendMode){case Lh:for(let h=0,u=l.length;h!==u;++h)l[h].evaluate(o),c[h].accumulateAdditive(a);break;case yl:default:for(let h=0,u=l.length;h!==u;++h)l[h].evaluate(o),c[h].accumulate(i,a)}}}_updateWeight(e){let t=0;if(this.enabled){t=this.weight;const n=this._weightInterpolant;if(n!==null){const i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(this.stopFading(),i===0&&(this.enabled=!1))}}return this._effectiveWeight=t,t}_updateTimeScale(e){let t=0;if(!this.paused){t=this.timeScale;const n=this._timeScaleInterpolant;if(n!==null){const i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(this.stopWarping(),t===0?this.paused=!0:this.timeScale=t)}}return this._effectiveTimeScale=t,t}_updateTime(e){const t=this._clip.duration,n=this.loop;let i=this.time+e,r=this._loopCount;const o=n===sp;if(e===0)return r===-1?i:o&&(r&1)===1?t-i:i;if(n===ip){r===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));e:{if(i>=t)i=t;else if(i<0)i=0;else{this.time=i;break e}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e<0?-1:1})}}else{if(r===-1&&(e>=0?(r=0,this._setEndings(!0,this.repetitions===0,o)):this._setEndings(this.repetitions===0,!0,o)),i>=t||i<0){const a=Math.floor(i/t);i-=t*a,r+=Math.abs(a);const l=this.repetitions-r;if(l<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,i=e>0?t:0,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e>0?1:-1});else{if(l===1){const c=e<0;this._setEndings(c,!c,o)}else this._setEndings(!1,!1,o);this._loopCount=r,this.time=i,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:a})}}else this.time=i;if(o&&(r&1)===1)return t-i}return i}_setEndings(e,t,n){const i=this._interpolantSettings;n?(i.endingStart=tr,i.endingEnd=tr):(e?i.endingStart=this.zeroSlopeAtStart?tr:er:i.endingStart=qs,t?i.endingEnd=this.zeroSlopeAtEnd?tr:er:i.endingEnd=qs)}_scheduleFading(e,t,n){const i=this._mixer,r=i.time;let o=this._weightInterpolant;o===null&&(o=i._lendControlInterpolant(),this._weightInterpolant=o);const a=o.parameterPositions,l=o.sampleValues;return a[0]=r,l[0]=t,a[1]=r+e,l[1]=n,this}}const G_=new Float32Array(1);class H_ extends $n{constructor(e){super(),this._root=e,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1}_bindAction(e,t){const n=e._localRoot||this._root,i=e._clip.tracks,r=i.length,o=e._propertyBindings,a=e._interpolants,l=n.uuid,c=this._bindingsByRootAndName;let h=c[l];h===void 0&&(h={},c[l]=h);for(let u=0;u!==r;++u){const f=i[u],d=f.name;let p=h[d];if(p!==void 0)++p.referenceCount,o[u]=p;else{if(p=o[u],p!==void 0){p._cacheIndex===null&&(++p.referenceCount,this._addInactiveBinding(p,l,d));continue}const _=t&&t._propertyBindings[u].binding.parsedPath;p=new pm(ht.create(n,d,_),f.ValueTypeName,f.getValueSize()),++p.referenceCount,this._addInactiveBinding(p,l,d),o[u]=p}a[u].resultBuffer=p.buffer}}_activateAction(e){if(!this._isActiveAction(e)){if(e._cacheIndex===null){const n=(e._localRoot||this._root).uuid,i=e._clip.uuid,r=this._actionsByClip[i];this._bindAction(e,r&&r.knownActions[0]),this._addInactiveAction(e,i,n)}const t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){const r=t[n];r.useCount++===0&&(this._lendBinding(r),r.saveOriginalState())}this._lendAction(e)}}_deactivateAction(e){if(this._isActiveAction(e)){const t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){const r=t[n];--r.useCount===0&&(r.restoreOriginalState(),this._takeBackBinding(r))}this._takeBackAction(e)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;const e=this;this.stats={actions:{get total(){return e._actions.length},get inUse(){return e._nActiveActions}},bindings:{get total(){return e._bindings.length},get inUse(){return e._nActiveBindings}},controlInterpolants:{get total(){return e._controlInterpolants.length},get inUse(){return e._nActiveControlInterpolants}}}}_isActiveAction(e){const t=e._cacheIndex;return t!==null&&t<this._nActiveActions}_addInactiveAction(e,t,n){const i=this._actions,r=this._actionsByClip;let o=r[t];if(o===void 0)o={knownActions:[e],actionByRoot:{}},e._byClipCacheIndex=0,r[t]=o;else{const a=o.knownActions;e._byClipCacheIndex=a.length,a.push(e)}e._cacheIndex=i.length,i.push(e),o.actionByRoot[n]=e}_removeInactiveAction(e){const t=this._actions,n=t[t.length-1],i=e._cacheIndex;n._cacheIndex=i,t[i]=n,t.pop(),e._cacheIndex=null;const r=e._clip.uuid,o=this._actionsByClip,a=o[r],l=a.knownActions,c=l[l.length-1],h=e._byClipCacheIndex;c._byClipCacheIndex=h,l[h]=c,l.pop(),e._byClipCacheIndex=null;const u=a.actionByRoot,f=(e._localRoot||this._root).uuid;delete u[f],l.length===0&&delete o[r],this._removeInactiveBindingsForAction(e)}_removeInactiveBindingsForAction(e){const t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){const r=t[n];--r.referenceCount===0&&this._removeInactiveBinding(r)}}_lendAction(e){const t=this._actions,n=e._cacheIndex,i=this._nActiveActions++,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_takeBackAction(e){const t=this._actions,n=e._cacheIndex,i=--this._nActiveActions,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_addInactiveBinding(e,t,n){const i=this._bindingsByRootAndName,r=this._bindings;let o=i[t];o===void 0&&(o={},i[t]=o),o[n]=e,e._cacheIndex=r.length,r.push(e)}_removeInactiveBinding(e){const t=this._bindings,n=e.binding,i=n.rootNode.uuid,r=n.path,o=this._bindingsByRootAndName,a=o[i],l=t[t.length-1],c=e._cacheIndex;l._cacheIndex=c,t[c]=l,t.pop(),delete a[r],Object.keys(a).length===0&&delete o[i]}_lendBinding(e){const t=this._bindings,n=e._cacheIndex,i=this._nActiveBindings++,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_takeBackBinding(e){const t=this._bindings,n=e._cacheIndex,i=--this._nActiveBindings,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_lendControlInterpolant(){const e=this._controlInterpolants,t=this._nActiveControlInterpolants++;let n=e[t];return n===void 0&&(n=new $h(new Float32Array(2),new Float32Array(2),1,G_),n.__cacheIndex=t,e[t]=n),n}_takeBackControlInterpolant(e){const t=this._controlInterpolants,n=e.__cacheIndex,i=--this._nActiveControlInterpolants,r=t[i];e.__cacheIndex=i,t[i]=e,r.__cacheIndex=n,t[n]=r}clipAction(e,t,n){const i=t||this._root,r=i.uuid;let o=typeof e=="string"?so.findByName(i,e):e;const a=o!==null?o.uuid:e,l=this._actionsByClip[a];let c=null;if(n===void 0&&(o!==null?n=o.blendMode:n=yl),l!==void 0){const u=l.actionByRoot[r];if(u!==void 0&&u.blendMode===n)return u;c=l.knownActions[0],o===null&&(o=c._clip)}if(o===null)return null;const h=new mm(this,o,t,n);return this._bindAction(h,c),this._addInactiveAction(h,a,r),h}existingAction(e,t){const n=t||this._root,i=n.uuid,r=typeof e=="string"?so.findByName(n,e):e,o=r?r.uuid:e,a=this._actionsByClip[o];return a!==void 0&&a.actionByRoot[i]||null}stopAllAction(){const e=this._actions,t=this._nActiveActions;for(let n=t-1;n>=0;--n)e[n].stop();return this}update(e){e*=this.timeScale;const t=this._actions,n=this._nActiveActions,i=this.time+=e,r=Math.sign(e),o=this._accuIndex^=1;for(let c=0;c!==n;++c)t[c]._update(i,e,r,o);const a=this._bindings,l=this._nActiveBindings;for(let c=0;c!==l;++c)a[c].apply(o);return this}setTime(e){this.time=0;for(let t=0;t<this._actions.length;t++)this._actions[t].time=0;return this.update(e)}getRoot(){return this._root}uncacheClip(e){const t=this._actions,n=e.uuid,i=this._actionsByClip,r=i[n];if(r!==void 0){const o=r.knownActions;for(let a=0,l=o.length;a!==l;++a){const c=o[a];this._deactivateAction(c);const h=c._cacheIndex,u=t[t.length-1];c._cacheIndex=null,c._byClipCacheIndex=null,u._cacheIndex=h,t[h]=u,t.pop(),this._removeInactiveBindingsForAction(c)}delete i[n]}}uncacheRoot(e){const t=e.uuid,n=this._actionsByClip;for(const o in n){const a=n[o].actionByRoot,l=a[t];l!==void 0&&(this._deactivateAction(l),this._removeInactiveAction(l))}const i=this._bindingsByRootAndName,r=i[t];if(r!==void 0)for(const o in r){const a=r[o];a.restoreOriginalState(),this._removeInactiveBinding(a)}}uncacheAction(e,t){const n=this.existingAction(e,t);n!==null&&(this._deactivateAction(n),this._removeInactiveAction(n))}}class ou{constructor(e){this.value=e}clone(){return new ou(this.value.clone===void 0?this.value:this.value.clone())}}let W_=0;class X_ extends $n{constructor(){super(),this.isUniformsGroup=!0,Object.defineProperty(this,"id",{value:W_++}),this.name="",this.usage=js,this.uniforms=[]}add(e){return this.uniforms.push(e),this}remove(e){const t=this.uniforms.indexOf(e);return t!==-1&&this.uniforms.splice(t,1),this}setName(e){return this.name=e,this}setUsage(e){return this.usage=e,this}dispose(){return this.dispatchEvent({type:"dispose"}),this}copy(e){this.name=e.name,this.usage=e.usage;const t=e.uniforms;this.uniforms.length=0;for(let n=0,i=t.length;n<i;n++){const r=Array.isArray(t[n])?t[n]:[t[n]];for(let o=0;o<r.length;o++)this.uniforms.push(r[o].clone())}return this}clone(){return new this.constructor().copy(this)}}class ul extends wl{constructor(e,t,n=1){super(e,t),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=n}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}clone(e){const t=super.clone(e);return t.meshPerAttribute=this.meshPerAttribute,t}toJSON(e){const t=super.toJSON(e);return t.isInstancedInterleavedBuffer=!0,t.meshPerAttribute=this.meshPerAttribute,t}}class Y_{constructor(e,t,n,i,r){this.isGLBufferAttribute=!0,this.name="",this.buffer=e,this.type=t,this.itemSize=n,this.elementSize=i,this.count=r,this.version=0}set needsUpdate(e){e===!0&&this.version++}setBuffer(e){return this.buffer=e,this}setType(e,t){return this.type=e,this.elementSize=t,this}setItemSize(e){return this.itemSize=e,this}setCount(e){return this.count=e,this}}const wf=new Ye;class q_{constructor(e,t,n=0,i=1/0){this.ray=new Di(e,t),this.near=n,this.far=i,this.camera=null,this.layers=new Ml,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return wf.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(wf),this}intersectObject(e,t=!0,n=[]){return fh(e,this,n,t),n.sort(Ef),n}intersectObjects(e,t=!0,n=[]){for(let i=0,r=e.length;i<r;i++)fh(e[i],this,n,t);return n.sort(Ef),n}}function Ef(s,e){return s.distance-e.distance}function fh(s,e,t,n){let i=!0;if(s.layers.test(e.layers)&&s.raycast(e,t)===!1&&(i=!1),i===!0&&n===!0){const r=s.children;for(let o=0,a=r.length;o<a;o++)fh(r[o],e,t,!0)}}class ao{constructor(e=1,t=0,n=0){return this.radius=e,this.phi=t,this.theta=n,this}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Qe(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(Qe(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class Z_{constructor(e=1,t=0,n=0){return this.radius=e,this.theta=t,this.y=n,this}set(e,t,n){return this.radius=e,this.theta=t,this.y=n,this}copy(e){return this.radius=e.radius,this.theta=e.theta,this.y=e.y,this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+n*n),this.theta=Math.atan2(e,n),this.y=t,this}clone(){return new this.constructor().copy(this)}}class au{constructor(e,t,n,i){au.prototype.isMatrix2=!0,this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,i)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,i){const r=this.elements;return r[0]=e,r[2]=t,r[1]=n,r[3]=i,this}}const Tf=new Me;class dh{constructor(e=new Me(1/0,1/0),t=new Me(-1/0,-1/0)){this.isBox2=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Tf.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=1/0,this.max.x=this.max.y=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y}getCenter(e){return this.isEmpty()?e.set(0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Tf).distanceTo(e)}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Af=new I,oa=new I;class gm{constructor(e=new I,t=new I){this.start=e,this.end=t}set(e,t){return this.start.copy(e),this.end.copy(t),this}copy(e){return this.start.copy(e.start),this.end.copy(e.end),this}getCenter(e){return e.addVectors(this.start,this.end).multiplyScalar(.5)}delta(e){return e.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(e,t){return this.delta(t).multiplyScalar(e).add(this.start)}closestPointToPointParameter(e,t){Af.subVectors(e,this.start),oa.subVectors(this.end,this.start);const n=oa.dot(oa);let r=oa.dot(Af)/n;return t&&(r=Qe(r,0,1)),r}closestPointToPoint(e,t,n){const i=this.closestPointToPointParameter(e,t);return this.delta(n).multiplyScalar(i).add(this.start)}applyMatrix4(e){return this.start.applyMatrix4(e),this.end.applyMatrix4(e),this}equals(e){return e.start.equals(this.start)&&e.end.equals(this.end)}clone(){return new this.constructor().copy(this)}}const Cf=new I;class j_ extends ut{constructor(e,t){super(),this.light=e,this.matrixAutoUpdate=!1,this.color=t,this.type="SpotLightHelper";const n=new nt,i=[0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,-1,0,1,0,0,0,0,1,1,0,0,0,0,-1,1];for(let o=0,a=1,l=32;o<l;o++,a++){const c=o/l*Math.PI*2,h=a/l*Math.PI*2;i.push(Math.cos(c),Math.sin(c),1,Math.cos(h),Math.sin(h),1)}n.setAttribute("position",new Ge(i,3));const r=new rn({fog:!1,toneMapped:!1});this.cone=new ei(n,r),this.add(this.cone),this.update()}dispose(){this.cone.geometry.dispose(),this.cone.material.dispose()}update(){this.light.updateWorldMatrix(!0,!1),this.light.target.updateWorldMatrix(!0,!1),this.parent?(this.parent.updateWorldMatrix(!0),this.matrix.copy(this.parent.matrixWorld).invert().multiply(this.light.matrixWorld)):this.matrix.copy(this.light.matrixWorld),this.matrixWorld.copy(this.light.matrixWorld);const e=this.light.distance?this.light.distance:1e3,t=e*Math.tan(this.light.angle);this.cone.scale.set(t,t,e),Cf.setFromMatrixPosition(this.light.target.matrixWorld),this.cone.lookAt(Cf),this.color!==void 0?this.cone.material.color.set(this.color):this.cone.material.color.copy(this.light.color)}}const Ri=new I,aa=new Ye,Bc=new Ye;class K_ extends ei{constructor(e){const t=_m(e),n=new nt,i=[],r=[],o=new Fe(0,0,1),a=new Fe(0,1,0);for(let c=0;c<t.length;c++){const h=t[c];h.parent&&h.parent.isBone&&(i.push(0,0,0),i.push(0,0,0),r.push(o.r,o.g,o.b),r.push(a.r,a.g,a.b))}n.setAttribute("position",new Ge(i,3)),n.setAttribute("color",new Ge(r,3));const l=new rn({vertexColors:!0,depthTest:!1,depthWrite:!1,toneMapped:!1,transparent:!0});super(n,l),this.isSkeletonHelper=!0,this.type="SkeletonHelper",this.root=e,this.bones=t,this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1}updateMatrixWorld(e){const t=this.bones,n=this.geometry,i=n.getAttribute("position");Bc.copy(this.root.matrixWorld).invert();for(let r=0,o=0;r<t.length;r++){const a=t[r];a.parent&&a.parent.isBone&&(aa.multiplyMatrices(Bc,a.matrixWorld),Ri.setFromMatrixPosition(aa),i.setXYZ(o,Ri.x,Ri.y,Ri.z),aa.multiplyMatrices(Bc,a.parent.matrixWorld),Ri.setFromMatrixPosition(aa),i.setXYZ(o+1,Ri.x,Ri.y,Ri.z),o+=2)}n.getAttribute("position").needsUpdate=!0,super.updateMatrixWorld(e)}dispose(){this.geometry.dispose(),this.material.dispose()}}function _m(s){const e=[];s.isBone===!0&&e.push(s);for(let t=0;t<s.children.length;t++)e.push.apply(e,_m(s.children[t]));return e}class J_ extends vt{constructor(e,t,n){const i=new go(t,4,2),r=new vi({wireframe:!0,fog:!1,toneMapped:!1});super(i,r),this.light=e,this.color=n,this.type="PointLightHelper",this.matrix=this.light.matrixWorld,this.matrixAutoUpdate=!1,this.update()}dispose(){this.geometry.dispose(),this.material.dispose()}update(){this.light.updateWorldMatrix(!0,!1),this.color!==void 0?this.material.color.set(this.color):this.material.color.copy(this.light.color)}}const Q_=new I,Rf=new Fe,Pf=new Fe;class $_ extends ut{constructor(e,t,n){super(),this.light=e,this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1,this.color=n,this.type="HemisphereLightHelper";const i=new mo(t);i.rotateY(Math.PI*.5),this.material=new vi({wireframe:!0,fog:!1,toneMapped:!1}),this.color===void 0&&(this.material.vertexColors=!0);const r=i.getAttribute("position"),o=new Float32Array(r.count*3);i.setAttribute("color",new mt(o,3)),this.add(new vt(i,this.material)),this.update()}dispose(){this.children[0].geometry.dispose(),this.children[0].material.dispose()}update(){const e=this.children[0];if(this.color!==void 0)this.material.color.set(this.color);else{const t=e.geometry.getAttribute("color");Rf.copy(this.light.color),Pf.copy(this.light.groundColor);for(let n=0,i=t.count;n<i;n++){const r=n<i/2?Rf:Pf;t.setXYZ(n,r.r,r.g,r.b)}t.needsUpdate=!0}this.light.updateWorldMatrix(!0,!1),e.lookAt(Q_.setFromMatrixPosition(this.light.matrixWorld).negate())}}class ev extends ei{constructor(e=10,t=10,n=4473924,i=8947848){n=new Fe(n),i=new Fe(i);const r=t/2,o=e/t,a=e/2,l=[],c=[];for(let f=0,d=0,p=-a;f<=t;f++,p+=o){l.push(-a,0,p,a,0,p),l.push(p,0,-a,p,0,a);const _=f===r?n:i;_.toArray(c,d),d+=3,_.toArray(c,d),d+=3,_.toArray(c,d),d+=3,_.toArray(c,d),d+=3}const h=new nt;h.setAttribute("position",new Ge(l,3)),h.setAttribute("color",new Ge(c,3));const u=new rn({vertexColors:!0,toneMapped:!1});super(h,u),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}class tv extends ei{constructor(e=10,t=16,n=8,i=64,r=4473924,o=8947848){r=new Fe(r),o=new Fe(o);const a=[],l=[];if(t>1)for(let u=0;u<t;u++){const f=u/t*(Math.PI*2),d=Math.sin(f)*e,p=Math.cos(f)*e;a.push(0,0,0),a.push(d,0,p);const _=u&1?r:o;l.push(_.r,_.g,_.b),l.push(_.r,_.g,_.b)}for(let u=0;u<n;u++){const f=u&1?r:o,d=e-e/n*u;for(let p=0;p<i;p++){let _=p/i*(Math.PI*2),g=Math.sin(_)*d,m=Math.cos(_)*d;a.push(g,0,m),l.push(f.r,f.g,f.b),_=(p+1)/i*(Math.PI*2),g=Math.sin(_)*d,m=Math.cos(_)*d,a.push(g,0,m),l.push(f.r,f.g,f.b)}}const c=new nt;c.setAttribute("position",new Ge(a,3)),c.setAttribute("color",new Ge(l,3));const h=new rn({vertexColors:!0,toneMapped:!1});super(c,h),this.type="PolarGridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}const If=new I,la=new I,Lf=new I;class nv extends ut{constructor(e,t,n){super(),this.light=e,this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1,this.color=n,this.type="DirectionalLightHelper",t===void 0&&(t=1);let i=new nt;i.setAttribute("position",new Ge([-t,t,0,t,t,0,t,-t,0,-t,-t,0,-t,t,0],3));const r=new rn({fog:!1,toneMapped:!1});this.lightPlane=new Li(i,r),this.add(this.lightPlane),i=new nt,i.setAttribute("position",new Ge([0,0,0,0,0,1],3)),this.targetLine=new Li(i,r),this.add(this.targetLine),this.update()}dispose(){this.lightPlane.geometry.dispose(),this.lightPlane.material.dispose(),this.targetLine.geometry.dispose(),this.targetLine.material.dispose()}update(){this.light.updateWorldMatrix(!0,!1),this.light.target.updateWorldMatrix(!0,!1),If.setFromMatrixPosition(this.light.matrixWorld),la.setFromMatrixPosition(this.light.target.matrixWorld),Lf.subVectors(la,If),this.lightPlane.lookAt(la),this.color!==void 0?(this.lightPlane.material.color.set(this.color),this.targetLine.material.color.set(this.color)):(this.lightPlane.material.color.copy(this.light.color),this.targetLine.material.color.copy(this.light.color)),this.targetLine.lookAt(la),this.targetLine.scale.z=Lf.length()}}const ca=new I,bt=new uo;class iv extends ei{constructor(e){const t=new nt,n=new rn({color:16777215,vertexColors:!0,toneMapped:!1}),i=[],r=[],o={};a("n1","n2"),a("n2","n4"),a("n4","n3"),a("n3","n1"),a("f1","f2"),a("f2","f4"),a("f4","f3"),a("f3","f1"),a("n1","f1"),a("n2","f2"),a("n3","f3"),a("n4","f4"),a("p","n1"),a("p","n2"),a("p","n3"),a("p","n4"),a("u1","u2"),a("u2","u3"),a("u3","u1"),a("c","t"),a("p","c"),a("cn1","cn2"),a("cn3","cn4"),a("cf1","cf2"),a("cf3","cf4");function a(p,_){l(p),l(_)}function l(p){i.push(0,0,0),r.push(0,0,0),o[p]===void 0&&(o[p]=[]),o[p].push(i.length/3-1)}t.setAttribute("position",new Ge(i,3)),t.setAttribute("color",new Ge(r,3)),super(t,n),this.type="CameraHelper",this.camera=e,this.camera.updateProjectionMatrix&&this.camera.updateProjectionMatrix(),this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1,this.pointMap=o,this.update();const c=new Fe(16755200),h=new Fe(16711680),u=new Fe(43775),f=new Fe(16777215),d=new Fe(3355443);this.setColors(c,h,u,f,d)}setColors(e,t,n,i,r){const a=this.geometry.getAttribute("color");a.setXYZ(0,e.r,e.g,e.b),a.setXYZ(1,e.r,e.g,e.b),a.setXYZ(2,e.r,e.g,e.b),a.setXYZ(3,e.r,e.g,e.b),a.setXYZ(4,e.r,e.g,e.b),a.setXYZ(5,e.r,e.g,e.b),a.setXYZ(6,e.r,e.g,e.b),a.setXYZ(7,e.r,e.g,e.b),a.setXYZ(8,e.r,e.g,e.b),a.setXYZ(9,e.r,e.g,e.b),a.setXYZ(10,e.r,e.g,e.b),a.setXYZ(11,e.r,e.g,e.b),a.setXYZ(12,e.r,e.g,e.b),a.setXYZ(13,e.r,e.g,e.b),a.setXYZ(14,e.r,e.g,e.b),a.setXYZ(15,e.r,e.g,e.b),a.setXYZ(16,e.r,e.g,e.b),a.setXYZ(17,e.r,e.g,e.b),a.setXYZ(18,e.r,e.g,e.b),a.setXYZ(19,e.r,e.g,e.b),a.setXYZ(20,e.r,e.g,e.b),a.setXYZ(21,e.r,e.g,e.b),a.setXYZ(22,e.r,e.g,e.b),a.setXYZ(23,e.r,e.g,e.b),a.setXYZ(24,t.r,t.g,t.b),a.setXYZ(25,t.r,t.g,t.b),a.setXYZ(26,t.r,t.g,t.b),a.setXYZ(27,t.r,t.g,t.b),a.setXYZ(28,t.r,t.g,t.b),a.setXYZ(29,t.r,t.g,t.b),a.setXYZ(30,t.r,t.g,t.b),a.setXYZ(31,t.r,t.g,t.b),a.setXYZ(32,n.r,n.g,n.b),a.setXYZ(33,n.r,n.g,n.b),a.setXYZ(34,n.r,n.g,n.b),a.setXYZ(35,n.r,n.g,n.b),a.setXYZ(36,n.r,n.g,n.b),a.setXYZ(37,n.r,n.g,n.b),a.setXYZ(38,i.r,i.g,i.b),a.setXYZ(39,i.r,i.g,i.b),a.setXYZ(40,r.r,r.g,r.b),a.setXYZ(41,r.r,r.g,r.b),a.setXYZ(42,r.r,r.g,r.b),a.setXYZ(43,r.r,r.g,r.b),a.setXYZ(44,r.r,r.g,r.b),a.setXYZ(45,r.r,r.g,r.b),a.setXYZ(46,r.r,r.g,r.b),a.setXYZ(47,r.r,r.g,r.b),a.setXYZ(48,r.r,r.g,r.b),a.setXYZ(49,r.r,r.g,r.b),a.needsUpdate=!0}update(){const e=this.geometry,t=this.pointMap,n=1,i=1;bt.projectionMatrixInverse.copy(this.camera.projectionMatrixInverse),Tt("c",t,e,bt,0,0,-1),Tt("t",t,e,bt,0,0,1),Tt("n1",t,e,bt,-n,-i,-1),Tt("n2",t,e,bt,n,-i,-1),Tt("n3",t,e,bt,-n,i,-1),Tt("n4",t,e,bt,n,i,-1),Tt("f1",t,e,bt,-n,-i,1),Tt("f2",t,e,bt,n,-i,1),Tt("f3",t,e,bt,-n,i,1),Tt("f4",t,e,bt,n,i,1),Tt("u1",t,e,bt,n*.7,i*1.1,-1),Tt("u2",t,e,bt,-n*.7,i*1.1,-1),Tt("u3",t,e,bt,0,i*2,-1),Tt("cf1",t,e,bt,-n,0,1),Tt("cf2",t,e,bt,n,0,1),Tt("cf3",t,e,bt,0,-i,1),Tt("cf4",t,e,bt,0,i,1),Tt("cn1",t,e,bt,-n,0,-1),Tt("cn2",t,e,bt,n,0,-1),Tt("cn3",t,e,bt,0,-i,-1),Tt("cn4",t,e,bt,0,i,-1),e.getAttribute("position").needsUpdate=!0}dispose(){this.geometry.dispose(),this.material.dispose()}}function Tt(s,e,t,n,i,r,o){ca.set(i,r,o).unproject(n);const a=e[s];if(a!==void 0){const l=t.getAttribute("position");for(let c=0,h=a.length;c<h;c++)l.setXYZ(a[c],ca.x,ca.y,ca.z)}}const ha=new wt;class rv extends ei{constructor(e,t=16776960){const n=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),i=new Float32Array(24),r=new nt;r.setIndex(new mt(n,1)),r.setAttribute("position",new mt(i,3)),super(r,new rn({color:t,toneMapped:!1})),this.object=e,this.type="BoxHelper",this.matrixAutoUpdate=!1,this.update()}update(e){if(e!==void 0&&console.warn("THREE.BoxHelper: .update() has no longer arguments."),this.object!==void 0&&ha.setFromObject(this.object),ha.isEmpty())return;const t=ha.min,n=ha.max,i=this.geometry.attributes.position,r=i.array;r[0]=n.x,r[1]=n.y,r[2]=n.z,r[3]=t.x,r[4]=n.y,r[5]=n.z,r[6]=t.x,r[7]=t.y,r[8]=n.z,r[9]=n.x,r[10]=t.y,r[11]=n.z,r[12]=n.x,r[13]=n.y,r[14]=t.z,r[15]=t.x,r[16]=n.y,r[17]=t.z,r[18]=t.x,r[19]=t.y,r[20]=t.z,r[21]=n.x,r[22]=t.y,r[23]=t.z,i.needsUpdate=!0,this.geometry.computeBoundingSphere()}setFromObject(e){return this.object=e,this.update(),this}copy(e,t){return super.copy(e,t),this.object=e.object,this}dispose(){this.geometry.dispose(),this.material.dispose()}}class sv extends ei{constructor(e,t=16776960){const n=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),i=[1,1,1,-1,1,1,-1,-1,1,1,-1,1,1,1,-1,-1,1,-1,-1,-1,-1,1,-1,-1],r=new nt;r.setIndex(new mt(n,1)),r.setAttribute("position",new Ge(i,3)),super(r,new rn({color:t,toneMapped:!1})),this.box=e,this.type="Box3Helper",this.geometry.computeBoundingSphere()}updateMatrixWorld(e){const t=this.box;t.isEmpty()||(t.getCenter(this.position),t.getSize(this.scale),this.scale.multiplyScalar(.5),super.updateMatrixWorld(e))}dispose(){this.geometry.dispose(),this.material.dispose()}}class ov extends Li{constructor(e,t=1,n=16776960){const i=n,r=[1,-1,0,-1,1,0,-1,-1,0,1,1,0,-1,1,0,-1,-1,0,1,-1,0,1,1,0],o=new nt;o.setAttribute("position",new Ge(r,3)),o.computeBoundingSphere(),super(o,new rn({color:i,toneMapped:!1})),this.type="PlaneHelper",this.plane=e,this.size=t;const a=[1,1,0,-1,1,0,-1,-1,0,1,1,0,-1,-1,0,1,-1,0],l=new nt;l.setAttribute("position",new Ge(a,3)),l.computeBoundingSphere(),this.add(new vt(l,new vi({color:i,opacity:.2,transparent:!0,depthWrite:!1,toneMapped:!1})))}updateMatrixWorld(e){this.position.set(0,0,0),this.scale.set(.5*this.size,.5*this.size,1),this.lookAt(this.plane.normal),this.translateZ(-this.plane.constant),super.updateMatrixWorld(e)}dispose(){this.geometry.dispose(),this.material.dispose(),this.children[0].geometry.dispose(),this.children[0].material.dispose()}}const Uf=new I;let ua,kc;class av extends ut{constructor(e=new I(0,0,1),t=new I(0,0,0),n=1,i=16776960,r=n*.2,o=r*.2){super(),this.type="ArrowHelper",ua===void 0&&(ua=new nt,ua.setAttribute("position",new Ge([0,0,0,0,1,0],3)),kc=new is(0,.5,1,5,1),kc.translate(0,-.5,0)),this.position.copy(t),this.line=new Li(ua,new rn({color:i,toneMapped:!1})),this.line.matrixAutoUpdate=!1,this.add(this.line),this.cone=new vt(kc,new vi({color:i,toneMapped:!1})),this.cone.matrixAutoUpdate=!1,this.add(this.cone),this.setDirection(e),this.setLength(n,r,o)}setDirection(e){if(e.y>.99999)this.quaternion.set(0,0,0,1);else if(e.y<-.99999)this.quaternion.set(1,0,0,0);else{Uf.set(e.z,0,-e.x).normalize();const t=Math.acos(e.y);this.quaternion.setFromAxisAngle(Uf,t)}}setLength(e,t=e*.2,n=t*.2){this.line.scale.set(1,Math.max(1e-4,e-t),1),this.line.updateMatrix(),this.cone.scale.set(n,t,n),this.cone.position.y=e,this.cone.updateMatrix()}setColor(e){this.line.material.color.set(e),this.cone.material.color.set(e)}copy(e){return super.copy(e,!1),this.line.copy(e.line),this.cone.copy(e.cone),this}dispose(){this.line.geometry.dispose(),this.line.material.dispose(),this.cone.geometry.dispose(),this.cone.material.dispose()}}class lv extends ei{constructor(e=1){const t=[0,0,0,e,0,0,0,0,0,0,e,0,0,0,0,0,0,e],n=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],i=new nt;i.setAttribute("position",new Ge(t,3)),i.setAttribute("color",new Ge(n,3));const r=new rn({vertexColors:!0,toneMapped:!1});super(i,r),this.type="AxesHelper"}setColors(e,t,n){const i=new Fe,r=this.geometry.attributes.color.array;return i.set(e),i.toArray(r,0),i.toArray(r,3),i.set(t),i.toArray(r,6),i.toArray(r,9),i.set(n),i.toArray(r,12),i.toArray(r,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}}class cv{constructor(){this.type="ShapePath",this.color=new Fe,this.subPaths=[],this.currentPath=null}moveTo(e,t){return this.currentPath=new $s,this.subPaths.push(this.currentPath),this.currentPath.moveTo(e,t),this}lineTo(e,t){return this.currentPath.lineTo(e,t),this}quadraticCurveTo(e,t,n,i){return this.currentPath.quadraticCurveTo(e,t,n,i),this}bezierCurveTo(e,t,n,i,r,o){return this.currentPath.bezierCurveTo(e,t,n,i,r,o),this}splineThru(e){return this.currentPath.splineThru(e),this}toShapes(e){function t(m){const x=[];for(let y=0,v=m.length;y<v;y++){const A=m[y],w=new ar;w.curves=A.curves,x.push(w)}return x}function n(m,x){const y=x.length;let v=!1;for(let A=y-1,w=0;w<y;A=w++){let T=x[A],C=x[w],b=C.x-T.x,M=C.y-T.y;if(Math.abs(M)>Number.EPSILON){if(M<0&&(T=x[w],b=-b,C=x[A],M=-M),m.y<T.y||m.y>C.y)continue;if(m.y===T.y){if(m.x===T.x)return!0}else{const U=M*(m.x-T.x)-b*(m.y-T.y);if(U===0)return!0;if(U<0)continue;v=!v}}else{if(m.y!==T.y)continue;if(C.x<=m.x&&m.x<=T.x||T.x<=m.x&&m.x<=C.x)return!0}}return v}const i=Jn.isClockWise,r=this.subPaths;if(r.length===0)return[];let o,a,l;const c=[];if(r.length===1)return a=r[0],l=new ar,l.curves=a.curves,c.push(l),c;let h=!i(r[0].getPoints());h=e?!h:h;const u=[],f=[];let d=[],p=0,_;f[p]=void 0,d[p]=[];for(let m=0,x=r.length;m<x;m++)a=r[m],_=a.getPoints(),o=i(_),o=e?!o:o,o?(!h&&f[p]&&p++,f[p]={s:new ar,p:_},f[p].s.curves=a.curves,h&&p++,d[p]=[]):d[p].push({h:a,p:_[0]});if(!f[0])return t(r);if(f.length>1){let m=!1,x=0;for(let y=0,v=f.length;y<v;y++)u[y]=[];for(let y=0,v=f.length;y<v;y++){const A=d[y];for(let w=0;w<A.length;w++){const T=A[w];let C=!0;for(let b=0;b<f.length;b++)n(T.p,f[b].p)&&(y!==b&&x++,C?(C=!1,u[b].push(T)):m=!0);C&&u[y].push(T)}}x>0&&m===!1&&(d=u)}let g;for(let m=0,x=f.length;m<x;m++){l=f[m].s,c.push(l),g=d[m];for(let y=0,v=g.length;y<v;y++)l.holes.push(g[y].h)}return c}}class vm extends $n{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(){}disconnect(){}dispose(){}update(){}}function hv(s,e){const t=s.image&&s.image.width?s.image.width/s.image.height:1;return t>e?(s.repeat.x=1,s.repeat.y=t/e,s.offset.x=0,s.offset.y=(1-s.repeat.y)/2):(s.repeat.x=e/t,s.repeat.y=1,s.offset.x=(1-s.repeat.x)/2,s.offset.y=0),s}function uv(s,e){const t=s.image&&s.image.width?s.image.width/s.image.height:1;return t>e?(s.repeat.x=e/t,s.repeat.y=1,s.offset.x=(1-s.repeat.x)/2,s.offset.y=0):(s.repeat.x=1,s.repeat.y=t/e,s.offset.x=0,s.offset.y=(1-s.repeat.y)/2),s}function fv(s){return s.repeat.x=1,s.repeat.y=1,s.offset.x=0,s.offset.y=0,s}function ph(s,e,t,n){const i=dv(n);switch(t){case Th:return s*e;case Ch:return s*e;case Rh:return s*e*2;case gl:return s*e/i.components*i.byteLength;case ho:return s*e/i.components*i.byteLength;case Ph:return s*e*2/i.components*i.byteLength;case _l:return s*e*2/i.components*i.byteLength;case Ah:return s*e*3/i.components*i.byteLength;case tn:return s*e*4/i.components*i.byteLength;case vl:return s*e*4/i.components*i.byteLength;case Ls:case Us:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case Ds:case Fs:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Na:case Ba:return Math.max(s,16)*Math.max(e,8)/4;case Fa:case Oa:return Math.max(s,8)*Math.max(e,8)/2;case ka:case za:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case Va:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Ga:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Ha:return Math.floor((s+4)/5)*Math.floor((e+3)/4)*16;case Wa:return Math.floor((s+4)/5)*Math.floor((e+4)/5)*16;case Xa:return Math.floor((s+5)/6)*Math.floor((e+4)/5)*16;case Ya:return Math.floor((s+5)/6)*Math.floor((e+5)/6)*16;case qa:return Math.floor((s+7)/8)*Math.floor((e+4)/5)*16;case Za:return Math.floor((s+7)/8)*Math.floor((e+5)/6)*16;case ja:return Math.floor((s+7)/8)*Math.floor((e+7)/8)*16;case Ka:return Math.floor((s+9)/10)*Math.floor((e+4)/5)*16;case Ja:return Math.floor((s+9)/10)*Math.floor((e+5)/6)*16;case Qa:return Math.floor((s+9)/10)*Math.floor((e+7)/8)*16;case $a:return Math.floor((s+9)/10)*Math.floor((e+9)/10)*16;case el:return Math.floor((s+11)/12)*Math.floor((e+9)/10)*16;case tl:return Math.floor((s+11)/12)*Math.floor((e+11)/12)*16;case Ns:case nl:case il:return Math.ceil(s/4)*Math.ceil(e/4)*16;case Ih:case rl:return Math.ceil(s/4)*Math.ceil(e/4)*8;case sl:case ol:return Math.ceil(s/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function dv(s){switch(s){case Qn:case bh:return{byteLength:1,components:1};case Jr:case wh:case ts:return{byteLength:2,components:1};case pl:case ml:return{byteLength:2,components:4};case gi:case dl:case pn:return{byteLength:4,components:1};case Eh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}const pv={contain:hv,cover:uv,fill:fv,getByteLength:ph};class mv extends Bn{constructor(e=1,t=1,n=1,i={}){console.warn('THREE.WebGLMultipleRenderTargets has been deprecated and will be removed in r172. Use THREE.WebGLRenderTarget and set the "count" parameter to enable MRT.'),super(e,t,{...i,count:n}),this.isWebGLMultipleRenderTargets=!0}get texture(){return this.textures}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:lo}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=lo);/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function ym(){let s=null,e=!1,t=null,n=null;function i(r,o){t(r,o),n=s.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(n=s.requestAnimationFrame(i),e=!0)},stop:function(){s.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){s=r}}}function gv(s){const e=new WeakMap;function t(a,l){const c=a.array,h=a.usage,u=c.byteLength,f=s.createBuffer();s.bindBuffer(l,f),s.bufferData(l,c,h),a.onUploadCallback();let d;if(c instanceof Float32Array)d=s.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?d=s.HALF_FLOAT:d=s.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=s.SHORT;else if(c instanceof Uint32Array)d=s.UNSIGNED_INT;else if(c instanceof Int32Array)d=s.INT;else if(c instanceof Int8Array)d=s.BYTE;else if(c instanceof Uint8Array)d=s.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,l,c){const h=l.array,u=l.updateRanges;if(s.bindBuffer(c,a),u.length===0)s.bufferSubData(c,0,h);else{u.sort((d,p)=>d.start-p.start);let f=0;for(let d=1;d<u.length;d++){const p=u[f],_=u[d];_.start<=p.start+p.count+1?p.count=Math.max(p.count,_.start+_.count-p.start):(++f,u[f]=_)}u.length=f+1;for(let d=0,p=u.length;d<p;d++){const _=u[d];s.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=e.get(a);l&&(s.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const h=e.get(a);(!h||h.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:i,remove:r,update:o}}var _v=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,vv=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,yv=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,xv=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Mv=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Sv=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,bv=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,wv=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Ev=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Tv=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Av=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Cv=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Rv=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Pv=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Iv=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Lv=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Uv=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Dv=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Fv=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Nv=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Ov=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Bv=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,kv=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,zv=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Vv=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Gv=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Hv=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Wv=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Xv=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Yv=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,qv="gl_FragColor = linearToOutputTexel( gl_FragColor );",Zv=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,jv=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Kv=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Jv=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Qv=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,$v=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,ey=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,ty=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,ny=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,iy=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,ry=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,sy=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,oy=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,ay=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,ly=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,cy=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,hy=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,uy=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,fy=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,dy=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,py=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,my=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,gy=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,_y=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,vy=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,yy=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,xy=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,My=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Sy=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,by=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,wy=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Ey=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Ty=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Ay=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Cy=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Ry=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Py=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Iy=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Ly=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Uy=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Dy=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Fy=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Ny=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Oy=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,By=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,ky=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,zy=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Vy=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Gy=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Hy=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Wy=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Xy=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Yy=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,qy=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Zy=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,jy=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Ky=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Jy=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Qy=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,$y=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,ex=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,tx=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,nx=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,ix=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,rx=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,sx=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,ox=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,ax=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,lx=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,cx=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,hx=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,ux=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,fx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,dx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,px=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,mx=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const gx=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,_x=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,vx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,yx=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,xx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Mx=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Sx=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,bx=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,wx=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Ex=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Tx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Ax=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Cx=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Rx=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Px=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Ix=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Lx=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ux=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Dx=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Fx=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Nx=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Ox=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Bx=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,kx=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,zx=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Vx=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Gx=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Hx=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Wx=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Xx=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Yx=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,qx=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Zx=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,jx=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,$e={alphahash_fragment:_v,alphahash_pars_fragment:vv,alphamap_fragment:yv,alphamap_pars_fragment:xv,alphatest_fragment:Mv,alphatest_pars_fragment:Sv,aomap_fragment:bv,aomap_pars_fragment:wv,batching_pars_vertex:Ev,batching_vertex:Tv,begin_vertex:Av,beginnormal_vertex:Cv,bsdfs:Rv,iridescence_fragment:Pv,bumpmap_pars_fragment:Iv,clipping_planes_fragment:Lv,clipping_planes_pars_fragment:Uv,clipping_planes_pars_vertex:Dv,clipping_planes_vertex:Fv,color_fragment:Nv,color_pars_fragment:Ov,color_pars_vertex:Bv,color_vertex:kv,common:zv,cube_uv_reflection_fragment:Vv,defaultnormal_vertex:Gv,displacementmap_pars_vertex:Hv,displacementmap_vertex:Wv,emissivemap_fragment:Xv,emissivemap_pars_fragment:Yv,colorspace_fragment:qv,colorspace_pars_fragment:Zv,envmap_fragment:jv,envmap_common_pars_fragment:Kv,envmap_pars_fragment:Jv,envmap_pars_vertex:Qv,envmap_physical_pars_fragment:cy,envmap_vertex:$v,fog_vertex:ey,fog_pars_vertex:ty,fog_fragment:ny,fog_pars_fragment:iy,gradientmap_pars_fragment:ry,lightmap_pars_fragment:sy,lights_lambert_fragment:oy,lights_lambert_pars_fragment:ay,lights_pars_begin:ly,lights_toon_fragment:hy,lights_toon_pars_fragment:uy,lights_phong_fragment:fy,lights_phong_pars_fragment:dy,lights_physical_fragment:py,lights_physical_pars_fragment:my,lights_fragment_begin:gy,lights_fragment_maps:_y,lights_fragment_end:vy,logdepthbuf_fragment:yy,logdepthbuf_pars_fragment:xy,logdepthbuf_pars_vertex:My,logdepthbuf_vertex:Sy,map_fragment:by,map_pars_fragment:wy,map_particle_fragment:Ey,map_particle_pars_fragment:Ty,metalnessmap_fragment:Ay,metalnessmap_pars_fragment:Cy,morphinstance_vertex:Ry,morphcolor_vertex:Py,morphnormal_vertex:Iy,morphtarget_pars_vertex:Ly,morphtarget_vertex:Uy,normal_fragment_begin:Dy,normal_fragment_maps:Fy,normal_pars_fragment:Ny,normal_pars_vertex:Oy,normal_vertex:By,normalmap_pars_fragment:ky,clearcoat_normal_fragment_begin:zy,clearcoat_normal_fragment_maps:Vy,clearcoat_pars_fragment:Gy,iridescence_pars_fragment:Hy,opaque_fragment:Wy,packing:Xy,premultiplied_alpha_fragment:Yy,project_vertex:qy,dithering_fragment:Zy,dithering_pars_fragment:jy,roughnessmap_fragment:Ky,roughnessmap_pars_fragment:Jy,shadowmap_pars_fragment:Qy,shadowmap_pars_vertex:$y,shadowmap_vertex:ex,shadowmask_pars_fragment:tx,skinbase_vertex:nx,skinning_pars_vertex:ix,skinning_vertex:rx,skinnormal_vertex:sx,specularmap_fragment:ox,specularmap_pars_fragment:ax,tonemapping_fragment:lx,tonemapping_pars_fragment:cx,transmission_fragment:hx,transmission_pars_fragment:ux,uv_pars_fragment:fx,uv_pars_vertex:dx,uv_vertex:px,worldpos_vertex:mx,background_vert:gx,background_frag:_x,backgroundCube_vert:vx,backgroundCube_frag:yx,cube_vert:xx,cube_frag:Mx,depth_vert:Sx,depth_frag:bx,distanceRGBA_vert:wx,distanceRGBA_frag:Ex,equirect_vert:Tx,equirect_frag:Ax,linedashed_vert:Cx,linedashed_frag:Rx,meshbasic_vert:Px,meshbasic_frag:Ix,meshlambert_vert:Lx,meshlambert_frag:Ux,meshmatcap_vert:Dx,meshmatcap_frag:Fx,meshnormal_vert:Nx,meshnormal_frag:Ox,meshphong_vert:Bx,meshphong_frag:kx,meshphysical_vert:zx,meshphysical_frag:Vx,meshtoon_vert:Gx,meshtoon_frag:Hx,points_vert:Wx,points_frag:Xx,shadow_vert:Yx,shadow_frag:qx,sprite_vert:Zx,sprite_frag:jx},Ne={common:{diffuse:{value:new Fe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Je},alphaMap:{value:null},alphaMapTransform:{value:new Je},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Je}},envmap:{envMap:{value:null},envMapRotation:{value:new Je},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Je}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Je}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Je},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Je},normalScale:{value:new Me(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Je},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Je}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Je}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Je}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Fe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Fe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Je},alphaTest:{value:0},uvTransform:{value:new Je}},sprite:{diffuse:{value:new Fe(16777215)},opacity:{value:1},center:{value:new Me(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Je},alphaMap:{value:null},alphaMapTransform:{value:new Je},alphaTest:{value:0}}},On={basic:{uniforms:Qt([Ne.common,Ne.specularmap,Ne.envmap,Ne.aomap,Ne.lightmap,Ne.fog]),vertexShader:$e.meshbasic_vert,fragmentShader:$e.meshbasic_frag},lambert:{uniforms:Qt([Ne.common,Ne.specularmap,Ne.envmap,Ne.aomap,Ne.lightmap,Ne.emissivemap,Ne.bumpmap,Ne.normalmap,Ne.displacementmap,Ne.fog,Ne.lights,{emissive:{value:new Fe(0)}}]),vertexShader:$e.meshlambert_vert,fragmentShader:$e.meshlambert_frag},phong:{uniforms:Qt([Ne.common,Ne.specularmap,Ne.envmap,Ne.aomap,Ne.lightmap,Ne.emissivemap,Ne.bumpmap,Ne.normalmap,Ne.displacementmap,Ne.fog,Ne.lights,{emissive:{value:new Fe(0)},specular:{value:new Fe(1118481)},shininess:{value:30}}]),vertexShader:$e.meshphong_vert,fragmentShader:$e.meshphong_frag},standard:{uniforms:Qt([Ne.common,Ne.envmap,Ne.aomap,Ne.lightmap,Ne.emissivemap,Ne.bumpmap,Ne.normalmap,Ne.displacementmap,Ne.roughnessmap,Ne.metalnessmap,Ne.fog,Ne.lights,{emissive:{value:new Fe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:$e.meshphysical_vert,fragmentShader:$e.meshphysical_frag},toon:{uniforms:Qt([Ne.common,Ne.aomap,Ne.lightmap,Ne.emissivemap,Ne.bumpmap,Ne.normalmap,Ne.displacementmap,Ne.gradientmap,Ne.fog,Ne.lights,{emissive:{value:new Fe(0)}}]),vertexShader:$e.meshtoon_vert,fragmentShader:$e.meshtoon_frag},matcap:{uniforms:Qt([Ne.common,Ne.bumpmap,Ne.normalmap,Ne.displacementmap,Ne.fog,{matcap:{value:null}}]),vertexShader:$e.meshmatcap_vert,fragmentShader:$e.meshmatcap_frag},points:{uniforms:Qt([Ne.points,Ne.fog]),vertexShader:$e.points_vert,fragmentShader:$e.points_frag},dashed:{uniforms:Qt([Ne.common,Ne.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:$e.linedashed_vert,fragmentShader:$e.linedashed_frag},depth:{uniforms:Qt([Ne.common,Ne.displacementmap]),vertexShader:$e.depth_vert,fragmentShader:$e.depth_frag},normal:{uniforms:Qt([Ne.common,Ne.bumpmap,Ne.normalmap,Ne.displacementmap,{opacity:{value:1}}]),vertexShader:$e.meshnormal_vert,fragmentShader:$e.meshnormal_frag},sprite:{uniforms:Qt([Ne.sprite,Ne.fog]),vertexShader:$e.sprite_vert,fragmentShader:$e.sprite_frag},background:{uniforms:{uvTransform:{value:new Je},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:$e.background_vert,fragmentShader:$e.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Je}},vertexShader:$e.backgroundCube_vert,fragmentShader:$e.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:$e.cube_vert,fragmentShader:$e.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:$e.equirect_vert,fragmentShader:$e.equirect_frag},distanceRGBA:{uniforms:Qt([Ne.common,Ne.displacementmap,{referencePosition:{value:new I},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:$e.distanceRGBA_vert,fragmentShader:$e.distanceRGBA_frag},shadow:{uniforms:Qt([Ne.lights,Ne.fog,{color:{value:new Fe(0)},opacity:{value:1}}]),vertexShader:$e.shadow_vert,fragmentShader:$e.shadow_frag}};On.physical={uniforms:Qt([On.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Je},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Je},clearcoatNormalScale:{value:new Me(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Je},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Je},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Je},sheen:{value:0},sheenColor:{value:new Fe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Je},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Je},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Je},transmissionSamplerSize:{value:new Me},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Je},attenuationDistance:{value:0},attenuationColor:{value:new Fe(0)},specularColor:{value:new Fe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Je},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Je},anisotropyVector:{value:new Me},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Je}}]),vertexShader:$e.meshphysical_vert,fragmentShader:$e.meshphysical_frag};const fa={r:0,b:0,g:0},Zi=new wn,Kx=new Ye;function Jx(s,e,t,n,i,r,o){const a=new Fe(0);let l=r===!0?0:1,c,h,u=null,f=0,d=null;function p(y){let v=y.isScene===!0?y.background:null;return v&&v.isTexture&&(v=(y.backgroundBlurriness>0?t:e).get(v)),v}function _(y){let v=!1;const A=p(y);A===null?m(a,l):A&&A.isColor&&(m(A,1),v=!0);const w=s.xr.getEnvironmentBlendMode();w==="additive"?n.buffers.color.setClear(0,0,0,1,o):w==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(s.autoClear||v)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function g(y,v){const A=p(v);A&&(A.isCubeTexture||A.mapping===es)?(h===void 0&&(h=new vt(new _r(1,1,1),new Pn({name:"BackgroundCubeMaterial",uniforms:$r(On.backgroundCube.uniforms),vertexShader:On.backgroundCube.vertexShader,fragmentShader:On.backgroundCube.fragmentShader,side:nn,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(w,T,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),Zi.copy(v.backgroundRotation),Zi.x*=-1,Zi.y*=-1,Zi.z*=-1,A.isCubeTexture&&A.isRenderTargetTexture===!1&&(Zi.y*=-1,Zi.z*=-1),h.material.uniforms.envMap.value=A,h.material.uniforms.flipEnvMap.value=A.isCubeTexture&&A.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Kx.makeRotationFromEuler(Zi)),h.material.toneMapped=at.getTransfer(A.colorSpace)!==dt,(u!==A||f!==A.version||d!==s.toneMapping)&&(h.material.needsUpdate=!0,u=A,f=A.version,d=s.toneMapping),h.layers.enableAll(),y.unshift(h,h.geometry,h.material,0,0,null)):A&&A.isTexture&&(c===void 0&&(c=new vt(new yi(2,2),new Pn({name:"BackgroundMaterial",uniforms:$r(On.background.uniforms),vertexShader:On.background.vertexShader,fragmentShader:On.background.fragmentShader,side:pi,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=A,c.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,c.material.toneMapped=at.getTransfer(A.colorSpace)!==dt,A.matrixAutoUpdate===!0&&A.updateMatrix(),c.material.uniforms.uvTransform.value.copy(A.matrix),(u!==A||f!==A.version||d!==s.toneMapping)&&(c.material.needsUpdate=!0,u=A,f=A.version,d=s.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null))}function m(y,v){y.getRGB(fa,xp(s)),n.buffers.color.setClear(fa.r,fa.g,fa.b,v,o)}function x(){h!==void 0&&(h.geometry.dispose(),h.material.dispose()),c!==void 0&&(c.geometry.dispose(),c.material.dispose())}return{getClearColor:function(){return a},setClearColor:function(y,v=1){a.set(y),l=v,m(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(y){l=y,m(a,l)},render:_,addToRenderList:g,dispose:x}}function Qx(s,e){const t=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=f(null);let r=i,o=!1;function a(M,U,L,F,N){let Q=!1;const V=u(F,L,U);r!==V&&(r=V,c(r.object)),Q=d(M,F,L,N),Q&&p(M,F,L,N),N!==null&&e.update(N,s.ELEMENT_ARRAY_BUFFER),(Q||o)&&(o=!1,v(M,U,L,F),N!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(N).buffer))}function l(){return s.createVertexArray()}function c(M){return s.bindVertexArray(M)}function h(M){return s.deleteVertexArray(M)}function u(M,U,L){const F=L.wireframe===!0;let N=n[M.id];N===void 0&&(N={},n[M.id]=N);let Q=N[U.id];Q===void 0&&(Q={},N[U.id]=Q);let V=Q[F];return V===void 0&&(V=f(l()),Q[F]=V),V}function f(M){const U=[],L=[],F=[];for(let N=0;N<t;N++)U[N]=0,L[N]=0,F[N]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:U,enabledAttributes:L,attributeDivisors:F,object:M,attributes:{},index:null}}function d(M,U,L,F){const N=r.attributes,Q=U.attributes;let V=0;const le=L.getAttributes();for(const Z in le)if(le[Z].location>=0){const K=N[Z];let O=Q[Z];if(O===void 0&&(Z==="instanceMatrix"&&M.instanceMatrix&&(O=M.instanceMatrix),Z==="instanceColor"&&M.instanceColor&&(O=M.instanceColor)),K===void 0||K.attribute!==O||O&&K.data!==O.data)return!0;V++}return r.attributesNum!==V||r.index!==F}function p(M,U,L,F){const N={},Q=U.attributes;let V=0;const le=L.getAttributes();for(const Z in le)if(le[Z].location>=0){let K=Q[Z];K===void 0&&(Z==="instanceMatrix"&&M.instanceMatrix&&(K=M.instanceMatrix),Z==="instanceColor"&&M.instanceColor&&(K=M.instanceColor));const O={};O.attribute=K,K&&K.data&&(O.data=K.data),N[Z]=O,V++}r.attributes=N,r.attributesNum=V,r.index=F}function _(){const M=r.newAttributes;for(let U=0,L=M.length;U<L;U++)M[U]=0}function g(M){m(M,0)}function m(M,U){const L=r.newAttributes,F=r.enabledAttributes,N=r.attributeDivisors;L[M]=1,F[M]===0&&(s.enableVertexAttribArray(M),F[M]=1),N[M]!==U&&(s.vertexAttribDivisor(M,U),N[M]=U)}function x(){const M=r.newAttributes,U=r.enabledAttributes;for(let L=0,F=U.length;L<F;L++)U[L]!==M[L]&&(s.disableVertexAttribArray(L),U[L]=0)}function y(M,U,L,F,N,Q,V){V===!0?s.vertexAttribIPointer(M,U,L,N,Q):s.vertexAttribPointer(M,U,L,F,N,Q)}function v(M,U,L,F){_();const N=F.attributes,Q=L.getAttributes(),V=U.defaultAttributeValues;for(const le in Q){const Z=Q[le];if(Z.location>=0){let te=N[le];if(te===void 0&&(le==="instanceMatrix"&&M.instanceMatrix&&(te=M.instanceMatrix),le==="instanceColor"&&M.instanceColor&&(te=M.instanceColor)),te!==void 0){const K=te.normalized,O=te.itemSize,J=e.get(te);if(J===void 0)continue;const ue=J.buffer,k=J.type,X=J.bytesPerElement,ce=k===s.INT||k===s.UNSIGNED_INT||te.gpuType===dl;if(te.isInterleavedBufferAttribute){const j=te.data,G=j.stride,pe=te.offset;if(j.isInstancedInterleavedBuffer){for(let se=0;se<Z.locationSize;se++)m(Z.location+se,j.meshPerAttribute);M.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=j.meshPerAttribute*j.count)}else for(let se=0;se<Z.locationSize;se++)g(Z.location+se);s.bindBuffer(s.ARRAY_BUFFER,ue);for(let se=0;se<Z.locationSize;se++)y(Z.location+se,O/Z.locationSize,k,K,G*X,(pe+O/Z.locationSize*se)*X,ce)}else{if(te.isInstancedBufferAttribute){for(let j=0;j<Z.locationSize;j++)m(Z.location+j,te.meshPerAttribute);M.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=te.meshPerAttribute*te.count)}else for(let j=0;j<Z.locationSize;j++)g(Z.location+j);s.bindBuffer(s.ARRAY_BUFFER,ue);for(let j=0;j<Z.locationSize;j++)y(Z.location+j,O/Z.locationSize,k,K,O*X,O/Z.locationSize*j*X,ce)}}else if(V!==void 0){const K=V[le];if(K!==void 0)switch(K.length){case 2:s.vertexAttrib2fv(Z.location,K);break;case 3:s.vertexAttrib3fv(Z.location,K);break;case 4:s.vertexAttrib4fv(Z.location,K);break;default:s.vertexAttrib1fv(Z.location,K)}}}}x()}function A(){C();for(const M in n){const U=n[M];for(const L in U){const F=U[L];for(const N in F)h(F[N].object),delete F[N];delete U[L]}delete n[M]}}function w(M){if(n[M.id]===void 0)return;const U=n[M.id];for(const L in U){const F=U[L];for(const N in F)h(F[N].object),delete F[N];delete U[L]}delete n[M.id]}function T(M){for(const U in n){const L=n[U];if(L[M.id]===void 0)continue;const F=L[M.id];for(const N in F)h(F[N].object),delete F[N];delete L[M.id]}}function C(){b(),o=!0,r!==i&&(r=i,c(r.object))}function b(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:a,reset:C,resetDefaultState:b,dispose:A,releaseStatesOfGeometry:w,releaseStatesOfProgram:T,initAttributes:_,enableAttribute:g,disableUnusedAttributes:x}}function $x(s,e,t){let n;function i(c){n=c}function r(c,h){s.drawArrays(n,c,h),t.update(h,n,1)}function o(c,h,u){u!==0&&(s.drawArraysInstanced(n,c,h,u),t.update(h,n,u))}function a(c,h,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,u);let d=0;for(let p=0;p<u;p++)d+=h[p];t.update(d,n,1)}function l(c,h,u,f){if(u===0)return;const d=e.get("WEBGL_multi_draw");if(d===null)for(let p=0;p<c.length;p++)o(c[p],h[p],f[p]);else{d.multiDrawArraysInstancedWEBGL(n,c,0,h,0,f,0,u);let p=0;for(let _=0;_<u;_++)p+=h[_]*f[_];t.update(p,n,1)}}this.setMode=i,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function eM(s,e,t,n){let i;function r(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const T=e.get("EXT_texture_filter_anisotropic");i=s.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(T){return!(T!==tn&&n.convert(T)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(T){const C=T===ts&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(T!==Qn&&n.convert(T)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&T!==pn&&!C)}function l(T){if(T==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=t.logarithmicDepthBuffer===!0,f=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),d=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),p=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=s.getParameter(s.MAX_TEXTURE_SIZE),g=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),m=s.getParameter(s.MAX_VERTEX_ATTRIBS),x=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),y=s.getParameter(s.MAX_VARYING_VECTORS),v=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),A=p>0,w=s.getParameter(s.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:u,reverseDepthBuffer:f,maxTextures:d,maxVertexTextures:p,maxTextureSize:_,maxCubemapSize:g,maxAttributes:m,maxVertexUniforms:x,maxVaryings:y,maxFragmentUniforms:v,vertexTextures:A,maxSamples:w}}function tM(s){const e=this;let t=null,n=0,i=!1,r=!1;const o=new Yn,a=new Je,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const d=u.length!==0||f||n!==0||i;return i=f,n=u.length,d},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){t=h(u,f,0)},this.setState=function(u,f,d){const p=u.clippingPlanes,_=u.clipIntersection,g=u.clipShadows,m=s.get(u);if(!i||p===null||p.length===0||r&&!g)r?h(null):c();else{const x=r?0:n,y=x*4;let v=m.clippingState||null;l.value=v,v=h(p,f,y,d);for(let A=0;A!==y;++A)v[A]=t[A];m.clippingState=v,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,f,d,p){const _=u!==null?u.length:0;let g=null;if(_!==0){if(g=l.value,p!==!0||g===null){const m=d+_*4,x=f.matrixWorldInverse;a.getNormalMatrix(x),(g===null||g.length<m)&&(g=new Float32Array(m));for(let y=0,v=d;y!==_;++y,v+=4)o.copy(u[y]).applyMatrix4(x,a),o.normal.toArray(g,v),g[v+3]=o.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,g}}function nM(s){let e=new WeakMap;function t(o,a){return a===Gs?o.mapping=mi:a===Hs&&(o.mapping=Ii),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===Gs||a===Hs)if(e.has(o)){const l=e.get(o).texture;return t(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new Sp(l.height);return c.fromEquirectangularTexture(s,o),e.set(o,c),o.addEventListener("dispose",i),t(c.texture,o.mapping)}else return null}}return o}function i(o){const a=o.target;a.removeEventListener("dispose",i);const l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}const Zr=4,Df=[.125,.215,.35,.446,.526,.582],$i=20,zc=new lr,Ff=new Fe;let Vc=null,Gc=0,Hc=0,Wc=!1;const Qi=(1+Math.sqrt(5))/2,Vr=1/Qi,Nf=[new I(-Qi,Vr,0),new I(Qi,Vr,0),new I(-Vr,0,Qi),new I(Vr,0,Qi),new I(0,Qi,-Vr),new I(0,Qi,Vr),new I(-1,1,-1),new I(1,1,-1),new I(-1,1,1),new I(1,1,1)];class mh{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,i=100){Vc=this._renderer.getRenderTarget(),Gc=this._renderer.getActiveCubeFace(),Hc=this._renderer.getActiveMipmapLevel(),Wc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,n,i,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=kf(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Bf(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Vc,Gc,Hc),this._renderer.xr.enabled=Wc,e.scissorTest=!1,da(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===mi||e.mapping===Ii?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Vc=this._renderer.getRenderTarget(),Gc=this._renderer.getActiveCubeFace(),Hc=this._renderer.getActiveMipmapLevel(),Wc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:At,minFilter:At,generateMipmaps:!1,type:ts,format:tn,colorSpace:pr,depthBuffer:!1},i=Of(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Of(e,t,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=iM(r)),this._blurMaterial=rM(r,e,t)}return i}_compileMaterial(e){const t=new vt(this._lodPlanes[0],e);this._renderer.compile(t,zc)}_sceneToCubeUV(e,t,n,i){const a=new Rt(90,1,t,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,f=h.toneMapping;h.getClearColor(Ff),h.toneMapping=fi,h.autoClear=!1;const d=new vi({name:"PMREM.Background",side:nn,depthWrite:!1,depthTest:!1}),p=new vt(new _r,d);let _=!1;const g=e.background;g?g.isColor&&(d.color.copy(g),e.background=null,_=!0):(d.color.copy(Ff),_=!0);for(let m=0;m<6;m++){const x=m%3;x===0?(a.up.set(0,l[m],0),a.lookAt(c[m],0,0)):x===1?(a.up.set(0,0,l[m]),a.lookAt(0,c[m],0)):(a.up.set(0,l[m],0),a.lookAt(0,0,c[m]));const y=this._cubeSize;da(i,x*y,m>2?y:0,y,y),h.setRenderTarget(i),_&&h.render(p,a),h.render(e,a)}p.geometry.dispose(),p.material.dispose(),h.toneMapping=f,h.autoClear=u,e.background=g}_textureToCubeUV(e,t){const n=this._renderer,i=e.mapping===mi||e.mapping===Ii;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=kf()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Bf());const r=i?this._cubemapMaterial:this._equirectMaterial,o=new vt(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;const l=this._cubeSize;da(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(o,zc)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const i=this._lodPlanes.length;for(let r=1;r<i;r++){const o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Nf[(i-r-1)%Nf.length];this._blur(e,r-1,r,o,a)}t.autoClear=n}_blur(e,t,n,i,r){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,i,"latitudinal",r),this._halfBlur(o,e,n,n,i,"longitudinal",r)}_halfBlur(e,t,n,i,r,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new vt(this._lodPlanes[i],c),f=c.uniforms,d=this._sizeLods[n]-1,p=isFinite(r)?Math.PI/(2*d):2*Math.PI/(2*$i-1),_=r/p,g=isFinite(r)?1+Math.floor(h*_):$i;g>$i&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${$i}`);const m=[];let x=0;for(let T=0;T<$i;++T){const C=T/_,b=Math.exp(-C*C/2);m.push(b),T===0?x+=b:T<g&&(x+=2*b)}for(let T=0;T<m.length;T++)m[T]=m[T]/x;f.envMap.value=e.texture,f.samples.value=g,f.weights.value=m,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);const{_lodMax:y}=this;f.dTheta.value=p,f.mipInt.value=y-n;const v=this._sizeLods[i],A=3*v*(i>y-Zr?i-y+Zr:0),w=4*(this._cubeSize-v);da(t,A,w,3*v,2*v),l.setRenderTarget(t),l.render(u,zc)}}function iM(s){const e=[],t=[],n=[];let i=s;const r=s-Zr+1+Df.length;for(let o=0;o<r;o++){const a=Math.pow(2,i);t.push(a);let l=1/a;o>s-Zr?l=Df[o-s+Zr-1]:o===0&&(l=0),n.push(l);const c=1/(a-2),h=-c,u=1+c,f=[h,h,u,h,u,u,h,h,u,u,h,u],d=6,p=6,_=3,g=2,m=1,x=new Float32Array(_*p*d),y=new Float32Array(g*p*d),v=new Float32Array(m*p*d);for(let w=0;w<d;w++){const T=w%3*2/3-1,C=w>2?0:-1,b=[T,C,0,T+2/3,C,0,T+2/3,C+1,0,T,C,0,T+2/3,C+1,0,T,C+1,0];x.set(b,_*p*w),y.set(f,g*p*w);const M=[w,w,w,w,w,w];v.set(M,m*p*w)}const A=new nt;A.setAttribute("position",new mt(x,_)),A.setAttribute("uv",new mt(y,g)),A.setAttribute("faceIndex",new mt(v,m)),e.push(A),i>Zr&&i--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Of(s,e,t){const n=new Bn(s,e,t);return n.texture.mapping=es,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function da(s,e,t,n,i){s.viewport.set(e,t,n,i),s.scissor.set(e,t,n,i)}function rM(s,e,t){const n=new Float32Array($i),i=new I(0,1,0);return new Pn({name:"SphericalGaussianBlur",defines:{n:$i,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:lu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:ui,depthTest:!1,depthWrite:!1})}function Bf(){return new Pn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:lu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:ui,depthTest:!1,depthWrite:!1})}function kf(){return new Pn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:lu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ui,depthTest:!1,depthWrite:!1})}function lu(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function sM(s){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){const l=a.mapping,c=l===Gs||l===Hs,h=l===mi||l===Ii;if(c||h){let u=e.get(a);const f=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==f)return t===null&&(t=new mh(s)),u=c?t.fromEquirectangular(a,u):t.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),u.texture;if(u!==void 0)return u.texture;{const d=a.image;return c&&d&&d.height>0||h&&d&&i(d)?(t===null&&(t=new mh(s)),u=c?t.fromEquirectangular(a):t.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function i(a){let l=0;const c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){const l=a.target;l.removeEventListener("dispose",r);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function oM(s){const e={};function t(n){if(e[n]!==void 0)return e[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const i=t(n);return i===null&&Hr("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function aM(s,e,t,n){const i={},r=new WeakMap;function o(u){const f=u.target;f.index!==null&&e.remove(f.index);for(const p in f.attributes)e.remove(f.attributes[p]);f.removeEventListener("dispose",o),delete i[f.id];const d=r.get(f);d&&(e.remove(d),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function a(u,f){return i[f.id]===!0||(f.addEventListener("dispose",o),i[f.id]=!0,t.memory.geometries++),f}function l(u){const f=u.attributes;for(const d in f)e.update(f[d],s.ARRAY_BUFFER)}function c(u){const f=[],d=u.index,p=u.attributes.position;let _=0;if(d!==null){const x=d.array;_=d.version;for(let y=0,v=x.length;y<v;y+=3){const A=x[y+0],w=x[y+1],T=x[y+2];f.push(A,w,w,T,T,A)}}else if(p!==void 0){const x=p.array;_=p.version;for(let y=0,v=x.length/3-1;y<v;y+=3){const A=y+0,w=y+1,T=y+2;f.push(A,w,w,T,T,A)}}else return;const g=new(mp(f)?kh:Bh)(f,1);g.version=_;const m=r.get(u);m&&e.remove(m),r.set(u,g)}function h(u){const f=r.get(u);if(f){const d=u.index;d!==null&&f.version<d.version&&c(u)}else c(u);return r.get(u)}return{get:a,update:l,getWireframeAttribute:h}}function lM(s,e,t){let n;function i(f){n=f}let r,o;function a(f){r=f.type,o=f.bytesPerElement}function l(f,d){s.drawElements(n,d,r,f*o),t.update(d,n,1)}function c(f,d,p){p!==0&&(s.drawElementsInstanced(n,d,r,f*o,p),t.update(d,n,p))}function h(f,d,p){if(p===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,r,f,0,p);let g=0;for(let m=0;m<p;m++)g+=d[m];t.update(g,n,1)}function u(f,d,p,_){if(p===0)return;const g=e.get("WEBGL_multi_draw");if(g===null)for(let m=0;m<f.length;m++)c(f[m]/o,d[m],_[m]);else{g.multiDrawElementsInstancedWEBGL(n,d,0,r,f,0,_,0,p);let m=0;for(let x=0;x<p;x++)m+=d[x]*_[x];t.update(m,n,1)}}this.setMode=i,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function cM(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case s.TRIANGLES:t.triangles+=a*(r/3);break;case s.LINES:t.lines+=a*(r/2);break;case s.LINE_STRIP:t.lines+=a*(r-1);break;case s.LINE_LOOP:t.lines+=a*r;break;case s.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function hM(s,e,t){const n=new WeakMap,i=new tt;function r(o,a,l){const c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0;let f=n.get(a);if(f===void 0||f.count!==u){let b=function(){T.dispose(),n.delete(a),a.removeEventListener("dispose",b)};f!==void 0&&f.texture.dispose();const d=a.morphAttributes.position!==void 0,p=a.morphAttributes.normal!==void 0,_=a.morphAttributes.color!==void 0,g=a.morphAttributes.position||[],m=a.morphAttributes.normal||[],x=a.morphAttributes.color||[];let y=0;d===!0&&(y=1),p===!0&&(y=2),_===!0&&(y=3);let v=a.attributes.position.count*y,A=1;v>e.maxTextureSize&&(A=Math.ceil(v/e.maxTextureSize),v=e.maxTextureSize);const w=new Float32Array(v*A*4*u),T=new xl(w,v,A,u);T.type=pn,T.needsUpdate=!0;const C=y*4;for(let M=0;M<u;M++){const U=g[M],L=m[M],F=x[M],N=v*A*4*M;for(let Q=0;Q<U.count;Q++){const V=Q*C;d===!0&&(i.fromBufferAttribute(U,Q),w[N+V+0]=i.x,w[N+V+1]=i.y,w[N+V+2]=i.z,w[N+V+3]=0),p===!0&&(i.fromBufferAttribute(L,Q),w[N+V+4]=i.x,w[N+V+5]=i.y,w[N+V+6]=i.z,w[N+V+7]=0),_===!0&&(i.fromBufferAttribute(F,Q),w[N+V+8]=i.x,w[N+V+9]=i.y,w[N+V+10]=i.z,w[N+V+11]=F.itemSize===4?i.w:1)}}f={count:u,texture:T,size:new Me(v,A)},n.set(a,f),a.addEventListener("dispose",b)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",o.morphTexture,t);else{let d=0;for(let _=0;_<c.length;_++)d+=c[_];const p=a.morphTargetsRelative?1:1-d;l.getUniforms().setValue(s,"morphTargetBaseInfluence",p),l.getUniforms().setValue(s,"morphTargetInfluences",c)}l.getUniforms().setValue(s,"morphTargetsTexture",f.texture,t),l.getUniforms().setValue(s,"morphTargetsTextureSize",f.size)}return{update:r}}function uM(s,e,t,n){let i=new WeakMap;function r(l){const c=n.render.frame,h=l.geometry,u=e.get(l,h);if(i.get(u)!==c&&(e.update(u),i.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),i.get(l)!==c&&(t.update(l.instanceMatrix,s.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,s.ARRAY_BUFFER),i.set(l,c))),l.isSkinnedMesh){const f=l.skeleton;i.get(f)!==c&&(f.update(),i.set(f,c))}return u}function o(){i=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:o}}const xm=new Mt,zf=new Hh(1,1),Mm=new xl,Sm=new Oh,bm=new fo,Vf=[],Gf=[],Hf=new Float32Array(16),Wf=new Float32Array(9),Xf=new Float32Array(4);function rs(s,e,t){const n=s[0];if(n<=0||n>0)return s;const i=e*t;let r=Vf[i];if(r===void 0&&(r=new Float32Array(i),Vf[i]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,s[o].toArray(r,a)}return r}function Lt(s,e){if(s.length!==e.length)return!1;for(let t=0,n=s.length;t<n;t++)if(s[t]!==e[t])return!1;return!0}function Ut(s,e){for(let t=0,n=e.length;t<n;t++)s[t]=e[t]}function Xl(s,e){let t=Gf[e];t===void 0&&(t=new Int32Array(e),Gf[e]=t);for(let n=0;n!==e;++n)t[n]=s.allocateTextureUnit();return t}function fM(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function dM(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Lt(t,e))return;s.uniform2fv(this.addr,e),Ut(t,e)}}function pM(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Lt(t,e))return;s.uniform3fv(this.addr,e),Ut(t,e)}}function mM(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Lt(t,e))return;s.uniform4fv(this.addr,e),Ut(t,e)}}function gM(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Lt(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),Ut(t,e)}else{if(Lt(t,n))return;Xf.set(n),s.uniformMatrix2fv(this.addr,!1,Xf),Ut(t,n)}}function _M(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Lt(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),Ut(t,e)}else{if(Lt(t,n))return;Wf.set(n),s.uniformMatrix3fv(this.addr,!1,Wf),Ut(t,n)}}function vM(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Lt(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),Ut(t,e)}else{if(Lt(t,n))return;Hf.set(n),s.uniformMatrix4fv(this.addr,!1,Hf),Ut(t,n)}}function yM(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function xM(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Lt(t,e))return;s.uniform2iv(this.addr,e),Ut(t,e)}}function MM(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Lt(t,e))return;s.uniform3iv(this.addr,e),Ut(t,e)}}function SM(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Lt(t,e))return;s.uniform4iv(this.addr,e),Ut(t,e)}}function bM(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function wM(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Lt(t,e))return;s.uniform2uiv(this.addr,e),Ut(t,e)}}function EM(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Lt(t,e))return;s.uniform3uiv(this.addr,e),Ut(t,e)}}function TM(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Lt(t,e))return;s.uniform4uiv(this.addr,e),Ut(t,e)}}function AM(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(zf.compareFunction=Dh,r=zf):r=xm,t.setTexture2D(e||r,i)}function CM(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||Sm,i)}function RM(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||bm,i)}function PM(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||Mm,i)}function IM(s){switch(s){case 5126:return fM;case 35664:return dM;case 35665:return pM;case 35666:return mM;case 35674:return gM;case 35675:return _M;case 35676:return vM;case 5124:case 35670:return yM;case 35667:case 35671:return xM;case 35668:case 35672:return MM;case 35669:case 35673:return SM;case 5125:return bM;case 36294:return wM;case 36295:return EM;case 36296:return TM;case 35678:case 36198:case 36298:case 36306:case 35682:return AM;case 35679:case 36299:case 36307:return CM;case 35680:case 36300:case 36308:case 36293:return RM;case 36289:case 36303:case 36311:case 36292:return PM}}function LM(s,e){s.uniform1fv(this.addr,e)}function UM(s,e){const t=rs(e,this.size,2);s.uniform2fv(this.addr,t)}function DM(s,e){const t=rs(e,this.size,3);s.uniform3fv(this.addr,t)}function FM(s,e){const t=rs(e,this.size,4);s.uniform4fv(this.addr,t)}function NM(s,e){const t=rs(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function OM(s,e){const t=rs(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function BM(s,e){const t=rs(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function kM(s,e){s.uniform1iv(this.addr,e)}function zM(s,e){s.uniform2iv(this.addr,e)}function VM(s,e){s.uniform3iv(this.addr,e)}function GM(s,e){s.uniform4iv(this.addr,e)}function HM(s,e){s.uniform1uiv(this.addr,e)}function WM(s,e){s.uniform2uiv(this.addr,e)}function XM(s,e){s.uniform3uiv(this.addr,e)}function YM(s,e){s.uniform4uiv(this.addr,e)}function qM(s,e,t){const n=this.cache,i=e.length,r=Xl(t,i);Lt(n,r)||(s.uniform1iv(this.addr,r),Ut(n,r));for(let o=0;o!==i;++o)t.setTexture2D(e[o]||xm,r[o])}function ZM(s,e,t){const n=this.cache,i=e.length,r=Xl(t,i);Lt(n,r)||(s.uniform1iv(this.addr,r),Ut(n,r));for(let o=0;o!==i;++o)t.setTexture3D(e[o]||Sm,r[o])}function jM(s,e,t){const n=this.cache,i=e.length,r=Xl(t,i);Lt(n,r)||(s.uniform1iv(this.addr,r),Ut(n,r));for(let o=0;o!==i;++o)t.setTextureCube(e[o]||bm,r[o])}function KM(s,e,t){const n=this.cache,i=e.length,r=Xl(t,i);Lt(n,r)||(s.uniform1iv(this.addr,r),Ut(n,r));for(let o=0;o!==i;++o)t.setTexture2DArray(e[o]||Mm,r[o])}function JM(s){switch(s){case 5126:return LM;case 35664:return UM;case 35665:return DM;case 35666:return FM;case 35674:return NM;case 35675:return OM;case 35676:return BM;case 5124:case 35670:return kM;case 35667:case 35671:return zM;case 35668:case 35672:return VM;case 35669:case 35673:return GM;case 5125:return HM;case 36294:return WM;case 36295:return XM;case 36296:return YM;case 35678:case 36198:case 36298:case 36306:case 35682:return qM;case 35679:case 36299:case 36307:return ZM;case 35680:case 36300:case 36308:case 36293:return jM;case 36289:case 36303:case 36311:case 36292:return KM}}class QM{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=IM(t.type)}}class $M{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=JM(t.type)}}class eS{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const i=this.seq;for(let r=0,o=i.length;r!==o;++r){const a=i[r];a.setValue(e,t[a.id],n)}}}const Xc=/(\w+)(\])?(\[|\.)?/g;function Yf(s,e){s.seq.push(e),s.map[e.id]=e}function tS(s,e,t){const n=s.name,i=n.length;for(Xc.lastIndex=0;;){const r=Xc.exec(n),o=Xc.lastIndex;let a=r[1];const l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===i){Yf(t,c===void 0?new QM(a,s,e):new $M(a,s,e));break}else{let u=t.map[a];u===void 0&&(u=new eS(a),Yf(t,u)),t=u}}}class ba{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const r=e.getActiveUniform(t,i),o=e.getUniformLocation(t,r.name);tS(r,o,this)}}setValue(e,t,n,i){const r=this.map[t];r!==void 0&&r.setValue(e,n,i)}setOptional(e,t,n){const i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let r=0,o=t.length;r!==o;++r){const a=t[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,i)}}static seqWithValue(e,t){const n=[];for(let i=0,r=e.length;i!==r;++i){const o=e[i];o.id in t&&n.push(o)}return n}}function qf(s,e,t){const n=s.createShader(e);return s.shaderSource(n,t),s.compileShader(n),n}const nS=37297;let iS=0;function rS(s,e){const t=s.split(`
`),n=[],i=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=i;o<r;o++){const a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}const Zf=new Je;function sS(s){at._getMatrix(Zf,at.workingColorSpace,s);const e=`mat3( ${Zf.elements.map(t=>t.toFixed(4))} )`;switch(at.getTransfer(s)){case Zs:return[e,"LinearTransferOETF"];case dt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",s),[e,"LinearTransferOETF"]}}function jf(s,e,t){const n=s.getShaderParameter(e,s.COMPILE_STATUS),i=s.getShaderInfoLog(e).trim();if(n&&i==="")return"";const r=/ERROR: 0:(\d+)/.exec(i);if(r){const o=parseInt(r[1]);return t.toUpperCase()+`

`+i+`

`+rS(s.getShaderSource(e),o)}else return i}function oS(s,e){const t=sS(e);return[`vec4 ${s}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function aS(s,e){let t;switch(e){case jd:t="Linear";break;case Kd:t="Reinhard";break;case Jd:t="Cineon";break;case Qd:t="ACESFilmic";break;case ep:t="AgX";break;case tp:t="Neutral";break;case $d:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const pa=new I;function lS(){at.getLuminanceCoefficients(pa);const s=pa.x.toFixed(4),e=pa.y.toFixed(4),t=pa.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function cS(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Rs).join(`
`)}function hS(s){const e=[];for(const t in s){const n=s[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function uS(s,e){const t={},n=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(e,i),o=r.name;let a=1;r.type===s.FLOAT_MAT2&&(a=2),r.type===s.FLOAT_MAT3&&(a=3),r.type===s.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:s.getAttribLocation(e,o),locationSize:a}}return t}function Rs(s){return s!==""}function Kf(s,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Jf(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const fS=/^[ \t]*#include +<([\w\d./]+)>/gm;function gh(s){return s.replace(fS,pS)}const dS=new Map;function pS(s,e){let t=$e[e];if(t===void 0){const n=dS.get(e);if(n!==void 0)t=$e[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return gh(t)}const mS=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Qf(s){return s.replace(mS,gS)}function gS(s,e,t,n){let i="";for(let r=parseInt(e);r<parseInt(t);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function $f(s){let e=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?e+=`
#define HIGH_PRECISION`:s.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function _S(s){let e="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===Mh?e="SHADOWMAP_TYPE_PCF":s.shadowMapType===Cd?e="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===Xn&&(e="SHADOWMAP_TYPE_VSM"),e}function vS(s){let e="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case mi:case Ii:e="ENVMAP_TYPE_CUBE";break;case es:e="ENVMAP_TYPE_CUBE_UV";break}return e}function yS(s){let e="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case Ii:e="ENVMAP_MODE_REFRACTION";break}return e}function xS(s){let e="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case co:e="ENVMAP_BLENDING_MULTIPLY";break;case qd:e="ENVMAP_BLENDING_MIX";break;case Zd:e="ENVMAP_BLENDING_ADD";break}return e}function MS(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function SS(s,e,t,n){const i=s.getContext(),r=t.defines;let o=t.vertexShader,a=t.fragmentShader;const l=_S(t),c=vS(t),h=yS(t),u=xS(t),f=MS(t),d=cS(t),p=hS(r),_=i.createProgram();let g,m,x=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(Rs).join(`
`),g.length>0&&(g+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(Rs).join(`
`),m.length>0&&(m+=`
`)):(g=[$f(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Rs).join(`
`),m=[$f(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==fi?"#define TONE_MAPPING":"",t.toneMapping!==fi?$e.tonemapping_pars_fragment:"",t.toneMapping!==fi?aS("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",$e.colorspace_pars_fragment,oS("linearToOutputTexel",t.outputColorSpace),lS(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Rs).join(`
`)),o=gh(o),o=Kf(o,t),o=Jf(o,t),a=gh(a),a=Kf(a,t),a=Jf(a,t),o=Qf(o),a=Qf(a),t.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,g=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,m=["#define varying in",t.glslVersion===oh?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===oh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const y=x+g+o,v=x+m+a,A=qf(i,i.VERTEX_SHADER,y),w=qf(i,i.FRAGMENT_SHADER,v);i.attachShader(_,A),i.attachShader(_,w),t.index0AttributeName!==void 0?i.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(_,0,"position"),i.linkProgram(_);function T(U){if(s.debug.checkShaderErrors){const L=i.getProgramInfoLog(_).trim(),F=i.getShaderInfoLog(A).trim(),N=i.getShaderInfoLog(w).trim();let Q=!0,V=!0;if(i.getProgramParameter(_,i.LINK_STATUS)===!1)if(Q=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,_,A,w);else{const le=jf(i,A,"vertex"),Z=jf(i,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(_,i.VALIDATE_STATUS)+`

Material Name: `+U.name+`
Material Type: `+U.type+`

Program Info Log: `+L+`
`+le+`
`+Z)}else L!==""?console.warn("THREE.WebGLProgram: Program Info Log:",L):(F===""||N==="")&&(V=!1);V&&(U.diagnostics={runnable:Q,programLog:L,vertexShader:{log:F,prefix:g},fragmentShader:{log:N,prefix:m}})}i.deleteShader(A),i.deleteShader(w),C=new ba(i,_),b=uS(i,_)}let C;this.getUniforms=function(){return C===void 0&&T(this),C};let b;this.getAttributes=function(){return b===void 0&&T(this),b};let M=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=i.getProgramParameter(_,nS)),M},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=iS++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=A,this.fragmentShader=w,this}let bS=0;class wS{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,i=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(i)===!1&&(o.add(i),i.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new ES(e),t.set(e,n)),n}}class ES{constructor(e){this.id=bS++,this.code=e,this.usedTimes=0}}function TS(s,e,t,n,i,r,o){const a=new Ml,l=new wS,c=new Set,h=[],u=i.logarithmicDepthBuffer,f=i.vertexTextures;let d=i.precision;const p={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(b){return c.add(b),b===0?"uv":`uv${b}`}function g(b,M,U,L,F){const N=L.fog,Q=F.geometry,V=b.isMeshStandardMaterial?L.environment:null,le=(b.isMeshStandardMaterial?t:e).get(b.envMap||V),Z=le&&le.mapping===es?le.image.height:null,te=p[b.type];b.precision!==null&&(d=i.getMaxPrecision(b.precision),d!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",d,"instead."));const K=Q.morphAttributes.position||Q.morphAttributes.normal||Q.morphAttributes.color,O=K!==void 0?K.length:0;let J=0;Q.morphAttributes.position!==void 0&&(J=1),Q.morphAttributes.normal!==void 0&&(J=2),Q.morphAttributes.color!==void 0&&(J=3);let ue,k,X,ce;if(te){const He=On[te];ue=He.vertexShader,k=He.fragmentShader}else ue=b.vertexShader,k=b.fragmentShader,l.update(b),X=l.getVertexShaderID(b),ce=l.getFragmentShaderID(b);const j=s.getRenderTarget(),G=s.state.buffers.depth.getReversed(),pe=F.isInstancedMesh===!0,se=F.isBatchedMesh===!0,ae=!!b.map,B=!!b.matcap,ie=!!le,R=!!b.aoMap,oe=!!b.lightMap,$=!!b.bumpMap,me=!!b.normalMap,ee=!!b.displacementMap,de=!!b.emissiveMap,fe=!!b.metalnessMap,E=!!b.roughnessMap,S=b.anisotropy>0,D=b.clearcoat>0,Y=b.dispersion>0,q=b.iridescence>0,re=b.sheen>0,Se=b.transmission>0,ye=S&&!!b.anisotropyMap,be=D&&!!b.clearcoatMap,Le=D&&!!b.clearcoatNormalMap,we=D&&!!b.clearcoatRoughnessMap,Re=q&&!!b.iridescenceMap,Ie=q&&!!b.iridescenceThicknessMap,De=re&&!!b.sheenColorMap,Te=re&&!!b.sheenRoughnessMap,W=!!b.specularMap,ve=!!b.specularColorMap,Ue=!!b.specularIntensityMap,z=Se&&!!b.transmissionMap,xe=Se&&!!b.thicknessMap,he=!!b.gradientMap,Ee=!!b.alphaMap,Ce=b.alphaTest>0,Ae=!!b.alphaHash,Be=!!b.extensions;let We=fi;b.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(We=s.toneMapping);const Ve={shaderID:te,shaderType:b.type,shaderName:b.name,vertexShader:ue,fragmentShader:k,defines:b.defines,customVertexShaderID:X,customFragmentShaderID:ce,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:d,batching:se,batchingColor:se&&F._colorsTexture!==null,instancing:pe,instancingColor:pe&&F.instanceColor!==null,instancingMorph:pe&&F.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:j===null?s.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:pr,alphaToCoverage:!!b.alphaToCoverage,map:ae,matcap:B,envMap:ie,envMapMode:ie&&le.mapping,envMapCubeUVHeight:Z,aoMap:R,lightMap:oe,bumpMap:$,normalMap:me,displacementMap:f&&ee,emissiveMap:de,normalMapObjectSpace:me&&b.normalMapType===ap,normalMapTangentSpace:me&&b.normalMapType===Ui,metalnessMap:fe,roughnessMap:E,anisotropy:S,anisotropyMap:ye,clearcoat:D,clearcoatMap:be,clearcoatNormalMap:Le,clearcoatRoughnessMap:we,dispersion:Y,iridescence:q,iridescenceMap:Re,iridescenceThicknessMap:Ie,sheen:re,sheenColorMap:De,sheenRoughnessMap:Te,specularMap:W,specularColorMap:ve,specularIntensityMap:Ue,transmission:Se,transmissionMap:z,thicknessMap:xe,gradientMap:he,opaque:b.transparent===!1&&b.blending===rr&&b.alphaToCoverage===!1,alphaMap:Ee,alphaTest:Ce,alphaHash:Ae,combine:b.combine,mapUv:ae&&_(b.map.channel),aoMapUv:R&&_(b.aoMap.channel),lightMapUv:oe&&_(b.lightMap.channel),bumpMapUv:$&&_(b.bumpMap.channel),normalMapUv:me&&_(b.normalMap.channel),displacementMapUv:ee&&_(b.displacementMap.channel),emissiveMapUv:de&&_(b.emissiveMap.channel),metalnessMapUv:fe&&_(b.metalnessMap.channel),roughnessMapUv:E&&_(b.roughnessMap.channel),anisotropyMapUv:ye&&_(b.anisotropyMap.channel),clearcoatMapUv:be&&_(b.clearcoatMap.channel),clearcoatNormalMapUv:Le&&_(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:we&&_(b.clearcoatRoughnessMap.channel),iridescenceMapUv:Re&&_(b.iridescenceMap.channel),iridescenceThicknessMapUv:Ie&&_(b.iridescenceThicknessMap.channel),sheenColorMapUv:De&&_(b.sheenColorMap.channel),sheenRoughnessMapUv:Te&&_(b.sheenRoughnessMap.channel),specularMapUv:W&&_(b.specularMap.channel),specularColorMapUv:ve&&_(b.specularColorMap.channel),specularIntensityMapUv:Ue&&_(b.specularIntensityMap.channel),transmissionMapUv:z&&_(b.transmissionMap.channel),thicknessMapUv:xe&&_(b.thicknessMap.channel),alphaMapUv:Ee&&_(b.alphaMap.channel),vertexTangents:!!Q.attributes.tangent&&(me||S),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!Q.attributes.color&&Q.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!Q.attributes.uv&&(ae||Ee),fog:!!N,useFog:b.fog===!0,fogExp2:!!N&&N.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:G,skinning:F.isSkinnedMesh===!0,morphTargets:Q.morphAttributes.position!==void 0,morphNormals:Q.morphAttributes.normal!==void 0,morphColors:Q.morphAttributes.color!==void 0,morphTargetsCount:O,morphTextureStride:J,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:s.shadowMap.enabled&&U.length>0,shadowMapType:s.shadowMap.type,toneMapping:We,decodeVideoTexture:ae&&b.map.isVideoTexture===!0&&at.getTransfer(b.map.colorSpace)===dt,decodeVideoTextureEmissive:de&&b.emissiveMap.isVideoTexture===!0&&at.getTransfer(b.emissiveMap.colorSpace)===dt,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===Cn,flipSided:b.side===nn,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Be&&b.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Be&&b.extensions.multiDraw===!0||se)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return Ve.vertexUv1s=c.has(1),Ve.vertexUv2s=c.has(2),Ve.vertexUv3s=c.has(3),c.clear(),Ve}function m(b){const M=[];if(b.shaderID?M.push(b.shaderID):(M.push(b.customVertexShaderID),M.push(b.customFragmentShaderID)),b.defines!==void 0)for(const U in b.defines)M.push(U),M.push(b.defines[U]);return b.isRawShaderMaterial===!1&&(x(M,b),y(M,b),M.push(s.outputColorSpace)),M.push(b.customProgramCacheKey),M.join()}function x(b,M){b.push(M.precision),b.push(M.outputColorSpace),b.push(M.envMapMode),b.push(M.envMapCubeUVHeight),b.push(M.mapUv),b.push(M.alphaMapUv),b.push(M.lightMapUv),b.push(M.aoMapUv),b.push(M.bumpMapUv),b.push(M.normalMapUv),b.push(M.displacementMapUv),b.push(M.emissiveMapUv),b.push(M.metalnessMapUv),b.push(M.roughnessMapUv),b.push(M.anisotropyMapUv),b.push(M.clearcoatMapUv),b.push(M.clearcoatNormalMapUv),b.push(M.clearcoatRoughnessMapUv),b.push(M.iridescenceMapUv),b.push(M.iridescenceThicknessMapUv),b.push(M.sheenColorMapUv),b.push(M.sheenRoughnessMapUv),b.push(M.specularMapUv),b.push(M.specularColorMapUv),b.push(M.specularIntensityMapUv),b.push(M.transmissionMapUv),b.push(M.thicknessMapUv),b.push(M.combine),b.push(M.fogExp2),b.push(M.sizeAttenuation),b.push(M.morphTargetsCount),b.push(M.morphAttributeCount),b.push(M.numDirLights),b.push(M.numPointLights),b.push(M.numSpotLights),b.push(M.numSpotLightMaps),b.push(M.numHemiLights),b.push(M.numRectAreaLights),b.push(M.numDirLightShadows),b.push(M.numPointLightShadows),b.push(M.numSpotLightShadows),b.push(M.numSpotLightShadowsWithMaps),b.push(M.numLightProbes),b.push(M.shadowMapType),b.push(M.toneMapping),b.push(M.numClippingPlanes),b.push(M.numClipIntersection),b.push(M.depthPacking)}function y(b,M){a.disableAll(),M.supportsVertexTextures&&a.enable(0),M.instancing&&a.enable(1),M.instancingColor&&a.enable(2),M.instancingMorph&&a.enable(3),M.matcap&&a.enable(4),M.envMap&&a.enable(5),M.normalMapObjectSpace&&a.enable(6),M.normalMapTangentSpace&&a.enable(7),M.clearcoat&&a.enable(8),M.iridescence&&a.enable(9),M.alphaTest&&a.enable(10),M.vertexColors&&a.enable(11),M.vertexAlphas&&a.enable(12),M.vertexUv1s&&a.enable(13),M.vertexUv2s&&a.enable(14),M.vertexUv3s&&a.enable(15),M.vertexTangents&&a.enable(16),M.anisotropy&&a.enable(17),M.alphaHash&&a.enable(18),M.batching&&a.enable(19),M.dispersion&&a.enable(20),M.batchingColor&&a.enable(21),b.push(a.mask),a.disableAll(),M.fog&&a.enable(0),M.useFog&&a.enable(1),M.flatShading&&a.enable(2),M.logarithmicDepthBuffer&&a.enable(3),M.reverseDepthBuffer&&a.enable(4),M.skinning&&a.enable(5),M.morphTargets&&a.enable(6),M.morphNormals&&a.enable(7),M.morphColors&&a.enable(8),M.premultipliedAlpha&&a.enable(9),M.shadowMapEnabled&&a.enable(10),M.doubleSided&&a.enable(11),M.flipSided&&a.enable(12),M.useDepthPacking&&a.enable(13),M.dithering&&a.enable(14),M.transmission&&a.enable(15),M.sheen&&a.enable(16),M.opaque&&a.enable(17),M.pointsUvs&&a.enable(18),M.decodeVideoTexture&&a.enable(19),M.decodeVideoTextureEmissive&&a.enable(20),M.alphaToCoverage&&a.enable(21),b.push(a.mask)}function v(b){const M=p[b.type];let U;if(M){const L=On[M];U=Qs.clone(L.uniforms)}else U=b.uniforms;return U}function A(b,M){let U;for(let L=0,F=h.length;L<F;L++){const N=h[L];if(N.cacheKey===M){U=N,++U.usedTimes;break}}return U===void 0&&(U=new SS(s,M,b,r),h.push(U)),U}function w(b){if(--b.usedTimes===0){const M=h.indexOf(b);h[M]=h[h.length-1],h.pop(),b.destroy()}}function T(b){l.remove(b)}function C(){l.dispose()}return{getParameters:g,getProgramCacheKey:m,getUniforms:v,acquireProgram:A,releaseProgram:w,releaseShaderCache:T,programs:h,dispose:C}}function AS(){let s=new WeakMap;function e(o){return s.has(o)}function t(o){let a=s.get(o);return a===void 0&&(a={},s.set(o,a)),a}function n(o){s.delete(o)}function i(o,a,l){s.get(o)[a]=l}function r(){s=new WeakMap}return{has:e,get:t,remove:n,update:i,dispose:r}}function CS(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.z!==e.z?s.z-e.z:s.id-e.id}function ed(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function td(){const s=[];let e=0;const t=[],n=[],i=[];function r(){e=0,t.length=0,n.length=0,i.length=0}function o(u,f,d,p,_,g){let m=s[e];return m===void 0?(m={id:u.id,object:u,geometry:f,material:d,groupOrder:p,renderOrder:u.renderOrder,z:_,group:g},s[e]=m):(m.id=u.id,m.object=u,m.geometry=f,m.material=d,m.groupOrder=p,m.renderOrder=u.renderOrder,m.z=_,m.group=g),e++,m}function a(u,f,d,p,_,g){const m=o(u,f,d,p,_,g);d.transmission>0?n.push(m):d.transparent===!0?i.push(m):t.push(m)}function l(u,f,d,p,_,g){const m=o(u,f,d,p,_,g);d.transmission>0?n.unshift(m):d.transparent===!0?i.unshift(m):t.unshift(m)}function c(u,f){t.length>1&&t.sort(u||CS),n.length>1&&n.sort(f||ed),i.length>1&&i.sort(f||ed)}function h(){for(let u=e,f=s.length;u<f;u++){const d=s[u];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:t,transmissive:n,transparent:i,init:r,push:a,unshift:l,finish:h,sort:c}}function RS(){let s=new WeakMap;function e(n,i){const r=s.get(n);let o;return r===void 0?(o=new td,s.set(n,[o])):i>=r.length?(o=new td,r.push(o)):o=r[i],o}function t(){s=new WeakMap}return{get:e,dispose:t}}function PS(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new I,color:new Fe};break;case"SpotLight":t={position:new I,direction:new I,color:new Fe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new I,color:new Fe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new I,skyColor:new Fe,groundColor:new Fe};break;case"RectAreaLight":t={color:new Fe,position:new I,halfWidth:new I,halfHeight:new I};break}return s[e.id]=t,t}}}function IS(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Me};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Me};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Me,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let LS=0;function US(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function DS(s){const e=new PS,t=IS(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new I);const i=new I,r=new Ye,o=new Ye;function a(c){let h=0,u=0,f=0;for(let b=0;b<9;b++)n.probe[b].set(0,0,0);let d=0,p=0,_=0,g=0,m=0,x=0,y=0,v=0,A=0,w=0,T=0;c.sort(US);for(let b=0,M=c.length;b<M;b++){const U=c[b],L=U.color,F=U.intensity,N=U.distance,Q=U.shadow&&U.shadow.map?U.shadow.map.texture:null;if(U.isAmbientLight)h+=L.r*F,u+=L.g*F,f+=L.b*F;else if(U.isLightProbe){for(let V=0;V<9;V++)n.probe[V].addScaledVector(U.sh.coefficients[V],F);T++}else if(U.isDirectionalLight){const V=e.get(U);if(V.color.copy(U.color).multiplyScalar(U.intensity),U.castShadow){const le=U.shadow,Z=t.get(U);Z.shadowIntensity=le.intensity,Z.shadowBias=le.bias,Z.shadowNormalBias=le.normalBias,Z.shadowRadius=le.radius,Z.shadowMapSize=le.mapSize,n.directionalShadow[d]=Z,n.directionalShadowMap[d]=Q,n.directionalShadowMatrix[d]=U.shadow.matrix,x++}n.directional[d]=V,d++}else if(U.isSpotLight){const V=e.get(U);V.position.setFromMatrixPosition(U.matrixWorld),V.color.copy(L).multiplyScalar(F),V.distance=N,V.coneCos=Math.cos(U.angle),V.penumbraCos=Math.cos(U.angle*(1-U.penumbra)),V.decay=U.decay,n.spot[_]=V;const le=U.shadow;if(U.map&&(n.spotLightMap[A]=U.map,A++,le.updateMatrices(U),U.castShadow&&w++),n.spotLightMatrix[_]=le.matrix,U.castShadow){const Z=t.get(U);Z.shadowIntensity=le.intensity,Z.shadowBias=le.bias,Z.shadowNormalBias=le.normalBias,Z.shadowRadius=le.radius,Z.shadowMapSize=le.mapSize,n.spotShadow[_]=Z,n.spotShadowMap[_]=Q,v++}_++}else if(U.isRectAreaLight){const V=e.get(U);V.color.copy(L).multiplyScalar(F),V.halfWidth.set(U.width*.5,0,0),V.halfHeight.set(0,U.height*.5,0),n.rectArea[g]=V,g++}else if(U.isPointLight){const V=e.get(U);if(V.color.copy(U.color).multiplyScalar(U.intensity),V.distance=U.distance,V.decay=U.decay,U.castShadow){const le=U.shadow,Z=t.get(U);Z.shadowIntensity=le.intensity,Z.shadowBias=le.bias,Z.shadowNormalBias=le.normalBias,Z.shadowRadius=le.radius,Z.shadowMapSize=le.mapSize,Z.shadowCameraNear=le.camera.near,Z.shadowCameraFar=le.camera.far,n.pointShadow[p]=Z,n.pointShadowMap[p]=Q,n.pointShadowMatrix[p]=U.shadow.matrix,y++}n.point[p]=V,p++}else if(U.isHemisphereLight){const V=e.get(U);V.skyColor.copy(U.color).multiplyScalar(F),V.groundColor.copy(U.groundColor).multiplyScalar(F),n.hemi[m]=V,m++}}g>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Ne.LTC_FLOAT_1,n.rectAreaLTC2=Ne.LTC_FLOAT_2):(n.rectAreaLTC1=Ne.LTC_HALF_1,n.rectAreaLTC2=Ne.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=f;const C=n.hash;(C.directionalLength!==d||C.pointLength!==p||C.spotLength!==_||C.rectAreaLength!==g||C.hemiLength!==m||C.numDirectionalShadows!==x||C.numPointShadows!==y||C.numSpotShadows!==v||C.numSpotMaps!==A||C.numLightProbes!==T)&&(n.directional.length=d,n.spot.length=_,n.rectArea.length=g,n.point.length=p,n.hemi.length=m,n.directionalShadow.length=x,n.directionalShadowMap.length=x,n.pointShadow.length=y,n.pointShadowMap.length=y,n.spotShadow.length=v,n.spotShadowMap.length=v,n.directionalShadowMatrix.length=x,n.pointShadowMatrix.length=y,n.spotLightMatrix.length=v+A-w,n.spotLightMap.length=A,n.numSpotLightShadowsWithMaps=w,n.numLightProbes=T,C.directionalLength=d,C.pointLength=p,C.spotLength=_,C.rectAreaLength=g,C.hemiLength=m,C.numDirectionalShadows=x,C.numPointShadows=y,C.numSpotShadows=v,C.numSpotMaps=A,C.numLightProbes=T,n.version=LS++)}function l(c,h){let u=0,f=0,d=0,p=0,_=0;const g=h.matrixWorldInverse;for(let m=0,x=c.length;m<x;m++){const y=c[m];if(y.isDirectionalLight){const v=n.directional[u];v.direction.setFromMatrixPosition(y.matrixWorld),i.setFromMatrixPosition(y.target.matrixWorld),v.direction.sub(i),v.direction.transformDirection(g),u++}else if(y.isSpotLight){const v=n.spot[d];v.position.setFromMatrixPosition(y.matrixWorld),v.position.applyMatrix4(g),v.direction.setFromMatrixPosition(y.matrixWorld),i.setFromMatrixPosition(y.target.matrixWorld),v.direction.sub(i),v.direction.transformDirection(g),d++}else if(y.isRectAreaLight){const v=n.rectArea[p];v.position.setFromMatrixPosition(y.matrixWorld),v.position.applyMatrix4(g),o.identity(),r.copy(y.matrixWorld),r.premultiply(g),o.extractRotation(r),v.halfWidth.set(y.width*.5,0,0),v.halfHeight.set(0,y.height*.5,0),v.halfWidth.applyMatrix4(o),v.halfHeight.applyMatrix4(o),p++}else if(y.isPointLight){const v=n.point[f];v.position.setFromMatrixPosition(y.matrixWorld),v.position.applyMatrix4(g),f++}else if(y.isHemisphereLight){const v=n.hemi[_];v.direction.setFromMatrixPosition(y.matrixWorld),v.direction.transformDirection(g),_++}}}return{setup:a,setupView:l,state:n}}function nd(s){const e=new DS(s),t=[],n=[];function i(h){c.camera=h,t.length=0,n.length=0}function r(h){t.push(h)}function o(h){n.push(h)}function a(){e.setup(t)}function l(h){e.setupView(t,h)}const c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:i,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function FS(s){let e=new WeakMap;function t(i,r=0){const o=e.get(i);let a;return o===void 0?(a=new nd(s),e.set(i,[a])):r>=o.length?(a=new nd(s),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}const NS=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,OS=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function BS(s,e,t){let n=new ns;const i=new Me,r=new Me,o=new tt,a=new Vl({depthPacking:Uh}),l=new Gl,c={},h=t.maxTextureSize,u={[pi]:nn,[nn]:pi,[Cn]:Cn},f=new Pn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Me},radius:{value:4}},vertexShader:NS,fragmentShader:OS}),d=f.clone();d.defines.HORIZONTAL_PASS=1;const p=new nt;p.setAttribute("position",new mt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new vt(p,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Mh;let m=this.type;this.render=function(w,T,C){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||w.length===0)return;const b=s.getRenderTarget(),M=s.getActiveCubeFace(),U=s.getActiveMipmapLevel(),L=s.state;L.setBlending(ui),L.buffers.color.setClear(1,1,1,1),L.buffers.depth.setTest(!0),L.setScissorTest(!1);const F=m!==Xn&&this.type===Xn,N=m===Xn&&this.type!==Xn;for(let Q=0,V=w.length;Q<V;Q++){const le=w[Q],Z=le.shadow;if(Z===void 0){console.warn("THREE.WebGLShadowMap:",le,"has no shadow.");continue}if(Z.autoUpdate===!1&&Z.needsUpdate===!1)continue;i.copy(Z.mapSize);const te=Z.getFrameExtents();if(i.multiply(te),r.copy(Z.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/te.x),i.x=r.x*te.x,Z.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/te.y),i.y=r.y*te.y,Z.mapSize.y=r.y)),Z.map===null||F===!0||N===!0){const O=this.type!==Xn?{minFilter:Xt,magFilter:Xt}:{};Z.map!==null&&Z.map.dispose(),Z.map=new Bn(i.x,i.y,O),Z.map.texture.name=le.name+".shadowMap",Z.camera.updateProjectionMatrix()}s.setRenderTarget(Z.map),s.clear();const K=Z.getViewportCount();for(let O=0;O<K;O++){const J=Z.getViewport(O);o.set(r.x*J.x,r.y*J.y,r.x*J.z,r.y*J.w),L.viewport(o),Z.updateMatrices(le,O),n=Z.getFrustum(),v(T,C,Z.camera,le,this.type)}Z.isPointLightShadow!==!0&&this.type===Xn&&x(Z,C),Z.needsUpdate=!1}m=this.type,g.needsUpdate=!1,s.setRenderTarget(b,M,U)};function x(w,T){const C=e.update(_);f.defines.VSM_SAMPLES!==w.blurSamples&&(f.defines.VSM_SAMPLES=w.blurSamples,d.defines.VSM_SAMPLES=w.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new Bn(i.x,i.y)),f.uniforms.shadow_pass.value=w.map.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,s.setRenderTarget(w.mapPass),s.clear(),s.renderBufferDirect(T,null,C,f,_,null),d.uniforms.shadow_pass.value=w.mapPass.texture,d.uniforms.resolution.value=w.mapSize,d.uniforms.radius.value=w.radius,s.setRenderTarget(w.map),s.clear(),s.renderBufferDirect(T,null,C,d,_,null)}function y(w,T,C,b){let M=null;const U=C.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(U!==void 0)M=U;else if(M=C.isPointLight===!0?l:a,s.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0){const L=M.uuid,F=T.uuid;let N=c[L];N===void 0&&(N={},c[L]=N);let Q=N[F];Q===void 0&&(Q=M.clone(),N[F]=Q,T.addEventListener("dispose",A)),M=Q}if(M.visible=T.visible,M.wireframe=T.wireframe,b===Xn?M.side=T.shadowSide!==null?T.shadowSide:T.side:M.side=T.shadowSide!==null?T.shadowSide:u[T.side],M.alphaMap=T.alphaMap,M.alphaTest=T.alphaTest,M.map=T.map,M.clipShadows=T.clipShadows,M.clippingPlanes=T.clippingPlanes,M.clipIntersection=T.clipIntersection,M.displacementMap=T.displacementMap,M.displacementScale=T.displacementScale,M.displacementBias=T.displacementBias,M.wireframeLinewidth=T.wireframeLinewidth,M.linewidth=T.linewidth,C.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const L=s.properties.get(M);L.light=C}return M}function v(w,T,C,b,M){if(w.visible===!1)return;if(w.layers.test(T.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&M===Xn)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,w.matrixWorld);const F=e.update(w),N=w.material;if(Array.isArray(N)){const Q=F.groups;for(let V=0,le=Q.length;V<le;V++){const Z=Q[V],te=N[Z.materialIndex];if(te&&te.visible){const K=y(w,te,b,M);w.onBeforeShadow(s,w,T,C,F,K,Z),s.renderBufferDirect(C,null,F,K,w,Z),w.onAfterShadow(s,w,T,C,F,K,Z)}}}else if(N.visible){const Q=y(w,N,b,M);w.onBeforeShadow(s,w,T,C,F,Q,null),s.renderBufferDirect(C,null,F,Q,w,null),w.onAfterShadow(s,w,T,C,F,Q,null)}}const L=w.children;for(let F=0,N=L.length;F<N;F++)v(L[F],T,C,b,M)}function A(w){w.target.removeEventListener("dispose",A);for(const C in c){const b=c[C],M=w.target.uuid;M in b&&(b[M].dispose(),delete b[M])}}}const kS={[Ca]:Ra,[Pa]:Ua,[Ia]:Da,[ur]:La,[Ra]:Ca,[Ua]:Pa,[Da]:Ia,[La]:ur};function zS(s,e){function t(){let z=!1;const xe=new tt;let he=null;const Ee=new tt(0,0,0,0);return{setMask:function(Ce){he!==Ce&&!z&&(s.colorMask(Ce,Ce,Ce,Ce),he=Ce)},setLocked:function(Ce){z=Ce},setClear:function(Ce,Ae,Be,We,Ve){Ve===!0&&(Ce*=We,Ae*=We,Be*=We),xe.set(Ce,Ae,Be,We),Ee.equals(xe)===!1&&(s.clearColor(Ce,Ae,Be,We),Ee.copy(xe))},reset:function(){z=!1,he=null,Ee.set(-1,0,0,0)}}}function n(){let z=!1,xe=!1,he=null,Ee=null,Ce=null;return{setReversed:function(Ae){if(xe!==Ae){const Be=e.get("EXT_clip_control");xe?Be.clipControlEXT(Be.LOWER_LEFT_EXT,Be.ZERO_TO_ONE_EXT):Be.clipControlEXT(Be.LOWER_LEFT_EXT,Be.NEGATIVE_ONE_TO_ONE_EXT);const We=Ce;Ce=null,this.setClear(We)}xe=Ae},getReversed:function(){return xe},setTest:function(Ae){Ae?j(s.DEPTH_TEST):G(s.DEPTH_TEST)},setMask:function(Ae){he!==Ae&&!z&&(s.depthMask(Ae),he=Ae)},setFunc:function(Ae){if(xe&&(Ae=kS[Ae]),Ee!==Ae){switch(Ae){case Ca:s.depthFunc(s.NEVER);break;case Ra:s.depthFunc(s.ALWAYS);break;case Pa:s.depthFunc(s.LESS);break;case ur:s.depthFunc(s.LEQUAL);break;case Ia:s.depthFunc(s.EQUAL);break;case La:s.depthFunc(s.GEQUAL);break;case Ua:s.depthFunc(s.GREATER);break;case Da:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}Ee=Ae}},setLocked:function(Ae){z=Ae},setClear:function(Ae){Ce!==Ae&&(xe&&(Ae=1-Ae),s.clearDepth(Ae),Ce=Ae)},reset:function(){z=!1,he=null,Ee=null,Ce=null,xe=!1}}}function i(){let z=!1,xe=null,he=null,Ee=null,Ce=null,Ae=null,Be=null,We=null,Ve=null;return{setTest:function(He){z||(He?j(s.STENCIL_TEST):G(s.STENCIL_TEST))},setMask:function(He){xe!==He&&!z&&(s.stencilMask(He),xe=He)},setFunc:function(He,lt,ft){(he!==He||Ee!==lt||Ce!==ft)&&(s.stencilFunc(He,lt,ft),he=He,Ee=lt,Ce=ft)},setOp:function(He,lt,ft){(Ae!==He||Be!==lt||We!==ft)&&(s.stencilOp(He,lt,ft),Ae=He,Be=lt,We=ft)},setLocked:function(He){z=He},setClear:function(He){Ve!==He&&(s.clearStencil(He),Ve=He)},reset:function(){z=!1,xe=null,he=null,Ee=null,Ce=null,Ae=null,Be=null,We=null,Ve=null}}}const r=new t,o=new n,a=new i,l=new WeakMap,c=new WeakMap;let h={},u={},f=new WeakMap,d=[],p=null,_=!1,g=null,m=null,x=null,y=null,v=null,A=null,w=null,T=new Fe(0,0,0),C=0,b=!1,M=null,U=null,L=null,F=null,N=null;const Q=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let V=!1,le=0;const Z=s.getParameter(s.VERSION);Z.indexOf("WebGL")!==-1?(le=parseFloat(/^WebGL (\d)/.exec(Z)[1]),V=le>=1):Z.indexOf("OpenGL ES")!==-1&&(le=parseFloat(/^OpenGL ES (\d)/.exec(Z)[1]),V=le>=2);let te=null,K={};const O=s.getParameter(s.SCISSOR_BOX),J=s.getParameter(s.VIEWPORT),ue=new tt().fromArray(O),k=new tt().fromArray(J);function X(z,xe,he,Ee){const Ce=new Uint8Array(4),Ae=s.createTexture();s.bindTexture(z,Ae),s.texParameteri(z,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(z,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Be=0;Be<he;Be++)z===s.TEXTURE_3D||z===s.TEXTURE_2D_ARRAY?s.texImage3D(xe,0,s.RGBA,1,1,Ee,0,s.RGBA,s.UNSIGNED_BYTE,Ce):s.texImage2D(xe+Be,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,Ce);return Ae}const ce={};ce[s.TEXTURE_2D]=X(s.TEXTURE_2D,s.TEXTURE_2D,1),ce[s.TEXTURE_CUBE_MAP]=X(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),ce[s.TEXTURE_2D_ARRAY]=X(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),ce[s.TEXTURE_3D]=X(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),j(s.DEPTH_TEST),o.setFunc(ur),$(!1),me(eh),j(s.CULL_FACE),R(ui);function j(z){h[z]!==!0&&(s.enable(z),h[z]=!0)}function G(z){h[z]!==!1&&(s.disable(z),h[z]=!1)}function pe(z,xe){return u[z]!==xe?(s.bindFramebuffer(z,xe),u[z]=xe,z===s.DRAW_FRAMEBUFFER&&(u[s.FRAMEBUFFER]=xe),z===s.FRAMEBUFFER&&(u[s.DRAW_FRAMEBUFFER]=xe),!0):!1}function se(z,xe){let he=d,Ee=!1;if(z){he=f.get(xe),he===void 0&&(he=[],f.set(xe,he));const Ce=z.textures;if(he.length!==Ce.length||he[0]!==s.COLOR_ATTACHMENT0){for(let Ae=0,Be=Ce.length;Ae<Be;Ae++)he[Ae]=s.COLOR_ATTACHMENT0+Ae;he.length=Ce.length,Ee=!0}}else he[0]!==s.BACK&&(he[0]=s.BACK,Ee=!0);Ee&&s.drawBuffers(he)}function ae(z){return p!==z?(s.useProgram(z),p=z,!0):!1}const B={[Pi]:s.FUNC_ADD,[Pd]:s.FUNC_SUBTRACT,[Id]:s.FUNC_REVERSE_SUBTRACT};B[Ld]=s.MIN,B[Ud]=s.MAX;const ie={[Dd]:s.ZERO,[Fd]:s.ONE,[Nd]:s.SRC_COLOR,[Ta]:s.SRC_ALPHA,[Gd]:s.SRC_ALPHA_SATURATE,[zd]:s.DST_COLOR,[Bd]:s.DST_ALPHA,[Od]:s.ONE_MINUS_SRC_COLOR,[Aa]:s.ONE_MINUS_SRC_ALPHA,[Vd]:s.ONE_MINUS_DST_COLOR,[kd]:s.ONE_MINUS_DST_ALPHA,[Hd]:s.CONSTANT_COLOR,[Wd]:s.ONE_MINUS_CONSTANT_COLOR,[Xd]:s.CONSTANT_ALPHA,[Yd]:s.ONE_MINUS_CONSTANT_ALPHA};function R(z,xe,he,Ee,Ce,Ae,Be,We,Ve,He){if(z===ui){_===!0&&(G(s.BLEND),_=!1);return}if(_===!1&&(j(s.BLEND),_=!0),z!==Rd){if(z!==g||He!==b){if((m!==Pi||v!==Pi)&&(s.blendEquation(s.FUNC_ADD),m=Pi,v=Pi),He)switch(z){case rr:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case th:s.blendFunc(s.ONE,s.ONE);break;case nh:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case ih:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",z);break}else switch(z){case rr:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case th:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case nh:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case ih:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",z);break}x=null,y=null,A=null,w=null,T.set(0,0,0),C=0,g=z,b=He}return}Ce=Ce||xe,Ae=Ae||he,Be=Be||Ee,(xe!==m||Ce!==v)&&(s.blendEquationSeparate(B[xe],B[Ce]),m=xe,v=Ce),(he!==x||Ee!==y||Ae!==A||Be!==w)&&(s.blendFuncSeparate(ie[he],ie[Ee],ie[Ae],ie[Be]),x=he,y=Ee,A=Ae,w=Be),(We.equals(T)===!1||Ve!==C)&&(s.blendColor(We.r,We.g,We.b,Ve),T.copy(We),C=Ve),g=z,b=!1}function oe(z,xe){z.side===Cn?G(s.CULL_FACE):j(s.CULL_FACE);let he=z.side===nn;xe&&(he=!he),$(he),z.blending===rr&&z.transparent===!1?R(ui):R(z.blending,z.blendEquation,z.blendSrc,z.blendDst,z.blendEquationAlpha,z.blendSrcAlpha,z.blendDstAlpha,z.blendColor,z.blendAlpha,z.premultipliedAlpha),o.setFunc(z.depthFunc),o.setTest(z.depthTest),o.setMask(z.depthWrite),r.setMask(z.colorWrite);const Ee=z.stencilWrite;a.setTest(Ee),Ee&&(a.setMask(z.stencilWriteMask),a.setFunc(z.stencilFunc,z.stencilRef,z.stencilFuncMask),a.setOp(z.stencilFail,z.stencilZFail,z.stencilZPass)),de(z.polygonOffset,z.polygonOffsetFactor,z.polygonOffsetUnits),z.alphaToCoverage===!0?j(s.SAMPLE_ALPHA_TO_COVERAGE):G(s.SAMPLE_ALPHA_TO_COVERAGE)}function $(z){M!==z&&(z?s.frontFace(s.CW):s.frontFace(s.CCW),M=z)}function me(z){z!==Td?(j(s.CULL_FACE),z!==U&&(z===eh?s.cullFace(s.BACK):z===Ad?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):G(s.CULL_FACE),U=z}function ee(z){z!==L&&(V&&s.lineWidth(z),L=z)}function de(z,xe,he){z?(j(s.POLYGON_OFFSET_FILL),(F!==xe||N!==he)&&(s.polygonOffset(xe,he),F=xe,N=he)):G(s.POLYGON_OFFSET_FILL)}function fe(z){z?j(s.SCISSOR_TEST):G(s.SCISSOR_TEST)}function E(z){z===void 0&&(z=s.TEXTURE0+Q-1),te!==z&&(s.activeTexture(z),te=z)}function S(z,xe,he){he===void 0&&(te===null?he=s.TEXTURE0+Q-1:he=te);let Ee=K[he];Ee===void 0&&(Ee={type:void 0,texture:void 0},K[he]=Ee),(Ee.type!==z||Ee.texture!==xe)&&(te!==he&&(s.activeTexture(he),te=he),s.bindTexture(z,xe||ce[z]),Ee.type=z,Ee.texture=xe)}function D(){const z=K[te];z!==void 0&&z.type!==void 0&&(s.bindTexture(z.type,null),z.type=void 0,z.texture=void 0)}function Y(){try{s.compressedTexImage2D.apply(s,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function q(){try{s.compressedTexImage3D.apply(s,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function re(){try{s.texSubImage2D.apply(s,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function Se(){try{s.texSubImage3D.apply(s,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function ye(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function be(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function Le(){try{s.texStorage2D.apply(s,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function we(){try{s.texStorage3D.apply(s,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function Re(){try{s.texImage2D.apply(s,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function Ie(){try{s.texImage3D.apply(s,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function De(z){ue.equals(z)===!1&&(s.scissor(z.x,z.y,z.z,z.w),ue.copy(z))}function Te(z){k.equals(z)===!1&&(s.viewport(z.x,z.y,z.z,z.w),k.copy(z))}function W(z,xe){let he=c.get(xe);he===void 0&&(he=new WeakMap,c.set(xe,he));let Ee=he.get(z);Ee===void 0&&(Ee=s.getUniformBlockIndex(xe,z.name),he.set(z,Ee))}function ve(z,xe){const Ee=c.get(xe).get(z);l.get(xe)!==Ee&&(s.uniformBlockBinding(xe,Ee,z.__bindingPointIndex),l.set(xe,Ee))}function Ue(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),o.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),h={},te=null,K={},u={},f=new WeakMap,d=[],p=null,_=!1,g=null,m=null,x=null,y=null,v=null,A=null,w=null,T=new Fe(0,0,0),C=0,b=!1,M=null,U=null,L=null,F=null,N=null,ue.set(0,0,s.canvas.width,s.canvas.height),k.set(0,0,s.canvas.width,s.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:j,disable:G,bindFramebuffer:pe,drawBuffers:se,useProgram:ae,setBlending:R,setMaterial:oe,setFlipSided:$,setCullFace:me,setLineWidth:ee,setPolygonOffset:de,setScissorTest:fe,activeTexture:E,bindTexture:S,unbindTexture:D,compressedTexImage2D:Y,compressedTexImage3D:q,texImage2D:Re,texImage3D:Ie,updateUBOMapping:W,uniformBlockBinding:ve,texStorage2D:Le,texStorage3D:we,texSubImage2D:re,texSubImage3D:Se,compressedTexSubImage2D:ye,compressedTexSubImage3D:be,scissor:De,viewport:Te,reset:Ue}}function VS(s,e,t,n,i,r,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Me,h=new WeakMap;let u;const f=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function p(E,S){return d?new OffscreenCanvas(E,S):Js("canvas")}function _(E,S,D){let Y=1;const q=fe(E);if((q.width>D||q.height>D)&&(Y=D/Math.max(q.width,q.height)),Y<1)if(typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&E instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&E instanceof ImageBitmap||typeof VideoFrame<"u"&&E instanceof VideoFrame){const re=Math.floor(Y*q.width),Se=Math.floor(Y*q.height);u===void 0&&(u=p(re,Se));const ye=S?p(re,Se):u;return ye.width=re,ye.height=Se,ye.getContext("2d").drawImage(E,0,0,re,Se),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+q.width+"x"+q.height+") to ("+re+"x"+Se+")."),ye}else return"data"in E&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+q.width+"x"+q.height+")."),E;return E}function g(E){return E.generateMipmaps}function m(E){s.generateMipmap(E)}function x(E){return E.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:E.isWebGL3DRenderTarget?s.TEXTURE_3D:E.isWebGLArrayRenderTarget||E.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function y(E,S,D,Y,q=!1){if(E!==null){if(s[E]!==void 0)return s[E];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+E+"'")}let re=S;if(S===s.RED&&(D===s.FLOAT&&(re=s.R32F),D===s.HALF_FLOAT&&(re=s.R16F),D===s.UNSIGNED_BYTE&&(re=s.R8)),S===s.RED_INTEGER&&(D===s.UNSIGNED_BYTE&&(re=s.R8UI),D===s.UNSIGNED_SHORT&&(re=s.R16UI),D===s.UNSIGNED_INT&&(re=s.R32UI),D===s.BYTE&&(re=s.R8I),D===s.SHORT&&(re=s.R16I),D===s.INT&&(re=s.R32I)),S===s.RG&&(D===s.FLOAT&&(re=s.RG32F),D===s.HALF_FLOAT&&(re=s.RG16F),D===s.UNSIGNED_BYTE&&(re=s.RG8)),S===s.RG_INTEGER&&(D===s.UNSIGNED_BYTE&&(re=s.RG8UI),D===s.UNSIGNED_SHORT&&(re=s.RG16UI),D===s.UNSIGNED_INT&&(re=s.RG32UI),D===s.BYTE&&(re=s.RG8I),D===s.SHORT&&(re=s.RG16I),D===s.INT&&(re=s.RG32I)),S===s.RGB_INTEGER&&(D===s.UNSIGNED_BYTE&&(re=s.RGB8UI),D===s.UNSIGNED_SHORT&&(re=s.RGB16UI),D===s.UNSIGNED_INT&&(re=s.RGB32UI),D===s.BYTE&&(re=s.RGB8I),D===s.SHORT&&(re=s.RGB16I),D===s.INT&&(re=s.RGB32I)),S===s.RGBA_INTEGER&&(D===s.UNSIGNED_BYTE&&(re=s.RGBA8UI),D===s.UNSIGNED_SHORT&&(re=s.RGBA16UI),D===s.UNSIGNED_INT&&(re=s.RGBA32UI),D===s.BYTE&&(re=s.RGBA8I),D===s.SHORT&&(re=s.RGBA16I),D===s.INT&&(re=s.RGBA32I)),S===s.RGB&&D===s.UNSIGNED_INT_5_9_9_9_REV&&(re=s.RGB9_E5),S===s.RGBA){const Se=q?Zs:at.getTransfer(Y);D===s.FLOAT&&(re=s.RGBA32F),D===s.HALF_FLOAT&&(re=s.RGBA16F),D===s.UNSIGNED_BYTE&&(re=Se===dt?s.SRGB8_ALPHA8:s.RGBA8),D===s.UNSIGNED_SHORT_4_4_4_4&&(re=s.RGBA4),D===s.UNSIGNED_SHORT_5_5_5_1&&(re=s.RGB5_A1)}return(re===s.R16F||re===s.R32F||re===s.RG16F||re===s.RG32F||re===s.RGBA16F||re===s.RGBA32F)&&e.get("EXT_color_buffer_float"),re}function v(E,S){let D;return E?S===null||S===gi||S===fr?D=s.DEPTH24_STENCIL8:S===pn?D=s.DEPTH32F_STENCIL8:S===Jr&&(D=s.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===gi||S===fr?D=s.DEPTH_COMPONENT24:S===pn?D=s.DEPTH_COMPONENT32F:S===Jr&&(D=s.DEPTH_COMPONENT16),D}function A(E,S){return g(E)===!0||E.isFramebufferTexture&&E.minFilter!==Xt&&E.minFilter!==At?Math.log2(Math.max(S.width,S.height))+1:E.mipmaps!==void 0&&E.mipmaps.length>0?E.mipmaps.length:E.isCompressedTexture&&Array.isArray(E.image)?S.mipmaps.length:1}function w(E){const S=E.target;S.removeEventListener("dispose",w),C(S),S.isVideoTexture&&h.delete(S)}function T(E){const S=E.target;S.removeEventListener("dispose",T),M(S)}function C(E){const S=n.get(E);if(S.__webglInit===void 0)return;const D=E.source,Y=f.get(D);if(Y){const q=Y[S.__cacheKey];q.usedTimes--,q.usedTimes===0&&b(E),Object.keys(Y).length===0&&f.delete(D)}n.remove(E)}function b(E){const S=n.get(E);s.deleteTexture(S.__webglTexture);const D=E.source,Y=f.get(D);delete Y[S.__cacheKey],o.memory.textures--}function M(E){const S=n.get(E);if(E.depthTexture&&(E.depthTexture.dispose(),n.remove(E.depthTexture)),E.isWebGLCubeRenderTarget)for(let Y=0;Y<6;Y++){if(Array.isArray(S.__webglFramebuffer[Y]))for(let q=0;q<S.__webglFramebuffer[Y].length;q++)s.deleteFramebuffer(S.__webglFramebuffer[Y][q]);else s.deleteFramebuffer(S.__webglFramebuffer[Y]);S.__webglDepthbuffer&&s.deleteRenderbuffer(S.__webglDepthbuffer[Y])}else{if(Array.isArray(S.__webglFramebuffer))for(let Y=0;Y<S.__webglFramebuffer.length;Y++)s.deleteFramebuffer(S.__webglFramebuffer[Y]);else s.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&s.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&s.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let Y=0;Y<S.__webglColorRenderbuffer.length;Y++)S.__webglColorRenderbuffer[Y]&&s.deleteRenderbuffer(S.__webglColorRenderbuffer[Y]);S.__webglDepthRenderbuffer&&s.deleteRenderbuffer(S.__webglDepthRenderbuffer)}const D=E.textures;for(let Y=0,q=D.length;Y<q;Y++){const re=n.get(D[Y]);re.__webglTexture&&(s.deleteTexture(re.__webglTexture),o.memory.textures--),n.remove(D[Y])}n.remove(E)}let U=0;function L(){U=0}function F(){const E=U;return E>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+E+" texture units while this GPU supports only "+i.maxTextures),U+=1,E}function N(E){const S=[];return S.push(E.wrapS),S.push(E.wrapT),S.push(E.wrapR||0),S.push(E.magFilter),S.push(E.minFilter),S.push(E.anisotropy),S.push(E.internalFormat),S.push(E.format),S.push(E.type),S.push(E.generateMipmaps),S.push(E.premultiplyAlpha),S.push(E.flipY),S.push(E.unpackAlignment),S.push(E.colorSpace),S.join()}function Q(E,S){const D=n.get(E);if(E.isVideoTexture&&ee(E),E.isRenderTargetTexture===!1&&E.version>0&&D.__version!==E.version){const Y=E.image;if(Y===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Y.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{k(D,E,S);return}}t.bindTexture(s.TEXTURE_2D,D.__webglTexture,s.TEXTURE0+S)}function V(E,S){const D=n.get(E);if(E.version>0&&D.__version!==E.version){k(D,E,S);return}t.bindTexture(s.TEXTURE_2D_ARRAY,D.__webglTexture,s.TEXTURE0+S)}function le(E,S){const D=n.get(E);if(E.version>0&&D.__version!==E.version){k(D,E,S);return}t.bindTexture(s.TEXTURE_3D,D.__webglTexture,s.TEXTURE0+S)}function Z(E,S){const D=n.get(E);if(E.version>0&&D.__version!==E.version){X(D,E,S);return}t.bindTexture(s.TEXTURE_CUBE_MAP,D.__webglTexture,s.TEXTURE0+S)}const te={[Ws]:s.REPEAT,[Rn]:s.CLAMP_TO_EDGE,[Xs]:s.MIRRORED_REPEAT},K={[Xt]:s.NEAREST,[Sh]:s.NEAREST_MIPMAP_NEAREST,[Wr]:s.NEAREST_MIPMAP_LINEAR,[At]:s.LINEAR,[Is]:s.LINEAR_MIPMAP_NEAREST,[Zn]:s.LINEAR_MIPMAP_LINEAR},O={[lp]:s.NEVER,[pp]:s.ALWAYS,[cp]:s.LESS,[Dh]:s.LEQUAL,[hp]:s.EQUAL,[dp]:s.GEQUAL,[up]:s.GREATER,[fp]:s.NOTEQUAL};function J(E,S){if(S.type===pn&&e.has("OES_texture_float_linear")===!1&&(S.magFilter===At||S.magFilter===Is||S.magFilter===Wr||S.magFilter===Zn||S.minFilter===At||S.minFilter===Is||S.minFilter===Wr||S.minFilter===Zn)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(E,s.TEXTURE_WRAP_S,te[S.wrapS]),s.texParameteri(E,s.TEXTURE_WRAP_T,te[S.wrapT]),(E===s.TEXTURE_3D||E===s.TEXTURE_2D_ARRAY)&&s.texParameteri(E,s.TEXTURE_WRAP_R,te[S.wrapR]),s.texParameteri(E,s.TEXTURE_MAG_FILTER,K[S.magFilter]),s.texParameteri(E,s.TEXTURE_MIN_FILTER,K[S.minFilter]),S.compareFunction&&(s.texParameteri(E,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(E,s.TEXTURE_COMPARE_FUNC,O[S.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===Xt||S.minFilter!==Wr&&S.minFilter!==Zn||S.type===pn&&e.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||n.get(S).__currentAnisotropy){const D=e.get("EXT_texture_filter_anisotropic");s.texParameterf(E,D.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,i.getMaxAnisotropy())),n.get(S).__currentAnisotropy=S.anisotropy}}}function ue(E,S){let D=!1;E.__webglInit===void 0&&(E.__webglInit=!0,S.addEventListener("dispose",w));const Y=S.source;let q=f.get(Y);q===void 0&&(q={},f.set(Y,q));const re=N(S);if(re!==E.__cacheKey){q[re]===void 0&&(q[re]={texture:s.createTexture(),usedTimes:0},o.memory.textures++,D=!0),q[re].usedTimes++;const Se=q[E.__cacheKey];Se!==void 0&&(q[E.__cacheKey].usedTimes--,Se.usedTimes===0&&b(S)),E.__cacheKey=re,E.__webglTexture=q[re].texture}return D}function k(E,S,D){let Y=s.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(Y=s.TEXTURE_2D_ARRAY),S.isData3DTexture&&(Y=s.TEXTURE_3D);const q=ue(E,S),re=S.source;t.bindTexture(Y,E.__webglTexture,s.TEXTURE0+D);const Se=n.get(re);if(re.version!==Se.__version||q===!0){t.activeTexture(s.TEXTURE0+D);const ye=at.getPrimaries(at.workingColorSpace),be=S.colorSpace===li?null:at.getPrimaries(S.colorSpace),Le=S.colorSpace===li||ye===be?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,S.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,S.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Le);let we=_(S.image,!1,i.maxTextureSize);we=de(S,we);const Re=r.convert(S.format,S.colorSpace),Ie=r.convert(S.type);let De=y(S.internalFormat,Re,Ie,S.colorSpace,S.isVideoTexture);J(Y,S);let Te;const W=S.mipmaps,ve=S.isVideoTexture!==!0,Ue=Se.__version===void 0||q===!0,z=re.dataReady,xe=A(S,we);if(S.isDepthTexture)De=v(S.format===dr,S.type),Ue&&(ve?t.texStorage2D(s.TEXTURE_2D,1,De,we.width,we.height):t.texImage2D(s.TEXTURE_2D,0,De,we.width,we.height,0,Re,Ie,null));else if(S.isDataTexture)if(W.length>0){ve&&Ue&&t.texStorage2D(s.TEXTURE_2D,xe,De,W[0].width,W[0].height);for(let he=0,Ee=W.length;he<Ee;he++)Te=W[he],ve?z&&t.texSubImage2D(s.TEXTURE_2D,he,0,0,Te.width,Te.height,Re,Ie,Te.data):t.texImage2D(s.TEXTURE_2D,he,De,Te.width,Te.height,0,Re,Ie,Te.data);S.generateMipmaps=!1}else ve?(Ue&&t.texStorage2D(s.TEXTURE_2D,xe,De,we.width,we.height),z&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,we.width,we.height,Re,Ie,we.data)):t.texImage2D(s.TEXTURE_2D,0,De,we.width,we.height,0,Re,Ie,we.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){ve&&Ue&&t.texStorage3D(s.TEXTURE_2D_ARRAY,xe,De,W[0].width,W[0].height,we.depth);for(let he=0,Ee=W.length;he<Ee;he++)if(Te=W[he],S.format!==tn)if(Re!==null)if(ve){if(z)if(S.layerUpdates.size>0){const Ce=ph(Te.width,Te.height,S.format,S.type);for(const Ae of S.layerUpdates){const Be=Te.data.subarray(Ae*Ce/Te.data.BYTES_PER_ELEMENT,(Ae+1)*Ce/Te.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,he,0,0,Ae,Te.width,Te.height,1,Re,Be)}S.clearLayerUpdates()}else t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,he,0,0,0,Te.width,Te.height,we.depth,Re,Te.data)}else t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,he,De,Te.width,Te.height,we.depth,0,Te.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else ve?z&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,he,0,0,0,Te.width,Te.height,we.depth,Re,Ie,Te.data):t.texImage3D(s.TEXTURE_2D_ARRAY,he,De,Te.width,Te.height,we.depth,0,Re,Ie,Te.data)}else{ve&&Ue&&t.texStorage2D(s.TEXTURE_2D,xe,De,W[0].width,W[0].height);for(let he=0,Ee=W.length;he<Ee;he++)Te=W[he],S.format!==tn?Re!==null?ve?z&&t.compressedTexSubImage2D(s.TEXTURE_2D,he,0,0,Te.width,Te.height,Re,Te.data):t.compressedTexImage2D(s.TEXTURE_2D,he,De,Te.width,Te.height,0,Te.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ve?z&&t.texSubImage2D(s.TEXTURE_2D,he,0,0,Te.width,Te.height,Re,Ie,Te.data):t.texImage2D(s.TEXTURE_2D,he,De,Te.width,Te.height,0,Re,Ie,Te.data)}else if(S.isDataArrayTexture)if(ve){if(Ue&&t.texStorage3D(s.TEXTURE_2D_ARRAY,xe,De,we.width,we.height,we.depth),z)if(S.layerUpdates.size>0){const he=ph(we.width,we.height,S.format,S.type);for(const Ee of S.layerUpdates){const Ce=we.data.subarray(Ee*he/we.data.BYTES_PER_ELEMENT,(Ee+1)*he/we.data.BYTES_PER_ELEMENT);t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,Ee,we.width,we.height,1,Re,Ie,Ce)}S.clearLayerUpdates()}else t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,we.width,we.height,we.depth,Re,Ie,we.data)}else t.texImage3D(s.TEXTURE_2D_ARRAY,0,De,we.width,we.height,we.depth,0,Re,Ie,we.data);else if(S.isData3DTexture)ve?(Ue&&t.texStorage3D(s.TEXTURE_3D,xe,De,we.width,we.height,we.depth),z&&t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,we.width,we.height,we.depth,Re,Ie,we.data)):t.texImage3D(s.TEXTURE_3D,0,De,we.width,we.height,we.depth,0,Re,Ie,we.data);else if(S.isFramebufferTexture){if(Ue)if(ve)t.texStorage2D(s.TEXTURE_2D,xe,De,we.width,we.height);else{let he=we.width,Ee=we.height;for(let Ce=0;Ce<xe;Ce++)t.texImage2D(s.TEXTURE_2D,Ce,De,he,Ee,0,Re,Ie,null),he>>=1,Ee>>=1}}else if(W.length>0){if(ve&&Ue){const he=fe(W[0]);t.texStorage2D(s.TEXTURE_2D,xe,De,he.width,he.height)}for(let he=0,Ee=W.length;he<Ee;he++)Te=W[he],ve?z&&t.texSubImage2D(s.TEXTURE_2D,he,0,0,Re,Ie,Te):t.texImage2D(s.TEXTURE_2D,he,De,Re,Ie,Te);S.generateMipmaps=!1}else if(ve){if(Ue){const he=fe(we);t.texStorage2D(s.TEXTURE_2D,xe,De,he.width,he.height)}z&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,Re,Ie,we)}else t.texImage2D(s.TEXTURE_2D,0,De,Re,Ie,we);g(S)&&m(Y),Se.__version=re.version,S.onUpdate&&S.onUpdate(S)}E.__version=S.version}function X(E,S,D){if(S.image.length!==6)return;const Y=ue(E,S),q=S.source;t.bindTexture(s.TEXTURE_CUBE_MAP,E.__webglTexture,s.TEXTURE0+D);const re=n.get(q);if(q.version!==re.__version||Y===!0){t.activeTexture(s.TEXTURE0+D);const Se=at.getPrimaries(at.workingColorSpace),ye=S.colorSpace===li?null:at.getPrimaries(S.colorSpace),be=S.colorSpace===li||Se===ye?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,S.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,S.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,be);const Le=S.isCompressedTexture||S.image[0].isCompressedTexture,we=S.image[0]&&S.image[0].isDataTexture,Re=[];for(let Ee=0;Ee<6;Ee++)!Le&&!we?Re[Ee]=_(S.image[Ee],!0,i.maxCubemapSize):Re[Ee]=we?S.image[Ee].image:S.image[Ee],Re[Ee]=de(S,Re[Ee]);const Ie=Re[0],De=r.convert(S.format,S.colorSpace),Te=r.convert(S.type),W=y(S.internalFormat,De,Te,S.colorSpace),ve=S.isVideoTexture!==!0,Ue=re.__version===void 0||Y===!0,z=q.dataReady;let xe=A(S,Ie);J(s.TEXTURE_CUBE_MAP,S);let he;if(Le){ve&&Ue&&t.texStorage2D(s.TEXTURE_CUBE_MAP,xe,W,Ie.width,Ie.height);for(let Ee=0;Ee<6;Ee++){he=Re[Ee].mipmaps;for(let Ce=0;Ce<he.length;Ce++){const Ae=he[Ce];S.format!==tn?De!==null?ve?z&&t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,Ce,0,0,Ae.width,Ae.height,De,Ae.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,Ce,W,Ae.width,Ae.height,0,Ae.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):ve?z&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,Ce,0,0,Ae.width,Ae.height,De,Te,Ae.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,Ce,W,Ae.width,Ae.height,0,De,Te,Ae.data)}}}else{if(he=S.mipmaps,ve&&Ue){he.length>0&&xe++;const Ee=fe(Re[0]);t.texStorage2D(s.TEXTURE_CUBE_MAP,xe,W,Ee.width,Ee.height)}for(let Ee=0;Ee<6;Ee++)if(we){ve?z&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,0,0,0,Re[Ee].width,Re[Ee].height,De,Te,Re[Ee].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,0,W,Re[Ee].width,Re[Ee].height,0,De,Te,Re[Ee].data);for(let Ce=0;Ce<he.length;Ce++){const Be=he[Ce].image[Ee].image;ve?z&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,Ce+1,0,0,Be.width,Be.height,De,Te,Be.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,Ce+1,W,Be.width,Be.height,0,De,Te,Be.data)}}else{ve?z&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,0,0,0,De,Te,Re[Ee]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,0,W,De,Te,Re[Ee]);for(let Ce=0;Ce<he.length;Ce++){const Ae=he[Ce];ve?z&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,Ce+1,0,0,De,Te,Ae.image[Ee]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,Ce+1,W,De,Te,Ae.image[Ee])}}}g(S)&&m(s.TEXTURE_CUBE_MAP),re.__version=q.version,S.onUpdate&&S.onUpdate(S)}E.__version=S.version}function ce(E,S,D,Y,q,re){const Se=r.convert(D.format,D.colorSpace),ye=r.convert(D.type),be=y(D.internalFormat,Se,ye,D.colorSpace),Le=n.get(S),we=n.get(D);if(we.__renderTarget=S,!Le.__hasExternalTextures){const Re=Math.max(1,S.width>>re),Ie=Math.max(1,S.height>>re);q===s.TEXTURE_3D||q===s.TEXTURE_2D_ARRAY?t.texImage3D(q,re,be,Re,Ie,S.depth,0,Se,ye,null):t.texImage2D(q,re,be,Re,Ie,0,Se,ye,null)}t.bindFramebuffer(s.FRAMEBUFFER,E),me(S)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,Y,q,we.__webglTexture,0,$(S)):(q===s.TEXTURE_2D||q>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&q<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,Y,q,we.__webglTexture,re),t.bindFramebuffer(s.FRAMEBUFFER,null)}function j(E,S,D){if(s.bindRenderbuffer(s.RENDERBUFFER,E),S.depthBuffer){const Y=S.depthTexture,q=Y&&Y.isDepthTexture?Y.type:null,re=v(S.stencilBuffer,q),Se=S.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ye=$(S);me(S)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,ye,re,S.width,S.height):D?s.renderbufferStorageMultisample(s.RENDERBUFFER,ye,re,S.width,S.height):s.renderbufferStorage(s.RENDERBUFFER,re,S.width,S.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,Se,s.RENDERBUFFER,E)}else{const Y=S.textures;for(let q=0;q<Y.length;q++){const re=Y[q],Se=r.convert(re.format,re.colorSpace),ye=r.convert(re.type),be=y(re.internalFormat,Se,ye,re.colorSpace),Le=$(S);D&&me(S)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,Le,be,S.width,S.height):me(S)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Le,be,S.width,S.height):s.renderbufferStorage(s.RENDERBUFFER,be,S.width,S.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function G(E,S){if(S&&S.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(s.FRAMEBUFFER,E),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const Y=n.get(S.depthTexture);Y.__renderTarget=S,(!Y.__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),Q(S.depthTexture,0);const q=Y.__webglTexture,re=$(S);if(S.depthTexture.format===sr)me(S)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,q,0,re):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,q,0);else if(S.depthTexture.format===dr)me(S)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,q,0,re):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,q,0);else throw new Error("Unknown depthTexture format")}function pe(E){const S=n.get(E),D=E.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==E.depthTexture){const Y=E.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),Y){const q=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,Y.removeEventListener("dispose",q)};Y.addEventListener("dispose",q),S.__depthDisposeCallback=q}S.__boundDepthTexture=Y}if(E.depthTexture&&!S.__autoAllocateDepthBuffer){if(D)throw new Error("target.depthTexture not supported in Cube render targets");G(S.__webglFramebuffer,E)}else if(D){S.__webglDepthbuffer=[];for(let Y=0;Y<6;Y++)if(t.bindFramebuffer(s.FRAMEBUFFER,S.__webglFramebuffer[Y]),S.__webglDepthbuffer[Y]===void 0)S.__webglDepthbuffer[Y]=s.createRenderbuffer(),j(S.__webglDepthbuffer[Y],E,!1);else{const q=E.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,re=S.__webglDepthbuffer[Y];s.bindRenderbuffer(s.RENDERBUFFER,re),s.framebufferRenderbuffer(s.FRAMEBUFFER,q,s.RENDERBUFFER,re)}}else if(t.bindFramebuffer(s.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=s.createRenderbuffer(),j(S.__webglDepthbuffer,E,!1);else{const Y=E.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,q=S.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,q),s.framebufferRenderbuffer(s.FRAMEBUFFER,Y,s.RENDERBUFFER,q)}t.bindFramebuffer(s.FRAMEBUFFER,null)}function se(E,S,D){const Y=n.get(E);S!==void 0&&ce(Y.__webglFramebuffer,E,E.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),D!==void 0&&pe(E)}function ae(E){const S=E.texture,D=n.get(E),Y=n.get(S);E.addEventListener("dispose",T);const q=E.textures,re=E.isWebGLCubeRenderTarget===!0,Se=q.length>1;if(Se||(Y.__webglTexture===void 0&&(Y.__webglTexture=s.createTexture()),Y.__version=S.version,o.memory.textures++),re){D.__webglFramebuffer=[];for(let ye=0;ye<6;ye++)if(S.mipmaps&&S.mipmaps.length>0){D.__webglFramebuffer[ye]=[];for(let be=0;be<S.mipmaps.length;be++)D.__webglFramebuffer[ye][be]=s.createFramebuffer()}else D.__webglFramebuffer[ye]=s.createFramebuffer()}else{if(S.mipmaps&&S.mipmaps.length>0){D.__webglFramebuffer=[];for(let ye=0;ye<S.mipmaps.length;ye++)D.__webglFramebuffer[ye]=s.createFramebuffer()}else D.__webglFramebuffer=s.createFramebuffer();if(Se)for(let ye=0,be=q.length;ye<be;ye++){const Le=n.get(q[ye]);Le.__webglTexture===void 0&&(Le.__webglTexture=s.createTexture(),o.memory.textures++)}if(E.samples>0&&me(E)===!1){D.__webglMultisampledFramebuffer=s.createFramebuffer(),D.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,D.__webglMultisampledFramebuffer);for(let ye=0;ye<q.length;ye++){const be=q[ye];D.__webglColorRenderbuffer[ye]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,D.__webglColorRenderbuffer[ye]);const Le=r.convert(be.format,be.colorSpace),we=r.convert(be.type),Re=y(be.internalFormat,Le,we,be.colorSpace,E.isXRRenderTarget===!0),Ie=$(E);s.renderbufferStorageMultisample(s.RENDERBUFFER,Ie,Re,E.width,E.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ye,s.RENDERBUFFER,D.__webglColorRenderbuffer[ye])}s.bindRenderbuffer(s.RENDERBUFFER,null),E.depthBuffer&&(D.__webglDepthRenderbuffer=s.createRenderbuffer(),j(D.__webglDepthRenderbuffer,E,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(re){t.bindTexture(s.TEXTURE_CUBE_MAP,Y.__webglTexture),J(s.TEXTURE_CUBE_MAP,S);for(let ye=0;ye<6;ye++)if(S.mipmaps&&S.mipmaps.length>0)for(let be=0;be<S.mipmaps.length;be++)ce(D.__webglFramebuffer[ye][be],E,S,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+ye,be);else ce(D.__webglFramebuffer[ye],E,S,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0);g(S)&&m(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Se){for(let ye=0,be=q.length;ye<be;ye++){const Le=q[ye],we=n.get(Le);t.bindTexture(s.TEXTURE_2D,we.__webglTexture),J(s.TEXTURE_2D,Le),ce(D.__webglFramebuffer,E,Le,s.COLOR_ATTACHMENT0+ye,s.TEXTURE_2D,0),g(Le)&&m(s.TEXTURE_2D)}t.unbindTexture()}else{let ye=s.TEXTURE_2D;if((E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&(ye=E.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(ye,Y.__webglTexture),J(ye,S),S.mipmaps&&S.mipmaps.length>0)for(let be=0;be<S.mipmaps.length;be++)ce(D.__webglFramebuffer[be],E,S,s.COLOR_ATTACHMENT0,ye,be);else ce(D.__webglFramebuffer,E,S,s.COLOR_ATTACHMENT0,ye,0);g(S)&&m(ye),t.unbindTexture()}E.depthBuffer&&pe(E)}function B(E){const S=E.textures;for(let D=0,Y=S.length;D<Y;D++){const q=S[D];if(g(q)){const re=x(E),Se=n.get(q).__webglTexture;t.bindTexture(re,Se),m(re),t.unbindTexture()}}}const ie=[],R=[];function oe(E){if(E.samples>0){if(me(E)===!1){const S=E.textures,D=E.width,Y=E.height;let q=s.COLOR_BUFFER_BIT;const re=E.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Se=n.get(E),ye=S.length>1;if(ye)for(let be=0;be<S.length;be++)t.bindFramebuffer(s.FRAMEBUFFER,Se.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+be,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,Se.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+be,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,Se.__webglMultisampledFramebuffer),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Se.__webglFramebuffer);for(let be=0;be<S.length;be++){if(E.resolveDepthBuffer&&(E.depthBuffer&&(q|=s.DEPTH_BUFFER_BIT),E.stencilBuffer&&E.resolveStencilBuffer&&(q|=s.STENCIL_BUFFER_BIT)),ye){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,Se.__webglColorRenderbuffer[be]);const Le=n.get(S[be]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,Le,0)}s.blitFramebuffer(0,0,D,Y,0,0,D,Y,q,s.NEAREST),l===!0&&(ie.length=0,R.length=0,ie.push(s.COLOR_ATTACHMENT0+be),E.depthBuffer&&E.resolveDepthBuffer===!1&&(ie.push(re),R.push(re),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,R)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,ie))}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),ye)for(let be=0;be<S.length;be++){t.bindFramebuffer(s.FRAMEBUFFER,Se.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+be,s.RENDERBUFFER,Se.__webglColorRenderbuffer[be]);const Le=n.get(S[be]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,Se.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+be,s.TEXTURE_2D,Le,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Se.__webglMultisampledFramebuffer)}else if(E.depthBuffer&&E.resolveDepthBuffer===!1&&l){const S=E.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[S])}}}function $(E){return Math.min(i.maxSamples,E.samples)}function me(E){const S=n.get(E);return E.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function ee(E){const S=o.render.frame;h.get(E)!==S&&(h.set(E,S),E.update())}function de(E,S){const D=E.colorSpace,Y=E.format,q=E.type;return E.isCompressedTexture===!0||E.isVideoTexture===!0||D!==pr&&D!==li&&(at.getTransfer(D)===dt?(Y!==tn||q!==Qn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",D)),S}function fe(E){return typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement?(c.width=E.naturalWidth||E.width,c.height=E.naturalHeight||E.height):typeof VideoFrame<"u"&&E instanceof VideoFrame?(c.width=E.displayWidth,c.height=E.displayHeight):(c.width=E.width,c.height=E.height),c}this.allocateTextureUnit=F,this.resetTextureUnits=L,this.setTexture2D=Q,this.setTexture2DArray=V,this.setTexture3D=le,this.setTextureCube=Z,this.rebindTextures=se,this.setupRenderTarget=ae,this.updateRenderTargetMipmap=B,this.updateMultisampleRenderTarget=oe,this.setupDepthRenderbuffer=pe,this.setupFrameBufferTexture=ce,this.useMultisampledRTT=me}function wm(s,e){function t(n,i=li){let r;const o=at.getTransfer(i);if(n===Qn)return s.UNSIGNED_BYTE;if(n===pl)return s.UNSIGNED_SHORT_4_4_4_4;if(n===ml)return s.UNSIGNED_SHORT_5_5_5_1;if(n===Eh)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===bh)return s.BYTE;if(n===wh)return s.SHORT;if(n===Jr)return s.UNSIGNED_SHORT;if(n===dl)return s.INT;if(n===gi)return s.UNSIGNED_INT;if(n===pn)return s.FLOAT;if(n===ts)return s.HALF_FLOAT;if(n===Th)return s.ALPHA;if(n===Ah)return s.RGB;if(n===tn)return s.RGBA;if(n===Ch)return s.LUMINANCE;if(n===Rh)return s.LUMINANCE_ALPHA;if(n===sr)return s.DEPTH_COMPONENT;if(n===dr)return s.DEPTH_STENCIL;if(n===gl)return s.RED;if(n===ho)return s.RED_INTEGER;if(n===Ph)return s.RG;if(n===_l)return s.RG_INTEGER;if(n===vl)return s.RGBA_INTEGER;if(n===Ls||n===Us||n===Ds||n===Fs)if(o===dt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Ls)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Us)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Ds)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Fs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Ls)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Us)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Ds)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Fs)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Fa||n===Na||n===Oa||n===Ba)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Fa)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Na)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Oa)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Ba)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===ka||n===za||n===Va)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===ka||n===za)return o===dt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Va)return o===dt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Ga||n===Ha||n===Wa||n===Xa||n===Ya||n===qa||n===Za||n===ja||n===Ka||n===Ja||n===Qa||n===$a||n===el||n===tl)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Ga)return o===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Ha)return o===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Wa)return o===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Xa)return o===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Ya)return o===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===qa)return o===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Za)return o===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===ja)return o===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ka)return o===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Ja)return o===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Qa)return o===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===$a)return o===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===el)return o===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===tl)return o===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Ns||n===nl||n===il)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Ns)return o===dt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===nl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===il)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Ih||n===rl||n===sl||n===ol)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Ns)return r.COMPRESSED_RED_RGTC1_EXT;if(n===rl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===sl)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===ol)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===fr?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:t}}const GS={type:"move"};class Yc{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Yr,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Yr,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new I,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new I),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Yr,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new I,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new I),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,r=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(const _ of e.hand.values()){const g=t.getJointPose(_,n),m=this._getHandJoint(c,_);g!==null&&(m.matrix.fromArray(g.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=g.radius),m.visible=g!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],f=h.position.distanceTo(u.position),d=.02,p=.005;c.inputState.pinching&&f>d+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=d-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(GS)))}return a!==null&&(a.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Yr;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const HS=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,WS=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class XS{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){const i=new Mt,r=e.properties.get(i);r.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new Pn({vertexShader:HS,fragmentShader:WS,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new vt(new yi(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class YS extends $n{constructor(e,t){super();const n=this;let i=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,f=null,d=null,p=null;const _=new XS,g=t.getContextAttributes();let m=null,x=null;const y=[],v=[],A=new Me;let w=null;const T=new Rt;T.viewport=new tt;const C=new Rt;C.viewport=new tt;const b=[T,C],M=new um;let U=null,L=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(k){let X=y[k];return X===void 0&&(X=new Yc,y[k]=X),X.getTargetRaySpace()},this.getControllerGrip=function(k){let X=y[k];return X===void 0&&(X=new Yc,y[k]=X),X.getGripSpace()},this.getHand=function(k){let X=y[k];return X===void 0&&(X=new Yc,y[k]=X),X.getHandSpace()};function F(k){const X=v.indexOf(k.inputSource);if(X===-1)return;const ce=y[X];ce!==void 0&&(ce.update(k.inputSource,k.frame,c||o),ce.dispatchEvent({type:k.type,data:k.inputSource}))}function N(){i.removeEventListener("select",F),i.removeEventListener("selectstart",F),i.removeEventListener("selectend",F),i.removeEventListener("squeeze",F),i.removeEventListener("squeezestart",F),i.removeEventListener("squeezeend",F),i.removeEventListener("end",N),i.removeEventListener("inputsourceschange",Q);for(let k=0;k<y.length;k++){const X=v[k];X!==null&&(v[k]=null,y[k].disconnect(X))}U=null,L=null,_.reset(),e.setRenderTarget(m),d=null,f=null,u=null,i=null,x=null,ue.stop(),n.isPresenting=!1,e.setPixelRatio(w),e.setSize(A.width,A.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(k){r=k,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(k){a=k,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(k){c=k},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return u},this.getFrame=function(){return p},this.getSession=function(){return i},this.setSession=async function(k){if(i=k,i!==null){if(m=e.getRenderTarget(),i.addEventListener("select",F),i.addEventListener("selectstart",F),i.addEventListener("selectend",F),i.addEventListener("squeeze",F),i.addEventListener("squeezestart",F),i.addEventListener("squeezeend",F),i.addEventListener("end",N),i.addEventListener("inputsourceschange",Q),g.xrCompatible!==!0&&await t.makeXRCompatible(),w=e.getPixelRatio(),e.getSize(A),i.renderState.layers===void 0){const X={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(i,t,X),i.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),x=new Bn(d.framebufferWidth,d.framebufferHeight,{format:tn,type:Qn,colorSpace:e.outputColorSpace,stencilBuffer:g.stencil})}else{let X=null,ce=null,j=null;g.depth&&(j=g.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,X=g.stencil?dr:sr,ce=g.stencil?fr:gi);const G={colorFormat:t.RGBA8,depthFormat:j,scaleFactor:r};u=new XRWebGLBinding(i,t),f=u.createProjectionLayer(G),i.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),x=new Bn(f.textureWidth,f.textureHeight,{format:tn,type:Qn,depthTexture:new Hh(f.textureWidth,f.textureHeight,ce,void 0,void 0,void 0,void 0,void 0,void 0,X),stencilBuffer:g.stencil,colorSpace:e.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await i.requestReferenceSpace(a),ue.setContext(i),ue.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function Q(k){for(let X=0;X<k.removed.length;X++){const ce=k.removed[X],j=v.indexOf(ce);j>=0&&(v[j]=null,y[j].disconnect(ce))}for(let X=0;X<k.added.length;X++){const ce=k.added[X];let j=v.indexOf(ce);if(j===-1){for(let pe=0;pe<y.length;pe++)if(pe>=v.length){v.push(ce),j=pe;break}else if(v[pe]===null){v[pe]=ce,j=pe;break}if(j===-1)break}const G=y[j];G&&G.connect(ce)}}const V=new I,le=new I;function Z(k,X,ce){V.setFromMatrixPosition(X.matrixWorld),le.setFromMatrixPosition(ce.matrixWorld);const j=V.distanceTo(le),G=X.projectionMatrix.elements,pe=ce.projectionMatrix.elements,se=G[14]/(G[10]-1),ae=G[14]/(G[10]+1),B=(G[9]+1)/G[5],ie=(G[9]-1)/G[5],R=(G[8]-1)/G[0],oe=(pe[8]+1)/pe[0],$=se*R,me=se*oe,ee=j/(-R+oe),de=ee*-R;if(X.matrixWorld.decompose(k.position,k.quaternion,k.scale),k.translateX(de),k.translateZ(ee),k.matrixWorld.compose(k.position,k.quaternion,k.scale),k.matrixWorldInverse.copy(k.matrixWorld).invert(),G[10]===-1)k.projectionMatrix.copy(X.projectionMatrix),k.projectionMatrixInverse.copy(X.projectionMatrixInverse);else{const fe=se+ee,E=ae+ee,S=$-de,D=me+(j-de),Y=B*ae/E*fe,q=ie*ae/E*fe;k.projectionMatrix.makePerspective(S,D,Y,q,fe,E),k.projectionMatrixInverse.copy(k.projectionMatrix).invert()}}function te(k,X){X===null?k.matrixWorld.copy(k.matrix):k.matrixWorld.multiplyMatrices(X.matrixWorld,k.matrix),k.matrixWorldInverse.copy(k.matrixWorld).invert()}this.updateCamera=function(k){if(i===null)return;let X=k.near,ce=k.far;_.texture!==null&&(_.depthNear>0&&(X=_.depthNear),_.depthFar>0&&(ce=_.depthFar)),M.near=C.near=T.near=X,M.far=C.far=T.far=ce,(U!==M.near||L!==M.far)&&(i.updateRenderState({depthNear:M.near,depthFar:M.far}),U=M.near,L=M.far),T.layers.mask=k.layers.mask|2,C.layers.mask=k.layers.mask|4,M.layers.mask=T.layers.mask|C.layers.mask;const j=k.parent,G=M.cameras;te(M,j);for(let pe=0;pe<G.length;pe++)te(G[pe],j);G.length===2?Z(M,T,C):M.projectionMatrix.copy(T.projectionMatrix),K(k,M,j)};function K(k,X,ce){ce===null?k.matrix.copy(X.matrixWorld):(k.matrix.copy(ce.matrixWorld),k.matrix.invert(),k.matrix.multiply(X.matrixWorld)),k.matrix.decompose(k.position,k.quaternion,k.scale),k.updateMatrixWorld(!0),k.projectionMatrix.copy(X.projectionMatrix),k.projectionMatrixInverse.copy(X.projectionMatrixInverse),k.isPerspectiveCamera&&(k.fov=Qr*2*Math.atan(1/k.projectionMatrix.elements[5]),k.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(f===null&&d===null))return l},this.setFoveation=function(k){l=k,f!==null&&(f.fixedFoveation=k),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=k)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(M)};let O=null;function J(k,X){if(h=X.getViewerPose(c||o),p=X,h!==null){const ce=h.views;d!==null&&(e.setRenderTargetFramebuffer(x,d.framebuffer),e.setRenderTarget(x));let j=!1;ce.length!==M.cameras.length&&(M.cameras.length=0,j=!0);for(let pe=0;pe<ce.length;pe++){const se=ce[pe];let ae=null;if(d!==null)ae=d.getViewport(se);else{const ie=u.getViewSubImage(f,se);ae=ie.viewport,pe===0&&(e.setRenderTargetTextures(x,ie.colorTexture,f.ignoreDepthValues?void 0:ie.depthStencilTexture),e.setRenderTarget(x))}let B=b[pe];B===void 0&&(B=new Rt,B.layers.enable(pe),B.viewport=new tt,b[pe]=B),B.matrix.fromArray(se.transform.matrix),B.matrix.decompose(B.position,B.quaternion,B.scale),B.projectionMatrix.fromArray(se.projectionMatrix),B.projectionMatrixInverse.copy(B.projectionMatrix).invert(),B.viewport.set(ae.x,ae.y,ae.width,ae.height),pe===0&&(M.matrix.copy(B.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),j===!0&&M.cameras.push(B)}const G=i.enabledFeatures;if(G&&G.includes("depth-sensing")){const pe=u.getDepthInformation(ce[0]);pe&&pe.isValid&&pe.texture&&_.init(e,pe,i.renderState)}}for(let ce=0;ce<y.length;ce++){const j=v[ce],G=y[ce];j!==null&&G!==void 0&&G.update(j,X,c||o)}O&&O(k,X),X.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:X}),p=null}const ue=new ym;ue.setAnimationLoop(J),this.setAnimationLoop=function(k){O=k},this.dispose=function(){}}}const ji=new wn,qS=new Ye;function ZS(s,e){function t(g,m){g.matrixAutoUpdate===!0&&g.updateMatrix(),m.value.copy(g.matrix)}function n(g,m){m.color.getRGB(g.fogColor.value,xp(s)),m.isFog?(g.fogNear.value=m.near,g.fogFar.value=m.far):m.isFogExp2&&(g.fogDensity.value=m.density)}function i(g,m,x,y,v){m.isMeshBasicMaterial||m.isMeshLambertMaterial?r(g,m):m.isMeshToonMaterial?(r(g,m),u(g,m)):m.isMeshPhongMaterial?(r(g,m),h(g,m)):m.isMeshStandardMaterial?(r(g,m),f(g,m),m.isMeshPhysicalMaterial&&d(g,m,v)):m.isMeshMatcapMaterial?(r(g,m),p(g,m)):m.isMeshDepthMaterial?r(g,m):m.isMeshDistanceMaterial?(r(g,m),_(g,m)):m.isMeshNormalMaterial?r(g,m):m.isLineBasicMaterial?(o(g,m),m.isLineDashedMaterial&&a(g,m)):m.isPointsMaterial?l(g,m,x,y):m.isSpriteMaterial?c(g,m):m.isShadowMaterial?(g.color.value.copy(m.color),g.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(g,m){g.opacity.value=m.opacity,m.color&&g.diffuse.value.copy(m.color),m.emissive&&g.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(g.map.value=m.map,t(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.bumpMap&&(g.bumpMap.value=m.bumpMap,t(m.bumpMap,g.bumpMapTransform),g.bumpScale.value=m.bumpScale,m.side===nn&&(g.bumpScale.value*=-1)),m.normalMap&&(g.normalMap.value=m.normalMap,t(m.normalMap,g.normalMapTransform),g.normalScale.value.copy(m.normalScale),m.side===nn&&g.normalScale.value.negate()),m.displacementMap&&(g.displacementMap.value=m.displacementMap,t(m.displacementMap,g.displacementMapTransform),g.displacementScale.value=m.displacementScale,g.displacementBias.value=m.displacementBias),m.emissiveMap&&(g.emissiveMap.value=m.emissiveMap,t(m.emissiveMap,g.emissiveMapTransform)),m.specularMap&&(g.specularMap.value=m.specularMap,t(m.specularMap,g.specularMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest);const x=e.get(m),y=x.envMap,v=x.envMapRotation;y&&(g.envMap.value=y,ji.copy(v),ji.x*=-1,ji.y*=-1,ji.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(ji.y*=-1,ji.z*=-1),g.envMapRotation.value.setFromMatrix4(qS.makeRotationFromEuler(ji)),g.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=m.reflectivity,g.ior.value=m.ior,g.refractionRatio.value=m.refractionRatio),m.lightMap&&(g.lightMap.value=m.lightMap,g.lightMapIntensity.value=m.lightMapIntensity,t(m.lightMap,g.lightMapTransform)),m.aoMap&&(g.aoMap.value=m.aoMap,g.aoMapIntensity.value=m.aoMapIntensity,t(m.aoMap,g.aoMapTransform))}function o(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,m.map&&(g.map.value=m.map,t(m.map,g.mapTransform))}function a(g,m){g.dashSize.value=m.dashSize,g.totalSize.value=m.dashSize+m.gapSize,g.scale.value=m.scale}function l(g,m,x,y){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.size.value=m.size*x,g.scale.value=y*.5,m.map&&(g.map.value=m.map,t(m.map,g.uvTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function c(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.rotation.value=m.rotation,m.map&&(g.map.value=m.map,t(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function h(g,m){g.specular.value.copy(m.specular),g.shininess.value=Math.max(m.shininess,1e-4)}function u(g,m){m.gradientMap&&(g.gradientMap.value=m.gradientMap)}function f(g,m){g.metalness.value=m.metalness,m.metalnessMap&&(g.metalnessMap.value=m.metalnessMap,t(m.metalnessMap,g.metalnessMapTransform)),g.roughness.value=m.roughness,m.roughnessMap&&(g.roughnessMap.value=m.roughnessMap,t(m.roughnessMap,g.roughnessMapTransform)),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)}function d(g,m,x){g.ior.value=m.ior,m.sheen>0&&(g.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),g.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(g.sheenColorMap.value=m.sheenColorMap,t(m.sheenColorMap,g.sheenColorMapTransform)),m.sheenRoughnessMap&&(g.sheenRoughnessMap.value=m.sheenRoughnessMap,t(m.sheenRoughnessMap,g.sheenRoughnessMapTransform))),m.clearcoat>0&&(g.clearcoat.value=m.clearcoat,g.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(g.clearcoatMap.value=m.clearcoatMap,t(m.clearcoatMap,g.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,t(m.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(g.clearcoatNormalMap.value=m.clearcoatNormalMap,t(m.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===nn&&g.clearcoatNormalScale.value.negate())),m.dispersion>0&&(g.dispersion.value=m.dispersion),m.iridescence>0&&(g.iridescence.value=m.iridescence,g.iridescenceIOR.value=m.iridescenceIOR,g.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(g.iridescenceMap.value=m.iridescenceMap,t(m.iridescenceMap,g.iridescenceMapTransform)),m.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=m.iridescenceThicknessMap,t(m.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),m.transmission>0&&(g.transmission.value=m.transmission,g.transmissionSamplerMap.value=x.texture,g.transmissionSamplerSize.value.set(x.width,x.height),m.transmissionMap&&(g.transmissionMap.value=m.transmissionMap,t(m.transmissionMap,g.transmissionMapTransform)),g.thickness.value=m.thickness,m.thicknessMap&&(g.thicknessMap.value=m.thicknessMap,t(m.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=m.attenuationDistance,g.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(g.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(g.anisotropyMap.value=m.anisotropyMap,t(m.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=m.specularIntensity,g.specularColor.value.copy(m.specularColor),m.specularColorMap&&(g.specularColorMap.value=m.specularColorMap,t(m.specularColorMap,g.specularColorMapTransform)),m.specularIntensityMap&&(g.specularIntensityMap.value=m.specularIntensityMap,t(m.specularIntensityMap,g.specularIntensityMapTransform))}function p(g,m){m.matcap&&(g.matcap.value=m.matcap)}function _(g,m){const x=e.get(m).light;g.referencePosition.value.setFromMatrixPosition(x.matrixWorld),g.nearDistance.value=x.shadow.camera.near,g.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function jS(s,e,t,n){let i={},r={},o=[];const a=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function l(x,y){const v=y.program;n.uniformBlockBinding(x,v)}function c(x,y){let v=i[x.id];v===void 0&&(p(x),v=h(x),i[x.id]=v,x.addEventListener("dispose",g));const A=y.program;n.updateUBOMapping(x,A);const w=e.render.frame;r[x.id]!==w&&(f(x),r[x.id]=w)}function h(x){const y=u();x.__bindingPointIndex=y;const v=s.createBuffer(),A=x.__size,w=x.usage;return s.bindBuffer(s.UNIFORM_BUFFER,v),s.bufferData(s.UNIFORM_BUFFER,A,w),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,y,v),v}function u(){for(let x=0;x<a;x++)if(o.indexOf(x)===-1)return o.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(x){const y=i[x.id],v=x.uniforms,A=x.__cache;s.bindBuffer(s.UNIFORM_BUFFER,y);for(let w=0,T=v.length;w<T;w++){const C=Array.isArray(v[w])?v[w]:[v[w]];for(let b=0,M=C.length;b<M;b++){const U=C[b];if(d(U,w,b,A)===!0){const L=U.__offset,F=Array.isArray(U.value)?U.value:[U.value];let N=0;for(let Q=0;Q<F.length;Q++){const V=F[Q],le=_(V);typeof V=="number"||typeof V=="boolean"?(U.__data[0]=V,s.bufferSubData(s.UNIFORM_BUFFER,L+N,U.__data)):V.isMatrix3?(U.__data[0]=V.elements[0],U.__data[1]=V.elements[1],U.__data[2]=V.elements[2],U.__data[3]=0,U.__data[4]=V.elements[3],U.__data[5]=V.elements[4],U.__data[6]=V.elements[5],U.__data[7]=0,U.__data[8]=V.elements[6],U.__data[9]=V.elements[7],U.__data[10]=V.elements[8],U.__data[11]=0):(V.toArray(U.__data,N),N+=le.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,L,U.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function d(x,y,v,A){const w=x.value,T=y+"_"+v;if(A[T]===void 0)return typeof w=="number"||typeof w=="boolean"?A[T]=w:A[T]=w.clone(),!0;{const C=A[T];if(typeof w=="number"||typeof w=="boolean"){if(C!==w)return A[T]=w,!0}else if(C.equals(w)===!1)return C.copy(w),!0}return!1}function p(x){const y=x.uniforms;let v=0;const A=16;for(let T=0,C=y.length;T<C;T++){const b=Array.isArray(y[T])?y[T]:[y[T]];for(let M=0,U=b.length;M<U;M++){const L=b[M],F=Array.isArray(L.value)?L.value:[L.value];for(let N=0,Q=F.length;N<Q;N++){const V=F[N],le=_(V),Z=v%A,te=Z%le.boundary,K=Z+te;v+=te,K!==0&&A-K<le.storage&&(v+=A-K),L.__data=new Float32Array(le.storage/Float32Array.BYTES_PER_ELEMENT),L.__offset=v,v+=le.storage}}}const w=v%A;return w>0&&(v+=A-w),x.__size=v,x.__cache={},this}function _(x){const y={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(y.boundary=4,y.storage=4):x.isVector2?(y.boundary=8,y.storage=8):x.isVector3||x.isColor?(y.boundary=16,y.storage=12):x.isVector4?(y.boundary=16,y.storage=16):x.isMatrix3?(y.boundary=48,y.storage=48):x.isMatrix4?(y.boundary=64,y.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),y}function g(x){const y=x.target;y.removeEventListener("dispose",g);const v=o.indexOf(y.__bindingPointIndex);o.splice(v,1),s.deleteBuffer(i[y.id]),delete i[y.id],delete r[y.id]}function m(){for(const x in i)s.deleteBuffer(i[x]);o=[],i={},r={}}return{bind:l,update:c,dispose:m}}class KS{constructor(e={}){const{canvas:t=gp(),context:n=null,depth:i=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let d;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=o;const p=new Uint32Array(4),_=new Int32Array(4);let g=null,m=null;const x=[],y=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=$t,this.toneMapping=fi,this.toneMappingExposure=1;const v=this;let A=!1,w=0,T=0,C=null,b=-1,M=null;const U=new tt,L=new tt;let F=null;const N=new Fe(0);let Q=0,V=t.width,le=t.height,Z=1,te=null,K=null;const O=new tt(0,0,V,le),J=new tt(0,0,V,le);let ue=!1;const k=new ns;let X=!1,ce=!1;const j=new Ye,G=new Ye,pe=new I,se=new tt,ae={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let B=!1;function ie(){return C===null?Z:1}let R=n;function oe(P,ne){return t.getContext(P,ne)}try{const P={alpha:!0,depth:i,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${lo}`),t.addEventListener("webglcontextlost",Ee,!1),t.addEventListener("webglcontextrestored",Ce,!1),t.addEventListener("webglcontextcreationerror",Ae,!1),R===null){const ne="webgl2";if(R=oe(ne,P),R===null)throw oe(ne)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(P){throw console.error("THREE.WebGLRenderer: "+P.message),P}let $,me,ee,de,fe,E,S,D,Y,q,re,Se,ye,be,Le,we,Re,Ie,De,Te,W,ve,Ue,z;function xe(){$=new oM(R),$.init(),ve=new wm(R,$),me=new eM(R,$,e,ve),ee=new zS(R,$),me.reverseDepthBuffer&&f&&ee.buffers.depth.setReversed(!0),de=new cM(R),fe=new AS,E=new VS(R,$,ee,fe,me,ve,de),S=new nM(v),D=new sM(v),Y=new gv(R),Ue=new Qx(R,Y),q=new aM(R,Y,de,Ue),re=new uM(R,q,Y,de),De=new hM(R,me,E),we=new tM(fe),Se=new TS(v,S,D,$,me,Ue,we),ye=new ZS(v,fe),be=new RS,Le=new FS($),Ie=new Jx(v,S,D,ee,re,d,l),Re=new BS(v,re,me),z=new jS(R,de,me,ee),Te=new $x(R,$,de),W=new lM(R,$,de),de.programs=Se.programs,v.capabilities=me,v.extensions=$,v.properties=fe,v.renderLists=be,v.shadowMap=Re,v.state=ee,v.info=de}xe();const he=new YS(v,R);this.xr=he,this.getContext=function(){return R},this.getContextAttributes=function(){return R.getContextAttributes()},this.forceContextLoss=function(){const P=$.get("WEBGL_lose_context");P&&P.loseContext()},this.forceContextRestore=function(){const P=$.get("WEBGL_lose_context");P&&P.restoreContext()},this.getPixelRatio=function(){return Z},this.setPixelRatio=function(P){P!==void 0&&(Z=P,this.setSize(V,le,!1))},this.getSize=function(P){return P.set(V,le)},this.setSize=function(P,ne,ge=!0){if(he.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}V=P,le=ne,t.width=Math.floor(P*Z),t.height=Math.floor(ne*Z),ge===!0&&(t.style.width=P+"px",t.style.height=ne+"px"),this.setViewport(0,0,P,ne)},this.getDrawingBufferSize=function(P){return P.set(V*Z,le*Z).floor()},this.setDrawingBufferSize=function(P,ne,ge){V=P,le=ne,Z=ge,t.width=Math.floor(P*ge),t.height=Math.floor(ne*ge),this.setViewport(0,0,P,ne)},this.getCurrentViewport=function(P){return P.copy(U)},this.getViewport=function(P){return P.copy(O)},this.setViewport=function(P,ne,ge,_e){P.isVector4?O.set(P.x,P.y,P.z,P.w):O.set(P,ne,ge,_e),ee.viewport(U.copy(O).multiplyScalar(Z).round())},this.getScissor=function(P){return P.copy(J)},this.setScissor=function(P,ne,ge,_e){P.isVector4?J.set(P.x,P.y,P.z,P.w):J.set(P,ne,ge,_e),ee.scissor(L.copy(J).multiplyScalar(Z).round())},this.getScissorTest=function(){return ue},this.setScissorTest=function(P){ee.setScissorTest(ue=P)},this.setOpaqueSort=function(P){te=P},this.setTransparentSort=function(P){K=P},this.getClearColor=function(P){return P.copy(Ie.getClearColor())},this.setClearColor=function(){Ie.setClearColor.apply(Ie,arguments)},this.getClearAlpha=function(){return Ie.getClearAlpha()},this.setClearAlpha=function(){Ie.setClearAlpha.apply(Ie,arguments)},this.clear=function(P=!0,ne=!0,ge=!0){let _e=0;if(P){let H=!1;if(C!==null){const Pe=C.texture.format;H=Pe===vl||Pe===_l||Pe===ho}if(H){const Pe=C.texture.type,Oe=Pe===Qn||Pe===gi||Pe===Jr||Pe===fr||Pe===pl||Pe===ml,ke=Ie.getClearColor(),ze=Ie.getClearAlpha(),je=ke.r,Ke=ke.g,Xe=ke.b;Oe?(p[0]=je,p[1]=Ke,p[2]=Xe,p[3]=ze,R.clearBufferuiv(R.COLOR,0,p)):(_[0]=je,_[1]=Ke,_[2]=Xe,_[3]=ze,R.clearBufferiv(R.COLOR,0,_))}else _e|=R.COLOR_BUFFER_BIT}ne&&(_e|=R.DEPTH_BUFFER_BIT),ge&&(_e|=R.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),R.clear(_e)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",Ee,!1),t.removeEventListener("webglcontextrestored",Ce,!1),t.removeEventListener("webglcontextcreationerror",Ae,!1),Ie.dispose(),be.dispose(),Le.dispose(),fe.dispose(),S.dispose(),D.dispose(),re.dispose(),Ue.dispose(),z.dispose(),Se.dispose(),he.dispose(),he.removeEventListener("sessionstart",St),he.removeEventListener("sessionend",sn),Yt.stop()};function Ee(P){P.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),A=!0}function Ce(){console.log("THREE.WebGLRenderer: Context Restored."),A=!1;const P=de.autoReset,ne=Re.enabled,ge=Re.autoUpdate,_e=Re.needsUpdate,H=Re.type;xe(),de.autoReset=P,Re.enabled=ne,Re.autoUpdate=ge,Re.needsUpdate=_e,Re.type=H}function Ae(P){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",P.statusMessage)}function Be(P){const ne=P.target;ne.removeEventListener("dispose",Be),We(ne)}function We(P){Ve(P),fe.remove(P)}function Ve(P){const ne=fe.get(P).programs;ne!==void 0&&(ne.forEach(function(ge){Se.releaseProgram(ge)}),P.isShaderMaterial&&Se.releaseShaderCache(P))}this.renderBufferDirect=function(P,ne,ge,_e,H,Pe){ne===null&&(ne=ae);const Oe=H.isMesh&&H.matrixWorld.determinant()<0,ke=ql(P,ne,ge,_e,H);ee.setMaterial(_e,Oe);let ze=ge.index,je=1;if(_e.wireframe===!0){if(ze=q.getWireframeAttribute(ge),ze===void 0)return;je=2}const Ke=ge.drawRange,Xe=ge.attributes.position;let it=Ke.start*je,ct=(Ke.start+Ke.count)*je;Pe!==null&&(it=Math.max(it,Pe.start*je),ct=Math.min(ct,(Pe.start+Pe.count)*je)),ze!==null?(it=Math.max(it,0),ct=Math.min(ct,ze.count)):Xe!=null&&(it=Math.max(it,0),ct=Math.min(ct,Xe.count));const gt=ct-it;if(gt<0||gt===1/0)return;Ue.setup(H,_e,ke,ge,ze);let _t,rt=Te;if(ze!==null&&(_t=Y.get(ze),rt=W,rt.setIndex(_t)),H.isMesh)_e.wireframe===!0?(ee.setLineWidth(_e.wireframeLinewidth*ie()),rt.setMode(R.LINES)):rt.setMode(R.TRIANGLES);else if(H.isLine){let qe=_e.linewidth;qe===void 0&&(qe=1),ee.setLineWidth(qe*ie()),H.isLineSegments?rt.setMode(R.LINES):H.isLineLoop?rt.setMode(R.LINE_LOOP):rt.setMode(R.LINE_STRIP)}else H.isPoints?rt.setMode(R.POINTS):H.isSprite&&rt.setMode(R.TRIANGLES);if(H.isBatchedMesh)if(H._multiDrawInstances!==null)rt.renderMultiDrawInstances(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount,H._multiDrawInstances);else if($.get("WEBGL_multi_draw"))rt.renderMultiDraw(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount);else{const qe=H._multiDrawStarts,yt=H._multiDrawCounts,ot=H._multiDrawCount,Ft=ze?Y.get(ze).bytesPerElement:1,Gn=fe.get(_e).currentProgram.getUniforms();for(let Bt=0;Bt<ot;Bt++)Gn.setValue(R,"_gl_DrawID",Bt),rt.render(qe[Bt]/Ft,yt[Bt])}else if(H.isInstancedMesh)rt.renderInstances(it,gt,H.count);else if(ge.isInstancedBufferGeometry){const qe=ge._maxInstanceCount!==void 0?ge._maxInstanceCount:1/0,yt=Math.min(ge.instanceCount,qe);rt.renderInstances(it,gt,yt)}else rt.render(it,gt)};function He(P,ne,ge){P.transparent===!0&&P.side===Cn&&P.forceSinglePass===!1?(P.side=nn,P.needsUpdate=!0,En(P,ne,ge),P.side=pi,P.needsUpdate=!0,En(P,ne,ge),P.side=Cn):En(P,ne,ge)}this.compile=function(P,ne,ge=null){ge===null&&(ge=P),m=Le.get(ge),m.init(ne),y.push(m),ge.traverseVisible(function(H){H.isLight&&H.layers.test(ne.layers)&&(m.pushLight(H),H.castShadow&&m.pushShadow(H))}),P!==ge&&P.traverseVisible(function(H){H.isLight&&H.layers.test(ne.layers)&&(m.pushLight(H),H.castShadow&&m.pushShadow(H))}),m.setupLights();const _e=new Set;return P.traverse(function(H){if(!(H.isMesh||H.isPoints||H.isLine||H.isSprite))return;const Pe=H.material;if(Pe)if(Array.isArray(Pe))for(let Oe=0;Oe<Pe.length;Oe++){const ke=Pe[Oe];He(ke,ge,H),_e.add(ke)}else He(Pe,ge,H),_e.add(Pe)}),y.pop(),m=null,_e},this.compileAsync=function(P,ne,ge=null){const _e=this.compile(P,ne,ge);return new Promise(H=>{function Pe(){if(_e.forEach(function(Oe){fe.get(Oe).currentProgram.isReady()&&_e.delete(Oe)}),_e.size===0){H(P);return}setTimeout(Pe,10)}$.get("KHR_parallel_shader_compile")!==null?Pe():setTimeout(Pe,10)})};let lt=null;function ft(P){lt&&lt(P)}function St(){Yt.stop()}function sn(){Yt.start()}const Yt=new ym;Yt.setAnimationLoop(ft),typeof self<"u"&&Yt.setContext(self),this.setAnimationLoop=function(P){lt=P,he.setAnimationLoop(P),P===null?Yt.stop():Yt.start()},he.addEventListener("sessionstart",St),he.addEventListener("sessionend",sn),this.render=function(P,ne){if(ne!==void 0&&ne.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(A===!0)return;if(P.matrixWorldAutoUpdate===!0&&P.updateMatrixWorld(),ne.parent===null&&ne.matrixWorldAutoUpdate===!0&&ne.updateMatrixWorld(),he.enabled===!0&&he.isPresenting===!0&&(he.cameraAutoUpdate===!0&&he.updateCamera(ne),ne=he.getCamera()),P.isScene===!0&&P.onBeforeRender(v,P,ne,C),m=Le.get(P,y.length),m.init(ne),y.push(m),G.multiplyMatrices(ne.projectionMatrix,ne.matrixWorldInverse),k.setFromProjectionMatrix(G),ce=this.localClippingEnabled,X=we.init(this.clippingPlanes,ce),g=be.get(P,x.length),g.init(),x.push(g),he.enabled===!0&&he.isPresenting===!0){const Pe=v.xr.getDepthSensingMesh();Pe!==null&&gn(Pe,ne,-1/0,v.sortObjects)}gn(P,ne,0,v.sortObjects),g.finish(),v.sortObjects===!0&&g.sort(te,K),B=he.enabled===!1||he.isPresenting===!1||he.hasDepthSensing()===!1,B&&Ie.addToRenderList(g,P),this.info.render.frame++,X===!0&&we.beginShadows();const ge=m.state.shadowsArray;Re.render(ge,P,ne),X===!0&&we.endShadows(),this.info.autoReset===!0&&this.info.reset();const _e=g.opaque,H=g.transmissive;if(m.setupLights(),ne.isArrayCamera){const Pe=ne.cameras;if(H.length>0)for(let Oe=0,ke=Pe.length;Oe<ke;Oe++){const ze=Pe[Oe];Vn(_e,H,P,ze)}B&&Ie.render(P);for(let Oe=0,ke=Pe.length;Oe<ke;Oe++){const ze=Pe[Oe];In(g,P,ze,ze.viewport)}}else H.length>0&&Vn(_e,H,P,ne),B&&Ie.render(P),In(g,P,ne);C!==null&&(E.updateMultisampleRenderTarget(C),E.updateRenderTargetMipmap(C)),P.isScene===!0&&P.onAfterRender(v,P,ne),Ue.resetDefaultState(),b=-1,M=null,y.pop(),y.length>0?(m=y[y.length-1],X===!0&&we.setGlobalState(v.clippingPlanes,m.state.camera)):m=null,x.pop(),x.length>0?g=x[x.length-1]:g=null};function gn(P,ne,ge,_e){if(P.visible===!1)return;if(P.layers.test(ne.layers)){if(P.isGroup)ge=P.renderOrder;else if(P.isLOD)P.autoUpdate===!0&&P.update(ne);else if(P.isLight)m.pushLight(P),P.castShadow&&m.pushShadow(P);else if(P.isSprite){if(!P.frustumCulled||k.intersectsSprite(P)){_e&&se.setFromMatrixPosition(P.matrixWorld).applyMatrix4(G);const Oe=re.update(P),ke=P.material;ke.visible&&g.push(P,Oe,ke,ge,se.z,null)}}else if((P.isMesh||P.isLine||P.isPoints)&&(!P.frustumCulled||k.intersectsObject(P))){const Oe=re.update(P),ke=P.material;if(_e&&(P.boundingSphere!==void 0?(P.boundingSphere===null&&P.computeBoundingSphere(),se.copy(P.boundingSphere.center)):(Oe.boundingSphere===null&&Oe.computeBoundingSphere(),se.copy(Oe.boundingSphere.center)),se.applyMatrix4(P.matrixWorld).applyMatrix4(G)),Array.isArray(ke)){const ze=Oe.groups;for(let je=0,Ke=ze.length;je<Ke;je++){const Xe=ze[je],it=ke[Xe.materialIndex];it&&it.visible&&g.push(P,Oe,it,ge,se.z,Xe)}}else ke.visible&&g.push(P,Oe,ke,ge,se.z,null)}}const Pe=P.children;for(let Oe=0,ke=Pe.length;Oe<ke;Oe++)gn(Pe[Oe],ne,ge,_e)}function In(P,ne,ge,_e){const H=P.opaque,Pe=P.transmissive,Oe=P.transparent;m.setupLightsView(ge),X===!0&&we.setGlobalState(v.clippingPlanes,ge),_e&&ee.viewport(U.copy(_e)),H.length>0&&on(H,ne,ge),Pe.length>0&&on(Pe,ne,ge),Oe.length>0&&on(Oe,ne,ge),ee.buffers.depth.setTest(!0),ee.buffers.depth.setMask(!0),ee.buffers.color.setMask(!0),ee.setPolygonOffset(!1)}function Vn(P,ne,ge,_e){if((ge.isScene===!0?ge.overrideMaterial:null)!==null)return;m.state.transmissionRenderTarget[_e.id]===void 0&&(m.state.transmissionRenderTarget[_e.id]=new Bn(1,1,{generateMipmaps:!0,type:$.has("EXT_color_buffer_half_float")||$.has("EXT_color_buffer_float")?ts:Qn,minFilter:Zn,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:at.workingColorSpace}));const Pe=m.state.transmissionRenderTarget[_e.id],Oe=_e.viewport||U;Pe.setSize(Oe.z,Oe.w);const ke=v.getRenderTarget();v.setRenderTarget(Pe),v.getClearColor(N),Q=v.getClearAlpha(),Q<1&&v.setClearColor(16777215,.5),v.clear(),B&&Ie.render(ge);const ze=v.toneMapping;v.toneMapping=fi;const je=_e.viewport;if(_e.viewport!==void 0&&(_e.viewport=void 0),m.setupLightsView(_e),X===!0&&we.setGlobalState(v.clippingPlanes,_e),on(P,ge,_e),E.updateMultisampleRenderTarget(Pe),E.updateRenderTargetMipmap(Pe),$.has("WEBGL_multisampled_render_to_texture")===!1){let Ke=!1;for(let Xe=0,it=ne.length;Xe<it;Xe++){const ct=ne[Xe],gt=ct.object,_t=ct.geometry,rt=ct.material,qe=ct.group;if(rt.side===Cn&&gt.layers.test(_e.layers)){const yt=rt.side;rt.side=nn,rt.needsUpdate=!0,Dt(gt,ge,_e,_t,rt,qe),rt.side=yt,rt.needsUpdate=!0,Ke=!0}}Ke===!0&&(E.updateMultisampleRenderTarget(Pe),E.updateRenderTargetMipmap(Pe))}v.setRenderTarget(ke),v.setClearColor(N,Q),je!==void 0&&(_e.viewport=je),v.toneMapping=ze}function on(P,ne,ge){const _e=ne.isScene===!0?ne.overrideMaterial:null;for(let H=0,Pe=P.length;H<Pe;H++){const Oe=P[H],ke=Oe.object,ze=Oe.geometry,je=_e===null?Oe.material:_e,Ke=Oe.group;ke.layers.test(ge.layers)&&Dt(ke,ne,ge,ze,je,Ke)}}function Dt(P,ne,ge,_e,H,Pe){P.onBeforeRender(v,ne,ge,_e,H,Pe),P.modelViewMatrix.multiplyMatrices(ge.matrixWorldInverse,P.matrixWorld),P.normalMatrix.getNormalMatrix(P.modelViewMatrix),H.onBeforeRender(v,ne,ge,_e,P,Pe),H.transparent===!0&&H.side===Cn&&H.forceSinglePass===!1?(H.side=nn,H.needsUpdate=!0,v.renderBufferDirect(ge,ne,_e,H,P,Pe),H.side=pi,H.needsUpdate=!0,v.renderBufferDirect(ge,ne,_e,H,P,Pe),H.side=Cn):v.renderBufferDirect(ge,ne,_e,H,P,Pe),P.onAfterRender(v,ne,ge,_e,H,Pe)}function En(P,ne,ge){ne.isScene!==!0&&(ne=ae);const _e=fe.get(P),H=m.state.lights,Pe=m.state.shadowsArray,Oe=H.state.version,ke=Se.getParameters(P,H.state,Pe,ne,ge),ze=Se.getProgramCacheKey(ke);let je=_e.programs;_e.environment=P.isMeshStandardMaterial?ne.environment:null,_e.fog=ne.fog,_e.envMap=(P.isMeshStandardMaterial?D:S).get(P.envMap||_e.environment),_e.envMapRotation=_e.environment!==null&&P.envMap===null?ne.environmentRotation:P.envMapRotation,je===void 0&&(P.addEventListener("dispose",Be),je=new Map,_e.programs=je);let Ke=je.get(ze);if(Ke!==void 0){if(_e.currentProgram===Ke&&_e.lightsStateVersion===Oe)return xr(P,ke),Ke}else ke.uniforms=Se.getUniforms(P),P.onBeforeCompile(ke,v),Ke=Se.acquireProgram(ke,ze),je.set(ze,Ke),_e.uniforms=ke.uniforms;const Xe=_e.uniforms;return(!P.isShaderMaterial&&!P.isRawShaderMaterial||P.clipping===!0)&&(Xe.clippingPlanes=we.uniform),xr(P,ke),_e.needsLights=Mr(P),_e.lightsStateVersion=Oe,_e.needsLights&&(Xe.ambientLightColor.value=H.state.ambient,Xe.lightProbe.value=H.state.probe,Xe.directionalLights.value=H.state.directional,Xe.directionalLightShadows.value=H.state.directionalShadow,Xe.spotLights.value=H.state.spot,Xe.spotLightShadows.value=H.state.spotShadow,Xe.rectAreaLights.value=H.state.rectArea,Xe.ltc_1.value=H.state.rectAreaLTC1,Xe.ltc_2.value=H.state.rectAreaLTC2,Xe.pointLights.value=H.state.point,Xe.pointLightShadows.value=H.state.pointShadow,Xe.hemisphereLights.value=H.state.hemi,Xe.directionalShadowMap.value=H.state.directionalShadowMap,Xe.directionalShadowMatrix.value=H.state.directionalShadowMatrix,Xe.spotShadowMap.value=H.state.spotShadowMap,Xe.spotLightMatrix.value=H.state.spotLightMatrix,Xe.spotLightMap.value=H.state.spotLightMap,Xe.pointShadowMap.value=H.state.pointShadowMap,Xe.pointShadowMatrix.value=H.state.pointShadowMatrix),_e.currentProgram=Ke,_e.uniformsList=null,Ke}function os(P){if(P.uniformsList===null){const ne=P.currentProgram.getUniforms();P.uniformsList=ba.seqWithValue(ne.seq,P.uniforms)}return P.uniformsList}function xr(P,ne){const ge=fe.get(P);ge.outputColorSpace=ne.outputColorSpace,ge.batching=ne.batching,ge.batchingColor=ne.batchingColor,ge.instancing=ne.instancing,ge.instancingColor=ne.instancingColor,ge.instancingMorph=ne.instancingMorph,ge.skinning=ne.skinning,ge.morphTargets=ne.morphTargets,ge.morphNormals=ne.morphNormals,ge.morphColors=ne.morphColors,ge.morphTargetsCount=ne.morphTargetsCount,ge.numClippingPlanes=ne.numClippingPlanes,ge.numIntersection=ne.numClipIntersection,ge.vertexAlphas=ne.vertexAlphas,ge.vertexTangents=ne.vertexTangents,ge.toneMapping=ne.toneMapping}function ql(P,ne,ge,_e,H){ne.isScene!==!0&&(ne=ae),E.resetTextureUnits();const Pe=ne.fog,Oe=_e.isMeshStandardMaterial?ne.environment:null,ke=C===null?v.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:pr,ze=(_e.isMeshStandardMaterial?D:S).get(_e.envMap||Oe),je=_e.vertexColors===!0&&!!ge.attributes.color&&ge.attributes.color.itemSize===4,Ke=!!ge.attributes.tangent&&(!!_e.normalMap||_e.anisotropy>0),Xe=!!ge.morphAttributes.position,it=!!ge.morphAttributes.normal,ct=!!ge.morphAttributes.color;let gt=fi;_e.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(gt=v.toneMapping);const _t=ge.morphAttributes.position||ge.morphAttributes.normal||ge.morphAttributes.color,rt=_t!==void 0?_t.length:0,qe=fe.get(_e),yt=m.state.lights;if(X===!0&&(ce===!0||P!==M)){const Et=P===M&&_e.id===b;we.setState(_e,P,Et)}let ot=!1;_e.version===qe.__version?(qe.needsLights&&qe.lightsStateVersion!==yt.state.version||qe.outputColorSpace!==ke||H.isBatchedMesh&&qe.batching===!1||!H.isBatchedMesh&&qe.batching===!0||H.isBatchedMesh&&qe.batchingColor===!0&&H.colorTexture===null||H.isBatchedMesh&&qe.batchingColor===!1&&H.colorTexture!==null||H.isInstancedMesh&&qe.instancing===!1||!H.isInstancedMesh&&qe.instancing===!0||H.isSkinnedMesh&&qe.skinning===!1||!H.isSkinnedMesh&&qe.skinning===!0||H.isInstancedMesh&&qe.instancingColor===!0&&H.instanceColor===null||H.isInstancedMesh&&qe.instancingColor===!1&&H.instanceColor!==null||H.isInstancedMesh&&qe.instancingMorph===!0&&H.morphTexture===null||H.isInstancedMesh&&qe.instancingMorph===!1&&H.morphTexture!==null||qe.envMap!==ze||_e.fog===!0&&qe.fog!==Pe||qe.numClippingPlanes!==void 0&&(qe.numClippingPlanes!==we.numPlanes||qe.numIntersection!==we.numIntersection)||qe.vertexAlphas!==je||qe.vertexTangents!==Ke||qe.morphTargets!==Xe||qe.morphNormals!==it||qe.morphColors!==ct||qe.toneMapping!==gt||qe.morphTargetsCount!==rt)&&(ot=!0):(ot=!0,qe.__version=_e.version);let Ft=qe.currentProgram;ot===!0&&(Ft=En(_e,ne,H));let Gn=!1,Bt=!1,ti=!1;const st=Ft.getUniforms(),an=qe.uniforms;if(ee.useProgram(Ft.program)&&(Gn=!0,Bt=!0,ti=!0),_e.id!==b&&(b=_e.id,Bt=!0),Gn||M!==P){ee.buffers.depth.getReversed()?(j.copy(P.projectionMatrix),Xg(j),Yg(j),st.setValue(R,"projectionMatrix",j)):st.setValue(R,"projectionMatrix",P.projectionMatrix),st.setValue(R,"viewMatrix",P.matrixWorldInverse);const zt=st.map.cameraPosition;zt!==void 0&&zt.setValue(R,pe.setFromMatrixPosition(P.matrixWorld)),me.logarithmicDepthBuffer&&st.setValue(R,"logDepthBufFC",2/(Math.log(P.far+1)/Math.LN2)),(_e.isMeshPhongMaterial||_e.isMeshToonMaterial||_e.isMeshLambertMaterial||_e.isMeshBasicMaterial||_e.isMeshStandardMaterial||_e.isShaderMaterial)&&st.setValue(R,"isOrthographic",P.isOrthographicCamera===!0),M!==P&&(M=P,Bt=!0,ti=!0)}if(H.isSkinnedMesh){st.setOptional(R,H,"bindMatrix"),st.setOptional(R,H,"bindMatrixInverse");const Et=H.skeleton;Et&&(Et.boneTexture===null&&Et.computeBoneTexture(),st.setValue(R,"boneTexture",Et.boneTexture,E))}H.isBatchedMesh&&(st.setOptional(R,H,"batchingTexture"),st.setValue(R,"batchingTexture",H._matricesTexture,E),st.setOptional(R,H,"batchingIdTexture"),st.setValue(R,"batchingIdTexture",H._indirectTexture,E),st.setOptional(R,H,"batchingColorTexture"),H._colorsTexture!==null&&st.setValue(R,"batchingColorTexture",H._colorsTexture,E));const kt=ge.morphAttributes;if((kt.position!==void 0||kt.normal!==void 0||kt.color!==void 0)&&De.update(H,ge,Ft),(Bt||qe.receiveShadow!==H.receiveShadow)&&(qe.receiveShadow=H.receiveShadow,st.setValue(R,"receiveShadow",H.receiveShadow)),_e.isMeshGouraudMaterial&&_e.envMap!==null&&(an.envMap.value=ze,an.flipEnvMap.value=ze.isCubeTexture&&ze.isRenderTargetTexture===!1?-1:1),_e.isMeshStandardMaterial&&_e.envMap===null&&ne.environment!==null&&(an.envMapIntensity.value=ne.environmentIntensity),Bt&&(st.setValue(R,"toneMappingExposure",v.toneMappingExposure),qe.needsLights&&yo(an,ti),Pe&&_e.fog===!0&&ye.refreshFogUniforms(an,Pe),ye.refreshMaterialUniforms(an,_e,Z,le,m.state.transmissionRenderTarget[P.id]),ba.upload(R,os(qe),an,E)),_e.isShaderMaterial&&_e.uniformsNeedUpdate===!0&&(ba.upload(R,os(qe),an,E),_e.uniformsNeedUpdate=!1),_e.isSpriteMaterial&&st.setValue(R,"center",H.center),st.setValue(R,"modelViewMatrix",H.modelViewMatrix),st.setValue(R,"normalMatrix",H.normalMatrix),st.setValue(R,"modelMatrix",H.matrixWorld),_e.isShaderMaterial||_e.isRawShaderMaterial){const Et=_e.uniformsGroups;for(let zt=0,xi=Et.length;zt<xi;zt++){const Tn=Et[zt];z.update(Tn,Ft),z.bind(Tn,Ft)}}return Ft}function yo(P,ne){P.ambientLightColor.needsUpdate=ne,P.lightProbe.needsUpdate=ne,P.directionalLights.needsUpdate=ne,P.directionalLightShadows.needsUpdate=ne,P.pointLights.needsUpdate=ne,P.pointLightShadows.needsUpdate=ne,P.spotLights.needsUpdate=ne,P.spotLightShadows.needsUpdate=ne,P.rectAreaLights.needsUpdate=ne,P.hemisphereLights.needsUpdate=ne}function Mr(P){return P.isMeshLambertMaterial||P.isMeshToonMaterial||P.isMeshPhongMaterial||P.isMeshStandardMaterial||P.isShadowMaterial||P.isShaderMaterial&&P.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return T},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(P,ne,ge){fe.get(P.texture).__webglTexture=ne,fe.get(P.depthTexture).__webglTexture=ge;const _e=fe.get(P);_e.__hasExternalTextures=!0,_e.__autoAllocateDepthBuffer=ge===void 0,_e.__autoAllocateDepthBuffer||$.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),_e.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(P,ne){const ge=fe.get(P);ge.__webglFramebuffer=ne,ge.__useDefaultFramebuffer=ne===void 0},this.setRenderTarget=function(P,ne=0,ge=0){C=P,w=ne,T=ge;let _e=!0,H=null,Pe=!1,Oe=!1;if(P){const ze=fe.get(P);if(ze.__useDefaultFramebuffer!==void 0)ee.bindFramebuffer(R.FRAMEBUFFER,null),_e=!1;else if(ze.__webglFramebuffer===void 0)E.setupRenderTarget(P);else if(ze.__hasExternalTextures)E.rebindTextures(P,fe.get(P.texture).__webglTexture,fe.get(P.depthTexture).__webglTexture);else if(P.depthBuffer){const Xe=P.depthTexture;if(ze.__boundDepthTexture!==Xe){if(Xe!==null&&fe.has(Xe)&&(P.width!==Xe.image.width||P.height!==Xe.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");E.setupDepthRenderbuffer(P)}}const je=P.texture;(je.isData3DTexture||je.isDataArrayTexture||je.isCompressedArrayTexture)&&(Oe=!0);const Ke=fe.get(P).__webglFramebuffer;P.isWebGLCubeRenderTarget?(Array.isArray(Ke[ne])?H=Ke[ne][ge]:H=Ke[ne],Pe=!0):P.samples>0&&E.useMultisampledRTT(P)===!1?H=fe.get(P).__webglMultisampledFramebuffer:Array.isArray(Ke)?H=Ke[ge]:H=Ke,U.copy(P.viewport),L.copy(P.scissor),F=P.scissorTest}else U.copy(O).multiplyScalar(Z).floor(),L.copy(J).multiplyScalar(Z).floor(),F=ue;if(ee.bindFramebuffer(R.FRAMEBUFFER,H)&&_e&&ee.drawBuffers(P,H),ee.viewport(U),ee.scissor(L),ee.setScissorTest(F),Pe){const ze=fe.get(P.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_CUBE_MAP_POSITIVE_X+ne,ze.__webglTexture,ge)}else if(Oe){const ze=fe.get(P.texture),je=ne||0;R.framebufferTextureLayer(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,ze.__webglTexture,ge||0,je)}b=-1},this.readRenderTargetPixels=function(P,ne,ge,_e,H,Pe,Oe){if(!(P&&P.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ke=fe.get(P).__webglFramebuffer;if(P.isWebGLCubeRenderTarget&&Oe!==void 0&&(ke=ke[Oe]),ke){ee.bindFramebuffer(R.FRAMEBUFFER,ke);try{const ze=P.texture,je=ze.format,Ke=ze.type;if(!me.textureFormatReadable(je)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!me.textureTypeReadable(Ke)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}ne>=0&&ne<=P.width-_e&&ge>=0&&ge<=P.height-H&&R.readPixels(ne,ge,_e,H,ve.convert(je),ve.convert(Ke),Pe)}finally{const ze=C!==null?fe.get(C).__webglFramebuffer:null;ee.bindFramebuffer(R.FRAMEBUFFER,ze)}}},this.readRenderTargetPixelsAsync=async function(P,ne,ge,_e,H,Pe,Oe){if(!(P&&P.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ke=fe.get(P).__webglFramebuffer;if(P.isWebGLCubeRenderTarget&&Oe!==void 0&&(ke=ke[Oe]),ke){const ze=P.texture,je=ze.format,Ke=ze.type;if(!me.textureFormatReadable(je))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!me.textureTypeReadable(Ke))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(ne>=0&&ne<=P.width-_e&&ge>=0&&ge<=P.height-H){ee.bindFramebuffer(R.FRAMEBUFFER,ke);const Xe=R.createBuffer();R.bindBuffer(R.PIXEL_PACK_BUFFER,Xe),R.bufferData(R.PIXEL_PACK_BUFFER,Pe.byteLength,R.STREAM_READ),R.readPixels(ne,ge,_e,H,ve.convert(je),ve.convert(Ke),0);const it=C!==null?fe.get(C).__webglFramebuffer:null;ee.bindFramebuffer(R.FRAMEBUFFER,it);const ct=R.fenceSync(R.SYNC_GPU_COMMANDS_COMPLETE,0);return R.flush(),await Wg(R,ct,4),R.bindBuffer(R.PIXEL_PACK_BUFFER,Xe),R.getBufferSubData(R.PIXEL_PACK_BUFFER,0,Pe),R.deleteBuffer(Xe),R.deleteSync(ct),Pe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(P,ne=null,ge=0){P.isTexture!==!0&&(Hr("WebGLRenderer: copyFramebufferToTexture function signature has changed."),ne=arguments[0]||null,P=arguments[1]);const _e=Math.pow(2,-ge),H=Math.floor(P.image.width*_e),Pe=Math.floor(P.image.height*_e),Oe=ne!==null?ne.x:0,ke=ne!==null?ne.y:0;E.setTexture2D(P,0),R.copyTexSubImage2D(R.TEXTURE_2D,ge,0,0,Oe,ke,H,Pe),ee.unbindTexture()};const as=R.createFramebuffer(),Zl=R.createFramebuffer();this.copyTextureToTexture=function(P,ne,ge=null,_e=null,H=0,Pe=null){P.isTexture!==!0&&(Hr("WebGLRenderer: copyTextureToTexture function signature has changed."),_e=arguments[0]||null,P=arguments[1],ne=arguments[2],Pe=arguments[3]||0,ge=null),Pe===null&&(H!==0?(Hr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),Pe=H,H=0):Pe=0);let Oe,ke,ze,je,Ke,Xe,it,ct,gt;const _t=P.isCompressedTexture?P.mipmaps[Pe]:P.image;if(ge!==null)Oe=ge.max.x-ge.min.x,ke=ge.max.y-ge.min.y,ze=ge.isBox3?ge.max.z-ge.min.z:1,je=ge.min.x,Ke=ge.min.y,Xe=ge.isBox3?ge.min.z:0;else{const kt=Math.pow(2,-H);Oe=Math.floor(_t.width*kt),ke=Math.floor(_t.height*kt),P.isDataArrayTexture?ze=_t.depth:P.isData3DTexture?ze=Math.floor(_t.depth*kt):ze=1,je=0,Ke=0,Xe=0}_e!==null?(it=_e.x,ct=_e.y,gt=_e.z):(it=0,ct=0,gt=0);const rt=ve.convert(ne.format),qe=ve.convert(ne.type);let yt;ne.isData3DTexture?(E.setTexture3D(ne,0),yt=R.TEXTURE_3D):ne.isDataArrayTexture||ne.isCompressedArrayTexture?(E.setTexture2DArray(ne,0),yt=R.TEXTURE_2D_ARRAY):(E.setTexture2D(ne,0),yt=R.TEXTURE_2D),R.pixelStorei(R.UNPACK_FLIP_Y_WEBGL,ne.flipY),R.pixelStorei(R.UNPACK_PREMULTIPLY_ALPHA_WEBGL,ne.premultiplyAlpha),R.pixelStorei(R.UNPACK_ALIGNMENT,ne.unpackAlignment);const ot=R.getParameter(R.UNPACK_ROW_LENGTH),Ft=R.getParameter(R.UNPACK_IMAGE_HEIGHT),Gn=R.getParameter(R.UNPACK_SKIP_PIXELS),Bt=R.getParameter(R.UNPACK_SKIP_ROWS),ti=R.getParameter(R.UNPACK_SKIP_IMAGES);R.pixelStorei(R.UNPACK_ROW_LENGTH,_t.width),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,_t.height),R.pixelStorei(R.UNPACK_SKIP_PIXELS,je),R.pixelStorei(R.UNPACK_SKIP_ROWS,Ke),R.pixelStorei(R.UNPACK_SKIP_IMAGES,Xe);const st=P.isDataArrayTexture||P.isData3DTexture,an=ne.isDataArrayTexture||ne.isData3DTexture;if(P.isDepthTexture){const kt=fe.get(P),Et=fe.get(ne),zt=fe.get(kt.__renderTarget),xi=fe.get(Et.__renderTarget);ee.bindFramebuffer(R.READ_FRAMEBUFFER,zt.__webglFramebuffer),ee.bindFramebuffer(R.DRAW_FRAMEBUFFER,xi.__webglFramebuffer);for(let Tn=0;Tn<ze;Tn++)st&&(R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,fe.get(P).__webglTexture,H,Xe+Tn),R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,fe.get(ne).__webglTexture,Pe,gt+Tn)),R.blitFramebuffer(je,Ke,Oe,ke,it,ct,Oe,ke,R.DEPTH_BUFFER_BIT,R.NEAREST);ee.bindFramebuffer(R.READ_FRAMEBUFFER,null),ee.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else if(H!==0||P.isRenderTargetTexture||fe.has(P)){const kt=fe.get(P),Et=fe.get(ne);ee.bindFramebuffer(R.READ_FRAMEBUFFER,as),ee.bindFramebuffer(R.DRAW_FRAMEBUFFER,Zl);for(let zt=0;zt<ze;zt++)st?R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,kt.__webglTexture,H,Xe+zt):R.framebufferTexture2D(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,kt.__webglTexture,H),an?R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,Et.__webglTexture,Pe,gt+zt):R.framebufferTexture2D(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,Et.__webglTexture,Pe),H!==0?R.blitFramebuffer(je,Ke,Oe,ke,it,ct,Oe,ke,R.COLOR_BUFFER_BIT,R.NEAREST):an?R.copyTexSubImage3D(yt,Pe,it,ct,gt+zt,je,Ke,Oe,ke):R.copyTexSubImage2D(yt,Pe,it,ct,je,Ke,Oe,ke);ee.bindFramebuffer(R.READ_FRAMEBUFFER,null),ee.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else an?P.isDataTexture||P.isData3DTexture?R.texSubImage3D(yt,Pe,it,ct,gt,Oe,ke,ze,rt,qe,_t.data):ne.isCompressedArrayTexture?R.compressedTexSubImage3D(yt,Pe,it,ct,gt,Oe,ke,ze,rt,_t.data):R.texSubImage3D(yt,Pe,it,ct,gt,Oe,ke,ze,rt,qe,_t):P.isDataTexture?R.texSubImage2D(R.TEXTURE_2D,Pe,it,ct,Oe,ke,rt,qe,_t.data):P.isCompressedTexture?R.compressedTexSubImage2D(R.TEXTURE_2D,Pe,it,ct,_t.width,_t.height,rt,_t.data):R.texSubImage2D(R.TEXTURE_2D,Pe,it,ct,Oe,ke,rt,qe,_t);R.pixelStorei(R.UNPACK_ROW_LENGTH,ot),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,Ft),R.pixelStorei(R.UNPACK_SKIP_PIXELS,Gn),R.pixelStorei(R.UNPACK_SKIP_ROWS,Bt),R.pixelStorei(R.UNPACK_SKIP_IMAGES,ti),Pe===0&&ne.generateMipmaps&&R.generateMipmap(yt),ee.unbindTexture()},this.copyTextureToTexture3D=function(P,ne,ge=null,_e=null,H=0){return P.isTexture!==!0&&(Hr("WebGLRenderer: copyTextureToTexture3D function signature has changed."),ge=arguments[0]||null,_e=arguments[1]||null,P=arguments[2],ne=arguments[3],H=arguments[4]||0),Hr('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(P,ne,ge,_e,H)},this.initRenderTarget=function(P){fe.get(P).__webglFramebuffer===void 0&&E.setupRenderTarget(P)},this.initTexture=function(P){P.isCubeTexture?E.setTextureCube(P,0):P.isData3DTexture?E.setTexture3D(P,0):P.isDataArrayTexture||P.isCompressedArrayTexture?E.setTexture2DArray(P,0):E.setTexture2D(P,0),ee.unbindTexture()},this.resetState=function(){w=0,T=0,C=null,ee.reset(),Ue.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return jn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorspace=at._getDrawingBufferColorSpace(e),t.unpackColorSpace=at._getUnpackColorSpace()}}const x1=Object.freeze(Object.defineProperty({__proto__:null,ACESFilmicToneMapping:Qd,AddEquation:Pi,AddOperation:Zd,AdditiveAnimationBlendMode:Lh,AdditiveBlending:th,AgXToneMapping:ep,AlphaFormat:Th,AlwaysCompare:pp,AlwaysDepth:Ra,AlwaysStencilFunc:sh,AmbientLight:om,AnimationAction:mm,AnimationClip:so,AnimationLoader:p_,AnimationMixer:H_,AnimationObjectGroup:V_,AnimationUtils:h_,ArcCurve:Lp,ArrayCamera:um,ArrowHelper:av,AttachedBindMode:rh,Audio:dm,AudioAnalyser:I_,AudioContext:iu,AudioListener:C_,AudioLoader:E_,AxesHelper:lv,BackSide:nn,BasicDepthPacking:op,BasicShadowMap:qm,BatchedMesh:Rp,Bone:Vh,BooleanKeyframeTrack:vr,Box2:dh,Box3:wt,Box3Helper:sv,BoxGeometry:_r,BoxHelper:rv,BufferAttribute:mt,BufferGeometry:nt,BufferGeometryLoader:hm,ByteType:bh,Cache:hi,Camera:uo,CameraHelper:iv,CanvasTexture:D0,CapsuleGeometry:Cl,CatmullRomCurve3:Up,CineonToneMapping:Jd,CircleGeometry:Rl,ClampToEdgeWrapping:Rn,Clock:fm,Color:Fe,ColorKeyframeTrack:eu,ColorManagement:at,CompressedArrayTexture:L0,CompressedCubeTexture:U0,CompressedTexture:Tl,CompressedTextureLoader:m_,ConeGeometry:Pl,ConstantAlphaFactor:Xd,ConstantColorFactor:Hd,Controls:vm,CubeCamera:Mp,CubeReflectionMapping:mi,CubeRefractionMapping:Ii,CubeTexture:fo,CubeTextureLoader:g_,CubeUVReflectionMapping:es,CubicBezierCurve:Xh,CubicBezierCurve3:Dp,CubicInterpolant:Qp,CullFaceBack:eh,CullFaceFront:Ad,CullFaceFrontBack:Ym,CullFaceNone:Td,Curve:kn,CurvePath:Np,CustomBlending:Rd,CustomToneMapping:$d,CylinderGeometry:is,Cylindrical:Z_,Data3DTexture:Oh,DataArrayTexture:xl,DataTexture:Kn,DataTextureLoader:__,DataUtils:a0,DecrementStencilOp:ag,DecrementWrapStencilOp:cg,DefaultLoadingManager:tm,DepthFormat:sr,DepthStencilFormat:dr,DepthTexture:Hh,DetachedBindMode:np,DirectionalLight:sm,DirectionalLightHelper:nv,DiscreteInterpolant:$p,DodecahedronGeometry:Il,DoubleSide:Cn,DstAlphaFactor:Bd,DstColorFactor:zd,DynamicCopyUsage:wg,DynamicDrawUsage:vg,DynamicReadUsage:Mg,EdgesGeometry:Op,EllipseCurve:Al,EqualCompare:hp,EqualDepth:Ia,EqualStencilFunc:dg,EquirectangularReflectionMapping:Gs,EquirectangularRefractionMapping:Hs,Euler:wn,EventDispatcher:$n,ExtrudeGeometry:Ul,FileLoader:_i,Float16BufferAttribute:d0,Float32BufferAttribute:Ge,FloatType:pn,Fog:bl,FogExp2:Sl,FramebufferTexture:I0,FrontSide:pi,Frustum:ns,GLBufferAttribute:Y_,GLSL1:Tg,GLSL3:oh,GreaterCompare:up,GreaterDepth:Ua,GreaterEqualCompare:dp,GreaterEqualDepth:La,GreaterEqualStencilFunc:_g,GreaterStencilFunc:mg,GridHelper:ev,Group:Yr,HalfFloatType:ts,HemisphereLight:nm,HemisphereLightHelper:$_,IcosahedronGeometry:Dl,ImageBitmapLoader:w_,ImageLoader:oo,ImageUtils:_p,IncrementStencilOp:og,IncrementWrapStencilOp:lg,InstancedBufferAttribute:mr,InstancedBufferGeometry:Wl,InstancedInterleavedBuffer:ul,InstancedMesh:Cp,Int16BufferAttribute:u0,Int32BufferAttribute:f0,Int8BufferAttribute:l0,IntType:dl,InterleavedBuffer:wl,InterleavedBufferAttribute:Sn,Interpolant:_o,InterpolateDiscrete:Ys,InterpolateLinear:al,InterpolateSmooth:Sa,InvertStencilOp:hg,KeepStencilOp:Ji,KeyframeTrack:zn,LOD:Tp,LatheGeometry:po,Layers:Ml,LessCompare:cp,LessDepth:Pa,LessEqualCompare:Dh,LessEqualDepth:ur,LessEqualStencilFunc:pg,LessStencilFunc:fg,Light:Ni,LightProbe:cm,Line:Li,Line3:gm,LineBasicMaterial:rn,LineCurve:Yh,LineCurve3:Fp,LineDashedMaterial:jp,LineLoop:Pp,LineSegments:ei,LinearFilter:At,LinearInterpolant:$h,LinearMipMapLinearFilter:Jm,LinearMipMapNearestFilter:Km,LinearMipmapLinearFilter:Zn,LinearMipmapNearestFilter:Is,LinearSRGBColorSpace:pr,LinearToneMapping:jd,LinearTransfer:Zs,Loader:mn,LoaderUtils:uh,LoadingManager:tu,LoopOnce:ip,LoopPingPong:sp,LoopRepeat:rp,LuminanceAlphaFormat:Rh,LuminanceFormat:Ch,MOUSE:xn,Material:Kt,MaterialLoader:Hl,MathUtils:Nh,Matrix2:au,Matrix3:Je,Matrix4:Ye,MaxEquation:Ud,Mesh:vt,MeshBasicMaterial:vi,MeshDepthMaterial:Vl,MeshDistanceMaterial:Gl,MeshLambertMaterial:qp,MeshMatcapMaterial:Zp,MeshNormalMaterial:Yp,MeshPhongMaterial:Wp,MeshPhysicalMaterial:Hp,MeshStandardMaterial:Jh,MeshToonMaterial:Xp,MinEquation:Ld,MirroredRepeatWrapping:Xs,MixOperation:qd,MultiplyBlending:ih,MultiplyOperation:co,NearestFilter:Xt,NearestMipMapLinearFilter:jm,NearestMipMapNearestFilter:Zm,NearestMipmapLinearFilter:Wr,NearestMipmapNearestFilter:Sh,NeutralToneMapping:tp,NeverCompare:lp,NeverDepth:Ca,NeverStencilFunc:ug,NoBlending:ui,NoColorSpace:li,NoToneMapping:fi,NormalAnimationBlendMode:yl,NormalBlending:rr,NotEqualCompare:fp,NotEqualDepth:Da,NotEqualStencilFunc:gg,NumberKeyframeTrack:io,Object3D:ut,ObjectLoader:S_,ObjectSpaceNormalMap:ap,OctahedronGeometry:mo,OneFactor:Fd,OneMinusConstantAlphaFactor:Yd,OneMinusConstantColorFactor:Wd,OneMinusDstAlphaFactor:kd,OneMinusDstColorFactor:Vd,OneMinusSrcAlphaFactor:Aa,OneMinusSrcColorFactor:Od,OrthographicCamera:lr,PCFShadowMap:Mh,PCFSoftShadowMap:Cd,PMREMGenerator:mh,Path:$s,PerspectiveCamera:Rt,Plane:Yn,PlaneGeometry:yi,PlaneHelper:ov,PointLight:rm,PointLightHelper:J_,Points:Ip,PointsMaterial:Gh,PolarGridHelper:tv,PolyhedronGeometry:Fi,PositionalAudio:P_,PropertyBinding:ht,PropertyMixer:pm,QuadraticBezierCurve:qh,QuadraticBezierCurve3:Zh,Quaternion:Ot,QuaternionKeyframeTrack:vo,QuaternionLinearInterpolant:em,RED_GREEN_RGTC2_Format:sl,RED_RGTC1_Format:Ih,REVISION:lo,RGBADepthPacking:Uh,RGBAFormat:tn,RGBAIntegerFormat:vl,RGBA_ASTC_10x10_Format:$a,RGBA_ASTC_10x5_Format:Ka,RGBA_ASTC_10x6_Format:Ja,RGBA_ASTC_10x8_Format:Qa,RGBA_ASTC_12x10_Format:el,RGBA_ASTC_12x12_Format:tl,RGBA_ASTC_4x4_Format:Ga,RGBA_ASTC_5x4_Format:Ha,RGBA_ASTC_5x5_Format:Wa,RGBA_ASTC_6x5_Format:Xa,RGBA_ASTC_6x6_Format:Ya,RGBA_ASTC_8x5_Format:qa,RGBA_ASTC_8x6_Format:Za,RGBA_ASTC_8x8_Format:ja,RGBA_BPTC_Format:Ns,RGBA_ETC2_EAC_Format:Va,RGBA_PVRTC_2BPPV1_Format:Ba,RGBA_PVRTC_4BPPV1_Format:Oa,RGBA_S3TC_DXT1_Format:Us,RGBA_S3TC_DXT3_Format:Ds,RGBA_S3TC_DXT5_Format:Fs,RGBDepthPacking:ng,RGBFormat:Ah,RGBIntegerFormat:Qm,RGB_BPTC_SIGNED_Format:nl,RGB_BPTC_UNSIGNED_Format:il,RGB_ETC1_Format:ka,RGB_ETC2_Format:za,RGB_PVRTC_2BPPV1_Format:Na,RGB_PVRTC_4BPPV1_Format:Fa,RGB_S3TC_DXT1_Format:Ls,RGDepthPacking:ig,RGFormat:Ph,RGIntegerFormat:_l,RawShaderMaterial:Gp,Ray:Di,Raycaster:q_,RectAreaLight:am,RedFormat:gl,RedIntegerFormat:ho,ReinhardToneMapping:Kd,RenderTarget:vp,RepeatWrapping:Ws,ReplaceStencilOp:sg,ReverseSubtractEquation:Id,RingGeometry:Fl,SIGNED_RED_GREEN_RGTC2_Format:ol,SIGNED_RED_RGTC1_Format:rl,SRGBColorSpace:$t,SRGBTransfer:dt,Scene:bp,ShaderChunk:$e,ShaderLib:On,ShaderMaterial:Pn,ShadowMaterial:Vp,Shape:ar,ShapeGeometry:Nl,ShapePath:cv,ShapeUtils:Jn,ShortType:wh,Skeleton:El,SkeletonHelper:K_,SkinnedMesh:Ap,Source:nr,Sphere:It,SphereGeometry:go,Spherical:ao,SphericalHarmonics3:lm,SplineCurve:jh,SpotLight:im,SpotLightHelper:j_,Sprite:Ep,SpriteMaterial:zh,SrcAlphaFactor:Ta,SrcAlphaSaturateFactor:Gd,SrcColorFactor:Nd,StaticCopyUsage:bg,StaticDrawUsage:js,StaticReadUsage:xg,StereoCamera:T_,StreamCopyUsage:Eg,StreamDrawUsage:yg,StreamReadUsage:Sg,StringKeyframeTrack:yr,SubtractEquation:Pd,SubtractiveBlending:nh,TOUCH:Mn,TangentSpaceNormalMap:Ui,TetrahedronGeometry:Ol,Texture:Mt,TextureLoader:v_,TextureUtils:pv,TorusGeometry:Bl,TorusKnotGeometry:kl,Triangle:dn,TriangleFanDrawMode:tg,TriangleStripDrawMode:eg,TrianglesDrawMode:$m,TubeGeometry:zl,UVMapping:fl,Uint16BufferAttribute:Bh,Uint32BufferAttribute:kh,Uint8BufferAttribute:c0,Uint8ClampedBufferAttribute:h0,Uniform:ou,UniformsGroup:X_,UniformsLib:Ne,UniformsUtils:Qs,UnsignedByteType:Qn,UnsignedInt248Type:fr,UnsignedInt5999Type:Eh,UnsignedIntType:gi,UnsignedShort4444Type:pl,UnsignedShort5551Type:ml,UnsignedShortType:Jr,VSMShadowMap:Xn,Vector2:Me,Vector3:I,Vector4:tt,VectorKeyframeTrack:ro,VideoTexture:P0,WebGL3DRenderTarget:Jg,WebGLArrayRenderTarget:Kg,WebGLCoordinateSystem:jn,WebGLCubeRenderTarget:Sp,WebGLMultipleRenderTargets:mv,WebGLRenderTarget:Bn,WebGLRenderer:KS,WebGLUtils:wm,WebGPUCoordinateSystem:Ks,WireframeGeometry:Kh,WrapAroundEnding:qs,ZeroCurvatureEnding:er,ZeroFactor:Dd,ZeroSlopeEnding:tr,ZeroStencilOp:rg,createCanvasElement:gp},Symbol.toStringTag,{value:"Module"})),Em=parseInt(lo.replace(/\D+/g,"")),Tm=Em>=125?"uv1":"uv2";var JS=Object.defineProperty,QS=(s,e,t)=>e in s?JS(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t,$S=(s,e,t)=>(QS(s,e+"",t),t);class eb{constructor(){$S(this,"_listeners")}addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const i=this._listeners[e];if(i!==void 0){const r=i.indexOf(t);r!==-1&&i.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let r=0,o=i.length;r<o;r++)i[r].call(this,e);e.target=null}}}var tb=Object.defineProperty,nb=(s,e,t)=>e in s?tb(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t,Ze=(s,e,t)=>(nb(s,typeof e!="symbol"?e+"":e,t),t);const ma=new Di,id=new Yn,ib=Math.cos(70*(Math.PI/180)),rd=(s,e)=>(s%e+e)%e;let M1=class extends eb{constructor(e,t){super(),Ze(this,"object"),Ze(this,"domElement"),Ze(this,"enabled",!0),Ze(this,"target",new I),Ze(this,"minDistance",0),Ze(this,"maxDistance",1/0),Ze(this,"minZoom",0),Ze(this,"maxZoom",1/0),Ze(this,"minPolarAngle",0),Ze(this,"maxPolarAngle",Math.PI),Ze(this,"minAzimuthAngle",-1/0),Ze(this,"maxAzimuthAngle",1/0),Ze(this,"enableDamping",!1),Ze(this,"dampingFactor",.05),Ze(this,"enableZoom",!0),Ze(this,"zoomSpeed",1),Ze(this,"enableRotate",!0),Ze(this,"rotateSpeed",1),Ze(this,"enablePan",!0),Ze(this,"panSpeed",1),Ze(this,"screenSpacePanning",!0),Ze(this,"keyPanSpeed",7),Ze(this,"zoomToCursor",!1),Ze(this,"autoRotate",!1),Ze(this,"autoRotateSpeed",2),Ze(this,"reverseOrbit",!1),Ze(this,"reverseHorizontalOrbit",!1),Ze(this,"reverseVerticalOrbit",!1),Ze(this,"keys",{LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"}),Ze(this,"mouseButtons",{LEFT:xn.ROTATE,MIDDLE:xn.DOLLY,RIGHT:xn.PAN}),Ze(this,"touches",{ONE:Mn.ROTATE,TWO:Mn.DOLLY_PAN}),Ze(this,"target0"),Ze(this,"position0"),Ze(this,"zoom0"),Ze(this,"_domElementKeyEvents",null),Ze(this,"getPolarAngle"),Ze(this,"getAzimuthalAngle"),Ze(this,"setPolarAngle"),Ze(this,"setAzimuthalAngle"),Ze(this,"getDistance"),Ze(this,"getZoomScale"),Ze(this,"listenToKeyEvents"),Ze(this,"stopListenToKeyEvents"),Ze(this,"saveState"),Ze(this,"reset"),Ze(this,"update"),Ze(this,"connect"),Ze(this,"dispose"),Ze(this,"dollyIn"),Ze(this,"dollyOut"),Ze(this,"getScale"),Ze(this,"setScale"),this.object=e,this.domElement=t,this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this.getPolarAngle=()=>h.phi,this.getAzimuthalAngle=()=>h.theta,this.setPolarAngle=W=>{let ve=rd(W,2*Math.PI),Ue=h.phi;Ue<0&&(Ue+=2*Math.PI),ve<0&&(ve+=2*Math.PI);let z=Math.abs(ve-Ue);2*Math.PI-z<z&&(ve<Ue?ve+=2*Math.PI:Ue+=2*Math.PI),u.phi=ve-Ue,n.update()},this.setAzimuthalAngle=W=>{let ve=rd(W,2*Math.PI),Ue=h.theta;Ue<0&&(Ue+=2*Math.PI),ve<0&&(ve+=2*Math.PI);let z=Math.abs(ve-Ue);2*Math.PI-z<z&&(ve<Ue?ve+=2*Math.PI:Ue+=2*Math.PI),u.theta=ve-Ue,n.update()},this.getDistance=()=>n.object.position.distanceTo(n.target),this.listenToKeyEvents=W=>{W.addEventListener("keydown",ye),this._domElementKeyEvents=W},this.stopListenToKeyEvents=()=>{this._domElementKeyEvents.removeEventListener("keydown",ye),this._domElementKeyEvents=null},this.saveState=()=>{n.target0.copy(n.target),n.position0.copy(n.object.position),n.zoom0=n.object.zoom},this.reset=()=>{n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.zoom=n.zoom0,n.object.updateProjectionMatrix(),n.dispatchEvent(i),n.update(),l=a.NONE},this.update=(()=>{const W=new I,ve=new I(0,1,0),Ue=new Ot().setFromUnitVectors(e.up,ve),z=Ue.clone().invert(),xe=new I,he=new Ot,Ee=2*Math.PI;return function(){const Ae=n.object.position;Ue.setFromUnitVectors(e.up,ve),z.copy(Ue).invert(),W.copy(Ae).sub(n.target),W.applyQuaternion(Ue),h.setFromVector3(W),n.autoRotate&&l===a.NONE&&N(L()),n.enableDamping?(h.theta+=u.theta*n.dampingFactor,h.phi+=u.phi*n.dampingFactor):(h.theta+=u.theta,h.phi+=u.phi);let Be=n.minAzimuthAngle,We=n.maxAzimuthAngle;isFinite(Be)&&isFinite(We)&&(Be<-Math.PI?Be+=Ee:Be>Math.PI&&(Be-=Ee),We<-Math.PI?We+=Ee:We>Math.PI&&(We-=Ee),Be<=We?h.theta=Math.max(Be,Math.min(We,h.theta)):h.theta=h.theta>(Be+We)/2?Math.max(Be,h.theta):Math.min(We,h.theta)),h.phi=Math.max(n.minPolarAngle,Math.min(n.maxPolarAngle,h.phi)),h.makeSafe(),n.enableDamping===!0?n.target.addScaledVector(d,n.dampingFactor):n.target.add(d),n.zoomToCursor&&b||n.object.isOrthographicCamera?h.radius=ue(h.radius):h.radius=ue(h.radius*f),W.setFromSpherical(h),W.applyQuaternion(z),Ae.copy(n.target).add(W),n.object.matrixAutoUpdate||n.object.updateMatrix(),n.object.lookAt(n.target),n.enableDamping===!0?(u.theta*=1-n.dampingFactor,u.phi*=1-n.dampingFactor,d.multiplyScalar(1-n.dampingFactor)):(u.set(0,0,0),d.set(0,0,0));let Ve=!1;if(n.zoomToCursor&&b){let He=null;if(n.object instanceof Rt&&n.object.isPerspectiveCamera){const lt=W.length();He=ue(lt*f);const ft=lt-He;n.object.position.addScaledVector(T,ft),n.object.updateMatrixWorld()}else if(n.object.isOrthographicCamera){const lt=new I(C.x,C.y,0);lt.unproject(n.object),n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/f)),n.object.updateProjectionMatrix(),Ve=!0;const ft=new I(C.x,C.y,0);ft.unproject(n.object),n.object.position.sub(ft).add(lt),n.object.updateMatrixWorld(),He=W.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),n.zoomToCursor=!1;He!==null&&(n.screenSpacePanning?n.target.set(0,0,-1).transformDirection(n.object.matrix).multiplyScalar(He).add(n.object.position):(ma.origin.copy(n.object.position),ma.direction.set(0,0,-1).transformDirection(n.object.matrix),Math.abs(n.object.up.dot(ma.direction))<ib?e.lookAt(n.target):(id.setFromNormalAndCoplanarPoint(n.object.up,n.target),ma.intersectPlane(id,n.target))))}else n.object instanceof lr&&n.object.isOrthographicCamera&&(Ve=f!==1,Ve&&(n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/f)),n.object.updateProjectionMatrix()));return f=1,b=!1,Ve||xe.distanceToSquared(n.object.position)>c||8*(1-he.dot(n.object.quaternion))>c?(n.dispatchEvent(i),xe.copy(n.object.position),he.copy(n.object.quaternion),Ve=!1,!0):!1}})(),this.connect=W=>{n.domElement=W,n.domElement.style.touchAction="none",n.domElement.addEventListener("contextmenu",we),n.domElement.addEventListener("pointerdown",S),n.domElement.addEventListener("pointercancel",Y),n.domElement.addEventListener("wheel",Se)},this.dispose=()=>{var W,ve,Ue,z,xe,he;n.domElement&&(n.domElement.style.touchAction="auto"),(W=n.domElement)==null||W.removeEventListener("contextmenu",we),(ve=n.domElement)==null||ve.removeEventListener("pointerdown",S),(Ue=n.domElement)==null||Ue.removeEventListener("pointercancel",Y),(z=n.domElement)==null||z.removeEventListener("wheel",Se),(xe=n.domElement)==null||xe.ownerDocument.removeEventListener("pointermove",D),(he=n.domElement)==null||he.ownerDocument.removeEventListener("pointerup",Y),n._domElementKeyEvents!==null&&n._domElementKeyEvents.removeEventListener("keydown",ye)};const n=this,i={type:"change"},r={type:"start"},o={type:"end"},a={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let l=a.NONE;const c=1e-6,h=new ao,u=new ao;let f=1;const d=new I,p=new Me,_=new Me,g=new Me,m=new Me,x=new Me,y=new Me,v=new Me,A=new Me,w=new Me,T=new I,C=new Me;let b=!1;const M=[],U={};function L(){return 2*Math.PI/60/60*n.autoRotateSpeed}function F(){return Math.pow(.95,n.zoomSpeed)}function N(W){n.reverseOrbit||n.reverseHorizontalOrbit?u.theta+=W:u.theta-=W}function Q(W){n.reverseOrbit||n.reverseVerticalOrbit?u.phi+=W:u.phi-=W}const V=(()=>{const W=new I;return function(Ue,z){W.setFromMatrixColumn(z,0),W.multiplyScalar(-Ue),d.add(W)}})(),le=(()=>{const W=new I;return function(Ue,z){n.screenSpacePanning===!0?W.setFromMatrixColumn(z,1):(W.setFromMatrixColumn(z,0),W.crossVectors(n.object.up,W)),W.multiplyScalar(Ue),d.add(W)}})(),Z=(()=>{const W=new I;return function(Ue,z){const xe=n.domElement;if(xe&&n.object instanceof Rt&&n.object.isPerspectiveCamera){const he=n.object.position;W.copy(he).sub(n.target);let Ee=W.length();Ee*=Math.tan(n.object.fov/2*Math.PI/180),V(2*Ue*Ee/xe.clientHeight,n.object.matrix),le(2*z*Ee/xe.clientHeight,n.object.matrix)}else xe&&n.object instanceof lr&&n.object.isOrthographicCamera?(V(Ue*(n.object.right-n.object.left)/n.object.zoom/xe.clientWidth,n.object.matrix),le(z*(n.object.top-n.object.bottom)/n.object.zoom/xe.clientHeight,n.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),n.enablePan=!1)}})();function te(W){n.object instanceof Rt&&n.object.isPerspectiveCamera||n.object instanceof lr&&n.object.isOrthographicCamera?f=W:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function K(W){te(f/W)}function O(W){te(f*W)}function J(W){if(!n.zoomToCursor||!n.domElement)return;b=!0;const ve=n.domElement.getBoundingClientRect(),Ue=W.clientX-ve.left,z=W.clientY-ve.top,xe=ve.width,he=ve.height;C.x=Ue/xe*2-1,C.y=-(z/he)*2+1,T.set(C.x,C.y,1).unproject(n.object).sub(n.object.position).normalize()}function ue(W){return Math.max(n.minDistance,Math.min(n.maxDistance,W))}function k(W){p.set(W.clientX,W.clientY)}function X(W){J(W),v.set(W.clientX,W.clientY)}function ce(W){m.set(W.clientX,W.clientY)}function j(W){_.set(W.clientX,W.clientY),g.subVectors(_,p).multiplyScalar(n.rotateSpeed);const ve=n.domElement;ve&&(N(2*Math.PI*g.x/ve.clientHeight),Q(2*Math.PI*g.y/ve.clientHeight)),p.copy(_),n.update()}function G(W){A.set(W.clientX,W.clientY),w.subVectors(A,v),w.y>0?K(F()):w.y<0&&O(F()),v.copy(A),n.update()}function pe(W){x.set(W.clientX,W.clientY),y.subVectors(x,m).multiplyScalar(n.panSpeed),Z(y.x,y.y),m.copy(x),n.update()}function se(W){J(W),W.deltaY<0?O(F()):W.deltaY>0&&K(F()),n.update()}function ae(W){let ve=!1;switch(W.code){case n.keys.UP:Z(0,n.keyPanSpeed),ve=!0;break;case n.keys.BOTTOM:Z(0,-n.keyPanSpeed),ve=!0;break;case n.keys.LEFT:Z(n.keyPanSpeed,0),ve=!0;break;case n.keys.RIGHT:Z(-n.keyPanSpeed,0),ve=!0;break}ve&&(W.preventDefault(),n.update())}function B(){if(M.length==1)p.set(M[0].pageX,M[0].pageY);else{const W=.5*(M[0].pageX+M[1].pageX),ve=.5*(M[0].pageY+M[1].pageY);p.set(W,ve)}}function ie(){if(M.length==1)m.set(M[0].pageX,M[0].pageY);else{const W=.5*(M[0].pageX+M[1].pageX),ve=.5*(M[0].pageY+M[1].pageY);m.set(W,ve)}}function R(){const W=M[0].pageX-M[1].pageX,ve=M[0].pageY-M[1].pageY,Ue=Math.sqrt(W*W+ve*ve);v.set(0,Ue)}function oe(){n.enableZoom&&R(),n.enablePan&&ie()}function $(){n.enableZoom&&R(),n.enableRotate&&B()}function me(W){if(M.length==1)_.set(W.pageX,W.pageY);else{const Ue=Te(W),z=.5*(W.pageX+Ue.x),xe=.5*(W.pageY+Ue.y);_.set(z,xe)}g.subVectors(_,p).multiplyScalar(n.rotateSpeed);const ve=n.domElement;ve&&(N(2*Math.PI*g.x/ve.clientHeight),Q(2*Math.PI*g.y/ve.clientHeight)),p.copy(_)}function ee(W){if(M.length==1)x.set(W.pageX,W.pageY);else{const ve=Te(W),Ue=.5*(W.pageX+ve.x),z=.5*(W.pageY+ve.y);x.set(Ue,z)}y.subVectors(x,m).multiplyScalar(n.panSpeed),Z(y.x,y.y),m.copy(x)}function de(W){const ve=Te(W),Ue=W.pageX-ve.x,z=W.pageY-ve.y,xe=Math.sqrt(Ue*Ue+z*z);A.set(0,xe),w.set(0,Math.pow(A.y/v.y,n.zoomSpeed)),K(w.y),v.copy(A)}function fe(W){n.enableZoom&&de(W),n.enablePan&&ee(W)}function E(W){n.enableZoom&&de(W),n.enableRotate&&me(W)}function S(W){var ve,Ue;n.enabled!==!1&&(M.length===0&&((ve=n.domElement)==null||ve.ownerDocument.addEventListener("pointermove",D),(Ue=n.domElement)==null||Ue.ownerDocument.addEventListener("pointerup",Y)),Re(W),W.pointerType==="touch"?be(W):q(W))}function D(W){n.enabled!==!1&&(W.pointerType==="touch"?Le(W):re(W))}function Y(W){var ve,Ue,z;Ie(W),M.length===0&&((ve=n.domElement)==null||ve.releasePointerCapture(W.pointerId),(Ue=n.domElement)==null||Ue.ownerDocument.removeEventListener("pointermove",D),(z=n.domElement)==null||z.ownerDocument.removeEventListener("pointerup",Y)),n.dispatchEvent(o),l=a.NONE}function q(W){let ve;switch(W.button){case 0:ve=n.mouseButtons.LEFT;break;case 1:ve=n.mouseButtons.MIDDLE;break;case 2:ve=n.mouseButtons.RIGHT;break;default:ve=-1}switch(ve){case xn.DOLLY:if(n.enableZoom===!1)return;X(W),l=a.DOLLY;break;case xn.ROTATE:if(W.ctrlKey||W.metaKey||W.shiftKey){if(n.enablePan===!1)return;ce(W),l=a.PAN}else{if(n.enableRotate===!1)return;k(W),l=a.ROTATE}break;case xn.PAN:if(W.ctrlKey||W.metaKey||W.shiftKey){if(n.enableRotate===!1)return;k(W),l=a.ROTATE}else{if(n.enablePan===!1)return;ce(W),l=a.PAN}break;default:l=a.NONE}l!==a.NONE&&n.dispatchEvent(r)}function re(W){if(n.enabled!==!1)switch(l){case a.ROTATE:if(n.enableRotate===!1)return;j(W);break;case a.DOLLY:if(n.enableZoom===!1)return;G(W);break;case a.PAN:if(n.enablePan===!1)return;pe(W);break}}function Se(W){n.enabled===!1||n.enableZoom===!1||l!==a.NONE&&l!==a.ROTATE||(W.preventDefault(),n.dispatchEvent(r),se(W),n.dispatchEvent(o))}function ye(W){n.enabled===!1||n.enablePan===!1||ae(W)}function be(W){switch(De(W),M.length){case 1:switch(n.touches.ONE){case Mn.ROTATE:if(n.enableRotate===!1)return;B(),l=a.TOUCH_ROTATE;break;case Mn.PAN:if(n.enablePan===!1)return;ie(),l=a.TOUCH_PAN;break;default:l=a.NONE}break;case 2:switch(n.touches.TWO){case Mn.DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;oe(),l=a.TOUCH_DOLLY_PAN;break;case Mn.DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;$(),l=a.TOUCH_DOLLY_ROTATE;break;default:l=a.NONE}break;default:l=a.NONE}l!==a.NONE&&n.dispatchEvent(r)}function Le(W){switch(De(W),l){case a.TOUCH_ROTATE:if(n.enableRotate===!1)return;me(W),n.update();break;case a.TOUCH_PAN:if(n.enablePan===!1)return;ee(W),n.update();break;case a.TOUCH_DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;fe(W),n.update();break;case a.TOUCH_DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;E(W),n.update();break;default:l=a.NONE}}function we(W){n.enabled!==!1&&W.preventDefault()}function Re(W){M.push(W)}function Ie(W){delete U[W.pointerId];for(let ve=0;ve<M.length;ve++)if(M[ve].pointerId==W.pointerId){M.splice(ve,1);return}}function De(W){let ve=U[W.pointerId];ve===void 0&&(ve=new Me,U[W.pointerId]=ve),ve.set(W.pageX,W.pageY)}function Te(W){const ve=W.pointerId===M[0].pointerId?M[1]:M[0];return U[ve.pointerId]}this.dollyIn=(W=F())=>{O(W),n.update()},this.dollyOut=(W=F())=>{K(W),n.update()},this.getScale=()=>f,this.setScale=W=>{te(W),n.update()},this.getZoomScale=()=>F(),t!==void 0&&this.connect(t),this.update()}};const sd=new wt,ga=new I;class Am extends Wl{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";const e=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],t=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],n=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(n),this.setAttribute("position",new Ge(e,3)),this.setAttribute("uv",new Ge(t,2))}applyMatrix4(e){const t=this.attributes.instanceStart,n=this.attributes.instanceEnd;return t!==void 0&&(t.applyMatrix4(e),n.applyMatrix4(e),t.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));const n=new ul(t,6,1);return this.setAttribute("instanceStart",new Sn(n,3,0)),this.setAttribute("instanceEnd",new Sn(n,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let n;e instanceof Float32Array?n=e:Array.isArray(e)&&(n=new Float32Array(e));const i=new ul(n,t*2,1);return this.setAttribute("instanceColorStart",new Sn(i,t,0)),this.setAttribute("instanceColorEnd",new Sn(i,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new Kh(e.geometry)),this}fromLineSegments(e){const t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new wt);const e=this.attributes.instanceStart,t=this.attributes.instanceEnd;e!==void 0&&t!==void 0&&(this.boundingBox.setFromBufferAttribute(e),sd.setFromBufferAttribute(t),this.boundingBox.union(sd))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new It),this.boundingBox===null&&this.computeBoundingBox();const e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(e!==void 0&&t!==void 0){const n=this.boundingSphere.center;this.boundingBox.getCenter(n);let i=0;for(let r=0,o=e.count;r<o;r++)ga.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(ga)),ga.fromBufferAttribute(t,r),i=Math.max(i,n.distanceToSquared(ga));this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}class rb extends Am{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){const t=e.length-3,n=new Float32Array(2*t);for(let i=0;i<t;i+=3)n[2*i]=e[i],n[2*i+1]=e[i+1],n[2*i+2]=e[i+2],n[2*i+3]=e[i+3],n[2*i+4]=e[i+4],n[2*i+5]=e[i+5];return super.setPositions(n),this}setColors(e,t=3){const n=e.length-t,i=new Float32Array(2*n);if(t===3)for(let r=0;r<n;r+=t)i[2*r]=e[r],i[2*r+1]=e[r+1],i[2*r+2]=e[r+2],i[2*r+3]=e[r+3],i[2*r+4]=e[r+4],i[2*r+5]=e[r+5];else for(let r=0;r<n;r+=t)i[2*r]=e[r],i[2*r+1]=e[r+1],i[2*r+2]=e[r+2],i[2*r+3]=e[r+3],i[2*r+4]=e[r+4],i[2*r+5]=e[r+5],i[2*r+6]=e[r+6],i[2*r+7]=e[r+7];return super.setColors(i,t),this}fromLine(e){const t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class Cm extends Pn{constructor(e){super({type:"LineMaterial",uniforms:Qs.clone(Qs.merge([Ne.common,Ne.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new Me(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
				#include <common>
				#include <fog_pars_vertex>
				#include <logdepthbuf_pars_vertex>
				#include <clipping_planes_pars_vertex>

				uniform float linewidth;
				uniform vec2 resolution;

				attribute vec3 instanceStart;
				attribute vec3 instanceEnd;

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
						attribute vec4 instanceColorStart;
						attribute vec4 instanceColorEnd;
					#else
						varying vec3 vLineColor;
						attribute vec3 instanceColorStart;
						attribute vec3 instanceColorEnd;
					#endif
				#endif

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#ifdef USE_DASH

					uniform float dashScale;
					attribute float instanceDistanceStart;
					attribute float instanceDistanceEnd;
					varying float vLineDistance;

				#endif

				void trimSegment( const in vec4 start, inout vec4 end ) {

					// trim end segment so it terminates between the camera plane and the near plane

					// conservative estimate of the near plane
					float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
					float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
					float nearEstimate = - 0.5 * b / a;

					float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

					end.xyz = mix( start.xyz, end.xyz, alpha );

				}

				void main() {

					#ifdef USE_COLOR

						vLineColor = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

					#endif

					#ifdef USE_DASH

						vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
						vUv = uv;

					#endif

					float aspect = resolution.x / resolution.y;

					// camera space
					vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
					vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

					#ifdef WORLD_UNITS

						worldStart = start.xyz;
						worldEnd = end.xyz;

					#else

						vUv = uv;

					#endif

					// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
					// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
					// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
					// perhaps there is a more elegant solution -- WestLangley

					bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

					if ( perspective ) {

						if ( start.z < 0.0 && end.z >= 0.0 ) {

							trimSegment( start, end );

						} else if ( end.z < 0.0 && start.z >= 0.0 ) {

							trimSegment( end, start );

						}

					}

					// clip space
					vec4 clipStart = projectionMatrix * start;
					vec4 clipEnd = projectionMatrix * end;

					// ndc space
					vec3 ndcStart = clipStart.xyz / clipStart.w;
					vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

					// direction
					vec2 dir = ndcEnd.xy - ndcStart.xy;

					// account for clip-space aspect ratio
					dir.x *= aspect;
					dir = normalize( dir );

					#ifdef WORLD_UNITS

						// get the offset direction as perpendicular to the view vector
						vec3 worldDir = normalize( end.xyz - start.xyz );
						vec3 offset;
						if ( position.y < 0.5 ) {

							offset = normalize( cross( start.xyz, worldDir ) );

						} else {

							offset = normalize( cross( end.xyz, worldDir ) );

						}

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						float forwardOffset = dot( worldDir, vec3( 0.0, 0.0, 1.0 ) );

						// don't extend the line if we're rendering dashes because we
						// won't be rendering the endcaps
						#ifndef USE_DASH

							// extend the line bounds to encompass  endcaps
							start.xyz += - worldDir * linewidth * 0.5;
							end.xyz += worldDir * linewidth * 0.5;

							// shift the position of the quad so it hugs the forward edge of the line
							offset.xy -= dir * forwardOffset;
							offset.z += 0.5;

						#endif

						// endcaps
						if ( position.y > 1.0 || position.y < 0.0 ) {

							offset.xy += dir * 2.0 * forwardOffset;

						}

						// adjust for linewidth
						offset *= linewidth * 0.5;

						// set the world position
						worldPos = ( position.y < 0.5 ) ? start : end;
						worldPos.xyz += offset;

						// project the worldpos
						vec4 clip = projectionMatrix * worldPos;

						// shift the depth of the projected points so the line
						// segments overlap neatly
						vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
						clip.z = clipPose.z * clip.w;

					#else

						vec2 offset = vec2( dir.y, - dir.x );
						// undo aspect ratio adjustment
						dir.x /= aspect;
						offset.x /= aspect;

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						// endcaps
						if ( position.y < 0.0 ) {

							offset += - dir;

						} else if ( position.y > 1.0 ) {

							offset += dir;

						}

						// adjust for linewidth
						offset *= linewidth;

						// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
						offset /= resolution.y;

						// select end
						vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

						// back to clip space
						offset *= clip.w;

						clip.xy += offset;

					#endif

					gl_Position = clip;

					vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

					#include <logdepthbuf_vertex>
					#include <clipping_planes_vertex>
					#include <fog_vertex>

				}
			`,fragmentShader:`
				uniform vec3 diffuse;
				uniform float opacity;
				uniform float linewidth;

				#ifdef USE_DASH

					uniform float dashOffset;
					uniform float dashSize;
					uniform float gapSize;

				#endif

				varying float vLineDistance;

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#include <common>
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <clipping_planes_pars_fragment>

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
					#else
						varying vec3 vLineColor;
					#endif
				#endif

				vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

					float mua;
					float mub;

					vec3 p13 = p1 - p3;
					vec3 p43 = p4 - p3;

					vec3 p21 = p2 - p1;

					float d1343 = dot( p13, p43 );
					float d4321 = dot( p43, p21 );
					float d1321 = dot( p13, p21 );
					float d4343 = dot( p43, p43 );
					float d2121 = dot( p21, p21 );

					float denom = d2121 * d4343 - d4321 * d4321;

					float numer = d1343 * d4321 - d1321 * d4343;

					mua = numer / denom;
					mua = clamp( mua, 0.0, 1.0 );
					mub = ( d1343 + d4321 * ( mua ) ) / d4343;
					mub = clamp( mub, 0.0, 1.0 );

					return vec2( mua, mub );

				}

				void main() {

					#include <clipping_planes_fragment>

					#ifdef USE_DASH

						if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

						if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

					#endif

					float alpha = opacity;

					#ifdef WORLD_UNITS

						// Find the closest points on the view ray and the line segment
						vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
						vec3 lineDir = worldEnd - worldStart;
						vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

						vec3 p1 = worldStart + lineDir * params.x;
						vec3 p2 = rayEnd * params.y;
						vec3 delta = p1 - p2;
						float len = length( delta );
						float norm = len / linewidth;

						#ifndef USE_DASH

							#ifdef USE_ALPHA_TO_COVERAGE

								float dnorm = fwidth( norm );
								alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

							#else

								if ( norm > 0.5 ) {

									discard;

								}

							#endif

						#endif

					#else

						#ifdef USE_ALPHA_TO_COVERAGE

							// artifacts appear on some hardware if a derivative is taken within a conditional
							float a = vUv.x;
							float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
							float len2 = a * a + b * b;
							float dlen = fwidth( len2 );

							if ( abs( vUv.y ) > 1.0 ) {

								alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

							}

						#else

							if ( abs( vUv.y ) > 1.0 ) {

								float a = vUv.x;
								float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
								float len2 = a * a + b * b;

								if ( len2 > 1.0 ) discard;

							}

						#endif

					#endif

					vec4 diffuseColor = vec4( diffuse, alpha );
					#ifdef USE_COLOR
						#ifdef USE_LINE_COLOR_ALPHA
							diffuseColor *= vLineColor;
						#else
							diffuseColor.rgb *= vLineColor;
						#endif
					#endif

					#include <logdepthbuf_fragment>

					gl_FragColor = diffuseColor;

					#include <tonemapping_fragment>
					#include <${Em>=154?"colorspace_fragment":"encodings_fragment"}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(t){this.uniforms.diffuse.value=t}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(t){t===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(t){this.uniforms.linewidth.value=t}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(t){!!t!="USE_DASH"in this.defines&&(this.needsUpdate=!0),t===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(t){this.uniforms.dashScale.value=t}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(t){this.uniforms.dashSize.value=t}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(t){this.uniforms.dashOffset.value=t}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(t){this.uniforms.gapSize.value=t}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(t){this.uniforms.opacity.value=t}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(t){this.uniforms.resolution.value.copy(t)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(t){!!t!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),t===!0?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}const qc=new tt,od=new I,ad=new I,Vt=new tt,Gt=new tt,Hn=new tt,Zc=new I,jc=new Ye,Wt=new gm,ld=new I,_a=new wt,va=new It,Wn=new tt;let qn,cr;function cd(s,e,t){return Wn.set(0,0,-e,1).applyMatrix4(s.projectionMatrix),Wn.multiplyScalar(1/Wn.w),Wn.x=cr/t.width,Wn.y=cr/t.height,Wn.applyMatrix4(s.projectionMatrixInverse),Wn.multiplyScalar(1/Wn.w),Math.abs(Math.max(Wn.x,Wn.y))}function sb(s,e){const t=s.matrixWorld,n=s.geometry,i=n.attributes.instanceStart,r=n.attributes.instanceEnd,o=Math.min(n.instanceCount,i.count);for(let a=0,l=o;a<l;a++){Wt.start.fromBufferAttribute(i,a),Wt.end.fromBufferAttribute(r,a),Wt.applyMatrix4(t);const c=new I,h=new I;qn.distanceSqToSegment(Wt.start,Wt.end,h,c),h.distanceTo(c)<cr*.5&&e.push({point:h,pointOnLine:c,distance:qn.origin.distanceTo(h),object:s,face:null,faceIndex:a,uv:null,[Tm]:null})}}function ob(s,e,t){const n=e.projectionMatrix,r=s.material.resolution,o=s.matrixWorld,a=s.geometry,l=a.attributes.instanceStart,c=a.attributes.instanceEnd,h=Math.min(a.instanceCount,l.count),u=-e.near;qn.at(1,Hn),Hn.w=1,Hn.applyMatrix4(e.matrixWorldInverse),Hn.applyMatrix4(n),Hn.multiplyScalar(1/Hn.w),Hn.x*=r.x/2,Hn.y*=r.y/2,Hn.z=0,Zc.copy(Hn),jc.multiplyMatrices(e.matrixWorldInverse,o);for(let f=0,d=h;f<d;f++){if(Vt.fromBufferAttribute(l,f),Gt.fromBufferAttribute(c,f),Vt.w=1,Gt.w=1,Vt.applyMatrix4(jc),Gt.applyMatrix4(jc),Vt.z>u&&Gt.z>u)continue;if(Vt.z>u){const y=Vt.z-Gt.z,v=(Vt.z-u)/y;Vt.lerp(Gt,v)}else if(Gt.z>u){const y=Gt.z-Vt.z,v=(Gt.z-u)/y;Gt.lerp(Vt,v)}Vt.applyMatrix4(n),Gt.applyMatrix4(n),Vt.multiplyScalar(1/Vt.w),Gt.multiplyScalar(1/Gt.w),Vt.x*=r.x/2,Vt.y*=r.y/2,Gt.x*=r.x/2,Gt.y*=r.y/2,Wt.start.copy(Vt),Wt.start.z=0,Wt.end.copy(Gt),Wt.end.z=0;const _=Wt.closestPointToPointParameter(Zc,!0);Wt.at(_,ld);const g=Nh.lerp(Vt.z,Gt.z,_),m=g>=-1&&g<=1,x=Zc.distanceTo(ld)<cr*.5;if(m&&x){Wt.start.fromBufferAttribute(l,f),Wt.end.fromBufferAttribute(c,f),Wt.start.applyMatrix4(o),Wt.end.applyMatrix4(o);const y=new I,v=new I;qn.distanceSqToSegment(Wt.start,Wt.end,v,y),t.push({point:v,pointOnLine:y,distance:qn.origin.distanceTo(v),object:s,face:null,faceIndex:f,uv:null,[Tm]:null})}}}class ab extends vt{constructor(e=new Am,t=new Cm({color:Math.random()*16777215})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){const e=this.geometry,t=e.attributes.instanceStart,n=e.attributes.instanceEnd,i=new Float32Array(2*t.count);for(let o=0,a=0,l=t.count;o<l;o++,a+=2)od.fromBufferAttribute(t,o),ad.fromBufferAttribute(n,o),i[a]=a===0?0:i[a-1],i[a+1]=i[a]+od.distanceTo(ad);const r=new ul(i,2,1);return e.setAttribute("instanceDistanceStart",new Sn(r,1,0)),e.setAttribute("instanceDistanceEnd",new Sn(r,1,1)),this}raycast(e,t){const n=this.material.worldUnits,i=e.camera;i===null&&!n&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');const r=e.params.Line2!==void 0&&e.params.Line2.threshold||0;qn=e.ray;const o=this.matrixWorld,a=this.geometry,l=this.material;cr=l.linewidth+r,a.boundingSphere===null&&a.computeBoundingSphere(),va.copy(a.boundingSphere).applyMatrix4(o);let c;if(n)c=cr*.5;else{const u=Math.max(i.near,va.distanceToPoint(qn.origin));c=cd(i,u,l.resolution)}if(va.radius+=c,qn.intersectsSphere(va)===!1)return;a.boundingBox===null&&a.computeBoundingBox(),_a.copy(a.boundingBox).applyMatrix4(o);let h;if(n)h=cr*.5;else{const u=Math.max(i.near,_a.distanceToPoint(qn.origin));h=cd(i,u,l.resolution)}_a.expandByScalar(h),qn.intersectsBox(_a)!==!1&&(n?sb(this,t):ob(this,i,t))}onBeforeRender(e){const t=this.material.uniforms;t&&t.resolution&&(e.getViewport(qc),this.material.uniforms.resolution.value.set(qc.z,qc.w))}}class b1 extends ab{constructor(e=new rb,t=new Cm({color:Math.random()*16777215})){super(e,t),this.isLine2=!0,this.type="Line2"}}function lb(){var s=Object.create(null);function e(i,r){var o=i.id,a=i.name,l=i.dependencies;l===void 0&&(l=[]);var c=i.init;c===void 0&&(c=function(){});var h=i.getTransferables;if(h===void 0&&(h=null),!s[o])try{l=l.map(function(f){return f&&f.isWorkerModule&&(e(f,function(d){if(d instanceof Error)throw d}),f=s[f.id].value),f}),c=n("<"+a+">.init",c),h&&(h=n("<"+a+">.getTransferables",h));var u=null;typeof c=="function"?u=c.apply(void 0,l):console.error("worker module init function failed to rehydrate"),s[o]={id:o,value:u,getTransferables:h},r(u)}catch(f){f&&f.noLog||console.error(f),r(f)}}function t(i,r){var o,a=i.id,l=i.args;(!s[a]||typeof s[a].value!="function")&&r(new Error("Worker module "+a+": not found or its 'init' did not return a function"));try{var c=(o=s[a]).value.apply(o,l);c&&typeof c.then=="function"?c.then(h,function(u){return r(u instanceof Error?u:new Error(""+u))}):h(c)}catch(u){r(u)}function h(u){try{var f=s[a].getTransferables&&s[a].getTransferables(u);(!f||!Array.isArray(f)||!f.length)&&(f=void 0),r(u,f)}catch(d){console.error(d),r(d)}}}function n(i,r){var o=void 0;self.troikaDefine=function(l){return o=l};var a=URL.createObjectURL(new Blob(["/** "+i.replace(/\*/g,"")+` **/

troikaDefine(
`+r+`
)`],{type:"application/javascript"}));try{importScripts(a)}catch(l){console.error(l)}return URL.revokeObjectURL(a),delete self.troikaDefine,o}self.addEventListener("message",function(i){var r=i.data,o=r.messageId,a=r.action,l=r.data;try{a==="registerModule"&&e(l,function(c){c instanceof Error?postMessage({messageId:o,success:!1,error:c.message}):postMessage({messageId:o,success:!0,result:{isCallable:typeof c=="function"}})}),a==="callModule"&&t(l,function(c,h){c instanceof Error?postMessage({messageId:o,success:!1,error:c.message}):postMessage({messageId:o,success:!0,result:c},h||void 0)})}catch(c){postMessage({messageId:o,success:!1,error:c.stack})}})}function cb(s){var e=function(){for(var t=[],n=arguments.length;n--;)t[n]=arguments[n];return e._getInitResult().then(function(i){if(typeof i=="function")return i.apply(void 0,t);throw new Error("Worker module function was called but `init` did not return a callable function")})};return e._getInitResult=function(){var t=s.dependencies,n=s.init;t=Array.isArray(t)?t.map(function(r){return r&&(r=r.onMainThread||r,r._getInitResult&&(r=r._getInitResult())),r}):[];var i=Promise.all(t).then(function(r){return n.apply(null,r)});return e._getInitResult=function(){return i},i},e}var Rm=function(){var s=!1;if(typeof window<"u"&&typeof window.document<"u")try{var e=new Worker(URL.createObjectURL(new Blob([""],{type:"application/javascript"})));e.terminate(),s=!0}catch(t){console.log("Troika createWorkerModule: web workers not allowed; falling back to main thread execution. Cause: ["+t.message+"]")}return Rm=function(){return s},s},hb=0,ub=0,Kc=!1,zs=Object.create(null),Vs=Object.create(null),_h=Object.create(null);function ss(s){if((!s||typeof s.init!="function")&&!Kc)throw new Error("requires `options.init` function");var e=s.dependencies,t=s.init,n=s.getTransferables,i=s.workerId,r=cb(s);i==null&&(i="#default");var o="workerModule"+ ++hb,a=s.name||o,l=null;e=e&&e.map(function(h){return typeof h=="function"&&!h.workerModuleData&&(Kc=!0,h=ss({workerId:i,name:"<"+a+"> function dependency: "+h.name,init:`function(){return (
`+wa(h)+`
)}`}),Kc=!1),h&&h.workerModuleData&&(h=h.workerModuleData),h});function c(){for(var h=[],u=arguments.length;u--;)h[u]=arguments[u];if(!Rm())return r.apply(void 0,h);if(!l){l=hd(i,"registerModule",c.workerModuleData);var f=function(){l=null,Vs[i].delete(f)};(Vs[i]||(Vs[i]=new Set)).add(f)}return l.then(function(d){var p=d.isCallable;if(p)return hd(i,"callModule",{id:o,args:h});throw new Error("Worker module function was called but `init` did not return a callable function")})}return c.workerModuleData={isWorkerModule:!0,id:o,name:a,dependencies:e,init:wa(t),getTransferables:n&&wa(n)},c.onMainThread=r,c}function fb(s){Vs[s]&&Vs[s].forEach(function(e){e()}),zs[s]&&(zs[s].terminate(),delete zs[s])}function wa(s){var e=s.toString();return!/^function/.test(e)&&/^\w+\s*\(/.test(e)&&(e="function "+e),e}function db(s){var e=zs[s];if(!e){var t=wa(lb);e=zs[s]=new Worker(URL.createObjectURL(new Blob(["/** Worker Module Bootstrap: "+s.replace(/\*/g,"")+` **/

;(`+t+")()"],{type:"application/javascript"}))),e.onmessage=function(n){var i=n.data,r=i.messageId,o=_h[r];if(!o)throw new Error("WorkerModule response with empty or unknown messageId");delete _h[r],o(i)}}return e}function hd(s,e,t){return new Promise(function(n,i){var r=++ub;_h[r]=function(o){o.success?n(o.result):i(new Error("Error in worker "+e+" call: "+o.error))},db(s).postMessage({messageId:r,action:e,data:t})})}function Pm(){var s=(function(e){function t(te,K,O,J,ue,k,X,ce){var j=1-X;ce.x=j*j*te+2*j*X*O+X*X*ue,ce.y=j*j*K+2*j*X*J+X*X*k}function n(te,K,O,J,ue,k,X,ce,j,G){var pe=1-j;G.x=pe*pe*pe*te+3*pe*pe*j*O+3*pe*j*j*ue+j*j*j*X,G.y=pe*pe*pe*K+3*pe*pe*j*J+3*pe*j*j*k+j*j*j*ce}function i(te,K){for(var O=/([MLQCZ])([^MLQCZ]*)/g,J,ue,k,X,ce;J=O.exec(te);){var j=J[2].replace(/^\s*|\s*$/g,"").split(/[,\s]+/).map(function(G){return parseFloat(G)});switch(J[1]){case"M":X=ue=j[0],ce=k=j[1];break;case"L":(j[0]!==X||j[1]!==ce)&&K("L",X,ce,X=j[0],ce=j[1]);break;case"Q":{K("Q",X,ce,X=j[2],ce=j[3],j[0],j[1]);break}case"C":{K("C",X,ce,X=j[4],ce=j[5],j[0],j[1],j[2],j[3]);break}case"Z":(X!==ue||ce!==k)&&K("L",X,ce,ue,k);break}}}function r(te,K,O){O===void 0&&(O=16);var J={x:0,y:0};i(te,function(ue,k,X,ce,j,G,pe,se,ae){switch(ue){case"L":K(k,X,ce,j);break;case"Q":{for(var B=k,ie=X,R=1;R<O;R++)t(k,X,G,pe,ce,j,R/(O-1),J),K(B,ie,J.x,J.y),B=J.x,ie=J.y;break}case"C":{for(var oe=k,$=X,me=1;me<O;me++)n(k,X,G,pe,se,ae,ce,j,me/(O-1),J),K(oe,$,J.x,J.y),oe=J.x,$=J.y;break}}})}var o="precision highp float;attribute vec2 aUV;varying vec2 vUV;void main(){vUV=aUV;gl_Position=vec4(mix(vec2(-1.0),vec2(1.0),aUV),0.0,1.0);}",a="precision highp float;uniform sampler2D tex;varying vec2 vUV;void main(){gl_FragColor=texture2D(tex,vUV);}",l=new WeakMap,c={premultipliedAlpha:!1,preserveDrawingBuffer:!0,antialias:!1,depth:!1};function h(te,K){var O=te.getContext?te.getContext("webgl",c):te,J=l.get(O);if(!J){let pe=function(oe){var $=k[oe];if(!$&&($=k[oe]=O.getExtension(oe),!$))throw new Error(oe+" not supported");return $},se=function(oe,$){var me=O.createShader($);return O.shaderSource(me,oe),O.compileShader(me),me},ae=function(oe,$,me,ee){if(!X[oe]){var de={},fe={},E=O.createProgram();O.attachShader(E,se($,O.VERTEX_SHADER)),O.attachShader(E,se(me,O.FRAGMENT_SHADER)),O.linkProgram(E),X[oe]={program:E,transaction:function(D){O.useProgram(E),D({setUniform:function(q,re){for(var Se=[],ye=arguments.length-2;ye-- >0;)Se[ye]=arguments[ye+2];var be=fe[re]||(fe[re]=O.getUniformLocation(E,re));O["uniform"+q].apply(O,[be].concat(Se))},setAttribute:function(q,re,Se,ye,be){var Le=de[q];Le||(Le=de[q]={buf:O.createBuffer(),loc:O.getAttribLocation(E,q),data:null}),O.bindBuffer(O.ARRAY_BUFFER,Le.buf),O.vertexAttribPointer(Le.loc,re,O.FLOAT,!1,0,0),O.enableVertexAttribArray(Le.loc),ue?O.vertexAttribDivisor(Le.loc,ye):pe("ANGLE_instanced_arrays").vertexAttribDivisorANGLE(Le.loc,ye),be!==Le.data&&(O.bufferData(O.ARRAY_BUFFER,be,Se),Le.data=be)}})}}}X[oe].transaction(ee)},B=function(oe,$){j++;try{O.activeTexture(O.TEXTURE0+j);var me=ce[oe];me||(me=ce[oe]=O.createTexture(),O.bindTexture(O.TEXTURE_2D,me),O.texParameteri(O.TEXTURE_2D,O.TEXTURE_MIN_FILTER,O.NEAREST),O.texParameteri(O.TEXTURE_2D,O.TEXTURE_MAG_FILTER,O.NEAREST)),O.bindTexture(O.TEXTURE_2D,me),$(me,j)}finally{j--}},ie=function(oe,$,me){var ee=O.createFramebuffer();G.push(ee),O.bindFramebuffer(O.FRAMEBUFFER,ee),O.activeTexture(O.TEXTURE0+$),O.bindTexture(O.TEXTURE_2D,oe),O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,oe,0);try{me(ee)}finally{O.deleteFramebuffer(ee),O.bindFramebuffer(O.FRAMEBUFFER,G[--G.length-1]||null)}},R=function(){k={},X={},ce={},j=-1,G.length=0};var ue=typeof WebGL2RenderingContext<"u"&&O instanceof WebGL2RenderingContext,k={},X={},ce={},j=-1,G=[];O.canvas.addEventListener("webglcontextlost",function(oe){R(),oe.preventDefault()},!1),l.set(O,J={gl:O,isWebGL2:ue,getExtension:pe,withProgram:ae,withTexture:B,withTextureFramebuffer:ie,handleContextLoss:R})}K(J)}function u(te,K,O,J,ue,k,X,ce){X===void 0&&(X=15),ce===void 0&&(ce=null),h(te,function(j){var G=j.gl,pe=j.withProgram,se=j.withTexture;se("copy",function(ae,B){G.texImage2D(G.TEXTURE_2D,0,G.RGBA,ue,k,0,G.RGBA,G.UNSIGNED_BYTE,K),pe("copy",o,a,function(ie){var R=ie.setUniform,oe=ie.setAttribute;oe("aUV",2,G.STATIC_DRAW,0,new Float32Array([0,0,2,0,0,2])),R("1i","image",B),G.bindFramebuffer(G.FRAMEBUFFER,ce||null),G.disable(G.BLEND),G.colorMask(X&8,X&4,X&2,X&1),G.viewport(O,J,ue,k),G.scissor(O,J,ue,k),G.drawArrays(G.TRIANGLES,0,3)})})})}function f(te,K,O){var J=te.width,ue=te.height;h(te,function(k){var X=k.gl,ce=new Uint8Array(J*ue*4);X.readPixels(0,0,J,ue,X.RGBA,X.UNSIGNED_BYTE,ce),te.width=K,te.height=O,u(X,ce,0,0,J,ue)})}var d=Object.freeze({__proto__:null,withWebGLContext:h,renderImageData:u,resizeWebGLCanvasWithoutClearing:f});function p(te,K,O,J,ue,k){k===void 0&&(k=1);var X=new Uint8Array(te*K),ce=J[2]-J[0],j=J[3]-J[1],G=[];r(O,function(oe,$,me,ee){G.push({x1:oe,y1:$,x2:me,y2:ee,minX:Math.min(oe,me),minY:Math.min($,ee),maxX:Math.max(oe,me),maxY:Math.max($,ee)})}),G.sort(function(oe,$){return oe.maxX-$.maxX});for(var pe=0;pe<te;pe++)for(var se=0;se<K;se++){var ae=ie(J[0]+ce*(pe+.5)/te,J[1]+j*(se+.5)/K),B=Math.pow(1-Math.abs(ae)/ue,k)/2;ae<0&&(B=1-B),B=Math.max(0,Math.min(255,Math.round(B*255))),X[se*te+pe]=B}return X;function ie(oe,$){for(var me=1/0,ee=1/0,de=G.length;de--;){var fe=G[de];if(fe.maxX+ee<=oe)break;if(oe+ee>fe.minX&&$-ee<fe.maxY&&$+ee>fe.minY){var E=m(oe,$,fe.x1,fe.y1,fe.x2,fe.y2);E<me&&(me=E,ee=Math.sqrt(me))}}return R(oe,$)&&(ee=-ee),ee}function R(oe,$){for(var me=0,ee=G.length;ee--;){var de=G[ee];if(de.maxX<=oe)break;var fe=de.y1>$!=de.y2>$&&oe<(de.x2-de.x1)*($-de.y1)/(de.y2-de.y1)+de.x1;fe&&(me+=de.y1<de.y2?1:-1)}return me!==0}}function _(te,K,O,J,ue,k,X,ce,j,G){k===void 0&&(k=1),ce===void 0&&(ce=0),j===void 0&&(j=0),G===void 0&&(G=0),g(te,K,O,J,ue,k,X,null,ce,j,G)}function g(te,K,O,J,ue,k,X,ce,j,G,pe){k===void 0&&(k=1),j===void 0&&(j=0),G===void 0&&(G=0),pe===void 0&&(pe=0);for(var se=p(te,K,O,J,ue,k),ae=new Uint8Array(se.length*4),B=0;B<se.length;B++)ae[B*4+pe]=se[B];u(X,ae,j,G,te,K,1<<3-pe,ce)}function m(te,K,O,J,ue,k){var X=ue-O,ce=k-J,j=X*X+ce*ce,G=j?Math.max(0,Math.min(1,((te-O)*X+(K-J)*ce)/j)):0,pe=te-(O+G*X),se=K-(J+G*ce);return pe*pe+se*se}var x=Object.freeze({__proto__:null,generate:p,generateIntoCanvas:_,generateIntoFramebuffer:g}),y="precision highp float;uniform vec4 uGlyphBounds;attribute vec2 aUV;attribute vec4 aLineSegment;varying vec4 vLineSegment;varying vec2 vGlyphXY;void main(){vLineSegment=aLineSegment;vGlyphXY=mix(uGlyphBounds.xy,uGlyphBounds.zw,aUV);gl_Position=vec4(mix(vec2(-1.0),vec2(1.0),aUV),0.0,1.0);}",v="precision highp float;uniform vec4 uGlyphBounds;uniform float uMaxDistance;uniform float uExponent;varying vec4 vLineSegment;varying vec2 vGlyphXY;float absDistToSegment(vec2 point,vec2 lineA,vec2 lineB){vec2 lineDir=lineB-lineA;float lenSq=dot(lineDir,lineDir);float t=lenSq==0.0 ? 0.0 : clamp(dot(point-lineA,lineDir)/lenSq,0.0,1.0);vec2 linePt=lineA+t*lineDir;return distance(point,linePt);}void main(){vec4 seg=vLineSegment;vec2 p=vGlyphXY;float dist=absDistToSegment(p,seg.xy,seg.zw);float val=pow(1.0-clamp(dist/uMaxDistance,0.0,1.0),uExponent)*0.5;bool crossing=(seg.y>p.y!=seg.w>p.y)&&(p.x<(seg.z-seg.x)*(p.y-seg.y)/(seg.w-seg.y)+seg.x);bool crossingUp=crossing&&vLineSegment.y<vLineSegment.w;gl_FragColor=vec4(crossingUp ? 1.0/255.0 : 0.0,crossing&&!crossingUp ? 1.0/255.0 : 0.0,0.0,val);}",A="precision highp float;uniform sampler2D tex;varying vec2 vUV;void main(){vec4 color=texture2D(tex,vUV);bool inside=color.r!=color.g;float val=inside ? 1.0-color.a : color.a;gl_FragColor=vec4(val);}",w=new Float32Array([0,0,2,0,0,2]),T=null,C=!1,b={},M=new WeakMap;function U(te){if(!C&&!Q(te))throw new Error("WebGL generation not supported")}function L(te,K,O,J,ue,k,X){if(k===void 0&&(k=1),X===void 0&&(X=null),!X&&(X=T,!X)){var ce=typeof OffscreenCanvas=="function"?new OffscreenCanvas(1,1):typeof document<"u"?document.createElement("canvas"):null;if(!ce)throw new Error("OffscreenCanvas or DOM canvas not supported");X=T=ce.getContext("webgl",{depth:!1})}U(X);var j=new Uint8Array(te*K*4);h(X,function(ae){var B=ae.gl,ie=ae.withTexture,R=ae.withTextureFramebuffer;ie("readable",function(oe,$){B.texImage2D(B.TEXTURE_2D,0,B.RGBA,te,K,0,B.RGBA,B.UNSIGNED_BYTE,null),R(oe,$,function(me){N(te,K,O,J,ue,k,B,me,0,0,0),B.readPixels(0,0,te,K,B.RGBA,B.UNSIGNED_BYTE,j)})})});for(var G=new Uint8Array(te*K),pe=0,se=0;pe<j.length;pe+=4)G[se++]=j[pe];return G}function F(te,K,O,J,ue,k,X,ce,j,G){k===void 0&&(k=1),ce===void 0&&(ce=0),j===void 0&&(j=0),G===void 0&&(G=0),N(te,K,O,J,ue,k,X,null,ce,j,G)}function N(te,K,O,J,ue,k,X,ce,j,G,pe){k===void 0&&(k=1),j===void 0&&(j=0),G===void 0&&(G=0),pe===void 0&&(pe=0),U(X);var se=[];r(O,function(ae,B,ie,R){se.push(ae,B,ie,R)}),se=new Float32Array(se),h(X,function(ae){var B=ae.gl,ie=ae.isWebGL2,R=ae.getExtension,oe=ae.withProgram,$=ae.withTexture,me=ae.withTextureFramebuffer,ee=ae.handleContextLoss;if($("rawDistances",function(de,fe){(te!==de._lastWidth||K!==de._lastHeight)&&B.texImage2D(B.TEXTURE_2D,0,B.RGBA,de._lastWidth=te,de._lastHeight=K,0,B.RGBA,B.UNSIGNED_BYTE,null),oe("main",y,v,function(E){var S=E.setAttribute,D=E.setUniform,Y=!ie&&R("ANGLE_instanced_arrays"),q=!ie&&R("EXT_blend_minmax");S("aUV",2,B.STATIC_DRAW,0,w),S("aLineSegment",4,B.DYNAMIC_DRAW,1,se),D.apply(void 0,["4f","uGlyphBounds"].concat(J)),D("1f","uMaxDistance",ue),D("1f","uExponent",k),me(de,fe,function(re){B.enable(B.BLEND),B.colorMask(!0,!0,!0,!0),B.viewport(0,0,te,K),B.scissor(0,0,te,K),B.blendFunc(B.ONE,B.ONE),B.blendEquationSeparate(B.FUNC_ADD,ie?B.MAX:q.MAX_EXT),B.clear(B.COLOR_BUFFER_BIT),ie?B.drawArraysInstanced(B.TRIANGLES,0,3,se.length/4):Y.drawArraysInstancedANGLE(B.TRIANGLES,0,3,se.length/4)})}),oe("post",o,A,function(E){E.setAttribute("aUV",2,B.STATIC_DRAW,0,w),E.setUniform("1i","tex",fe),B.bindFramebuffer(B.FRAMEBUFFER,ce),B.disable(B.BLEND),B.colorMask(pe===0,pe===1,pe===2,pe===3),B.viewport(j,G,te,K),B.scissor(j,G,te,K),B.drawArrays(B.TRIANGLES,0,3)})}),B.isContextLost())throw ee(),new Error("webgl context lost")})}function Q(te){var K=!te||te===T?b:te.canvas||te,O=M.get(K);if(O===void 0){C=!0;var J=null;try{var ue=[97,106,97,61,99,137,118,80,80,118,137,99,61,97,106,97],k=L(4,4,"M8,8L16,8L24,24L16,24Z",[0,0,32,32],24,1,te);O=k&&ue.length===k.length&&k.every(function(X,ce){return X===ue[ce]}),O||(J="bad trial run results",console.info(ue,k))}catch(X){O=!1,J=X.message}J&&console.warn("WebGL SDF generation not supported:",J),C=!1,M.set(K,O)}return O}var V=Object.freeze({__proto__:null,generate:L,generateIntoCanvas:F,generateIntoFramebuffer:N,isSupported:Q});function le(te,K,O,J,ue,k){ue===void 0&&(ue=Math.max(J[2]-J[0],J[3]-J[1])/2),k===void 0&&(k=1);try{return L.apply(V,arguments)}catch(X){return console.info("WebGL SDF generation failed, falling back to JS",X),p.apply(x,arguments)}}function Z(te,K,O,J,ue,k,X,ce,j,G){ue===void 0&&(ue=Math.max(J[2]-J[0],J[3]-J[1])/2),k===void 0&&(k=1),ce===void 0&&(ce=0),j===void 0&&(j=0),G===void 0&&(G=0);try{return F.apply(V,arguments)}catch(pe){return console.info("WebGL SDF generation failed, falling back to JS",pe),_.apply(x,arguments)}}return e.forEachPathCommand=i,e.generate=le,e.generateIntoCanvas=Z,e.javascript=x,e.pathToLineSegments=r,e.webgl=V,e.webglUtils=d,Object.defineProperty(e,"__esModule",{value:!0}),e})({});return s}function pb(){var s=(function(e){var t={R:"13k,1a,2,3,3,2+1j,ch+16,a+1,5+2,2+n,5,a,4,6+16,4+3,h+1b,4mo,179q,2+9,2+11,2i9+7y,2+68,4,3+4,5+13,4+3,2+4k,3+29,8+cf,1t+7z,w+17,3+3m,1t+3z,16o1+5r,8+30,8+mc,29+1r,29+4v,75+73",EN:"1c+9,3d+1,6,187+9,513,4+5,7+9,sf+j,175h+9,qw+q,161f+1d,4xt+a,25i+9",ES:"17,2,6dp+1,f+1,av,16vr,mx+1,4o,2",ET:"z+2,3h+3,b+1,ym,3e+1,2o,p4+1,8,6u,7c,g6,1wc,1n9+4,30+1b,2n,6d,qhx+1,h0m,a+1,49+2,63+1,4+1,6bb+3,12jj",AN:"16o+5,2j+9,2+1,35,ed,1ff2+9,87+u",CS:"18,2+1,b,2u,12k,55v,l,17v0,2,3,53,2+1,b",B:"a,3,f+2,2v,690",S:"9,2,k",WS:"c,k,4f4,1vk+a,u,1j,335",ON:"x+1,4+4,h+5,r+5,r+3,z,5+3,2+1,2+1,5,2+2,3+4,o,w,ci+1,8+d,3+d,6+8,2+g,39+1,9,6+1,2,33,b8,3+1,3c+1,7+1,5r,b,7h+3,sa+5,2,3i+6,jg+3,ur+9,2v,ij+1,9g+9,7+a,8m,4+1,49+x,14u,2+2,c+2,e+2,e+2,e+1,i+n,e+e,2+p,u+2,e+2,36+1,2+3,2+1,b,2+2,6+5,2,2,2,h+1,5+4,6+3,3+f,16+2,5+3l,3+81,1y+p,2+40,q+a,m+13,2r+ch,2+9e,75+hf,3+v,2+2w,6e+5,f+6,75+2a,1a+p,2+2g,d+5x,r+b,6+3,4+o,g,6+1,6+2,2k+1,4,2j,5h+z,1m+1,1e+f,t+2,1f+e,d+3,4o+3,2s+1,w,535+1r,h3l+1i,93+2,2s,b+1,3l+x,2v,4g+3,21+3,kz+1,g5v+1,5a,j+9,n+v,2,3,2+8,2+1,3+2,2,3,46+1,4+4,h+5,r+5,r+a,3h+2,4+6,b+4,78,1r+24,4+c,4,1hb,ey+6,103+j,16j+c,1ux+7,5+g,fsh,jdq+1t,4,57+2e,p1,1m,1m,1m,1m,4kt+1,7j+17,5+2r,d+e,3+e,2+e,2+10,m+4,w,1n+5,1q,4z+5,4b+rb,9+c,4+c,4+37,d+2g,8+b,l+b,5+1j,9+9,7+13,9+t,3+1,27+3c,2+29,2+3q,d+d,3+4,4+2,6+6,a+o,8+6,a+2,e+6,16+42,2+1i",BN:"0+8,6+d,2s+5,2+p,e,4m9,1kt+2,2b+5,5+5,17q9+v,7k,6p+8,6+1,119d+3,440+7,96s+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+75,6p+2rz,1ben+1,1ekf+1,1ekf+1",NSM:"lc+33,7o+6,7c+18,2,2+1,2+1,2,21+a,1d+k,h,2u+6,3+5,3+1,2+3,10,v+q,2k+a,1n+8,a,p+3,2+8,2+2,2+4,18+2,3c+e,2+v,1k,2,5+7,5,4+6,b+1,u,1n,5+3,9,l+1,r,3+1,1m,5+1,5+1,3+2,4,v+1,4,c+1,1m,5+4,2+1,5,l+1,n+5,2,1n,3,2+3,9,8+1,c+1,v,1q,d,1f,4,1m+2,6+2,2+3,8+1,c+1,u,1n,g+1,l+1,t+1,1m+1,5+3,9,l+1,u,21,8+2,2,2j,3+6,d+7,2r,3+8,c+5,23+1,s,2,2,1k+d,2+4,2+1,6+a,2+z,a,2v+3,2+5,2+1,3+1,q+1,5+2,h+3,e,3+1,7,g,jk+2,qb+2,u+2,u+1,v+1,1t+1,2+6,9,3+a,a,1a+2,3c+1,z,3b+2,5+1,a,7+2,64+1,3,1n,2+6,2,2,3+7,7+9,3,1d+g,1s+3,1d,2+4,2,6,15+8,d+1,x+3,3+1,2+2,1l,2+1,4,2+2,1n+7,3+1,49+2,2+c,2+6,5,7,4+1,5j+1l,2+4,k1+w,2db+2,3y,2p+v,ff+3,30+1,n9x+3,2+9,x+1,29+1,7l,4,5,q+1,6,48+1,r+h,e,13+7,q+a,1b+2,1d,3+3,3+1,14,1w+5,3+1,3+1,d,9,1c,1g,2+2,3+1,6+1,2,17+1,9,6n,3,5,fn5,ki+f,h+f,r2,6b,46+4,1af+2,2+1,6+3,15+2,5,4m+1,fy+3,as+1,4a+a,4x,1j+e,1l+2,1e+3,3+1,1y+2,11+4,2+7,1r,d+1,1h+8,b+3,3,2o+2,3,2+1,7,4h,4+7,m+1,1m+1,4,12+6,4+4,5g+7,3+2,2,o,2d+5,2,5+1,2+1,6n+3,7+1,2+1,s+1,2e+7,3,2+1,2z,2,3+5,2,2u+2,3+3,2+4,78+8,2+1,75+1,2,5,41+3,3+1,5,x+5,3+1,15+5,3+3,9,a+5,3+2,1b+c,2+1,bb+6,2+5,2d+l,3+6,2+1,2+1,3f+5,4,2+1,2+6,2,21+1,4,2,9o+1,f0c+4,1o+6,t5,1s+3,2a,f5l+1,43t+2,i+7,3+6,v+3,45+2,1j0+1i,5+1d,9,f,n+4,2+e,11t+6,2+g,3+6,2+1,2+4,7a+6,c6+3,15t+6,32+6,gzhy+6n",AL:"16w,3,2,e+1b,z+2,2+2s,g+1,8+1,b+m,2+t,s+2i,c+e,4h+f,1d+1e,1bwe+dp,3+3z,x+c,2+1,35+3y,2rm+z,5+7,b+5,dt+l,c+u,17nl+27,1t+27,4x+6n,3+d",LRO:"6ct",RLO:"6cu",LRE:"6cq",RLE:"6cr",PDF:"6cs",LRI:"6ee",RLI:"6ef",FSI:"6eg",PDI:"6eh"},n={},i={};n.L=1,i[1]="L",Object.keys(t).forEach(function(ee,de){n[ee]=1<<de+1,i[n[ee]]=ee}),Object.freeze(n);var r=n.LRI|n.RLI|n.FSI,o=n.L|n.R|n.AL,a=n.B|n.S|n.WS|n.ON|n.FSI|n.LRI|n.RLI|n.PDI,l=n.BN|n.RLE|n.LRE|n.RLO|n.LRO|n.PDF,c=n.S|n.WS|n.B|r|n.PDI|l,h=null;function u(){if(!h){h=new Map;var ee=function(fe){if(t.hasOwnProperty(fe)){var E=0;t[fe].split(",").forEach(function(S){var D=S.split("+"),Y=D[0],q=D[1];Y=parseInt(Y,36),q=q?parseInt(q,36):0,h.set(E+=Y,n[fe]);for(var re=0;re<q;re++)h.set(++E,n[fe])})}};for(var de in t)ee(de)}}function f(ee){return u(),h.get(ee.codePointAt(0))||n.L}function d(ee){return i[f(ee)]}var p={pairs:"14>1,1e>2,u>2,2wt>1,1>1,1ge>1,1wp>1,1j>1,f>1,hm>1,1>1,u>1,u6>1,1>1,+5,28>1,w>1,1>1,+3,b8>1,1>1,+3,1>3,-1>-1,3>1,1>1,+2,1s>1,1>1,x>1,th>1,1>1,+2,db>1,1>1,+3,3>1,1>1,+2,14qm>1,1>1,+1,4q>1,1e>2,u>2,2>1,+1",canonical:"6f1>-6dx,6dy>-6dx,6ec>-6ed,6ee>-6ed,6ww>2jj,-2ji>2jj,14r4>-1e7l,1e7m>-1e7l,1e7m>-1e5c,1e5d>-1e5b,1e5c>-14qx,14qy>-14qx,14vn>-1ecg,1ech>-1ecg,1edu>-1ecg,1eci>-1ecg,1eda>-1ecg,1eci>-1ecg,1eci>-168q,168r>-168q,168s>-14ye,14yf>-14ye"};function _(ee,de){var fe=36,E=0,S=new Map,D=de&&new Map,Y;return ee.split(",").forEach(function q(re){if(re.indexOf("+")!==-1)for(var Se=+re;Se--;)q(Y);else{Y=re;var ye=re.split(">"),be=ye[0],Le=ye[1];be=String.fromCodePoint(E+=parseInt(be,fe)),Le=String.fromCodePoint(E+=parseInt(Le,fe)),S.set(be,Le),de&&D.set(Le,be)}}),{map:S,reverseMap:D}}var g,m,x;function y(){if(!g){var ee=_(p.pairs,!0),de=ee.map,fe=ee.reverseMap;g=de,m=fe,x=_(p.canonical,!1).map}}function v(ee){return y(),g.get(ee)||null}function A(ee){return y(),m.get(ee)||null}function w(ee){return y(),x.get(ee)||null}var T=n.L,C=n.R,b=n.EN,M=n.ES,U=n.ET,L=n.AN,F=n.CS,N=n.B,Q=n.S,V=n.ON,le=n.BN,Z=n.NSM,te=n.AL,K=n.LRO,O=n.RLO,J=n.LRE,ue=n.RLE,k=n.PDF,X=n.LRI,ce=n.RLI,j=n.FSI,G=n.PDI;function pe(ee,de){for(var fe=125,E=new Uint32Array(ee.length),S=0;S<ee.length;S++)E[S]=f(ee[S]);var D=new Map;function Y(ln,Un){var cn=E[ln];E[ln]=Un,D.set(cn,D.get(cn)-1),cn&a&&D.set(a,D.get(a)-1),D.set(Un,(D.get(Un)||0)+1),Un&a&&D.set(a,(D.get(a)||0)+1)}for(var q=new Uint8Array(ee.length),re=new Map,Se=[],ye=null,be=0;be<ee.length;be++)ye||Se.push(ye={start:be,end:ee.length-1,level:de==="rtl"?1:de==="ltr"?0:bu(be,!1)}),E[be]&N&&(ye.end=be,ye=null);for(var Le=ue|J|O|K|r|G|k|N,we=function(ln){return ln+(ln&1?1:2)},Re=function(ln){return ln+(ln&1?2:1)},Ie=0;Ie<Se.length;Ie++){ye=Se[Ie];var De=[{_level:ye.level,_override:0,_isolate:0}],Te=void 0,W=0,ve=0,Ue=0;D.clear();for(var z=ye.start;z<=ye.end;z++){var xe=E[z];if(Te=De[De.length-1],D.set(xe,(D.get(xe)||0)+1),xe&a&&D.set(a,(D.get(a)||0)+1),xe&Le)if(xe&(ue|J)){q[z]=Te._level;var he=(xe===ue?Re:we)(Te._level);he<=fe&&!W&&!ve?De.push({_level:he,_override:0,_isolate:0}):W||ve++}else if(xe&(O|K)){q[z]=Te._level;var Ee=(xe===O?Re:we)(Te._level);Ee<=fe&&!W&&!ve?De.push({_level:Ee,_override:xe&O?C:T,_isolate:0}):W||ve++}else if(xe&r){xe&j&&(xe=bu(z+1,!0)===1?ce:X),q[z]=Te._level,Te._override&&Y(z,Te._override);var Ce=(xe===ce?Re:we)(Te._level);Ce<=fe&&W===0&&ve===0?(Ue++,De.push({_level:Ce,_override:0,_isolate:1,_isolInitIndex:z})):W++}else if(xe&G){if(W>0)W--;else if(Ue>0){for(ve=0;!De[De.length-1]._isolate;)De.pop();var Ae=De[De.length-1]._isolInitIndex;Ae!=null&&(re.set(Ae,z),re.set(z,Ae)),De.pop(),Ue--}Te=De[De.length-1],q[z]=Te._level,Te._override&&Y(z,Te._override)}else xe&k?(W===0&&(ve>0?ve--:!Te._isolate&&De.length>1&&(De.pop(),Te=De[De.length-1])),q[z]=Te._level):xe&N&&(q[z]=ye.level);else q[z]=Te._level,Te._override&&xe!==le&&Y(z,Te._override)}for(var Be=[],We=null,Ve=ye.start;Ve<=ye.end;Ve++){var He=E[Ve];if(!(He&l)){var lt=q[Ve],ft=He&r,St=He===G;We&&lt===We._level?(We._end=Ve,We._endsWithIsolInit=ft):Be.push(We={_start:Ve,_end:Ve,_level:lt,_startsWithPDI:St,_endsWithIsolInit:ft})}}for(var sn=[],Yt=0;Yt<Be.length;Yt++){var gn=Be[Yt];if(!gn._startsWithPDI||gn._startsWithPDI&&!re.has(gn._start)){for(var In=[We=gn],Vn=void 0;We&&We._endsWithIsolInit&&(Vn=re.get(We._end))!=null;)for(var on=Yt+1;on<Be.length;on++)if(Be[on]._start===Vn){In.push(We=Be[on]);break}for(var Dt=[],En=0;En<In.length;En++)for(var os=In[En],xr=os._start;xr<=os._end;xr++)Dt.push(xr);for(var ql=q[Dt[0]],yo=ye.level,Mr=Dt[0]-1;Mr>=0;Mr--)if(!(E[Mr]&l)){yo=q[Mr];break}var as=Dt[Dt.length-1],Zl=q[as],P=ye.level;if(!(E[as]&r)){for(var ne=as+1;ne<=ye.end;ne++)if(!(E[ne]&l)){P=q[ne];break}}sn.push({_seqIndices:Dt,_sosType:Math.max(yo,ql)%2?C:T,_eosType:Math.max(P,Zl)%2?C:T})}}for(var ge=0;ge<sn.length;ge++){var _e=sn[ge],H=_e._seqIndices,Pe=_e._sosType,Oe=_e._eosType,ke=q[H[0]]&1?C:T;if(D.get(Z))for(var ze=0;ze<H.length;ze++){var je=H[ze];if(E[je]&Z){for(var Ke=Pe,Xe=ze-1;Xe>=0;Xe--)if(!(E[H[Xe]]&l)){Ke=E[H[Xe]];break}Y(je,Ke&(r|G)?V:Ke)}}if(D.get(b))for(var it=0;it<H.length;it++){var ct=H[it];if(E[ct]&b)for(var gt=it-1;gt>=-1;gt--){var _t=gt===-1?Pe:E[H[gt]];if(_t&o){_t===te&&Y(ct,L);break}}}if(D.get(te))for(var rt=0;rt<H.length;rt++){var qe=H[rt];E[qe]&te&&Y(qe,C)}if(D.get(M)||D.get(F))for(var yt=1;yt<H.length-1;yt++){var ot=H[yt];if(E[ot]&(M|F)){for(var Ft=0,Gn=0,Bt=yt-1;Bt>=0&&(Ft=E[H[Bt]],!!(Ft&l));Bt--);for(var ti=yt+1;ti<H.length&&(Gn=E[H[ti]],!!(Gn&l));ti++);Ft===Gn&&(E[ot]===M?Ft===b:Ft&(b|L))&&Y(ot,Ft)}}if(D.get(b))for(var st=0;st<H.length;st++){var an=H[st];if(E[an]&b){for(var kt=st-1;kt>=0&&E[H[kt]]&(U|l);kt--)Y(H[kt],b);for(st++;st<H.length&&E[H[st]]&(U|l|b);st++)E[H[st]]!==b&&Y(H[st],b)}}if(D.get(U)||D.get(M)||D.get(F))for(var Et=0;Et<H.length;Et++){var zt=H[Et];if(E[zt]&(U|M|F)){Y(zt,V);for(var xi=Et-1;xi>=0&&E[H[xi]]&l;xi--)Y(H[xi],V);for(var Tn=Et+1;Tn<H.length&&E[H[Tn]]&l;Tn++)Y(H[Tn],V)}}if(D.get(b))for(var jl=0,uu=Pe;jl<H.length;jl++){var fu=H[jl],Kl=E[fu];Kl&b?uu===T&&Y(fu,T):Kl&o&&(uu=Kl)}if(D.get(a)){var ls=C|b|L,du=ls|T,xo=[];{for(var Sr=[],br=0;br<H.length;br++)if(E[H[br]]&a){var cs=ee[H[br]],pu=void 0;if(v(cs)!==null)if(Sr.length<63)Sr.push({char:cs,seqIndex:br});else break;else if((pu=A(cs))!==null)for(var hs=Sr.length-1;hs>=0;hs--){var Jl=Sr[hs].char;if(Jl===pu||Jl===A(w(cs))||v(w(Jl))===cs){xo.push([Sr[hs].seqIndex,br]),Sr.length=hs;break}}}xo.sort(function(ln,Un){return ln[0]-Un[0]})}for(var Ql=0;Ql<xo.length;Ql++){for(var mu=xo[Ql],Mo=mu[0],$l=mu[1],gu=!1,Ln=0,ec=Mo+1;ec<$l;ec++){var _u=H[ec];if(E[_u]&du){gu=!0;var vu=E[_u]&ls?C:T;if(vu===ke){Ln=vu;break}}}if(gu&&!Ln){Ln=Pe;for(var tc=Mo-1;tc>=0;tc--){var yu=H[tc];if(E[yu]&du){var xu=E[yu]&ls?C:T;xu!==ke?Ln=xu:Ln=ke;break}}}if(Ln){if(E[H[Mo]]=E[H[$l]]=Ln,Ln!==ke){for(var us=Mo+1;us<H.length;us++)if(!(E[H[us]]&l)){f(ee[H[us]])&Z&&(E[H[us]]=Ln);break}}if(Ln!==ke){for(var fs=$l+1;fs<H.length;fs++)if(!(E[H[fs]]&l)){f(ee[H[fs]])&Z&&(E[H[fs]]=Ln);break}}}}for(var Mi=0;Mi<H.length;Mi++)if(E[H[Mi]]&a){for(var Mu=Mi,nc=Mi,ic=Pe,ds=Mi-1;ds>=0;ds--)if(E[H[ds]]&l)Mu=ds;else{ic=E[H[ds]]&ls?C:T;break}for(var Su=Oe,ps=Mi+1;ps<H.length;ps++)if(E[H[ps]]&(a|l))nc=ps;else{Su=E[H[ps]]&ls?C:T;break}for(var rc=Mu;rc<=nc;rc++)E[H[rc]]=ic===Su?ic:ke;Mi=nc}}}for(var _n=ye.start;_n<=ye.end;_n++){var Wm=q[_n],So=E[_n];if(Wm&1?So&(T|b|L)&&q[_n]++:So&C?q[_n]++:So&(L|b)&&(q[_n]+=2),So&l&&(q[_n]=_n===0?ye.level:q[_n-1]),_n===ye.end||f(ee[_n])&(Q|N))for(var bo=_n;bo>=0&&f(ee[bo])&c;bo--)q[bo]=ye.level}}return{levels:q,paragraphs:Se};function bu(ln,Un){for(var cn=ln;cn<ee.length;cn++){var Si=E[cn];if(Si&(C|te))return 1;if(Si&(N|T)||Un&&Si===G)return 0;if(Si&r){var wu=Xm(cn);cn=wu===-1?ee.length:wu}}return 0}function Xm(ln){for(var Un=1,cn=ln+1;cn<ee.length;cn++){var Si=E[cn];if(Si&N)break;if(Si&G){if(--Un===0)return cn}else Si&r&&Un++}return-1}}var se="14>1,j>2,t>2,u>2,1a>g,2v3>1,1>1,1ge>1,1wd>1,b>1,1j>1,f>1,ai>3,-2>3,+1,8>1k0,-1jq>1y7,-1y6>1hf,-1he>1h6,-1h5>1ha,-1h8>1qi,-1pu>1,6>3u,-3s>7,6>1,1>1,f>1,1>1,+2,3>1,1>1,+13,4>1,1>1,6>1eo,-1ee>1,3>1mg,-1me>1mk,-1mj>1mi,-1mg>1mi,-1md>1,1>1,+2,1>10k,-103>1,1>1,4>1,5>1,1>1,+10,3>1,1>8,-7>8,+1,-6>7,+1,a>1,1>1,u>1,u6>1,1>1,+5,26>1,1>1,2>1,2>2,8>1,7>1,4>1,1>1,+5,b8>1,1>1,+3,1>3,-2>1,2>1,1>1,+2,c>1,3>1,1>1,+2,h>1,3>1,a>1,1>1,2>1,3>1,1>1,d>1,f>1,3>1,1a>1,1>1,6>1,7>1,13>1,k>1,1>1,+19,4>1,1>1,+2,2>1,1>1,+18,m>1,a>1,1>1,lk>1,1>1,4>1,2>1,f>1,3>1,1>1,+3,db>1,1>1,+3,3>1,1>1,+2,14qm>1,1>1,+1,6>1,4j>1,j>2,t>2,u>2,2>1,+1",ae;function B(){if(!ae){var ee=_(se,!0),de=ee.map,fe=ee.reverseMap;fe.forEach(function(E,S){de.set(S,E)}),ae=de}}function ie(ee){return B(),ae.get(ee)||null}function R(ee,de,fe,E){var S=ee.length;fe=Math.max(0,fe==null?0:+fe),E=Math.min(S-1,E==null?S-1:+E);for(var D=new Map,Y=fe;Y<=E;Y++)if(de[Y]&1){var q=ie(ee[Y]);q!==null&&D.set(Y,q)}return D}function oe(ee,de,fe,E){var S=ee.length;fe=Math.max(0,fe==null?0:+fe),E=Math.min(S-1,E==null?S-1:+E);var D=[];return de.paragraphs.forEach(function(Y){var q=Math.max(fe,Y.start),re=Math.min(E,Y.end);if(q<re){for(var Se=de.levels.slice(q,re+1),ye=re;ye>=q&&f(ee[ye])&c;ye--)Se[ye]=Y.level;for(var be=Y.level,Le=1/0,we=0;we<Se.length;we++){var Re=Se[we];Re>be&&(be=Re),Re<Le&&(Le=Re|1)}for(var Ie=be;Ie>=Le;Ie--)for(var De=0;De<Se.length;De++)if(Se[De]>=Ie){for(var Te=De;De+1<Se.length&&Se[De+1]>=Ie;)De++;De>Te&&D.push([Te+q,De+q])}}}),D}function $(ee,de,fe,E){var S=me(ee,de,fe,E),D=[].concat(ee);return S.forEach(function(Y,q){D[q]=(de.levels[Y]&1?ie(ee[Y]):null)||ee[Y]}),D.join("")}function me(ee,de,fe,E){for(var S=oe(ee,de,fe,E),D=[],Y=0;Y<ee.length;Y++)D[Y]=Y;return S.forEach(function(q){for(var re=q[0],Se=q[1],ye=D.slice(re,Se+1),be=ye.length;be--;)D[Se-be]=ye[be]}),D}return e.closingToOpeningBracket=A,e.getBidiCharType=f,e.getBidiCharTypeName=d,e.getCanonicalBracket=w,e.getEmbeddingLevels=pe,e.getMirroredCharacter=ie,e.getMirroredCharactersMap=R,e.getReorderSegments=oe,e.getReorderedIndices=me,e.getReorderedString=$,e.openingToClosingBracket=v,Object.defineProperty(e,"__esModule",{value:!0}),e})({});return s}const Im=/\bvoid\s+main\s*\(\s*\)\s*{/g;function vh(s){const e=/^[ \t]*#include +<([\w\d./]+)>/gm;function t(n,i){let r=$e[i];return r?vh(r):n}return s.replace(e,t)}const Ht=[];for(let s=0;s<256;s++)Ht[s]=(s<16?"0":"")+s.toString(16);function mb(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ht[s&255]+Ht[s>>8&255]+Ht[s>>16&255]+Ht[s>>24&255]+"-"+Ht[e&255]+Ht[e>>8&255]+"-"+Ht[e>>16&15|64]+Ht[e>>24&255]+"-"+Ht[t&63|128]+Ht[t>>8&255]+"-"+Ht[t>>16&255]+Ht[t>>24&255]+Ht[n&255]+Ht[n>>8&255]+Ht[n>>16&255]+Ht[n>>24&255]).toUpperCase()}const Ki=Object.assign||function(){let s=arguments[0];for(let e=1,t=arguments.length;e<t;e++){let n=arguments[e];if(n)for(let i in n)Object.prototype.hasOwnProperty.call(n,i)&&(s[i]=n[i])}return s},gb=Date.now(),ud=new WeakMap,fd=new Map;let _b=1e10;function yh(s,e){const t=Mb(e);let n=ud.get(s);if(n||ud.set(s,n=Object.create(null)),n[t])return new n[t];const i=`_onBeforeCompile${t}`,r=function(c,h){s.onBeforeCompile.call(this,c,h);const u=this.customProgramCacheKey()+"|"+c.vertexShader+"|"+c.fragmentShader;let f=fd[u];if(!f){const d=vb(this,c,e,t);f=fd[u]=d}c.vertexShader=f.vertexShader,c.fragmentShader=f.fragmentShader,Ki(c.uniforms,this.uniforms),e.timeUniform&&(c.uniforms[e.timeUniform]={get value(){return Date.now()-gb}}),this[i]&&this[i](c)},o=function(){return a(e.chained?s:s.clone())},a=function(c){const h=Object.create(c,l);return Object.defineProperty(h,"baseMaterial",{value:s}),Object.defineProperty(h,"id",{value:_b++}),h.uuid=mb(),h.uniforms=Ki({},c.uniforms,e.uniforms),h.defines=Ki({},c.defines,e.defines),h.defines[`TROIKA_DERIVED_MATERIAL_${t}`]="",h.extensions=Ki({},c.extensions,e.extensions),h._listeners=void 0,h},l={constructor:{value:o},isDerivedMaterial:{value:!0},type:{get:()=>s.type,set:c=>{s.type=c}},isDerivedFrom:{writable:!0,configurable:!0,value:function(c){const h=this.baseMaterial;return c===h||h.isDerivedMaterial&&h.isDerivedFrom(c)||!1}},customProgramCacheKey:{writable:!0,configurable:!0,value:function(){return s.customProgramCacheKey()+"|"+t}},onBeforeCompile:{get(){return r},set(c){this[i]=c}},copy:{writable:!0,configurable:!0,value:function(c){return s.copy.call(this,c),!s.isShaderMaterial&&!s.isDerivedMaterial&&(Ki(this.extensions,c.extensions),Ki(this.defines,c.defines),Ki(this.uniforms,Qs.clone(c.uniforms))),this}},clone:{writable:!0,configurable:!0,value:function(){const c=new s.constructor;return a(c).copy(this)}},getDepthMaterial:{writable:!0,configurable:!0,value:function(){let c=this._depthMaterial;return c||(c=this._depthMaterial=yh(s.isDerivedMaterial?s.getDepthMaterial():new Vl({depthPacking:Uh}),e),c.defines.IS_DEPTH_MATERIAL="",c.uniforms=this.uniforms),c}},getDistanceMaterial:{writable:!0,configurable:!0,value:function(){let c=this._distanceMaterial;return c||(c=this._distanceMaterial=yh(s.isDerivedMaterial?s.getDistanceMaterial():new Gl,e),c.defines.IS_DISTANCE_MATERIAL="",c.uniforms=this.uniforms),c}},dispose:{writable:!0,configurable:!0,value(){const{_depthMaterial:c,_distanceMaterial:h}=this;c&&c.dispose(),h&&h.dispose(),s.dispose.call(this)}}};return n[t]=o,new o}function vb(s,{vertexShader:e,fragmentShader:t},n,i){let{vertexDefs:r,vertexMainIntro:o,vertexMainOutro:a,vertexTransform:l,fragmentDefs:c,fragmentMainIntro:h,fragmentMainOutro:u,fragmentColorTransform:f,customRewriter:d,timeUniform:p}=n;if(r=r||"",o=o||"",a=a||"",c=c||"",h=h||"",u=u||"",(l||d)&&(e=vh(e)),(f||d)&&(t=t.replace(/^[ \t]*#include <((?:tonemapping|encodings|colorspace|fog|premultiplied_alpha|dithering)_fragment)>/gm,`
//!BEGIN_POST_CHUNK $1
$&
//!END_POST_CHUNK
`),t=vh(t)),d){let _=d({vertexShader:e,fragmentShader:t});e=_.vertexShader,t=_.fragmentShader}if(f){let _=[];t=t.replace(/^\/\/!BEGIN_POST_CHUNK[^]+?^\/\/!END_POST_CHUNK/gm,g=>(_.push(g),"")),u=`${f}
${_.join(`
`)}
${u}`}if(p){const _=`
uniform float ${p};
`;r=_+r,c=_+c}return l&&(e=`vec3 troika_position_${i};
vec3 troika_normal_${i};
vec2 troika_uv_${i};
${e}
`,r=`${r}
void troikaVertexTransform${i}(inout vec3 position, inout vec3 normal, inout vec2 uv) {
  ${l}
}
`,o=`
troika_position_${i} = vec3(position);
troika_normal_${i} = vec3(normal);
troika_uv_${i} = vec2(uv);
troikaVertexTransform${i}(troika_position_${i}, troika_normal_${i}, troika_uv_${i});
${o}
`,e=e.replace(/\b(position|normal|uv)\b/g,(_,g,m,x)=>/\battribute\s+vec[23]\s+$/.test(x.substr(0,m))?g:`troika_${g}_${i}`),s.map&&s.map.channel>0||(e=e.replace(/\bMAP_UV\b/g,`troika_uv_${i}`))),e=dd(e,i,r,o,a),t=dd(t,i,c,h,u),{vertexShader:e,fragmentShader:t}}function dd(s,e,t,n,i){return(n||i||t)&&(s=s.replace(Im,`
${t}
void troikaOrigMain${e}() {`),s+=`
void main() {
  ${n}
  troikaOrigMain${e}();
  ${i}
}`),s}function yb(s,e){return s==="uniforms"?void 0:typeof e=="function"?e.toString():e}let xb=0;const pd=new Map;function Mb(s){const e=JSON.stringify(s,yb);let t=pd.get(e);return t==null&&pd.set(e,t=++xb),t}/*!
Custom build of Typr.ts (https://github.com/fredli74/Typr.ts) for use in Troika text rendering.
Original MIT license applies: https://github.com/fredli74/Typr.ts/blob/master/LICENSE
*/function Sb(){return typeof window>"u"&&(self.window=self),(function(s){var e={parse:function(i){var r=e._bin,o=new Uint8Array(i);if(r.readASCII(o,0,4)=="ttcf"){var a=4;r.readUshort(o,a),a+=2,r.readUshort(o,a),a+=2;var l=r.readUint(o,a);a+=4;for(var c=[],h=0;h<l;h++){var u=r.readUint(o,a);a+=4,c.push(e._readFont(o,u))}return c}return[e._readFont(o,0)]},_readFont:function(i,r){var o=e._bin,a=r;o.readFixed(i,r),r+=4;var l=o.readUshort(i,r);r+=2,o.readUshort(i,r),r+=2,o.readUshort(i,r),r+=2,o.readUshort(i,r),r+=2;for(var c=["cmap","head","hhea","maxp","hmtx","name","OS/2","post","loca","glyf","kern","CFF ","GDEF","GPOS","GSUB","SVG "],h={_data:i,_offset:a},u={},f=0;f<l;f++){var d=o.readASCII(i,r,4);r+=4,o.readUint(i,r),r+=4;var p=o.readUint(i,r);r+=4;var _=o.readUint(i,r);r+=4,u[d]={offset:p,length:_}}for(f=0;f<c.length;f++){var g=c[f];u[g]&&(h[g.trim()]=e[g.trim()].parse(i,u[g].offset,u[g].length,h))}return h},_tabOffset:function(i,r,o){for(var a=e._bin,l=a.readUshort(i,o+4),c=o+12,h=0;h<l;h++){var u=a.readASCII(i,c,4);c+=4,a.readUint(i,c),c+=4;var f=a.readUint(i,c);if(c+=4,a.readUint(i,c),c+=4,u==r)return f}return 0}};e._bin={readFixed:function(i,r){return(i[r]<<8|i[r+1])+(i[r+2]<<8|i[r+3])/65540},readF2dot14:function(i,r){return e._bin.readShort(i,r)/16384},readInt:function(i,r){return e._bin._view(i).getInt32(r)},readInt8:function(i,r){return e._bin._view(i).getInt8(r)},readShort:function(i,r){return e._bin._view(i).getInt16(r)},readUshort:function(i,r){return e._bin._view(i).getUint16(r)},readUshorts:function(i,r,o){for(var a=[],l=0;l<o;l++)a.push(e._bin.readUshort(i,r+2*l));return a},readUint:function(i,r){return e._bin._view(i).getUint32(r)},readUint64:function(i,r){return 4294967296*e._bin.readUint(i,r)+e._bin.readUint(i,r+4)},readASCII:function(i,r,o){for(var a="",l=0;l<o;l++)a+=String.fromCharCode(i[r+l]);return a},readUnicode:function(i,r,o){for(var a="",l=0;l<o;l++){var c=i[r++]<<8|i[r++];a+=String.fromCharCode(c)}return a},_tdec:typeof window<"u"&&window.TextDecoder?new window.TextDecoder:null,readUTF8:function(i,r,o){var a=e._bin._tdec;return a&&r==0&&o==i.length?a.decode(i):e._bin.readASCII(i,r,o)},readBytes:function(i,r,o){for(var a=[],l=0;l<o;l++)a.push(i[r+l]);return a},readASCIIArray:function(i,r,o){for(var a=[],l=0;l<o;l++)a.push(String.fromCharCode(i[r+l]));return a},_view:function(i){return i._dataView||(i._dataView=i.buffer?new DataView(i.buffer,i.byteOffset,i.byteLength):new DataView(new Uint8Array(i).buffer))}},e._lctf={},e._lctf.parse=function(i,r,o,a,l){var c=e._bin,h={},u=r;c.readFixed(i,r),r+=4;var f=c.readUshort(i,r);r+=2;var d=c.readUshort(i,r);r+=2;var p=c.readUshort(i,r);return r+=2,h.scriptList=e._lctf.readScriptList(i,u+f),h.featureList=e._lctf.readFeatureList(i,u+d),h.lookupList=e._lctf.readLookupList(i,u+p,l),h},e._lctf.readLookupList=function(i,r,o){var a=e._bin,l=r,c=[],h=a.readUshort(i,r);r+=2;for(var u=0;u<h;u++){var f=a.readUshort(i,r);r+=2;var d=e._lctf.readLookupTable(i,l+f,o);c.push(d)}return c},e._lctf.readLookupTable=function(i,r,o){var a=e._bin,l=r,c={tabs:[]};c.ltype=a.readUshort(i,r),r+=2,c.flag=a.readUshort(i,r),r+=2;var h=a.readUshort(i,r);r+=2;for(var u=c.ltype,f=0;f<h;f++){var d=a.readUshort(i,r);r+=2;var p=o(i,u,l+d,c);c.tabs.push(p)}return c},e._lctf.numOfOnes=function(i){for(var r=0,o=0;o<32;o++)(i>>>o&1)!=0&&r++;return r},e._lctf.readClassDef=function(i,r){var o=e._bin,a=[],l=o.readUshort(i,r);if(r+=2,l==1){var c=o.readUshort(i,r);r+=2;var h=o.readUshort(i,r);r+=2;for(var u=0;u<h;u++)a.push(c+u),a.push(c+u),a.push(o.readUshort(i,r)),r+=2}if(l==2){var f=o.readUshort(i,r);for(r+=2,u=0;u<f;u++)a.push(o.readUshort(i,r)),r+=2,a.push(o.readUshort(i,r)),r+=2,a.push(o.readUshort(i,r)),r+=2}return a},e._lctf.getInterval=function(i,r){for(var o=0;o<i.length;o+=3){var a=i[o],l=i[o+1];if(i[o+2],a<=r&&r<=l)return o}return-1},e._lctf.readCoverage=function(i,r){var o=e._bin,a={};a.fmt=o.readUshort(i,r),r+=2;var l=o.readUshort(i,r);return r+=2,a.fmt==1&&(a.tab=o.readUshorts(i,r,l)),a.fmt==2&&(a.tab=o.readUshorts(i,r,3*l)),a},e._lctf.coverageIndex=function(i,r){var o=i.tab;if(i.fmt==1)return o.indexOf(r);if(i.fmt==2){var a=e._lctf.getInterval(o,r);if(a!=-1)return o[a+2]+(r-o[a])}return-1},e._lctf.readFeatureList=function(i,r){var o=e._bin,a=r,l=[],c=o.readUshort(i,r);r+=2;for(var h=0;h<c;h++){var u=o.readASCII(i,r,4);r+=4;var f=o.readUshort(i,r);r+=2;var d=e._lctf.readFeatureTable(i,a+f);d.tag=u.trim(),l.push(d)}return l},e._lctf.readFeatureTable=function(i,r){var o=e._bin,a=r,l={},c=o.readUshort(i,r);r+=2,c>0&&(l.featureParams=a+c);var h=o.readUshort(i,r);r+=2,l.tab=[];for(var u=0;u<h;u++)l.tab.push(o.readUshort(i,r+2*u));return l},e._lctf.readScriptList=function(i,r){var o=e._bin,a=r,l={},c=o.readUshort(i,r);r+=2;for(var h=0;h<c;h++){var u=o.readASCII(i,r,4);r+=4;var f=o.readUshort(i,r);r+=2,l[u.trim()]=e._lctf.readScriptTable(i,a+f)}return l},e._lctf.readScriptTable=function(i,r){var o=e._bin,a=r,l={},c=o.readUshort(i,r);r+=2,c>0&&(l.default=e._lctf.readLangSysTable(i,a+c));var h=o.readUshort(i,r);r+=2;for(var u=0;u<h;u++){var f=o.readASCII(i,r,4);r+=4;var d=o.readUshort(i,r);r+=2,l[f.trim()]=e._lctf.readLangSysTable(i,a+d)}return l},e._lctf.readLangSysTable=function(i,r){var o=e._bin,a={};o.readUshort(i,r),r+=2,a.reqFeature=o.readUshort(i,r),r+=2;var l=o.readUshort(i,r);return r+=2,a.features=o.readUshorts(i,r,l),a},e.CFF={},e.CFF.parse=function(i,r,o){var a=e._bin;(i=new Uint8Array(i.buffer,r,o))[r=0],i[++r],i[++r],i[++r],r++;var l=[];r=e.CFF.readIndex(i,r,l);for(var c=[],h=0;h<l.length-1;h++)c.push(a.readASCII(i,r+l[h],l[h+1]-l[h]));r+=l[l.length-1];var u=[];r=e.CFF.readIndex(i,r,u);var f=[];for(h=0;h<u.length-1;h++)f.push(e.CFF.readDict(i,r+u[h],r+u[h+1]));r+=u[u.length-1];var d=f[0],p=[];r=e.CFF.readIndex(i,r,p);var _=[];for(h=0;h<p.length-1;h++)_.push(a.readASCII(i,r+p[h],p[h+1]-p[h]));if(r+=p[p.length-1],e.CFF.readSubrs(i,r,d),d.CharStrings){r=d.CharStrings,p=[],r=e.CFF.readIndex(i,r,p);var g=[];for(h=0;h<p.length-1;h++)g.push(a.readBytes(i,r+p[h],p[h+1]-p[h]));d.CharStrings=g}if(d.ROS){r=d.FDArray;var m=[];for(r=e.CFF.readIndex(i,r,m),d.FDArray=[],h=0;h<m.length-1;h++){var x=e.CFF.readDict(i,r+m[h],r+m[h+1]);e.CFF._readFDict(i,x,_),d.FDArray.push(x)}r+=m[m.length-1],r=d.FDSelect,d.FDSelect=[];var y=i[r];if(r++,y!=3)throw y;var v=a.readUshort(i,r);for(r+=2,h=0;h<v+1;h++)d.FDSelect.push(a.readUshort(i,r),i[r+2]),r+=3}return d.Encoding&&(d.Encoding=e.CFF.readEncoding(i,d.Encoding,d.CharStrings.length)),d.charset&&(d.charset=e.CFF.readCharset(i,d.charset,d.CharStrings.length)),e.CFF._readFDict(i,d,_),d},e.CFF._readFDict=function(i,r,o){var a;for(var l in r.Private&&(a=r.Private[1],r.Private=e.CFF.readDict(i,a,a+r.Private[0]),r.Private.Subrs&&e.CFF.readSubrs(i,a+r.Private.Subrs,r.Private)),r)["FamilyName","FontName","FullName","Notice","version","Copyright"].indexOf(l)!=-1&&(r[l]=o[r[l]-426+35])},e.CFF.readSubrs=function(i,r,o){var a=e._bin,l=[];r=e.CFF.readIndex(i,r,l);var c,h=l.length;c=h<1240?107:h<33900?1131:32768,o.Bias=c,o.Subrs=[];for(var u=0;u<l.length-1;u++)o.Subrs.push(a.readBytes(i,r+l[u],l[u+1]-l[u]))},e.CFF.tableSE=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,0,111,112,113,114,0,115,116,117,118,119,120,121,122,0,123,0,124,125,126,127,128,129,130,131,0,132,133,0,134,135,136,137,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,138,0,139,0,0,0,0,140,141,142,143,0,0,0,0,0,144,0,0,0,145,0,0,146,147,148,149,0,0,0,0],e.CFF.glyphByUnicode=function(i,r){for(var o=0;o<i.charset.length;o++)if(i.charset[o]==r)return o;return-1},e.CFF.glyphBySE=function(i,r){return r<0||r>255?-1:e.CFF.glyphByUnicode(i,e.CFF.tableSE[r])},e.CFF.readEncoding=function(i,r,o){e._bin;var a=[".notdef"],l=i[r];if(r++,l!=0)throw"error: unknown encoding format: "+l;var c=i[r];r++;for(var h=0;h<c;h++)a.push(i[r+h]);return a},e.CFF.readCharset=function(i,r,o){var a=e._bin,l=[".notdef"],c=i[r];if(r++,c==0)for(var h=0;h<o;h++){var u=a.readUshort(i,r);r+=2,l.push(u)}else{if(c!=1&&c!=2)throw"error: format: "+c;for(;l.length<o;){u=a.readUshort(i,r),r+=2;var f=0;for(c==1?(f=i[r],r++):(f=a.readUshort(i,r),r+=2),h=0;h<=f;h++)l.push(u),u++}}return l},e.CFF.readIndex=function(i,r,o){var a=e._bin,l=a.readUshort(i,r)+1,c=i[r+=2];if(r++,c==1)for(var h=0;h<l;h++)o.push(i[r+h]);else if(c==2)for(h=0;h<l;h++)o.push(a.readUshort(i,r+2*h));else if(c==3)for(h=0;h<l;h++)o.push(16777215&a.readUint(i,r+3*h-1));else if(l!=1)throw"unsupported offset size: "+c+", count: "+l;return(r+=l*c)-1},e.CFF.getCharString=function(i,r,o){var a=e._bin,l=i[r],c=i[r+1];i[r+2],i[r+3],i[r+4];var h=1,u=null,f=null;l<=20&&(u=l,h=1),l==12&&(u=100*l+c,h=2),21<=l&&l<=27&&(u=l,h=1),l==28&&(f=a.readShort(i,r+1),h=3),29<=l&&l<=31&&(u=l,h=1),32<=l&&l<=246&&(f=l-139,h=1),247<=l&&l<=250&&(f=256*(l-247)+c+108,h=2),251<=l&&l<=254&&(f=256*-(l-251)-c-108,h=2),l==255&&(f=a.readInt(i,r+1)/65535,h=5),o.val=f??"o"+u,o.size=h},e.CFF.readCharString=function(i,r,o){for(var a=r+o,l=e._bin,c=[];r<a;){var h=i[r],u=i[r+1];i[r+2],i[r+3],i[r+4];var f=1,d=null,p=null;h<=20&&(d=h,f=1),h==12&&(d=100*h+u,f=2),h!=19&&h!=20||(d=h,f=2),21<=h&&h<=27&&(d=h,f=1),h==28&&(p=l.readShort(i,r+1),f=3),29<=h&&h<=31&&(d=h,f=1),32<=h&&h<=246&&(p=h-139,f=1),247<=h&&h<=250&&(p=256*(h-247)+u+108,f=2),251<=h&&h<=254&&(p=256*-(h-251)-u-108,f=2),h==255&&(p=l.readInt(i,r+1)/65535,f=5),c.push(p??"o"+d),r+=f}return c},e.CFF.readDict=function(i,r,o){for(var a=e._bin,l={},c=[];r<o;){var h=i[r],u=i[r+1];i[r+2],i[r+3],i[r+4];var f=1,d=null,p=null;if(h==28&&(p=a.readShort(i,r+1),f=3),h==29&&(p=a.readInt(i,r+1),f=5),32<=h&&h<=246&&(p=h-139,f=1),247<=h&&h<=250&&(p=256*(h-247)+u+108,f=2),251<=h&&h<=254&&(p=256*-(h-251)-u-108,f=2),h==255)throw p=a.readInt(i,r+1)/65535,f=5,"unknown number";if(h==30){var _=[];for(f=1;;){var g=i[r+f];f++;var m=g>>4,x=15&g;if(m!=15&&_.push(m),x!=15&&_.push(x),x==15)break}for(var y="",v=[0,1,2,3,4,5,6,7,8,9,".","e","e-","reserved","-","endOfNumber"],A=0;A<_.length;A++)y+=v[_[A]];p=parseFloat(y)}h<=21&&(d=["version","Notice","FullName","FamilyName","Weight","FontBBox","BlueValues","OtherBlues","FamilyBlues","FamilyOtherBlues","StdHW","StdVW","escape","UniqueID","XUID","charset","Encoding","CharStrings","Private","Subrs","defaultWidthX","nominalWidthX"][h],f=1,h==12&&(d=["Copyright","isFixedPitch","ItalicAngle","UnderlinePosition","UnderlineThickness","PaintType","CharstringType","FontMatrix","StrokeWidth","BlueScale","BlueShift","BlueFuzz","StemSnapH","StemSnapV","ForceBold",0,0,"LanguageGroup","ExpansionFactor","initialRandomSeed","SyntheticBase","PostScript","BaseFontName","BaseFontBlend",0,0,0,0,0,0,"ROS","CIDFontVersion","CIDFontRevision","CIDFontType","CIDCount","UIDBase","FDArray","FDSelect","FontName"][u],f=2)),d!=null?(l[d]=c.length==1?c[0]:c,c=[]):c.push(p),r+=f}return l},e.cmap={},e.cmap.parse=function(i,r,o){i=new Uint8Array(i.buffer,r,o),r=0;var a=e._bin,l={};a.readUshort(i,r),r+=2;var c=a.readUshort(i,r);r+=2;var h=[];l.tables=[];for(var u=0;u<c;u++){var f=a.readUshort(i,r);r+=2;var d=a.readUshort(i,r);r+=2;var p=a.readUint(i,r);r+=4;var _="p"+f+"e"+d,g=h.indexOf(p);if(g==-1){var m;g=l.tables.length,h.push(p);var x=a.readUshort(i,p);x==0?m=e.cmap.parse0(i,p):x==4?m=e.cmap.parse4(i,p):x==6?m=e.cmap.parse6(i,p):x==12?m=e.cmap.parse12(i,p):console.debug("unknown format: "+x,f,d,p),l.tables.push(m)}if(l[_]!=null)throw"multiple tables for one platform+encoding";l[_]=g}return l},e.cmap.parse0=function(i,r){var o=e._bin,a={};a.format=o.readUshort(i,r),r+=2;var l=o.readUshort(i,r);r+=2,o.readUshort(i,r),r+=2,a.map=[];for(var c=0;c<l-6;c++)a.map.push(i[r+c]);return a},e.cmap.parse4=function(i,r){var o=e._bin,a=r,l={};l.format=o.readUshort(i,r),r+=2;var c=o.readUshort(i,r);r+=2,o.readUshort(i,r),r+=2;var h=o.readUshort(i,r);r+=2;var u=h/2;l.searchRange=o.readUshort(i,r),r+=2,l.entrySelector=o.readUshort(i,r),r+=2,l.rangeShift=o.readUshort(i,r),r+=2,l.endCount=o.readUshorts(i,r,u),r+=2*u,r+=2,l.startCount=o.readUshorts(i,r,u),r+=2*u,l.idDelta=[];for(var f=0;f<u;f++)l.idDelta.push(o.readShort(i,r)),r+=2;for(l.idRangeOffset=o.readUshorts(i,r,u),r+=2*u,l.glyphIdArray=[];r<a+c;)l.glyphIdArray.push(o.readUshort(i,r)),r+=2;return l},e.cmap.parse6=function(i,r){var o=e._bin,a={};a.format=o.readUshort(i,r),r+=2,o.readUshort(i,r),r+=2,o.readUshort(i,r),r+=2,a.firstCode=o.readUshort(i,r),r+=2;var l=o.readUshort(i,r);r+=2,a.glyphIdArray=[];for(var c=0;c<l;c++)a.glyphIdArray.push(o.readUshort(i,r)),r+=2;return a},e.cmap.parse12=function(i,r){var o=e._bin,a={};a.format=o.readUshort(i,r),r+=2,r+=2,o.readUint(i,r),r+=4,o.readUint(i,r),r+=4;var l=o.readUint(i,r);r+=4,a.groups=[];for(var c=0;c<l;c++){var h=r+12*c,u=o.readUint(i,h+0),f=o.readUint(i,h+4),d=o.readUint(i,h+8);a.groups.push([u,f,d])}return a},e.glyf={},e.glyf.parse=function(i,r,o,a){for(var l=[],c=0;c<a.maxp.numGlyphs;c++)l.push(null);return l},e.glyf._parseGlyf=function(i,r){var o=e._bin,a=i._data,l=e._tabOffset(a,"glyf",i._offset)+i.loca[r];if(i.loca[r]==i.loca[r+1])return null;var c={};if(c.noc=o.readShort(a,l),l+=2,c.xMin=o.readShort(a,l),l+=2,c.yMin=o.readShort(a,l),l+=2,c.xMax=o.readShort(a,l),l+=2,c.yMax=o.readShort(a,l),l+=2,c.xMin>=c.xMax||c.yMin>=c.yMax)return null;if(c.noc>0){c.endPts=[];for(var h=0;h<c.noc;h++)c.endPts.push(o.readUshort(a,l)),l+=2;var u=o.readUshort(a,l);if(l+=2,a.length-l<u)return null;c.instructions=o.readBytes(a,l,u),l+=u;var f=c.endPts[c.noc-1]+1;for(c.flags=[],h=0;h<f;h++){var d=a[l];if(l++,c.flags.push(d),(8&d)!=0){var p=a[l];l++;for(var _=0;_<p;_++)c.flags.push(d),h++}}for(c.xs=[],h=0;h<f;h++){var g=(2&c.flags[h])!=0,m=(16&c.flags[h])!=0;g?(c.xs.push(m?a[l]:-a[l]),l++):m?c.xs.push(0):(c.xs.push(o.readShort(a,l)),l+=2)}for(c.ys=[],h=0;h<f;h++)g=(4&c.flags[h])!=0,m=(32&c.flags[h])!=0,g?(c.ys.push(m?a[l]:-a[l]),l++):m?c.ys.push(0):(c.ys.push(o.readShort(a,l)),l+=2);var x=0,y=0;for(h=0;h<f;h++)x+=c.xs[h],y+=c.ys[h],c.xs[h]=x,c.ys[h]=y}else{var v;c.parts=[];do{v=o.readUshort(a,l),l+=2;var A={m:{a:1,b:0,c:0,d:1,tx:0,ty:0},p1:-1,p2:-1};if(c.parts.push(A),A.glyphIndex=o.readUshort(a,l),l+=2,1&v){var w=o.readShort(a,l);l+=2;var T=o.readShort(a,l);l+=2}else w=o.readInt8(a,l),l++,T=o.readInt8(a,l),l++;2&v?(A.m.tx=w,A.m.ty=T):(A.p1=w,A.p2=T),8&v?(A.m.a=A.m.d=o.readF2dot14(a,l),l+=2):64&v?(A.m.a=o.readF2dot14(a,l),l+=2,A.m.d=o.readF2dot14(a,l),l+=2):128&v&&(A.m.a=o.readF2dot14(a,l),l+=2,A.m.b=o.readF2dot14(a,l),l+=2,A.m.c=o.readF2dot14(a,l),l+=2,A.m.d=o.readF2dot14(a,l),l+=2)}while(32&v);if(256&v){var C=o.readUshort(a,l);for(l+=2,c.instr=[],h=0;h<C;h++)c.instr.push(a[l]),l++}}return c},e.GDEF={},e.GDEF.parse=function(i,r,o,a){var l=r;r+=4;var c=e._bin.readUshort(i,r);return{glyphClassDef:c===0?null:e._lctf.readClassDef(i,l+c)}},e.GPOS={},e.GPOS.parse=function(i,r,o,a){return e._lctf.parse(i,r,o,a,e.GPOS.subt)},e.GPOS.subt=function(i,r,o,a){var l=e._bin,c=o,h={};if(h.fmt=l.readUshort(i,o),o+=2,r==1||r==2||r==3||r==7||r==8&&h.fmt<=2){var u=l.readUshort(i,o);o+=2,h.coverage=e._lctf.readCoverage(i,u+c)}if(r==1&&h.fmt==1){var f=l.readUshort(i,o);o+=2,f!=0&&(h.pos=e.GPOS.readValueRecord(i,o,f))}else if(r==2&&h.fmt>=1&&h.fmt<=2){f=l.readUshort(i,o),o+=2;var d=l.readUshort(i,o);o+=2;var p=e._lctf.numOfOnes(f),_=e._lctf.numOfOnes(d);if(h.fmt==1){h.pairsets=[];var g=l.readUshort(i,o);o+=2;for(var m=0;m<g;m++){var x=c+l.readUshort(i,o);o+=2;var y=l.readUshort(i,x);x+=2;for(var v=[],A=0;A<y;A++){var w=l.readUshort(i,x);x+=2,f!=0&&(L=e.GPOS.readValueRecord(i,x,f),x+=2*p),d!=0&&(F=e.GPOS.readValueRecord(i,x,d),x+=2*_),v.push({gid2:w,val1:L,val2:F})}h.pairsets.push(v)}}if(h.fmt==2){var T=l.readUshort(i,o);o+=2;var C=l.readUshort(i,o);o+=2;var b=l.readUshort(i,o);o+=2;var M=l.readUshort(i,o);for(o+=2,h.classDef1=e._lctf.readClassDef(i,c+T),h.classDef2=e._lctf.readClassDef(i,c+C),h.matrix=[],m=0;m<b;m++){var U=[];for(A=0;A<M;A++){var L=null,F=null;f!=0&&(L=e.GPOS.readValueRecord(i,o,f),o+=2*p),d!=0&&(F=e.GPOS.readValueRecord(i,o,d),o+=2*_),U.push({val1:L,val2:F})}h.matrix.push(U)}}}else if(r==4&&h.fmt==1)h.markCoverage=e._lctf.readCoverage(i,l.readUshort(i,o)+c),h.baseCoverage=e._lctf.readCoverage(i,l.readUshort(i,o+2)+c),h.markClassCount=l.readUshort(i,o+4),h.markArray=e.GPOS.readMarkArray(i,l.readUshort(i,o+6)+c),h.baseArray=e.GPOS.readBaseArray(i,l.readUshort(i,o+8)+c,h.markClassCount);else if(r==6&&h.fmt==1)h.mark1Coverage=e._lctf.readCoverage(i,l.readUshort(i,o)+c),h.mark2Coverage=e._lctf.readCoverage(i,l.readUshort(i,o+2)+c),h.markClassCount=l.readUshort(i,o+4),h.mark1Array=e.GPOS.readMarkArray(i,l.readUshort(i,o+6)+c),h.mark2Array=e.GPOS.readBaseArray(i,l.readUshort(i,o+8)+c,h.markClassCount);else{if(r==9&&h.fmt==1){var N=l.readUshort(i,o);o+=2;var Q=l.readUint(i,o);if(o+=4,a.ltype==9)a.ltype=N;else if(a.ltype!=N)throw"invalid extension substitution";return e.GPOS.subt(i,a.ltype,c+Q)}console.debug("unsupported GPOS table LookupType",r,"format",h.fmt)}return h},e.GPOS.readValueRecord=function(i,r,o){var a=e._bin,l=[];return l.push(1&o?a.readShort(i,r):0),r+=1&o?2:0,l.push(2&o?a.readShort(i,r):0),r+=2&o?2:0,l.push(4&o?a.readShort(i,r):0),r+=4&o?2:0,l.push(8&o?a.readShort(i,r):0),r+=8&o?2:0,l},e.GPOS.readBaseArray=function(i,r,o){var a=e._bin,l=[],c=r,h=a.readUshort(i,r);r+=2;for(var u=0;u<h;u++){for(var f=[],d=0;d<o;d++)f.push(e.GPOS.readAnchorRecord(i,c+a.readUshort(i,r))),r+=2;l.push(f)}return l},e.GPOS.readMarkArray=function(i,r){var o=e._bin,a=[],l=r,c=o.readUshort(i,r);r+=2;for(var h=0;h<c;h++){var u=e.GPOS.readAnchorRecord(i,o.readUshort(i,r+2)+l);u.markClass=o.readUshort(i,r),a.push(u),r+=4}return a},e.GPOS.readAnchorRecord=function(i,r){var o=e._bin,a={};return a.fmt=o.readUshort(i,r),a.x=o.readShort(i,r+2),a.y=o.readShort(i,r+4),a},e.GSUB={},e.GSUB.parse=function(i,r,o,a){return e._lctf.parse(i,r,o,a,e.GSUB.subt)},e.GSUB.subt=function(i,r,o,a){var l=e._bin,c=o,h={};if(h.fmt=l.readUshort(i,o),o+=2,r!=1&&r!=2&&r!=4&&r!=5&&r!=6)return null;if(r==1||r==2||r==4||r==5&&h.fmt<=2||r==6&&h.fmt<=2){var u=l.readUshort(i,o);o+=2,h.coverage=e._lctf.readCoverage(i,c+u)}if(r==1&&h.fmt>=1&&h.fmt<=2){if(h.fmt==1)h.delta=l.readShort(i,o),o+=2;else if(h.fmt==2){var f=l.readUshort(i,o);o+=2,h.newg=l.readUshorts(i,o,f),o+=2*h.newg.length}}else if(r==2&&h.fmt==1){f=l.readUshort(i,o),o+=2,h.seqs=[];for(var d=0;d<f;d++){var p=l.readUshort(i,o)+c;o+=2;var _=l.readUshort(i,p);h.seqs.push(l.readUshorts(i,p+2,_))}}else if(r==4)for(h.vals=[],f=l.readUshort(i,o),o+=2,d=0;d<f;d++){var g=l.readUshort(i,o);o+=2,h.vals.push(e.GSUB.readLigatureSet(i,c+g))}else if(r==5&&h.fmt==2){if(h.fmt==2){var m=l.readUshort(i,o);o+=2,h.cDef=e._lctf.readClassDef(i,c+m),h.scset=[];var x=l.readUshort(i,o);for(o+=2,d=0;d<x;d++){var y=l.readUshort(i,o);o+=2,h.scset.push(y==0?null:e.GSUB.readSubClassSet(i,c+y))}}}else if(r==6&&h.fmt==3){if(h.fmt==3){for(d=0;d<3;d++){f=l.readUshort(i,o),o+=2;for(var v=[],A=0;A<f;A++)v.push(e._lctf.readCoverage(i,c+l.readUshort(i,o+2*A)));o+=2*f,d==0&&(h.backCvg=v),d==1&&(h.inptCvg=v),d==2&&(h.ahedCvg=v)}f=l.readUshort(i,o),o+=2,h.lookupRec=e.GSUB.readSubstLookupRecords(i,o,f)}}else{if(r==7&&h.fmt==1){var w=l.readUshort(i,o);o+=2;var T=l.readUint(i,o);if(o+=4,a.ltype==9)a.ltype=w;else if(a.ltype!=w)throw"invalid extension substitution";return e.GSUB.subt(i,a.ltype,c+T)}console.debug("unsupported GSUB table LookupType",r,"format",h.fmt)}return h},e.GSUB.readSubClassSet=function(i,r){var o=e._bin.readUshort,a=r,l=[],c=o(i,r);r+=2;for(var h=0;h<c;h++){var u=o(i,r);r+=2,l.push(e.GSUB.readSubClassRule(i,a+u))}return l},e.GSUB.readSubClassRule=function(i,r){var o=e._bin.readUshort,a={},l=o(i,r),c=o(i,r+=2);r+=2,a.input=[];for(var h=0;h<l-1;h++)a.input.push(o(i,r)),r+=2;return a.substLookupRecords=e.GSUB.readSubstLookupRecords(i,r,c),a},e.GSUB.readSubstLookupRecords=function(i,r,o){for(var a=e._bin.readUshort,l=[],c=0;c<o;c++)l.push(a(i,r),a(i,r+2)),r+=4;return l},e.GSUB.readChainSubClassSet=function(i,r){var o=e._bin,a=r,l=[],c=o.readUshort(i,r);r+=2;for(var h=0;h<c;h++){var u=o.readUshort(i,r);r+=2,l.push(e.GSUB.readChainSubClassRule(i,a+u))}return l},e.GSUB.readChainSubClassRule=function(i,r){for(var o=e._bin,a={},l=["backtrack","input","lookahead"],c=0;c<l.length;c++){var h=o.readUshort(i,r);r+=2,c==1&&h--,a[l[c]]=o.readUshorts(i,r,h),r+=2*a[l[c]].length}return h=o.readUshort(i,r),r+=2,a.subst=o.readUshorts(i,r,2*h),r+=2*a.subst.length,a},e.GSUB.readLigatureSet=function(i,r){var o=e._bin,a=r,l=[],c=o.readUshort(i,r);r+=2;for(var h=0;h<c;h++){var u=o.readUshort(i,r);r+=2,l.push(e.GSUB.readLigature(i,a+u))}return l},e.GSUB.readLigature=function(i,r){var o=e._bin,a={chain:[]};a.nglyph=o.readUshort(i,r),r+=2;var l=o.readUshort(i,r);r+=2;for(var c=0;c<l-1;c++)a.chain.push(o.readUshort(i,r)),r+=2;return a},e.head={},e.head.parse=function(i,r,o){var a=e._bin,l={};return a.readFixed(i,r),r+=4,l.fontRevision=a.readFixed(i,r),r+=4,a.readUint(i,r),r+=4,a.readUint(i,r),r+=4,l.flags=a.readUshort(i,r),r+=2,l.unitsPerEm=a.readUshort(i,r),r+=2,l.created=a.readUint64(i,r),r+=8,l.modified=a.readUint64(i,r),r+=8,l.xMin=a.readShort(i,r),r+=2,l.yMin=a.readShort(i,r),r+=2,l.xMax=a.readShort(i,r),r+=2,l.yMax=a.readShort(i,r),r+=2,l.macStyle=a.readUshort(i,r),r+=2,l.lowestRecPPEM=a.readUshort(i,r),r+=2,l.fontDirectionHint=a.readShort(i,r),r+=2,l.indexToLocFormat=a.readShort(i,r),r+=2,l.glyphDataFormat=a.readShort(i,r),r+=2,l},e.hhea={},e.hhea.parse=function(i,r,o){var a=e._bin,l={};return a.readFixed(i,r),r+=4,l.ascender=a.readShort(i,r),r+=2,l.descender=a.readShort(i,r),r+=2,l.lineGap=a.readShort(i,r),r+=2,l.advanceWidthMax=a.readUshort(i,r),r+=2,l.minLeftSideBearing=a.readShort(i,r),r+=2,l.minRightSideBearing=a.readShort(i,r),r+=2,l.xMaxExtent=a.readShort(i,r),r+=2,l.caretSlopeRise=a.readShort(i,r),r+=2,l.caretSlopeRun=a.readShort(i,r),r+=2,l.caretOffset=a.readShort(i,r),r+=2,r+=8,l.metricDataFormat=a.readShort(i,r),r+=2,l.numberOfHMetrics=a.readUshort(i,r),r+=2,l},e.hmtx={},e.hmtx.parse=function(i,r,o,a){for(var l=e._bin,c={aWidth:[],lsBearing:[]},h=0,u=0,f=0;f<a.maxp.numGlyphs;f++)f<a.hhea.numberOfHMetrics&&(h=l.readUshort(i,r),r+=2,u=l.readShort(i,r),r+=2),c.aWidth.push(h),c.lsBearing.push(u);return c},e.kern={},e.kern.parse=function(i,r,o,a){var l=e._bin,c=l.readUshort(i,r);if(r+=2,c==1)return e.kern.parseV1(i,r-2,o,a);var h=l.readUshort(i,r);r+=2;for(var u={glyph1:[],rval:[]},f=0;f<h;f++){r+=2,o=l.readUshort(i,r),r+=2;var d=l.readUshort(i,r);r+=2;var p=d>>>8;if((p&=15)!=0)throw"unknown kern table format: "+p;r=e.kern.readFormat0(i,r,u)}return u},e.kern.parseV1=function(i,r,o,a){var l=e._bin;l.readFixed(i,r),r+=4;var c=l.readUint(i,r);r+=4;for(var h={glyph1:[],rval:[]},u=0;u<c;u++){l.readUint(i,r),r+=4;var f=l.readUshort(i,r);r+=2,l.readUshort(i,r),r+=2;var d=f>>>8;if((d&=15)!=0)throw"unknown kern table format: "+d;r=e.kern.readFormat0(i,r,h)}return h},e.kern.readFormat0=function(i,r,o){var a=e._bin,l=-1,c=a.readUshort(i,r);r+=2,a.readUshort(i,r),r+=2,a.readUshort(i,r),r+=2,a.readUshort(i,r),r+=2;for(var h=0;h<c;h++){var u=a.readUshort(i,r);r+=2;var f=a.readUshort(i,r);r+=2;var d=a.readShort(i,r);r+=2,u!=l&&(o.glyph1.push(u),o.rval.push({glyph2:[],vals:[]}));var p=o.rval[o.rval.length-1];p.glyph2.push(f),p.vals.push(d),l=u}return r},e.loca={},e.loca.parse=function(i,r,o,a){var l=e._bin,c=[],h=a.head.indexToLocFormat,u=a.maxp.numGlyphs+1;if(h==0)for(var f=0;f<u;f++)c.push(l.readUshort(i,r+(f<<1))<<1);if(h==1)for(f=0;f<u;f++)c.push(l.readUint(i,r+(f<<2)));return c},e.maxp={},e.maxp.parse=function(i,r,o){var a=e._bin,l={},c=a.readUint(i,r);return r+=4,l.numGlyphs=a.readUshort(i,r),r+=2,c==65536&&(l.maxPoints=a.readUshort(i,r),r+=2,l.maxContours=a.readUshort(i,r),r+=2,l.maxCompositePoints=a.readUshort(i,r),r+=2,l.maxCompositeContours=a.readUshort(i,r),r+=2,l.maxZones=a.readUshort(i,r),r+=2,l.maxTwilightPoints=a.readUshort(i,r),r+=2,l.maxStorage=a.readUshort(i,r),r+=2,l.maxFunctionDefs=a.readUshort(i,r),r+=2,l.maxInstructionDefs=a.readUshort(i,r),r+=2,l.maxStackElements=a.readUshort(i,r),r+=2,l.maxSizeOfInstructions=a.readUshort(i,r),r+=2,l.maxComponentElements=a.readUshort(i,r),r+=2,l.maxComponentDepth=a.readUshort(i,r),r+=2),l},e.name={},e.name.parse=function(i,r,o){var a=e._bin,l={};a.readUshort(i,r),r+=2;var c=a.readUshort(i,r);r+=2,a.readUshort(i,r);for(var h,u=["copyright","fontFamily","fontSubfamily","ID","fullName","version","postScriptName","trademark","manufacturer","designer","description","urlVendor","urlDesigner","licence","licenceURL","---","typoFamilyName","typoSubfamilyName","compatibleFull","sampleText","postScriptCID","wwsFamilyName","wwsSubfamilyName","lightPalette","darkPalette"],f=r+=2,d=0;d<c;d++){var p=a.readUshort(i,r);r+=2;var _=a.readUshort(i,r);r+=2;var g=a.readUshort(i,r);r+=2;var m=a.readUshort(i,r);r+=2;var x=a.readUshort(i,r);r+=2;var y=a.readUshort(i,r);r+=2;var v,A=u[m],w=f+12*c+y;if(p==0)v=a.readUnicode(i,w,x/2);else if(p==3&&_==0)v=a.readUnicode(i,w,x/2);else if(_==0)v=a.readASCII(i,w,x);else if(_==1)v=a.readUnicode(i,w,x/2);else if(_==3)v=a.readUnicode(i,w,x/2);else{if(p!=1)throw"unknown encoding "+_+", platformID: "+p;v=a.readASCII(i,w,x),console.debug("reading unknown MAC encoding "+_+" as ASCII")}var T="p"+p+","+g.toString(16);l[T]==null&&(l[T]={}),l[T][A!==void 0?A:m]=v,l[T]._lang=g}for(var C in l)if(l[C].postScriptName!=null&&l[C]._lang==1033)return l[C];for(var C in l)if(l[C].postScriptName!=null&&l[C]._lang==0)return l[C];for(var C in l)if(l[C].postScriptName!=null&&l[C]._lang==3084)return l[C];for(var C in l)if(l[C].postScriptName!=null)return l[C];for(var C in l){h=C;break}return console.debug("returning name table with languageID "+l[h]._lang),l[h]},e["OS/2"]={},e["OS/2"].parse=function(i,r,o){var a=e._bin.readUshort(i,r);r+=2;var l={};if(a==0)e["OS/2"].version0(i,r,l);else if(a==1)e["OS/2"].version1(i,r,l);else if(a==2||a==3||a==4)e["OS/2"].version2(i,r,l);else{if(a!=5)throw"unknown OS/2 table version: "+a;e["OS/2"].version5(i,r,l)}return l},e["OS/2"].version0=function(i,r,o){var a=e._bin;return o.xAvgCharWidth=a.readShort(i,r),r+=2,o.usWeightClass=a.readUshort(i,r),r+=2,o.usWidthClass=a.readUshort(i,r),r+=2,o.fsType=a.readUshort(i,r),r+=2,o.ySubscriptXSize=a.readShort(i,r),r+=2,o.ySubscriptYSize=a.readShort(i,r),r+=2,o.ySubscriptXOffset=a.readShort(i,r),r+=2,o.ySubscriptYOffset=a.readShort(i,r),r+=2,o.ySuperscriptXSize=a.readShort(i,r),r+=2,o.ySuperscriptYSize=a.readShort(i,r),r+=2,o.ySuperscriptXOffset=a.readShort(i,r),r+=2,o.ySuperscriptYOffset=a.readShort(i,r),r+=2,o.yStrikeoutSize=a.readShort(i,r),r+=2,o.yStrikeoutPosition=a.readShort(i,r),r+=2,o.sFamilyClass=a.readShort(i,r),r+=2,o.panose=a.readBytes(i,r,10),r+=10,o.ulUnicodeRange1=a.readUint(i,r),r+=4,o.ulUnicodeRange2=a.readUint(i,r),r+=4,o.ulUnicodeRange3=a.readUint(i,r),r+=4,o.ulUnicodeRange4=a.readUint(i,r),r+=4,o.achVendID=[a.readInt8(i,r),a.readInt8(i,r+1),a.readInt8(i,r+2),a.readInt8(i,r+3)],r+=4,o.fsSelection=a.readUshort(i,r),r+=2,o.usFirstCharIndex=a.readUshort(i,r),r+=2,o.usLastCharIndex=a.readUshort(i,r),r+=2,o.sTypoAscender=a.readShort(i,r),r+=2,o.sTypoDescender=a.readShort(i,r),r+=2,o.sTypoLineGap=a.readShort(i,r),r+=2,o.usWinAscent=a.readUshort(i,r),r+=2,o.usWinDescent=a.readUshort(i,r),r+=2},e["OS/2"].version1=function(i,r,o){var a=e._bin;return r=e["OS/2"].version0(i,r,o),o.ulCodePageRange1=a.readUint(i,r),r+=4,o.ulCodePageRange2=a.readUint(i,r),r+=4},e["OS/2"].version2=function(i,r,o){var a=e._bin;return r=e["OS/2"].version1(i,r,o),o.sxHeight=a.readShort(i,r),r+=2,o.sCapHeight=a.readShort(i,r),r+=2,o.usDefault=a.readUshort(i,r),r+=2,o.usBreak=a.readUshort(i,r),r+=2,o.usMaxContext=a.readUshort(i,r),r+=2},e["OS/2"].version5=function(i,r,o){var a=e._bin;return r=e["OS/2"].version2(i,r,o),o.usLowerOpticalPointSize=a.readUshort(i,r),r+=2,o.usUpperOpticalPointSize=a.readUshort(i,r),r+=2},e.post={},e.post.parse=function(i,r,o){var a=e._bin,l={};return l.version=a.readFixed(i,r),r+=4,l.italicAngle=a.readFixed(i,r),r+=4,l.underlinePosition=a.readShort(i,r),r+=2,l.underlineThickness=a.readShort(i,r),r+=2,l},e==null&&(e={}),e.U==null&&(e.U={}),e.U.codeToGlyph=function(i,r){var o=i.cmap,a=-1;if(o.p0e4!=null?a=o.p0e4:o.p3e1!=null?a=o.p3e1:o.p1e0!=null?a=o.p1e0:o.p0e3!=null&&(a=o.p0e3),a==-1)throw"no familiar platform and encoding!";var l=o.tables[a];if(l.format==0)return r>=l.map.length?0:l.map[r];if(l.format==4){for(var c=-1,h=0;h<l.endCount.length;h++)if(r<=l.endCount[h]){c=h;break}return c==-1||l.startCount[c]>r?0:65535&(l.idRangeOffset[c]!=0?l.glyphIdArray[r-l.startCount[c]+(l.idRangeOffset[c]>>1)-(l.idRangeOffset.length-c)]:r+l.idDelta[c])}if(l.format==12){if(r>l.groups[l.groups.length-1][1])return 0;for(h=0;h<l.groups.length;h++){var u=l.groups[h];if(u[0]<=r&&r<=u[1])return u[2]+(r-u[0])}return 0}throw"unknown cmap table format "+l.format},e.U.glyphToPath=function(i,r){var o={cmds:[],crds:[]};if(i.SVG&&i.SVG.entries[r]){var a=i.SVG.entries[r];return a==null?o:(typeof a=="string"&&(a=e.SVG.toPath(a),i.SVG.entries[r]=a),a)}if(i.CFF){var l={x:0,y:0,stack:[],nStems:0,haveWidth:!1,width:i.CFF.Private?i.CFF.Private.defaultWidthX:0,open:!1},c=i.CFF,h=i.CFF.Private;if(c.ROS){for(var u=0;c.FDSelect[u+2]<=r;)u+=2;h=c.FDArray[c.FDSelect[u+1]].Private}e.U._drawCFF(i.CFF.CharStrings[r],l,c,h,o)}else i.glyf&&e.U._drawGlyf(r,i,o);return o},e.U._drawGlyf=function(i,r,o){var a=r.glyf[i];a==null&&(a=r.glyf[i]=e.glyf._parseGlyf(r,i)),a!=null&&(a.noc>-1?e.U._simpleGlyph(a,o):e.U._compoGlyph(a,r,o))},e.U._simpleGlyph=function(i,r){for(var o=0;o<i.noc;o++){for(var a=o==0?0:i.endPts[o-1]+1,l=i.endPts[o],c=a;c<=l;c++){var h=c==a?l:c-1,u=c==l?a:c+1,f=1&i.flags[c],d=1&i.flags[h],p=1&i.flags[u],_=i.xs[c],g=i.ys[c];if(c==a)if(f){if(!d){e.U.P.moveTo(r,_,g);continue}e.U.P.moveTo(r,i.xs[h],i.ys[h])}else d?e.U.P.moveTo(r,i.xs[h],i.ys[h]):e.U.P.moveTo(r,(i.xs[h]+_)/2,(i.ys[h]+g)/2);f?d&&e.U.P.lineTo(r,_,g):p?e.U.P.qcurveTo(r,_,g,i.xs[u],i.ys[u]):e.U.P.qcurveTo(r,_,g,(_+i.xs[u])/2,(g+i.ys[u])/2)}e.U.P.closePath(r)}},e.U._compoGlyph=function(i,r,o){for(var a=0;a<i.parts.length;a++){var l={cmds:[],crds:[]},c=i.parts[a];e.U._drawGlyf(c.glyphIndex,r,l);for(var h=c.m,u=0;u<l.crds.length;u+=2){var f=l.crds[u],d=l.crds[u+1];o.crds.push(f*h.a+d*h.b+h.tx),o.crds.push(f*h.c+d*h.d+h.ty)}for(u=0;u<l.cmds.length;u++)o.cmds.push(l.cmds[u])}},e.U._getGlyphClass=function(i,r){var o=e._lctf.getInterval(r,i);return o==-1?0:r[o+2]},e.U._applySubs=function(i,r,o,a){for(var l=i.length-r-1,c=0;c<o.tabs.length;c++)if(o.tabs[c]!=null){var h,u=o.tabs[c];if(!u.coverage||(h=e._lctf.coverageIndex(u.coverage,i[r]))!=-1){if(o.ltype==1)i[r],u.fmt==1?i[r]=i[r]+u.delta:i[r]=u.newg[h];else if(o.ltype==4)for(var f=u.vals[h],d=0;d<f.length;d++){var p=f[d],_=p.chain.length;if(!(_>l)){for(var g=!0,m=0,x=0;x<_;x++){for(;i[r+m+(1+x)]==-1;)m++;p.chain[x]!=i[r+m+(1+x)]&&(g=!1)}if(g){for(i[r]=p.nglyph,x=0;x<_+m;x++)i[r+x+1]=-1;break}}}else if(o.ltype==5&&u.fmt==2)for(var y=e._lctf.getInterval(u.cDef,i[r]),v=u.cDef[y+2],A=u.scset[v],w=0;w<A.length;w++){var T=A[w],C=T.input;if(!(C.length>l)){for(g=!0,x=0;x<C.length;x++){var b=e._lctf.getInterval(u.cDef,i[r+1+x]);if(y==-1&&u.cDef[b+2]!=C[x]){g=!1;break}}if(g){var M=T.substLookupRecords;for(d=0;d<M.length;d+=2)M[d],M[d+1]}}}else if(o.ltype==6&&u.fmt==3){if(!e.U._glsCovered(i,u.backCvg,r-u.backCvg.length)||!e.U._glsCovered(i,u.inptCvg,r)||!e.U._glsCovered(i,u.ahedCvg,r+u.inptCvg.length))continue;var U=u.lookupRec;for(w=0;w<U.length;w+=2){y=U[w];var L=a[U[w+1]];e.U._applySubs(i,r+y,L,a)}}}}},e.U._glsCovered=function(i,r,o){for(var a=0;a<r.length;a++)if(e._lctf.coverageIndex(r[a],i[o+a])==-1)return!1;return!0},e.U.glyphsToPath=function(i,r,o){for(var a={cmds:[],crds:[]},l=0,c=0;c<r.length;c++){var h=r[c];if(h!=-1){for(var u=c<r.length-1&&r[c+1]!=-1?r[c+1]:0,f=e.U.glyphToPath(i,h),d=0;d<f.crds.length;d+=2)a.crds.push(f.crds[d]+l),a.crds.push(f.crds[d+1]);for(o&&a.cmds.push(o),d=0;d<f.cmds.length;d++)a.cmds.push(f.cmds[d]);o&&a.cmds.push("X"),l+=i.hmtx.aWidth[h],c<r.length-1&&(l+=e.U.getPairAdjustment(i,h,u))}}return a},e.U.P={},e.U.P.moveTo=function(i,r,o){i.cmds.push("M"),i.crds.push(r,o)},e.U.P.lineTo=function(i,r,o){i.cmds.push("L"),i.crds.push(r,o)},e.U.P.curveTo=function(i,r,o,a,l,c,h){i.cmds.push("C"),i.crds.push(r,o,a,l,c,h)},e.U.P.qcurveTo=function(i,r,o,a,l){i.cmds.push("Q"),i.crds.push(r,o,a,l)},e.U.P.closePath=function(i){i.cmds.push("Z")},e.U._drawCFF=function(i,r,o,a,l){for(var c=r.stack,h=r.nStems,u=r.haveWidth,f=r.width,d=r.open,p=0,_=r.x,g=r.y,m=0,x=0,y=0,v=0,A=0,w=0,T=0,C=0,b=0,M=0,U={val:0,size:0};p<i.length;){e.CFF.getCharString(i,p,U);var L=U.val;if(p+=U.size,L=="o1"||L=="o18")c.length%2!=0&&!u&&(f=c.shift()+a.nominalWidthX),h+=c.length>>1,c.length=0,u=!0;else if(L=="o3"||L=="o23")c.length%2!=0&&!u&&(f=c.shift()+a.nominalWidthX),h+=c.length>>1,c.length=0,u=!0;else if(L=="o4")c.length>1&&!u&&(f=c.shift()+a.nominalWidthX,u=!0),d&&e.U.P.closePath(l),g+=c.pop(),e.U.P.moveTo(l,_,g),d=!0;else if(L=="o5")for(;c.length>0;)_+=c.shift(),g+=c.shift(),e.U.P.lineTo(l,_,g);else if(L=="o6"||L=="o7")for(var F=c.length,N=L=="o6",Q=0;Q<F;Q++){var V=c.shift();N?_+=V:g+=V,N=!N,e.U.P.lineTo(l,_,g)}else if(L=="o8"||L=="o24"){F=c.length;for(var le=0;le+6<=F;)m=_+c.shift(),x=g+c.shift(),y=m+c.shift(),v=x+c.shift(),_=y+c.shift(),g=v+c.shift(),e.U.P.curveTo(l,m,x,y,v,_,g),le+=6;L=="o24"&&(_+=c.shift(),g+=c.shift(),e.U.P.lineTo(l,_,g))}else{if(L=="o11")break;if(L=="o1234"||L=="o1235"||L=="o1236"||L=="o1237")L=="o1234"&&(x=g,y=(m=_+c.shift())+c.shift(),M=v=x+c.shift(),w=v,C=g,_=(T=(A=(b=y+c.shift())+c.shift())+c.shift())+c.shift(),e.U.P.curveTo(l,m,x,y,v,b,M),e.U.P.curveTo(l,A,w,T,C,_,g)),L=="o1235"&&(m=_+c.shift(),x=g+c.shift(),y=m+c.shift(),v=x+c.shift(),b=y+c.shift(),M=v+c.shift(),A=b+c.shift(),w=M+c.shift(),T=A+c.shift(),C=w+c.shift(),_=T+c.shift(),g=C+c.shift(),c.shift(),e.U.P.curveTo(l,m,x,y,v,b,M),e.U.P.curveTo(l,A,w,T,C,_,g)),L=="o1236"&&(m=_+c.shift(),x=g+c.shift(),y=m+c.shift(),M=v=x+c.shift(),w=v,T=(A=(b=y+c.shift())+c.shift())+c.shift(),C=w+c.shift(),_=T+c.shift(),e.U.P.curveTo(l,m,x,y,v,b,M),e.U.P.curveTo(l,A,w,T,C,_,g)),L=="o1237"&&(m=_+c.shift(),x=g+c.shift(),y=m+c.shift(),v=x+c.shift(),b=y+c.shift(),M=v+c.shift(),A=b+c.shift(),w=M+c.shift(),T=A+c.shift(),C=w+c.shift(),Math.abs(T-_)>Math.abs(C-g)?_=T+c.shift():g=C+c.shift(),e.U.P.curveTo(l,m,x,y,v,b,M),e.U.P.curveTo(l,A,w,T,C,_,g));else if(L=="o14"){if(c.length>0&&!u&&(f=c.shift()+o.nominalWidthX,u=!0),c.length==4){var Z=c.shift(),te=c.shift(),K=c.shift(),O=c.shift(),J=e.CFF.glyphBySE(o,K),ue=e.CFF.glyphBySE(o,O);e.U._drawCFF(o.CharStrings[J],r,o,a,l),r.x=Z,r.y=te,e.U._drawCFF(o.CharStrings[ue],r,o,a,l)}d&&(e.U.P.closePath(l),d=!1)}else if(L=="o19"||L=="o20")c.length%2!=0&&!u&&(f=c.shift()+a.nominalWidthX),h+=c.length>>1,c.length=0,u=!0,p+=h+7>>3;else if(L=="o21")c.length>2&&!u&&(f=c.shift()+a.nominalWidthX,u=!0),g+=c.pop(),_+=c.pop(),d&&e.U.P.closePath(l),e.U.P.moveTo(l,_,g),d=!0;else if(L=="o22")c.length>1&&!u&&(f=c.shift()+a.nominalWidthX,u=!0),_+=c.pop(),d&&e.U.P.closePath(l),e.U.P.moveTo(l,_,g),d=!0;else if(L=="o25"){for(;c.length>6;)_+=c.shift(),g+=c.shift(),e.U.P.lineTo(l,_,g);m=_+c.shift(),x=g+c.shift(),y=m+c.shift(),v=x+c.shift(),_=y+c.shift(),g=v+c.shift(),e.U.P.curveTo(l,m,x,y,v,_,g)}else if(L=="o26")for(c.length%2&&(_+=c.shift());c.length>0;)m=_,x=g+c.shift(),_=y=m+c.shift(),g=(v=x+c.shift())+c.shift(),e.U.P.curveTo(l,m,x,y,v,_,g);else if(L=="o27")for(c.length%2&&(g+=c.shift());c.length>0;)x=g,y=(m=_+c.shift())+c.shift(),v=x+c.shift(),_=y+c.shift(),g=v,e.U.P.curveTo(l,m,x,y,v,_,g);else if(L=="o10"||L=="o29"){var k=L=="o10"?a:o;if(c.length==0)console.debug("error: empty stack");else{var X=c.pop(),ce=k.Subrs[X+k.Bias];r.x=_,r.y=g,r.nStems=h,r.haveWidth=u,r.width=f,r.open=d,e.U._drawCFF(ce,r,o,a,l),_=r.x,g=r.y,h=r.nStems,u=r.haveWidth,f=r.width,d=r.open}}else if(L=="o30"||L=="o31"){var j=c.length,G=(le=0,L=="o31");for(le+=j-(F=-3&j);le<F;)G?(x=g,y=(m=_+c.shift())+c.shift(),g=(v=x+c.shift())+c.shift(),F-le==5?(_=y+c.shift(),le++):_=y,G=!1):(m=_,x=g+c.shift(),y=m+c.shift(),v=x+c.shift(),_=y+c.shift(),F-le==5?(g=v+c.shift(),le++):g=v,G=!0),e.U.P.curveTo(l,m,x,y,v,_,g),le+=4}else{if((L+"").charAt(0)=="o")throw console.debug("Unknown operation: "+L,i),L;c.push(L)}}}r.x=_,r.y=g,r.nStems=h,r.haveWidth=u,r.width=f,r.open=d};var t=e,n={Typr:t};return s.Typr=t,s.default=n,Object.defineProperty(s,"__esModule",{value:!0}),s})({}).Typr}/*!
Custom bundle of woff2otf (https://github.com/arty-name/woff2otf) with fflate
(https://github.com/101arrowz/fflate) for use in Troika text rendering. 
Original licenses apply: 
- fflate: https://github.com/101arrowz/fflate/blob/master/LICENSE (MIT)
- woff2otf.js: https://github.com/arty-name/woff2otf/blob/master/woff2otf.js (Apache2)
*/function bb(){return(function(s){var e=Uint8Array,t=Uint16Array,n=Uint32Array,i=new e([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),r=new e([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),o=new e([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),a=function(L,F){for(var N=new t(31),Q=0;Q<31;++Q)N[Q]=F+=1<<L[Q-1];var V=new n(N[30]);for(Q=1;Q<30;++Q)for(var le=N[Q];le<N[Q+1];++le)V[le]=le-N[Q]<<5|Q;return[N,V]},l=a(i,2),c=l[0],h=l[1];c[28]=258,h[258]=28;for(var u=a(r,0)[0],f=new t(32768),d=0;d<32768;++d){var p=(43690&d)>>>1|(21845&d)<<1;p=(61680&(p=(52428&p)>>>2|(13107&p)<<2))>>>4|(3855&p)<<4,f[d]=((65280&p)>>>8|(255&p)<<8)>>>1}var _=function(L,F,N){for(var Q=L.length,V=0,le=new t(F);V<Q;++V)++le[L[V]-1];var Z,te=new t(F);for(V=0;V<F;++V)te[V]=te[V-1]+le[V-1]<<1;{Z=new t(1<<F);var K=15-F;for(V=0;V<Q;++V)if(L[V])for(var O=V<<4|L[V],J=F-L[V],ue=te[L[V]-1]++<<J,k=ue|(1<<J)-1;ue<=k;++ue)Z[f[ue]>>>K]=O}return Z},g=new e(288);for(d=0;d<144;++d)g[d]=8;for(d=144;d<256;++d)g[d]=9;for(d=256;d<280;++d)g[d]=7;for(d=280;d<288;++d)g[d]=8;var m=new e(32);for(d=0;d<32;++d)m[d]=5;var x=_(g,9),y=_(m,5),v=function(L){for(var F=L[0],N=1;N<L.length;++N)L[N]>F&&(F=L[N]);return F},A=function(L,F,N){var Q=F/8|0;return(L[Q]|L[Q+1]<<8)>>(7&F)&N},w=function(L,F){var N=F/8|0;return(L[N]|L[N+1]<<8|L[N+2]<<16)>>(7&F)},T=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],C=function(L,F,N){var Q=new Error(F||T[L]);if(Q.code=L,Error.captureStackTrace&&Error.captureStackTrace(Q,C),!N)throw Q;return Q},b=function(L,F,N){var Q=L.length;if(!Q||N&&!N.l&&Q<5)return F||new e(0);var V=!F||N,le=!N||N.i;N||(N={}),F||(F=new e(3*Q));var Z,te=function(Te){var W=F.length;if(Te>W){var ve=new e(Math.max(2*W,Te));ve.set(F),F=ve}},K=N.f||0,O=N.p||0,J=N.b||0,ue=N.l,k=N.d,X=N.m,ce=N.n,j=8*Q;do{if(!ue){N.f=K=A(L,O,1);var G=A(L,O+1,3);if(O+=3,!G){var pe=L[(fe=((Z=O)/8|0)+(7&Z&&1)+4)-4]|L[fe-3]<<8,se=fe+pe;if(se>Q){le&&C(0);break}V&&te(J+pe),F.set(L.subarray(fe,se),J),N.b=J+=pe,N.p=O=8*se;continue}if(G==1)ue=x,k=y,X=9,ce=5;else if(G==2){var ae=A(L,O,31)+257,B=A(L,O+10,15)+4,ie=ae+A(L,O+5,31)+1;O+=14;for(var R=new e(ie),oe=new e(19),$=0;$<B;++$)oe[o[$]]=A(L,O+3*$,7);O+=3*B;var me=v(oe),ee=(1<<me)-1,de=_(oe,me);for($=0;$<ie;){var fe,E=de[A(L,O,ee)];if(O+=15&E,(fe=E>>>4)<16)R[$++]=fe;else{var S=0,D=0;for(fe==16?(D=3+A(L,O,3),O+=2,S=R[$-1]):fe==17?(D=3+A(L,O,7),O+=3):fe==18&&(D=11+A(L,O,127),O+=7);D--;)R[$++]=S}}var Y=R.subarray(0,ae),q=R.subarray(ae);X=v(Y),ce=v(q),ue=_(Y,X),k=_(q,ce)}else C(1);if(O>j){le&&C(0);break}}V&&te(J+131072);for(var re=(1<<X)-1,Se=(1<<ce)-1,ye=O;;ye=O){var be=(S=ue[w(L,O)&re])>>>4;if((O+=15&S)>j){le&&C(0);break}if(S||C(2),be<256)F[J++]=be;else{if(be==256){ye=O,ue=null;break}var Le=be-254;if(be>264){var we=i[$=be-257];Le=A(L,O,(1<<we)-1)+c[$],O+=we}var Re=k[w(L,O)&Se],Ie=Re>>>4;if(Re||C(3),O+=15&Re,q=u[Ie],Ie>3&&(we=r[Ie],q+=w(L,O)&(1<<we)-1,O+=we),O>j){le&&C(0);break}V&&te(J+131072);for(var De=J+Le;J<De;J+=4)F[J]=F[J-q],F[J+1]=F[J+1-q],F[J+2]=F[J+2-q],F[J+3]=F[J+3-q];J=De}}N.l=ue,N.p=ye,N.b=J,ue&&(K=1,N.m=X,N.d=k,N.n=ce)}while(!K);return J==F.length?F:(function(Te,W,ve){(ve==null||ve>Te.length)&&(ve=Te.length);var Ue=new(Te instanceof t?t:Te instanceof n?n:e)(ve-W);return Ue.set(Te.subarray(W,ve)),Ue})(F,0,J)},M=new e(0),U=typeof TextDecoder<"u"&&new TextDecoder;try{U.decode(M,{stream:!0})}catch{}return s.convert_streams=function(L){var F=new DataView(L),N=0;function Q(){var ae=F.getUint16(N);return N+=2,ae}function V(){var ae=F.getUint32(N);return N+=4,ae}function le(ae){pe.setUint16(se,ae),se+=2}function Z(ae){pe.setUint32(se,ae),se+=4}for(var te={signature:V(),flavor:V(),length:V(),numTables:Q(),reserved:Q(),totalSfntSize:V(),majorVersion:Q(),minorVersion:Q(),metaOffset:V(),metaLength:V(),metaOrigLength:V(),privOffset:V(),privLength:V()},K=0;Math.pow(2,K)<=te.numTables;)K++;K--;for(var O=16*Math.pow(2,K),J=16*te.numTables-O,ue=12,k=[],X=0;X<te.numTables;X++)k.push({tag:V(),offset:V(),compLength:V(),origLength:V(),origChecksum:V()}),ue+=16;var ce,j=new Uint8Array(12+16*k.length+k.reduce((function(ae,B){return ae+B.origLength+4}),0)),G=j.buffer,pe=new DataView(G),se=0;return Z(te.flavor),le(te.numTables),le(O),le(K),le(J),k.forEach((function(ae){Z(ae.tag),Z(ae.origChecksum),Z(ue),Z(ae.origLength),ae.outOffset=ue,(ue+=ae.origLength)%4!=0&&(ue+=4-ue%4)})),k.forEach((function(ae){var B,ie=L.slice(ae.offset,ae.offset+ae.compLength);if(ae.compLength!=ae.origLength){var R=new Uint8Array(ae.origLength);B=new Uint8Array(ie,2),b(B,R)}else R=new Uint8Array(ie);j.set(R,ae.outOffset);var oe=0;(ue=ae.outOffset+ae.origLength)%4!=0&&(oe=4-ue%4),j.set(new Uint8Array(oe).buffer,ae.outOffset+ae.origLength),ce=ue+oe})),G.slice(0,ce)},Object.defineProperty(s,"__esModule",{value:!0}),s})({}).convert_streams}function wb(s,e){const t={M:2,L:2,Q:4,C:6,Z:0},n={C:"18g,ca,368,1kz",D:"17k,6,2,2+4,5+c,2+6,2+1,10+1,9+f,j+11,2+1,a,2,2+1,15+2,3,j+2,6+3,2+8,2,2,2+1,w+a,4+e,3+3,2,3+2,3+5,23+w,2f+4,3,2+9,2,b,2+3,3,1k+9,6+1,3+1,2+2,2+d,30g,p+y,1,1+1g,f+x,2,sd2+1d,jf3+4,f+3,2+4,2+2,b+3,42,2,4+2,2+1,2,3,t+1,9f+w,2,el+2,2+g,d+2,2l,2+1,5,3+1,2+1,2,3,6,16wm+1v",R:"17m+3,2,2,6+3,m,15+2,2+2,h+h,13,3+8,2,2,3+1,2,p+1,x,5+4,5,a,2,2,3,u,c+2,g+1,5,2+1,4+1,5j,6+1,2,b,2+2,f,2+1,1s+2,2,3+1,7,1ez0,2,2+1,4+4,b,4,3,b,42,2+2,4,3,2+1,2,o+3,ae,ep,x,2o+2,3+1,3,5+1,6",L:"x9u,jff,a,fd,jv",T:"4t,gj+33,7o+4,1+1,7c+18,2,2+1,2+1,2,21+a,2,1b+k,h,2u+6,3+5,3+1,2+3,y,2,v+q,2k+a,1n+8,a,p+3,2+8,2+2,2+4,18+2,3c+e,2+v,1k,2,5+7,5,4+6,b+1,u,1n,5+3,9,l+1,r,3+1,1m,5+1,5+1,3+2,4,v+1,4,c+1,1m,5+4,2+1,5,l+1,n+5,2,1n,3,2+3,9,8+1,c+1,v,1q,d,1f,4,1m+2,6+2,2+3,8+1,c+1,u,1n,3,7,6+1,l+1,t+1,1m+1,5+3,9,l+1,u,21,8+2,2,2j,3+6,d+7,2r,3+8,c+5,23+1,s,2,2,1k+d,2+4,2+1,6+a,2+z,a,2v+3,2+5,2+1,3+1,q+1,5+2,h+3,e,3+1,7,g,jk+2,qb+2,u+2,u+1,v+1,1t+1,2+6,9,3+a,a,1a+2,3c+1,z,3b+2,5+1,a,7+2,64+1,3,1n,2+6,2,2,3+7,7+9,3,1d+d,1,1+1,1s+3,1d,2+4,2,6,15+8,d+1,x+3,3+1,2+2,1l,2+1,4,2+2,1n+7,3+1,49+2,2+c,2+6,5,7,4+1,5j+1l,2+4,ek,3+1,r+4,1e+4,6+5,2p+c,1+3,1,1+2,1+b,2db+2,3y,2p+v,ff+3,30+1,n9x,1+2,2+9,x+1,29+1,7l,4,5,q+1,6,48+1,r+h,e,13+7,q+a,1b+2,1d,3+3,3+1,14,1w+5,3+1,3+1,d,9,1c,1g,2+2,3+1,6+1,2,17+1,9,6n,3,5,fn5,ki+f,h+f,5s,6y+2,ea,6b,46+4,1af+2,2+1,6+3,15+2,5,4m+1,fy+3,as+1,4a+a,4x,1j+e,1l+2,1e+3,3+1,1y+2,11+4,2+7,1r,d+1,1h+8,b+3,3,2o+2,3,2+1,7,4h,4+7,m+1,1m+1,4,12+6,4+4,5g+7,3+2,2,o,2d+5,2,5+1,2+1,6n+3,7+1,2+1,s+1,2e+7,3,2+1,2z,2,3+5,2,2u+2,3+3,2+4,78+8,2+1,75+1,2,5,41+3,3+1,5,x+9,15+5,3+3,9,a+5,3+2,1b+c,2+1,bb+6,2+5,2,2b+l,3+6,2+1,2+1,3f+5,4,2+1,2+6,2,21+1,4,2,9o+1,470+8,at4+4,1o+6,t5,1s+3,2a,f5l+1,2+3,43o+2,a+7,1+7,3+6,v+3,45+2,1j0+1i,5+1d,9,f,n+4,2+e,11t+6,2+g,3+6,2+1,2+4,7a+6,c6+3,15t+6,32+6,1,gzau,v+2n,3l+6n"},i=1,r=2,o=4,a=8,l=16,c=32;let h;function u(T){if(!h){const C={R:r,L:i,D:o,C:l,U:c,T:a};h=new Map;for(let b in n){let M=0;n[b].split(",").forEach(U=>{let[L,F]=U.split("+");L=parseInt(L,36),F=F?parseInt(F,36):0,h.set(M+=L,C[b]);for(let N=F;N--;)h.set(++M,C[b])})}}return h.get(T)||c}const f=1,d=2,p=3,_=4,g=[null,"isol","init","fina","medi"];function m(T){const C=new Uint8Array(T.length);let b=c,M=f,U=-1;for(let L=0;L<T.length;L++){const F=T.codePointAt(L);let N=u(F)|0,Q=f;N&a||(b&(i|o|l)?N&(r|o|l)?(Q=p,(M===f||M===p)&&C[U]++):N&(i|c)&&(M===d||M===_)&&C[U]--:b&(r|c)&&(M===d||M===_)&&C[U]--,M=C[L]=Q,b=N,U=L,F>65535&&L++)}return C}function x(T,C){const b=[];for(let U=0;U<C.length;U++){const L=C.codePointAt(U);L>65535&&U++,b.push(s.U.codeToGlyph(T,L))}const M=T.GSUB;if(M){const{lookupList:U,featureList:L}=M;let F;const N=/^(rlig|liga|mset|isol|init|fina|medi|half|pres|blws|ccmp)$/,Q=[];L.forEach(V=>{if(N.test(V.tag))for(let le=0;le<V.tab.length;le++){if(Q[V.tab[le]])continue;Q[V.tab[le]]=!0;const Z=U[V.tab[le]],te=/^(isol|init|fina|medi)$/.test(V.tag);te&&!F&&(F=m(C));for(let K=0;K<b.length;K++)(!F||!te||g[F[K]]===V.tag)&&s.U._applySubs(b,K,Z,U)}})}return b}function y(T,C){const b=new Int16Array(C.length*3);let M=0;for(;M<C.length;M++){const N=C[M];if(N===-1)continue;b[M*3+2]=T.hmtx.aWidth[N];const Q=T.GPOS;if(Q){const V=Q.lookupList;for(let le=0;le<V.length;le++){const Z=V[le];for(let te=0;te<Z.tabs.length;te++){const K=Z.tabs[te];if(Z.ltype===1){if(s._lctf.coverageIndex(K.coverage,N)!==-1&&K.pos){F(K.pos,M);break}}else if(Z.ltype===2){let O=null,J=U();if(J!==-1){const ue=s._lctf.coverageIndex(K.coverage,C[J]);if(ue!==-1){if(K.fmt===1){const k=K.pairsets[ue];for(let X=0;X<k.length;X++)k[X].gid2===N&&(O=k[X])}else if(K.fmt===2){const k=s.U._getGlyphClass(C[J],K.classDef1),X=s.U._getGlyphClass(N,K.classDef2);O=K.matrix[k][X]}if(O){O.val1&&F(O.val1,J),O.val2&&F(O.val2,M);break}}}}else if(Z.ltype===4){const O=s._lctf.coverageIndex(K.markCoverage,N);if(O!==-1){const J=U(L),ue=J===-1?-1:s._lctf.coverageIndex(K.baseCoverage,C[J]);if(ue!==-1){const k=K.markArray[O],X=K.baseArray[ue][k.markClass];b[M*3]=X.x-k.x+b[J*3]-b[J*3+2],b[M*3+1]=X.y-k.y+b[J*3+1];break}}}else if(Z.ltype===6){const O=s._lctf.coverageIndex(K.mark1Coverage,N);if(O!==-1){const J=U();if(J!==-1){const ue=C[J];if(v(T,ue)===3){const k=s._lctf.coverageIndex(K.mark2Coverage,ue);if(k!==-1){const X=K.mark1Array[O],ce=K.mark2Array[k][X.markClass];b[M*3]=ce.x-X.x+b[J*3]-b[J*3+2],b[M*3+1]=ce.y-X.y+b[J*3+1];break}}}}}}}}else if(T.kern&&!T.cff){const V=U();if(V!==-1){const le=T.kern.glyph1.indexOf(C[V]);if(le!==-1){const Z=T.kern.rval[le].glyph2.indexOf(N);Z!==-1&&(b[V*3+2]+=T.kern.rval[le].vals[Z])}}}}return b;function U(N){for(let Q=M-1;Q>=0;Q--)if(C[Q]!==-1&&(!N||N(C[Q])))return Q;return-1}function L(N){return v(T,N)===1}function F(N,Q){for(let V=0;V<3;V++)b[Q*3+V]+=N[V]||0}}function v(T,C){const b=T.GDEF&&T.GDEF.glyphClassDef;return b?s.U._getGlyphClass(C,b):0}function A(...T){for(let C=0;C<T.length;C++)if(typeof T[C]=="number")return T[C]}function w(T){const C=Object.create(null),b=T["OS/2"],M=T.hhea,U=T.head.unitsPerEm,L=A(b&&b.sTypoAscender,M&&M.ascender,U),F={unitsPerEm:U,ascender:L,descender:A(b&&b.sTypoDescender,M&&M.descender,0),capHeight:A(b&&b.sCapHeight,L),xHeight:A(b&&b.sxHeight,L),lineGap:A(b&&b.sTypoLineGap,M&&M.lineGap),supportsCodePoint(N){return s.U.codeToGlyph(T,N)>0},forEachGlyph(N,Q,V,le){let Z=0;const te=1/F.unitsPerEm*Q,K=x(T,N);let O=0;const J=y(T,K);return K.forEach((ue,k)=>{if(ue!==-1){let X=C[ue];if(!X){const{cmds:ce,crds:j}=s.U.glyphToPath(T,ue);let G="",pe=0;for(let R=0,oe=ce.length;R<oe;R++){const $=t[ce[R]];G+=ce[R];for(let me=1;me<=$;me++)G+=(me>1?",":"")+j[pe++]}let se,ae,B,ie;if(j.length){se=ae=1/0,B=ie=-1/0;for(let R=0,oe=j.length;R<oe;R+=2){let $=j[R],me=j[R+1];$<se&&(se=$),me<ae&&(ae=me),$>B&&(B=$),me>ie&&(ie=me)}}else se=B=ae=ie=0;X=C[ue]={index:ue,advanceWidth:T.hmtx.aWidth[ue],xMin:se,yMin:ae,xMax:B,yMax:ie,path:G}}le.call(null,X,Z+J[k*3]*te,J[k*3+1]*te,O),Z+=J[k*3+2]*te,V&&(Z+=V*Q)}O+=N.codePointAt(O)>65535?2:1}),Z}};return F}return function(C){const b=new Uint8Array(C,0,4),M=s._bin.readASCII(b,0,4);if(M==="wOFF")C=e(C);else if(M==="wOF2")throw new Error("woff2 fonts not supported");return w(s.parse(C)[0])}}const Eb=ss({name:"Typr Font Parser",dependencies:[Sb,bb,wb],init(s,e,t){const n=s(),i=e();return t(n,i)}});/*!
Custom bundle of @unicode-font-resolver/client v1.0.2 (https://github.com/lojjic/unicode-font-resolver)
for use in Troika text rendering. 
Original MIT license applies
*/function Tb(){return(function(s){var e=function(){this.buckets=new Map};e.prototype.add=function(y){var v=y>>5;this.buckets.set(v,(this.buckets.get(v)||0)|1<<(31&y))},e.prototype.has=function(y){var v=this.buckets.get(y>>5);return v!==void 0&&(v&1<<(31&y))!=0},e.prototype.serialize=function(){var y=[];return this.buckets.forEach((function(v,A){y.push((+A).toString(36)+":"+v.toString(36))})),y.join(",")},e.prototype.deserialize=function(y){var v=this;this.buckets.clear(),y.split(",").forEach((function(A){var w=A.split(":");v.buckets.set(parseInt(w[0],36),parseInt(w[1],36))}))};var t=Math.pow(2,8),n=t-1,i=~n;function r(y){var v=(function(w){return w&i})(y).toString(16),A=(function(w){return(w&i)+t-1})(y).toString(16);return"codepoint-index/plane"+(y>>16)+"/"+v+"-"+A+".json"}function o(y,v){var A=y&n,w=v.codePointAt(A/6|0);return((w=(w||48)-48)&1<<A%6)!=0}function a(y,v){var A;(A=y,A.replace(/U\+/gi,"").replace(/^,+|,+$/g,"").split(/,+/).map((function(w){return w.split("-").map((function(T){return parseInt(T.trim(),16)}))}))).forEach((function(w){var T=w[0],C=w[1];C===void 0&&(C=T),v(T,C)}))}function l(y,v){a(y,(function(A,w){for(var T=A;T<=w;T++)v(T)}))}var c={},h={},u=new WeakMap,f="https://cdn.jsdelivr.net/gh/lojjic/unicode-font-resolver@v1.0.1/packages/data";function d(y){var v=u.get(y);return v||(v=new e,l(y.ranges,(function(A){return v.add(A)})),u.set(y,v)),v}var p,_=new Map;function g(y,v,A){return y[v]?v:y[A]?A:(function(w){for(var T in w)return T})(y)}function m(y,v){var A=v;if(!y.includes(A)){A=1/0;for(var w=0;w<y.length;w++)Math.abs(y[w]-v)<Math.abs(A-v)&&(A=y[w])}return A}function x(y){return p||(p=new Set,l("9-D,20,85,A0,1680,2000-200A,2028-202F,205F,3000",(function(v){p.add(v)}))),p.has(y)}return s.CodePointSet=e,s.clearCache=function(){c={},h={}},s.getFontsForString=function(y,v){v===void 0&&(v={});var A,w=v.lang;w===void 0&&(w=new RegExp("\\p{Script=Hangul}","u").test(A=y)?"ko":new RegExp("\\p{Script=Hiragana}|\\p{Script=Katakana}","u").test(A)?"ja":"en");var T=v.category;T===void 0&&(T="sans-serif");var C=v.style;C===void 0&&(C="normal");var b=v.weight;b===void 0&&(b=400);var M=(v.dataUrl||f).replace(/\/$/g,""),U=new Map,L=new Uint8Array(y.length),F={},N={},Q=new Array(y.length),V=new Map,le=!1;function Z(O){var J=_.get(O);return J||(J=fetch(M+"/"+O).then((function(ue){if(!ue.ok)throw new Error(ue.statusText);return ue.json().then((function(k){if(!Array.isArray(k)||k[0]!==1)throw new Error("Incorrect schema version; need 1, got "+k[0]);return k[1]}))})).catch((function(ue){if(M!==f)return le||(console.error('unicode-font-resolver: Failed loading from dataUrl "'+M+'", trying default CDN. '+ue.message),le=!0),M=f,_.delete(O),Z(O);throw ue})),_.set(O,J)),J}for(var te=function(O){var J=y.codePointAt(O),ue=r(J);Q[O]=ue,c[ue]||V.has(ue)||V.set(ue,Z(ue).then((function(k){c[ue]=k}))),J>65535&&(O++,K=O)},K=0;K<y.length;K++)te(K);return Promise.all(V.values()).then((function(){V.clear();for(var O=function(ue){var k=y.codePointAt(ue),X=null,ce=c[Q[ue]],j=void 0;for(var G in ce){var pe=N[G];if(pe===void 0&&(pe=N[G]=new RegExp(G).test(w||"en")),pe){for(var se in j=G,ce[G])if(o(k,ce[G][se])){X=se;break}break}}if(!X){e:for(var ae in ce)if(ae!==j){for(var B in ce[ae])if(o(k,ce[ae][B])){X=B;break e}}}X||(console.debug("No font coverage for U+"+k.toString(16)),X="latin"),Q[ue]=X,h[X]||V.has(X)||V.set(X,Z("font-meta/"+X+".json").then((function(ie){h[X]=ie}))),k>65535&&(ue++,J=ue)},J=0;J<y.length;J++)O(J);return Promise.all(V.values())})).then((function(){for(var O,J=null,ue=0;ue<y.length;ue++){var k=y.codePointAt(ue);if(J&&(x(k)||d(J).has(k)))L[ue]=L[ue-1];else{J=h[Q[ue]];var X=F[J.id];if(!X){var ce=J.typeforms,j=g(ce,T,"sans-serif"),G=g(ce[j],C,"normal"),pe=m((O=ce[j])===null||O===void 0?void 0:O[G],b);X=F[J.id]=M+"/font-files/"+J.id+"/"+j+"."+G+"."+pe+".woff"}var se=U.get(X);se==null&&(se=U.size,U.set(X,se)),L[ue]=se}k>65535&&(ue++,L[ue]=L[ue-1])}return{fontUrls:Array.from(U.keys()),chars:L}}))},Object.defineProperty(s,"__esModule",{value:!0}),s})({})}function Ab(s,e){const t=Object.create(null),n=Object.create(null);function i(o,a){const l=c=>{console.error(`Failure loading font ${o}`,c)};try{const c=new XMLHttpRequest;c.open("get",o,!0),c.responseType="arraybuffer",c.onload=function(){if(c.status>=400)l(new Error(c.statusText));else if(c.status>0)try{const h=s(c.response);h.src=o,a(h)}catch(h){l(h)}},c.onerror=l,c.send()}catch(c){l(c)}}function r(o,a){let l=t[o];l?a(l):n[o]?n[o].push(a):(n[o]=[a],i(o,c=>{c.src=o,t[o]=c,n[o].forEach(h=>h(c)),delete n[o]}))}return function(o,a,{lang:l,fonts:c=[],style:h="normal",weight:u="normal",unicodeFontsURL:f}={}){const d=new Uint8Array(o.length),p=[];o.length||x();const _=new Map,g=[];if(h!=="italic"&&(h="normal"),typeof u!="number"&&(u=u==="bold"?700:400),c&&!Array.isArray(c)&&(c=[c]),c=c.slice().filter(v=>!v.lang||v.lang.test(l)).reverse(),c.length){let T=0;(function C(b=0){for(let M=b,U=o.length;M<U;M++){const L=o.codePointAt(M);if(T===1&&p[d[M-1]].supportsCodePoint(L)||M>0&&/\s/.test(o[M]))d[M]=d[M-1],T===2&&(g[g.length-1][1]=M);else for(let F=d[M],N=c.length;F<=N;F++)if(F===N){const Q=T===2?g[g.length-1]:g[g.length]=[M,M];Q[1]=M,T=2}else{d[M]=F;const{src:Q,unicodeRange:V}=c[F];if(!V||y(L,V)){const le=t[Q];if(!le){r(Q,()=>{C(M)});return}if(le.supportsCodePoint(L)){let Z=_.get(le);typeof Z!="number"&&(Z=p.length,p.push(le),_.set(le,Z)),d[M]=Z,T=1;break}}}L>65535&&M+1<U&&(d[M+1]=d[M],M++,T===2&&(g[g.length-1][1]=M))}m()})()}else g.push([0,o.length-1]),m();function m(){if(g.length){const v=g.map(A=>o.substring(A[0],A[1]+1)).join(`
`);e.getFontsForString(v,{lang:l||void 0,style:h,weight:u,dataUrl:f}).then(({fontUrls:A,chars:w})=>{const T=p.length;let C=0;g.forEach(M=>{for(let U=0,L=M[1]-M[0];U<=L;U++)d[M[0]+U]=w[C++]+T;C++});let b=0;A.forEach((M,U)=>{r(M,L=>{p[U+T]=L,++b===A.length&&x()})})})}else x()}function x(){a({chars:d,fonts:p})}function y(v,A){for(let w=0;w<A.length;w++){const[T,C=T]=A[w];if(T<=v&&v<=C)return!0}return!1}}}const Cb=ss({name:"FontResolver",dependencies:[Ab,Eb,Tb],init(s,e,t){return s(e,t())}});function Rb(s,e){const n=/[\u00AD\u034F\u061C\u115F-\u1160\u17B4-\u17B5\u180B-\u180E\u200B-\u200F\u202A-\u202E\u2060-\u206F\u3164\uFE00-\uFE0F\uFEFF\uFFA0\uFFF0-\uFFF8]/,i="[^\\S\\u00A0]",r=new RegExp(`${i}|[\\-\\u007C\\u00AD\\u2010\\u2012-\\u2014\\u2027\\u2056\\u2E17\\u2E40]`);function o({text:p,lang:_,fonts:g,style:m,weight:x,preResolvedFonts:y,unicodeFontsURL:v},A){const w=({chars:T,fonts:C})=>{let b,M;const U=[];for(let L=0;L<T.length;L++)T[L]!==M?(M=T[L],U.push(b={start:L,end:L,fontObj:C[T[L]]})):b.end=L;A(U)};y?w(y):s(p,w,{lang:_,fonts:g,style:m,weight:x,unicodeFontsURL:v})}function a({text:p="",font:_,lang:g,sdfGlyphSize:m=64,fontSize:x=400,fontWeight:y=1,fontStyle:v="normal",letterSpacing:A=0,lineHeight:w="normal",maxWidth:T=1/0,direction:C,textAlign:b="left",textIndent:M=0,whiteSpace:U="normal",overflowWrap:L="normal",anchorX:F=0,anchorY:N=0,metricsOnly:Q=!1,unicodeFontsURL:V,preResolvedFonts:le=null,includeCaretPositions:Z=!1,chunkedBoundsSize:te=8192,colorRanges:K=null},O){const J=u(),ue={fontLoad:0,typesetting:0};p.indexOf("\r")>-1&&(console.info("Typesetter: got text with \\r chars; normalizing to \\n"),p=p.replace(/\r\n/g,`
`).replace(/\r/g,`
`)),x=+x,A=+A,T=+T,w=w||"normal",M=+M,o({text:p,lang:g,style:v,weight:y,fonts:typeof _=="string"?[{src:_}]:_,unicodeFontsURL:V,preResolvedFonts:le},k=>{ue.fontLoad=u()-J;const X=isFinite(T);let ce=null,j=null,G=null,pe=null,se=null,ae=null,B=null,ie=null,R=0,oe=0,$=U!=="nowrap";const me=new Map,ee=u();let de=M,fe=0,E=new f;const S=[E];k.forEach(Se=>{const{fontObj:ye}=Se,{ascender:be,descender:Le,unitsPerEm:we,lineGap:Re,capHeight:Ie,xHeight:De}=ye;let Te=me.get(ye);if(!Te){const xe=x/we,he=w==="normal"?(be-Le+Re)*xe:w*x,Ee=(he-(be-Le)*xe)/2,Ce=Math.min(he,(be-Le)*xe),Ae=(be+Le)/2*xe+Ce/2;Te={index:me.size,src:ye.src,fontObj:ye,fontSizeMult:xe,unitsPerEm:we,ascender:be*xe,descender:Le*xe,capHeight:Ie*xe,xHeight:De*xe,lineHeight:he,baseline:-Ee-be*xe,caretTop:Ae,caretBottom:Ae-Ce},me.set(ye,Te)}const{fontSizeMult:W}=Te,ve=p.slice(Se.start,Se.end+1);let Ue,z;ye.forEachGlyph(ve,x,A,(xe,he,Ee,Ce)=>{he+=fe,Ce+=Se.start,Ue=he,z=xe;const Ae=p.charAt(Ce),Be=xe.advanceWidth*W,We=E.count;let Ve;if("isEmpty"in xe||(xe.isWhitespace=!!Ae&&new RegExp(i).test(Ae),xe.canBreakAfter=!!Ae&&r.test(Ae),xe.isEmpty=xe.xMin===xe.xMax||xe.yMin===xe.yMax||n.test(Ae)),!xe.isWhitespace&&!xe.isEmpty&&oe++,$&&X&&!xe.isWhitespace&&he+Be+de>T&&We){if(E.glyphAt(We-1).glyphObj.canBreakAfter)Ve=new f,de=-he;else for(let lt=We;lt--;)if(lt===0&&L==="break-word"){Ve=new f,de=-he;break}else if(E.glyphAt(lt).glyphObj.canBreakAfter){Ve=E.splitAt(lt+1);const ft=Ve.glyphAt(0).x;de-=ft;for(let St=Ve.count;St--;)Ve.glyphAt(St).x-=ft;break}Ve&&(E.isSoftWrapped=!0,E=Ve,S.push(E),R=T)}let He=E.glyphAt(E.count);He.glyphObj=xe,He.x=he+de,He.y=Ee,He.width=Be,He.charIndex=Ce,He.fontData=Te,Ae===`
`&&(E=new f,S.push(E),de=-(he+Be+A*x)+M)}),fe=Ue+z.advanceWidth*W+A*x});let D=0;S.forEach(Se=>{let ye=!0;for(let be=Se.count;be--;){const Le=Se.glyphAt(be);ye&&!Le.glyphObj.isWhitespace&&(Se.width=Le.x+Le.width,Se.width>R&&(R=Se.width),ye=!1);let{lineHeight:we,capHeight:Re,xHeight:Ie,baseline:De}=Le.fontData;we>Se.lineHeight&&(Se.lineHeight=we);const Te=De-Se.baseline;Te<0&&(Se.baseline+=Te,Se.cap+=Te,Se.ex+=Te),Se.cap=Math.max(Se.cap,Se.baseline+Re),Se.ex=Math.max(Se.ex,Se.baseline+Ie)}Se.baseline-=D,Se.cap-=D,Se.ex-=D,D+=Se.lineHeight});let Y=0,q=0;if(F&&(typeof F=="number"?Y=-F:typeof F=="string"&&(Y=-R*(F==="left"?0:F==="center"?.5:F==="right"?1:c(F)))),N&&(typeof N=="number"?q=-N:typeof N=="string"&&(q=N==="top"?0:N==="top-baseline"?-S[0].baseline:N==="top-cap"?-S[0].cap:N==="top-ex"?-S[0].ex:N==="middle"?D/2:N==="bottom"?D:N==="bottom-baseline"?-S[S.length-1].baseline:c(N)*D)),!Q){const Se=e.getEmbeddingLevels(p,C);ce=new Uint16Array(oe),j=new Uint8Array(oe),G=new Float32Array(oe*2),pe={},B=[1/0,1/0,-1/0,-1/0],ie=[],Z&&(ae=new Float32Array(p.length*4)),K&&(se=new Uint8Array(oe*3));let ye=0,be=-1,Le=-1,we,Re;if(S.forEach((Ie,De)=>{let{count:Te,width:W}=Ie;if(Te>0){let ve=0;for(let Ce=Te;Ce--&&Ie.glyphAt(Ce).glyphObj.isWhitespace;)ve++;let Ue=0,z=0;if(b==="center")Ue=(R-W)/2;else if(b==="right")Ue=R-W;else if(b==="justify"&&Ie.isSoftWrapped){let Ce=0;for(let Ae=Te-ve;Ae--;)Ie.glyphAt(Ae).glyphObj.isWhitespace&&Ce++;z=(R-W)/Ce}if(z||Ue){let Ce=0;for(let Ae=0;Ae<Te;Ae++){let Be=Ie.glyphAt(Ae);const We=Be.glyphObj;Be.x+=Ue+Ce,z!==0&&We.isWhitespace&&Ae<Te-ve&&(Ce+=z,Be.width+=z)}}const xe=e.getReorderSegments(p,Se,Ie.glyphAt(0).charIndex,Ie.glyphAt(Ie.count-1).charIndex);for(let Ce=0;Ce<xe.length;Ce++){const[Ae,Be]=xe[Ce];let We=1/0,Ve=-1/0;for(let He=0;He<Te;He++)if(Ie.glyphAt(He).charIndex>=Ae){let lt=He,ft=He;for(;ft<Te;ft++){let St=Ie.glyphAt(ft);if(St.charIndex>Be)break;ft<Te-ve&&(We=Math.min(We,St.x),Ve=Math.max(Ve,St.x+St.width))}for(let St=lt;St<ft;St++){const sn=Ie.glyphAt(St);sn.x=Ve-(sn.x+sn.width-We)}break}}let he;const Ee=Ce=>he=Ce;for(let Ce=0;Ce<Te;Ce++){const Ae=Ie.glyphAt(Ce);he=Ae.glyphObj;const Be=he.index,We=Se.levels[Ae.charIndex]&1;if(We){const Ve=e.getMirroredCharacter(p[Ae.charIndex]);Ve&&Ae.fontData.fontObj.forEachGlyph(Ve,0,0,Ee)}if(Z){const{charIndex:Ve,fontData:He}=Ae,lt=Ae.x+Y,ft=Ae.x+Ae.width+Y;ae[Ve*4]=We?ft:lt,ae[Ve*4+1]=We?lt:ft,ae[Ve*4+2]=Ie.baseline+He.caretBottom+q,ae[Ve*4+3]=Ie.baseline+He.caretTop+q;const St=Ve-be;St>1&&h(ae,be,St),be=Ve}if(K){const{charIndex:Ve}=Ae;for(;Ve>Le;)Le++,K.hasOwnProperty(Le)&&(Re=K[Le])}if(!he.isWhitespace&&!he.isEmpty){const Ve=ye++,{fontSizeMult:He,src:lt,index:ft}=Ae.fontData,St=pe[lt]||(pe[lt]={});St[Be]||(St[Be]={path:he.path,pathBounds:[he.xMin,he.yMin,he.xMax,he.yMax]});const sn=Ae.x+Y,Yt=Ae.y+Ie.baseline+q;G[Ve*2]=sn,G[Ve*2+1]=Yt;const gn=sn+he.xMin*He,In=Yt+he.yMin*He,Vn=sn+he.xMax*He,on=Yt+he.yMax*He;gn<B[0]&&(B[0]=gn),In<B[1]&&(B[1]=In),Vn>B[2]&&(B[2]=Vn),on>B[3]&&(B[3]=on),Ve%te===0&&(we={start:Ve,end:Ve,rect:[1/0,1/0,-1/0,-1/0]},ie.push(we)),we.end++;const Dt=we.rect;if(gn<Dt[0]&&(Dt[0]=gn),In<Dt[1]&&(Dt[1]=In),Vn>Dt[2]&&(Dt[2]=Vn),on>Dt[3]&&(Dt[3]=on),ce[Ve]=Be,j[Ve]=ft,K){const En=Ve*3;se[En]=Re>>16&255,se[En+1]=Re>>8&255,se[En+2]=Re&255}}}}}),ae){const Ie=p.length-be;Ie>1&&h(ae,be,Ie)}}const re=[];me.forEach(({index:Se,src:ye,unitsPerEm:be,ascender:Le,descender:we,lineHeight:Re,capHeight:Ie,xHeight:De})=>{re[Se]={src:ye,unitsPerEm:be,ascender:Le,descender:we,lineHeight:Re,capHeight:Ie,xHeight:De}}),ue.typesetting=u()-ee,O({glyphIds:ce,glyphFontIndices:j,glyphPositions:G,glyphData:pe,fontData:re,caretPositions:ae,glyphColors:se,chunkedBounds:ie,fontSize:x,topBaseline:q+S[0].baseline,blockBounds:[Y,q-D,Y+R,q],visibleBounds:B,timings:ue})})}function l(p,_){a({...p,metricsOnly:!0},g=>{const[m,x,y,v]=g.blockBounds;_({width:y-m,height:v-x})})}function c(p){let _=p.match(/^([\d.]+)%$/),g=_?parseFloat(_[1]):NaN;return isNaN(g)?0:g/100}function h(p,_,g){const m=p[_*4],x=p[_*4+1],y=p[_*4+2],v=p[_*4+3],A=(x-m)/g;for(let w=0;w<g;w++){const T=(_+w)*4;p[T]=m+A*w,p[T+1]=m+A*(w+1),p[T+2]=y,p[T+3]=v}}function u(){return(self.performance||Date).now()}function f(){this.data=[]}const d=["glyphObj","x","y","width","charIndex","fontData"];return f.prototype={width:0,lineHeight:0,baseline:0,cap:0,ex:0,isSoftWrapped:!1,get count(){return Math.ceil(this.data.length/d.length)},glyphAt(p){let _=f.flyweight;return _.data=this.data,_.index=p,_},splitAt(p){let _=new f;return _.data=this.data.splice(p*d.length),_}},f.flyweight=d.reduce((p,_,g,m)=>(Object.defineProperty(p,_,{get(){return this.data[this.index*d.length+g]},set(x){this.data[this.index*d.length+g]=x}}),p),{data:null,index:0}),{typeset:a,measure:l}}const hr=()=>(self.performance||Date).now(),Yl=Pm();let md;function Pb(s,e,t,n,i,r,o,a,l,c,h=!0){return h?Lb(s,e,t,n,i,r,o,a,l,c).then(null,u=>(md||(console.warn("WebGL SDF generation failed, falling back to JS",u),md=!0),_d(s,e,t,n,i,r,o,a,l,c))):_d(s,e,t,n,i,r,o,a,l,c)}const Ea=[],Ib=5;let xh=0;function Lm(){const s=hr();for(;Ea.length&&hr()-s<Ib;)Ea.shift()();xh=Ea.length?setTimeout(Lm,0):0}const Lb=(...s)=>new Promise((e,t)=>{Ea.push(()=>{const n=hr();try{Yl.webgl.generateIntoCanvas(...s),e({timing:hr()-n})}catch(i){t(i)}}),xh||(xh=setTimeout(Lm,0))}),Ub=4,Db=2e3,gd={};let Fb=0;function _d(s,e,t,n,i,r,o,a,l,c){const h="TroikaTextSDFGenerator_JS_"+Fb++%Ub;let u=gd[h];return u||(u=gd[h]={workerModule:ss({name:h,workerId:h,dependencies:[Pm,hr],init(f,d){const p=f().javascript.generate;return function(..._){const g=d();return{textureData:p(..._),timing:d()-g}}},getTransferables(f){return[f.textureData.buffer]}}),requests:0,idleTimer:null}),u.requests++,clearTimeout(u.idleTimer),u.workerModule(s,e,t,n,i,r).then(({textureData:f,timing:d})=>{const p=hr(),_=new Uint8Array(f.length*4);for(let g=0;g<f.length;g++)_[g*4+c]=f[g];return Yl.webglUtils.renderImageData(o,_,a,l,s,e,1<<3-c),d+=hr()-p,--u.requests===0&&(u.idleTimer=setTimeout(()=>{fb(h)},Db)),{timing:d}})}function Nb(s){s._warm||(Yl.webgl.isSupported(s),s._warm=!0)}const Ob=Yl.webglUtils.resizeWebGLCanvasWithoutClearing,Ps={unicodeFontsURL:null,sdfGlyphSize:64,sdfMargin:1/16,sdfExponent:9,textureWidth:2048},Bb=new Fe;function Gr(){return(self.performance||Date).now()}const vd=Object.create(null);function Um(s,e){s=zb({},s);const t=Gr(),n=[];if(s.font&&n.push({label:"user",src:Vb(s.font)}),s.font=n,s.text=""+s.text,s.sdfGlyphSize=s.sdfGlyphSize||Ps.sdfGlyphSize,s.unicodeFontsURL=s.unicodeFontsURL||Ps.unicodeFontsURL,s.colorRanges!=null){let f={};for(let d in s.colorRanges)if(s.colorRanges.hasOwnProperty(d)){let p=s.colorRanges[d];typeof p!="number"&&(p=Bb.set(p).getHex()),f[d]=p}s.colorRanges=f}Object.freeze(s);const{textureWidth:i,sdfExponent:r}=Ps,{sdfGlyphSize:o}=s,a=i/o*4;let l=vd[o];if(!l){const f=document.createElement("canvas");f.width=i,f.height=o*256/a,l=vd[o]={glyphCount:0,sdfGlyphSize:o,sdfCanvas:f,sdfTexture:new Mt(f,void 0,void 0,void 0,At,At),contextLost:!1,glyphsByFont:new Map},l.sdfTexture.generateMipmaps=!1,kb(l)}const{sdfTexture:c,sdfCanvas:h}=l;Nm(s).then(f=>{const{glyphIds:d,glyphFontIndices:p,fontData:_,glyphPositions:g,fontSize:m,timings:x}=f,y=[],v=new Float32Array(d.length*4);let A=0,w=0;const T=Gr(),C=_.map(F=>{let N=l.glyphsByFont.get(F.src);return N||l.glyphsByFont.set(F.src,N=new Map),N});d.forEach((F,N)=>{const Q=p[N],{src:V,unitsPerEm:le}=_[Q];let Z=C[Q].get(F);if(!Z){const{path:ue,pathBounds:k}=f.glyphData[V][F],X=Math.max(k[2]-k[0],k[3]-k[1])/o*(Ps.sdfMargin*o+.5),ce=l.glyphCount++,j=[k[0]-X,k[1]-X,k[2]+X,k[3]+X];C[Q].set(F,Z={path:ue,atlasIndex:ce,sdfViewBox:j}),y.push(Z)}const{sdfViewBox:te}=Z,K=g[w++],O=g[w++],J=m/le;v[A++]=K+te[0]*J,v[A++]=O+te[1]*J,v[A++]=K+te[2]*J,v[A++]=O+te[3]*J,d[N]=Z.atlasIndex}),x.quads=(x.quads||0)+(Gr()-T);const b=Gr();x.sdf={};const M=h.height,U=Math.ceil(l.glyphCount/a),L=Math.pow(2,Math.ceil(Math.log2(U*o)));L>M&&(console.info(`Increasing SDF texture size ${M}->${L}`),Ob(h,i,L),c.dispose()),Promise.all(y.map(F=>Dm(F,l,s.gpuAccelerateSDF).then(({timing:N})=>{x.sdf[F.atlasIndex]=N}))).then(()=>{y.length&&!l.contextLost&&(Fm(l),c.needsUpdate=!0),x.sdfTotal=Gr()-b,x.total=Gr()-t,e(Object.freeze({parameters:s,sdfTexture:c,sdfGlyphSize:o,sdfExponent:r,glyphBounds:v,glyphAtlasIndices:d,glyphColors:f.glyphColors,caretPositions:f.caretPositions,chunkedBounds:f.chunkedBounds,ascender:f.ascender,descender:f.descender,lineHeight:f.lineHeight,capHeight:f.capHeight,xHeight:f.xHeight,topBaseline:f.topBaseline,blockBounds:f.blockBounds,visibleBounds:f.visibleBounds,timings:f.timings}))})}),Promise.resolve().then(()=>{l.contextLost||Nb(h)})}function Dm({path:s,atlasIndex:e,sdfViewBox:t},{sdfGlyphSize:n,sdfCanvas:i,contextLost:r},o){if(r)return Promise.resolve({timing:-1});const{textureWidth:a,sdfExponent:l}=Ps,c=Math.max(t[2]-t[0],t[3]-t[1]),h=Math.floor(e/4),u=h%(a/n)*n,f=Math.floor(h/(a/n))*n,d=e%4;return Pb(n,n,s,t,c,l,i,u,f,d,o)}function kb(s){const e=s.sdfCanvas;e.addEventListener("webglcontextlost",t=>{console.log("Context Lost",t),t.preventDefault(),s.contextLost=!0}),e.addEventListener("webglcontextrestored",t=>{console.log("Context Restored",t),s.contextLost=!1;const n=[];s.glyphsByFont.forEach(i=>{i.forEach(r=>{n.push(Dm(r,s,!0))})}),Promise.all(n).then(()=>{Fm(s),s.sdfTexture.needsUpdate=!0})})}function w1({font:s,characters:e,sdfGlyphSize:t},n){let i=Array.isArray(e)?e.join(`
`):""+e;Um({font:s,sdfGlyphSize:t,text:i},n)}function zb(s,e){for(let t in e)e.hasOwnProperty(t)&&(s[t]=e[t]);return s}let ya;function Vb(s){return ya||(ya=typeof document>"u"?{}:document.createElement("a")),ya.href=s,ya.href}function Fm(s){if(typeof createImageBitmap!="function"){console.info("Safari<15: applying SDF canvas workaround");const{sdfCanvas:e,sdfTexture:t}=s,{width:n,height:i}=e,r=s.sdfCanvas.getContext("webgl");let o=t.image.data;(!o||o.length!==n*i*4)&&(o=new Uint8Array(n*i*4),t.image={width:n,height:i,data:o},t.flipY=!1,t.isDataTexture=!0),r.readPixels(0,0,n,i,r.RGBA,r.UNSIGNED_BYTE,o)}}const Gb=ss({name:"Typesetter",dependencies:[Rb,Cb,pb],init(s,e,t){return s(e,t())}}),Nm=ss({name:"Typesetter",dependencies:[Gb],init(s){return function(e){return new Promise(t=>{s.typeset(e,t)})}},getTransferables(s){const e=[];for(let t in s)s[t]&&s[t].buffer&&e.push(s[t].buffer);return e}});Nm.onMainThread;const yd={};function Hb(s){let e=yd[s];return e||(e=yd[s]=new yi(1,1,s,s).translate(.5,.5,0)),e}const Wb="aTroikaGlyphBounds",xd="aTroikaGlyphIndex",Xb="aTroikaGlyphColor";class Yb extends Wl{constructor(){super(),this.detail=1,this.curveRadius=0,this.groups=[{start:0,count:1/0,materialIndex:0},{start:0,count:1/0,materialIndex:1}],this.boundingSphere=new It,this.boundingBox=new wt}computeBoundingSphere(){}computeBoundingBox(){}set detail(e){if(e!==this._detail){this._detail=e,(typeof e!="number"||e<1)&&(e=1);let t=Hb(e);["position","normal","uv"].forEach(n=>{this.attributes[n]=t.attributes[n].clone()}),this.setIndex(t.getIndex().clone())}}get detail(){return this._detail}set curveRadius(e){e!==this._curveRadius&&(this._curveRadius=e,this._updateBounds())}get curveRadius(){return this._curveRadius}updateGlyphs(e,t,n,i,r){this.updateAttributeData(Wb,e,4),this.updateAttributeData(xd,t,1),this.updateAttributeData(Xb,r,3),this._blockBounds=n,this._chunkedBounds=i,this.instanceCount=t.length,this._updateBounds()}_updateBounds(){const e=this._blockBounds;if(e){const{curveRadius:t,boundingBox:n}=this;if(t){const{PI:i,floor:r,min:o,max:a,sin:l,cos:c}=Math,h=i/2,u=i*2,f=Math.abs(t),d=e[0]/f,p=e[2]/f,_=r((d+h)/u)!==r((p+h)/u)?-f:o(l(d)*f,l(p)*f),g=r((d-h)/u)!==r((p-h)/u)?f:a(l(d)*f,l(p)*f),m=r((d+i)/u)!==r((p+i)/u)?f*2:a(f-c(d)*f,f-c(p)*f);n.min.set(_,e[1],t<0?-m:0),n.max.set(g,e[3],t<0?0:m)}else n.min.set(e[0],e[1],0),n.max.set(e[2],e[3],0);n.getBoundingSphere(this.boundingSphere)}}applyClipRect(e){let t=this.getAttribute(xd).count,n=this._chunkedBounds;if(n)for(let i=n.length;i--;){t=n[i].end;let r=n[i].rect;if(r[1]<e.w&&r[3]>e.y&&r[0]<e.z&&r[2]>e.x)break}this.instanceCount=t}updateAttributeData(e,t,n){const i=this.getAttribute(e);t?i&&i.array.length===t.length?(i.array.set(t),i.needsUpdate=!0):(this.setAttribute(e,new mr(t,n)),delete this._maxInstanceCount,this.dispose()):i&&this.deleteAttribute(e)}}const qb=`
uniform vec2 uTroikaSDFTextureSize;
uniform float uTroikaSDFGlyphSize;
uniform vec4 uTroikaTotalBounds;
uniform vec4 uTroikaClipRect;
uniform mat3 uTroikaOrient;
uniform bool uTroikaUseGlyphColors;
uniform float uTroikaEdgeOffset;
uniform float uTroikaBlurRadius;
uniform vec2 uTroikaPositionOffset;
uniform float uTroikaCurveRadius;
attribute vec4 aTroikaGlyphBounds;
attribute float aTroikaGlyphIndex;
attribute vec3 aTroikaGlyphColor;
varying vec2 vTroikaGlyphUV;
varying vec4 vTroikaTextureUVBounds;
varying float vTroikaTextureChannel;
varying vec3 vTroikaGlyphColor;
varying vec2 vTroikaGlyphDimensions;
`,Zb=`
vec4 bounds = aTroikaGlyphBounds;
bounds.xz += uTroikaPositionOffset.x;
bounds.yw -= uTroikaPositionOffset.y;

vec4 outlineBounds = vec4(
  bounds.xy - uTroikaEdgeOffset - uTroikaBlurRadius,
  bounds.zw + uTroikaEdgeOffset + uTroikaBlurRadius
);
vec4 clippedBounds = vec4(
  clamp(outlineBounds.xy, uTroikaClipRect.xy, uTroikaClipRect.zw),
  clamp(outlineBounds.zw, uTroikaClipRect.xy, uTroikaClipRect.zw)
);

vec2 clippedXY = (mix(clippedBounds.xy, clippedBounds.zw, position.xy) - bounds.xy) / (bounds.zw - bounds.xy);

position.xy = mix(bounds.xy, bounds.zw, clippedXY);

uv = (position.xy - uTroikaTotalBounds.xy) / (uTroikaTotalBounds.zw - uTroikaTotalBounds.xy);

float rad = uTroikaCurveRadius;
if (rad != 0.0) {
  float angle = position.x / rad;
  position.xz = vec2(sin(angle) * rad, rad - cos(angle) * rad);
  normal.xz = vec2(sin(angle), cos(angle));
}
  
position = uTroikaOrient * position;
normal = uTroikaOrient * normal;

vTroikaGlyphUV = clippedXY.xy;
vTroikaGlyphDimensions = vec2(bounds[2] - bounds[0], bounds[3] - bounds[1]);


float txCols = uTroikaSDFTextureSize.x / uTroikaSDFGlyphSize;
vec2 txUvPerSquare = uTroikaSDFGlyphSize / uTroikaSDFTextureSize;
vec2 txStartUV = txUvPerSquare * vec2(
  mod(floor(aTroikaGlyphIndex / 4.0), txCols),
  floor(floor(aTroikaGlyphIndex / 4.0) / txCols)
);
vTroikaTextureUVBounds = vec4(txStartUV, vec2(txStartUV) + txUvPerSquare);
vTroikaTextureChannel = mod(aTroikaGlyphIndex, 4.0);
`,jb=`
uniform sampler2D uTroikaSDFTexture;
uniform vec2 uTroikaSDFTextureSize;
uniform float uTroikaSDFGlyphSize;
uniform float uTroikaSDFExponent;
uniform float uTroikaEdgeOffset;
uniform float uTroikaFillOpacity;
uniform float uTroikaBlurRadius;
uniform vec3 uTroikaStrokeColor;
uniform float uTroikaStrokeWidth;
uniform float uTroikaStrokeOpacity;
uniform bool uTroikaSDFDebug;
varying vec2 vTroikaGlyphUV;
varying vec4 vTroikaTextureUVBounds;
varying float vTroikaTextureChannel;
varying vec2 vTroikaGlyphDimensions;

float troikaSdfValueToSignedDistance(float alpha) {
  // Inverse of exponential encoding in webgl-sdf-generator
  
  float maxDimension = max(vTroikaGlyphDimensions.x, vTroikaGlyphDimensions.y);
  float absDist = (1.0 - pow(2.0 * (alpha > 0.5 ? 1.0 - alpha : alpha), 1.0 / uTroikaSDFExponent)) * maxDimension;
  float signedDist = absDist * (alpha > 0.5 ? -1.0 : 1.0);
  return signedDist;
}

float troikaGlyphUvToSdfValue(vec2 glyphUV) {
  vec2 textureUV = mix(vTroikaTextureUVBounds.xy, vTroikaTextureUVBounds.zw, glyphUV);
  vec4 rgba = texture2D(uTroikaSDFTexture, textureUV);
  float ch = floor(vTroikaTextureChannel + 0.5); //NOTE: can't use round() in WebGL1
  return ch == 0.0 ? rgba.r : ch == 1.0 ? rgba.g : ch == 2.0 ? rgba.b : rgba.a;
}

float troikaGlyphUvToDistance(vec2 uv) {
  return troikaSdfValueToSignedDistance(troikaGlyphUvToSdfValue(uv));
}

float troikaGetAADist() {
  
  #if defined(GL_OES_standard_derivatives) || __VERSION__ >= 300
  return length(fwidth(vTroikaGlyphUV * vTroikaGlyphDimensions)) * 0.5;
  #else
  return vTroikaGlyphDimensions.x / 64.0;
  #endif
}

float troikaGetFragDistValue() {
  vec2 clampedGlyphUV = clamp(vTroikaGlyphUV, 0.5 / uTroikaSDFGlyphSize, 1.0 - 0.5 / uTroikaSDFGlyphSize);
  float distance = troikaGlyphUvToDistance(clampedGlyphUV);
 
  // Extrapolate distance when outside bounds:
  distance += clampedGlyphUV == vTroikaGlyphUV ? 0.0 : 
    length((vTroikaGlyphUV - clampedGlyphUV) * vTroikaGlyphDimensions);

  

  return distance;
}

float troikaGetEdgeAlpha(float distance, float distanceOffset, float aaDist) {
  #if defined(IS_DEPTH_MATERIAL) || defined(IS_DISTANCE_MATERIAL)
  float alpha = step(-distanceOffset, -distance);
  #else

  float alpha = smoothstep(
    distanceOffset + aaDist,
    distanceOffset - aaDist,
    distance
  );
  #endif

  return alpha;
}
`,Kb=`
float aaDist = troikaGetAADist();
float fragDistance = troikaGetFragDistValue();
float edgeAlpha = uTroikaSDFDebug ?
  troikaGlyphUvToSdfValue(vTroikaGlyphUV) :
  troikaGetEdgeAlpha(fragDistance, uTroikaEdgeOffset, max(aaDist, uTroikaBlurRadius));

#if !defined(IS_DEPTH_MATERIAL) && !defined(IS_DISTANCE_MATERIAL)
vec4 fillRGBA = gl_FragColor;
fillRGBA.a *= uTroikaFillOpacity;
vec4 strokeRGBA = uTroikaStrokeWidth == 0.0 ? fillRGBA : vec4(uTroikaStrokeColor, uTroikaStrokeOpacity);
if (fillRGBA.a == 0.0) fillRGBA.rgb = strokeRGBA.rgb;
gl_FragColor = mix(fillRGBA, strokeRGBA, smoothstep(
  -uTroikaStrokeWidth - aaDist,
  -uTroikaStrokeWidth + aaDist,
  fragDistance
));
gl_FragColor.a *= edgeAlpha;
#endif

if (edgeAlpha == 0.0) {
  discard;
}
`;function Jb(s){const e=yh(s,{chained:!0,extensions:{derivatives:!0},uniforms:{uTroikaSDFTexture:{value:null},uTroikaSDFTextureSize:{value:new Me},uTroikaSDFGlyphSize:{value:0},uTroikaSDFExponent:{value:0},uTroikaTotalBounds:{value:new tt(0,0,0,0)},uTroikaClipRect:{value:new tt(0,0,0,0)},uTroikaEdgeOffset:{value:0},uTroikaFillOpacity:{value:1},uTroikaPositionOffset:{value:new Me},uTroikaCurveRadius:{value:0},uTroikaBlurRadius:{value:0},uTroikaStrokeWidth:{value:0},uTroikaStrokeColor:{value:new Fe},uTroikaStrokeOpacity:{value:1},uTroikaOrient:{value:new Je},uTroikaUseGlyphColors:{value:!0},uTroikaSDFDebug:{value:!1}},vertexDefs:qb,vertexTransform:Zb,fragmentDefs:jb,fragmentColorTransform:Kb,customRewriter({vertexShader:t,fragmentShader:n}){let i=/\buniform\s+vec3\s+diffuse\b/;return i.test(n)&&(n=n.replace(i,"varying vec3 vTroikaGlyphColor").replace(/\bdiffuse\b/g,"vTroikaGlyphColor"),i.test(t)||(t=t.replace(Im,`uniform vec3 diffuse;
$&
vTroikaGlyphColor = uTroikaUseGlyphColors ? aTroikaGlyphColor / 255.0 : diffuse;
`))),{vertexShader:t,fragmentShader:n}}});return e.transparent=!0,e.forceSinglePass=!0,Object.defineProperties(e,{isTroikaTextMaterial:{value:!0},shadowSide:{get(){return this.side},set(){}}}),e}const cu=new vi({color:16777215,side:Cn,transparent:!0}),Md=8421504,Sd=new Ye,xa=new I,Jc=new I,As=[],Qb=new I,Qc="+x+y";function bd(s){return Array.isArray(s)?s[0]:s}let Om=()=>{const s=new vt(new yi(1,1),cu);return Om=()=>s,s},Bm=()=>{const s=new vt(new yi(1,1,32,1),cu);return Bm=()=>s,s};const $b={type:"syncstart"},e1={type:"synccomplete"},km=["font","fontSize","fontStyle","fontWeight","lang","letterSpacing","lineHeight","maxWidth","overflowWrap","text","direction","textAlign","textIndent","whiteSpace","anchorX","anchorY","colorRanges","sdfGlyphSize"],t1=km.concat("material","color","depthOffset","clipRect","curveRadius","orientation","glyphGeometryDetail");class n1 extends vt{constructor(){const e=new Yb;super(e,null),this.text="",this.anchorX=0,this.anchorY=0,this.curveRadius=0,this.direction="auto",this.font=null,this.unicodeFontsURL=null,this.fontSize=.1,this.fontWeight="normal",this.fontStyle="normal",this.lang=null,this.letterSpacing=0,this.lineHeight="normal",this.maxWidth=1/0,this.overflowWrap="normal",this.textAlign="left",this.textIndent=0,this.whiteSpace="normal",this.material=null,this.color=null,this.colorRanges=null,this.outlineWidth=0,this.outlineColor=0,this.outlineOpacity=1,this.outlineBlur=0,this.outlineOffsetX=0,this.outlineOffsetY=0,this.strokeWidth=0,this.strokeColor=Md,this.strokeOpacity=1,this.fillOpacity=1,this.depthOffset=0,this.clipRect=null,this.orientation=Qc,this.glyphGeometryDetail=1,this.sdfGlyphSize=null,this.gpuAccelerateSDF=!0,this.debugSDF=!1}sync(e){this._needsSync&&(this._needsSync=!1,this._isSyncing?(this._queuedSyncs||(this._queuedSyncs=[])).push(e):(this._isSyncing=!0,this.dispatchEvent($b),Um({text:this.text,font:this.font,lang:this.lang,fontSize:this.fontSize||.1,fontWeight:this.fontWeight||"normal",fontStyle:this.fontStyle||"normal",letterSpacing:this.letterSpacing||0,lineHeight:this.lineHeight||"normal",maxWidth:this.maxWidth,direction:this.direction||"auto",textAlign:this.textAlign,textIndent:this.textIndent,whiteSpace:this.whiteSpace,overflowWrap:this.overflowWrap,anchorX:this.anchorX,anchorY:this.anchorY,colorRanges:this.colorRanges,includeCaretPositions:!0,sdfGlyphSize:this.sdfGlyphSize,gpuAccelerateSDF:this.gpuAccelerateSDF,unicodeFontsURL:this.unicodeFontsURL},t=>{this._isSyncing=!1,this._textRenderInfo=t,this.geometry.updateGlyphs(t.glyphBounds,t.glyphAtlasIndices,t.blockBounds,t.chunkedBounds,t.glyphColors);const n=this._queuedSyncs;n&&(this._queuedSyncs=null,this._needsSync=!0,this.sync(()=>{n.forEach(i=>i&&i())})),this.dispatchEvent(e1),e&&e()})))}onBeforeRender(e,t,n,i,r,o){this.sync(),r.isTroikaTextMaterial&&this._prepareForRender(r)}dispose(){this.geometry.dispose()}get textRenderInfo(){return this._textRenderInfo||null}createDerivedMaterial(e){return Jb(e)}get material(){let e=this._derivedMaterial;const t=this._baseMaterial||this._defaultMaterial||(this._defaultMaterial=cu.clone());if((!e||!e.isDerivedFrom(t))&&(e=this._derivedMaterial=this.createDerivedMaterial(t),t.addEventListener("dispose",function n(){t.removeEventListener("dispose",n),e.dispose()})),this.hasOutline()){let n=e._outlineMtl;return n||(n=e._outlineMtl=Object.create(e,{id:{value:e.id+.1}}),n.isTextOutlineMaterial=!0,n.depthWrite=!1,n.map=null,e.addEventListener("dispose",function i(){e.removeEventListener("dispose",i),n.dispose()})),[n,e]}else return e}set material(e){e&&e.isTroikaTextMaterial?(this._derivedMaterial=e,this._baseMaterial=e.baseMaterial):this._baseMaterial=e}hasOutline(){return!!(this.outlineWidth||this.outlineBlur||this.outlineOffsetX||this.outlineOffsetY)}get glyphGeometryDetail(){return this.geometry.detail}set glyphGeometryDetail(e){this.geometry.detail=e}get curveRadius(){return this.geometry.curveRadius}set curveRadius(e){this.geometry.curveRadius=e}get customDepthMaterial(){return bd(this.material).getDepthMaterial()}set customDepthMaterial(e){}get customDistanceMaterial(){return bd(this.material).getDistanceMaterial()}set customDistanceMaterial(e){}_prepareForRender(e){const t=e.isTextOutlineMaterial,n=e.uniforms,i=this.textRenderInfo;if(i){const{sdfTexture:a,blockBounds:l}=i;n.uTroikaSDFTexture.value=a,n.uTroikaSDFTextureSize.value.set(a.image.width,a.image.height),n.uTroikaSDFGlyphSize.value=i.sdfGlyphSize,n.uTroikaSDFExponent.value=i.sdfExponent,n.uTroikaTotalBounds.value.fromArray(l),n.uTroikaUseGlyphColors.value=!t&&!!i.glyphColors;let c=0,h=0,u=0,f,d,p,_=0,g=0;if(t){let{outlineWidth:x,outlineOffsetX:y,outlineOffsetY:v,outlineBlur:A,outlineOpacity:w}=this;c=this._parsePercent(x)||0,h=Math.max(0,this._parsePercent(A)||0),f=w,_=this._parsePercent(y)||0,g=this._parsePercent(v)||0}else u=Math.max(0,this._parsePercent(this.strokeWidth)||0),u&&(p=this.strokeColor,n.uTroikaStrokeColor.value.set(p??Md),d=this.strokeOpacity,d==null&&(d=1)),f=this.fillOpacity;n.uTroikaEdgeOffset.value=c,n.uTroikaPositionOffset.value.set(_,g),n.uTroikaBlurRadius.value=h,n.uTroikaStrokeWidth.value=u,n.uTroikaStrokeOpacity.value=d,n.uTroikaFillOpacity.value=f??1,n.uTroikaCurveRadius.value=this.curveRadius||0;let m=this.clipRect;if(m&&Array.isArray(m)&&m.length===4)n.uTroikaClipRect.value.fromArray(m);else{const x=(this.fontSize||.1)*100;n.uTroikaClipRect.value.set(l[0]-x,l[1]-x,l[2]+x,l[3]+x)}this.geometry.applyClipRect(n.uTroikaClipRect.value)}n.uTroikaSDFDebug.value=!!this.debugSDF,e.polygonOffset=!!this.depthOffset,e.polygonOffsetFactor=e.polygonOffsetUnits=this.depthOffset||0;const r=t?this.outlineColor||0:this.color;if(r==null)delete e.color;else{const a=e.hasOwnProperty("color")?e.color:e.color=new Fe;(r!==a._input||typeof r=="object")&&a.set(a._input=r)}let o=this.orientation||Qc;if(o!==e._orientation){let a=n.uTroikaOrient.value;o=o.replace(/[^-+xyz]/g,"");let l=o!==Qc&&o.match(/^([-+])([xyz])([-+])([xyz])$/);if(l){let[,c,h,u,f]=l;xa.set(0,0,0)[h]=c==="-"?1:-1,Jc.set(0,0,0)[f]=u==="-"?-1:1,Sd.lookAt(Qb,xa.cross(Jc),Jc),a.setFromMatrix4(Sd)}else a.identity();e._orientation=o}}_parsePercent(e){if(typeof e=="string"){let t=e.match(/^(-?[\d.]+)%$/),n=t?parseFloat(t[1]):NaN;e=(isNaN(n)?0:n/100)*this.fontSize}return e}localPositionToTextCoords(e,t=new Me){t.copy(e);const n=this.curveRadius;return n&&(t.x=Math.atan2(e.x,Math.abs(n)-Math.abs(e.z))*Math.abs(n)),t}worldPositionToTextCoords(e,t=new Me){return xa.copy(e),this.localPositionToTextCoords(this.worldToLocal(xa),t)}raycast(e,t){const{textRenderInfo:n,curveRadius:i}=this;if(n){const r=n.blockBounds,o=i?Bm():Om(),a=o.geometry,{position:l,uv:c}=a.attributes;for(let h=0;h<c.count;h++){let u=r[0]+c.getX(h)*(r[2]-r[0]);const f=r[1]+c.getY(h)*(r[3]-r[1]);let d=0;i&&(d=i-Math.cos(u/i)*i,u=Math.sin(u/i)*i),l.setXYZ(h,u,f,d)}a.boundingSphere=this.geometry.boundingSphere,a.boundingBox=this.geometry.boundingBox,o.matrixWorld=this.matrixWorld,o.material.side=this.material.side,As.length=0,o.raycast(e,As);for(let h=0;h<As.length;h++)As[h].object=this,t.push(As[h])}}copy(e){const t=this.geometry;return super.copy(e),this.geometry=t,t1.forEach(n=>{this[n]=e[n]}),this}clone(){return new this.constructor().copy(this)}}km.forEach(s=>{const e="_private_"+s;Object.defineProperty(n1.prototype,s,{get(){return this[e]},set(t){t!==this[e]&&(this[e]=t,this._needsSync=!0)}})});new wt;new Fe;class i1{constructor(){this.id=0,this.object=null,this.z=0,this.renderOrder=0}}class zm{constructor(){this.id=0,this.v1=new Kr,this.v2=new Kr,this.v3=new Kr,this.normalModel=new I,this.vertexNormalsModel=[new I,new I,new I],this.vertexNormalsLength=0,this.color=new Fe,this.material=null,this.uvs=[new Me,new Me,new Me],this.z=0,this.renderOrder=0}}class Kr{constructor(){this.position=new I,this.positionWorld=new I,this.positionScreen=new tt,this.visible=!0}copy(e){this.positionWorld.copy(e.positionWorld),this.positionScreen.copy(e.positionScreen)}}class Vm{constructor(){this.id=0,this.v1=new Kr,this.v2=new Kr,this.vertexColors=[new Fe,new Fe],this.material=null,this.z=0,this.renderOrder=0}}class Gm{constructor(){this.id=0,this.object=null,this.x=0,this.y=0,this.z=0,this.rotation=0,this.scale=new Me,this.material=null,this.renderOrder=0}}class r1{constructor(){let e,t,n=0,i,r,o=0,a,l,c=0,h,u,f=0,d,p,_=0,g;const m={objects:[],lights:[],elements:[]},x=new I,y=new tt,v=new wt(new I(-1,-1,-1),new I(1,1,1)),A=new wt,w=new Array(3),T=new Ye,C=new Ye,b=new Ye,M=new ns,U=[],L=[],F=[],N=[],Q=[];function V(){const G=[],pe=[],se=[];let ae=null;const B=new Je;function ie(D){ae=D,B.getNormalMatrix(ae.matrixWorld),G.length=0,pe.length=0,se.length=0}function R(D){const Y=D.position,q=D.positionWorld,re=D.positionScreen;q.copy(Y).applyMatrix4(g),re.copy(q).applyMatrix4(C);const Se=1/re.w;re.x*=Se,re.y*=Se,re.z*=Se,D.visible=re.x>=-1&&re.x<=1&&re.y>=-1&&re.y<=1&&re.z>=-1&&re.z<=1}function oe(D,Y,q){i=J(),i.position.set(D,Y,q),R(i)}function $(D,Y,q){G.push(D,Y,q)}function me(D,Y,q){pe.push(D,Y,q)}function ee(D,Y){se.push(D,Y)}function de(D,Y,q){return D.visible===!0||Y.visible===!0||q.visible===!0?!0:(w[0]=D.positionScreen,w[1]=Y.positionScreen,w[2]=q.positionScreen,v.intersectsBox(A.setFromPoints(w)))}function fe(D,Y,q){return(q.positionScreen.x-D.positionScreen.x)*(Y.positionScreen.y-D.positionScreen.y)-(q.positionScreen.y-D.positionScreen.y)*(Y.positionScreen.x-D.positionScreen.x)<0}function E(D,Y){const q=L[D],re=L[Y];q.positionScreen.copy(q.position).applyMatrix4(b),re.positionScreen.copy(re.position).applyMatrix4(b),j(q.positionScreen,re.positionScreen)===!0&&(q.positionScreen.multiplyScalar(1/q.positionScreen.w),re.positionScreen.multiplyScalar(1/re.positionScreen.w),h=k(),h.id=ae.id,h.v1.copy(q),h.v2.copy(re),h.z=Math.max(q.positionScreen.z,re.positionScreen.z),h.renderOrder=ae.renderOrder,h.material=ae.material,ae.material.vertexColors&&(h.vertexColors[0].fromArray(pe,D*3),h.vertexColors[1].fromArray(pe,Y*3)),m.elements.push(h))}function S(D,Y,q,re){const Se=L[D],ye=L[Y],be=L[q];if(de(Se,ye,be)!==!1&&(re.side===Cn||fe(Se,ye,be)===!0)){a=ue(),a.id=ae.id,a.v1.copy(Se),a.v2.copy(ye),a.v3.copy(be),a.z=(Se.positionScreen.z+ye.positionScreen.z+be.positionScreen.z)/3,a.renderOrder=ae.renderOrder,x.subVectors(be.position,ye.position),y.subVectors(Se.position,ye.position),x.cross(y),a.normalModel.copy(x),a.normalModel.applyMatrix3(B).normalize();for(let Le=0;Le<3;Le++){const we=a.vertexNormalsModel[Le];we.fromArray(G,arguments[Le]*3),we.applyMatrix3(B).normalize(),a.uvs[Le].fromArray(se,arguments[Le]*2)}a.vertexNormalsLength=3,a.material=re,re.vertexColors&&a.color.fromArray(pe,D*3),m.elements.push(a)}}return{setObject:ie,projectVertex:R,checkTriangleVisibility:de,checkBackfaceCulling:fe,pushVertex:oe,pushNormal:$,pushColor:me,pushUv:ee,pushLine:E,pushTriangle:S}}const le=new V;function Z(G){if(G.visible===!1)return;if(G.isLight)m.lights.push(G);else if(G.isMesh||G.isLine||G.isPoints){if(G.material.visible===!1||G.frustumCulled===!0&&M.intersectsObject(G)===!1)return;te(G)}else if(G.isSprite){if(G.material.visible===!1||G.frustumCulled===!0&&M.intersectsSprite(G)===!1)return;te(G)}const pe=G.children;for(let se=0,ae=pe.length;se<ae;se++)Z(pe[se])}function te(G){e=O(),e.id=G.id,e.object=G,x.setFromMatrixPosition(G.matrixWorld),x.applyMatrix4(C),e.z=x.z,e.renderOrder=G.renderOrder,m.objects.push(e)}this.projectScene=function(G,pe,se,ae){l=0,u=0,p=0,m.elements.length=0,G.matrixWorldAutoUpdate===!0&&G.updateMatrixWorld(),pe.parent===null&&pe.matrixWorldAutoUpdate===!0&&pe.updateMatrixWorld(),T.copy(pe.matrixWorldInverse),C.multiplyMatrices(pe.projectionMatrix,T),M.setFromProjectionMatrix(C),t=0,m.objects.length=0,m.lights.length=0,Z(G),se===!0&&m.objects.sort(ce);const B=m.objects;for(let ie=0,R=B.length;ie<R;ie++){const oe=B[ie].object,$=oe.geometry;if(le.setObject(oe),g=oe.matrixWorld,r=0,oe.isMesh){let me=oe.material;const ee=Array.isArray(me),de=$.attributes,fe=$.groups;if(de.position===void 0)continue;const E=de.position.array;for(let S=0,D=E.length;S<D;S+=3){let Y=E[S],q=E[S+1],re=E[S+2];const Se=$.morphAttributes.position;if(Se!==void 0){const ye=$.morphTargetsRelative,be=oe.morphTargetInfluences;for(let Le=0,we=Se.length;Le<we;Le++){const Re=be[Le];if(Re===0)continue;const Ie=Se[Le];ye?(Y+=Ie.getX(S/3)*Re,q+=Ie.getY(S/3)*Re,re+=Ie.getZ(S/3)*Re):(Y+=(Ie.getX(S/3)-E[S])*Re,q+=(Ie.getY(S/3)-E[S+1])*Re,re+=(Ie.getZ(S/3)-E[S+2])*Re)}}le.pushVertex(Y,q,re)}if(de.normal!==void 0){const S=de.normal.array;for(let D=0,Y=S.length;D<Y;D+=3)le.pushNormal(S[D],S[D+1],S[D+2])}if(de.color!==void 0){const S=de.color.array;for(let D=0,Y=S.length;D<Y;D+=3)le.pushColor(S[D],S[D+1],S[D+2])}if(de.uv!==void 0){const S=de.uv.array;for(let D=0,Y=S.length;D<Y;D+=2)le.pushUv(S[D],S[D+1])}if($.index!==null){const S=$.index.array;if(fe.length>0)for(let D=0;D<fe.length;D++){const Y=fe[D];if(me=ee===!0?oe.material[Y.materialIndex]:oe.material,me!==void 0)for(let q=Y.start,re=Y.start+Y.count;q<re;q+=3)le.pushTriangle(S[q],S[q+1],S[q+2],me)}else for(let D=0,Y=S.length;D<Y;D+=3)le.pushTriangle(S[D],S[D+1],S[D+2],me)}else if(fe.length>0)for(let S=0;S<fe.length;S++){const D=fe[S];if(me=ee===!0?oe.material[D.materialIndex]:oe.material,me!==void 0)for(let Y=D.start,q=D.start+D.count;Y<q;Y+=3)le.pushTriangle(Y,Y+1,Y+2,me)}else for(let S=0,D=E.length/3;S<D;S+=3)le.pushTriangle(S,S+1,S+2,me)}else if(oe.isLine){b.multiplyMatrices(C,g);const me=$.attributes;if(me.position!==void 0){const ee=me.position.array;for(let de=0,fe=ee.length;de<fe;de+=3)le.pushVertex(ee[de],ee[de+1],ee[de+2]);if(me.color!==void 0){const de=me.color.array;for(let fe=0,E=de.length;fe<E;fe+=3)le.pushColor(de[fe],de[fe+1],de[fe+2])}if($.index!==null){const de=$.index.array;for(let fe=0,E=de.length;fe<E;fe+=2)le.pushLine(de[fe],de[fe+1])}else{const de=oe.isLineSegments?2:1;for(let fe=0,E=ee.length/3-1;fe<E;fe+=de)le.pushLine(fe,fe+1)}}}else if(oe.isPoints){b.multiplyMatrices(C,g);const me=$.attributes;if(me.position!==void 0){const ee=me.position.array;for(let de=0,fe=ee.length;de<fe;de+=3)y.set(ee[de],ee[de+1],ee[de+2],1),y.applyMatrix4(b),K(y,oe,pe)}}else oe.isSprite&&(oe.modelViewMatrix.multiplyMatrices(pe.matrixWorldInverse,oe.matrixWorld),y.set(g.elements[12],g.elements[13],g.elements[14],1),y.applyMatrix4(C),K(y,oe,pe))}return ae===!0&&m.elements.sort(ce),m};function K(G,pe,se){const ae=1/G.w;G.z*=ae,G.z>=-1&&G.z<=1&&(d=X(),d.id=pe.id,d.x=G.x*ae,d.y=G.y*ae,d.z=G.z,d.renderOrder=pe.renderOrder,d.object=pe,d.rotation=pe.rotation,d.scale.x=pe.scale.x*Math.abs(d.x-(G.x+se.projectionMatrix.elements[0])/(G.w+se.projectionMatrix.elements[12])),d.scale.y=pe.scale.y*Math.abs(d.y-(G.y+se.projectionMatrix.elements[5])/(G.w+se.projectionMatrix.elements[13])),d.material=pe.material,m.elements.push(d))}function O(){if(t===n){const G=new i1;return U.push(G),n++,t++,G}return U[t++]}function J(){if(r===o){const G=new Kr;return L.push(G),o++,r++,G}return L[r++]}function ue(){if(l===c){const G=new zm;return F.push(G),c++,l++,G}return F[l++]}function k(){if(u===f){const G=new Vm;return N.push(G),f++,u++,G}return N[u++]}function X(){if(p===_){const G=new Gm;return Q.push(G),_++,p++,G}return Q[p++]}function ce(G,pe){return G.renderOrder!==pe.renderOrder?G.renderOrder-pe.renderOrder:G.z!==pe.z?pe.z-G.z:G.id!==pe.id?G.id-pe.id:0}function j(G,pe){let se=0,ae=1;const B=G.z+G.w,ie=pe.z+pe.w,R=-G.z+G.w,oe=-pe.z+pe.w;return B>=0&&ie>=0&&R>=0&&oe>=0?!0:B<0&&ie<0||R<0&&oe<0?!1:(B<0?se=Math.max(se,B/(B-ie)):ie<0&&(ae=Math.min(ae,B/(B-ie))),R<0?se=Math.max(se,R/(R-oe)):oe<0&&(ae=Math.min(ae,R/(R-oe))),ae<se?!1:(G.lerp(pe,se),pe.lerp(G,1-ae),!0))}}}class E1{constructor(){let e,t,n,i,r,o,a,l,c,h,u,f=0,d=null,p=1,_,g;const m=this,x=new dh,y=new dh,v=new Fe,A=new Fe,w=new Fe,T=new Fe,C=new Fe,b=new Fe,M=new I,U=new I,L=new I,F=new Je,N=new Ye,Q=new Ye,V=[],le=new r1,Z=document.createElementNS("http://www.w3.org/2000/svg","svg");this.domElement=Z,this.autoClear=!0,this.sortObjects=!0,this.sortElements=!0,this.overdraw=.5,this.outputColorSpace=$t,this.info={render:{vertices:0,faces:0}},this.setQuality=function(se){switch(se){case"high":p=1;break;case"low":p=0;break}},this.setClearColor=function(se){b.set(se)},this.setPixelRatio=function(){},this.setSize=function(se,ae){i=se,r=ae,o=i/2,a=r/2,Z.setAttribute("viewBox",-o+" "+-a+" "+i+" "+r),Z.setAttribute("width",i),Z.setAttribute("height",r),x.min.set(-o,-a),x.max.set(o,a)},this.getSize=function(){return{width:i,height:r}},this.setPrecision=function(se){d=se};function te(){for(f=0;Z.childNodes.length>0;)Z.removeChild(Z.childNodes[0])}function K(se){return d!==null?se.toFixed(d):se}this.clear=function(){te(),Z.style.backgroundColor=b.getStyle(m.outputColorSpace)},this.render=function(se,ae){if(!(ae instanceof uo)){console.error("THREE.SVGRenderer.render: camera is not an instance of Camera.");return}const B=se.background;B&&B.isColor?(te(),Z.style.backgroundColor=B.getStyle(m.outputColorSpace)):this.autoClear===!0&&this.clear(),m.info.render.vertices=0,m.info.render.faces=0,N.copy(ae.matrixWorldInverse),Q.multiplyMatrices(ae.projectionMatrix,N),e=le.projectScene(se,ae,this.sortObjects,this.sortElements),t=e.elements,n=e.lights,F.getNormalMatrix(ae.matrixWorldInverse),O(n),_="",g="";for(let ie=0,R=t.length;ie<R;ie++){const oe=t[ie],$=oe.material;if(!($===void 0||$.opacity===0)){if(y.makeEmpty(),oe instanceof Gm)l=oe,l.x*=o,l.y*=-a,ue(l,oe,$);else if(oe instanceof Vm)l=oe.v1,c=oe.v2,l.positionScreen.x*=o,l.positionScreen.y*=-a,c.positionScreen.x*=o,c.positionScreen.y*=-a,y.setFromPoints([l.positionScreen,c.positionScreen]),x.intersectsBox(y)===!0&&k(l,c,$);else if(oe instanceof zm){if(l=oe.v1,c=oe.v2,h=oe.v3,l.positionScreen.z<-1||l.positionScreen.z>1||c.positionScreen.z<-1||c.positionScreen.z>1||h.positionScreen.z<-1||h.positionScreen.z>1)continue;l.positionScreen.x*=o,l.positionScreen.y*=-a,c.positionScreen.x*=o,c.positionScreen.y*=-a,h.positionScreen.x*=o,h.positionScreen.y*=-a,this.overdraw>0&&(ce(l.positionScreen,c.positionScreen,this.overdraw),ce(c.positionScreen,h.positionScreen,this.overdraw),ce(h.positionScreen,l.positionScreen,this.overdraw)),y.setFromPoints([l.positionScreen,c.positionScreen,h.positionScreen]),x.intersectsBox(y)===!0&&X(l,c,h,oe,$)}}}G(),se.traverseVisible(function(ie){if(ie.isSVGObject){if(M.setFromMatrixPosition(ie.matrixWorld),M.applyMatrix4(Q),M.z<-1||M.z>1)return;const R=M.x*o,oe=-M.y*a,$=ie.node;$.setAttribute("transform","translate("+R+","+oe+")"),Z.appendChild($)}})};function O(se){w.setRGB(0,0,0),T.setRGB(0,0,0),C.setRGB(0,0,0);for(let ae=0,B=se.length;ae<B;ae++){const ie=se[ae],R=ie.color;ie.isAmbientLight?(w.r+=R.r,w.g+=R.g,w.b+=R.b):ie.isDirectionalLight?(T.r+=R.r,T.g+=R.g,T.b+=R.b):ie.isPointLight&&(C.r+=R.r,C.g+=R.g,C.b+=R.b)}}function J(se,ae,B,ie){for(let R=0,oe=se.length;R<oe;R++){const $=se[R],me=$.color;if($.isDirectionalLight){const ee=M.setFromMatrixPosition($.matrixWorld).normalize();let de=B.dot(ee);if(de<=0)continue;de*=$.intensity,ie.r+=me.r*de,ie.g+=me.g*de,ie.b+=me.b*de}else if($.isPointLight){const ee=M.setFromMatrixPosition($.matrixWorld);let de=B.dot(M.subVectors(ee,ae).normalize());if(de<=0||(de*=$.distance==0?1:1-Math.min(ae.distanceTo(ee)/$.distance,1),de==0))continue;de*=$.intensity,ie.r+=me.r*de,ie.g+=me.g*de,ie.b+=me.b*de}}}function ue(se,ae,B){let ie=ae.scale.x*o,R=ae.scale.y*a;B.isPointsMaterial&&(ie*=B.size,R*=B.size);const oe="M"+K(se.x-ie*.5)+","+K(se.y-R*.5)+"h"+K(ie)+"v"+K(R)+"h"+K(-ie)+"z";let $="";(B.isSpriteMaterial||B.isPointsMaterial)&&($="fill:"+B.color.getStyle(m.outputColorSpace)+";fill-opacity:"+B.opacity),j($,oe)}function k(se,ae,B){const ie="M"+K(se.positionScreen.x)+","+K(se.positionScreen.y)+"L"+K(ae.positionScreen.x)+","+K(ae.positionScreen.y);if(B.isLineBasicMaterial){let R="fill:none;stroke:"+B.color.getStyle(m.outputColorSpace)+";stroke-opacity:"+B.opacity+";stroke-width:"+B.linewidth+";stroke-linecap:"+B.linecap;B.isLineDashedMaterial&&(R=R+";stroke-dasharray:"+B.dashSize+","+B.gapSize),j(R,ie)}}function X(se,ae,B,ie,R){m.info.render.vertices+=3,m.info.render.faces++;const oe="M"+K(se.positionScreen.x)+","+K(se.positionScreen.y)+"L"+K(ae.positionScreen.x)+","+K(ae.positionScreen.y)+"L"+K(B.positionScreen.x)+","+K(B.positionScreen.y)+"z";let $="";R.isMeshBasicMaterial?(v.copy(R.color),R.vertexColors&&v.multiply(ie.color)):R.isMeshLambertMaterial||R.isMeshPhongMaterial||R.isMeshStandardMaterial?(A.copy(R.color),R.vertexColors&&A.multiply(ie.color),v.copy(w),U.copy(se.positionWorld).add(ae.positionWorld).add(B.positionWorld).divideScalar(3),J(n,U,ie.normalModel,v),v.multiply(A).add(R.emissive)):R.isMeshNormalMaterial&&(L.copy(ie.normalModel).applyMatrix3(F).normalize(),v.setRGB(L.x,L.y,L.z).multiplyScalar(.5).addScalar(.5)),R.wireframe?$="fill:none;stroke:"+v.getStyle(m.outputColorSpace)+";stroke-opacity:"+R.opacity+";stroke-width:"+R.wireframeLinewidth+";stroke-linecap:"+R.wireframeLinecap+";stroke-linejoin:"+R.wireframeLinejoin:$="fill:"+v.getStyle(m.outputColorSpace)+";fill-opacity:"+R.opacity,j($,oe)}function ce(se,ae,B){let ie=ae.x-se.x,R=ae.y-se.y;const oe=ie*ie+R*R;if(oe===0)return;const $=B/Math.sqrt(oe);ie*=$,R*=$,ae.x+=ie,ae.y+=R,se.x-=ie,se.y-=R}function j(se,ae){g===se?_+=ae:(G(),g=se,_=ae)}function G(){_&&(u=pe(f++),u.setAttribute("d",_),u.setAttribute("style",g),Z.appendChild(u)),_="",g=""}function pe(se){return V[se]==null&&(V[se]=document.createElementNS("http://www.w3.org/2000/svg","path"),p==0&&V[se].setAttribute("shape-rendering","crispEdges")),V[se]}}}const wd={type:"change"},hu={type:"start"},Hm={type:"end"},Ma=new Di,Ed=new Yn,s1=Math.cos(70*Nh.DEG2RAD),Pt=new I,un=2*Math.PI,pt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},$c=1e-6;class T1 extends vm{constructor(e,t=null){super(e,t),this.state=pt.NONE,this.enabled=!0,this.target=new I,this.cursor=new I,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:xn.ROTATE,MIDDLE:xn.DOLLY,RIGHT:xn.PAN},this.touches={ONE:Mn.ROTATE,TWO:Mn.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new I,this._lastQuaternion=new Ot,this._lastTargetPosition=new I,this._quat=new Ot().setFromUnitVectors(e.up,new I(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new ao,this._sphericalDelta=new ao,this._scale=1,this._panOffset=new I,this._rotateStart=new Me,this._rotateEnd=new Me,this._rotateDelta=new Me,this._panStart=new Me,this._panEnd=new Me,this._panDelta=new Me,this._dollyStart=new Me,this._dollyEnd=new Me,this._dollyDelta=new Me,this._dollyDirection=new I,this._mouse=new Me,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=a1.bind(this),this._onPointerDown=o1.bind(this),this._onPointerUp=l1.bind(this),this._onContextMenu=m1.bind(this),this._onMouseWheel=u1.bind(this),this._onKeyDown=f1.bind(this),this._onTouchStart=d1.bind(this),this._onTouchMove=p1.bind(this),this._onMouseDown=c1.bind(this),this._onMouseMove=h1.bind(this),this._interceptControlDown=g1.bind(this),this._interceptControlUp=_1.bind(this),this.domElement!==null&&this.connect(),this.update()}connect(){this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(wd),this.update(),this.state=pt.NONE}update(e=null){const t=this.object.position;Pt.copy(t).sub(this.target),Pt.applyQuaternion(this._quat),this._spherical.setFromVector3(Pt),this.autoRotate&&this.state===pt.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,i=this.maxAzimuthAngle;isFinite(n)&&isFinite(i)&&(n<-Math.PI?n+=un:n>Math.PI&&(n-=un),i<-Math.PI?i+=un:i>Math.PI&&(i-=un),n<=i?this._spherical.theta=Math.max(n,Math.min(i,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+i)/2?Math.max(n,this._spherical.theta):Math.min(i,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if(Pt.setFromSpherical(this._spherical),Pt.applyQuaternion(this._quatInverse),t.copy(this.target).add(Pt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){const a=Pt.length();o=this._clampDistance(a*this._scale);const l=a-o;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){const a=new I(this._mouse.x,this._mouse.y,0);a.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;const c=new I(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(a),this.object.updateMatrixWorld(),o=Pt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(Ma.origin.copy(this.object.position),Ma.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Ma.direction))<s1?this.object.lookAt(this.target):(Ed.setFromNormalAndCoplanarPoint(this.object.up,this.target),Ma.intersectPlane(Ed,this.target))))}else if(this.object.isOrthographicCamera){const o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>$c||8*(1-this._lastQuaternion.dot(this.object.quaternion))>$c||this._lastTargetPosition.distanceToSquared(this.target)>$c?(this.dispatchEvent(wd),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?un/60*this.autoRotateSpeed*e:un/60/60*this.autoRotateSpeed}_getZoomScale(e){const t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){Pt.setFromMatrixColumn(t,0),Pt.multiplyScalar(-e),this._panOffset.add(Pt)}_panUp(e,t){this.screenSpacePanning===!0?Pt.setFromMatrixColumn(t,1):(Pt.setFromMatrixColumn(t,0),Pt.crossVectors(this.object.up,Pt)),Pt.multiplyScalar(e),this._panOffset.add(Pt)}_pan(e,t){const n=this.domElement;if(this.object.isPerspectiveCamera){const i=this.object.position;Pt.copy(i).sub(this.target);let r=Pt.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/n.clientHeight,this.object.matrix),this._panUp(2*t*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const n=this.domElement.getBoundingClientRect(),i=e-n.left,r=t-n.top,o=n.width,a=n.height;this._mouse.x=i/o*2-1,this._mouse.y=-(r/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(un*this._rotateDelta.x/t.clientHeight),this._rotateUp(un*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(un*this.rotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-un*this.rotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(un*this.rotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-un*this.rotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),i=.5*(e.pageY+t.y);this._rotateStart.set(n,i)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),i=.5*(e.pageY+t.y);this._panStart.set(n,i)}}_handleTouchStartDolly(e){const t=this._getSecondPointerPosition(e),n=e.pageX-t.x,i=e.pageY-t.y,r=Math.sqrt(n*n+i*i);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._rotateEnd.set(i,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(un*this._rotateDelta.x/t.clientHeight),this._rotateUp(un*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),i=.5*(e.pageY+t.y);this._panEnd.set(n,i)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const t=this._getSecondPointerPosition(e),n=e.pageX-t.x,i=e.pageY-t.y,r=Math.sqrt(n*n+i*i);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const o=(e.pageX+t.x)*.5,a=(e.pageY+t.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new Me,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){const t=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}}function o1(s){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(s.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(s)&&(this._addPointer(s),s.pointerType==="touch"?this._onTouchStart(s):this._onMouseDown(s)))}function a1(s){this.enabled!==!1&&(s.pointerType==="touch"?this._onTouchMove(s):this._onMouseMove(s))}function l1(s){switch(this._removePointer(s),this._pointers.length){case 0:this.domElement.releasePointerCapture(s.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Hm),this.state=pt.NONE;break;case 1:const e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function c1(s){let e;switch(s.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case xn.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(s),this.state=pt.DOLLY;break;case xn.ROTATE:if(s.ctrlKey||s.metaKey||s.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(s),this.state=pt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(s),this.state=pt.ROTATE}break;case xn.PAN:if(s.ctrlKey||s.metaKey||s.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(s),this.state=pt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(s),this.state=pt.PAN}break;default:this.state=pt.NONE}this.state!==pt.NONE&&this.dispatchEvent(hu)}function h1(s){switch(this.state){case pt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(s);break;case pt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(s);break;case pt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(s);break}}function u1(s){this.enabled===!1||this.enableZoom===!1||this.state!==pt.NONE||(s.preventDefault(),this.dispatchEvent(hu),this._handleMouseWheel(this._customWheelEvent(s)),this.dispatchEvent(Hm))}function f1(s){this.enabled!==!1&&this._handleKeyDown(s)}function d1(s){switch(this._trackPointer(s),this._pointers.length){case 1:switch(this.touches.ONE){case Mn.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(s),this.state=pt.TOUCH_ROTATE;break;case Mn.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(s),this.state=pt.TOUCH_PAN;break;default:this.state=pt.NONE}break;case 2:switch(this.touches.TWO){case Mn.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(s),this.state=pt.TOUCH_DOLLY_PAN;break;case Mn.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(s),this.state=pt.TOUCH_DOLLY_ROTATE;break;default:this.state=pt.NONE}break;default:this.state=pt.NONE}this.state!==pt.NONE&&this.dispatchEvent(hu)}function p1(s){switch(this._trackPointer(s),this.state){case pt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(s),this.update();break;case pt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(s),this.update();break;case pt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(s),this.update();break;case pt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(s),this.update();break;default:this.state=pt.NONE}}function m1(s){this.enabled!==!1&&s.preventDefault()}function g1(s){s.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function _1(s){s.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}export{Mh as $,Qd as A,qm as B,uo as C,Hh as D,Op as E,Ge as F,Yr as G,ts as H,Dl as I,rb as J,Cm as K,po as L,ab as M,Am as N,At as O,xn as P,Nh as Q,Je as R,Ye as S,vt as T,qp as U,Jh as V,fi as W,mo as X,M1 as Y,T1 as Z,lr as _,om as a,Cd as a0,Rt as a1,Yn as a2,yi as a3,Ot as a4,tn as a5,q_ as a6,$t as a7,E1 as a8,bp as a9,ar as aa,Nl as ab,Jn as ac,go as ad,x1 as ae,Mn as af,Ol as ag,n1 as ah,Bl as ai,zl as aj,Qn as ak,Xn as al,Me as am,I as an,tt as ao,Bn as ap,KS as aq,w1 as ar,av as b,wt as c,_r as d,rv as e,mt as f,nt as g,D0 as h,Cl as i,Up as j,fm as k,Fe as l,Pl as m,is as n,sm as o,Il as p,Cn as q,wn as r,Ul as s,pn as t,pi as u,ns as v,Ml as w,Li as x,b1 as y,rn as z};
