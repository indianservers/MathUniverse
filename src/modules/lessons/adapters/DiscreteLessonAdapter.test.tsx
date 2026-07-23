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
});
