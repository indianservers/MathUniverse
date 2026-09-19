/* Math Universe embed widget: ThreeDGraph (threedgraph.js)
 * Usage: ThreeDGraph.embed(element, { objects:[{type,x,y,size,...}] })
 */
(function(root){
"use strict";
var KIND="threedgraph";
var API="ThreeDGraph";

var NS = "http://www.w3.org/2000/svg";
var SAFE = /^(?:[0-9+\-*/^%.,() \t]|x|y|z|pi|e|sin|cos|tan|abs|sqrt|exp|log|pow|min|max)+$/i;
function isKind(v){ return v==="twodgraph"||v==="twodgeometry"||v==="threedgraph"||v==="threedgeometry"; }
function num(v){ var n=Number(v); return isFinite(n)?n:undefined; }
function defaults(kind){
  if(kind==="twodgeometry") return {kind:kind,version:1,title:"2D geometry",view:{width:640,height:400,xmin:-2,xmax:8,ymin:-2,ymax:6,showGrid:true,background:"#fffdf8"},objects:[{id:"A",type:"point",x:0,y:0,size:7,color:"#1d4ed8",label:"A"},{id:"B",type:"point",x:5,y:0,size:7,color:"#1d4ed8",label:"B"},{id:"C",type:"point",x:1.6,y:3.4,size:7,color:"#1d4ed8",label:"C"},{id:"ab",type:"segment",x:0,y:0,x2:5,y2:0,color:"#0f172a",size:2},{id:"circ",type:"circle",x:2.5,y:1.1,radius:1.1,color:"#7c3aed",size:2}]};
  if(kind==="threedgraph") return {kind:kind,version:1,title:"3D graph",view:{width:640,height:420,xmin:-2,xmax:2,ymin:-2,ymax:2,yaw:.7,pitch:.45,distance:8,background:"#07111f"},objects:[{id:"s1",type:"surface",expression:"x^2 + y^2",color:"#38bdf8",label:"z = x^2+y^2"}]};
  if(kind==="threedgeometry") return {kind:kind,version:1,title:"3D geometry",view:{width:640,height:420,yaw:.6,pitch:.4,distance:9,background:"#0b1220"},objects:[{id:"box",type:"box",x:-.8,y:0,z:0,width:1.6,height:1.2,depth:1.6,color:"#22d3ee"},{id:"sph",type:"sphere",x:1.6,y:.4,z:.2,radius:.7,color:"#a78bfa"}]};
  return {kind:kind,version:1,title:"2D graph",view:{width:640,height:400,xmin:-6,xmax:6,ymin:-4,ymax:4,showGrid:true,background:"#f8fbff"},objects:[{id:"f1",type:"function",expression:"x^2",color:"#2563eb",size:2,label:"y=x^2"},{id:"p1",type:"point",x:1,y:1,size:6,color:"#0f766e",label:"(1,1)"}]};
}
function normalize(input, kind){
  var raw = input && typeof input==="object" ? input : {};
  var k = isKind(String(raw.kind||kind)) ? raw.kind : kind;
  var base = defaults(k);
  var objects = Array.isArray(raw.objects) ? raw.objects.map(function(item,i){
    item = item||{};
    return {id:String(item.id||("obj-"+(i+1))),type:String(item.type||"point"),label:item.label,color:item.color,fill:item.fill,size:num(item.size),width:num(item.width),height:num(item.height),depth:num(item.depth),radius:num(item.radius),x:num(item.x),y:num(item.y),z:num(item.z),x2:num(item.x2),y2:num(item.y2),z2:num(item.z2),expression:item.expression?String(item.expression):undefined,points:Array.isArray(item.points)?item.points:undefined,visible:item.visible!==false};
  }) : base.objects;
  return {kind:k,version:1,title:raw.title||base.title,view:Object.assign({},base.view,raw.view||{}),objects:objects};
}
function evalExpr(expr, vars){
  var source = String(expr||"").trim().toLowerCase().replace(/\^/g,"**");
  if(!source || !SAFE.test(source)) return NaN;
  try{
    var fn = new Function("sin","cos","tan","abs","sqrt","exp","log","pow","min","max","pi","e","x","y","z","\"use strict\";return ("+source+");");
    var v = Number(fn(Math.sin,Math.cos,Math.tan,Math.abs,Math.sqrt,Math.exp,Math.log,Math.pow,Math.min,Math.max,Math.PI,Math.E,vars.x||0,vars.y||0,vars.z||0));
    return isFinite(v)?v:NaN;
  }catch(e){ return NaN; }
}
function el(name, attrs, parent){
  var node = document.createElementNS(NS, name);
  Object.keys(attrs).forEach(function(k){ node.setAttribute(k, String(attrs[k])); });
  if(parent) parent.appendChild(node);
  return node;
}
function map2d(scene,x,y){
  var v=scene.view,w=v.width||640,h=v.height||400,xmin=v.xmin||-6,xmax=v.xmax||6,ymin=v.ymin||-4,ymax=v.ymax||4;
  return {x:((x-xmin)/(xmax-xmin))*w, y:h-((y-ymin)/(ymax-ymin))*h};
}
function project(scene,x,y,z){
  var v=scene.view,yaw=v.yaw||.7,pitch=v.pitch||.4,dist=v.distance||8;
  var cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);
  var x1=x*cy-z*sy,z1=x*sy+z*cy,y1=y*cp-z1*sp,z2=y*sp+z1*cp,f=dist/Math.max(.4,dist+z2);
  return {x:(v.width||640)/2+x1*f*70,y:(v.height||420)/2-y1*f*70};
}
function grid(svg,scene){
  if(scene.view.showGrid===false) return;
  var xmin=scene.view.xmin||-6,xmax=scene.view.xmax||6,ymin=scene.view.ymin||-4,ymax=scene.view.ymax||4,x,y,a,b;
  for(x=Math.ceil(xmin);x<=xmax;x++){ a=map2d(scene,x,ymin); b=map2d(scene,x,ymax); el("line",{x1:a.x,y1:a.y,x2:b.x,y2:b.y,stroke:"#d7e4f2","stroke-width":x===0?1.6:1},svg); }
  for(y=Math.ceil(ymin);y<=ymax;y++){ a=map2d(scene,xmin,y); b=map2d(scene,xmax,y); el("line",{x1:a.x,y1:a.y,x2:b.x,y2:b.y,stroke:"#d7e4f2","stroke-width":y===0?1.6:1},svg); }
}
function drawFn(svg,scene,obj){
  var xmin=scene.view.xmin||-6,xmax=scene.view.xmax||6,parts=[],i,x,y,p;
  for(i=0;i<=180;i++){ x=xmin+(i/180)*(xmax-xmin); y=evalExpr(obj.expression||"x",{x:x,y:0,z:0}); if(!isFinite(y)) continue; p=map2d(scene,x,y); parts.push((parts.length?"L":"M")+p.x.toFixed(1)+","+p.y.toFixed(1)); }
  if(parts.length) el("path",{d:parts.join(" "),fill:"none",stroke:obj.color||"#2563eb","stroke-width":obj.size||2},svg);
}
function drawSurface(svg,scene,obj){
  var xmin=scene.view.xmin||-2,xmax=scene.view.xmax||2,ymin=scene.view.ymin||-2,ymax=scene.view.ymax||2,n=12,i,j,x,y,z,p,row;
  for(i=0;i<=n;i++){ row=[]; y=ymin+(i/n)*(ymax-ymin); for(j=0;j<=n;j++){ x=xmin+(j/n)*(xmax-xmin); z=evalExpr(obj.expression||"x^2 + y^2",{x:x,y:y,z:0}); p=project(scene,x,isFinite(z)?z*0.35:0,y); row.push((row.length?"L":"M")+p.x.toFixed(1)+","+p.y.toFixed(1)); } el("path",{d:row.join(" "),fill:"none",stroke:obj.color||"#38bdf8","stroke-width":1,opacity:.85},svg); }
}
function drawBox(svg,scene,obj){
  var w=(obj.width||1)/2,h=(obj.height||1)/2,d=(obj.depth||1)/2,x=obj.x||0,y=obj.y||0,z=obj.z||0;
  var c=[[x-w,y-h,z-d],[x+w,y-h,z-d],[x+w,y+h,z-d],[x-w,y+h,z-d],[x-w,y-h,z+d],[x+w,y-h,z+d],[x+w,y+h,z+d],[x-w,y+h,z+d]].map(function(p){return project(scene,p[0],p[1],p[2]);});
  [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]].forEach(function(e){ el("line",{x1:c[e[0]].x,y1:c[e[0]].y,x2:c[e[1]].x,y2:c[e[1]].y,stroke:obj.color||"#22d3ee","stroke-width":obj.size||2},svg); });
}
function drawObj(svg,scene,obj){
  if(obj.visible===false) return;
  var t=obj.type,p,a,b,c,edge,d;
  if(t==="function") return drawFn(svg,scene,obj);
  if(t==="surface") return drawSurface(svg,scene,obj);
  if(t==="box") return drawBox(svg,scene,obj);
  if(t==="sphere"){ p=project(scene,obj.x||0,obj.y||0,obj.z||0); el("circle",{cx:p.x,cy:p.y,r:(obj.radius||.7)*42,fill:"transparent",stroke:obj.color||"#a78bfa","stroke-width":2},svg); return; }
  if(t==="circle"){ c=map2d(scene,obj.x||0,obj.y||0); edge=map2d(scene,(obj.x||0)+(obj.radius||1),obj.y||0); el("circle",{cx:c.x,cy:c.y,r:Math.abs(edge.x-c.x),fill:obj.fill||"none",stroke:obj.color||"#7c3aed","stroke-width":obj.size||2},svg); return; }
  if(t==="polygon"&&obj.points){ d=obj.points.map(function(row,i){ p=map2d(scene,row[0],row[1]); return (i?"L":"M")+p.x+","+p.y; }).join(" ")+" Z"; el("path",{d:d,fill:obj.fill||"rgba(37,99,235,.12)",stroke:obj.color||"#2563eb","stroke-width":obj.size||2},svg); return; }
  if(t==="segment"||t==="line"){
    if(String(scene.kind).indexOf("three")===0){ a=project(scene,obj.x||0,obj.y||0,obj.z||0); b=project(scene,obj.x2||1,obj.y2||1,obj.z2||1); }
    else { a=map2d(scene,obj.x||0,obj.y||0); b=map2d(scene,obj.x2||1,obj.y2||1); }
    el("line",{x1:a.x,y1:a.y,x2:b.x,y2:b.y,stroke:obj.color||"#0f172a","stroke-width":obj.size||2},svg); return;
  }
  p = String(scene.kind).indexOf("three")===0 ? project(scene,obj.x||0,obj.y||0,obj.z||0) : map2d(scene,obj.x||0,obj.y||0);
  el("circle",{cx:p.x,cy:p.y,r:obj.size||5,fill:obj.color||"#0f766e"},svg);
  if(obj.label){ var tx=el("text",{x:p.x+8,y:p.y-8,fill:obj.color||"#0f172a","font-size":12},svg); tx.textContent=obj.label; }
}
function render(container, scene){
  container.innerHTML="";
  var w=scene.view.width||640,h=scene.view.height||400;
  container.style.position="relative"; container.style.width="100%"; container.style.height="100%";
  var svg=el("svg",{viewBox:"0 0 "+w+" "+h,width:"100%",height:"100%",role:"img","aria-label":scene.title||scene.kind});
  svg.style.display="block"; svg.style.background=scene.view.background||"#fff"; svg.style.borderRadius="12px";
  container.appendChild(svg);
  if(String(scene.kind).indexOf("three")!==0) grid(svg,scene);
  scene.objects.forEach(function(obj){ drawObj(svg,scene,obj); });
  return svg;
}
function decode(payload, kind){
  try{
    var json=decodeURIComponent(escape(atob(payload.replace(/-/g,"+").replace(/_/g,"/"))));
    return normalize(JSON.parse(json), kind);
  }catch(e){ return defaults(kind); }
}
function embed(target, content, kind){
  var el = typeof target==="string" ? document.querySelector(target) : target;
  if(!el) throw new Error("Math Universe embed target not found");
  var scene = normalize(content, kind);
  render(el, scene);
  return scene;
}
function autostart(kind, apiName){
  function run(){
    var nodes = document.querySelectorAll("[data-mu-embed='"+kind+"']");
    for(var i=0;i<nodes.length;i++){
      var node=nodes[i], payload=node.getAttribute("data-content")||node.getAttribute("data-c");
      var content = payload ? (payload.charAt(0)==="{" ? JSON.parse(payload) : decode(payload, kind)) : defaults(kind);
      embed(node, content, kind);
    }
    var params=new URLSearchParams(location.search);
    if((params.get("kind")||kind)===kind && document.getElementById("mu-embed-stage")){
      var c=params.get("c"); embed(document.getElementById("mu-embed-stage"), c?decode(c,kind):defaults(kind), kind);
    }
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", run); else run();
  root[apiName] = { embed:function(target,content){ return embed(target, content||defaults(kind), kind); }, defaultScene:function(){return defaults(kind);}, kind:kind };
}

autostart(KIND, API);
})(typeof window!=="undefined"?window:globalThis);
