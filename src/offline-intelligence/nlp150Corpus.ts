import type {IntelligenceMode,VisualCommand} from './languageEngine';
export type NLPCase={id:number;category:string;request:string;seed?:string;kind?:VisualCommand['kind'];message?:string;reject?:boolean};
export function nlp150Corpus(mode:IntelligenceMode):NLPCase[] {
  const three=mode.endsWith('3d'),origin=three?'(0,0,0)':'(0,0)',end=three?'(6,8,0)':'(6,8)';
  const line=`Draw line ${origin} to ${end}`;
  const triangle=three?'Draw triangle (0,0,0) (6,0,0) (3,4,0)':'Draw triangle (0,0) (6,0) (3,4)';
  const cases:Omit<NLPCase,'id'>[]=[];
  const add=(category:string,request:string,extra:Partial<NLPCase>={})=>cases.push({category,request,...extra});
  const creations:[string,VisualCommand['kind']][]=[
    ['draw a rectangle, on '+(three?'3D':'2D')+' graph','rectangle'],['Please draw a blue rectangle 6 by 4','rectangle'],
    ['Create a square side 5','square'],['Sketch a triangle base 6 height 4','triangle'],['Draw a circle radius 3','circle'],
    ['Create an ellipse width 6 height 4','ellipse'],['Show a semicircle radius 2','semicircle'],['Add a pentagon radius 3','pentagon'],
    ['Draw a hexagon radius 2','hexagon'],['Create a heptagon radius 2','heptagon'],['Make an octagon radius 2','octagon'],
    ['Sketch a nonagon radius 2','nonagon'],['Draw a decagon radius 2','decagon'],['Create a polygon sides 5 radius 3','polygon'],
    ['Show a star radius 3','star'],['Draw a parallelogram width 6 height 3','parallelogram'],['Make a trapezoid width 5 height 3','trapezoid'],
    ['Create a rhombus width 4 height 6','rhombus'],['Add a kite width 4 height 5','kite'],['Create a rectagle 6 wide and 4 tall','rectangle'],
    ['Draw a round outline','circle'],['Sketch a round shape','circle'],['Draw a rectangular shape','rectangle'],
    ['Create a three sided shape','triangle'],['Sketch a four sided equal shape','square'],['Please draw an oval width 6 height 4','ellipse'],
    ['Draw a diamond width 5 height 3','rhombus'],['Draw a disk radius 2','circle'],['Create a trapezium width 6 height 3','trapezoid'],
    ['Can you construct a green triangle base 4 height 3?','triangle'],
  ];
  creations.forEach(([request,kind])=>add('creation',request,{kind}));
  const edits=[
    'Resize it to width 8 height 5','Scale it by 2','Double it','Halve it','Make it bigger','Make it smaller',
    'Increase its size by 25%','Reduce its size by 20%','Grow it by 10%','Shrink it by 30%',
    'Rotate it 45 degrees','Turn it 90 degrees','Rotate it 30 degrees clockwise','Rotate it 30 degrees counterclockwise',
    'Rotate it -45 degrees','Rotate it 1 radians','Move it right by 2','Move it left by 3','Move it up by 2','Move it down by 1',
    'Translate it '+(three?'(2,3,1)':'(2,3)'), 'Make it blue','Recolor it red','Color it green','Make it purple',
    'Colour it orange','Make it yellow','Make it pink','Make it white','Make it black','Make it cyan',
    'Resize it to width 5 height 2','Enlarge it by 1.5','Scale it to 150%','Reduce it by 50%',
    'Rotate the last rectangle 20 degrees','Move that rectangle right by 4','Make the previous rectangle blue',
    'Resize the rectangle width 7 height 3','Turn that rectangle 180 degrees',
  ];
  edits.forEach(request=>add('edit',request,{seed:'Create rectangle 6 by 4',kind:'rectangle',message:'Updated rectangle'}));
  const anchors=[
    'Draw another rectangle starting from the end of last drawn triangle',
    'Create a square starting from the last vertex of the last triangle',
    'Draw a triangle starting from the end of that triangle',
    'Draw a blue rectangle width 4 height 2 starting from the last vertex of the previous triangle',
    'Create a green square side 3 starting from the end of the last triangle',
    'Draw another triangle base 4 height 2 starting from the last vertex of that triangle',
    'Draw a rectangle starting from the end of last drawn line',
    'Create a square side 2 starting from the end of that line',
    'Draw a triangle base 5 height 3 starting from the end of the previous line',
    'Create another rectangle 3 by 2 starting from the end of the last line',
    'Draw a purple square side 4 starting from the last vertex of last triangle',
    'Draw a red triangle starting from the end of last triangle',
    'Create a rectangle width 8 height 3 starting from the end of previous triangle',
    'Draw another square starting from the end of last drawn triangle',
    'Draw a cyan rectangle starting from the end of that line',
    'Create a triangle starting from the last corner of the last rectangle',
    'Draw a square starting from the last corner of that rectangle',
    'Create another rectangle starting from the last corner of previous rectangle',
    'Draw a rectangle 4 by 2 starting from the end of the last triangle',
    'Create a square side 6 starting from the last vertex of the previous triangle',
  ];
  anchors.forEach(request=>add('anchor',request,{seed:/\bline\b/.test(request)?line:/corner/.test(request)?'Create rectangle 6 by 4':triangle,
    kind:/^(?:draw|create)\s+(?:another\s+|a\s+(?:green\s+|purple\s+)?|a\s+red\s+)?square/i.test(request)?'square':/^(?:draw|create)\s+(?:another\s+|a\s+(?:red\s+)?|a\s+)?triangle/i.test(request)?'triangle':'rectangle',message:'starting at'}));
  [
    'what is the mid point of that line','What is the midpoint of the last line?',
    'Find the mid-point of that segment','Tell me the midpoint of the line',
    'Where is the midpoint of the previous line?','Calculate the midpoint of that line',
    'Draw the midpoint of that line','Mark the midpoint of the line','Create a point at the midpoint of that line',
    'What is the length of that line?','Measure the length of the last segment','What is the distance along that line?',
  ].forEach(request=>add('query',request,{seed:line,kind:/^(Draw|Mark|Create)/.test(request)?'point':undefined,message:/length|distance/.test(request)?'10 units':three?'(3, 4, 0)':'(3, 4)'}));
  [
    'Draw a tangent to the last circle','Draw a tangent to that circle at angle 0 degrees',
    'Create a tangent to the circle at angle 90 degrees','Draw a tangent at angle 180 degrees to the circle',
    'Add a tangent to the previous circle at angle 270 degrees','Draw a tangent to the circle at angle 45 degrees',
    'Create a tangent to the circle at angle -45 degrees','Draw a tangent to that circle at angle 30 degrees',
    'Draw a tangent at '+(three?'(3,0,0)':'(3,0)')+' to the circle',
    'Draw a tangent to the circle at '+(three?'(0,3,0)':'(0,3)'),
    'Show a tangent to the last circle at angle 60 degrees','Draw a tangent to the circle at angle 120 degrees',
  ].forEach(request=>add('tangent',request,{seed:'Create circle radius 3',kind:'line',message:'tangent segment'}));
  const invalid:[string,string][]=[
    ['draw a tangent inside circle','cannot lie inside'],['Draw a tangent inside the last circle','cannot lie inside'],
    ['Create circle radius -2','positive'],['Draw square side 0','positive'],['Create circle radius 10001','positive'],
    ['Draw polygon sides 2','integer'],['Create polygon sides 33','integer'],['Draw polygon sides 3.5','integer'],
    ['Draw a line '+origin+' to '+origin,'distinct'],['Draw a point','coordinate'],['Draw line','distinct'],
    ['Draw tangent at '+origin+' to circle','not on the circle'],['Resize it to width -2','positive'],
    ['Rotate it 40000 degrees','finite rotation'],['Scale it by -3','positive'],['Draw line '+(three?'(0,0) to (1,1)':'(0,0,0) to (1,1,1)'),three?'three coordinates':'two coordinates'],
  ];
  invalid.forEach(([request,message])=>add('validation',request,{seed:'Create circle radius 3',message,reject:true}));
  const extras:[string,VisualCommand['kind']][]=[
    ['Create point '+origin,'point'],['Draw a red point '+end,'point'],['Draw line '+origin+' to '+end,'line'],
    ['Draw a segment '+end+' to '+origin,'line'],['Create triangle '+(three?'(0,0,0) (4,0,0) (2,3,0)':'(0,0) (4,0) (2,3)'), 'triangle'],
    ['Draw polygon '+(three?'(0,0,0) (4,0,0) (4,3,0) (0,3,0)':'(0,0) (4,0) (4,3) (0,3)'), 'polygon'],
    ['Draw circle radius 2 at '+end,'circle'],['Create rectangle width 3 height 2 centered at '+end,'rectangle'],
    ['Sketch triangle base 5 height 3 centered at '+origin,'triangle'],['Draw square side 3 at '+end,'square'],
    ['Plot '+(three?'z = x^2+y^2':'y = x^2'),'plot'],['Graph '+(three?'z = sin(x)*cos(y)':'y = sin(x)'),'plot'],
    ['Draw graph of '+(three?'z = x*y':'y = x^3-2*x'),'plot'],['Plot '+(three?'z = x+y':'y = cos(x)'),'plot'],
    ['Create graph of '+(three?'z = exp(-x^2-y^2)':'y = exp(-x^2)'),'plot'],
    ['Draw a blue circle diameter 6','circle'],['Please create a yellow rectangle 8 by 3','rectangle'],
    ['Can you draw a triangle width 7 height 5?','triangle'],['Add a regular polygon sides 8 radius 3','polygon'],['Draw a purple ellipse width 8 height 4','ellipse'],
  ];
  extras.forEach(([request,kind])=>add('coordinates/graphs',request,{kind}));
  if(cases.length!==150||new Set(cases.map(item=>item.request)).size!==150)throw new Error('The NLP corpus must contain 150 unique requests.');
  return cases.map((item,index)=>({...item,id:index+1}));
}
