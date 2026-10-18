const ts=require('typescript'),fs=require('fs'),path=require('path');
const changes=[];
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
 const file=path.join(dir,entry.name);
 if(entry.isDirectory()){walk(file);continue;}
 if(!entry.name.endsWith('.tsx')||entry.name.includes('.test.'))continue;
 const source=fs.readFileSync(file,'utf8');
 const tree=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
 const edits=[];
 function visit(node){
  if(ts.isJsxElement(node)&&node.openingElement.tagName.getText(tree)==='header'&&/<h1\b/.test(node.getText(tree))){
   const extras=[];
   for(const child of node.children){
    if(ts.isJsxSelfClosingElement(child)&&/^Hero/.test(child.tagName.getText(tree))){extras.push(child);continue;}
    if(!ts.isJsxElement(child))continue;
    const tag=child.openingElement.tagName.getText(tree),text=child.getText(tree);
    const workflow=['nav','ol','ul'].includes(tag)&&/<(?:article|li)\b/.test(text)&&!/breadcrumb/i.test(child.openingElement.getText(tree));
    if(!/<h1\b/.test(text)&&(workflow||(['article','section','aside','div'].includes(tag)&&(/<h[23]\b|<svg\b|<strong\b|<output\b|<p\b/.test(text)||/<input[^>]*type="range"/s.test(text))))){extras.push(child);}
   }
   if(file.endsWith('SimultaneousLinearEquationsTargetLesson112.tsx')){
    function methods(child){if(ts.isJsxElement(child)&&child.openingElement.getText(tree).includes('className="sim112-methods"'))extras.push(child);else ts.forEachChild(child,methods);}
    for(const child of node.children)methods(child);
   }
   if(extras.length){
    for(const extra of extras)edits.push({start:extra.getStart(tree),end:extra.end,text:''});
    edits.push({start:node.end,end:node.end,text:'\n      <div className="lesson-header-content">'+extras.map(extra=>extra.getText(tree)).join('\n')+'</div>'});
   }
  }
  ts.forEachChild(node,visit);
 }
 visit(tree);
 if(edits.length){let next=source;for(const edit of edits.sort((a,b)=>b.start-a.start))next=next.slice(0,edit.start)+edit.text+next.slice(edit.end);fs.writeFileSync(file,next);changes.push({file,notes:edits.length-1});}
}}
walk('src/modules/lessons');
const previous=fs.existsSync('artifacts/lesson-header-content-reflow.json')?JSON.parse(fs.readFileSync('artifacts/lesson-header-content-reflow.json','utf8')):[];
const merged=new Map(previous.map(x=>[x.file,x]));for(const change of changes)merged.set(change.file,{...change,notes:change.notes+(merged.get(change.file)?.notes||0)});
fs.writeFileSync('artifacts/lesson-header-content-reflow.json',JSON.stringify([...merged.values()],null,2));
console.log(JSON.stringify({files:changes.length,notes:changes.reduce((sum,x)=>sum+x.notes,0)}));
