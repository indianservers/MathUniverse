import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { getLearningTopics } from "../learningExperience";
import LearnDiscoveryPage from "./LearnDiscoveryPage";

function renderRoute(path: string) {
  return renderToStaticMarkup(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/learn/:topicSlug" element={<LearnDiscoveryPage />} />
        <Route path="/learn/:topicSlug/:subtopicSlug" element={<LearnDiscoveryPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("LearnDiscoveryPage", () => {
  it("renders every learning topic with the premium master layout and real counts", () => {
    for (const topic of getLearningTopics()) {
      const html = renderRoute(`/learn/${topic.slug}`);
      const count = topic.subtopics.reduce((sum, subtopic) => sum + subtopic.lessons.length, 0);

      const customHero = topic.slug === "calculus" ? "calculus-hero" : topic.slug === "numbers-and-arithmetic" ? "numbers-hero" : topic.slug === "functions-and-graphs" ? "functions-hero" : topic.slug === "geometry" ? "geometry-master-hero" : topic.slug === "trigonometry" ? "trig-hero" : topic.slug === "statistics-and-probability" ? "statistics-hero" : topic.slug === "vectors-and-3d-mathematics" ? "vectors3d-hero" : topic.slug === "discrete-and-applied-mathematics" ? "discrete-hero" : topic.slug === "advanced-mathematics" ? "advanced-hero" : "learn-master-hero";
      const customCountLabel = topic.slug === "calculus" || topic.slug === "numbers-and-arithmetic" || topic.slug === "functions-and-graphs" || topic.slug === "geometry" || topic.slug === "trigonometry" || topic.slug === "statistics-and-probability" || topic.slug === "vectors-and-3d-mathematics" || topic.slug === "discrete-and-applied-mathematics" || topic.slug === "advanced-mathematics";

      expect(html).toContain(customHero);
      expect(html).toContain(topic.title);
      expect(html).toContain(customCountLabel ? `${topic.subtopics.length} pathways` : `${topic.subtopics.length} subtopics`);
      expect(html).toContain(topic.slug === "statistics-and-probability" || topic.slug === "vectors-and-3d-mathematics" || topic.slug === "discrete-and-applied-mathematics" || topic.slug === "advanced-mathematics" ? `${count} lessons` : customCountLabel ? `${count} interactive lessons` : `${count} linked lessons`);
      expect(html).toContain(topic.slug === "geometry" ? "Predict. Construct. Observe. Prove." : topic.slug === "trigonometry" ? "Predict. Manipulate. Trace. Explain." : "Predict. Manipulate. Observe. Explain.");
      expect(html).not.toContain("Follow a structured route, or jump into any subtopic.");
    }
  }, 120000);

  it("renders every subtopic explorer with filters, search, and lesson cards", () => {
    for (const topic of getLearningTopics()) {
      for (const subtopic of topic.subtopics) {
        const html = renderRoute(`/learn/${topic.slug}/${subtopic.slug}`);

        expect(html).toContain("learn-explorer-hero");
        expect(html).toContain(subtopic.title);
        expect(html).toContain("Search lessons...");
        expect(html).toContain("Learning type");
        expect(html).toContain("Interaction");
        expect(html).toContain(`${subtopic.lessons.length} visual, interactive lessons`);
        if (subtopic.lessons.length > 0) {
          expect(html).toContain(subtopic.lessons[0].title);
          expect(html).toContain("learn-lesson-thumb");
          expect(html).toContain("Move pointer to manipulate preview");
          expect(html).toContain("interactive mathematical thumbnail preview");
        }
      }
    }
  }, 120000);

  it("gives Algebra subtopics distinct mathematical previews", () => {
    const algebra = getLearningTopics().find((topic) => topic.slug === "algebra");
    expect(algebra).toBeTruthy();

    const html = renderRoute("/learn/algebra");
    expect(html).toContain("(x + 2)(x + 3)");
    expect(html).toContain("2x + 4 = 10");
    expect(html).toContain("vertex");
  });
});
