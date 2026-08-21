# Phase 5 general 3D architecture

The universal 3D layer is definition-first. `Math3DNode` records stable identity, source definition, AST references, parameters, assumptions, units, dependencies, exact/numerical representations, precision, tolerance, rendering metadata, accessibility text, status, diagnostics, provenance and serialization version. A mesh is never the sole mathematical definition.

## Surface and curve schemas

The implemented general inputs are explicit surfaces (`z=f(x,y)` plus x/y-dependent forms), parametric surfaces `r(u,v)`, implicit level surfaces `F(x,y,z)=0`, space curves `r(t)`, and vector fields. The shared safe expression parser now accepts three variables without arbitrary evaluation.

## Meshing and isosurfaces

Explicit and parametric surfaces use deterministic profile-controlled grids. Implicit surfaces use bounded sign-cell marching tetrahedra, degenerate-triangle filtering, generated normals, generation IDs, cancellation checks, and performance/balanced/high-accuracy/deterministic-export profiles. Results report bounds, resolution, triangles, estimated cell-scale error, refinement state and topology warnings.

This implementation does not yet provide a crack-free octree, screen-space refinement, worker-pool scheduling, or proof that all thin/tangential components were found. Those cases return warnings and remain `PARTIAL` in the capability registry.

## Rendering and camera

The workspace renders general meshes through React Three Fiber/Three.js with depth-tested standard material, wireframe mode, axes, grid, orbit/pan/zoom, perspective/orthographic projection, bounded device pixel ratio and no automatic motion. Camera state is separate from mathematical nodes.

## Intersections, slices and shared identities

The reference paraboloid workflow creates stable source, surface, slice, intersection, 2D, CAS and table IDs with explicit provenance. General arbitrary surface–surface and Boolean-solid intersections are not yet released.

## Coordinate systems and transformations

Cartesian/cylindrical/spherical conversions, axis-angle rotation, translation, scaling, plane reflection, composition, determinant and singular/orientation diagnostics are implemented and property-tested. User-defined globally invertible coordinates remain unsupported.

