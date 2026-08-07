import { renderToStaticMarkup } from "react-dom/server";
import { describe,expect,it,vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import DiscreteLessonAdapter from "./DiscreteLessonAdapter";

describe("discrete lesson adapter",()=>{
 it("renders every discrete preset without an unrelated fallback",()=>{
  const lessons=lessonCatalog.filter(lesson=>lesson.adapter==="discrete");
  expect(lessons).toHaveLength(35);
  for(const lesson of lessons){
   const html=renderToStaticMarkup(<DiscreteLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()}/>);
   expect(html,`lesson ${lesson.id}`).toContain(lesson.title.replace("'","&#x27;"));
   expect(html,`lesson ${lesson.id}`).not.toContain("Unsupported discrete preset");
   expect(html,`lesson ${lesson.id}`).toMatch(/button|input|select/);
  }
 });
 it("does not render shortest-path language for unrelated set concepts",()=>{
  for(const id of [582,583,584,585,586,587,588,589,590]){
   const lesson=lessonCatalog.find(candidate=>candidate.id===id)!;
   const html=renderToStaticMarkup(<DiscreteLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()}/>);
   expect(html).not.toContain("Dijkstra");
   expect(html).not.toContain("shortest distance");
  }
 });
 it("renders strengthened discrete lessons 556 through 585 with lesson-specific guidance",()=>{
  const expected=new Map([
   [556,"Fundamental Counting Principle"],
   [557,"Factorials"],
   [558,"Permutations"],
   [559,"Permutations with Repetition"],
   [560,"Circular Permutations"],
   [561,"Combinations"],
   [562,"Pascal&#x27;s Triangle"],
   [563,"Inclusion-Exclusion"],
   [564,"Pigeonhole Principle"],
   [565,"Vertex and Edge Builder"],
   [566,"Directed Graphs"],
   [567,"Weighted Graphs"],
   [568,"Degree of a Vertex"],
   [569,"Paths and Cycles"],
   [570,"Connected Components"],
   [571,"Euler Paths and Circuits"],
   [572,"Hamiltonian Paths and Cycles"],
   [573,"Trees"],
   [574,"Minimum Spanning Tree"],
   [575,"Shortest Path"],
   [577,"Bipartite Graphs"],
   [578,"Planar Graphs"],
   [579,"Network Flow"],
   [580,"Travelling Salesperson"],
   [581,"Adjacency Matrix"],
   [584,"Complement"],
   [585,"Cartesian Product"],
   [590,"Proof Methods"],
  ]);
  for(const [lessonId,snippet] of expected){
   const lesson=lessonCatalog.find(candidate=>candidate.id===lessonId)!;
   const html=renderToStaticMarkup(<DiscreteLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()}/>);
   expect(html,`lesson ${lessonId}`).toContain(snippet);
   expect(html,`lesson ${lessonId}`).not.toContain("Use the exact finite structure.");
  }
 });
});
