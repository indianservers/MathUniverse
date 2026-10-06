import fs from 'node:fs';
import ts from 'typescript';
for(const filename of fs.readdirSync('src/studios/algebra').filter(f=>f.endsWith('.tsx')&&!f.includes('.test.'))){
const file='src/studios/algebra/'+filename,source=fs.readFileSync(file,'utf8'),ast=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX),edits=[];
function visit(node){if(ts.isCallExpression(node)&&node.expression.getText(ast)==='useAlgebraHistory'&&node.arguments.length===1){let p=node.parent,owner='model';while(p){if(ts.isFunctionDeclaration(p)&&p.name){owner=p.name.text;break;}p=p.parent;}const separator=source.slice(node.arguments[0].end,node.arguments.end).includes(',')?'':',';edits.push({pos:node.arguments.end,text:`${separator} ${JSON.stringify(filename+':'+owner)}`});}ts.forEachChild(node,visit);}
visit(ast);let next=source;for(const e of edits.sort((a,b)=>b.pos-a.pos))next=next.slice(0,e.pos)+e.text+next.slice(e.pos);if(edits.length)fs.writeFileSync(file,next);
}
