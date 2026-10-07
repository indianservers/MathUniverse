export const FLAT_SHAPES = ['triangle','rectangle','square','circle','ellipse','semicircle','pentagon','hexagon','heptagon','octagon','nonagon','decagon','polygon','star','parallelogram','trapezoid','rhombus','kite'] as const;
export const SOLID_SHAPES = ['cube','cuboid','sphere','ellipsoid','hemisphere','cylinder','cone','frustum','torus','tube','capsule','prism','pyramid','tetrahedron','octahedron','dodecahedron','icosahedron','wedge'] as const;
export type ShapeKind = typeof FLAT_SHAPES[number] | typeof SOLID_SHAPES[number];
export const SHAPE_ALIASES:Record<string,ShapeKind> = {
  rectagle:'rectangle',rectange:'rectangle',triange:'triangle',traingle:'triangle',oval:'ellipse',disk:'circle',disc:'circle',ball:'sphere',box:'cuboid',ring:'torus',donut:'torus',doughnut:'torus',trapezium:'trapezoid',diamond:'rhombus',polyhedron:'icosahedron',
};
export const COLORS:Record<string,string>={blue:'#3b82f6',red:'#ef4444',green:'#22c55e',orange:'#f97316',purple:'#a855f7',yellow:'#eab308',cyan:'#06b6d4',pink:'#ec4899',white:'#ffffff',black:'#111827'};
