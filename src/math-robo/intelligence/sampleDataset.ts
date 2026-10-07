import type { SemanticRow } from './types';
const mode='geometry2d' as const;
const line={id:'line_1',type:'line',mode,position:[0,0],vertices:[[0,0],[6,8]],style:{color:'blue'}};
const circle={id:'circle_1',type:'circle',mode,position:[3,4],radius:5,style:{color:'red'}};
const point={id:'point_A',label:'A',type:'point',mode,position:[1,2],style:{color:'blue'}};
export const V4_SAMPLE_ROWS:SemanticRow[]=[
  {phrase:'Draw a rectangle 4 by 6',action:'CREATE',subAction:'RECTANGLE',mode,parameters:{width:4,height:6}},
  {phrase:'Draw a circle of radius 5',action:'CREATE',subAction:'CIRCLE',mode,parameters:{radius:5}},
  {phrase:'What is the midpoint of that line?',action:'FIND',subAction:'MIDPOINT',mode:'graph2d',parameters:{},target:{type:'line',index:-1},context:{objects:[{...line,mode:'graph2d'}],lastReferenced:'line_1'}},
  {phrase:'Draw a perpendicular line through the midpoint',action:'CONSTRUCT',subAction:'PERPENDICULAR',mode,parameters:{through:'midpoint'},target:{type:'line',index:-1},context:{objects:[line],lastReferenced:'line_1'}},
  {phrase:'Move the triangle 3 units right and 2 units up',action:'MOVE',subAction:'OBJECT',mode,parameters:{vector:[3,2]},target:{type:'triangle'},context:{objects:[{id:'triangle_1',type:'triangle',mode,position:[0,0],vertices:[[0,0],[4,0],[2,3]],style:{color:'green'}}],lastReferenced:'triangle_1'}},
  {phrase:'Reflect the shape across the y-axis',action:'REFLECT',subAction:'Y_AXIS',mode,parameters:{},target:'lastReferenced',context:{objects:[circle],lastReferenced:'circle_1'}},
  {phrase:'Find where these two lines intersect',action:'FIND',subAction:'INTERSECTION',mode:'graph2d',parameters:{multiple:true},context:{objects:[{...line,mode:'graph2d'},{...line,id:'line_2',mode:'graph2d',position:[0,8],vertices:[[0,8],[8,0]]}],selected:['line_1','line_2']}},
  {phrase:'Which circle is larger?',action:'COMPARE',subAction:'SIZE',mode,parameters:{multiple:true},context:{objects:[circle,{...circle,id:'circle_2',radius:2}],selected:['circle_1','circle_2']}},
  {phrase:'Is point A inside the circle?',action:'CHECK',subAction:'POINT_INSIDE',mode,parameters:{multiple:true},context:{objects:[point,circle],selected:['point_A'],lastReferenced:'point_A'}},
  {phrase:'Rotate the square by 90 degrees',action:'ROTATE',subAction:'OBJECT',mode,parameters:{angle:90,axis:'z'},target:{type:'square'},context:{objects:[{id:'square_1',type:'square',mode,position:[0,0],parameters:{width:4,height:4},style:{color:'blue'}}],lastReferenced:'square_1'}},
  {phrase:'Plot y=x^2',action:'PLOT',subAction:'FUNCTION',mode:'graph2d',parameters:{expression:'x^2'}},
  {phrase:'Create a sphere radius 3',action:'CREATE',subAction:'SPHERE',mode:'geometry3d',parameters:{radius:3}},
  {phrase:'Move it up 5 units',action:'MOVE',subAction:'OBJECT',mode:'geometry3d',parameters:{vector:[0,5,0]},target:'lastReferenced',context:{objects:[{id:'sphere_1',type:'sphere',mode:'geometry3d',position:[0,0,0],radius:3,style:{color:'blue'}}],lastReferenced:'sphere_1'}},
  {phrase:'Plot z=sin(x)*cos(y)',action:'PLOT',subAction:'SURFACE_3D',mode:'graph3d',parameters:{expression:'sin(x)*cos(y)'}},
  {phrase:'Find its volume',action:'FIND',subAction:'VOLUME',mode:'geometry3d',parameters:{},target:'lastReferenced',context:{objects:[{id:'sphere_1',type:'sphere',mode:'geometry3d',position:[0,0,0],radius:3,style:{color:'blue'}}],lastReferenced:'sphere_1'}},
];
