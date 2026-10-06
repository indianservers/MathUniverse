import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
const roots = ['src/studios'];
const files = [];
function walk(dir) { for (const entry of fs.readdirSync(dir, {withFileTypes:true})) { const file=path.join(dir,entry.name); if(entry.isDirectory())walk(file); else if(file.endsWith('.tsx') && !/test|Chrome|Heading|Provider|Tools|Home|Session|Artwork|Catalog|Theory|studioLabKit|MockupStudioApp/i.test(file))files.push(file); } }
roots.forEach(walk);
for(const entry of fs.readdirSync('src/pages'))if(/^(Calculus|AdvancedConceptStudios|NumberSystems|AlgebraicStructuresStudio).*\.tsx$/.test(entry)&&!entry.includes('.test.'))files.push(path.join('src/pages',entry));
let count=0;
for(const file of files){
  const source=fs.readFileSync(file,'utf8');
  if(source.includes('useStudioState'))continue;
  const ast=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
  const edits=[];
  function visit(node){
    if(ts.isVariableDeclaration(node)&&ts.isArrayBindingPattern(node.name)&&node.initializer&&ts.isCallExpression(node.initializer)&&node.initializer.expression.getText(ast)==='useState'){
      const name=node.name.elements[0]?.name?.getText(ast);
      let ancestor=node.parent, owner='model';
      while(ancestor){ if(ts.isFunctionDeclaration(ancestor)&&ancestor.name){owner=ancestor.name.text;break;} ancestor=ancestor.parent; }
      if(name&&!/^(answer|status|ok|helpOpen|settingsOpen|panel|search|query|activeTab|hover|dragging|drag|toast|copied|open|tab|mode|show)/i.test(name)&&!/Challenge|Help|Sidebar|Search/i.test(owner)){
        const call=node.initializer;
        edits.push({start:call.expression.getStart(ast),end:call.expression.end,text:'useStudioState'});
        const insertion=call.arguments.pos;
        edits.push({start:insertion,end:insertion,text:JSON.stringify(`${path.basename(file,'.tsx')}:${owner}:${name}`)+(call.arguments.length?', ':'')});
      }
    }
    ts.forEachChild(node,visit);
  }
  visit(ast);
  if(!edits.length)continue;
  let result=source;
  for(const edit of edits.sort((a,b)=>b.start-a.start))result=result.slice(0,edit.start)+edit.text+result.slice(edit.end);
  let relative=path.relative(path.dirname(file),'src/studios/phase1/StudioModelProvider').replaceAll('\\','/');if(!relative.startsWith('.'))relative='./'+relative;
  result=`import { useStudioState } from ${JSON.stringify(relative)};\n`+result;
  // Keep useState only where a native local UI state remains.
  if(!/\buseState(?:<[^\n]+?>)?\s*\(/.test(result))result=result.replace(/\buseState\s*,\s*/g,'').replace(/,\s*useState\b/g,'');
  fs.writeFileSync(file,result); count+=edits.length/2;
}
console.log(`Connected ${count} model inputs across ${files.length} inspected studio components.`);
