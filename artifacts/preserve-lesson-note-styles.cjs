const fs=require('fs'),ts=require('typescript');
let changed=0;
for(const {file} of JSON.parse(fs.readFileSync('artifacts/lesson-header-content-reflow.json','utf8'))){
 const source=fs.readFileSync(file,'utf8'),tree=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX),edits=[];
 function visit(node){
  if(ts.isJsxElement(node)){
   const attr=node.openingElement.attributes.properties.find(a=>ts.isJsxAttribute(a)&&a.name.getText(tree)==='className');
   if(attr?.initializer&&ts.isStringLiteral(attr.initializer)&&attr.initializer.text==='lesson-header-content'){
    const siblings=node.parent.children||[],index=siblings.indexOf(node);
    const header=siblings.slice(0,index).reverse().find(s=>ts.isJsxElement(s));
    if(header&&header.openingElement.tagName.getText(tree)==='header'){
     const h=header.openingElement.attributes.properties.find(a=>ts.isJsxAttribute(a)&&a.name.getText(tree)==='className');
     if(h?.initializer&&ts.isStringLiteral(h.initializer)){
      const names=h.initializer.text.split(/\s+/).filter(x=>/-(hero|header|intro)$/.test(x));
      if(names.length)edits.push({start:attr.initializer.getStart(tree),end:attr.initializer.end,text:JSON.stringify('lesson-header-content '+names.join(' '))});
     }
    }
   }
  }
  ts.forEachChild(node,visit);
 }
 visit(tree);
 if(edits.length){let next=source;for(const e of edits.sort((a,b)=>b.start-a.start))next=next.slice(0,e.start)+e.text+next.slice(e.end);fs.writeFileSync(file,next);changed++;}
}
console.log(JSON.stringify({preservedNoteStylesIn:changed}));
