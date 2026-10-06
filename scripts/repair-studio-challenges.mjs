import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
const files=[];
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,e.name);if(e.isDirectory())walk(file);else if(file.endsWith('.tsx')&&!file.includes('.test.'))files.push(file);}}
walk('src/studios');
let total=0;
for(const file of files){let source=fs.readFileSync(file,'utf8');const ast=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX),edits=[];
function visit(node){if((ts.isJsxSelfClosingElement(node)||ts.isJsxOpeningElement(node))&&node.tagName.getText(ast)==='ChallengeBox'){
const attrs=node.attributes.properties;if(!attrs.some(a=>ts.isJsxAttribute(a)&&a.name.getText(ast)==='kind')){
const expected=attrs.find(a=>ts.isJsxAttribute(a)&&a.name.getText(ast)==='expected');
const expression=expected?.initializer&&ts.isJsxExpression(expected.initializer)?expected.initializer.expression:undefined;
if(expression&&!ts.isNumericLiteral(expression)&&!(ts.isPrefixUnaryExpression(expression)&&ts.isNumericLiteral(expression.operand))){edits.push({pos:node.tagName.end,text:' kind="live"'});}
}}
ts.forEachChild(node,visit);}
visit(ast);for(const e of edits.sort((a,b)=>b.pos-a.pos))source=source.slice(0,e.pos)+e.text+source.slice(e.pos);if(edits.length){fs.writeFileSync(file,source);total+=edits.length;}}
console.log(`Marked ${total} model-derived challenges explicitly.`);
// Remove superseded statistical calculators so no alternate dispatch can revive a placeholder.
const file='src/studios/mockup/labs/RemainingStudioLabs.tsx';let source=fs.readFileSync(file,'utf8');
const ast=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const removed=['DataExplorerLab','DescriptiveLab','ExperimentsLab','CiLab','HypothesisLab','CorrelationLab','AnovaLab'];
for(const node of [...ast.statements].reverse())if(ts.isFunctionDeclaration(node)&&removed.includes(node.name?.text))source=source.slice(0,node.getFullStart())+source.slice(node.end);
for(const name of removed)source=source.replaceAll(`<${name} page={page} />`,'<StatisticsCoreLab page={page} />');
if(!source.includes('import StatisticsCoreLab'))source='import StatisticsCoreLab from "../../statistics/StatisticsCoreLabs";\n'+source;
fs.writeFileSync(file,source);
for(const file of files.filter(f=>f.endsWith('.css'))){/* stylesheet fixes are handled below */}
function fixCss(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,e.name);if(e.isDirectory())fixCss(f);else if(f.endsWith('.css')){const before=fs.readFileSync(f,'utf8'),after=before.replace(/nth-child\(2\)([bi])(?=\s|\{|,)/g,'nth-child(2) $1');if(before!==after)fs.writeFileSync(f,after);}}}
fixCss('src');
