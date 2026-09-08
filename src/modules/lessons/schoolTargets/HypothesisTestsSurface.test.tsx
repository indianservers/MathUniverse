import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { expect,it } from "vitest";
import { findAdvancedConceptLesson } from "../catalog/advanced/advancedConceptLessons";
import Lesson from "./HypothesisTestsTargetLesson2013";
it("renders the calculated default test and an unrevealed coin exercise",()=>{const html=renderToStaticMarkup(<MemoryRouter><Lesson lesson={findAdvancedConceptLesson("2013-hypothesis-tests")!}/></MemoryRouter>);expect(html).toContain('data-testid="advanced-mockup-0907"');expect(html).toContain("0.0455");expect(html).toContain("Decision: Reject H₀");expect(html).toContain('aria-label="Observed mean graph handle"');expect(html).toContain('aria-label="Coin predicted decision"');expect(html).toContain("Check your prediction to reveal the calculation.");expect(html).not.toContain("Correct prediction.");});
